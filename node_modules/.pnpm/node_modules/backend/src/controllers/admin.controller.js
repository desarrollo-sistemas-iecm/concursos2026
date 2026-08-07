const participantesRepository = require('../repositories/participantes.repository');
const catalogosRepository = require('../repositories/catalogos.repository');
const bitacoraRepository = require('../repositories/bitacora.repository');
const notificacionesService = require('../services/notificaciones.service');
const excelService = require('../services/excel.service');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const vars = require('../config/vars');
const { enviarEnsayoValidado, enviarEnsayoObservado } = require('../integrations/mail/mailer');

class AdminController {
  /**
   * Obtiene todos los participantes registrados en la convocatoria activa
   */
  async getParticipantes(req, res) {
    try {
      const convocatoriaActiva = await catalogosRepository.getConvocatoriaActiva();
      if (!convocatoriaActiva) {
        return res.status(400).json({ error: 'No hay ninguna convocatoria activa en el sistema.' });
      }

      const participantes = await participantesRepository.findAllWithUser(convocatoriaActiva.id_convocatoria);
      res.json(participantes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Valida un ensayo asignando un folio único secuencial bajo bloqueo seguro
   */
  async validarEnsayo(req, res) {
    try {
      const { id_participante } = req.params;
      const id_validador = req.user.id_usuario;

      // Obtener datos del participante y su usuario asociado
      const partConUsuario = await db('participantes as p')
        .join('usuarios as u', 'p.id_usuario', 'u.id_usuario')
        .where('p.id_participante', id_participante)
        .select('p.*', 'u.correo', 'u.nombre', 'u.apellido_pat')
        .first();

      if (!partConUsuario) {
        return res.status(404).json({ error: 'Participante no encontrado.' });
      }

      if (partConUsuario.status_ensayo === 1) {
        return res.status(400).json({ error: 'Este ensayo ya se encuentra validado y tiene el folio: ' + partConUsuario.folio });
      }

      let folioGenerado;

      // Usar transacción atómica para la generación de folio y actualización
      await db.transaction(async (trx) => {
        // Generar folio seguro usando bloqueos a nivel de base de datos
        folioGenerado = await participantesRepository.generarFolioSeguro(
          id_participante,
          partConUsuario.id_categoria,
          partConUsuario.id_convocatoria,
          trx
        );

        // Actualizar el registro del participante con el folio y estado validado
        await participantesRepository.update(id_participante, {
          status_ensayo: 1,
          folio: folioGenerado,
          id_validador,
          observaciones: null // Limpiar observaciones anteriores si existían
        }, trx);
      });

      // Registrar acción en la bitácora
      await bitacoraRepository.registrar(
        id_validador,
        'VALIDAR_ENSAYO',
        'participantes',
        id_participante,
        { folio: folioGenerado },
        req.ip
      ).catch(err => console.error('Error al registrar bitácora:', err.message));

      // Generar token JWT firmado temporal (15 min) para la descarga del acuse
      const token = jwt.sign(
        {
          id_participante: partConUsuario.id_participante,
          id_usuario: partConUsuario.id_usuario,
          jti: crypto && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2)
        },
        vars.jwtSecret,
        { expiresIn: '15m' }
      );
      const urlDescargaAcuse = `http://localhost:3000/api/documentos/obtener-acuse?token=${token}`;

      // Enviar correo transaccional de validación
      await enviarEnsayoValidado(partConUsuario.correo, partConUsuario.seudonimo, folioGenerado, urlDescargaAcuse)
        .catch(err => console.error('Error al enviar correo de validación:', err.message));

      // Crear Notificación In-App para el participante
      await notificacionesService.crearNotificacion({
        id_remitente: id_validador,
        id_usuario_destino: partConUsuario.id_usuario,
        tipo: 'validado',
        asunto: '¡Tu ensayo ha sido validado exitosamente!',
        mensaje: `¡Felicidades! Tu obra "${partConUsuario.titulo_ensayo || 'Ensayo'}" ha sido revisada y aprobada por el validador. Se te ha asignado el Folio Oficial ${folioGenerado}. Tu comprobante de registro ya se encuentra listo para descarga en tu panel.`
      }).catch(err => console.error('Error al registrar notificación in-app:', err.message));

      res.json({
        exito: true,
        folio: folioGenerado,
        mensaje: `Ensayo validado exitosamente. Se ha asignado el folio ${folioGenerado}.`
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Rechaza un ensayo agregando observaciones para que el participante pueda corregirlo
   */
  async rechazarEnsayo(req, res) {
    try {
      const { id_participante } = req.params;
      const { observaciones } = req.body;
      const id_validador = req.user.id_usuario;

      if (!observaciones || observaciones.trim() === '') {
        return res.status(400).json({ error: 'Debes capturar las observaciones del rechazo.' });
      }

      // Obtener datos del participante y su usuario asociado
      const partConUsuario = await db('participantes as p')
        .join('usuarios as u', 'p.id_usuario', 'u.id_usuario')
        .where('p.id_participante', id_participante)
        .select('p.*', 'u.correo', 'u.nombre', 'u.apellido_pat')
        .first();

      if (!partConUsuario) {
        return res.status(404).json({ error: 'Participante no encontrado.' });
      }

      if (partConUsuario.status_ensayo === 1) {
        return res.status(400).json({ error: 'Este ensayo ya fue validado y tiene folio asignado. No puede ser rechazado.' });
      }

      await participantesRepository.update(id_participante, {
        status_ensayo: 2, // Con observaciones
        observaciones: observaciones.trim(),
        id_validador
      });

      // Registrar acción en la bitácora
      await bitacoraRepository.registrar(
        id_validador,
        'RECHAZAR_ENSAYO',
        'participantes',
        id_participante,
        { observaciones },
        req.ip
      ).catch(err => console.error('Error al registrar bitácora:', err.message));

      // Enviar correo transaccional de observaciones
      await enviarEnsayoObservado(partConUsuario.correo, partConUsuario.seudonimo, observaciones.trim())
        .catch(err => console.error('Error al enviar correo de observaciones:', err.message));

      // Crear Notificación In-App para el participante
      await notificacionesService.crearNotificacion({
        id_remitente: id_validador,
        id_usuario_destino: partConUsuario.id_usuario,
        tipo: 'observado',
        asunto: 'Atención: Tu ensayo requiere corrección',
        mensaje: `Durante la revisión de tu expediente se registraron las siguientes observaciones: "${observaciones.trim()}". Por favor dirígete al módulo de tu panel para volver a subir tu documento corregido.`
      }).catch(err => console.error('Error al registrar notificación in-app:', err.message));

      res.json({
        exito: true,
        mensaje: 'Se han guardado las observaciones y se ha notificado el estado de corrección al participante.'
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Genera y descarga el reporte en formato Excel (.xlsx)
   */
  async descargarExcel(req, res) {
    try {
      const convocatoriaActiva = await catalogosRepository.getConvocatoriaActiva();
      if (!convocatoriaActiva) {
        return res.status(400).json({ error: 'No hay ninguna convocatoria activa en el sistema.' });
      }

      const buffer = await excelService.generarReporteGeneral(convocatoriaActiva.id_convocatoria);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=Reporte_General_Ensayo_${convocatoriaActiva.anio}.xlsx`);
      
      res.send(buffer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Obtiene los archivos adicionales cargados por un participante específico
   */
  async getArchivosParticipante(req, res) {
    try {
      const { id_participante } = req.params;
      const archivos = await db('participantes_archivos as pa')
        .join('cat_requisitos_documentos as rd', 'pa.id_requisito', 'rd.id_requisito')
        .where('pa.id_participante', id_participante)
        .select(
          'pa.*',
          'rd.nombre_requisito',
          'rd.descripcion as requisito_descripcion',
          'rd.es_obligatorio'
        );
      res.json(archivos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AdminController();
