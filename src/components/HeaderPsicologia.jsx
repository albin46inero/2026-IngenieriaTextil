import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X, ChevronDown, LogIn, Sparkles, Search } from "lucide-react";
import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";

// Submenús para Convocatorias
const convocatoriasSubmenu = [
  { to: "/convocatorias", label: "Convocatorias" },
  { to: "/convocatorias/avisos", label: "Avisos" },
  { to: "/convocatorias/comunicados", label: "Comunicados" },
];

const cursosSubmenu = [
  { to: "/cursos", label: "Cursos" },
  { to: "/cursos/seminarios", label: "Seminarios" },
];

// Submenús para Institución
const institucionSubmenu = [
  { to: "/about", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
];

// Submenús para Más
const masSubmenu = [
  { to: "/servicios", label: "Servicios" },
  { to: "/ofertas", label: "Ofertas Académicas" },
  { to: "/publicaciones", label: "Publicaciones" },
  { to: "/gaceta", label: "Gacetas" },
  { to: "/eventos", label: "Eventos" },
  { to: "/videos", label: "Videos" },
];

// Componente Dropdown para desktop
const Dropdown = ({ label, items, primaryColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="px-3 py-2 rounded-md text-sm transition-all duration-300 flex items-center gap-1 text-gray-600 hover:text-primary hover:bg-orange-50"
      >
        <span>{label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
          >
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-600 hover:text-primary hover:bg-orange-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente Dropdown para mobile
const MobileDropdown = ({ label, items, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-orange-50"
      >
        <span>{label}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pl-4 pb-2 space-y-1 overflow-hidden"
          >
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  setIsOpen(false);
                  onClose();
                }}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-500 hover:text-primary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente para el indicador de carga
const LoadingPulse = () => (
  <div className="flex items-center gap-1">
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ repeat: Infinity, duration: 1 }}
      className="w-2 h-2 bg-primary rounded-full"
    />
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
      className="w-2 h-2 bg-primary rounded-full"
    />
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
      className="w-2 h-2 bg-primary rounded-full"
    />
  </div>
);

export default function HeaderPsicologia({ institucion, loading }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-xl" : "bg-white shadow-sm"
      }`}
    >
      {/* Barra superior */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-white text-xs hidden md:block relative overflow-hidden"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center">
          <span className="opacity-90 flex items-center gap-2">
            <Sparkles size={12} />
            {loading ? "Cargando..." : descripcion?.institucion_direccion || "UPEA — Universidad Pública de El Alto"}
          </span>

          <div className="flex items-center gap-4">
            <span className="text-white/80">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <div className="flex items-center gap-3">
              {descripcion?.institucion_facebook && (
                <a href={descripcion.institucion_facebook} target="_blank" rel="noreferrer">
                  <FaFacebook size={14} />
                </a>
              )}
              {descripcion?.institucion_twitter && (
                <a href={descripcion.institucion_twitter} target="_blank" rel="noreferrer">
                  <FaTwitter size={14} />
                </a>
              )}
              {descripcion?.institucion_youtube && (
                <a href={descripcion.institucion_youtube} target="_blank" rel="noreferrer">
                  <FaYoutube size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Barra principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            ) : descripcion?.institucion_logo ? (
              <img
                src={descripcion.institucion_logo}
                alt={descripcion.institucion_nombre}
                className="w-10 h-10 object-contain rounded-full"
              />
            ) : null}

            <div>
              {loading ? (
                <LoadingPulse />
              ) : (
                <>
                  <p className="text-sm font-semibold leading-tight" style={{ color: primaryColor }}>
                    {descripcion?.institucion_nombre ?? "PSICOLOGÍA"}
                  </p>
                  <p className="text-xs text-gray-400 leading-tight">
                    Universidad Pública de El Alto
                  </p>
                </>
              )}
            </div>
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden lg:flex items-center gap-0.5">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white font-medium shadow-md"
                    : "text-gray-600 hover:text-primary hover:bg-orange-50"
                }`
              }
            >
              Inicio
            </NavLink>

            <Dropdown label="Institución" items={institucionSubmenu} primaryColor={primaryColor} />
            <Dropdown label="Convocatorias" items={convocatoriasSubmenu} primaryColor={primaryColor} />
            <Dropdown label="Cursos" items={cursosSubmenu} primaryColor={primaryColor} />
            <Dropdown label="Más" items={masSubmenu} primaryColor={primaryColor} />

            {/* Botón de búsqueda */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="ml-2 p-2 rounded-full text-gray-500 hover:text-primary transition-colors"
            >
              <Search size={18} />
            </button>

            {/* Botón INGRESAR */}
            <motion.a
              href={import.meta.env.VITE_LOGIN_ADM}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: `0 0 15px rgba(220, 38, 38, 0.5)` }}
              whileTap={{ scale: 0.95 }}
              className="ml-2 px-5 py-2 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            >
              <LogIn size={14} />
              INGRESAR
            </motion.a>
          </nav>

          {/* Botón menú mobile */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-primary"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2"
          >
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm mb-1 ${
                  isActive
                    ? "bg-primary text-white font-medium"
                    : "text-gray-600 hover:bg-orange-50"
                }`
              }
            >
              Inicio
            </NavLink>

            <MobileDropdown label="Institución" items={institucionSubmenu} onClose={() => setMenuOpen(false)} />
            <MobileDropdown label="Convocatorias" items={convocatoriasSubmenu} onClose={() => setMenuOpen(false)} />
            <MobileDropdown label="Cursos" items={cursosSubmenu} onClose={() => setMenuOpen(false)} />
            <MobileDropdown label="Más" items={masSubmenu} onClose={() => setMenuOpen(false)} />

            <a
              href={import.meta.env.VITE_LOGIN_ADM}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="block mt-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-center bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              INGRESAR
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barra de búsqueda */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg border-t p-4"
          >
            <div className="max-w-7xl mx-auto flex gap-2">
              <input
                type="text"
                placeholder="Buscar en el sitio..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
                style={{ backgroundColor: primaryColor }}
              >
                Buscar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}