import React, { useEffect, useState } from "react";

export default function ModalPedidosEmpleado({ isOpen, onClose, empleado }) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      // Pequeño delay para permitir que el DOM se entere de que el componente existe
      // antes de lanzar la animación de transición
      const timer = setTimeout(() => setIsAnimating(true), 30);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Espera a que termine la animación de salida (300ms) antes de desmonterlo por completo
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!render) return null;

  // Datos simulados de ejemplo basados en tu diseño
  const pedidosSimulados = [
    {
      id: 1,
      cliente: "Anderson Aguilar",
      prenda: "Camisa ML",
      entrega: "20-10-2026",
      estado: "En proceso",
    },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Tarjeta del Modal con animación de escala */}
      <div
        className={`bg-white w-[900px] max-w-[95vw] rounded-[32px] p-12 shadow-2xl relative flex flex-col gap-8 transition-all duration-300 transform ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Botón Cerrar (X) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-10 right-10 text-[#004B57] hover:scale-110 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Encabezado */}
        <div>
          <h2 className="text-4xl font-black text-[#004B57] tracking-wide uppercase">
            Pedidos - Empleado
          </h2>
          {empleado && (
            <p className="text-gray-500 font-medium mt-1 text-sm">
              Mostrando asignaciones para:{" "}
              <span className="font-bold text-[#004B57]">
                {empleado.nombres} {empleado.apellidos}
              </span>
            </p>
          )}
        </div>

        {/* Tabla de pedidos interna */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300 text-base font-bold text-black tracking-wide">
                <th className="pb-4 font-bold w-16">ID</th>
                <th className="pb-4 font-bold">Cliente</th>
                <th className="pb-4 font-bold">Tipo de prenda</th>
                <th className="pb-4 font-bold">Fecha entrega</th>
                <th className="pb-4 font-bold">Estado pedido</th>
              </tr>
            </thead>
            <tbody className="text-base font-medium text-gray-700">
              {pedidosSimulados.map((pedido) => (
                <tr key={pedido.id}>
                  <td className="py-5 text-black">{pedido.id}</td>
                  <td className="py-5 text-black">{pedido.cliente}</td>
                  <td className="py-5 text-black">{pedido.prenda}</td>
                  <td className="py-5 text-black">{pedido.entrega}</td>
                  <td className="py-5">
                    <span className="bg-[#A3B8CC]/60 text-[#004B57] font-semibold px-4 py-1.5 rounded-full text-sm">
                      {pedido.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
