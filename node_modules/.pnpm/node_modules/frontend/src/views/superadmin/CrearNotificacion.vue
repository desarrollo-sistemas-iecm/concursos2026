<template>
  <div class="space-y-6 max-w-4xl mx-auto">
      <div class="border-b border-slate-200 dark:border-white/5 pb-4">
        <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Redactar & Enviar Notificación</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Envío de alertas persistidas en base de datos y notificadas por Socket.io en tiempo real</p>
      </div>

      <div class="bg-white/90 dark:bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 backdrop-blur-xl shadow-xl transition-colors">
        <form @submit.prevent="enviar" class="space-y-5 text-left">
          <!-- Destinatario -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Tipo de Destinatario</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label 
                class="p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all"
                :class="modoDestino === 'rol' ? 'bg-brand-primary/10 border-brand-primary text-slate-900 dark:text-white shadow-sm' : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'"
              >
                <input type="radio" v-model="modoDestino" value="rol" class="w-4 h-4 text-brand-primary" />
                <div>
                  <span class="block text-xs font-bold text-slate-900 dark:text-white">Por Rol (Broadcast)</span>
                  <span class="block text-[10px] text-slate-500 dark:text-slate-400">A todos los usuarios de un rol específico</span>
                </div>
              </label>

              <label 
                class="p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all"
                :class="modoDestino === 'usuario' ? 'bg-brand-primary/10 border-brand-primary text-slate-900 dark:text-white shadow-sm' : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'"
              >
                <input type="radio" v-model="modoDestino" value="usuario" class="w-4 h-4 text-brand-primary" />
                <div>
                  <span class="block text-xs font-bold text-slate-900 dark:text-white">Por Usuario Específico</span>
                  <span class="block text-[10px] text-slate-500 dark:text-slate-400">A una cuenta particular registrada</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Selección según modo -->
          <div v-if="modoDestino === 'rol'" class="space-y-1">
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Seleccionar Rol Destino</label>
            <select v-model.number="form.id_tipousuario_destino" required class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2.5 px-4 text-xs outline-none focus:border-brand-primary transition-colors">
              <option :value="null">-- Seleccionar Rol --</option>
              <option :value="1">Todos los Participantes</option>
              <option :value="2">Todos los Administradores</option>
              <option :value="3">Todos los Jueces</option>
              <option :value="4">Todos los Superadministradores</option>
            </select>
          </div>

          <div v-else class="space-y-1">
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Seleccionar Usuario Específico</label>
            <select v-model.number="form.id_usuario_destino" required class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2.5 px-4 text-xs outline-none focus:border-brand-primary transition-colors">
              <option :value="null">-- Seleccionar Usuario --</option>
              <option v-for="u in usuarios" :key="u.id_usuario" :value="u.id_usuario">
                {{ u.nombre }} {{ u.apellido_pat }} ({{ u.usuario }} - {{ u.rol }})
              </option>
            </select>
          </div>

          <!-- Tipo / Categoría de la notificación -->
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Tipo de Alerta</label>
            <select v-model="form.tipo" required class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2.5 px-4 text-xs outline-none focus:border-brand-primary transition-colors">
              <option value="INFO">Información General (Azul)</option>
              <option value="WARN">Aviso / Advertencia (Naranja)</option>
              <option value="SUCCESS">Confirmación / Éxito (Verde)</option>
              <option value="DANGER">Urgente / Importante (Rojo)</option>
            </select>
          </div>

          <!-- Asunto -->
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Asunto / Título del Aviso</label>
            <input 
              v-model="form.asunto" 
              type="text" 
              required 
              placeholder="ej. Apertura de periodo de correcciones"
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-brand-primary transition-colors"
            />
          </div>

          <!-- Mensaje -->
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Mensaje Detallado</label>
            <textarea 
              v-model="form.mensaje" 
              rows="4" 
              required 
              placeholder="Escribe aquí el contenido completo de la notificación..."
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl py-2.5 px-4 text-xs outline-none leading-relaxed focus:border-brand-primary transition-colors"
            ></textarea>
          </div>

          <div class="flex justify-end pt-4 border-t border-slate-200 dark:border-white/5">
            <button
              type="submit"
              :disabled="enviando"
              class="btn-tactile bg-brand-primary text-slate-950 font-black py-3 px-8 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md hover:shadow-brand-primary/20"
            >
              <span v-if="enviando" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              <span v-else>Enviar Notificación Ahora</span>
            </button>
          </div>
        </form>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../../services/api';
import Swal from 'sweetalert2';

const modoDestino = ref('rol');
const usuarios = ref([]);
const enviando = ref(false);

const form = reactive({
  id_tipousuario_destino: 1,
  id_usuario_destino: null,
  tipo: 'INFO',
  asunto: '',
  mensaje: ''
});

onMounted(async () => {
  try {
    const res = await api.get('/superadmin/usuarios');
    usuarios.value = res.data;
  } catch (err) {
    console.error('Error al cargar lista de usuarios:', err.message);
  }
});

const enviar = async () => {
  enviando.value = true;
  try {
    const payload = {
      tipo: form.tipo,
      asunto: form.asunto,
      mensaje: form.mensaje,
      id_tipousuario_destino: modoDestino.value === 'rol' ? form.id_tipousuario_destino : null,
      id_usuario_destino: modoDestino.value === 'usuario' ? form.id_usuario_destino : null
    };

    await api.post('/notificaciones/crear', payload);

    Swal.fire({
      icon: 'success',
      title: 'Notificación Enviada',
      text: 'Se ha guardado en la base de datos e invocado el aviso en vivo vía WebSockets.',
      confirmButtonColor: '#10b981'
    });

    form.asunto = '';
    form.mensaje = '';
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error de envío',
      text: err.response?.data?.error || 'No se pudo enviar la notificación.',
      confirmButtonColor: '#f43f5e'
    });
  } finally {
    enviando.value = false;
  }
};
</script>
