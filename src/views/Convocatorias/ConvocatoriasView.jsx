import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router";
import DOMPurify from 'dompurify';
import { motion } from "motion/react";
import { 
  Calendar, Sparkles, ChevronRight, 
  Megaphone, Bell, FileText 
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
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const d = new Date(fecha);
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

// Obtener estilo por tipo
const getTypeStyle = (tipo) => {
  const styles = {
    CONVOCATORIAS: {
      bg: "from-rose-500 to-orange-500",
      icon: Megaphone,
      label: "Convocatoria",
      color: "#e68600"
    },
    COMUNICADOS: {
      bg: "from-blue-500 to-indigo-500",
      icon: FileText,
      label: "Comunicado",
      color: "#3b82f6"
    },
    AVISOS: {
      bg: "from-amber-500 to-yellow-500",
      icon: Bell,
      label: "Aviso",
      color: "#f59e0b"
    }
  };
  return styles[tipo] || styles.CONVOCATORIAS;
};

export default function ConvocatoriasView({ tipo = "CONVOCATORIAS" }) {
  const { convocatorias, loading, institucion } = useOutletContext();
  const [filteredItems, setFilteredItems] = useState([]);

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  const typeStyle = getTypeStyle(tipo);
  const titleMap = {
    CONVOCATORIAS: "Convocatorias",
    COMUNICADOS: "Comunicados",
    AVISOS: "Avisos"
  };

  useEffect(() => {
    if (!convocatorias) return;
    
    let filtered = [...convocatorias];
    
    // Filtrar por tipo exacto
    filtered = filtered.filter(
      item => item.tipo_conv_comun?.tipo_conv_comun_titulo === tipo
    );
    
    // Ordenar por fecha más reciente
    filtered.sort((a, b) => new Date(b.con_fecha_inicio) - new Date(a.con_fecha_inicio));
    
    setFilteredItems(filtered);
  }, [convocatorias, tipo]);

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
            <typeStyle.icon size={14} style={{ color: primaryColor }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
              {titleMap[tipo]}
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
                {titleMap[tipo]}
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
            Listado oficial de {titleMap[tipo].toLowerCase()}
          </p>
        </motion.div>

        {/* Grid de resultados */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <typeStyle.icon size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500">No hay {titleMap[tipo].toLowerCase()} disponibles</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => {
              const isExpired = new Date(item.con_fecha_fin) < new Date();
              
              return (
                <motion.div
                  key={item.idconvocatorias}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -6 }}
                >
                  <Link
                    to={`/convocatorias/${item.idconvocatorias}`}
                    className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col"
                  >
                    {/* Imagen */}
                    <div className="relative h-44 overflow-hidden bg-gray-100">
                      {item.con_foto_portada ? (
                        <>
                          <img
                            src={item.con_foto_portada}
                            alt={item.con_titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </>
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)` }}
                        >
                          <typeStyle.icon size={40} style={{ color: primaryColor }} className="opacity-30" />
                        </div>
                      )}
                      
                      {/* Badge tipo */}
                      <span 
                        className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md bg-gradient-to-r ${typeStyle.bg}`}
                      >
                        {typeStyle.label}
                      </span>

                      {/* Badge estado */}
                      {isExpired && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                          FINALIZADO
                        </span>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="p-4 flex-1 flex-col">
                      <h3 className="font-bold text-gray-800 text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {item.con_titulo}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <Calendar size={12} />
                        <span>{formatFecha(item.con_fecha_inicio)}</span>
                        {item.con_fecha_fin && (
                          <>
                            <span>-</span>
                            <span>{formatFecha(item.con_fecha_fin)}</span>
                          </>
                        )}
                      </div>

                      {item.con_descripcion && (
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                          {DOMPurify.sanitize(item.con_descripcion.replace(/<[^>]*>/g, "").substring(0, 100))}...
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-end pt-2 border-t border-gray-100">
                        <motion.div
                          whileHover={{ x: 3 }}
                          className="flex items-center gap-1 text-xs font-medium"
                          style={{ color: primaryColor }}
                        >
                          <span>Ver detalles</span>
                          <ChevronRight size={12} />
                        </motion.div>
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
              Mostrando {filteredItems.length} {filteredItems.length === 1 ? "resultado" : "resultados"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}