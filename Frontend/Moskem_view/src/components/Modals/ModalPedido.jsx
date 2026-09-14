import { useEffect, useState, useRef } from "react";
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
import { useForm } from "../../assets/js/Forms/useForm";
import { API } from "../../assets/js/global";
import Swal from "sweetalert2";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export function ModalPedido({
  isOpen,
  onClose,
  id_pedido,
  setPedido,
  onPedidoGuardado,
}) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [openLightbox, setOpenLightbox] = useState(false);
  // Estados y referencias para el control de imágenes
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

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

  const { data: resPaquetes } = useGet("paquetes");
  const listaPaquetes = Array.isArray(resPaquetes)
    ? resPaquetes
    : resPaquetes?.data || [];

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
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    const nuevosDatos = {
      ...data,
      [name]: inputValue,
    };

    // Recálculo automático con límite a 2 decimales
    if (name === "anticipo" || name === "costo_total") {
      const costo =
        parseFloat(name === "costo_total" ? inputValue : data.costo_total) || 0;
      const ant =
        parseFloat(name === "anticipo" ? inputValue : data.anticipo) || 0;

      const calculoRestante = Math.max(0, costo - ant);

      // Formatea con 2 decimales (.toFixed(2))
      nuevosDatos.restante = calculoRestante.toFixed(2);
    }

    setData(nuevosDatos);
  };

  // Manejador de la imagen seleccionada desde el archivo local
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setData({
        ...data,
        imagen_referencia: file,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsDisabled(!id_pedido);

      // Evaluación para previsualizar la imagen correctamente
      if (data?.imagen_referencia) {
        if (data.imagen_referencia instanceof File) {
          // Imagen local seleccionada recientemente de la computadora
          setPreviewImage(URL.createObjectURL(data.imagen_referencia));
        } else if (typeof data.imagen_referencia === "string") {
          // Imagen devuelta desde la BD (Construye la URL si no viene con 'http')
          const urlFinal = data.imagen_referencia.startsWith("http")
            ? data.imagen_referencia
            : `${API.replace(/\/api\/?$/, "")}/storage/${data.imagen_referencia}`;
          setPreviewImage(urlFinal);
        }
      } else {
        setPreviewImage(null);
      }

      setRender(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, id_pedido, data?.imagen_referencia]);

  const guardarDatos = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "imagen_referencia") {
          // Solo adjuntar si el usuario seleccionó un archivo File real de su computadora
          if (data[key] instanceof File) {
            formData.append("imagen_referencia", data[key]);
          }
        } else if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      // Simular PUT para Laravel cuando exista id_pedido
      if (id_pedido) {
        formData.append("_method", "PUT");
      }

      const pedidoCreado = await handleSubmit(e, formData);

      if (pedidoCreado || id_pedido) {
        const idActual = pedidoCreado?.id_pedido || id_pedido;
        setIsDisabled(false);

        Swal.fire({
          icon: "success",
          title: id_pedido ? "Pedido actualizado" : "Pedido guardado",
          text: id_pedido
            ? "Los datos del pedido se actualizaron correctamente."
            : "El pedido se ha registrado con éxito.",
          timer: 2000,
          showConfirmButton: false,
        });

        notificarPadre(idActual);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "Ocurrió un problema al intentar guardar los datos del pedido.",
        confirmButtonColor: "#004053",
      });
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
          {/* Input oculto para cargar archivos de la PC */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

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

                <div className="flex flex-col gap-1.5">
                  <label className="text-md font-semibold text-[#004B57]">
                    Costo total
                  </label>
                  <input
                    type="number"
                    className="bg-[#D9D9D9]/50 border-none rounded-lg p-2 w-42 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    value={data.costo_total}
                    id="costo_total"
                    name="costo_total"
                    onChange={inputsUpdate}
                    disabled={true}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-md font-semibold text-[#004B57]">
                    Anticipo
                  </label>
                  <input
                    type="number"
                    className="bg-[#D9D9D9]/50 border-none rounded-lg p-2 w-42 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    value={data.anticipo}
                    id="anticipo"
                    name="anticipo"
                    onChange={inputsUpdate}
                    disabled={isDisabled}
                  />
                </div>
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

                <div className="flex flex-col gap-1.5">
                  <label className="text-md font-semibold text-[#004B57]">
                    Restante
                  </label>
                  <input
                    type="number"
                    className="bg-[#D9D9D9]/50 border-none rounded-lg p-2 w-42 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    value={data.restante}
                    id="restante"
                    name="restante"
                    onChange={inputsUpdate}
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            {/* Renderizado de Previsualización y Control de Subida */}
            <div className="h-60 w-3/10 flex text-center rounded-2xl">
              <div className="h-full w-10/12 flex flex-col items-center">
                <label className="text-md font-semibold text-[#004B57] mb-1">
                  Imagen Referencia
                </label>
                <div className="bg-[#D9D9D9] rounded-2xl h-full w-full overflow-hidden flex justify-center items-center relative border border-gray-200">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Referencia"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 font-medium text-sm">
                      Sin imagen
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-col content-end mb-3 items-start">
                <button
                  type="button"
                  onClick={() => {
                    if (previewImage) {
                      setOpenLightbox(true);
                    } else {
                      Swal.fire({
                        toast: true,
                        position: "top-end",
                        title: "No hay imagen para ampliar",
                        icon: "info",
                        showConfirmButton: false,
                        timer: 2000,
                      });
                    }
                  }}
                  className="h-10 w-10 bg-[#004053] hover:bg-[#002e3c] rounded-lg flex justify-center items-center text-white m-2 transition-colors"
                >
                  <ArrowsPointingInIcon className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="h-10 w-10 bg-[#00A29B] hover:bg-[#008781] rounded-lg m-2 flex justify-center items-center text-[#004053] transition-colors"
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
                  id_pedido || !isDisabled
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
        <Lightbox
          open={openLightbox}
          close={() => setOpenLightbox(false)}
          slides={previewImage ? [{ src: previewImage }] : []}
        />
      </div>
    </div>
  );
}
