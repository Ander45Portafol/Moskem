import { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
  InformationCircleIcon,
  TrashIcon,
  BriefcaseIcon, // Icono para Proveedores
} from "@heroicons/react/24/solid";
import { useGet } from "../assets/js/useGet";
import Swal from "sweetalert2";
import { API } from "../assets/js/global";
import { ModalTelas } from "../components/Modals/ModalTelas";

export function Telas() {
  // Estado para manejar los futuros modales (agregar, proveedores, etc.)
  const [modalActivo, setModalActivo] = useState(null);
  // Estado que almacena el id de la tela seleccionada para actualizarla
  const [idTela, setIdTela] = useState(null);
  // Custom Hook utilizado para cargar los datos de telas
  const { data, message, setData } = useGet("telas");
  // Estado utilizado para hacer reactivo el buscador
  const [searchQuery, setSearchQuery] = useState("");

  // Hook utilizado para el motor de búsqueda con debounce (400ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTelas(searchQuery);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Función de búsqueda en la API
  const fetchTelas = async (query = "") => {
    try {
      const url = query
        ? `${API}telas/buscar?q=${encodeURIComponent(query)}`
        : `${API}telas`;
      
      const response = await fetch(url);
      if (response.ok) {
        const responseData = await response.json();
        setData(responseData.data);
      }
    } catch (error) {
      console.error("Error al traer los registros de telas:", error);
    }
  };

  // Función para abrir la futura actualización
  const modalActualizar = (id) => {
    setIdTela(id);
    setModalActivo("agregar");
  };

  // Función para borrar una tela
  const deleteTela = async (id) => {
    try {
      Swal.fire({
        title: "Eliminar Tela",
        text: "¿Estás seguro de que deseas eliminar este registro de tela?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#cc4224",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#31b65c",
        confirmButtonText: "Eliminar",
        showConfirmButton: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await fetch(`${API}telas/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            const responseData = await response.json();
            Swal.fire({
              toast: true,
              position: "top-end",
              title: responseData.message || "Tela eliminada correctamente",
              icon: "success",
              showConfirmButton: false,
              timer: 3000,
            });
            setData((prevData) => prevData.filter((item) => item.id !== id));
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex-1 p-6 flex h-screen w-full flex-col gap-6">
      
      {/* Título de la sección */}
      <div>
        <h1 className="text-5xl font-black text-[#004053]">TELAS</h1>
        <p className="text-[#004053] text-lg font-semibold mt-1">
          Gestión de telas y proveedores.
        </p>
      </div>

      {/* Barra superior: Buscador + Botón Proveedores + Botón Agregar */}
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

        {/* Botón Proveedores */}
        <button
          onClick={() => setModalActivo("proveedores")}
          className="bg-[#004B57] hover:bg-[#00363E] text-[#B2B2B2] font-bold h-14 px-6 rounded-xl flex items-center justify-center text-lg gap-2 transition-all active:scale-95 whitespace-nowrap"
        >
          <BriefcaseIcon className="size-7" />
          Proveedores
        </button>

        {/* Botón Añadir (+) */}
        <button
          onClick={() => setModalActivo("agregar")}
          className="bg-[#004B57] hover:bg-[#00363E] text-[#B2B2B2] font-semibold h-14 w-18 px-4 rounded-xl flex items-center justify-center transition-all active:scale-95"
        >
          <PlusCircleIcon className="size-7" />
        </button>
      </div>

      {/* ==========================================
            TABLA DE DATOS DE TELAS
         ========================================== */}
      <div className=" max-h-2/3 overflow-y-auto rounded-xl">
        <table className="w-full text-left border-collapse">
          {/* Cabecera fija */}
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b-2 border-gray-200 text-lg font-semibold text-black">
              <th className="pb-4 pt-4 font-bold">ID</th>
              <th className="pb-4 pt-4 font-bold">Código Tela</th>
              <th className="pb-4 pt-4 font-bold">Color</th>
              <th className="pb-4 pt-4 font-bold">Cantidad</th>
              <th className="pb-4 pt-4 font-bold">Proveedor</th>
              <th className="pb-4 pt-4 font-bold">Fecha Ingreso</th>
              <th></th>
            </tr>
          </thead>
          {/* Cuerpo de la tabla */}
          <tbody className="divide-y divide-gray-200 text-md font-normal text-black">
            {data && data.length !== 0 ? (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-200 transition-colors"
                >
                  <td className="py-4">{item.id}</td>
                  <td className="py-4">{item.codigo_tela}</td>
                  <td className="py-4">{item.color}</td>
                  <td className="py-4">
                    {item.cantidad} {item.cantidad === 1 ? "yarda" : "yardas"}
                  </td>
                  <td className="py-4">{item.proveedor}</td>
                  <td className="py-4">{item.fecha_ingreso}</td>

                  {/* Acciones: Solo 2 botones (Información y Eliminar) */}
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Botón Info (Verde Limón) */}
                      <button
                        className="bg-[#B4D333] text-[#004B57] rounded-lg font-bold hover:bg-[#a3c02b] transition-colors flex items-center justify-center w-11 h-10"
                        onClick={() => modalActualizar(item.id)}
                      >
                        <InformationCircleIcon className="size-7" />
                      </button>

                      {/* Botón Eliminar (Gris Oscuro / Slate) */}
                      <button
                        className="bg-[#6B7280] text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center w-11 h-10"
                        onClick={() => deleteTela(item.id)}
                      >
                        <TrashIcon className="size-7" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              /* En caso de no haber registros */
              <tr className="h-14 text-md flex justify-center items-center font-semibold hover:bg-gray-200">
                <td className="w-56 ml-2">
                  <p>No existen registros</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ModalTelas
        isOpen={modalActivo === "agregar"}
        onClose={() => {
          setModalActivo(null);
          setIdTela(null);
        }}
        tipo={idTela ? "actualizar" : "agregar"}
        id_tela={idTela}
        setTela={setData}
      />
    </div>
  );
}