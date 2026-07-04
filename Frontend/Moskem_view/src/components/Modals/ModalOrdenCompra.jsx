import React, { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export default function ModalOrdenCompra({ show, onClose }) {
  const [render, setRender] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  // Estado para controlar qué pestaña está activa: 'accesorios' o 'telas'
  const [activeTab, setActiveTab] = useState("accesorios");

  useEffect(() => {
    if (show) {
      setRender(true);
      // Pequeño delay para ejecutar la animación de entrada
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Espera a que termine la animación de salida (300ms) antes de desmontar
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enviando formulario de:", activeTab);
  };

  if (!render) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Tarjeta del Modal con ancho personalizado similar a los otros de Moskem */}
      <div
        className={`bg-white w-[900px] max-w-[95vw] rounded-[32px] p-10 shadow-2xl relative flex flex-col gap-6 transition-all duration-300 transform ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Botón Cerrar (X) arriba a la derecha */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-8 right-8 text-[#004B57] hover:scale-110 transition-transform"
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

        {/* Encabezado del Modal */}
        <div>
          <h2 className="text-4xl font-black text-[#004B57] tracking-wide uppercase">
            Orden de Compra
          </h2>
        </div>

        {/* Pestañas (Tabs) estilizadas con la identidad visual del proyecto */}
        <div className="flex border-b border-gray-300 mb-2">
          <button
            type="button"
            onClick={() => setActiveTab("accesorios")}
            className={`px-6 py-2 font-bold text-base rounded-t-xl border-t border-x transition-colors ${
              activeTab === "accesorios"
                ? "bg-[#009b9e] text-white border-transparent hover:bg-[#008285]"
                : "bg-white text-[#004B57] border-gray-300 border-b-white -mb-[1px]"
            }`}
          >
            Merceria
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("telas")}
            className={`px-6 py-2 font-bold text-base rounded-t-xl border-t border-x transition-colors ${
              activeTab === "telas"
                ? "bg-[#009b9e] text-white border-transparent hover:bg-[#008285]"
                : "bg-white text-[#004B57] border-gray-300 border-b-white -mb-[1px]"
            }`}
          >
            Telas
          </button>
        </div>

        {/* Formulario en Grid de 3 columnas para aprovechar de forma elegante el espacio ancho */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
            {/* CAMPO DINÁMICO: Cambia según la pestaña seleccionada */}
            {activeTab === "accesorios" ? (
              <div className="flex flex-col gap-2">
                <label className="text-[#004B57] font-bold text-base">
                  Merceria
                </label>
                <select className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 px-4 text-gray-500 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none appearance-none">
                  <option>Seleccione una opción</option>
                </select>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-[#004B57] font-bold text-base">
                  Tela
                </label>
                <select className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 px-4 text-gray-500 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none appearance-none">
                  <option>Seleccione una opción</option>
                </select>
              </div>
            )}

            {/* Campos Comunes */}
            <div className="flex flex-col gap-2">
              <label className="text-[#004B57] font-bold text-base">
                Fecha Compra
              </label>
              <input
                type="date"
                className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 px-4 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#004B57] font-bold text-base">
                Estado Compra
              </label>
              <select className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 px-4 text-gray-500 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none appearance-none">
                <option>Seleccione una opción</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#004B57] font-bold text-base">
                Cantidad Faltante
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 px-4 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#004B57] font-bold text-base">
                Cantidad Comprada
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 px-4 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#004B57] font-bold text-base">
                Generado por
              </label>
              <select className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 px-4 text-gray-500 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none appearance-none">
                <option>Seleccione una opción</option>
              </select>
            </div>
          </div>

          {/* Botón Guardar / Editar (Usando Heroicons para el ícono) */}
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="bg-[#C1D700] hover:bg-[#adc000] text-[#004B57] font-bold py-3 px-8 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95 text-base"
            >
              <PencilSquareIcon
                className="w-5 h-5 text-[#004B57]"
                strokeWidth={2.5}
              />
              Editar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
