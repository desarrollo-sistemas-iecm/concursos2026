<template>
  <div
    :class="[
      'min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500 font-sans relative overflow-hidden',
      publicTheme.isDark ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-800'
    ]"
  >
    <!-- Efectos Ambientales de Iluminación Neon -->
    <div
      :class="[
        'absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-opacity duration-700',
        publicTheme.isDark ? 'bg-[#8C65AA]/30' : 'bg-[#8C65AA]/15'
      ]"
    ></div>
    <div
      :class="[
        'absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-opacity duration-700',
        publicTheme.isDark ? 'bg-[#32215C]/40' : 'bg-[#32215C]/10'
      ]"
    ></div>

    <!-- Contenedor Principal de Cristal de Alta Fidelidad Estética -->
    <div
      :class="[
        'w-full max-w-lg rounded-3xl p-6 sm:p-10 border backdrop-blur-2xl shadow-2xl relative z-10 transition-all duration-500 space-y-6',
        publicTheme.isDark
          ? 'bg-[#111927]/90 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
          : 'bg-white/95 border-slate-200/80 shadow-[0_20px_40px_rgba(50,33,92,0.08)]'
      ]"
    >
      <!-- Botón para Volver al Login -->
      <div class="flex items-center justify-between">
        <router-link
          to="/login"
          :class="[
            'inline-flex items-center gap-2 text-xs font-bold transition-colors duration-300',
            publicTheme.isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-[#32215C]'
          ]"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Volver al inicio de sesión</span>
        </router-link>

        <!-- Toggle Modo Oscuro/Claro -->
        <button
          @click="publicTheme.toggleModo"
          :class="[
            'p-2 rounded-xl border transition-all duration-300 cursor-pointer',
            publicTheme.isDark ? 'bg-white/5 border-white/10 text-amber-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          ]"
        >
          <svg v-if="publicTheme.isDark" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>

      <!-- Encabezado con Isotipo del IECM -->
      <div class="text-center space-y-2">
        <div class="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-[#32215C]/40 to-[#8C65AA]/30 border border-[#8C65AA]/40 shadow-lg mb-2">
          <img :src="logowhite" alt="Logo IECM" class="h-10 w-auto object-contain filter drop-shadow-md" />
        </div>
        <h2
          :class="[
            'text-2xl sm:text-3xl font-black tracking-tight',
            publicTheme.isDark ? 'text-white' : 'text-[#32215C]'
          ]"
        >
          Restablecer Contraseña
        </h2>
        <p :class="['text-xs sm:text-sm font-medium', publicTheme.isDark ? 'text-slate-400' : 'text-slate-600']">
          Ingresa tu token de seguridad y tu nueva contraseña para recuperar el acceso a tu cuenta.
        </p>
      </div>

      <!-- Formulario de Restablecimiento -->
      <form @submit.prevent="procesarRestablecimiento" class="space-y-4 pt-2">
        
        <!-- Campo: Token / Código de Seguridad -->
        <div class="space-y-1.5">
          <label
            for="tokenInput"
            :class="[
              'block text-[11px] font-bold uppercase tracking-wider',
              publicTheme.isDark ? 'text-slate-400' : 'text-slate-600'
            ]"
          >
            Código o Token de Seguridad <span class="text-rose-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="token"
              type="text"
              id="tokenInput"
              required
              @blur="validarTokenBlur"
              placeholder="ej. A3F82C10"
              :class="[
                'w-full rounded-2xl py-3 px-4 outline-none text-xs sm:text-sm font-mono font-bold tracking-wider transition-all border',
                publicTheme.isDark
                  ? 'bg-slate-950/70 border-white/10 text-white focus:border-[#8C65AA] focus:ring-2 focus:ring-[#8C65AA]/30'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#32215C] focus:ring-2 focus:ring-[#32215C]/20'
              ]"
            />
            <button
              v-if="token"
              type="button"
              @click="verificarToken"
              class="absolute right-3 top-2.5 px-3 py-1 bg-[#8C65AA]/20 text-[#8C65AA] hover:bg-[#8C65AA]/40 font-bold text-[10px] rounded-lg border border-[#8C65AA]/40 transition-colors"
            >
              Verificar
            </button>
          </div>
        </div>

        <!-- Campo: Nueva Contraseña -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label
              for="nuevaContrasena"
              :class="[
                'block text-[11px] font-bold uppercase tracking-wider',
                publicTheme.isDark ? 'text-slate-400' : 'text-slate-600'
              ]"
            >
              Nueva Contraseña <span class="text-rose-500">*</span>
            </label>
            <span class="text-[10px] font-mono font-bold text-slate-400">
              {{ nuevaContrasena.length }}/10 caracteres
            </span>
          </div>
          <div class="relative">
            <input
              v-model="nuevaContrasena"
              :type="mostrarPassword ? 'text' : 'password'"
              id="nuevaContrasena"
              required
              maxlength="10"
              @blur="validarPassBlur"
              placeholder="••••••••"
              :class="[
                'w-full rounded-2xl py-3 px-4 pr-10 outline-none text-xs sm:text-sm transition-all border',
                publicTheme.isDark
                  ? 'bg-slate-950/70 border-white/10 text-white focus:border-[#8C65AA] focus:ring-2 focus:ring-[#8C65AA]/30'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#32215C] focus:ring-2 focus:ring-[#32215C]/20'
              ]"
            />
            <button
              type="button"
              @click="mostrarPassword = !mostrarPassword"
              class="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200"
            >
              <svg v-if="!mostrarPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            </button>
          </div>
          <p class="text-[10px] text-slate-400 leading-tight">
            Debe contener entre 8 y 10 caracteres e incluir al menos uno de los caracteres especiales permitidos: <code class="font-bold text-[#8C65AA] font-mono">. , ! -</code>
          </p>
        </div>

        <!-- Campo: Confirmar Nueva Contraseña -->
        <div class="space-y-1.5">
          <label
            for="confirmacion"
            :class="[
              'block text-[11px] font-bold uppercase tracking-wider',
              publicTheme.isDark ? 'text-slate-400' : 'text-slate-600'
            ]"
          >
            Confirmar Nueva Contraseña <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="confirmacion"
            :type="mostrarPassword ? 'text' : 'password'"
            id="confirmacion"
            required
            maxlength="10"
            @blur="validarConfirmPassBlur"
            placeholder="••••••••"
            :class="[
              'w-full rounded-2xl py-3 px-4 outline-none text-xs sm:text-sm transition-all border',
              publicTheme.isDark
                ? 'bg-slate-950/70 border-white/10 text-white focus:border-[#8C65AA] focus:ring-2 focus:ring-[#8C65AA]/30'
                : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#32215C] focus:ring-2 focus:ring-[#32215C]/20'
            ]"
          />
        </div>

        <!-- Botón de Envío -->
        <button
          type="submit"
          :disabled="procesando"
          :class="[
            'w-full py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-6',
            procesando
              ? 'bg-slate-600 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-[#32215C] via-[#4A3282] to-[#8C65AA] hover:brightness-110 active:scale-95 shadow-[0_0_25px_rgba(140,101,170,0.4)]'
          ]"
        >
          <svg v-if="procesando" class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ procesando ? 'Guardando...' : 'Restablecer y Guardar Contraseña' }}</span>
        </button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';
import Swal from 'sweetalert2';
import logowhite from '../assets/logos/logowhite.png';
import { usePublicThemeStore } from '../stores/publicTheme.store';

const route = useRoute();
const router = useRouter();
const publicTheme = usePublicThemeStore();

const token = ref('');
const nuevaContrasena = ref('');
const confirmacion = ref('');
const mostrarPassword = ref(false);
const procesando = ref(false);

onMounted(() => {
  document.body.classList.remove('swal2-shown', 'swal2-height-auto');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';

  if (route.query.token) {
    token.value = String(route.query.token).trim();
    verificarToken();
  }
});

const verificarToken = async () => {
  if (!token.value) return;
  try {
    await api.post('/auth/validar-token-recuperacion', { token: token.value });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Token Inválido',
      text: err.response?.data?.error || 'El token proporcionado ha expirado o no es válido.',
      confirmButtonColor: '#8C65AA'
    });
  }
};

const validarPassBlur = () => {
  if (!nuevaContrasena.value) return;
  if (nuevaContrasena.value.length < 8 || nuevaContrasena.value.length > 10) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: 'La contraseña debe tener entre 8 y 10 caracteres',
      showConfirmButton: false,
      timer: 3000
    });
    return;
  }
  const allowed = /^[a-zA-Z0-9.,!\-]+$/;
  if (!allowed.test(nuevaContrasena.value) || !/[.,!\-]/.test(nuevaContrasena.value)) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: 'La contraseña requiere al menos un especial (. , ! -)',
      showConfirmButton: false,
      timer: 3000
    });
  }
};

const validarConfirmPassBlur = () => {
  if (confirmacion.value && nuevaContrasena.value !== confirmacion.value) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Las contraseñas no coinciden',
      showConfirmButton: false,
      timer: 2500
    });
  }
};

const procesarRestablecimiento = async () => {
  if (!token.value || !nuevaContrasena.value || !confirmacion.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'Por favor completa todos los campos del formulario.',
      confirmButtonColor: '#8C65AA'
    });
    return;
  }

  if (nuevaContrasena.value !== confirmacion.value) {
    Swal.fire({
      icon: 'error',
      title: 'Contraseñas desalineadas',
      text: 'La nueva contraseña y la confirmación no coinciden.',
      confirmButtonColor: '#8C65AA'
    });
    return;
  }

  try {
    procesando.value = true;
    const res = await api.post('/auth/restablecer-password', {
      token: token.value,
      nueva_contrasena: nuevaContrasena.value,
      confirmacion: confirmacion.value
    });

    await Swal.fire({
      icon: 'success',
      title: '¡Contraseña Restablecida!',
      text: res.data.mensaje || 'Tu contraseña ha sido actualizada exitosamente.',
      confirmButtonText: 'Ir a Iniciar Sesión',
      confirmButtonColor: '#8C65AA'
    });

    router.push('/login');
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error al restablecer',
      text: err.response?.data?.error || 'No se pudo actualizar la contraseña.',
      confirmButtonColor: '#8C65AA'
    });
  } finally {
    procesando.value = false;
  }
};
</script>
