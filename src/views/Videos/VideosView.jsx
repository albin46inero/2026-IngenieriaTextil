import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router";
import { motion } from "motion/react";
import { 
  Play, Calendar, Sparkles, Eye, 
  Clock, Heart, Share2, Bookmark,
  TrendingUp, Film, Tv,
  ChevronRight, AlertCircle
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";

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
      className="absolute pointer-events-none z-0"
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
        scale: [1, 1.05, 1],
      }}
      transition={{
        y: { duration, delay, repeat: Infinity, ease: "easeInOut" },
        rotate: rotate ? { duration: 20, delay, repeat: Infinity, ease: "linear" } : {},
        scale: { duration: duration / 2, delay, repeat: Infinity, ease: "easeInOut" },
      }}
    />
  );
};

// Extraer ID de YouTube de diferentes formatos de URL
function getYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?#]+)/,
    /youtube\.com\/embed\/([^/?]+)/,
    /youtube\.com\/v\/([^/?]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Obtener URL de miniatura de YouTube
function getYouTubeThumbnail(url, quality = 'mqdefault') {
  const videoId = getYouTubeId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

// Obtener URL embed de YouTube
function getYouTubeEmbedUrl(url) {
  const videoId = getYouTubeId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}

// Obtener estilo por tipo de video
const getVideoTypeStyle = (tipo) => {
  const styles = {
    ACTIVIDADES: {
      bg: "from-blue-500 to-indigo-500",
      icon: Film,
      label: "Actividades",
      color: "#3b82f6"
    },
    CONFERENCIAS: {
      bg: "from-purple-500 to-fuchsia-500",
      icon: Tv,
      label: "Conferencias",
      color: "#8b5cf6"
    },
    TALLERES: {
      bg: "from-green-500 to-emerald-500",
      icon: TrendingUp,
      label: "Talleres",
      color: "#10b981"
    },
    default: {
      bg: "from-red-500 to-rose-500",
      icon: FaYoutube,
      label: "Video",
      color: "#ef4444"
    }
  };
  return styles[tipo] || styles.default;
};

export default function VideosView() {
  const { videos, loading, institucion } = useOutletContext();
  const [filteredItems, setFilteredItems] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  useEffect(() => {
    if (!videos) return;
    
    let filtered = [...videos];
    // Filtrar solo activos (video_estado === 1)
    filtered = filtered.filter(item => item.video_estado === 1);
    // Ordenar por ID más reciente
    filtered.sort((a, b) => b.video_id - a.video_id);
    setFilteredItems(filtered);
  }, [videos]);

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
            <FaYoutube size={14} style={{ color: primaryColor }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
              Contenido multimedia
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
                Galería de Videos
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
            Conferencias, talleres, actividades y contenido institucional
          </motion.p>
        </motion.div>

        {/* Grid de videos */}
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
              <FaYoutube size={32} className="text-gray-300" />
            </motion.div>
            <p className="text-gray-500">No hay videos disponibles</p>
            <p className="text-xs text-gray-400 mt-2">Pronto habrá nuevo contenido</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredItems.map((item, index) => {
              const thumbnail = getYouTubeThumbnail(item.video_enlace, 'mqdefault');
              const videoTypeStyle = getVideoTypeStyle(item.video_tipo);
              const IconComponent = videoTypeStyle.icon;
              
              return (
                <motion.div
                  key={item.video_id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.08, duration: 0.5, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  onHoverStart={() => setHoveredId(item.video_id)}
                  onHoverEnd={() => setHoveredId(null)}
                  className="group"
                >
                  <Link
                    to={`/videos/${item.video_id}`}
                    className="block bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full flex flex-col cursor-pointer"
                  >
                    {/* Efecto de brillo en hover */}
                    <motion.div 
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ 
                        background: `radial-gradient(circle at 50% 0%, ${primaryColor}20, transparent)`,
                        zIndex: 1
                      }}
                    />
                    
                    {/* Miniaturas del video */}
                    <div className="relative h-52 sm:h-56 md:h-60 overflow-hidden bg-gray-900">
                      {thumbnail ? (
                        <>
                          <motion.img
                            src={thumbnail}
                            alt={item.video_titulo}
                            className="w-full h-full object-cover"
                            animate={{ scale: hoveredId === item.video_id ? 1.1 : 1 }}
                            transition={{ duration: 0.4 }}
                          />
                          <motion.div 
                            className="absolute inset-0 bg-black/40"
                            animate={{ opacity: hoveredId === item.video_id ? 0.6 : 0.4 }}
                            transition={{ duration: 0.3 }}
                          />
                        </>
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)` }}
                        >
                          <IconComponent size={56} style={{ color: primaryColor }} className="opacity-30" />
                        </div>
                      )}
                      
                      {/* Botón de reproducción flotante */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ scale: hoveredId === item.video_id ? 1.1 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                          <Play size={32} className="text-white ml-1" />
                        </div>
                      </motion.div>

                      {/* Badge de tipo de video */}
                      <div className="absolute top-4 left-4 z-10">
                        <span 
                          className={`text-[10px] font-bold px-2 py-1 rounded-full shadow-md bg-gradient-to-r ${videoTypeStyle.bg} text-white`}
                        >
                          {videoTypeStyle.label}
                        </span>
                      </div>

                      {/* Duración simulada */}
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                        <div className="flex items-center gap-1 text-white/80 text-[10px]">
                          <Clock size={10} />
                          <span>Video</span>
                        </div>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-5 flex-1 flex flex-col bg-white relative z-10">
                      <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {item.video_titulo}
                      </h3>
                      
                      {/* Descripción corta */}
                      {item.video_breve_descripcion && (
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                          {item.video_breve_descripcion}
                        </p>
                      )}

                      {/* Estadísticas */}
                      <div className="mt-auto pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <motion.div 
                              className="flex items-center gap-1"
                              whileHover={{ scale: 1.1 }}
                            >
                              <Heart size={14} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer" />
                              <span className="text-[10px] text-gray-400">Ver</span>
                            </motion.div>
                            <div className="flex items-center gap-1">
                              <Eye size={14} className="text-gray-400" />
                              <span className="text-[10px] text-gray-400">Reproducir</span>
                            </div>
                          </div>
                          <motion.div
                            animate={{ x: hoveredId === item.video_id ? 5 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-1 text-xs font-medium"
                            style={{ color: primaryColor }}
                          >
                            <span>Ver más</span>
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
              <FaYoutube size={14} style={{ color: primaryColor }} />
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
                {filteredItems.length === 1 ? " video disponible" : " videos disponibles"}
              </span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}