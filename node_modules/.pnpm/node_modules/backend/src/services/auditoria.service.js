const bitacoraRepository = require('../repositories/bitacora.repository');

class AuditoriaService {
  async registrarAccion(id_usuario, accion, entidad = null, id_entidad = null, detalle = null, ip_origen = null) {
    return bitacoraRepository.registrar(id_usuario, accion, entidad, id_entidad, detalle, ip_origen);
  }
}

module.exports = new AuditoriaService();
