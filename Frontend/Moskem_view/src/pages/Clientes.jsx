import { useState } from "react";
import { ModalCliente } from "../components/Modals/ModalCliente";
import { ModalListaCitas } from "../components/Modals/ModalListaCitas";
import {MagnifyingGlassIcon, PlusCircleIcon,CalendarDaysIcon,InformationCircleIcon,CalendarIcon,TrashIcon} from "@heroicons/react/24/solid";

export function Clientes() {
  const [modalActivo, setModalActivo] = useState(null);
  const clientesIniciales = [
    {
      id: 1,
      nombres: "Anderson Isaac",
      apellidos: "Aguilar Ramos",
      membresia: "Platinum",
      correo: "aguilaranderson434@gmail.com",
    },
    {
      id: 2,
      nombres: "Diego Alberto",
      apellidos: "Vasconcelos Baiza",
      membresia: "Platinum",
      correo: "DiegoXD234@gmail.com",
    },
    {
      id: 3,
      nombres: "María Fernanda",
      apellidos: "Hernández Guardado",
      membresia: "Platinum",
      correo: "aguilaranderson434@gmail.com",
    },
  ];
  return (
    <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
      {/* Título de la sección */}
      <div>
        <h1 className="text-5xl font-black text-[#004053]">CLIENTES</h1>
        <p className="text-[#004053] text-lg font-semibold mt-1">
          En esta ventana se muestran los datos de los clientes.
        </p>
      </div>

      {/* Barra superior: Buscador + Botón Citas + Botón Agregar */}
      <div className="flex items-center gap-4 w-full mt-4">
        {/* Buscador Gris */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
            <MagnifyingGlassIcon className="size-6"/>
          </span>
          <input
            type="text"
            placeholder="Buscar"
            className="w-full bg-[#D9D9D9] border-none rounded-xl py-4 pl-12 pr-4 text-gray-700 placeholder-gray-500 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
          />
        </div>

        {/* Botón Citas (Azul Oscuro) */}
        <button
          onClick={() => setModalActivo("citas")}
          className="bg-[#004B57] hover:bg-[#00363E] text-[#B2B2B2] font-bold h-14 w-28 rounded-xl flex items-center justify-center text-lg  gap-2 transition-all active:scale-95"
        >
          <CalendarDaysIcon className="size-7" />
          Citas
        </button>

        {/* Botón Añadir (+) */}
        <button
          onClick={() => setModalActivo("agregar")}
          className="bg-[#004B57] hover:bg-[#00363E] text-[#B2B2B2] font-semibold h-14 w-18 rounded-xl flex items-center justify-center  transition-all active:scale-95"
        >
          <PlusCircleIcon className="size-7" />
        </button>
      </div>

      {/* ==========================================
                    TABLA DE DATOS DE CLIENTES
                   ========================================== */}
      <div className="overflow-x-auto mt-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200 text-lg font-semibold text-black ">
              <th className="pb-3 font-bold">Nombres</th>
              <th className="pb-3 font-bold">Apellidos</th>
              <th className="pb-3 font-bold">Tipo Membresía</th>
              <th className="pb-3 font-bold">Correo Electrónico</th>
              <th className="pb-3 text-center font-bold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-md font-normal text-black">
            {clientesIniciales.map((cliente) => (
              <tr
                key={cliente.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-4">{cliente.nombres}</td>
                <td className="py-4">{cliente.apellidos}</td>
                <td className="py-4">{cliente.membresia}</td>
                <td className="py-4">{cliente.correo}</td>
                <td className="py-4">
                  {/* Botones de acción alineados a la derecha de la fila */}
                  <div className="flex items-center justify-center gap-2">
                    {/* Botón Info (Verde Limón) */}
                    <button className="bg-[#B4D333] text-[#004B57] rounded-lg font-bold hover:bg-[#a3c02b] transition-colors flex items-center justify-center w-11 h-10">
                      <InformationCircleIcon className="size-7"/>
                    </button>

                    {/* Botón Agenda (Turquesa) -> ¡Ahora también abre las citas! */}
                    <button
                      onClick={() => setModalActivo("citas")}
                      className="bg-[#009BAE] text-white rounded-lg hover:bg-[#008292] transition-colors flex items-center justify-center w-11 h-10"
                    >
                        <CalendarIcon className="size-7"/>
                    </button>

                    {/* Botón Eliminar (Gris Oscuro) */}
                    <button className="bg-[#6B7280] text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center w-11 h-10">
                        <TrashIcon className="size-7"/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar cliente */}
      <ModalCliente
        isOpen={modalActivo === "agregar"}
        onClose={() => setModalActivo(null)}
        tipo="agregar"
      />

      {/* Modal para ver la lista de citas */}
      <ModalListaCitas
        isOpen={modalActivo === "citas"}
        onClose={() => setModalActivo(null)}
      />
    </div>
  );
}
