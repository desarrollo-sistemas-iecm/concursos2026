import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { useAuthStore } from './auth.store';
import Swal from 'sweetalert2';
import router from '../router';
import api from '../services/api';

export const useSesionesStore = defineStore('sesiones', {
  state: () => ({
    socket: null,
    sesionesActivas: []
  }),

  actions: {
    conectarSocket() {
      const authStore = useAuthStore();
      if (!authStore.token) return;

      // Desconectar cualquier conexión previa existente
      if (this.socket) {
        this.socket.disconnect();
      }

      const socketUrl = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') 
        : window.location.origin;

      // Conexión por socket dinámica
      this.socket = io(socketUrl, {
        auth: {
          token: authStore.token
        }
      });

      // Capturar cierre forzado de sesión
      this.socket.on('logout_forced', (data) => {
        authStore.clearSession();
        this.desconectarSocket();
        
        Swal.fire({
          icon: 'warning',
          title: 'Sesión Finalizada',
          text: data.reason || 'Tu sesión ha sido cerrada en esta ventana.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#10b981', // Verde esmeralda corporativo
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(() => {
          router.push('/login');
        });
      });

      this.socket.on('connect_error', (err) => {
        console.error('Error de conexión con Socket.io:', err.message);
      });

      // Escuchar actualización de sesiones activas (exclusivo para Superadmin)
      this.socket.on('sesiones_actualizadas', (list) => {
        this.sesionesActivas = list;
      });
    },

    desconectarSocket() {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
      this.sesionesActivas = [];
    },

    async forzarLogoutGlobal() {
      try {
        await api.post('/auth/forzar-logout-global');
        Swal.fire({
          icon: 'success',
          title: 'Cierre Global',
          text: 'Se han cerrado todas las sesiones activas en el sistema.',
          confirmButtonColor: '#10b981'
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.error || 'No se pudo cerrar las sesiones.',
          confirmButtonColor: '#f43f5e'
        });
      }
    }
  }
});
