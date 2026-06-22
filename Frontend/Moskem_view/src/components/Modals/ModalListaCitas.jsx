import { useEffect, useState } from "react";

export function ModalListaCitas({ isOpen, onClose }) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      const timer = setTimeout(() => setIsAnimating(true), 30);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!render) return null;

  const citas = [
    {
      id: 1,
      fecha: "20-10-2026",
      hora: "12:00 p.m",
      motivo: "Tallaje de un traje para una boda.",
    },
    {
      id: 2,
      fecha: "10-10-2026",
      hora: "10:15 p.m",
      motivo: "Agendar cita para rentar un saco para una graduación.",
    },
  ];

  const handleFondoClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };
  return (
    <div
      onClick={handleFondoClick}
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Ventana Blanca con animación suave */}
      <div
        className={`bg-white rounded-[32px] shadow-2xl w-full max-w-4xl p-10 relative flex flex-col gap-6 border border-gray-100 transform transition-all duration-300 ${
          isAnimating
            ? "opacity-100 scale-100 translateY-0"
            : "opacity-0 scale-95 translateY-10px)"
        }`}
      >
        {/* Botón X para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-[#004B57] hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Título Principal */}
        <div>
          <h2 className="text-3xl font-black text-[#004B57] tracking-wider uppercase">
            Citas
          </h2>
        </div>

        {/* Tabla de Citas */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 text-sm font-bold text-black tracking-wide">
                <th className="pb-3 font-bold w-16">ID</th>
                <th className="pb-3  font-bold w-32">Fecha</th>
                <th className="pb-3 font-bold w-32">Hora</th>
                <th className="pb-3 font-bold">Motivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm font-medium text-gray-700">
              {citas.map((cita) => (
                <tr
                  key={cita.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 text-black font-semibold">{cita.id}</td>
                  <td className="py-4 text-black">{cita.fecha}</td>
                  <td className="py-4 text-black">{cita.hora}</td>
                  <td className="py-4 text-black">{cita.motivo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
