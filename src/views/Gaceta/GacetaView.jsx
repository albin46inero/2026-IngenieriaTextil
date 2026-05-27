import { useState, useEffect, useRef } from "react";
import { useOutletContext, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, Sparkles, ChevronRight, ChevronLeft, ChevronDown,
  FileText, Eye, Download, ExternalLink,
  Clock, BookOpen, AlertCircle, Search
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// ─── WORKER LOCAL (sin CDN externo) ──────────────────────────────────────────
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// ─── FONDO OSCURO CON DEGRADADO Y HUMO ──────────────────────────────────────
function DarkSmokeBackground({ primaryColor, secondaryColor }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Degradado base oscuro con colores institucionales */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at top, ${primaryColor}15 0%, transparent 50%),
            radial-gradient(ellipse at bottom right, ${secondaryColor}20 0%, transparent 50%),
            linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)
          `
        }}
      />

      {/* Humo 1 - Arriba izquierda */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${primaryColor}25 0%, transparent 70%)`,
          top: "-20%",
          left: "-10%"
        }}
        animate={{
          x: [0, 40, 0, -40, 0],
          y: [0, -30, 0, 30, 0],
          scale: [1, 1.15, 1, 1.1, 1],
          opacity: [0.2, 0.35, 0.2, 0.3, 0.2]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Humo 2 - Abajo derecha */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${secondaryColor}30 0%, transparent 70%)`,
          bottom: "-15%",
          right: "-5%"
        }}
        animate={{
          x: [0, -35, 0, 35, 0],
          y: [0, 40, 0, -40, 0],
          scale: [1, 1.2, 1, 1.1, 1],
          opacity: [0.15, 0.3, 0.15, 0.25, 0.15]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Partículas decorativas */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: i % 2 === 0 ? primaryColor : secondaryColor,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0.15
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5
          }}
        />
      ))}
    </div>
  );
}

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
      className="absolute pointer-events-none z-20"
      style={{ 
        width: size, 
        height: 'auto', 
        left: x, 
        top: y,
        filter: color ? getColorFilter(color) : 'none'
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
};

// ─── FORMATEAR FECHA ──────────────────────────────────────────────────────────
function formatFecha(fecha) {
  if (!fecha) return "";
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const d = new Date(fecha);
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

// ─── VISOR PDF LOCAL (con estilo oscuro) ──────────────────────────────────────
const PdfPreview = ({ documentUrl, primaryColor }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState("idle");
  const previewRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "100px", threshold: 0.1 }
    );
    if (previewRef.current) observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, []);

  if (!isVisible) {
    return (
      <div
        ref={previewRef}
        className="relative w-full h-[220px] rounded-xl overflow-hidden flex items-center justify-center bg-black/20 border border-white/10"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            {[0, 0.15, 0.3].map((d) => (
              <div
                key={d}
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ backgroundColor: primaryColor, animationDelay: `${d}s` }}
              />
            ))}
          </div>
          <span className="text-xs text-white/50">Desplázate para ver vista previa</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[220px] rounded-xl overflow-hidden bg-black/20 border border-white/10 flex items-center justify-center">
      {status === "error" && (
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <FileText size={36} style={{ color: primaryColor, opacity: 0.4 }} />
          <span className="text-xs text-white/50">Vista previa no disponible</span>
        </div>
      )}

      <Document
        file={documentUrl}
        loading={
          <div className="flex flex-col items-center justify-center gap-2">
            <div
              className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: `${primaryColor} transparent transparent transparent` }}
            />
            <span className="text-xs text-white/50">Cargando vista previa…</span>
          </div>
        }
        onLoadSuccess={() => setStatus("success")}
        onLoadError={() => setStatus("error")}
        className={status === "error" ? "hidden" : ""}
      >
        <Page
          pageNumber={1}
          height={220}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>

      {/* Overlay decorativo */}
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
          <ExternalLink size={14} className="text-white" />
          <span className="text-xs text-white font-medium">Vista previa del documento</span>
        </div>
      </div>
    </div>
  );
};

// ─── HERO CON PORTADA PANTALLA COMPLETA ───────────────────────────────────
function PortadaHero({ portadas = [], institucion, primaryColor, secondaryColor }) {
  const [current, setCurrent] = useState(0);
  
  const portadasFiltradas = portadas.length > 0 ? portadas : [];

  useEffect(() => {
    if (portadasFiltradas.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % portadasFiltradas.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [portadasFiltradas.length]);

  if (portadasFiltradas.length === 0) {
    return (
      <div 
        className="relative h-screen w-full flex items-center justify-center text-center px-4"
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)` 
        }}
      >
        <div className="relative z-10 max-w-4xl">
          <FileText size={80} style={{ color: primaryColor }} className="mx-auto mb-6 opacity-60" />
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white drop-shadow-2xl mb-6">
            Gaceta Universitaria
          </h1>
          <p className="text-white/70 text-xl sm:text-2xl lg:text-3xl">
            {institucion?.institucion_nombre ?? "Universidad Pública de El Alto"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={portadasFiltradas[current].portada_imagen}
            alt={portadasFiltradas[current].portada_titulo || "Portada"}
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(180deg, 
                  rgba(15,15,15,0.3) 0%, 
                  rgba(26,26,46,0.6) 50%, 
                  rgba(15,15,15,0.95) 100%
                ),
                radial-gradient(ellipse at bottom, ${primaryColor}50 0%, transparent 70%)
              `
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-5xl"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor}40, ${secondaryColor}40)`,
              border: `1px solid ${primaryColor}60`,
              backdropFilter: "blur(10px)"
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <FileText size={18} style={{ color: primaryColor }} />
            <span className="text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90">
              Documentos oficiales
            </span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black text-white drop-shadow-2xl mb-6 leading-tight">
            Gaceta Universitaria
          </h1>
          
          <p className="text-white/70 text-lg sm:text-xl lg:text-2xl xl:text-3xl max-w-3xl mx-auto font-light">
            {institucion?.institucion_nombre ?? "Universidad Pública de El Alto"}
          </p>
        </motion.div>

        {portadasFiltradas.length > 1 && (
          <motion.div 
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {portadasFiltradas.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === current ? 'w-12' : 'w-4 opacity-50 hover:opacity-100'
                }`}
                style={{ 
                  backgroundColor: idx === current ? primaryColor : 'white',
                  boxShadow: idx === current ? `0 0 20px ${primaryColor}` : 'none'
                }}
                aria-label={`Ir a portada ${idx + 1}`}
              />
            ))}
          </motion.div>
        )}
      </div>

      {portadasFiltradas.length > 1 && (
        <>
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => setCurrent((prev) => (prev - 1 + portadasFiltradas.length) % portadasFiltradas.length)}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/20 hover:scale-110 hover:border-white/40 shadow-2xl"
            aria-label="Anterior"
          >
            <ChevronLeft size={28} />
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => setCurrent((prev) => (prev + 1) % portadasFiltradas.length)}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/20 hover:scale-110 hover:border-white/40 shadow-2xl"
            aria-label="Siguiente"
          >
            <ChevronRight size={28} />
          </motion.button>
        </>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
      >
        <ChevronDown size={40} className="animate-bounce" />
      </motion.div>
    </div>
  );
}

// ─── VISTA PRINCIPAL ──────────────────────────────────────────────────────────
export default function GacetaView() {
  const { gaceta, loading, institucion, portadas } = useOutletContext(); // ← Agregamos portadas
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  useEffect(() => {
    if (!gaceta) return;
    let filtered = [...gaceta];
    if (searchTerm) {
      filtered = filtered.filter(
        (item) => item.gaceta_titulo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) => new Date(b.gaceta_fecha) - new Date(a.gaceta_fecha));
    setFilteredItems(filtered);
  }, [gaceta, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-4 border-t-transparent"
          style={{ borderColor: `${primaryColor} transparent transparent transparent` }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* ─── FONDO OSCURO GLOBAL ────────────────────────────────────────── */}
      <DarkSmokeBackground primaryColor={primaryColor} secondaryColor={secondaryColor} />

      {/* ─── HERO CON PORTADA PANTALLA COMPLETA ─────────────────────────── */}
      <PortadaHero 
        portadas={portadas} 
        institucion={institucion} 
        primaryColor={primaryColor} 
        secondaryColor={secondaryColor}
      />
      {/* Contenido principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* ─── ENCABEZADO CON ESTILO OSCURO ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
               style={{ 
                 background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`,
                 border: `1px solid ${primaryColor}40`
               }}>
            <FileText size={14} style={{ color: primaryColor }} />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
              Documentos oficiales
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="relative inline-block">
              <span
                className="relative z-10"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, #ffffff)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  textShadow: `0 0 40px ${primaryColor}40`
                }}
              >
                Gaceta Universitaria
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                  boxShadow: `0 0 20px ${primaryColor}60`
                }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
            </span>
          </h1>
          <p className="text-white/60 mt-3 text-sm max-w-2xl mx-auto">
            Documentos oficiales, resoluciones y comunicados institucionales
          </p>
        </motion.div>

        {/* ─── BÚSQUEDA CON ESTILO OSCURO ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: primaryColor }} />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 text-sm text-white placeholder-white/40"
              style={{ 
                outlineColor: primaryColor,
                boxShadow: `0 0 0 2px transparent`
              }}
              onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${primaryColor}`}
              onBlur={(e) => e.target.style.boxShadow = `0 0 0 2px transparent`}
            />
          </div>
        </motion.div>

        {/* ─── GRID DE DOCUMENTOS CON ESTILO OSCURO ─────────────────────── */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <FileText size={32} className="text-white/40" />
            </div>
            <p className="text-white/60">
              {searchTerm
                ? "No se encontraron documentos con esa búsqueda"
                : "No hay documentos disponibles"}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => {
              const isNew =
                new Date(item.gaceta_fecha) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

              return (
                <motion.div
                  key={item.gaceta_id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -6 }}
                  className="group h-full"
                >
                  <Link
                    to={`/gaceta/${item.gaceta_id}`}
                    className="block bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 hover:border-white/30 h-full flex flex-col cursor-pointer"
                  >
                    {/* Vista previa PDF local con estilo oscuro */}
                    <div className="p-4 pb-0">
                      <PdfPreview
                        documentUrl={item.gaceta_documento}
                        primaryColor={primaryColor}
                      />
                    </div>

                    {/* Contenido */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-[10px] font-bold px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${primaryColor}25`, 
                            color: primaryColor,
                            border: `1px solid ${primaryColor}40`
                          }}
                        >
                          GACETA
                        </span>
                        {isNew && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-green-500 text-white shadow-lg"
                                style={{ boxShadow: '0 0 10px #22c55e60' }}>
                            <Sparkles size={10} />
                            NUEVO
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-white text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-white transition-colors drop-shadow-sm">
                        {item.gaceta_titulo}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-white/60 mb-3">
                        <Calendar size={12} style={{ color: primaryColor }} />
                        <span>{formatFecha(item.gaceta_fecha)}</span>
                      </div>

                      <div className="mt-auto flex items-center justify-end pt-3 border-t border-white/10">
                        <span
                          className="flex items-center gap-1 text-xs font-medium transition-all duration-300 group-hover:translate-x-1"
                          style={{ color: primaryColor }}
                        >
                          <span>Ver documento completo</span>
                          <ChevronRight size={12} style={{ color: primaryColor }} />
                        </span>
                      </div>
                    </div>

                    {/* Barra inferior animada con glow */}
                    <motion.div
                      className="h-1 w-0 group-hover:w-full transition-all duration-500"
                      style={{ 
                        background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                        boxShadow: `0 0 10px ${primaryColor}80`
                      }}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Contador con estilo oscuro */}
        {filteredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-white/40 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <FileText size={14} style={{ color: primaryColor }} />
              Mostrando {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "documento" : "documentos"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}