<template>
  <div class="space-y-8 max-w-5xl mx-auto">
    <!-- Header de la Vista -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
      <div>
        <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <span class="p-2 rounded-2xl bg-[#8C65AA]/20 text-[#8C65AA] border border-[#8C65AA]/30 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </span>
          Personalizador del Menú y Header
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Ajusta únicamente los colores del Menú Lateral (Sidebar) y del Header Superior del sistema interno.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="restablecerPredeterminado"
          class="btn-tactile bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all border border-slate-300 dark:border-white/10"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Restablecer Institucional
        </button>
        <button
          @click="guardarCambios"
          :disabled="themeStore.cargando"
          class="btn-tactile bg-[#8C65AA] hover:bg-[#9E77C1] text-white font-black py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(140,101,170,0.35)] transition-all"
        >
          <span v-if="themeStore.cargando" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span v-else class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Guardar Personalización
          </span>
        </button>
      </div>
    </div>

    <!-- NOTA INFORMATIVA DEL ALCANCE -->
    <div class="bg-[#32215C]/10 border border-[#8C65AA]/30 rounded-2xl p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
      <svg class="w-5 h-5 text-[#8C65AA] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <span class="font-bold block text-[#8C65AA] dark:text-[#E0CEF2]">Alcance del Personalizador:</span>
        La personalización de color aplica <strong>exclusivamente al Menú Lateral y Header Superior</strong>. Las tarjetas de contenido, tablas, gráficos, modales y botones del área principal se rigen por la identidad visual fija del Instituto Electoral de la Ciudad de México (IECM).
      </div>
    </div>

    <!-- 1. PALETAS PREDEFINIDAS DE UN CLIC -->
    <div class="bg-white dark:bg-[#1B1133] border border-slate-200 dark:border-[#8C65AA]/20 rounded-3xl p-6 space-y-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xs font-black uppercase tracking-wider text-[#32215C] dark:text-white">Paletas Sugeridas</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">Haz clic en una combinación predeterminada para aplicar al instante</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <button
          v-for="(p, key) in paletasPredefinidas"
          :key="key"
          @click="aplicarPaletaPreset(p.colors)"
          class="p-3.5 rounded-2xl border border-slate-200 dark:border-[#8C65AA]/30 hover:border-[#8C65AA] transition-all text-left bg-slate-50 dark:bg-[#110922]/60 cursor-pointer space-y-2 group"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#8C65AA] transition-colors">{{ p.nombre }}</span>
          </div>
          <div class="flex items-center gap-2 pt-1">
            <div class="w-4 h-4 rounded-full border border-black/20" :style="{ backgroundColor: p.colors.sidebar_bg }" title="Fondo Menú"></div>
            <div class="w-4 h-4 rounded-full border border-black/20" :style="{ backgroundColor: p.colors.header_bg }" title="Header"></div>
            <div class="w-4 h-4 rounded-full border border-black/20" :style="{ backgroundColor: p.colors.sidebar_active_bg }" title="Botón Activo"></div>
          </div>
        </button>
      </div>
    </div>

    <!-- 2. EDITOR MANUAL DE COLORES (RESTRINGIDO ÚNICAMENTE A MENÚ Y HEADER) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- SECCIÓN A: MENÚ LATERAL (SIDEBAR) -->
      <div class="bg-white dark:bg-[#1B1133] border border-slate-200 dark:border-[#8C65AA]/20 rounded-3xl p-6 space-y-5 shadow-sm">
        <div class="border-b border-slate-200 dark:border-[#8C65AA]/20 pb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-[#8C65AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <h2 class="text-xs font-black text-[#32215C] dark:text-white uppercase tracking-wider">Menú Lateral (Sidebar)</h2>
        </div>

        <div class="space-y-4">
          <!-- Fondo del Menú -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">Fondo del Menú Lateral</label>
            <div class="flex items-center gap-3">
              <input
                type="color"
                v-model="formTema.sidebar_bg"
                @input="actualizarVistaPrevia"
                class="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
              />
              <input
                type="text"
                v-model="formTema.sidebar_bg"
                @input="actualizarVistaPrevia"
                class="flex-grow bg-slate-50 dark:bg-[#110922] border border-slate-200 dark:border-[#8C65AA]/30 text-slate-900 dark:text-white rounded-xl py-2 px-3 text-xs font-mono uppercase"
              />
            </div>
          </div>

          <!-- Texto / Íconos del Menú (Inactivo) -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">Texto del Menú (Inactivo)</label>
            <div class="flex items-center gap-3">
              <input
                type="color"
                v-model="formTema.sidebar_text"
                @input="actualizarVistaPrevia"
                class="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
              />
              <input
                type="text"
                v-model="formTema.sidebar_text"
                @input="actualizarVistaPrevia"
                class="flex-grow bg-slate-50 dark:bg-[#110922] border border-slate-200 dark:border-[#8C65AA]/30 text-slate-900 dark:text-white rounded-xl py-2 px-3 text-xs font-mono uppercase"
              />
            </div>
          </div>

          <!-- Fondo del Botón Seleccionado -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">Fondo del Botón/Ítem Activo</label>
            <div class="flex items-center gap-3">
              <input
                type="color"
                v-model="formTema.sidebar_active_bg"
                @input="actualizarVistaPrevia"
                class="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
              />
              <input
                type="text"
                v-model="formTema.sidebar_active_bg"
                @input="actualizarVistaPrevia"
                class="flex-grow bg-slate-50 dark:bg-[#110922] border border-slate-200 dark:border-[#8C65AA]/30 text-slate-900 dark:text-white rounded-xl py-2 px-3 text-xs font-mono uppercase"
              />
            </div>
          </div>

          <!-- Texto del Botón Seleccionado -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">Texto del Botón Activo</label>
            <div class="flex items-center gap-3">
              <input
                type="color"
                v-model="formTema.sidebar_active_text"
                @input="actualizarVistaPrevia"
                class="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
              />
              <input
                type="text"
                v-model="formTema.sidebar_active_text"
                @input="actualizarVistaPrevia"
                class="flex-grow bg-slate-50 dark:bg-[#110922] border border-slate-200 dark:border-[#8C65AA]/30 text-slate-900 dark:text-white rounded-xl py-2 px-3 text-xs font-mono uppercase"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN B: HEADER SUPERIOR -->
      <div class="bg-white dark:bg-[#1B1133] border border-slate-200 dark:border-[#8C65AA]/20 rounded-3xl p-6 space-y-5 shadow-sm">
        <div class="border-b border-slate-200 dark:border-[#8C65AA]/20 pb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-[#8C65AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 class="text-xs font-black text-[#32215C] dark:text-white uppercase tracking-wider">Header Superior</h2>
        </div>

        <div class="space-y-4">
          <!-- Fondo del Header Superior -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">Fondo del Header Superior</label>
            <div class="flex items-center gap-3">
              <input
                type="color"
                v-model="formTema.header_bg"
                @input="actualizarVistaPrevia"
                class="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
              />
              <input
                type="text"
                v-model="formTema.header_bg"
                @input="actualizarVistaPrevia"
                class="flex-grow bg-slate-50 dark:bg-[#110922] border border-slate-200 dark:border-[#8C65AA]/30 text-slate-900 dark:text-white rounded-xl py-2 px-3 text-xs font-mono uppercase"
              />
            </div>
          </div>

          <!-- Texto / Íconos del Header Superior -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">Texto / Íconos / Nombre de Usuario en Header</label>
            <div class="flex items-center gap-3">
              <input
                type="color"
                v-model="formTema.header_text"
                @input="actualizarVistaPrevia"
                class="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
              />
              <input
                type="text"
                v-model="formTema.header_text"
                @input="actualizarVistaPrevia"
                class="flex-grow bg-slate-50 dark:bg-[#110922] border border-slate-200 dark:border-[#8C65AA]/30 text-slate-900 dark:text-white rounded-xl py-2 px-3 text-xs font-mono uppercase"
              />
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- DEMOSTRACIÓN EN VIVO (VISTA PREVIA DE MENÚ Y HEADER) -->
    <div class="bg-white dark:bg-[#1B1133] border border-slate-200 dark:border-[#8C65AA]/20 rounded-3xl p-6 space-y-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xs font-black text-[#32215C] dark:text-white uppercase tracking-wider">Demostración en Vivo — Vista Previa del Sistema</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">Observa cómo lucen el Menú Lateral y el Header Superior en tiempo real</p>
        </div>
      </div>

      <!-- Mockup de Pantalla Simulado -->
      <div class="border border-[#8C65AA]/20 rounded-2xl overflow-hidden flex h-64 text-xs font-sans shadow-xl transition-all">
        
        <!-- Mini Sidebar -->
        <div class="w-52 p-3 flex flex-col justify-between shrink-0 border-r border-white/5 transition-colors" :style="{ backgroundColor: formTema.sidebar_bg }">
          <div class="space-y-3">
            <div class="flex items-center gap-2 border-b border-white/10 pb-2">
              <div class="w-6 h-6 rounded-lg flex items-center justify-center font-black text-[10px]" :style="{ backgroundColor: formTema.sidebar_active_bg, color: formTema.sidebar_active_text }">I</div>
              <span class="font-bold text-[10px] text-white">IECM Portal</span>
            </div>

            <div class="space-y-1">
              <!-- Item Activo -->
              <div class="p-2 rounded-xl flex items-center gap-2 font-bold transition-all border border-white/5" :style="{ backgroundColor: formTema.sidebar_active_bg, color: formTema.sidebar_active_text }">
                <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: formTema.sidebar_active_text }"></span>
                <span>Módulo Activo</span>
              </div>

              <!-- Items Inactivos -->
              <div class="p-2 rounded-xl flex items-center gap-2 transition-all" :style="{ color: formTema.sidebar_text }">
                <span class="w-2 h-2 rounded-full bg-slate-500/40"></span>
                <span>Gestión de Usuarios</span>
              </div>
              <div class="p-2 rounded-xl flex items-center gap-2 transition-all" :style="{ color: formTema.sidebar_text }">
                <span class="w-2 h-2 rounded-full bg-slate-500/40"></span>
                <span>Estadísticas</span>
              </div>
            </div>
          </div>

          <div class="text-[9px] opacity-60" :style="{ color: formTema.sidebar_text }">
            IECM Superadmin &copy; {{ new Date().getFullYear() }}
          </div>
        </div>

        <!-- Mini Área Principal -->
        <div class="flex-grow flex flex-col transition-colors bg-[#110922]">
          <!-- Mini Header -->
          <div class="h-11 px-4 border-b border-white/10 flex items-center justify-between transition-colors" :style="{ backgroundColor: formTema.header_bg, color: formTema.header_text }">
            <span class="text-[10px] font-bold">Escritorio / Vista Previa</span>
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold" :style="{ backgroundColor: formTema.sidebar_active_bg, color: formTema.sidebar_active_text }">S</div>
              <span class="text-[10px] font-bold" :style="{ color: formTema.header_text }">Nombre de Usuario</span>
            </div>
          </div>

          <!-- Mini Body Estándar Fijo IECM -->
          <div class="p-4 space-y-3 flex-grow overflow-y-auto">
            <div class="bg-[#1B1133] border border-[#8C65AA]/30 p-4 rounded-2xl space-y-2">
              <h4 class="font-bold text-white text-xs">Diseño Fijo Institucional IECM</h4>
              <p class="text-[11px] text-slate-300 leading-relaxed">
                Las tarjetas, tablas y botones del contenido principal mantienen siempre la identidad oficial morada del IECM para garantizar legibilidad y coherencia visual.
              </p>
              <div class="pt-1 flex gap-2">
                <button class="py-1.5 px-3 rounded-xl font-bold text-[10px] text-white bg-[#8C65AA]">
                  Botón Institucional
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useThemeStore } from '../../stores/theme.store';
import Swal from 'sweetalert2';

const themeStore = useThemeStore();

const formTema = reactive({
  sidebar_bg: '#1B1133',
  sidebar_text: '#C7B3DC',
  sidebar_active_bg: '#8C65AA',
  sidebar_active_text: '#ffffff',
  header_bg: '#110922',
  header_text: '#ffffff',
  primary_color: '#8C65AA',
  primary_text: '#ffffff',
  primary_hover: '#795397'
});

const paletasPredefinidas = {
  iecmOficial: {
    nombre: 'IECM Institucional (Defecto)',
    colors: {
      sidebar_bg: '#1B1133',
      sidebar_text: '#C7B3DC',
      sidebar_active_bg: '#8C65AA',
      sidebar_active_text: '#ffffff',
      header_bg: '#110922',
      header_text: '#ffffff',
      primary_color: '#8C65AA',
      primary_text: '#ffffff',
      primary_hover: '#795397'
    }
  },
  moradoOscuro: {
    nombre: 'Noche Profunda',
    colors: {
      sidebar_bg: '#0F081D',
      sidebar_text: '#A391BF',
      sidebar_active_bg: '#5E3B7A',
      sidebar_active_text: '#ffffff',
      header_bg: '#090412',
      header_text: '#ffffff',
      primary_color: '#8C65AA',
      primary_text: '#ffffff',
      primary_hover: '#795397'
    }
  },
  purpuraModerno: {
    nombre: 'Púrpura Neón',
    colors: {
      sidebar_bg: '#241445',
      sidebar_text: '#D5C4F0',
      sidebar_active_bg: '#9B6ECC',
      sidebar_active_text: '#ffffff',
      header_bg: '#180B33',
      header_text: '#ffffff',
      primary_color: '#8C65AA',
      primary_text: '#ffffff',
      primary_hover: '#795397'
    }
  },
  oscuroMinimal: {
    nombre: 'Negro Mate',
    colors: {
      sidebar_bg: '#0A0A0E',
      sidebar_text: '#9CA3AF',
      sidebar_active_bg: '#8C65AA',
      sidebar_active_text: '#ffffff',
      header_bg: '#000000',
      header_text: '#ffffff',
      primary_color: '#8C65AA',
      primary_text: '#ffffff',
      primary_hover: '#795397'
    }
  }
};

onMounted(() => {
  Object.assign(formTema, themeStore.theme);
});

const actualizarVistaPrevia = () => {
  themeStore.aplicarVariablesCSS(formTema);
};

const aplicarPaletaPreset = (colors) => {
  Object.assign(formTema, colors);
  actualizarVistaPrevia();
};

const restablecerPredeterminado = () => {
  aplicarPaletaPreset(paletasPredefinidas.iecmOficial.colors);
};

const guardarCambios = async () => {
  try {
    const res = await themeStore.guardarTema(formTema);
    Swal.fire({
      icon: 'success',
      title: '¡Personalización Guardada!',
      text: res.mensaje || 'Los colores del Menú y Header fueron actualizados correctamente.',
      background: '#1B1133',
      color: '#fff',
      confirmButtonColor: '#8C65AA'
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error al guardar',
      text: err.response?.data?.error || err.message,
      background: '#1B1133',
      color: '#fff'
    });
  }
};
</script>
