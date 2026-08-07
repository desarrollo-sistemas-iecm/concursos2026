const jwt = require('jsonwebtoken');
const db = require('../config/db');
const vars = require('../config/vars');
const acuseService = require('../services/acuse.service');
const auditoriaService = require('../services/auditoria.service');

/**
 * Genera un token JWT firmado temporal (15 min) para la descarga del acuse del participante.
 * GET /api/documentos/descargar-acuse
 */
async function solicitarDescargaAcuse(req, res, next) {
  try {
    const id_usuario = req.user.id_usuario;

    // Buscar el participante activo
    const participante = await db('participantes')
      .where('id_usuario', id_usuario)
      .first();

    if (!participante) {
      return res.status(404).json({ error: 'Registro de participante no encontrado.' });
    }

    if (participante.status_ensayo !== 1 || !participante.folio) {
      return res.status(400).json({ error: 'El ensayo no se encuentra validado o no tiene folio asignado.' });
    }

    // Generar token JWT temporal de un solo uso
    const token = jwt.sign(
      {
        id_participante: participante.id_participante,
        id_usuario: id_usuario,
        jti: crypto && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2)
      },
      vars.jwtSecret,
      { expiresIn: '15m' }
    );

    const urlDescarga = `/api/documentos/obtener-acuse?token=${token}`;

    res.json({ urlDescarga });
  } catch (err) {
    next(err);
  }
}

/**
 * Endpoint de descarga y despacho seguro del acuse en PDF.
 * GET /api/documentos/obtener-acuse
 */
async function obtenerAcusePDF(req, res, next) {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(401).json({ error: 'Token de acceso al acuse no proporcionado.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, vars.jwtSecret);
    } catch (jwtErr) {
      return res.status(401).json({ error: 'El enlace de descarga es inválido o ha expirado.' });
    }

    const { id_participante } = decoded;

    // RECLAMO ATÓMICO (Prevención de race conditions)
    // Se intenta marcar la fecha de descarga únicamente si la columna está en NULL.
    const rowsAffected = await db('participantes')
      .where('id_participante', id_participante)
      .whereNull('fecha_descarga_acuse')
      .update({
        fecha_descarga_acuse: db.fn.now()
      });

    if (rowsAffected === 0) {
      return res.status(410).json({
        error: 'El acuse de recibo ya fue descargado previamente. Este enlace ha expirado de forma definitiva.'
      });
    }

    // Registrar en auditoría
    await auditoriaService.registrarAccion(
      decoded.id_usuario,
      'DESCARGAR_ACUSE',
      'participantes',
      id_participante,
      { msg: 'Descarga del acuse PDF oficial ejecutada.' },
      req.ip
    );

    // Generar el PDF usando PDFKit
    const doc = await acuseService.generarAcusePDF(id_participante);

    // Servir el PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="acuse_ensayo_${id_participante}.pdf"`);

    doc.pipe(res);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  solicitarDescargaAcuse,
  obtenerAcusePDF
};
