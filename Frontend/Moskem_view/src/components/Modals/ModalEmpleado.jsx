import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { InputD } from "../InputD";
import { useForm } from "../../assets/js/Forms/useForm";
import { SelectD } from "../SelectD";
import { SwitchD } from "../SwitchD";

export default function ModalEmpleado({
  isOpen,
  onClose,
  tipo,
  id_empleado,
  setEmpleado,
}) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
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
    id: id_empleado,
    setForm: setEmpleado,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });
  const tipos_empleados = [
    "Administrador",
    "Sastre",
    "Vendedor",
    "root",
    "Diseñador",
    "Pasantes",
  ];
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
          <XMarkIcon className="size-7" />
        </button>

        {/* Encabezado del Modal */}
        <div>
          <h2 className="text-4xl font-black text-[#004B57] tracking-wide uppercase">
            Formulario - Empleados
          </h2>
        </div>

        {/* Formulario estructurado en Grid de 3 columnas */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
            <InputD
              type="text"
              text="Nombres"
              valueData={data.nombres_empleado}
              textId="nombres_empleado"
              view=""
              updateData={inputsUpdate}
            />

            <InputD
              type="text"
              text="Apellidos"
              valueData={data.apellidos_empleado}
              textId="apellidos_empleado"
              view=""
              updateData={inputsUpdate}
            />

            <div className="flex flex-col gap-2">
              <label className="text-[#004B57] font-bold text-base">
                Código Empleado
              </label>
              <input
                type="text"
                name="codigo_empleado"
                value={data.codigo_empleado || ""}
                readOnly
                onChange={inputsUpdate}
                className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 px-4 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
              />
            </div>

            <SelectD
              text="Tipo Empleado"
              textId="tipo_empleado"
              options={tipos_empleados}
              valueData={data.tipo_empleado}
              updateData={inputsUpdate}
            />
            <InputD
              text="DUI"
              type="text"
              textId="documentos_empleados"
              view="00000000-0"
              valueData={data.documentos_empleados}
              updateData={inputsUpdate}
            />

            <InputD
              text="Usuario"
              type="text"
              textId="usuario_empleado"
              view=""
              valueData={data.usuario_empleado}
              updateData={inputsUpdate}
            />

            <InputD
              text="Correo Electrónico"
              type="email"
              textId="correo_empleado"
              view=""
              valueData={data.correo_empleado}
              updateData={inputsUpdate}
            />
            <SwitchD
              text="Estado"
              textId="estado_empleado"
              valueData={data.estado_empleado}
              updateData={inputsUpdate}
            />
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
