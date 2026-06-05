import axios from "axios";

// 🔧 CAMBIO 1: Timeout configurable desde .env o valor por defecto
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 15000; // 15 segundos por defecto

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_ROOT_API,
  // 🔧 CAMBIO 2: Agregar timeout a la configuración
  timeout: API_TIMEOUT,
  headers: {
    "Authorization": `Bearer ${import.meta.env.VITE_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// 🔧 CAMBIO 3: Interceptor de respuesta para manejo global de errores
axiosInstance.interceptors.response.use(
  // ✅ Respuesta exitosa: retornar tal cual
  (response) => response,
  
  // ❌ Error: manejar de forma segura
  (error) => {
    // Solo logging en desarrollo, sin romper la app
    if (import.meta.env.DEV) {
      if (error.response) {
        // El servidor respondió con estado 4xx/5xx
        console.warn(`⚠️ API Error ${error.response.status}:`, error.response.data);
      } else if (error.request) {
        // Petición enviada pero sin respuesta (red caída, timeout, etc.)
        console.warn('⚠️ Sin respuesta del servidor (timeout o red)');
      } else {
        // Error al configurar la petición
        console.warn('⚠️ Error de configuración:', error.message);
      }
    }
    
    // 🔧 IMPORTANTE: Re-lanzar el error para que los servicios lo manejen
    // Así AppWrapper.jsx puede usar fallback si es necesario
    return Promise.reject(error);
  }
);

export default axiosInstance;