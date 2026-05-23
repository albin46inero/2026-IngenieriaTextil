import axiosInstance from "./axiosConfig";

const ID = import.meta.env.VITE_ID_INSTITUCION;

export const getPrincipal = () =>
  axiosInstance.get(`institucionesPrincipal/${ID}`);

export const getContenido = () =>
  axiosInstance.get(`institucion/${ID}/contenido`);

export const getRecursos = () =>
  axiosInstance.get(`institucion/${ID}/recursos`);

export const getGacetaEventos = () =>
  axiosInstance.get(`institucion/${ID}/gacetaEventos`);