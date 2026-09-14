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
  DocumentIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  AdjustmentsVerticalIcon,
} from "@heroicons/react/24/solid";
import { useGet } from "../assets/js/useGet";


export function Cupones() {
  // --- ESTADOS PARA CONTROLAR EL MODAL EN EL FUTURO ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orden, setOrden] = useState(null);
  const [clientes, setClientes] = useState(null);
  const { data, setData } = useGet("orden_trabajo");


  const abrirModal = (tipo) => {
    setModalTipo(tipo);
    setIsModalOpen(true);
  };

  const renderEstadoBadge = (estado) => {
    switch (estado) {
      case "En proceso":
        // Gris azulado texturizado (#7E8A95) con texto blanco
        return (
          <span className="bg-[#7E8A95] text-white font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide inline-block text-center min-w-[110px]">
            En proceso
          </span>
        );
      case "Entregado":
        // Turquesa / Aqua (#009BAE) con texto blanco
        return (
          <span className="bg-[#009BAE] text-white font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide inline-block text-center min-w-[110px]">
            Entregado
          </span>
        );
      case "Finalizado":
        // Verde limón (#B4D333) con texto azul oscuro (#004B57)
        return (
          <span className="bg-[#B4D333] text-[#004B57] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide inline-block text-center min-w-[110px]">
            Finalizado
          </span>
        );
      default:
        return (
          <span className="bg-gray-200 text-gray-700 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide inline-block text-center min-w-[110px]">
            {estado}
          </span>
        );
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col gap-6">
      {/* Título de la Sección exacto */}
      <div>
        <h1 className="text-5xl font-black text-[#004B57] tracking-tight uppercase">
          Cupones y descuentos
        </h1>
        <p className="text-[#004B57]/80 text-lg font-medium mt-1">
          Genera y administra de todos los tipos de cupones o descuentos que
          desees aplicar a tus clientes.
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
        <button className="bg-[#004B57] hover:bg-[#00363E] text-[#B2B2B2] font-bold h-12 py-2 w-38 rounded-xl flex items-center justify-center text-lg gap-2 transition-all active:scale-95">
          <AdjustmentsVerticalIcon className="size-7" />
          Generar
        </button>

        <button
          className="bg-[#004B57] hover:bg-[#00363E] text-[#B2B2B2] font-semibold h-12 w-18 rounded-xl flex items-center justify-center transition-all active:scale-95"
        >
          <PlusCircleIcon className="size-7" />
        </button>
      </div>

      {/* Tabla de Rentas */}
      <div className="max-h-2/3 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b-2 border-gray-200 text-lg font-semibold text-black">
              <th className="py-4 font-bold">Pieza</th>
              <th className="py-4 font-bold">Fecha Inicio</th>
              <th className="py-4 font-bold">Fecha Fin</th>
              <th className="py-4 font-bold">ID-Pedido</th>
              <th className="py-4 font-bold">Empleado</th>
              <th className="py-4 font-bold">Estado Orden</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-md font-normal text-black">
            {data.lenght !== 0 ? (
              data &&
              data.map((orden_trabajo) => (
                <tr
                  key={orden_trabajo.id_orden}
                  className="hover:bg-gray-200 transition-colors"
                >
                  <td className="py-4 text-black">{orden_trabajo.prenda}</td>
                  <td className="py-4 text-black">
                    {orden_trabajo.fecha_asignacion}
                  </td>
                  <td className="py-4 text-black">
                    {orden_trabajo.fecha_tallaje1}
                  </td>
                  <td className="py-4 text-black">{orden_trabajo.id_pedido}</td>
                  <td className="py-4">{orden_trabajo.codigo_empleado}</td>
                  <td className="py-4 text-black">
                    {renderEstadoBadge(orden_trabajo.estado_orden)}
                  </td>
                  <td className="py-4">
                    {/* Iteración de botones con sus estilos fijos por fila */}
                    <div className="flex items-center justify-center gap-2">
                      {/* Botón Info (Verde Limón) */}
                      <button
                        onClick={() => {
                          setOrden(orden_trabajo.id_orden);
                          setClientes(orden_trabajo.id_cliente);
                          setIsModalOpen(true);
                        }}
                        className="bg-[#B4D333] text-[#004B57] p-2 rounded-lg font-bold hover:bg-[#a3c02b] transition-all active:scale-95 flex items-center justify-center w-11 h-10"
                      >
                        <InformationCircleIcon className="size-7" />
                      </button>

                      {/* Botón Descargar (Azul Oscuro Moskem) */}
                      <button className="bg-[#004B57] text-white p-2 rounded-lg hover:bg-[#00363E] transition-all active:scale-95 flex items-center justify-center w-11 h-10">
                        <ArrowDownOnSquareIcon className="size-7" />
                      </button>

                      {/* Botón Eliminar (Gris Oscuro de Estado) */}
                      <button className="bg-[#7E8A95] text-white p-2 rounded-lg hover:bg-[#6b7782] transition-colors flex items-center justify-center w-11 h-10">
                        <TrashIcon className="size-7" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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
    </div>
  );
}
