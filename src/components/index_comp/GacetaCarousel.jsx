import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { FileText, Calendar, Eye, Clock, Download, ChevronRight, Sparkles, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// ─── CONFIGURACIÓN DEL WORKER LOCAL (sin llamadas a CDN externo) ──────────────
// Copia el worker a /public al hacer build:
//   cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf.worker.min.mjs
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

/**
 * GacetaRecientes
 * Props:
 *   gaceta      {Array}   — upea_gaceta_universitaria de getGacetaEventos()
 *   loading     {boolean}
 *   institucion {object}  — para colores de la API
 *
 * CAMBIO DE SEGURIDAD (Hallazgo 1):
 *   Se eliminó el iframe de Google Docs Viewer. Los PDFs ahora se
 *   renderizan localmente con react-pdf / pdf.js, evitando:
 *     - Enviar URLs de documentos internos a servidores de Google.
 *     - Dependencia de disponibilidad/políticas externas.
 */

function formatFecha(fecha) {
  if (!fecha) return "";
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const d = new Date(fecha);
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

const getColorFilter = (color) => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `brightness(0) saturate(100%) invert(${Math.round((1 - r/255) * 100)}%) sepia(100%) hue-rotate(${Math.round(Math.atan2(b, r) * 180 / Math.PI)}deg) saturate(500%)`;
};

const FloatingDecorator = ({ src, size, x, y, delay, duration = 12, rotate = true, color = null }) => (
  <motion.img
    src={src}
    alt="decorador"
    className="absolute pointer-events-none z-0"
    style={{
      width: size,
      height: "auto",
      left: x,
      top: y,
      filter: color ? getColorFilter(color) : "none",
    }}
    animate={{
      y: [0, -25, 0],
      rotate: rotate ? [0, 360] : 0,
      scale: [1, 1.08, 1],
    }}
    transition={{
      y: { duration, delay, repeat: Infinity, ease: "easeInOut" },
      rotate: rotate ? { duration: 20, delay, repeat: Infinity, ease: "linear" } : {},
      scale: { duration: duration / 2, delay, repeat: Infinity, ease: "easeInOut" },
    }}
  />
);

// ─── VISOR PDF LOCAL ──────────────────────────────────────────────────────────
/**
 * PdfPreview
 * Renderiza la primera página del PDF directamente en el navegador
 * usando pdf.js. No realiza ninguna petición a servicios externos.
 *
 * Props:
 *   url         {string}  — URL pública del PDF (mismo dominio o CORS habilitado)
 *   primaryColor {string} — color para el estado de carga
 */
function PdfPreview({ url, primaryColor }) {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-white">
      {/* Estado error: muestra ícono amigable en lugar de pantalla en blanco */}
      {status === "error" && (
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <FileText size={36} style={{ color: primaryColor, opacity: 0.5 }} />
          <span className="text-xs text-gray-400">Vista previa no disponible</span>
        </div>
      )}

      <Document
        file={url}
        loading={
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              {[0, 0.15, 0.3].map((delay) => (
                <div
                  key={delay}
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: primaryColor, animationDelay: `${delay}s` }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">Cargando vista previa…</span>
          </div>
        }
        onLoadSuccess={() => setStatus("success")}
        onLoadError={() => setStatus("error")}
        // Oculta el Document completo si hubo error (ya mostramos el fallback arriba)
        className={status === "error" ? "hidden" : ""}
      >
        <Page
          pageNumber={1}
          height={220}
          renderTextLayer={false}    // no necesario para preview miniatura
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function GacetaRecientes({ gaceta = [], loading, institucion }) {
  const [visibleItems, setVisibleItems] = useState({});
  const observerRefs = useRef({});

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor   = colors.color_primario   || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  const documentosRecientes = [...gaceta]
    .sort((a, b) => new Date(b.gaceta_fecha) - new Date(a.gaceta_fecha))
    .slice(0, 3);

  // Intersection Observer para lazy-load del visor PDF
  useEffect(() => {
    if (documentosRecientes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-id");
          if (entry.isIntersecting && id) {
            setVisibleItems((prev) => ({ ...prev, [id]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    Object.values(observerRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [documentosRecientes]);

  // ── LOADING STATE ──
  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="w-64 h-8 bg-gray-100 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (documentosRecientes.length === 0) return null;

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">

     

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── ENCABEZADO ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 mb-4">
            <Sparkles size={14} style={{ color: primaryColor }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
              Gaceta Universitaria
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            Documentos Oficiales Recientes
          </h2>
          <div
            className="w-20 h-1 rounded-full mx-auto mt-4"
            style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
          />
          <p className="text-gray-500 mt-3 text-sm max-w-2xl mx-auto">
            Los documentos más recientes publicados en la gaceta universitaria
          </p>
        </motion.div>

        {/* ─── GRID DE CARDS ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {documentosRecientes.map((item, index) => (
            <motion.div
              key={item.gaceta_id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                {/* Barra superior */}
                <div
                  className="h-1.5 w-full"
                  style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
                />

                <div className="p-5 flex-1 flex flex-col">

                  {/* ── VISTA PREVIA PDF LOCAL (reemplaza Google Docs Viewer) ── */}
                  <Link to={`/gaceta/${item.gaceta_id}`} className="block mb-4">
                    <div
                      ref={(el) => (observerRefs.current[item.gaceta_id] = el)}
                      data-id={item.gaceta_id}
                      className="relative w-full h-[220px] rounded-xl overflow-hidden cursor-pointer group/preview"
                      style={{ backgroundColor: `${primaryColor}05` }}
                    >
                      {visibleItems[item.gaceta_id] ? (
                        <>
                          {/* ✅ VISOR LOCAL — sin Google Docs, sin fuga de URLs */}
                          <PdfPreview
                            url={item.gaceta_documento}
                            primaryColor={primaryColor}
                          />

                          {/* Overlay hover */}
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                              <ExternalLink size={14} className="text-white" />
                              <span className="text-xs text-white font-medium">Ver documento completo</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Placeholder hasta que el Intersection Observer active la carga */
                        <div className="flex flex-col items-center justify-center h-full gap-3">
                          <div className="flex items-center gap-1">
                            {[0, 0.15, 0.3].map((d) => (
                              <div
                                key={d}
                                className="w-2 h-2 rounded-full animate-bounce"
                                style={{ backgroundColor: primaryColor, animationDelay: `${d}s` }}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">Desplázate para ver vista previa</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Badge + fecha */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                    >
                      GACETA
                    </span>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Calendar size={12} />
                      <span className="text-xs">{formatFecha(item.gaceta_fecha)}</span>
                    </div>
                  </div>

                  {/* Título */}
                  <Link to={`/gaceta/${item.gaceta_id}`}>
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                      {item.gaceta_titulo}
                    </h3>
                  </Link>

                  {/* Metadatos */}
                  <div className="flex items-center gap-3 mt-2 mb-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Eye size={11} />
                      <span>Documento oficial</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    <div className="flex items-center gap-1">
                      <Clock size={11} />
                      <span>PDF</span>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="mt-auto flex items-center gap-2 pt-3">
                    <Link
                      to={`/gaceta/${item.gaceta_id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        color: "white",
                      }}
                    >
                      <span>Ver documento</span>
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    {item.gaceta_documento && (
                      <a
                        href={item.gaceta_documento}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border transition-all duration-300 hover:scale-105"
                        style={{ borderColor: `${primaryColor}30`, color: primaryColor }}
                        title="Descargar PDF"
                      >
                        <Download size={16} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>Universidad Pública de El Alto</span>
                    <span>#{String(index + 1).padStart(2, "0")}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ver todos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10 sm:mt-12"
        >
          <Link
            to="/gaceta"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group"
            style={{
              backgroundColor: `${primaryColor}10`,
              color: primaryColor,
              border: `1px solid ${primaryColor}20`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${primaryColor}10`;
              e.currentTarget.style.color = primaryColor;
            }}
          >
            <span>Ver todos los documentos de la gaceta</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}