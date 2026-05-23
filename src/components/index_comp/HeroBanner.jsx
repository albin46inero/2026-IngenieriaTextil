import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// SVG inline
const IconBrain = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z" />
  </svg>
);

const IconHeart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Frases motivacionales para rotar
const frasesMotivacionales = [
  "Lema de la Carrera:",
  "Ingenieria Autotrónica: Innovación que impulsa el futuro.",
  "Autotronica la mejor carrera de la UPEA.",
  "innovando el futuro con cada circuito.",
];

// Componente decorador flotante
const FloatingDecorator = ({ src, size, x, y, delay, duration = 12, rotate = true, opacity = 0.5 }) => {
  return (
    <motion.img
      src={src}
      alt="decorador"
      className="absolute pointer-events-none z-20"
      style={{ 
        width: size, 
        height: 'auto', 
        left: x, 
        top: y,
        opacity: opacity
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

export default function HeroBanner({
  institucion,
  portadas = [],
  loading,
  children,
  // ✅ CAMBIO: Tarjetas más abajo para no tapar el título
  childrenPosition = "bottom-8 lg:bottom-12 left-0 right-0 px-4 sm:px-6 lg:px-8",
  height = "min-h-[500px] sm:min-h-[580px] md:min-h-[620px] lg:min-h-[700px]",
  showControls = true,
  autoSlide = true,
  slideInterval = 5000,
  showButtons = true,
}) {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(null);
  const [sliding, setSliding] = useState(false);
  const [direction, setDirection] = useState("next");
  const [fraseIndex, setFraseIndex] = useState(0);
  const [animatingLetters, setAnimatingLetters] = useState({});

  // Obtener colores de la API
  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  const triggerSlide = (dir) => {
    if (sliding || portadas.length <= 1) return;

    const nextIdx =
      dir === "next"
        ? (current + 1) % portadas.length
        : (current - 1 + portadas.length) % portadas.length;

    setDirection(dir);
    setNext(nextIdx);
    setSliding(true);

    setTimeout(() => {
      setCurrent(nextIdx);
      setNext(null);
      setSliding(false);
    }, 600);
  };

  // Auto-slide de portadas
  useEffect(() => {
    if (!autoSlide || portadas.length <= 1) return;
    const interval = setInterval(() => triggerSlide("next"), slideInterval);
    return () => clearInterval(interval);
  }, [portadas.length, current, autoSlide, slideInterval]);

  // Rotar frases cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setFraseIndex((prev) => (prev + 1) % frasesMotivacionales.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animación saltarina de letras cada 10 segundos
  useEffect(() => {
    const nombre = descripcion?.institucion_nombre ?? "PSICOLOGÍA";
    const letras = nombre.replace(/\s/g, "").split("");

    const animateLetters = () => {
      letras.forEach((_, idx) => {
        setTimeout(() => {
          setAnimatingLetters((prev) => ({ ...prev, [idx]: true }));
          setTimeout(() => {
            setAnimatingLetters((prev) => ({ ...prev, [idx]: false }));
          }, 2000);
        }, idx * 50);
      });
    };

    animateLetters();
    const interval = setInterval(animateLetters, 10000);
    return () => clearInterval(interval);
  }, [descripcion?.institucion_nombre]);

  // Skeleton
  if (loading) {
    return (
      <div className={`relative w-full ${height} bg-gray-900 animate-pulse flex items-center justify-center`}>
        <div className="text-center space-y-5 px-4">
          <div className="w-40 h-4 sm:w-56 sm:h-5 bg-white/10 rounded-full mx-auto" />
          <div className="w-60 h-12 sm:w-80 sm:h-16 bg-white/10 rounded-xl mx-auto" />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <div className="w-32 h-10 sm:w-36 sm:h-11 bg-white/10 rounded-full mx-auto sm:mx-0" />
            <div className="w-32 h-10 sm:w-36 sm:h-11 bg-white/10 rounded-full mx-auto sm:mx-0" />
          </div>
        </div>
      </div>
    );
  }

  // Fallback sin portadas
  if (portadas.length === 0) {
    return (
      <div
        className={`relative w-full ${height} flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 overflow-hidden`}
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 70% 50%, white 0%, transparent 60%)",
          }}
        />
        <div className="w-full md:w-auto">
          <TextContent
            descripcion={descripcion}
            showButtons={showButtons}
            fraseActual={frasesMotivacionales[fraseIndex]}
            animatingLetters={animatingLetters}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </div>
        <div className="hidden lg:block">
          <LogoFloat
            descripcion={descripcion}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </div>
        {children && (
          <div className={`absolute ${childrenPosition} z-20`}>{children}</div>
        )}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 z-20"
          style={{
            background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${primaryColor} 100%)`,
          }}
        />
      </div>
    );
  }

  const slideActual = portadas[current];
  const slideNext = next !== null ? portadas[next] : null;

  return (
    <div className={`relative w-full ${height} overflow-hidden`}>
      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOutToLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOutToRight {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px ${primaryColor}80; }
          50% { text-shadow: 0 0 40px ${primaryColor}; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .slide-enter-next { animation: slideInFromRight 0.6s cubic-bezier(.4,0,.2,1) both; }
        .slide-exit-next { animation: slideOutToLeft 0.6s cubic-bezier(.4,0,.2,1) both; }
        .slide-enter-prev { animation: slideInFromLeft 0.6s cubic-bezier(.4,0,.2,1) both; }
        .slide-exit-prev { animation: slideOutToRight 0.6s cubic-bezier(.4,0,.2,1) both; }
        
        .float-buttons {
          animation: float 3s ease-in-out infinite;
        }
        
        .fade-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .hero-glow {
          animation: glow 3s ease-in-out infinite;
        }
        
        .pulse-ring {
          animation: pulseRing 2s ease-out infinite;
        }
      `}</style>

      {/* Imagen de fondo actual */}
      <div
        key={`current-${current}`}
        className={`absolute inset-0 ${sliding ? (direction === "next" ? "slide-exit-next" : "slide-exit-prev") : ""}`}
      >
        <img
          src={slideActual.portada_imagen}
          alt={slideActual.portada_titulo}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Imagen siguiente entrando */}
      {sliding && slideNext && (
        <div
          key={`next-${next}`}
          className={`absolute inset-0 ${direction === "next" ? "slide-enter-next" : "slide-enter-prev"}`}
        >
          <img
            src={slideNext.portada_imagen}
            alt={slideNext.portada_titulo}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Overlay gradiente mejorado - responsivo */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40 sm:via-black/60 md:to-transparent z-10" />

      {/* Contenido principal - LOGO Y TEXTO CENTRADOS */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8 sm:py-12 lg:py-0 gap-4 lg:gap-6">
        
        {/* Logo 3D CENTRADO ARRIBA */}
        <div className="w-full flex justify-center pointer-events-none mb-2">
          <LogoFloat
            descripcion={descripcion}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </div>

        {/* Título y Botones CENTRADOS ABAJO */}
        <div className="w-full max-w-5xl">
          <TextContent
            descripcion={descripcion}
            showButtons={showButtons}
            fraseActual={frasesMotivacionales[fraseIndex]}
            animatingLetters={animatingLetters}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </div>
      </div>

      {/* Children (tarjetas de acceso rápido) - POSICIÓN AJUSTADA */}
      {children && (
        <div className={`absolute ${childrenPosition} z-30`}>{children}</div>
      )}

      {/* Botones prev / next - responsivos */}
      {showControls && portadas.length > 1 && (
        <>
          <button
            onClick={() => triggerSlide("prev")}
            disabled={sliding}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 text-white p-2 sm:p-3 rounded-full opacity-60 hover:opacity-100 focus:opacity-100 transition-all backdrop-blur-sm hover:scale-110 disabled:cursor-not-allowed"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = primaryColor)
            }
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
            aria-label="Anterior"
          >
            <ChevronLeft size={18} className="sm:w-[22px] sm:h-[22px]" />
          </button>
          <button
            onClick={() => triggerSlide("next")}
            disabled={sliding}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 text-white p-2 sm:p-3 rounded-full opacity-60 hover:opacity-100 focus:opacity-100 transition-all backdrop-blur-sm hover:scale-110 disabled:cursor-not-allowed"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = primaryColor)
            }
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
            aria-label="Siguiente"
          >
            <ChevronRight size={18} className="sm:w-[22px] sm:h-[22px]" />
          </button>
        </>
      )}

      {/* Franja inferior con gradiente */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 z-30"
        style={{
          background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`,
        }}
      />
    </div>
  );
}

// ─── Subcomponente: texto CENTRADO Y EN UNA SOLA LÍNEA ─────────
function TextContent({
  descripcion,
  showButtons,
  fraseActual,
  animatingLetters,
  primaryColor,
  secondaryColor,
}) {
  const nombre = descripcion?.institucion_nombre ?? "PSICOLOGÍA";
  const palabras = nombre.split(" ");

  return (
    <div className="flex flex-col justify-center items-center max-w-full mx-auto">
      
      {/* Badge universidad - Responsivo y Centrado */}
      <div className="fade-up flex items-center justify-center gap-2 mb-3 sm:mb-4">
        <div
          className="flex items-center gap-2 sm:gap-3 md:gap-4 backdrop-blur-md rounded-full px-3 sm:px-4 md:px-5 py-2 sm:py-2.5"
          style={{
            backgroundColor: `${primaryColor}08`,
            backdropFilter: "blur(16px)",
          }}
        >
          <img
            src="/logo/upeaLogo.png"
            alt="UPEA"
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain"
          />
          <span className="text-white/80 sm:text-white/90 text-[10px] sm:text-xs md:text-sm font-light uppercase tracking-wider">
            Universidad Pública de El Alto
          </span>
        </div>
      </div>

      {/* "Carrera de" - Responsivo y Centrado */}
      <p className="fade-up text-white/70 text-lg sm:text-xl md:text-2xl lg:text-3xl font-light uppercase tracking-widest mb-1 sm:mb-2">
        Carrera de
      </p>

      {/* 
         ✅ CAMBIO CRÍTICO: 
         - 'whitespace-nowrap' evita que el texto salte de línea bajo NINGUNA circunstancia.
         - 'flex-nowrap' en el contenedor asegura que las palabras se mantengan juntas.
         - 'clamp(1.5rem, 3.5vw, 3.8rem)' ajusta el tamaño dinámicamente para que quepa "INGENIERÍA TEXTIL" en una línea en laptops y desktops.
      */}
      <h1
        className="font-black mb-3 sm:mb-4 leading-none whitespace-nowrap text-center"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        <div className="flex flex-nowrap justify-center items-center gap-x-2 sm:gap-x-3">
          {palabras.map((palabra, wi) => (
            <div key={wi} className="inline-flex">
              {palabra.split("").map((letra, li) => {
                const globalIndex = wi * 10 + li;
                const isAnimating = animatingLetters[globalIndex];

                return (
                  <motion.span
                    key={li}
                    className="inline-block"
                    initial={{ opacity: 1 }}
                    animate={isAnimating ? {
                      opacity: [1, 0.3, 0.1, 0, 0.1, 0.3, 1],
                      y: [0, -15, -25, -30, -25, -15, 0],
                      scale: [1, 0.95, 0.9, 0.85, 0.9, 0.95, 1],
                    } : {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      delay: isAnimating ? li * 0.05 : 0,
                    }}
                    style={{
                      fontSize: "clamp(1.5rem, 3.5vw, 3.8rem)",
                      textShadow: "0 4px 12px rgba(0,0,0,0.6)",
                      display: "inline-block",
                      color: primaryColor,
                    }}
                  >
                    {letra}
                  </motion.span>
                );
              })}
            </div>
          ))}
        </div>
      </h1>

      {/* Frase motivacional rotativa - Responsivo y Centrado */}
      <div className="mb-3 sm:mb-4 min-h-[40px] sm:min-h-[50px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={fraseActual}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="hero-glow text-xs sm:text-sm md:text-base font-medium italic leading-relaxed max-w-full px-2"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            "{fraseActual}"
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Botones - Responsivos y Centrados */}
      {showButtons && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 float-buttons">
          <a
            href="#contenido"
            className="group relative overflow-hidden flex items-center justify-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 text-white rounded-full font-semibold text-xs sm:text-sm hover:scale-105 hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <IconBrain />
              Explorar carrera
            </span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
              }}
            />
          </a>

          <a
            href="/about"
            className="group flex items-center justify-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 border-2 border-white/30 text-white rounded-full font-semibold text-xs sm:text-sm hover:bg-white/10 hover:scale-105 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto"
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = primaryColor)
            }
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
          >
            <IconHeart />
            Conócenos
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Subcomponente: logo flotante con ROTACIÓN 3D ───────────────────────────────
function LogoFloat({ descripcion, primaryColor, secondaryColor }) {
  if (!descripcion?.institucion_logo) return null;

  return (
    <div className="flex items-center justify-center">
      <div className="relative" style={{ perspective: "1500px" }}>
        {/* Anillos pulsantes */}
        <div
          className="pulse-ring absolute inset-0 rounded-full border"
          style={{
            borderColor: `${primaryColor}50`,
            animationDelay: "0s",
            borderWidth: "1px",
          }}
        />
        <div
          className="pulse-ring absolute inset-0 rounded-full border"
          style={{
            borderColor: `${secondaryColor}30`,
            animationDelay: "0.7s",
            borderWidth: "1px",
          }}
        />

        {/* Logo con rotación 3D */}
        <motion.div
          className="relative"
          animate={{
            rotateY: [0, 360],
            rotateX: [0, 15, 0],
            y: [0, -10, 0],
          }}
          transition={{
            rotateY: { duration: 25, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 25px 8px rgba(255,255,255,0.25)`,
              pointerEvents: "none",
              borderRadius: "50%",
            }}
          />

          <motion.img
            src={descripcion.institucion_logo}
            alt={descripcion.institucion_nombre}
            className="object-contain rounded-full relative"
            style={{
              width: "clamp(220px, 30vw, 380px)",
              height: "clamp(220px, 30vw, 380px)",
              filter: `drop-shadow(0 0 20px ${primaryColor}80)`,
              backfaceVisibility: "visible",
            }}
          />

          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)`,
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `inset 0 0 15px 2px rgba(255,255,255,0.25)`,
              pointerEvents: "none",
              borderRadius: "50%",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}