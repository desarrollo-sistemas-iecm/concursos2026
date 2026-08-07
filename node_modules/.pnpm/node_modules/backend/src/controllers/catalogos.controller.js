const catalogoService = require('../services/catalogo.service');

class CatalogosController {
  async obtenerAlcaldias(req, res, next) {
    try {
      const alcaldias = await catalogoService.obtenerAlcaldias();
      res.status(200).json(alcaldias);
    } catch (err) {
      next(err);
    }
  }

  async obtenerTeEnteraste(req, res, next) {
    try {
      const opciones = await catalogoService.obtenerTeEnteraste();
      res.status(200).json(opciones);
    } catch (err) {
      next(err);
    }
  }

  async obtenerManifestaciones(req, res, next) {
    try {
      const manifestaciones = await catalogoService.obtenerManifestaciones();
      res.status(200).json(manifestaciones);
    } catch (err) {
      next(err);
    }
  }

  async obtenerCategorias(req, res, next) {
    try {
      const categorias = await catalogoService.obtenerCategoriasActivas();
      res.status(200).json(categorias);
    } catch (err) {
      next(err);
    }
  }

  async obtenerConvocatoriaActiva(req, res, next) {
    try {
      const convocatoria = await catalogoService.obtenerConvocatoriaActiva();
      res.status(200).json(convocatoria);
    } catch (err) {
      next(err);
    }
  }

  async obtenerTemaConfiguracion(req, res, next) {
    try {
      const catalogosRepository = require('../repositories/catalogos.repository');
      const tema = await catalogosRepository.getTema();
      res.status(200).json(tema);
    } catch (err) {
      next(err);
    }
  }

  async obtenerRequisitosActivos(req, res, next) {
    try {
      const db = require('../config/db');
      const convActiva = await db('convocatorias').where({ status: 1 }).first() || await db('convocatorias').orderBy('id_convocatoria', 'desc').first();
      const id_convocatoria = convActiva ? convActiva.id_convocatoria : 1;

      const requisitos = await db('cat_requisitos_documentos')
        .where({ id_convocatoria, status: 1 })
        .orderBy('orden', 'asc');

      res.status(200).json(requisitos);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CatalogosController();
