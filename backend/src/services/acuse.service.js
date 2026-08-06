const PDFDocument = require('pdfkit');
const db = require('../config/db');

/**
 * Genera el stream de PDF para el Acuse de Recibo Oficial, respetando el anonimato absoluto.
 * @param {number} id_participante - ID del participante
 * @returns {Promise<PDFDocument>}
 */
async function generarAcusePDF(id_participante) {
  // 1. Obtener datos del participante
  const participante = await db('participantes')
    .where('id_participante', id_participante)
    .first();

  if (!participante) {
    throw new Error('Participante no encontrado');
  }

  // 2. Obtener manifestaciones firmadas
  const manifestaciones = await db('participante_manifestaciones as pm')
    .join('cat_manifestaciones as cm', 'pm.id_manifestacion', 'cm.id_manifestacion')
    .where('pm.id_participante', id_participante)
    .select('cm.texto', 'pm.fecha_alta')
    .orderBy('cm.orden', 'asc');

  // 3. Crear PDFDocument con maquetación elegante
  const doc = new PDFDocument({ margin: 50, size: 'LETTER' });

  // Franja institucional superior en gris oscuro/azul marino
  doc.rect(0, 0, 612, 15).fill('#0f172a');

  // Título del Instituto
  doc.fillColor('#0f172a')
     .font('Helvetica-Bold')
     .fontSize(16)
     .text('INSTITUTO ELECTORAL DE LA CIUDAD DE MÉXICO', 50, 45);

  doc.fontSize(10)
     .font('Helvetica')
     .fillColor('#64748b')
     .text('Dirección Ejecutiva de Educación Cívica y Construcción de Ciudadanía', 50, 65);

  doc.moveDown(1.5);

  // Título del acuse
  doc.fillColor('#0f172a')
     .font('Helvetica-Bold')
     .fontSize(14)
     .text('ACUSE DE REGISTRO OFICIAL — PARTICIPACIÓN', { align: 'center' });

  doc.fontSize(11)
     .font('Helvetica')
     .fillColor('#475569')
     .text('Concurso Juvenil de Ensayo 2027', { align: 'center' });

  doc.moveDown(1.5);

  // Línea divisora
  doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke('#e2e8f0');
  doc.moveDown(1.5);

  // Datos de la propuesta (Anonimato Estricto)
  doc.fillColor('#0f172a')
     .font('Helvetica-Bold')
     .fontSize(12)
     .text('Detalles del Registro (Información Anónima)');
  doc.moveDown(0.8);

  const startY = doc.y;
  doc.rect(50, startY, 512, 95).fillAndStroke('#f8fafc', '#e2e8f0');

  // Escribir textos dentro de la caja de datos
  doc.fillColor('#0f172a')
     .font('Helvetica-Bold')
     .fontSize(10)
     .text('Folio Oficial:', 70, startY + 15)
     .font('Helvetica')
     .text(participante.folio || 'Pendiente de Asignación', 170, startY + 15);

  doc.font('Helvetica-Bold')
     .text('Seudónimo:', 70, startY + 35)
     .font('Helvetica')
     .text(participante.seudonimo, 170, startY + 35);

  doc.font('Helvetica-Bold')
     .text('Título del Ensayo:', 70, startY + 55)
     .font('Helvetica')
     .text(participante.titulo_ensayo, 170, startY + 55, { width: 370 });

  doc.font('Helvetica-Bold')
     .text('Fecha de Registro:', 70, startY + 75)
     .font('Helvetica')
     .text(new Date(participante.fecha_alta).toLocaleString('es-MX'), 170, startY + 75);

  doc.y = startY + 115; // Posicionar cursor debajo de la caja

  doc.moveDown(1.5);

  // Manifestaciones
  doc.fillColor('#0f172a')
     .font('Helvetica-Bold')
     .fontSize(12)
     .text('Manifestaciones Firmadas Electrónicamente');
  doc.moveDown(0.8);

  manifestaciones.forEach((m, idx) => {
    const fechaFirma = new Date(m.fecha_alta).toLocaleString('es-MX');
    doc.fillColor('#0f172a')
       .font('Helvetica-Bold')
       .fontSize(9)
       .text(`${idx + 1}. `, { continued: true })
       .font('Helvetica')
       .text(m.texto, { align: 'justify' });
    
    doc.fillColor('#10b981')
       .font('Helvetica-Oblique')
       .fontSize(8)
       .text(`Aceptado electrónicamente el: ${fechaFirma}`);
    doc.moveDown(0.6);
  });

  doc.moveDown(1.5);

  // Mensaje de validez y anonimato
  const validationY = doc.y;
  doc.rect(50, validationY, 512, 45).fill('#ecfdf5');
  doc.fillColor('#065f46')
     .font('Helvetica')
     .fontSize(8.5)
     .text('Este documento sirve como comprobante de registro oficial del ensayo y sus manifestaciones firmadas electrónicamente bajo protesta de decir verdad. El proceso de evaluación y dictaminación se realiza bajo estricto anonimato.', 65, validationY + 10, { width: 480, align: 'center' });

  // Pie de página
  doc.fillColor('#94a3b8')
     .font('Helvetica')
     .fontSize(8)
     .text('Instituto Electoral de la Ciudad de México • Rancho Los Colorines, Tlalpan • Ciudad de México', 50, 720, { align: 'center' });

  doc.end();

  return doc;
}

module.exports = {
  generarAcusePDF
};
