<template>
  <div
    :class="[
      'h-screen w-full flex overflow-hidden relative font-sans selection:bg-[#8C65AA] selection:text-white transition-colors duration-500',
      esTemaOscuro ? 'iecm-dark bg-[#0F172A] text-slate-100' : 'iecm-light bg-[#F8F5FB] text-[#1E1238]'
    ]"
  >
    <!-- BLOBS AMBIENTALES DE RESPLANDOR DIFUMINADO -->
    <div
      :class="[
        'absolute -top-24 -right-24 w-[550px] h-[550px] rounded-full blur-[180px] pointer-events-none transition-opacity duration-700 z-0',
        esTemaOscuro ? 'bg-[#8C65AA]/20' : 'bg-[#8C65AA]/10'
      ]"
    ></div>
    <div
      :class="[
        'absolute -bottom-24 -left-24 w-[550px] h-[550px] rounded-full blur-[180px] pointer-events-none transition-opacity duration-700 z-0',
        esTemaOscuro ? 'bg-[#32215C]/40' : 'bg-[#32215C]/10'
      ]"
    ></div>

    <!-- BACKDROP PARA MÓVIL (DRAWER EN PANTALLAS PEQUEÑAS) -->
    <div
      v-if="mobileMenuAbierto"
      @click="mobileMenuAbierto = false"
      class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
    ></div>    <!-- SIDEBAR FIEL A TAILADMIN LAYOUT TWO (DRAWER EN MÓVIL Y PANEL FIJO EN DESKTOP) -->
    <aside
      :class="[
        'h-screen flex flex-col justify-between shrink-0 transition-all duration-300 backdrop-blur-2xl z-50',
        'fixed inset-y-0 left-0 lg:static lg:z-auto',
        mobileMenuAbierto ? 'translate-x-0 w-72 sm:w-80 shadow-2xl' : '-translate-x-full lg:translate-x-0',
        sidebarColapsado && !mobileMenuAbierto ? 'lg:w-22' : 'lg:w-72',
        esTemaOscuro
          ? 'bg-[#111927]/98 border-r border-slate-800/80 shadow-[4px_0_30px_rgba(0,0,0,0.4)]'
          : 'bg-white/98 border-r border-slate-200 shadow-[4px_0_24px_rgba(50,33,92,0.06)]'
      ]"
      :style="themeStore.theme?.sidebar_bg ? { backgroundColor: themeStore.theme?.sidebar_bg } : {}"
    >
      <div class="px-4 py-5 space-y-6 flex-grow flex flex-col min-h-0">
              <!-- HEADER SIDEBAR LIMPIO CON LOGO IECM Y BOTÓN DE NAVEGACIÓN -->
        <div :class="['flex items-center min-h-[76px] pb-4 border-b border-white/10 shrink-0 transition-all duration-300', sidebarColapsado && !mobileMenuAbierto ? 'justify-center px-1' : 'justify-between px-2']">
          
          <!-- MODO EXPANDIDO: Logo Institucional Completo + Botón Colapsar -->
          <template v-if="!sidebarColapsado || mobileMenuAbierto">
            <div class="flex items-center gap-3 overflow-hidden py-1">
              <img
                :src="logowhite"
                alt="Logo Oficial IECM Blanco"
                class="h-14 sm:h-16 w-auto max-w-[210px] object-contain shrink-0 transition-all duration-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] filter brightness-105"
              />
            </div>

            <!-- Botón Cierre Móvil X (< lg) -->
            <button
              v-if="mobileMenuAbierto"
              @click="mobileMenuAbierto = false"
              class="lg:hidden w-11 h-11 rounded-2xl flex items-center justify-center border border-white/20 text-white hover:bg-white/10 active:scale-95 cursor-pointer shrink-0 transition-all"
              aria-label="Cerrar menú lateral"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Botón Colapsar Panel (Desktop >= lg) -->
            <button
              v-else
              @click="sidebarColapsado = true"
              class="hidden lg:flex relative w-11 h-11 rounded-2xl items-center justify-center border border-[#8C65AA]/50 bg-gradient-to-br from-[#8C65AA]/30 via-[#32215C]/40 to-[#111927] hover:border-[#8C65AA] text-white cursor-pointer transition-all duration-300 shrink-0 shadow-[0_0_20px_rgba(140,101,170,0.3)] hover:shadow-[0_0_30px_rgba(140,101,170,0.75)] active:scale-95 group overflow-hidden"
              title="Colapsar panel lateral"
            >
              <span class="absolute inset-0 bg-gradient-to-r from-[#8C65AA]/0 via-[#E0CEF2]/25 to-[#8C65AA]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
              <div class="relative w-5 h-5 flex items-center justify-center">
                <svg class="w-5 h-5 text-white transition-all duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h10M4 18h14" />
                </svg>
              </div>
            </button>
          </template>

          <!-- MODO COLAPSADO: Único Botón Neón Centrado con Isotipo & Flecha Expandir -->
          <template v-else>
            <button
              @click="sidebarColapsado = false"
              class="relative w-12 h-12 rounded-2xl flex items-center justify-center border border-[#8C65AA]/60 bg-gradient-to-br from-[#8C65AA]/40 via-[#32215C]/60 to-[#111927] hover:border-[#8C65AA] text-white cursor-pointer transition-all duration-300 shrink-0 shadow-[0_0_25px_rgba(140,101,170,0.45)] hover:shadow-[0_0_35px_rgba(140,101,170,0.85)] active:scale-95 group overflow-hidden"
              title="Expandir panel lateral"
            >
              <span class="absolute inset-0 bg-gradient-to-r from-[#8C65AA]/0 via-[#E0CEF2]/30 to-[#8C65AA]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
              <div class="relative flex items-center justify-center">
                <img
                  :src="logoSolo"
                  alt="Expandir IECM"
                  class="h-8 w-8 object-contain transition-all duration-300 group-hover:scale-110 brightness-0 invert filter drop-shadow-[0_0_8px_rgba(255,255,255,0.85)]"
                />
              </div>
            </button>
          </template>

        </div>

        <!-- NAVEGACIÓN TAILADMIN LAYOUT TWO CON SUBMENÚS -->
        <nav class="space-y-6 overflow-y-auto flex-grow pr-1">
          <div v-for="categoria in menuEstructurado" :key="categoria.categoria" class="space-y-2">
            
            <p
              v-if="!sidebarColapsado || mobileMenuAbierto"
              class="px-3 text-[11px] font-black uppercase tracking-widest font-mono text-[#C7B3DC] dark:text-[#C7B3DC]"
            >
              {{ categoria.categoria }}
            </p>

            <div v-for="grupo in categoria.grupos" :key="grupo.key" class="space-y-1">
              
              <button
                @click="toggleGrupo(grupo.key)"
                :class="[
                  'w-full flex items-center justify-between py-3 px-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border',
                  gruposAbiertos[grupo.key]
                    ? 'bg-[#8C65AA]/30 border-[#8C65AA]/60 text-white shadow-[0_0_20px_rgba(140,101,170,0.25)]'
                    : 'border-transparent text-[#E0CEF2] hover:bg-white/10 hover:text-white'
                ]"
              >
                <div class="flex items-center gap-3">
                  <span class="shrink-0 text-white" v-html="grupo.icon"></span>
                  <span v-if="!sidebarColapsado || mobileMenuAbierto" class="truncate">{{ grupo.titulo }}</span>
                </div>

                <svg
                  v-if="!sidebarColapsado || mobileMenuAbierto"
                  :class="[
                    'w-4 h-4 transition-transform duration-300 shrink-0 text-white',
                    gruposAbiertos[grupo.key] ? 'rotate-180' : ''
                  ]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <Transition name="submenu-accordion">
                <div
                  v-show="gruposAbiertos[grupo.key] && (!sidebarColapsado || mobileMenuAbierto)"
                  class="ml-6 pl-4 border-l border-[#8C65AA]/40 space-y-2 py-1.5"
                >
                  <router-link
                    v-for="subitem in grupo.items"
                    :key="subitem.path"
                    :to="subitem.path"
                    @click="mobileMenuAbierto = false"
                    :class="[
                      'block text-xs font-bold py-1.5 px-2.5 transition-colors cursor-pointer rounded-lg truncate min-h-[36px] flex items-center',
                      esSubitemActivo(subitem.path)
                        ? 'text-white font-black tracking-tight bg-[#8C65AA]/30 border border-[#8C65AA]/50'
                        : 'text-[#C7B3DC] hover:text-white hover:bg-white/5'
                    ]"
                  >
                    {{ subitem.nombre }}
                  </router-link>
                </div>
              </Transition>
            </div>
          </div>
        </nav>
      </div>

      <!-- PIE DE SIDEBAR (USUARIO CON NAVEGACIÓN A PERFIL) -->
      <div class="p-4 border-t border-current/10 shrink-0">
        <router-link
          to="/perfil"
          @click="mobileMenuAbierto = false"
          class="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer p-1 rounded-xl"
          :class="sidebarColapsado && !mobileMenuAbierto ? 'justify-center' : ''"
          title="Ver mi perfil de usuario"
        >
          <div
            :class="[
              'w-10 h-10 rounded-2xl border flex items-center justify-center font-bold text-sm shrink-0 shadow-sm',
              esTemaOscuro ? 'bg-[#8C65AA]/20 border-[#8C65AA]/40 text-[#E0CEF2]' : 'bg-[#32215C]/10 border-[#32215C]/20 text-[#32215C]'
            ]"
          >
            {{ authStore.user?.nombre ? authStore.user.nombre[0].toUpperCase() : 'U' }}
          </div>
          <div v-if="!sidebarColapsado || mobileMenuAbierto" class="truncate text-left leading-tight flex-grow min-w-0">
            <span :class="['block text-xs font-bold truncate', esTemaOscuro ? 'text-white' : 'text-[#32215C]']">{{ authStore.user?.nombre }} {{ authStore.user?.apellido_pat }}</span>
            <span :class="['block text-[9px] font-mono uppercase tracking-wider truncate', esTemaOscuro ? 'text-slate-400' : 'text-slate-500']">{{ rolNombre }}</span>
          </div>
        </router-link>
      </div>
    </aside>

    <!-- ÁREA PRINCIPAL PERMANENTE CON ÚNICO SCROLLBAR -->
    <div class="flex-grow flex flex-col w-full max-w-full min-w-0 h-screen overflow-y-auto overflow-x-hidden relative z-10 transition-colors">
      
      <!-- HEADER SUPERIOR RESPONSIVO (44PX TOUCH TARGETS & ADAPTABILIDAD TOTAL) -->
      <header
        :class="[
          'h-16 px-3 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 transition-all duration-300 backdrop-blur-xl w-full max-w-full',
          esTemaOscuro
            ? 'glass-header-dark bg-[#111927]/95 border-b border-slate-800 text-white'
            : 'glass-header-light bg-white/95 border-b border-slate-200 text-[#32215C]'
        ]"
      >
        <!-- Lado Izquierdo: Hamburguesa Móvil/Tablet + Isotipo IECM + Tag de Rol -->
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <!-- Botón Hamburguesa Táctil (Mínimo 44px x 44px) -->
          <button
            @click="mobileMenuAbierto = !mobileMenuAbierto"
            :class="[
              'lg:hidden min-w-[44px] min-h-[44px] rounded-xl border cursor-pointer transition-all duration-300 active:scale-95 shadow-sm flex items-center justify-center shrink-0',
              esTemaOscuro
                ? 'bg-[#8C65AA]/20 border-[#8C65AA]/40 text-white hover:bg-[#8C65AA]/40'
                : 'bg-[#32215C]/10 border-[#32215C]/30 text-[#32215C] hover:bg-[#32215C]/20'
            ]"
            aria-label="Abrir menú de navegación"
            title="Abrir menú"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- Logo Institutional Oficial en Móviles (< lg) -->
          <div class="lg:hidden flex items-center shrink-0 py-1">
            <img 
              :src="esTemaOscuro ? logowhite : logodarktxt" 
              alt="Logo IECM" 
              class="h-9 sm:h-11 w-auto max-w-[140px] sm:max-w-[170px] object-contain drop-shadow-md transition-all duration-300" 
            />
          </div>

          <!-- Tag de Rol Activo (Desktop >= lg) -->
          <span
            :class="[
              'hidden lg:inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border',
              esTemaOscuro ? 'bg-[#8C65AA]/20 border-[#8C65AA]/40 text-[#E0CEF2]' : 'bg-[#32215C]/10 border-[#32215C]/20 text-[#32215C]'
            ]"
          >
            Panel {{ rolNombre }}
          </span>
        </div>

        <!-- Centro: Título del Certamen (Flexible sin truncados abruptos) -->
        <div class="text-center min-w-0 flex-1 px-2">
          <h1
            :class="[
              'text-xs sm:text-sm md:text-base font-black tracking-tight leading-tight transition-colors duration-300 line-clamp-2 sm:line-clamp-1 mx-auto',
              esTemaOscuro ? 'text-white' : 'text-[#32215C]'
            ]"
            :title="convocatoriaStore.nombre"
          >
            {{ convocatoriaStore.nombre }}
          </h1>
          <p :class="['hidden sm:block text-[10px] font-mono font-semibold tracking-wider opacity-80 truncate', esTemaOscuro ? 'text-[#C7B3DC]' : 'text-[#8C65AA]']">
            Instituto Electoral de la Ciudad de México &bull; {{ convocatoriaStore.anio }}
          </p>
        </div>

        <!-- Lado Derecho: Controles (Perfil en Header, Tema & Notificaciones responsivos) -->
        <div class="flex items-center justify-end gap-1.5 sm:gap-2.5 shrink-0">
          <!-- Switch Modo Oscuro / Claro (Visible en Desktop & Tablet) -->
          <div class="hidden sm:flex items-center min-h-[44px]">
            <label class="relative inline-flex items-center cursor-pointer select-none" title="Cambiar modo claro / oscuro">
              <span class="sr-only">Cambiar modo claro / oscuro</span>
              <div :class="['relative w-11 sm:w-12 h-6 border rounded-full transition-colors duration-300', esTemaOscuro ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300']"></div>
              <input
                type="checkbox"
                :checked="esTemaOscuro"
                @change="toggleTema"
                class="absolute top-0 left-0 w-full h-full cursor-pointer opacity-0 z-20"
              />
              <span
                class="absolute top-0.5 left-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 z-10"
                :class="esTemaOscuro ? 'translate-x-5 sm:translate-x-6 bg-[#0F172A]' : 'translate-x-0 bg-white'"
              >
                <svg v-if="!esTemaOscuro" class="w-3.5 h-3.5 text-amber-500 theme-toggle-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
                <svg v-else class="w-3.5 h-3.5 text-[#E0CEF2] theme-toggle-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </span>
            </label>
          </div>

          <!-- Campana de Notificaciones (Visible en Desktop & Tablet) -->
          <div class="hidden sm:flex items-center justify-center min-w-[44px] min-h-[44px] relative z-40">
            <CampanaNotificaciones />
          </div>

          <!-- Menú Desplegable Perfil (Siempre en Header) -->
          <div class="relative z-40" ref="menuPerfilRef">
            <button
              @click.stop="menuPerfilAbierto = !menuPerfilAbierto"
              :class="[
                'min-w-[44px] min-h-[44px] flex items-center justify-center gap-1.5 p-1 sm:p-1.5 rounded-xl transition-all cursor-pointer border',
                esTemaOscuro ? 'hover:bg-slate-800 border-slate-700/50' : 'hover:bg-slate-100 border-slate-200'
              ]"
            >
              <div
                :class="[
                  'w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0',
                  esTemaOscuro ? 'bg-[#8C65AA]/20 border-[#8C65AA]/40 text-[#E0CEF2]' : 'bg-[#32215C]/10 border-[#32215C]/20 text-[#32215C]'
                ]"
              >
                {{ authStore.user?.nombre ? authStore.user.nombre[0].toUpperCase() : 'U' }}
              </div>
              <div class="text-right hidden md:block">
                <span :class="['block text-xs font-bold leading-tight truncate max-w-[90px]', esTemaOscuro ? 'text-white' : 'text-[#32215C]']">{{ authStore.user?.nombre }}</span>
                <span :class="['block text-[9px] font-mono uppercase tracking-wider truncate', esTemaOscuro ? 'text-[#C7B3DC]' : 'text-[#8C65AA]']">{{ rolNombre }}</span>
              </div>
              <svg class="w-3.5 h-3.5 opacity-70 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              v-if="menuPerfilAbierto"
              :class="[
                'absolute right-0 mt-2 w-48 sm:w-52 border rounded-2xl shadow-2xl z-50 overflow-hidden py-1.5 text-left text-xs transition-all',
                esTemaOscuro ? 'bg-[#1E293B] border-slate-700 text-white' : 'bg-white border-slate-200 text-[#1E1238]'
              ]"
            >
              <router-link
                to="/perfil"
                @click="menuPerfilAbierto = false"
                :class="[
                  'w-full text-left px-4 py-2.5 flex items-center gap-2 cursor-pointer font-medium transition-colors min-h-[40px]',
                  esTemaOscuro ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-[#32215C]'
                ]"
              >
                <svg class="w-4 h-4 text-[#8C65AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mi Perfil
              </router-link>
              <div class="border-t border-current/10 my-1"></div>
              <button
                @click="logout"
                class="w-full text-left px-4 py-2.5 text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer font-bold min-h-[40px]"
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

      <!-- DOCK FLOTANTE VERTICAL SIN FONDO PARA MÓVILES (< SM) -->
      <div class="fixed bottom-6 right-4 z-40 sm:hidden flex flex-col items-center gap-3.5 pointer-events-auto">
        <!-- Campana Notificaciones Flotante Vertical -->
        <div class="p-1 rounded-full backdrop-blur-md bg-slate-950/30 border border-white/10 shadow-lg flex items-center justify-center">
          <CampanaNotificaciones posicion="arriba" />
        </div>

        <!-- Switch Tema Flotante Vertical -->
        <div class="p-1 rounded-full backdrop-blur-md bg-slate-950/30 border border-white/10 shadow-lg flex items-center justify-center">
          <label class="relative inline-flex items-center cursor-pointer select-none" title="Cambiar modo claro / oscuro">
            <span class="sr-only">Cambiar modo claro / oscuro</span>
            <div :class="['relative w-11 h-6 border rounded-full transition-colors duration-300', esTemaOscuro ? 'bg-slate-800/80 border-slate-700/80' : 'bg-slate-200/80 border-slate-300/80']"></div>
            <input
              type="checkbox"
              :checked="esTemaOscuro"
              @change="toggleTema"
              class="absolute top-0 left-0 w-full h-full cursor-pointer opacity-0 z-20"
            />
            <span
              class="absolute top-0.5 left-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 z-10"
              :class="esTemaOscuro ? 'translate-x-5 bg-[#0F172A]' : 'translate-x-0 bg-white'"
            >
              <svg v-if="!esTemaOscuro" class="w-3.5 h-3.5 text-amber-500 theme-toggle-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
              <svg v-else class="w-3.5 h-3.5 text-[#E0CEF2] theme-toggle-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </span>
          </label>
        </div>
      </div>

      <!-- ROUTER VIEW INTERNO CON FLEX-GROW LÍMPIO -->
      <main class="p-3 sm:p-6 md:p-8 flex-grow w-full max-w-full overflow-x-hidden">
        <router-view />
      </main>

      <footer :class="['p-4 text-center text-[10px] shrink-0 border-t border-current/10 font-mono opacity-80', esTemaOscuro ? 'text-slate-400' : 'text-slate-600']">
        Instituto Electoral de la Ciudad de México &copy; {{ convocatoriaStore.anio }} &bull; {{ convocatoriaStore.nombre }}
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useRoute, useRouter } from 'vue-router';
import CampanaNotificaciones from './CampanaNotificaciones.vue';
import Swal from 'sweetalert2';
import gsap from 'gsap';
import logowhite from '../assets/logos/logowhite.png';
import logodarktxt from '../assets/logos/logodarktxt.png';
import logoSolo from '../assets/logos/LogoIecmSolo.svg';
import { useConvocatoriaStore } from '../stores/convocatoria.store';
import { useThemeStore } from '../stores/theme.store';

const authStore = useAuthStore();
const convocatoriaStore = useConvocatoriaStore();
const themeStore = useThemeStore();
const route = useRoute();
const router = useRouter();

const sidebarColapsado = ref(false);
const mobileMenuAbierto = ref(false);
const menuPerfilAbierto = ref(false);
const menuPerfilRef = ref(null);
const esTemaOscuro = ref(true);

const handleClickOutside = (e) => {
  if (menuPerfilRef.value && !menuPerfilRef.value.contains(e.target)) {
    menuPerfilAbierto.value = false;
  }
};

// TODOS LOS MENÚS CERRADOS / COLAPSADOS POR DEFECTO AL CARGAR CUALQUIERA DE LOS 4 PANELES
const gruposAbiertos = reactive({
  participante_dashboard: false,
  operativa: false,
  analisis: false,
  personalizacion: false,
  administracion: false,
  evaluacion: false
});

const toggleGrupo = (key) => {
  if (sidebarColapsado.value && !mobileMenuAbierto.value) {
    sidebarColapsado.value = false;
  }
  gruposAbiertos[key] = !gruposAbiertos[key];
};

onMounted(() => {
  convocatoriaStore.cargarConvocatoriaActiva(true);
  themeStore.cargarTema();
  const savedTheme = localStorage.getItem('theme') || 'dark';
  esTemaOscuro.value = savedTheme === 'dark';
  document.documentElement.classList.toggle('dark', esTemaOscuro.value);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const toggleTema = () => {
  esTemaOscuro.value = !esTemaOscuro.value;
  localStorage.setItem('theme', esTemaOscuro.value ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', esTemaOscuro.value);
  
  gsap.fromTo('.theme-toggle-icon', 
    { rotation: esTemaOscuro.value ? -180 : 180, scale: 0.8 }, 
    { rotation: 0, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }
  );
};

const rolId = computed(() => authStore.rol);

const rolEtiqueta = computed(() => {
  if (rolId.value === 4) return 'Superadmin';
  if (rolId.value === 2) return 'Administrador';
  if (rolId.value === 3) return 'Juez Jurado';
  if (rolId.value === 1) return 'Participante';
  return 'Usuario';
});

const rolNombre = computed(() => {
  if (rolId.value === 4) return 'Superadmin';
  if (rolId.value === 2) return 'Admin';
  if (rolId.value === 3) return 'Juez';
  if (rolId.value === 1) return 'Participante';
  return 'Usuario';
});

const esSubitemActivo = (subitemPath) => {
  if (subitemPath.includes('?')) {
    return route.fullPath === subitemPath;
  }
  if (route.path === '/participante/dashboard') {
    return !route.query.tab || route.query.tab === 'dashboard' || route.query.tab === 'resumen';
  }
  return route.path === subitemPath;
};

// ESTRUCTURA EXACTA DE TAILADMIN LAYOUT TWO PARA LOS 4 ROLES
const menuEstructurado = computed(() => {
  // ROL 1: PARTICIPANTE
  if (rolId.value === 1) {
    return [
      {
        categoria: 'Mi Participación',
        grupos: [
          {
            key: 'participante_dashboard',
            titulo: 'Panel del Participante',
            icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>`,
            items: [
              { nombre: 'Resumen General', path: '/participante/dashboard?tab=dashboard' },
              { nombre: 'Mi Ensayo', path: '/participante/dashboard?tab=registro' },
              { nombre: 'Bases y Recursos', path: '/participante/dashboard?tab=convocatoria' }
            ]
          }
        ]
      }
    ];
  }

  // ROL 4: SUPERADMIN
  if (rolId.value === 4) {
    return [
      {
        categoria: 'General',
        grupos: [
          {
            key: 'operativa',
            titulo: 'Dashboard & Gestión',
            icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>`,
            items: [
              { nombre: 'Usuarios Registrados', path: '/superadmin/usuarios' },
              { nombre: 'Convocatorias', path: '/superadmin/convocatorias' },
              { nombre: 'Manifestaciones', path: '/superadmin/manifestaciones' },
              { nombre: 'Enviar Notificación', path: '/superadmin/notificaciones' }
            ]
          }
        ]
      },
      {
        categoria: 'Análisis & Reportes',
        grupos: [
          {
            key: 'analisis',
            titulo: 'Estadísticas & Data',
            icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`,
            items: [
              { nombre: 'Estadísticas Globales', path: '/superadmin/estadisticas' },
              { nombre: 'Reportería Excel', path: '/superadmin/reporteria' }
            ]
          }
        ]
      },
      {
        categoria: 'Sistema & Visual',
        grupos: [
          {
            key: 'personalizacion',
            titulo: 'Configuración de Tema',
            icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 01-2 2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>`,
            items: [
              { nombre: 'Personalizar Colores', path: '/superadmin/tema' }
            ]
          }
        ]
      }
    ];
  }

  // ROL 2: ADMIN VALIDADOR
  if (rolId.value === 2) {
    return [
      {
        categoria: 'General',
        grupos: [
          {
            key: 'administracion',
            titulo: 'Módulo del Administrador',
            icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
            items: [
              { nombre: 'Validación de Participantes', path: '/admin/validacion' },
              { nombre: 'Reportería Excel', path: '/admin/reporteria' }
            ]
          }
        ]
      }
    ];
  }

  // ROL 3: JUEZ JURADO
  if (rolId.value === 3) {
    return [
      {
        categoria: 'General',
        grupos: [
          {
            key: 'evaluacion',
            titulo: 'Módulo del Juez',
            icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>`,
            items: [
              { nombre: 'Evaluación de Ensayos', path: '/juez/evaluacion' }
            ]
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
    confirmButtonColor: '#8C65AA',
    background: esTemaOscuro.value ? '#111927' : '#ffffff',
    color: esTemaOscuro.value ? '#fff' : '#1e1238'
  });
};

const logout = async () => {
  const result = await Swal.fire({
    title: '¿Cerrar sesión?',
    text: '¿Estás seguro de que deseas salir de la plataforma?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#8C65AA',
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

<style scoped>
/* TRANSICIÓN SUAVE DE EXPANSIÓN Y COLAPSO DE SUBMENÚS */
.submenu-accordion-enter-active,
.submenu-accordion-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 400px;
  opacity: 1;
  overflow: hidden;
}
.submenu-accordion-enter-from,
.submenu-accordion-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  overflow: hidden;
}
</style>
