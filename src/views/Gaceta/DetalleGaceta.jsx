import { useState, useEffect } from "react";
import { useParams, Link, useOutletContext } from "react-router";
import { motion } from "motion/react";
import { 
  ArrowLeft, Calendar, FileText, 
  Download, ExternalLink, AlertCircle,
  Sparkles, Eye, Clock, BookOpen,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// ─── WORKER LOCAL ─────────────────────────────────────────────────────────────
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// ─── DECORADOR FLOTANTE ───────────────────────────────────────────────────────
const FloatingDecorator = ({ src, size, x, y, delay, duration = 12, rotate = true, color = null }) => {
  const getColorFilter = (color) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `brightness(0) saturate(100%) invert(${Math.round((1 - r/255) * 100)}%) sepia(100%) hue-rotate(${Math.round(Math.atan2(b, r) * 180 / Math.PI)}deg) saturate(500%)`;
  };

  return (
    <motion.img
      src={src}
      alt="decorador"
      className="absolute pointer-events-none z-0"
      style={{ width: size, height: "auto", left: x, top: y, filter: color ? getColorFilter(color) : "none" }}
      animate={{ y: [0, -25, 0], rotate: rotate ? [0, 360] : 0, scale: [1, 1.05, 1] }}
      transition={{
        y: { duration, delay, repeat: Infinity, ease: "easeInOut" },
        rotate: rotate ? { duration: 20, delay, repeat: Infinity, ease: "linear" } : {},
        scale: { duration: duration / 2, delay, repeat: Infinity, ease: "easeInOut" },
      }}
    />
  );
};

// ─── FORMATEAR FECHA ──────────────────────────────────────────────────────────
function formatFecha(fecha) {
  if (!fecha) return "";
  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const d = new Date(fecha);
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

// ─── VISOR PDF COMPLETO LOCAL ─────────────────────────────────────────────────
/**
 * PdfViewer — muestra el PDF completo renderizado localmente con react-pdf.
 *
 * CAMBIO DE SEGURIDAD (Hallazgo 1):
 *   Se eliminó el iframe de Google Docs Viewer. El PDF se renderiza en el
 *   navegador sin enviar la URL a servidores externos de Google.
 *
 * Modos:
 *   - "paginas"  → navega página por página (por defecto)
 *   - "continuo" → muestra todas las páginas apiladas
 */
const PdfViewer = ({ documentUrl, title, primaryColor, secondaryColor }) => {
  const [numPages, setNumPages]     = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode]     = useState("paginas"); // "paginas" | "continuo"
  const [status, setStatus]         = useState("loading"); // loading | success | error
  const [containerWidth, setContainerWidth] = useState(800);

  // Ajustar ancho al contenedor real
  useEffect(() => {
    const updateWidth = () => {
      const el = document.getElementById("pdf-container");
      if (el) setContainerWidth(el.clientWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setStatus("success");
  };

  const goToPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToNext = () => setCurrentPage((p) => Math.min(numPages, p + 1));

  return (
    <div className="space-y-4">

      {/* ── Barra de controles ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {/* Modo página / continuo */}
          <button
            onClick={() => setViewMode("paginas")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              viewMode === "paginas" ? "text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={viewMode === "paginas" ? { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` } : {}}
          >
            <Eye size={14} className="inline mr-2" />
            Por páginas
          </button>
          <button
            onClick={() => setViewMode("continuo")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              viewMode === "continuo" ? "text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={viewMode === "continuo" ? { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` } : {}}
          >
            <BookOpen size={14} className="inline mr-2" />
            Continuo
          </button>
          <a
            href={documentUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <ExternalLink size={14} className="inline mr-2" />
            Nueva ventana
          </a>
        </div>

        <a
          href={documentUrl}
          download
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: "white" }}
        >
          <Download size={14} />
          Descargar PDF
        </a>
      </div>

      {/* ── Contenedor del visor ── */}
      <div
        id="pdf-container"
        className="relative bg-gray-100 rounded-2xl overflow-auto shadow-2xl flex flex-col items-center py-6 gap-4"
        style={{ minHeight: "70vh", maxHeight: viewMode === "continuo" ? "none" : "75vh" }}
      >
        {/* Estado: cargando */}
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: `${primaryColor} transparent transparent transparent` }}
              />
              <p className="text-sm text-gray-500">Cargando documento…</p>
            </div>
          </div>
        )}

        {/* Estado: error */}
        {status === "error" && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <AlertCircle size={48} className="text-red-400" />
            <p className="text-gray-500 text-sm">No se pudo cargar el documento.</p>
            <a
              href={documentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: "white" }}
            >
              <ExternalLink size={14} />
              Abrir directamente
            </a>
          </div>
        )}

        {/* ✅ Renderizado local con react-pdf — sin Google Docs Viewer */}
        <Document
          file={documentUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={() => setStatus("error")}
          loading={null}   // el spinner lo manejamos arriba
          className={status === "error" ? "hidden" : "flex flex-col items-center gap-4"}
        >
          {viewMode === "paginas" ? (
            // ── Modo página única ──
            <Page
              pageNumber={currentPage}
              width={Math.min(containerWidth - 48, 900)}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-xl rounded-lg overflow-hidden"
            />
          ) : (
            // ── Modo continuo: todas las páginas ──
            numPages &&
            Array.from({ length: numPages }, (_, i) => (
              <Page
                key={i + 1}
                pageNumber={i + 1}
                width={Math.min(containerWidth - 48, 900)}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-xl rounded-lg overflow-hidden"
              />
            ))
          )}
        </Document>
      </div>

      {/* ── Navegación paginada ── */}
      {viewMode === "paginas" && numPages && status === "success" && (
        <div className="flex items-center justify-center gap-4 mt-2">
          <button
            onClick={goToPrev}
            disabled={currentPage <= 1}
            className="p-2 rounded-lg border transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105"
            style={{ borderColor: `${primaryColor}40`, color: primaryColor }}
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-sm font-medium text-gray-600 min-w-[100px] text-center">
            Página{" "}
            <span className="font-bold" style={{ color: primaryColor }}>{currentPage}</span>
            {" "}de{" "}
            <span className="font-bold">{numPages}</span>
          </span>

          <button
            onClick={goToNext}
            disabled={currentPage >= numPages}
            className="p-2 rounded-lg border transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105"
            style={{ borderColor: `${primaryColor}40`, color: primaryColor }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Indicador modo continuo */}
      {viewMode === "continuo" && numPages && status === "success" && (
        <p className="text-center text-xs text-gray-400 mt-1">
          {numPages} {numPages === 1 ? "página" : "páginas"} en total
        </p>
      )}
    </div>
  );
};

// ─── VISTA PRINCIPAL ──────────────────────────────────────────────────────────
export default function DetalleGaceta() {
  const { id } = useParams();
  const { gaceta, loading, institucion } = useOutletContext();
  const [item, setItem]         = useState(null);
  const [notFound, setNotFound] = useState(false);

  const descripcion    = institucion?.Descripcion || institucion;
  const colors         = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor   = colors.color_primario   || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  useEffect(() => {
    if (!gaceta) return;
    const found = gaceta.find((g) => g.gaceta_id === parseInt(id));
    if (found) setItem(found);
    else setNotFound(true);
  }, [gaceta, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-4 border-t-transparent"
          style={{ borderColor: `${primaryColor} transparent transparent transparent` }}
        />
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No encontrado</h2>
          <p className="text-gray-500 mb-6">El documento que buscas no existe</p>
          <Link
            to="/gaceta"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ backgroundColor: `${primaryColor}10`, color: primaryColor, border: `1px solid ${primaryColor}20` }}
          >
            <ArrowLeft size={16} />
            Volver a la gaceta
          </Link>
        </div>
      </div>
    );
  }

  const isNew = new Date(item.gaceta_fecha) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">

    
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* Botón volver */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="mb-6">
          <Link
            to="/gaceta"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:translate-x-[-4px]"
            style={{ color: primaryColor }}
          >
            <ArrowLeft size={16} />
            Volver a la gaceta
          </Link>
        </motion.div>

        {/* Info del documento */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-md"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: "white" }}
            >
              <FileText size={12} />
              GACETA UNIVERSITARIA
            </span>
            {isNew && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-green-500 text-white shadow-md">
                <Sparkles size={12} />
                NUEVO DOCUMENTO
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            {item.gaceta_titulo}
          </h1>

          <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                <Calendar size={16} style={{ color: primaryColor }} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Fecha de publicación</p>
                <p className="text-sm font-medium text-gray-700">{formatFecha(item.gaceta_fecha)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                <BookOpen size={16} style={{ color: primaryColor }} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Tipo de documento</p>
                <p className="text-sm font-medium text-gray-700">PDF - Gaceta Universitaria</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ✅ Visor PDF local completo */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <PdfViewer
            documentUrl={item.gaceta_documento}
            title={item.gaceta_titulo}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </motion.div>

        {/* Footer del documento */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={12} />
            <span>Documento oficial - Universidad Pública de El Alto</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}