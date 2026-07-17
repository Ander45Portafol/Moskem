import React, { useEffect, useState } from "react";
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
import { useGet } from "../assets/js/useGet";
import { useDelete } from "../assets/js/useDelete";
import { API } from "../assets/js/global";

export function Empleados() {
  // --- ESTADOS PARA MODAL 1: REGISTRO / EDICIÓN ---
  const [modalActivo, setModalActivo] = useState(null);
  const [idEmpleado, setIdEmpleado] = useState(null);
  const { data, message, setData } = useGet("empleados");
  const { deleteRecord } = useDelete({ ruta: "empleados", setData });
  // --- ESTADOS PARA MODAL 2: VISTA DE PEDIDOS (INFORMACIÓN) ---
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const modalActualizar = (id) => {
    setIdEmpleado(id);
    setModalActivo("agregar");
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEmpleados(searchQuery);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);
  //Función creada para el motor de busqueda
  const fetchEmpleados = async (query = "") => {
    try {
      // Si hay query usamos la ruta de buscar, si no, traemos todos
      const url = query
        ? `${API}empleados/buscar?q=${encodeURIComponent(query)}`
        : `${API}empleados`;
      //Petición a la API
      const response = await fetch(url);
      //Validamos si la petición fue exitosa o si tuvo algun error
      if (response.ok) {
        //Al ser exitosa la petición la convertimos en formato JSON
        const responseData = await response.json();
        //Actualiza el estado de los datos
        setData(responseData.data);
      }
    } catch (error) {
      console.error("Error al traer los empleados:", error);
    }
  };
  return (
    <div className="flex-1 p-6 h-screen overflow-y-auto bg-white flex flex-col gap-6">
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Botón Añadir (+) - Activa el Modal de Formulario */}
        <button
          onClick={() => setModalActivo("agregar")}
          className="bg-[#004B57] hover:bg-[#00363E] text-white font-semibold p-3 rounded-xl flex items-center justify-center shadow-sm transition-all active:scale-95 h-14 w-18"
        >
          <PlusCircleIcon className="size-7" />
        </button>
      </div>

      {/* Tabla de Empleados */}
      <div className="max-h-2/3 overflow-y-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b-2 border-gray-200 text-lg font-semibold text-black">
              <th className="py-4 font-bold">Nombres</th>
              <th className="py-4 font-bold">Apellidos</th>
              <th className="py-4 font-bold">Tipo Empleado</th>
              <th className="py-4 font-bold">Código Empleado</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-md font-normal text-gray-700">
            {data.length != 0 ? (
              data &&
              data.map((empleado) => (
                <tr
                  key={empleado.id}
                  className="hover:bg-gray-200 transition-colors"
                >
                  <td className="py-4 text-black">{empleado.nombres}</td>
                  <td className="py-4 text-black">{empleado.apellidos}</td>
                  <td className="py-4 text-black">{empleado.tipo_empleado}</td>
                  <td className="py-4 text-black">
                    {empleado.codigo_empleado}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* 💡 Botón Info (Verde Limón) - AHORA ABRE EL MODAL DE PEDIDOS */}
                      <button
                        onClick={() => modalActualizar(empleado.id)}
                        className="bg-[#B4D333] text-[#004B57] p-2 rounded-lg font-bold hover:bg-[#a3c02b] transition-all active:scale-95 flex items-center justify-center w-11 h-10"
                      >
                        <InformationCircleIcon className="size-7" />
                      </button>

                      {/* Botón Editar/Ver Lista (Turquesa) */}
                      <button className="bg-[#009BAE] text-white p-2 rounded-lg hover:bg-[#008292] transition-colors flex items-center justify-center w-11 h-10">
                        <ClipboardDocumentListIcon className="size-7" />
                      </button>

                      {/* Botón Eliminar (Gris Oscuro) */}
                      <button
                        className="bg-[#6B7280] text-white p-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center w-11 h-10"
                        onClick={() => deleteRecord(empleado.id)}
                      >
                        <TrashIcon className="size-7" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              //Si no existen registros, solo mostramos ese mensaje
              <tr className="h-14  text-md flex justify-center items-center font-semibold hover:bg-gray-200 ">
                <td className="w-56 ml-2">
                  <p>No existen registros</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* MODAL 1: FORMULARIO REGISTRAR / EDICIÓN */}
      <ModalEmpleado
        isOpen={modalActivo === "agregar"}
        onClose={() => {
          setModalActivo(null);
          setIdEmpleado(null); // <-- IMPORTANTE: Limpiamos el ID al cerrar
        }}
        tipo={idEmpleado ? "actualizar" : "agregar"}
        id_empleado={idEmpleado}
        setEmpleado={setData}
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
