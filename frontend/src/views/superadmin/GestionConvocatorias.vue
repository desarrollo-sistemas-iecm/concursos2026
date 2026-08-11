<template>
  <div class="space-y-6">
      <div class="border-b border-slate-200 dark:border-white/5 pb-4">
        <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Convocatorias & Categorías</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Configuración de concursos, periodos de registro y límites de edad</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Listado de Convocatorias -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white/80 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 backdrop-blur-xl transition-colors shadow-sm">
            <div class="flex justify-between items-center">
              <h2 class="text-base font-bold text-slate-900 dark:text-white">Ediciones de Convocatoria</h2>
              <button
                @click="resetFormConvocatoria"
                class="btn-tactile bg-brand-primary text-slate-950 font-black py-2 px-3 rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                + Nueva Convocatoria
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 text-xs font-mono uppercase">
                    <th class="py-3 px-4 font-bold">Año</th>
                    <th class="py-3 px-4 font-bold">Nombre Concurso</th>
                    <th class="py-3 px-4 font-bold">Periodo</th>
                    <th class="py-3 px-4 font-bold">Estado</th>
                    <th class="py-3 px-4 font-bold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                  <tr
                    v-for="conv in convocatorias"
                    :key="conv.id_convocatoria"
                    @click="seleccionarConvocatoria(conv)"
                    class="hover:bg-slate-50 dark:hover:bg-white/2 cursor-pointer transition-colors"
                    :class="seleccionada?.id_convocatoria === conv.id_convocatoria ? 'bg-slate-100/80 dark:bg-white/5 border-l-4 border-brand-primary' : ''"
                  >
                    <td class="py-4 px-4 font-mono font-bold text-brand-primary">{{ conv.anio }}</td>
                    <td class="py-4 px-4 font-bold text-slate-900 dark:text-white">{{ conv.nombre }}</td>
                    <td class="py-4 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                      {{ formatFecha(conv.fecha_inicio) }} al {{ formatFecha(conv.fecha_fin) }}
                    </td>
                    <td class="py-4 px-4">
                      <span
                        class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                        :class="conv.status === 1 ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20' : 'bg-slate-100 dark:bg-slate-700/20 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5'"
                      >
                        {{ conv.status === 1 ? 'Activa' : 'Cerrada' }}
                      </span>
                    </td>
                    <td class="py-4 px-4 text-right">
                      <button
                        @click.stop="editarConvocatoria(conv)"
                        class="text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold underline cursor-pointer"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Detalle de Categorías (al seleccionar convocatoria) -->
          <div v-if="seleccionada" class="bg-white/80 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 backdrop-blur-xl transition-colors shadow-sm">
            <div class="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-3">
              <div>
                <h2 class="text-base font-bold text-slate-900 dark:text-white">Categorías de Convocatoria ({{ seleccionada.anio }})</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400">Configuración dinámica de límites de edad del concurso</p>
              </div>
              <button
                @click="agregarFilaCategoria"
                class="btn-tactile bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold py-2 px-3 rounded-xl text-xs cursor-pointer"
              >
                + Agregar Categoria
              </button>
            </div>

            <form @submit.prevent="guardarConfigCategorias" class="space-y-4">
              <div class="space-y-3">
                <div
                  v-for="(cat, index) in categoriasForm"
                  :key="index"
                  class="grid grid-cols-1 md:grid-cols-5 gap-3 items-center bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-white/5"
                >
                  <div class="space-y-1">
                    <label class="block text-[10px] font-bold text-slate-500 uppercase">Nombre Categoría</label>
                    <input
                      v-model="cat.nombre"
                      type="text"
                      required
                      placeholder="ej. Categoría 1"
                      class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-1.5 px-3 outline-none text-xs"
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="block text-[10px] font-bold text-slate-500 uppercase">Edad Mínima</label>
                    <input
                      v-model.number="cat.edad_min"
                      type="number"
                      min="5"
                      max="40"
                      required
                      class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-1.5 px-3 outline-none text-xs"
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="block text-[10px] font-bold text-slate-500 uppercase">Edad Máxima</label>
                    <input
                      v-model.number="cat.edad_max"
                      type="number"
                      min="5"
                      max="40"
                      required
                      class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-1.5 px-3 outline-none text-xs"
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="block text-[10px] font-bold text-slate-500 uppercase">Estado</label>
                    <select
                      v-model.number="cat.status"
                      class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-1.5 px-3 outline-none text-xs"
                    >
                      <option :value="1">Activa</option>
                      <option :value="0">Inactiva</option>
                    </select>
                  </div>
                  <div class="flex items-end justify-end">
                    <button
                      type="button"
                      @click="eliminarFilaCategoria(index)"
                      class="text-xs text-rose-500 hover:text-rose-400 font-bold p-2 cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex justify-end pt-2">
                <button
                  type="submit"
                  :disabled="guardandoCategorias"
                  class="btn-tactile bg-brand-primary text-slate-950 font-black py-2.5 px-6 rounded-xl text-xs cursor-pointer shadow-md"
                >
                  <span v-if="guardandoCategorias" class="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mx-auto"></span>
                  <span v-else>Guardar Categorías</span>
                </button>
              </div>
            </form>
          </div>

          <!-- DETALLE DE DOCUMENTOS / REQUISITOS DE ARCHIVOS -->
          <div v-if="seleccionada" class="bg-white/80 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 backdrop-blur-xl transition-colors shadow-sm">
            <div class="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-3">
              <div>
                <h2 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span>Documentos & Archivos Requeridos</span>
                  <span class="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-mono font-normal">({{ requisitosList.length }})</span>
                </h2>
                <p class="text-xs text-slate-500 dark:text-slate-400">Configura qué archivos o anexos deben subir los participantes</p>
              </div>
              <button
                @click="abrirModalNuevoRequisito"
                class="btn-tactile bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2 px-3 rounded-xl text-xs cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                + Agregar Documento
              </button>
            </div>

            <div v-if="requisitosList.length === 0" class="text-center py-6 text-slate-400 text-xs font-mono">
              No hay requisitos de documentos configurados.
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="req in requisitosList"
                :key="req.id_requisito"
                class="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-white/5 gap-3"
              >
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-bold text-slate-400">#{{ req.orden }}</span>
                    <span class="text-xs font-bold text-slate-900 dark:text-white">{{ req.nombre_requisito }}</span>
                    <span
                      class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                      :class="req.es_obligatorio ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'"
                    >
                      {{ req.es_obligatorio ? 'Obligatorio' : 'Opcional' }}
                    </span>
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {{ req.extensiones_permitidas }}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed" v-if="req.descripcion">
                    {{ req.descripcion }}
                  </p>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <button
                    @click="editarRequisito(req)"
                    class="text-xs text-slate-600 dark:text-slate-300 hover:text-white bg-slate-200 dark:bg-slate-800 px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    @click="toggleStatusRequisito(req)"
                    class="text-xs px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors"
                    :class="req.status === 1 ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'"
                  >
                    {{ req.status === 1 ? 'Deshabilitar' : 'Activar' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario Convocatoria -->
        <div class="bg-white/80 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-white/10 h-fit space-y-4 backdrop-blur-xl transition-colors shadow-sm">
          <h2 class="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/5 pb-2">
            {{ formConvocatoria.id_convocatoria ? 'Editar Convocatoria' : 'Nueva Convocatoria' }}
          </h2>
          <form @submit.prevent="guardarConvocatoria" class="space-y-3.5 text-left">
            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Año Concurso</label>
              <input
                v-model.number="formConvocatoria.anio"
                type="number"
                required
                placeholder="2026"
                class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-xs font-mono"
              />
            </div>

            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Nombre Oficial del Concurso</label>
              <input
                v-model="formConvocatoria.nombre"
                type="text"
                required
                placeholder="Concurso Juvenil de Ensayo 2026"
                class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-xs"
              />
            </div>

            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Lema / Subtítulo Central</label>
              <input
                v-model="formConvocatoria.lema"
                type="text"
                placeholder="Conversando con los clásicos"
                class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-xs"
              />
            </div>

            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Fecha Inicio Registro</label>
              <input
                v-model="formConvocatoria.fecha_inicio"
                type="date"
                required
                class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-xs"
              />
            </div>

            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Fecha Fin Registro</label>
              <input
                v-model="formConvocatoria.fecha_fin"
                type="date"
                required
                class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-xs"
              />
            </div>

            <!-- Sección de Periodo de Inicio de Sesión (Login) -->
            <div class="space-y-3 pt-3 border-t border-slate-200 dark:border-white/5">
              <span class="block text-xs font-bold text-brand-primary uppercase tracking-wider">Periodo de Inicio de Sesión (Login)</span>
              
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Fecha Inicio Acceso (Opcional)</label>
                <input
                  v-model="formConvocatoria.fecha_inicio_acceso"
                  type="date"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-xs"
                />
              </div>

              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Fecha Fin Acceso (Opcional)</label>
                <input
                  v-model="formConvocatoria.fecha_fin_acceso"
                  type="date"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-xs"
                />
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Roles Sujetos a Restricción de Acceso
                  </label>
                  <span class="text-[10px] text-slate-500 font-medium">Sujetos a fecha de login</span>
                </div>

                <div class="space-y-1.5">
                  <!-- Card 1: Participantes (Rol 1) -->
                  <label
                    class="relative flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 cursor-pointer select-none"
                    :class="[
                      formConvocatoria.roles_restringidos_acceso.includes('1') || formConvocatoria.roles_restringidos_acceso.includes(1)
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 dark:text-amber-300 shadow-sm shadow-amber-500/10'
                        : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900'
                    ]"
                  >
                    <input type="checkbox" value="1" v-model="formConvocatoria.roles_restringidos_acceso" class="sr-only" />
                    <div class="flex items-center gap-2.5 min-w-0 pr-2">
                      <div 
                        class="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center transition-colors"
                        :class="[
                          formConvocatoria.roles_restringidos_acceso.includes('1') || formConvocatoria.roles_restringidos_acceso.includes(1)
                            ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400'
                            : 'bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-slate-500'
                        ]"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div class="min-w-0">
                        <span class="block text-xs font-bold leading-none truncate">Participantes</span>
                        <span class="block text-[9px] opacity-75 font-mono mt-0.5">Rol 1 (Estudiantes)</span>
                      </div>
                    </div>
                    <div 
                      class="w-5 h-5 rounded-md border shrink-0 flex items-center justify-center transition-all"
                      :class="[
                        formConvocatoria.roles_restringidos_acceso.includes('1') || formConvocatoria.roles_restringidos_acceso.includes(1)
                          ? 'bg-amber-500 border-amber-400 text-slate-950 scale-100'
                          : 'border-slate-300 dark:border-white/20 bg-transparent opacity-40'
                      ]"
                    >
                      <svg v-if="formConvocatoria.roles_restringidos_acceso.includes('1') || formConvocatoria.roles_restringidos_acceso.includes(1)" class="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </label>

                  <!-- Card 2: Jueces (Rol 3) -->
                  <label
                    class="relative flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 cursor-pointer select-none"
                    :class="[
                      formConvocatoria.roles_restringidos_acceso.includes('3') || formConvocatoria.roles_restringidos_acceso.includes(3)
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 dark:text-amber-300 shadow-sm shadow-amber-500/10'
                        : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900'
                    ]"
                  >
                    <input type="checkbox" value="3" v-model="formConvocatoria.roles_restringidos_acceso" class="sr-only" />
                    <div class="flex items-center gap-2.5 min-w-0 pr-2">
                      <div 
                        class="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center transition-colors"
                        :class="[
                          formConvocatoria.roles_restringidos_acceso.includes('3') || formConvocatoria.roles_restringidos_acceso.includes(3)
                            ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400'
                            : 'bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-slate-500'
                        ]"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3 6l3 1m0 0l-3 9a5 5 0 006 0l-3-9e0m0 0l6 2m6-2l3 1m0 0l-3 9a5 5 0 006 0l-3-9e0m0 0l6 2M9 1a2 2 0 012 2v2H7V3a2 2 0 012-2zm0 18a2 2 0 012 2v2H7v-2a2 2 0 012-2z" />
                        </svg>
                      </div>
                      <div class="min-w-0">
                        <span class="block text-xs font-bold leading-none truncate">Jueces Evaluadores</span>
                        <span class="block text-[9px] opacity-75 font-mono mt-0.5">Rol 3 (Calificadores)</span>
                      </div>
                    </div>
                    <div 
                      class="w-5 h-5 rounded-md border shrink-0 flex items-center justify-center transition-all"
                      :class="[
                        formConvocatoria.roles_restringidos_acceso.includes('3') || formConvocatoria.roles_restringidos_acceso.includes(3)
                          ? 'bg-amber-500 border-amber-400 text-slate-950 scale-100'
                          : 'border-slate-300 dark:border-white/20 bg-transparent opacity-40'
                      ]"
                    >
                      <svg v-if="formConvocatoria.roles_restringidos_acceso.includes('3') || formConvocatoria.roles_restringidos_acceso.includes(3)" class="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </label>

                  <!-- Card 3: Admins (Protegido / Exento) -->
                  <div
                    class="relative flex items-center justify-between p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-not-allowed select-none"
                    title="Administradores siempre tienen acceso garantizado a la plataforma por razones operativas"
                  >
                    <div class="flex items-center gap-2.5 min-w-0 pr-2">
                      <div class="w-7 h-7 rounded-lg shrink-0 bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div class="min-w-0">
                        <span class="block text-xs font-bold leading-none truncate">Administradores</span>
                        <span class="block text-[9px] text-emerald-600/70 dark:text-emerald-400/70 font-mono mt-0.5">Acceso siempre libre</span>
                      </div>
                    </div>
                    <span class="text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30 shrink-0">
                      Exento
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Toggle de Convocatoria Activa -->
            <div class="space-y-2 pt-2 border-t border-slate-200 dark:border-white/5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-900 dark:text-white">Convocatoria Activa</span>
                <input
                  type="checkbox"
                  :checked="formConvocatoria.status === 1"
                  @change="toggleStatusConvocatoria"
                  class="w-4 h-4 cursor-pointer"
                />
              </div>
              <p class="text-[10px] text-amber-400 leading-tight font-mono bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                REGLA DE NEGOCIO: Al marcar una convocatoria como Activa (status = 1), se desactivarán automáticamente las demás convocatorias.
              </p>
            </div>

            <div class="flex gap-2 pt-3">
              <button
                type="button"
                @click="resetFormConvocatoria"
                class="btn-tactile bg-slate-950 border border-white/10 text-slate-400 font-bold py-2 px-3 rounded-xl text-xs flex-1 cursor-pointer"
              >
                Limpiar
              </button>
              <button
                type="submit"
                :disabled="guardandoConvocatoria"
                class="btn-tactile bg-brand-primary text-slate-950 font-black py-2 px-3 rounded-xl text-xs flex-1 cursor-pointer"
              >
                <span v-if="guardandoConvocatoria" class="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mx-auto"></span>
                <span v-else>Guardar</span>
              </button>
            </div>
          </form>
        </div>
      </div>

    <!-- MODAL AGREGAR / EDITAR REQUISITO DE DOCUMENTO -->
    <div
      v-if="modalRequisitoAbierto"
      class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-3">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            {{ formRequisito.id_requisito ? 'Editar Requisito de Archivo' : 'Nuevo Requisito de Archivo' }}
          </h3>
          <button @click="modalRequisitoAbierto = false" class="text-slate-400 hover:text-white text-lg font-bold">✕</button>
        </div>

        <form @submit.prevent="guardarRequisito" class="space-y-4">
          <div class="space-y-1">
            <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Nombre del Documento / Requisito</label>
            <input
              v-model="formRequisito.nombre_requisito"
              type="text"
              required
              placeholder="ej. Identificación Oficial / Credencial"
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-xs"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Descripción o Instrucciones</label>
            <textarea
              v-model="formRequisito.descripcion"
              rows="3"
              placeholder="Instrucciones específicas para el participante..."
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-xs resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Extensiones Permitidas</label>
              <select
                v-model="formRequisito.extensiones_permitidas"
                class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-xs"
              >
                <option value=".pdf">Únicamente PDF (.pdf) [Predeterminado]</option>
                <option value=".pdf,.jpg,.jpeg,.png">PDF e Imágenes (.pdf, .jpg, .png)</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Orden de Aparición</label>
              <input
                v-model.number="formRequisito.orden"
                type="number"
                min="1"
                required
                class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2 px-3 outline-none text-xs"
              />
            </div>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="chkObligatorio"
              v-model="formRequisito.es_obligatorio"
              class="w-4 h-4 cursor-pointer"
            />
            <label for="chkObligatorio" class="text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
              Documento Obligatorio para el Participante
            </label>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/5">
            <button
              type="button"
              @click="modalRequisitoAbierto = false"
              class="btn-tactile bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-2 px-4 rounded-xl text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="guardandoRequisito"
              class="btn-tactile bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2 px-6 rounded-xl text-xs cursor-pointer shadow-md"
            >
              <span v-if="guardandoRequisito" class="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mx-auto"></span>
              <span v-else>Guardar Requisito</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { useConvocatoriaStore } from '../../stores/convocatoria.store';

const convocatorias = ref([]);
const seleccionada = ref(null);
const categoriasForm = ref([]);
const guardandoConvocatoria = ref(false);
const guardandoCategorias = ref(false);

const formConvocatoria = reactive({
  id_convocatoria: null,
  anio: 2026,
  nombre: '',
  lema: 'Conversando con los clásicos',
  fecha_inicio: '',
  fecha_fin: '',
  fecha_inicio_acceso: '',
  fecha_fin_acceso: '',
  roles_restringidos_acceso: ['1'],
  status: 1
});

const cargarConvocatorias = async () => {
  try {
    const res = await api.get('/superadmin/convocatorias');
    convocatorias.value = res.data;
    if (res.data.length > 0) {
      const activa = res.data.find(c => c.status === 1) || res.data[0];
      seleccionarConvocatoria(activa);
    }
  } catch (err) {
    console.error('Error al cargar convocatorias:', err.message);
  }
};

onMounted(() => {
  cargarConvocatorias();
});

const seleccionarConvocatoria = async (conv) => {
  seleccionada.value = conv;
  try {
    const res = await api.get(`/superadmin/categorias/${conv.id_convocatoria}`);
    categoriasForm.value = res.data;
    await cargarRequisitos(conv.id_convocatoria);
  } catch (err) {
    console.error('Error al cargar categorías o requisitos:', err.message);
  }
};

const toggleStatusConvocatoria = (e) => {
  if (e.target.checked) {
    Swal.fire({
      title: '¿Activar esta convocatoria?',
      text: 'Recuerda que únicamente puede haber una convocatoria activa. Las demás serán desactivadas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Sí, activar',
      background: '#0f172a',
      color: '#fff'
    }).then((res) => {
      if (res.isConfirmed) {
        formConvocatoria.status = 1;
      } else {
        e.target.checked = false;
      }
    });
  } else {
    formConvocatoria.status = 0;
  }
};

const editarConvocatoria = (conv) => {
  formConvocatoria.id_convocatoria = conv.id_convocatoria;
  formConvocatoria.anio = conv.anio;
  formConvocatoria.nombre = conv.nombre;
  formConvocatoria.lema = conv.lema || 'Conversando con los clásicos';
  formConvocatoria.fecha_inicio = conv.fecha_inicio ? conv.fecha_inicio.substring(0, 10) : '';
  formConvocatoria.fecha_fin = conv.fecha_fin ? conv.fecha_fin.substring(0, 10) : '';
  formConvocatoria.fecha_inicio_acceso = conv.fecha_inicio_acceso ? conv.fecha_inicio_acceso.substring(0, 10) : '';
  formConvocatoria.fecha_fin_acceso = conv.fecha_fin_acceso ? conv.fecha_fin_acceso.substring(0, 10) : '';
  const rolesArr = conv.roles_restringidos_acceso
    ? String(conv.roles_restringidos_acceso).split(',').map(r => String(r.trim()))
    : ['1'];
  formConvocatoria.roles_restringidos_acceso = rolesArr;
  formConvocatoria.status = conv.status;
};

const resetFormConvocatoria = () => {
  formConvocatoria.id_convocatoria = null;
  formConvocatoria.anio = 2026;
  formConvocatoria.nombre = '';
  formConvocatoria.lema = 'Conversando con los clásicos';
  formConvocatoria.fecha_inicio = '';
  formConvocatoria.fecha_fin = '';
  formConvocatoria.fecha_inicio_acceso = '';
  formConvocatoria.fecha_fin_acceso = '';
  formConvocatoria.roles_restringidos_acceso = ['1'];
  formConvocatoria.status = 1;
};

const guardarConvocatoria = async () => {
  guardandoConvocatoria.value = true;
  try {
    await api.post('/superadmin/convocatorias', formConvocatoria);
    const convocatoriaStore = useConvocatoriaStore();
    await convocatoriaStore.cargarConvocatoriaActiva(true);
    
    Swal.fire({
      icon: 'success',
      title: 'Convocatoria guardada',
      text: 'Se registraron los cambios de forma segura.',
      confirmButtonColor: '#10b981'
    });
    resetFormConvocatoria();
    await cargarConvocatorias();
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.error || 'No se pudo guardar la convocatoria.',
      confirmButtonColor: '#f43f5e'
    });
  } finally {
    guardandoConvocatoria.value = false;
  }
};

const agregarFilaCategoria = () => {
  categoriasForm.value.push({
    id_categoria: null,
    nombre: '',
    edad_min: 15,
    edad_max: 17,
    status: 1
  });
};

const guardarConfigCategorias = async () => {
  guardandoCategorias.value = true;
  try {
    await api.post('/superadmin/categorias', {
      id_convocatoria: seleccionada.value.id_convocatoria,
      categorias: categoriasForm.value
    });
    Swal.fire({
      icon: 'success',
      title: 'Categorías guardadas',
      text: 'Los límites de edad han sido actualizados.',
      confirmButtonColor: '#10b981'
    });
    await seleccionarConvocatoria(seleccionada.value);
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.error || 'No se pudieron guardar las categorías.',
      confirmButtonColor: '#f43f5e'
    });
  } finally {
    guardandoCategorias.value = false;
  }
};

// --- LÓGICA DE REQUISITOS DE ARCHIVOS DINÁMICOS ---
const requisitosList = ref([]);
const modalRequisitoAbierto = ref(false);
const guardandoRequisito = ref(false);

const formRequisito = reactive({
  id_requisito: null,
  nombre_requisito: '',
  descripcion: '',
  extensiones_permitidas: '.pdf',
  es_obligatorio: true,
  orden: 1
});

const cargarRequisitos = async (id_convocatoria) => {
  try {
    const res = await api.get(`/superadmin/requisitos-archivos/${id_convocatoria}`);
    requisitosList.value = res.data;
  } catch (err) {
    console.error('Error al cargar requisitos de archivos:', err.message);
  }
};

const abrirModalNuevoRequisito = () => {
  formRequisito.id_requisito = null;
  formRequisito.nombre_requisito = '';
  formRequisito.descripcion = '';
  formRequisito.extensiones_permitidas = '.pdf';
  formRequisito.es_obligatorio = true;
  formRequisito.orden = requisitosList.value.length + 1;
  modalRequisitoAbierto.value = true;
};

const editarRequisito = (req) => {
  formRequisito.id_requisito = req.id_requisito;
  formRequisito.nombre_requisito = req.nombre_requisito;
  formRequisito.descripcion = req.descripcion || '';
  formRequisito.extensiones_permitidas = req.extensiones_permitidas || '.pdf';
  formRequisito.es_obligatorio = req.es_obligatorio === 1 || req.es_obligatorio === true;
  formRequisito.orden = req.orden || 1;
  modalRequisitoAbierto.value = true;
};

const guardarRequisito = async () => {
  if (!formRequisito.nombre_requisito.trim()) return;
  guardandoRequisito.value = true;
  try {
    await api.post('/superadmin/requisitos-archivos', {
      ...formRequisito,
      id_convocatoria: seleccionada.value.id_convocatoria
    });
    Swal.fire({
      icon: 'success',
      title: 'Requisito Guardado',
      text: 'El documento requerido fue configurado correctamente.',
      confirmButtonColor: '#10b981'
    });
    modalRequisitoAbierto.value = false;
    await cargarRequisitos(seleccionada.value.id_convocatoria);
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.error || 'No se pudo guardar el requisito.',
      confirmButtonColor: '#f43f5e'
    });
  } finally {
    guardandoRequisito.value = false;
  }
};

const toggleStatusRequisito = async (req) => {
  const nuevoStatus = req.status === 1 ? 0 : 1;
  const accion = nuevoStatus === 0 ? 'deshabilitar' : 'activar';

  const res = await Swal.fire({
    title: `¿Deseas ${accion} este requisito?`,
    text: nuevoStatus === 0 
      ? 'El documento se deshabilitará para nuevos participantes sin eliminar los archivos ya subidos en el historial.' 
      : 'El documento volverá a solicitarse en la plataforma.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: nuevoStatus === 0 ? '#f43f5e' : '#10b981',
    confirmButtonText: `Sí, ${accion}`
  });

  if (res.isConfirmed) {
    try {
      await api.patch(`/superadmin/requisitos-archivos/${req.id_requisito}/status`, { status: nuevoStatus });
      await cargarRequisitos(seleccionada.value.id_convocatoria);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || 'No se pudo cambiar el estado.', 'error');
    }
  }
};

const formatFecha = (f) => {
  if (!f) return '';
  return new Date(f).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
</script>
