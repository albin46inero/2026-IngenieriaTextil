import { ExternalLink, ArrowRight, Sparkles } from "lucide-react";

/**
 * QuickAccess
 * Props:
 *   linksExternos {Array} — linksExternoInterno de getRecursos()
 *   loading       {boolean}
 */
export default function QuickAccess({ linksExternos = [], loading }) {
  if (loading) {
    return (
      <div className="py-8 sm:py-12 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 sm:h-52 md:h-56 bg-gray-200/50 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (linksExternos.length === 0) return null;

  return (
    <div className="py-8 sm:py-12 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {linksExternos.map((link, idx) => (
            <a
              key={link.id_link}
              href={link.url_link}
              target="_blank"
              rel="noreferrer"
              className="group relative bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-700 ease-out block hover:-translate-y-2 sm:hover:-translate-y-3 hover:scale-[1.01] sm:hover:scale-[1.02]"
            >
              {/* Imagen de fondo */}
              {link.imagen && (
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={link.imagen}
                    alt={link.nombre}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-110 sm:group-hover:scale-125 group-hover:rotate-0 sm:group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-white/10" />
                </div>
              )}

              {!link.imagen && (
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-50 to-gray-100" />
              )}

              {/* Efecto de brillo al hover */}
              <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              {/* Número decorativo - Responsivo */}
              <span className="absolute top-3 sm:top-4 right-3 sm:right-4 text-5xl sm:text-6xl md:text-7xl font-black text-gray-300 group-hover:text-primary/40 transition-all duration-500 select-none z-10 group-hover:scale-110 sm:group-hover:scale-125 group-hover:-translate-x-1 sm:group-hover:-translate-x-2 group-hover:rotate-6 sm:group-hover:rotate-12">
                {String(idx + 1).padStart(2, "0")}
              </span>

              {/* Badge decorativo - Responsivo */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-full group-hover:translate-x-0">
                <span className="bg-primary text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg flex items-center gap-1 sm:gap-2 font-semibold whitespace-nowrap">
                  <Sparkles size={12} className="sm:w-4 sm:h-4 animate-pulse" />
                  <span className="hidden xs:inline">Acceso directo</span>
                  <span className="xs:hidden">Acceso</span>
                </span>
              </div>

              {/* Contenido principal - Responsivo */}
              <div className="relative z-10 p-4 sm:p-5 md:p-6 min-h-[220px] sm:min-h-[240px] md:min-h-[260px] flex flex-col justify-between">
                <div>
                  {/* Título con animación - Responsivo */}
                  <h3 className="font-black text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all duration-500 mb-2 sm:mb-3 text-lg sm:text-xl md:text-2xl group-hover:translate-x-1 sm:group-hover:translate-x-2 group-hover:scale-105">
                    {link.nombre.length > 30 ? (
                      // Si el título es muy largo, truncar en móvil
                      <span className="block sm:hidden">
                        {link.nombre.substring(0, 25)}...
                      </span>
                    ) : null}
                    <span className="hidden sm:inline">
                      {link.nombre.split('').map((letra, i) => (
                        <span 
                          key={i}
                          className="inline-block group-hover:animate-bounce"
                          style={{ animationDelay: `${i * 0.03}s` }}
                        >
                          {letra}
                        </span>
                      ))}
                    </span>
                    {link.nombre.length <= 30 && (
                      <span className="sm:hidden">
                        {link.nombre.split('').map((letra, i) => (
                          <span 
                            key={i}
                            className="inline-block group-hover:animate-bounce"
                            style={{ animationDelay: `${i * 0.03}s` }}
                          >
                            {letra}
                          </span>
                        ))}
                      </span>
                    )}
                  </h3>
                  
                  {/* Línea decorativa animada - Responsiva */}
                  <div className="relative mb-3 sm:mb-4">
                    <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-700" />
                    <div className="absolute top-0 left-0 w-2 sm:w-3 h-0.5 bg-primary group-hover:left-full transition-all duration-700" />
                  </div>
                  
                  {/* Tipo con animación - Responsivo */}
                  <p className="text-xs sm:text-sm text-gray-700 group-hover:text-primary transition-all duration-500 capitalize mb-2 sm:mb-4 group-hover:translate-x-1 sm:group-hover:translate-x-2 group-hover:font-medium">
                    {link.tipo?.toLowerCase()}
                  </p>

                  {/* Descripción - Responsiva */}
                  {link.descripcion && (
                    <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-all duration-500 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-16 sm:group-hover:max-h-20 overflow-hidden line-clamp-2 sm:line-clamp-3">
                      {link.descripcion}
                    </p>
                  )}
                </div>

                {/* Botón con animación - Responsivo */}
                <div className="relative mt-3 sm:mt-4">
                  <div className="flex items-center gap-2 sm:gap-3 text-primary text-sm sm:text-base font-bold group-hover:gap-3 sm:group-hover:gap-5 transition-all duration-500 group-hover:text-secondary">
                    <span className="group-hover:tracking-wider transition-all duration-500 group-hover:animate-pulse group-hover:text-base sm:group-hover:text-lg whitespace-nowrap">
                      Ir al sitio
                    </span>
                    <ArrowRight size={16} className="sm:w-5 sm:h-5 group-hover:translate-x-2 sm:group-hover:translate-x-3 group-hover:rotate-12 transition-all duration-500 group-hover:scale-110" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-700 delay-100" />
                </div>
              </div>

              {/* Efecto de borde neón */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl shadow-[0_0_20px_rgba(124,58,237,0.3)] sm:shadow-[0_0_30px_rgba(124,58,237,0.4)]" />
              </div>

              {/* Esquinas decorativas - Responsivas */}
              <div className="absolute top-0 left-0 w-10 sm:w-16 h-10 sm:h-16 border-t-2 sm:border-t-3 border-l-2 sm:border-l-3 border-primary/0 group-hover:border-primary/50 transition-all duration-500 rounded-tl-xl sm:rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-10 sm:w-16 h-10 sm:h-16 border-b-2 sm:border-b-3 border-r-2 sm:border-r-3 border-primary/0 group-hover:border-primary/50 transition-all duration-500 rounded-br-xl sm:rounded-br-2xl" />

              {/* Franja inferior */}
              <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-primary via-secondary to-pink-500 bg-[length:200%_100%] group-hover:bg-[position:100%_0] scale-x-0 group-hover:scale-x-100 transition-all duration-700 origin-left z-10 animate-gradient" />
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        @media (max-width: 480px) {
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  );
}