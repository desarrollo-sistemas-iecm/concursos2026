const participantesRepository = require('../repositories/participantes.repository');
const catalogosRepository = require('../repositories/catalogos.repository');
const usuariosRepository = require('../repositories/usuarios.repository');
const bitacoraRepository = require('../repositories/bitacora.repository');
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

class ParticipanteController {
  /**
   * Obtiene la información de participación de la sesión actual
   */
  async getMiRegistro(req, res) {
    try {
      const id_usuario = req.user.id_usuario;

      const convocatoriaActiva = await catalogosRepository.getConvocatoriaActiva();
      if (!convocatoriaActiva) {
        return res.status(400).json({ error: 'No hay ninguna convocatoria activa en el sistema.' });
      }

      // Buscar si el usuario ya está asociado como participante en esta convocatoria
      const participante = await participantesRepository.findByUsuarioAndConvocatoria(
        id_usuario,
        convocatoriaActiva.id_convocatoria
      );

      if (!participante) {
        return res.status(404).json({ error: 'No se encontró un registro de participante activo.' });
      }

      // Buscar manifestaciones aceptadas
      const manifestaciones = await participantesRepository.getManifestacionesByParticipante(
        participante.id_participante
      );

      // Traer la fecha de nacimiento de la tabla de usuarios para validar mayoría de edad en frontend
      const usuario = await usuariosRepository.findById(id_usuario);

      res.json({
        participante,
        manifestaciones,
        fecha_nacimiento: usuario?.fecha_nacimiento,
        curp: usuario?.curp,
        genero: usuario?.genero
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Completa o actualiza el registro del ensayo, subiendo el PDF
   */
  async completarRegistro(req, res) {
    try {
      const id_usuario = req.user.id_usuario;

      const convocatoriaActiva = await catalogosRepository.getConvocatoriaActiva();
      if (!convocatoriaActiva) {
        return res.status(400).json({ error: 'No hay ninguna convocatoria activa.' });
      }

      const participante = await participantesRepository.findByUsuarioAndConvocatoria(
        id_usuario,
        convocatoriaActiva.id_convocatoria
      );

      if (!participante) {
        return res.status(404).json({ error: 'Registro de participante no encontrado.' });
      }

      // Impedir modificaciones si ya está validado
      if (participante.status_ensayo === 1) {
        return res.status(400).json({ error: 'Tu ensayo ya ha sido validado. No se permiten modificaciones.' });
      }

      const {
        seudonimo,
        titulo_ensayo,
        id_alcaldia,
        id_te_enteraste,
        entidad,
        soy_originario,
        nombre_tutor,
        apellido_pat_tutor,
        apellido_mat_tutor,
        clave_elector_tutor,
        tel1,
        tel2,
        manifestaciones // Espera un JSON array o stringificado
      } = req.body;

      // Validar datos básicos y límites de longitud
      if (!seudonimo || !titulo_ensayo || !id_alcaldia || !id_te_enteraste) {
        return res.status(400).json({ error: 'Faltan campos obligatorios para el registro.' });
      }

      if (seudonimo.length > 30) {
        return res.status(400).json({ error: 'El seudónimo no puede exceder los 30 caracteres.' });
      }
      if (titulo_ensayo.length > 30) {
        return res.status(400).json({ error: 'El título del ensayo no puede exceder los 30 caracteres.' });
      }

      // Validar mayoría de edad y datos obligatorios del tutor
      const usuario = await usuariosRepository.findById(id_usuario);
      const edad = calcularEdad(usuario.fecha_nacimiento);
      const esMenor = edad < 18;

      if (esMenor) {
        if (!nombre_tutor || !apellido_pat_tutor || !apellido_mat_tutor || !clave_elector_tutor || !tel1) {
          return res.status(400).json({ error: 'Los menores de edad deben registrar obligatoriamente todos los datos de su tutor (Nombre, Apellidos, Clave INE y Teléfono).' });
        }
        const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (nombre_tutor.length > 25 || !nombreRegex.test(nombre_tutor)) {
          return res.status(400).json({ error: 'El nombre del tutor sólo debe contener letras y máximo 25 caracteres.' });
        }
        if (apellido_pat_tutor.length > 25 || !nombreRegex.test(apellido_pat_tutor)) {
          return res.status(400).json({ error: 'El primer apellido del tutor sólo debe contener letras y máximo 25 caracteres.' });
        }
        if (apellido_mat_tutor.length > 25 || !nombreRegex.test(apellido_mat_tutor)) {
          return res.status(400).json({ error: 'El segundo apellido del tutor sólo debe contener letras y máximo 25 caracteres.' });
        }

        const claveIneRegex = /^[A-Z]{6}\d{6}\d{2}[HM][A-Z0-9]{3}$/i;
        if (clave_elector_tutor.length !== 18 || !claveIneRegex.test(clave_elector_tutor)) {
          return res.status(400).json({ error: 'La Clave de Elector INE del tutor debe tener un formato oficial de 18 caracteres válido.' });
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(tel1)) {
          return res.status(400).json({ error: 'El Teléfono 1 del tutor debe ser de exactamente 10 dígitos numéricos.' });
        }
        if (tel2 && !phoneRegex.test(tel2)) {
          return res.status(400).json({ error: 'El Teléfono 2 del tutor debe ser de exactamente 10 dígitos numéricos.' });
        }
      }

      // Manejar el archivo del ensayo
      const archivoReqEnsayo = await db('participantes_archivos as pa')
        .join('cat_requisitos_documentos as rd', 'pa.id_requisito', 'rd.id_requisito')
        .where('pa.id_participante', participante.id_participante)
        .where(builder => {
          builder.whereRaw("LOWER(rd.nombre_requisito) LIKE '%ensayo%'")
                 .orWhereRaw("LOWER(rd.nombre_requisito) LIKE '%obra%'");
        })
        .first();

      let archivo_ensayo = req.file 
        ? req.file.filename 
        : (archivoReqEnsayo ? archivoReqEnsayo.nombre_guardado : participante.archivo_ensayo);

      if (req.file) {
        // Borrar el archivo viejo si existía para ahorrar espacio
        if (participante.archivo_ensayo) {
          const oldPath = path.join(__dirname, '../../uploads/ensayos', participante.archivo_ensayo);
          if (fs.existsSync(oldPath)) {
            try { fs.unlinkSync(oldPath); } catch (e) {}
          }
        }
      } else if (!archivo_ensayo) {
        return res.status(400).json({ error: 'Debes subir obligatoriamente el archivo PDF de tu ensayo.' });
      }

      // Mover y renombrar el ensayo a la subcarpeta del participante: uploads/ensayos/[NombreParticipante]/[NombreParticipante]_[TituloObra]_[FechaSubida].pdf
      const { nombreCarpeta, folderPath } = await obtenerCarpetaParticipante(id_usuario);
      const tituloEnsayoSanitizado = sanitizarTextoArchivo(titulo_ensayo);
      const fechaSubida = new Date().toISOString().slice(0, 10);
      const nuevoNombreEnsayo = `${nombreCarpeta}_${tituloEnsayoSanitizado}_${fechaSubida}.pdf`;

      const uploadsDir = path.join(__dirname, '../../uploads/ensayos');
      
      // Buscar el archivo origen
      let oldFilePath = path.join(uploadsDir, archivo_ensayo);
      if (!fs.existsSync(oldFilePath)) {
        oldFilePath = path.join(folderPath, path.basename(archivo_ensayo));
      }

      const newFilePath = path.join(folderPath, nuevoNombreEnsayo);

      if (fs.existsSync(oldFilePath)) {
        try {
          fs.renameSync(oldFilePath, newFilePath);
          archivo_ensayo = nuevoNombreEnsayo;
        } catch (errRename) {
          console.error('Error al mover/renombrar archivo de ensayo:', errRename);
        }
      } else {
        archivo_ensayo = nuevoNombreEnsayo;
      }

      let parsedManifestaciones = [];
      if (manifestaciones) {
        parsedManifestaciones = typeof manifestaciones === 'string' 
          ? JSON.parse(manifestaciones) 
          : manifestaciones;
      }

      // Transacción atómica
      await db.transaction(async (trx) => {
        // Actualizar datos del participante
        await participantesRepository.update(participante.id_participante, {
          id_alcaldia: parseInt(id_alcaldia, 10),
          id_te_enteraste: parseInt(id_te_enteraste, 10),
          seudonimo,
          titulo_ensayo,
          obra: seudonimo, // Se usa el seudónimo en la columna obra o similar según la BD
          entidad: id_alcaldia === '17' ? entidad : null, // 17 es 'Otro' alcaldia en seed
          soy_originario: soy_originario === 'true' || soy_originario === true ? 1 : 0,
          archivo_ensayo,
          status_ensayo: 0, // Regresa a estado pendiente para revisión del administrador
          nombre_tutor: esMenor ? nombre_tutor : null,
          apellido_pat_tutor: esMenor ? apellido_pat_tutor : null,
          apellido_mat_tutor: esMenor ? apellido_mat_tutor : null,
          clave_elector_tutor: esMenor ? clave_elector_tutor : null,
          tel1,
          tel2
        }, trx);

        // Guardar las respuestas a las manifestaciones
        await participantesRepository.saveManifestaciones(
          participante.id_participante,
          parsedManifestaciones,
          trx
        );
      });

      // Bitácora de acciones
      await bitacoraRepository.registrar(
        id_usuario,
        'COMPLETAR_REGISTRO_OBRA',
        'participantes',
        participante.id_participante,
        { titulo_ensayo, seudonimo },
        req.ip
      ).catch(err => console.error('Error al registrar bitácora:', err.message));


      res.json({
        exito: true,
        mensaje: 'La información y el archivo del ensayo han sido guardados con éxito para validación.'
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // --- SUBIDA DINÁMICA DE DOCUMENTOS REQUERIDOS ---
  async getMisArchivos(req, res, next) {
    try {
      const id_usuario = req.user.id_usuario;
      const participante = await participantesRepository.findByUsuarioId(id_usuario);
      if (!participante) {
        return res.json([]);
      }

      const archivos = await db('participantes_archivos')
        .where({ id_participante: participante.id_participante });

      res.json(archivos);
    } catch (err) {
      next(err);
    }
  }

  async subirArchivoRequisito(req, res, next) {
    try {
      const id_usuario = req.user.id_usuario;
      const { id_requisito } = req.body;

      if (!id_requisito) {
        return res.status(400).json({ error: 'El ID del requisito es obligatorio.' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Debes seleccionar un archivo para subir.' });
      }

      let participante = await participantesRepository.findByUsuarioId(id_usuario);
      if (!participante) {
        const convocatoriaActiva = await catalogosRepository.getConvocatoriaActiva();
        if (!convocatoriaActiva) {
          return res.status(400).json({ error: 'No hay convocatoria activa disponible.' });
        }
        participante = await participantesRepository.create({
          id_usuario,
          id_convocatoria: convocatoriaActiva.id_convocatoria,
          status_ensayo: 0
        });
      }

      const requisito = await db('cat_requisitos_documentos').where({ id_requisito, status: 1 }).first();
      if (!requisito) {
        return res.status(404).json({ error: 'El requisito de documento no existe o está inactivo.' });
      }

      // Buscar si existía previamente un archivo para eliminar el archivo viejo del disco
      const archivoExistente = await db('participantes_archivos')
        .where({ id_participante: participante.id_participante, id_requisito })
        .first();

      if (archivoExistente && archivoExistente.nombre_guardado) {
        const oldPath = path.join(__dirname, '../../uploads/ensayos', archivoExistente.nombre_guardado);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) { console.error('Error unlinking old doc:', e); }
        }
      }

      // MERGE ATÓMICO EN UNA SOLA SENTENCIA EN SQL SERVER (HOLDLOCK)
      const queryMerge = `
        MERGE INTO participantes_archivos WITH (HOLDLOCK) AS target
        USING (SELECT ? AS id_participante, ? AS id_requisito) AS source
        ON (target.id_participante = source.id_participante AND target.id_requisito = source.id_requisito)
        WHEN MATCHED THEN
          UPDATE SET 
            nombre_original = ?,
            nombre_guardado = ?,
            mime_type = ?,
            tamanio_bytes = ?,
            fecha_alta = GETDATE()
        WHEN NOT MATCHED THEN
          INSERT (id_participante, id_requisito, nombre_original, nombre_guardado, mime_type, tamanio_bytes, fecha_alta)
          VALUES (source.id_participante, source.id_requisito, ?, ?, ?, ?, GETDATE());
      `;

      // Generar nombre de guardado estructurado descriptivo
      const usuarioObj = await usuariosRepository.findById(id_usuario);
      const nombreUsuarioSanitizado = sanitizarTextoArchivo(`${usuarioObj.nombre}_${usuarioObj.apellido_pat}_${usuarioObj.apellido_mat || ''}`);
      const reqNombreSanitizado = sanitizarTextoArchivo(requisito.nombre_requisito);
      const fechaSubida = new Date().toISOString().slice(0, 10);
      const ext = path.extname(req.file.originalname).toLowerCase() || '.pdf';

      const nombreGuardadoDescriptivo = `${nombreUsuarioSanitizado}_${reqNombreSanitizado}_${fechaSubida}${ext}`;

      // Renombrar el archivo subido en el disco
      const uploadsDir = path.join(__dirname, '../../uploads/ensayos');
      const oldFilePath = path.join(uploadsDir, req.file.filename);
      const newFilePath = path.join(uploadsDir, nombreGuardadoDescriptivo);

      if (fs.existsSync(oldFilePath) && oldFilePath !== newFilePath) {
        try { fs.renameSync(oldFilePath, newFilePath); } catch (e) {}
      }

      await db.raw(queryMerge, [
        participante.id_participante,
        id_requisito,
        req.file.originalname,
        nombreGuardadoDescriptivo,
        req.file.mimetype,
        req.file.size,
        req.file.originalname,
        nombreGuardadoDescriptivo,
        req.file.mimetype,
        req.file.size
      ]);

      // Si el requisito que se subió corresponde a un ensayo/obra, actualizar inmediatamente la columna `archivo_ensayo` en la tabla participantes
      const esReqEnsayo = requisito.nombre_requisito.toLowerCase().includes('ensayo') || 
                          requisito.nombre_requisito.toLowerCase().includes('obra');

      if (esReqEnsayo) {
        await participantesRepository.update(participante.id_participante, {
          archivo_ensayo: nombreGuardadoDescriptivo
        });
      }

      res.json({
        exito: true,
        mensaje: `El documento "${requisito.nombre_requisito}" ha sido subido correctamente.`,
        nombre_original: req.file.originalname,
        nombre_guardado: nombreGuardadoDescriptivo
      });
    } catch (err) {
      next(err);
    }
  }

  async eliminarArchivoRequisito(req, res, next) {
    try {
      const id_usuario = req.user.id_usuario;
      const { id_requisito } = req.params;

      const participante = await participantesRepository.findByUsuarioId(id_usuario);
      if (!participante) {
        return res.status(404).json({ error: 'Participante no encontrado.' });
      }

      const archivoExistente = await db('participantes_archivos')
        .where({ id_participante: participante.id_participante, id_requisito })
        .first();

      if (archivoExistente) {
        if (archivoExistente.nombre_guardado) {
          const uploadsDir = path.join(__dirname, '../../uploads/ensayos');
          const directPath = path.join(uploadsDir, archivoExistente.nombre_guardado);
          if (fs.existsSync(directPath)) {
            try { fs.unlinkSync(directPath); } catch (e) {}
          } else {
            const filenameOnly = path.basename(archivoExistente.nombre_guardado);
            const foundPath = buscarArchivoRecursivo(uploadsDir, filenameOnly);
            if (foundPath && fs.existsSync(foundPath)) {
              try { fs.unlinkSync(foundPath); } catch (e) {}
            }
          }
        }

        await db('participantes_archivos')
          .where({ id_participante: participante.id_participante, id_requisito })
          .del();

        const requisitoObj = await db('cat_requisitos_documentos')
          .where({ id_requisito })
          .first();

        const esReqEnsayo = requisitoObj && (
          requisitoObj.nombre_requisito.toLowerCase().includes('ensayo') || 
          requisitoObj.nombre_requisito.toLowerCase().includes('obra')
        );

        if (esReqEnsayo || participante.archivo_ensayo === archivoExistente.nombre_guardado) {
          const otroArchivoEnsayo = await db('participantes_archivos as pa')
            .join('cat_requisitos_documentos as rd', 'pa.id_requisito', 'rd.id_requisito')
            .where('pa.id_participante', participante.id_participante)
            .whereNot('pa.id_requisito', id_requisito)
            .where(builder => {
              builder.whereRaw("LOWER(rd.nombre_requisito) LIKE '%ensayo%'")
                     .orWhereRaw("LOWER(rd.nombre_requisito) LIKE '%obra%'");
            })
            .first();

          await participantesRepository.update(participante.id_participante, {
            archivo_ensayo: otroArchivoEnsayo ? otroArchivoEnsayo.nombre_guardado : null,
            status_ensayo: otroArchivoEnsayo ? 0 : null
          });
        }
      }

      res.json({ exito: true, mensaje: 'Documento eliminado correctamente.' });
    } catch (err) {
      next(err);
    }
  }

}

function calcularEdad(fechaNac) {
  const hoy = new Date();
  const cumpleanos = new Date(fechaNac);
  let edad = hoy.getFullYear() - cumpleanos.getFullYear();
  const m = hoy.getMonth() - cumpleanos.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
    edad--;
  }
  return edad;
}

function sanitizarTextoArchivo(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/[^a-zA-Z0-9]/g, '_')   // Convertir caracteres no alfanumericos a "_"
    .replace(/_+/g, '_')             // Limpiar guiones bajos consecutivos
    .replace(/^_+|_+$/g, '');        // Recortar guiones iniciales/finales
}

async function obtenerCarpetaParticipante(id_usuario) {
  const usuarioObj = await usuariosRepository.findById(id_usuario);
  const nombreCarpeta = sanitizarTextoArchivo(`${usuarioObj.nombre}_${usuarioObj.apellido_pat}_${usuarioObj.apellido_mat || ''}`);
  
  const folderPath = path.join(__dirname, '../../uploads/ensayos', nombreCarpeta);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  return { nombreCarpeta, folderPath, usuarioObj };
}

function buscarArchivoRecursivo(dir, filename) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const found = buscarArchivoRecursivo(fullPath, filename);
      if (found) return found;
    } else if (file === filename || fullPath.endsWith(path.sep + filename)) {
      return fullPath;
    }
  }
  return null;
}

module.exports = new ParticipanteController();
