const db = require('../config/db');

class ParticipantesRepository {
  async findById(id_participante) {
    return db('participantes').where({ id_participante }).first();
  }

  async findByUsuarioAndConvocatoria(id_usuario, id_convocatoria) {
    return db('participantes')
      .where({ id_usuario, id_convocatoria })
      .first();
  }

  async findByUsuarioId(id_usuario) {
    return db('participantes')
      .where({ id_usuario })
      .orderBy('fecha_alta', 'desc')
      .first();
  }

  async findAllWithUser(id_convocatoria) {
    // 1. Obtener total de jueces en el sistema
    const resJueces = await db('usuarios')
      .where({ id_tipousuario: 3, status: 1 })
      .count('* as total');
    const totalJueces = parseInt(resJueces[0]?.total || 0, 10);

    // 2. Obtener conteo de evaluaciones y promedio por participante
    const evaluaciones = await db('calificaciones')
      .select('id_participante')
      .count('id_juez as jueces_evaluaron')
      .avg('total as promedio')
      .groupBy('id_participante');

    const evalMap = new Map();
    evaluaciones.forEach(ev => {
      evalMap.set(ev.id_participante, {
        jueces_evaluaron_count: parseInt(ev.jueces_evaluaron || 0, 10),
        promedio_calificacion: ev.promedio !== null && ev.promedio !== undefined 
          ? parseFloat(Number(ev.promedio).toFixed(2)) 
          : null
      });
    });

    const participantes = await db('participantes as p')
      .join('usuarios as u', 'p.id_usuario', 'u.id_usuario')
      .leftJoin('cat_categorias as c', 'p.id_categoria', 'c.id_categoria')
      .leftJoin('cat_alcaldias as a', 'p.id_alcaldia', 'a.id_alcaldia')
      .where('p.id_convocatoria', id_convocatoria)
      .select(
        'p.*',
        'u.nombre',
        'u.apellido_pat',
        'u.apellido_mat',
        'u.curp',
        'u.genero',
        'u.fecha_nacimiento',
        'u.correo',
        'u.usuario',
        'c.nombre as categoria_nombre',
        'a.nombre as alcaldia_nombre'
      )
      .orderBy('p.fecha_alta', 'desc');

    return participantes.map(p => {
      const evData = evalMap.get(p.id_participante) || { jueces_evaluaron_count: 0, promedio_calificacion: null };
      return {
        ...p,
        total_jueces: totalJueces,
        jueces_evaluaron_count: evData.jueces_evaluaron_count,
        promedio_calificacion: evData.promedio_calificacion
      };
    });
  }


  async create(participanteData, trx = null) {
    const q = trx || db;
    const cols = Object.keys(participanteData).map(c => `[${c}]`).join(', ');
    const vals = Object.values(participanteData);
    const placeholders = vals.map(() => '?').join(', ');
    const result = await q.raw(
      `INSERT INTO [participantes] (${cols}) OUTPUT INSERTED.[id_participante] VALUES (${placeholders})`,
      vals
    );
    const id_participante = result[0]?.id_participante;
    return { ...participanteData, id_participante };
  }

  async update(id_participante, data, trx = null) {
    const query = db('participantes').where({ id_participante });
    if (trx) query.transacting(trx);

    await query.update({
      ...data,
      fecha_modifica: db.raw('GETDATE()')
    });
    return { id_participante, ...data };
  }

  /**
   * Guarda las respuestas a las manifestaciones en la tabla puente.
   * @param {number} id_participante 
   * @param {Array<{id_manifestacion: number, respuesta: number}>} respuestas 
   * @param {object} [trx] 
   */
  async saveManifestaciones(id_participante, respuestas, trx = null) {
    const queryDelete = db('participante_manifestaciones').where({ id_participante });
    if (trx) queryDelete.transacting(trx);
    await queryDelete.del();

    const insertRows = respuestas.map(r => ({
      id_participante,
      id_manifestacion: r.id_manifestacion,
      respuesta: r.respuesta,
      fecha_alta: db.raw('GETDATE()')
    }));

    if (insertRows.length > 0) {
      const queryInsert = db('participante_manifestaciones');
      if (trx) queryInsert.transacting(trx);
      await queryInsert.insert(insertRows);
    }
  }

  async getManifestacionesByParticipante(id_participante) {
    return db('participante_manifestaciones')
      .where({ id_participante })
      .select('id_manifestacion', 'respuesta');
  }

  /**
   * Genera un folio único y secuencial usando bloqueos a nivel de tabla de SQL Server.
   * Debe ejecutarse obligatoriamente dentro de una transacción.
   */
  async generarFolioSeguro(id_participante, id_categoria, id_convocatoria, trx) {
    if (!trx) {
      throw new Error('La generación de folio requiere una transacción activa.');
    }

    // 1. Obtener la categoría para extraer el número (ej. "Categoría 1 (15 a 17 años)" -> "1")
    const categoriaRow = await trx('cat_categorias').where({ id_categoria }).first();
    if (!categoriaRow) {
      throw new Error('Categoría no encontrada para el participante.');
    }

    const match = categoriaRow.nombre.match(/\d+/);
    const catCode = match ? match[0] : id_categoria;

    // 2. Consultar el total de folios asignados con bloqueo de actualización y bloqueo de tabla (UPDLOCK, HOLDLOCK)
    const countRes = await trx.raw(`
      SELECT COUNT(id_participante) as numero 
      FROM participantes WITH (UPDLOCK, HOLDLOCK) 
      WHERE folio IS NOT NULL 
        AND id_categoria = ? 
        AND id_convocatoria = ?
    `, [id_categoria, id_convocatoria]);

    let num = (countRes[0] ? parseInt(countRes[0].numero, 10) : 0) + 1;
    let folioCandidato = `CE${catCode}-${num}`;

    // 3. Ciclo de verificación de existencia para evitar cualquier colisión potencial
    let exists = true;
    while (exists) {
      const existRes = await trx('participantes')
        .where({ folio: folioCandidato })
        .count('id_participante as count')
        .first();

      const count = parseInt(existRes.count || existRes.count === 0 ? existRes.count : 0, 10);
      if (count > 0) {
        num++;
        folioCandidato = `CE${catCode}-${num}`;
      } else {
        exists = false;
      }
    }

    return folioCandidato;
  }
}

module.exports = new ParticipantesRepository();
