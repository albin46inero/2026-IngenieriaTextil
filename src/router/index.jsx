import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";

import AppWrapper from "../pages/AppWrapper";
import Page404 from "../pages/404Page";
import ErrorNetwork from "../pages/ErrorNetwork";

// 🔥 Vistas con lazy loading (se cargan bajo demanda)
const HomeView = lazy(() => import("../views/HomeView"));
const AboutView = lazy(() => import("../views/AboutView"));
const ContactView = lazy(() => import("../views/ContactView"));

const ConvocatoriasView = lazy(() => import("../views/Convocatorias/ConvocatoriasView"));
const DetalleConvocatoria = lazy(() => import("../views/Convocatorias/DetalleConvocatoria"));

const CursosView = lazy(() => import("../views/Cursos/CursosView"));
const DetalleCurso = lazy(() => import("../views/Cursos/DetalleCurso"));

const EventosView = lazy(() => import("../views/Eventos/EventosView"));
const DetalleEvento = lazy(() => import("../views/Eventos/DetalleEvento"));

const GacetaView = lazy(() => import("../views/Gaceta/GacetaView"));
const DetalleGaceta = lazy(() => import("../views/Gaceta/DetalleGaceta"));

const OfertasView = lazy(() => import("../views/Ofertas/OfertasView"));
const DetalleOferta = lazy(() => import("../views/Ofertas/DetalleOferta"));

const PublicacionesView = lazy(() => import("../views/Publicaciones/PublicacionesView"));
const DetallePublicacion = lazy(() => import("../views/Publicaciones/DetallePublicacion"));

const ServiciosView = lazy(() => import("../views/Servicios/ServiciosView"));
const DetalleServicio = lazy(() => import("../views/Servicios/DetalleServicio"));

const VideosView = lazy(() => import("../views/Videos/VideosView"));
const DetalleVideo = lazy(() => import("../views/Videos/DetalleVideo"));

// Componente envoltorio para Suspense (se puede usar directamente en el router)
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppWrapper />,
    children: [
      { index: true, element: <SuspenseWrapper><HomeView /></SuspenseWrapper> },
      { path: "about", element: <SuspenseWrapper><AboutView /></SuspenseWrapper> },
      { path: "contacto", element: <SuspenseWrapper><ContactView /></SuspenseWrapper> },
      { path: "error-red", element: <ErrorNetwork /> }, // no necesita lazy

      {
        path: "convocatorias",
        element: <SuspenseWrapper><ConvocatoriasView tipo="CONVOCATORIAS" /></SuspenseWrapper>,
      },
      {
        path: "convocatorias/avisos",
        element: <SuspenseWrapper><ConvocatoriasView tipo="AVISOS" /></SuspenseWrapper>,
      },
      {
        path: "convocatorias/comunicados",
        element: <SuspenseWrapper><ConvocatoriasView tipo="COMUNICADOS" /></SuspenseWrapper>,
      },
      { path: "convocatorias/:id", element: <SuspenseWrapper><DetalleConvocatoria /></SuspenseWrapper> },

      { path: "cursos", element: <SuspenseWrapper><CursosView tipo="CURSOS" /></SuspenseWrapper> },
      { path: "cursos/seminarios", element: <SuspenseWrapper><CursosView tipo="SEMINARIOS" /></SuspenseWrapper> },
      { path: "cursos/:id", element: <SuspenseWrapper><DetalleCurso /></SuspenseWrapper> },
      
      { path: "eventos", element: <SuspenseWrapper><EventosView /></SuspenseWrapper> },
      { path: "eventos/:id", element: <SuspenseWrapper><DetalleEvento /></SuspenseWrapper> },

      { path: "gaceta", element: <SuspenseWrapper><GacetaView /></SuspenseWrapper> },
      { path: "gaceta/:id", element: <SuspenseWrapper><DetalleGaceta /></SuspenseWrapper> },

      { path: "ofertas", element: <SuspenseWrapper><OfertasView /></SuspenseWrapper> },
      { path: "ofertas/:id", element: <SuspenseWrapper><DetalleOferta /></SuspenseWrapper> },

      { path: "publicaciones", element: <SuspenseWrapper><PublicacionesView /></SuspenseWrapper> },
      { path: "publicaciones/:id", element: <SuspenseWrapper><DetallePublicacion /></SuspenseWrapper> },

      { path: "servicios", element: <SuspenseWrapper><ServiciosView /></SuspenseWrapper> },
      { path: "servicios/:id", element: <SuspenseWrapper><DetalleServicio /></SuspenseWrapper> },

      { path: "videos", element: <SuspenseWrapper><VideosView /></SuspenseWrapper> },
      { path: "videos/:id", element: <SuspenseWrapper><DetalleVideo /></SuspenseWrapper> },

      { path: "*", element: <Page404 /> },
    ],
  },
]);

export default router;