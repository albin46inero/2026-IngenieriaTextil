import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router";
import { motion } from "motion/react";
import { 
  Calendar, Sparkles, 
  Phone, Heart, ChevronRight
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

// Extraer información de fechas de la descripción
const extractDates = (descripcion) => {
  if (!descripcion) return null;
  const datePattern = /(\d{1,2})\/(\d{1,2})\/(\d{4})/g;
  const dates = [...descripcion.matchAll(datePattern)];
  if (dates.length > 0) {
    return {
      start: dates[0] ? new Date(`${dates[0][3]}-${dates[0][2]}-${dates[0][1]}`) : null,
      end: dates[1] ? new Date(`${dates[1][3]}-${dates[1][2]}-${dates[1][1]}`) : null
    };
  }
  return null;
};

export default function ServiciosView() {
  const { servicios, loading, institucion } = useOutletContext();
  const [filteredItems, setFilteredItems] = useState([]);

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  useEffect(() => {
    if (!servicios) return;
    
    let filtered = [...servicios];
    
    // Filtrar solo activos (serv_active === "1")
    filtered = filtered.filter(item => item.serv_active === "1");
    
    // Ordenar por ID más reciente
    filtered.sort((a, b) => b.serv_id - a.serv_id);
    
    setFilteredItems(filtered);
  }, [servicios]);

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
        
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 mb-4">
            <Heart size={14} style={{ color: primaryColor }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
              Bienestar universitario
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
                Servicios
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
          <p className="text-gray-500 mt-3 text-sm max-w-2xl mx-auto">
            Servicios ofrecidos por la carrera de psicología para la comunidad universitaria
          </p>
        </motion.div>

        {/* Grid de servicios */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Heart size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500">No hay servicios disponibles</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => {
              const dates = extractDates(item.serv_descripcion);
              
              return (
                <motion.div
                  key={item.serv_id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -6 }}
                  className="group h-full"
                >
                  {/* TODO el div es clickeable */}
                  <Link
                    to={`/servicios/${item.serv_id}`}
                    className="block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer"
                  >
                    {/* Imagen */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      {item.serv_imagen && item.serv_imagen.startsWith('http') ? (
                        <>
                          <img
                            src={item.serv_imagen}
                            alt={item.serv_nombre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </>
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)` }}
                        >
                          <Heart size={48} style={{ color: primaryColor }} className="opacity-30" />
                        </div>
                      )}
                      
                      {/* Badge ID */}

                    </div>

                    {/* Contenido */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-800 text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {item.serv_nombre}
                      </h3>
                      
                      {/* Teléfono */}
                      {item.serv_nro_celular && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Phone size={12} />
                          <span>{item.serv_nro_celular}</span>
                        </div>
                      )}

                      {/* Fechas si existen */}
                      {dates && dates.start && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Calendar size={12} />
                          <span>
                            {dates.start.toLocaleDateString()} 
                            {dates.end && ` - ${dates.end.toLocaleDateString()}`}
                          </span>
                        </div>
                      )}

                      {/* Indicador de que se puede hacer clic */}
                      <div className="mt-auto flex items-center justify-end pt-2 border-t border-gray-100">
                        <span className="flex items-center gap-1 text-xs font-medium transition-all duration-300 group-hover:translate-x-1" style={{ color: primaryColor }}>
                          <span>Ver detalles</span>
                          <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>

                    {/* Barra inferior animada */}
                    <motion.div 
                      className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-400">
              Mostrando {filteredItems.length} {filteredItems.length === 1 ? "servicio" : "servicios"} disponibles
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}