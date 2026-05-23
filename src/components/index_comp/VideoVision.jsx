import { motion } from "motion/react";
import { Sparkles, Clock, Award, ExternalLink } from "lucide-react";

/**
 * VideoVision
 * Props:
 *   institucion {object} — datos de getPrincipal()
 *   loading     {boolean}
 */
export default function VideoVision({ institucion, loading }) {
  const videoUrl = institucion?.institucion_link_video_vision;
  
  // Obtener colores de la API
  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            <div className="space-y-3">
              <div className="w-32 h-4 bg-gray-800 rounded animate-pulse" />
              <div className="w-full h-10 bg-gray-800 rounded animate-pulse" />
              <div className="w-3/4 h-20 bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="w-full aspect-video bg-gray-800 rounded-2xl animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (!videoUrl) return null;

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      
      {/* Fondos decorativos animados */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: primaryColor }}
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: secondaryColor }}
        />
      </div>

      {/* Patrón de fondo de puntos */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, ${primaryColor} 2px, transparent 2px)`,
        backgroundSize: '30px 30px'
      }} />

      {/* Línea decorativa superior */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 items-center">
          
          {/* Texto - Lado izquierdo */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-3 sm:space-y-4"
          >
            {/* Badge institucional */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Sparkles size={14} style={{ color: primaryColor }} />
              <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: primaryColor }}>
                Video Institucional
              </span>
            </div>

            {/* Título principal */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Video Visión de la{" "}
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
                  Carrera
                </span>
                {/* Línea decorativa bajo "Carrera" */}
                <motion.div 
                  className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  viewport={{ once: true }}
                />
              </span>
            </h2>

            {/* Nombre de la carrera */}
            <h3 className="text-xl sm:text-2xl font-semibold text-white/80">
              {institucion?.institucion_nombre ?? "Psicología"}
            </h3>

            {/* Descripción */}
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base max-w-lg">
              Conoce nuestra propuesta educativa, nuestra misión y el compromiso
              con la salud mental y el bienestar de la sociedad boliviana.
            </p>
          </motion.div>

          {/* Video - Lado derecho (más grande) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative lg:col-span-1"
          >
            {/* Contenedor del video con efectos visuales */}
            <div className="relative group">
              {/* Brillo exterior */}
              <div 
                className="absolute -inset-1 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              />
              
              {/* Video iframe - más grande */}
              <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black">
                <div className="w-full" style={{ aspectRatio: '16/9' }}>
                  <iframe
                    src={videoUrl}
                    title={`Video visión — ${institucion?.institucion_nombre}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                
                {/* Overlay de gradiente en hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* Borde decorativo animado */}
              <motion.div 
                className="absolute -bottom-1 -right-1 w-20 h-20 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 rounded-br-xl" style={{ borderColor: primaryColor }} />
              </motion.div>
              <motion.div 
                className="absolute -top-1 -left-1 w-20 h-20 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 rounded-tl-xl" style={{ borderColor: primaryColor }} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Línea decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
}