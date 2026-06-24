import { useState } from "react";
import { ModalCliente } from "../components/Modals/ModalCliente";
import { ModalListaCitas } from "../components/Modals/ModalListaCitas";
import {MagnifyingGlassIcon, PlusCircleIcon,CalendarDaysIcon,InformationCircleIcon,CalendarIcon,TrashIcon} from "@heroicons/react/24/solid";
import { useGet } from "../assets/js/useGet";

export function Clientes() {
  const [modalActivo, setModalActivo] = useState(null);
  const { data, message, setData } = useGet("clientes");
  return (
    <div className="flex-1 p-6 flex h-screen w-full flex-col gap-6">
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
            <MagnifyingGlassIcon className="size-6" />
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
      {/* 1. Quitamos h-4/6 y ponemos una altura máxima al contenedor con scroll */}
      <div className="mt-8 max-h-2/3 overflow-y-auto rounded-xl ">
        <table className="w-full text-left border-collapse">
          {/* 2. Hacemos que la cabecera se quede fija arriba usando sticky y bg-white */}
          <thead className="sticky top-0 bg-white z-10 ">
            <tr className="border-b-2 border-gray-200 text-lg font-semibold text-black">
              <th className="pb-4 pt-4 font-bold">Nombres</th>
              <th className="pb-4 pt-4 font-bold">Apellidos</th>
              <th className="pb-4 pt-4 font-bold">Tipo Membresía</th>
              <th className="pb-4 pt-4 font-bold">Correo Electrónico</th>
              <th className="pb-4 pt-4 text-center font-bold w-44">Acciones</th>
            </tr>
          </thead>

          {/* 3. El tbody vuelve a ser el nativo (sin block ni h-96), el contenedor de arriba hace el scroll */}
          <tbody className="divide-y divide-gray-200 text-md font-normal text-black">
            {data ? (
              data &&
              data.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="hover:bg-gray-200 transition-colors"
                >
                  <td className="py-4">{cliente.nombres}</td>

                  <td className="py-4">{cliente.apellidos}</td>

                  <td className="py-4">{cliente.tipo_membresia}</td>

                  <td className="py-4">{cliente.correo}</td>

                  <td className="py-4">
                    {/* Botones de acción alineados a la derecha de la fila */}

                    <div className="flex items-center justify-center gap-2">
                      {/* Botón Info (Verde Limón) */}

                      <button className="bg-[#B4D333] text-[#004B57] rounded-lg font-bold hover:bg-[#a3c02b] transition-colors flex items-center justify-center w-11 h-10">
                        <InformationCircleIcon className="size-7" />
                      </button>

                      {/* Botón Agenda (Turquesa) -> ¡Ahora también abre las citas! */}

                      <button
                        onClick={() => setModalActivo("citas")}
                        className="bg-[#009BAE] text-white rounded-lg hover:bg-[#008292] transition-colors flex items-center justify-center w-11 h-10"
                      >
                        <CalendarIcon className="size-7" />
                      </button>

                      {/* Botón Eliminar (Gris Oscuro) */}

                      <button className="bg-[#6B7280] text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center w-11 h-10">
                        <TrashIcon className="size-7" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="h-14 bg-blue border-b text-md flex justify-center items-center font-bold dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="w-56 ml-2">
                  <p>{mess}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar cliente */}
      <ModalCliente
        isOpen={modalActivo === "agregar"}
        onClose={() => setModalActivo(null)}
        tipo="agregar"
        id_cliente={'null'}
        setCliente={setData}
      />

      {/* Modal para ver la lista de citas */}
      <ModalListaCitas
        isOpen={modalActivo === "citas"}
        onClose={() => setModalActivo(null)}
      />
    </div>
  );
}
