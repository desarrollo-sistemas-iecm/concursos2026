<template>
  <div class="space-y-8">
      <!-- Header y Selector de Convocatoria -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Estadísticas & Métricas Globales</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Análisis cuantitativo de participación, validación y evaluación</p>
        </div>
        
        <div class="flex items-center gap-3">
          <label class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase font-mono">Convocatoria:</label>
          <select 
            v-model="idConvocatoriaSel" 
            @change="cargarEstadisticas"
            class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-bold rounded-xl py-2 px-4 text-xs outline-none cursor-pointer shadow-sm transition-colors"
          >
            <option v-for="c in convocatorias" :key="c.id_convocatoria" :value="c.id_convocatoria">
              {{ c.anio }} — {{ c.nombre }} {{ c.status === 1 ? '(Activa)' : '' }}
            </option>
          </select>
        </div>
      </div>

      <!-- Tarjetas de Métricas Principales con TailAdmin Radial Progress -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <!-- Registrados -->
        <div class="bg-white/80 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center justify-between text-center backdrop-blur-xl hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm space-y-3">
          <span class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest font-mono">Registrados</span>

          <div class="relative w-20 h-20 flex items-center justify-center">
            <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-slate-200 dark:text-slate-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-slate-900 dark:text-white" stroke-width="3" stroke-dasharray="100, 100" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute flex flex-col items-center justify-center leading-none">
              <span class="text-xl font-black text-slate-900 dark:text-white font-mono">{{ datos.totales.registrados }}</span>
              <span class="text-[9px] font-bold text-slate-500 dark:text-slate-400 font-mono mt-0.5">100%</span>
            </div>
          </div>

          <span class="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Participantes Totales</span>
        </div>

        <!-- Sin Archivo -->
        <div class="bg-white/80 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center justify-between text-center backdrop-blur-xl hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm space-y-3">
          <span class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest font-mono">Sin Archivo</span>

          <div class="relative w-20 h-20 flex items-center justify-center">
            <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-slate-200 dark:text-slate-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-amber-500 dark:text-amber-400 transition-all duration-700 ease-out" stroke-width="3" :stroke-dasharray="`${porcentaje(datos.totales.sin_archivo, datos.totales.registrados)}, 100`" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute flex flex-col items-center justify-center leading-none">
              <span class="text-xl font-black text-amber-500 dark:text-amber-400 font-mono">{{ datos.totales.sin_archivo }}</span>
              <span class="text-[9px] font-bold text-slate-500 dark:text-slate-400 font-mono mt-0.5">{{ porcentaje(datos.totales.sin_archivo, datos.totales.registrados) }}%</span>
            </div>
          </div>

          <span class="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Ensayo Pendiente</span>
        </div>

        <!-- Por Validar -->
        <div class="bg-white/80 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center justify-between text-center backdrop-blur-xl hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm space-y-3">
          <span class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest font-mono">Por Validar</span>

          <div class="relative w-20 h-20 flex items-center justify-center">
            <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-slate-200 dark:text-slate-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-blue-500 dark:text-blue-400 transition-all duration-700 ease-out" stroke-width="3" :stroke-dasharray="`${porcentaje(datos.totales.pendientes_validar, datos.totales.registrados)}, 100`" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute flex flex-col items-center justify-center leading-none">
              <span class="text-xl font-black text-blue-500 dark:text-blue-400 font-mono">{{ datos.totales.pendientes_validar }}</span>
              <span class="text-[9px] font-bold text-slate-500 dark:text-slate-400 font-mono mt-0.5">{{ porcentaje(datos.totales.pendientes_validar, datos.totales.registrados) }}%</span>
            </div>
          </div>

          <span class="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">En Revisión Admin</span>
        </div>

        <!-- Validados -->
        <div class="bg-white/80 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center justify-between text-center backdrop-blur-xl hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm space-y-3">
          <span class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest font-mono">Validados</span>

          <div class="relative w-20 h-20 flex items-center justify-center">
            <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-slate-200 dark:text-slate-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-emerald-500 dark:text-emerald-400 transition-all duration-700 ease-out" stroke-width="3" :stroke-dasharray="`${porcentaje(datos.totales.validados, datos.totales.registrados)}, 100`" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute flex flex-col items-center justify-center leading-none">
              <span class="text-xl font-black text-emerald-500 dark:text-emerald-400 font-mono">{{ datos.totales.validados }}</span>
              <span class="text-[9px] font-bold text-slate-500 dark:text-slate-400 font-mono mt-0.5">{{ porcentaje(datos.totales.validados, datos.totales.registrados) }}%</span>
            </div>
          </div>

          <span class="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Con Folio Asignado</span>
        </div>

        <!-- Observaciones -->
        <div class="bg-white/80 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center justify-between text-center backdrop-blur-xl hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm space-y-3">
          <span class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest font-mono">Observaciones</span>

          <div class="relative w-20 h-20 flex items-center justify-center">
            <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-slate-200 dark:text-slate-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-rose-500 dark:text-rose-400 transition-all duration-700 ease-out" stroke-width="3" :stroke-dasharray="`${porcentaje(datos.totales.observaciones, datos.totales.registrados)}, 100`" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute flex flex-col items-center justify-center leading-none">
              <span class="text-xl font-black text-rose-500 dark:text-rose-400 font-mono">{{ datos.totales.observaciones }}</span>
              <span class="text-[9px] font-bold text-slate-500 dark:text-slate-400 font-mono mt-0.5">{{ porcentaje(datos.totales.observaciones, datos.totales.registrados) }}%</span>
            </div>
          </div>

          <span class="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Requieren Corrección</span>
        </div>

        <!-- Calificados -->
        <div class="bg-white/80 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center justify-between text-center backdrop-blur-xl hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm space-y-3">
          <span class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest font-mono">Calificados</span>

          <div class="relative w-20 h-20 flex items-center justify-center">
            <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-slate-200 dark:text-slate-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-purple-500 dark:text-purple-400 transition-all duration-700 ease-out" stroke-width="3" :stroke-dasharray="`${porcentaje(datos.totales.calificados, datos.totales.registrados)}, 100`" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute flex flex-col items-center justify-center leading-none">
              <span class="text-xl font-black text-purple-500 dark:text-purple-400 font-mono">{{ datos.totales.calificados }}</span>
              <span class="text-[9px] font-bold text-slate-500 dark:text-slate-400 font-mono mt-0.5">{{ porcentaje(datos.totales.calificados, datos.totales.registrados) }}%</span>
            </div>
          </div>

          <span class="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Por al menos un Juez</span>
        </div>
      </div>

      <!-- Gráficas y Desgloses -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Desglose por Categoría Dinámica -->
        <div class="bg-white/80 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 backdrop-blur-xl transition-colors shadow-sm">
          <div class="border-b border-slate-200 dark:border-white/5 pb-3 flex justify-between items-center">
            <h2 class="text-base font-bold text-slate-900 dark:text-white">Desglose por Categoría (Dinámico)</h2>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-mono">cat_categorias</span>
          </div>

          <div class="space-y-4">
            <div v-for="(cat, idx) in datos.porCategoria" :key="cat.id_categoria" class="space-y-1.5">
              <div class="flex justify-between text-xs font-bold">
                <span class="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <span 
                    class="w-2.5 h-2.5 rounded-full"
                    :class="esCat1(cat, idx) ? 'bg-yellow-400' : 'bg-orange-500'"
                  ></span>
                  {{ cat.nombre }}
                </span>
                <span 
                  class="font-mono font-bold"
                  :class="esCat1(cat, idx) ? 'text-yellow-400' : 'text-orange-500 dark:text-orange-400'"
                >
                  {{ cat.total }} inscritos ({{ porcentaje(cat.total, datos.totales.registrados) }}%)
                </span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-200 dark:border-white/5">
                <div 
                  class="h-full rounded-full transition-all duration-500"
                  :class="esCat1(cat, idx) ? 'bg-yellow-400' : 'bg-orange-500'"
                  :style="{ width: `${porcentaje(cat.total, datos.totales.registrados)}%` }"
                ></div>
              </div>
            </div>

            <div v-if="datos.porCategoria.length === 0" class="py-8 text-center text-slate-500 italic text-xs">
              No hay categorías definidas en la convocatoria seleccionada.
            </div>
          </div>
        </div>

        <!-- Desglose por Género -->
        <div class="bg-white/80 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 backdrop-blur-xl transition-colors shadow-sm">
          <div class="border-b border-slate-200 dark:border-white/5 pb-3 flex justify-between items-center">
            <h2 class="text-base font-bold text-slate-900 dark:text-white">Desglose por Género</h2>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-mono">usuarios.genero</span>
          </div>

          <div class="space-y-4">
            <div v-for="gen in datos.porGenero" :key="gen.genero" class="space-y-1.5">
              <div class="flex justify-between text-xs font-bold">
                <span class="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <span 
                    class="w-2.5 h-2.5 rounded-full"
                    :class="gen.genero?.toLowerCase().includes('masculino') ? 'bg-blue-600' : gen.genero?.toLowerCase().includes('femenino') ? 'bg-pink-500' : 'bg-purple-500'"
                  ></span>
                  {{ gen.genero }}
                </span>
                <span 
                  class="font-mono font-bold"
                  :class="gen.genero?.toLowerCase().includes('masculino') ? 'text-blue-600 dark:text-blue-400' : gen.genero?.toLowerCase().includes('femenino') ? 'text-pink-600 dark:text-pink-400' : 'text-purple-400'"
                >
                  {{ gen.total }} ({{ porcentaje(gen.total, datos.totales.registrados) }}%)
                </span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-200 dark:border-white/5">
                <div 
                  class="h-full rounded-full transition-all duration-500"
                  :class="gen.genero?.toLowerCase().includes('masculino') ? 'bg-blue-600' : gen.genero?.toLowerCase().includes('femenino') ? 'bg-pink-500' : 'bg-purple-500'"
                  :style="{ width: `${porcentaje(gen.total, datos.totales.registrados)}%` }"
                ></div>
              </div>
            </div>

            <div v-if="datos.porGenero.length === 0" class="py-8 text-center text-slate-500 italic text-xs">
              Sin datos de género registrados.
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../../services/api';

const convocatorias = ref([]);
const idConvocatoriaSel = ref(null);

const datos = reactive({
  convocatoria: null,
  totales: {
    registrados: 0,
    sin_archivo: 0,
    pendientes_validar: 0,
    validados: 0,
    observaciones: 0,
    calificados: 0
  },
  porCategoria: [],
  porGenero: []
});

const cargarConvocatorias = async () => {
  try {
    const res = await api.get('/superadmin/convocatorias');
    convocatorias.value = res.data;
    if (res.data.length > 0) {
      const activa = res.data.find(c => c.status === 1) || res.data[0];
      idConvocatoriaSel.value = activa.id_convocatoria;
    }
  } catch (err) {
    console.error('Error al cargar convocatorias:', err.message);
  }
};

const cargarEstadisticas = async () => {
  if (!idConvocatoriaSel.value) return;
  try {
    const res = await api.get(`/superadmin/estadisticas?id_convocatoria=${idConvocatoriaSel.value}`);
    datos.convocatoria = res.data.convocatoria;
    datos.totales = res.data.totales;
    datos.porCategoria = res.data.porCategoria;
    datos.porGenero = res.data.porGenero;
  } catch (err) {
    console.error('Error al cargar estadísticas:', err.message);
  }
};

onMounted(async () => {
  await cargarConvocatorias();
  await cargarEstadisticas();
});

const esCat1 = (cat, idx) => {
  if (!cat || !cat.nombre) return idx === 0;
  const n = cat.nombre.toLowerCase();
  if (n.includes('categoría 1') || n.includes('categoria 1') || n.includes('15 a 17')) return true;
  if (n.includes('categoría 2') || n.includes('categoria 2') || n.includes('18 a 23')) return false;
  return idx === 0;
};

const porcentaje = (valor, total) => {
  if (!total || total === 0) return 0;
  return Math.round((valor / total) * 100);
};
</script>
