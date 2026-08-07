const STORAGE_TOKEN_KEY = 'token';
const STORAGE_USER_KEY = 'user';

import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(STORAGE_TOKEN_KEY) || null,
    user: (() => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_USER_KEY)) || null;
      } catch (e) {
        return null;
      }
    })()
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    rol: (state) => state.user?.id_tipousuario || null,
    nombreCompleto: (state) => state.user ? `${state.user.nombre} ${state.user.apellido_pat}`.trim() : ''
  },

  actions: {
    async login(usuario, contrasena) {
      try {
        const response = await api.post('/auth/login', { usuario, contrasena });
        const { token, usuario: userData } = response.data;
        
        this.token = token;
        this.user = userData;
        
        localStorage.setItem(STORAGE_TOKEN_KEY, token);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
        
        return { success: true };
      } catch (error) {
        const msg = error.response?.data?.error || 'Error al iniciar sesión.';
        throw new Error(msg);
      }
    },

    async registerParticipante(datosFormulario) {
      try {
        const response = await api.post('/auth/registro', datosFormulario);
        return response.data;
      } catch (error) {
        const msg = error.response?.data?.error || 'Error al completar el registro.';
        throw new Error(msg);
      }
    },

    async logout() {
      try {
        if (this.token) {
          await api.post('/auth/logout');
        }
      } catch (err) {
        console.error('Error durante el cierre de sesión en API:', err.message);
      } finally {
        this.clearSession();
      }
    },

    clearSession() {
      this.token = null;
      this.user = null;
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem('token_original');
      localStorage.removeItem('user_original');
    },

    iniciarImpersonacion(targetToken, targetUser) {
      // Guardar el superadmin original para poder regresar
      localStorage.setItem('token_original', this.token);
      localStorage.setItem('user_original', JSON.stringify(this.user));

      // Asignar el token e identidad del participante suplantado
      this.token = targetToken;
      this.user = {
        ...targetUser,
        isImpersonated: true
      };

      localStorage.setItem(STORAGE_TOKEN_KEY, targetToken);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(this.user));
    },

    async terminarImpersonacion() {
      const tokenOriginal = localStorage.getItem('token_original');
      const userOriginalRaw = localStorage.getItem('user_original');

      if (tokenOriginal && userOriginalRaw) {
        const id_usuario_target = this.user.id_usuario;

        try {
          // Usar el token del superadmin original en esta peticion
          await api.post('/superadmin/impersonar/terminar', { id_usuario_target }, {
            headers: {
              'Authorization': `Bearer ${tokenOriginal}`
            }
          });
        } catch (err) {
          console.error('Error al terminar impersonación en backend:', err.message);
        }

        // Restablecer sesión del superadmin original
        const userOriginal = JSON.parse(userOriginalRaw);
        this.token = tokenOriginal;
        this.user = userOriginal;

        localStorage.setItem(STORAGE_TOKEN_KEY, tokenOriginal);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userOriginal));

        localStorage.removeItem('token_original');
        localStorage.removeItem('user_original');
      } else {
        this.clearSession();
      }
    }
  }
});
