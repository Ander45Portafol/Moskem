import React, { useState } from "react";
// IMPORTAMOS TUS COMPONENTES EXTERNOS DE MODAL

// Importación de los iconos exactos que manejas en tu barra lateral
import {
  BriefcaseIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  TagIcon,
  KeyIcon,
  ClipboardDocumentListIcon,
  ScissorsIcon,
  SparklesIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import ModalEmpleado from "../components/Modals/ModalEmpleado";
import ModalPedidosEmpleado from "../components/Modals/ModalPedidosEmpleado";

export function Empleados() {
  // --- ESTADOS PARA MODAL 1: REGISTRO / EDICIÓN ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    codigo: "",
    tipo: "",
    dui: "",
    usuario: "",
    correo: "",
  });

  // --- ESTADOS PARA MODAL 2: VISTA DE PEDIDOS (INFORMACIÓN) ---
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  // Datos simulados de Empleados
  const [empleados, setEmpleados] = useState([
    {
      id: 1,
      nombres: "Anderson Isaac",
      apellidos: "Aguilar Ramos",
      tipo: "Sastre",
      codigo: "AR000001",
    },
    {
      id: 2,
      nombres: "Diego Alberto",
      apellidos: "Vasconcelos Baiza",
      tipo: "Vendedor",
      codigo: "DV000002",
    },
    {
      id: 3,
      nombres: "María Fernanda",
      apellidos: "Hernández Guardado",
      tipo: "Administrador",
      codigo: "MH000003",
    },
  ]);

  // --- MANEJADORES DE EVENTOS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Abre el modal de información asignando los datos de la fila actual
  const handleOpenInfo = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setIsInfoModalOpen(true);
  };

  const handleGuardar = (e) => {
    e.preventDefault();

    const nuevoEmpleado = {
      id: empleados.length + 1,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      tipo: formData.tipo || "No asignado",
      codigo: formData.codigo || `EMP0000${empleados.length + 1}`,
    };

    setEmpleados([...empleados, nuevoEmpleado]);

    // Resetear formulario y cerrar modal
    setFormData({
      nombres: "",
      apellidos: "",
      codigo: "",
      tipo: "",
      dui: "",
      usuario: "",
      correo: "",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col gap-6">
      {/* Título de la sección */}
      <div>
        <h1 className="text-5xl font-black text-[#004B57] tracking-tight uppercase">
          Empleados
        </h1>
        <p className="text-[#004B57]/80 text-lg font-medium mt-1">
          En esta ventana se muestran los datos de los empleados.
        </p>
      </div>

      {/* Barra superior: Buscador + Botón Agregar */}
      <div className="flex items-center gap-4 w-full mt-2">
        {/* Buscador Gris */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
            <MagnifyingGlassIcon className="size-6" />
          </span>
          <input
            type="text"
            placeholder="Buscar"
            className="w-full bg-[#D9D9D9]/60 border-none rounded-xl py-4 pl-12 pr-4 text-gray-700 placeholder-gray-500 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
          />
        </div>

        {/* Botón Añadir (+) - Activa el Modal de Formulario */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#004B57] hover:bg-[#00363E] text-white font-semibold p-3 rounded-xl flex items-center justify-center shadow-sm transition-all active:scale-95 h-14 w-18"
        >
          <PlusCircleIcon className="size-7" />
        </button>
      </div>

      {/* Tabla de Empleados */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200 text-lg font-semibold text-black">
              <th className="py-4 font-bold">Nombres</th>
              <th className="py-4 font-bold">Apellidos</th>
              <th className="py-4 font-bold">Tipo Empleado</th>
              <th className="py-4 font-bold">Código Empleado</th>

            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-md font-normal text-gray-700">
            {empleados.map((empleado) => (
              <tr
                key={empleado.id}
                className="hover:bg-gray-200 transition-colors"
              >
                <td className="py-4 text-black">{empleado.nombres}</td>
                <td className="py-4 text-black">{empleado.apellidos}</td>
                <td className="py-4 text-black">{empleado.tipo}</td>
                <td className="py-4 text-black">{empleado.codigo}</td>
                <td className="py-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* 💡 Botón Info (Verde Limón) - AHORA ABRE EL MODAL DE PEDIDOS */}
                    <button
                      onClick={() => handleOpenInfo(empleado)}
                      className="bg-[#B4D333] text-[#004B57] p-2 rounded-lg font-bold hover:bg-[#a3c02b] transition-all active:scale-95 flex items-center justify-center w-11 h-10"
                    >
                      <InformationCircleIcon className="size-7"/>
                    </button>

                    {/* Botón Editar/Ver Lista (Turquesa) */}
                    <button className="bg-[#009BAE] text-white p-2 rounded-lg hover:bg-[#008292] transition-colors flex items-center justify-center w-11 h-10">
                    <ClipboardDocumentListIcon className="size-7"/>
                    </button>

                    {/* Botón Eliminar (Gris Oscuro) */}
                    <button className="bg-[#6B7280] text-white p-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center w-11 h-10">
                    <TrashIcon className="size-7"/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* MODAL 1: FORMULARIO REGISTRAR / EDICIÓN */}
      <ModalEmpleado
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        onChange={handleInputChange}
        onSave={handleGuardar}
      />

      {/* MODAL 2: DETALLES DE PEDIDOS ASIGNADOS AL EMPLEADO */}
      <ModalPedidosEmpleado
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        empleado={empleadoSeleccionado}
      />
    </div>
  );
}
