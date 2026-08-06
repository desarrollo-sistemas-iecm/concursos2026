<template>
  <div class="min-h-[100dvh] bg-slate-950 text-slate-100 font-sans flex flex-col relative overflow-x-hidden">
    
    <!-- Banner Superior de Impersonación Activa (Soporte) -->
    <div 
      v-if="authStore.user?.isImpersonated" 
      class="bg-amber-500 text-slate-950 font-bold py-2 px-6 text-xs flex justify-between items-center z-50 shrink-0 shadow-md"
    >
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Modo Soporte Técnico — Sesión Suplantada</span>
      </div>
      <button 
        @click="terminarSuplantacion" 
        class="bg-slate-950 hover:bg-slate-900 text-white font-black py-1 px-3 rounded-lg transition-colors cursor-pointer"
      >
        Regresar a Vista Admin
      </button>
    </div>

    <div class="flex-grow flex w-full relative">
      <!-- Círculo decorativo de fondo -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[160px] pointer-events-none"></div>

      <!-- SIDEBAR LATERAL (Estilo TailAdmin Layout Two) -->
      <aside 
        ref="sidebarRef"
        :class="sidebarColapsado ? 'w-20' : 'w-64'"
        class="bg-slate-900/90 border-r border-white/10 flex flex-col justify-between shrink-0 relative z-30 transition-all duration-300 backdrop-blur-xl"
      >
        <div>
          <!-- BRAND / HEADER SIDEBAR -->
          <div class="p-5 border-b border-white/5 flex items-center justify-between">
            <div class="flex items-center gap-3 overflow-hidden">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary via-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-base shadow-[0_0_15px_rgba(20,184,166,0.3)] shrink-0">
                E
              </div>
              <div v-if="!sidebarColapsado" class="leading-tight transition-opacity duration-200">
                <span class="block text-xs font-black tracking-wider text-white uppercase font-mono">IECM Portal</span>
                <span class="block text-[9px] font-bold text-brand-primary uppercase tracking-widest">{{ rolEtiqueta }}</span>
              </div>
            </div>
            <button 
              @click="sidebarColapsado = !sidebarColapsado"
              class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
              title="Colapsar menú"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <!-- MENÚ AGRUPADO POR CATEGORÍAS -->
          <nav class="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div v-for="grupo in menuFiltrado" :key="grupo.titulo" class="space-y-2">
              <p 
                v-if="!sidebarColapsado" 
                class="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono"
              >
                {{ grupo.titulo }}
              </p>
              <div class="space-y-1">
                <router-link
                  v-for="item in grupo.items"
                  :key="item.path"
                  :to="item.path"
                  class="flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border border-transparent"
                  :class="$route.path === item.path ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'"
                  :title="sidebarColapsado ? item.nombre : ''"
                >
                  <span v-html="item.icon" class="w-4 h-4 shrink-0"></span>
                  <span v-if="!sidebarColapsado" class="truncate">{{ item.nombre }}</span>
                </router-link>
              </div>
            </div>
          </nav>
        </div>

        <!-- PIE DE SIDEBAR (USUARIO) -->
        <div class="p-4 border-t border-white/5">
          <div class="flex items-center gap-3" :class="sidebarColapsado ? 'justify-center' : ''">
            <div class="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-brand-primary shrink-0">
              {{ authStore.user?.nombre?.[0] || 'U' }}
            </div>
            <div v-if="!sidebarColapsado" class="truncate text-left leading-tight flex-grow">
              <span class="block text-xs font-bold text-white truncate">{{ authStore.user?.nombre }}</span>
              <span class="block text-[10px] text-slate-500 font-mono truncate">{{ authStore.user?.correo }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- ÁREA PRINCIPAL -->
      <div class="flex-grow flex flex-col min-w-0 overflow-y-auto">
        <!-- HEADER SUPERIOR -->
        <header class="h-16 border-b border-white/10 bg-slate-900/50 backdrop-blur-md px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <!-- Buscador o Título de Módulo -->
          <div class="flex items-center gap-4">
            <div class="relative hidden sm:block w-64">
              <input
                v-model="busquedaGeneral"
                type="text"
                placeholder="Buscar módulo..."
                class="w-full bg-slate-950/60 border border-white/10 focus:border-brand-primary/50 text-white rounded-xl py-1.5 pl-9 pr-3 text-xs outline-none transition-colors"
              />
              <svg class="w-4 h-4 text-slate-500 absolute left-3 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Acciones Derecha -->
          <div class="flex items-center gap-3">
            <!-- Campana de Notificaciones Reutilizada -->
            <CampanaNotificaciones />

            <!-- Menú Perfil / Logout -->
            <div class="relative">
              <button
                @click="menuPerfilAbierto = !menuPerfilAbierto"
                class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer"
              >
                <div class="text-right hidden sm:block">
                  <span class="block text-xs font-bold text-white leading-tight">{{ authStore.user?.nombre }}</span>
                  <span class="block text-[9px] font-mono text-slate-400 uppercase tracking-wider">{{ rolNombre }}</span>
                </div>
                <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Perfil -->
              <div
                v-if="menuPerfilAbierto"
                class="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-1.5 text-left text-xs"
              >
                <button
                  @click="abrirPerfilModal"
                  class="w-full text-left px-4 py-2 text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mi Perfil
                </button>
                <div class="border-t border-white/5 my-1"></div>
                <button
                  @click="logout"
                  class="w-full text-left px-4 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer font-bold"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- VISTA DE CONTENIDO ANIDADO DE LA RUTA -->
        <main class="p-6 md:p-8 flex-grow">
          <slot></slot>
        </main>

        <!-- FOOTER UNIFICADO -->
        <footer class="p-4 text-center text-[10px] text-slate-500 border-t border-white/5">
          Instituto Electoral de la Ciudad de México &copy; 2026 • Sistema del Concurso Juvenil de Ensayo
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router';
import CampanaNotificaciones from './CampanaNotificaciones.vue';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const router = useRouter();

const sidebarColapsado = ref(false);
const busquedaGeneral = ref('');
const menuPerfilAbierto = ref(false);

const rolId = computed(() => authStore.rol);

const rolEtiqueta = computed(() => {
  if (rolId.value === 4) return 'Superadmin';
  if (rolId.value === 2) return 'Administrador';
  if (rolId.value === 3) return 'Juez Jurado';
  return 'Usuario';
});

const rolNombre = computed(() => {
  if (rolId.value === 4) return 'Superadmin';
  if (rolId.value === 2) return 'Admin';
  if (rolId.value === 3) return 'Juez';
  return 'Participante';
});

// Menú estructurado en secciones según el Rol
const menuFiltrado = computed(() => {
  if (rolId.value === 4) {
    // Superadmin: Acceso a todos los submódulos
    return [
      {
        titulo: 'Gestión Operativa',
        items: [
          {
            nombre: 'Usuarios',
            path: '/superadmin/usuarios',
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
          },
          {
            nombre: 'Convocatorias',
            path: '/superadmin/convocatorias',
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`
          },
          {
            nombre: 'Manifestaciones',
            path: '/superadmin/manifestaciones',
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`
          },
          {
            nombre: 'Enviar Notificación',
            path: '/superadmin/notificaciones',
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>`
          }
        ]
      },
      {
        titulo: 'Análisis & Soporte',
        items: [
          {
            nombre: 'Estadísticas Globales',
            path: '/superadmin/estadisticas',
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`
          },
          {
            nombre: 'Reportería Excel',
            path: '/superadmin/reporteria',
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`
          },
          {
            nombre: 'Sesiones en Vivo',
            path: '/superadmin/sesiones',
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.828a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" /></svg>`
          },
          {
            nombre: 'Suplantar Cuenta',
            path: '/superadmin/impersonar',
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`
          }
        ]
      }
    ];
  } else if (rolId.value === 2) {
    // Admin Normal: Únicamente Validación de Participantes y Reportería
    return [
      {
        titulo: 'Módulo del Administrador',
        items: [
          {
            nombre: 'Validación de Participantes',
            path: '/admin/validacion',
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
          },
          {
            nombre: 'Reportería Excel',
            path: '/admin/reporteria',
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`
          }
        ]
      }
    ];
  } else if (rolId.value === 3) {
    // Juez Jurado: Únicamente Ensayos Validados para Calificar
    return [
      {
        titulo: 'Módulo del Juez',
        items: [
          {
            nombre: 'Evaluación de Ensayos',
            path: '/juez/evaluacion',
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>`
          }
        ]
      }
    ];
  }
  return [];
});

const abrirPerfilModal = () => {
  menuPerfilAbierto.value = false;
  Swal.fire({
    title: 'Mi Perfil de Usuario',
    html: `
      <div class="text-left space-y-2 text-xs text-slate-300">
        <p><strong>Nombre:</strong> ${authStore.user?.nombre} ${authStore.user?.apellido_pat}</p>
        <p><strong>Correo:</strong> ${authStore.user?.correo}</p>
        <p><strong>Nombre de Usuario:</strong> ${authStore.user?.usuario}</p>
        <p><strong>Rol:</strong> ${rolEtiqueta.value}</p>
      </div>
    `,
    icon: 'info',
    confirmButtonColor: '#10b981',
    background: '#0f172a',
    color: '#fff'
  });
};

const terminarSuplantacion = async () => {
  try {
    await authStore.terminarImpersonacion();
    router.push('/superadmin/usuarios');
  } catch (err) {
    console.error('Error al terminar suplantación:', err.message);
  }
};

const logout = async () => {
  const result = await Swal.fire({
    title: '¿Cerrar sesión?',
    text: '¿Estás seguro de que deseas salir de la plataforma?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#64748b',
    customClass: {
      popup: 'rounded-3xl shadow-2xl',
      confirmButton: 'rounded-xl px-5 py-2.5 font-bold',
      cancelButton: 'rounded-xl px-5 py-2.5 font-bold'
    }
  });

  if (result.isConfirmed) {
    await authStore.logout();
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Sesión cerrada correctamente',
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true
    });
    router.push('/login');
  }
};
</script>
