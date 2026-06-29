import React, { useState } from "react";

// Iconos de la barra lateral (Heroicons v2)
import {
  BriefcaseIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  TagIcon,
    KeyIcon,
    InformationCircleIcon,
    PlusCircleIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  ScissorsIcon,
    SparklesIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import ModalProducto from "../components/Modals/ModalProducto";

export default function Productos() {
  // --- ESTADOS PARA CONTROLAR EL MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState("agregar"); // 'agregar' o 'ver'
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // --- DATOS DE EJEMPLO BASADOS EN TU IMAGEN ---
  const [productos, setProductos] = useState([
    {
      id: 1,
      tipoProducto: "Camisa ML",
      color: "Azul",
      talla: "Talla S",
      estado: "Disponible",
      tela: "Casimir #10",
    },
    {
      id: 2,
      tipoProducto: "Chaleco",
      color: "Verde",
      talla: "Talla M",
      estado: "No disponible",
      tela: "Casimir #10",
    },
    {
      id: 3,
      tipoProducto: "Pantalón",
      color: "Negro",
      talla: "Talla 30",
      estado: "Rentado",
      tela: "Casimir #10",
    },
  ]);

  const abrirModal = (tipo, producto = null) => {
    setModalTipo(tipo);
    setProductoSeleccionado(producto);
    setIsModalOpen(true);
  };

  // Estilos de las etiquetas de estado según la imagen
  const renderEstadoBadge = (estado) => {
    switch (estado) {
      case "Disponible":
        return (
          <span className="bg-[#A3B8CC]/60 text-[#004B57] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            Disponible
          </span>
        );
      case "No disponible":
        return (
          <span className="bg-[#004B57] text-white font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            No disponible
          </span>
        );
      case "Rentado":
        return (
          <span className="bg-[#B4D333] text-[#004B57] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            Rentado
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


  return (
    <>
      {/* ================= 2. CONTENIDO INTERNO ================= */}
      <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col gap-6">
        {/* Título de la Sección */}
        <div>
          <h1 className="text-5xl font-black text-[#004053] tracking-tight uppercase">
            Productos
          </h1>
          <p className="text-[#004053] text-lg font-semibold mt-1">
            En esta ventana se muestran los registros de todos los productos que
            se tienen en bodegas para rentas.
          </p>
        </div>

        {/* Barra superior de herramientas */}
        <div className="flex items-center gap-4 w-full mt-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
              <MagnifyingGlassIcon className="size-7" />
            </span>
            <input
              type="text"
              placeholder="Buscar"
              className="w-full bg-[#D9D9D9]/60 border-none rounded-xl py-4 pl-12 pr-4 text-gray-700 placeholder-gray-500 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
            />
          </div>

          {/* Botón Añadir (+) */}
          <button
            onClick={() => abrirModal("agregar")}
            className="bg-[#004B57] hover:bg-[#00363E] text-white font-semibold p-3 rounded-xl flex items-center w-18 h-14 justify-center shadow-sm transition-all active:scale-95"
          >
            <PlusCircleIcon className="size-7"/>
          </button>
        </div>

        {/* Tabla de Productos */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 text-lg font-semibold text-black">
                <th className="pb-4 pt-4 font-bold">ID</th>
                <th className="pb-4 pt-4 font-bold">Tipo Producto</th>
                <th className="pb-4 pt-4 font-bold">Color</th>
                <th className="pb-4 pt-4font-bold">Talla</th>
                <th className="pb-4 pt-4 font-bold">Estado Producto</th>
                <th className="pb-4 pt-4 font-bold">Tela</th>
                <th className="pb-4 pt-4 text-center font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-md font-normal text-gray-700">
              {productos.map((producto) => (
                <tr
                  key={producto.id}
                  className="hover:bg-gray-200 transition-colors"
                >
                  <td className="py-4 text-black ">
                    {producto.id}
                  </td>
                  <td className="py-4 text-black">{producto.tipoProducto}</td>
                  <td className="py-4 text-black">{producto.color}</td>
                  <td className="py-4 text-black">{producto.talla}</td>
                  <td className="py-4">{renderEstadoBadge(producto.estado)}</td>
                  <td className="py-4 text-black">{producto.tela}</td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Botón Info */}
                      <button
                        onClick={() => abrirModal("ver", producto)}
                        className="bg-[#B4D333] text-[#004B57] p-2 rounded-lg font-bold hover:bg-[#a3c02b] transition-all active:scale-95 flex items-center justify-center w-11 h-10"
                      >
                        <InformationCircleIcon className="size-7"/>
                      </button>

                      {/* Botón Eliminar */}
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
      </div>

      {/* Modal de Productos */}
      <ModalProducto
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="2xl"
        tipo={modalTipo}
        producto={productoSeleccionado}
      />
    </>
  );
}
