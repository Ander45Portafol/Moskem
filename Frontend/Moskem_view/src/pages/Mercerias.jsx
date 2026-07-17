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

export function Mercerias() {
  // Estado para manejar los futuros modales (agregar, proveedores, etc.)
  const [modalActivo, setModalActivo] = useState(null);
  // Estado que almacena el id del artículo de mercería seleccionado para actualizarlo
  const [idArticulo, setIdArticulo] = useState(null);
  // Custom Hook utilizado para cargar los datos de mercería
  const { data, message, setData } = useGet("mercerias");
  // Estado utilizado para hacer reactivo el buscador
  const [searchQuery, setSearchQuery] = useState("");

  // Hook utilizado para el motor de búsqueda con debounce (400ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMerceria(searchQuery);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Función de búsqueda en la API
  const fetchMerceria = async (query = "") => {
    try {
      const url = query
        ? `${API}merceria/buscar?q=${encodeURIComponent(query)}`
        : `${API}merceria`;
      
      const response = await fetch(url);
      if (response.ok) {
        const responseData = await response.json();
        setData(responseData.data);
      }
    } catch (error) {
      console.error("Error al traer los artículos de mercería:", error);
    }
  };

  // Función para abrir la futura actualización
  const modalActualizar = (id) => {
    setIdArticulo(id);
    setModalActivo("agregar");
  };

  // Función para borrar un artículo de mercería
  const deleteArticulo = async (id) => {
    try {
      Swal.fire({
        title: "Eliminar Artículo",
        text: "¿Estás seguro de que deseas eliminar este artículo de mercería?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#cc4224",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#31b65c",
        confirmButtonText: "Eliminar",
        showConfirmButton: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await fetch(`${API}merceria/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            const responseData = await response.json();
            Swal.fire({
              toast: true,
              position: "top-end",
              title: responseData.message || "Artículo eliminado correctamente",
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
        <h1 className="text-5xl font-black text-[#004053]">Merceria</h1>
        <p className="text-[#004053] text-lg font-semibold mt-1">
          Gestión y control de inventario para los complementos de las prendas.
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
            TABLA DE DATOS DE MERCERÍA
         ========================================== */}
      <div className="mt-8 max-h-2/3 overflow-y-auto rounded-xl">
        <table className="w-full text-left border-collapse">
          {/* Cabecera fija */}
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b-2 border-gray-200 text-lg font-semibold text-black">
              <th className="pb-4 pt-4 font-bold">Tipo - Mercería</th>
              <th className="pb-4 pt-4 font-bold">Color</th>
              <th className="pb-4 pt-4 font-bold">Stock</th>
              <th className="pb-4 pt-4 font-bold">Proveedor</th>
              <th className="pb-4 pt-4 font-bold">Tamaño</th>
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
                  <td className="py-4">{item.tipo}</td>
                  <td className="py-4">{item.color}</td>
                  <td className="py-4">
                    {item.stock} {item.stock === 1 ? "Unidad" : "Unidades"}
                  </td>
                  <td className="py-4">{item.proveedor}</td>
                  <td className="py-4">{item.tamanio}</td>

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
                        onClick={() => deleteArticulo(item.id)}
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

      {/* Los modales se incorporarán en esta sección más adelante */}
    </div>
  );
}