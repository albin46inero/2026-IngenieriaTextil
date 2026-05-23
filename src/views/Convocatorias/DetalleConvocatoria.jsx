import { useState, useEffect } from "react";
import { useParams, Link, useOutletContext } from "react-router";
import DOMPurify from 'dompurify';
import { motion } from "motion/react";
import { 
  Calendar, Sparkles, 
  ArrowLeft, Download, FileText, 
  CalendarDays, Tag, XCircle, CheckCircle
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
    CONVOCATORIAS: {
      bg: "from-rose-500 to-orange-500",
      icon: "📢",
      label: "Convocatoria",
      color: "#e68600"
    },
    COMUNICADOS: {
      bg: "from-blue-500 to-indigo-500",
      icon: "📄",
      label: "Comunicado",
      color: "#3b82f6"
    },
    AVISOS: {
      bg: "from-amber-500 to-yellow-500",
      icon: "🔔",
      label: "Aviso",
      color: "#f59e0b"
    }
  };
  return styles[tipo] || styles.CONVOCATORIAS;
};

export default function DetalleConvocatoria() {
  const { id } = useParams();
  const { convocatorias, loading, institucion } = useOutletContext();
  const [item, setItem] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  useEffect(() => {
    if (!convocatorias) return;
    const found = convocatorias.find(c => c.idconvocatorias === parseInt(id));
    if (found) {
      setItem(found);
    } else {
      setNotFound(true);
    }
  }, [convocatorias, id]);

  // Función para descargar imagen
  const handleDownloadImage = () => {
    if (item?.con_foto_portada) {
      const link = document.createElement("a");
      link.href = item.con_foto_portada;
      link.download = `convocatoria_${item.idconvocatorias}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
            <XCircle size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No encontrado</h2>
          <p className="text-gray-500 mb-6">La convocatoria que buscas no existe</p>
          <Link
            to="/convocatorias"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ 
              backgroundColor: `${primaryColor}10`,
              color: primaryColor,
              border: `1px solid ${primaryColor}20`
            }}
          >
            <ArrowLeft size={16} />
            Volver a convocatorias
          </Link>
        </div>
      </div>
    );
  }

  const typeStyle = getTypeStyle(item.tipo_conv_comun?.tipo_conv_comun_titulo);
  const isExpired = new Date(item.con_fecha_fin) < new Date();
  const isActive = new Date(item.con_fecha_inicio) <= new Date() && new Date() <= new Date(item.con_fecha_fin);

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
            to="/convocatorias"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:translate-x-[-4px]"
            style={{ color: primaryColor }}
          >
            <ArrowLeft size={16} />
            Volver a convocatorias
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
                {item.con_foto_portada ? (
                  <>
                    <img
                      src={item.con_foto_portada}
                      alt={item.con_titulo}
                      className="w-full h-auto object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </>
                ) : (
                  <div 
                    className="w-full h-96 flex flex-col items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)` }}
                  >
                    <span className="text-8xl opacity-30">{typeStyle.icon}</span>
                    <p className="text-gray-400 mt-4">Sin imagen disponible</p>
                  </div>
                )}
              </div>

              {/* Botón descargar imagen */}
              {item.con_foto_portada && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={handleDownloadImage}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                  style={{ 
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    color: 'white'
                  }}
                >
                  <Download size={16} />
                  Descargar imagen
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Columna derecha - Información */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Badge tipo y estado */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span 
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-md bg-gradient-to-r ${typeStyle.bg} text-white`}
              >
                <span>{typeStyle.icon}</span>
                {typeStyle.label}
              </span>
              
              {isActive && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-green-500 text-white shadow-md">
                  <CheckCircle size={12} />
                  ACTIVO
                </span>
              )}
              {isExpired && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-red-500 text-white shadow-md">
                  <XCircle size={12} />
                  FINALIZADO
                </span>
              )}
            </div>

            {/* Título */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              {item.con_titulo}
            </h1>

            {/* Información de fechas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                  <Calendar size={16} style={{ color: primaryColor }} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Fecha de inicio</p>
                  <p className="text-sm font-medium text-gray-700">{formatFecha(item.con_fecha_inicio)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                  <CalendarDays size={16} style={{ color: primaryColor }} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Fecha de cierre</p>
                  <p className="text-sm font-medium text-gray-700">{formatFecha(item.con_fecha_fin)}</p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FileText size={18} style={{ color: primaryColor }} />
                Descripción
              </h3>
              <div 
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                
          
                dangerouslySetInnerHTML={{ __html: item.con_descripcion || "Sin descripción disponible" }}
              />
            </div>

            {/* Metadatos adicionales */}

          </motion.div>
        </div>
      </div>
    </div>
  );
}