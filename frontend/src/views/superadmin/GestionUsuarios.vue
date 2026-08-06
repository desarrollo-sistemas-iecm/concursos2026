<template>
  <div class="space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Gestión de Usuarios</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Directorio global de usuarios con presencia en vivo y control de estado</p>
        </div>
        <button
          @click="abrirModalCrear"
          class="btn-tactile bg-brand-primary text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md hover:shadow-brand-primary/20"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Crear Nuevo Usuario
        </button>
      </div>

      <!-- Buscador y Filtros Avanzados Estilo TailAdmin -->
      <div class="bg-white/80 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-white/10 backdrop-blur-xl space-y-3 transition-colors">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <span class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
            <svg class="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros de Búsqueda
          </span>

          <button
            v-if="hayFiltrosActivos"
            @click="limpiarFiltros"
            class="text-[11px] font-bold text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar Filtros
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <!-- Buscador General -->
          <div class="relative">
            <input
              v-model="busqueda"
              type="text"
              placeholder="Buscar por usuario, correo, nombre..."
              class="w-full bg-slate-950/80 border border-white/10 text-white rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:border-brand-primary/50 transition-colors"
            />
            <svg class="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Filtro por Rol -->
          <div>
            <select
              v-model="filtroRol"
              class="w-full bg-slate-950/80 border border-white/10 text-slate-300 rounded-xl py-2 px-3 text-xs outline-none cursor-pointer focus:border-brand-primary/50 transition-colors"
            >
              <option :value="null">Todos los Roles</option>
              <option :value="1">Participante (Rol 1)</option>
              <option :value="2">Admin (Rol 2)</option>
              <option :value="3">Juez (Rol 3)</option>
              <option :value="4">Superadmin (Rol 4)</option>
            </select>
          </div>

          <!-- Filtro por Presencia -->
          <div>
            <select
              v-model="filtroPresencia"
              class="w-full bg-slate-950/80 border border-white/10 text-slate-300 rounded-xl py-2 px-3 text-xs outline-none cursor-pointer focus:border-brand-primary/50 transition-colors"
            >
              <option value="todos">Toda Presencia</option>
              <option value="online">En Línea (Sockets)</option>
              <option value="offline">Desconectado</option>
            </select>
          </div>

          <!-- Filtro por Estado de Cuenta -->
          <div>
            <select
              v-model="filtroStatus"
              class="w-full bg-slate-950/80 border border-white/10 text-slate-300 rounded-xl py-2 px-3 text-xs outline-none cursor-pointer focus:border-brand-primary/50 transition-colors"
            >
              <option value="todos">Cualquier Estado</option>
              <option value="1">Cuenta Activa</option>
              <option value="0">Cuenta Deshabilitada</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tabla de Usuarios -->
      <div class="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl transition-colors shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-100/80 dark:bg-slate-950/60 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 text-xs font-mono uppercase">
                <th class="py-3.5 px-4 font-bold">Estado / Presencia</th>
                <th class="py-3.5 px-4 font-bold">Usuario / Correo</th>
                <th class="py-3.5 px-4 font-bold">Nombre Completo</th>
                <th class="py-3.5 px-4 font-bold">Rol</th>
                <th class="py-3.5 px-4 font-bold">Progreso</th>
                <th class="py-3.5 px-4 font-bold">Cuenta</th>
                <th class="py-3.5 px-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5 text-xs">
              <tr
                v-for="u in usuariosFiltrados"
                :key="u.id_usuario"
                class="hover:bg-slate-50 dark:hover:bg-white/2 transition-colors"
              >
                <!-- Presencia en vivo (Socket.io) -->
                <td class="py-4 px-4">
                  <div class="flex items-center gap-2">
                    <span 
                      class="w-2.5 h-2.5 rounded-full shrink-0" 
                      :class="u.online ? 'bg-emerald-400 animate-pulse ring-4 ring-emerald-400/20' : 'bg-slate-400 dark:bg-slate-600'"
                    ></span>
                    <span class="font-mono text-[10px]" :class="u.online ? 'text-emerald-500 dark:text-emerald-400 font-bold' : 'text-slate-400 dark:text-slate-500'">
                      {{ u.online ? 'En Línea' : 'Desconectado' }}
                    </span>
                  </div>
                </td>

                <td class="py-4 px-4">
                  <span class="block font-bold text-slate-900 dark:text-white">{{ u.usuario }}</span>
                  <span class="block text-[10px] text-slate-500 dark:text-slate-500 font-mono">{{ u.correo }}</span>
                </td>

                <td class="py-4 px-4 text-slate-700 dark:text-slate-300">
                  {{ u.nombre }} {{ u.apellido_pat }} {{ u.apellido_mat || '' }}
                </td>

                <td class="py-4 px-4">
                  <span :class="badgeRolClass(u.id_tipousuario)">
                    {{ u.rol }}
                  </span>
                </td>

                <!-- Columna Radial Progress de TailAdmin -->
                <td class="py-4 px-4">
                  <div class="flex items-center gap-2.5">
                    <!-- TailAdmin Radial Progress SVG Mini Component -->
                    <div class="relative w-9 h-9 flex items-center justify-center shrink-0">
                      <svg class="w-9 h-9 transform -rotate-90" viewBox="0 0 36 36">
                        <!-- Anillo de fondo -->
                        <path
                          class="text-slate-800"
                          stroke-width="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <!-- Anillo de avance dinámico por rol -->
                        <path
                          :class="radialColorClass(u.id_tipousuario)"
                          stroke-width="3.5"
                          :stroke-dasharray="`${u.progreso || 0}, 100`"
                          stroke-linecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          class="transition-all duration-500 ease-out"
                        />
                      </svg>
                      <!-- Porcentaje numérico centrado -->
                      <span class="absolute text-[9px] font-black font-mono text-slate-900 dark:text-white">
                        {{ u.progreso || 0 }}%
                      </span>
                    </div>

                    <!-- Etiqueta del estado del avance -->
                    <div class="leading-tight hidden sm:block">
                      <span class="block text-[10px] font-bold text-slate-900 dark:text-white">
                        {{ getProgresoEtiqueta(u) }}
                      </span>
                      <span class="block text-[8px] font-mono text-slate-500 dark:text-slate-400">
                        {{ getProgresoSubtexto(u) }}
                      </span>
                    </div>
                  </div>
                </td>

                <td class="py-4 px-4">
                  <span 
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                    :class="u.status === 1 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'"
                  >
                    {{ u.status === 1 ? 'Activa' : 'Deshabilitada' }}
                  </span>
                </td>

                <td class="py-4 px-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <!-- Editar -->
                    <button
                      @click="abrirModalEditar(u)"
                      class="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-white/15 transition-all cursor-pointer shadow-sm"
                      title="Editar datos del usuario"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>

                    <!-- Expulsar Sesión en Vivo -->
                    <button
                      v-if="u.online"
                      @click="expulsarSesion(u)"
                      class="p-2 text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl border border-amber-500/20 transition-all cursor-pointer shadow-sm"
                      title="Expulsar sesión activa (WebSockets)"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </button>

                    <!-- Deshabilitar / Habilitar -->
                    <button
                      @click="toggleEstatus(u)"
                      class="p-2 rounded-xl border transition-all cursor-pointer shadow-sm"
                      :class="u.status === 1 
                        ? 'text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20' 
                        : 'text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20'"
                      :title="u.status === 1 ? 'Deshabilitar usuario' : 'Habilitar usuario'"
                    >
                      <svg v-if="u.status === 1" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="usuariosFiltrados.length === 0">
                <td colspan="6" class="py-10 text-center text-slate-500 italic">
                  No se encontraron usuarios que coincidan con la búsqueda.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Formulario Crear / Editar -->
      <div v-if="modalAbierto" class="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 w-full max-w-lg space-y-4 text-left shadow-2xl transition-colors">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/5 pb-3">
            {{ editandoId ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}
          </h2>
          <form @submit.prevent="guardarUsuario" class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Rol / Tipo Usuario</label>
                <select v-model.number="form.id_tipousuario" required class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-primary transition-colors">
                  <option :value="1">Participante</option>
                  <option :value="2">Admin</option>
                  <option :value="3">Juez</option>
                  <option :value="4">Superadmin</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Usuario (Login)</label>
                <input v-model="form.usuario" type="text" required class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-primary transition-colors" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Nombre(s)</label>
              <input v-model="form.nombre" type="text" required class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-primary transition-colors" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Apellido Paterno</label>
                <input v-model="form.apellido_pat" type="text" required class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-primary transition-colors" />
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Apellido Materno</label>
                <input v-model="form.apellido_mat" type="text" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-primary transition-colors" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Correo Electrónico</label>
              <input v-model="form.correo" type="email" required class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-primary transition-colors" />
            </div>

            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Contraseña {{ editandoId ? '(dejar en blanco para no cambiar)' : '' }}</label>
              <input v-model="form.contrasena" :required="!editandoId" type="password" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-primary transition-colors" />
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
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import api from '../../services/api';
import Swal from 'sweetalert2';

const usuarios = ref([]);
const busqueda = ref('');
const filtroRol = ref(null);
const filtroPresencia = ref('todos');
const filtroStatus = ref('todos');
const modalAbierto = ref(false);
const editandoId = ref(null);
const guardando = ref(false);
let intervalId = null;

const form = reactive({
  id_tipousuario: 1,
  usuario: '',
  nombre: '',
  apellido_pat: '',
  apellido_mat: '',
  correo: '',
  contrasena: ''
});

const cargarUsuarios = async () => {
  try {
    const res = await api.get('/superadmin/usuarios');
    usuarios.value = res.data;
  } catch (err) {
    console.error('Error al cargar usuarios:', err.message);
  }
};

onMounted(() => {
  cargarUsuarios();
  intervalId = setInterval(cargarUsuarios, 4000); // Polling ligero para mantener estado de conexión en vivo
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

const hayFiltrosActivos = computed(() => {
  return (
    busqueda.value.trim() !== '' ||
    filtroRol.value !== null ||
    filtroPresencia.value !== 'todos' ||
    filtroStatus.value !== 'todos'
  );
});

const limpiarFiltros = () => {
  busqueda.value = '';
  filtroRol.value = null;
  filtroPresencia.value = 'todos';
  filtroStatus.value = 'todos';
};

const usuariosFiltrados = computed(() => {
  const q = busqueda.value.trim().toLowerCase();
  return usuarios.value.filter(u => {
    const coincideRol = !filtroRol.value || u.id_tipousuario === filtroRol.value;
    const coincideTexto = !q || (
      u.usuario.toLowerCase().includes(q) ||
      u.correo.toLowerCase().includes(q) ||
      u.nombre.toLowerCase().includes(q) ||
      (u.apellido_pat && u.apellido_pat.toLowerCase().includes(q))
    );
    const coincidePresencia = 
      filtroPresencia.value === 'todos' ||
      (filtroPresencia.value === 'online' && u.online) ||
      (filtroPresencia.value === 'offline' && !u.online);
    const coincideStatus =
      filtroStatus.value === 'todos' ||
      u.status.toString() === filtroStatus.value.toString();

    return coincideRol && coincideTexto && coincidePresencia && coincideStatus;
  });
});

const abrirModalCrear = () => {
  editandoId.value = null;
  form.id_tipousuario = 1;
  form.usuario = '';
  form.nombre = '';
  form.apellido_pat = '';
  form.apellido_mat = '';
  form.correo = '';
  form.contrasena = '';
  modalAbierto.value = true;
};

const abrirModalEditar = (u) => {
  editandoId.value = u.id_usuario;
  form.id_tipousuario = u.id_tipousuario;
  form.usuario = u.usuario;
  form.nombre = u.nombre;
  form.apellido_pat = u.apellido_pat;
  form.apellido_mat = u.apellido_mat || '';
  form.correo = u.correo;
  form.contrasena = '';
  modalAbierto.value = true;
};

const guardarUsuario = async () => {
  guardando.value = true;
  try {
    if (editandoId.value) {
      await api.put(`/superadmin/usuarios/${editandoId.value}`, form);
    } else {
      await api.post('/superadmin/usuarios', form);
    }
    Swal.fire({
      icon: 'success',
      title: 'Guardado',
      text: 'El usuario se ha registrado correctamente.',
      confirmButtonColor: '#10b981'
    });
    modalAbierto.value = false;
    await cargarUsuarios();
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.error || 'No se pudo guardar el usuario.',
      confirmButtonColor: '#f43f5e'
    });
  } finally {
    guardando.value = false;
  }
};

const toggleEstatus = async (u) => {
  const nuevoStatus = u.status === 1 ? 0 : 1;
  const accionText = nuevoStatus === 0 ? 'Deshabilitar (Borrado Lógico)' : 'Habilitar';
  
  Swal.fire({
    title: `¿${accionText} usuario?`,
    text: nuevoStatus === 0 ? 'La cuenta quedará inhabilitada. No se borrará físicamente para preservar el historial.' : 'La cuenta se reactivará.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: nuevoStatus === 0 ? '#f43f5e' : '#10b981',
    confirmButtonText: `Sí, ${accionText.toLowerCase()}`,
    background: '#0f172a',
    color: '#fff'
  }).then(async (res) => {
    if (res.isConfirmed) {
      try {
        await api.patch(`/superadmin/usuarios/${u.id_usuario}/status`, { status: nuevoStatus });
        await cargarUsuarios();
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

const expulsarSesion = (u) => {
  Swal.fire({
    title: `¿Expulsar sesión en vivo de ${u.usuario}?`,
    text: 'Se desconectará inmediatamente su sesión activa vía WebSockets y será redirigido a la pantalla de login.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f59e0b',
    confirmButtonText: 'Sí, expulsar sesión',
    background: '#0f172a',
    color: '#fff'
  }).then(async (res) => {
    if (res.isConfirmed) {
      try {
        await api.post('/superadmin/sesiones/kick', { id_usuario: u.id_usuario });
        await cargarUsuarios();
        Swal.fire({
          icon: 'success',
          title: 'Sesión expulsada',
          text: `El usuario ${u.usuario} ha sido desconectado.`,
          timer: 1500,
          showConfirmButton: false,
          background: '#0f172a',
          color: '#fff'
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.error || 'No se pudo expulsar la sesión del usuario.',
          confirmButtonColor: '#f43f5e',
          background: '#0f172a',
          color: '#fff'
        });
      }
    }
  });
};

const badgeRolClass = (rolId) => {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ';
  if (rolId === 1) return base + 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
  if (rolId === 2) return base + 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
  if (rolId === 3) return base + 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
  if (rolId === 4) return base + 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  return base + 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
};

const radialColorClass = (rolId) => {
  if (rolId === 1) return 'text-emerald-400';
  if (rolId === 2) return 'text-orange-400';
  if (rolId === 3) return 'text-purple-400';
  if (rolId === 4) return 'text-teal-400';
  return 'text-blue-400';
};

const getProgresoEtiqueta = (u) => {
  const p = u.progreso || 0;
  if (p === 100) return 'Completado';
  if (p >= 75) return 'En Revisión';
  if (p >= 50) return 'En Registro';
  return 'Iniciado';
};

const getProgresoSubtexto = (u) => {
  if (u.id_tipousuario === 1) return `Paso ${Math.ceil((u.progreso || 25) / 25)} de 4`;
  if (u.id_tipousuario === 2) return 'Validaciones';
  if (u.id_tipousuario === 3) return 'Calificaciones';
  return 'Supervisión';
};
</script>
