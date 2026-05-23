import { useState, useEffect } from "react";
import { useParams, Link, useOutletContext } from "react-router";
import { motion } from "motion/react";
import { 
  ArrowLeft, Calendar, Clock, Eye, 
  Heart, Share2, Bookmark, Download,
  ThumbsUp, MessageCircle, ChevronRight,
  AlertCircle, Sparkles, TrendingUp,
  Film, Tv, Play, Pause,
  Volume2, VolumeX, Maximize, Minimize
} from "lucide-react";
import { FaYoutube, FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";

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

// Extraer ID de YouTube
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

// Obtener URL embed de YouTube
function getYouTubeEmbedUrl(url) {
  const videoId = getYouTubeId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
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

export default function DetalleVideo() {
  const { id } = useParams();
  const { videos, loading, institucion } = useOutletContext();
  const [item, setItem] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  useEffect(() => {
    if (!videos) return;
    const found = videos.find(v => v.video_id === parseInt(id));
    if (found) {
      setItem(found);
    } else {
      setNotFound(true);
    }
  }, [videos, id]);

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
          <p className="text-gray-500 mb-6">El video que buscas no existe</p>
          <Link
            to="/videos"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ 
              backgroundColor: `${primaryColor}10`,
              color: primaryColor,
              border: `1px solid ${primaryColor}20`
            }}
          >
            <ArrowLeft size={16} />
            Volver a videos
          </Link>
        </div>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(item.video_enlace);
  const videoTypeStyle = getVideoTypeStyle(item.video_tipo);
  const IconComponent = videoTypeStyle.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      
      

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Botón volver */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link
            to="/videos"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:translate-x-[-4px]"
            style={{ color: primaryColor }}
          >
            <ArrowLeft size={16} />
            Volver a videos
          </Link>
        </motion.div>

        {/* Reproductor de video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
            <div className="relative aspect-video">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={item.video_titulo}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <IconComponent size={64} className="text-gray-600" />
                  <p className="text-gray-500 mt-4">No se pudo cargar el video</p>
                </div>
              )}
            </div>
            
            {/* Overlay de información en el reproductor */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span 
                  className="text-[10px] font-bold px-2 py-1 rounded-full shadow-md bg-gradient-to-r text-white"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                >
                  {videoTypeStyle.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-xs bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                  YouTube
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Información del video */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna izquierda - Info principal */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                {item.video_titulo}
              </h1>
              
              {/* Descripción */}
              {item.video_breve_descripcion && (
                <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.video_breve_descripcion}
                  </p>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    liked ? 'text-white' : ''
                  }`}
                  style={liked ? { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` } : { 
                    backgroundColor: `${primaryColor}10`,
                    color: primaryColor,
                    border: `1px solid ${primaryColor}20`
                  }}
                >

                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSaved(!saved)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    saved ? 'text-white' : ''
                  }`}
                  style={saved ? { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` } : { 
                    backgroundColor: `${primaryColor}10`,
                    color: primaryColor,
                    border: `1px solid ${primaryColor}20`
                  }}
                >

                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                  style={{ 
                    backgroundColor: `${primaryColor}10`,
                    color: primaryColor,
                    border: `1px solid ${primaryColor}20`
                  }}
                >

                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Columna derecha - Información adicional */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles size={18} style={{ color: primaryColor }} />
                Información del video
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                    <Film size={14} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Tipo</p>
                    <p className="text-sm font-medium text-gray-700">{videoTypeStyle.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                    <FaYoutube size={14} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Plataforma</p>
                    <p className="text-sm font-medium text-gray-700">YouTube</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                    <Calendar size={14} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">ID del video</p>
                    <p className="text-sm font-medium text-gray-700">#{item.video_id}</p>
                  </div>
                </div>
              </div>

              {/* Compartir en redes */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-3">Compartir en redes</p>
                <div className="flex items-center gap-3">
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-[#1877f2] flex items-center justify-center text-white"
                  >
                    <FaFacebook size={14} />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(item.video_titulo)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white"
                  >
                    <FaTwitter size={14} />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href={`https://wa.me/?text=${encodeURIComponent(item.video_titulo + ' - ' + window.location.href)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white"
                  >
                    <FaWhatsapp size={14} />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}