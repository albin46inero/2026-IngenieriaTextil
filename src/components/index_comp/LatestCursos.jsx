import { Link } from "react-router";
import { ArrowRight, MapPin, Calendar, Sparkles, ChevronRight, Zap, CalendarDays, PlayCircle } from "lucide-react";
import { motion } from "motion/react";

/**
 * LatestCursos
 * Props:
 *   cursos  {Array}  — de getGacetaEventos()
 *   loading {boolean}
 *   institucion {object} — para colores de la API
 */

function formatFecha(fecha) {
  if (!fecha) return "";
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const d = new Date(fecha);
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

// Función para obtener el estado del curso
function getCursoStatus(fechaInicio, fechaFin) {
  if (!fechaInicio) return { text: "", icon: null, color: "" };
  
  const ahora = new Date();
  const inicio = new Date(fechaInicio);
  const fin = fechaFin ? new Date(fechaFin) : null;
  
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const fechaInicioSinHora = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
  const fechaFinSinHora = fin ? new Date(fin.getFullYear(), fin.getMonth(), fin.getDate()) : null;
  
  const diffDiasInicio = (fechaInicioSinHora - hoy) / (1000 * 60 * 60 * 24);
  
  if (fin && hoy >= fechaInicioSinHora && hoy <= fechaFinSinHora) {
    return { text: "EN CURSO", icon: PlayCircle, color: "from-blue-500 to-indigo-600" };
  }
  
  if (diffDiasInicio >= 0 && diffDiasInicio <= 7) {
    return { text: "PRÓXIMAMENTE", icon: CalendarDays, color: "from-amber-500 to-orange-600" };
  }
  
  if (diffDiasInicio < 0 && diffDiasInicio >= -2) {
    return { text: "NUEVO", icon: Zap, color: "from-emerald-500 to-green-600" };
  }
  
  return { text: "", icon: null, color: "" };
}

// Función para colorear PNG con filtros CSS
const getColorFilter = (color) => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `brightness(0) saturate(100%) invert(${Math.round((1 - r/255) * 100)}%) sepia(100%) hue-rotate(${Math.round(Math.atan2(b, r) * 180 / Math.PI)}deg) saturate(500%)`;
};

// Componente decorador flotante con color de API
const FloatingDecorator = ({ src, size, x, y, delay, duration = 12, rotate = true, color = null }) => {
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

export default function LatestCursos({ cursos = [], loading, institucion }) {
  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  const activos = cursos.filter(c => c.det_estado === "1");
  const latestCurso = activos.find(c => c.tipo_curso_otro?.tipo_conv_curso_nombre === "CURSOS");
  const latestSeminario = activos.find(c => c.tipo_curso_otro?.tipo_conv_curso_nombre === "SEMINARIOS");
  const items = [latestCurso, latestSeminario].filter(Boolean);

  if (loading) {
    return (
      <section className="relative py-8 sm:py-10 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-24 h-5 bg-gray-200 rounded animate-pulse mb-1" />
          <div className="w-48 h-7 bg-gray-100 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="relative py-8 sm:py-10 lg:py-12 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      
      {/* ─── DECORADORES FLOTANTES CON COLORES DE API ────────────────────────── */}
     
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado - más compacto */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6 sm:mb-8 lg:mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full mb-2" style={{ backgroundColor: `${primaryColor}10` }}>
            <Sparkles size={12} style={{ color: primaryColor }} />
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
              Recientes
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Cursos y Seminarios
          </h2>
          <div 
            className="w-16 h-0.5 rounded-full mx-auto mt-2"
            style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
          />
          <p className="text-gray-500 mt-2 text-xs max-w-2xl mx-auto">
            Capacitación y formación continua para profesionales y estudiantes
          </p>
        </motion.div>

        {/* Grid más compacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {items.map((item, index) => {
            const status = getCursoStatus(item.det_fecha_ini, item.det_fecha_fin);
            
            return (
              <motion.div
                key={item.iddetalle_cursos_academicos}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={`/cursos/${item.iddetalle_cursos_academicos}`}
                  className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {/* Imagen - más compacta */}
                  <div className="relative h-44 sm:h-48 md:h-52 overflow-hidden bg-gray-100">
                    {item.det_img_portada ? (
                      <>
                        <img
                          src={item.det_img_portada}
                          alt={item.det_titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15)` }}
                      >
                        <span 
                          className="text-xl font-bold opacity-30"
                          style={{ color: primaryColor }}
                        >
                          {item.tipo_curso_otro?.tipo_conv_curso_nombre}
                        </span>
                      </div>
                    )}
                    
                    {/* Badge de tipo - más pequeño */}
                    <span 
                      className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md"
                      style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                    >
                      {item.tipo_curso_otro?.tipo_conv_curso_nombre}
                    </span>

                    {/* Badge de modalidad - más pequeño */}
                    <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-medium">
                      {item.det_modalidad}
                    </span>

                    {/* Badge de estado */}
                    {status.text && (
                      <motion.div
                        initial={{ scale: 0, x: -15 }}
                        animate={{ scale: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 400, delay: 0.15 }}
                        className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full shadow-md"
                        style={{ 
                          background: `linear-gradient(135deg, ${status.color.split(' ')[1]?.replace('to-', '') || '#10b981'}, ${status.color.split(' ')[2]?.replace('to-', '') || '#059669'})`
                        }}
                      >
                        <status.icon size={10} className="text-white" />
                        <span className="text-white text-[10px] font-bold">{status.text}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Contenido - más compacto */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {item.det_titulo}
                    </h3>

                    {/* Información del curso - más compacta */}
                    <div className="flex flex-col gap-1.5 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}10` }}>
                          <Calendar size={10} style={{ color: primaryColor }} />
                        </div>
                        <span className="truncate">Inicio: <span className="font-medium text-gray-700">{formatFecha(item.det_fecha_ini)}</span></span>
                      </div>
                      {item.det_fecha_fin && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}10` }}>
                            <Calendar size={10} style={{ color: primaryColor }} />
                          </div>
                          <span className="truncate">Fin: <span className="font-medium text-gray-700">{formatFecha(item.det_fecha_fin)}</span></span>
                        </div>
                      )}
                      {item.det_lugar_curso && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}10` }}>
                            <MapPin size={10} style={{ color: primaryColor }} />
                          </div>
                          <span className="truncate text-xs">{item.det_lugar_curso}</span>
                        </div>
                      )}
                    </div>

                    {/* Botón de acción - más compacto */}
                    <div className="flex items-center justify-end pt-2 border-t border-gray-100">
                      <motion.div
                        whileHover={{ x: 3 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300"
                        style={{ 
                          backgroundColor: `${primaryColor}10`,
                          color: primaryColor
                        }}
                      >
                        <span>Ver detalles</span>
                        <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Barra inferior animada - más delgada */}
                  <motion.div 
                    className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
                    style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Ver todos - más compacto */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center mt-6 sm:mt-8"
        >
          <Link
            to="/cursos"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 group"
            style={{ 
              backgroundColor: `${primaryColor}10`,
              color: primaryColor,
              border: `1px solid ${primaryColor}20`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${primaryColor}10`;
              e.currentTarget.style.color = primaryColor;
            }}
          >
            <span>Ver todos los cursos y seminarios</span>
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}