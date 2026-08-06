const authService = require('../services/auth.service');
const sesionesSocket = require('../sockets/sesiones.socket');
const { logSession, logAction, logError, userTag } = require('../config/logger');

class AuthController {
  /**
   * Endpoint de registro de participante.
   */
  async registro(req, res, next) {
    try {
      const {
        nombre,
        apellido_pat,
        apellido_mat,
        curp,
        genero,
        fecha_nacimiento,
        correo,
        usuario,
        contrasena,
        telefono_casa,
        celular_personal
      } = req.body;

      // 1. Validación de campos obligatorios
      if (!nombre || !apellido_pat || !apellido_mat || !curp || !genero || !fecha_nacimiento || !correo || !usuario || !contrasena || !celular_personal || !telefono_casa) {
        return res.status(400).json({ error: 'Todos los campos del formulario son obligatorios.' });
      }

      // 2. Validación de nombres y apellidos (máximo 25 caracteres, sólo letras y espacios)
      const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      if (nombre.length > 25 || !nombreRegex.test(nombre)) {
        return res.status(400).json({ error: 'El nombre sólo debe contener letras y tener máximo 25 caracteres.' });
      }
      if (apellido_pat.length > 25 || !nombreRegex.test(apellido_pat)) {
        return res.status(400).json({ error: 'El apellido paterno sólo debe contener letras y tener máximo 25 caracteres.' });
      }
      if (apellido_mat.length > 25 || !nombreRegex.test(apellido_mat)) {
        return res.status(400).json({ error: 'El apellido materno sólo debe contener letras y tener máximo 25 caracteres.' });
      }

      // 3. Validación oficial de CURP (18 caracteres con estándar alfanumérico RENAPO)
      const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d$/i;
      if (curp.length !== 18 || !curpRegex.test(curp)) {
        return res.status(400).json({ error: 'La CURP proporcionada no tiene un formato válido oficial de 18 caracteres.' });
      }

      // 4. Validación de teléfonos (10 dígitos numéricos exactos)
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(celular_personal)) {
        return res.status(400).json({ error: 'El celular personal debe contener exactamente 10 dígitos numéricos.' });
      }
      if (!phoneRegex.test(telefono_casa)) {
        return res.status(400).json({ error: 'El teléfono fijo debe contener exactamente 10 dígitos numéricos.' });
      }

      // 5. Validación de usuario (máximo 25 caracteres, sin caracteres especiales no permitidos)
      const usuarioRegex = /^[a-zA-Z0-9._-]+$/;
      if (usuario.length > 25 || !usuarioRegex.test(usuario)) {
        return res.status(400).json({ error: 'El nombre de usuario sólo puede tener letras, números, punto o guion y máximo 25 caracteres.' });
      }

      // 6. Validación de correo electrónico (máximo 40 caracteres)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (correo.length > 40 || !emailRegex.test(correo)) {
        return res.status(400).json({ error: 'El correo electrónico debe tener un formato válido y máximo 40 caracteres.' });
      }

      // 7. Validación de contraseña (de 8 a 10 caracteres, sólo especiales permitidos: . , ! -)
      if (contrasena.length < 8 || contrasena.length > 10) {
        return res.status(400).json({ error: 'La contraseña debe tener entre 8 y 10 caracteres.' });
      }
      const passAllowedRegex = /^[a-zA-Z0-9.,!\-]+$/;
      if (!passAllowedRegex.test(contrasena)) {
        return res.status(400).json({ error: 'La contraseña sólo permite letras, números y los caracteres especiales ( . , ! - ).' });
      }
      if (!/[.,!\-]/.test(contrasena)) {
        return res.status(400).json({ error: 'La contraseña debe incluir al menos uno de los caracteres especiales permitidos ( . , ! - ).' });
      }

      const resultado = await authService.registrarParticipante(
        { nombre, apellido_pat, apellido_mat, curp, genero, fecha_nacimiento, correo, usuario, contrasena, telefono_casa, celular_personal },
        req.ip
      );

      logAction(`Nuevo participante registrado: ${usuario} (CURP: ${curp}) IP: ${req.ip}`);
      res.status(201).json(resultado);
    } catch (err) {
      logError(`Error en registro de participante: ${err.message}`);
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * Endpoint de inicio de sesión.
   */
  async login(req, res, next) {
    try {
      const { usuario, contrasena } = req.body;

      if (!usuario || !contrasena) {
        return res.status(400).json({ error: 'El nombre de usuario y la contraseña son requeridos.' });
      }

      if (!usuario.includes('@') && usuario.length > 10) {
        return res.status(400).json({ error: 'El nombre de usuario no puede tener más de 10 caracteres.' });
      }

      if (contrasena.length > 10) {
        return res.status(400).json({ error: 'La contraseña no puede exceder los 10 caracteres.' });
      }

      const resultado = await authService.login(usuario, contrasena, req.ip);
      logSession(`Inicio de sesión exitoso: ${userTag(resultado.usuario)} IP: ${req.ip}`);
      res.status(200).json(resultado);
    } catch (err) {
      logError(`Fallo de inicio de sesión para usuario "${req.body.usuario}": ${err.message}`);
      res.status(401).json({ error: err.message });
    }
  }

  /**
   * Endpoint de cierre de sesión para la cuenta activa.
   */
  async logout(req, res, next) {
    try {
      const { id_usuario } = req.user;
      const io = req.app.get('io');

      // Desconexión limpia del socket para cierre voluntario de sesión
      sesionesSocket.cleanDisconnectUser(io, id_usuario);

      const resultado = await authService.logout(id_usuario, req.ip);
      logSession(`Cierre de sesión: ${userTag(req.user)} IP: ${req.ip}`);
      res.status(200).json(resultado);
    } catch (err) {
      logError(`Error en logout: ${err.message}`);
      next(err);
    }
  }

  /**
   * Endpoint administrativo (Superadmin) para forzar el cierre de todas las sesiones activas en el sistema.
   */
  async forzarLogoutGlobal(req, res, next) {
    try {
      const id_superadmin = req.user.id_usuario;
      const io = req.app.get('io');

      // 1. Limpiar session_id de todos los usuarios en la BD
      await authService.forzarLogoutGlobal(id_superadmin, req.ip);

      // 2. Emitir evento de Socket.io y desconectar físicamente a todos los usuarios
      sesionesSocket.forceLogoutAll(io);

      res.status(200).json({
        exito: true,
        mensaje: 'Se han cerrado todas las sesiones activas en el sistema globalmente.'
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Endpoint para solicitar restablecimiento de contraseña (por correo o token).
   */
  async solicitarRecuperacion(req, res, next) {
    try {
      const { correo_o_usuario, metodo } = req.body;
      const originHeader = req.headers.origin || req.headers.referer;

      const resultado = await authService.solicitarRecuperacionPassword(
        correo_o_usuario,
        metodo,
        req.ip,
        originHeader
      );

      logAction(`Solicitud de recuperación de contraseña para: ${correo_o_usuario}`);
      res.status(200).json(resultado);
    } catch (err) {
      logError(`Error en solicitud de recuperación: ${err.message}`);
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * Endpoint para validar si un token de recuperación existe y es vigente.
   */
  async validarTokenRecuperacion(req, res, next) {
    try {
      const { token } = req.body;
      const resultado = await authService.validarTokenRecuperacion(token);
      res.status(200).json(resultado);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * Endpoint para procesar el restablecimiento y actualización de la contraseña.
   */
  async restablecerPassword(req, res, next) {
    try {
      const { token, nueva_contrasena, confirmacion } = req.body;

      const resultado = await authService.restablecerPassword(
        token,
        nueva_contrasena,
        confirmacion,
        req.ip
      );

      logAction(`Contraseña restablecida con éxito para token: ${token}`);
      res.status(200).json(resultado);
    } catch (err) {
      logError(`Error al restablecer contraseña: ${err.message}`);
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * Obtener perfil del usuario autenticado (útil para rehidratación del frontend).
   */
  async obtenerPerfil(req, res, next) {
    try {
      res.status(200).json({ usuario: req.user });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
