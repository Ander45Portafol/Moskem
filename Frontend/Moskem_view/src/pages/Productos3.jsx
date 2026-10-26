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
import { ModalProducto } from "../components/Modals/ModalProducto";
import Dropdown from "../components/DropDown";

export default function Productos3() {
  const [modalActivo, setModalActivo] = useState(null);
  const [registroEditar, setRegistroEditar] = useState(null);

  const { data, setData } = useGet("productos");
  const [searchQuery, setSearchQuery] = useState("");

  // Estado para controlar la opción seleccionada en el filtro Dropdown
  const [selectedTipo, setSelectedTipo] = useState("Todos");

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
        setData(responseData.data || responseData);
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
              prevData.filter((item) => (item.id || item.id_producto) !== id),
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

    switch (estadoLwr) {
      case "disponible":
        return (
          <span className="bg-[#A3B8CC]/60 text-[#004B57] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            Disponible
          </span>
        );
      case "no disponible":
        return (
          <span className="bg-[#004B57] text-white font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            No disponible
          </span>
        );
      case "rentado":
        return (
          <span className="bg-[#B4D333] text-[#004B57] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            Rentado
          </span>
        );
      case "lavanderia":
        return (
          <span className="bg-blue-600 text-[#FFF] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            Lavanderia
          </span>
        );
      case "vendido":
        return (
          <span className="bg-[#00A29B] text-[#004B57] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            Vendido
          </span>
        );
      default:
        return (
          <span className="bg-gray-200 text-gray-700 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            {estado}
          </span>
        );
    }
  };

  // Función helper para construir la URL completa de la imagen del producto
  const getImageUrl = (imagenPath) => {
    if (!imagenPath) return null;
    if (imagenPath.startsWith("http")) return imagenPath;
    const baseUrl = API.replace(/\/api\/?$/, "");
    return `${baseUrl}/storage/${imagenPath}`;
  };

  // Filtrado reactivo en el cliente según el tipo de producto seleccionado
  const productosFiltrados = Array.isArray(data)
    ? data.filter((item) => {
        if (selectedTipo === "Todos") return true;
        const tipoItem = (
          item.categoria_producto ||
          ""
        ).toLowerCase();
        return tipoItem === selectedTipo.toLowerCase();
      })
    : [];

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

        {/* Dropdown con callback onSelect para filtrar */}
        <Dropdown
          title="Tipo Producto"
          options={["Zapatos", "Vestimenta", "Accesorios"]}
          onSelect={(opcion) => setSelectedTipo(opcion)}
        />

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

      <div className="max-h-7/8 overflow-y-auto grid grid-cols-3 gap-4 py-6">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((item) => {
            const itemId = item.id_producto || item.id;
            const imageUrl = getImageUrl(item.imagen_producto);

            const telaObj = item.tela || item.telas;
            const nombreTela =
              telaObj?.color_tela ||
              telaObj?.nombre_tela ||
              telaObj?.categoria_tela ||
              "Sin tela";
            const codigoTela = telaObj?.codigo_tela || telaObj?.codigo || "";
            return (
              <div
                key={itemId}
                className="w-full bg-[#D9D9D9] rounded-2xl flex p-3 gap-3 shadow-sm hover:shadow-md transition-shadow items-start"
              >
                {/* Contenedor de Imagen */}
                <div className="w-32 h-44 bg-white/60 rounded-xl overflow-hidden flex justify-center items-center shrink-0 border border-gray-200">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.nombre_producto || "Imagen de producto"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 font-medium text-xs text-center px-2">
                      Sin imagen
                    </span>
                  )}
                </div>

                {/* Contenedor de Información y Acciones */}
                <div className="flex-1 flex flex-col justify-between self-stretch py-1">
                  {/* Bloque Superior: Título y Datos */}
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[#004B57] font-bold text-lg leading-tight">
                      {item.nombre_producto || `Producto #${itemId}`}
                    </p>

                    <div className="flex justify-between items-start gap-1">
                      <div className="text-sm">
                        <p className="font-semibold text-gray-800">
                          Color:{" "}
                          <span className="font-normal">
                            {item.color || "N/A"}
                          </span>
                        </p>
                        <p className="font-semibold text-gray-800 mt-1">
                          Talla:{" "}
                          <span className="font-normal">
                            {item.talla || "N/A"}
                          </span>
                        </p>
                      </div>

                      <div>
                        {renderEstadoBadge(item.estado_producto || item.estado)}
                      </div>
                    </div>

                    <p className="font-semibold text-sm text-gray-800">
                      Tela:{" "}
                      <span className="font-normal">
                        {codigoTela
                          ? `${nombreTela} (${codigoTela})`
                          : nombreTela}
                      </span>
                    </p>

                    <p className="font-extrabold text-sm text-[#006272]">
                      Ingresado {item.fecha_ingreso}
                    </p>
                  </div>

                  {/* Bloque Inferior: Precio y Botones de Acción */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-300/80 mt-2">
                    <p className="font-extrabold text-xl text-gray-800">
                      ${item.costo}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        className="bg-[#B4D333] text-[#004B57] rounded-lg font-bold hover:bg-[#a3c02b] transition-colors flex items-center justify-center w-9 h-9 shadow-sm"
                        onClick={() => modalActualizar(item)}
                        title="Editar producto"
                      >
                        <InformationCircleIcon className="size-6" />
                      </button>

                      <button
                        className="bg-[#6B7280] text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center w-9 h-9 shadow-sm"
                        onClick={() => deleteProducto(itemId)}
                        title="Eliminar producto"
                      >
                        <TrashIcon className="size-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 py-12 text-center text-gray-500 font-semibold bg-gray-100 rounded-2xl">
            No existen registros que coincidan con los filtros aplicados.
          </div>
        )}
      </div>

      <ModalProducto
        key={
          registroEditar
            ? `edit-${registroEditar.id_producto || registroEditar.id}`
            : "create-new"
        }
        show={modalActivo === "agregar"}
        isOpen={modalActivo === "agregar"}
        onClose={() => {
          setModalActivo(null);
          setRegistroEditar(null);
          fetchProductos(searchQuery);
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
