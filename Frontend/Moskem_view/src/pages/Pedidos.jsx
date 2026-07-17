import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
  DocumentIcon,
  InformationCircleIcon,
  TrashIcon,
  ClipboardDocumentCheckIcon,
  ArrowDownOnSquareIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { useGet } from "../assets/js/useGet";
import { useState } from "react";
import { ModalPedido } from "../components/Modals/ModalPedido";

export function Pedidos() {
  //Estado para gestionar el modal
  const [modalActivo, setModalActivo] = useState(null);
  const [idPedido, setIdPedido] = useState(null);
  const { data, message, setData } = useGet("pedidos");
    const modalActualizar = (id) => {
      setIdPedido(id);
      setModalActivo("agregar");
    };
  //Funcion creada para administrar los cambios en el estado de un pedido
  const renderEstado = (estado) => {
    switch (estado) {
      case "En proceso":
        return (
          <span className="bg-[#A3B8CC]/80 text-[#004B57] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            En proceso
          </span>
        );
      case "Entregado":
        return (
          <span className="bg-[#004B57] text-white font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            Entregado
          </span>
        );
      case "Finalizado":
        return (
          <span className="bg-[#B4D333] text-[#004B57] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            Finalizado
          </span>
        );
      case "Anotado":
        return (
          <span className="bg-[#B2B2B2] text-[#004053] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            Anotado
          </span>
        );
      case "Revisado":
        return (
          <span className="bg-[#006272] text-[#B2B2B2] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide">
            Revisado
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
  //Funcion para controlar cuando el estado
  const checkState = (estado) => {
    if (estado === "Anotado") {
      return false;
    } else {
      return true;
    }
  };
  return (
    <div className="flex-1 p-6 flex h-screen w-full flex-col gap-6">
      {/* Título de la sección */}
      <div>
        <h1 className="text-5xl font-black text-[#004053]">PEDIDOS</h1>
        <p className="text-[#004053] text-lg font-semibold mt-1">
          En esta ventana se muestran todos los detalles de los pedidos.
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
          />
        </div>
        <button className="bg-[#004B57] hover:bg-[#00363E] text-[#B2B2B2] font-bold h-14 w-38 rounded-xl flex items-center justify-center text-lg  gap-2 transition-all active:scale-95">
          <CurrencyDollarIcon className="size-7" />
          Cotización
        </button>
        <button className="bg-[#004B57] hover:bg-[#00363E] text-[#B2B2B2] font-bold h-14 w-38 rounded-xl flex items-center justify-center text-lg  gap-2 transition-all active:scale-95">
          <DocumentIcon className="size-7" />
          Reportes
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
              <th className="pb-4 pt-4 font-bold">ID</th>
              <th className="pb-4 pt-4 pl-6 font-bold">Cliente</th>
              <th className="pb-4 pt-4 font-bold">Fecha Entrega</th>
              <th className="pb-4 pt-4 font-bold">Total Pagar</th>
              <th className="pb-4 pt-4 font-bold">Estado Pedido</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          {/* 3. El tbody vuelve a ser el nativo (sin block ni h-96), el contenedor de arriba hace el scroll */}
          <tbody className="divide-y divide-gray-200 text-md font-normal text-black">
            {
              //Se valida si en los datos que extrajimos se encuentran datos, de no ser asi, se salta esta parte
              data.length != 0 ? (
                data &&
                data.map((pedido) => (
                  <tr
                    key={pedido.id}
                    className="hover:bg-gray-200 transition-colors"
                  >
                    <td className="py-4">{pedido.id}</td>

                    <td className="py-4 pl-6">{pedido.cliente}</td>
                    <td className="py-4">{pedido.fecha_entrega}</td>
                    <td className="py-4">{pedido.cantidad_total}</td>
                    <td className="py-4">
                      {renderEstado(pedido.estado_pedido)}
                    </td>
                    <td className="py-4">
                      <input
                        type="checkbox"
                        className="h-5 w-5 transform scale-100 cursor-pointer accent-[#006272]"
                        checked={checkState(pedido.estado_pedido)}
                        readOnly
                      />
                    </td>
                    <td className="py-4">
                      {/* Botones de acción alineados a la derecha de la fila */}

                      <div className="flex items-center justify-center gap-2">
                        {/* Botón Info (Verde Limón) */}

                        <button
                          className="bg-[#B4D333] text-[#004B57] rounded-lg font-bold hover:bg-[#a3c02b] transition-colors flex items-center justify-center w-11 h-10"
                          onClick={() => modalActualizar(pedido.id)}
                        >
                          <InformationCircleIcon className="size-7" />
                        </button>

                        {/* Botón Agenda (Turquesa) -> ¡Ahora también abre las citas! */}

                        <button
                          onClick={() => setModalActivo("citas")}
                          className="bg-[#00A29B] text-[#004053] rounded-lg hover:bg-[#008292] transition-colors flex items-center justify-center w-11 h-10"
                        >
                          <ClipboardDocumentCheckIcon className="size-7" />
                        </button>

                        <button
                          onClick={() => setModalActivo("citas")}
                          className="bg-[#004053] text-white rounded-lg hover:bg-[#008292] transition-colors flex items-center justify-center w-11 h-10"
                        >
                          <ArrowDownOnSquareIcon className="size-7" />
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
              )
            }
          </tbody>
        </table>
      </div>
      <ModalPedido
        isOpen={modalActivo === "agregar"}
        onClose={() => {
          setModalActivo(null);
          setIdPedido(null); // <-- IMPORTANTE: Limpiamos el ID al cerrar
        }}
        tipo={idPedido ? "actualizar" : "agregar"}
        id_pedido={idPedido}
        setPedido={setData}
      />
    </div>
  );
}
