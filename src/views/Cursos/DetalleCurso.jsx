import { useState, useEffect } from "react";
import { useParams, Link, useOutletContext } from "react-router";
import DOMPurify from 'dompurify';
import { motion } from "motion/react";
import { 
  ArrowLeft, Calendar, Clock, MapPin, 
  DollarSign, Users, Award, BookOpen,
  GraduationCap, Sparkles, CheckCircle,
  AlertCircle, ExternalLink, CalendarDays,
  FileText, Target, Trophy, CreditCard,
  UserCheck, Timer, Globe, MessageCircle
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

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

// Formatear hora
function formatHora(hora) {
  if (!hora) return "";
  return hora.substring(0, 5);
}

// Obtener estilo por tipo de curso
const getTipoCursoStyle = (tipo) => {
  const styles = {
    CURSOS: {
      bg: "from-emerald-500 to-teal-500",
      icon: GraduationCap,
      label: "Curso",
      color: "#10b981"
    },
    SEMINARIOS: {
      bg: "from-purple-500 to-fuchsia-500",
      icon: Award,
      label: "Seminario",
      color: "#8b5cf6"
    },
    default: {
      bg: "from-blue-500 to-indigo-500",
      icon: BookOpen,
      label: "Capacitación",
      color: "#3b82f6"
    }
  };
  return styles[tipo] || styles.default;
};

export default function DetalleCurso() {
  const { id } = useParams();
  const { cursos, loading, institucion } = useOutletContext();
  const [item, setItem] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [registered, setRegistered] = useState(false);

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  useEffect(() => {
    if (!cursos) return;
    const found = cursos.find(c => c.iddetalle_cursos_academicos === parseInt(id));
    if (found) {
      setItem(found);
    } else {
      setNotFound(true);
    }
  }, [cursos, id]);

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
          <p className="text-gray-500 mb-6">El curso o seminario que buscas no existe</p>
          <Link
            to="/cursos"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ 
              backgroundColor: `${primaryColor}10`,
              color: primaryColor,
              border: `1px solid ${primaryColor}20`
            }}
          >
            <ArrowLeft size={16} />
            Volver a cursos
          </Link>
        </div>
      </div>
    );
  }

  const tipoStyle = getTipoCursoStyle(item.tipo_curso_otro?.tipo_conv_curso_nombre);
  const isActive = new Date(item.det_fecha_ini) <= new Date() && new Date() <= new Date(item.det_fecha_fin);
  const isUpcoming = new Date(item.det_fecha_ini) > new Date();

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
            to="/cursos"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:translate-x-[-4px]"
            style={{ color: primaryColor }}
          >
            <ArrowLeft size={16} />
            Volver a cursos
          </Link>
        </motion.div>

        {/* Contenido principal - Responsivo */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Columna izquierda - Imagen (30% en desktop, 100% en móvil) */}
          <div className="w-full lg:w-2/5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="sticky top-24"
            >
              {/* Imagen */}
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-2xl">
                {item.det_img_portada && item.det_img_portada.startsWith('http') ? (
                  <>
                    <img
                      src={item.det_img_portada}
                      alt={item.det_titulo}
                      className="w-full h-auto object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </>
                ) : (
                  <div 
                    className="w-full h-80 flex flex-col items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)` }}
                  >
                    <tipoStyle.icon size={80} style={{ color: primaryColor }} className="opacity-30" />
                    <p className="text-gray-400 mt-4">Sin imagen disponible</p>
                  </div>
                )}
              </div>

              {/* Botones de acción - Responsivos */}
              <div className="mt-4 space-y-3">


              </div>
            </motion.div>
          </div>

          {/* Columna derecha - Información (70% en desktop, 100% en móvil) */}
          <div className="w-full lg:w-3/5">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Badges - Responsivos */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span 
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-md bg-gradient-to-r ${tipoStyle.bg} text-white`}
                >
                  <tipoStyle.icon size={14} />
                  {tipoStyle.label}
                </span>
                {isActive && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-green-500 text-white shadow-md">
                    <Sparkles size={12} />
                    EN CURSO
                  </span>
                )}
                {isUpcoming && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-500 text-white shadow-md">
                    <CalendarDays size={12} />
                    PRÓXIMAMENTE
                  </span>
                )}
              </div>

              {/* Título - Responsivo */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                {item.det_titulo}
              </h1>

              {/* Grid de información - Responsivo (2 columnas en tablet, 1 en móvil) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}15` }}>
                    <Calendar size={18} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Fecha de inicio</p>
                    <p className="text-sm font-medium text-gray-700">{formatFecha(item.det_fecha_ini)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}15` }}>
                    <CalendarDays size={18} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Fecha de fin</p>
                    <p className="text-sm font-medium text-gray-700">{formatFecha(item.det_fecha_fin)}</p>
                  </div>
                </div>
                {item.det_hora_ini && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}15` }}>
                      <Clock size={18} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Horario</p>
                      <p className="text-sm font-medium text-gray-700">{formatHora(item.det_hora_ini)}</p>
                    </div>
                  </div>
                )}
                {item.det_lugar_curso && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}15` }}>
                      <MapPin size={18} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Lugar</p>
                      <p className="text-sm font-medium text-gray-700">{item.det_lugar_curso}</p>
                    </div>
                  </div>
                )}
                {item.det_modalidad && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}15` }}>
                      <Globe size={18} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Modalidad</p>
                      <p className="text-sm font-medium text-gray-700">{item.det_modalidad}</p>
                    </div>
                  </div>
                )}
                {item.det_carga_horaria && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}15` }}>
                      <Timer size={18} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Carga horaria</p>
                      <p className="text-sm font-medium text-gray-700">{item.det_carga_horaria} horas</p>
                    </div>
                  </div>
                )}
                {item.det_cupo_max && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}15` }}>
                      <Users size={18} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Cupo máximo</p>
                      <p className="text-sm font-medium text-gray-700">{item.det_cupo_max} participantes</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Costos - Responsivo */}
              {(item.det_costo > 0 || item.det_costo_ext > 0) && (
                <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: `${primaryColor}08` }}>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <DollarSign size={18} style={{ color: primaryColor }} />
                    Costos de inscripción
                  </h3>
                  <div className="space-y-2">
                    {item.det_costo > 0 && (
                      <div className="flex flex-wrap justify-between items-center py-2 border-b border-gray-200 last:border-0">
                        <span className="text-sm text-gray-600">Estudiantes UPEA:</span>
                        <span className="text-lg font-bold" style={{ color: primaryColor }}>Bs. {item.det_costo}</span>
                      </div>
                    )}
                    {item.det_costo_ext > 0 && (
                      <div className="flex flex-wrap justify-between items-center py-2 border-b border-gray-200 last:border-0">
                        <span className="text-sm text-gray-600">Público en general:</span>
                        <span className="text-lg font-bold" style={{ color: primaryColor }}>Bs. {item.det_costo_ext}</span>
                      </div>
                    )}
                    {item.det_costo_profe > 0 && (
                      <div className="flex flex-wrap justify-between items-center py-2 border-b border-gray-200 last:border-0">
                        <span className="text-sm text-gray-600">Profesionales:</span>
                        <span className="text-lg font-bold" style={{ color: primaryColor }}>Bs. {item.det_costo_profe}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Descripción - Responsiva */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText size={20} style={{ color: primaryColor }} />
                  Descripción del curso
                </h3>
                <div 
                  className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(item.det_descripcion || "Sin descripción disponible") 
                  }}
                />
              </div>

              {/* Código del curso */}


              {/* Metadatos - Responsivos */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3">
 

              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}