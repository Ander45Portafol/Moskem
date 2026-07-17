import { useEffect, useState } from "react";
import { useGet } from "../../assets/js/useGet";
import { InputDate } from "../inputDate";
import { SelectD } from "../SelectD";
import { TextArea } from "../TextArea";
import {
  ArrowsPointingInIcon,
  ArrowUpOnSquareIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { InputD } from "../InputD";
import { SelectWD } from "../SelectWD";
import { InputN } from "../InputN";
import { useForm } from "../../assets/js/Forms/useForm";
import { ModalDetallePedido } from "./ModalDetallePedido";

export function ModalPedido({ isOpen, onClose, tipo, id_pedido, setPedido }) {
  const [modalActivo,setModalActivo]=useState(false)
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
  const { data: clientes } = useGet("clientes");

  // Usamos el encadenamiento opcional (?.) por si 'clientes' aún está cargando (es undefined o null)
  const SelectClientes =
    clientes?.map((registro) => ({
      id: registro.id, // O el nombre exacto que tenga tu id en la base de datos
      nombre: registro.nombres + " " + registro.apellidos,
    })) || [];

  const tipo_eventos = ["Boda", "Graduación", "Bautizo", "Cumpleaños", "otro"];
  const tipo_pedido = ["Prenda unica", "Traje completo", "Paquete"];
  const estado_pedido = [
    "Anotado",
    "Revisado",
    "En Proceso",
    "Finalizado",
    "Entregado",
  ];
  const inputsUpdate = (e) => {
    const name = e.target.name;

    // Si el elemento es un checkbox o el evento simulado dice que es checkbox, usamos 'checked'
    const inputValue =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setData({
      ...data,
      [name]: inputValue,
    });
  };
  useEffect(() => {
    if (isOpen) {
      setRender(true);
      // Pequeño delay para que el navegador registre el cambio de estado y ejecute la animación de entrada
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Espera a que termine la animación de salida (300ms) antes de desmontar el componente
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const guardarDatos = () => {
    handleSubmit();
    setModalActivo(true)
  }
  if (!render) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Tarjeta del Modal con animación de escala y opacidad */}
      <div
        className={`bg-white w-[1000px] max-w-[100vw] rounded-[32px] p-10 shadow-2xl relative flex flex-col gap-8 transition-all duration-300 transform ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Botón Cerrar (X) arriba a la derecha */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-8 right-8 text-[#004B57] hover:scale-110 transition-transform"
        >
          <XMarkIcon className="size-7" />
        </button>

        {/* Encabezado del Modal */}
        <div>
          <h2 className="text-4xl font-black text-[#004B57] tracking-wide uppercase">
            Formulario - Pedido
          </h2>
        </div>

        {/* Formulario estructurado en Grid de 3 columnas */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between gap-x-6 ">
            <SelectWD
              text="Cliente"
              options={SelectClientes}
              textId="id_cliente"
              valueData={data.id_cliente}
              updateData={inputsUpdate}
            />
            <SelectD
              text="Tipo Evento"
              options={tipo_eventos}
              textId="tipo_evento"
              valueData={data.tipo_evento}
              updateData={inputsUpdate}
            />

            <SelectD
              text="Estado Pedido"
              textId="estado_pedido"
              options={estado_pedido}
              valueData={data.estado_pedido}
              updateData={inputsUpdate}
            />
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
          <div className="flex justify-between w-full gap-x-6 ">
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
                  <label
                    htmlFor=""
                    className="text-md font-semibold text-[#004B57]"
                  >
                    Tipo Entalle
                  </label>
                  <div className="flex">
                    <input
                      type="checkbox"
                      className=""
                      checked={data.tipo_entalle === "Slim fit"}
                      onChange={(e) => {
                        setData({
                          ...data,
                          tipo_entalle: e.target.checked ? "Slim fit" : "",
                        });
                      }}
                    />
                    <label htmlFor="" className="ml-2">
                      Slim Fit
                    </label>
                  </div>
                  <div className="flex">
                    <input
                      type="checkbox"
                      checked={data.tipo_entalle === "Regular fit"}
                      onChange={(e) => {
                        setData({
                          ...data,
                          tipo_entalle: e.target.checked ? "Regular fit" : "",
                        });
                      }}
                    />

                    <label htmlFor="" className="ml-2">
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
                <label
                  htmlFor=""
                  className="text-md font-semibold text-[#004B57]"
                >
                  Imagen Referencia
                </label>
                <div className="bg-[#D9D9D9] rounded-2xl h-full w-full"></div>
              </div>
              <div className="flex-col content-end mb-3 items-start">
                <button className="h-10 w-10 bg-[#004053] rounded-lg flex justify-center  items-center text-white m-2">
                  <ArrowsPointingInIcon className="size-6" />
                </button>
                <button className="h-10 w-10 bg-[#00A29B] rounded-lg m-2 flex justify-center items-center text-[#004053]">
                  <ArrowUpOnSquareIcon className="size-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Botón Guardar / Editar */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-[#B4D333] hover:bg-[#a3c02b] text-[#004B57] font-bold px-5 py-2 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <CheckCircleIcon className="size-6" />
              Guardar
            </button>
          </div>
        </form>
      </div>
      <ModalDetallePedido
        isOpen={modalActivo}
        onClose={() => setModalActivo(false)}
        id_pedido={id_pedido}
      />
    </div>
  );
}
