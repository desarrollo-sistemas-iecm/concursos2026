<template>
  <div class="w-full relative z-10 flex-grow space-y-6">
      
      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Panel de Evaluación de Ensayos</h1>
          <p class="text-slate-500 dark:text-slate-400 text-xs">Módulo del Juez — Evaluación Anónima (Doble Ciego)</p>
        </div>
      </div>

      <!-- ESTADÍSTICAS DEL JUEZ -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white/80 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors">
          <div>
            <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ensayos Validados</span>
            <span class="text-2xl font-black block text-slate-900 dark:text-white mt-1">{{ ensayos.length }}</span>
          </div>
          <div class="p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl text-slate-600 dark:text-slate-400">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <div class="bg-white/80 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors">
          <div>
            <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tus Evaluados</span>
            <span class="text-2xl font-black block text-emerald-500 dark:text-emerald-400 mt-1">{{ totalEvaluados }}</span>
          </div>
          <div class="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 dark:text-emerald-400">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="bg-white/80 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors">
          <div>
            <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tus Pendientes</span>
            <span class="text-2xl font-black block text-amber-500 dark:text-amber-400 mt-1">{{ totalPendientes }}</span>
          </div>
          <div class="p-3 bg-amber-500/10 rounded-xl text-amber-500 dark:text-amber-400">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- TABLA DE ENSAYOS A EVALUAR -->
      <div class="glass-card border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden bg-white/80 dark:bg-slate-950/30 transition-colors shadow-sm">
        
        <div v-if="cargando" class="p-12 text-center space-y-4">
          <div class="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="text-slate-500 dark:text-slate-400 text-xs">Cargando ensayos validados...</p>
        </div>

        <div v-else-if="ensayos.length === 0" class="p-12 text-center text-slate-500 dark:text-slate-400 text-xs italic">
          No hay ningún ensayo validado por el administrador listo para calificar.
        </div>

        <div class="overflow-x-auto" v-else>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-100/80 dark:bg-slate-950/80 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/10">
                <th class="p-4">Folio</th>
                <th class="p-4">Seudónimo</th>
                <th class="p-4">Título del Ensayo</th>
                <th class="p-4">Categoría</th>
                <th class="p-4">Tu Calificación</th>
                <th class="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5 text-xs">
              <tr v-for="ens in ensayos" :key="ens.id_participante" class="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                <!-- Folio -->
                <td class="p-4 font-mono font-bold tracking-wider text-slate-900 dark:text-slate-300">
                  {{ ens.folio }}
                </td>
                
                <!-- Seudónimo -->
                <td class="p-4 text-slate-900 dark:text-slate-200 font-semibold">
                  {{ ens.seudonimo }}
                </td>
                
                <!-- Título -->
                <td class="p-4 text-slate-700 dark:text-slate-300 max-w-[280px] truncate" :title="ens.titulo_ensayo">
                  {{ ens.titulo_ensayo }}
                </td>
                
                <!-- Categoría -->
                <td class="p-4 text-emerald-500 dark:text-emerald-400 font-bold">
                  {{ ens.categoria_nombre }}
                </td>
                
                <!-- Estado / Calificación -->
                <td class="p-4">
                  <span v-if="ens.evaluado === 1" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4" />
                    </svg>
                    Calificado: {{ ens.total }} pts
                  </span>
                  <span v-else class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">
                    Pendiente
                  </span>
                </td>
                
                <!-- Acciones -->
                <td class="p-4">
                  <div class="flex items-center justify-center gap-2">
                    <!-- Ver PDF -->
                    <a
                      :href="`/api/documentos/${ens.archivo_ensayo}?token=${authStore.token}`"
                      target="_blank"
                      class="p-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-brand-primary/40 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                      title="Descargar y leer ensayo PDF"
                    >
                      <svg class="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </a>
                    
                    <!-- Evaluar -->
                    <button
                      v-if="ens.evaluado === 0"
                      @click="abrirEvaluacion(ens)"
                      class="btn-tactile py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Calificar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

    <!-- MODAL DE EVALUACIÓN PREMIUM -->
    <div v-if="modalAbierto" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-6">
      <div class="glass-card max-w-lg w-full p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 flex flex-col max-h-[90vh] shadow-2xl transition-colors">
        
        <!-- Cabecera modal -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-6 shrink-0">
          <div>
            <h2 class="text-lg font-black text-slate-900 dark:text-white">Evaluar Ensayo: {{ seleccionado.folio }}</h2>
            <p class="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold uppercase tracking-wider">{{ seleccionado.categoria_nombre }}</p>
          </div>
          <button @click="cerrarEvaluacion" class="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Contenido formulario -->
        <form @submit.prevent="guardarCalificacion" class="flex-grow overflow-y-auto space-y-4 pr-1">
          
          <!-- Criterio 1: Formato -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-semibold">
              <span class="text-slate-700 dark:text-slate-300">C1: Formato (Margen, Fuentes, Portada)</span>
              <span class="text-emerald-500 dark:text-emerald-400">Rango: 0.0 - 0.5</span>
            </div>
            <input
              v-model.number="evalForm.califica1"
              type="number"
              step="0.1"
              min="0"
              max="0.5"
              required
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-brand-primary text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-sm font-mono transition-colors"
            />
          </div>

          <!-- Criterio 2: Claridad -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-semibold">
              <span class="text-slate-700 dark:text-slate-300">C2: Claridad e Hilo Conductor</span>
              <span class="text-emerald-500 dark:text-emerald-400">Rango: 0.0 - 2.0</span>
            </div>
            <input
              v-model.number="evalForm.califica2"
              type="number"
              step="0.1"
              min="0"
              max="2"
              required
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-brand-primary text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-sm font-mono transition-colors"
            />
          </div>

          <!-- Criterio 3: Contenido -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-semibold">
              <span class="text-slate-700 dark:text-slate-300">C3: Estructura del Contenido</span>
              <span class="text-emerald-500 dark:text-emerald-400">Rango: 0.0 - 2.0</span>
            </div>
            <input
              v-model.number="evalForm.califica3"
              type="number"
              step="0.1"
              min="0"
              max="2"
              required
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-brand-primary text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-sm font-mono transition-colors"
            />
          </div>

          <!-- Criterio 4: Originalidad -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-semibold">
              <span class="text-slate-700 dark:text-slate-300">C4: Propuesta y Originalidad</span>
              <span class="text-emerald-500 dark:text-emerald-400">Rango: 0.0 - 2.0</span>
            </div>
            <input
              v-model.number="evalForm.califica4"
              type="number"
              step="0.1"
              min="0"
              max="2"
              required
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-brand-primary text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-sm font-mono transition-colors"
            />
          </div>

          <!-- Criterio 5: Estilo -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-semibold">
              <span class="text-slate-700 dark:text-slate-300">C5: Estilo y Ortografía</span>
              <span class="text-emerald-500 dark:text-emerald-400">Rango: 0.0 - 2.0</span>
            </div>
            <input
              v-model.number="evalForm.califica5"
              type="number"
              step="0.1"
              min="0"
              max="2"
              required
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-brand-primary text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-sm font-mono transition-colors"
            />
          </div>

          <!-- Criterio 6: Conclusión -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-semibold">
              <span class="text-slate-700 dark:text-slate-300">C6: Conclusión de la Obra</span>
              <span class="text-emerald-500 dark:text-emerald-400">Rango: 0.0 - 1.5</span>
            </div>
            <input
              v-model.number="evalForm.califica6"
              type="number"
              step="0.1"
              min="0"
              max="1.5"
              required
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-brand-primary text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-sm font-mono transition-colors"
            />
          </div>

          <!-- Observaciones -->
          <div class="space-y-1">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Observaciones / Comentarios del Juez (Opcional)</label>
            <textarea
              v-model="evalForm.observaciones"
              rows="2"
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-brand-primary text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-xs transition-colors"
              placeholder="Añade algún comentario técnico..."
            ></textarea>
          </div>


          <!-- TOTAL DINÁMICO -->
          <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-4 flex items-center justify-between shrink-0 transition-colors">
            <div>
              <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Calificación Puntuada</span>
              <span class="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">Suma de los 6 criterios</span>
            </div>
            <span class="text-2xl font-black text-emerald-500 dark:text-emerald-400 font-mono">{{ totalCalculado }} <span class="text-xs text-slate-500">/ 10.0</span></span>
          </div>

          <!-- Acciones modal -->
          <div class="flex gap-4 pt-2 shrink-0">
            <button type="button" @click="cerrarEvaluacion" class="btn-tactile flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold py-3 rounded-xl text-xs cursor-pointer transition-all">
              Cancelar
            </button>
            <button type="submit" :disabled="guardando" class="btn-tactile flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs cursor-pointer transition-all shadow-sm">
              <span v-if="guardando" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mx-auto"></span>
              <span v-else>Guardar Calificación</span>
            </button>
          </div>

        </form>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import api from '../../services/api';

const authStore = useAuthStore();
const router = useRouter();

const cargando = ref(false);
const guardando = ref(false);
const essaysCargados = ref([]);
const ensayos = ref([]);

const modalAbierto = ref(false);
const seleccionado = ref(null);

const evalForm = reactive({
  califica1: 0,
  califica2: 0,
  califica3: 0,
  califica4: 0,
  califica5: 0,
  califica6: 0,
  observaciones: ''
});

// Estadísticas
const totalEvaluados = computed(() => ensayos.value.filter(e => e.evaluado === 1).length);
const totalPendientes = computed(() => ensayos.value.filter(e => e.evaluado === 0).length);

// Suma total calculada en caliente
const totalCalculado = computed(() => {
  const sum = (evalForm.califica1 || 0) + 
              (evalForm.califica2 || 0) + 
              (evalForm.califica3 || 0) + 
              (evalForm.califica4 || 0) + 
              (evalForm.califica5 || 0) + 
              (evalForm.califica6 || 0);
  return parseFloat(sum.toFixed(1));
});


onMounted(async () => {
  await cargarEnsayos();
});

const cargarEnsayos = async () => {
  cargando.value = true;
  try {
    const res = await api.get('/juez/ensayos');
    ensayos.value = res.data;
  } catch (err) {
    console.error('Error al cargar ensayos:', err.message);
  } finally {
    cargando.value = false;
  }
};

const abrirEvaluacion = (ens) => {
  seleccionado.value = ens;
  evalForm.califica1 = 0;
  evalForm.califica2 = 0;
  evalForm.califica3 = 0;
  evalForm.califica4 = 0;
  evalForm.califica5 = 0;
  evalForm.califica6 = 0;
  evalForm.observaciones = '';
  modalAbierto.value = true;
};


const cerrarEvaluacion = () => {
  modalAbierto.value = false;
  seleccionado.value = null;
};

const guardarCalificacion = async () => {
  guardando.value = true;
  try {
    const res = await api.post('/juez/calificar', {
      id_participante: seleccionado.value.id_participante,
      califica1: evalForm.califica1,
      califica2: evalForm.califica2,
      califica3: evalForm.califica3,
      califica4: evalForm.califica4,
      califica5: evalForm.califica5,
      califica6: evalForm.califica6,
      observaciones: evalForm.observaciones
    });


    Swal.fire({
      icon: 'success',
      title: 'Calificación Guardada',
      text: res.data.mensaje,
      confirmButtonColor: '#10b981',
      background: '#0f172a',
      color: '#fff'
    });
    
    cerrarEvaluacion();
    await cargarEnsayos();
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error al calificar',
      text: err.response?.data?.error || 'Ocurrió un error inesperado al guardar la calificación.',
      confirmButtonColor: '#f43f5e',
      background: '#0f172a',
      color: '#fff'
    });
  } finally {
    guardando.value = false;
  }
};

const cerrarSesion = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (err) {
    console.error(err.message);
  }
};
</script>

<style scoped>
.glass-card {
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
</style>
