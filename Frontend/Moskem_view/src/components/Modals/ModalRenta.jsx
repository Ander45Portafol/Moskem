import React, { useEffect, useState } from "react";
import {
  ArrowsPointingInIcon,
  ArrowUpOnSquareIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { InputD } from "../InputD";
import { useForm } from "../../assets/js/Forms/useForm";
import { SelectD } from "../SelectD";
import { SwitchD } from "../SwitchD";
import { SelectWD } from "../SelectWD";
import { useGet } from "../../assets/js/useGet";
import { InputDate } from "../inputDate";
import { TextArea } from "../TextArea";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useRef } from "react";

export default function ModalRenta({ isOpen, onClose, id_renta, setRenta }) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [openLightbox, setOpenLightbox] = useState(false);
  // Estados y referencias para el control de imágenes
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const { data: productos } = useGet("productos");
  const { data: clientes } = useGet("clientes");

  const SelectClientes =
    clientes?.map((registro) => ({
      id: registro.id,
      nombre: `${registro.nombres} ${registro.apellidos}`,
    })) || [];

  const SelectProductos =
    productos?.map((registro) => ({
      id: registro.id_producto,
      nombre: `${registro?.tipo_producto} - ${registro.telas?.codigo_tela??'Sin tela'}`,
    })) || [];

  const ruta = "empleados";
  const estadoInicial = {
    nombres_empleado: "",
    apellidos_empleado: "",
    usuario_empleado: "",
    tipo_empleado: "",
    documentos_empleados: "",
    correo_empleado: "",
    estado_empleado: "",
  };
  const { data, setData, handleSubmit } = useForm({
    id: id_renta,
    setForm: setRenta,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });
  const estado_renta = ["Entregado", "En proceso", "Finalizado"];
  const inputsUpdate = (e) => {
    const name = e.target.name;

    // Si el elemento es un checkbox o el evento simulado dice que es checkbox, usamos 'checked'
    const inputValue =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setData({
      ...data,
      [name]: inputValue,
    });
  };
  useEffect(() => {
    if (isOpen) {
      setRender(true);
      // Pequeño delay para que el navegador registre el cambio de estado y ejecute la animación de entrada
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Espera a que termine la animación de salida (300ms) antes de desmontar el componente
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!render) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Tarjeta del Modal con animación de escala y opacidad */}
      <div
        className={`bg-white w-[1000px] max-w-[100vw] rounded-[32px] p-10 shadow-2xl relative flex flex-col gap-8 transition-all duration-300 transform ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Botón Cerrar (X) arriba a la derecha */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-8 right-8 text-[#004B57] hover:scale-110 transition-transform"
        >
          <XMarkIcon className="size-7" />
        </button>

        {/* Encabezado del Modal */}
        <div>
          <h2 className="text-4xl font-black text-[#004B57] tracking-wide uppercase">
            Formulario - Empleados
          </h2>
        </div>

        {/* Formulario estructurado en Grid de 3 columnas */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex gap-6">
            <div className="flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <InputDate
                  type="date"
                  text="Fecha Inicio"
                  valueData={data.fecha_inicio}
                  textId="fecha_inicio"
                  view=""
                  updateData={inputsUpdate}
                />

                <InputD
                  type="date"
                  text="Fecha Devolución"
                  valueData={data.fecha_devolucion}
                  textId="fecha_devolucion"
                  view=""
                  updateData={inputsUpdate}
                />

                <SelectWD
                  text="Cliente"
                  textId="id_cliente"
                  options={SelectClientes}
                  valueData={data.id_cliente}
                  updateData={inputsUpdate}
                />
                <SelectD
                  text="Estado Renta"
                  textId="estado_renta"
                  options={estado_renta}
                  valueData={data.estado_renta}
                  updateData={inputsUpdate}
                />

                <InputD
                  text="Pago Final"
                  type="number"
                  textId="monto_total"
                  view=""
                  valueData={data.monto_total}
                  updateData={inputsUpdate}
                />
                <InputD
                  text="Deposito"
                  type="number"
                  textId="deposito"
                  view=""
                  valueData={data.deposito}
                  updateData={inputsUpdate}
                />
              </div>
              <TextArea
                text="Notas"
                textId="notas_descripcion"
                valueData={data.notas_descripcion}
                updateData={inputsUpdate}
              />
            </div>

            <div className="grid grid-cols-1 w-3/8">
              <SelectWD
                text="Producto"
                options={SelectProductos}
                textId="id_producto"
                valueData={data.id_producto}
                updateData={inputsUpdate}
              />
              <div className="grid grid-cols-2 gap-2 mb-10">
                <div className="flex flex-col gap-1.5">
                  <label className="text-md font-semibold text-[#004B57]">
                    Color:
                  </label>
                  <div className="flex justify-center h-1/2 items-center gap-1.5 bg-[#004053] text-[#B2B2B2] font-bold rounded-2xl">
                    {data.color || "Verde"}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-md font-semibold text-[#004B57]">
                    Color:
                  </label>
                  <div className="flex justify-center h-1/2 items-center gap-1.5 bg-[#004053] text-[#B2B2B2] font-bold rounded-2xl">
                    {data.color || "Verde"}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-0">
                <div className=" h-full w-4/5 bg-gray-400 rounded-2xl"></div>
                <div className="flex-col content-end mb-3 items-start">
                  <button
                    type="button"
                    onClick={() => {
                      if (previewImage) {
                        setOpenLightbox(true);
                      } else {
                        Swal.fire({
                          toast: true,
                          position: "top-end",
                          title: "No hay imagen para ampliar",
                          icon: "info",
                          showConfirmButton: false,
                          timer: 2000,
                        });
                      }
                    }}
                    className="h-10 w-10 bg-[#004053] hover:bg-[#002e3c] rounded-lg flex justify-center items-center text-white m-2 transition-colors"
                  >
                    <ArrowsPointingInIcon className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="h-10 w-10 bg-[#00A29B] hover:bg-[#008781] rounded-lg m-2 flex justify-center items-center text-[#004053] transition-colors"
                  >
                    <ArrowUpOnSquareIcon className="size-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Botón Guardar / Editar */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-[#B4D333] hover:bg-[#a3c02b] text-[#004B57] font-bold px-5 py-2 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <CheckCircleIcon className="size-6" />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
