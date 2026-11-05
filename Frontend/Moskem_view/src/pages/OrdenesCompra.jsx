import React, { useState } from "react";

// Iconos idénticos de tu barra lateral
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
  DocumentIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import ModalOrdenCompra from "../components/Modals/ModalOrdenCompra";
import { useGet } from "../assets/js/useGet";
import { API } from "../assets/js/global";

export function OrdenesCompra() {
  // --- ESTADOS PARA CONTROLAR EL MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState("agregar"); // 'agregar' o 'ver'

  const { data, message, setData } = useGet("orden_compras");

  const abrirModal = (tipo) => {
    setModalTipo(tipo);
    setIsModalOpen(true);
  };

  // Estilos de los estados
  const renderEstadoBadge = (estado) => {
    switch (estado) {
      case "Sin realizar":
        return (
          <span className="bg-[#A3B8CC]/60 text-[#004B57] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            Sin realizar
          </span>
        );
      case "En camino":
        return (
          <span className="bg-[#004B57] text-white font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            En camino
          </span>
        );
      case "Entregado":
        return (
          <span className="bg-[#B4D333] text-[#004B57] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            Entregado
          </span>
        );
    }
  };

  return (
    <div className="flex-1 p-6 flex h-screen w-full flex-col gap-6">
      {/* Título de la Sección */}
      <div>
        <h1 className="text-5xl font-black text-[#004053] tracking-tight uppercase">
          Ordenes de compra
        </h1>
        <p className="text-[#004053] text-lg font-semibold mt-1">
          En esta ventana se muestran todas la orden de compra para los
          productos de producción.
        </p>
      </div>

      {/* Barra superior de herramientas */}
      <div className="flex items-center gap-4 w-full mt-2">
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

        {/* Botón Compras */}
        <button className="bg-[#004053] hover:bg-[#00363E] text-[#B2B2B2] font-bold h-14 w-34 rounded-xl flex items-center gap-1.5 justify-center transition-all active:scale-95 text-lg">
          <DocumentIcon className="size-7" />
          Compras
        </button>

        {/* Botón Añadir (+) corrigiendo la función a abrirModal('agregar') */}
        <button
          onClick={() => abrirModal("agregar")}
          className="bg-[#004B57] hover:bg-[#00363E] text-[#B2B2B2] font-semibold h-14 w-18 rounded-xl flex items-center justify-center transition-all active:scale-95"
        >
          <PlusCircleIcon className="size-7" />
        </button>
      </div>

      {/* Tabla de Órdenes */}
      <div className="max-h-9/12 overflow-y-auto rounded-xl pt-10">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b-2 border-gray-200 text-lg font-semibold text-black">
              <th className="pb-3 font-bold">ID</th>
              <th className="pb-3 font-bold">Imagen</th>
              <th className="pb-3 font-bold">Compra</th>
              <th className="pb-3 font-bold">Cantidad Faltante</th>
              <th className="pb-3 font-bold">Fecha orden</th>
              <th className="pb-3 font-bold">Estado compra</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-md font-normal text-black">
            {data && data.length !== 0 ? (
              data.map((orden) => {
                const imagenProducto =
                  orden.compra?.imagen_merceria || orden.compra?.imagen_tela;

                // ¡AQUÍ ESTÁ LA CORRECCIÓN! Agregamos el return
                return (
                  <tr
                    key={orden.id_orden_compra}
                    className="hover:bg-gray-200 transition-colors"
                  >
                    <td className="py-4 text-black">{orden.id_orden_compra}</td>
                    <td className="py-4">
                      {orden.compra.imagen_merceria ? (
                        <img
                          src={
                            orden.compra.imagen_merceria.startsWith("http")
                              ? orden.compra.imagen_merceria
                              : `${API.replace(/\/api\/?$/, "")}/storage/${imagenProducto}`
                          }
                          alt={`Orden ${orden.id_orden_compra}`}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
                          <span className="text-gray-400 text-xs text-center leading-tight">
                            Sin
                            <br />
                            imagen
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-black">
                      {" "}
                      {orden.compra?.codigo_merceria ||
                        orden.compra?.codigo_tela ||
                        "Producto"}{" "}
                    </td>
                    <td className="py-4 text-black">
                      {orden.cantidad_faltante}
                    </td>
                    <td className="py-4 text-black">{orden.fecha_orden}</td>
                    <td className="py-4">
                      {renderEstadoBadge(orden.estado_compra)}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Botón Info */}
                        <button
                          onClick={() => abrirModal("ver")}
                          className="bg-[#B4D333] text-[#004B57] p-2 rounded-lg font-bold hover:bg-[#a3c02b] transition-all active:scale-95 flex items-center justify-center w-11 h-10"
                        >
                          <InformationCircleIcon className="size-7" />
                        </button>

                        {/* Botón Eliminar */}
                        <button className="bg-[#6B7280] text-white p-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center w-11 h-10">
                          <TrashIcon className="size-7" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ); // CERRAMOS EL RETURN AQUÍ
              })
            ) : (
              <tr className="h-14 text-md flex justify-center items-center font-semibold hover:bg-gray-200">
                <td className="w-56 ml-2">
                  <p>No existen registros</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Corregido: Usamos el estado real "isModalOpen" e "setIsModalOpen" */}
      <ModalOrdenCompra
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="2xl"
      />
    </div>
  );
}
