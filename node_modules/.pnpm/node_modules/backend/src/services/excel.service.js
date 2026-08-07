const ExcelJS = require('exceljs');
const db = require('../config/db');

class ExcelService {
  /**
   * Genera el reporte en Excel de participantes y sus calificaciones.
   * @param {number} id_convocatoria 
   * @returns {Promise<Buffer>} Buffer del archivo Excel
   */
  async generarReporteGeneral(id_convocatoria) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'IECM - Sistema Concurso Ensayo';
    workbook.created = new Date();

    // 1. OBTENER DATOS DE LA BASE DE DATOS
    
    // Participantes con datos personales y de validación
    const participantes = await db('participantes as p')
      .join('usuarios as u', 'p.id_usuario', 'u.id_usuario')
      .leftJoin('cat_categorias as c', 'p.id_categoria', 'c.id_categoria')
      .leftJoin('cat_alcaldias as a', 'p.id_alcaldia', 'a.id_alcaldia')
      .where('p.id_convocatoria', id_convocatoria)
      .select(
        'p.folio',
        'p.status_ensayo',
        'p.seudonimo',
        'p.titulo_ensayo',
        'p.nombre_tutor',
        'p.apellido_pat_tutor',
        'p.apellido_mat_tutor',
        'p.fecha_alta',
        'u.nombre',
        'u.apellido_pat',
        'u.apellido_mat',
        'u.curp',
        'u.genero',
        'u.correo',
        'u.fecha_nacimiento',
        'c.nombre as categoria_nombre',
        'a.nombre as alcaldia_nombre'
      )
      .orderBy('p.folio', 'asc');

    // Calificaciones detalladas por participante
    const calificaciones = await db('calificaciones as cal')
      .join('participantes as p', 'cal.id_participante', 'p.id_participante')
      .join('usuarios as j', 'cal.id_juez', 'j.id_usuario')
      .leftJoin('cat_categorias as c', 'p.id_categoria', 'c.id_categoria')
      .leftJoin('vw_calificaciones as vw', 'p.id_participante', 'vw.id_participante')
      .where('p.id_convocatoria', id_convocatoria)
      .select(
        'p.folio',
        'p.seudonimo',
        'p.titulo_ensayo',
        'c.nombre as categoria_nombre',
        'j.nombre as juez_nombre',
        'j.apellido_pat as juez_apellido_pat',
        'cal.califica1',
        'cal.califica2',
        'cal.califica3',
        'cal.califica4',
        'cal.califica5',
        'cal.califica6',
        'cal.total',
        'cal.observaciones',
        'vw.prom_global',
        'vw.jueces_que_calificaron'
      )
      .orderBy(['p.folio', 'j.usuario'], 'asc');

    // 2. HOJA 1: PARTICIPANTES
    const sheet1 = workbook.addWorksheet('Participantes');
    
    // Configurar columnas de Hoja 1
    sheet1.columns = [
      { header: 'Folio', key: 'folio', width: 12 },
      { header: 'Estado Ensayo', key: 'estado', width: 15 },
      { header: 'Seudónimo', key: 'seudonimo', width: 18 },
      { header: 'Título de la Obra', key: 'titulo', width: 30 },
      { header: 'Categoría', key: 'categoria', width: 25 },
      { header: 'Alcaldía', key: 'alcaldia', width: 20 },
      { header: 'Nombre(s)', key: 'nombre', width: 18 },
      { header: 'Primer Apellido', key: 'apellido_pat', width: 18 },
      { header: 'Segundo Apellido', key: 'apellido_mat', width: 18 },
      { header: 'CURP', key: 'curp', width: 20 },
      { header: 'Género', key: 'genero', width: 12 },
      { header: 'Correo Electrónico', key: 'correo', width: 25 },
      { header: 'Edad', key: 'edad', width: 8 },
      { header: 'Tutor (Menores)', key: 'tutor', width: 25 },
      { header: 'Fecha de Registro', key: 'fecha_alta', width: 20 }
    ];

    // Estilo de la cabecera
    sheet1.getRow(1).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFF' } };
    sheet1.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A8A' } }; // Azul marino
    sheet1.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Agregar filas
    participantes.forEach(p => {
      const edad = calcularEdad(p.fecha_nacimiento);
      let estadoTxt = 'Pendiente';
      if (p.status_ensayo === 1) estadoTxt = 'Validado';
      if (p.status_ensayo === 2) estadoTxt = 'Observaciones';

      const tutorNombre = p.nombre_tutor ? `${p.nombre_tutor} ${p.apellido_pat_tutor} ${p.apellido_mat_tutor}`.trim() : '';

      sheet1.addRow({
        folio: p.folio || '(Pendiente)',
        estado: estadoTxt,
        seudonimo: p.seudonimo || '(No registrado)',
        titulo: p.titulo_ensayo || '(No registrado)',
        categoria: p.categoria_nombre,
        alcaldia: p.alcaldia_nombre || '(No registrada)',
        nombre: p.nombre,
        apellido_pat: p.apellido_pat,
        apellido_mat: p.apellido_mat,
        curp: p.curp,
        genero: p.genero,
        correo: p.correo,
        edad: edad,
        tutor: tutorNombre || 'N/A',
        fecha_alta: new Date(p.fecha_alta).toLocaleString('es-MX')
      });
    });

    // Diseño de cebra y bordes en Hoja 1
    sheet1.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        // Cebra
        if (rowNumber % 2 === 0) {
          row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F3F4F6' } };
        }
        row.eachCell(cell => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'E5E7EB' } },
            left: { style: 'thin', color: { argb: 'E5E7EB' } },
            bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
            right: { style: 'thin', color: { argb: 'E5E7EB' } }
          };
          cell.font = { name: 'Arial', size: 10 };
        });
      }
    });

    // 3. HOJA 2: EVALUACIONES
    const sheet2 = workbook.addWorksheet('Calificaciones');

    sheet2.columns = [
      { header: 'Folio', key: 'folio', width: 12 },
      { header: 'Seudónimo', key: 'seudonimo', width: 18 },
      { header: 'Título de la Obra', key: 'titulo', width: 30 },
      { header: 'Categoría', key: 'categoria', width: 25 },
      { header: 'Promedio Global', key: 'prom_global', width: 16 },
      { header: 'Total Evaluaciones', key: 'jueces_que_calificaron', width: 18 },
      { header: 'Juez Evaluador', key: 'juez', width: 22 },
      { header: 'C1: Formato (0.5)', key: 'c1', width: 16 },
      { header: 'C2: Claridad (2.0)', key: 'c2', width: 16 },
      { header: 'C3: Contenido (2.0)', key: 'c3', width: 16 },
      { header: 'C4: Originalidad (2.0)', key: 'c4', width: 18 },
      { header: 'C5: Estilo (2.0)', key: 'c5', width: 16 },
      { header: 'C6: Conclusión (1.5)', key: 'c6', width: 18 },
      { header: 'Calificación Total', key: 'total', width: 18 },
      { header: 'Observaciones del Juez', key: 'observaciones', width: 35 }
    ];

    sheet2.getRow(1).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFF' } };
    sheet2.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '065F46' } }; // Verde pino
    sheet2.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    calificaciones.forEach(c => {
      sheet2.addRow({
        folio: c.folio,
        seudonimo: c.seudonimo,
        titulo: c.titulo_ensayo,
        categoria: c.categoria_nombre,
        prom_global: c.prom_global,
        jueces_que_calificaron: c.jueces_que_calificaron,
        juez: `${c.juez_nombre} ${c.juez_apellido_pat}`.trim(),
        c1: c.califica1,
        c2: c.califica2,
        c3: c.califica3,
        c4: c.califica4,
        c5: c.califica5,
        c6: c.califica6,
        total: c.total,
        observaciones: c.observaciones || ''
      });
    });

    sheet2.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        if (rowNumber % 2 === 0) {
          row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ECFDF5' } }; // Verde claro alternado
        }
        row.eachCell(cell => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'D1FAE5' } },
            left: { style: 'thin', color: { argb: 'D1FAE5' } },
            bottom: { style: 'thin', color: { argb: 'D1FAE5' } },
            right: { style: 'thin', color: { argb: 'D1FAE5' } }
          };
          cell.font = { name: 'Arial', size: 10 };
        });
      }
    });

    return await workbook.xlsx.writeBuffer();
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

module.exports = new ExcelService();
