import { Link } from "react-router";
import {
  ArrowRight,
  Calendar,
  Clock,
  Eye,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

/**
 * LatestConvocatorias
 * Props:
 *   convocatorias {Array}  — de getGacetaEventos()
 *   loading       {boolean}
 *   institucion   {object}  — para colores de la API
 */

function formatFecha(fecha) {
  if (!fecha) return "";
  const meses = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];
  const d = new Date(fecha);
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

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

export default function LatestConvocatorias({
  convocatorias = [],
  loading,
  institucion,
}) {
  // Obtener colores de la API
  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  // Tomamos la última de cada tipo
  const activas = convocatorias.filter((c) => c.con_estado === "1");

  const ultima = (tipo) =>
    activas.find((c) => c.tipo_conv_comun?.tipo_conv_comun_titulo === tipo) ??
    null;

  const items = [
    ultima("CONVOCATORIAS"),
    ultima("COMUNICADOS"),
    ultima("AVISOS"),
  ].filter(Boolean);

  // Mapa de colores por tipo
  const getBadgeStyle = (tipo) => {
    const styles = {
      CONVOCATORIAS: {
        bg: "from-rose-500 to-orange-500",
        text: "Convocatoria",
      },
      COMUNICADOS: { bg: "from-blue-500 to-indigo-500", text: "Comunicado" },
      AVISOS: { bg: "from-amber-500 to-yellow-500", text: "Aviso" },
    };
    return (
      styles[tipo] || {
        bg: `from-[${primaryColor}] to-[${secondaryColor}]`,
        text: tipo,
      }
    );
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-32 sm:w-48 h-6 sm:h-8 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="w-48 sm:w-64 h-8 sm:h-10 bg-gray-100 rounded animate-pulse mb-8 sm:mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 sm:h-96 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="relative py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      
      {/* ─── DECORADORES FLOTANTES CON COLORES DE API ────────────────────────── */}
      
      {/* Esquina superior izquierda - color primario */}

      
      {/* Esquina superior derecha - color secundario */}

      
      {/* Esquina inferior izquierda - color primario */}

      
      {/* Esquina inferior derecha - color secundario */}

      
      {/* Centro flotante - color primario */}

      
      {/* Centro derecha flotante - color secundario */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado mejorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-1 rounded-full"
                style={{ backgroundColor: primaryColor }}
              />
              <p
                className="text-xs sm:text-sm font-semibold uppercase tracking-wider"
                style={{ color: primaryColor }}
              >
                Lo más reciente
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
              Convocatorias,{" "}
              <span className="relative inline-block">
                Comunicados y Avisos
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
                  style={{ backgroundColor: `${primaryColor}40` }}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                />
              </span>
            </h2>
          </div>
          <Link
            to="/convocatorias"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 group"
            style={{
              color: primaryColor,
              backgroundColor: `${primaryColor}10`,
              border: `1px solid ${primaryColor}20`,
            }}
          >
            <span>Ver todas</span>
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>

        {/* Cards con animaciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {items.map((item, index) => {
            const badgeStyle = getBadgeStyle(
              item.tipo_conv_comun?.tipo_conv_comun_titulo,
            );
            const isNew =
              new Date(item.con_fecha_inicio) >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

            return (
              <motion.div
                key={item.idconvocatorias}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
              >
                <Link
                  to={`/convocatorias/${item.idconvocatorias}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                  style={{ boxShadow: `0 10px 40px -15px ${primaryColor}30` }}
                >
                  {/* Imagen con overlay mejorado */}
                  <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden bg-gray-100">
                    {item.con_foto_portada ? (
                      <>
                        <img
                          src={item.con_foto_portada}
                          alt={item.con_titulo}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </>
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`,
                        }}
                      >
                        <span
                          className="text-4xl font-bold opacity-30"
                          style={{ color: primaryColor }}
                        >
                          {item.tipo_conv_comun?.tipo_conv_comun_titulo?.[0]}
                        </span>
                      </div>
                    )}

                    {/* Badge tipo mejorado */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-lg bg-gradient-to-r ${badgeStyle.bg} text-white`}
                      >
                        {badgeStyle.text}
                      </span>
                      {isNew && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-green-500 text-white shadow-lg">
                          <Sparkles size={10} />
                          NUEVO
                        </span>
                      )}
                    </div>

                    {/* Indicador de popularidad */}
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <div className="flex items-center gap-1 text-white/80 text-[10px]">
                        <Eye size={10} />
                        <span>Ver detalles</span>
                      </div>
                    </div>
                  </div>

                  {/* Contenido mejorado */}
                  <div className="p-4 sm:p-5 bg-white">
                    <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-2 mb-3 text-sm sm:text-base md:text-lg">
                      {item.con_titulo}
                    </h3>

                    {/* Información de fecha mejorada */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={13} />
                        <span>{formatFecha(item.con_fecha_inicio)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock size={12} />
                        <span>{getRelativeTime(item.con_fecha_inicio)}</span>
                      </div>
                    </div>

                    {/* Descripción corta si existe */}
                    {item.con_descripcion && (
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                        {item.con_descripcion
                          .replace(/<[^>]*>/g, "")
                          .substring(0, 100)}
                        ...
                      </p>
                    )}

                    {/* Botón de acción */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="text-xs font-medium flex items-center gap-1"
                        style={{ color: primaryColor }}
                      >
                        Leer más
                      </motion.div>
                      <motion.div
                        animate={{
                          x: [0, 6, 0],
                          rotateY: [0, 180, 360],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                          ease: "linear",
                        }}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300 cursor-pointer shadow-sm"
                      >
                        <ArrowRight size={14} style={{ color: primaryColor }} />
                      </motion.div>
                    </div>
                  </div>

                  {/* Borde inferior animado */}
                  <motion.div
                    className="h-1"
                    style={{ backgroundColor: primaryColor }}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Ver todas responsive */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 sm:mt-10 text-center md:hidden"
        >
          <Link
            to="/convocatorias"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300"
            style={{
              backgroundColor: `${primaryColor}10`,
              color: primaryColor,
              border: `1px solid ${primaryColor}20`,
            }}
          >
            Ver todas las convocatorias
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}