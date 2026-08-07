<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- NAVEGACIÓN ADMINISTRADA POR EL SIDEBAR LATERAL -->

    <!-- BADGE DE ESTADO DEL PARTICIPANTE -->
    <div class="flex flex-wrap items-center gap-2 sm:gap-3">
      <span 
        v-if="statusEnsayo === 1"
        class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        Registro Validado — Folio Asignado
      </span>
      <span 
        v-else-if="statusEnsayo === 0"
        class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm"
      >
        <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
        En Proceso de Validación
      </span>
      <span 
        v-else-if="statusEnsayo === 2"
        class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm"
      >
        <span class="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
        Requiere Corrección
      </span>
      <span 
        v-else
        class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm"
      >
        <span class="w-2 h-2 rounded-full bg-blue-400"></span>
        Ensayo Pendiente de Carga
      </span>
    </div>

    <!-- ÁREA DE CONTENIDO -->
    <div class="w-full space-y-6" v-if="cargado">
      <Transition mode="out-in" :css="false" @before-enter="beforeEnter" @enter="enter" @leave="leave">
        <div :key="tabActiva" class="space-y-6">
          <!-- ==================== PESTAÑA: RESUMEN (DASHBOARD) ==================== -->
          <div v-if="tabActiva === 'dashboard'" class="space-y-6">
            <!-- Bienvenida -->
            <div class="bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm dark:shadow-none transition-colors duration-300">
              <div>
                <h2 class="text-xl font-black text-slate-900 dark:text-white">¡Hola, {{ authStore.user?.nombre }}!</h2>
                <p class="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed max-w-xl">
                  Bienvenido a tu panel operacional para el Concurso de Ensayo 2027. Aquí podrás dar seguimiento al estado de tu registro y descargar tus comprobantes.
                </p>
              </div>
              <div v-if="statusEnsayo === 1" class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-2 px-4 text-center shadow-[0_0_12px_rgba(16,185,129,0.15)] shrink-0 w-full md:w-auto">
                <span class="block text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Folio Oficial</span>
                <span class="text-sm font-mono font-black text-emerald-400 mt-0.5 block">{{ folio }}</span>
              </div>
              <div v-else class="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-4 text-center transition-colors duration-300 shrink-0 w-full md:w-auto">
                <span class="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tu Convocatoria</span>
                <span class="text-xs font-mono font-black text-emerald-400 mt-0.5 block">2027</span>
              </div>
            </div>

            <!-- Línea de Tiempo de Progreso -->
            <div class="bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-white/5 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none transition-colors duration-300">
              <div class="flex items-center justify-between mb-4 gap-2">
                <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate">Progreso de tu Solicitud</span>
                <span class="text-xs font-mono font-bold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 shrink-0">{{ progressValAnimado }}% Completado</span>
              </div>
              
              <!-- Barra Lineal -->
              <div class="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-1.5 mb-6 overflow-hidden transition-colors duration-300">
                <div 
                  class="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                  :style="{ width: `${progressValAnimado}%` }"
                ></div>
              </div>

              <!-- Hitos visuales -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2">
                <!-- Step 1: Cuenta Creada -->
                <div class="text-center space-y-1">
                  <div class="w-7 h-7 rounded-full mx-auto flex items-center justify-center text-[11px] font-bold transition-all duration-500 bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  >
                    ✓
                  </div>
                  <span class="block text-[10px] font-bold uppercase text-emerald-400">1. Cuenta Creada</span>
                </div>

                <!-- Step 2: Ensayo Registrado (Datos del formulario) -->
                <div class="text-center space-y-1">
                  <div class="w-7 h-7 rounded-full mx-auto flex items-center justify-center text-[11px] font-bold transition-all duration-500"
                    :class="paso2Completado ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-200 dark:bg-slate-850 text-slate-400 dark:text-slate-500'"
                  >
                    <span v-if="paso2Completado">✓</span>
                    <span v-else>2</span>
                  </div>
                  <span class="block text-[10px] font-bold uppercase" 
                    :class="paso2Completado ? 'text-emerald-400' : 'text-slate-400 dark:text-slate-500'"
                  >
                    2. Ensayo Registrado
                  </span>
                </div>

                <!-- Step 3: Archivo Cargado (PDF subido) -->
                <div class="text-center space-y-1">
                  <div class="w-7 h-7 rounded-full mx-auto flex items-center justify-center text-[11px] font-bold transition-all duration-500"
                    :class="paso3Completado ? (statusEnsayo === 2 ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.3)]') : 'bg-slate-200 dark:bg-slate-850 text-slate-400 dark:text-slate-500'"
                  >
                    <span v-if="statusEnsayo === 2">!</span>
                    <span v-else-if="paso3Completado">✓</span>
                    <span v-else>3</span>
                  </div>
                  <span class="block text-[10px] font-bold uppercase" 
                    :class="paso3Completado ? (statusEnsayo === 2 ? 'text-rose-400' : 'text-emerald-400') : 'text-slate-400 dark:text-slate-500'"
                  >
                    3. Archivo Cargado
                  </span>
                </div>

                <!-- Step 4: Folio Asignado -->
                <div class="text-center space-y-1">
                  <div class="w-7 h-7 rounded-full mx-auto flex items-center justify-center text-[11px] font-bold transition-all duration-500"
                    :class="paso4Completado ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-200 dark:bg-slate-850 text-slate-400 dark:text-slate-500'"
                  >
                    <span v-if="paso4Completado">✓</span>
                    <span v-else>4</span>
                  </div>
                  <span class="block text-[10px] font-bold uppercase" :class="paso4Completado ? 'text-emerald-400' : 'text-slate-400 dark:text-slate-500'">4. Folio Asignado</span>
                </div>
              </div>
            </div>

            <!-- Widgets y Accesos Rápidos -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Estado Actual y Alertas -->
              <div class="bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-300">
                <div class="space-y-4">
                  <span class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Estatus de Revisión</span>
                  
                  <!-- Caso Validado -->
                  <div v-if="statusEnsayo === 1" class="space-y-2">
                    <h3 class="text-lg font-black text-slate-900 dark:text-white">¡Tu folio ha sido asignado!</h3>
                    <p class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Tu ensayo fue evaluado por el administrador y tiene asignado el folio oficial <span class="font-mono text-emerald-500 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">{{ folio }}</span>.</p>
                  </div>
                  
                  <!-- Caso Pendiente -->
                  <div v-else-if="statusEnsayo === 0 && archivoEnsayo" class="space-y-2">
                    <h3 class="text-lg font-black text-slate-900 dark:text-white">En espera de validación</h3>
                    <p class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Hemos recibido tu archivo en PDF correctamente. Un validador del IECM verificará que tu documento cumpla con los lineamientos técnicos del concurso.</p>
                  </div>
 
                  <!-- Caso Rechazado / Observaciones -->
                  <div v-else-if="statusEnsayo === 2" class="space-y-3">
                    <h3 class="text-lg font-black text-rose-500 flex items-center gap-1.5">
                      <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Se requiere corrección
                    </h3>
                    <div class="bg-rose-500/5 border border-rose-500/10 p-3.5 rounded-xl">
                      <span class="block text-[9px] font-bold text-rose-500 uppercase tracking-wide">Observaciones del Administrador</span>
                      <p class="text-slate-650 dark:text-slate-300 text-xs mt-1 leading-relaxed">{{ observaciones }}</p>
                    </div>
                  </div>
 
                  <!-- Caso Sin Cargar -->
                  <div v-else class="space-y-2">
                    <h3 class="text-lg font-black text-slate-900 dark:text-white">Registro incompleto</h3>
                    <p class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Aún no has registrado la información ni el documento de tu ensayo. Recuerda completar el registro antes de la fecha límite establecida.</p>
                  </div>
                </div>
 
                <div class="pt-6 border-t border-slate-200 dark:border-white/5 mt-6 flex gap-4">
                  <button 
                    v-if="!archivoEnsayo"
                    @click="tabActiva = 'registro'"
                    class="btn-tactile bg-brand-primary text-slate-950  font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all w-full justify-center"
                  >
                    Registrar Ensayo
                  </button>
                  <button 
                    v-else-if="statusEnsayo === 2"
                    @click="tabActiva = 'registro'"
                    class="btn-tactile bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all w-full justify-center"
                  >
                    Corregir Ensayo
                  </button>
                  <a 
                    v-if="archivoEnsayo"
                    :href="`/api/documentos/${archivoEnsayo}?token=${authStore.token}`"
                    target="_blank"
                    class="btn-tactile bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-650 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all w-full justify-center"
                  >
                    Ver PDF Subido
                  </a>
                  <button 
                    v-if="statusEnsayo === 1 && !fechaDescargaAcuse"
                    @click="descargarAcusePDF"
                    class="btn-tactile bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all w-full justify-center"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descargar Acuse (PDF)
                  </button>
                </div>
              </div>
 
              <!-- Tarjeta de Expediente Rápido -->
              <div class="bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-300">
                <div class="space-y-4">
                  <span class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Resumen de Expediente</span>
                  <div class="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <p><strong>Participante:</strong> {{ authStore.user?.nombre }} {{ authStore.user?.apellido_pat }}</p>
                    <p><strong>CURP:</strong> <span class="font-mono text-slate-500 dark:text-slate-400">{{ curp }}</span></p>
                    <p><strong>Categoría asignada:</strong> <span class="text-brand-primary font-bold">{{ categoriaAsignadaTexto }}</span></p>
                    <p><strong>Municipio / Alcaldía:</strong> {{ nombreAlcaldia }}</p>
                  </div>
                </div>
 
                <div class="pt-6 border-t border-slate-200 dark:border-white/5 mt-6">
                  <router-link 
                    to="/perfil"
                    class="w-full block text-center btn-tactile bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs cursor-pointer transition-all"
                  >
                    Ver Expediente Completo
                  </router-link>
                </div>
              </div>
 
            </div>

            <!-- RESUMEN DE DOCUMENTACIÓN ADICIONAL (Solo lectura / Lista de cargados) -->
            <div v-if="misArchivos.length > 0" class="bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-white/5 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm dark:shadow-none transition-colors duration-300">
              <div class="border-b border-slate-200 dark:border-white/10 pb-3 text-left flex items-center justify-between">
                <div>
                  <h3 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">DOCUMENTACIÓN ADICIONAL ADJUNTADA</h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Archivos y anexos confirmados en tu expediente</p>
                </div>
                <span class="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {{ misArchivos.length }} {{ misArchivos.length === 1 ? 'Archivo' : 'Archivos' }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  v-for="arch in misArchivos"
                  :key="arch.id_archivo"
                  class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-4 rounded-xl flex items-center justify-between gap-3 text-left"
                >
                  <div class="flex items-center gap-3 overflow-hidden">
                    <div class="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg shrink-0">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div class="overflow-hidden">
                      <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Documento Anexo</span>
                      <p class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{{ arch.nombre_original }}</p>
                      <p class="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{{ formatBytes(arch.tamanio_bytes) }}</p>
                    </div>
                  </div>

                  <a
                    :href="`/api/documentos/${arch.nombre_guardado}?token=${authStore.token}`"
                    target="_blank"
                    class="btn-tactile bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver
                  </a>
                </div>
              </div>
            </div>
          </div>
          <!-- ==================== PESTAÑA: MI ENSAYO (FORMULARIO / INFORMACIÓN) ==================== -->
          <div v-else-if="tabActiva === 'registro'" class="space-y-6">
            <!-- Si ya está enviado y bajo revisión o validado (Solo lectura) -->
            <div v-if="(statusEnsayo === 0 && archivoEnsayo) || statusEnsayo === 1" class="bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-white/5 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm dark:shadow-none transition-colors duration-300">
              <div class="border-b border-slate-200 dark:border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 class="text-lg font-black text-slate-900 dark:text-white">Detalles del Ensayo Registrado</h2>
                  <p class="text-slate-500 dark:text-slate-400 text-xs">Tu ensayo ya ha sido enviado y no se admiten ediciones adicionales.</p>
                </div>
                <span class="text-[10px] font-mono bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wider">
                  Enviado
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div class="space-y-4">
                  <div>
                    <span class="block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Título de la Obra</span>
                    <span class="text-sm font-semibold text-slate-800 dark:text-white mt-1 block">{{ form.titulo_ensayo }}</span>
                  </div>
                  <div>
                    <span class="block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Seudónimo elegido</span>
                    <span class="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1 block">{{ form.seudonimo }}</span>
                  </div>
                  <div>
                    <span class="block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Alcaldía de Residencia</span>
                    <span class="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1 block">{{ nombreAlcaldia }}</span>
                  </div>
                  <div v-if="form.entidad">
                    <span class="block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Entidad Federativa</span>
                    <span class="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1 block">{{ form.entidad }}</span>
                  </div>
                </div>

                <div class="space-y-4">
                  <div>
                    <span class="block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">¿Cómo te enteraste del concurso?</span>
                    <span class="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1 block">{{ opcionEnterasteTexto }}</span>
                  </div>
                  <div>
                    <span class="block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Archivo PDF de la Obra</span>
                    <div class="flex items-center gap-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 p-3 rounded-xl mt-2 max-w-sm transition-colors duration-300">
                      <svg class="w-6 h-6 text-rose-500 dark:text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <div class="text-left overflow-hidden">
                        <p class="text-xs font-semibold text-slate-750 dark:text-slate-200 truncate">{{ form.seudonimo }}_ensayo.pdf</p>
                        <p class="text-[9px] text-slate-455 dark:text-slate-500">Formato PDF Oficial</p>
                      </div>
                    </div>
                  </div>
                  <div class="pt-2">
                    <a 
                      :href="`/api/documentos/${archivoEnsayo}?token=${authStore.token}`"
                      target="_blank"
                      class="btn-tactile bg-brand-primary text-slate-950 font-bold py-2 px-4 rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Visualizar PDF de Ensayo
                    </a>
                  </div>
                </div>
              </div>

              <!-- Historial de Manifestaciones Aceptadas -->
              <div class="border-t border-slate-200 dark:border-white/5 pt-6 space-y-3">
                <span class="block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Manifestaciones Firmadas Electrónicamente</span>
                <div class="space-y-2 max-h-40 overflow-y-auto pr-2 bg-slate-100 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-white/5 transition-colors duration-300">
                  <div v-for="m in manifestaciones" :key="m.id_manifestacion" class="flex gap-2.5 text-left text-[11px] text-slate-650 dark:text-slate-400">
                    <span class="text-emerald-500 dark:text-emerald-400 font-bold">✓</span>
                    <p>{{ m.texto }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulario de Registro / Edición (Habilitado para status null o 2) -->
            <div v-else class="bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-white/5 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm dark:shadow-none transition-colors duration-300">
              <!-- Banner de Observaciones si está rechazado -->
              <div v-if="statusEnsayo === 2" class="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-5 rounded-2xl space-y-2 text-left">
                <h3 class="font-black text-sm flex items-center gap-2">
                  <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Tu ensayo requiere corrección
                </h3>
                <p class="text-xs leading-relaxed">{{ observaciones }}</p>
              </div>

              <div>
                <h2 class="text-lg font-black text-slate-900 dark:text-white">Registrar Información del Ensayo</h2>
                <p class="text-slate-500 dark:text-slate-400 text-xs">Ingresa los datos operacionales de tu obra literaria y sube tu ensayo en formato PDF.</p>
              </div>

              <form @submit.prevent="guardarRegistro" class="space-y-6 text-left">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Seudónimo -->
                  <div class="space-y-1.5">
                    <label for="seudonimo" class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Seudónimo <span class="text-rose-500">*</span></label>
                    <input
                      v-model="form.seudonimo"
                      type="text"
                      id="seudonimo"
                      required
                      maxlength="30"
                      @blur="validarSeudonimoBlur"
                      class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-primary/50 text-slate-800 dark:bg-slate-950/60 dark:border-white/10 dark:text-white dark:focus:bg-slate-950/60 rounded-xl py-2.5 px-4 outline-none text-xs transition-colors"
                      placeholder="ej. FilósofoJuvenil"
                    />
                  </div>

                  <!-- Título del Ensayo -->
                  <div class="space-y-1.5">
                    <label for="titulo" class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Título del Ensayo <span class="text-rose-500">*</span></label>
                    <input
                      v-model="form.titulo_ensayo"
                      type="text"
                      id="titulo"
                      required
                      maxlength="30"
                      @blur="validarTituloBlur"
                      class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-primary/50 text-slate-800 dark:bg-slate-950/60 dark:border-white/10 dark:text-white dark:focus:bg-slate-950/60 rounded-xl py-2.5 px-4 outline-none text-xs transition-colors"
                      placeholder="ej. El impacto de la inteligencia artificial"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Alcaldía -->
                  <div class="space-y-1.5">
                    <label for="alcaldia" class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Alcaldía / Municipio de Residencia <span class="text-rose-500">*</span></label>
                    <select
                      v-model="form.id_alcaldia"
                      id="alcaldia"
                      required
                      class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-primary/50 text-slate-800 dark:bg-slate-950/60 dark:border-white/10 dark:text-white dark:focus:bg-slate-950/60 rounded-xl py-2.5 px-4 outline-none text-xs transition-colors"
                    >
                      <option value="" disabled class="text-slate-400">Selecciona tu alcaldía...</option>
                      <option v-for="alc in alcaldias" :key="alc.id_alcaldia" :value="alc.id_alcaldia" class="text-slate-800 dark:text-white dark:bg-slate-900">
                        {{ alc.nombre }}
                      </option>
                    </select>
                  </div>

                  <!-- ¿Cómo te enteraste? -->
                  <div class="space-y-1.5">
                    <label for="enteraste" class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">¿Cómo te enteraste del Concurso? <span class="text-rose-500">*</span></label>
                    <select
                      v-model="form.id_te_enteraste"
                      id="enteraste"
                      required
                      class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-primary/50 text-slate-800 dark:bg-slate-950/60 dark:border-white/10 dark:text-white dark:focus:bg-slate-950/60 rounded-xl py-2.5 px-4 outline-none text-xs transition-colors"
                    >
                      <option value="" disabled class="text-slate-400">Selecciona una opción...</option>
                      <option v-for="opt in opcionesEnteraste" :key="opt.id_te_enteraste" :value="opt.id_te_enteraste" class="text-slate-800 dark:text-white dark:bg-slate-900">
                        {{ opt.descripcion }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Campos adicionales si la alcaldía seleccionada es "Otro" -->
                <div v-if="form.id_alcaldia === 17" class="p-5 bg-slate-100 border border-slate-200 dark:bg-slate-950 dark:border-white/5 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6 transition-colors">
                  <div class="space-y-1.5">
                    <label for="entidad" class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Especificar Entidad Federativa <span class="text-rose-500">*</span></label>
                    <input
                      v-model="form.entidad"
                      type="text"
                      id="entidad"
                      required
                      class="w-full bg-white border border-slate-200 focus:border-brand-primary/50 text-slate-800 dark:bg-slate-900 dark:border-white/10 dark:text-white rounded-xl py-2 px-3 outline-none text-xs transition-colors"
                      placeholder="ej. Estado de México"
                    />
                  </div>
                  <div class="flex items-center gap-3 pt-6">
                    <input
                      v-model="form.soy_originario"
                      type="checkbox"
                      id="originario"
                      class="w-4 h-4 rounded border-slate-300 dark:border-white/10 accent-emerald-500 cursor-pointer"
                    />
                    <label for="originario" class="text-xs text-slate-650 dark:text-slate-300 leading-normal cursor-pointer select-none">
                      Manifiesto que soy originario de la CDMX.
                    </label>
                  </div>
                </div>

                <!-- Bloque del Tutor en caso de ser menor de edad -->
                <div v-if="esMenorDeEdad" class="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-4">
                  <div>
                    <h4 class="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Registro de Tutor Obligatorio (Menor de Edad)</h4>
                    <p class="text-[10px] text-slate-500 leading-relaxed mt-0.5">Al ser menor de 18 años de edad, se requiere registrar los datos de un padre, madre o tutor legal de forma obligatoria.</p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="space-y-1">
                      <label for="tutorNombre" class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Nombre(s) del Tutor <span class="text-rose-500">*</span></label>
                      <input
                        v-model="form.nombre_tutor"
                        type="text"
                        id="tutorNombre"
                        :required="esMenorDeEdad"
                        maxlength="25"
                        @input="form.nombre_tutor = form.nombre_tutor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')"
                        class="w-full bg-white border border-slate-200 focus:border-brand-primary/50 text-slate-800 dark:bg-slate-900 dark:border-white/10 dark:text-white rounded-xl py-2 px-3 outline-none text-xs transition-colors"
                        placeholder="Nombre del tutor"
                      />
                    </div>
                    <div class="space-y-1">
                      <label for="tutorPat" class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Primer Apellido Tutor <span class="text-rose-500">*</span></label>
                      <input
                        v-model="form.apellido_pat_tutor"
                        type="text"
                        id="tutorPat"
                        :required="esMenorDeEdad"
                        maxlength="25"
                        @input="form.apellido_pat_tutor = form.apellido_pat_tutor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')"
                        class="w-full bg-white border border-slate-200 focus:border-brand-primary/50 text-slate-800 dark:bg-slate-900 dark:border-white/10 dark:text-white rounded-xl py-2 px-3 outline-none text-xs transition-colors"
                        placeholder="Primer apellido"
                      />
                    </div>
                    <div class="space-y-1">
                      <label for="tutorMat" class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Segundo Apellido Tutor <span class="text-rose-500">*</span></label>
                      <input
                        v-model="form.apellido_mat_tutor"
                        type="text"
                        id="tutorMat"
                        :required="esMenorDeEdad"
                        maxlength="25"
                        @input="form.apellido_mat_tutor = form.apellido_mat_tutor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')"
                        class="w-full bg-white border border-slate-200 focus:border-brand-primary/50 text-slate-800 dark:bg-slate-900 dark:border-white/10 dark:text-white rounded-xl py-2 px-3 outline-none text-xs transition-colors"
                        placeholder="Segundo apellido"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="space-y-1">
                      <label for="tutorClave" class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Clave de Elector INE Tutor <span class="text-rose-500">*</span></label>
                      <input
                        v-model="form.clave_elector_tutor"
                        type="text"
                        id="tutorClave"
                        :required="esMenorDeEdad"
                        maxlength="18"
                        @input="onClaveElectorInput"
                        @blur="validarClaveElectorBlur"
                        class="w-full bg-white border border-slate-200 focus:border-brand-primary/50 text-slate-800 dark:bg-slate-900 dark:border-white/10 dark:text-white rounded-xl py-2 px-3 outline-none text-xs font-mono uppercase tracking-wider transition-colors"
                        placeholder="18 caracteres alfanuméricos"
                      />
                    </div>
                    <div class="space-y-1">
                      <label for="tel1_form" class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Teléfono de Contacto 1 <span class="text-rose-500">*</span></label>
                      <input
                        v-model="form.tel1"
                        type="tel"
                        id="tel1_form"
                        :required="esMenorDeEdad"
                        maxlength="10"
                        @input="form.tel1 = form.tel1.replace(/\D/g, '')"
                        @blur="validarTelContactoBlur('tel1', 'Teléfono de Contacto 1')"
                        class="w-full bg-white border border-slate-200 focus:border-brand-primary/50 text-slate-800 dark:bg-slate-900 dark:border-white/10 dark:text-white rounded-xl py-2 px-3 outline-none text-xs transition-colors"
                        placeholder="10 dígitos"
                      />
                    </div>
                    <div class="space-y-1">
                      <label for="tel2_form" class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Teléfono de Contacto 2</label>
                      <input
                        v-model="form.tel2"
                        type="tel"
                        id="tel2_form"
                        maxlength="10"
                        @input="form.tel2 = form.tel2.replace(/\D/g, '')"
                        @blur="validarTelContactoBlur('tel2', 'Teléfono de Contacto 2')"
                        class="w-full bg-white border border-slate-200 focus:border-brand-primary/50 text-slate-800 dark:bg-slate-900 dark:border-white/10 dark:text-white rounded-xl py-2 px-3 outline-none text-xs transition-colors"
                        placeholder="10 dígitos (opcional)"
                      />
                    </div>
                  </div>
                </div>

                <!-- 1. CARGA DE DOCUMENTO DEL ENSAYO PRINCIPAL (PDF) -->
                <div class="space-y-2 text-left">
                  <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    CARGA DE DOCUMENTO DEL ENSAYO (PDF) <span class="text-rose-500">*</span>
                  </label>

                  <!-- Si está configurado en el catálogo dinámico -->
                  <div v-if="reqEnsayoPrincipal">
                    <div 
                      class="border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-brand-primary/45 rounded-2xl p-8 text-center cursor-pointer transition-colors relative bg-slate-50/50 dark:bg-slate-950/20"
                      @click="triggerSelectorReq(reqEnsayoPrincipal.id_requisito)"
                      @dragover.prevent
                      @drop.prevent="manejarDropReq(reqEnsayoPrincipal.id_requisito, $event)"
                    >
                      <input
                        :ref="el => setReqInputRef(reqEnsayoPrincipal.id_requisito, el)"
                        type="file"
                        :accept="reqEnsayoPrincipal.extensiones_permitidas || '.pdf'"
                        class="hidden"
                        @change="subirDocumentoRequisito(reqEnsayoPrincipal.id_requisito, $event)"
                      />

                      <!-- Estado 1: Sin archivo subido -->
                      <div class="space-y-2" v-if="!getArchivoGuardado(reqEnsayoPrincipal.id_requisito)">
                        <div v-if="subiendoDoc[reqEnsayoPrincipal.id_requisito]" class="py-2">
                          <div class="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <p class="text-xs text-emerald-400 font-bold mt-2">Subiendo Ensayo Principal...</p>
                        </div>
                        <template v-else>
                          <svg class="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p class="text-xs text-slate-650 dark:text-slate-300">
                            Arrastra tu ensayo en formato PDF aquí o <span class="text-brand-primary font-semibold hover:underline">búscalo en tus carpetas</span>
                          </p>
                          <p class="text-[9px] text-slate-400 dark:text-slate-500">
                            Únicamente se permiten archivos PDF. Tamaño máximo de archivo: 15MB.
                          </p>
                        </template>
                      </div>

                      <!-- Estado 2: Con archivo subido -->
                      <div class="flex items-center justify-between bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-3 rounded-xl max-w-md mx-auto shadow-sm" v-else>
                        <div class="flex items-center gap-3">
                          <svg class="w-7 h-7 text-rose-500 dark:text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <div class="text-left overflow-hidden">
                            <p class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                              {{ getArchivoGuardado(reqEnsayoPrincipal.id_requisito).nombre_original }}
                            </p>
                            <div class="flex items-center gap-2">
                              <p class="text-[9px] text-slate-400 dark:text-slate-500 font-mono">
                                {{ formatBytes(getArchivoGuardado(reqEnsayoPrincipal.id_requisito).tamanio_bytes) }}
                              </p>
                              <span class="text-[9px] text-emerald-500 font-bold">✓ Cargado</span>
                            </div>
                          </div>
                        </div>

                        <div class="flex items-center gap-1.5 shrink-0">
                          <a
                            :href="`/api/documentos/${getArchivoGuardado(reqEnsayoPrincipal.id_requisito).nombre_guardado}?token=${authStore.token}`"
                            target="_blank"
                            @click.stop
                            class="text-emerald-500 hover:text-emerald-400 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            title="Ver / Previsualizar PDF"
                          >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </a>
                          <button
                            type="button"
                            @click.stop="eliminarDocumentoRequisito(reqEnsayoPrincipal.id_requisito)"
                            class="text-rose-500 hover:text-rose-400 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            title="Eliminar archivo"
                          >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Fallback Estático si no existe en catálogo -->
                  <div v-else
                    class="border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-brand-primary/45 rounded-2xl p-8 text-center cursor-pointer transition-colors relative bg-slate-50/50 dark:bg-slate-950/20"
                    @click="abrirSelectorArchivo"
                    @dragover.prevent
                    @drop.prevent="manejarDrop"
                  >
                    <input
                      ref="fileInput"
                      type="file"
                      accept=".pdf"
                      class="hidden"
                      @change="seleccionarArchivo"
                    />

                    <!-- Si no hay archivo seleccionado -->
                    <div class="space-y-2" v-if="!archivoSeleccionado">
                      <svg class="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p class="text-xs text-slate-650 dark:text-slate-300">Arrastra tu ensayo en formato PDF aquí o <span class="text-brand-primary font-semibold hover:underline">búscalo en tus carpetas</span></p>
                      <p class="text-[9px] text-slate-400 dark:text-slate-500">Únicamente se permiten archivos PDF. Tamaño máximo de archivo: 10MB.</p>
                    </div>

                    <!-- Si ya seleccionó -->
                    <div class="flex items-center justify-between bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-3 rounded-xl max-w-md mx-auto shadow-sm" v-else>
                      <div class="flex items-center gap-3">
                        <svg class="w-7 h-7 text-rose-500 dark:text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div class="text-left overflow-hidden">
                          <p class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{{ archivoSeleccionado.name }}</p>
                          <p class="text-[9px] text-slate-400 dark:text-slate-500">{{ (archivoSeleccionado.size / (1024 * 1024)).toFixed(2) }} MB</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-1">
                        <button type="button" @click.stop="previsualizarArchivoLocal" class="text-emerald-500 hover:text-emerald-400 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer" title="Previsualizar PDF">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button type="button" @click.stop="quitarArchivo" class="text-rose-500 hover:text-rose-400 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer" title="Quitar archivo">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 2. DOCUMENTACIÓN ADICIONAL REQUERIDA (EXCLUSIVAMENTE DOCUMENTOS ADICIONALES) -->
                <div v-if="requisitosAdicionales.length > 0" class="space-y-6 pt-4 border-t border-slate-200 dark:border-white/5">
                  <div
                    v-for="req in requisitosAdicionales"
                    :key="req.id_requisito"
                    class="space-y-2 text-left"
                  >
                    <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                      CARGA DE {{ req.nombre_requisito.toUpperCase() }} ({{ req.extensiones_permitidas.toUpperCase() }}) <span class="text-rose-500" v-if="req.es_obligatorio">*</span>
                    </label>
                    <p class="text-[11px] text-slate-400 dark:text-slate-500 -mt-1" v-if="req.descripcion">{{ req.descripcion }}</p>

                    <div 
                      class="border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-brand-primary/45 rounded-2xl p-8 text-center cursor-pointer transition-colors relative bg-slate-50/50 dark:bg-slate-950/20"
                      @click="triggerSelectorReq(req.id_requisito)"
                      @dragover.prevent
                      @drop.prevent="manejarDropReq(req.id_requisito, $event)"
                    >
                      <input
                        :ref="el => setReqInputRef(req.id_requisito, el)"
                        type="file"
                        :accept="req.extensiones_permitidas"
                        class="hidden"
                        @change="subirDocumentoRequisito(req.id_requisito, $event)"
                      />

                      <!-- Estado 1: Sin archivo subido -->
                      <div class="space-y-2" v-if="!getArchivoGuardado(req.id_requisito)">
                        <div v-if="subiendoDoc[req.id_requisito]" class="py-2">
                          <div class="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <p class="text-xs text-emerald-400 font-bold mt-2">Subiendo {{ req.nombre_requisito }}...</p>
                        </div>
                        <template v-else>
                          <svg class="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p class="text-xs text-slate-650 dark:text-slate-300">
                            Arrastra tu {{ req.nombre_requisito.toLowerCase() }} en formato {{ req.extensiones_permitidas.toUpperCase() }} aquí o <span class="text-brand-primary font-semibold hover:underline">búscalo en tus carpetas</span>
                          </p>
                          <p class="text-[9px] text-slate-400 dark:text-slate-500">
                            Únicamente se permiten archivos {{ req.extensiones_permitidas.toUpperCase() }}. Tamaño máximo de archivo: 15MB.
                          </p>
                        </template>
                      </div>

                      <!-- Estado 2: Con archivo subido -->
                      <div class="flex items-center justify-between bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-3 rounded-xl max-w-md mx-auto shadow-sm" v-else>
                        <div class="flex items-center gap-3">
                          <svg class="w-7 h-7 text-rose-500 dark:text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <div class="text-left overflow-hidden">
                            <p class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                              {{ getArchivoGuardado(req.id_requisito).nombre_original }}
                            </p>
                            <div class="flex items-center gap-2">
                              <p class="text-[9px] text-slate-400 dark:text-slate-500 font-mono">
                                {{ formatBytes(getArchivoGuardado(req.id_requisito).tamanio_bytes) }}
                              </p>
                              <span class="text-[9px] text-emerald-500 font-bold">✓ Cargado</span>
                            </div>
                          </div>
                        </div>

                        <div class="flex items-center gap-1.5 shrink-0">
                          <a
                            :href="`/api/documentos/${getArchivoGuardado(req.id_requisito).nombre_guardado}?token=${authStore.token}`"
                            target="_blank"
                            @click.stop
                            class="text-emerald-500 hover:text-emerald-400 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            title="Ver / Previsualizar documento"
                          >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </a>
                          <button
                            type="button"
                            @click.stop="eliminarDocumentoRequisito(req.id_requisito)"
                            class="text-rose-500 hover:text-rose-400 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            title="Eliminar archivo"
                          >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Mensaje si ya existe un ensayo guardado en el servidor -->
                  <p v-if="archivoEnsayo && !archivoSeleccionado" class="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    Ya cuentas con un archivo cargado en el servidor. Si no subes uno nuevo, se mantendrá la versión previa.
                  </p>

                <!-- Declaraciones Obligatorias -->
                <div class="space-y-3 bg-slate-50 border border-slate-200/60 dark:bg-slate-950/40 dark:border-white/5 p-5 rounded-2xl transition-colors">
                  <span class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Declaración Bajo Protesta</span>
                  <p class="text-[10px] text-slate-550 dark:text-slate-500">Debes aceptar y firmar electrónicamente cada uno de los siguientes manifiestos obligatorios para enviar tu propuesta al jurado.</p>
                  
                  <div class="space-y-4 pt-2">
                    <div v-for="m in manifestaciones" :key="m.id_manifestacion" class="flex gap-3 text-left">
                      <input
                        v-model="firmas[m.id_manifestacion]"
                        type="checkbox"
                        :id="`manif_${m.id_manifestacion}`"
                        required
                        class="w-5 h-5 rounded border-slate-300 dark:border-white/10 accent-emerald-500 cursor-pointer shrink-0 mt-0.5"
                        @change="animarCheck($event)"
                      />
                      <label :for="`manif_${m.id_manifestacion}`" class="text-xs text-slate-650 dark:text-slate-300 leading-relaxed cursor-pointer select-none">
                        {{ m.texto }}
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Botón de Envío -->
                <button
                  type="submit"
                  :disabled="guardando || !formularioCompletoValido"
                  :class="[
                    'btn-tactile w-full font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border-none',
                    formularioCompletoValido && !guardando
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20 cursor-pointer active:scale-[0.98]'
                      : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed opacity-60 shadow-none pointer-events-none'
                  ]"
                >
                  <span v-if="guardando" class="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span v-else>Guardar y Enviar Ensayo</span>
                </button>
              </form>
            </div>


          </div>



          <!-- ==================== PESTAÑA: CONVOCATORIA ==================== -->
          <div v-else-if="tabActiva === 'convocatoria'" class="space-y-6">
            <div class="bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-white/5 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm dark:shadow-none transition-colors duration-300">
              <div class="border-b border-slate-200 dark:border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 class="text-lg font-black text-slate-900 dark:text-white">Lineamientos Generales del Concurso</h2>
                  <p class="text-slate-500 dark:text-slate-400 text-xs">Consulta las bases técnicas y lineamientos de presentación oficiales.</p>
                </div>
                <span class="text-[9px] bg-slate-100 dark:bg-slate-950 text-slate-550 dark:text-slate-500 px-3 py-1 rounded border border-slate-200 dark:border-white/5 font-mono uppercase">Convocatoria 2027</span>
              </div>

              <!-- Contenido Estructurado de Convocatoria -->
              <div class="space-y-6 text-left text-xs leading-relaxed text-slate-600 dark:text-slate-300 transition-colors duration-300">
                <div class="space-y-2">
                  <h3 class="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider text-brand-primary">1. Características Técnicas del Ensayo</h3>
                  <ul class="list-disc pl-5 space-y-1">
                    <li>La extensión del ensayo debe ser de un mínimo de 5 y un máximo de 15 cuartillas (sin contar la portada).</li>
                    <li>Debe redactarse a espacio y medio (interlineado 1.5), con tipografía Arial de 12 puntos y márgenes estándar.</li>
                    <li>El archivo debe estar firmado con un seudónimo y guardarse en formato PDF únicamente.</li>
                  </ul>
                </div>

                <div class="space-y-2">
                  <h3 class="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider text-brand-primary">2. Criterios de Evaluación por el Jurado</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-white/5 transition-colors duration-300">
                    <div>
                      <p class="font-bold text-slate-850 dark:text-slate-200">Criterio 1: Formato (0.5 pts)</p>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400">Verifica tipografía, márgenes, portada y lineamientos de presentación.</p>
                    </div>
                    <div>
                      <p class="font-bold text-slate-850 dark:text-slate-200">Criterio 2: Claridad (2.0 pts)</p>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400">Claridad de redacción y consistencia en el hilo conductor.</p>
                    </div>
                    <div>
                      <p class="font-bold text-slate-850 dark:text-slate-200">Criterio 3: Estructura (2.0 pts)</p>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400">División correcta en introducción, cuerpo argumentativo y conclusiones.</p>
                    </div>
                    <div>
                      <p class="font-bold text-slate-850 dark:text-slate-200">Criterio 4: Propuesta (2.0 pts)</p>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400">Originalidad de la propuesta, valor añadido y relevancia del tema.</p>
                    </div>
                    <div>
                      <p class="font-bold text-slate-850 dark:text-slate-200">Criterio 5: Estilo (2.0 pts)</p>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400">Redacción, sintaxis correcta y total ausencia de errores ortográficos.</p>
                    </div>
                    <div>
                      <p class="font-bold text-slate-850 dark:text-slate-200">Criterio 6: Conclusión (1.5 pts)</p>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400">Calidad de las reflexiones finales planteadas en el cierre de la obra.</p>
                    </div>
                  </div>
                </div>

                <div class="space-y-2">
                  <h3 class="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider text-brand-primary">3. Privacidad y Anonimato</h3>
                  <p>
                    Para garantizar la imparcialidad del concurso, los evaluadores (Jueces) solo tendrán acceso al archivo de la obra en PDF, su seudónimo, título del ensayo y categoría de participación. Queda estrictamente prohibido incluir nombres reales, CURP, firmas autógrafas o cualquier otro dato identificativo en las páginas del ensayo PDF cargado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import api from '../../services/api';
import { gsap } from 'gsap';
import CampanaNotificaciones from '../../components/CampanaNotificaciones.vue';
import logowhite from '../../assets/logos/logowhite.png';
import { useConvocatoriaStore } from '../../stores/convocatoria.store';
import { useThemeStore } from '../../stores/theme.store';

const authStore = useAuthStore();
const convocatoriaStore = useConvocatoriaStore();
const themeStore = useThemeStore();
const router = useRouter();
const route = useRoute();

// Refs de navegación y Layout sincrónicos con el Sidebar
const tabActiva = ref('dashboard');

watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab) {
      tabActiva.value = newTab;
    } else {
      tabActiva.value = 'dashboard';
    }
  },
  { immediate: true }
);
const sidebarColapsado = ref(false);
const esTemaOscuro = ref(true);
const sidebarRef = ref(null);

const toggleTema = () => {
  esTemaOscuro.value = !esTemaOscuro.value;
  localStorage.setItem('theme', esTemaOscuro.value ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', esTemaOscuro.value);
  
  // Rotación elástica premium de los iconos del sol/luna
  gsap.fromTo('.theme-toggle-icon', 
    { rotation: esTemaOscuro.value ? -180 : 180, scale: 0.8 }, 
    { rotation: 0, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }
  );
};

// Animación de colapso del menú lateral con GSAP
watch(sidebarColapsado, (colapsado) => {
  const targetWidth = colapsado ? 80 : 256;
  
  gsap.to(sidebarRef.value, {
    width: targetWidth,
    duration: 0.35,
    ease: 'power3.inOut',
    overwrite: 'auto'
  });
  
  gsap.to('.sidebar-text', {
    width: colapsado ? 0 : 'auto',
    opacity: colapsado ? 0 : 1,
    marginLeft: colapsado ? 0 : 12,
    duration: 0.3,
    ease: 'power3.inOut',
    stagger: colapsado ? 0.01 : 0.015,
    overwrite: 'auto'
  });

  gsap.to('.sidebar-badge', {
    scale: colapsado ? 0 : 1,
    opacity: colapsado ? 0 : 1,
    duration: 0.25,
    ease: 'power2.out',
    overwrite: 'auto'
  });
});

// Transiciones de pestañas (Tabs)
const beforeEnter = (el) => {
  gsap.set(el, {
    opacity: 0,
    y: 12,
    scale: 0.985
  });
  // Ocultar preventivamente las tarjetas principales para evitar dobles destellos
  const cards = el.querySelectorAll('.bg-white, .bg-slate-50');
  if (cards.length > 0) {
    gsap.set(cards, { opacity: 0, y: 10 });
  }
};

const enter = (el, done) => {
  // Animar el contenedor de la pestaña
  gsap.to(el, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.25,
    ease: 'power3.out',
    onComplete: done
  });
  
  // Animar en paralelo las tarjetas hijas para un stagger fluido y sin parpadeos
  const cards = el.querySelectorAll('.bg-white, .bg-slate-50');
  if (cards.length > 0) {
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
      stagger: 0.02,
      delay: 0.04,
      overwrite: 'auto'
    });
  }
};

const leave = (el, done) => {
  gsap.to(el, {
    opacity: 0,
    y: -8,
    scale: 0.985,
    duration: 0.15,
    ease: 'power2.inOut',
    onComplete: done
  });
};

// Micro-interacción: rebote en checkbox al marcarlo
const animarCheck = (event) => {
  if (event.target.checked) {
    gsap.fromTo(event.target, 
      { scale: 0.8 }, 
      { scale: 1.25, duration: 0.15, ease: 'power2.out', yoyo: true, repeat: 1 }
    );
  }
};

// Requisitos de Archivos Dinámicos
const requisitosList = ref([]);
const misArchivos = ref([]);
const subiendoDoc = reactive({});

const reqEnsayoPrincipal = computed(() => {
  return requisitosList.value.find(r => 
    r.nombre_requisito.toLowerCase().includes('ensayo') ||
    r.nombre_requisito.toLowerCase().includes('obra')
  );
});

const requisitosAdicionales = computed(() => {
  return requisitosList.value.filter(r => 
    !r.nombre_requisito.toLowerCase().includes('ensayo') &&
    !r.nombre_requisito.toLowerCase().includes('obra')
  );
});

const cargarRequisitosYArchivos = async () => {
  try {
    const resReq = await api.get('/catalogos/requisitos-archivos');
    requisitosList.value = resReq.data;
  } catch (err) {
    console.error('Error al cargar catálogo de requisitos:', err.message);
  }

  try {
    const resArch = await api.get('/participante/mis-archivos');
    misArchivos.value = resArch.data || [];
  } catch (err) {
    console.error('Error al cargar mis archivos:', err.message);
  }
};

const reqInputRefs = reactive({});
const setReqInputRef = (id, el) => {
  if (el) reqInputRefs[id] = el;
};
const triggerSelectorReq = (id) => {
  if (reqInputRefs[id]) {
    reqInputRefs[id].click();
  }
};
const manejarDropReq = (id, event) => {
  const file = event.dataTransfer?.files[0];
  if (file) {
    subirDocumentoRequisito(id, { target: { files: [file] } });
  }
};

const getArchivoGuardado = (id_requisito) => {
  return misArchivos.value.find(a => a.id_requisito === id_requisito);
};

const formatBytes = (bytes) => {
  if (!bytes) return '0.00 MB';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
};

const subirDocumentoRequisito = async (id_requisito, event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('id_requisito', id_requisito);
  formData.append('archivo', file);

  subiendoDoc[id_requisito] = true;

  try {
    const res = await api.post('/participante/subir-archivo-requisito', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    Swal.fire({
      icon: 'success',
      title: 'Documento Subido',
      text: res.data.mensaje || 'Tu archivo fue procesado con éxito.',
      confirmButtonColor: '#10b981'
    });

    await cargarRequisitosYArchivos();
    await cargarMiRegistro();
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error de subida',
      text: err.response?.data?.error || 'No se pudo subir el documento.',
      confirmButtonColor: '#f43f5e'
    });
  } finally {
    subiendoDoc[id_requisito] = false;
    event.target.value = '';
  }
};

const eliminarDocumentoRequisito = async (id_requisito) => {
  const result = await Swal.fire({
    title: '¿Eliminar documento?',
    text: 'Se borrará este archivo de tu expediente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f43f5e',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  try {
    const res = await api.delete(`/participante/eliminar-archivo-requisito/${id_requisito}`);
    Swal.fire({
      icon: 'success',
      title: 'Eliminado',
      text: res.data.mensaje || 'Documento eliminado correctamente.',
      confirmButtonColor: '#10b981'
    });
    await cargarRequisitosYArchivos();
    await cargarMiRegistro();
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.error || 'No se pudo eliminar el documento.',
      confirmButtonColor: '#f43f5e'
    });
  }
};


const successCard = ref(null);
const pendingCard = ref(null);
const formCard = ref(null);
const fileInput = ref(null);

const cargado = ref(false);
const guardando = ref(false);
const statusEnsayo = ref(null);

const folio = ref('');
const archivoEnsayo = ref('');
const observaciones = ref('');
const fechaDescargaAcuse = ref(null);
const esMenorDeEdad = ref(false);
const fechaNacimiento = ref('');
const curp = ref('');
const idCategoria = ref(null);
const genero = ref('');



const alcaldias = ref([]);
const opcionesEnteraste = ref([]);
const manifestaciones = ref([]);

const archivoSeleccionado = ref(null);

// Firmas para la aceptación de cada manifestación
const firmas = reactive({});

const form = reactive({
  id_alcaldia: '',
  id_te_enteraste: '',
  seudonimo: '',
  titulo_ensayo: '',
  entidad: '',
  soy_originario: false,
  nombre_tutor: '',
  apellido_pat_tutor: '',
  apellido_mat_tutor: '',
  clave_elector_tutor: '',
  tel1: '',
  tel2: ''
});

// Title translation for Breadcrumbs
const tabActivaTexto = computed(() => {
  if (tabActiva.value === 'dashboard') return 'Resumen General';
  if (tabActiva.value === 'registro') return 'Mi Ensayo';
  if (tabActiva.value === 'perfil') return 'Expediente y Perfil';
  if (tabActiva.value === 'convocatoria') return 'Bases Convocatoria';
  return 'Inicio';
});

// Verifica que todas las manifestaciones cargadas estén marcadas
const todasManifestacionesFirmadas = computed(() => {
  if (manifestaciones.value.length === 0) return false;
  return manifestaciones.value.every(m => firmas[m.id_manifestacion] === true);
});

// Evaluación integral para la habilitación del botón de guardar/enviar ensayo
const formularioCompletoValido = computed(() => {
  // 1. Datos básicos del ensayo
  if (!form.seudonimo?.trim() || form.seudonimo.length > 30) return false;
  if (!form.titulo_ensayo?.trim() || form.titulo_ensayo.length > 30) return false;
  if (!form.id_alcaldia) return false;
  if (!form.id_te_enteraste) return false;
  if (parseInt(form.id_alcaldia, 10) === 17 && !form.entidad?.trim()) return false;

  // 2. Si es menor de edad: validar datos obligatorios del tutor
  if (esMenorDeEdad.value) {
    if (!form.nombre_tutor?.trim() || form.nombre_tutor.length > 25) return false;
    if (!form.apellido_pat_tutor?.trim() || form.apellido_pat_tutor.length > 25) return false;
    if (!form.apellido_mat_tutor?.trim() || form.apellido_mat_tutor.length > 25) return false;
    if (!form.clave_elector_tutor?.trim() || form.clave_elector_tutor.length !== 18) return false;
    const claveIneRegex = /^[A-Z]{6}\d{6}\d{2}[HM][A-Z0-9]{3}$/i;
    if (!claveIneRegex.test(form.clave_elector_tutor)) return false;
    if (!form.tel1?.trim() || form.tel1.length !== 10) return false;
    if (form.tel2 && form.tel2.length !== 10) return false;
  }

  // 3. Documento principal del ensayo cargado (o seleccionado localmente)
  const tieneEnsayo = Boolean(
    archivoSeleccionado.value ||
    archivoEnsayo.value ||
    (reqEnsayoPrincipal.value && getArchivoGuardado(reqEnsayoPrincipal.value.id_requisito))
  );
  if (!tieneEnsayo) return false;

  // 4. Documentos adicionales obligatorios marcados como requeridos (es_obligatorio === 1) cargados
  if (requisitosAdicionales.value.length > 0) {
    const obligatoriosOk = requisitosAdicionales.value.every(req => {
      if (req.es_obligatorio === 1 || req.es_obligatorio === true) {
        return Boolean(getArchivoGuardado(req.id_requisito));
      }
      return true;
    });
    if (!obligatoriosOk) return false;
  }

  // 5. Manifestaciones firmadas
  if (!todasManifestacionesFirmadas.value) return false;

  return true;
});

// Evaluación del avance por pasos de la solicitud
const paso2Completado = computed(() => {
  return (statusEnsayo.value === 0 || statusEnsayo.value === 1) || Boolean(form.seudonimo?.trim() && form.titulo_ensayo?.trim());
});

const paso3Completado = computed(() => {
  const tieneArchivo = Boolean(archivoEnsayo.value || (reqEnsayoPrincipal.value && getArchivoGuardado(reqEnsayoPrincipal.value.id_requisito)));
  return paso2Completado.value && tieneArchivo && (statusEnsayo.value === 0 || statusEnsayo.value === 1);
});

const paso4Completado = computed(() => {
  return statusEnsayo.value === 1;
});

// Computed para Progreso e Info de Datos Registrados
const progressPercent = computed(() => {
  if (paso4Completado.value) return 100;
  if (paso3Completado.value) return 75;
  if (paso2Completado.value) return 50;
  return 25; // Paso 1 (Cuenta creada)
});

const progressValAnimado = ref(0);

watch(progressPercent, (newVal) => {
  gsap.to(progressValAnimado, {
    value: newVal,
    duration: 1.2,
    ease: 'power2.out',
    roundProps: 'value'
  });
}, { immediate: true });

const nombreAlcaldia = computed(() => {
  const alc = alcaldias.value.find(a => a.id_alcaldia === parseInt(form.id_alcaldia, 10));
  return alc ? alc.nombre : 'No especificada';
});

const opcionEnterasteTexto = computed(() => {
  const opt = opcionesEnteraste.value.find(o => o.id_te_enteraste === parseInt(form.id_te_enteraste, 10));
  return opt ? opt.descripcion : 'No especificado';
});

const fechaNacimientoFormateada = computed(() => {
  if (!fechaNacimiento.value) return '';
  const date = new Date(fechaNacimiento.value);
  return date.toLocaleDateString('es-MX', { timeZone: 'UTC' });
});

const categoriaAsignadaTexto = computed(() => {
  if (idCategoria.value === 1) return 'Categoría 1 (15 a 17 años)';
  if (idCategoria.value === 2) return 'Categoría 2 (18 a 23 años)';
  return 'No asignada';
});


onMounted(async () => {
  themeStore.cargarTema();
  esTemaOscuro.value = document.documentElement.classList.contains('dark');
  convocatoriaStore.cargarConvocatoriaActiva(true);
  await cargarCatalogos();
  await cargarMiRegistro();
  await cargarRequisitosYArchivos();
  cargado.value = true;

  nextTick(() => {
    // Set de animación inicial del sidebar según el estado colapsado
    if (sidebarColapsado.value) {
      gsap.set(sidebarRef.value, { width: 80 });
      gsap.set('.sidebar-text', { width: 0, opacity: 0, marginLeft: 0 });
      gsap.set('.sidebar-badge', { scale: 0, opacity: 0 });
    } else {
      gsap.set(sidebarRef.value, { width: 256 });
      gsap.set('.sidebar-text', { width: 'auto', opacity: 1, marginLeft: 12 });
      gsap.set('.sidebar-badge', { scale: 1, opacity: 1 });
    }
  });

  // Animación suave de entrada de la primera pestaña activa
  setTimeout(() => {
    const initialCards = document.querySelectorAll('.max-w-7xl .bg-white, .max-w-7xl .bg-slate-50');
    if (initialCards.length > 0) {
      gsap.fromTo(initialCards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.04 }
      );
    }
  }, 120);
});

const cargarCatalogos = async () => {
  try {
    const [alcRes, enterasteRes, manifRes] = await Promise.all([
      api.get('/catalogos/alcaldias'),
      api.get('/catalogos/te-enteraste'),
      api.get('/catalogos/manifestaciones')
    ]);
    alcaldias.value = alcRes.data;
    opcionesEnteraste.value = enterasteRes.data;
    manifestaciones.value = manifRes.data;

    // Inicializar firmas vacías
    manifRes.data.forEach(m => {
      firmas[m.id_manifestacion] = false;
    });
  } catch (err) {
    console.error('Error al cargar catálogos:', err.message);
  }
};

const cargarMiRegistro = async () => {
  try {
    const res = await api.get('/participante/mi-registro');
    const { participante, manifestaciones: manifAceptadas, fecha_nacimiento, curp: curpUsuario } = res.data;

    statusEnsayo.value = participante.status_ensayo;
    folio.value = participante.folio;
    archivoEnsayo.value = participante.archivo_ensayo;
    observaciones.value = participante.observaciones;
    fechaDescargaAcuse.value = participante.fecha_descarga_acuse;
    curp.value = curpUsuario || '';
    idCategoria.value = participante.id_categoria;
    genero.value = res.data.genero || '';


    // Evaluar edad

    if (fecha_nacimiento) {
      fechaNacimiento.value = fecha_nacimiento;
      const edad = calcularEdad(fecha_nacimiento);
      esMenorDeEdad.value = edad < 18;
    }

    // Rellenar formulario si ya hay datos previos
    form.id_alcaldia = participante.id_alcaldia || '';
    form.id_te_enteraste = participante.id_te_enteraste || '';
    form.seudonimo = participante.seudonimo || '';
    form.titulo_ensayo = participante.titulo_ensayo || '';
    form.entidad = participante.entidad || '';
    form.soy_originario = participante.soy_originario === 1;
    form.nombre_tutor = participante.nombre_tutor || '';
    form.apellido_pat_tutor = participante.apellido_pat_tutor || '';
    form.apellido_mat_tutor = participante.apellido_mat_tutor || '';
    form.clave_elector_tutor = participante.clave_elector_tutor || '';
    form.tel1 = participante.tel1 || '';
    form.tel2 = participante.tel2 || '';

    // Rellenar las firmas de manifestaciones aceptadas
    if (manifAceptadas && manifAceptadas.length > 0) {
      manifAceptadas.forEach(ma => {
        firmas[ma.id_manifestacion] = ma.respuesta === 1;
      });
    }

    // Redirigir a pestaña de registro si no ha llenado y guardado formalmente el formulario (titulo y seudónimo)
    const tieneFormularioCompleto = Boolean(participante.titulo_ensayo && participante.seudonimo);
    if (!tieneFormularioCompleto) {
      tabActiva.value = 'registro';
    }
  } catch (err) {
    // Si es 404 es normal (participante nuevo sin datos de ensayo)
    if (err.response?.status === 404) {
      console.log('Sin participación registrada aún.');
      tabActiva.value = 'registro';
    } else {
      console.error('Error de servidor al cargar registro:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error de comunicación',
        text: 'No se pudo obtener la información de tu ensayo desde el servidor. Por favor, recarga la página (F5).',
        confirmButtonColor: '#f43f5e'
      });
    }
  }
};

const abrirSelectorArchivo = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const seleccionarArchivo = (e) => {
  const file = e.target.files[0];
  validarYAsignarArchivo(file);
};

const manejarDrop = (e) => {
  const file = e.dataTransfer.files[0];
  validarYAsignarArchivo(file);
};

const validarYAsignarArchivo = (file) => {
  if (!file) return;

  if (file.type !== 'application/pdf') {
    Swal.fire({
      icon: 'error',
      title: 'Formato inválido',
      text: 'Únicamente se permiten archivos en formato PDF.',
      confirmButtonColor: '#f43f5e'
    });
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    Swal.fire({
      icon: 'error',
      title: 'Archivo muy grande',
      text: 'El tamaño máximo permitido es de 10 MB.',
      confirmButtonColor: '#f43f5e'
    });
    return;
  }

  archivoSeleccionado.value = file;
};

const quitarArchivo = () => {
  archivoSeleccionado.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const previsualizarArchivoLocal = () => {
  if (archivoSeleccionado.value) {
    const url = URL.createObjectURL(archivoSeleccionado.value);
    window.open(url, '_blank');
  }
};

const descargarAcusePDF = async () => {
  try {
    const res = await api.get('/documentos/descargar-acuse');
    const { urlDescarga } = res.data;
    window.open(urlDescarga, '_blank');
    
    // Pequeño delay y recargamos para ocultar el botón del acuse
    setTimeout(async () => {
      await cargarMiRegistro();
    }, 2000);
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error al obtener acuse',
      text: err.response?.data?.error || 'No se pudo generar la liga de descarga.',
      confirmButtonColor: '#f43f5e'
    });
  }
};
const toastAdvertencia = (titulo, texto) => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'warning',
    title: titulo,
    text: texto,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    background: esTemaOscuro.value ? '#1E1B2E' : '#ffffff',
    color: esTemaOscuro.value ? '#F8FAFC' : '#1E293B'
  });
};

const validarSeudonimoBlur = () => {
  if (!form.seudonimo) return;
  if (form.seudonimo.length > 30) {
    toastAdvertencia('Seudónimo Inválido', 'El seudónimo no puede tener más de 30 caracteres.');
  }
};

const validarTituloBlur = () => {
  if (!form.titulo_ensayo) return;
  if (form.titulo_ensayo.length > 30) {
    toastAdvertencia('Título Inválido', 'El título del ensayo no puede tener más de 30 caracteres.');
  }
};

const onClaveElectorInput = () => {
  form.clave_elector_tutor = form.clave_elector_tutor.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (form.clave_elector_tutor.length === 18) {
    validarClaveElectorBlur();
  }
};

const validarClaveElectorBlur = () => {
  if (!form.clave_elector_tutor) return;
  const claveRegex = /^[A-Z]{6}\d{6}\d{2}[HM][A-Z0-9]{3}$/i;
  if (form.clave_elector_tutor.length < 18) {
    toastAdvertencia('Clave INE Incompleta', `La Clave de Elector del tutor debe tener exactamente 18 caracteres (llevas ${form.clave_elector_tutor.length}).`);
  } else if (!claveRegex.test(form.clave_elector_tutor)) {
    toastAdvertencia('Clave INE Inválida', 'La Clave de Elector no cumple con la estructura oficial INE (6 letras, 8 números, sexo H/M y 3 caracteres alfanuméricos).');
  }
};

const validarTelContactoBlur = (campo, etiqueta) => {
  if (!form[campo]) return;
  if (form[campo].length < 10) {
    toastAdvertencia(`${etiqueta} Incompleto`, `El ${etiqueta.toLowerCase()} debe tener exactamente 10 dígitos numéricos (llevas ${form[campo].length}).`);
  }
};

const guardarRegistro = async () => {
  if (form.seudonimo.length > 30) {
    toastAdvertencia('Seudónimo Muy Largo', 'El seudónimo no puede exceder los 30 caracteres.');
    return;
  }
  if (form.titulo_ensayo.length > 30) {
    toastAdvertencia('Título Muy Largo', 'El título del ensayo no puede exceder los 30 caracteres.');
    return;
  }

  if (esMenorDeEdad.value) {
    if (!form.nombre_tutor?.trim()) {
      toastAdvertencia('Campo Obligatorio', 'El Nombre del Tutor es obligatorio.');
      return;
    }
    if (!form.apellido_pat_tutor?.trim()) {
      toastAdvertencia('Campo Obligatorio', 'El Primer Apellido del Tutor es obligatorio.');
      return;
    }
    if (!form.apellido_mat_tutor?.trim()) {
      toastAdvertencia('Campo Obligatorio', 'El Segundo Apellido del Tutor es obligatorio.');
      return;
    }
    if (!form.clave_elector_tutor?.trim()) {
      toastAdvertencia('Campo Obligatorio', 'La Clave de Elector del Tutor es obligatoria.');
      return;
    }
    const claveRegex = /^[A-Z]{6}\d{6}\d{2}[HM][A-Z0-9]{3}$/i;
    if (form.clave_elector_tutor.length !== 18 || !claveRegex.test(form.clave_elector_tutor)) {
      toastAdvertencia('Clave INE Inválida', 'La Clave de Elector del Tutor debe tener un formato oficial INE válido de 18 caracteres.');
      return;
    }
    if (!form.tel1?.trim() || form.tel1.length !== 10) {
      toastAdvertencia('Teléfono Obligatorio', 'El Teléfono de Contacto 1 del Tutor debe ser de exactamente 10 dígitos numéricos.');
      return;
    }
    if (form.tel2 && form.tel2.length !== 10) {
      toastAdvertencia('Teléfono Inválido', 'El Teléfono de Contacto 2 debe ser de exactamente 10 dígitos numéricos.');
      return;
    }
  }

  guardando.value = true;

  try {
    const formData = new FormData();
    formData.append('id_alcaldia', form.id_alcaldia);
    formData.append('id_te_enteraste', form.id_te_enteraste);
    formData.append('seudonimo', form.seudonimo);
    formData.append('titulo_ensayo', form.titulo_ensayo);
    
    if (form.id_alcaldia === 17) {
      formData.append('entidad', form.entidad);
      formData.append('soy_originario', form.soy_originario ? 'true' : 'false');
    }

    if (esMenorDeEdad.value) {
      formData.append('nombre_tutor', form.nombre_tutor);
      formData.append('apellido_pat_tutor', form.apellido_pat_tutor);
      formData.append('apellido_mat_tutor', form.apellido_mat_tutor);
      formData.append('clave_elector_tutor', form.clave_elector_tutor);
      formData.append('tel1', form.tel1);
      formData.append('tel2', form.tel2);
    }

    if (archivoSeleccionado.value) {
      formData.append('archivo_ensayo', archivoSeleccionado.value);
    }

    // Convertir firmas a array estructurado
    const manifestacionesArray = [];
    Object.keys(firmas).forEach(id => {
      manifestacionesArray.push({
        id_manifestacion: parseInt(id, 10),
        respuesta: firmas[id] ? 1 : 0
      });
    });
    formData.append('manifestaciones', JSON.stringify(manifestacionesArray));

    const res = await api.post('/participante/completar-registro', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    Swal.fire({
      icon: 'success',
      title: '¡Ensayo Guardado!',
      text: res.data.mensaje,
      confirmButtonColor: '#10b981'
    }).then(async () => {
      // Limpiar archivo seleccionado temporal
      archivoSeleccionado.value = null;
      if (fileInput.value) {
        fileInput.value.value = '';
      }
      
      // Recargar el registro actualizado desde el servidor
      await cargarMiRegistro();
      
      // Redirigir al Resumen General para mostrar la línea del tiempo al 75%
      tabActiva.value = 'dashboard';
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error al registrar',
      text: err.response?.data?.error || 'Ocurrió un error inesperado al enviar los datos.',
      confirmButtonColor: '#f43f5e'
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

const terminarSuplantacion = async () => {
  try {
    await authStore.terminarImpersonacion();
    router.push('/admin/configuracion');
  } catch (err) {
    console.error('Error al terminar suplantación:', err.message);
  }
};
</script>

<style scoped>
/* Transición del sidebar y elementos */
aside, main {
  will-change: width, transform;
}
</style>
