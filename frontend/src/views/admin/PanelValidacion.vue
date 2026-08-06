<template>
  <div class="w-full relative z-10 flex-grow space-y-6">
      
      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Panel de Validación de Ensayos</h1>
          <p class="text-slate-500 dark:text-slate-400 text-xs">Módulo del Administrador — Edición Concurso 2026</p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Botón Exportar Excel -->
          <button @click="exportarReporteExcel" :disabled="exportando" class="btn-tactile bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2 px-4 rounded-xl text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all shadow-sm">
            <span v-if="exportando" class="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar Excel
          </button>
        </div>
      </div>

      <!-- FILTROS Y ESTADÍSTICAS CON TAILADMIN RADIAL PROGRESS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Total Registrados -->
        <div class="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between backdrop-blur-xl hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm dark:shadow-lg">
          <div>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block font-mono">Total Registrados</span>
            <span class="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5 block">Participantes en Sistema</span>
          </div>

          <div class="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-slate-200 dark:text-slate-800" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-slate-900 dark:text-white" stroke-width="3.5" stroke-dasharray="100, 100" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute flex flex-col items-center justify-center leading-none">
              <span class="text-lg font-black text-slate-900 dark:text-white font-mono">{{ totalRegistrados }}</span>
              <span class="text-[8px] font-bold text-slate-400 font-mono mt-0.5">100%</span>
            </div>
          </div>
        </div>

        <!-- Validados -->
        <div class="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between backdrop-blur-xl hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm dark:shadow-lg">
          <div>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block font-mono">Validados</span>
            <span class="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5 block">Folio Oficial</span>
          </div>

          <div class="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-slate-200 dark:text-slate-800" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-emerald-500 dark:text-emerald-400 transition-all duration-700 ease-out" stroke-width="3.5" :stroke-dasharray="`${totalRegistrados ? Math.round((totalValidados / totalRegistrados) * 100) : 0}, 100`" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute flex flex-col items-center justify-center leading-none">
              <span class="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">{{ totalValidados }}</span>
              <span class="text-[8px] font-bold text-slate-400 font-mono mt-0.5">{{ totalRegistrados ? Math.round((totalValidados / totalRegistrados) * 100) : 0 }}%</span>
            </div>
          </div>
        </div>

        <!-- Pendientes -->
        <div class="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between backdrop-blur-xl hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm dark:shadow-lg">
          <div>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block font-mono">Pendientes</span>
            <span class="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5 block">Por Revisar</span>
          </div>

          <div class="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-slate-200 dark:text-slate-800" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-amber-500 dark:text-amber-400 transition-all duration-700 ease-out" stroke-width="3.5" :stroke-dasharray="`${totalRegistrados ? Math.round((totalPendientes / totalRegistrados) * 100) : 0}, 100`" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute flex flex-col items-center justify-center leading-none">
              <span class="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">{{ totalPendientes }}</span>
              <span class="text-[8px] font-bold text-slate-400 font-mono mt-0.5">{{ totalRegistrados ? Math.round((totalPendientes / totalRegistrados) * 100) : 0 }}%</span>
            </div>
          </div>
        </div>

        <!-- Con Observaciones -->
        <div class="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between backdrop-blur-xl hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm dark:shadow-lg">
          <div>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block font-mono">Con Observaciones</span>
            <span class="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5 block">Requieren Corrección</span>
          </div>

          <div class="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-slate-200 dark:text-slate-800" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-rose-500 dark:text-rose-400 transition-all duration-700 ease-out" stroke-width="3.5" :stroke-dasharray="`${totalRegistrados ? Math.round((totalObservados / totalRegistrados) * 100) : 0}, 100`" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute flex flex-col items-center justify-center leading-none">
              <span class="text-lg font-black text-rose-600 dark:text-rose-400 font-mono">{{ totalObservados }}</span>
              <span class="text-[8px] font-bold text-slate-400 font-mono mt-0.5">{{ totalRegistrados ? Math.round((totalObservados / totalRegistrados) * 100) : 0 }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- BARRA DE BÚSQUEDA Y FILTROS -->
      <div class="bg-white dark:bg-slate-900/60 p-4 md:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <!-- Buscador por Texto -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por folio, nombre, CURP, ensayo..."
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none focus:border-brand-primary/50 transition-colors font-medium"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Filtro Estatus -->
          <div>
            <select
              v-model="filtroEstado"
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs outline-none focus:border-brand-primary/50 font-medium cursor-pointer"
            >
              <option value="todos">Todos los Estados</option>
              <option value="0">Pendientes (Por Revisar)</option>
              <option value="1">Validados (Con Folio)</option>
              <option value="2">Con Observaciones</option>
            </select>
          </div>

          <!-- Filtro Categoría -->
          <div>
            <select
              v-model="filtroCategoria"
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs outline-none focus:border-brand-primary/50 font-medium cursor-pointer"
            >
              <option value="todas">Todas las Categorías</option>
              <option v-for="cat in categoriasUnicas" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <!-- Filtro Alcaldía -->
          <div>
            <select
              v-model="filtroAlcaldia"
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs outline-none focus:border-brand-primary/50 font-medium cursor-pointer"
            >
              <option value="todas">Todas las Alcaldías</option>
              <option v-for="alc in alcaldiasUnicas" :key="alc" :value="alc">{{ alc }}</option>
            </select>
          </div>

        </div>

        <!-- Indicador de Resultados y Botón Limpiar -->
        <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5 text-xs">
          <span class="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
            Mostrando <strong class="text-slate-800 dark:text-white font-bold">{{ participantesFiltrados.length }}</strong> de <strong class="text-slate-800 dark:text-white font-bold">{{ participantes.length }}</strong> participantes
          </span>

          <button
            v-if="hayFiltrosActivos"
            @click="limpiarFiltros"
            class="text-[11px] text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar Filtros
          </button>
        </div>
      </div>

      <!-- TABLA DE PARTICIPANTES -->
      <div class="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm dark:shadow-none">
        
        <!-- Estado vacío -->
        <div v-if="cargando" class="p-12 text-center space-y-4">
          <div class="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="text-slate-500 dark:text-slate-400 text-xs">Cargando registros de participantes...</p>
        </div>
        
        <div v-else-if="participantesFiltrados.length === 0" class="p-12 text-center text-slate-500 dark:text-slate-400 text-xs space-y-2">
          <p class="font-bold text-slate-700 dark:text-slate-300">No se encontraron participantes con los filtros seleccionados.</p>
          <button v-if="hayFiltrosActivos" @click="limpiarFiltros" class="text-brand-primary hover:underline font-semibold text-xs cursor-pointer">
            Limpiar filtros de búsqueda
          </button>
        </div>

        <div class="overflow-x-auto" v-else>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950/80 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/10">
                <th class="p-4">Folio</th>
                <th class="p-4">Participante</th>
                <th class="p-4">CURP</th>
                <th class="p-4">Obra / Seudónimo</th>
                <th class="p-4">Alcaldía / Categoria</th>
                <th class="p-4">Jurado / Calificación</th>
                <th class="p-4">Estado</th>
                <th class="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5 text-xs">
              <tr v-for="part in participantesFiltrados" :key="part.id_participante" class="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                <!-- Folio -->
                <td class="p-4 font-mono font-bold tracking-wider" :class="part.folio ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'">
                  {{ part.folio || '(Pendiente)' }}
                </td>
                
                <!-- Participante -->
                <td class="p-4">
                  <div class="font-semibold text-slate-900 dark:text-white">{{ part.nombre }} {{ part.apellido_pat }} {{ part.apellido_mat }}</div>
                  <div class="text-[10px] text-slate-500 dark:text-slate-400">{{ part.correo }}</div>
                </td>
                
                <!-- CURP -->
                <td class="p-4 font-mono text-slate-700 dark:text-slate-300">
                  {{ part.curp || 'N/A' }}
                </td>
                
                <!-- Obra -->
                <td class="p-4 max-w-[200px]">
                  <div class="truncate text-slate-800 dark:text-slate-200 font-medium" :title="part.titulo_ensayo">{{ part.titulo_ensayo || '(No registrada)' }}</div>
                  <div class="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{{ part.seudonimo || '(Sin seudónimo)' }}</div>
                </td>
                
                <!-- Alcaldia / Categoría -->
                <td class="p-4">
                  <div class="text-slate-700 dark:text-slate-300">{{ part.alcaldia_nombre || '(No registrada)' }}</div>
                  <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">{{ part.categoria_nombre }}</div>
                </td>

                <!-- Calificación del Jurado (Contador N/Total y Promedio) -->
                <td class="p-4">
                  <div v-if="part.status_ensayo === 1" class="space-y-1">
                    <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs font-mono font-bold" :class="part.jueces_evaluaron_count === part.total_jueces && part.total_jueces > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'">
                      <span>{{ part.jueces_evaluaron_count }}/{{ part.total_jueces }} Evaluaron</span>
                      <span v-if="part.jueces_evaluaron_count === part.total_jueces && part.total_jueces > 0" class="text-[9px] text-emerald-500 font-bold">✓ Completo</span>
                    </div>
                    <div v-if="part.promedio_calificacion !== null && part.promedio_calificacion !== undefined" class="text-[11px] text-amber-500 dark:text-amber-400 font-bold flex items-center gap-1">
                      ★ {{ part.promedio_calificacion }} pts
                    </div>
                    <div v-else class="text-[10px] text-slate-400 dark:text-slate-500 italic">
                      Sin calificar
                    </div>
                  </div>
                  <div v-else class="text-[10px] text-slate-400 dark:text-slate-500 italic">
                    (Pendiente validación)
                  </div>
                </td>
                
                <!-- Estado -->
                <td class="p-4">
                  <span v-if="part.status_ensayo === 0" class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Pendiente
                  </span>
                  <span v-else-if="part.status_ensayo === 1" class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Validado
                  </span>
                  <span v-else-if="part.status_ensayo === 2" class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20" :title="part.observaciones">
                    Observaciones
                  </span>
                </td>
                
                <!-- Acciones -->
                <td class="p-4">
                  <div class="flex items-center justify-center gap-2">
                    <!-- Botón Dictaminar / Abrir Modal -->
                    <button
                      @click="abrirModalDictamen(part)"
                      class="p-2 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                      title="Dictaminar / Validar Ensayo y Expediente"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Dictaminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

    </div>

    <!-- MODAL DE DICTAMEN / VALIDACIÓN DE EXPEDIENTE -->
    <div v-if="modalVisible && partSeleccionadoModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-left relative">
        
        <!-- Botón cerrar modal -->
        <button @click="cerrarModalDictamen" class="absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Header del Modal -->
        <div class="border-b border-slate-200 dark:border-white/10 pb-4 pr-8">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono font-bold bg-brand-primary/10 text-brand-primary px-2.5 py-0.5 rounded-full border border-brand-primary/20">EDICIÓN 2026</span>
            <span v-if="partSeleccionadoModal.folio" class="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20">Folio: {{ partSeleccionadoModal.folio }}</span>
          </div>
          <h2 class="text-xl font-black text-slate-900 dark:text-white mt-1">Dictaminar Expediente de Participante</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {{ partSeleccionadoModal.nombre }} {{ partSeleccionadoModal.apellido_pat }} {{ partSeleccionadoModal.apellido_mat }} — Seudónimo: <strong class="text-slate-800 dark:text-slate-200">{{ partSeleccionadoModal.seudonimo }}</strong>
          </p>
        </div>

        <!-- SECCIÓN 1: EXPEDIENTE Y DOCUMENTACIÓN -->
        <div class="space-y-4">
          <h3 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">1. Documentación del Expediente</h3>

          <!-- Ensayo Principal -->
          <div class="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-3 overflow-hidden">
              <div class="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 dark:text-rose-400 shrink-0">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="overflow-hidden">
                <span class="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider block">Ensayo Principal (PDF)</span>
                <p class="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[280px]">
                  {{ partSeleccionadoModal.titulo_ensayo || partSeleccionadoModal.seudonimo || 'Ensayo Anónimo' }}
                </p>
              </div>
            </div>

            <template v-if="obtenerArchivoEnsayoPrincipal(partSeleccionadoModal)">
              <a
                :href="`/api/documentos/${obtenerArchivoEnsayoPrincipal(partSeleccionadoModal)}?token=${authStore.token}`"
                target="_blank"
                class="btn-tactile bg-brand-primary hover:bg-sky-400 text-slate-950 font-bold py-2 px-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shrink-0 shadow-sm"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Ver Ensayo PDF
              </a>
            </template>
            <template v-else>
              <span class="text-xs text-rose-500 dark:text-rose-400/80 italic font-medium bg-rose-500/10 px-3 py-1 rounded-xl border border-rose-500/20 shrink-0 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Sin ensayo subido
              </span>
            </template>
          </div>

          <!-- Documentos Adicionales (Solo si existen) -->
          <div v-if="cargandoArchivosModal" class="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
            <span class="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin inline-block mr-2"></span>
            Cargando documentos adicionales...
          </div>

          <div v-else-if="archivosAdicionalesFiltrados.length > 0" class="space-y-3">
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Documentos Adicionales Cargados ({{ archivosAdicionalesFiltrados.length }})</span>
            <div
              v-for="arch in archivosAdicionalesFiltrados"
              :key="arch.id_archivo"
              class="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div class="flex items-center gap-3 overflow-hidden">
                <div class="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="overflow-hidden">
                  <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">{{ arch.nombre_requisito }}</span>
                  <p class="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[280px]">{{ arch.nombre_original }}</p>
                </div>
              </div>

              <a
                :href="`/api/documentos/${arch.nombre_guardado}?token=${authStore.token}`"
                target="_blank"
                class="btn-tactile bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 font-bold py-2 px-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shrink-0"
              >
                <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Ver Documento
              </a>
            </div>
          </div>
        </div>

        <!-- SECCIÓN 2: FORMULARIO DE DICTAMINACIÓN -->
        <div class="space-y-4 border-t border-slate-200 dark:border-white/10 pt-4">
          <h3 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">2. Dictamen del Validador</h3>

          <!-- Select Dictamen -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-400">Resultado del Dictamen <span class="text-rose-500">*</span></label>
            <select
              v-model="dictamenEstatus"
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl p-3 text-xs outline-none focus:border-brand-primary/50 font-medium"
            >
              <option value="1">Correcto (Validar y Asignar Folio Oficial)</option>
              <option value="2">Incorrecto (Marcar con Observaciones para Corrección)</option>
            </select>
          </div>

          <!-- Observaciones -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-400 flex items-center justify-between">
              <span>Observaciones / Retroalimentación</span>
              <span v-if="dictamenEstatus === '2'" class="text-[10px] font-semibold text-rose-500 dark:text-rose-400">* Requerido si es incorrecto</span>
            </label>
            <textarea
              v-model="dictamenObservaciones"
              rows="3"
              placeholder="Escribe aquí las observaciones o el motivo del rechazo en caso de estar incorrecto..."
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl p-3 text-xs outline-none focus:border-brand-primary/50 transition-colors"
              :class="dictamenEstatus === '2' && (!dictamenObservaciones || !dictamenObservaciones.trim()) ? 'border-rose-500/50' : ''"
            ></textarea>
          </div>
        </div>

        <!-- BOTONES DE ACCIÓN -->
        <div class="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-white/10 pt-4">
          <button
            type="button"
            @click="cerrarModalDictamen"
            class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer transition-all"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="guardarDictamen"
            :disabled="guardandoDictamen"
            class="btn-tactile px-5 py-2.5 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg"
            :class="dictamenEstatus === '1' ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' : 'bg-rose-600 hover:bg-rose-500 text-white'"
          >
            <span v-if="guardandoDictamen" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            <span v-else>Guardar Dictamen</span>
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import api from '../../services/api';

const authStore = useAuthStore();
const router = useRouter();

const cargando = ref(false);
const exportando = ref(false);
const participantes = ref([]);

// Estados de Filtros
const searchQuery = ref('');
const filtroEstado = ref('todos');
const filtroCategoria = ref('todas');
const filtroAlcaldia = ref('todas');

const categoriasUnicas = computed(() => {
  const set = new Set();
  participantes.value.forEach(p => {
    if (p.categoria_nombre) set.add(p.categoria_nombre);
  });
  return Array.from(set);
});

const alcaldiasUnicas = computed(() => {
  const set = new Set();
  participantes.value.forEach(p => {
    if (p.alcaldia_nombre) set.add(p.alcaldia_nombre);
  });
  return Array.from(set);
});

const participantesFiltrados = computed(() => {
  return participantes.value.filter(p => {
    // Filtro Estatus
    if (filtroEstado.value !== 'todos') {
      if (p.status_ensayo !== parseInt(filtroEstado.value, 10)) return false;
    }
    // Filtro Categoría
    if (filtroCategoria.value !== 'todas') {
      if (p.categoria_nombre !== filtroCategoria.value) return false;
    }
    // Filtro Alcaldía
    if (filtroAlcaldia.value !== 'todas') {
      if (p.alcaldia_nombre !== filtroAlcaldia.value) return false;
    }
    // Buscador por Texto
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchFolio = p.folio && p.folio.toLowerCase().includes(q);
      const matchNombre = `${p.nombre} ${p.apellido_pat} ${p.apellido_mat}`.toLowerCase().includes(q);
      const matchCorreo = p.correo && p.correo.toLowerCase().includes(q);
      const matchCurp = p.curp && p.curp.toLowerCase().includes(q);
      const matchTitulo = p.titulo_ensayo && p.titulo_ensayo.toLowerCase().includes(q);
      const matchSeudonimo = p.seudonimo && p.seudonimo.toLowerCase().includes(q);

      if (!matchFolio && !matchNombre && !matchCorreo && !matchCurp && !matchTitulo && !matchSeudonimo) {
        return false;
      }
    }
    return true;
  });
});

const hayFiltrosActivos = computed(() => {
  return searchQuery.value !== '' || filtroEstado.value !== 'todos' || filtroCategoria.value !== 'todas' || filtroAlcaldia.value !== 'todas';
});

const limpiarFiltros = () => {
  searchQuery.value = '';
  filtroEstado.value = 'todos';
  filtroCategoria.value = 'todas';
  filtroAlcaldia.value = 'todas';
};

// Modal de Dictamen y Validación
const modalVisible = ref(false);
const partSeleccionadoModal = ref(null);
const archivosModal = ref([]);
const archivosAdicionalesFiltrados = computed(() => {
  return archivosModal.value.filter(a => 
    !a.nombre_requisito || (
      !a.nombre_requisito.toLowerCase().includes('ensayo') &&
      !a.nombre_requisito.toLowerCase().includes('obra')
    )
  );
});
const cargandoArchivosModal = ref(false);
const dictamenEstatus = ref('1');
const dictamenObservaciones = ref('');
const guardandoDictamen = ref(false);

// Estadísticas computadas
const totalRegistrados = computed(() => participantes.value.length);
const totalValidados = computed(() => participantes.value.filter(p => p.status_ensayo === 1).length);
const totalPendientes = computed(() => participantes.value.filter(p => p.status_ensayo === 0).length);
const totalObservados = computed(() => participantes.value.filter(p => p.status_ensayo === 2).length);

onMounted(async () => {
  await cargarParticipantes();
});

const cargarParticipantes = async () => {
  cargando.value = true;
  try {
    const res = await api.get('/admin/participantes');
    participantes.value = res.data;
  } catch (err) {
    console.error('Error al cargar participantes:', err.message);
  } finally {
    cargando.value = false;
  }
};

const obtenerArchivoEnsayoPrincipal = (part) => {
  if (!part) return null;
  const reqEnsayo = archivosModal.value.find(a => 
    a.nombre_requisito && (
      a.nombre_requisito.toLowerCase().includes('ensayo') || 
      a.nombre_requisito.toLowerCase().includes('obra')
    )
  );
  if (reqEnsayo && reqEnsayo.nombre_guardado) {
    return reqEnsayo.nombre_guardado;
  }
  return part.archivo_ensayo || null;
};

const abrirModalDictamen = async (part) => {
  partSeleccionadoModal.value = part;
  dictamenEstatus.value = part.status_ensayo === 2 ? '2' : '1';
  dictamenObservaciones.value = part.observaciones || '';
  archivosModal.value = [];
  cargandoArchivosModal.value = true;
  modalVisible.value = true;

  try {
    const res = await api.get(`/admin/participante-archivos/${part.id_participante}`);
    archivosModal.value = res.data;
  } catch (err) {
    console.error('Error al cargar archivos adicionales:', err.message);
  } finally {
    cargandoArchivosModal.value = false;
  }
};

const cerrarModalDictamen = () => {
  modalVisible.value = false;
  partSeleccionadoModal.value = null;
  archivosModal.value = [];
  dictamenObservaciones.value = '';
};

const guardarDictamen = async () => {
  if (!partSeleccionadoModal.value) return;

  if (dictamenEstatus.value === '2' && (!dictamenObservaciones.value || !dictamenObservaciones.value.trim())) {
    Swal.fire({
      icon: 'warning',
      title: 'Observaciones requeridas',
      text: 'Por favor captura las observaciones explicando el motivo por el cual el ensayo fue marcado como incorrecto.',
      confirmButtonColor: '#f43f5e',
      background: '#0f172a',
      color: '#fff'
    });
    return;
  }

  guardandoDictamen.value = true;
  try {
    if (dictamenEstatus.value === '1') {
      const res = await api.post(`/admin/validar/${partSeleccionadoModal.value.id_participante}`);
      Swal.fire({
        icon: 'success',
        title: '¡Ensayo Validado!',
        html: `El ensayo fue marcado como <strong>Correcto</strong> y se le asignó el folio oficial <strong class="text-emerald-400 font-mono text-lg">${res.data.folio}</strong>.<br><small class="text-slate-400">Se ha enviado un correo electrónico de confirmación al participante con su folio y acuse.</small>`,
        confirmButtonColor: '#10b981',
        background: '#0f172a',
        color: '#fff'
      });
    } else {
      await api.post(`/admin/observaciones/${partSeleccionadoModal.value.id_participante}`, {
        observaciones: dictamenObservaciones.value.trim()
      });
      Swal.fire({
        icon: 'info',
        title: 'Ensayo Marcado con Observaciones',
        html: `El ensayo fue marcado como <strong>Incorrecto</strong>.<br><small class="text-slate-400">Se ha enviado un correo electrónico al participante notificándole las observaciones para que vuelva a subir su documento.</small>`,
        confirmButtonColor: '#10b981',
        background: '#0f172a',
        color: '#fff'
      });
    }
    cerrarModalDictamen();
    await cargarParticipantes();
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error al procesar el dictamen',
      text: err.response?.data?.error || 'Ocurrió un error inesperado al guardar.',
      confirmButtonColor: '#f43f5e',
      background: '#0f172a',
      color: '#fff'
    });
  } finally {
    guardandoDictamen.value = false;
  }
};

const exportarReporteExcel = async () => {
  exportando.value = true;
  try {
    const response = await api.get('/admin/reportes/excel', {
      responseType: 'blob'
    });
    
    // Crear el link de descarga nativo del navegador
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `Reporte_General_Ensayo_2027_${Date.now()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(link.href);
    
    Swal.fire({
      icon: 'success',
      title: 'Excel Exportado',
      text: 'El reporte de Excel se generó y descargó con éxito.',
      confirmButtonColor: '#10b981',
      background: '#0f172a',
      color: '#fff'
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error al exportar',
      text: 'Ocurrió un error al intentar generar el archivo Excel.',
      confirmButtonColor: '#f43f5e',
      background: '#0f172a',
      color: '#fff'
    });
  } finally {
    exportando.value = false;
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
</script>

<style scoped>
.glass-card {
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
</style>
