import { useEffect, useState } from "react";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useForm } from "../../assets/js/Forms/useForm";
import { InputD } from "../InputD";
import { SelectD } from "../SelectD";
import { API } from "../../assets/js/global";
import Swal from "sweetalert2";
import { SelectWD } from "../SelectWD";
import { useGet } from "../../assets/js/useGet";

export function ModalMerceria({
  isOpen,
  onClose,
  tipo, // "agregar" o "actualizar"
  id_merceria,
  setMerceria, // setData de la vista Merceria.jsx
}) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  // Ruta en plural para alinearse con los endpoints RESTful de Laravel
  const ruta = "mercerias";

  // Mapeo inicial sincronizado con la base de datos y la tabla
  const estadoInicial = {
    tipo: "",
    tamanio: "",
    color: "",
    codigo: "",
    stock: "",
    id_proveedor: "",
  };

  const { data, setData } = useForm({
    id: id_merceria,
    setForm: setMerceria,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });

  // Carga de proveedores para el selector
  const { data: proveedores } = useGet("proveedores");

  const SelectProveedores =
    proveedores?.map((registro) => ({
      id: registro.id_proveedor || registro.id,
      nombre: registro.nombre_proveedor || registro.nombre,
    })) || [];

  const SelectTipoMerceria = [
    "Botones", "Ganchos", "Zipper", "Agujas", "Hilos",
  ];

  // Actualización de inputs
  const inputsUpdate = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Función para guardar (POST) o actualizar (PUT)
  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const isEdit = tipo === "actualizar" && id_merceria;
      const url = isEdit ? `${API}mercerias/${id_merceria}` : `${API}mercerias`;
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

        Swal.fire({
          toast: true,
          position: "top-end",
          title:
            responseData.message ||
            (isEdit ? "Registro actualizado" : "Registro creado"),
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        });

        if (isEdit) {
          setMerceria((prev) =>
            prev.map((item) =>
              (item.id || item.id_merceria) === id_merceria
                ? responseData.data || data
                : item
            )
          );
        } else {
          setMerceria((prev) => [...prev, responseData.data || data]);
        }

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
            {tipo === "actualizar" ? "Editar Mercería" : "Formulario – Mercería"}
          </h2>
        </div>

        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-6"
          onSubmit={onSubmitForm}
        >
          <SelectD
            text="Tipo Mercería"
            textId="tipo"
            options={SelectTipoMerceria}
            valueData={data?.tipo || data?.tipo_merceria || ""}
            updateData={inputsUpdate}
          />

          <InputD
            text="Tamaño"
            type="text"
            name="tamanio"
            textId="tamanio"
            view=""
            valueData={data?.tamanio || data?.tamanio_merceria || ""}
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
            text="Código Mercería"
            type="text"
            name="codigo"
            textId="codigo"
            view=""
            valueData={data?.codigo || data?.codigo_merceria || ""}
            updateData={inputsUpdate}
          />

          <InputD
            text="Stock"
            type="number"
            name="stock"
            textId="stock"
            view=""
            valueData={data?.stock || ""}
            updateData={inputsUpdate}
          />

          <SelectWD
            text="Proveedor"
            textId="id_proveedor"
            options={SelectProveedores}
            valueData={data?.id_proveedor || ""}
            updateData={inputsUpdate}
          />

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