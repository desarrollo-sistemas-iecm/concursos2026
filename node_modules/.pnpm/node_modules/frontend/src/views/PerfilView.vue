<template>
  <div class="space-y-6 max-w-6xl mx-auto text-left">
    
    <!-- BANNER DE PERFIL TIPO TAILADMIN PRO -->
    <div
      :class="[
        'relative rounded-3xl overflow-hidden border shadow-xl transition-all duration-300',
        esTemaOscuro
          ? 'bg-[#1B1133] border-[#8C65AA]/30 text-white'
          : 'bg-white border-[#32215C]/15 text-[#1E1238] shadow-[0_10px_30px_rgba(50,33,92,0.08)]'
      ]"
    >
      <!-- Fondo de Resplandor Neón Superior -->
      <div class="h-32 sm:h-40 w-full bg-gradient-to-r from-[#32215C] via-[#8C65AA] to-[#32215C] relative overflow-hidden">
        <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      <!-- Información del Avatar y Encabezado de Usuario -->
      <div class="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
        <div class="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
          <!-- Avatar de Iniciales de Usuario -->
          <div
            :class="[
              'w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 flex items-center justify-center font-black text-3xl sm:text-4xl shadow-2xl shrink-0 transition-transform duration-300 hover:scale-105',
              esTemaOscuro
                ? 'bg-[#110922] border-[#8C65AA] text-[#E0CEF2] shadow-[0_0_30px_rgba(140,101,170,0.5)]'
                : 'bg-white border-[#32215C] text-[#32215C] shadow-[0_10px_30px_rgba(50,33,92,0.15)]'
            ]"
          >
            {{ userNombre[0] ? userNombre[0].toUpperCase() : 'U' }}
          </div>

          <div class="space-y-1">
            <div class="flex items-center gap-3 justify-center sm:justify-start">
              <h1 :class="['text-xl sm:text-2xl font-black tracking-tight', esTemaOscuro ? 'text-white' : 'text-[#32215C]']">
                {{ userNombre }} {{ userApellidoPat }} {{ userApellidoMat }}
              </h1>
            </div>

            <p :class="['text-xs font-bold flex items-center gap-2 justify-center sm:justify-start', esTemaOscuro ? 'text-[#C7B3DC]' : 'text-slate-700']">
              <svg class="w-4 h-4 text-[#8C65AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ userCorreo }}
            </p>

            <div class="flex items-center gap-2 pt-1 justify-center sm:justify-start">
              <!-- Tag de Rol -->
              <span
                :class="[
                  'px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border',
                  esTemaOscuro ? 'bg-[#8C65AA]/20 border-[#8C65AA]/40 text-[#E0CEF2]' : 'bg-[#32215C]/10 border-[#32215C]/20 text-[#32215C]'
                ]"
              >
                {{ rolNombre }}
              </span>

              <!-- Tag de Solo Lectura -->
              <span :class="['px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border', esTemaOscuro ? 'bg-slate-500/10 text-slate-300 border-slate-500/20' : 'bg-slate-200 text-slate-700 border-slate-300']">
                Solo Lectura
              </span>
            </div>
          </div>
        </div>

        <!-- Badges Adicionales para el Participante -->
        <div v-if="esParticipante" class="flex flex-col items-center sm:items-end gap-2 shrink-0">
          <div
            v-if="folioInscripcion"
            class="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 shadow-sm font-mono"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
            <span>FOLIO: {{ folioInscripcion }}</span>
          </div>

          <button
            v-if="Number(statusEnsayo) === 1"
            @click="descargarAcuse"
            :class="[
              'btn-tactile px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all',
              esTemaOscuro
                ? 'bg-[#8C65AA] hover:bg-[#9E77C1] text-white shadow-[0_0_20px_rgba(140,101,170,0.3)]'
                : 'bg-[#32215C] hover:bg-[#432E7A] text-white shadow-[0_6px_16px_rgba(50,33,92,0.2)]'
            ]"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar Acuse PDF
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== VISTA DE PERFIL PARA PARTICIPANTE (ROL 1) ==================== -->
    <div v-if="esParticipante" class="space-y-6">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Columna Izquierda: Tarjeta del Archivo del Ensayo Cargado -->
        <div
          :class="[
            'rounded-3xl p-6 border shadow-lg space-y-4 flex flex-col justify-between transition-all duration-300',
            esTemaOscuro
              ? 'bg-[#1B1133] border-[#8C65AA]/30 text-white'
              : 'bg-white border-[#32215C]/15 text-[#1E1238] shadow-[0_10px_30px_rgba(50,33,92,0.06)]'
          ]"
        >
          <div class="space-y-3">
            <h3 :class="['text-xs font-bold uppercase tracking-wider border-b pb-2', esTemaOscuro ? 'border-white/10 text-[#C7B3DC]' : 'border-slate-200 text-[#32215C]']">
              Archivo del Ensayo (Obra)
            </h3>

            <div v-if="archivoEnsayo" class="space-y-3">
              <div class="flex items-center gap-3 p-3 rounded-2xl border" :class="esTemaOscuro ? 'bg-[#110922] border-[#8C65AA]/20' : 'bg-slate-50 border-slate-300'">
                <svg class="w-8 h-8 text-rose-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                </svg>
                <div class="min-w-0 flex-1 text-left">
                  <p :class="['text-xs font-bold truncate', esTemaOscuro ? 'text-white' : 'text-[#32215C]']">{{ archivoEnsayo }}</p>
                  <p :class="['text-[10px] font-mono font-semibold', esTemaOscuro ? 'text-slate-400' : 'text-slate-500']">Formato PDF &bull; Versión Activa</p>
                </div>
              </div>

              <a
                :href="`/api/documentos/${archivoEnsayo}?token=${authStore.token}`"
                target="_blank"
                :class="[
                  'btn-tactile w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all text-center',
                  esTemaOscuro
                    ? 'bg-[#8C65AA] hover:bg-[#9E77C1] text-white shadow-[0_0_20px_rgba(140,101,170,0.3)]'
                    : 'bg-[#32215C] hover:bg-[#432E7A] text-white shadow-[0_6px_16px_rgba(50,33,92,0.2)]'
                ]"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar Ensayo PDF
              </a>
            </div>

            <div v-else class="text-center py-6 rounded-2xl border border-dashed text-xs" :class="esTemaOscuro ? 'border-white/10 bg-[#110922]/50 text-slate-400' : 'border-slate-300 bg-slate-50 text-slate-600 font-medium'">
              Ensayo pendiente de carga
            </div>
          </div>

          <div :class="['pt-4 border-t text-[10px] text-center font-mono font-semibold', esTemaOscuro ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500']">
            Expediente Digital Oficial &bull; Convocatoria {{ convocatoriaAnio }}
          </div>
        </div>

        <!-- Columna Derecha: Tarjetas de Información Consolidada del Participante -->
        <div class="md:col-span-2 space-y-6">
          
          <!-- Bloque 1: Datos Personales del Usuario -->
          <div
            :class="[
              'rounded-3xl p-6 border shadow-lg space-y-5 transition-all duration-300',
              esTemaOscuro
                ? 'bg-[#1B1133] border-[#8C65AA]/30 text-white'
                : 'bg-white border-[#32215C]/15 text-[#1E1238] shadow-[0_10px_30px_rgba(50,33,92,0.06)]'
            ]"
          >
            <h3 :class="['text-xs font-bold uppercase tracking-wider border-b pb-2', esTemaOscuro ? 'border-white/10 text-[#C7B3DC]' : 'border-slate-200 text-[#32215C]']">
              1. Datos Personales del Usuario
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">Nombre Completo</span>
                <p :class="['font-bold text-sm', esTemaOscuro ? 'text-white' : 'text-[#32215C]']">{{ userNombre }} {{ userApellidoPat }} {{ userApellidoMat }}</p>
              </div>
              <div>
                <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">CURP</span>
                <p :class="['font-mono font-bold text-xs', esTemaOscuro ? 'text-[#C7B3DC]' : 'text-[#32215C]']">{{ curp || 'No registrado' }}</p>
              </div>
              <div>
                <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">Correo Electrónico</span>
                <p :class="['font-bold truncate', esTemaOscuro ? 'text-slate-200' : 'text-slate-900']">{{ userCorreo }}</p>
              </div>
              <div>
                <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">Género</span>
                <p :class="['font-bold', esTemaOscuro ? 'text-slate-200' : 'text-slate-900']">{{ genero || 'Masculino' }}</p>
              </div>
              <div>
                <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">Fecha de Nacimiento</span>
                <p :class="['font-bold', esTemaOscuro ? 'text-slate-200' : 'text-slate-900']">{{ fechaNacimientoFormateada || 'No registrada' }}</p>
              </div>
              <div>
                <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">Categoría Asignada</span>
                <p :class="['font-bold', esTemaOscuro ? 'text-[#C7B3DC]' : 'text-[#32215C]']">{{ categoriaAsignadaTexto }}</p>
              </div>
            </div>
          </div>

          <!-- Bloque 2: Residencia Geográfica -->
          <div
            :class="[
              'rounded-3xl p-6 border shadow-lg space-y-4 transition-all duration-300',
              esTemaOscuro
                ? 'bg-[#1B1133] border-[#8C65AA]/30 text-white'
                : 'bg-white border-[#32215C]/15 text-[#1E1238] shadow-[0_10px_30px_rgba(50,33,92,0.06)]'
            ]"
          >
            <h3 :class="['text-xs font-bold uppercase tracking-wider border-b pb-2', esTemaOscuro ? 'border-white/10 text-[#C7B3DC]' : 'border-slate-200 text-[#32215C]']">
              2. Residencia Geográfica
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">Municipio / Alcaldía</span>
                <p :class="['font-bold', esTemaOscuro ? 'text-slate-200' : 'text-slate-900']">{{ nombreAlcaldia }}</p>
              </div>
              <div>
                <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">Entidad Federativa</span>
                <p :class="['font-bold', esTemaOscuro ? 'text-slate-200' : 'text-slate-900']">{{ entidad || 'Ciudad de México' }}</p>
              </div>
              <div>
                <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">¿Originario de CDMX?</span>
                <p :class="['font-bold', esTemaOscuro ? 'text-slate-200' : 'text-slate-900']">{{ originarioTexto }}</p>
              </div>
            </div>
          </div>

          <!-- Bloque 3: Ficha Técnica de la Obra -->
          <div
            :class="[
              'rounded-3xl p-6 border shadow-lg space-y-4 transition-all duration-300',
              esTemaOscuro
                ? 'bg-[#1B1133] border-[#8C65AA]/30 text-white'
                : 'bg-white border-[#32215C]/15 text-[#1E1238] shadow-[0_10px_30px_rgba(50,33,92,0.06)]'
            ]"
          >
            <h3 :class="['text-xs font-bold uppercase tracking-wider border-b pb-2', esTemaOscuro ? 'border-white/10 text-[#C7B3DC]' : 'border-slate-200 text-[#32215C]']">
              3. Ficha Técnica de la Obra
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="sm:col-span-2">
                <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">Título del Ensayo</span>
                <p :class="['font-bold italic text-sm', esTemaOscuro ? 'text-white' : 'text-[#32215C]']">"{{ tituloEnsayo || 'Sin título registrado' }}"</p>
              </div>
              <div>
                <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">Seudónimo</span>
                <p :class="['font-mono font-bold', esTemaOscuro ? 'text-[#C7B3DC]' : 'text-[#32215C]']">{{ seudonimo || 'No asignado' }}</p>
              </div>
              <div>
                <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">Medio de Difusión</span>
                <p :class="['font-bold', esTemaOscuro ? 'text-slate-200' : 'text-slate-900']">{{ opcionEnterasteTexto }}</p>
              </div>
            </div>
          </div>

          <!-- Bloque 4: Expediente de Tutoría (Menor de Edad) -->
          <div
            v-if="esMenorDeEdad"
            :class="[
              'rounded-3xl p-6 border shadow-lg space-y-4 transition-all duration-300',
              esTemaOscuro
                ? 'bg-[#1B1133] border-[#8C65AA]/30 text-white'
                : 'bg-white border-[#32215C]/15 text-[#1E1238] shadow-[0_10px_30px_rgba(50,33,92,0.06)]'
            ]"
          >
            <h3 class="text-xs font-bold uppercase tracking-wider border-b pb-2 text-amber-600 dark:text-amber-400 border-current/10">
              4. Expediente de Tutoría (Menor de Edad)
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">Nombre del Tutor</span>
                <p :class="['font-bold', esTemaOscuro ? 'text-slate-200' : 'text-slate-900']">{{ nombreTutor }}</p>
              </div>
              <div>
                <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">Clave INE / Elector</span>
                <p class="font-mono font-bold text-amber-600 dark:text-amber-400">{{ claveElectorTutor || 'N/D' }}</p>
              </div>
              <div>
                <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">Teléfonos de Contacto</span>
                <p :class="['font-bold', esTemaOscuro ? 'text-slate-200' : 'text-slate-900']">{{ telefonosTutor || 'N/D' }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- ==================== VISTA DE PERFIL PARA STAFF (ADMIN, SUPERADMIN, JUEZ) ==================== -->
    <div v-else class="space-y-6">
      <div
        :class="[
          'rounded-3xl p-6 sm:p-8 border shadow-lg space-y-6 transition-all duration-300',
          esTemaOscuro
            ? 'bg-[#1B1133] border-[#8C65AA]/30 text-white'
            : 'bg-white border-[#32215C]/15 text-[#1E1238] shadow-[0_10px_30px_rgba(50,33,92,0.06)]'
        ]"
      >
        <div class="border-b pb-4 flex items-center justify-between" :class="esTemaOscuro ? 'border-white/10' : 'border-slate-200'">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-2xl bg-[#8C65AA]/20 text-[#8C65AA]">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 :class="['text-base font-black tracking-tight', esTemaOscuro ? 'text-white' : 'text-[#32215C]']">
                Información de la Cuenta Staff
              </h2>
              <p :class="['text-xs font-medium', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">Datos operativos asignados a tu cuenta institucional.</p>
            </div>
          </div>

          <span class="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
            Cuenta Activa
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div class="space-y-1">
            <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">Nombre de Usuario</span>
            <p :class="['font-mono font-bold text-sm', esTemaOscuro ? 'text-[#C7B3DC]' : 'text-[#32215C]']">{{ userUsuario }}</p>
          </div>

          <div class="space-y-1">
            <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">Correo Institucional</span>
            <p :class="['font-bold text-sm', esTemaOscuro ? 'text-white' : 'text-[#32215C]']">{{ userCorreo }}</p>
          </div>

          <div class="space-y-1">
            <span :class="['block text-[10px] font-bold uppercase tracking-wider', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">Rol del Sistema</span>
            <p :class="['font-bold text-sm', esTemaOscuro ? 'text-[#C7B3DC]' : 'text-[#32215C]']">{{ rolNombre }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useConvocatoriaStore } from '../stores/convocatoria.store';
import api from '../services/api';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const convocatoriaStore = useConvocatoriaStore();

const esTemaOscuro = ref(true);
let themeObserver = null;

const evaluarTema = () => {
  esTemaOscuro.value = document.documentElement.classList.contains('dark');
};

onMounted(() => {
  evaluarTema();
  cargarCatalogosYDatos();

  themeObserver = new MutationObserver(() => {
    evaluarTema();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});

onUnmounted(() => {
  if (themeObserver) {
    themeObserver.disconnect();
  }
});

const userNombre = computed(() => authStore.user?.nombre || 'Usuario');
const userApellidoPat = computed(() => authStore.user?.apellido_pat || '');
const userApellidoMat = computed(() => authStore.user?.apellido_mat || '');
const userCorreo = computed(() => authStore.user?.correo || '');
const userUsuario = computed(() => authStore.user?.usuario || '');
const rolId = computed(() => authStore.rol);

const esParticipante = computed(() => rolId.value === 1);
const convocatoriaAnio = computed(() => convocatoriaStore.anio || '2027');

const rolNombre = computed(() => {
  if (rolId.value === 4) return 'Superadmin';
  if (rolId.value === 2) return 'Administrador';
  if (rolId.value === 3) return 'Juez Jurado';
  if (rolId.value === 1) return 'Participante';
  return 'Usuario';
});

// Catálogos
const alcaldias = ref([]);
const opcionesEnteraste = ref([]);

// Datos Consolidados de Ficha de Participante (Solo Lectura)
const curp = ref('');
const genero = ref('');
const fechaNacimiento = ref('');
const edadCalculada = ref(null);
const idAlcaldia = ref(null);
const idTeEnteraste = ref(null);
const entidad = ref('');
const soyOriginario = ref(false);

const tituloEnsayo = ref('');
const seudonimo = ref('');
const statusEnsayo = ref(null);
const folioInscripcion = ref('');
const idCategoria = ref(null);
const archivoEnsayo = ref('');

// Tutoría (Menores de Edad)
const esMenorDeEdad = ref(false);
const nombreTutor = ref('');
const claveElectorTutor = ref('');
const telefonosTutor = ref('');

const nombreAlcaldia = computed(() => {
  if (!idAlcaldia.value) return 'No registrada';
  const alc = alcaldias.value.find(a => a.id_alcaldia === parseInt(idAlcaldia.value, 10));
  return alc ? alc.nombre : 'Coyoacán';
});

const opcionEnterasteTexto = computed(() => {
  if (!idTeEnteraste.value) return 'Página web del IECM';
  const opt = opcionesEnteraste.value.find(o => o.id_te_enteraste === parseInt(idTeEnteraste.value, 10));
  return opt ? opt.descripcion : 'Página web del IECM';
});

const originarioTexto = computed(() => {
  if (parseInt(idAlcaldia.value, 10) === 17) {
    return soyOriginario.value ? 'Sí' : 'No';
  }
  return 'Sí (Residente Local)';
});

const categoriaAsignadaTexto = computed(() => {
  if (edadCalculada.value !== null) {
    return edadCalculada.value < 18 ? 'Categoría 1 (15 a 17 años)' : 'Categoría 2 (18 a 29 años)';
  }
  if (idCategoria.value === 1) return 'Categoría 1 (15 a 17 años)';
  if (idCategoria.value === 2) return 'Categoría 2 (18 a 29 años)';
  return 'Categoría Concurso';
});

const fechaNacimientoFormateada = computed(() => {
  if (!fechaNacimiento.value) return '';
  const date = new Date(fechaNacimiento.value);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-MX', { timeZone: 'UTC' });
});

const cargarCatalogosYDatos = async () => {
  if (!esParticipante.value) return;

  try {
    const [alcRes, enterasteRes] = await Promise.all([
      api.get('/catalogos/alcaldias'),
      api.get('/catalogos/te-enteraste')
    ]);
    alcaldias.value = alcRes.data;
    opcionesEnteraste.value = enterasteRes.data;
  } catch (err) {
    console.error('Error al cargar catálogos en PerfilView:', err.message);
  }

  try {
    const res = await api.get('/participante/mi-registro');
    if (res.data) {
      const { participante, fecha_nacimiento, curp: curpUsuario, genero: generoUsuario } = res.data;
      
      if (participante) {
        curp.value = curpUsuario || '';
        genero.value = generoUsuario || 'Masculino';
        fechaNacimiento.value = fecha_nacimiento || '';
        idAlcaldia.value = participante.id_alcaldia;
        idTeEnteraste.value = participante.id_te_enteraste;
        entidad.value = participante.entidad || 'Ciudad de México';
        soyOriginario.value = participante.soy_originario === 1 || participante.soy_originario === true;

        tituloEnsayo.value = participante.titulo_ensayo || '';
        seudonimo.value = participante.seudonimo || '';
        statusEnsayo.value = participante.status_ensayo;
        folioInscripcion.value = participante.folio || '';
        idCategoria.value = participante.id_categoria;
        archivoEnsayo.value = participante.archivo_ensayo || '';

        try {
          const reqRes = await api.get('/participante/requisitos-archivos');
          if (reqRes.data?.misArchivos?.length > 0) {
            const archEnsayoObj = reqRes.data.misArchivos.find(a => 
              a.nombre_requisito && (
                a.nombre_requisito.toLowerCase().includes('ensayo') || 
                a.nombre_requisito.toLowerCase().includes('obra')
              )
            );
            if (archEnsayoObj && archEnsayoObj.nombre_guardado) {
              archivoEnsayo.value = archEnsayoObj.nombre_guardado;
            }
          }
        } catch (e) {}

        // Tutoría
        if (participante.nombre_tutor) {
          esMenorDeEdad.value = true;
          nombreTutor.value = `${participante.nombre_tutor} ${participante.apellido_pat_tutor || ''} ${participante.apellido_mat_tutor || ''}`.trim();
          claveElectorTutor.value = participante.clave_elector_tutor || '';
          telefonosTutor.value = [participante.tel1, participante.tel2].filter(Boolean).join(' / ');
        }

        // Calcular Edad
        if (fecha_nacimiento) {
          const cumple = new Date(fecha_nacimiento);
          if (!isNaN(cumple.getTime())) {
            const hoy = new Date();
            let edad = hoy.getFullYear() - cumple.getFullYear();
            const m = hoy.getMonth() - cumple.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
              edad--;
            }
            edadCalculada.value = edad;
            if (edad < 18) {
              esMenorDeEdad.value = true;
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error al obtener expediente de perfil:', err.message);
  }
};

const descargarAcuse = async () => {
  try {
    const res = await api.get('/documentos/descargar-acuse');
    if (res.data?.urlDescarga) {
      window.open(res.data.urlDescarga, '_blank');
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error al descargar acuse',
      text: err.response?.data?.error || 'No se pudo generar la liga de descarga.',
      confirmButtonColor: '#f43f5e'
    });
  }
};
</script>
