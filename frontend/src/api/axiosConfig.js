import axios from 'axios';

// Configuración base de Axios
// Usa la variable de entorno VITE_API_URL, o si no existe, usa localhost por defecto
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autorización a todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta (como 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si hay un error 401, limpiamos el localStorage y redirigimos al login
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;