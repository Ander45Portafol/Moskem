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
import { DataList } from "../DataList";

export default function ModalRenta({
  isOpen,
  onClose,
  id_renta,
  setRenta,
  isModalDetalle,
}) {
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

  const ruta = "rentas";
  const estadoInicial = {
    id_cliente: "",
    id_empleado: "",
    fecha_inicio: "",
    fecha_devolucion: "",
    fecha_evento: "",
    monto_total: "",
    deposito: "",
    estado_renta: "",
    notas_descripcion: "",
    visibilidad_renta: "",
  };

  const { data, setData, handleSubmit } = useForm({
    id: id_renta,
    setForm: setRenta,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Ejecutas la petición al backend (esperamos a que responda)
      const result = await handleSubmit(e);

      // 2. Buscamos el nombre del cliente seleccionado para actualizar la vista localmente
      const clienteEncontrado = clientes?.find(
        (c) => String(c.id) === String(data.id_cliente),
      );
      const nombreCliente = clienteEncontrado
        ? `${clienteEncontrado.nombres} ${clienteEncontrado.apellidos}`
        : "Cliente no seleccionado";

      // 3. Objeto formateado como lo espera la tabla en Rentas.jsx
      const registroActualizado = {
        ...data,
        id_renta: id_renta || result?.id_renta || Date.now(),
        nombre_completo_cliente: nombreCliente,
        estado_renta: data.estado_renta,
      };

      // 4. Actualización optimista del estado local en Rentas.jsx
      setRenta((prevRentas) => {
        if (!Array.isArray(prevRentas)) return [registroActualizado];

        if (id_renta) {
          // Si es edición, reemplazamos la fila correspondiente
          return prevRentas.map((item) =>
            item.id_renta === id_renta
              ? { ...item, ...registroActualizado }
              : item,
          );
        } else {
          // Si es creación, agregamos el nuevo registro arriba
          return [registroActualizado, ...prevRentas];
        }
      });

      // 5. Ahora sí cerramos este modal y abrimos el de detalle de forma segura
      onClose();
      if (isModalDetalle) {
        isModalDetalle(true);
      }
    } catch (error) {
      console.error("Error al guardar la renta:", error);
    }
  };

  // ... (tus useEffects e inputsUpdate se mantienen exactamente igual) ...

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
      <div
        className={`bg-white w-[700px] max-w-[100vw] rounded-[32px] p-10 shadow-2xl relative flex flex-col gap-8 transition-all duration-300 transform ${
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
            Formulario - Rentas
          </h2>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col">
          {/* CAMPOS DEL FORMULARIO */}
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
              <DataList
                text="Cliente"
                textId="id_cliente"
                nametag="id_cliente"
                dataList={SelectClientes}
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
                <label className="text-md font-semibold text-[#004B57]">
                  Pago Final
                </label>
                <input
                  type="number"
                  className="bg-[#D9D9D9]/50 border-none rounded-lg p-2 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all disabled:cursor-not-allowed"
                  value={data.monto_total}
                  id="monto_total"
                  name="monto_total"
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

          {/* BOTÓN GUARDAR SIN onClick INLINE */}
          <div className="flex justify-end mt-4 gap-4">
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
