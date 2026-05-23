import { useState } from "react";
import { ChevronDown, Target, Eye, Compass, Zap } from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";

const items = [
  { key: "institucion_mision", label: "Misión", icon: Target },
  { key: "institucion_vision", label: "Visión", icon: Eye },
  { key: "institucion_objetivos", label: "Objetivos", icon: Compass },
];

export default function MisionVisionAcordion({ institucion, loading }) {
  const [open, setOpen] = useState("institucion_mision");

  // Obtener colores de la API
  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  // Estilos dinámicos
  const gradientInline = {
    backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-white/10 backdrop-blur-sm rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative min-h-[800px]">
     
      

    

      {/* Contenido del acordeón (encima de las imágenes) */}
      <div className="relative z-10 flex flex-col gap-4">
        {items.map((item) => {
          const isOpen = open === item.key;
          const content = institucion?.[item.key];
          const Icon = item.icon;

          return (
            <motion.div
              key={item.key}
              layout
              className="relative"
            >
              {/* Fondo glassmorphism MEJORADO */}
              <div 
                className={`absolute inset-0 backdrop-blur-md rounded-2xl transition-all duration-300 ${
                  isOpen ? 'shadow-2xl' : 'shadow-lg'
                }`}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  boxShadow: isOpen ? `0 25px 50px -12px ${primaryColor}40` : `0 10px 30px -5px ${primaryColor}20`,
                  border: `1px solid ${primaryColor}15`
                }}
              />
              
              <div className="relative z-10">
                <button
                  onClick={() => setOpen(isOpen ? null : item.key)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left"
                >
                  {/* Icono con gradiente */}
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                    style={gradientInline}
                  >
                    <Icon size={24} className="text-white" />
                  </div>

                  {/* Texto */}
                  <div className="flex-1">
                    <h3 
                      className="text-xl font-black"
                      style={{ color: isOpen ? primaryColor : '#1f2937' }}
                    >
                      {item.label}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {isOpen ? "▼ Expandido" : "▶ Click para expandir"}
                    </p>
                  </div>

                  {/* Indicador animado */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={isOpen ? gradientInline : { backgroundColor: '#f3f4f6' }}
                  >
                    <ChevronDown 
                      size={18} 
                      className={isOpen ? "text-white" : "text-gray-600"} 
                    />
                  </motion.div>
                </button>

                {/* Contenido expandible */}
                <AnimatePresence>
                  {isOpen && content && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-white/30">
                        {/* Línea decorativa */}
                        <div 
                          className="w-12 h-1 rounded-full mb-4"
                          style={gradientInline}
                        />
                        <div 
                          className="text-gray-700 leading-relaxed text-sm prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: content }}
                        />
                        
                        {/* Efecto de brillo */}
                        <div className="mt-4 flex justify-end">
                          <Zap size={14} style={{ color: primaryColor }} className="opacity-50" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}

        {/* Link estilizado */}
        <Link
          to="/about"
          className="group relative mt-6 flex items-center justify-between px-6 py-4 rounded-xl backdrop-blur-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            border: `1px solid ${primaryColor}20`
          }}
        >
          <span 
            className="text-sm font-semibold transition-colors"
            style={{ color: primaryColor }}
          >
            Conoce más sobre nuestra carrera
          </span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ color: primaryColor }}
          >
            <ChevronDown size={18} className="-rotate-90" />
          </motion.div>
          
          {/* Efecto de fondo */}
          <div 
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            style={{
              background: `linear-gradient(90deg, transparent, ${primaryColor}20, transparent)`
            }}
          />
        </Link>
      </div>
    </div>
  );
}