import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, Sparkles, ChevronRight, ChevronLeft, ChevronDown,
  MapPin, Clock, Users, Heart, 
  Eye, CalendarDays, Star, Trophy, 
  Music, Coffee, Camera, Zap, GraduationCap
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
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const d = new Date(fecha);
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

// Formatear fecha para badge
function formatBadgeDate(fecha) {
  if (!fecha) return { day: "??", month: "???" };
  const d = new Date(fecha);
  const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  return {
    day: d.getDate(),
    month: meses[d.getMonth()]
  };
}

// Formatear hora (quitar segundos)
function formatHora(hora) {
  if (!hora) return "";
  return hora.substring(0, 5);
}

// Obtener color por tipo de evento
const getTipoEventoStyle = (tipo) => {
  const styles = {
    ACADEMICO: {
      bg: "from-blue-500 to-indigo-500",
      icon: GraduationCap,
      label: "Académico",
      color: "#3b82f6"
    },
    CULTURAL: {
      bg: "from-purple-500 to-fuchsia-500",
      icon: Music,
      label: "Cultural",
      color: "#8b5cf6"
    },
    DEPORTIVO: {
      bg: "from-green-500 to-emerald-500",
      icon: Trophy,
      label: "Deportivo",
      color: "#10b981"
    },
    default: {
      bg: "from-gray-500 to-gray-600",
      icon: Calendar,
      label: "Evento",
      color: "#6b7280"
    }
  };
  return styles[tipo] || styles.default;
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
    // Fallback sin imágenes - PANTALLA COMPLETA
    return (
      <div 
        className="relative h-screen w-full flex items-center justify-center text-center px-4"
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)` 
        }}
      >
        <div className="relative z-10 max-w-4xl">
          <CalendarDays size={80} style={{ color: primaryColor }} className="mx-auto mb-6 opacity-60" />
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white drop-shadow-2xl mb-6">
            Eventos y Actividades
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
            <Sparkles size={18} style={{ color: primaryColor }} />
            <span className="text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90">
              Calendario académico
            </span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black text-white drop-shadow-2xl mb-6 leading-tight">
            Eventos y Actividades
          </h1>
          
          <p className="text-white/70 text-lg sm:text-xl lg:text-2xl xl:text-3xl max-w-3xl mx-auto font-light">
            {institucion?.institucion_nombre ?? "Universidad Pública de El Alto"}
          </p>
        </motion.div>

        {/* Indicador de slides */}
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

      {/* Botones de navegación */}
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

      {/* Flecha para scroll */}
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

export default function EventosView() {
  const { eventos, loading, institucion, portadas } = useOutletContext(); // ← Agregamos portadas
  const [filteredItems, setFilteredItems] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  useEffect(() => {
    if (!eventos) return;
    
    let filtered = [...eventos];
    filtered.sort((a, b) => new Date(a.evento_fecha) - new Date(b.evento_fecha));
    setFilteredItems(filtered);
  }, [eventos]);

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
        
        {/* Grid de eventos */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10"
            >
              <CalendarDays size={32} className="text-white/40" />
            </motion.div>
            <p className="text-white/60">No hay eventos programados</p>
            <p className="text-xs text-white/40 mt-2">Pronto habrá nuevas actividades</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredItems.map((item, index) => {
              const badgeDate = formatBadgeDate(item.evento_fecha);
              const isUpcoming = new Date(item.evento_fecha) > new Date();
              const tipoStyle = getTipoEventoStyle(item.tipo_evento);
              
              return (
                <motion.div
                  key={item.evento_id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.08, duration: 0.5, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  onHoverStart={() => setHoveredId(item.evento_id)}
                  onHoverEnd={() => setHoveredId(null)}
                  className="group"
                >
                  <Link
                    to={`/eventos/${item.evento_id}`}
                    className="block bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 hover:border-white/30 h-full flex flex-col cursor-pointer relative"
                  >
                    {/* Efecto de brillo en hover */}
                    <motion.div 
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ 
                        background: `radial-gradient(circle at 50% 0%, ${primaryColor}30, transparent)`,
                        zIndex: 1
                      }}
                    />
                    
                    {/* Imagen */}
                    <div className="relative h-52 sm:h-56 md:h-60 overflow-hidden bg-black/20">
                      {item.evento_imagen && item.evento_imagen.startsWith('http') ? (
                        <>
                          <motion.img
                            src={item.evento_imagen}
                            alt={item.evento_titulo}
                            className="w-full h-full object-cover"
                            animate={{ scale: hoveredId === item.evento_id ? 1.1 : 1 }}
                            transition={{ duration: 0.4 }}
                          />
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-90"
                          />
                        </>
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)` }}
                        >
                          <tipoStyle.icon size={56} style={{ color: primaryColor }} className="opacity-40" />
                        </div>
                      )}
                      
                      {/* Badge de fecha */}
                      <motion.div 
                        className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden z-10 border border-white/20"
                        animate={{ 
                          scale: hoveredId === item.evento_id ? 1.05 : 1,
                          rotate: hoveredId === item.evento_id ? 2 : 0
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="text-center px-3 py-1.5">
                          <div className="text-xl font-bold" style={{ color: primaryColor }}>
                            {badgeDate.day}
                          </div>
                          <div className="text-[9px] text-white/70 font-semibold uppercase tracking-wider">
                            {badgeDate.month}
                          </div>
                        </div>
                      </motion.div>

                      {/* Badge de tipo de evento */}
                      <div className="absolute top-4 right-4 z-10">
                        <span 
                          className={`text-[10px] font-bold px-2 py-1 rounded-full shadow-lg bg-gradient-to-r ${tipoStyle.bg} text-white`}
                          style={{ boxShadow: `0 0 10px ${tipoStyle.color}60` }}
                        >
                          {tipoStyle.label}
                        </span>
                      </div>

                      {/* Badge de estado */}
                      {isUpcoming && (
                        <motion.div 
                          className="absolute bottom-4 left-4 z-10"
                          animate={{ 
                            scale: [1, 1.05, 1],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-500 text-white shadow-lg border border-white/20">
                            PRÓXIMAMENTE
                          </span>
                        </motion.div>
                      )}

                      {/* Overlay de información en hover */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                      >
                        <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                          <span className="text-white text-xs font-medium flex items-center gap-1">
                            <Eye size={12} />
                            Ver detalles
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Contenido */}
                    <div className="p-5 flex-1 flex flex-col bg-transparent relative z-10">
                      <h3 className="font-bold text-white text-base sm:text-lg mb-3 line-clamp-2 group-hover:text-white transition-colors drop-shadow-sm">
                        {item.evento_titulo}
                      </h3>
                      
                      {/* Ubicación */}
                      {item.evento_lugar && (
                        <motion.div 
                          className="flex items-center gap-2 text-xs text-white/60 mb-2"
                          whileHover={{ x: 3 }}
                        >
                          <MapPin size={12} style={{ color: primaryColor }} />
                          <span className="truncate">{item.evento_lugar}</span>
                        </motion.div>
                      )}

                      {/* Fecha y hora */}
                      <div className="flex items-center gap-3 mb-3 text-xs text-white/60">
                        <div className="flex items-center gap-1">
                          <Calendar size={11} style={{ color: primaryColor }} />
                          <span>{formatFecha(item.evento_fecha)}</span>
                        </div>
                        {item.evento_hora && (
                          <div className="flex items-center gap-1">
                            <Clock size={11} style={{ color: primaryColor }} />
                            <span>{formatHora(item.evento_hora)}</span>
                          </div>
                        )}
                      </div>

                      {/* Descripción corta */}
                      {item.evento_descripcion && (
                        <p className="text-xs text-white/50 line-clamp-2 mb-3">
                          {item.evento_descripcion.replace(/<[^>]*>/g, "").substring(0, 100)}...
                        </p>
                      )}

                      {/* Botón de acción */}
                      <div className="mt-auto pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <motion.div 
                              className="flex items-center gap-1"
                              whileHover={{ scale: 1.1 }}
                            >
                              <Heart size={14} className="text-white/40 hover:text-red-400 transition-colors cursor-pointer" />
                              <span className="text-[10px] text-white/40">Interés</span>
                            </motion.div>
                          </div>
                          <motion.div
                            animate={{ x: hoveredId === item.evento_id ? 5 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-1 text-xs font-medium"
                            style={{ color: primaryColor }}
                          >
                            <span>Más info</span>
                            <ChevronRight size={12} style={{ color: primaryColor }} />
                          </motion.div>
                        </div>
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

        {/* Contador */}
        {filteredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-10"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm shadow-sm border border-white/10"
            >
              <CalendarDays size={14} style={{ color: primaryColor }} />
              <span className="text-sm text-white/60">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.6 }}
                  className="inline-block font-bold mr-1"
                  style={{ color: primaryColor }}
                >
                  {filteredItems.length}
                </motion.span>
                {filteredItems.length === 1 ? " evento programado" : " eventos programados"}
              </span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}