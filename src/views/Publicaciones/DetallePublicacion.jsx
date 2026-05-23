import { useState, useEffect } from "react";
import { useParams, Link, useOutletContext } from "react-router";
import { motion } from "motion/react";
import { 
  ArrowLeft, Calendar, User, BookOpen, 
  FileText, Eye, Heart, Share2, Bookmark,
  Clock, Download, ExternalLink, AlertCircle,
  ChevronRight, Sparkles
} from "lucide-react";

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

// Formatear fecha
function formatFecha(fecha) {
  if (!fecha) return "";
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const d = new Date(fecha);
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
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
      icon: Sparkles,
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

export default function DetallePublicacion() {
  const { id } = useParams();
  const { publicaciones, loading, institucion } = useOutletContext();
  const [item, setItem] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  useEffect(() => {
    if (!publicaciones) return;
    const found = publicaciones.find(p => p.publicaciones_id === parseInt(id));
    if (found) {
      setItem(found);
    } else {
      setNotFound(true);
    }
  }, [publicaciones, id]);

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
          <p className="text-gray-500 mb-6">La publicación que buscas no existe</p>
          <Link
            to="/publicaciones"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ 
              backgroundColor: `${primaryColor}10`,
              color: primaryColor,
              border: `1px solid ${primaryColor}20`
            }}
          >
            <ArrowLeft size={16} />
            Volver a publicaciones
          </Link>
        </div>
      </div>
    );
  }

  const typeStyle = getTypeStyle(item.publicaciones_tipo);
  const isNew = new Date(item.publicaciones_fecha) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

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
            to="/publicaciones"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:translate-x-[-4px]"
            style={{ color: primaryColor }}
          >
            <ArrowLeft size={16} />
            Volver a publicaciones
          </Link>
        </motion.div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Columna izquierda - Imagen */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="sticky top-24">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-2xl">
                {item.publicaciones_imagen && item.publicaciones_imagen.startsWith('http') ? (
                  <>
                    <img
                      src={item.publicaciones_imagen}
                      alt={item.publicaciones_titulo}
                      className="w-full h-auto object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </>
                ) : (
                  <div 
                    className="w-full h-96 flex flex-col items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)` }}
                  >
                    <BookOpen size={80} style={{ color: primaryColor }} className="opacity-30" />
                    <p className="text-gray-400 mt-4">Sin imagen disponible</p>
                  </div>
                )}
              </div>

              {/* Acciones rápidas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 flex items-center justify-center gap-3"
              >

              </motion.div>
            </div>
          </motion.div>

          {/* Columna derecha - Información */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span 
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-md bg-gradient-to-r ${typeStyle.bg} text-white`}
              >
                <typeStyle.icon size={12} />
                {typeStyle.label}
              </span>
              {isNew && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-green-500 text-white shadow-md">
                  <Sparkles size={12} />
                  NUEVA PUBLICACIÓN
                </span>
              )}
            </div>

            {/* Título */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              {item.publicaciones_titulo}
            </h1>

            {/* Información del autor y fecha */}
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
              {item.publicaciones_autor && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                    <User size={16} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Autor</p>
                    <p className="text-sm font-medium text-gray-700">{item.publicaciones_autor}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                  <Calendar size={16} style={{ color: primaryColor }} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Fecha de publicación</p>
                  <p className="text-sm font-medium text-gray-700">{formatFecha(item.publicaciones_fecha)}</p>
                </div>
              </div>
            </div>

            {/* Descripción completa */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FileText size={18} style={{ color: primaryColor }} />
                Descripción
              </h3>
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                {item.publicaciones_descripcion || "Sin descripción disponible"}
              </div>
            </div>

            {/* Documento adjunto */}
            {item.publicaciones_documento && item.publicaciones_documento !== "2" && (
              <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: `${primaryColor}08` }}>

              </div>
            )}

            {/* Metadatos adicionales */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">

              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Eye size={12} />
                <span>Publicación académica</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}