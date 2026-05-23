import { useOutletContext } from "react-router";
import HeroBanner           from "../components/index_comp/HeroBanner";
import QuickAccess          from "../components/index_comp/QuickAccess";
import MarqueeText          from "../components/index_comp/MarqueeText";
// import CategoriesExplorer   from "../components/index_comp/CategoriesExplorer"; // No se usa
import MisionVisionAcordion from "../components/index_comp/MisionVisionAcordion";
import LatestConvocatorias  from "../components/index_comp/LatestConvocatorias";
import VideoVision          from "../components/index_comp/VideoVision";
import GacetaCarousel       from "../components/index_comp/GacetaCarousel";
import LatestCursos         from "../components/index_comp/LatestCursos";
import Autoridades          from "../components/index_comp/Autoridades";
import LogosBar             from "../components/index_comp/LogosBar";

export default function HomeView() {
  const {
    loading,
    institucion,
    portadas,
    autoridades,
    videos,
    publicaciones,
    linksExternos,
    convocatorias,
    cursos,
    eventos,
    gaceta,
    ofertas,
    servicios,
  } = useOutletContext();

  return (
    <main id="contenido" className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* 1 — HERO + QUICK ACCESS */}
      <section className="relative">
        <HeroBanner
          institucion={institucion}
          portadas={portadas}
          loading={loading}
          overlayOpacity="bg-gradient-to-t from-black/85 via-black/60 to-transparent"
          height="min-h-[750px] lg:min-h-[850px]"
          childrenPosition="bottom-0 left-0 right-0 translate-y-1/4 px-4 sm:px-6 lg:px-8"
          autoSlide={true}
          slideInterval={6000}
          showButtons={true}
        >
          <QuickAccess linksExternos={linksExternos} loading={loading} />
        </HeroBanner>
      </section>

      {/* 2 — MARQUEE INSTITUCIONAL */}
      <section className="bg-primary/5 border-y border-primary/10">
        <MarqueeText institucion={institucion} />
      </section>

      {/* 3 — MISIÓN, VISIÓN Y OBJETIVOS (OCUPANDO TODO EL ANCHO) */}
      <section className="py-24 bg-gray-50/70">
        {/* Eliminamos el max-w restrictivo y la grid de 2 columnas para que sea full width */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          
          {/* Encabezado de la sección */}
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">
              {institucion?.institucion_nombre ?? "Universidad Pública de El Alto"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              Nuestra Institución
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full" />
          </div>

          {/* El componente ahora ocupa todo el espacio disponible */}
          <MisionVisionAcordion institucion={institucion} loading={loading} />
        </div>
      </section>

      {/* 4 — ÚLTIMAS CONVOCATORIAS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LatestConvocatorias convocatorias={convocatorias} loading={loading} />
        </div>
      </section>

      {/* 5 — VIDEO VISIÓN (FONDO OSCURO PARA DESTACAR) */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VideoVision institucion={institucion} loading={loading} />
        </div>
      </section>

      {/* 6 — GACETA UNIVERSITARIA */}
      <section className="py-20 bg-gray-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GacetaCarousel gaceta={gaceta} loading={loading} />
        </div>
      </section>

      {/* 7 — ÚLTIMOS CURSOS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LatestCursos cursos={cursos} loading={loading} />
        </div>
      </section>

      {/* 8 — AUTORIDADES */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Autoridades autoridades={autoridades} loading={loading} />
        </div>
      </section>

      {/* 9 — LOGOS INSTITUCIONALES */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LogosBar institucion={institucion} loading={loading} />
        </div>
      </section>

    </main>
  );
}