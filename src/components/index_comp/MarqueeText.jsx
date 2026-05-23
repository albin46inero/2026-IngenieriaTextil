/**
 * MarqueeText
 * Props:
 *   institucion {object} — datos de getPrincipal()
 */
export default function MarqueeText({ institucion }) {
  const nombre = institucion?.institucion_nombre ?? "PSICOLOGÍA";
  const texto = `${nombre} · UNIVERSIDAD PÚBLICA DE EL ALTO · ${nombre} · UPEA · `;

  return (
    <section className="bg-primary py-3 overflow-hidden">
      <div className="flex whitespace-nowrap">
        {/* Duplicamos para el loop infinito */}
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex shrink-0 animate-marquee"
            aria-hidden={i === 1}
          >
            {[...Array(4)].map((_, idx) => (
              <span
                key={idx}
                className="text-white font-semibold text-sm uppercase tracking-widest mx-8"
              >
                {texto}
                <span className="text-white/50 mx-4">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
}