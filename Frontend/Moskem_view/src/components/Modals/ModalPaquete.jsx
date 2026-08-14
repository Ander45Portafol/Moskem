import { useEffect, useState } from "react";
import { useGet } from "../../assets/js/useGet";
import { SelectD } from "../SelectD";
import { InputN } from "../InputN";
import { useForm } from "../../assets/js/Forms/useForm";
import { DataList } from "../DataList";
import {
  ArrowRightCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Paquete } from "../Paquete";

export function ModalPaquetes({
  isOpen,
  onClose,
  tipo,
  id_paquete,
  setPaquete,
}) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const { data } = useGet("paquetes");

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  //Funcion para guardar el Id del paquete elegido

  if (!render) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`bg-white w-[1000px] max-w-[70vw] rounded-[32px] px-10 py-4 shadow-2xl relative flex flex-col gap-8 transition-all duration-300 transform ${isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
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
            Paquetes para bodas
          </h2>
          <h3 className="uppercase text-xl text-[#004053]">
            Escoge una opción
          </h3>
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-h-[60vh] overflow-y-auto overflow-x-hidden pr-2">
            {data.length != 0
              ? data &&
                data.map((paquete) => (
                  <Paquete
                    key={paquete.id_paquete}
                    id={paquete.id_paquete}
                    isSelected={paquete.id_paquete === id_paquete}
                    guardarId={() => {
                      setPaquete(paquete.id_paquete);
                    }}
                    nombre={paquete.nombre_paquete}
                    list={paquete.detalle_paquete.map(
                      (detalle) => detalle.prenda_paquete,
                    )}
                  />
                ))
              : null}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-[#BCCF00] hover:bg-[#919E0E] text-[#004053] font-bold px-5 py-2 mt-2 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
            onClick={onClose}
          >
            <ArrowRightCircleIcon className="size-6" />
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
