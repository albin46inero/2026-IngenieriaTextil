import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, Sparkles, ChevronRight, ChevronLeft, ChevronDown,
  Phone, Heart
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

// Extraer información de fechas de la descripción
const extractDates = (descripcion) => {
  if (!descripcion) return null;
  const datePattern = /(\d{1,2})\/(\d{1,2})\/(\d{4})/g;
  const dates = [...descripcion.matchAll(datePattern)];
  if (dates.length > 0) {
    return {
      start: dates[0] ? new Date(`${dates[0][3]}-${dates[0][2]}-${dates[0][1]}`) : null,
      end: dates[1] ? new Date(`${dates[1][3]}-${dates[1][2]}-${dates[1][1]}`) : null
    };
  }
  return null;
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
          <Heart size={80} style={{ color: primaryColor }} className="mx-auto mb-6 opacity-60" />
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white drop-shadow-2xl mb-6">
            Servicios
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
            <Heart size={18} style={{ color: primaryColor }} />
            <span className="text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90">
              Bienestar universitario
            </span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black text-white drop-shadow-2xl mb-6 leading-tight">
            Servicios
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

export default function ServiciosView() {
  const { servicios, loading, institucion, portadas } = useOutletContext(); // ← Agregamos portadas
  const [filteredItems, setFilteredItems] = useState([]);

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  useEffect(() => {
    if (!servicios) return;
    
    let filtered = [...servicios];
    filtered = filtered.filter(item => item.serv_active === "1");
    filtered.sort((a, b) => b.serv_id - a.serv_id);
    
    setFilteredItems(filtered);
  }, [servicios]);

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
            <Heart size={14} style={{ color: primaryColor }} />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
              Bienestar universitario
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="relative inline-block">
              <span 
                className="relative z-10"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, #ffffff)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  textShadow: `0 0 40px ${primaryColor}40`
                }}
              >
                Servicios
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
            Servicios ofrecidos por la carrera de psicología para la comunidad universitaria
          </p>
        </motion.div>

        {/* Grid de servicios con estilo oscuro */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <Heart size={32} className="text-white/40" />
            </div>
            <p className="text-white/60">No hay servicios disponibles</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => {
              const dates = extractDates(item.serv_descripcion);
              
              return (
                <motion.div
                  key={item.serv_id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -6 }}
                  className="group h-full"
                >
                  <Link
                    to={`/servicios/${item.serv_id}`}
                    className="block bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 hover:border-white/30 h-full flex flex-col cursor-pointer"
                  >
                    {/* Imagen con estilo oscuro */}
                    <div className="relative h-48 overflow-hidden bg-black/20">
                      {item.serv_imagen && item.serv_imagen.startsWith('http') ? (
                        <>
                          <img
                            src={item.serv_imagen}
                            alt={item.serv_nombre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-90" />
                        </>
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)` }}
                        >
                          <Heart size={48} style={{ color: primaryColor }} className="opacity-40" />
                        </div>
                      )}
                    </div>

                    {/* Contenido con texto blanco */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-white text-base mb-2 line-clamp-2 group-hover:text-white transition-colors drop-shadow-sm">
                        {item.serv_nombre}
                      </h3>
                      
                      {/* Teléfono */}
                      {item.serv_nro_celular && (
                        <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
                          <Phone size={12} style={{ color: primaryColor }} />
                          <span>{item.serv_nro_celular}</span>
                        </div>
                      )}

                      {/* Fechas si existen */}
                      {dates && dates.start && (
                        <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
                          <Calendar size={12} style={{ color: primaryColor }} />
                          <span>
                            {dates.start.toLocaleDateString()} 
                            {dates.end && ` - ${dates.end.toLocaleDateString()}`}
                          </span>
                        </div>
                      )}

                      {/* Indicador de que se puede hacer clic */}
                      <div className="mt-auto flex items-center justify-end pt-2 border-t border-white/10">
                        <span className="flex items-center gap-1 text-xs font-medium transition-all duration-300 group-hover:translate-x-1" style={{ color: primaryColor }}>
                          <span>Ver detalles</span>
                          <ChevronRight size={12} style={{ color: primaryColor }} />
                        </span>
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

        {/* Contador con estilo oscuro */}
        {filteredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-white/40 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <Heart size={14} style={{ color: primaryColor }} />
              Mostrando {filteredItems.length} {filteredItems.length === 1 ? "servicio" : "servicios"} disponibles
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}