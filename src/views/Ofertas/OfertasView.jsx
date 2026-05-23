import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router";
import { motion } from "motion/react";
import { 
  Calendar, Sparkles, ChevronRight, 
  Briefcase, Clock, FileText, CheckCircle,
  AlertCircle
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
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const d = new Date(fecha);
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

export default function OfertasView() {
  const { ofertas, loading, institucion } = useOutletContext();
  const [filteredItems, setFilteredItems] = useState([]);

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  useEffect(() => {
    if (!ofertas) return;
    
    let filtered = [...ofertas];
    
    // Filtrar solo activos (ofertas_estado === 1)
    filtered = filtered.filter(item => item.ofertas_estado === 1);
    
    // Ordenar por ID más reciente
    filtered.sort((a, b) => b.ofertas_id - a.ofertas_id);
    
    setFilteredItems(filtered);
  }, [ofertas]);

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 mb-4">
            <Briefcase size={14} style={{ color: primaryColor }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
              Oportunidades
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
                Ofertas Académicas
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
            Oportunidades académicas, becas y programas especiales
          </p>
        </motion.div>

        {/* Grid de ofertas */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Briefcase size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500">No hay ofertas académicas disponibles</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => {
              const isExpired = new Date(item.ofertas_inscripciones_fin) < new Date();
              const isActive = new Date(item.ofertas_inscripciones_ini) <= new Date() && new Date() <= new Date(item.ofertas_inscripciones_fin);
              
              return (
                <motion.div
                  key={item.ofertas_id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -6 }}
                  className="group h-full"
                >
                  <Link
                    to={`/ofertas/${item.ofertas_id}`}
                    className="block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer"
                  >
                    {/* Imagen */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      {item.ofertas_imagen && item.ofertas_imagen.startsWith('http') ? (
                        <>
                          <img
                            src={item.ofertas_imagen}
                            alt={item.ofertas_titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </>
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)` }}
                        >
                          <Briefcase size={48} style={{ color: primaryColor }} className="opacity-30" />
                        </div>
                      )}
                      
                      {/* Badge ID */}


                      {/* Badge estado */}
                      {isActive && (
                        <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                          INSCRIPCIONES ABIERTAS
                        </span>
                      )}
                      {isExpired && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                          FINALIZADO
                        </span>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-800 text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {item.ofertas_titulo}
                      </h3>
                      
                      {/* Fechas de inscripción */}
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar size={12} />
                          <span>Inscripciones: {formatFecha(item.ofertas_inscripciones_ini)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>Hasta: {formatFecha(item.ofertas_inscripciones_fin)}</span>
                        </div>
                        {item.ofertas_fecha_examen && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FileText size={12} />
                            <span>Examen: {formatFecha(item.ofertas_fecha_examen)}</span>
                          </div>
                        )}
                      </div>

                      {/* Descripción corta */}
                      {item.ofertas_descripcion && (
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                          {item.ofertas_descripcion.substring(0, 100)}...
                        </p>
                      )}

                      {/* Indicador de clic */}
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
              Mostrando {filteredItems.length} {filteredItems.length === 1 ? "oferta" : "ofertas"} disponibles
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}