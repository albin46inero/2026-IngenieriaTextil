import axiosInstance from "./axiosConfig";

const ID = import.meta.env.VITE_ID_INSTITUCION;

// 🔧 Solo agregamos .catch() para logging, sin cambiar la estructura
export const getPrincipal = () =>
  axiosInstance.get(`institucionesPrincipal/${ID}`)
    .catch(error => {
      console.error('❌ Error en getPrincipal:', error.message);
      throw error; // Re-lanzamos para que AppWrapper lo maneje
    });

export const getContenido = () =>
  axiosInstance.get(`institucion/${ID}/contenido`)
    .catch(error => {
      console.error('❌ Error en getContenido:', error.message);
      throw error;
    });

export const getRecursos = () =>
  axiosInstance.get(`institucion/${ID}/recursos`)
    .catch(error => {
      console.error('❌ Error en getRecursos:', error.message);
      throw error;
    });

export const getGacetaEventos = () =>
  axiosInstance.get(`institucion/${ID}/gacetaEventos`)
    .catch(error => {
      console.error('❌ Error en getGacetaEventos:', error.message);
      throw error;
    });