<template>
  <div class="space-y-6 max-w-4xl mx-auto">
      <div class="border-b border-slate-200 dark:border-white/5 pb-4">
        <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Reportería & Exportaciones Excel</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Generación de archivos Excel formateados para auditoría y comités evaluadores</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Reporte 1: Todos los Registrados -->
        <div class="bg-white/80 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col justify-between backdrop-blur-xl transition-colors shadow-sm space-y-4">
          <div class="space-y-2">
            <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Reporte de Registrados</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Exporta la lista completa de personas registradas en el sistema con sus datos de contacto y estatus de ensayo.
            </p>
          </div>
          <button
            @click="descargarExcel('registrados')"
            :disabled="descargando"
            class="btn-tactile w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar Excel
          </button>
        </div>

        <!-- Reporte 2: Ensayos Validados con Folio -->
        <div class="bg-white/80 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col justify-between backdrop-blur-xl transition-colors shadow-sm space-y-4">
          <div class="space-y-2">
            <div class="w-10 h-10 rounded-2xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20 flex items-center justify-center font-bold">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Reporte de Validados</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Exporta únicamente las propuestas aprobadas que cuentan con folio asignado oficial.
            </p>
          </div>
          <button
            @click="descargarExcel('validados')"
            :disabled="descargando"
            class="btn-tactile w-full bg-brand-primary hover:bg-teal-300 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar Excel
          </button>
        </div>

        <!-- Reporte 3: Calificaciones del Jurado -->
        <div class="bg-white/80 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col justify-between backdrop-blur-xl transition-colors shadow-sm space-y-4">
          <div class="space-y-2">
            <div class="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
              <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Reporte de Calificaciones</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Exporta las evaluaciones capturadas por los jueces con el desglose de los 6 criterios y promedios.
            </p>
          </div>
          <button
            @click="descargarExcel('calificaciones')"
            :disabled="descargando"
            class="btn-tactile w-full bg-purple-500 hover:bg-purple-400 text-white font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar Excel
          </button>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const descargando = ref(false);

const descargarExcel = (tipo) => {
  descargando.value = true;
  try {
    const url = `/api/admin/reportes/excel?tipo=${tipo}&token=${authStore.token}`;
    window.open(url, '_blank');
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error de exportación',
      text: err.message || 'No se pudo generar el reporte en Excel.',
      confirmButtonColor: '#f43f5e'
    });
  } finally {
    descargando.value = false;
  }
};
</script>
