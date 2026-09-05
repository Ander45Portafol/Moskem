import { useEffect, useState } from "react";
import { useGet } from "../../assets/js/useGet";
import { InputDate } from "../inputDate";
import { SelectD } from "../SelectD";
import { TextArea } from "../TextArea";
import {
  ArrowRightCircleIcon,
  ArrowsPointingInIcon,
  ArrowUpOnSquareIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { SelectWD } from "../SelectWD";
import { InputN } from "../InputN";
import { useForm } from "../../assets/js/Forms/useForm";
import Swal from "sweetalert2";

export function ModalPedido({
  isOpen,
  onClose,
  tipo,
  id_pedido,
  setPedido,
  onPedidoGuardado,
}) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const ruta = "pedidos";

  const estadoInicial = {
    id_cliente: "",
    estado_pedido: "",
    imagen_referencia: "",
    anticipo: "",
    costo_total: "",
    restante: "",
    fecha_tallaje1: "",
    evento_traje: "",
    fecha_tallaje2: "",
    fecha_entrega: "",
    nota_pedido: "",
    tipo_evento: "",
    tipo_entalle: "",
  };

  const { data, setData, handleSubmit } = useForm({
    id: id_pedido,
    setForm: setPedido,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });

  // Cargar paquetes desde el custom hook
  const { data: resPaquetes } = useGet("paquetes");
  const listaPaquetes = Array.isArray(resPaquetes)
    ? resPaquetes
    : resPaquetes?.data || [];

  // Función encargada de calcular si hay paquetes y notificar al componente Padre
  const notificarPadre = (idPedidoCreado) => {
    const idActual = idPedidoCreado || id_pedido;

    const paquetesEvento = listaPaquetes.filter(
      (p) => p.tipo_paquete === data.tipo_evento,
    );

    if (onPedidoGuardado) {
      onPedidoGuardado({
        id_pedido: idActual,
        tipo_evento: data.tipo_evento,
        paquetesDisponibles: paquetesEvento,
        tienePaquetes: paquetesEvento.length > 0,
      });
    }
  };

  // Función para avanzar manualmente con el botón "Siguiente"
  const handleSiguiente = (idPedidoCreado) => {
    const idActual = idPedidoCreado || id_pedido;

    if (!idActual) {
      Swal.fire({
        title: "Completar",
        text: "No puede continuar, debe generar un pedido",
        icon: "error",
        showConfirmButton: true,
        timer: 3000,
      });
      return;
    }

    notificarPadre(idActual);
    onClose();
  };

  // Extraer clientes
  const { data: clientes } = useGet("clientes");

  const SelectClientes =
    clientes?.map((registro) => ({
      id: registro.id,
      nombre: `${registro.nombres} ${registro.apellidos}`,
    })) || [];

  const tipo_eventos = ["Boda", "Graduación", "Bautizo", "Cumpleaños", "otro"];
  const estado_pedido = [
    "Anotado",
    "Revisado",
    "En proceso",
    "Finalizado",
    "Entregado",
  ];

  const inputsUpdate = (e) => {
    const name = e.target.name;
    const inputValue =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setData({
      ...data,
      [name]: inputValue,
    });
  };

  // Transición y renderizado síncrono
  useEffect(() => {
    if (isOpen) {
      setRender(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const guardarDatos = async (e) => {
    e.preventDefault();
    try {
      const pedidoCreado = await handleSubmit(e);

      if (!id_pedido && pedidoCreado?.id_pedido) {
        notificarPadre(pedidoCreado.id_pedido);
        onClose();
        return true;
      }

      if (id_pedido) {
        notificarPadre(id_pedido);
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      return false;
    }
  };

  if (!render) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white w-[1000px] max-w-[100vw] rounded-[32px] p-10 shadow-2xl relative flex flex-col gap-8 transition-all duration-300 transform ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-8 right-8 text-[#004B57] hover:scale-110 transition-transform"
        >
          <XMarkIcon className="size-7" />
        </button>

        <div>
          <h2 className="text-4xl font-black text-[#004B57] tracking-wide uppercase">
            Formulario - Pedido
          </h2>
        </div>

        <form onSubmit={guardarDatos} className="flex flex-col">
          <div className="flex w-full justify-between gap-x-6">
            <div className="w-1/3">
              <SelectWD
                text="Cliente"
                options={SelectClientes}
                textId="id_cliente"
                valueData={data.id_cliente}
                updateData={inputsUpdate}
              />
            </div>
            <div className="w-1/3">
              <SelectD
                text="Tipo Evento"
                options={tipo_eventos}
                textId="tipo_evento"
                valueData={data.tipo_evento}
                updateData={inputsUpdate}
              />
            </div>
            <div className="w-1/3">
              <SelectD
                text="Estado Pedido"
                textId="estado_pedido"
                options={estado_pedido}
                valueData={data.estado_pedido}
                updateData={inputsUpdate}
              />
            </div>
          </div>

          <div className="flex justify-between my-5">
            <InputDate
              text="Fecha Entrega"
              textId="fecha_entrega"
              valueData={data.fecha_entrega ?? ""}
              updateData={inputsUpdate}
            />

            <InputDate
              text="Fecha Tallaje 1"
              textId="fecha_tallaje1"
              valueData={data.fecha_tallaje1 ?? ""}
              updateData={inputsUpdate}
            />
            <InputDate
              text="Fecha Tallaje 2"
              textId="fecha_tallaje2"
              valueData={data.fecha_tallaje2}
              updateData={inputsUpdate}
            />
          </div>

          <div className="flex justify-between w-full gap-x-6">
            <div className="flex-col w-2/3">
              <TextArea
                text="Notas"
                textId="nota_pedido"
                valueData={data.nota_pedido}
                updateData={inputsUpdate}
              />
              <div className="flex justify-between mt-5 w-full">
                <InputDate
                  text="Fecha Evento"
                  textId="evento_traje"
                  valueData={data.evento_traje}
                  updateData={inputsUpdate}
                />

                <InputN
                  text="Pago Final"
                  type="number"
                  textId="costo_total"
                  valueData={data.costo_total}
                  view=""
                  updateData={inputsUpdate}
                />
                <InputN
                  text="Anticipo"
                  type="number"
                  textId="anticipo"
                  valueData={data.anticipo}
                  view=""
                  updateData={inputsUpdate}
                />
              </div>

              <div className="flex justify-start mt-5">
                <div className="flex-col mr-14">
                  <label className="text-md font-semibold text-[#004B57]">
                    Tipo Entalle
                  </label>
                  <div className="flex">
                    <input
                      type="checkbox"
                      id="slimfit"
                      checked={data.tipo_entalle === "Slim fit"}
                      onChange={(e) => {
                        setData({
                          ...data,
                          tipo_entalle: e.target.checked ? "Slim fit" : "",
                        });
                      }}
                    />
                    <label htmlFor="slimfit" className="ml-2">
                      Slim Fit
                    </label>
                  </div>
                  <div className="flex">
                    <input
                      type="checkbox"
                      id="regularfit"
                      checked={data.tipo_entalle === "Regular fit"}
                      onChange={(e) => {
                        setData({
                          ...data,
                          tipo_entalle: e.target.checked ? "Regular fit" : "",
                        });
                      }}
                    />
                    <label htmlFor="regularfit" className="ml-2">
                      Regular Fit
                    </label>
                  </div>
                </div>
                <InputN
                  text="Restante"
                  type="number"
                  textId="restante"
                  valueData={data.restante}
                  view=""
                  updateData={inputsUpdate}
                />
              </div>
            </div>

            <div className="h-60 w-3/10 flex text-center rounded-2xl">
              <div className="h-full w-10/12">
                <label className="text-md font-semibold text-[#004B57]">
                  Imagen Referencia
                </label>
                <div className="bg-[#D9D9D9] rounded-2xl h-full w-full"></div>
              </div>
              <div className="flex-col content-end mb-3 items-start">
                <button
                  type="button"
                  className="h-10 w-10 bg-[#004053] rounded-lg flex justify-center items-center text-white m-2"
                >
                  <ArrowsPointingInIcon className="size-6" />
                </button>
                <button
                  type="button"
                  className="h-10 w-10 bg-[#00A29B] rounded-lg m-2 flex justify-center items-center text-[#004053]"
                >
                  <ArrowUpOnSquareIcon className="size-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <div className="flex-col">
              <button
                type="submit"
                className="bg-[#B4D333] hover:bg-[#a3c02b] text-[#004B57] font-bold px-6 py-2 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <CheckCircleIcon className="size-6" />
                Guardar
              </button>
              <button
                type="button"
                onClick={() => handleSiguiente(id_pedido)}
                className={
                  id_pedido
                    ? "bg-[#004053] hover:bg-[#008292] text-[#B2B2B2] font-bold px-5 py-2 mt-4 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
                    : "hidden"
                }
              >
                <ArrowRightCircleIcon className="size-6" />
                Siguiente
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
