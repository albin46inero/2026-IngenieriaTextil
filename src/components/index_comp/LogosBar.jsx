import upeaLogo from "/logo/upeaLogo.png";
import logoUticCir from "/logo/logo_utic_cir.png";
import { motion } from "motion/react";

/**
 * LogosBar
 * Props:
 *   institucion {object}  — datos de getPrincipal()
 *   loading     {boolean}
 */
export default function LogosBar({ institucion, loading }) {
  // Obtener colores de la API
  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  const logos = [
    {
      href: "https://www.upea.edu.bo/",
      src: upeaLogo,
      alt: "UPEA",
      glowColor: "#dc2626",
    },
    {
      href: "#",
      src: institucion?.institucion_logo,
      alt: institucion?.institucion_nombre ?? "Psicología",
      glowColor: primaryColor,
    },
    {
      href: "https://sie.upea.bo",
      src: logoUticCir,
      alt: "SIE",
      glowColor: "#3b82f6",
    },
  ];

  if (loading) {
    return (
      <section className="py-6 sm:py-8 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10 md:gap-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-gray-800 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-6 sm:py-8 lg:py-10 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl"
          style={{ backgroundColor: primaryColor }}
        />
        <div 
          className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-3xl"
          style={{ backgroundColor: secondaryColor }}
        />
      </div>

      {/* Patrón de puntos */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, ${primaryColor} 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Logos - Centrado y responsive sin scroll */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10 md:gap-12 lg:gap-14">
          {logos.map((logo, index) => (
            logo.src && (
              <motion.a
                key={logo.alt}
                href={logo.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.05 }}
                className="group"
              >
                {/* Contenedor del logo con efecto de brillo */}
                <div className="relative">
                  {/* Anillo decorativo al hover */}
                  <div 
                    className="absolute -inset-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"
                    style={{ 
                      background: `radial-gradient(circle, ${logo.glowColor}80, transparent)`,
                      boxShadow: `0 0 25px ${logo.glowColor}`
                    }}
                  />
                  
                  {/* Logo */}
                  <div className="relative">
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain rounded-full drop-shadow-xl group-hover:drop-shadow-2xl transition-all duration-300"
                      style={{
                        filter: `drop-shadow(0 0 10px ${logo.glowColor}60)`
                      }}
                    />
                  </div>
                </div>
              </motion.a>
            )
          ))}
        </div>

        {/* Línea decorativa inferior */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 sm:mt-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />
      </div>
    </section>
  );
}