<template>
  <div class="min-h-[100dvh] flex items-center justify-center bg-slate-950 p-6">
    <div class="glass-card max-w-lg w-full p-8 rounded-2xl border border-white/10 text-center">
      <h2 class="text-3xl font-extrabold text-white mb-2 tracking-tight">Panel de Acceso</h2>
      <p class="text-brand-primary font-mono text-sm tracking-wider uppercase mb-6">{{ roleName }}</p>
      
      <div class="bg-slate-900/50 rounded-xl p-6 border border-white/5 mb-8 text-left space-y-3">
        <p class="text-slate-300 text-sm"><strong>Nombre:</strong> {{ authStore.user?.nombre }} {{ authStore.user?.apellido_pat }}</p>
        <p class="text-slate-300 text-sm"><strong>Usuario:</strong> {{ authStore.user?.usuario }}</p>
        <p class="text-slate-300 text-sm"><strong>Correo:</strong> {{ authStore.user?.correo }}</p>
      </div>

      <div class="bg-slate-900/80 border-l-4 border-yellow-500 p-4 rounded-r-xl mb-6 text-left">
        <p class="text-yellow-400 font-bold text-xs uppercase tracking-wide">Acceso Limitado - Fase 1</p>
        <p class="text-slate-400 text-xs mt-1 leading-relaxed">
          Tu cuenta ha sido autenticada exitosamente. Las interfaces operacionales correspondientes a tu perfil de {{ roleName }} se habilitarán en la siguiente etapa.
        </p>
      </div>

      <button @click="logout" class="btn-tactile bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3 px-6 rounded-xl w-full cursor-pointer">
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const roleName = computed(() => {
  const rol = authStore.rol;
  if (rol === 1) return 'Participante';
  if (rol === 2) return 'Admin (Validador)';
  if (rol === 3) return 'Juez';
  if (rol === 4) return 'Superadmin';
  return 'Usuario';
});

onMounted(() => {
  const rol = authStore.rol;
  if (rol === 1) {
    router.push('/participante/dashboard');
  } else if (rol === 2) {
    router.push('/admin/validacion');
  } else if (rol === 3) {
    router.push('/juez/evaluacion');
  } else if (rol === 4) {
    router.push('/superadmin/usuarios');
  }
});


const logout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>
