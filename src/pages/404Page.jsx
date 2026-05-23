import { motion } from "motion/react";
import { Link } from "react-router";

export default function Page404() {
  const digits = ["4", "0", "4"];
  
  const colors = [
    { primary: "#4a7c3f", secondary: "#2d5a27" },
    { primary: "#8B5A2B", secondary: "#6B4226" },
    { primary: "#4a7c3f", secondary: "#2d5a27" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen flex items-center justify-center p-2 sm:p-0 -mt-4 sm:-mt-18"
    >
      <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-2 sm:px-0">
        
        {/* CONTENIDO SUPERIOR - 404 y frase */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-2 sm:gap-4 md:gap-6 mb-0 w-full">
          {/* Bloque del 404 */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 mb-0">
              {digits.map((digit, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotate: 0,
                    y: [0, -15, 0]
                  }}
                  transition={{ 
                    delay: index * 0.15,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200,
                    y: { 
                      duration: 1.5, 
                      repeat: Infinity, 
                      repeatDelay: 2,
                      ease: "easeInOut" 
                    }
                  }}
                  whileHover={{ 
                    scale: 1.3, 
                    rotate: 10,
                    transition: { duration: 0.2 }
                  }}
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-7xl font-bold cursor-default"
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    textShadow: `4px 4px 0px ${colors[index].secondary}, 8px 8px 0px rgba(0,0,0,0.2)`,
                    color: colors[index].primary,
                  }}
                >
                  {digit}
                </motion.span>
              ))}
            </div>
            <motion.h2 
              initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold -mt-1 sm:-mt-2"
              style={{
                background: "linear-gradient(135deg, #4a7c3f, #8B5A2B)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                letterSpacing: "2px"
              }}
            >
              Página no encontrada
            </motion.h2>
          </div>

          {/* Frase a la derecha */}
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-xs sm:text-sm text-amber-900 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-2xl max-w-[90%] sm:max-w-xs text-center sm:text-left"
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            ✨ La página que buscas no existe o fue movida a otra dirección. ✨
          </motion.p>
        </div>

        {/* GIF CENTRAL - Responsivo */}
        <div className="flex justify-center my-0 w-full px-2 sm:px-0">
          <div 
            className="relative rounded-xl overflow-hidden"
            style={{ 
              width: "100%",
              maxWidth: "20cm",
              height: "auto",
              aspectRatio: "20/10"
            }}
          >
            <img 
              src="/gif/GIF_400_edi.gif" 
              alt="Error 404"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* BOTONES INFERIORES - Responsivo */}
        <div className="mt-0 w-full px-2 sm:px-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 150 }}
            className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 justify-center w-full sm:w-auto"
          >
            <Link
              to="/"
              className="group relative px-4 py-1.5 sm:px-5 sm:py-2 md:px-6 md:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 overflow-hidden w-full sm:w-auto text-center"
              style={{
                background: "linear-gradient(135deg, #4a7c3f, #2d5a27)",
                color: "white",
                boxShadow: "0 4px 15px rgba(74, 124, 63, 0.4)"
              }}
            >
              <span className="relative z-10">🌿 Volver al inicio</span>
              <motion.div 
                className="absolute inset-0"
                style={{ background: "linear-gradient(135deg, #8B5A2B, #4a7c3f)" }}
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <Link
              to="/contacto"
              className="px-4 py-1.5 sm:px-5 sm:py-2 md:px-6 md:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 w-full sm:w-auto text-center"
              style={{
                background: "rgba(139, 90, 43, 0.15)",
                border: "2px solid #8B5A2B",
                color: "#8B5A2B",
                backdropFilter: "blur(4px)"
              }}
            >
              📞 Contacto
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}