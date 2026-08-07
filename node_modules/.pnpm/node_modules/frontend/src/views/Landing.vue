<template>
  <div
    :class="[
      'min-h-[100dvh] font-sans flex flex-col relative overflow-x-hidden transition-colors duration-700 selection:bg-[#8C65AA] selection:text-white',
      publicTheme.isDark ? 'iecm-dark bg-[#110922] text-slate-100' : 'iecm-light bg-[#FFFFFF] text-[#1E1238]'
    ]"
  >
    <!-- ==========================================
         1. HERO DE PANTALLA COMPLETA (FULL-BLEED)
         ========================================== -->
    <section
      :class="[
        'min-h-[100dvh] w-full flex flex-col justify-between relative overflow-hidden transition-colors duration-700',
        publicTheme.isDark ? 'iecm-dark-bg-1' : 'iecm-light-bg-1'
      ]"
    >
      <!-- Fondos Ambientales de Relieve / Resplandor (Anti-slop) -->
      <div
        :class="[
          'absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full blur-[160px] pointer-events-none transition-opacity duration-700',
          publicTheme.isDark ? 'bg-[#8C65AA]/25' : 'bg-[#8C65AA]/15'
        ]"
      ></div>
      <div
        :class="[
          'absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[180px] pointer-events-none transition-opacity duration-700',
          publicTheme.isDark ? 'bg-[#32215C]/40' : 'bg-[#32215C]/10'
        ]"
      ></div>

      <!-- HEADER INTEGRADO AL HERO -->
      <header
        :class="[
          'w-full sticky top-0 z-50 transition-colors duration-500',
          publicTheme.isDark ? 'glass-header-dark' : 'glass-header-light'
        ]"
      >
        <div class="w-full px-4 sm:px-8 lg:px-12 h-28 sm:h-32 flex items-center justify-between">
          <!-- Logo IECM Protagonista (Más Grande y Destacado con área 2X) -->
          <div class="flex items-center py-3">
            <img
              :src="publicTheme.isDark ? logowhite : logodark"
              alt="Logo IECM"
              class="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-300 drop-shadow-lg"
            />
          </div>

          <!-- Acciones del Header a la Derecha: Botón "Iniciar sesión" + Toggle de Tema Aislado -->
          <div class="flex items-center gap-3 sm:gap-5">
            <!-- Botón Iniciar Sesión en el Header -->
            <router-link
              to="/login"
              :class="[
                'btn-tactile font-bold py-2.5 px-5 sm:px-6 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md',
                publicTheme.isDark
                  ? 'bg-[#8C65AA] hover:bg-[#9E77C1] text-white border border-[#8C65AA]/40 shadow-[0_0_20px_rgba(140,101,170,0.35)]'
                  : 'bg-[#32215C] hover:bg-[#432E7A] text-white border border-[#32215C]/30 shadow-[0_4px_14px_rgba(50,33,92,0.25)]'
              ]"
            >
              <span>Iniciar sesión</span>
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </router-link>

            <!-- Toggle Modo Claro / Modo Oscuro Público (Aislado, Pegado a la Orilla) -->
            <button
              @click="publicTheme.toggleModo"
              :class="[
                'p-2.5 rounded-2xl transition-all duration-300 cursor-pointer flex items-center justify-center border btn-tactile',
                publicTheme.isDark
                  ? 'bg-[#32215C]/80 hover:bg-[#8C65AA]/30 text-amber-300 border-[#8C65AA]/30 shadow-[0_0_15px_rgba(140,101,170,0.25)]'
                  : 'bg-white hover:bg-slate-100 text-[#32215C] border-[#32215C]/15 shadow-xs'
              ]"
              :title="publicTheme.isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'"
              aria-label="Alternar tema público"
            >
              <svg v-if="publicTheme.isDark" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- CUERPO PRINCIPAL DEL HERO (FULL-BLEED CENTRADO) -->
      <div class="flex-grow flex items-center justify-center px-6 py-12 relative z-10">
        <div class="max-w-5xl mx-auto text-center space-y-8">
          
          <!-- Badge Expresivo Institucional -->
          <div class="hero-stagger inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs uppercase tracking-widest font-mono font-bold border transition-colors duration-500 shadow-sm">
            <span
              :class="[
                'w-2 h-2 rounded-full animate-ping',
                publicTheme.isDark ? 'bg-[#8C65AA]' : 'bg-[#32215C]'
              ]"
            ></span>
            <span :class="publicTheme.isDark ? 'text-[#E0CEF2]' : 'text-[#32215C]'">Certamen Institucional Oficial</span>
          </div>

          <!-- Título Expresivo Dinámico de la Convocatoria en Montserrat Black -->
          <h1 class="hero-stagger text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05]">
            <span
              :class="[
                'transition-colors duration-700 bg-clip-text text-transparent',
                publicTheme.isDark
                  ? 'bg-gradient-to-b from-white via-[#F0E6F9] to-[#8C65AA]'
                  : 'bg-gradient-to-b from-[#32215C] via-[#4A3282] to-[#8C65AA]'
              ]"
            >
              {{ convocatoriaStore.nombre }}
            </span>
          </h1>

          <!-- Subtítulo Dinámico (Lema) en Montserrat Bold/Italic -->
          <p
            :class="[
              'hero-stagger text-xl sm:text-2xl font-bold italic font-serif transition-colors duration-500 max-w-3xl mx-auto',
              publicTheme.isDark ? 'text-[#C7B3DC]' : 'text-[#8C65AA]'
            ]"
          >
            — {{ convocatoriaStore.lema }} —
          </p>

          <!-- Texto Estático Institucional Intacto -->
          <p
            :class="[
              'hero-stagger text-base sm:text-lg leading-relaxed max-w-3xl mx-auto font-normal transition-colors duration-500',
              publicTheme.isDark ? 'text-slate-300' : 'text-slate-700'
            ]"
          >
            El Instituto Electoral de la Ciudad de México (IECM) te invita a participar en el certamen, con el propósito de divulgar la cultura democrática mediante el diálogo de ideas, reflexiones y aportaciones a partir de textos clásicos en materia social y política.
          </p>

          <!-- Botón ÚNICO "Ingresar al sistema" de Gran Escala -->
          <div class="hero-stagger pt-4 flex justify-center">
            <router-link
              to="/login"
              :class="[
                'btn-tactile font-black py-4 px-10 sm:px-12 rounded-2xl text-sm sm:text-base uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-3 shadow-2xl',
                publicTheme.isDark
                  ? 'bg-[#8C65AA] hover:bg-[#9E77C1] text-white shadow-[0_10px_40px_rgba(140,101,170,0.45)]'
                  : 'bg-[#32215C] hover:bg-[#432E7A] text-white shadow-[0_12px_40px_rgba(50,33,92,0.3)]'
              ]"
            >
              <span>Ingresar al sistema</span>
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Indicador sutil de desplazamieno inferior -->
      <div class="pb-6 text-center text-xs opacity-60 flex justify-center items-center gap-2 font-mono">
        <span>Conoce las bases y etapas</span>
        <svg class="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>

    <!-- ==========================================
         2. SECCIÓN ¿CÓMO PARTICIPAR? (CAPA NIVEL 2)
         ========================================== -->
    <section
      :class="[
        'py-24 px-6 sm:px-12 transition-colors duration-700 gsap-reveal-1',
        publicTheme.isDark ? 'iecm-dark-bg-2' : 'iecm-light-bg-2'
      ]"
    >
      <div class="max-w-7xl mx-auto space-y-12">
        <div class="text-center space-y-3">
          <span
            :class="[
              'text-xs font-black uppercase tracking-widest font-mono',
              publicTheme.isDark ? 'text-[#C7B3DC]' : 'text-[#8C65AA]'
            ]"
          >
            Paso a Paso
          </span>
          <h2
            :class="[
              'text-3xl sm:text-4xl font-black tracking-tight transition-colors duration-500',
              publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
            ]"
          >
            ¿Cómo participar?
          </h2>
          <p
            :class="[
              'text-sm max-w-xl mx-auto transition-colors duration-500',
              publicTheme.isDark ? 'text-slate-400' : 'text-slate-600'
            ]"
          >
            Tres sencillos pasos para inscribir tu ensayo en el certamen
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Paso 1 -->
          <div
            :class="[
              'p-8 rounded-3xl transition-all duration-300 relative group space-y-5',
              publicTheme.isDark ? 'iecm-dark-card hover:border-[#8C65AA]/60' : 'iecm-light-card hover:border-[#8C65AA]/50'
            ]"
          >
            <div
              :class="[
                'w-14 h-14 rounded-2xl border flex items-center justify-center font-black text-xl transition-all duration-300 shadow-md',
                publicTheme.isDark
                  ? 'bg-[#8C65AA]/20 text-[#E0CEF2] border-[#8C65AA]/40 group-hover:bg-[#8C65AA] group-hover:text-white'
                  : 'bg-[#32215C]/10 text-[#32215C] border-[#32215C]/20 group-hover:bg-[#32215C] group-hover:text-white'
              ]"
            >
              1
            </div>
            <h3
              :class="[
                'text-lg font-bold transition-colors duration-300',
                publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
              ]"
            >
              Escribe tu ensayo
            </h3>
            <p
              :class="[
                'text-xs sm:text-sm text-justify leading-relaxed transition-colors duration-300',
                publicTheme.isDark ? 'text-slate-300' : 'text-slate-600'
              ]"
            >
              Elige una obra; varias obras de un mismo tomo; todas las obras de un tomo, o dos o más obras de diferentes tomos de la serie editorial Clásicos de Política y Democracia. Analiza, interpela y dialoga con los clásicos para que aportes tu visión.
            </p>
          </div>

          <!-- Paso 2 -->
          <div
            :class="[
              'p-8 rounded-3xl transition-all duration-300 relative group space-y-5',
              publicTheme.isDark ? 'iecm-dark-card hover:border-[#8C65AA]/60' : 'iecm-light-card hover:border-[#8C65AA]/50'
            ]"
          >
            <div
              :class="[
                'w-14 h-14 rounded-2xl border flex items-center justify-center font-black text-xl transition-all duration-300 shadow-md',
                publicTheme.isDark
                  ? 'bg-[#8C65AA]/20 text-[#E0CEF2] border-[#8C65AA]/40 group-hover:bg-[#8C65AA] group-hover:text-white'
                  : 'bg-[#32215C]/10 text-[#32215C] border-[#32215C]/20 group-hover:bg-[#32215C] group-hover:text-white'
              ]"
            >
              2
            </div>
            <h3
              :class="[
                'text-lg font-bold transition-colors duration-300',
                publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
              ]"
            >
              Regístrate
            </h3>
            <p
              :class="[
                'text-xs sm:text-sm text-justify leading-relaxed transition-colors duration-300',
                publicTheme.isDark ? 'text-slate-300' : 'text-slate-600'
              ]"
            >
              Crea tu cuenta de persona usuaria. Ingresa los datos solicitados en el formulario de registro para poder participar.
            </p>
          </div>

          <!-- Paso 3 -->
          <div
            :class="[
              'p-8 rounded-3xl transition-all duration-300 relative group space-y-5',
              publicTheme.isDark ? 'iecm-dark-card hover:border-[#8C65AA]/60' : 'iecm-light-card hover:border-[#8C65AA]/50'
            ]"
          >
            <div
              :class="[
                'w-14 h-14 rounded-2xl border flex items-center justify-center font-black text-xl transition-all duration-300 shadow-md',
                publicTheme.isDark
                  ? 'bg-[#8C65AA]/20 text-[#E0CEF2] border-[#8C65AA]/40 group-hover:bg-[#8C65AA] group-hover:text-white'
                  : 'bg-[#32215C]/10 text-[#32215C] border-[#32215C]/20 group-hover:bg-[#32215C] group-hover:text-white'
              ]"
            >
              3
            </div>
            <h3
              :class="[
                'text-lg font-bold transition-colors duration-300',
                publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
              ]"
            >
              Sube tu documento
            </h3>
            <p
              :class="[
                'text-xs sm:text-sm text-justify leading-relaxed transition-colors duration-300',
                publicTheme.isDark ? 'text-slate-300' : 'text-slate-600'
              ]"
            >
              Ingresa al sistema con tu cuenta y sube tu ensayo. Recuerda seguir las especificaciones de formato indicadas en la convocatoria.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==========================================
         3. SECCIÓN CATEGORÍAS DEL CONCURSO (CAPA NIVEL 1)
         ========================================== -->
    <section
      :class="[
        'py-24 px-6 sm:px-12 transition-colors duration-700 gsap-reveal-2',
        publicTheme.isDark ? 'iecm-dark-bg-1' : 'iecm-light-bg-1'
      ]"
    >
      <div class="max-w-6xl mx-auto space-y-12">
        <div class="text-center space-y-3">
          <span
            :class="[
              'text-xs font-black uppercase tracking-widest font-mono',
              publicTheme.isDark ? 'text-[#C7B3DC]' : 'text-[#8C65AA]'
            ]"
          >
            Requisitos de Edad
          </span>
          <h2
            :class="[
              'text-3xl sm:text-4xl font-black tracking-tight transition-colors duration-500',
              publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
            ]"
          >
            Categorías del Concurso
          </h2>
          <p
            :class="[
              'text-sm max-w-xl mx-auto transition-colors duration-500',
              publicTheme.isDark ? 'text-slate-400' : 'text-slate-600'
            ]"
          >
            Consulta el rango de edad correspondiente antes de registrar tu participación.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- Categoría 1 -->
          <div
            :class="[
              'p-10 rounded-3xl border text-center space-y-3 transition-all duration-300 hover:scale-[1.02]',
              publicTheme.isDark
                ? 'bg-[#1B1133] border-[#8C65AA]/40 shadow-[0_12px_35px_rgba(0,0,0,0.4)]'
                : 'bg-white border-[#32215C]/15 shadow-[0_12px_35px_rgba(50,33,92,0.08)]'
            ]"
          >
            <span
              :class="[
                'inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest font-mono transition-colors duration-300',
                publicTheme.isDark ? 'bg-[#8C65AA]/20 text-[#E0CEF2]' : 'bg-[#32215C]/10 text-[#32215C]'
              ]"
            >
              Categoría 1
            </span>
            <span
              :class="[
                'text-4xl font-black block tracking-tight transition-colors duration-300 pt-2',
                publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
              ]"
            >
              De 15 a 17 años
            </span>
            <span
              :class="[
                'text-xs block font-medium transition-colors duration-300',
                publicTheme.isDark ? 'text-slate-400' : 'text-slate-500'
              ]"
            >
              Edad cumplida al momento del registro
            </span>
          </div>

          <!-- Categoría 2 -->
          <div
            :class="[
              'p-10 rounded-3xl border text-center space-y-3 transition-all duration-300 hover:scale-[1.02]',
              publicTheme.isDark
                ? 'bg-[#1B1133] border-[#8C65AA]/40 shadow-[0_12px_35px_rgba(0,0,0,0.4)]'
                : 'bg-white border-[#32215C]/15 shadow-[0_12px_35px_rgba(50,33,92,0.08)]'
            ]"
          >
            <span
              :class="[
                'inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest font-mono transition-colors duration-300',
                publicTheme.isDark ? 'bg-[#8C65AA]/20 text-[#E0CEF2]' : 'bg-[#32215C]/10 text-[#32215C]'
              ]"
            >
              Categoría 2
            </span>
            <span
              :class="[
                'text-4xl font-black block tracking-tight transition-colors duration-300 pt-2',
                publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
              ]"
            >
              De 18 a 23 años
            </span>
            <span
              :class="[
                'text-xs block font-medium transition-colors duration-300',
                publicTheme.isDark ? 'text-slate-400' : 'text-slate-500'
              ]"
            >
              Edad cumplida al momento del registro
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==========================================
         4. SECCIÓN PREMIOS Y RECONOCIMIENTOS (CAPA NIVEL 2)
         ========================================== -->
    <section
      :class="[
        'py-24 px-6 sm:px-12 transition-colors duration-700 gsap-reveal-3',
        publicTheme.isDark ? 'iecm-dark-bg-2' : 'iecm-light-bg-2'
      ]"
    >
      <div class="max-w-7xl mx-auto space-y-12 text-center">
        <div class="space-y-3">
          <span
            :class="[
              'text-xs font-black uppercase tracking-widest font-mono',
              publicTheme.isDark ? 'text-[#C7B3DC]' : 'text-[#8C65AA]'
            ]"
          >
            Estímulos Económicos
          </span>
          <h2
            :class="[
              'text-3xl sm:text-4xl font-black tracking-tight transition-colors duration-500',
              publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
            ]"
          >
            Premios y Reconocimientos
          </h2>
          <p
            :class="[
              'text-sm max-w-xl mx-auto transition-colors duration-500',
              publicTheme.isDark ? 'text-slate-400' : 'text-slate-600'
            ]"
          >
            Se premiará con estímulo económico a los tres primeros lugares de ambas categorías
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <!-- 1er Lugar -->
          <div
            :class="[
              'p-8 rounded-3xl border space-y-4 transition-all duration-300 hover:-translate-y-2',
              publicTheme.isDark
                ? 'bg-gradient-to-b from-[#8C65AA]/30 to-[#1B1133] border-[#8C65AA]/50 shadow-[0_15px_40px_rgba(140,101,170,0.25)]'
                : 'bg-white border-[#8C65AA]/30 shadow-[0_15px_40px_rgba(50,33,92,0.1)]'
            ]"
          >
            <span class="text-5xl block animate-pulse">🥇</span>
            <h3
              :class="[
                'text-base font-black uppercase tracking-wider font-mono transition-colors duration-300',
                publicTheme.isDark ? 'text-amber-300' : 'text-[#8C65AA]'
              ]"
            >
              1er Lugar
            </h3>
            <p
              :class="[
                'text-3xl font-black font-mono transition-colors duration-300',
                publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
              ]"
            >
              $20,000.00 MXN
            </p>
            <p
              :class="[
                'text-xs font-medium transition-colors duration-300',
                publicTheme.isDark ? 'text-slate-400' : 'text-slate-500'
              ]"
            >
              Para cada una de las dos categorías
            </p>
          </div>

          <!-- 2do Lugar -->
          <div
            :class="[
              'p-8 rounded-3xl border space-y-4 transition-all duration-300 hover:-translate-y-2',
              publicTheme.isDark
                ? 'bg-gradient-to-b from-slate-400/20 to-[#1B1133] border-slate-300/30 shadow-[0_15px_40px_rgba(0,0,0,0.3)]'
                : 'bg-white border-[#32215C]/15 shadow-[0_15px_40px_rgba(50,33,92,0.07)]'
            ]"
          >
            <span class="text-5xl block">🥈</span>
            <h3
              :class="[
                'text-base font-black uppercase tracking-wider font-mono transition-colors duration-300',
                publicTheme.isDark ? 'text-slate-300' : 'text-slate-700'
              ]"
            >
              2do Lugar
            </h3>
            <p
              :class="[
                'text-3xl font-black font-mono transition-colors duration-300',
                publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
              ]"
            >
              $16,000.00 MXN
            </p>
            <p
              :class="[
                'text-xs font-medium transition-colors duration-300',
                publicTheme.isDark ? 'text-slate-400' : 'text-slate-500'
              ]"
            >
              Para cada una de las dos categorías
            </p>
          </div>

          <!-- 3er Lugar -->
          <div
            :class="[
              'p-8 rounded-3xl border space-y-4 transition-all duration-300 hover:-translate-y-2',
              publicTheme.isDark
                ? 'bg-gradient-to-b from-amber-600/20 to-[#1B1133] border-amber-600/30 shadow-[0_15px_40px_rgba(0,0,0,0.3)]'
                : 'bg-white border-[#32215C]/15 shadow-[0_15px_40px_rgba(50,33,92,0.07)]'
            ]"
          >
            <span class="text-5xl block">🥉</span>
            <h3
              :class="[
                'text-base font-black uppercase tracking-wider font-mono transition-colors duration-300',
                publicTheme.isDark ? 'text-amber-400' : 'text-amber-700'
              ]"
            >
              3er Lugar
            </h3>
            <p
              :class="[
                'text-3xl font-black font-mono transition-colors duration-300',
                publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
              ]"
            >
              $11,500.00 MXN
            </p>
            <p
              :class="[
                'text-xs font-medium transition-colors duration-300',
                publicTheme.isDark ? 'text-slate-400' : 'text-slate-500'
              ]"
            >
              Para cada una de las dos categorías
            </p>
          </div>
        </div>

        <p
          :class="[
            'text-xs sm:text-sm max-w-2xl mx-auto pt-4 leading-relaxed transition-colors duration-500',
            publicTheme.isDark ? 'text-slate-400' : 'text-slate-600'
          ]"
        >
          Se otorgará un reconocimiento (constancia) a los ensayos ganadores y a los trabajos que, en opinión del jurado, merezcan mención especial.
        </p>
      </div>
    </section>

    <!-- ==========================================
         5. CARRUSEL EDITORIAL DE "CLÁSICOS DE POLÍTICA Y DEMOCRACIA" (FULL-BLEED)
         ========================================== -->
    <section
      :class="[
        'w-full py-24 transition-colors duration-700 gsap-reveal-4 overflow-hidden',
        publicTheme.isDark ? 'iecm-dark-bg-1' : 'iecm-light-bg-1'
      ]"
    >
      <div class="w-full space-y-10">
        <!-- Encabezado alineado al contenedor principal de la retícula -->
        <div class="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="space-y-3">
            <span
              :class="[
                'text-xs font-black uppercase tracking-widest font-mono',
                publicTheme.isDark ? 'text-[#C7B3DC]' : 'text-[#8C65AA]'
              ]"
            >
              Serie Editorial IECM
            </span>
            <h2
              :class="[
                'text-3xl sm:text-4xl font-black tracking-tight transition-colors duration-500',
                publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
              ]"
            >
              Clásicos de Política y Democracia
            </h2>
            <p
              :class="[
                'text-sm max-w-xl transition-colors duration-500',
                publicTheme.isDark ? 'text-slate-400' : 'text-slate-600'
              ]"
            >
              Obras esenciales sobre pensamiento político y democrático para inspirar la redacción de tu ensayo.
            </p>
          </div>

          <!-- Controles del Carrusel -->
          <div class="flex items-center gap-3">
            <button
              @click="scrollCarrusel(-1)"
              :class="[
                'p-3 rounded-2xl border btn-tactile cursor-pointer transition-all duration-300',
                publicTheme.isDark ? 'bg-[#1B1133] border-[#8C65AA]/30 text-white hover:bg-[#8C65AA]/30' : 'bg-white border-[#32215C]/15 text-[#32215C] hover:bg-slate-100'
              ]"
              aria-label="Anterior obra"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              @click="scrollCarrusel(1)"
              :class="[
                'p-3 rounded-2xl border btn-tactile cursor-pointer transition-all duration-300',
                publicTheme.isDark ? 'bg-[#1B1133] border-[#8C65AA]/30 text-white hover:bg-[#8C65AA]/30' : 'bg-white border-[#32215C]/15 text-[#32215C] hover:bg-slate-100'
              ]"
              aria-label="Siguiente obra"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Track del Carrusel Full-Bleed (Ancho completo de pantalla con sangría lateral) -->
        <div
          ref="carruselTrack"
          @scroll="handleCarruselScroll"
          class="w-full flex items-stretch gap-6 sm:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-6 sm:px-12 lg:px-24 no-scrollbar border-none outline-none"
        >
          <!-- Tomo 1 -->
          <div
            :class="[
              'snap-start sm:snap-center shrink-0 w-80 sm:w-96 p-7 rounded-3xl border space-y-4 flex flex-col justify-between transition-all duration-300',
              publicTheme.isDark ? 'iecm-dark-card' : 'iecm-light-card'
            ]"
          >
            <div class="space-y-3">
              <span
                :class="[
                  'text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block',
                  publicTheme.isDark ? 'bg-[#8C65AA]/20 text-[#E0CEF2]' : 'bg-[#32215C]/10 text-[#32215C]'
                ]"
              >
                Tomo I • Teoría Política
              </span>
              <h3 :class="['text-lg font-bold', publicTheme.isDark ? 'text-white' : 'text-[#32215C]']">
                El Contrato Social & Del Espíritu de las Leyes
              </h3>
              <p :class="['text-xs text-justify leading-relaxed', publicTheme.isDark ? 'text-slate-300' : 'text-slate-600']">
                Análisis de los fundamentos del estado de derecho, la soberanía popular y la división de poderes frente a la representación ciudadana.
              </p>
            </div>
            <div class="pt-2 border-t border-current/10 flex items-center justify-between text-xs font-mono">
              <span :class="publicTheme.isDark ? 'text-slate-400' : 'text-slate-500'">Jean-Jacques Rousseau</span>
              <span :class="publicTheme.isDark ? 'text-[#E0CEF2]' : 'text-[#8C65AA]'">IECM Editorial</span>
            </div>
          </div>

          <!-- Tomo 2 -->
          <div
            :class="[
              'snap-start sm:snap-center shrink-0 w-80 sm:w-96 p-7 rounded-3xl border space-y-4 flex flex-col justify-between transition-all duration-300',
              publicTheme.isDark ? 'iecm-dark-card' : 'iecm-light-card'
            ]"
          >
            <div class="space-y-3">
              <span
                :class="[
                  'text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block',
                  publicTheme.isDark ? 'bg-[#8C65AA]/20 text-[#E0CEF2]' : 'bg-[#32215C]/10 text-[#32215C]'
                ]"
              >
                Tomo II • Democracia Moderna
              </span>
              <h3 :class="['text-lg font-bold', publicTheme.isDark ? 'text-white' : 'text-[#32215C]']">
                La Democracia en América
              </h3>
              <p :class="['text-xs text-justify leading-relaxed', publicTheme.isDark ? 'text-slate-300' : 'text-slate-600']">
                Reflexiones sobre la igualdad de condiciones, las asociaciones civiles y los riesgos del individualismo en las sociedades democráticas.
              </p>
            </div>
            <div class="pt-2 border-t border-current/10 flex items-center justify-between text-xs font-mono">
              <span :class="publicTheme.isDark ? 'text-slate-400' : 'text-slate-500'">Alexis de Tocqueville</span>
              <span :class="publicTheme.isDark ? 'text-[#E0CEF2]' : 'text-[#8C65AA]'">IECM Editorial</span>
            </div>
          </div>

          <!-- Tomo 3 -->
          <div
            :class="[
              'snap-start sm:snap-center shrink-0 w-80 sm:w-96 p-7 rounded-3xl border space-y-4 flex flex-col justify-between transition-all duration-300',
              publicTheme.isDark ? 'iecm-dark-card' : 'iecm-light-card'
            ]"
          >
            <div class="space-y-3">
              <span
                :class="[
                  'text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block',
                  publicTheme.isDark ? 'bg-[#8C65AA]/20 text-[#E0CEF2]' : 'bg-[#32215C]/10 text-[#32215C]'
                ]"
              >
                Tomo III • Derechos & Libertad
              </span>
              <h3 :class="['text-lg font-bold', publicTheme.isDark ? 'text-white' : 'text-[#32215C]']">
                Sobre la Libertad & Consideraciones sobre el Gobierno
              </h3>
              <p :class="['text-xs text-justify leading-relaxed', publicTheme.isDark ? 'text-slate-300' : 'text-slate-600']">
                Examen de los límites de la autoridad del gobierno sobre el individuo y la importancia de la libertad de expresión e ideas.
              </p>
            </div>
            <div class="pt-2 border-t border-current/10 flex items-center justify-between text-xs font-mono">
              <span :class="publicTheme.isDark ? 'text-slate-400' : 'text-slate-500'">John Stuart Mill</span>
              <span :class="publicTheme.isDark ? 'text-[#E0CEF2]' : 'text-[#8C65AA]'">IECM Editorial</span>
            </div>
          </div>

          <!-- Tomo 4 -->
          <div
            :class="[
              'snap-start sm:snap-center shrink-0 w-80 sm:w-96 p-7 rounded-3xl border space-y-4 flex flex-col justify-between transition-all duration-300',
              publicTheme.isDark ? 'iecm-dark-card' : 'iecm-light-card'
            ]"
          >
            <div class="space-y-3">
              <span
                :class="[
                  'text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block',
                  publicTheme.isDark ? 'bg-[#8C65AA]/20 text-[#E0CEF2]' : 'bg-[#32215C]/10 text-[#32215C]'
                ]"
              >
                Tomo IV • Pensamiento Político Contemporáneo
              </span>
              <h3 :class="['text-lg font-bold', publicTheme.isDark ? 'text-white' : 'text-[#32215C]']">
                El Federalista & Textos de la Revolución
              </h3>
              <p :class="['text-xs text-justify leading-relaxed', publicTheme.isDark ? 'text-slate-300' : 'text-slate-600']">
                Debates constitucionales, pluralismo político y la arquitectura institucional de las repúblicas modernas.
              </p>
            </div>
            <div class="pt-2 border-t border-current/10 flex items-center justify-between text-xs font-mono">
              <span :class="publicTheme.isDark ? 'text-slate-400' : 'text-slate-500'">Hamilton, Madison & Jay</span>
              <span :class="publicTheme.isDark ? 'text-[#E0CEF2]' : 'text-[#8C65AA]'">IECM Editorial</span>
            </div>
          </div>
        </div>

        <!-- Indicadores de Posición Tipo Dots (Sin barra de scroll visible) -->
        <div class="flex justify-center items-center gap-2.5 pt-2">
          <button
            v-for="idx in totalTomos"
            :key="idx"
            @click="irATomo(idx - 1)"
            :class="[
              'h-2.5 rounded-full transition-all duration-300 cursor-pointer border-none outline-none',
              carruselIndex === (idx - 1)
                ? (publicTheme.isDark ? 'w-8 bg-[#8C65AA] shadow-[0_0_14px_rgba(140,101,170,0.7)]' : 'w-8 bg-[#32215C] shadow-md')
                : (publicTheme.isDark ? 'w-2.5 bg-slate-700/80 hover:bg-slate-500' : 'w-2.5 bg-slate-300 hover:bg-slate-400')
            ]"
            :title="`Ir al Tomo ${idx}`"
            :aria-label="`Ir al Tomo ${idx}`"
          ></button>
        </div>
      </div>
    </section>

    <!-- ==========================================
         6. SECCIÓN RECURSOS Y DOCUMENTOS (CAPA NIVEL 3)
         ========================================== -->
    <section
      :class="[
        'py-24 px-6 sm:px-12 transition-colors duration-700 gsap-reveal-5',
        publicTheme.isDark ? 'iecm-dark-bg-3' : 'iecm-light-bg-3'
      ]"
    >
      <div
        :class="[
          'max-w-6xl mx-auto p-8 sm:p-12 rounded-3xl border space-y-8 shadow-2xl transition-all duration-300',
          publicTheme.isDark ? 'bg-[#1B1133] border-[#8C65AA]/30' : 'bg-white border-[#32215C]/15 shadow-[0_20px_50px_rgba(50,33,92,0.08)]'
        ]"
      >
        <div
          :class="[
            'flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8 transition-colors duration-500',
            publicTheme.isDark ? 'border-[#8C65AA]/20' : 'border-slate-200'
          ]"
        >
          <div>
            <span
              :class="[
                'text-xs font-black uppercase tracking-widest font-mono',
                publicTheme.isDark ? 'text-[#C7B3DC]' : 'text-[#8C65AA]'
              ]"
            >
              Documentación Oficial
            </span>
            <h2
              :class="[
                'text-2xl sm:text-3xl font-black tracking-tight transition-colors duration-500 mt-1',
                publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
              ]"
            >
              Recursos y Documentos
            </h2>
            <p
              :class="[
                'text-xs sm:text-sm mt-1 transition-colors duration-500',
                publicTheme.isDark ? 'text-slate-400' : 'text-slate-600'
              ]"
            >
              Consulta los lineamientos completos oficiales del certamen
            </p>
          </div>
          <div class="flex flex-wrap gap-4">
            <button
              @click="modalBasesAbierto = true"
              :class="[
                'btn-tactile font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all border',
                publicTheme.isDark
                  ? 'bg-[#32215C] hover:bg-[#432E7A] text-white border-[#8C65AA]/40'
                  : 'bg-slate-100 hover:bg-slate-200 text-[#32215C] border-slate-300'
              ]"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Ver las Bases Completas ({{ convocatoriaActiva?.anio || '2026' }})
            </button>
            <a
              href="/convocatoria_oficial_2026.pdf"
              download
              :class="[
                'btn-tactile font-black py-3 px-6 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md',
                publicTheme.isDark
                  ? 'bg-[#8C65AA] hover:bg-[#9E77C1] text-white shadow-[0_0_20px_rgba(140,101,170,0.3)]'
                  : 'bg-[#32215C] hover:bg-[#432E7A] text-white shadow-[0_4px_14px_rgba(50,33,92,0.2)]'
              ]"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar Convocatoria PDF
            </a>
          </div>
        </div>

        <div class="text-center pt-2">
          <button
            @click="modalBasesAbierto = true"
            :class="[
              'btn-tactile border font-bold py-4 px-8 rounded-2xl text-xs tracking-wider transition-all cursor-pointer inline-flex items-center gap-2',
              publicTheme.isDark
                ? 'bg-[#110922] border-[#8C65AA]/40 text-[#E0CEF2] hover:bg-[#261847]'
                : 'bg-slate-50 border-[#32215C]/20 text-[#32215C] hover:bg-white shadow-xs'
            ]"
          >
            <svg class="w-4 h-4 text-[#8C65AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Consultar Bases — {{ convocatoriaStore.nombre }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- MODAL DE BASES OFICIALES -->
    <div v-if="modalBasesAbierto" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div
        :class="[
          'border rounded-3xl p-6 sm:p-8 w-full max-w-4xl max-h-[85vh] flex flex-col space-y-6 text-left shadow-2xl transition-colors duration-300',
          publicTheme.isDark ? 'bg-[#1B1133] border-[#8C65AA]/40 text-slate-100' : 'bg-white border-[#32215C]/20 text-slate-800'
        ]"
      >
        <div
          :class="[
            'flex justify-between items-center border-b pb-4 shrink-0',
            publicTheme.isDark ? 'border-[#8C65AA]/20' : 'border-slate-200'
          ]"
        >
          <div>
            <h2 :class="['text-xl font-black', publicTheme.isDark ? 'text-white' : 'text-[#32215C]']">
              Bases Oficiales — {{ convocatoriaStore.nombre }}
            </h2>
            <p :class="['text-xs', publicTheme.isDark ? 'text-slate-400' : 'text-slate-500']">Lineamientos normativos vigentes</p>
          </div>
          <button @click="modalBasesAbierto = false" class="text-slate-400 hover:text-slate-200 p-2 text-xl font-bold cursor-pointer">&times;</button>
        </div>

        <div class="overflow-y-auto space-y-6 pr-2 text-xs leading-relaxed flex-grow font-sans">
          <!-- Base 1 -->
          <div class="space-y-1">
            <h3 :class="['font-bold text-sm', publicTheme.isDark ? 'text-white' : 'text-[#32215C]']">1. Participantes y vigencia</h3>
            <p>Pueden participar personas dentro del rango de edad estipulado en las categorías al momento del registro, que habiten, estudien, transiten o tengan interés en la Ciudad de México. No pueden participar personas funcionarias públicas del IECM.</p>
          </div>

          <!-- Base 2 -->
          <div class="space-y-1">
            <h3 :class="['font-bold text-sm', publicTheme.isDark ? 'text-white' : 'text-[#32215C]']">2. Categorías Dinámicas</h3>
            <p v-if="convocatoriaStore.categoriasActivas.length > 0">
              <span v-for="(cat, idx) in convocatoriaStore.categoriasActivas" :key="cat.id_categoria">
                <strong>{{ cat.nombre }}:</strong> ({{ cat.edad_min }} a {{ cat.edad_max }} años){{ idx < convocatoriaStore.categoriasActivas.length - 1 ? ' | ' : '.' }}
              </span>
            </p>
            <p v-else>Categorías habilitadas según los límites de edad vigentes de la convocatoria.</p>
          </div>

          <!-- Base 3 -->
          <div class="space-y-1">
            <h3 :class="['font-bold text-sm', publicTheme.isDark ? 'text-white' : 'text-[#32215C]']">3. Plazo de inscripción</h3>
            <p v-if="convocatoriaStore.fechaInicio">
              Del <strong>{{ formatFecha(convocatoriaStore.fechaInicio) }}</strong> al <strong>{{ formatFecha(convocatoriaStore.fechaFin) }}</strong>, exclusivamente por internet a través de este portal.
            </p>
            <p v-else>Periodo establecido en el calendario institucional de la convocatoria vigente.</p>
          </div>

          <!-- Base 4 -->
          <div class="space-y-1">
            <h3 :class="['font-bold text-sm', publicTheme.isDark ? 'text-white' : 'text-[#32215C]']">4. Temática</h3>
            <p>Diálogo/interpelación con obras clásicas de la serie "Clásicos de Política y Democracia" del IECM.</p>
          </div>

          <!-- Base 5 -->
          <div class="space-y-1">
            <h3 :class="['font-bold text-sm', publicTheme.isDark ? 'text-white' : 'text-[#32215C]']">5. Criterios y características del ensayo</h3>
            <p>Estructura obligatoria (portada, introducción, desarrollo, conclusión, referencias) y los 6 criterios de evaluación del jurado (Formato 0.5, Claridad y coherencia 2.0, Contenido y profundidad 2.0, Originalidad y creatividad 2.0, Estilo/redacción/ortografía 2.0, Conclusión 1.5).</p>
          </div>

          <!-- Base 6 -->
          <div class="space-y-1">
            <h3 :class="['font-bold text-sm', publicTheme.isDark ? 'text-white' : 'text-[#32215C]']">6. Registro de participantes</h3>
            <p>Individual y gratuito, un ensayo por persona, con los campos del formulario de registro y las declaraciones bajo protesta.</p>
          </div>

          <!-- Base 7 -->
          <div class="space-y-1">
            <h3 :class="['font-bold text-sm', publicTheme.isDark ? 'text-white' : 'text-[#32215C]']">7. Premios</h3>
            <p>Se entregarán estímulos económicos y diplomas de reconocimiento a los primeros lugares de cada categoría.</p>
          </div>

          <!-- Base 8 -->
          <div class="space-y-1">
            <h3 :class="['font-bold text-sm', publicTheme.isDark ? 'text-white' : 'text-[#32215C]']">8. Publicación de resultados</h3>
            <p>Publicación oficial en el portal institucional del IECM al concluir el periodo de evaluación.</p>
          </div>

          <!-- Base 9 -->
          <div class="space-y-1">
            <h3 :class="['font-bold text-sm', publicTheme.isDark ? 'text-white' : 'text-[#32215C]']">9. Jurado</h3>
            <p>Especialistas en género ensayístico, integración paritaria, evaluación doble ciego. Las decisiones son inapelables.</p>
          </div>

          <!-- Base 10 -->
          <div class="space-y-1">
            <h3 :class="['font-bold text-sm', publicTheme.isDark ? 'text-white' : 'text-[#32215C]']">10. Casos no previstos</h3>
            <p>Serán resueltos por las áreas correspondientes del Instituto Electoral de la Ciudad de México.</p>
          </div>
        </div>

        <div :class="['flex justify-end pt-4 border-t shrink-0', publicTheme.isDark ? 'border-[#8C65AA]/20' : 'border-slate-200']">
          <button
            @click="modalBasesAbierto = false"
            :class="[
              'btn-tactile font-black py-2.5 px-6 rounded-xl text-xs cursor-pointer',
              publicTheme.isDark ? 'bg-[#8C65AA] text-white' : 'bg-[#32215C] text-white'
            ]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>

    <!-- ==========================================
         7. FOOTER INSTITUCIONAL DE PROFUNDIDAD
         ========================================== -->
    <footer
      :class="[
        'w-full border-t py-10 px-6 text-center text-xs space-y-2 mt-auto transition-colors duration-700',
        publicTheme.isDark ? 'bg-[#0B0517] border-[#8C65AA]/20 text-slate-400' : 'bg-[#F0EBF7] border-[#32215C]/10 text-slate-600'
      ]"
    >
      <p :class="['font-bold text-sm', publicTheme.isDark ? 'text-slate-200' : 'text-[#32215C]']">
        Instituto Electoral de la Ciudad de México &copy; {{ convocatoriaStore.anio }}
      </p>
      <p>Huizaches 25, Rancho los Colorines, Tlalpan, C.P. 14386, Ciudad de México. • Conmutador: (55) 5483 3800</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useConvocatoriaStore } from '../stores/convocatoria.store';
import { usePublicThemeStore } from '../stores/publicTheme.store';
import { gsap } from 'gsap';
import logowhite from '../assets/logos/logowhite.png';
import logodark from '../assets/logos/logodarktxt.png';

const convocatoriaStore = useConvocatoriaStore();
const publicTheme = usePublicThemeStore();
const modalBasesAbierto = ref(false);
const carruselTrack = ref(null);
const totalTomos = 4;
const carruselIndex = ref(0);

const handleCarruselScroll = () => {
  if (!carruselTrack.value) return;
  const scrollLeft = carruselTrack.value.scrollLeft;
  const maxScroll = carruselTrack.value.scrollWidth - carruselTrack.value.clientWidth;
  if (maxScroll <= 0) return;
  const ratio = Math.min(1, Math.max(0, scrollLeft / maxScroll));
  carruselIndex.value = Math.round(ratio * (totalTomos - 1));
};

const scrollCarrusel = (direccion) => {
  if (!carruselTrack.value) return;
  const nuevoIdx = Math.min(totalTomos - 1, Math.max(0, carruselIndex.value + direccion));
  irATomo(nuevoIdx);
};

const irATomo = (index) => {
  if (!carruselTrack.value) return;
  carruselIndex.value = index;
  const maxScroll = carruselTrack.value.scrollWidth - carruselTrack.value.clientWidth;
  const targetScroll = (index / (totalTomos - 1)) * maxScroll;
  carruselTrack.value.scrollTo({ left: targetScroll, behavior: 'smooth' });
};

const formatFecha = (strFecha) => {
  if (!strFecha) return '';
  try {
    const d = new Date(strFecha);
    return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  } catch (e) {
    return strFecha;
  }
};

onMounted(() => {
  convocatoriaStore.cargarConvocatoriaActiva(true);

  // 1. Animación escalonada (Stagger) para la entrada del Hero Full-Bleed
  gsap.from('.hero-stagger', {
    opacity: 0,
    y: 36,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out'
  });

  // 2. Coreografía de Scroll-Reveal diferenciada por sección
  gsap.from('.gsap-reveal-1', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.gsap-reveal-1', start: 'top 85%' }
  });

  gsap.from('.gsap-reveal-2', {
    opacity: 0,
    scale: 0.96,
    duration: 0.8,
    ease: 'back.out(1.2)',
    scrollTrigger: { trigger: '.gsap-reveal-2', start: 'top 85%' }
  });

  gsap.from('.gsap-reveal-3', {
    opacity: 0,
    y: 45,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.gsap-reveal-3', start: 'top 85%' }
  });

  gsap.from('.gsap-reveal-4', {
    opacity: 0,
    x: -30,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.gsap-reveal-4', start: 'top 85%' }
  });

  gsap.from('.gsap-reveal-5', {
    opacity: 0,
    y: 30,
    duration: 0.7,
    ease: 'power2.inOut',
    scrollTrigger: { trigger: '.gsap-reveal-5', start: 'top 85%' }
  });
});
</script>
