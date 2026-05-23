import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router";
import { motion } from "motion/react";
import { 
  Calendar, Sparkles, ChevronRight, 
  BookOpen, User, FileText, Eye,
  AlertCircle, TrendingUp, Heart, 
  Share2, Bookmark, Clock
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
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const d = new Date(fecha);
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

// Obtener estilo por tipo
const getTypeStyle = (tipo) => {
  const styles = {
    Curso: {
      bg: "from-blue-500 to-indigo-500",
      icon: BookOpen,
      label: "Curso",
      color: "#3b82f6"
    },
    UPEA: {
      bg: "from-emerald-500 to-teal-500",
      icon: TrendingUp,
      label: "Institucional",
      color: "#10b981"
    },
    SIS: {
      bg: "from-purple-500 to-fuchsia-500",
      icon: Heart,
      label: "Estudiantil",
      color: "#8b5cf6"
    },
    default: {
      bg: "from-gray-500 to-gray-600",
      icon: FileText,
      label: "Publicación",
      color: "#6b7280"
    }
  };
  return styles[tipo] || styles.default;
};

// Calcular tiempo relativo
function getRelativeTime(fecha) {
  if (!fecha) return "";
  const d = new Date(fecha);
  const ahora = new Date();
  const diffDias = Math.floor((ahora - d) / (1000 * 60 * 60 * 24));
  
  if (diffDias === 0) return "Hoy";
  if (diffDias === 1) return "Ayer";
  if (diffDias < 7) return `Hace ${diffDias} días`;
  if (diffDias < 30) return `Hace ${Math.floor(diffDias / 7)} semanas`;
  return formatFecha(fecha);
}

export default function PublicacionesView() {
  const { publicaciones, loading, institucion } = useOutletContext();
  const [filteredItems, setFilteredItems] = useState([]);

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  useEffect(() => {
    if (!publicaciones) return;
    
    let filtered = [...publicaciones];
    filtered.sort((a, b) => new Date(b.publicaciones_fecha) - new Date(a.publicaciones_fecha));
    setFilteredItems(filtered);
  }, [publicaciones]);

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
        
        {/* Encabezado mejorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 mb-4">
            <Sparkles size={14} style={{ color: primaryColor }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
              Biblioteca Digital
            </span>
          </div>
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
                Publicaciones
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

        </motion.div>

        {/* Grid de publicaciones mejorado */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <BookOpen size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500">No hay publicaciones disponibles</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => {
              const typeStyle = getTypeStyle(item.publicaciones_tipo);
              const relativeTime = getRelativeTime(item.publicaciones_fecha);
              const isNew = new Date(item.publicaciones_fecha) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              
              return (
                <motion.div
                  key={item.publicaciones_id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -8 }}
                  className="group h-full"
                >
                  <Link
                    to={`/publicaciones/${item.publicaciones_id}`}
                    className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer"
                  >
                    {/* Imagen con overlay mejorado */}
                    <div className="relative h-52 overflow-hidden bg-gray-100">
                      {item.publicaciones_imagen && item.publicaciones_imagen.startsWith('http') ? (
                        <>
                          <img
                            src={item.publicaciones_imagen}
                            alt={item.publicaciones_titulo}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </>
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)` }}
                        >
                          <BookOpen size={56} style={{ color: primaryColor }} className="opacity-30" />
                        </div>
                      )}
                      
                      {/* Badge tipo mejorado */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span 
                          className={`text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md bg-gradient-to-r ${typeStyle.bg}`}
                        >
                          {typeStyle.label}
                        </span>
                        {isNew && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-green-500 text-white shadow-md">
                            <Sparkles size={10} />
                            NUEVO
                          </span>
                        )}
                      </div>

                      {/* Indicador de tiempo relativo */}
                      <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                        <div className="flex items-center gap-1 text-white/80 text-[10px]">
                          <Clock size={10} />
                          <span>{relativeTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contenido mejorado */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {item.publicaciones_titulo}
                      </h3>
                      
                      {/* Autor y fecha */}
                      <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-gray-500">
                        {item.publicaciones_autor && (
                          <div className="flex items-center gap-1.5">
                            <User size={12} />
                            <span className="truncate">{item.publicaciones_autor}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          <span>{formatFecha(item.publicaciones_fecha)}</span>
                        </div>
                      </div>

                      {/* Descripción corta */}


                      {/* Botón de acción mejorado */}
                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">

                        </div>
                        <motion.div
                          whileHover={{ x: 3 }}
                          className="flex items-center gap-1.5 text-sm font-medium"
                          style={{ color: primaryColor }}
                        >
                          <span>Leer más</span>
                          <ChevronRight size={14} />
                        </motion.div>
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

        {/* Contador mejorado */}
        {filteredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-10"
          >
            <p className="text-sm text-gray-400 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
              <BookOpen size={14} />
              Mostrando {filteredItems.length} {filteredItems.length === 1 ? "publicación" : "publicaciones"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}