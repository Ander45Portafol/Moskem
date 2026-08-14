import { useEffect, useState } from "react";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useForm } from "../../assets/js/Forms/useForm";
import { InputD } from "../InputD";
import { SelectD } from "../SelectD";
import { API } from "../../assets/js/global";
import Swal from "sweetalert2";

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
  };

  const { data, setData } = useForm({
    id: id_tela,
    setForm: setTela,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });

  const optionsCategoria = ["Lino", "Algodón", "Lana", "Seda", "Poliéster"];
  const optionsProveedor = ["CASRAV", "Textiles El Sol", "Distribuidora Moda"];

  // Captura el cambio de valor de cada input dinámicamente
  const inputsUpdate = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Función para guardar (POST) o actualizar (PUT)
  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const isEdit = tipo === "actualizar" && id_tela;
      const url = isEdit ? `${API}telas/${id_tela}` : `${API}telas`;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();

        // Notificación de éxito
        Swal.fire({
          toast: true,
          position: "top-end",
          title: responseData.message || (isEdit ? "Registro actualizado" : "Registro creado"),
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        });

        // Actualizar el estado de la lista de telas en tiempo real
        if (isEdit) {
          setTela((prev) =>
            prev.map((item) => (item.id === id_tela ? responseData.data || data : item))
          );
        } else {
          setTela((prev) => [...prev, responseData.data || data]);
        }

        // Cerrar el modal
        onClose();
      } else {
        Swal.fire("Error", "No se pudo guardar la información", "error");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      Swal.fire("Error", "Ocurrió un problema con el servidor", "error");
    }
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
          onSubmit={onSubmitForm}
        >
          <SelectD
            text="Categoría"
            name="categoria"
            textId="categoria"
            options={optionsCategoria}
            valueData={data?.categoria || ""}
            updateData={inputsUpdate}
          />

          <InputD
            text="Color"
            type="text"
            name="color"
            textId="color"
            view=""
            valueData={data?.color || ""}
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

          <SelectD
            text="Proveedor"
            name="id_proveedor"
            textId="id_proveedor"
            options={optionsProveedor}
            valueData={data?.id_proveedor || ""}
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