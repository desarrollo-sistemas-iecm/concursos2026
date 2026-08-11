const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const vars = require('../config/vars');
const db = require('../config/db');
const usuariosRepository = require('../repositories/usuarios.repository');
const participantesRepository = require('../repositories/participantes.repository');
const catalogosRepository = require('../repositories/catalogos.repository');
const catalogoService = require('./catalogo.service');
const auditoriaService = require('./auditoria.service');
const mailer = require('../integrations/mail/mailer');

class AuthService {
  /**
   * Calcula la edad a partir de la fecha de nacimiento.
   */
  calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const cumpleanos = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    return edad;
  }

  /**
   * Registra a un nuevo participante, derivando su categoría y creando
   * las filas correspondientes en una sola transacción.
   */
  async registrarParticipante(datos, ip_origen = null) {
    const {
      nombre,
      apellido_pat,
      apellido_mat,
      curp,
      genero,
      fecha_nacimiento,
      correo,
      usuario,
      contrasena
    } = datos;

    // 1. Validaciones previas de existencia en BD (para dar mensajes limpios)
    const curpDup = await usuariosRepository.findByCurp(curp);
    if (curpDup) throw new Error('La CURP proporcionada ya está registrada.');

    const correoDup = await usuariosRepository.findByEmail(correo);
    if (correoDup) throw new Error('El correo electrónico ya está registrado.');

    const usuarioDup = await usuariosRepository.findByUsername(usuario);
    if (usuarioDup) throw new Error('El nombre de usuario ya está en uso.');

    // 2. Obtener convocatoria activa y validar estricta ventana de fechas de registro
    const convocatoriaActiva = await catalogosRepository.getConvocatoriaActiva();
    if (!convocatoriaActiva) {
      throw new Error('No hay ninguna convocatoria abierta actualmente.');
    }

    const ventana = catalogoService.evaluarVentanaRegistro(convocatoriaActiva);
    if (!ventana.valido) {
      throw new Error(ventana.mensaje);
    }

    const edad = this.calcularEdad(fecha_nacimiento);
    const categorias = await catalogosRepository.getCategoriasByConvocatoria(convocatoriaActiva.id_convocatoria);
    const categoriaAsignada = categorias.find(c => edad >= c.edad_min && edad <= c.edad_max);

    if (!categoriaAsignada) {
      const minEdad = categorias.length > 0 ? Math.min(...categorias.map(c => c.edad_min)) : 15;
      const maxEdad = categorias.length > 0 ? Math.max(...categorias.map(c => c.edad_max)) : 23;
      throw new Error(`La edad calculada (${edad} años) no entra en el rango permitido del concurso (${minEdad} a ${maxEdad} años).`);
    }

    // 3. Hashear la contraseña elegida por el participante
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // 4. Guardar registros mediante Transacción (solo INSERT puros, sin SELECTs dentro)
    let nuevoUsuario;
    await db.transaction(async (trx) => {
      // Crear cuenta en usuarios
      nuevoUsuario = await usuariosRepository.create({
        id_tipousuario: 1, // Participante
        nombre,
        apellido_pat,
        apellido_mat,
        curp,
        genero,
        fecha_nacimiento,
        correo,
        usuario,
        contrasena: hashedPassword,
        status: 1,
        telefono_casa: datos.telefono_casa || null,
        celular_personal: datos.celular_personal || null
      }, trx);

      // Crear registro de participante asociado a la convocatoria activa
      await participantesRepository.create({
        id_usuario: nuevoUsuario.id_usuario,
        id_convocatoria: convocatoriaActiva.id_convocatoria,
        id_categoria: categoriaAsignada.id_categoria,
        status_ensayo: 0,
        seudonimo: '',
        titulo_ensayo: '',
        obra: ''
      }, trx);
    });

    // 5. Auditoría y correo FUERA de la transacción (evita bloqueos secundarios en SQL Server)
    auditoriaService.registrarAccion(
      nuevoUsuario.id_usuario,
      'REGISTRO',
      'usuarios',
      nuevoUsuario.id_usuario,
      { id_convocatoria: convocatoriaActiva.id_convocatoria, categoria: categoriaAsignada.nombre },
      ip_origen
    ).catch(() => {});

    // 5. Correo de bienvenida y credenciales
    const nombreCompleto = `${nombre} ${apellido_pat} ${apellido_mat || ''}`.trim();
    mailer.enviarBienvenida(correo, usuario, contrasena, nombreCompleto).catch(err => {
      console.error('Error al enviar correo de bienvenida al participante:', err.message);
    });

    return {
      exito: true,
      mensaje: 'Registro exitoso. Ya puedes iniciar sesión con tus credenciales.'
    };
  }

  /**
   * Procesa el inicio de sesión y gestiona el mecanismo de sesión única
   */
  async login(usuario, contrasena, ip_origen = null) {
    // Buscar usuario por username o correo
    let user = await usuariosRepository.findByUsername(usuario);
    if (!user) {
      user = await usuariosRepository.findByEmail(usuario);
    }

    if (!user || user.status !== 1) {
      throw new Error('Credenciales incorrectas o usuario inactivo.');
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!passwordMatch) {
      throw new Error('Credenciales incorrectas o usuario inactivo.');
    }

    // Verificar restricción de periodo de acceso por fecha y rol según la convocatoria activa
    const convocatoriaActiva = await catalogosRepository.getConvocatoriaActiva();
    if (convocatoriaActiva) {
      const ventanaAcceso = catalogoService.evaluarVentanaAcceso(convocatoriaActiva, user.id_tipousuario);
      if (!ventanaAcceso.valido) {
        throw new Error(ventanaAcceso.mensaje);
      }
    }

    // Generar un nuevo session_id único (UUID) para invalidar cualquier sesión previa (sesión única)
    const session_id = crypto.randomUUID();
    await usuariosRepository.updateSessionId(user.id_usuario, session_id);

    // Generar JWT
    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        usuario: user.usuario,
        id_tipousuario: user.id_tipousuario,
        session_id
      },
      vars.jwtSecret,
      { expiresIn: '8h' }
    );

    // Auditoría
    await auditoriaService.registrarAccion(
      user.id_usuario,
      'LOGIN',
      'usuarios',
      user.id_usuario,
      { ip: ip_origen },
      ip_origen
    );

    return {
      token,
      usuario: {
        id_usuario: user.id_usuario,
        id_tipousuario: user.id_tipousuario,
        nombre: user.nombre,
        apellido_pat: user.apellido_pat,
        correo: user.correo,
        usuario: user.usuario
      }
    };
  }

  /**
   * Finaliza la sesión limpiando el session_id en BD
   */
  async logout(id_usuario, ip_origen = null) {
    await usuariosRepository.updateSessionId(id_usuario, null);
    
    await auditoriaService.registrarAccion(
      id_usuario,
      'LOGOUT',
      'usuarios',
      id_usuario,
      null,
      ip_origen
    );

    return { exito: true };
  }

  /**
   * Cierra de golpe todas las sesiones activas en la base de datos (Superadmin)
   */
  async forzarLogoutGlobal(id_superadmin, ip_origen = null) {
    await usuariosRepository.clearAllSessions();

    await auditoriaService.registrarAccion(
      id_superadmin,
      'LOGOUT_GLOBAL',
      'usuarios',
      null,
      { descripcion: 'Superadmin forzó cierre de todas las sesiones' },
      ip_origen
    );

    return { exito: true };
  }

  /**
   * Genera y guarda un token de recuperación y envía el correo con enlace y/o código.
   */
  async solicitarRecuperacionPassword(correoOUsuario, metodo = 'email', ip_origen = null, originHeader = null) {
    if (!correoOUsuario) {
      throw new Error('Debe proporcionar su usuario o correo electrónico.');
    }

    const valorLimpio = correoOUsuario.trim();
    let usuario = await usuariosRepository.findByEmail(valorLimpio);
    if (!usuario) {
      usuario = await usuariosRepository.findByUsername(valorLimpio);
    }

    if (!usuario) {
      throw new Error('No existe ninguna cuenta registrada con el usuario o correo proporcionado.');
    }

    if (usuario.status !== 1) {
      throw new Error('La cuenta especificada se encuentra inactiva o suspendida.');
    }

    // Generar Token seguro (alphanumérico de 8 caracteres)
    const token = crypto.randomBytes(4).toString('hex').toUpperCase(); // Ej: A3F82C10
    const expiracion = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos de vigencia

    await usuariosRepository.saveResetToken(usuario.id_usuario, token, expiracion);

    // Determinar la URL base de la aplicación (considerando subruta /hackaton2026/restablecer-password)
    const baseUrl = originHeader || 'http://145.0.40.48/hackaton2026';
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const urlRestablecimiento = `${cleanBaseUrl}/restablecer-password?token=${token}`;

    try {
      await mailer.enviarRecuperacionPassword(
        usuario.correo,
        usuario.usuario,
        token,
        urlRestablecimiento
      );
    } catch (mailErr) {
      console.error('[MAILER ERROR] No se pudo enviar el correo de recuperación:', mailErr.message);
    }

    await auditoriaService.registrarAccion(
      usuario.id_usuario,
      'SOLICITUD_RECUPERACION_PASSWORD',
      'usuarios',
      usuario.id_usuario,
      { metodo, token_generado: token },
      ip_origen
    );

    return {
      exito: true,
      mensaje: `Se ha enviado una instrucción a ${usuario.correo} para restablecer tu contraseña.`,
      token: token,
      correo: usuario.correo
    };
  }

  /**
   * Valida la vigencia y existencia de un token de recuperación.
   */
  async validarTokenRecuperacion(token) {
    if (!token) {
      throw new Error('El token de seguridad es requerido.');
    }

    const usuario = await usuariosRepository.findByResetToken(token.trim().toUpperCase());
    if (!usuario) {
      throw new Error('El código o token de recuperación es inválido o ha expirado.');
    }

    return {
      valido: true,
      usuario: usuario.usuario,
      correo: usuario.correo
    };
  }

  /**
   * Restablece la contraseña del usuario verificando la validez del token y las contraseñas.
   */
  async restablecerPassword(token, nuevaContrasena, confirmacionContrasena, ip_origen = null) {
    if (!token || !nuevaContrasena || !confirmacionContrasena) {
      throw new Error('Todos los campos son obligatorios.');
    }

    if (nuevaContrasena !== confirmacionContrasena) {
      throw new Error('La confirmación de contraseña no coincide con la nueva contraseña.');
    }

    // Validación de contraseña (de 8 a 10 caracteres, especiales permitidos: . , ! -)
    if (nuevaContrasena.length < 8 || nuevaContrasena.length > 10) {
      throw new Error('La contraseña debe tener entre 8 y 10 caracteres.');
    }

    const passAllowedRegex = /^[a-zA-Z0-9.,!\-]+$/;
    if (!passAllowedRegex.test(nuevaContrasena)) {
      throw new Error('La contraseña sólo permite letras, números y los caracteres especiales ( . , ! - ).');
    }

    if (!/[.,!\-]/.test(nuevaContrasena)) {
      throw new Error('La contraseña debe incluir al menos uno de los caracteres especiales permitidos ( . , ! - ).');
    }

    const tokenLimpio = token.trim().toUpperCase();
    const usuario = await usuariosRepository.findByResetToken(tokenLimpio);
    if (!usuario) {
      throw new Error('El código o token de recuperación es inválido o ha expirado. Por favor solicita uno nuevo.');
    }

    // Encriptar la nueva contraseña con bcrypt
    const contrasenaHash = await bcrypt.hash(nuevaContrasena, 10);

    // Actualizar contraseña y limpiar token en la BD
    await usuariosRepository.updatePasswordAndClearToken(usuario.id_usuario, contrasenaHash);

    await auditoriaService.registrarAccion(
      usuario.id_usuario,
      'RESTABLECER_PASSWORD_EXITO',
      'usuarios',
      usuario.id_usuario,
      { descripcion: 'Contraseña actualizada mediante token de recuperación' },
      ip_origen
    );

    return {
      exito: true,
      mensaje: 'Tu contraseña ha sido actualizada con éxito. Ya puedes iniciar sesión con tus nuevas credenciales.'
    };
  }
}

module.exports = new AuthService();
