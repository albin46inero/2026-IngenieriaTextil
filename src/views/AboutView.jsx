import { motion, useScroll, useTransform, animate, useMotionValue, useInView } from "motion/react";
import { useOutletContext } from "react-router";
import { useRef, useEffect, useState } from "react";
import { FaFacebook, FaWhatsapp, FaXTwitter, FaPhone } from "react-icons/fa6";
import {
  MdOutlineSchool,
  MdOutlineVisibility,
  MdOutlineTrackChanges,
  MdOutlineEmojiObjects,
  MdPlayCircle,
} from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi2";

/* ─── Strip HTML ────────────────────────────────────────────────────── */
const StripHtml = ({ html }) =>
  html ? <>{html.replace(/<[^>]*>/g, "")}</> : null;

/* ─── Iniciales ─────────────────────────────────────────────────────── */
const getInitials = (nombre = "") => {
  const w = nombre.trim().split(/\s+/);
  return w.length === 1 ? w[0].slice(0, 2).toUpperCase() : (w[0][0] + w[1][0]).toUpperCase();
};

/* ─── Validar campo ─────────────────────────────────────────────────── */
const JUNK = ["preuba_autoridad", "prueba_autoridad", "preuba", "prueba", "", null, undefined];
const isValid = (v) => !JUNK.includes(typeof v === "string" ? v.trim().toLowerCase() : v);

/* ─── Contador animado ──────────────────────────────────────────────── */
function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [inView, to, count]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* ─── Decorador flotante (solo desde carpeta png_decoradores) ───────── */
const FloatingDecorator = ({ src, size, x, y, delay, duration = 8, rotate = true, color = null }) => {
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

/* ─── Section wrapper animado ───────────────────────────────────────── */
const SectionIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ─── Chip etiqueta ──────────────────────────────────────────────────── */
const Chip = ({ children, color }) => (
  <span
    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
    style={{ backgroundColor: `${color}18`, color }}
  >
    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
    {children}
  </span>
);

/* ─── Tarjeta de autoridad ───────────────────────────────────────────── */
function AutoridadCard({ autoridad, index, primaryColor }) {
  const hasPhoto = autoridad.foto_autoridad?.startsWith("http");

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="relative group cursor-default"
    >
      <div
        className="absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{ background: `linear-gradient(135deg, ${primaryColor}88, ${primaryColor}22)` }}
      />

      <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <div
          className="h-28 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}30)` }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-8 -right-8 w-28 h-28 rounded-full border-2 border-dashed opacity-20"
            style={{ borderColor: primaryColor }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full border border-dashed opacity-15"
            style={{ borderColor: primaryColor }}
          />
        </div>

        <div className="flex justify-center -mt-12 mb-4">
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <div
              className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ 
                background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}88)`,
                filter: 'blur(8px)'
              }}
            />
            <div
              className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-xl flex items-center justify-center bg-white"
              style={hasPhoto ? {} : { backgroundColor: `${primaryColor}10` }}
            >
              {hasPhoto ? (
                <img
                  src={autoridad.foto_autoridad}
                  alt={autoridad.nombre_autoridad}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold" style={{ color: primaryColor }}>
                  {getInitials(autoridad.nombre_autoridad)}
                </span>
              )}
            </div>
          </motion.div>
        </div>

        <div className="pb-8 px-6 text-center space-y-3">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {autoridad.nombre_autoridad}
          </h3>

          {isValid(autoridad.cargo_autoridad) && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 + 0.3 }}
              className="inline-block text-xs font-semibold px-4 py-1.5 rounded-full"
              style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
            >
              {autoridad.cargo_autoridad}
            </motion.span>
          )}

          {isValid(autoridad.celular_autoridad) && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-1">
              <FaPhone size={11} />
              <span>{autoridad.celular_autoridad}</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-100">
            {isValid(autoridad.facebook_autoridad) && (
              <motion.a
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                href={autoridad.facebook_autoridad}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-[#1877f2] hover:text-white text-gray-400 transition-colors duration-200"
              >
                <FaFacebook size={15} />
              </motion.a>
            )}
            {isValid(autoridad.twiter_autoridad) && (
              <motion.a
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                href={autoridad.twiter_autoridad}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-black hover:text-white text-gray-400 transition-colors duration-200"
              >
                <FaXTwitter size={15} />
              </motion.a>
            )}
            {isValid(autoridad.celular_autoridad) && (
              <motion.a
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                href={`https://wa.me/${autoridad.celular_autoridad}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-[#25D366] hover:text-white text-gray-400 transition-colors duration-200"
              >
                <FaWhatsapp size={15} />
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════════════════ */
export default function AboutView() {
  const { institucion, autoridades, loading } = useOutletContext();

  const colors = institucion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  const autoridadesValidas = (autoridades || []).filter((a) =>
    isValid(a.nombre_autoridad)
  );

  const mvRef = useRef(null);
  const { scrollYProgress: mvScroll } = useScroll({
    target: mvRef,
    offset: ["start end", "end start"],
  });
  const mvX = useTransform(mvScroll, [0, 1], [-40, 40]);

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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden relative">
      
    
      {/* ══════════════════════════════════════════════════════════════
          SOBRE LA CARRERA - CON LOGO UPEA
      ══════════════════════════════════════════════════════════════ */}
      {institucion?.institucion_sobre_ins && (
        <section className="relative py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <SectionIn>
                  <Chip color={primaryColor}>Sobre la carrera</Chip>
                </SectionIn>

                <SectionIn delay={0.1}>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                    Formando{" "}
                    <span style={{ color: primaryColor }}>profesionales</span>{" "}
                    con propósito
                  </h2>
                </SectionIn>

                <SectionIn delay={0.2}>
                  <div
                    className="w-16 h-1.5 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}44)` }}
                  />
                </SectionIn>

                <SectionIn delay={0.25}>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    <StripHtml html={institucion.institucion_sobre_ins} />
                  </p>
                </SectionIn>

                <SectionIn delay={0.35}>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    {[
                      { n: 20, suffix: "+", label: "Años" },
                      { n: 500, suffix: "+", label: "Egresados" },
                      { n: 100, suffix: "%", label: "Compromiso" },
                    ].map(({ n, suffix, label }) => (
                      <div
                        key={label}
                        className="rounded-2xl p-4 text-center border border-gray-100 bg-white shadow-sm"
                      >
                        <div className="text-2xl font-black" style={{ color: primaryColor }}>
                          <Counter to={n} suffix={suffix} />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{label}</div>
                      </div>
                    ))}
                  </div>
                </SectionIn>
              </div>

              {/* Logos: Institución + UPEA juntos */}
              <SectionIn delay={0.2} className="flex justify-center">
                <div className="flex flex-col items-center gap-6">
                  {/* Logo de la institución con anillos */}
                  <div className="relative w-72 h-72 flex items-center justify-center">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full border-2"
                        style={{
                          width: 72 + i * 60,
                          height: 72 + i * 60,
                          borderColor: `${primaryColor}${["44", "28", "14"][i - 1]}`,
                        }}
                        animate={{
                          scale: [1, 1.04, 1],
                          rotate: i % 2 === 0 ? [0, 5, 0] : [0, -5, 0],
                        }}
                        transition={{
                          duration: 4 + i,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.5,
                        }}
                      />
                    ))}
                    <motion.img
                      src={institucion?.institucion_logo}
                      alt={institucion?.institucion_nombre}
                      className="relative w-70 h-70 object-contain drop-shadow-2xl z-10"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  
                  {/* Logo UPEA debajo */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="relative"
                  >
                    <div className="w-45 h-45 rounded-full bg-white shadow-xl flex items-center justify-center p-2">
                      <img
                        src="/logo/upeaLogo.png"
                        alt="Logo UPEA"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"
                      style={{ background: `radial-gradient(circle, ${primaryColor}40, transparent)` }}
                    />
                  </motion.div>
                </div>
              </SectionIn>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          HISTORIA
      ══════════════════════════════════════════════════════════════ */}
      {institucion?.institucion_historia && (
        <section className="relative py-24 bg-gray-950 text-white overflow-hidden">
  
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `conic-gradient(from 200deg at 80% 50%, ${primaryColor}, transparent 40%)`,
            }}
          />
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              <SectionIn className="lg:col-span-4 space-y-5">
                <Chip color={primaryColor}>Historia</Chip>
                <h2 className="text-4xl font-black leading-tight">
                  Nuestra
                  <br />
                  <span style={{ color: primaryColor }}>trayectoria</span>
                </h2>
                <MdOutlineSchool size={80} style={{ color: `${primaryColor}33` }} />
              </SectionIn>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-8 relative pl-8"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-px"
                  style={{ background: `linear-gradient(180deg, ${primaryColor}, transparent)` }}
                />
                <motion.div
                  className="absolute -left-2 top-0 w-4 h-4 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                  animate={{
                    scale: [1, 1.4, 1],
                    boxShadow: [
                      `0 0 0 0 ${primaryColor}44`,
                      `0 0 0 12px ${primaryColor}00`,
                      `0 0 0 0 ${primaryColor}44`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <p className="text-gray-300 text-lg leading-relaxed">
                  <StripHtml html={institucion.institucion_historia} />
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MISIÓN & VISIÓN
      ══════════════════════════════════════════════════════════════ */}
      {(institucion?.institucion_mision || institucion?.institucion_vision) && (
        <section ref={mvRef} className="relative py-24 overflow-hidden">
       

          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionIn className="text-center mb-14 space-y-3">
              <Chip color={primaryColor}>Filosofía institucional</Chip>
              <h2 className="text-4xl font-black text-gray-900">Misión & Visión</h2>
            </SectionIn>

            <div className="grid md:grid-cols-2 gap-8">
              {institucion?.institucion_mision && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white rounded-3xl p-10 shadow-sm border border-gray-100 overflow-hidden group"
                >
                  <motion.div
                    style={{ x: mvX }}
                    className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full opacity-5"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}22, ${primaryColor}44)` }}
                  >
                    <MdOutlineTrackChanges size={30} style={{ color: primaryColor }} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4">Misión</h3>
                  <p className="text-gray-600 leading-relaxed">
                    <StripHtml html={institucion.institucion_mision} />
                  </p>
                  <div
                    className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 rounded-b-3xl"
                    style={{ backgroundColor: primaryColor }}
                  />
                </motion.div>
              )}

              {institucion?.institucion_vision && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-3xl p-10 overflow-hidden group"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}
                >
                  
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
                      backgroundSize: "30px 30px",
                    }}
                  />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                      <MdOutlineVisibility size={30} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4">Visión</h3>
                    <p className="text-white/90 leading-relaxed">
                      <StripHtml html={institucion.institucion_vision} />
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          OBJETIVOS
      ══════════════════════════════════════════════════════════════ */}
      {institucion?.institucion_objetivos && (
        <section className="py-24 bg-white">
          
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionIn className="text-center mb-14 space-y-3">
              <Chip color={primaryColor}>Propósito</Chip>
              <h2 className="text-4xl font-black text-gray-900">Objetivos</h2>
            </SectionIn>

            <SectionIn delay={0.2}>
              <div
                className="max-w-4xl mx-auto relative rounded-3xl p-12 overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${primaryColor}08, ${primaryColor}18)` }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-16 -right-16 w-64 h-64 rounded-full border-2 border-dashed opacity-20"
                  style={{ borderColor: primaryColor }}
                />
                <div className="relative flex gap-6 items-start">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}33, ${primaryColor}66)` }}
                  >
                    <MdOutlineEmojiObjects size={28} style={{ color: primaryColor }} />
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed pt-1">
                    <StripHtml html={institucion.institucion_objetivos} />
                  </p>
                </div>
              </div>
            </SectionIn>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          VIDEO INSTITUCIONAL
      ══════════════════════════════════════════════════════════════ */}
      {institucion?.institucion_link_video_vision && (
        <section className="py-24 bg-gray-950 relative overflow-hidden">
     
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(${primaryColor} 1px, transparent 1px), linear-gradient(90deg, ${primaryColor} 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <SectionIn className="text-center mb-12 space-y-3">
              <Chip color={primaryColor}>Multimedia</Chip>
              <h2 className="text-4xl font-black text-white flex items-center justify-center gap-3">
                <MdPlayCircle style={{ color: primaryColor }} />
                Video Institucional
              </h2>
            </SectionIn>

            <SectionIn delay={0.2}>
              <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto">
                <div className="relative aspect-video rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
                  <iframe
                    src={institucion.institucion_link_video_vision}
                    title="Video Institucional"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </SectionIn>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          AUTORIDADES
      ══════════════════════════════════════════════════════════════ */}
      {autoridadesValidas.length > 0 && (
        <section className="relative py-24 overflow-hidden">
         

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <SectionIn className="mb-16 space-y-4">
              <Chip color={primaryColor}>Equipo directivo</Chip>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 flex items-center gap-3">
                  <HiOutlineUserGroup style={{ color: primaryColor }} />
                  Autoridades
                </h2>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="text-sm font-semibold px-4 py-2 rounded-full"
                  style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                >
                  {autoridadesValidas.length} representante{autoridadesValidas.length !== 1 ? "s" : ""}
                </motion.span>
              </div>
              <div
                className="h-1 w-20 rounded-full"
                style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}44)` }}
              />
            </SectionIn>

            <div
              className={`grid gap-8 ${
                autoridadesValidas.length === 1
                  ? "grid-cols-1 max-w-sm mx-auto"
                  : autoridadesValidas.length === 2
                  ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {autoridadesValidas.map((autoridad, i) => (
                <AutoridadCard
                  key={autoridad.id_autoridad ?? i}
                  autoridad={autoridad}
                  index={i}
                  primaryColor={primaryColor}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}