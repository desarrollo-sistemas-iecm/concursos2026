import { defineStore } from 'pinia';
import api from '../services/api';

export const useConvocatoriaStore = defineStore('convocatoria', {
  state: () => ({
    convocatoriaActiva: null,
    categoriasActivas: [],
    cargando: false
  }),
  getters: {
    nombre: (state) => state.convocatoriaActiva?.nombre || 'Concurso Juvenil de Ensayo 2026',
    lema: (state) => state.convocatoriaActiva?.lema || 'Conversando con los clásicos',
    anio: (state) => state.convocatoriaActiva?.anio || 2026,
    fechaInicio: (state) => state.convocatoriaActiva?.fecha_inicio || null,
    fechaFin: (state) => state.convocatoriaActiva?.fecha_fin || null,
    ventanaRegistro: (state) => {
      if (!state.convocatoriaActiva || Number(state.convocatoriaActiva.status) === 0 || state.convocatoriaActiva.id_convocatoria === null) {
        return {
          estado: 'SIN_CONVOCATORIA_ACTIVA',
          valido: false,
          mensaje: 'No hay ninguna convocatoria abierta actualmente.'
        };
      }
      
      if (state.convocatoriaActiva.ventana_registro) {
        return state.convocatoriaActiva.ventana_registro;
      }

      const normalizarFecha = (val) => {
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
      };

      const inicioStr = normalizarFecha(state.convocatoriaActiva.fecha_inicio);
      const finStr = normalizarFecha(state.convocatoriaActiva.fecha_fin);
      const ahora = new Date();

      if (!inicioStr || !finStr) {
        return {
          estado: 'ACTIVO',
          valido: true,
          mensaje: 'El periodo de registro está activo.'
        };
      }

      const [iAnio, iMes, iDia] = inicioStr.split('-').map(Number);
      const fechaInicio = new Date(iAnio, iMes - 1, iDia, 0, 0, 0, 0);

      const [fAnio, fMes, fDia] = finStr.split('-').map(Number);
      const fechaFin = new Date(fAnio, fMes - 1, fDia, 23, 59, 59, 999);

      const formatearFecha = (str) => {
        if (!str) return '';
        const [a, m, d] = str.split('-').map(Number);
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        return `${d} de ${meses[m - 1]} de ${a}`;
      };

      if (ahora < fechaInicio) {
        return {
          estado: 'ANTES_DE_INICIO',
          valido: false,
          fecha_inicio_texto: formatearFecha(inicioStr),
          mensaje: `El periodo de registro aún no comienza. El registro abre el ${formatearFecha(inicioStr)}.`
        };
      }

      if (ahora > fechaFin) {
        return {
          estado: 'DESPUES_DE_FIN',
          valido: false,
          fecha_fin_texto: formatearFecha(finStr),
          mensaje: `El periodo de registro para esta convocatoria ha finalizado el ${formatearFecha(finStr)}.`
        };
      }

      return {
        estado: 'ACTIVO',
        valido: true,
        mensaje: 'El periodo de registro está activo.'
      };
    }
  },
  actions: {
    async cargarConvocatoriaActiva(forzar = false) {
      if (this.convocatoriaActiva && !forzar) return;
      this.cargando = true;
      try {
        const [resConv, resCats] = await Promise.all([
          api.get('/catalogos/convocatoria-activa'),
          api.get('/catalogos/categorias')
        ]);
        this.convocatoriaActiva = resConv.data;
        this.categoriasActivas = resCats.data;
      } catch (err) {
        console.warn('Error al cargar la convocatoria activa:', err.message);
      } finally {
        this.cargando = false;
      }
    }
  }
});
