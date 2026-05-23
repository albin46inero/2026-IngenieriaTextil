import { useState, useEffect } from "react";
import DOMPurify from 'dompurify';
import { useParams, Link, useOutletContext } from "react-router";
import { motion } from "motion/react";
import { 
  ArrowLeft, Calendar, Clock, MapPin, 
  CalendarDays, Users, Heart, Share2, 
  Eye, AlertCircle, Ticket, CheckCircle,
  GraduationCap, Music, Trophy, Sparkles,
  Download, Printer, ExternalLink, MessageCircle
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

// Formatear hora
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

export default function DetalleEvento() {
  const { id } = useParams();
  const { eventos, loading, institucion } = useOutletContext();
  const [item, setItem] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  useEffect(() => {
    if (!eventos) return;
    const found = eventos.find(e => e.evento_id === parseInt(id));
    if (found) {
      setItem(found);
    } else {
      setNotFound(true);
    }
  }, [eventos, id]);

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
          <p className="text-gray-500 mb-6">El evento que buscas no existe</p>
          <Link
            to="/eventos"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ 
              backgroundColor: `${primaryColor}10`,
              color: primaryColor,
              border: `1px solid ${primaryColor}20`
            }}
          >
            <ArrowLeft size={16} />
            Volver a eventos
          </Link>
        </div>
      </div>
    );
  }

  const tipoStyle = getTipoEventoStyle(item.tipo_evento);
  const isUpcoming = new Date(item.evento_fecha) > new Date();
  const isToday = new Date(item.evento_fecha).toDateString() === new Date().toDateString();

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
            to="/eventos"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:translate-x-[-4px]"
            style={{ color: primaryColor }}
          >
            <ArrowLeft size={16} />
            Volver a eventos
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
                {item.evento_imagen && item.evento_imagen.startsWith('http') ? (
                  <>
                    <img
                      src={item.evento_imagen}
                      alt={item.evento_titulo}
                      className="w-full h-auto object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </>
                ) : (
                  <div 
                    className="w-full h-96 flex flex-col items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)` }}
                  >
                    <tipoStyle.icon size={80} style={{ color: primaryColor }} className="opacity-30" />
                    <p className="text-gray-400 mt-4">Sin imagen disponible</p>
                  </div>
                )}
              </div>

              {/* Acciones rápidas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 flex items-center justify-center gap-3 flex-wrap"
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
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-md bg-gradient-to-r ${tipoStyle.bg} text-white`}
              >
                <tipoStyle.icon size={12} />
                {tipoStyle.label}
              </span>
              {isUpcoming && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-green-500 text-white shadow-md">
                  <Sparkles size={12} />
                  PRÓXIMAMENTE
                </span>
              )}
              {isToday && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-500 text-white shadow-md">
                  <CheckCircle size={12} />
                  ¡HOY ES EL DÍA!
                </span>
              )}
            </div>

            {/* Título */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              {item.evento_titulo}
            </h1>

            {/* Información del evento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                  <Calendar size={16} style={{ color: primaryColor }} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Fecha</p>
                  <p className="text-sm font-medium text-gray-700">{formatFecha(item.evento_fecha)}</p>
                </div>
              </div>
              {item.evento_hora && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                    <Clock size={16} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Hora</p>
                    <p className="text-sm font-medium text-gray-700">{formatHora(item.evento_hora)}</p>
                  </div>
                </div>
              )}
              {item.evento_lugar && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                    <MapPin size={16} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Lugar</p>
                    <p className="text-sm font-medium text-gray-700">{item.evento_lugar}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                  <Users size={16} style={{ color: primaryColor }} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Organizador</p>
                  <p className="text-sm font-medium text-gray-700">Carrera de Psicología - UPEA</p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Eye size={18} style={{ color: primaryColor }} />
                Descripción del evento
              </h3>
              <div 
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.evento_descripcion || "Sin descripción disponible") }}
              />
            </div>

            {/* Enlaces adicionales */}
            <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: `${primaryColor}05` }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  
                </div>

              </div>
            </div>

            {/* Metadatos */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">

              <div className="flex items-center gap-3">

              </div>
            </div>
          </motion.div>
        </div>

        {/* Galería de imágenes (si existe) */}
        {item.galeria && item.galeria.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Camera size={20} style={{ color: primaryColor }} />
              Galería de imágenes
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {item.galeria.slice(0, 4).map((img, idx) => (
                <motion.img
                  key={idx}
                  src={img}
                  alt={`Galería ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}