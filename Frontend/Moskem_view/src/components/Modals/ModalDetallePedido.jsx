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

export function ModalDetallePedido({
  isOpen,
  onClose,
  tipo,
  id_pedido,
  id_paquete,
  id_detallepedido,
  detallesData,
}) {
  console.log(id_paquete);
  //Variable reactiva que guarda los campos de los detalle del paquete que estan ligados al paquete
  const [detallePaquete, setDetallePaquete] = useState(null);
  //Funcion para cargar los datos de los detalles
  const cargarPrendasPaquete = async (paquete_id) => {
    try {
      const response = await fetch(`${API}paquetes/${paquete_id}`);
      if (response.ok) {
        const responseData = await response.json();
        setDetallePaquete(responseData.data.detalle_paquete);
        console.log(responseData.data.detalle_paquete);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  const ruta = "detalle_pedidos";
  const estadoInicial = {
    id_pedido: id_pedido || "",
    id_tela: "",
    id_empleado: 1,
    anticipo: "",
    id_paquete: id_paquete || "",
    cantidad_tela: "",
    prenda: "",
    tipo_pedido: "",
    categoria_pedido: "",
    numero_pedido: "",
  };

  // 1. Extraemos los datos de las telas primero
  //Funcion para cargar toda la informacion de un detalle de pedido
  //const cargar_de
  // 2. Activamos el formulario (descomentado)
  const { data, setData, handleSubmit } = useForm({
    id: id_detallepedido,
    setForm: detallesData,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });
  console.log(data);



  const prenda = ["Camisa", "Saco", "Chaleco", "Pantalón"];
  const tipo_pedido = ["Prenda unica", "Traje completo", "Paquete"];

  const inputsUpdate = (e) => {
    const name = e.target.name;
    const inputValue =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setData({
      ...data,
      [name]: inputValue,
    });

    // Si el select que cambió es el de categoría_tela, actualizamos el estado local de filtro
    if (name === "categoria_tela") {
      setCategoriaSeleccionada(e.target.value);
    }
  };

  useEffect(() => {
    if (isOpen) {
      cargarPrendasPaquete(id_paquete);
      setRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!render) return null;

 // ... resto del código igual ...

return (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`}
  >
    {/* 1. Modal contenedor */}
    <div
      className={`bg-white w-[1200px] h-[650px] max-w-[100vw] rounded-[32px] p-10 shadow-2xl relative flex flex-col gap-6 transition-all duration-300 transform ${isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-8 right-8 text-[#004053] hover:scale-110 transition-transform"
      >
        <XMarkIcon className="size-7" />
      </button>

      {/* Encabezado */}
      <div className="flex-col">
        <h2 className="text-3xl font-black text-[#004053] tracking-wide uppercase">
          Detalle - Pedido
        </h2>
        <p className="text-[#004B57] text-lg">
          Completar la siguiente información del formulario
        </p>
      </div>

      {/* 2. Cuerpo con scroll (flex-1 para tomar el alto restante) */}
      <div className="flex-1 overflow-x-auto overflow-y-auto pb-4">
        <div className="flex min-h-full w-max items-stretch">
          {detallePaquete?.map((paquete, index) => (
            <div
              key={paquete.id_detalle_paquete}
              className="flex min-h-full items-stretch shrink-0"
            >
              {/* Componente DetallePaquete */}
              <DetallePaquete
                detalle={data}
                update_input={inputsUpdate}
                data_detalle={paquete}
              />
              {index < detallePaquete.length - 1 && (
                <div className="w-1 mx-6 bg-[#004B57] self-stretch"></div>
              )}{" "}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex justify-between">
        <button className="bg-[#004B57] text-[#B2B2B2] w-32 h-10 flex justify-center items-center rounded-xl gap-2 text-normal font-bold">
          <ArrowLeftCircleIcon className="size-5" />
          Regresar
        </button>
        <button className="bg-[#BCCF00] text-[#004B57] w-32 h-10 rounded-xl flex justify-center items-center gap-2 text-normal font-bold"><ArrowRightCircleIcon className="size-5"/>Finalizar</button>
      </div>
    </div>
  </div>
);
}
