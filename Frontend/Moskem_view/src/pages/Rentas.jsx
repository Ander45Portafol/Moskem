import { useState } from "react";
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
CalendarDaysIcon,
  DocumentTextIcon,
  InformationCircleIcon,
    CalendarIcon,
  ArrowDownOnSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

export function Rentas() {

    // --- ESTADOS PARA CONTROLAR EL MODAL EN EL FUTURO ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTipo, setModalTipo] = useState('agregar'); 

    // Datos de rentas basados exactamente en tu imagen (image_83cf0a.png)
    const [rentas, setRentas] = useState([
        { id: 1, cliente: 'Anderson Aguilar', producto: 'Camisa ML', fechaInicio: '20-10-2026', estado: 'En proceso', fechaDevolucion: '20-10-2026' },
        { id: 2, cliente: 'Diego Vasconcelos', producto: 'Pantalón', fechaInicio: '20-10-2026', estado: 'Entregado', fechaDevolucion: '20-10-2026' },
        { id: 3, cliente: 'María Hernández', producto: 'Chaleco', fechaInicio: '20-10-2026', estado: 'Finalizado', fechaDevolucion: '20-10-2026' }
    ]);

    const abrirModal = (tipo) => {
        setModalTipo(tipo);
        setIsModalOpen(true);
    };

   
    const renderEstadoBadge = (estado) => { 
        switch (estado) {
            case 'En proceso':
                // Gris azulado texturizado (#7E8A95) con texto blanco
                return <span className="bg-[#7E8A95] text-white font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide inline-block text-center min-w-[110px]">En proceso</span>;
            case 'Entregado':
                // Turquesa / Aqua (#009BAE) con texto blanco
                return <span className="bg-[#009BAE] text-white font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide inline-block text-center min-w-[110px]">Entregado</span>;
            case 'Finalizado':
                // Verde limón (#B4D333) con texto azul oscuro (#004B57)
                return <span className="bg-[#B4D333] text-[#004B57] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide inline-block text-center min-w-[110px]">Finalizado</span>;
            default:
                return <span className="bg-gray-200 text-gray-700 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide inline-block text-center min-w-[110px]">{estado}</span>;
        }
    };

    return (
      <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col gap-6">
        {/* Título de la Sección exacto */}
        <div>
          <h1 className="text-5xl font-black text-[#004B57] tracking-tight uppercase">
            Rentas
          </h1>
          <p className="text-[#004B57]/80 text-lg font-medium mt-1">
            En esta ventana se gestionarán todos los procesos para la renta de
            productos.
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
              className="w-full bg-[#D9D9D9]/60 border-none rounded-xl py-3 pl-12 pr-4 text-gray-700 placeholder-gray-500 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
            />
          </div>

          {/* Botón Reporte */}
          <button className="bg-[#004B57] hover:bg-[#00363E] text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2.5 shadow-sm transition-all active:scale-95 text-sm uppercase tracking-wide">
            <DocumentTextIcon className="size-7"/>
            Reporte
          </button>
          {/* Botón Añadir (+) */}
          <button
            onClick={() => abrirModal("agregar")}
            className="bg-[#004B57] hover:bg-[#00363E] text-white font-semibold p-3 rounded-xl flex items-center justify-center shadow-sm transition-all active:scale-95 h-14 w-18"
          >
            <PlusCircleIcon className="size-7"/>
          </button>
        </div>

        {/* Tabla de Rentas */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 text-lg font-semibold text-black">
                <th className="py-4 font-bold">ID</th>
                <th className="py-4 font-bold">Cliente</th>
                <th className="py-4 font-bold">Producto</th>
                <th className="py-4 font-bold">Fecha Inicio</th>
                <th className="py-4 font-bold">Estado Renta</th>
                <th className="py-4 font-bold">Fecha Devolución</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-md font-normal text-black">
              {rentas
                .map((renta) => (
                  <tr
                    key={renta.id}
                    className="hover:bg-gray-200 transition-colors"
                  >
                    <td className="py-4 text-black">
                      {renta.id}
                    </td>
                    <td className="py-4 text-black">{renta.cliente}</td>
                    <td className="py-4 text-black">{renta.producto}</td>
                    <td className="py-4 text-black">{renta.fechaInicio}</td>
                    <td className="py-4">{renderEstadoBadge(renta.estado)}</td>
                    <td className="py-4 text-black">{renta.fechaDevolucion}</td>
                    <td className="py-4">
                      {/* Iteración de botones con sus estilos fijos por fila */}
                      <div className="flex items-center justify-center gap-2">
                        {/* Botón Info (Verde Limón) */}
                        <button
                          onClick={() => abrirModal("ver")}
                          className="bg-[#B4D333] text-[#004B57] p-2 rounded-lg font-bold hover:bg-[#a3c02b] transition-all active:scale-95 flex items-center justify-center w-11 h-10"
                        >
                          <InformationCircleIcon className="size-7"/>
                        </button>

                        {/* Botón Descargar (Azul Oscuro Moskem) */}
                        <button className="bg-[#004B57] text-white p-2 rounded-lg hover:bg-[#00363E] transition-all active:scale-95 flex items-center justify-center w-11 h-10">
                        <ArrowDownOnSquareIcon className="size-                                                                                           7"/>
                        </button>

                        {/* Botón Eliminar (Gris Oscuro de Estado) */}
                        <button className="bg-[#7E8A95] text-white p-2 rounded-lg hover:bg-[#6b7782] transition-colors flex items-center justify-center w-11 h-10">
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
    );
}