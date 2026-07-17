import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CalendarIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useForm } from "../../assets/js/Forms/useForm";
import { InputD } from "../InputD";
import { SelectD } from "../SelectD";
import { InputDate } from "../inputDate";

export function ModalCliente({
  isOpen,
  onClose,
  tipo,
  id_cliente,
  setCliente,
}) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const ruta = "clientes";
  const estadoInicial = {
    nombres_cliente: "",
    apellidos_cliente: "",
    correo_electronico: "",
    fecha_nacimiento: "",
    telefono_contacto: "",
    documento_cliente: "",
    tipo_membresia: "",
  };
  const { data, setData, handleSubmit } = useForm({
    id: id_cliente,
    setForm: setCliente,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });
  const optionsMembresia = ["Platinum", "Normal", "Elite"];

  //En esta funcion se guardan los valores que tienen en ese momento cada input
  const inputsUpdate = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  //Funcionalidad el useEffect es controlar los estados del modal
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
  //Funcion creada para manejar el evento de cuando se abre el modal
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
          <XMarkIcon className="size-7" />
        </button>

        {/* Encabezado Principal */}
        <div>
          <h2 className="text-3xl font-black text-[#004B57] uppercase">
            Formulario – Clientes
          </h2>
        </div>

        {/* Formulario */}
        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-6"
          onSubmit={handleSubmit}
        >
          <InputD
            text="Nombres"
            type="text"
            valueData={data.nombres_cliente}
            textId="nombres_cliente"
            view=""
            updateData={inputsUpdate}
          />
          <InputD
            text="Apellidos"
            type="text"
            valueData={data.apellidos_cliente}
            textId="apellidos_cliente"
            view=""
            updateData={inputsUpdate}
          />
          <InputD
            text="Teléfono"
            type="text"
            valueData={data.telefono_contacto}
            textId="telefono_contacto"
            view=""
            updateData={inputsUpdate}
          />

          {/* --- FILA 2 --- */}
            <SelectD
              text="Tipo Membresia"
              textId="tipo_membresia"
              options={optionsMembresia}
              valueData={data.tipo_membresia}
              updateData={inputsUpdate}
            />

          <InputD
            text="N° Documento"
            type="text"
            textId="documento_cliente"
            view="00000000-0"
            valueData={data.documento_cliente}
            updateData={inputsUpdate}
          />
          <InputDate
            text="Fecha Nacimiento"
            type="date"
            textId="fecha_nacimiento"
            valueData={data.fecha_nacimiento}
            updateData={inputsUpdate}
          />

          {/* --- FILA 3 --- */}
          <InputD
            text="Correo Electrónico"
            type="email"
            textId="correo_electronico"
            view=""
            valueData={data.correo_electronico}
            updateData={inputsUpdate}
          />

          {/* --- BOTÓN ACCIÓN --- */}

          <div className="md:col-span-3 flex justify-end mt-4">
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
