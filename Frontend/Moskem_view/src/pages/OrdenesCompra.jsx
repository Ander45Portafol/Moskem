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

export function OrdenesCompra() {
  // --- ESTADOS PARA CONTROLAR EL MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState("agregar"); // 'agregar' o 'ver'

  // Datos de órdenes basados en la imagen
  const [ordenes, setOrdenes] = useState([
    {
      id: 1,
      compra: "Botones #15 Blancos",
      generadaPor: "Anderson Aguilar",
      fecha: "20-10-2026",
      estado: "En proceso",
    },
    {
      id: 2,
      compra: "Tela, Sincatex #1817",
      generadaPor: "Diego Vasconcelos",
      fecha: "12-09-2026",
      estado: "Sin realizar",
    },
    {
      id: 3,
      compra: "Ganchos #12",
      generadaPor: "María Hernández",
      fecha: "11-09-2026",
      estado: "Finalizada",
    },
  ]);

  const abrirModal = (tipo) => {
    setModalTipo(tipo);
    setIsModalOpen(true);
  };

  // Estilos de los estados
  const renderEstadoBadge = (estado) => {
    switch (estado) {
      case "En proceso":
        return (
          <span className="bg-[#A3B8CC]/60 text-[#004B57] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            En proceso
          </span>
        );
      case "Sin realizar":
        return (
          <span className="bg-[#004B57] text-white font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            Sin realizar
          </span>
        );
      case "Finalizada":
        return (
          <span className="bg-[#B4D333] text-[#004B57] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            Finalizada
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
    <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col gap-6">
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
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200 text-lg font-semibold text-black">
              <th className="pb-3 font-bold">ID</th>
              <th className="pb-3 font-bold">Compra</th>
              <th className="pb-3 font-bold">Generada por</th>
              <th className="pb-3 font-bold">Fecha orden</th>
              <th className="pb-3 font-bold">Estado compra</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-md font-normal text-black">
            {ordenes.map((orden) => (
              <tr
                key={orden.id}
                className="hover:bg-gray-200 transition-colors"
              >
                <td className="py-4 text-black">{orden.id}</td>
                <td className="py-4 text-black">{orden.compra}</td>
                <td className="py-4 text-black">{orden.generadaPor}</td>
                <td className="py-4 text-black">{orden.fecha}</td>
                <td className="py-4">{renderEstadoBadge(orden.estado)}</td>
                <td className="py-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* Botón Info (Verde Limón) */}
                    <button
                      onClick={() => abrirModal("ver")}
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

      {/* Corregido: Usamos el estado real "isModalOpen" e "setIsModalOpen" */}
      <ModalOrdenCompra
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="2xl"
      />
    </div>
  );
}
