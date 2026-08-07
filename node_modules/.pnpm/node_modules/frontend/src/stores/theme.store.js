import { defineStore } from 'pinia';
import api from '../services/api';

export const useThemeStore = defineStore('themeCustomizer', {
  state: () => ({
    theme: {
      sidebar_bg: '#1B1133',
      sidebar_text: '#C7B3DC',
      sidebar_active_bg: '#8C65AA',
      sidebar_active_text: '#ffffff',
      header_bg: '#110922',
      header_text: '#ffffff',
      primary_color: '#8C65AA',
      primary_text: '#ffffff',
      primary_hover: '#795397'
    },
    cargando: false
  }),
  actions: {
    aplicarVariablesCSS(customTheme = null) {
      const t = customTheme || this.theme;
      const root = document.documentElement;

      root.style.setProperty('--custom-sidebar-bg', t.sidebar_bg);
      root.style.setProperty('--custom-sidebar-text', t.sidebar_text);
      root.style.setProperty('--custom-sidebar-active-bg', t.sidebar_active_bg);
      root.style.setProperty('--custom-sidebar-active-text', t.sidebar_active_text);
      root.style.setProperty('--custom-header-bg', t.header_bg);
      root.style.setProperty('--custom-header-text', t.header_text);
      root.style.setProperty('--custom-primary', t.primary_color);
      root.style.setProperty('--custom-primary-text', t.primary_text);
      root.style.setProperty('--custom-primary-hover', t.primary_hover);
    },

    async cargarTema() {
      try {
        const res = await api.get('/catalogos/tema');
        if (res.data) {
          this.theme = { ...this.theme, ...res.data };
          this.aplicarVariablesCSS();
        }
      } catch (err) {
        console.warn('Error al cargar la configuración de colores:', err.message);
        this.aplicarVariablesCSS();
      }
    },

    async guardarTema(nuevoTema) {
      this.cargando = true;
      try {
        const res = await api.post('/superadmin/tema', nuevoTema);
        if (res.data && res.data.tema) {
          this.theme = { ...this.theme, ...res.data.tema };
          this.aplicarVariablesCSS();
        }
        return res.data;
      } finally {
        this.cargando = false;
      }
    }
  }
});
