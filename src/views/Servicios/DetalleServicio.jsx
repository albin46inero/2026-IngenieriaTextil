import { useState, useEffect } from "react";
import { useParams, Link, useOutletContext } from "react-router";
import DOMPurify from 'dompurify';
import { motion } from "motion/react";
import { 
  ArrowLeft, Phone, Calendar, Clock, 
  DollarSign, Heart, MapPin, Users,
  CheckCircle, FileText, AlertCircle
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

// Extraer información de fechas de la descripción
const extractDates = (descripcion) => {
  if (!descripcion) return null;
  const datePattern = /(\d{1,2})\/(\d{1,2})\/(\d{4})/g;
  const dates = [...descripcion.matchAll(datePattern)];
  if (dates.length > 0) {
    return {
      start: dates[0] ? `${dates[0][1]}/${dates[0][2]}/${dates[0][3]}` : null,
      end: dates[1] ? `${dates[1][1]}/${dates[1][2]}/${dates[1][3]}` : null
    };
  }
  return null;
};

// Extraer horario de la descripción
const extractSchedule = (descripcion) => {
  if (!descripcion) return null;
  const schedulePattern = /Horario de atención[\s\S]*?(\d{1,2}:\d{2}[\s-]*\d{1,2}:\d{2})/i;
  const match = descripcion.match(schedulePattern);
  return match ? match[1] : null;
};

// Extraer costo de la descripción
const extractCost = (descripcion) => {
  if (!descripcion) return null;
  const costPattern = /Bs\.?\s*(\d+)/g;
  const costs = [...descripcion.matchAll(costPattern)];
  if (costs.length > 0) {
    return costs.map(c => c[0]).join(', ');
  }
  return null;
};

// Limpiar HTML y mostrar texto formateado
const formatDescription = (html) => {
  if (!html) return "Sin descripción disponible";
  
  // Reemplazar etiquetas con formato HTML
  let formatted = html
    .replace(/<p>/g, '<p class="mb-3 text-gray-600 leading-relaxed">')
    .replace(/<strong>/g, '<strong class="font-semibold" style="color: var(--primary-color, #e68600);">')
    .replace(/<ul>/g, '<ul class="list-disc list-inside space-y-1 mb-3">')
    .replace(/<li>/g, '<li class="text-gray-600">')
    .replace(/<br\s*\/?>/g, '<br />');
  
  return formatted;
};

export default function DetalleServicio() {
  const { id } = useParams();
  const { servicios, loading, institucion } = useOutletContext();
  const [item, setItem] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  // Establecer variable CSS para el color primario
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    if (!servicios) return;
    const found = servicios.find(s => s.serv_id === parseInt(id));
    if (found) {
      setItem(found);
    } else {
      setNotFound(true);
    }
  }, [servicios, id]);

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
          <p className="text-gray-500 mb-6">El servicio que buscas no existe</p>
          <Link
            to="/servicios"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ 
              backgroundColor: `${primaryColor}10`,
              color: primaryColor,
              border: `1px solid ${primaryColor}20`
            }}
          >
            <ArrowLeft size={16} />
            Volver a servicios
          </Link>
        </div>
      </div>
    );
  }

  const dates = extractDates(item.serv_descripcion);
  const schedule = extractSchedule(item.serv_descripcion);
  const costs = extractCost(item.serv_descripcion);
  const formattedDesc = formatDescription(item.serv_descripcion);

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
            to="/servicios"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:translate-x-[-4px]"
            style={{ color: primaryColor }}
          >
            <ArrowLeft size={16} />
            Volver a servicios
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
                {item.serv_imagen && item.serv_imagen.startsWith('http') ? (
                  <>
                    <img
                      src={item.serv_imagen}
                      alt={item.serv_nombre}
                      className="w-full h-auto object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </>
                ) : (
                  <div 
                    className="w-full h-96 flex flex-col items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)` }}
                  >
                    <Heart size={80} style={{ color: primaryColor }} className="opacity-30" />
                    <p className="text-gray-400 mt-4">Sin imagen disponible</p>
                  </div>
                )}
              </div>

              {/* Contacto rápido */}
              {item.serv_nro_celular && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 p-4 rounded-xl"
                  style={{ backgroundColor: `${primaryColor}10` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}>
                      <Phone size={18} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Teléfono de contacto</p>
                      <a 
                        href={`tel:${item.serv_nro_celular}`}
                        className="text-sm font-semibold hover:underline"
                        style={{ color: primaryColor }}
                      >
                        {item.serv_nro_celular}
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Columna derecha - Información */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Badge */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span 
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-md"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  color: 'white'
                }}
              >
                <Heart size={12} />
                Servicio
              </span>
              
            </div>

            {/* Título */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              {item.serv_nombre}
            </h1>

            {/* Información adicional */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
              {dates && dates.start && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                    <Calendar size={16} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Fechas</p>
                    <p className="text-sm font-medium text-gray-700">
                      {dates.start}
                      {dates.end && ` - ${dates.end}`}
                    </p>
                  </div>
                </div>
              )}

              {schedule && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                    <Clock size={16} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Horario</p>
                    <p className="text-sm font-medium text-gray-700">{schedule}</p>
                  </div>
                </div>
              )}

              {costs && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                    <DollarSign size={16} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Costos</p>
                    <p className="text-sm font-medium text-gray-700">{costs}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Descripción completa */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FileText size={18} style={{ color: primaryColor }} />
                Descripción del servicio
              </h3>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formattedDesc) }}
              />
            </div>

            {/* Estado del servicio */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} style={{ color: primaryColor }} />
                <span className="text-xs text-gray-500">
                  Servicio {item.serv_active === "1" ? "activo" : "inactivo"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}