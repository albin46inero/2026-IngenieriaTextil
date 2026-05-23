import { useEffect, useState } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import HeaderPsicologia from "../components/HeaderPsicologia";
import FooterPsicologia from "../components/FooterPsicologia";
import {
  getPrincipal,
  getContenido,
  getRecursos,
  getGacetaEventos,
} from "../services/psicologiaService";

// ─── Favicon y título por defecto (antes de que responda la API) ───────────
const FAVICON_DEFAULT = "/logo/upeaLogo_1.ico";
const TITLE_DEFAULT   = "Psicología — UPEA";

// ─── Aplica favicon en el <head> ───────────────────────────────────────────
function setFavicon(href) {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = href;
}

// ─── Aplica variables CSS de colores en :root ──────────────────────────────
function applyColors(colores) {
  if (!colores) return;
  const root = document.documentElement;
  const p = colores.color_primario   || "#e68600";
  const s = colores.color_secundario || "#a75c06";
  const t = colores.color_terciario  || "#000000";

  root.style.setProperty("--color-primary",       p);
  root.style.setProperty("--color-secondary",     s);
  root.style.setProperty("--color-tertiary",      t);
  // Variantes de opacidad para efectos hover, sombras y glows
  root.style.setProperty("--color-primary-light", `${p}cc`);
  root.style.setProperty("--color-primary-dark",  `${p}99`);
  root.style.setProperty("--color-primary-glow",  `${p}40`);

  console.log("🎨 Colores aplicados:", { primary: p, secondary: s, tertiary: t });
}

export default function AppWrapper() {
  // ─── getPrincipal ──────────────────────────────────────────────────────
  const [institucion, setInstitucion] = useState(null);

  // ─── getContenido ──────────────────────────────────────────────────────
  const [portadas,    setPortadas]    = useState([]);
  const [autoridades, setAutoridades] = useState([]);
  const [ubicacion,   setUbicacion]   = useState(null);
  const [videos,      setVideos]      = useState([]);

  // ─── getRecursos ───────────────────────────────────────────────────────
  const [publicaciones, setPublicaciones] = useState([]);
  const [linksExternos, setLinksExternos] = useState([]);

  // ─── getGacetaEventos ──────────────────────────────────────────────────
  const [convocatorias, setConvocatorias] = useState([]);
  const [cursos,        setCursos]        = useState([]);
  const [eventos,       setEventos]       = useState([]);
  const [gaceta,        setGaceta]        = useState([]);
  const [ofertas,       setOfertas]       = useState([]);
  const [servicios,     setServicios]     = useState([]);

  // ─── Estado de carga ───────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);

  // ─── Favicon e título por defecto al montar ────────────────────────────
  useEffect(() => {
    setFavicon(FAVICON_DEFAULT);
    document.title = TITLE_DEFAULT;
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resPrincipal, resContenido, resRecursos, resGacetaEventos] =
          await Promise.all([
            getPrincipal(),
            getContenido(),
            getRecursos(),
            getGacetaEventos(),
          ]);

        // ── getPrincipal ──────────────────────────────────────────────
        const info = resPrincipal.data?.Descripcion;
        if (info) {
          setInstitucion(info);

          // 1. Colores dinámicos
          applyColors(info.colorinstitucion?.[0]);

          // 2. Favicon — si la API devuelve logo lo usamos, sino queda el default
          if (info.institucion_logo) {
            setFavicon(info.institucion_logo);
            console.log("🖼️ Favicon actualizado desde API:", info.institucion_logo);
          } else {
            console.log("🖼️ Favicon usando default:", FAVICON_DEFAULT);
          }

          // 3. Título de la pestaña
          if (info.institucion_nombre) {
            document.title = `${info.institucion_nombre} — UPEA`;
          }
        }

        // ── getContenido ──────────────────────────────────────────────
        const contenido = resContenido.data;
        setPortadas(contenido?.portada         || []);
        setAutoridades(contenido?.autoridad    || []);
        setUbicacion(contenido?.ubicacion?.[0] || null);
        setVideos(contenido?.upea_videos       || []);

        // ── getRecursos ───────────────────────────────────────────────
        const recursos = resRecursos.data;
        setPublicaciones(recursos?.upea_publicaciones  || []);
        setLinksExternos(recursos?.linksExternoInterno || []);

        // ── getGacetaEventos ──────────────────────────────────────────
        const ge = resGacetaEventos.data;
        setConvocatorias(ge?.convocatorias              || []);
        setCursos(ge?.cursos                            || []);
        setEventos(ge?.upea_evento                      || []);
        setGaceta(ge?.upea_gaceta_universitaria         || []);
        setOfertas(ge?.ofertasAcademicas                || []);
        setServicios(ge?.serviciosCarrera               || []);

      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
        // Favicon y colores por defecto ya están aplicados — no se rompe nada
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ─── Context para todas las vistas hijas via useOutletContext() ────────
  const context = {
    loading,
    institucion,
    portadas,
    autoridades,
    ubicacion,
    videos,
    publicaciones,
    linksExternos,
    convocatorias,
    cursos,
    eventos,
    gaceta,
    ofertas,
    servicios,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ScrollRestoration />
      <HeaderPsicologia institucion={institucion} loading={loading} />
      <main className="flex-1">
        <Outlet context={context} />
      </main>
      <FooterPsicologia institucion={institucion} loading={loading} />
    </div>
  );
}