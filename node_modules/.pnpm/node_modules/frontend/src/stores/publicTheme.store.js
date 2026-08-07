import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const usePublicThemeStore = defineStore('publicTheme', () => {
  // Cargar modo guardado en localStorage o por defecto 'dark'
  const modoGuardado = localStorage.getItem('iecm_public_theme') || 'dark';
  const modo = ref(modoGuardado);

  const isDark = computed(() => modo.value === 'dark');

  const toggleModo = () => {
    modo.value = modo.value === 'dark' ? 'light' : 'dark';
    localStorage.setItem('iecm_public_theme', modo.value);
  };

  const setModo = (nuevoModo) => {
    if (['dark', 'light'].includes(nuevoModo)) {
      modo.value = nuevoModo;
      localStorage.setItem('iecm_public_theme', nuevoModo);
    }
  };

  return {
    modo,
    isDark,
    toggleModo,
    setModo
  };
});
