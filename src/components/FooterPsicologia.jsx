import { Link } from "react-router";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import utic from "/logo/utic.png";

const FacebookIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const YoutubeIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
  </svg>
);
const TwitterIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Variantes de animación reutilizables
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  whileInView:{ opacity: 1, y: 0  },
  viewport:   { once: true },
  transition: { duration: 0.5, delay },
});

const quickLinks = [
  { to: "/convocatorias", label: "Convocatorias" },
  { to: "/cursos",        label: "Cursos"         },
  { to: "/eventos",       label: "Eventos"        },
  { to: "/publicaciones", label: "Publicaciones"  },
  { to: "/servicios",     label: "Servicios"      },
  { to: "/gaceta",        label: "Gaceta"         },
  { to: "/videos",        label: "Videos"         },
  { to: "/ofertas",       label: "Ofertas"        },
];

export default function FooterPsicologia({ institucion, loading }) {
  const colors       = institucion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";

  return (
    <footer className="bg-black text-gray-300 mt-auto">

      {/* ── Franja superior arcoíris ──────────────────────────────────────── */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${primaryColor}, #dc2626, #3b82f6, ${primaryColor})`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">

          {/* ── Col 1 — Identidad ─────────────────────────────────────────── */}
          <motion.div {...fadeUp(0)}>

            {/* Logos con círculo blanco y borde de color - LOGOS MÁS GRANDES */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              {loading ? (
                <>
                  <div className="w-32 h-32 rounded-full bg-gray-800 animate-pulse" />
                  <div className="w-32 h-32 rounded-full bg-gray-800 animate-pulse" />
                </>
              ) : (
                <>
                  {/* Logo carrera */}
                  {institucion?.institucion_logo && (
                    <motion.div
                      whileHover={{ scale: 1.08, rotate: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative group cursor-pointer"
                    >
                      {/* Glow al hover */}
                      <div
                        className="absolute -inset-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"
                        style={{ background: `radial-gradient(circle, ${primaryColor}60, transparent)` }}
                      />
                      {/* Círculo blanco de fondo con borde de color */}
                      <div 
                        className="w-32 h-32 lg:w-36 lg:h-36 rounded-full bg-white flex items-center justify-center shadow-lg"
                        style={{ boxShadow: `0 0 0 3px ${primaryColor}40` }}
                      >
                        <img
                          src={institucion.institucion_logo}
                          alt={institucion.institucion_nombre}
                          className="w-28 h-28 lg:w-32 lg:h-32 object-contain rounded-full"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Logo UTIC */}
                  <motion.a
                    href="https://utic.upea.bo/"
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.08, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg bg-blue-500/20" />
                    {/* Círculo blanco de fondo con borde de color */}
                    <div 
                      className="w-32 h-32 lg:w-36 lg:h-36 rounded-full bg-white flex items-center justify-center shadow-lg"
                      style={{ boxShadow: `0 0 0 3px ${primaryColor}40` }}
                    >
                      <img
                        src={utic}
                        alt="UTIC"
                        className="w-28 h-28 lg:w-32 lg:h-32 object-contain rounded-full"
                      />
                    </div>
                  </motion.a>
                </>
              )}
            </div>

            {/* Nombre institución */}
            <p className="font-bold text-white text-lg leading-tight mb-0.5">
              {loading ? "Cargando..." : institucion?.institucion_nombre ?? "PSICOLOGÍA"}
            </p>
            <p className="text-sm text-gray-400 leading-tight mb-5">
              Universidad Pública de El Alto
            </p>

            {/* Redes sociales */}
            <div className="flex items-center gap-3">
              {institucion?.institucion_facebook && (
                <motion.a
                  href={institucion.institucion_facebook}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-[#1877f2] hover:text-white transition-all duration-300"
                >
                  <FacebookIcon size={16} />
                </motion.a>
              )}
              {institucion?.institucion_youtube && (
                <motion.a
                  href={institucion.institucion_youtube}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-[#ff0000] hover:text-white transition-all duration-300"
                >
                  <YoutubeIcon size={16} />
                </motion.a>
              )}
              {institucion?.institucion_twitter && (
                <motion.a
                  href={institucion.institucion_twitter}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-gray-600 hover:text-white transition-all duration-300"
                >
                  <TwitterIcon size={16} />
                </motion.a>
              )}
            </div>
          </motion.div>

          {/* ── Col 2 — Links rápidos ─────────────────────────────────────── */}
          <motion.div {...fadeUp(0.15)}>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-4 h-0.5 bg-primary inline-block" />
              Accesos rápidos
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {quickLinks.map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <Link
                    to={l.to}
                    className="group flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 group-hover:scale-125 transition-transform"
                    />
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* ── Col 3 — Contacto ──────────────────────────────────────────── */}
          <motion.div {...fadeUp(0.3)}>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-4 h-0.5 bg-primary inline-block" />
              Contacto
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              {institucion?.institucion_direccion && (
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={13} className="text-primary" />
                  </div>
                  <span className="leading-relaxed">{institucion.institucion_direccion}</span>
                </li>
              )}
              {institucion?.institucion_celular1 && (
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                    <Phone size={13} className="text-primary" />
                  </div>
                  <span>{institucion.institucion_celular1}</span>
                </li>
              )}
              {institucion?.institucion_correo1 && (
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                    <Mail size={13} className="text-primary" />
                  </div>
                  <span className="break-all">{institucion.institucion_correo1}</span>
                </li>
              )}
            </ul>

            {institucion?.institucion_api_google_map && (
              <motion.a
                href={institucion.institucion_api_google_map}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03 }}
                className="inline-flex items-center gap-2 mt-5 text-xs px-4 py-2 border border-primary/50 text-primary rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group"
              >
                <MapPin size={12} />
                <span>Ver en el mapa</span>
                <ExternalLink size={10} className="group-hover:translate-x-0.5 transition-transform" />
              </motion.a>
            )}
          </motion.div>
        </div>

        {/* ── Copyright ─────────────────────────────────────────────────────── */}
        <motion.div
          {...fadeUp(0.4)}
          className="border-t border-gray-800 mt-10 pt-7"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">

            {/* Izquierda */}
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="text-gray-300 font-medium">
                Universidad Pública de El Alto
              </span>{" "}
              — Todos los derechos reservados.
            </p>

            {/* Derecha — créditos */}
            <p className="flex flex-wrap items-center justify-center gap-1.5 text-center">
              <span>Desarrollado por</span>
              <a
                href="https://utic.upea.bo/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-primary hover:text-white transition-colors hover:underline underline-offset-2"
              >
                UTIC
              </a>
              <span className="text-gray-600">·</span>
              <a
                href="https://www.linkedin.com/in/albieri-laura-308686397/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-primary hover:text-white transition-colors hover:underline underline-offset-2"
              >
                Albiery
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}