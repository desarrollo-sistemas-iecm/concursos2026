<template>
  <div class="relative font-sans z-50" ref="campanaRef">
    <!-- Icono Campana con Touch Target de 44px -->
    <button
      @click="toggleDropdown"
      class="relative min-w-[44px] min-h-[44px] p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5 flex items-center justify-center"
      aria-label="Notificaciones"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <!-- Puntito Verde Resplandeciente de No Leídas -->
      <span
        v-if="notifStore.noLeidasCount > 0"
        class="absolute top-1.5 right-1.5 flex h-3.5 w-3.5"
      >
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
        <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 ring-2 ring-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.95)]"></span>
      </span>
    </button>

    <!-- Dropdown de Notificaciones Adaptado a Pantalla (Hacia arriba o abajo según prop) -->
    <div
      v-if="abierto"
      :class="[
        'absolute right-0 w-80 max-w-[calc(100vw-1.5rem)] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-[9999] overflow-hidden glass-card text-left transition-all duration-200',
        posicion === 'arriba' ? 'bottom-full mb-3' : 'top-full mt-2.5'
      ]"
    >
      <div class="p-4 border-b border-white/5 flex justify-between items-center bg-slate-950/40">
        <div class="flex items-center gap-2">
          <span class="text-xs font-black text-white uppercase tracking-wider">Notificaciones</span>
          <span v-if="notifStore.noLeidasCount > 0" class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
            {{ notifStore.noLeidasCount }} nueva{{ notifStore.noLeidasCount > 1 ? 's' : '' }}
          </span>
        </div>
        <button
          v-if="notifStore.noLeidasCount > 0"
          @click="marcarTodasLeidas"
          class="text-[10px] text-emerald-400 hover:underline font-bold cursor-pointer"
        >
          Marcar todo leído
        </button>
      </div>

      <!-- Lista de Notificaciones -->
      <div class="max-h-72 overflow-y-auto divide-y divide-white/5">
        <div
          v-for="n in notifStore.notificacionesOrdenadas"
          :key="n.id_notificacion"
          @click="leerNotificacion(n)"
          class="p-4 hover:bg-white/5 cursor-pointer transition-colors duration-150 relative flex gap-3 items-start"
          :class="!n.leido || Number(n.leido) === 0 ? 'bg-emerald-500/[0.04] border-l-2 border-emerald-500' : ''"
        >
          <!-- Indicador de No Leído -->
          <div class="mt-1">
            <span
              v-if="!n.leido || Number(n.leido) === 0"
              class="block w-2.5 h-2.5 bg-emerald-400 rounded-full ring-4 ring-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
            ></span>
            <span
              v-else
              class="block w-2.5 h-2.5 bg-slate-700 rounded-full"
            ></span>
          </div>

          <div class="flex-grow space-y-1">
            <div class="flex justify-between items-start gap-1">
              <span class="block text-xs font-bold text-white leading-tight pr-2">{{ n.asunto }}</span>
              <span class="text-[9px] text-slate-500 font-mono shrink-0">{{ formatFecha(n.fecha_alta) }}</span>
            </div>
            <p class="text-[11px] text-slate-450 leading-relaxed">{{ n.mensaje }}</p>
            <span class="block text-[8px] text-slate-550 font-bold uppercase tracking-wider">
              Enviado por: {{ n.remitente_nombre }}
            </span>
          </div>
        </div>

        <div v-if="notifStore.notificaciones.length === 0" class="py-10 text-center text-slate-500 italic text-xs">
          No tienes notificaciones recibidas.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useNotificacionesStore } from '../stores/notificaciones.store';

const props = defineProps({
  posicion: {
    type: String,
    default: 'abajo'
  }
});

const notifStore = useNotificacionesStore();
const abierto = ref(false);
const campanaRef = ref(null);

const toggleDropdown = () => {
  abierto.value = !abierto.value;
  if (abierto.value) {
    notifStore.cargarNotificaciones();
  }
};

const leerNotificacion = async (n) => {
  if (!n.leido || Number(n.leido) === 0) {
    await notifStore.marcarComoLeida(n.id_notificacion);
  }
};

const marcarTodasLeidas = async () => {
  for (const n of notifStore.notificaciones) {
    if (!n.leido || Number(n.leido) === 0) {
      await notifStore.marcarComoLeida(n.id_notificacion);
    }
  }
};

const clickAfuera = (event) => {
  if (campanaRef.value && !campanaRef.value.contains(event.target)) {
    abierto.value = false;
  }
};

const formatFecha = (timeStr) => {
  if (!timeStr) return '';
  const d = new Date(timeStr);
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
};

onMounted(() => {
  notifStore.cargarNotificaciones();
  notifStore.conectarNotificacionesSocket();
  document.addEventListener('click', clickAfuera);
});

onUnmounted(() => {
  document.removeEventListener('click', clickAfuera);
});
</script>

<style scoped>
.glass-card {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
</style>
