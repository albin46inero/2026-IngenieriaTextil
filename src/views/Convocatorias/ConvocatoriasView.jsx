import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router";
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, Sparkles, ChevronRight, ChevronLeft, ChevronDown,
  Megaphone, Bell, FileText 
} from "lucide-react";

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

// Componente decorador flotante
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

// Formatear fecha
function formatFecha(fecha) {
  if (!fecha) return "";
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const d = new Date(fecha);
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

// Obtener estilo por tipo
const getTypeStyle = (tipo) => {
  const styles = {
    CONVOCATORIAS: {
      bg: "from-rose-500 to-orange-500",
      icon: Megaphone,
      label: "Convocatoria",
      color: "#e68600"
    },
    COMUNICADOS: {
      bg: "from-blue-500 to-indigo-500",
      icon: FileText,
      label: "Comunicado",
      color: "#3b82f6"
    },
    AVISOS: {
      bg: "from-amber-500 to-yellow-500",
      icon: Bell,
      label: "Aviso",
      color: "#f59e0b"
    }
  };
  return styles[tipo] || styles.CONVOCATORIAS;
};

// ─── HERO CON PORTADA PANTALLA COMPLETA ───────────────────────────────────
function PortadaHero({ portadas = [], institucion, primaryColor, secondaryColor, tipo }) {
  const [current, setCurrent] = useState(0);
  const typeStyle = getTypeStyle(tipo);
  
  const portadasFiltradas = portadas.length > 0 ? portadas : [];

  useEffect(() => {
    if (portadasFiltradas.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % portadasFiltradas.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [portadasFiltradas.length]);

  if (portadasFiltradas.length === 0) {
    // Fallback sin imágenes - PANTALLA COMPLETA
    return (
      <div 
        className="relative h-screen w-full flex items-center justify-center text-center px-4"
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)` 
        }}
      >
        <div className="relative z-10 max-w-4xl">
          <typeStyle.icon size={80} style={{ color: primaryColor }} className="mx-auto mb-6 opacity-60" />
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white drop-shadow-2xl mb-6">
            {tipo === "CONVOCATORIAS" ? "Convocatorias" : tipo === "COMUNICADOS" ? "Comunicados" : "Avisos"}
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
      {/* Imágenes de portada */}
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
          {/* Overlay oscuro con degradado institucional */}
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

      {/* Contenido del hero - PANTALLA COMPLETA */}
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
            <typeStyle.icon size={18} style={{ color: primaryColor }} />
            <span className="text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90">
              {getTypeStyle(tipo).label}
            </span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black text-white drop-shadow-2xl mb-6 leading-tight">
            {tipo === "CONVOCATORIAS" ? "Convocatorias" : tipo === "COMUNICADOS" ? "Comunicados" : "Avisos"}
          </h1>
          
          <p className="text-white/70 text-lg sm:text-xl lg:text-2xl xl:text-3xl max-w-3xl mx-auto font-light">
            {institucion?.institucion_nombre ?? "Universidad Pública de El Alto"}
          </p>
        </motion.div>

        {/* Indicador de slides - más visible */}
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

      {/* Botones de navegación - más grandes y visibles */}
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

      {/* Flecha para scroll - más visible */}
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

export default function ConvocatoriasView({ tipo = "CONVOCATORIAS" }) {
  const { convocatorias, loading, institucion, portadas } = useOutletContext();
  const [filteredItems, setFilteredItems] = useState([]);

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  const typeStyle = getTypeStyle(tipo);
  const titleMap = {
    CONVOCATORIAS: "Convocatorias",
    COMUNICADOS: "Comunicados",
    AVISOS: "Avisos"
  };

  useEffect(() => {
    if (!convocatorias) return;
    
    let filtered = [...convocatorias];
    filtered = filtered.filter(
      item => item.tipo_conv_comun?.tipo_conv_comun_titulo === tipo
    );
    filtered.sort((a, b) => new Date(b.con_fecha_inicio) - new Date(a.con_fecha_inicio));
    
    setFilteredItems(filtered);
  }, [convocatorias, tipo]);

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
        tipo={tipo}
      />


      {/* Contenido principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Grid de resultados */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <typeStyle.icon size={32} className="text-white/40" />
            </div>
            <p className="text-white/60">No hay {titleMap[tipo].toLowerCase()} disponibles</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => {
              const isExpired = new Date(item.con_fecha_fin) < new Date();
              
              return (
                <motion.div
                  key={item.idconvocatorias}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -6 }}
                >
                  <Link
                    to={`/convocatorias/${item.idconvocatorias}`}
                    className="group block bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 hover:border-white/30 h-full flex flex-col"
                  >
                    {/* Imagen */}
                    <div className="relative h-44 overflow-hidden bg-black/20">
                      {item.con_foto_portada ? (
                        <>
                          <img
                            src={item.con_foto_portada}
                            alt={item.con_titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-90" />
                        </>
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)` }}
                        >
                          <typeStyle.icon size={40} style={{ color: primaryColor }} className="opacity-40" />
                        </div>
                      )}
                      
                      {/* Badge tipo */}
                      <span 
                        className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg bg-gradient-to-r ${typeStyle.bg}`}
                        style={{ boxShadow: `0 0 10px ${typeStyle.color}60` }}
                      >
                        {typeStyle.label}
                      </span>

                      {/* Badge estado */}
                      {isExpired && (
                        <span className="absolute top-3 right-3 bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg border border-white/20">
                          FINALIZADO
                        </span>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="p-4 flex-1 flex-col">
                      <h3 className="font-bold text-white text-base mb-2 line-clamp-2 group-hover:text-white transition-colors drop-shadow-sm">
                        {item.con_titulo}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-xs text-white/60 mb-3">
                        <Calendar size={12} style={{ color: primaryColor }} />
                        <span>{formatFecha(item.con_fecha_inicio)}</span>
                        {item.con_fecha_fin && (
                          <>
                            <span>-</span>
                            <span>{formatFecha(item.con_fecha_fin)}</span>
                          </>
                        )}
                      </div>

                      {item.con_descripcion && (
                        <p className="text-xs text-white/50 line-clamp-2 mb-3">
                          {DOMPurify.sanitize(item.con_descripcion.replace(/<[^>]*>/g, "").substring(0, 100))}...
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-end pt-2 border-t border-white/10">
                        <motion.div
                          whileHover={{ x: 3 }}
                          className="flex items-center gap-1 text-xs font-medium"
                          style={{ color: primaryColor }}
                        >
                          <span>Ver detalles</span>
                          <ChevronRight size={12} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Barra inferior animada con glow */}
                    <motion.div 
                      className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
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

        {/* Contador */}
        {filteredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-white/40 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <typeStyle.icon size={14} style={{ color: primaryColor }} />
              Mostrando {filteredItems.length} {filteredItems.length === 1 ? "resultado" : "resultados"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}