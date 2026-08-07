<template>
  <div class="space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Manifestaciones / Declaraciones</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Administración de las declaraciones bajo protesta presentadas a los participantes</p>
        </div>
        <button
          @click="abrirModalCrear"
          class="btn-tactile bg-brand-primary text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Declaración
        </button>
      </div>

      <!-- Tabla de Declaraciones -->
      <div class="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl transition-colors shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-100/80 dark:bg-slate-950/60 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 text-xs font-mono uppercase">
                <th class="py-3.5 px-4 font-bold w-16 text-center">Orden</th>
                <th class="py-3.5 px-4 font-bold">Texto del Manifiesto / Declaración</th>
                <th class="py-3.5 px-4 font-bold w-32">Estado</th>
                <th class="py-3.5 px-4 font-bold w-40 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5 text-xs">
              <tr
                v-for="m in manifestaciones"
                :key="m.id_manifestacion"
                class="hover:bg-slate-50 dark:hover:bg-white/2 transition-colors"
              >
                <td class="py-4 px-4 text-center font-mono font-bold text-brand-primary">
                  {{ m.orden }}
                </td>
                <td class="py-4 px-4 text-slate-800 dark:text-slate-200 leading-relaxed max-w-xl">
                  {{ m.texto }}
                </td>
                <td class="py-4 px-4">
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                    :class="m.status === 1 ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20'"
                  >
                    {{ m.status === 1 ? 'Activa' : 'Desactivada' }}
                  </span>
                </td>
                <td class="py-4 px-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      @click="abrirModalEditar(m)"
                      class="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 transition-all cursor-pointer shadow-sm"
                      title="Editar declaración"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      @click="toggleEstatus(m)"
                      class="p-2 rounded-xl border transition-all cursor-pointer shadow-sm"
                      :class="m.status === 1 
                        ? 'text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20' 
                        : 'text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20'"
                      :title="m.status === 1 ? 'Desactivar declaración' : 'Activar declaración'"
                    >
                      <svg v-if="m.status === 1" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="manifestaciones.length === 0">
                <td colspan="4" class="py-10 text-center text-slate-500 italic">
                  No hay declaraciones registradas.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Crear / Editar -->
      <div v-if="modalAbierto" class="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 w-full max-w-lg space-y-4 text-left shadow-2xl transition-colors">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/5 pb-3">
            {{ editandoId ? 'Editar Declaración' : 'Nueva Declaración Bajo Protesta' }}
          </h2>
          <form @submit.prevent="guardarManifestacion" class="space-y-3">
            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Orden de Presentación</label>
              <input v-model.number="form.orden" type="number" min="1" required class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-primary" />
            </div>

            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Texto Oficial del Manifiesto</label>
              <textarea v-model="form.texto" rows="5" required class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 text-xs outline-none leading-relaxed focus:border-brand-primary"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/5">
              <button type="button" @click="modalAbierto = false" class="btn-tactile bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-400 font-bold py-2 px-4 rounded-xl text-xs cursor-pointer">
                Cancelar
              </button>
              <button type="submit" :disabled="guardando" class="btn-tactile bg-brand-primary text-slate-950 font-black py-2 px-5 rounded-xl text-xs cursor-pointer shadow-sm">
                <span v-if="guardando" class="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                <span v-else>Guardar</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../../services/api';
import Swal from 'sweetalert2';

const manifestaciones = ref([]);
const modalAbierto = ref(false);
const editandoId = ref(null);
const guardando = ref(false);

const form = reactive({
  texto: '',
  orden: 1,
  status: 1
});

const cargarManifestaciones = async () => {
  try {
    const res = await api.get('/superadmin/manifestaciones');
    manifestaciones.value = res.data;
  } catch (err) {
    console.error('Error al cargar manifestaciones:', err.message);
  }
};

onMounted(() => {
  cargarManifestaciones();
});

const abrirModalCrear = () => {
  editandoId.value = null;
  form.texto = '';
  form.orden = manifestaciones.value.length + 1;
  form.status = 1;
  modalAbierto.value = true;
};

const abrirModalEditar = (m) => {
  editandoId.value = m.id_manifestacion;
  form.texto = m.texto;
  form.orden = m.orden;
  form.status = m.status;
  modalAbierto.value = true;
};

const guardarManifestacion = async () => {
  guardando.value = true;
  try {
    if (editandoId.value) {
      await api.put(`/superadmin/manifestaciones/${editandoId.value}`, form);
    } else {
      await api.post('/superadmin/manifestaciones', form);
    }
    Swal.fire({
      icon: 'success',
      title: 'Guardado',
      text: 'La declaración se ha actualizado de forma segura.',
      confirmButtonColor: '#10b981'
    });
    modalAbierto.value = false;
    await cargarManifestaciones();
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.error || 'No se pudo guardar la declaración.',
      confirmButtonColor: '#f43f5e'
    });
  } finally {
    guardando.value = false;
  }
};

const toggleEstatus = async (m) => {
  const nuevoStatus = m.status === 1 ? 0 : 1;
  const accionText = nuevoStatus === 0 ? 'Desactivar' : 'Activar';

  Swal.fire({
    title: `¿${accionText} declaración?`,
    text: nuevoStatus === 0 ? 'La declaración se ocultará para nuevas inscripciones, pero conservará las respuestas históricas de convocatorias pasadas.' : 'La declaración estará visible nuevamente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: nuevoStatus === 0 ? '#f43f5e' : '#10b981',
    confirmButtonText: `Sí, ${accionText.toLowerCase()}`,
    background: '#0f172a',
    color: '#fff'
  }).then(async (res) => {
    if (res.isConfirmed) {
      try {
        await api.patch(`/superadmin/manifestaciones/${m.id_manifestacion}/status`, { status: nuevoStatus });
        await cargarManifestaciones();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.error || 'No se pudo cambiar el estado.',
          confirmButtonColor: '#f43f5e'
        });
      }
    }
  });
};
</script>
