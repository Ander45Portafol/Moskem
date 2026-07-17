import { useEffect, useState } from "react";
import { useGet } from "../../assets/js/useGet";
import { SelectD } from "../SelectD";
import { InputN } from "../InputN";
import { useForm } from "../../assets/js/Forms/useForm";
import { DataList } from "../DataList";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

export function ModalDetallePedido({
  isOpen,
  onClose,
  tipo,
  id_pedido,
  setPedido,
}) {
  const [render, setRender] = useState(isOpen);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const ruta = "detalle_pedidos";
  const estadoInicial = {
    id_pedido: id_pedido || "",
    id_tela: "",
    id_empleado: "",
    anticipo: "",
    id_paquete: "",
    cantidad_tela: "",
    prenda: "",
    tipo_pedido: "",
    categoria_pedido: "",
    numero_pedido: "",
  };

  // 1. Extraemos los datos de las telas primero
  const { data: telas } = useGet("telas");

  // 2. Activamos el formulario (descomentado)
  const { data, setData, handleSubmit } = useForm({
    id: id_pedido,
    setForm: setPedido,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });

  // 3. Obtenemos las categorías únicas de forma segura
  const categoria_tela = telas
    ? [...new Set(telas.map((tela) => tela.categoria_tela))]
    : [];

  // 4. Lógica de filtrado: Si no hay categoría, muestra todas las telas
  const telasFiltradas = categoriaSeleccionada
    ? telas?.filter((tela) => tela.categoria_tela === categoriaSeleccionada) ||
      []
    : telas || [];

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
      setRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!render) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`bg-white w-[1000px] max-w-[100vw] rounded-[32px] p-10 shadow-2xl relative flex flex-col gap-8 transition-all duration-300 transform ${isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
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
            Formulario - Detalle Pedido
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between gap-x-6 ">
            <SelectD
              text="Tipo Pedido"
              options={tipo_pedido}
              textId="tipo_pedido"
              valueData={data.tipo_pedido}
              updateData={inputsUpdate}
            />
            <SelectD
              text="Prenda"
              options={prenda}
              textId="prenda"
              valueData={data.prenda}
              updateData={inputsUpdate}
            />
            <InputN
              text="Cantidad"
              textId="numero_pedido"
              valueData={data.numero_pedido}
              updateData={inputsUpdate}
            />
            <SelectD
              text="Categoría Tela"
              options={categoria_tela}
              textId="categoria_tela"
              valueData={categoriaSeleccionada}
              updateData={inputsUpdate}
            />
          </div>

          <div className="flex justify-between my-5">
            <DataList
              text="Tela"
              textId="id_tela"
              dataList={telasFiltradas}
              valueData={data.id_tela}
              updateData={inputsUpdate}
            />
          </div>

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
    </div>
  );
}
