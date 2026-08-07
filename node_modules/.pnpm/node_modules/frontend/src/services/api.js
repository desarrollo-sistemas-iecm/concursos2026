import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const basePath = import.meta.env.BASE_URL || '/';
  const cleanBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  return `${cleanBase}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para inyectar el token JWT en cada petición saliente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para interceptar respuestas de error (ej. 401 Sesión Reemplazada)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Limpiar datos locales de sesión
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Emitir evento global para que la app reaccione (desconectando el socket y redirigiendo)
      window.dispatchEvent(new CustomEvent('auth-invalidated', { 
        detail: error.response.data?.error || 'Tu sesión ha expirado.' 
      }));
    }
    return Promise.reject(error);
  }
);

export default api;
