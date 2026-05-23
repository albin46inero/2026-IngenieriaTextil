import { createBrowserRouter } from "react-router";

import AppWrapper from "../pages/AppWrapper";
import Page404 from "../pages/404Page";
import ErrorNetwork from "../pages/ErrorNetwork";

import HomeView from "../views/HomeView";
import AboutView from "../views/AboutView";
import ContactView from "../views/ContactView";

import ConvocatoriasView from "../views/Convocatorias/ConvocatoriasView";
import DetalleConvocatoria from "../views/Convocatorias/DetalleConvocatoria";

import CursosView from "../views/Cursos/CursosView";
import DetalleCurso from "../views/Cursos/DetalleCurso";

import EventosView from "../views/Eventos/EventosView";
import DetalleEvento from "../views/Eventos/DetalleEvento";

import GacetaView from "../views/Gaceta/GacetaView";
import DetalleGaceta from "../views/Gaceta/DetalleGaceta";

import OfertasView from "../views/Ofertas/OfertasView";
import DetalleOferta from "../views/Ofertas/DetalleOferta";

import PublicacionesView from "../views/Publicaciones/PublicacionesView";
import DetallePublicacion from "../views/Publicaciones/DetallePublicacion";

import ServiciosView from "../views/Servicios/ServiciosView";
import DetalleServicio from "../views/Servicios/DetalleServicio";

import VideosView from "../views/Videos/VideosView";
import DetalleVideo from "../views/Videos/DetalleVideo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppWrapper />,
    children: [
      { index: true, element: <HomeView /> },
      { path: "about", element: <AboutView /> },
      { path: "contacto", element: <ContactView /> },
      { path: "error-red", element: <ErrorNetwork /> },

      {
        path: "convocatorias",
        element: <ConvocatoriasView tipo="CONVOCATORIAS" />,
      },
      {
        path: "convocatorias/avisos",
        element: <ConvocatoriasView tipo="AVISOS" />,
      },
      {
        path: "convocatorias/comunicados",
        element: <ConvocatoriasView tipo="COMUNICADOS" />,
      },
      { path: "convocatorias/:id", element: <DetalleConvocatoria /> },

      // Cursos
      { path: "cursos", element: <CursosView tipo="CURSOS" /> },
      { path: "cursos/seminarios", element: <CursosView tipo="SEMINARIOS" /> },
      { path: "cursos/:id", element: <DetalleCurso /> },
      
      { path: "eventos", element: <EventosView /> },
      { path: "eventos/:id", element: <DetalleEvento /> },

      { path: "gaceta", element: <GacetaView /> },
      { path: "gaceta/:id", element: <DetalleGaceta /> },

      { path: "ofertas", element: <OfertasView /> },
      { path: "ofertas/:id", element: <DetalleOferta /> },

      { path: "publicaciones", element: <PublicacionesView /> },
      { path: "publicaciones/:id", element: <DetallePublicacion /> },

      { path: "servicios", element: <ServiciosView /> },
      { path: "servicios/:id", element: <DetalleServicio /> },

      { path: "videos", element: <VideosView /> },
      { path: "videos/:id", element: <DetalleVideo /> },

      { path: "*", element: <Page404 /> },
    ],
  },
]);

export default router;
