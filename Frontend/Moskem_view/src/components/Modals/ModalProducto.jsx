import React, { useEffect, useState } from "react";

export default function ModalProducto({ show, onClose, tipo, producto }) {
  // Usamos el mismo control de animación nativo de tus otros componentes
  const [render, setRender] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setRender(true);
      // Pequeño delay para registrar el cambio de estado y ejecutar la animación de entrada
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Espera a que termine la animación de salida (300ms) antes de desmontar
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!render) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Tarjeta del Modal con animación de escala y opacidad exacta */}
      <div
        className={`bg-white w-[900px] max-w-[95vw] rounded-[32px] p-10 shadow-2xl relative flex flex-col gap-8 transition-all duration-300 transform ${
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
            {tipo === "ver" ? "Detalle del Producto" : "Formulario - Productos"}
          </h2>
        </div>

        {/* Formulario estructurado en Grid idéntico a tus referencias */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
            {/* Tipo Producto */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-[#004B57] font-bold text-base">
                Tipo Producto
              </label>
              <div className="relative">
                <select
                  name="tipo_producto"
                  disabled={tipo === "ver"}
                  defaultValue={tipo === "ver" ? producto?.tipoProducto : ""}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                  }}
                  className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 pl-4 pr-10 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none appearance-none"
                >
                  <option value="" disabled hidden>
                    Seleccione una opción
                  </option>
                  <option value="Camisa ML">Camisa ML</option>
                  <option value="Chaleco">Chaleco</option>
                  <option value="Pantalón">Pantalón</option>
                </select>
                <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#004B57]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Código Tela */}
            <div className="flex flex-col gap-2">
              <label className="text-[#004B57] font-bold text-base">
                Código Tela
              </label>
              <input
                type="text"
                name="codigo_tela"
                disabled={tipo === "ver"}
                defaultValue={tipo === "ver" ? "C-10" : ""}
                className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 px-4 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
              />
            </div>

            {/* Tela */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-[#004B57] font-bold text-base">Tela</label>
              <div className="relative">
                <select
                  name="tela"
                  disabled={tipo === "ver"}
                  defaultValue={tipo === "ver" ? producto?.tela : ""}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                  }}
                  className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 pl-4 pr-10 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none appearance-none"
                >
                  <option value="" disabled hidden>
                    Seleccione una opción
                  </option>
                  <option value="Casimir #10">Casimir #10</option>
                </select>
                <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#004B57]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Talla */}
            <div className="flex flex-col gap-2">
              <label className="text-[#004B57] font-bold text-base">
                Talla
              </label>
              <input
                type="text"
                name="talla"
                disabled={tipo === "ver"}
                defaultValue={tipo === "ver" ? producto?.talla : ""}
                className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 px-4 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
              />
            </div>

            {/* Costo */}
            <div className="flex flex-col gap-2">
              <label className="text-[#004B57] font-bold text-base">
                Costo
              </label>
              <input
                type="text"
                name="costo"
                disabled={tipo === "ver"}
                defaultValue={tipo === "ver" ? "$25.00" : ""}
                className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 px-4 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
              />
            </div>
          </div>

          {/* Botón Guardar / Editar Estilo Original */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              onClick={onClose}
              className="bg-[#C1D700] hover:bg-[#adc000] text-[#004B57] font-bold py-3 px-8 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95 text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
              {tipo === "ver" ? "Guardar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
