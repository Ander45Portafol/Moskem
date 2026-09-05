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
import { ModalDetallePedido } from "../components/Modals/ModalDetallePedido";
import { ModalPaquetes } from "../components/Modals/ModalPaquete";
import Swal from "sweetalert2";
import { API } from "../assets/js/global";
import { ModalMedidas } from "../components/Modals/ModalMedidas";

export function Pedidos() {
  // Estado para gestionar el modal principal
  const [modalActivo, setModalActivo] = useState(null);
  const [idPedido, setIdPedido] = useState(null);

  // Estados para el flujo de Modales
  const [detalleAbierto, setDetalleAbierto] = useState(false);
  const [paquetesModalAbierto, setPaquetesModalAbierto] = useState(false);
  const [idPedidoDetalle, setIdPedidoDetalle] = useState(null);
  const [idPaquete, setIdPaquete] = useState(null);
  const [medidas, setMedidas] = useState(false);
  const [clientes, setClientes] = useState(null);

  // NUEVOS: Estados para controlar la respuesta dinámica de paquetes por evento
  const [tipoEvento, setTipoEvento] = useState("");
  const [paquetesFiltrados, setPaquetesFiltrados] = useState([]);

  // Variables para el funcionamiento de los pedidos
  const { data, message, setData } = useGet("pedidos");
  const { data: detalles, setData: setDetalle } = useGet("detalle_pedidos");

  const modalActualizar = (id) => {
    setIdPedido(id);
    setModalActivo("agregar");
  };

  // Función creada para administrar los cambios en el estado de un pedido
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

  // Función para controlar cuando el estado es anotado
  const checkState = (estado) => {
    return estado !== "Anotado";
  };

  const deletePedidos = async (id) => {
    try {
      Swal.fire({
        title: "Eliminar Pedido",
        text: "¿Estas seguro?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#cc4224",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#31b65c",
        confirmButtonText: "Eliminar",
        showConfirmButton: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await fetch(`${API}pedidos/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            const responseData = await response.json();
            Swal.fire({
              toast: true,
              position: "top-end",
              title: responseData.message,
              icon: "success",
              showConfirmButton: false,
              timer: 3000,
            });
          }
          setData((prevData) =>
            prevData.filter((data) => data.id_pedido !== id),
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Callback ejecutado desde ModalPedido al guardar o presionar Siguiente
  const handlePedidoGuardado = ({
    id_pedido,
    tipo_evento,
    paquetesDisponibles,
    tienePaquetes,
  }) => {
    setIdPedido(id_pedido);
    setTipoEvento(tipo_evento);
    setPaquetesFiltrados(paquetesDisponibles);

    // Cerramos el modal inicial de pedido
    setModalActivo(null);

    // Evaluamos si el tipo_evento tiene paquetes en la base de datos
    if (tienePaquetes) {
      setPaquetesModalAbierto(true);
    } else {
      setDetalleAbierto(true);
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

      {/* Barra superior: Buscador + Botones */}
      <div className="flex items-center gap-4 w-full mt-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
            <MagnifyingGlassIcon className="size-6" />
          </span>
          <input
            type="text"
            placeholder="Buscar"
            className="w-full bg-[#D9D9D9] border-none rounded-xl py-3 pl-12 pr-4 text-gray-700 placeholder-gray-500 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
          />
        </div>
        <button className="bg-[#004B57] hover:bg-[#00363E] text-[#B2B2B2] font-bold h-12 w-38 rounded-xl flex items-center justify-center text-lg gap-2 transition-all active:scale-95">
          <CurrencyDollarIcon className="size-7" />
          Cotización
        </button>
        <button className="bg-[#004B57] hover:bg-[#00363E] text-[#B2B2B2] font-bold h-12 py-2 w-38 rounded-xl flex items-center justify-center text-lg gap-2 transition-all active:scale-95">
          <DocumentIcon className="size-7" />
          Reportes
        </button>

        <button
          onClick={() => {
            setIdPedido(null);
            setIdPaquete(null);
            setModalActivo("agregar");
          }}
          className="bg-[#004B57] hover:bg-[#00363E] text-[#B2B2B2] font-semibold h-12 w-18 rounded-xl flex items-center justify-center transition-all active:scale-95"
        >
          <PlusCircleIcon className="size-7" />
        </button>
      </div>

      {/* Tabla de pedidos */}
      <div className="max-h-2/3 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white z-10">
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
          <tbody className="divide-y divide-gray-200 text-md font-normal text-black">
            {data.length !== 0 ? (
              data &&
              data.map((pedido) => (
                <tr
                  key={pedido.id_pedido}
                  className="hover:bg-gray-200 transition-colors"
                >
                  <td className="py-4">{pedido.id_pedido}</td>
                  <td className="py-4 pl-6">{pedido.cliente}</td>
                  <td className="py-4">{pedido.fecha_entrega}</td>
                  <td className="py-4">$ {pedido.costo_total}</td>
                  <td className="py-4">{renderEstado(pedido.estado_pedido)}</td>
                  <td className="py-4">
                    <input
                      type="checkbox"
                      className="h-5 w-5 transform scale-100 cursor-pointer accent-[#006272]"
                      checked={checkState(pedido.estado_pedido)}
                      readOnly
                    />
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="bg-[#B4D333] text-[#004B57] rounded-lg font-bold hover:bg-[#a3c02b] transition-colors flex items-center justify-center w-11 h-10"
                        onClick={() => modalActualizar(pedido.id_pedido)}
                      >
                        <InformationCircleIcon className="size-7" />
                      </button>

                      <button
                        onClick={() => {
                          setMedidas(true);
                          setIdPedido(pedido.id_pedido);
                          setClientes(pedido.id_cliente);
                        }}
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

                      <button
                        className="bg-[#6B7280] text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center w-11 h-10"
                        onClick={() => {
                          deletePedidos(pedido.id_pedido);
                        }}
                      >
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

      {/* Modal 1: Formulario Pedido */}
      <ModalPedido
        isOpen={modalActivo === "agregar"}
        onClose={() => setModalActivo(null)}
        tipo={idPedido ? "actualizar" : "agregar"}
        id_pedido={idPedido}
        setPedido={setData}
        onPedidoGuardado={handlePedidoGuardado}
      />

      {/* Modal 2: Selección de Paquetes (se activa solo si existen paquetes para el evento) */}
      <ModalPaquetes
        isOpen={paquetesModalAbierto}
        onClose={() => setPaquetesModalAbierto(false)}
        id_pedido={idPedido}
        id_paquete={idPaquete}
        setPaquete={setIdPaquete} // 👈 Pasar setIdPaquete
        paquetes={paquetesFiltrados}
        tipoEvento={tipoEvento}
        onSiguienteDetalle={() => setDetalleAbierto(true)}
      />

      {/* Modal 3: Detalle del Pedido */}
      <ModalDetallePedido
        isOpen={detalleAbierto}
        onClose={() => {
          setDetalleAbierto(false);
          setPaquetesModalAbierto(false);
          setIdPedidoDetalle(null);
          setIdPedido(null);
          setIdPaquete(null); // 👈 Usar setIdPaquete
        }}
        onRegresar={() => {
          setDetalleAbierto(false);
          if (paquetesFiltrados.length > 0) {
            setPaquetesModalAbierto(true);
          } else {
            setModalActivo("agregar");
          }
        }}
        id_pedido={idPedido}
        id_paquete={idPaquete}
        id_detallepedido={idPedidoDetalle}
        detallesData={setDetalle}
      />

      {/* Modal 4: Medidas */}
      <ModalMedidas
        isOpen={medidas}
        id_pedido={idPedido}
        id_cliente={clientes}
        onClose={() => setMedidas(false)}
      />
    </div>
  );
}
