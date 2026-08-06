import { createRouter as createVueRouter, createWebHistory as createVueWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

import Landing from '../views/Landing.vue';
import Login from '../views/Login.vue';
import Registro from '../views/Registro.vue';
import HomeFallback from '../views/HomeFallback.vue';
import Dashboard from '../views/participante/Dashboard.vue';
import AppLayout from '../components/AppLayout.vue';

import PanelValidacion from '../views/admin/PanelValidacion.vue';
import PanelEvaluacion from '../views/juez/PanelEvaluacion.vue';
import PerfilView from '../views/PerfilView.vue';

// Vistas del Superadmin
import GestionUsuarios from '../views/superadmin/GestionUsuarios.vue';
import GestionConvocatorias from '../views/superadmin/GestionConvocatorias.vue';
import GestionManifestaciones from '../views/superadmin/GestionManifestaciones.vue';
import CrearNotificacion from '../views/superadmin/CrearNotificacion.vue';
import Estadisticas from '../views/superadmin/Estadisticas.vue';
import Reporteria from '../views/superadmin/Reporteria.vue';
import GestionTema from '../views/superadmin/GestionTema.vue';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { publicOnly: true }
  },
  {
    path: '/registro',
    name: 'Registro',
    component: Login,
    meta: { publicOnly: true }
  },
  {
    path: '/restablecer-password',
    name: 'RestablecerPassword',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeFallback,
    meta: { requiresAuth: true }
  },

  // RUTAS OPERATIVAS ANIDADAS EN APPLAYOUT COMPARTIDO (PARTICIPANTE, SUPERADMIN, ADMIN, JUEZ)
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      // RUTA DE PERFIL DEDICADA COMPARTIDA (ACCESIBLE DESDE DROPDOWN DE USUARIO EN HEADER)
      {
        path: 'perfil',
        name: 'PerfilUsuario',
        component: PerfilView,
        meta: { requiresAuth: true }
      },

      // RUTA DEL PARTICIPANTE (ROL 1)
      {
        path: 'participante/dashboard',
        name: 'ParticipanteDashboard',
        component: Dashboard,
        meta: { roles: [1] }
      },

      // RUTAS SUPERADMIN (ROL 4)
      {
        path: 'superadmin/usuarios',
        name: 'GestionUsuarios',
        component: GestionUsuarios,
        meta: { roles: [4] }
      },
      {
        path: 'superadmin/convocatorias',
        name: 'GestionConvocatorias',
        component: GestionConvocatorias,
        meta: { roles: [4] }
      },
      {
        path: 'superadmin/manifestaciones',
        name: 'GestionManifestaciones',
        component: GestionManifestaciones,
        meta: { roles: [4] }
      },
      {
        path: 'superadmin/notificaciones',
        name: 'CrearNotificacion',
        component: CrearNotificacion,
        meta: { roles: [4] }
      },
      {
        path: 'superadmin/estadisticas',
        name: 'Estadisticas',
        component: Estadisticas,
        meta: { roles: [4] }
      },
      {
        path: 'superadmin/reporteria',
        name: 'SuperadminReporteria',
        component: Reporteria,
        meta: { roles: [4] }
      },
      {
        path: 'superadmin/tema',
        name: 'GestionTema',
        component: GestionTema,
        meta: { roles: [4] }
      },

      // RUTAS ADMIN NORMAL (ROL 2)
      {
        path: 'admin/validacion',
        name: 'PanelValidacion',
        component: PanelValidacion,
        meta: { roles: [2, 4] }
      },
      {
        path: 'admin/reporteria',
        name: 'AdminReporteria',
        component: Reporteria,
        meta: { roles: [2, 4] }
      },

      // RUTAS JUEZ (ROL 3)
      {
        path: 'juez/evaluacion',
        name: 'PanelEvaluacion',
        component: PanelEvaluacion,
        meta: { roles: [3] }
      }
    ]
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createVueRouter({
  history: createVueWebHistory(),
  routes
});

// Guardián de navegación para verificar la sesión y restringir rutas por rol
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.rol;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'Login' });
  }

  if (to.meta.publicOnly && isAuthenticated) {
    return next({ name: 'Home' });
  }

  // Verificar roles en meta del destino o de rutas anidadas
  const requiredRoles = to.meta.roles || to.matched.find(record => record.meta.roles)?.meta.roles;
  if (requiredRoles && !requiredRoles.includes(userRole)) {
    return next({ name: 'Home' });
  }

  next();
});

export default router;
