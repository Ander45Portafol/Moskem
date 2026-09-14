import { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useGet } from "../assets/js/useGet";
import Swal from "sweetalert2";
import { API } from "../assets/js/global";
import ModalProducto from "../components/Modals/ModalProducto";

export default function Productos() {
  const [modalActivo, setModalActivo] = useState(null);
  const [registroEditar, setRegistroEditar] = useState(null);

  const { data, setData } = useGet("productos");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProductos(searchQuery);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchProductos = async (query = "") => {
    try {
      const url = query
        ? `${API}productos/buscar?q=${encodeURIComponent(query)}`
        : `${API}productos`;

      const response = await fetch(url);
      if (response.ok) {
        const responseData = await response.json();
        setData(responseData.data);
      }
    } catch (error) {
      console.error("Error al traer los productos:", error);
    }
  };

  const modalActualizar = (item) => {
    setRegistroEditar(item);
    setModalActivo("agregar");
  };

  const deleteProducto = async (id) => {
    try {
      Swal.fire({
        title: "Eliminar Producto",
        text: "¿Estás seguro de que deseas eliminar este producto?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#cc4224",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#31b65c",
        confirmButtonText: "Eliminar",
        showConfirmButton: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await fetch(`${API}productos/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            const responseData = await response.json();
            Swal.fire({
              toast: true,
              position: "top-end",
              title: responseData.message || "Producto eliminado correctamente",
              icon: "success",
              showConfirmButton: false,
              timer: 3000,
            });
            setData((prevData) =>
              prevData.filter((item) => (item.id || item.id_producto) !== id)
            );
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderEstadoBadge = (estado) => {
    const estadoLwr = estado ? estado.toLowerCase() : "";

    if (estadoLwr === "disponible") {
      return (
        <span className="bg-[#A3B8CC]/60 text-[#004B57] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
          Disponible
        </span>
      );
    }
    if (estadoLwr === "no disponible") {
      return (
        <span className="bg-[#004B57] text-white font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
          No disponible
        </span>
      );
    }
    if (estadoLwr === "rentado") {
      return (
        <span className="bg-[#B4D333] text-[#004B57] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
          Rentado
        </span>
      );
    }
    return (
      <span className="bg-gray-200 text-gray-700 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
        {estado}
      </span>
    );
  };

  return (
    <div className="flex-1 p-6 flex h-screen w-full flex-col gap-6">
      <div>
        <h1 className="text-5xl font-black text-[#004053] tracking-tight uppercase">
          Productos
        </h1>
        <p className="text-[#004053] text-lg font-semibold mt-1">
          En esta ventana se muestran los registros de todos los productos que
          se tienen en bodegas para rentas.
        </p>
      </div>

      <div className="flex items-center gap-4 w-full mt-4">
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

        <button
          onClick={() => {
            setRegistroEditar(null);
            setModalActivo("agregar");
          }}
          className="bg-[#004B57] hover:bg-[#00363E] text-[#B2B2B2] font-semibold h-14 w-18 px-4 rounded-xl flex items-center justify-center transition-all active:scale-95"
        >
          <PlusCircleIcon className="size-7" />
        </button>
      </div>

      <div className="max-h-2/3 overflow-y-auto rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b-2 border-gray-200 text-lg font-semibold text-black">
              <th className="pb-4 pt-4 font-bold">ID</th>
              <th className="pb-4 pt-4 font-bold">Tipo Producto</th>
              <th className="pb-4 pt-4 font-bold">Color</th>
              <th className="pb-4 pt-4 font-bold">Talla</th>
              <th className="pb-4 pt-4 font-bold">Estado Producto</th>
              <th className="pb-4 pt-4 font-bold">Tela</th>
              <th className="pb-4 pt-4 text-center font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-md font-normal text-black">
            {data && data.length !== 0 ? (
              data.map((item) => {
                const itemId = item.id_producto || item.id;
                return (
                  <tr
                    key={itemId}
                    className="hover:bg-gray-200 transition-colors"
                  >
                    <td className="py-4">{itemId}</td>
                    <td className="py-4">{item.tipo_producto || item.tipoProducto}</td>
                    <td className="py-4">{item.color}</td>
                    <td className="py-4">{item.talla}</td>
                    <td className="py-4">{renderEstadoBadge(item.estado || item.estado_producto)}</td>
                    <td className="py-4">{item.tela?.nombre_tela || item.tela}</td>

                    <td className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="bg-[#B4D333] text-[#004B57] rounded-lg font-bold hover:bg-[#a3c02b] transition-colors flex items-center justify-center w-11 h-10"
                          onClick={() => modalActualizar(item)}
                        >
                          <InformationCircleIcon className="size-7" />
                        </button>

                        <button
                          className="bg-[#6B7280] text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center w-11 h-10"
                          onClick={() => deleteProducto(itemId)}
                        >
                          <TrashIcon className="size-7" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr
                key="no-data"
                className="h-14 text-md flex justify-center items-center font-semibold hover:bg-gray-200"
              >
                <td className="w-56 ml-2">
                  <p>No existen registros</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Se pasan tanto las props viejas como las nuevas para asegurar compatibilidad */}
      <ModalProducto
        key={registroEditar ? `edit-${registroEditar.id_producto || registroEditar.id}` : 'create-new'}
        show={modalActivo === "agregar"}
        isOpen={modalActivo === "agregar"}
        onClose={() => {
          setModalActivo(null);
          setRegistroEditar(null);
        }}
        tipo={registroEditar ? "actualizar" : "agregar"}
        modalTipo={registroEditar ? "ver" : "agregar"}
        registroEditar={registroEditar}
        producto={registroEditar}
        productoSeleccionado={registroEditar}
        id_producto={registroEditar?.id_producto || registroEditar?.id}
        setProductos={setData}
        setProducto={setData}
      />
    </div>
  );
}