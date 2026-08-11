<template>
  <div class="min-h-[100dvh] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-6 relative flex flex-col justify-between overflow-x-hidden font-sans">
    <!-- Círculo decorativo de fondo -->
    <div class="absolute top-10 right-10 w-96 h-96 bg-brand-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

    <div class="page-container max-w-7xl mx-auto w-full my-8 relative z-10 flex-grow">
      
      <!-- Encabezado de Superadmin -->
      <header class="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
        <div>
          <h1 class="text-3xl font-black text-white tracking-tight">Panel de Control del Superadmin</h1>
          <p class="text-slate-400 text-sm mt-1">Gestión operativa del sistema, convocatorias, sesiones en vivo y soporte</p>
        </div>
        <div class="flex items-center gap-4">
          <!-- Campana de Notificaciones -->
          <CampanaNotificaciones />

          <div class="text-right">
            <p class="text-sm font-bold text-white">{{ authStore.user?.nombre }}</p>
            <p class="text-xs text-brand-primary font-mono uppercase tracking-wider">Superadmin</p>
          </div>
          <button @click="logout" class="btn-tactile bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 font-semibold py-2 px-4 rounded-xl text-xs cursor-pointer">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <!-- PESTAÑAS DE NAVEGACIÓN -->
      <nav class="flex border-b border-white/5 gap-2 mb-8 bg-slate-900/40 p-1.5 rounded-2xl max-w-md">
        <button
          v-for="t in tabs"
          :key="t.id"
          @click="cambiarTab(t.id)"
          class="flex-1 text-center py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="tabActiva === t.id ? 'bg-brand-primary text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'"
        >
          {{ t.label }}
        </button>
      </nav>

      <!-- CONTENEDOR DE PESTAÑAS CON GSAP TRANSITION -->
      <div class="tab-content relative">
        
        <!-- PESTAÑA 1: CONVOCATORIAS Y CATEGORÍAS -->
        <div v-if="tabActiva === 'convocatorias'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Listado de Convocatorias -->
          <div class="lg:col-span-2 space-y-6">
            <div class="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-bold text-white">Ediciones / Convocatorias</h2>
                <button
                  @click="nuevaConvocatoria"
                  class="btn-tactile bg-brand-primary text-slate-950 font-bold py-2 px-4 rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Crear Convocatoria
                </button>
              </div>

              <!-- Listado de Convocatorias -->
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-white/5 text-slate-400 text-xs">
                      <th class="py-3 px-4 font-bold uppercase">Año</th>
                      <th class="py-3 px-4 font-bold uppercase">Nombre Concurso</th>
                      <th class="py-3 px-4 font-bold uppercase">Periodo de Registro</th>
                      <th class="py-3 px-4 font-bold uppercase">Estatus</th>
                      <th class="py-3 px-4 font-bold uppercase text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="conv in convocatorias"
                      :key="conv.id_convocatoria"
                      @click="seleccionarConvocatoria(conv)"
                      class="border-b border-white/5 hover:bg-white/2 cursor-pointer transition-colors duration-150"
                      :class="seleccionada?.id_convocatoria === conv.id_convocatoria ? 'bg-white/5 border-l-4 border-brand-primary' : ''"
                    >
                      <td class="py-4 px-4 text-sm font-mono text-brand-primary font-bold">{{ conv.anio }}</td>
                      <td class="py-4 px-4 text-sm font-bold text-white">{{ conv.nombre }}</td>
                      <td class="py-4 px-4 text-xs text-slate-300">
                        {{ formatFecha(conv.fecha_inicio) }} al {{ formatFecha(conv.fecha_fin) }}
                      </td>
                      <td class="py-4 px-4">
                        <span
                          class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                          :class="conv.status === 1 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700/20 text-slate-400 border border-white/5'"
                        >
                          {{ conv.status === 1 ? 'Activa' : 'Cerrada' }}
                        </span>
                      </td>
                      <td class="py-4 px-4 text-right">
                        <button
                          @click.stop="editarConvocatoria(conv)"
                          class="text-xs text-slate-400 hover:text-white font-semibold underline cursor-pointer"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Detalle de Categorías (se abre al hacer clic en una convocatoria) -->
            <div v-if="seleccionada" class="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
              <div class="flex justify-between items-center">
                <div>
                  <h2 class="text-lg font-bold text-white">Categorías de Convocatoria ({{ seleccionada.anio }})</h2>
                  <p class="text-xs text-slate-400">Configuración dinámica de límites de edad del concurso</p>
                </div>
                <button
                  @click="agregarFilaCategoria"
                  class="btn-tactile bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 font-bold py-2 px-3 rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
                >
                  Agregar Fila
                </button>
              </div>

              <!-- Listado de Categorías de la convocatoria -->
              <form @submit.prevent="guardarConfigCategorias" class="space-y-4">
                <div class="space-y-3">
                  <div
                    v-for="(cat, index) in categoriasForm"
                    :key="index"
                    class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-slate-950/40 p-4 rounded-xl border border-white/5"
                  >
                    <div class="space-y-1">
                      <label class="block text-[10px] font-bold text-slate-500 uppercase">Nombre Categoría</label>
                      <input
                        v-model="cat.nombre"
                        type="text"
                        required
                        placeholder="ej. Categoría A"
                        class="w-full bg-slate-900 border border-white/10 text-white rounded-lg py-1.5 px-3 outline-none text-xs"
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="block text-[10px] font-bold text-slate-500 uppercase">Edad Mínima</label>
                      <input
                        v-model.number="cat.edad_min"
                        type="number"
                        min="5"
                        max="35"
                        required
                        class="w-full bg-slate-900 border border-white/10 text-white rounded-lg py-1.5 px-3 outline-none text-xs"
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="block text-[10px] font-bold text-slate-500 uppercase">Edad Máxima</label>
                      <input
                        v-model.number="cat.edad_max"
                        type="number"
                        min="5"
                        max="35"
                        required
                        class="w-full bg-slate-900 border border-white/10 text-white rounded-lg py-1.5 px-3 outline-none text-xs"
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="block text-[10px] font-bold text-slate-500 uppercase">Estado</label>
                      <select
                        v-model.number="cat.status"
                        class="w-full bg-slate-900 border border-white/10 text-white rounded-lg py-1.5 px-3 outline-none text-xs"
                      >
                        <option :value="1">Activa</option>
                        <option :value="0">Inactiva</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    :disabled="guardandoCategorias"
                    class="btn-tactile bg-brand-primary text-slate-950 font-black py-2.5 px-6 rounded-xl text-xs cursor-pointer transition-all"
                  >
                    <span v-if="guardandoCategorias" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    <span v-else>Guardar Categorías</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Formulario Convocatoria (Sidebar / Form derecho) -->
          <div class="glass-card p-6 rounded-3xl border border-white/10 h-fit space-y-4">
            <h2 class="text-lg font-bold text-white">
              {{ formConvocatoria.id_convocatoria ? 'Editar Convocatoria' : 'Nueva Convocatoria' }}
            </h2>
            <form @submit.prevent="guardarConvocatoria" class="space-y-4 text-left">
              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold text-slate-400 uppercase">Año Concurso</label>
                <input
                  v-model.number="formConvocatoria.anio"
                  type="number"
                  required
                  placeholder="2027"
                  class="w-full bg-slate-950 border border-white/10 text-white rounded-xl py-2 px-3 outline-none text-xs font-mono"
                />
              </div>

              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold text-slate-400 uppercase">Nombre Concurso</label>
                <input
                  v-model="formConvocatoria.nombre"
                  type="text"
                  required
                  placeholder="ej. Concurso Juvenil de Ensayo 2027"
                  class="w-full bg-slate-950 border border-white/10 text-white rounded-xl py-2.5 px-4 outline-none text-xs"
                />
              </div>

              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold text-slate-400 uppercase">Fecha Inicio Registro</label>
                <input
                  v-model="formConvocatoria.fecha_inicio"
                  type="date"
                  required
                  class="w-full bg-slate-950 border border-white/10 text-white rounded-xl py-2 px-3 outline-none text-xs"
                />
              </div>

              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold text-slate-400 uppercase">Fecha Fin Registro</label>
                <input
                  v-model="formConvocatoria.fecha_fin"
                  type="date"
                  required
                  class="w-full bg-slate-950 border border-white/10 text-white rounded-xl py-2 px-3 outline-none text-xs"
                />
              </div>

              <!-- Periodo de Inicio de Sesión (Login) -->
              <div class="space-y-3 pt-3 border-t border-white/5 col-span-1 sm:col-span-2">
                <span class="block text-xs font-bold text-brand-primary uppercase tracking-wider">Periodo de Inicio de Sesión (Login)</span>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold text-slate-400 uppercase">Fecha Inicio Acceso (Opcional)</label>
                    <input
                      v-model="formConvocatoria.fecha_inicio_acceso"
                      type="date"
                      class="w-full bg-slate-950 border border-white/10 text-white rounded-xl py-2 px-3 outline-none text-xs"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold text-slate-400 uppercase">Fecha Fin Acceso (Opcional)</label>
                    <input
                      v-model="formConvocatoria.fecha_fin_acceso"
                      type="date"
                      class="w-full bg-slate-950 border border-white/10 text-white rounded-xl py-2 px-3 outline-none text-xs"
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/10'
                          : 'bg-slate-900/60 hover:bg-slate-900 border-white/5 text-slate-400 hover:text-slate-300'
                      ]"
                    >
                      <input type="checkbox" value="1" v-model="formConvocatoria.roles_restringidos_acceso" class="sr-only" />
                      <div class="flex items-center gap-2.5 min-w-0 pr-2">
                        <div 
                          class="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center transition-colors"
                          :class="[
                            formConvocatoria.roles_restringidos_acceso.includes('1') || formConvocatoria.roles_restringidos_acceso.includes(1)
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-white/5 text-slate-500'
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
                            : 'border-white/20 bg-transparent opacity-40'
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
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/10'
                          : 'bg-slate-900/60 hover:bg-slate-900 border-white/5 text-slate-400 hover:text-slate-300'
                      ]"
                    >
                      <input type="checkbox" value="3" v-model="formConvocatoria.roles_restringidos_acceso" class="sr-only" />
                      <div class="flex items-center gap-2.5 min-w-0 pr-2">
                        <div 
                          class="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center transition-colors"
                          :class="[
                            formConvocatoria.roles_restringidos_acceso.includes('3') || formConvocatoria.roles_restringidos_acceso.includes(3)
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-white/5 text-slate-500'
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
                            : 'border-white/20 bg-transparent opacity-40'
                        ]"
                      >
                        <svg v-if="formConvocatoria.roles_restringidos_acceso.includes('3') || formConvocatoria.roles_restringidos_acceso.includes(3)" class="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </label>

                    <!-- Card 3: Admins (Protegido / Exento) -->
                    <div
                      class="relative flex items-center justify-between p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 cursor-not-allowed select-none"
                      title="Administradores siempre tienen acceso garantizado a la plataforma por razones operativas"
                    >
                      <div class="flex items-center gap-2.5 min-w-0 pr-2">
                        <div class="w-7 h-7 rounded-lg shrink-0 bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div class="min-w-0">
                          <span class="block text-xs font-bold leading-none truncate">Administradores</span>
                          <span class="block text-[9px] text-emerald-400/70 font-mono mt-0.5">Acceso siempre libre</span>
                        </div>
                      </div>
                      <span class="text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30 shrink-0">
                        Exento
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold text-slate-400 uppercase">Estado Convocatoria</label>
                <select
                  v-model.number="formConvocatoria.status"
                  class="w-full bg-slate-950 border border-white/10 text-white rounded-xl py-2 px-3 outline-none text-xs cursor-pointer"
                >
                  <option :value="1">Activa (Abrir Registro)</option>
                  <option :value="0">Cerrada / Concluida</option>
                </select>
              </div>

              <div class="flex gap-2 pt-4">
                <button
                  type="button"
                  @click="resetFormConvocatoria"
                  class="btn-tactile bg-slate-900 border border-white/10 text-slate-400 font-bold py-2 px-4 rounded-xl text-xs cursor-pointer flex-1 text-center"
                >
                  Limpiar
                </button>
                <button
                  type="submit"
                  :disabled="guardandoConvocatoria"
                  class="btn-tactile bg-brand-primary text-slate-950 font-black py-2 px-4 rounded-xl text-xs cursor-pointer flex-1 text-center transition-all"
                >
                  <span v-if="guardandoConvocatoria" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mx-auto"></span>
                  <span v-else>Guardar</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- PESTAÑA 2: SESIONES EN VIVO -->
        <div v-else-if="tabActiva === 'sesiones'" class="space-y-6">
          <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="glass-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider">Conexiones Activas</p>
                <h3 class="text-4xl font-black text-white mt-2 font-mono">{{ conectadoList.length }}</h3>
              </div>
              <div class="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 relative">
                <span class="absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75 top-3 right-3 animate-ping"></span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            <div class="glass-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider">Conexión Base de Datos</p>
                <h3 class="text-lg font-bold text-white mt-2 font-mono">SQL Server Active</h3>
                <p class="text-emerald-400 text-[10px] mt-0.5">Pool de Conexión Seguro (Knex)</p>
              </div>
              <div class="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
            </div>

            <div class="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
              <p class="text-slate-400 text-xs font-bold uppercase tracking-wider">Cierre de Sesiones Global</p>
              <button
                @click="expulsarTodos"
                class="btn-tactile bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2 transition-all w-full text-center"
              >
                Cerrar Todas las Sesiones Activas
              </button>
            </div>
          </section>

          <!-- Tabla de Sesiones Activas -->
          <div class="glass-card rounded-3xl border border-white/10 overflow-hidden">
            <div class="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 class="text-lg font-bold text-white">Conexiones en Vivo</h2>
              <span class="text-xs text-slate-500 font-mono">Sincronizado vía WebSockets</span>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-950/60 border-b border-white/5 text-slate-400 text-xs">
                    <th class="py-4 px-6 font-bold uppercase">Usuario</th>
                    <th class="py-4 px-6 font-bold uppercase">Nombre Completo</th>
                    <th class="py-4 px-6 font-bold uppercase">Rol</th>
                    <th class="py-4 px-6 font-bold uppercase">IP de Conexión</th>
                    <th class="py-4 px-6 font-bold uppercase">Hora Conexión</th>
                    <th class="py-4 px-6 font-bold uppercase text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="s in conectadoList"
                    :key="s.id_usuario"
                    class="border-b border-white/5 hover:bg-white/2"
                  >
                    <td class="py-4 px-6">
                      <div class="font-bold text-white text-sm">{{ s.usuario }}</div>
                      <div class="text-slate-500 text-xs mt-0.5 font-mono">{{ s.correo }}</div>
                    </td>
                    <td class="py-4 px-6 text-sm text-slate-300">{{ s.nombre_completo }}</td>
                    <td class="py-4 px-6">
                      <span :class="badgeRolClass(s.id_tipousuario)">
                        {{ getRolText(s.id_tipousuario) }}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-xs font-mono text-slate-400">{{ formatIpAddress(s.ip) }}</td>
                    <td class="py-4 px-6 text-xs font-mono text-slate-400">{{ formatTimeOnly(s.connectedAt) }}</td>
                    <td class="py-4 px-6 text-right">
                      <button
                        v-if="s.id_usuario !== authStore.user?.id_usuario"
                        @click="expulsarUsuario(s)"
                        class="btn-tactile text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold py-1.5 px-3 rounded-lg cursor-pointer transition-all"
                      >
                        Expulsar
                      </button>
                      <span v-else class="text-xs text-slate-500 italic pr-4 font-bold">Tú</span>
                    </td>
                  </tr>
                  <tr v-if="conectadoList.length === 0">
                    <td colspan="6" class="py-12 text-center text-slate-500 italic text-sm">
                      No hay conexiones de sockets activas en este momento.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- PESTAÑA 3: IMPERSONACIÓN DE PARTICIPANTES -->
        <div v-else-if="tabActiva === 'impersonar'" class="space-y-6">
          <div class="glass-card p-6 rounded-3xl border border-white/10 space-y-6">
            <div>
              <h2 class="text-lg font-bold text-white">Soporte Técnico por Impersonación</h2>
              <p class="text-xs text-slate-400 mt-0.5">Permite iniciar sesión como un participante para resolver problemas de captura bajo estricta auditoría dual.</p>
            </div>

            <!-- Buscador -->
            <div class="max-w-md relative">
              <input
                v-model="busquedaImpersonar"
                type="text"
                placeholder="Buscar por Seudónimo, Folio o Usuario..."
                class="w-full bg-slate-900 border border-white/10 focus:border-brand-primary/50 text-white rounded-xl py-2.5 pl-10 pr-4 outline-none text-xs transition-colors"
              />
              <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Tabla de Participantes a Impersonar -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-white/5 text-slate-400 text-xs">
                    <th class="py-3 px-4 font-bold uppercase">Folio</th>
                    <th class="py-3 px-4 font-bold uppercase">Seudónimo</th>
                    <th class="py-3 px-4 font-bold uppercase">Nombre del Participante</th>
                    <th class="py-3 px-4 font-bold uppercase">Usuario</th>
                    <th class="py-3 px-4 font-bold uppercase text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="part in participantesFiltrados"
                    :key="part.id_participante"
                    class="border-b border-white/5 hover:bg-white/2"
                  >
                    <td class="py-4 px-4 text-xs font-mono font-bold text-brand-primary">
                      {{ part.folio || 'PENDIENTE' }}
                    </td>
                    <td class="py-4 px-4 text-sm text-white font-bold">{{ part.seudonimo || '(Sin Registrar)' }}</td>
                    <td class="py-4 px-4 text-sm text-slate-300">
                      {{ part.nombre }} {{ part.apellido_pat }} {{ part.apellido_mat }}
                    </td>
                    <td class="py-4 px-4 text-xs font-mono text-slate-400">{{ part.usuario }}</td>
                    <td class="py-4 px-4 text-right">
                      <button
                        @click="solicitarImpersonacion(part)"
                        class="btn-tactile bg-brand-primary/10 hover:bg-brand-primary/25 border border-brand-primary/25 text-brand-primary font-bold py-1.5 px-3 rounded-lg text-xs cursor-pointer transition-all"
                      >
                        Suplantar Cuenta
                      </button>
                    </td>
                  </tr>
                  <tr v-if="participantesFiltrados.length === 0">
                    <td colspan="5" class="py-12 text-center text-slate-500 italic text-sm">
                      No se encontraron participantes que coincidan con la búsqueda.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Pie de página -->
    <footer class="mt-8 text-center text-[10px] text-slate-550 border-t border-white/5 pt-4">
      Instituto Electoral de la Ciudad de México &copy; 2027 • Panel de Control de Superadministración
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { useSesionesStore } from '../../stores/sesiones.store';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import api from '../../services/api';
import { gsap } from 'gsap';
import CampanaNotificaciones from '../../components/CampanaNotificaciones.vue';

const authStore = useAuthStore();
const sesionesStore = useSesionesStore();
const router = useRouter();

const tabActiva = ref('convocatorias');
const convocatorias = ref([]);
const seleccionada = ref(null);
const categoriasForm = ref([]);
const conectadoList = ref([]);

const guardandoConvocatoria = ref(false);
const guardandoCategorias = ref(false);

const busquedaImpersonar = ref('');
const listParticipantes = ref([]);

const tabs = [
  { id: 'convocatorias', label: 'Convocatorias & Edades' },
  { id: 'sesiones', label: 'Conexiones en Vivo' },
  { id: 'impersonar', label: 'Suplantar Cuenta' }
];

const formConvocatoria = reactive({
  id_convocatoria: null,
  anio: 2026,
  nombre: '',
  fecha_inicio: '',
  fecha_fin: '',
  fecha_inicio_acceso: '',
  fecha_fin_acceso: '',
  roles_restringidos_acceso: ['1'],
  status: 1
});

onMounted(async () => {
  await cargarConvocatorias();
  await cargarParticipantes();
  
  // Sockets para sesiones en tiempo real
  sesionesStore.conectarSocket();
  if (sesionesStore.socket) {
    sesionesStore.socket.on('sesiones_actualizadas', (list) => {
      conectadoList.value = list;
    });
  }
  // Carga inicial de sesiones por API
  await consultarSesionesHttp();
});

const cambiarTab = (tabId) => {
  tabActiva.value = tabId;
  
  // Animación suave de cambio de pestaña
  setTimeout(() => {
    gsap.fromTo('.tab-content',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );
  }, 50);
};

// ---------------------------------------------------------------------------
// Operaciones Convocatorias
// ---------------------------------------------------------------------------

const cargarConvocatorias = async () => {
  try {
    const res = await api.get('/superadmin/convocatorias');
    convocatorias.value = res.data;
    if (res.data.length > 0) {
      // Seleccionar por defecto la primera activa o la más reciente
      const activa = res.data.find(c => c.status === 1) || res.data[0];
      seleccionarConvocatoria(activa);
    }
  } catch (err) {
    console.error('Error al cargar convocatorias:', err.message);
  }
};

const seleccionarConvocatoria = async (conv) => {
  seleccionada.value = conv;
  try {
    const res = await api.get(`/superadmin/categorias/${conv.id_convocatoria}`);
    categoriasForm.value = res.data;
  } catch (err) {
    console.error('Error al cargar categorías:', err.message);
  }
};

const editarConvocatoria = (conv) => {
  formConvocatoria.id_convocatoria = conv.id_convocatoria;
  formConvocatoria.anio = conv.anio;
  formConvocatoria.nombre = conv.nombre;
  // Formatear fechas para input type="date"
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
    Swal.fire({
      icon: 'success',
      title: 'Convocatoria guardada',
      text: 'Se han registrado los cambios de forma segura.',
      confirmButtonColor: '#10b981'
    });
    resetFormConvocatoria();
    await cargarConvocatorias();
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error al guardar',
      text: err.response?.data?.error || 'No se pudo guardar la convocatoria.',
      confirmButtonColor: '#f43f5e'
    });
  } finally {
    guardandoConvocatoria.value = false;
  }
};

const nuevaConvocatoria = () => {
  resetFormConvocatoria();
  Swal.fire({
    title: 'Nueva Convocatoria',
    text: 'Rellena el formulario de la columna derecha para registrar un nuevo concurso.',
    icon: 'info',
    confirmButtonColor: '#10b981'
  });
};

// ---------------------------------------------------------------------------
// Operaciones Categorías
// ---------------------------------------------------------------------------

const agregarFilaCategoria = () => {
  categoriasForm.value.push({
    id_categoria: null,
    nombre: '',
    edad_min: 15,
    edad_max: 18,
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
      title: 'Categorías actualizadas',
      text: 'Se actualizaron las categorías y rangos de edad con éxito.',
      confirmButtonColor: '#10b981'
    });
    await seleccionarConvocatoria(seleccionada.value);
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error al guardar',
      text: err.response?.data?.error || 'No se pudo guardar los límites de edad.',
      confirmButtonColor: '#f43f5e'
    });
  } finally {
    guardandoCategorias.value = false;
  }
};

// ---------------------------------------------------------------------------
// Operaciones Sesiones WebSocket
// ---------------------------------------------------------------------------

const consultarSesionesHttp = async () => {
  try {
    const res = await api.get('/superadmin/sesiones');
    conectadoList.value = res.data;
  } catch (err) {
    console.error('Error al consultar sesiones:', err.message);
  }
};

const expulsarUsuario = (s) => {
  Swal.fire({
    title: '¿Expulsar conexión?',
    text: `Se cerrará inmediatamente la sesión de ${s.nombre_completo}.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f43f5e',
    cancelButtonColor: '#475569',
    confirmButtonText: 'Sí, forzar salida',
    cancelButtonText: 'Cancelar',
    background: '#0f172a',
    color: '#f8fafc'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api.post('/superadmin/sesiones/kick', { id_usuario: s.id_usuario });
        await consultarSesionesHttp();
      } catch (err) {
        console.error(err.message);
      }
    }
  });
};

const expulsarTodos = () => {
  Swal.fire({
    title: '¿Forzar salida global?',
    text: 'Esta acción cerrará la sesión de todos los usuarios conectados en este momento.',
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#f43f5e',
    cancelButtonColor: '#475569',
    confirmButtonText: 'Cerrar todo',
    cancelButtonText: 'Cancelar',
    background: '#0f172a',
    color: '#f8fafc'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api.post('/superadmin/sesiones/kick-all');
        await consultarSesionesHttp();
      } catch (err) {
        console.error(err.message);
      }
    }
  });
};

// Impersonación
const cargarParticipantes = async () => {
  try {
    // Reutilizamos el listado de participantes de la convocatoria activa
    const res = await api.get('/admin/participantes');
    listParticipantes.value = res.data;
  } catch (err) {
    console.error('Error al cargar participantes para soporte:', err.message);
  }
};

const participantesFiltrados = computed(() => {
  const q = busquedaImpersonar.value.trim().toLowerCase();
  if (!q) return listParticipantes.value;
  return listParticipantes.value.filter(p => {
    return (
      (p.seudonimo && p.seudonimo.toLowerCase().includes(q)) ||
      (p.folio && p.folio.toLowerCase().includes(q)) ||
      (p.usuario && p.usuario.toLowerCase().includes(q)) ||
      (p.nombre && p.nombre.toLowerCase().includes(q)) ||
      (p.apellido_pat && p.apellido_pat.toLowerCase().includes(q))
    );
  });
});

const solicitarImpersonacion = (part) => {
  Swal.fire({
    title: 'Iniciar Suplantación de Cuenta',
    text: `Se iniciará sesión de soporte como el participante "${part.seudonimo || part.usuario}". Por favor redacta el motivo formal de esta acción para auditoría:`,
    input: 'text',
    inputPlaceholder: 'ej. Soporte para corregir datos del tutor...',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#475569',
    confirmButtonText: 'Iniciar Soporte',
    cancelButtonText: 'Cancelar',
    background: '#0f172a',
    color: '#f8fafc',
    inputValidator: (value) => {
      if (!value) {
        return '¡Debes escribir un motivo de soporte!';
      }
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await api.post('/superadmin/impersonar/iniciar', {
          id_usuario_target: part.id_usuario,
          motivo: result.value
        });
        const { token, usuario } = res.data;

        // Iniciar impersonación en el Pinia authStore
        authStore.iniciarImpersonacion(token, usuario);

        Swal.fire({
          icon: 'success',
          title: 'Sesión iniciada',
          text: `Te has conectado como ${part.seudonimo || part.usuario}. Redireccionando...`,
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          router.push('/participante/dashboard');
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error de suplantación',
          text: err.response?.data?.error || 'No se pudo suplantar la sesión.',
          confirmButtonColor: '#f43f5e'
        });
      }
    }
  });
};

// Helpers de formato
const formatFecha = (f) => {
  if (!f) return '';
  return new Date(f).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatTimeOnly = (t) => {
  if (!t) return 'N/A';
  return new Date(t).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const formatIpAddress = (ip) => {
  if (!ip) return 'N/A';
  if (ip === '::1' || ip === '127.0.0.1') return 'Local (127.0.0.1)';
  return ip.replace('::ffff:', '');
};

const getRolText = (rolId) => {
  if (rolId === 1) return 'Participante';
  if (rolId === 2) return 'Admin';
  if (rolId === 3) return 'Juez';
  if (rolId === 4) return 'Superadmin';
  return 'Usuario';
};

const badgeRolClass = (rolId) => {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ';
  if (rolId === 1) return base + 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
  if (rolId === 2) return base + 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
  if (rolId === 3) return base + 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
  if (rolId === 4) return base + 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  return base + 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
};

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
/* Glassmorphism custom styles */
.glass-card {
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
</style>
