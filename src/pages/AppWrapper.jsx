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
const TITLE_DEFAULT   = "Ingeniería Textil — UPEA"; // ✅ Actualizado

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
  root.style.setProperty("--color-primary-light", `${p}cc`);
  root.style.setProperty("--color-primary-dark",  `${p}99`);
  root.style.setProperty("--color-primary-glow",  `${p}40`);

}

export default function AppWrapper() {
  const [institucion, setInstitucion] = useState(null);
  const [portadas,    setPortadas]    = useState([]);
  const [autoridades, setAutoridades] = useState([]);
  const [ubicacion,   setUbicacion]   = useState(null);
  const [videos,      setVideos]      = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [linksExternos, setLinksExternos] = useState([]);
  const [convocatorias, setConvocatorias] = useState([]);
  const [cursos,        setCursos]        = useState([]);
  const [eventos,       setEventos]       = useState([]);
  const [gaceta,        setGaceta]        = useState([]);
  const [ofertas,       setOfertas]       = useState([]);
  const [servicios,     setServicios]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFavicon(FAVICON_DEFAULT);
    document.title = TITLE_DEFAULT;
  }, []);

  // ✅ HALLAZGO 1 SOLUCIONADO: AbortController para cancelar peticiones
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchAll = async () => {
      try {
        const [resPrincipal, resContenido, resRecursos, resGacetaEventos] =
          await Promise.all([
            getPrincipal(),
            getContenido(),
            getRecursos(),
            getGacetaEventos(),
          ]);

        // Verificar si el componente sigue montado antes de actualizar
        if (!abortController.signal.aborted) {
          const info = resPrincipal.data?.Descripcion;
          if (info) {
            setInstitucion(info);
            applyColors(info.colorinstitucion?.[0]);

            if (info.institucion_nombre) {
              document.title = `${info.institucion_nombre} — UPEA`;
            }
          }

          const contenido = resContenido.data;
          setPortadas(contenido?.portada         || []);
          setAutoridades(contenido?.autoridad    || []);
          setUbicacion(contenido?.ubicacion?.[0] || null);
          setVideos(contenido?.upea_videos       || []);

          const recursos = resRecursos.data;
          setPublicaciones(recursos?.upea_publicaciones  || []);
          setLinksExternos(recursos?.linksExternoInterno || []);

          const ge = resGacetaEventos.data;
          setConvocatorias(ge?.convocatorias              || []);
          setCursos(ge?.cursos                            || []);
          setEventos(ge?.upea_evento                      || []);
          setGaceta(ge?.upea_gaceta_universitaria         || []);
          setOfertas(ge?.ofertasAcademicas                || []);
          setServicios(ge?.serviciosCarrera               || []);
        }

      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("❌ Error al cargar datos:", error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchAll();
    
    // Función de limpieza - cancela peticiones al desmontar
    return () => {
      abortController.abort();
    };
  }, []);

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