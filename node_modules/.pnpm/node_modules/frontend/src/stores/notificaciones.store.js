import { defineStore } from 'pinia';
import api from '../services/api';
import { useSesionesStore } from './sesiones.store';
import Swal from 'sweetalert2';

export const useNotificacionesStore = defineStore('notificaciones', {
  state: () => ({
    notificaciones: [],
    cargando: false
  }),

  getters: {
    noLeidasCount: (state) => state.notificaciones.filter(n => !n.leido || Number(n.leido) === 0).length,
    notificacionesOrdenadas: (state) => state.notificaciones
  },

  actions: {
    async cargarNotificaciones() {
      this.cargando = true;
      try {
        const res = await api.get('/notificaciones');
        this.notificaciones = res.data;
      } catch (err) {
        console.error('Error al cargar notificaciones:', err.message);
      } finally {
        this.cargando = false;
      }
    },

    async marcarComoLeida(id_notificacion) {
      try {
        await api.post('/notificaciones/marcar-leida', { id_notificacion });
        const notif = this.notificaciones.find(n => n.id_notificacion === id_notificacion);
        if (notif) {
          notif.leido = 1;
        }
      } catch (err) {
        console.error('Error al marcar leída:', err.message);
      }
    },

    async enviarNotificacion(datos) {
      try {
        const res = await api.post('/notificaciones/crear', datos);
        return res.data;
      } catch (err) {
        const msg = err.response?.data?.error || 'No se pudo enviar la notificación.';
        throw new Error(msg);
      }
    },

    conectarNotificacionesSocket() {
      const sesionesStore = useSesionesStore();
      sesionesStore.conectarSocket();
      
      if (sesionesStore.socket) {
        // Remover listeners previos para evitar duplicados
        sesionesStore.socket.off('notificacion_nueva');

        sesionesStore.socket.on('notificacion_nueva', (notif) => {
          this.notificaciones.unshift({
            ...notif,
            leido: 0
          });

          // Notificación visual de toast no intrusiva
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'info',
            title: notif.asunto,
            text: notif.mensaje.length > 60 ? notif.mensaje.substring(0, 57) + '...' : notif.mensaje,
            showConfirmButton: false,
            timer: 4500,
            timerProgressBar: true,
            background: '#0f172a',
            color: '#f8fafc'
          });
        });
      }
    }
  }
});
