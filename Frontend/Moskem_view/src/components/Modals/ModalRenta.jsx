import React, { useEffect, useState } from "react";
import {
  ArrowsPointingInIcon,
  ArrowUpOnSquareIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { InputD } from "../InputD";
import { useForm } from "../../assets/js/Forms/useForm";
import { SelectD } from "../SelectD";
import { SelectWD } from "../SelectWD";
import { useGet } from "../../assets/js/useGet";
import { InputDate } from "../inputDate";
import { TextArea } from "../TextArea";
import "yet-another-react-lightbox/styles.css";

export default function ModalRenta({ isOpen, onClose, id_renta, setRenta }) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

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
      nombre: `${registro?.tipo_producto} - ${registro.telas?.codigo_tela ?? "Sin tela"}`,
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
    id_producto: "", // Se asegura de tener la propiedad en el estado inicial
  };

  const { data, setData, handleSubmit } = useForm({
    id: id_renta,
    setForm: setRenta,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });

  // 1. Encontrar el producto seleccionado actualmente
  const productoSeleccionado = productos?.find(
    (p) => String(p.id_producto) === String(data.id_producto),
  );

  // 2. Actualizar la imagen cuando cambia el producto seleccionado
  useEffect(() => {
    if (productoSeleccionado) {
      const img =
        productoSeleccionado.imagen_producto ||
        productoSeleccionado.telas?.imagen ||
        null;
      setPreviewImage(img);
    } else {
      setPreviewImage(null);
    }
  }, [data.id_producto, productos]);

  const estado_renta = ["Entregado", "En proceso", "Finalizado"];

  const inputsUpdate = (e) => {
    const name = e.target.name;
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
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
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
      {/* Tarjeta del Modal */}
      <div
        className={`bg-white w-[1000px] max-w-[100vw] rounded-[32px] p-10 shadow-2xl relative flex flex-col gap-8 transition-all duration-300 transform ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-8 right-8 text-[#004B57] hover:scale-110 transition-transform"
        >
          <XMarkIcon className="size-7" />
        </button>

        {/* Encabezado */}
        <div>
          <h2 className="text-4xl font-black text-[#004B57] tracking-wide uppercase">
            Formulario - Rentas
          </h2>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex gap-6">
            <div className="flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-5">
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
                <InputD
                  type="date"
                  text="Fecha Evento"
                  valueData={data.fecha_evento}
                  textId="fecha_evento"
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
              </div>
              <TextArea
                text="Notas"
                textId="notas_descripcion"
                valueData={data.notas_descripcion}
                updateData={inputsUpdate}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-4">
                <SelectD
                  text="Estado Renta"
                  textId="estado_renta"
                  options={estado_renta}
                  valueData={data.estado_renta}
                  updateData={inputsUpdate}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-md font-semibold text-[#004B57] ">
                    Pago Final
                  </label>
                  <input
                    type="number"
                    className="bg-[#D9D9D9]/50 border-none rounded-lg p-2 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all disabled:cursor-not-allowed"
                    value={data.monto_total}
                    id="monto_total"
                    name="monto_total"
                    placeholder=""
                    onChange={inputsUpdate}
                    disabled={true}
                  />
                </div>
                <InputD
                  text="Deposito"
                  type="number"
                  textId="deposito"
                  view=""
                  valueData={data.deposito}
                  updateData={inputsUpdate}
                />
              </div>
            </div>
            <div className="h-full w-2 bg-[#
            
            004B57]"></div>
            {/* Columna Derecha: Producto e Imagen */}
            <div className="grid grid-cols-1 w-3/8">
              <SelectWD
                text="Producto"
                options={SelectProductos}
                textId="id_producto"
                valueData={data.id_producto}
                updateData={inputsUpdate}
              />
              <div className="grid grid-cols-2 gap-2 my-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-md font-semibold text-[#004B57]">
                    Talla:
                  </label>
                  <div className="flex justify-center h-10 items-center gap-1.5 bg-[#004053] text-[#B2B2B2] font-bold rounded-2xl">
                    {/* Muestra la talla dinámicamente o "-" si no hay nada seleccionado */}
                    {productoSeleccionado?.talla || "-"}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-md font-semibold text-[#004B57]">
                    Color:
                  </label>
                  <div className="flex justify-center h-10 items-center gap-1.5 bg-[#004053] text-[#B2B2B2] font-bold rounded-2xl">
                    {/* Muestra el color dinámicamente o "-" si no hay nada seleccionado */}
                    {productoSeleccionado?.color || "-"}
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center w-full my-2">
                <div className="h-52 w-full bg-gray-200 rounded-2xl flex justify-center items-center overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Referencia del producto"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 font-medium text-sm">
                      Sin imagen
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4 gap-4">
            <button
              type="button"
              className="bg-[#009BAE] text-[#004053] font-bold px-5 py-2 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <ClipboardDocumentListIcon className="size-6" />
              Agregar Medidas
            </button>
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
