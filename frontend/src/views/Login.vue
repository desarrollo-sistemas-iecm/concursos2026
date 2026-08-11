<template>
  <div
    :class="[
      'min-h-[100dvh] w-full flex flex-col lg:flex-row relative overflow-x-hidden transition-colors duration-700 font-sans selection:bg-[#8C65AA] selection:text-white',
      publicTheme.isDark ? 'iecm-dark bg-[#110922] text-slate-100' : 'iecm-light bg-[#FFFFFF] text-[#1E1238]'
    ]"
  >
    <!-- ACCIONES SUPERIORES EXTERIORES (FUERA DE LAS TARJETAS DE FORMULARIO) -->
    <!-- Esquina Superior Izquierda: Volver al inicio -->
    <div class="fixed top-4 left-4 sm:top-6 sm:left-8 z-40">
      <router-link
        to="/"
        :class="[
          'btn-tactile font-bold py-2.5 px-4 sm:px-5 rounded-2xl text-xs flex items-center gap-2 border shadow-lg backdrop-blur-md transition-all duration-300',
          publicTheme.isDark
            ? 'bg-[#1B1133]/90 hover:bg-[#8C65AA]/30 text-[#E0CEF2] border-[#8C65AA]/30 shadow-[0_0_20px_rgba(0,0,0,0.4)]'
            : 'bg-white/95 hover:bg-slate-100 text-[#32215C] border-[#32215C]/15 shadow-[0_4px_15px_rgba(50,33,92,0.08)]'
        ]"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Volver al inicio</span>
      </router-link>
    </div>

    <!-- Esquina Superior Derecha: Toggle de Modo Oscuro / Claro Público (Aislado) -->
    <div class="fixed top-4 right-4 sm:top-6 sm:right-8 z-40">
      <button
        @click="publicTheme.toggleModo"
        :class="[
          'p-2.5 rounded-2xl transition-all duration-300 cursor-pointer flex items-center justify-center border btn-tactile shadow-lg backdrop-blur-md',
          publicTheme.isDark
            ? 'bg-[#1B1133]/90 hover:bg-[#8C65AA]/30 text-amber-300 border-[#8C65AA]/30 shadow-[0_0_20px_rgba(140,101,170,0.25)]'
            : 'bg-white/95 hover:bg-slate-100 text-[#32215C] border-[#32215C]/15 shadow-[0_4px_15px_rgba(50,33,92,0.08)]'
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

    <!-- ==========================================
         LADO A: PANEL DE BRANDING INSTITUCIONAL
         ========================================== -->
    <div
      :class="[
        'w-full transition-all duration-700 flex flex-col justify-between p-6 sm:p-12 lg:p-16 relative overflow-hidden',
        vistaActiva === 'registro' ? 'lg:w-[38%]' : 'lg:w-1/2',
        publicTheme.isDark
          ? 'bg-gradient-to-br from-[#1B1133] via-[#110922] to-[#261847] border-b lg:border-b-0 lg:border-r border-[#8C65AA]/20'
          : 'bg-gradient-to-br from-[#F8F5FB] via-white to-[#EDE6F4] border-b lg:border-b-0 lg:border-r border-[#32215C]/10'
      ]"
    >
      <!-- Resplandores ambientales de fondo -->
      <div
        :class="[
          'absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none transition-opacity duration-700',
          publicTheme.isDark ? 'bg-[#8C65AA]/30' : 'bg-[#8C65AA]/15'
        ]"
      ></div>
      <div
        :class="[
          'absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none transition-opacity duration-700',
          publicTheme.isDark ? 'bg-[#32215C]/50' : 'bg-[#32215C]/10'
        ]"
      ></div>

      <!-- Contenido de Identidad Institucional -->
      <div class="relative z-10 pt-16 lg:pt-20 space-y-6 sm:space-y-8">
        <!-- Logo IECM Protagonista de Gran Escala con Área 2X -->
        <div class="flex items-center">
          <img
            :src="publicTheme.isDark ? logowhite : logodark"
            alt="Logo IECM"
            class="h-16 sm:h-24 md:h-28 w-auto object-contain drop-shadow-2xl transition-all duration-300"
          />
        </div>

        <!-- Títulos de la Convocatoria en Montserrat Black -->
        <div class="space-y-3 sm:space-y-4 max-w-xl">
          <div
            :class="[
              'inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-widest font-bold border transition-colors duration-500 shadow-xs',
              publicTheme.isDark ? 'bg-[#32215C]/80 border-[#8C65AA]/40 text-[#E0CEF2]' : 'bg-[#32215C]/10 border-[#32215C]/20 text-[#32215C]'
            ]"
          >
            <span>Certamen Oficial 2026/2027</span>
          </div>

          <h1
            :class="[
              'text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight transition-colors duration-700 bg-clip-text text-transparent',
              publicTheme.isDark
                ? 'bg-gradient-to-b from-white via-[#F0E6F9] to-[#8C65AA]'
                : 'bg-gradient-to-b from-[#32215C] via-[#4A3282] to-[#8C65AA]'
            ]"
          >
            {{ convocatoriaStore.nombre }}
          </h1>

          <p
            :class="[
              'text-base sm:text-xl font-bold italic font-serif transition-colors duration-500',
              publicTheme.isDark ? 'text-[#C7B3DC]' : 'text-[#8C65AA]'
            ]"
          >
            — {{ convocatoriaStore.lema }} —
          </p>

          <p
            :class="[
              'text-xs sm:text-sm leading-relaxed transition-colors duration-500 pt-1',
              publicTheme.isDark ? 'text-slate-300' : 'text-slate-600'
            ]"
          >
            Bienvenido al portal institucional del Instituto Electoral de la Ciudad de México (IECM). Accede con tu cuenta o crea una nueva para inscribir tu ensayo y participar por los premios del certamen.
          </p>
        </div>
      </div>

      <!-- Pie del Panel de Branding -->
      <div class="relative z-10 pt-6 border-t border-current/10 text-[11px] font-mono flex items-center justify-between mt-8 lg:mt-0">
        <span :class="publicTheme.isDark ? 'text-slate-400' : 'text-slate-500'">Instituto Electoral de la CDMX</span>
        <span :class="publicTheme.isDark ? 'text-[#E0CEF2]' : 'text-[#8C65AA]'">IECM &copy; {{ convocatoriaStore.anio }}</span>
      </div>
    </div>

    <!-- ==========================================
         LADO B: PANEL DE FORMULARIO INTERACTIVO (LOGIN / REGISTRO)
         ========================================== -->
    <div
      :class="[
        'w-full transition-all duration-700 min-h-[55vh] lg:min-h-[100dvh] flex items-center justify-center p-4 sm:p-8 lg:p-12 relative z-10 overflow-y-auto',
        vistaActiva === 'registro' ? 'lg:w-[62%]' : 'lg:w-1/2',
        publicTheme.isDark ? 'iecm-dark-bg-2' : 'iecm-light-bg-2'
      ]"
    >
      <div
        :class="[
          'w-full py-8 lg:py-12 transition-all duration-500',
          vistaActiva === 'registro' ? 'max-w-4xl' : 'max-w-md'
        ]"
      >
        
        <!-- TRANSICIÓN FLUIDA SLIDE + CROSSFADE ENTRE LOGIN Y REGISTRO -->
        <Transition name="form-swap" mode="out-in">
          
          <!-- ---------------------------------------
               1. FORMULARIO DE INICIO DE SESIÓN (LOGIN)
               --------------------------------------- -->
          <div
            v-if="vistaActiva === 'login'"
            key="login-form"
            class="space-y-6 w-full"
          >
            <div class="space-y-2 text-center lg:text-left">
              <h2
                :class="[
                  'text-2xl sm:text-3xl font-black tracking-tight transition-colors duration-300',
                  publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
                ]"
              >
                Inicio de Sesión
              </h2>
              <p :class="['text-xs sm:text-sm', publicTheme.isDark ? 'text-slate-400' : 'text-slate-600']">
                Ingresa tus credenciales de acceso para entrar a la plataforma
              </p>
            </div>

            <!-- Alerta de Error / Restricción de Login -->
            <div
              v-if="errorLogin"
              :class="[
                'text-xs p-4 rounded-2xl flex items-start gap-3 border transition-colors leading-relaxed',
                errorLogin.toLowerCase().includes('cerrado') || errorLogin.toLowerCase().includes('habiliten') || errorLogin.toLowerCase().includes('periodo de acceso')
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 dark:text-amber-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400 dark:text-rose-400'
              ]"
            >
              <svg class="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ errorLogin }}</span>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-5">
              <!-- Usuario -->
              <div class="space-y-1.5">
                <label
                  for="login_usuario"
                  :class="[
                    'block text-xs font-bold uppercase tracking-wider transition-colors duration-300',
                    publicTheme.isDark ? 'text-slate-300' : 'text-slate-700'
                  ]"
                >
                  Usuario o Correo Electrónico
                </label>
                <input
                  v-model="formLogin.usuario"
                  type="text"
                  id="login_usuario"
                  required
                  maxlength="10"
                  :class="inputStyle"
                  placeholder="nombre.usuario o correo@ejemplo.com"
                />
              </div>

              <!-- Contraseña -->
              <div class="space-y-1.5">
                <label
                  for="login_contrasena"
                  :class="[
                    'block text-xs font-bold uppercase tracking-wider transition-colors duration-300',
                    publicTheme.isDark ? 'text-slate-300' : 'text-slate-700'
                  ]"
                >
                  Contraseña
                </label>
                <div class="relative">
                  <input
                    v-model="formLogin.contrasena"
                    :type="mostrarPasswordLogin ? 'text' : 'password'"
                    id="login_contrasena"
                    required
                    maxlength="10"
                    :class="[inputStyle, 'pr-10']"
                    placeholder="••••••••••"
                  />
                  <button
                    type="button"
                    @click="mostrarPasswordLogin = !mostrarPasswordLogin"
                    :class="[
                      'absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer p-1',
                      publicTheme.isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-[#32215C]'
                    ]"
                    :title="mostrarPasswordLogin ? 'Ocultar contraseña' : 'Ver contraseña'"
                  >
                    <svg v-if="!mostrarPasswordLogin" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-4 h-4 text-[#8C65AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.04 10.04 0 013.122-.463c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-1.583 1.583a3 3 0 11-4.243-4.243m4.243 4.243L3 3l18 18" />
                    </svg>
                  </button>
                </div>
                <!-- Enlace de Recuperación de Contraseña -->
                <div class="flex justify-end pt-1">
                  <button
                    type="button"
                    @click.prevent="switchVista('recuperar')"
                    :class="[
                      'text-[11px] font-bold hover:underline cursor-pointer transition-colors duration-300 border-none bg-transparent',
                      publicTheme.isDark ? 'text-[#C7B3DC] hover:text-white' : 'text-[#8C65AA] hover:text-[#32215C]'
                    ]"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>

              <!-- Botón Entrar -->
              <button
                type="submit"
                :disabled="cargandoLogin"
                :class="[
                  'btn-tactile w-full font-bold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-widest shadow-xl',
                  publicTheme.isDark
                    ? 'bg-[#8C65AA] hover:bg-[#9E77C1] text-white shadow-[0_0_25px_rgba(140,101,170,0.35)]'
                    : 'bg-[#32215C] hover:bg-[#432E7A] text-white shadow-[0_6px_20px_rgba(50,33,92,0.25)]'
                ]"
              >
                <span v-if="cargandoLogin" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span v-else>Entrar a la Plataforma</span>
              </button>
            </form>

            <!-- Switch a Registro (SIN RECARGA DE PÁGINA) -->
            <div
              :class="[
                'pt-4 border-t text-center text-xs transition-colors duration-300',
                publicTheme.isDark ? 'border-[#8C65AA]/20 text-slate-400' : 'border-slate-200 text-slate-600'
              ]"
            >
              ¿Eres participante y no tienes cuenta?
              <button
                type="button"
                @click.prevent="switchVista('registro')"
                :class="[
                  'font-black hover:underline ml-1 cursor-pointer transition-colors duration-300 border-none bg-transparent',
                  publicTheme.isDark ? 'text-[#E0CEF2]' : 'text-[#8C65AA]'
                ]"
              >
                Regístrate aquí
              </button>
            </div>
          </div>

          <!-- ---------------------------------------
               2. FORMULARIO DE REGISTRO COMPLETO Y AMPLIO (DIRECTO EN SUPERFICIE DEL PANEL)
               --------------------------------------- -->
          <div
            v-else-if="vistaActiva === 'registro'"
            key="registro-form"
            class="space-y-6 w-full"
          >
            <!-- TARJETA DE BLOQUEO INSTITUCIONAL CUANDO EL REGISTRO NO ESTÁ ACTIVO -->
            <div v-if="!convocatoriaStore.ventanaRegistro?.valido" class="space-y-6 w-full text-center lg:text-left">
              <div
                :class="[
                  'rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6 relative overflow-hidden transition-all duration-300',
                  publicTheme.isDark
                    ? 'bg-[#1B1133] border-[#8C65AA]/40 text-slate-100 shadow-[0_0_30px_rgba(140,101,170,0.15)]'
                    : 'bg-white border-[#32215C]/20 text-[#1E1238] shadow-[0_10px_30px_rgba(50,33,92,0.1)]'
                ]"
              >
                <div class="flex items-center gap-4">
                  <div
                    :class="[
                      'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border flex items-center justify-center shrink-0 shadow-lg',
                      convocatoriaStore.ventanaRegistro?.estado === 'ANTES_DE_INICIO'
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                        : (convocatoriaStore.ventanaRegistro?.estado === 'DESPUES_DE_FIN'
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                            : 'bg-[#8C65AA]/20 border-[#8C65AA]/40 text-[#E0CEF2]')
                    ]"
                  >
                    <svg v-if="convocatoriaStore.ventanaRegistro?.estado === 'ANTES_DE_INICIO'" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <svg v-else-if="convocatoriaStore.ventanaRegistro?.estado === 'DESPUES_DE_FIN'" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <svg v-else class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  <div>
                    <span
                      :class="[
                        'inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border mb-1.5',
                        convocatoriaStore.ventanaRegistro?.estado === 'ANTES_DE_INICIO'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                          : (convocatoriaStore.ventanaRegistro?.estado === 'DESPUES_DE_FIN'
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                              : 'bg-slate-500/10 border-slate-500/30 text-slate-400')
                      ]"
                    >
                      {{
                        convocatoriaStore.ventanaRegistro?.estado === 'ANTES_DE_INICIO'
                          ? 'Próximamente'
                          : (convocatoriaStore.ventanaRegistro?.estado === 'DESPUES_DE_FIN' ? 'Registro Cerrado' : 'Sin Convocatoria')
                      }}
                    </span>
                    <h3 :class="['text-lg sm:text-xl font-black tracking-tight', publicTheme.isDark ? 'text-white' : 'text-[#32215C]']">
                      {{
                        convocatoriaStore.ventanaRegistro?.estado === 'ANTES_DE_INICIO'
                          ? 'El periodo de registro aún no comienza'
                          : (convocatoriaStore.ventanaRegistro?.estado === 'DESPUES_DE_FIN'
                              ? 'Periodo de registro finalizado'
                              : 'Sin Convocatoria Activa')
                      }}
                    </h3>
                  </div>
                </div>

                <div :class="['p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed font-medium', publicTheme.isDark ? 'bg-[#110922]/70 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700']">
                  <p v-if="convocatoriaStore.ventanaRegistro?.estado === 'ANTES_DE_INICIO'">
                    El registro para el Concurso <strong>{{ convocatoriaStore.nombre }}</strong> abre el <strong>{{ convocatoriaStore.ventanaRegistro?.fecha_inicio_texto }}</strong>. Vuelve pronto para crear tu cuenta e inscribir tu ensayo.
                  </p>
                  <p v-else-if="convocatoriaStore.ventanaRegistro?.estado === 'DESPUES_DE_FIN'">
                    El periodo de registro para el Concurso <strong>{{ convocatoriaStore.nombre }}</strong> finalizó el <strong>{{ convocatoriaStore.ventanaRegistro?.fecha_fin_texto }}</strong>. No es posible crear nuevas cuentas en este momento.
                  </p>
                  <p v-else>
                    No hay ninguna convocatoria abierta actualmente en el sistema. Por favor consulta con la administración institucional del IECM.
                  </p>
                </div>

                <button
                  type="button"
                  @click.prevent="switchVista('login')"
                  :class="[
                    'btn-tactile w-full font-bold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-widest shadow-xl border-none',
                    publicTheme.isDark
                      ? 'bg-[#8C65AA] hover:bg-[#9E77C1] text-white shadow-[0_0_20px_rgba(140,101,170,0.3)]'
                      : 'bg-[#32215C] hover:bg-[#432E7A] text-white shadow-[0_6px_20px_rgba(50,33,92,0.2)]'
                  ]"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                  </svg>
                  <span>Inicia sesión con tu cuenta existente</span>
                </button>
              </div>
            </div>

            <!-- FORMULARIO DE REGISTRO CUANDO EL REGISTRO ESTÁ ACTIVO -->
            <template v-else>
              <div class="space-y-2 text-center lg:text-left border-b pb-4" :class="publicTheme.isDark ? 'border-[#8C65AA]/20' : 'border-slate-200'">
                <h2
                  :class="[
                    'text-2xl sm:text-3xl font-black tracking-tight transition-colors duration-300',
                    publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
                  ]"
                >
                  Registro de Participante
                </h2>
                <p :class="['text-xs sm:text-sm', publicTheme.isDark ? 'text-slate-400' : 'text-slate-600']">
                  Crea tu cuenta de persona usuaria para participar e inscribir tu ensayo
                </p>
              </div>

            <form @submit.prevent="handleRegister" class="space-y-5">
              <!-- Nombre y Apellidos (3 Columnas Holgadas) -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="space-y-1">
                  <label :class="['block text-[11px] font-bold uppercase tracking-wider', publicTheme.isDark ? 'text-slate-300' : 'text-slate-700']">Nombre(s) *</label>
                  <input
                    v-model="formReg.nombre"
                    type="text"
                    required
                    maxlength="25"
                    @input="formReg.nombre = formReg.nombre.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')"
                    :class="inputStyle"
                    placeholder="Juan"
                  />
                </div>
                <div class="space-y-1">
                  <label :class="['block text-[11px] font-bold uppercase tracking-wider', publicTheme.isDark ? 'text-slate-300' : 'text-slate-700']">Apellido Paterno *</label>
                  <input
                    v-model="formReg.apellido_pat"
                    type="text"
                    required
                    maxlength="25"
                    @input="formReg.apellido_pat = formReg.apellido_pat.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')"
                    :class="inputStyle"
                    placeholder="Pérez"
                  />
                </div>
                <div class="space-y-1">
                  <label :class="['block text-[11px] font-bold uppercase tracking-wider', publicTheme.isDark ? 'text-slate-300' : 'text-slate-700']">Apellido Materno *</label>
                  <input
                    v-model="formReg.apellido_mat"
                    type="text"
                    required
                    maxlength="25"
                    @input="formReg.apellido_mat = formReg.apellido_mat.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')"
                    :class="inputStyle"
                    placeholder="Gómez"
                  />
                </div>
              </div>

              <!-- CURP y Género (2 Columnas) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label :class="['block text-[11px] font-bold uppercase tracking-wider', publicTheme.isDark ? 'text-slate-300' : 'text-slate-700']">CURP *</label>
                  <input
                    v-model="formReg.curp"
                    type="text"
                    required
                    maxlength="18"
                    @input="onCurpInput"
                    @blur="validarCurpBlur"
                    :class="[inputStyle, 'font-mono uppercase tracking-wider']"
                    placeholder="AAAA999999HAAARR99"
                  />
                </div>
                <div class="space-y-1">
                  <label :class="['block text-[11px] font-bold uppercase tracking-wider', publicTheme.isDark ? 'text-slate-300' : 'text-slate-700']">Género *</label>
                  <select v-model="formReg.genero" required :class="inputStyle">
                    <option value="" disabled>Selecciona género</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="No binario">No binario</option>
                    <option value="Otro">Otro / Prefiero no decirlo</option>
                  </select>
                </div>
              </div>

              <!-- Fecha de Nacimiento y Categoría Dinámica -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label :class="['block text-[11px] font-bold uppercase tracking-wider', publicTheme.isDark ? 'text-slate-300' : 'text-slate-700']">Fecha de Nacimiento *</label>
                  <input v-model="formReg.fecha_nacimiento" type="date" required @change="evaluarCategoria" :class="inputStyle" />
                </div>
                <div class="space-y-1 flex flex-col justify-end">
                  <div v-if="categoriaAsignada" class="bg-[#8C65AA]/20 border border-[#8C65AA]/40 text-[#E0CEF2] p-2.5 rounded-xl text-xs flex flex-col justify-center h-[42px]">
                    <span class="font-bold">Categoría Asignada: {{ categoriaAsignada.nombre }}</span>
                  </div>
                  <div v-else-if="errorEdad" class="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-2.5 rounded-xl text-xs flex flex-col justify-center h-[42px]">
                    <span class="font-bold text-[10px]">{{ errorEdad }}</span>
                  </div>
                  <div v-else :class="['border p-2.5 rounded-xl text-xs flex flex-col justify-center h-[42px] italic', publicTheme.isDark ? 'bg-[#110922]/50 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500']">
                    Ingresa fecha de nacimiento
                  </div>
                </div>
              </div>

              <!-- Teléfono Fijo y Celular Personal -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label :class="['block text-[11px] font-bold uppercase tracking-wider', publicTheme.isDark ? 'text-slate-300' : 'text-slate-700']">Teléfono Fijo *</label>
                  <input
                    v-model="formReg.telefono_casa"
                    type="tel"
                    required
                    maxlength="10"
                    @input="onTelInput('telefono_casa')"
                    @blur="validarTelBlur('telefono_casa', 'Teléfono Fijo')"
                    :class="inputStyle"
                    placeholder="10 dígitos"
                  />
                </div>
                <div class="space-y-1">
                  <label :class="['block text-[11px] font-bold uppercase tracking-wider', publicTheme.isDark ? 'text-slate-300' : 'text-slate-700']">Celular Personal *</label>
                  <input
                    v-model="formReg.celular_personal"
                    type="tel"
                    required
                    maxlength="10"
                    @input="onTelInput('celular_personal')"
                    @blur="validarTelBlur('celular_personal', 'Celular Personal')"
                    :class="inputStyle"
                    placeholder="10 dígitos"
                  />
                </div>
              </div>

              <!-- Usuario y Correo Electrónico -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label :class="['block text-[11px] font-bold uppercase tracking-wider', publicTheme.isDark ? 'text-slate-300' : 'text-slate-700']">Usuario deseado *</label>
                  <input
                    v-model="formReg.usuario"
                    type="text"
                    required
                    maxlength="25"
                    @input="formReg.usuario = formReg.usuario.replace(/[^a-zA-Z0-9._-]/g, '')"
                    @blur="validarUsuarioBlur"
                    :class="inputStyle"
                    placeholder="ej. juan.perez"
                  />
                </div>
                <div class="space-y-1">
                  <label :class="['block text-[11px] font-bold uppercase tracking-wider', publicTheme.isDark ? 'text-slate-300' : 'text-slate-700']">Correo Electrónico *</label>
                  <input
                    v-model="formReg.correo"
                    type="email"
                    required
                    maxlength="40"
                    @blur="validarCorreoBlur"
                    :class="inputStyle"
                    placeholder="juan@ejemplo.com"
                  />
                </div>
              </div>

              <!-- Contraseñas -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label :class="['block text-[11px] font-bold uppercase tracking-wider', publicTheme.isDark ? 'text-slate-300' : 'text-slate-700']">Contraseña *</label>
                  <div class="relative">
                    <input
                      v-model="formReg.contrasena"
                      :type="mostrarPasswordReg ? 'text' : 'password'"
                      required
                      maxlength="10"
                      @input="formReg.contrasena = formReg.contrasena.replace(/[^a-zA-Z0-9.,!\-]/g, '')"
                      @blur="validarPassBlur"
                      :class="[inputStyle, 'pr-10']"
                      placeholder="De 8 a 10 caracteres"
                    />
                    <button
                      type="button"
                      @click="mostrarPasswordReg = !mostrarPasswordReg"
                      :class="[
                        'absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer p-1',
                        publicTheme.isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-[#32215C]'
                      ]"
                      :title="mostrarPasswordReg ? 'Ocultar contraseña' : 'Ver contraseña'"
                    >
                      <svg v-if="!mostrarPasswordReg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-[#8C65AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.04 10.04 0 013.122-.463c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-1.583 1.583a3 3 0 11-4.243-4.243m4.243 4.243L3 3l18 18" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="space-y-1">
                  <label :class="['block text-[11px] font-bold uppercase tracking-wider', publicTheme.isDark ? 'text-slate-300' : 'text-slate-700']">Confirmar Contraseña *</label>
                  <div class="relative">
                    <input
                      v-model="formReg.confirmar_contrasena"
                      :type="mostrarConfirmarReg ? 'text' : 'password'"
                      required
                      maxlength="10"
                      @input="formReg.confirmar_contrasena = formReg.confirmar_contrasena.replace(/[^a-zA-Z0-9.,!\-]/g, '')"
                      @blur="validarConfirmPassBlur"
                      :class="[inputStyle, 'pr-10']"
                      placeholder="Repite tu contraseña"
                    />
                    <button
                      type="button"
                      @click="mostrarConfirmarReg = !mostrarConfirmarReg"
                      :class="[
                        'absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer p-1',
                        publicTheme.isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-[#32215C]'
                      ]"
                      :title="mostrarConfirmarReg ? 'Ocultar contraseña' : 'Ver contraseña'"
                    >
                      <svg v-if="!mostrarConfirmarReg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-[#8C65AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.04 10.04 0 013.122-.463c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-1.583 1.583a3 3 0 11-4.243-4.243m4.243 4.243L3 3l18 18" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Checklist de Requisitos de Contraseña -->
              <div v-if="formReg.contrasena" class="p-3 rounded-2xl border text-xs space-y-2" :class="publicTheme.isDark ? 'bg-[#110922]/60 border-[#8C65AA]/20' : 'bg-slate-50 border-slate-200'">
                <div class="flex gap-1">
                  <div
                    v-for="i in 12"
                    :key="i"
                    class="h-1.5 flex-1 rounded-full transition-all duration-300"
                    :class="i <= passwordStrength.filledBars ? passwordStrength.barColor : (publicTheme.isDark ? 'bg-slate-800' : 'bg-slate-200')"
                  ></div>
                </div>
                <p class="font-semibold text-[11px]" :class="passwordStrength.labelColor">{{ passwordStrength.label }}</p>
                <ul class="space-y-1 text-[11px]">
                  <li class="flex items-center gap-1.5" :class="passwordStrength.checks.length ? 'text-emerald-400' : 'text-slate-400'">
                    <span>{{ passwordStrength.checks.length ? '✓' : '✕' }}</span> De 8 a 10 caracteres
                  </li>
                  <li class="flex items-center gap-1.5" :class="passwordStrength.checks.allowedChars ? 'text-emerald-400' : 'text-slate-400'">
                    <span>{{ passwordStrength.checks.allowedChars ? '✓' : '✕' }}</span> Caracteres especiales válidos ( . , ! - )
                  </li>
                  <li class="flex items-center gap-1.5" :class="passwordStrength.checks.special ? 'text-emerald-400' : 'text-slate-400'">
                    <span>{{ passwordStrength.checks.special ? '✓' : '✕' }}</span> Al menos un carácter especial ( . , ! - )
                  </li>
                </ul>
              </div>

              <!-- Captcha Matemático Antispam -->
              <div :class="['border p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs', publicTheme.isDark ? 'bg-[#110922]/70 border-[#8C65AA]/30 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700']">
                <span>Resuelve la suma antispam: <strong>{{ captcha.numA }} + {{ captcha.numB }} = ?</strong></span>
                <input v-model.number="captcha.respuestaUsuario" type="number" required :class="[inputStyle, 'w-20 text-center font-mono font-bold text-base']" />
              </div>

              <!-- Botón Completar Registro -->
              <button
                type="submit"
                :disabled="cargandoReg"
                :class="[
                  'btn-tactile w-full font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-widest border-none',
                  !cargandoReg
                    ? (publicTheme.isDark
                        ? 'bg-[#8C65AA] hover:bg-[#9E77C1] text-white shadow-[0_0_25px_rgba(140,101,170,0.35)] cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
                        : 'bg-[#32215C] hover:bg-[#432E7A] text-white shadow-[0_6px_20px_rgba(50,33,92,0.25)] cursor-pointer hover:scale-[1.01] active:scale-[0.99]')
                    : (publicTheme.isDark
                        ? 'bg-[#8C65AA]/30 text-slate-400/70 cursor-not-allowed opacity-50 shadow-none pointer-events-none'
                        : 'bg-[#32215C]/30 text-slate-400/70 cursor-not-allowed opacity-50 shadow-none pointer-events-none')
                ]"
              >
                <span v-if="cargandoReg" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span v-else>Completar Registro</span>
              </button>
            </form>

            <!-- Switch a Login (SIN RECARGA DE PÁGINA) -->
            <div
              :class="[
                'pt-4 border-t text-center text-xs transition-colors duration-300',
                publicTheme.isDark ? 'border-[#8C65AA]/20 text-slate-400' : 'border-slate-200 text-slate-600'
              ]"
            >
              ¿Ya tienes una cuenta registrada?
              <button
                type="button"
                @click.prevent="switchVista('login')"
                :class="[
                  'font-black hover:underline ml-1 cursor-pointer transition-colors duration-300 border-none bg-transparent',
                  publicTheme.isDark ? 'text-[#E0CEF2]' : 'text-[#8C65AA]'
                ]"
              >
                Inicia sesión aquí
              </button>
            </div>
            </template>
          </div>

          <!-- ---------------------------------------
               3. FORMULARIO DE SOLICITUD DE RECUPERACIÓN (MISMOS ESTILOS Y SUPERFICIE DE LOGIN)
               --------------------------------------- -->
          <div
            v-else-if="vistaActiva === 'recuperar'"
            key="recuperar-form"
            class="space-y-6 w-full"
          >
            <div class="space-y-2 text-center lg:text-left">
              <h2
                :class="[
                  'text-2xl sm:text-3xl font-black tracking-tight transition-colors duration-300',
                  publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
                ]"
              >
                Recuperación de Contraseña
              </h2>
              <p :class="['text-xs sm:text-sm', publicTheme.isDark ? 'text-slate-400' : 'text-slate-600']">
                Selecciona tu método preferido para restablecer tu acceso.
              </p>
            </div>

            <!-- Selector Píldoras / Tabs -->
            <div class="grid grid-cols-2 gap-2 p-1 bg-slate-900/50 dark:bg-slate-950/70 rounded-2xl border border-white/10">
              <button
                type="button"
                @click="metodoRecuperacion = 'email'"
                :class="[
                  'py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border-none',
                  metodoRecuperacion === 'email'
                    ? 'bg-[#8C65AA] text-white shadow-md'
                    : 'text-slate-400 hover:text-white bg-transparent'
                ]"
              >
                <span>Vía Correo</span>
              </button>

              <button
                type="button"
                @click="metodoRecuperacion = 'token'"
                :class="[
                  'py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border-none',
                  metodoRecuperacion === 'token'
                    ? 'bg-[#8C65AA] text-white shadow-md'
                    : 'text-slate-400 hover:text-white bg-transparent'
                ]"
              >
                <span>Vía Token / Código</span>
              </button>
            </div>

            <!-- Opción 1: Vía Correo -->
            <form v-if="metodoRecuperacion === 'email'" @submit.prevent="handleSolicitarRecuperacion" class="space-y-5">
              <div class="space-y-1.5">
                <label
                  class="block text-xs font-bold uppercase tracking-wider transition-colors duration-300"
                  :class="publicTheme.isDark ? 'text-slate-300' : 'text-slate-700'"
                >
                  Usuario o Correo Electrónico <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="inputRecuperacion"
                  type="text"
                  required
                  :class="inputStyle"
                  placeholder="nombre.usuario o correo@ejemplo.com"
                />
              </div>

              <button
                type="submit"
                :disabled="enviandoRecuperacion"
                :class="[
                  'btn-tactile w-full font-bold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-widest shadow-xl text-white',
                  publicTheme.isDark
                    ? 'bg-[#8C65AA] hover:bg-[#9E77C1] shadow-[0_0_25px_rgba(140,101,170,0.35)]'
                    : 'bg-[#32215C] hover:bg-[#432E7A] shadow-[0_6px_20px_rgba(50,33,92,0.25)]'
                ]"
              >
                <span v-if="enviandoRecuperacion" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span v-else>Enviar Enlace por Correo</span>
              </button>
            </form>

            <!-- Opción 2: Vía Token -->
            <form v-else @submit.prevent="handleIrARestablecerConToken" class="space-y-5">
              <div class="space-y-1.5">
                <label
                  class="block text-xs font-bold uppercase tracking-wider transition-colors duration-300"
                  :class="publicTheme.isDark ? 'text-slate-300' : 'text-slate-700'"
                >
                  Ingresa tu Token / Código <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="tokenManualRecuperacion"
                  type="text"
                  required
                  :class="[inputStyle, 'font-mono font-bold uppercase tracking-widest']"
                  placeholder="ej. A3F82C10"
                />
                <p class="text-[11px] text-slate-400">
                  Escribe el token de 8 caracteres que recibiste en tu correo o que se generó previamente.
                </p>
              </div>

              <button
                type="submit"
                :class="[
                  'btn-tactile w-full font-bold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-widest shadow-xl text-white',
                  publicTheme.isDark
                    ? 'bg-[#8C65AA] hover:bg-[#9E77C1] shadow-[0_0_25px_rgba(140,101,170,0.35)]'
                    : 'bg-[#32215C] hover:bg-[#432E7A] shadow-[0_6px_20px_rgba(50,33,92,0.25)]'
                ]"
              >
                <span>Ir a Restablecer Contraseña →</span>
              </button>
            </form>

            <!-- Regresar a Login -->
            <div
              :class="[
                'pt-4 border-t text-center text-xs transition-colors duration-300',
                publicTheme.isDark ? 'border-[#8C65AA]/20 text-slate-400' : 'border-slate-200 text-slate-600'
              ]"
            >
              ¿Recordaste tu contraseña?
              <button
                type="button"
                @click.prevent="switchVista('login')"
                :class="[
                  'font-black hover:underline ml-1 cursor-pointer transition-colors duration-300 border-none bg-transparent',
                  publicTheme.isDark ? 'text-[#E0CEF2]' : 'text-[#8C65AA]'
                ]"
              >
                Volver al inicio de sesión
              </button>
            </div>
          </div>

          <!-- ---------------------------------------
               4. FORMULARIO DE RESTABLECIMIENTO DE NUEVA CONTRASEÑA
               --------------------------------------- -->
          <div
            v-else-if="vistaActiva === 'restablecer'"
            key="restablecer-form"
            class="space-y-6 w-full"
          >
            <div class="space-y-2 text-center lg:text-left">
              <h2
                :class="[
                  'text-2xl sm:text-3xl font-black tracking-tight transition-colors duration-300',
                  publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
                ]"
              >
                Restablecer Contraseña
              </h2>
              <p :class="['text-xs sm:text-sm', publicTheme.isDark ? 'text-slate-400' : 'text-slate-600']">
                Ingresa tu token de seguridad y tu nueva contraseña para recuperar el acceso.
              </p>
            </div>

            <form @submit.prevent="handleRestablecerPassword" class="space-y-4">
              <!-- Token -->
              <div class="space-y-1.5">
                <label
                  class="block text-xs font-bold uppercase tracking-wider transition-colors duration-300"
                  :class="publicTheme.isDark ? 'text-slate-300' : 'text-slate-700'"
                >
                  Código / Token de Seguridad <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="tokenRestablecer"
                  type="text"
                  required
                  :class="[inputStyle, 'font-mono font-bold uppercase tracking-widest']"
                  placeholder="ej. A3F82C10"
                />
              </div>

              <!-- Nueva Contraseña -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <label
                    class="block text-xs font-bold uppercase tracking-wider transition-colors duration-300"
                    :class="publicTheme.isDark ? 'text-slate-300' : 'text-slate-700'"
                  >
                    Nueva Contraseña <span class="text-rose-500">*</span>
                  </label>
                  <span class="text-[10px] font-mono font-bold text-slate-400">
                    {{ nuevaContrasenaRestablecer.length }}/10 caracteres
                  </span>
                </div>
                <div class="relative">
                  <input
                    v-model="nuevaContrasenaRestablecer"
                    :type="mostrarPasswordLogin ? 'text' : 'password'"
                    required
                    maxlength="10"
                    :class="[inputStyle, 'pr-10']"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    @click="mostrarPasswordLogin = !mostrarPasswordLogin"
                    class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white border-none bg-transparent"
                  >
                    <svg v-if="!mostrarPasswordLogin" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-4 h-4 text-[#8C65AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.04 10.04 0 013.122-.463c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-1.583 1.583a3 3 0 11-4.243-4.243m4.243 4.243L3 3l18 18" />
                    </svg>
                  </button>
                </div>
                <p class="text-[10px] text-slate-400">
                  Entre 8 y 10 caracteres con al menos un especial ( <code class="font-bold text-[#8C65AA]">. , ! -</code> ).
                </p>
              </div>

              <!-- Confirmar Nueva Contraseña -->
              <div class="space-y-1.5">
                <label
                  class="block text-xs font-bold uppercase tracking-wider transition-colors duration-300"
                  :class="publicTheme.isDark ? 'text-slate-300' : 'text-slate-700'"
                >
                  Confirmar Nueva Contraseña <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="confirmacionRestablecer"
                  :type="mostrarPasswordLogin ? 'text' : 'password'"
                  required
                  maxlength="10"
                  :class="inputStyle"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                :disabled="cargandoRestablecer"
                :class="[
                  'btn-tactile w-full font-bold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-widest shadow-xl text-white',
                  publicTheme.isDark
                    ? 'bg-[#8C65AA] hover:bg-[#9E77C1] shadow-[0_0_25px_rgba(140,101,170,0.35)]'
                    : 'bg-[#32215C] hover:bg-[#432E7A] shadow-[0_6px_20px_rgba(50,33,92,0.25)]'
                ]"
              >
                <span v-if="cargandoRestablecer" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span v-else>Restablecer y Guardar Contraseña</span>
              </button>
            </form>

            <!-- Regresar a Login -->
            <div
              :class="[
                'pt-4 border-t text-center text-xs transition-colors duration-300',
                publicTheme.isDark ? 'border-[#8C65AA]/20 text-slate-400' : 'border-slate-200 text-slate-600'
              ]"
            >
              <button
                type="button"
                @click.prevent="switchVista('login')"
                :class="[
                  'font-black hover:underline ml-1 cursor-pointer transition-colors duration-300 border-none bg-transparent',
                  publicTheme.isDark ? 'text-[#E0CEF2]' : 'text-[#8C65AA]'
                ]"
              >
                ← Cancelar y volver al inicio de sesión
              </button>
            </div>
          </div>

        </Transition>
      </div>
    </div>

    <!-- MODAL DE AVISO DE PRIVACIDAD BLOQUEANTE Y AUTOMÁTICO EN REGISTRO (CON PALETA OFICIAL IECM) -->
    <div
      v-if="mostrarAviso"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 sm:p-6"
    >
      <div
        :class="[
          'border rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[85vh] flex flex-col justify-between shadow-2xl transition-colors duration-500 text-left relative z-10',
          publicTheme.isDark ? 'bg-[#1B1133] border-[#8C65AA]/40 text-slate-100' : 'bg-white border-[#32215C]/20 text-[#1E1238]'
        ]"
      >
        <div class="overflow-y-auto mb-6 pr-2 space-y-4 text-xs leading-relaxed font-sans">
          <div class="flex items-center gap-3 border-b pb-4" :class="publicTheme.isDark ? 'border-[#8C65AA]/20' : 'border-slate-200'">
            <div
              :class="[
                'p-2.5 rounded-2xl border flex items-center justify-center shrink-0',
                publicTheme.isDark ? 'bg-[#8C65AA]/20 border-[#8C65AA]/30 text-[#E0CEF2]' : 'bg-[#32215C]/10 border-[#32215C]/20 text-[#32215C]'
              ]"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 :class="['text-lg sm:text-xl font-black tracking-tight', publicTheme.isDark ? 'text-white' : 'text-[#32215C]']">
                Aviso de Privacidad Simplificado
              </h2>
              <p :class="['text-[11px] font-medium', publicTheme.isDark ? 'text-slate-400' : 'text-slate-500']">
                Obligatorio aceptar para continuar con el registro
              </p>
            </div>
          </div>

          <p>
            El Instituto Electoral de la Ciudad de México (en adelante IECM), con domicilio en Huizaches número 25, Colonia Rancho Los Colorines, Alcaldía Tlalpan, C.P. 14380, en la Ciudad de México, es el responsable del tratamiento de los datos personales que nos proporcione en este sistema.
          </p>
          <p>
            Los datos recabados en este portal serán tratados con la finalidad de gestionar su participación en el <strong>{{ convocatoriaStore.nombre }}</strong>, incluyendo el proceso de inscripción, validación de requisitos de edad y residencia, comunicación de folios, proceso de evaluación y dictaminación del jurado calificador, y entrega de incentivos a ganadores.
          </p>
          <p>
            Para las finalidades antes señaladas, se recabarán los siguientes datos personales: nombre completo, CURP, fecha de nacimiento, género, correo electrónico, teléfonos de contacto, alcaldía o entidad federativa de origen.
          </p>
          <p>
            Se informa que sus datos personales no serán transferidos a terceros ajenos al Instituto, salvo requerimientos legales de autoridades competentes debidamente fundados y motivados. Puede consultar el aviso de privacidad integral en el portal oficial del IECM.
          </p>
        </div>
        
        <!-- Botón Obligatorio de Aceptación -->
        <button
          @click="aceptarAviso"
          :class="[
            'btn-tactile font-black py-4 px-6 rounded-2xl w-full text-xs uppercase tracking-widest cursor-pointer shadow-xl transition-all',
            publicTheme.isDark
              ? 'bg-[#8C65AA] hover:bg-[#9E77C1] text-white shadow-[0_0_25px_rgba(140,101,170,0.35)]'
              : 'bg-[#32215C] hover:bg-[#432E7A] text-white shadow-[0_6px_20px_rgba(50,33,92,0.25)]'
          ]"
        >
          Acepto los términos y el aviso de privacidad
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useSesionesStore } from '../stores/sesiones.store';
import { usePublicThemeStore } from '../stores/publicTheme.store';
import { useConvocatoriaStore } from '../stores/convocatoria.store';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import api from '../services/api';
import logowhite from '../assets/logos/logowhite.png';
import logodark from '../assets/logos/logodarktxt.png';

const authStore = useAuthStore();
const sesionesStore = useSesionesStore();
const convocatoriaStore = useConvocatoriaStore();
const publicTheme = usePublicThemeStore();
const router = useRouter();
const route = useRoute();

// Vista Activa del Split-Screen: 'login' o 'registro' (SIN RECARGA DE PÁGINA)
const vistaActiva = ref(route.path === '/registro' ? 'registro' : 'login');
const avisoAceptado = ref(false);
const mostrarAviso = ref(false);

// Control de Visibilidad de Contraseñas (Ojito Toggle)
const mostrarPasswordLogin = ref(false);
const mostrarPasswordReg = ref(false);
const mostrarConfirmarReg = ref(false);

// Control del Flujo de Recuperación y Restablecimiento de Contraseña
const metodoRecuperacion = ref('email');
const inputRecuperacion = ref('');
const tokenManualRecuperacion = ref('');
const enviandoRecuperacion = ref(false);

const tokenRestablecer = ref('');
const nuevaContrasenaRestablecer = ref('');
const confirmacionRestablecer = ref('');
const cargandoRestablecer = ref(false);

const switchVista = async (nuevaVista) => {
  errorLogin.value = '';
  vistaActiva.value = nuevaVista;

  if (nuevaVista === 'registro') {
    if (route.path !== '/registro') router.push('/registro');
    await convocatoriaStore.cargarConvocatoriaActiva(true);
    if (convocatoriaStore.ventanaRegistro?.valido && !avisoAceptado.value) {
      mostrarAviso.value = true;
    } else {
      mostrarAviso.value = false;
    }
  } else if (nuevaVista === 'restablecer') {
    const qToken = tokenRestablecer.value ? `?token=${encodeURIComponent(tokenRestablecer.value)}` : '';
    if (route.path !== '/restablecer-password') router.push(`/restablecer-password${qToken}`);
  } else {
    if (route.path !== '/login') router.push('/login');
  }
};

const handleSolicitarRecuperacion = async () => {
  if (!inputRecuperacion.value) return;

  try {
    enviandoRecuperacion.value = true;
    const res = await api.post('/auth/solicitar-recuperacion', {
      correo_o_usuario: inputRecuperacion.value,
      metodo: 'email'
    });

    tokenRestablecer.value = res.data.token || '';

    await Swal.fire({
      icon: 'success',
      title: '¡Instrucciones Enviadas!',
      html: `
        <div class="space-y-3 text-left">
          <p class="text-xs text-slate-300">${res.data.mensaje || 'Se ha enviado un correo con las instrucciones.'}</p>
          <div class="p-3 bg-slate-900/90 rounded-2xl border border-[#8C65AA]/40 text-center">
            <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Tu Token de Seguridad Generado:</span>
            <span class="text-2xl font-mono font-black text-[#8C65AA] tracking-widest block my-1">${res.data.token}</span>
            <span class="text-[10px] text-slate-400 italic">Expira en 30 minutos</span>
          </div>
        </div>
      `,
      confirmButtonText: 'Continuar a Cambiar Contraseña →',
      confirmButtonColor: '#8C65AA'
    });

    switchVista('restablecer');
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error de Recuperación',
      text: err.response?.data?.error || 'No se pudo procesar la solicitud.',
      confirmButtonColor: '#8C65AA'
    });
  } finally {
    enviandoRecuperacion.value = false;
  }
};

const handleIrARestablecerConToken = () => {
  if (!tokenManualRecuperacion.value) return;
  tokenRestablecer.value = tokenManualRecuperacion.value.trim();
  switchVista('restablecer');
};

const handleRestablecerPassword = async () => {
  if (!tokenRestablecer.value || !nuevaContrasenaRestablecer.value || !confirmacionRestablecer.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'Por favor llena todos los campos del formulario.',
      confirmButtonColor: '#8C65AA'
    });
    return;
  }

  if (nuevaContrasenaRestablecer.value !== confirmacionRestablecer.value) {
    Swal.fire({
      icon: 'error',
      title: 'Contraseñas desalineadas',
      text: 'La nueva contraseña y su confirmación no coinciden.',
      confirmButtonColor: '#8C65AA'
    });
    return;
  }

  try {
    cargandoRestablecer.value = true;
    const res = await api.post('/auth/restablecer-password', {
      token: tokenRestablecer.value,
      nueva_contrasena: nuevaContrasenaRestablecer.value,
      confirmacion: confirmacionRestablecer.value
    });

    await Swal.fire({
      icon: 'success',
      title: '¡Contraseña Restablecida!',
      text: res.data.mensaje || 'Tu contraseña fue actualizada con éxito.',
      confirmButtonColor: '#8C65AA'
    });

    nuevaContrasenaRestablecer.value = '';
    confirmacionRestablecer.value = '';
    tokenRestablecer.value = '';
    switchVista('login');
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error al restablecer',
      text: err.response?.data?.error || 'No se pudo actualizar la contraseña.',
      confirmButtonColor: '#8C65AA'
    });
  } finally {
    cargandoRestablecer.value = false;
  }
};

onMounted(async () => {
  if (route.path === '/restablecer-password' || route.query.token) {
    vistaActiva.value = 'restablecer';
    if (route.query.token) {
      tokenRestablecer.value = String(route.query.token).trim();
    }
  } else if (route.path === '/registro') {
    vistaActiva.value = 'registro';
  } else {
    vistaActiva.value = 'login';
  }

  await convocatoriaStore.cargarConvocatoriaActiva(true);
  generarCaptcha();
  try {
    const res = await api.get('/catalogos/categorias');
    categorias.value = res.data;
  } catch (e) {
    console.error('Error al cargar categorías:', e.message);
  }

  // Mostrar aviso de privacidad únicamente si el registro está activo
  if (route.path === '/registro') {
    if (convocatoriaStore.ventanaRegistro?.valido && !avisoAceptado.value) {
      mostrarAviso.value = true;
    } else {
      mostrarAviso.value = false;
    }
  }
});

// Estilo de Inputs Adaptables al Tema Institucional IECM
const inputStyle = computed(() => [
  'w-full border rounded-xl py-2.5 px-3.5 outline-none transition-all duration-200 text-xs font-medium',
  publicTheme.isDark
    ? 'bg-[#110922] border-[#8C65AA]/30 text-white placeholder-slate-500 focus:border-[#8C65AA] focus:ring-2 focus:ring-[#8C65AA]/20'
    : 'bg-slate-50 border-slate-300 text-[#1E1238] placeholder-slate-400 focus:border-[#32215C] focus:ring-2 focus:ring-[#32215C]/15'
]);

// ---------------------------------------------------------------------------
// LOGIC DE LOGIN
// ---------------------------------------------------------------------------
const cargandoLogin = ref(false);
const errorLogin = ref('');
const formLogin = reactive({ usuario: '', contrasena: '' });

const handleLogin = async () => {
  errorLogin.value = '';
  cargandoLogin.value = true;
  try {
    const res = await authStore.login(formLogin.usuario, formLogin.contrasena);
    if (res.success) {
      sesionesStore.conectarSocket();
      Swal.fire({
        icon: 'success',
        title: '¡Sesión Iniciada!',
        text: 'Accediendo de forma segura al portal.',
        timer: 1500,
        showConfirmButton: false,
        background: publicTheme.isDark ? '#1B1133' : '#ffffff',
        color: publicTheme.isDark ? '#f8fafc' : '#1e1238'
      }).then(() => {
        router.push('/home');
      });
    }
  } catch (error) {
    errorLogin.value = error.message || 'Error en las credenciales proporcionadas.';
  } finally {
    cargandoLogin.value = false;
  }
};

// ---------------------------------------------------------------------------
// LOGIC DE REGISTRO
// ---------------------------------------------------------------------------
const cargandoReg = ref(false);
const categorias = ref([]);
const categoriaAsignada = ref(null);
const errorEdad = ref('');
const captcha = reactive({ numA: 0, numB: 0, respuestaUsuario: null });

const formReg = reactive({
  nombre: '',
  apellido_pat: '',
  apellido_mat: '',
  curp: '',
  genero: '',
  fecha_nacimiento: '',
  telefono_casa: '',
  celular_personal: '',
  correo: '',
  usuario: '',
  contrasena: '',
  confirmar_contrasena: ''
});

// Fuerza de contraseña
const passwordStrength = computed(() => {
  const pwd = formReg.contrasena || '';
  const checks = {
    length: pwd.length >= 8 && pwd.length <= 10,
    allowedChars: /^[a-zA-Z0-9.,!\-]*$/.test(pwd),
    special: /[.,!\-]/.test(pwd)
  };
  const score = Object.values(checks).filter(Boolean).length;
  const levels = [
    { label: 'Muy débil', filledBars: 2, barColor: 'bg-rose-500', labelColor: 'text-rose-400' },
    { label: 'Débil', filledBars: 4, barColor: 'bg-orange-500', labelColor: 'text-orange-400' },
    { label: 'Regular', filledBars: 8, barColor: 'bg-amber-400', labelColor: 'text-amber-400' },
    { label: 'Fuerte', filledBars: 12, barColor: 'bg-emerald-500', labelColor: 'text-emerald-400' }
  ];
  return { ...levels[score], checks };
});

// Validación integral en tiempo real para habilitar/deshabilitar el botón Completar Registro
const formRegistroValido = computed(() => {
  if (!formReg.nombre?.trim()) return false;
  if (!formReg.apellido_pat?.trim()) return false;
  if (!formReg.apellido_mat?.trim()) return false;
  if (!formReg.curp?.trim()) return false;
  if (!formReg.genero) return false;
  if (!formReg.fecha_nacimiento || errorEdad.value || !categoriaAsignada.value) return false;
  if (!formReg.telefono_casa?.trim()) return false;
  if (!formReg.celular_personal?.trim()) return false;
  if (!formReg.usuario?.trim()) return false;
  if (!formReg.correo?.trim()) return false;
  if (!formReg.contrasena) return false;
  if (!formReg.confirmar_contrasena) return false;

  if (formReg.nombre.length > 25) return false;
  if (formReg.apellido_pat.length > 25) return false;
  if (formReg.apellido_mat.length > 25) return false;

  const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d$/i;
  if (formReg.curp.length !== 18 || !curpRegex.test(formReg.curp)) return false;

  if (formReg.telefono_casa.length !== 10) return false;
  if (formReg.celular_personal.length !== 10) return false;

  if (formReg.usuario.length > 25 || !/^[a-zA-Z0-9._-]+$/.test(formReg.usuario)) return false;

  if (formReg.correo.length > 40 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formReg.correo)) return false;

  if (formReg.contrasena.length < 8 || formReg.contrasena.length > 10) return false;
  if (!/^[a-zA-Z0-9.,!\-]+$/.test(formReg.contrasena)) return false;
  if (!/[.,!\-]/.test(formReg.contrasena)) return false;
  if (formReg.contrasena !== formReg.confirmar_contrasena) return false;

  if (captcha.respuestaUsuario !== (captcha.numA + captcha.numB)) return false;

  return true;
});

const aceptarAviso = () => {
  avisoAceptado.value = true;
  mostrarAviso.value = false;
};

const generarCaptcha = () => {
  captcha.numA = Math.floor(Math.random() * 9) + 1;
  captcha.numB = Math.floor(Math.random() * 9) + 1;
  captcha.respuestaUsuario = null;
};

const calcularEdad = (fechaNac) => {
  const hoy = new Date();
  const cumpleanos = new Date(fechaNac);
  let edad = hoy.getFullYear() - cumpleanos.getFullYear();
  const m = hoy.getMonth() - cumpleanos.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
    edad--;
  }
  return edad;
};

const evaluarCategoria = () => {
  categoriaAsignada.value = null;
  errorEdad.value = '';
  if (!formReg.fecha_nacimiento) return;
  const edad = calcularEdad(formReg.fecha_nacimiento);
  const encontrada = categorias.value.find(c => edad >= c.edad_min && edad <= c.edad_max);
  if (encontrada) {
    categoriaAsignada.value = encontrada;
  } else {
    const minEdad = categorias.value.length > 0 ? Math.min(...categorias.value.map(c => c.edad_min)) : 15;
    const maxEdad = categorias.value.length > 0 ? Math.max(...categorias.value.map(c => c.edad_max)) : 23;
    errorEdad.value = `Tu edad (${edad} años) no encaja en el rango permitido (${minEdad} a ${maxEdad} años).`;
  }
};

const onCurpInput = () => {
  formReg.curp = formReg.curp.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (formReg.curp.length === 18) {
    validarCurpBlur();
  }
};

const validarCurpBlur = () => {
  if (!formReg.curp) return;
  const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d$/i;
  if (formReg.curp.length < 18) {
    toastError('CURP Incompleta', `La CURP debe tener exactamente 18 caracteres (llevas ${formReg.curp.length}).`);
  } else if (!curpRegex.test(formReg.curp)) {
    toastError('CURP Inválida', 'La CURP ingresada no tiene una estructura oficial RENAPO válida. Revisa los datos.');
  }
};

const onTelInput = (campo) => {
  formReg[campo] = formReg[campo].replace(/\D/g, '');
};

const validarTelBlur = (campo, etiqueta) => {
  if (!formReg[campo]) return;
  if (formReg[campo].length < 10) {
    toastError(`${etiqueta} Incompleto`, `El ${etiqueta.toLowerCase()} debe tener exactamente 10 dígitos numéricos (llevas ${formReg[campo].length}).`);
  }
};

const validarUsuarioBlur = () => {
  if (!formReg.usuario) return;
  if (formReg.usuario.length > 25) {
    toastError('Usuario Inválido', 'El nombre de usuario debe tener máximo 25 caracteres.');
  } else if (!/^[a-zA-Z0-9._-]+$/.test(formReg.usuario)) {
    toastError('Usuario Inválido', 'El usuario sólo permite letras, números, punto o guion.');
  }
};

const validarCorreoBlur = () => {
  if (!formReg.correo) return;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formReg.correo.length > 40 || !emailRegex.test(formReg.correo)) {
    toastError('Correo Inválido', 'El correo electrónico debe tener un formato válido (ej. usuario@ejemplo.com) de máximo 40 caracteres.');
  }
};

const validarPassBlur = () => {
  if (!formReg.contrasena) return;
  if (formReg.contrasena.length < 8 || formReg.contrasena.length > 10) {
    toastError('Contraseña Inválida', 'La contraseña debe tener entre 8 y 10 caracteres.');
    return;
  }
  if (!/[.,!\-]/.test(formReg.contrasena)) {
    toastError('Contraseña Inválida', 'La contraseña debe incluir al menos un carácter especial de los permitidos ( . , ! - ).');
  }
};

const validarConfirmPassBlur = () => {
  if (!formReg.confirmar_contrasena) return;
  if (formReg.contrasena !== formReg.confirmar_contrasena) {
    toastError('Contraseñas Diferentes', 'La contraseña y la confirmación no coinciden.');
  }
};

const toastError = (titulo, texto) => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'warning',
    title: titulo,
    text: texto,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    background: publicTheme.isDark ? '#1B1133' : '#ffffff',
    color: publicTheme.isDark ? '#f8fafc' : '#1e1238'
  });
};

const handleRegister = async () => {
  // 1. Presencia de campos obligatorios
  if (!formReg.nombre?.trim()) return toastError('Campo Obligatorio', 'El campo Nombre(s) es obligatorio.');
  if (!formReg.apellido_pat?.trim()) return toastError('Campo Obligatorio', 'El campo Apellido Paterno es obligatorio.');
  if (!formReg.apellido_mat?.trim()) return toastError('Campo Obligatorio', 'El campo Apellido Materno es obligatorio.');
  if (!formReg.curp?.trim()) return toastError('Campo Obligatorio', 'El campo CURP es obligatorio.');
  if (!formReg.genero) return toastError('Campo Obligatorio', 'Por favor selecciona un Género.');
  if (!formReg.fecha_nacimiento) return toastError('Campo Obligatorio', 'La Fecha de Nacimiento es obligatoria.');
  if (!formReg.telefono_casa?.trim()) return toastError('Campo Obligatorio', 'El Teléfono Fijo (10 dígitos) es obligatorio.');
  if (!formReg.celular_personal?.trim()) return toastError('Campo Obligatorio', 'El Celular Personal (10 dígitos) es obligatorio.');
  if (!formReg.usuario?.trim()) return toastError('Campo Obligatorio', 'El Usuario deseado es obligatorio.');
  if (!formReg.correo?.trim()) return toastError('Campo Obligatorio', 'El Correo Electrónico es obligatorio.');
  if (!formReg.contrasena) return toastError('Campo Obligatorio', 'La Contraseña es obligatoria.');
  if (!formReg.confirmar_contrasena) return toastError('Campo Obligatorio', 'Por favor confirma tu contraseña.');

  // 2. Validaciones de formato
  if (formReg.nombre.length > 25) return toastError('Formato Inválido', 'El nombre debe tener máximo 25 caracteres.');
  if (formReg.apellido_pat.length > 25) return toastError('Formato Inválido', 'El apellido paterno debe tener máximo 25 caracteres.');
  if (formReg.apellido_mat.length > 25) return toastError('Formato Inválido', 'El apellido materno debe tener máximo 25 caracteres.');

  const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d$/i;
  if (formReg.curp.length !== 18 || !curpRegex.test(formReg.curp)) {
    return toastError('CURP Inválida', 'La CURP no tiene un formato oficial de 18 caracteres válido.');
  }

  if (formReg.telefono_casa.length !== 10) return toastError('Teléfono Fijo Inválido', 'El teléfono fijo debe ser de exactamente 10 dígitos numéricos.');
  if (formReg.celular_personal.length !== 10) return toastError('Celular Inválido', 'El celular personal debe ser de exactamente 10 dígitos numéricos.');

  if (formReg.usuario.length > 25) return toastError('Usuario Inválido', 'El nombre de usuario debe tener máximo 25 caracteres.');
  if (!/^[a-zA-Z0-9._-]+$/.test(formReg.usuario)) return toastError('Usuario Inválido', 'El usuario no permite caracteres especiales complejos.');

  if (formReg.correo.length > 40 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formReg.correo)) {
    return toastError('Correo Inválido', 'El correo electrónico debe tener un formato válido y máximo 40 caracteres.');
  }

  if (formReg.contrasena.length < 8 || formReg.contrasena.length > 10) {
    return toastError('Contraseña Inválida', 'La contraseña debe tener entre 8 y 10 caracteres.');
  }
  if (!/^[a-zA-Z0-9.,!\-]+$/.test(formReg.contrasena)) {
    return toastError('Contraseña Inválida', 'La contraseña sólo permite letras, números y los caracteres especiales ( . , ! - ).');
  }
  if (!/[.,!\-]/.test(formReg.contrasena)) {
    return toastError('Contraseña Inválida', 'La contraseña debe incluir al menos un carácter especial de los permitidos ( . , ! - ).');
  }

  if (formReg.contrasena !== formReg.confirmar_contrasena) {
    return toastError('Contraseñas Diferentes', 'La contraseña y su confirmación no coinciden.');
  }

  if (captcha.respuestaUsuario !== (captcha.numA + captcha.numB)) {
    return toastError('Antispam Incorrecto', 'Resuelve la suma antispam correctamente.');
  }

  cargandoReg.value = true;
  try {
    const datosEnvio = { ...formReg };
    delete datosEnvio.confirmar_contrasena;
    await authStore.registerParticipante(datosEnvio);

    // Registro exitoso: notificar y regresar con transición fluida al login llenando el usuario
    formLogin.usuario = formReg.usuario;
    Swal.fire({
      icon: 'success',
      title: '¡Registro Exitoso!',
      text: 'Tu cuenta fue creada correctamente. Ya puedes iniciar sesión con tu usuario y contraseña.',
      confirmButtonText: 'Iniciar Sesión Ahora',
      confirmButtonColor: '#8C65AA',
      background: publicTheme.isDark ? '#1B1133' : '#ffffff',
      color: publicTheme.isDark ? '#f8fafc' : '#1e1238'
    }).then(() => {
      switchVista('login');
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de Registro',
      text: error.message || 'No se pudo completar el registro.',
      confirmButtonColor: '#f43f5e'
    });
    generarCaptcha();
  } finally {
    cargandoReg.value = false;
  }
};

onMounted(async () => {
  await convocatoriaStore.cargarConvocatoriaActiva(true);
  generarCaptcha();
  try {
    const res = await api.get('/catalogos/categorias');
    categorias.value = res.data;
  } catch (e) {
    console.error('Error al cargar categorías:', e.message);
  }

  // Mostrar aviso de privacidad únicamente si el registro está activo
  if (route.path === '/registro') {
    if (convocatoriaStore.ventanaRegistro?.valido && !avisoAceptado.value) {
      mostrarAviso.value = true;
    } else {
      mostrarAviso.value = false;
    }
  }
});
</script>
