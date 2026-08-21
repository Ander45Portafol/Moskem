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
  registroEditar,
  id_merceria,
  setMerceria,
}) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  const ruta = "mercerias";

  const estadoInicial = {
    tipo_merceria: "Botones",
    tamanio_merceria: "",
    unidad_medida: "mm",
    color: "",
    codigo_merceria: "",
    codigo_merceria_proveedor: "",
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

  // EFECTO ÚNICO: Gestiona animación, desmontaje y precarga de datos al abrir/cerrar
  useEffect(() => {
    let timer;

    if (isOpen) {
      setRender(true);
      timer = setTimeout(() => setIsAnimating(true), 30);

      // Precarga de datos
      if (tipo === "actualizar" && registroEditar) {
        setData({
          tipo_merceria: registroEditar.tipo_merceria || registroEditar.tipo || "Botones",
          tamanio_merceria: registroEditar.tamanio_merceria ?? registroEditar.tamanio ?? "",
          unidad_medida: registroEditar.unidad_medida || "mm",
          color: registroEditar.color || "",
          codigo_merceria: registroEditar.codigo_merceria || registroEditar.codigo || "",
          codigo_merceria_proveedor: registroEditar.codigo_merceria_proveedor || "",
          stock: registroEditar.stock ?? "",
          id_proveedor: registroEditar.id_proveedor || registroEditar.proveedor?.id_proveedor || "",
        });
      } else if (tipo === "agregar") {
        setData(estadoInicial);
      }
    } else {
      setIsAnimating(false);
      timer = setTimeout(() => setRender(false), 300);
    }

    return () => clearTimeout(timer);
  }, [isOpen, tipo, registroEditar]);

  const { data: proveedores } = useGet("proveedores");

  const SelectProveedores =
    proveedores?.map((reg) => ({
      id: reg.id_proveedor || reg.id,
      nombre: reg.nombre_proveedor || reg.nombre,
    })) || [];

  const SelectTipoMerceria = ["Botones", "Ganchos", "Zipper", "Agujas", "Hilos"];
  const SelectUnidadesMedida = ["pulgadas", "mm", "#"];

  const inputsUpdate = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const isEdit = tipo === "actualizar" && (id_merceria || registroEditar?.id_merceria);
      const targetId = id_merceria || registroEditar?.id_merceria;
      const url = isEdit ? `${API}mercerias/${targetId}` : `${API}mercerias`;
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...data,
        tamanio_merceria: parseInt(data.tamanio_merceria, 10) || 0,
        stock: parseInt(data.stock, 10) || 0,
        id_proveedor: parseInt(data.id_proveedor, 10) || null,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();

        Swal.fire({
          toast: true,
          position: "top-end",
          title: responseData.message || (isEdit ? "Registro actualizado" : "Registro creado"),
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        });

        if (isEdit) {
          setMerceria((prev) =>
            prev.map((item) =>
              item.id_merceria === targetId
                ? responseData.data || { ...item, ...payload }
                : item
            )
          );
        } else {
          setMerceria((prev) => [...prev, responseData.data || payload]);
        }

        onClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        Swal.fire("Error", errorData.message || "No se pudo guardar la información", "error");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      Swal.fire("Error", "Ocurrió un error con la conexión al servidor", "error");
    }
  };

  if (!render || !data) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-[32px] shadow-2xl w-full max-w-4xl p-8 relative flex flex-col gap-6 border border-gray-100 transform transition-all duration-300 ${
          isAnimating ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2.5"
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

        <form className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-6" onSubmit={onSubmitForm}>
          <SelectD
            text="Tipo Mercería"
            name="tipo_merceria"
            textId="tipo_merceria"
            options={SelectTipoMerceria}
            valueData={data.tipo_merceria || "Botones"}
            updateData={inputsUpdate}
          />

          <InputD
            text="Tamaño (Número)"
            type="number"
            name="tamanio_merceria"
            textId="tamanio_merceria"
            view=""
            valueData={data.tamanio_merceria ?? ""}
            updateData={inputsUpdate}
          />

          <SelectD
            text="Unidad de Medida"
            name="unidad_medida"
            textId="unidad_medida"
            options={SelectUnidadesMedida}
            valueData={data.unidad_medida || "mm"}
            updateData={inputsUpdate}
          />

          <InputD
            text="Color"
            type="text"
            name="color"
            textId="color"
            view=""
            valueData={data.color || ""}
            updateData={inputsUpdate}
          />

          <InputD
            text="Código Mercería"
            type="text"
            name="codigo_merceria"
            textId="codigo_merceria"
            view=""
            valueData={data.codigo_merceria || ""}
            updateData={inputsUpdate}
          />

          <InputD
            text="Código Proveedor"
            type="text"
            name="codigo_merceria_proveedor"
            textId="codigo_merceria_proveedor"
            view=""
            valueData={data.codigo_merceria_proveedor || ""}
            updateData={inputsUpdate}
          />

          <InputD
            text="Stock"
            type="number"
            name="stock"
            textId="stock"
            view=""
            valueData={data.stock ?? ""}
            updateData={inputsUpdate}
          />

          <SelectWD
            text="Proveedor"
            name="id_proveedor"
            textId="id_proveedor"
            options={SelectProveedores}
            valueData={data.id_proveedor || ""}
            updateData={inputsUpdate}
          />

          <div className="md:col-span-3 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-[#B4D333] hover:bg-[#a3c02b] text-[#004B57] font-bold px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <CheckCircleIcon className="size-6" />
              {tipo === "actualizar" ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}