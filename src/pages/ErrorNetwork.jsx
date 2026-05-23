import { useNavigate } from "react-router";
import { WifiOff, RefreshCw, Home } from "lucide-react";

export default function ErrorNetwork() {
  const navigate = useNavigate();

  const handleRetry = () => {
    // Recarga la página anterior o va al inicio
    navigate(-1);
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">

      <div className="bg-orange-50 rounded-full p-6 mb-6">
        <WifiOff size={48} className="text-primary" />
      </div>

      <h1 className="text-2xl font-semibold text-gray-700 mb-3">
        Error de conexión
      </h1>
      <p className="text-gray-500 mb-2 max-w-md leading-relaxed">
        No se pudo establecer conexión con el servidor.
        Verifica tu conexión a internet e intenta de nuevo.
      </p>
      <p className="text-xs text-gray-400 mb-8">
        Si el problema persiste, contacta al administrador del sistema.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
        >
          <RefreshCw size={15} />
          Reintentar
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-5 py-2.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors"
        >
          <Home size={15} />
          Ir al inicio
        </button>
      </div>
    </div>
  );
}