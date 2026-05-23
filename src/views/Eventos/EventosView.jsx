import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, Sparkles, ChevronRight, 
  MapPin, Clock, Users, Heart, 
  Eye, CalendarDays, Star, Trophy, 
  Music, Coffee, Camera, Zap, GraduationCap
} from "lucide-react";

// Componente decorador flotante
const FloatingDecorator = ({ src, size, x, y, delay, duration = 12, rotate = true, color = null }) => {
  const getColorFilter = (color) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `brightness(0) saturate(100%) invert(${Math.round((1 - r/255) * 100)}%) sepia(100%) hue-rotate(${Math.round(Math.atan2(b, r) * 180 / Math.PI)}deg) saturate(500%)`;
  };

  return 
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

export default function EventosView() {
  const { eventos, loading, institucion } = useOutletContext();
  const [filteredItems, setFilteredItems] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  useEffect(() => {
    if (!eventos) return;
    
    let filtered = [...eventos];
    // Ordenar por fecha más cercana primero
    filtered.sort((a, b) => new Date(a.evento_fecha) - new Date(b.evento_fecha));
    setFilteredItems(filtered);
  }, [eventos]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      
      {/* ─── DECORADORES FLOTANTES ────────────────────────────────────────── */}
      <FloatingDecorator 
        src="/png_decoradores/shape-01.png" 
        size={160} x="2%" y="5%" delay={0} duration={14} 
        color={primaryColor}
      />
      <FloatingDecorator 
        src="/png_decoradores/shape-02.png" 
        size={140} x="85%" y="8%" delay={1} duration={12} 
        color={secondaryColor}
      />
      <FloatingDecorator 
        src="/png_decoradores/dark-shape-09.png" 
        size={200} x="-2%" y="75%" delay={2} duration={16} rotate={false}
        color={primaryColor}
      />
      <FloatingDecorator 
        src="/png_decoradores/dark-shape-13.png" 
        size={170} x="86%" y="80%" delay={1.5} duration={14} rotate={false}
        color={secondaryColor}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 mb-4"
          >
            <Sparkles size={14} style={{ color: primaryColor }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
              Calendario académico
            </span>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
            <span className="relative inline-block">
              <span 
                className="relative z-10"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                Eventos y Actividades
              </span>
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
            </span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 mt-3 text-sm max-w-2xl mx-auto"
          >
            Conferencias, talleres, congresos y actividades académicas
          </motion.p>
        </motion.div>

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
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <CalendarDays size={32} className="text-gray-300" />
            </motion.div>
            <p className="text-gray-500">No hay eventos programados</p>
            <p className="text-xs text-gray-400 mt-2">Pronto habrá nuevas actividades</p>
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
                    className="block bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full flex flex-col cursor-pointer relative"
                  >
                    {/* Efecto de brillo en hover */}
                    <motion.div 
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ 
                        background: `radial-gradient(circle at 50% 0%, ${primaryColor}20, transparent)`,
                        zIndex: 1
                      }}
                    />
                    
                    {/* Imagen */}
                    <div className="relative h-52 sm:h-56 md:h-60 overflow-hidden bg-gray-100">
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
                            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                            animate={{ opacity: hoveredId === item.evento_id ? 0.8 : 0.4 }}
                            transition={{ duration: 0.3 }}
                          />
                        </>
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)` }}
                        >
                          <tipoStyle.icon size={56} style={{ color: primaryColor }} className="opacity-30" />
                        </div>
                      )}
                      
                      {/* Badge de fecha */}
                      <motion.div 
                        className="absolute top-4 left-4 bg-white rounded-xl shadow-lg overflow-hidden z-10"
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
                          <div className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">
                            {badgeDate.month}
                          </div>
                        </div>
                      </motion.div>

                      {/* Badge de tipo de evento */}
                      <div className="absolute top-4 right-4 z-10">
                        <span 
                          className={`text-[10px] font-bold px-2 py-1 rounded-full shadow-md bg-gradient-to-r ${tipoStyle.bg} text-white`}
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
                          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-500 text-white shadow-md">
                            PRÓXIMAMENTE
                          </span>
                        </motion.div>
                      )}

                      {/* Overlay de información en hover */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                      >
                        <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
                          <span className="text-white text-xs font-medium flex items-center gap-1">
                            <Eye size={12} />
                            Ver detalles
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Contenido */}
                    <div className="p-5 flex-1 flex flex-col bg-white relative z-10">
                      <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {item.evento_titulo}
                      </h3>
                      
                      {/* Ubicación */}
                      {item.evento_lugar && (
                        <motion.div 
                          className="flex items-center gap-2 text-xs text-gray-500 mb-2"
                          whileHover={{ x: 3 }}
                        >
                          <MapPin size={12} style={{ color: primaryColor }} />
                          <span className="truncate">{item.evento_lugar}</span>
                        </motion.div>
                      )}

                      {/* Fecha y hora */}
                      <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
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
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                          {item.evento_descripcion.replace(/<[^>]*>/g, "").substring(0, 100)}...
                        </p>
                      )}

                      {/* Botón de acción */}
                      <div className="mt-auto pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <motion.div 
                              className="flex items-center gap-1"
                              whileHover={{ scale: 1.1 }}
                            >
                              <Heart size={14} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer" />
                              <span className="text-[10px] text-gray-400">Interés</span>
                            </motion.div>
                          </div>
                          <motion.div
                            animate={{ x: hoveredId === item.evento_id ? 5 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-1 text-xs font-medium"
                            style={{ color: primaryColor }}
                          >
                            <span>Más info</span>
                            <ChevronRight size={12} />
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Barra inferior animada */}
                    <motion.div 
                      className="h-1 w-0 group-hover:w-full transition-all duration-500"
                      style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 shadow-sm"
            >
              <CalendarDays size={14} style={{ color: primaryColor }} />
              <span className="text-sm text-gray-600">
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