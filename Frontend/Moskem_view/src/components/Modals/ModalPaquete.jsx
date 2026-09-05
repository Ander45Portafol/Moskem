import { useEffect, useState } from "react";
import { useGet } from "../../assets/js/useGet";
import { SelectD } from "../SelectD";
import { InputN } from "../InputN";
import { useForm } from "../../assets/js/Forms/useForm";
import { DataList } from "../DataList";
import {
  ArrowRightCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Paquete } from "../Paquete";
import { API } from "../../assets/js/global";

export function ModalPaquetes({
  isOpen,
  onClose,
  id_paquete,
  id_pedido,
  setPaquete,
  paquetes = [], // <-- Paquetes filtrados
  tipoEvento = "", // <-- Nombre del evento (ej. "Boda", "Graduación")
  onSiguienteDetalle, // <-- Función para ir a ModalDetallePedido
}) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);


  const cargarPaquetes = async (id) => {
  try {
    // 1. Consultar detalles del pedido para verificar si ya tiene un paquete asignado
    const responseDetalles = await fetch(`${API}detalles/${id}`);

    if (responseDetalles.ok) {
      const resDetalleData = await responseDetalles.json();
      const listaDetalles = Array.isArray(resDetalleData)
        ? resDetalleData
        : resDetalleData?.data || [];

      // Buscar el primer detalle que tenga un id_paquete registrado
      const detalleConPaquete = listaDetalles.find((d) => d.id_paquete);

      if (detalleConPaquete?.id_paquete) {
        setPaquete(detalleConPaquete.id_paquete);
        return;
      }
    }

    // 2. Si no lo encuentra en detalles, intenta con el endpoint directo
    const response = await fetch(`${API}getPaquete/${id}`);
    if (response.ok) {
      const responseData = await response.json();
      if (responseData?.data?.id_paquete) {
        setPaquete(responseData.data.id_paquete);
      } else {
        setPaquete(null);
      }
    } else {
      setPaquete(null);
    }
  } catch (error) {
    console.error("Error al cargar el paquete del pedido:", error);
    setPaquete(null);
  }
};

  useEffect(() => {
    if (isOpen) {
      if (id_pedido) cargarPaquetes(id_pedido);
      else setPaquete(null);

      setRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, id_pedido]);

  if (!render) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white w-[1000px] max-w-[70vw] rounded-[32px] px-10 py-4 shadow-2xl relative flex flex-col gap-8 transition-all duration-300 transform ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-8 right-8 text-[#004B57] hover:scale-110 transition-transform"
        >
          <XMarkIcon className="size-7" />
        </button>

        <div>
          {/* Título Dinámico según el Tipo de Evento */}
          <h2 className="text-4xl font-black text-[#004B57] tracking-wide uppercase">
            Paquetes para {tipoEvento || "Eventos"}
          </h2>
          <h3 className="uppercase text-xl text-[#004053]">
            Escoge una opción
          </h3>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-h-[60vh] overflow-y-auto overflow-x-hidden pr-2">
            {paquetes && paquetes.length > 0 ? (
              paquetes.map((paquete) => {
                const esElSeleccionado = paquete.id_paquete === id_paquete;
                // Si id_paquete ya está definido en el pedido, bloquea todos los demás
                const estaBloqueado = Boolean(id_paquete) && !esElSeleccionado;

                return (
                  <Paquete
                    key={paquete.id_paquete}
                    id={paquete.id_paquete}
                    isSelected={esElSeleccionado}
                    isDisabled={estaBloqueado} // 👈 Pasamos la prop para deshabilitarlo visual y funcionalmente
                    guardarId={() => {
                      if (!estaBloqueado) {
                        setPaquete(paquete.id_paquete);
                      }
                    }}
                    nombre={paquete.nombre_paquete}
                    list={paquete.detalle_paquete?.map(
                      (detalle) => detalle.prenda.prenda_paquete,
                    )}
                  />
                );
              })
            ) : (
              <p className="text-gray-500 font-semibold">
                No hay paquetes disponibles para este evento.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="bg-[#BCCF00] hover:bg-[#919E0E] text-[#004053] font-bold px-5 py-2 mt-2 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
            onClick={() => {
              onClose();
              if (onSiguienteDetalle) onSiguienteDetalle();
            }}
          >
            <ArrowRightCircleIcon className="size-6" />
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
