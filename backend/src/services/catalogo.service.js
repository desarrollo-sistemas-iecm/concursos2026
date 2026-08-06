const catalogosRepository = require('../repositories/catalogos.repository');

class CatalogoService {
  async obtenerAlcaldias() {
    return catalogosRepository.getAlcaldias();
  }

  async obtenerTeEnteraste() {
    return catalogosRepository.getTeEnteraste();
  }

  async obtenerManifestaciones() {
    return catalogosRepository.getManifestaciones();
  }

  normalizarFecha(val) {
    if (!val) return null;
    if (val instanceof Date) {
      if (isNaN(val.getTime())) return null;
      const yyyy = val.getUTCFullYear();
      const mm = String(val.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(val.getUTCDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
    const str = String(val).trim();
    if (str.includes('-')) {
      const part = str.split('T')[0].split(' ')[0];
      const match = part.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (match) return part;
    }
    if (str.includes('/')) {
      const parts = str.split('/');
      if (parts.length === 3) {
        const [d, m, a] = parts.map(s => s.trim());
        if (a.length === 4) {
          return `${a}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        }
      }
    }
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(d.getUTCDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
    return null;
  }

  formatearFechaTexto(fechaVal) {
    const cleanStr = this.normalizarFecha(fechaVal);
    if (!cleanStr) return '';
    const [a, m, d] = cleanStr.split('-').map(Number);
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${d} de ${meses[m - 1]} de ${a}`;
  }

  evaluarVentanaRegistro(convocatoria) {
    if (!convocatoria || Number(convocatoria.status) !== 1) {
      return {
        estado: 'SIN_CONVOCATORIA_ACTIVA',
        valido: false,
        mensaje: 'No hay ninguna convocatoria abierta actualmente.'
      };
    }

    const ahora = new Date();

    const inicioStr = this.normalizarFecha(convocatoria.fecha_inicio);
    const finStr = this.normalizarFecha(convocatoria.fecha_fin);

    if (!inicioStr || !finStr) {
      return {
        estado: 'ACTIVO',
        valido: true,
        mensaje: 'Periodo sin fecha definida.'
      };
    }

    const [iAnio, iMes, iDia] = inicioStr.split('-').map(Number);
    const fechaInicio = new Date(iAnio, iMes - 1, iDia, 0, 0, 0, 0);

    const [fAnio, fMes, fDia] = finStr.split('-').map(Number);
    const fechaFin = new Date(fAnio, fMes - 1, fDia, 23, 59, 59, 999);

    if (ahora < fechaInicio) {
      const fechaFormat = this.formatearFechaTexto(inicioStr);
      return {
        estado: 'ANTES_DE_INICIO',
        valido: false,
        fecha_inicio: inicioStr,
        fecha_fin: finStr,
        fecha_inicio_texto: fechaFormat,
        mensaje: `El periodo de registro aún no comienza. El registro abre el ${fechaFormat}.`
      };
    }

    if (ahora > fechaFin) {
      const fechaFormat = this.formatearFechaTexto(finStr);
      return {
        estado: 'DESPUES_DE_FIN',
        valido: false,
        fecha_inicio: inicioStr,
        fecha_fin: finStr,
        fecha_fin_texto: fechaFormat,
        mensaje: `El periodo de registro para esta convocatoria ha finalizado el ${fechaFormat}.`
      };
    }

    return {
      estado: 'ACTIVO',
      valido: true,
      fecha_inicio: inicioStr,
      fecha_fin: finStr,
      mensaje: 'El periodo de registro está activo.'
    };
  }

  async obtenerConvocatoriaActiva() {
    const convocatoria = await catalogosRepository.getConvocatoriaActiva();
    if (!convocatoria) {
      return {
        id_convocatoria: null,
        nombre: 'Sin Convocatoria Activa',
        anio: new Date().getFullYear(),
        status: 0,
        ventana_registro: {
          estado: 'SIN_CONVOCATORIA_ACTIVA',
          valido: false,
          mensaje: 'No hay ninguna convocatoria abierta actualmente.'
        }
      };
    }

    const ventana_registro = this.evaluarVentanaRegistro(convocatoria);
    return {
      ...convocatoria,
      ventana_registro
    };
  }

  async obtenerCategoriasActivas() {
    const convocatoria = await catalogosRepository.getConvocatoriaActiva();
    if (!convocatoria) return [];
    return catalogosRepository.getCategoriasByConvocatoria(convocatoria.id_convocatoria);
  }
}

module.exports = new CatalogoService();
