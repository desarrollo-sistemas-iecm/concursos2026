const db = require('../config/db');

class CatalogosRepository {
  async getTiposUsuario() {
    return db('cat_tipousuarios').where({ status: 1 }).orderBy('id_tipousuario', 'asc');
  }

  async getAlcaldias() {
    return db('cat_alcaldias').where({ status: 1 }).orderBy('nombre', 'asc');
  }

  async getTeEnteraste() {
    return db('cat_te_enteraste').where({ status: 1 }).orderBy('id_te_enteraste', 'asc');
  }

  async getManifestaciones() {
    return db('cat_manifestaciones').where({ status: 1 }).orderBy('orden', 'asc');
  }

  async getCategoriasByConvocatoria(id_convocatoria) {
    return db('cat_categorias')
      .where({ id_convocatoria, status: 1 })
      .orderBy('edad_min', 'asc');
  }

  async getConvocatoriaActiva() {
    return db('convocatorias')
      .where({ status: 1 })
      .orderBy('anio', 'desc')
      .first();
  }

  async findConvocatoriaByAnio(anio) {
    return db('convocatorias').where({ anio }).first();
  }

  async findCategoriaById(id_categoria) {
    return db('cat_categorias').where({ id_categoria }).first();
  }

  async getTema() {
    const tema = await db('configuracion_tema').first();
    if (!tema) {
      return {
        sidebar_bg: '#0f172a',
        sidebar_text: '#94a3b8',
        sidebar_active_bg: '#14b8a620',
        sidebar_active_text: '#14b8a6',
        header_bg: '#020617',
        header_text: '#ffffff',
        primary_color: '#14b8a6',
        primary_text: '#020617',
        primary_hover: '#0d9488'
      };
    }
    return tema;
  }
}

module.exports = new CatalogosRepository();
