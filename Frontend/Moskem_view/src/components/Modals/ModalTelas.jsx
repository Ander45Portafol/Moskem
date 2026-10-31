import { useEffect, useState } from "react";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useForm } from "../../assets/js/Forms/useForm";
import { InputD } from "../InputD";
import { SelectD } from "../SelectD";
import { SelectWD } from "../SelectWD";
import { useGet } from "../../assets/js/useGet";

export function ModalTelas({
  isOpen,
  onClose,
  tipo, // "agregar" o "actualizar"
  id_tela,
  setTela, // setData de la vista Telas.jsx
}) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const ruta = "telas";

  const estadoInicial = {
    categoria_tela: "",
    color_tela: "",
    codigo_tela: "",
    cantidad_stock: "",
    id_proveedor: "",
    tipo_prenda:"",
    codigo_tela_proveedor: "",
  };

  const { data, setData, handleSubmit } = useForm({
    id: id_tela,
    setForm: setTela,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });

  // Se usa para extraer los datos de los proveedores que se cargarán en el select
  const { data: proveedores } = useGet("proveedores");

  const SelectProveedores =
    proveedores?.map((registro) => ({
      id: registro.id_proveedor,
      nombre: registro.nombre_proveedor,
    })) || [];

  const SelectCategoria = ["Elite", "Elite +", "Premium"];
  const SelectTipoPrenda = ["Camisa", "Pantalon / Saco / Chaleco", "Accesorios"];

  // Captura el cambio de valor de cada input dinámicamente
  const inputsUpdate = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      const timer = setTimeout(() => setIsAnimating(true), 30);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!render || !data) return null;

  const handleFondoClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleFondoClick}
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-[32px] shadow-2xl w-full max-w-4xl p-8 relative flex flex-col gap-6 border border-gray-100 transform transition-all duration-300 ${
          isAnimating
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2.5"
        }`}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-6 right-6 text-[#004B57] hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <XMarkIcon className="size-7" />
        </button>

        <div>
          <h2 className="text-3xl font-black text-[#004B57] uppercase">
            {tipo === "actualizar" ? "Editar Tela" : "Formulario – Telas"}
          </h2>
        </div>

        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-6"
          onSubmit={handleSubmit}
        >
          <SelectD
            text="Categoría"
            textId="categoria_tela"
            options={SelectCategoria}
            valueData={data.categoria_tela}
            updateData={inputsUpdate}
          />
          <SelectD
            text="TIpo Prenda"
            textId="tipo_prenda"
            options={SelectTipoPrenda}
            valueData={data.tipo_prenda}
            updateData={inputsUpdate}
          />
          <InputD
            text="Color"
            type="text"
            textId="color_tela"
            view=""
            valueData={data?.color_tela || ""}
            updateData={inputsUpdate}
          />

          <InputD
            text="Código"
            type="text"
            name="codigo_tela"
            textId="codigo_tela"
            view=""
            valueData={data?.codigo_tela || ""}
            updateData={inputsUpdate}
          />

          <InputD
            text="Cantidad Stock"
            type="number"
            name="cantidad_stock"
            textId="cantidad_stock"
            view=""
            valueData={data?.cantidad_stock || ""}
            updateData={inputsUpdate}
          />

          <SelectWD
            text="Proveedor"
            textId="id_proveedor"
            options={SelectProveedores}
            valueData={data?.id_proveedor}
            updateData={inputsUpdate}
          />

          <InputD
            text="Código Proveedor"
            type="text"
            textId="codigo_tela_proveedor"
            view=""
            valueData={data?.codigo_tela_proveedor || ""}
            updateData={inputsUpdate}
          />

          <div className="hidden md:block"></div>

          <div className="md:col-span-3 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-[#B4D333] hover:bg-[#a3c02b] text-[#004B57] font-bold px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
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