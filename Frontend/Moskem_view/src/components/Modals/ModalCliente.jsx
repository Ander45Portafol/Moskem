import { useEffect, useState } from "react";
import {CheckCircleIcon,ChevronDownIcon, CalendarIcon} from "@heroicons/react/24/solid";

export function ModalCliente({ isOpen, onClose, tipo }) {
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

  const handleFondoClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      onClick={handleFondoClick}
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Contenedor Blanco con animación pop y desvanecimiento */}
      <div
        className={`bg-white rounded-[32px] shadow-2xl w-full max-w-4xl p-8 relative flex flex-col gap-6 border border-gray-100 transform transition-all duration-300 ${
          isAnimating
            ? "opacity-100 scale-100 translateY-0"
            : "opacity-0 scale-95 translateY(10px)"
        }`}
      >
        {/* Botón X para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#004B57] hover:bg-gray-100 p-2 rounded-full transition-colors"
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

        {/* Encabezado Principal */}
        <div>
          <h2 className="text-3xl font-black text-[#004B57] uppercase">
            Formulario – Clientes
          </h2>
        </div>

        {/* Formulario */}
        <form className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-6">
          {/* --- FILA 1 --- */}
          <div className="flex flex-col gap-1.5">
            <label className="text-md font-semibold text-[#004B57] ">
              Nombres
            </label>
            <input
              type="text"
              className="bg-[#D9D9D9]/50 border-none rounded-xl p-3 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-md font-semibold text-[#004B57] ">
              Apellidos
            </label>
            <input
              type="text"
              className="bg-[#D9D9D9]/50 border-none rounded-xl p-3 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-md font-semibold text-[#004B57] ">
              Teléfono
            </label>
            <input
              type="tel"
              placeholder="7000-0000"
              className="bg-[#D9D9D9]/50 border-none rounded-xl p-3 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all"
            />
          </div>

          {/* --- FILA 2 --- */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-md font-semibold text-[#004B57] ">
              Tipo Membresía
            </label>
            <div className="relative">
              <select className="w-full bg-[#D9D9D9]/50 border-none rounded-xl p-3 text-gray-500 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all appearance-none pr-10">
                <option>Seleccione una opción</option>
                <option>Platinum</option>
                <option>Gold</option>
                <option>Classic</option>
              </select>
              <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#004B57]">
                <ChevronDownIcon className="size-6"/>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-md font-semibold text-[#004B57]">
              Código Membresía
            </label>
            <input
              type="text"
              className="bg-[#D9D9D9]/50 border-none rounded-xl p-3 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-md font-semibold text-[#004B57]">
              DUI
            </label>
            <input
              type="text"
              placeholder="00000000-0"
              className="bg-[#D9D9D9]/50 border-none rounded-xl p-3 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all"
            />
          </div>

          {/* --- FILA 3 --- */}
          <div
            className={`flex flex-col gap-1.5 ${tipo === "citas" ? "md:col-span-2" : "md:col-span-1"}`}
          >
            <label className="text-md font-semibold text-[#004B57]">
              Correo Electrónico
            </label>
            <input
              type="email"
              className="w-full bg-[#D9D9D9]/50 border-none rounded-xl p-3 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all"
            />
          </div>

          {tipo === "agregar" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-md font-semibold text-[#004B57]">
                Fecha Nacimiento
              </label>
              <input
                type="date"
                className="w-full bg-[#D9D9D9]/50 border-none rounded-xl p-3 text-gray-500 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all"
              />
            </div>
          )}

          {tipo === "agregar" && <div className="hidden md:block"></div>}

          {/* --- BOTÓN ACCIÓN --- */}
          <div className="md:col-span-3 flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#B4D333] hover:bg-[#a3c02b] text-[#004B57] font-bold px-5 py-2 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
            <CheckCircleIcon className="size-6"/>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
