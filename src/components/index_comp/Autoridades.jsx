import { Phone, Mail, MapPin, Sparkles, User, Briefcase, ExternalLink } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { motion } from "motion/react";

/**
 * Autoridades
 * Props:
 *   autoridades {Array}  — de getAutoridades()
 *   loading {boolean}
 *   institucion {object} — para colores de la API
 */

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

export default function Autoridades({ autoridades = [], loading, institucion }) {
  // Obtener colores de la API
  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  if (loading) {
    return (
      <section className="relative py-10 sm:py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mb-2 mx-auto" />
          <div className="w-48 h-7 bg-gray-100 rounded animate-pulse mb-8 mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (autoridades.length === 0) return null;

  return (
    <section className="relative py-10 sm:py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      
      {/* ─── DECORADORES FLOTANTES - NUEVAS POSICIONES ────────────────────────── */}
     

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado mejorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            Nuestras{" "}
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
                Autoridades
              </span>
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
          <p className="text-gray-500 mt-2 text-xs sm:text-sm max-w-2xl mx-auto">
            Conoce a los profesionales que lideran nuestra institución
          </p>
        </motion.div>

        {/* Grid responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {autoridades.map((aut, index) => (
            <motion.div
              key={aut.id_autoridad}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex-col">
                
                {/* Foto con efectos mejorados */}
                <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {aut.foto_autoridad ? (
                    <>
                      <img
                        src={aut.foto_autoridad}
                        alt={aut.nombre_autoridad}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </>
                  ) : (
                    <div 
                      className="w-full h-full flex flex-col items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)` }}
                    >
                      <User size={48} style={{ color: primaryColor }} className="opacity-50" />
                      <span 
                        className="text-2xl font-bold mt-2 opacity-30"
                        style={{ color: primaryColor }}
                      >
                        {aut.nombre_autoridad?.[0]}
                      </span>
                    </div>
                  )}

                  {/* Badge decorativo */}


                  {/* Overlay con redes sociales - mejorado */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                    <div className="flex items-center gap-3">
                      {aut.facebook_autoridad && (
                        <motion.a
                          whileHover={{ scale: 1.1, y: -2 }}
                          href={aut.facebook_autoridad}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white/20 hover:bg-[#1877f2] p-2.5 rounded-full text-white transition-all duration-300 backdrop-blur-sm"
                        >
                          <FaFacebook size={16} />
                        </motion.a>
                      )}
                      {aut.twitter_autoridad && (
                        <motion.a
                          whileHover={{ scale: 1.1, y: -2 }}
                          href={aut.twitter_autoridad}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white/20 hover:bg-[#1da1f2] p-2.5 rounded-full text-white transition-all duration-300 backdrop-blur-sm"
                        >
                          <FaTwitter size={16} />
                        </motion.a>
                      )}
                      {aut.instagram_autoridad && (
                        <motion.a
                          whileHover={{ scale: 1.1, y: -2 }}
                          href={aut.instagram_autoridad}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white/20 hover:bg-[#e4405f] p-2.5 rounded-full text-white transition-all duration-300 backdrop-blur-sm"
                        >
                          <FaInstagram size={16} />
                        </motion.a>
                      )}
                      {aut.linkedin_autoridad && (
                        <motion.a
                          whileHover={{ scale: 1.1, y: -2 }}
                          href={aut.linkedin_autoridad}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white/20 hover:bg-[#0077b5] p-2.5 rounded-full text-white transition-all duration-300 backdrop-blur-sm"
                        >
                          <FaLinkedin size={16} />
                        </motion.a>
                      )}
                      {aut.celular_autoridad && (
                        <motion.a
                          whileHover={{ scale: 1.1, y: -2 }}
                          href={`https://wa.me/591${aut.celular_autoridad}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white/20 hover:bg-[#25d366] p-2.5 rounded-full text-white transition-all duration-300 backdrop-blur-sm"
                        >
                          <Phone size={14} />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información mejorada */}
                <div className="p-4 sm:p-5 flex-1 flex-col">
                  {/* Borde decorativo superior */}
                  <div 
                    className="w-12 h-1 rounded-full mb-3"
                    style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
                  />
                  
                  <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-1 leading-tight group-hover:text-primary transition-colors">
                    {aut.nombre_autoridad}
                  </h3>
                  
                  <p 
                    className="text-xs sm:text-sm font-medium mb-3"
                    style={{ color: primaryColor }}
                  >
                    {aut.cargo_autoridad}
                  </p>

                  {/* Información de contacto adicional */}
                  {(aut.email_autoridad || aut.oficina_autoridad) && (
                    <div className="mt-auto pt-3 border-t border-gray-100">
                      {aut.email_autoridad && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                          <Mail size={12} style={{ color: primaryColor }} />
                          <span className="truncate">{aut.email_autoridad}</span>
                        </div>
                      )}
                      {aut.oficina_autoridad && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MapPin size={12} style={{ color: primaryColor }} />
                          <span className="truncate">{aut.oficina_autoridad}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Barra inferior animada */}
                <motion.div 
                  className="h-1 w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Indicador de cantidad */}
        {autoridades.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-center mt-8 sm:mt-10"
          />
        )}
      </div>
    </section>
  );
}