import { useEffect, useState } from "react";
import { useGet } from "../../assets/js/useGet";
import { SelectD } from "../SelectD";
import { InputN } from "../InputN";
import { useForm } from "../../assets/js/Forms/useForm";
import { DataList } from "../DataList";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { SelectWD } from "../SelectWD";
import { API } from "../../assets/js/global";
import { DetallePaquete } from "../DetallePaquete";
import Swal from "sweetalert2";

export function ModalDetallePedido({
  isOpen,
  onRegresar,
  onClose,
  tipo,
  id_pedido,
  id_paquete,
  id_detallepedido,
  detallesData,
}) {
  const [prendas, setPrendas] = useState(null);
  const [pasoActivo, setPasoActivo] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formsData, setFormsData] = useState([]);
  const [guardados, setGuardados] = useState([]);
  const [render, setRender] = useState(isOpen);

  const ruta = "detalle_pedidos";
  const estadoInicial = {
    id_pedido: id_pedido || "",
    id_tela: "",
    id_empleado: 1,
    id_paquete: id_paquete || "",
    cantidad_tela: "",
    prenda: "",
    tipo_pedido: id_paquete ? "Paquete" : "Prenda unica",
    precio_detalle: "",
    categoria_pedido: "",
    numero_pedido: "",
  };

  const { data, setData } = useForm({
    id: id_detallepedido,
    setForm: detallesData,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });

  const guardarPrenda = async (index) => {
    const registro = formsData[index];

    if (!registro?.id_tela || isNaN(Number(registro.id_tela))) {
      Swal.fire({
        icon: "warning",
        title: "Tela requerida",
        text: "Debes seleccionar una tela válida del listado antes de continuar.",
        confirmButtonColor: "#004053",
      });
      return false;
    }

    const payload = {
      id_pedido: registro?.id_pedido || id_pedido,
      id_tela: Number(registro.id_tela),
      id_empleado: registro?.id_empleado || 1,
      id_paquete: registro?.id_paquete || id_paquete,
      cantidad_tela: registro?.cantidad_tela,
      prenda: registro?.prenda,
      tipo_pedido: registro?.tipo_pedido,
      precio_detalle: registro?.precio_detalle || data?.precio_detalle,
      categoria_pedido: registro?.categoria_pedido || data?.categoria_pedido,
      numero_pedido: registro?.numero_pedido,
    };

    try {
      const esActualizacion = !!registro?.id_detalle_pedido;
      const url = esActualizacion
        ? `${API}${ruta}/${registro.id_detalle_pedido}`
        : `${API}${ruta}`;
      const metodo = esActualizacion ? "PUT" : "POST";

      const response = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();

        setFormsData((prev) => {
          const copy = [...prev];
          copy[index] = {
            ...copy[index],
            id_detalle_pedido:
              registro?.id_detalle_pedido ||
              responseData?.data?.id_detalle_pedido,
          };
          return copy;
        });

        setGuardados((prev) => {
          const copy = [...prev];
          copy[index] = true;
          return copy;
        });

        if (!esActualizacion && index < prendas.length - 1) {
          setPasoActivo(index + 1);
        }

        // 2. Notificación de éxito
        Swal.fire({
          icon: "success",
          title: esActualizacion ? "Detalle actualizado" : "Detalle guardado",
          text: `La prenda "${registro.prenda || "seleccionada"}" se guardó correctamente.`,
          timer: 2000,
          showConfirmButton: false,
        });

        return true;
      } else {
        // 3. Notificación de error si la respuesta HTTP no es OK
        Swal.fire({
          icon: "error",
          title: "Error al guardar",
          text: "No se pudo guardar el detalle de la prenda. Inténtalo de nuevo.",
          confirmButtonColor: "#004053",
        });
        return false;
      }
    } catch (error) {
      console.error("Error al guardar el detalle:", error);
      // 4. Notificación de error de red o servidor
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "Ocurrió un problema al comunicarse con el servidor.",
        confirmButtonColor: "#004053",
      });
      return false;
    }
  };

  const cargarDetallesExistentes = async (paquete_id) => {
    try {
      const response = await fetch(`${API}detalles/${paquete_id}`);
      if (response.ok) {
        const responseData = await response.json();
        return responseData?.data || [];
      }
      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const cargarPrendasPaquete = async (paquete_id, id_pedido) => {
    try {
      const response = await fetch(`${API}paquetes/${paquete_id}`);
      if (response.ok) {
        const responseData = await response.json();

        setData((prev) => ({
          ...prev,
          categoria_pedido: responseData.data.categoria_paquete,
          precio_detalle: responseData.data.precio_paquete,
        }));

        const listaPrendas = responseData.data.detalle_paquete.map(
          (item) => item.prenda,
        );
        setPrendas(listaPrendas);

        const detallesExistentes = id_pedido
          ? await cargarDetallesExistentes(id_pedido)
          : [];

        const nuevosGuardados = [];

        const nuevosFormsData = listaPrendas.map((p) => {
          const detalleGuardado = detallesExistentes.find(
            (d) => d.prenda === p.prenda_paquete,
          );

          if (detalleGuardado) {
            nuevosGuardados.push(true);
            return {
              id_pedido: detalleGuardado.id_pedido,
              id_tela: detalleGuardado.id_tela,
              id_empleado: detalleGuardado.id_empleado,
              id_paquete: detalleGuardado.id_paquete,
              cantidad_tela: detalleGuardado.cantidad_tela,
              prenda: detalleGuardado.prenda,
              tipo_pedido: detalleGuardado.tipo_pedido,
              precio_detalle: detalleGuardado.precio_detalle,
              categoria_pedido: detalleGuardado.categoria_pedido,
              numero_pedido: detalleGuardado.numero_pedido,
              id_detalle_pedido: detalleGuardado.id_detalle_pedido,
              categoria_tela: detalleGuardado.telas?.categoria_tela || "",
            };
          }

          nuevosGuardados.push(false);
          return {
            ...estadoInicial,
            prenda: p.prenda_paquete,
          };
        });

        setFormsData(nuevosFormsData);
        setGuardados(nuevosGuardados);

        const indexPendiente = nuevosGuardados.findIndex((g) => !g);
        setPasoActivo(
          indexPendiente === -1 ? nuevosGuardados.length - 1 : indexPendiente,
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const actualizarDato = (index, e) => {
    const { name, type, checked, value } = e.target;
    setFormsData((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [name]: type === "checkbox" ? checked : value,
      };
      return copy;
    });
  };

  const actualizarDataCompleta = (index, nuevoData) => {
    setFormsData((prev) => {
      const copy = [...prev];
      copy[index] = nuevoData;
      return copy;
    });
  };

  const aplicarCategoriaATodas = (nuevaCategoria) => {
    setFormsData((prev) =>
      prev.map((item) => ({
        ...item,
        categoria_tela: nuevaCategoria,
        id_tela: item.categoria_tela !== nuevaCategoria ? "" : item.id_tela,
      })),
    );
  };

  useEffect(() => {
    if (isOpen && id_paquete) {
      cargarPrendasPaquete(id_paquete, id_pedido);
      setRender(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, id_paquete, id_pedido]);

  if (!render) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white w-[1200px] h-[650px] max-w-[100vw] rounded-[32px] p-10 shadow-2xl relative flex flex-col gap-6 transition-all duration-300 transform ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-8 right-8 text-[#004053] hover:scale-110 transition-transform"
        >
          <XMarkIcon className="size-7" />
        </button>

        <div className="flex-col">
          <h2 className="text-3xl font-black text-[#004053] tracking-wide uppercase">
            Detalle - Pedido
          </h2>
          <p className="text-[#004B57] text-lg">
            Completar la siguiente información del formulario
          </p>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-auto pb-4">
          
          <div className="flex min-h-full w-max items-stretch">
            {prendas?.map((prenda, index) => (
              <div
                key={prenda.id_prenda || index}
                className="flex min-h-full items-stretch shrink-0"
              >
                <DetallePaquete
                  index={index}
                  onAplicarCategoriaATodas={aplicarCategoriaATodas}
                  detalle={formsData[index] || estadoInicial}
                  guardado={guardados[index]}
                  update_input={(e) => actualizarDato(index, e)}
                  data_detalle={prenda}
                  dataSet={(nuevoData) =>
                    actualizarDataCompleta(index, nuevoData)
                  }
                  activo={index === pasoActivo}
                  dataForm={data}
                  submitHandle={(e) => {
                    e.preventDefault();
                    guardarPrenda(index);
                  }}
                />
                <input
                  type="text"
                  className="hidden"
                  name="prenda"
                  value={data.prenda || ""}
                  readOnly
                />
                {index < prendas.length - 1 && (
                  <div className="w-1 mx-8 bg-[#004B57] self-stretch"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex justify-between">
          <button
            className="bg-[#004B57] text-[#B2B2B2] w-32 h-10 flex justify-center items-center rounded-xl gap-2 text-normal font-bold"
            onClick={onRegresar}
          >
            <ArrowLeftCircleIcon className="size-5" />
            Regresar
          </button>
          <button
            className="w-32 h-10 rounded-xl flex justify-center items-center gap-2 text-normal font-bold bg-[#BCCF00] text-[#004B57]"
            onClick={onClose}
          >
            <ArrowRightCircleIcon className="size-5" />
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
}
