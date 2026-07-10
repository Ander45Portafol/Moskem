import { useEffect, useState } from "react";
import { ModalCliente } from "../components/Modals/ModalCliente";
import { ModalListaCitas } from "../components/Modals/ModalListaCitas";
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
  CalendarIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useGet } from "../assets/js/useGet";
import Swal from "sweetalert2";
import { API } from "../assets/js/global";

export function Clientes() {
  //Estado para manejar el modal
  const [modalActivo, setModalActivo] = useState(null);
  //Estado que almacena el id para poder hacer cambios a algun registro
  const [idCliente, setIdCliente] = useState(null);
  //Custom Hook utilizado para cargar los datos
  const { data, message, setData } = useGet("clientes");
  //Estado utilizado para hacer reactivo lo del motor de busqueda
  const [searchQuery, setSearchQuery] = useState("");

  //Hook utilizado para el motor de busqueda, en este agregamos un tiempo para no llenar la API con peticiones y asi al pasar cierta cantidad de tiempo se hace la petición
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchClientes(searchQuery);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  //Función creada para el motor de busqueda
  const fetchClientes = async (query = "") => {
    try {
      // Si hay query usamos la ruta de buscar, si no, traemos todos
      const url = query
        ? `${API}clientes/buscar?q=${encodeURIComponent(query)}`
        : `${API}clientes`;
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
      console.error("Error al traer los clientes:", error);
    }
  };
  //Función utilizada para cargar el modal con la opcion de actualizar, enviandole el id
  const modalActualizar = (id) => {
    setIdCliente(id);
    setModalActivo("agregar");
  };
  //funcion para borrar los clientes de las vistas
  const deleteClient = async (id) => {
    try {
      Swal.fire({
        title: "Eliminar Usuario",
        text: "¿Estas seguro?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#cc4224",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#31b65c",
        confirmButtonText: "Eliminar",
        showConfirmButton: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await fetch(`${API}clientes/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            const responseData = await response.json();
            Swal.fire({
              toast: true,
              position: "top-end",
              title: responseData.message,
              icon: "success",
              showConfirmButton: false,
              timer: 3000,
            });
          }
          setData((prevData) => prevData.filter((data) => data.id !== id));
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              <th></th>
            </tr>
          </thead>
          {/* 3. El tbody vuelve a ser el nativo (sin block ni h-96), el contenedor de arriba hace el scroll */}
          <tbody className="divide-y divide-gray-200 text-md font-normal text-black">
            {
              //Se valida si en los datos que extrajimos se encuentran datos, de no ser asi, se salta esta parte
              data.length != 0 ? (
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

                      <button
                        className="bg-[#B4D333] text-[#004B57] rounded-lg font-bold hover:bg-[#a3c02b] transition-colors flex items-center justify-center w-11 h-10"
                        onClick={() => modalActualizar(cliente.id)}
                      >
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

                      <button
                        className="bg-[#6B7280] text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center w-11 h-10"
                        onClick={() => {
                          deleteClient(cliente.id);
                        }}
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

      {/* Modal para agregar cliente */}
      <ModalCliente
        isOpen={modalActivo === "agregar"}
        onClose={() => {
          setModalActivo(null);
          setIdCliente(null); // <-- IMPORTANTE: Limpiamos el ID al cerrar
        }}
        tipo={idCliente ? "actualizar" : "agregar"} // <-- Dinámico según si hay ID o no
        id_cliente={idCliente} // <-- Pasamos el estado real del ID
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
