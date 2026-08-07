const db = require('../config/db');

class CalificacionesRepository {
  async findById(id_calificacion) {
    return db('calificaciones').where({ id_calificacion }).first();
  }

  async findByParticipanteAndJuez(id_participante, id_juez) {
    return db('calificaciones')
      .where({ id_participante, id_juez })
      .first();
  }

  /**
   * Obtiene la lista de ensayos validados anonimizados, junto con un indicador
   * de si el juez logueado ya los calificó.
   */
  async getEnsayosValidadosParaJuez(id_convocatoria, id_juez) {
    return db('participantes as p')
      .leftJoin('calificaciones as cal', function() {
        this.on('p.id_participante', '=', 'cal.id_participante')
            .andOn('cal.id_juez', '=', db.raw('?', [id_juez]));
      })
      .join('cat_categorias as c', 'p.id_categoria', 'c.id_categoria')
      .where('p.id_convocatoria', id_convocatoria)
      .andWhere('p.status_ensayo', 1) // Únicamente los ensayos validados
      .select(
        'p.id_participante',
        'p.folio',
        'p.seudonimo',
        'p.titulo_ensayo',
        'p.archivo_ensayo',
        'c.nombre as categoria_nombre',
        'cal.id_calificacion',
        'cal.califica1',
        'cal.califica2',
        'cal.califica3',
        'cal.califica4',
        'cal.califica5',
        'cal.califica6',
        'cal.total',
        'cal.observaciones as cal_observaciones',
        'cal.fecha_alta as fecha_evaluacion',
        db.raw('CASE WHEN cal.id_calificacion IS NOT NULL THEN 1 ELSE 0 END as evaluado')
      )
      .orderBy('p.folio', 'asc');
  }

  async create(calificacionData, trx = null) {
    const q = trx || db;
    const cols = Object.keys(calificacionData).map(c => `[${c}]`).join(', ');
    const vals = Object.values(calificacionData);
    const placeholders = vals.map(() => '?').join(', ');
    const result = await q.raw(
      `INSERT INTO [calificaciones] (${cols}) OUTPUT INSERTED.[id_calificacion] VALUES (${placeholders})`,
      vals
    );
    const id_calificacion = result[0]?.id_calificacion;
    return { ...calificacionData, id_calificacion };
  }
}

module.exports = new CalificacionesRepository();
