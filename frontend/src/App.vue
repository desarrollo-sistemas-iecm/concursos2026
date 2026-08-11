<template>
  <div class="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 relative">
    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useAuthStore } from './stores/auth.store';
import { useSesionesStore } from './stores/sesiones.store';
import { useThemeStore } from './stores/theme.store';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const sesionesStore = useSesionesStore();
const themeStore = useThemeStore();
const router = useRouter();

const handleAuthInvalidated = (event) => {
  authStore.clearSession();
  sesionesStore.desconectarSocket();
  
  const mensajeMsg = event.detail || '';
  const esAccesoCerrado = mensajeMsg.toLowerCase().includes('cerrado') || mensajeMsg.toLowerCase().includes('habiliten') || mensajeMsg.toLowerCase().includes('periodo de acceso');

  Swal.fire({
    icon: esAccesoCerrado ? 'info' : 'warning',
    title: esAccesoCerrado ? 'Inicio de Sesión Cerrado' : 'Sesión Inválida',
    text: mensajeMsg || 'Se ha cerrado tu sesión debido a un nuevo inicio de sesión en otra ubicación.',
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#10b981',
    background: '#0f172a',
    color: '#fff',
    allowOutsideClick: false,
    allowEscapeKey: false
  }).then(() => {
    router.push('/login');
  });
};

onMounted(() => {
  themeStore.cargarTema();
  // Cargar preferencia de tema claro/oscuro (por defecto oscuro)
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');

  // Escuchar la señal global de invalidación de sesión
  window.addEventListener('auth-invalidated', handleAuthInvalidated);
  
  // Si ya hay sesión activa al recargar la página, volver a conectar el socket
  if (authStore.isAuthenticated) {
    sesionesStore.conectarSocket();
  }
});

onUnmounted(() => {
  window.removeEventListener('auth-invalidated', handleAuthInvalidated);
});
</script>

<style>
/* Animaciones de cambio de página fluidas y rápidas (Diseño Emil Kowalski) */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 180ms cubic-bezier(0.23, 1, 0.32, 1);
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
