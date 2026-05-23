import { Link } from "react-router";
import { motion } from "motion/react";
import { 
  Megaphone, FileText, Bell, GraduationCap, 
  Users, Calendar, BookOpen, Newspaper, 
  Heart, Briefcase, Video, ArrowRight,
  Sparkles, TrendingUp, Flame, Eye
} from "lucide-react";

// Mapa de iconos por categoría
const iconMap = {
  "Convocatorias": { icon: Megaphone, gradient: "from-rose-500 to-orange-500", glow: "rgba(244,63,94,0.5)" },
  "Comunicados": { icon: FileText, gradient: "from-blue-500 to-indigo-500", glow: "rgba(59,130,246,0.5)" },
  "Avisos": { icon: Bell, gradient: "from-amber-500 to-yellow-500", glow: "rgba(245,158,11,0.5)" },
  "Cursos": { icon: GraduationCap, gradient: "from-emerald-500 to-teal-500", glow: "rgba(16,185,129,0.5)" },
  "Seminarios": { icon: Users, gradient: "from-purple-500 to-fuchsia-500", glow: "rgba(168,85,247,0.5)" },
  "Eventos": { icon: Calendar, gradient: "from-pink-500 to-rose-500", glow: "rgba(236,72,153,0.5)" },
  "Publicaciones": { icon: BookOpen, gradient: "from-slate-600 to-gray-600", glow: "rgba(71,85,105,0.5)" },
  "Gaceta": { icon: Newspaper, gradient: "from-stone-600 to-neutral-600", glow: "rgba(87,83,78,0.5)" },
  "Servicios": { icon: Heart, gradient: "from-green-500 to-emerald-500", glow: "rgba(34,197,94,0.5)" },
  "Ofertas": { icon: Briefcase, gradient: "from-cyan-500 to-sky-500", glow: "rgba(6,182,212,0.5)" },
  "Videos": { icon: Video, gradient: "from-red-500 to-rose-500", glow: "rgba(239,68,68,0.5)" },
};

// Componente decorador flotante
const FloatingDecorator = ({ src, size, x, y, delay, duration = 10, rotate = true }) => {
  return (
    <motion.img
      src={src}
      alt="decorador"
      className="absolute pointer-events-none"
      style={{ 
        width: size, 
        height: 'auto', 
        left: x, 
        top: y,
      }}
      animate={{
        y: [0, -15, 0],
        rotate: rotate ? [0, 360] : 0,
      }}
      transition={{
        y: { duration, delay, repeat: Infinity, ease: "easeInOut" },
        rotate: rotate ? { duration: 25, delay, repeat: Infinity, ease: "linear" } : {},
      }}
    />
  );
};

export default function CategoriesExplorer({
  convocatorias = [],
  cursos = [],
  eventos = [],
  gaceta = [],
  publicaciones = [],
  servicios = [],
  ofertas = [],
  videos = [],
  loading,
}) {
  const categories = [
    { label: "Convocatorias", to: "/convocatorias", count: convocatorias.filter(c => c.con_estado === "1").length },
    { label: "Comunicados",   to: "/convocatorias", count: convocatorias.filter(c => c.tipo_conv_comun?.tipo_conv_comun_titulo === "COMUNICADOS").length },
    { label: "Avisos",        to: "/convocatorias", count: convocatorias.filter(c => c.tipo_conv_comun?.tipo_conv_comun_titulo === "AVISOS").length },
    { label: "Cursos",        to: "/cursos",        count: cursos.filter(c => c.tipo_curso_otro?.tipo_conv_curso_nombre === "CURSOS").length },
    { label: "Seminarios",    to: "/cursos",        count: cursos.filter(c => c.tipo_curso_otro?.tipo_conv_curso_nombre === "SEMINARIOS").length },
    { label: "Eventos",       to: "/eventos",       count: eventos.length },
    { label: "Publicaciones", to: "/publicaciones", count: publicaciones.length },
    { label: "Gaceta",        to: "/gaceta",        count: gaceta.length },
    { label: "Servicios",     to: "/servicios",     count: servicios.length },
    { label: "Ofertas",       to: "/ofertas",       count: ofertas.length },
    { label: "Videos",        to: "/videos",        count: videos.length },
  ];

  // Calcular el máximo de elementos para destacar las más populares
  const maxCount = Math.max(...categories.map(c => c.count));
  const getPopularityLevel = (count) => {
    if (count === 0) return 0;
    if (count >= maxCount * 0.7) return 3; // Muy popular
    if (count >= maxCount * 0.4) return 2; // Popular
    return 1; // Normal
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[...Array(11)].map((_, i) => (
          <div key={i} className="h-14 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative min-h-[400px]">
     

      {/* Contenido principal - categorías */}
      <div className="relative z-10 flex flex-col gap-2.5">
        {categories.map((cat, index) => {
          const IconComponent = iconMap[cat.label]?.icon || Sparkles;
          const gradient = iconMap[cat.label]?.gradient || "from-primary to-secondary";
          const glowColor = iconMap[cat.label]?.glow || "rgba(230,134,0,0.5)";
          const popularity = getPopularityLevel(cat.count);
          
          return (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04, duration: 0.4, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.01, x: 4 }}
            >
              <Link
                to={cat.to}
                className="group relative flex items-center justify-between px-4 py-3.5 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-100/80 hover:border-transparent transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl"
              >
                {/* Gradiente de fondo animado en hover */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  initial={false}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 0.12 }}
                />
                
                {/* Efecto de brillo láser */}
                <motion.div 
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{ skewX: '-20deg' }}
                />
                
                {/* Efecto de borde neón */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className={`absolute inset-0 rounded-xl shadow-[0_0_20px_${glowColor}]`} />
                </div>

                {/* Contenido izquierdo */}
                <div className="relative z-10 flex items-center gap-3">
                  {/* Círculo con icono animado */}
                  <motion.div 
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <IconComponent size={18} className="drop-shadow-sm" />
                  </motion.div>
                  
                  {/* Texto con efecto */}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                      {cat.label}
                    </span>
                    {/* Indicador de popularidad */}
                    {popularity > 0 && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "auto" }}
                        className="flex items-center gap-1"
                      >
                        {popularity === 3 && <Flame size={10} className="text-orange-500" />}
                        {popularity === 2 && <TrendingUp size={10} className="text-green-500" />}
                        <span className="text-[10px] text-gray-400">
                          {popularity === 3 && "Muy popular"}
                          {popularity === 2 && "Popular"}
                          {popularity === 1 && "Activo"}
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Contenido derecho */}
                <div className="relative z-10 flex items-center gap-3">
                  {/* Barra de progreso de popularidad */}
                  {popularity > 0 && (
                    <div className="hidden sm:block w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(cat.count / maxCount) * 100}%` }}
                        className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                        transition={{ delay: index * 0.04, duration: 0.8 }}
                      />
                    </div>
                  )}

                  {/* Badge con count animado */}
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-3 py-1 rounded-full bg-gradient-to-r ${gradient} shadow-md group-hover:shadow-lg transition-all`}
                  >
                    <span className="text-xs font-black text-white drop-shadow-sm">
                      {cat.count}
                    </span>
                    {/* Efecto de pulso si hay nuevos elementos */}
                    {cat.count > 0 && (
                      <motion.div 
                        className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                  
                  {/* Icono flecha que aparece en hover */}
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="text-gray-400"
                  >
                    <ArrowRight size={16} />
                  </motion.div>
                </div>

                {/* Barra lateral decorativa */}
                <motion.div 
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 rounded-r bg-gradient-to-b ${gradient}`}
                  animate={{ height: 0 }}
                  whileHover={{ height: 32 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Esquinas decorativas */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/0 group-hover:border-primary/20 transition-all duration-500 rounded-tl-xl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/0 group-hover:border-primary/20 transition-all duration-500 rounded-br-xl" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}