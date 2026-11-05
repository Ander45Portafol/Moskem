import { useEffect, useState, useRef } from "react";
import { useGet } from "../../assets/js/useGet";
import { SelectD } from "../SelectD";
import { InputN } from "../InputN";
import { useForm } from "../../assets/js/Forms/useForm";
import { DataList } from "../DataList";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Paquete } from "../Paquete";
import { apiFetch } from "../../services/api";

export function ModalPaquetes({
  isOpen,
  onClose,
  id_paquete,
  id_pedido,
  setPaquete,
  paquetes = [],
  tipoEvento = "",
  onSiguienteDetalle,
  onRegresar, // 👈 1. Recibimos la prop para regresar al modal de Pedido
}) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const versionSeleccionRef = useRef(0);

  const cargarPaquetes = async (id, paqueteSeleccionado, signal) => {
    const idPaqueteSeleccionado = paqueteSeleccionado || null;
    const versionInicial = versionSeleccionRef.current;

    const aplicarPaqueteSiNoCambioSeleccion = (idPaquete) => {
      if (
        !signal.aborted &&
        versionSeleccionRef.current === versionInicial
      ) {
        setPaquete(idPaquete);
      }
    };

    try {
      const resDetalleData = await apiFetch(`detalles/${id}`, { signal });
      const listaDetalles = Array.isArray(resDetalleData)
        ? resDetalleData
        : resDetalleData?.data || [];

      const detalleConPaquete = listaDetalles.find((d) => d.id_paquete);

      if (detalleConPaquete?.id_paquete) {
        aplicarPaqueteSiNoCambioSeleccion(detalleConPaquete.id_paquete);
        return;
      }
      if (signal.aborted) return;

      const responseData = await apiFetch(`getPaquete/${id}`, { signal });
      aplicarPaqueteSiNoCambioSeleccion(
        responseData?.data?.id_paquete || idPaqueteSeleccionado,
      );
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error al cargar el paquete del pedido:", error);
        aplicarPaqueteSiNoCambioSeleccion(idPaqueteSeleccionado);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let timer;

    if (isOpen) {
      if (id_pedido) {
        cargarPaquetes(id_pedido, id_paquete, controller.signal);
      }
      else setPaquete(null);

      setRender(true);
      timer = setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      timer = setTimeout(() => setRender(false), 300);
    }

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
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
                const estaBloqueado = Boolean(id_paquete) && !esElSeleccionado;

                return (
                  <Paquete
                    key={paquete.id_paquete}
                    id={paquete.id_paquete}
                    isSelected={esElSeleccionado}
                    isDisabled={estaBloqueado}
                    guardarId={() => {
                      if (!estaBloqueado) {
                        versionSeleccionRef.current += 1;
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

        {/* 2. Botones de Navegación (Regresar y Siguiente) */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            className="bg-[#004053] hover:bg-[#002e3c] text-white font-bold px-5 py-2 mt-2 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
            onClick={() => {
              onClose();
              if (onRegresar) onRegresar(); // 👈 Cierra este modal y abre ModalPedido
            }}
          >
            <ArrowLeftCircleIcon className="size-6" />
            Regresar
          </button>

          <button
            type="button"
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
