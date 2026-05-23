import { motion } from "motion/react";
import { useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  MapPin, Phone, Mail, Clock, 
  ExternalLink, Building, Smartphone 
} from "lucide-react";
import { FaFacebook, FaTwitter, FaYoutube, FaWhatsapp } from "react-icons/fa";

// Fix para los íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ─── CACHÉ DE COORDENADAS ─────────────────────────────────────────────────────
/**
 * CORRECCIÓN (Hallazgo 2 — Rate Limiting Nominatim):
 *
 * Antes: cada carga de ContactView hacía una petición a Nominatim.
 * Ahora: las coordenadas se guardan en localStorage la primera vez.
 *        Las siguientes cargas leen del caché local → 0 peticiones a Nominatim.
 *
 * TTL: 30 días. Después de ese plazo se refresca automáticamente.
 * Clave de caché: incluye la dirección, así si la dirección cambia en la API
 * se geocodifica de nuevo.
 */
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

function getCachedCoords(direccion) {
  try {
    const raw = localStorage.getItem("upea_map_coords");
    if (!raw) return null;
    const { coords, address, timestamp } = JSON.parse(raw);
    const expired = Date.now() - timestamp > CACHE_TTL_MS;
    const sameAddress = address === direccion;
    if (!expired && sameAddress) return coords;
    return null;
  } catch {
    return null;
  }
}

function setCachedCoords(direccion, coords) {
  try {
    localStorage.setItem(
      "upea_map_coords",
      JSON.stringify({ coords, address: direccion, timestamp: Date.now() })
    );
  } catch {
    // localStorage lleno u otro error — no es crítico
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, delay }
});

const getColorFilter = (color) => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `brightness(0) saturate(100%) invert(${Math.round((1 - r/255) * 100)}%) sepia(100%) hue-rotate(${Math.round(Math.atan2(b, r) * 180 / Math.PI)}deg) saturate(500%)`;
};

const FloatingDecorator = ({ src, size, x, y, delay, duration = 8, rotate = true, color = null }) => (
  <motion.img
    src={src}
    alt="decorador"
    className="absolute pointer-events-none"
    style={{ width: size, height: 'auto', left: x, top: y, filter: color ? getColorFilter(color) : 'none' }}
    animate={{ y: [0, -25, 0], rotate: rotate ? [0, 360] : 0, scale: [1, 1.05, 1] }}
    transition={{
      y: { duration, delay, repeat: Infinity, ease: "easeInOut" },
      rotate: rotate ? { duration: 20, repeat: Infinity, ease: "linear" } : {},
      scale: { duration: duration / 2, delay, repeat: Infinity, ease: "easeInOut" },
    }}
  />
);

const Chip = ({ children, color }) => (
  <span
    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
    style={{ backgroundColor: `${color}18`, color }}
  >
    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
    {children}
  </span>
);

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

const ContactCard = ({ icon: Icon, title, content, color, delay = 0 }) => (
  <motion.div
    {...fadeUp(delay)}
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 group hover:shadow-xl transition-all duration-300"
  >
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
      style={{ backgroundColor: `${color}15` }}
    >
      <Icon size={22} style={{ color }} />
    </div>
    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
    <div className="text-gray-500 text-sm space-y-1">{content}</div>
  </motion.div>
);

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function ContactView() {
  const { institucion, portadas, loading } = useOutletContext();

  // Coordenadas por defecto: UPEA El Alto
  const DEFAULT_COORDS = [-16.5, -68.2];
  const [mapPosition, setMapPosition] = useState(DEFAULT_COORDS);
  const [mapLoading, setMapLoading]   = useState(true);

  const colors         = institucion?.colorinstitucion?.[0] || {};
  const primaryColor   = colors.color_primario   || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  // ── Geocodificación con caché localStorage ────────────────────────────────
  useEffect(() => {
    if (loading) return;

    const direccion = institucion?.institucion_direccion
      || "Edificio del Área Social, 4to Piso. Av. Sucre, Zona Villa Esperanza, El Alto, Bolivia";

    // 1️⃣ Intentar leer del caché primero
    const cached = getCachedCoords(direccion);
    if (cached) {
      // ✅ Caché hit — sin llamada a Nominatim
      setMapPosition(cached);
      setMapLoading(false);
      return;
    }

    // 2️⃣ Caché miss — llamar a Nominatim UNA sola vez y guardar resultado
    const geocodeAddress = async () => {
      try {
        setMapLoading(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(direccion)}&format=json&limit=1`,
          { headers: { "Accept-Language": "es" } }
        );
        const data = await response.json();

        if (data?.[0]) {
          const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          setMapPosition(coords);
          // Guardar en caché para evitar futuras peticiones
          setCachedCoords(direccion, coords);
        }
      } catch (error) {
        console.error("Error geocodificando dirección:", error);
        // Mantener coordenadas por defecto si falla
      } finally {
        setMapLoading(false);
      }
    };

    geocodeAddress();
  }, [institucion, loading]);

  // ── Loading global ────────────────────────────────────────────────────────
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

     
      {/* ─── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative h-[320] md:h-[360px] lg:h-[400px] w-full overflow-hidden">
        {portadas && portadas.length > 0 && portadas[0]?.portada_imagen ? (
          <>
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8 }}
              src={portadas[0].portada_imagen}
              alt={portadas[0].portada_titulo || "Contacto Psicología UPEA"}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />
        )}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg"
          >
            Contáctanos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow"
          >
            Estamos para ayudarte. Comunícate con nosotros a través de cualquiera de nuestros canales.
          </motion.p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="h-1 mt-6 rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
        </div>
      </section>

      {/* ─── INFORMACIÓN DE CONTACTO ────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <SectionIn className="text-center mb-12 space-y-3">
            <Chip color={primaryColor}>Información</Chip>
            <h2 className="text-4xl font-black text-gray-900">¿Cómo podemos ayudarte?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Encuentra aquí todos los medios de contacto disponibles
            </p>
          </SectionIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {institucion?.institucion_direccion && (
              <ContactCard icon={MapPin} title="Dirección" color={primaryColor} delay={0.1}
                content={<p className="leading-relaxed">{institucion.institucion_direccion}</p>}
              />
            )}
            {(institucion?.institucion_telefono1 || institucion?.institucion_celular1) && (
              <ContactCard icon={Phone} title="Teléfonos" color={primaryColor} delay={0.2}
                content={
                  <div className="space-y-1">
                    {institucion.institucion_telefono1 && (
                      <a href={`tel:${institucion.institucion_telefono1}`} className="block hover:text-primary transition-colors">
                        📞 {institucion.institucion_telefono1}
                      </a>
                    )}
                    {institucion.institucion_celular1 && (
                      <a href={`tel:${institucion.institucion_celular1}`} className="block hover:text-primary transition-colors">
                        📱 {institucion.institucion_celular1}
                      </a>
                    )}
                    {institucion.institucion_celular2 && (
                      <a href={`tel:${institucion.institucion_celular2}`} className="block hover:text-primary transition-colors">
                        📱 {institucion.institucion_celular2}
                      </a>
                    )}
                  </div>
                }
              />
            )}
            {(institucion?.institucion_correo1 || institucion?.institucion_correo2) && (
              <ContactCard icon={Mail} title="Correos electrónicos" color={primaryColor} delay={0.3}
                content={
                  <div className="space-y-1">
                    {institucion.institucion_correo1 && (
                      <a href={`mailto:${institucion.institucion_correo1}`} className="block hover:text-primary transition-colors break-all">
                        {institucion.institucion_correo1}
                      </a>
                    )}
                    {institucion.institucion_correo2 && (
                      <a href={`mailto:${institucion.institucion_correo2}`} className="block hover:text-primary transition-colors break-all">
                        {institucion.institucion_correo2}
                      </a>
                    )}
                  </div>
                }
              />
            )}
            <ContactCard icon={Clock} title="Horario de atención" color={primaryColor} delay={0.4}
              content={
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-gray-700">Lunes a Viernes</p>
                    <p className="text-xs text-gray-500">Mañana: 8:30 - 12:30</p>
                    <p className="text-xs text-gray-500">Tarde: 14:00 - 18:00</p>
                  </div>
                  <div className="pt-1">
                    <p className="font-semibold text-gray-700">Sábado y Domingo</p>
                    <p className="text-xs text-gray-400">Sin atención</p>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* ─── REDES SOCIALES ─────────────────────────────────────────────────── */}
      {(institucion?.institucion_facebook || institucion?.institucion_youtube || institucion?.institucion_twitter) && (
        <section className="py-16 bg-white relative">
          
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <SectionIn className="text-center mb-10 space-y-3">
              <Chip color={primaryColor}>Síguenos</Chip>
              <h2 className="text-3xl font-black text-gray-900">Redes Sociales</h2>
              <p className="text-gray-500">Conéctate con nosotros en nuestras plataformas digitales</p>
            </SectionIn>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {institucion.institucion_facebook && (
                <motion.a {...fadeUp(0.1)} whileHover={{ scale: 1.1, y: -5 }}
                  href={institucion.institucion_facebook} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-[#1877f2] text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FaFacebook size={18} /> Facebook
                </motion.a>
              )}
              {institucion.institucion_youtube && (
                <motion.a {...fadeUp(0.2)} whileHover={{ scale: 1.1, y: -5 }}
                  href={institucion.institucion_youtube} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-[#ff0000] text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FaYoutube size={18} /> YouTube
                </motion.a>
              )}
              {institucion.institucion_twitter && (
                <motion.a {...fadeUp(0.3)} whileHover={{ scale: 1.1, y: -5 }}
                  href={institucion.institucion_twitter} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FaTwitter size={18} /> X (Twitter)
                </motion.a>
              )}
              {institucion.institucion_celular1 && (
                <motion.a {...fadeUp(0.4)} whileHover={{ scale: 1.1, y: -5 }}
                  href={`https://wa.me/${institucion.institucion_celular1}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-[#25D366] text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FaWhatsapp size={18} /> WhatsApp
                </motion.a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── MAPA DE UBICACIÓN ──────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <SectionIn className="text-center mb-10 space-y-3">
            <Chip color={primaryColor}>Ubicación</Chip>
            <h2 className="text-3xl font-black text-gray-900">Encuéntranos</h2>
            <p className="text-gray-500">Visítanos en nuestras instalaciones</p>
          </SectionIn>

          <SectionIn delay={0.2}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
            >
              {mapLoading ? (
                <div className="h-[400px] flex items-center justify-center bg-gray-100">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 rounded-full border-2 border-t-transparent"
                    style={{ borderColor: `${primaryColor} transparent transparent transparent` }}
                  />
                </div>
              ) : (
                <MapContainer
                  center={mapPosition}
                  zoom={15}
                  style={{ height: '400px', width: '100%', zIndex: 0 }}
                  className="z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={mapPosition}>
                    <Popup>
                      <strong>Carrera de Psicología - UPEA</strong><br />
                      {institucion?.institucion_direccion || "Edificio del Área Social, 4to Piso, Av. Sucre, Zona Villa Esperanza"}
                    </Popup>
                  </Marker>
                </MapContainer>
              )}
            </motion.div>
          </SectionIn>

          <SectionIn delay={0.3} className="text-center mt-6">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(institucion?.institucion_direccion || "Edificio del Área Social, 4to Piso. Av. Sucre, Zona Villa Esperanza, El Alto, Bolivia")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
              style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
            >
              <ExternalLink size={14} />
              Abrir en Google Maps
            </motion.a>
          </SectionIn>
        </div>
      </section>
    </div>
  );
}