import React, { useEffect, useState } from "react";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useForm } from "../../assets/js/Forms/useForm";
import { InputD } from "../InputD";
import { SelectD } from "../SelectD";
import { SelectWD } from "../SelectWD";
import { API } from "../../assets/js/global";
import { useGet } from "../../assets/js/useGet";
import Swal from "sweetalert2";

export function ModalProducto({
  isOpen,
  onClose,
  tipo, // "agregar", "actualizar" o "ver"
  registroEditar,
  id_producto,
  setProductos,
}) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  const ruta = "productos";

  const estadoInicial = {
  tipo_producto: "Camisa",
  color: "",
  talla: "",
  id_tela: "",
  costo: "",
  estado_producto: "Disponible",
  visibilidad_producto: true,
};

  const { data, setData } = useForm({
    id: id_producto,
    setForm: setProductos,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });

  // EFECTO ÚNICO: Animación, desmontaje y precarga de datos al abrir/cerrar
  useEffect(() => {
    let timer;

    if (isOpen) {
      setRender(true);
      timer = setTimeout(() => setIsAnimating(true), 30);

      // Precarga de datos para actualización o visualización
      if ((tipo === "actualizar" || tipo === "ver") && registroEditar) {
        setData({
          tipo_producto: registroEditar.tipo_producto || "Camisa ML",
          color: registroEditar.color || "",
          talla: registroEditar.talla || "",
          id_tela: registroEditar.id_tela || registroEditar.telas?.id_tela || "",
          costo: registroEditar.costo ?? "",
          estado_producto: registroEditar.estado_producto || "Disponible",
          visibilidad_producto: registroEditar.visibilidad_producto ?? true,
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

  // Cargar catálogo de telas
  const { data: telasResponse } = useGet("telas");

  // Si la respuesta del backend viene envuelta en { data: [...] }, extraemos el arreglo; de lo contrario, usamos el objeto directo
  const telasLista = Array.isArray(telasResponse)
    ? telasResponse
    : Array.isArray(telasResponse?.data)
    ? telasResponse.data
    : [];

  // Mapeo flexible para construir la lista de opciones (detecta los nombres de columna comunes de telas)
  const SelectTelas = telasLista.map((reg) => {
    const id = reg.id_tela || reg.id;
    const codigo = reg.codigo_tela || reg.codigo || "";
    const descripcion =
      reg.nombre_tela ||
      reg.color_tela ||
      reg.color ||
      reg.categoria_tela ||
      reg.tipo_tela ||
      "";

    const label = [codigo, descripcion].filter(Boolean).join(" - ");

    return {
      id: id,
      nombre: label || `Tela #${id}`,
    };
  });

  const SelectTipoProducto = ["Camisa", "Pantalon", "Saco", "Traje_completo", "Traje_superior", "Corbata"];
  const SelectEstadoProducto = ["Disponible", "Agotado"];

  const inputsUpdate = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (tipo === "ver") {
      onClose();
      return;
    }

    try {
      const isEdit = tipo === "actualizar" && (id_producto || registroEditar?.id_producto);
      const targetId = id_producto || registroEditar?.id_producto;
      const url = isEdit ? `${API}productos/${targetId}` : `${API}productos`;
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...data,
        costo: parseFloat(data.costo) || 0,
        id_tela: data.id_tela ? data.id_tela : null,
        visibilidad_producto: true,
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
          title: responseData.message || (isEdit ? "Producto actualizado" : "Producto creado"),
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        });

        if (setProductos) {
          if (isEdit) {
            setProductos((prev) =>
              prev.map((item) =>
                item.id_producto === targetId
                  ? responseData.data || { ...item, ...payload }
                  : item
              )
            );
          } else {
            setProductos((prev) => [...prev, responseData.data || payload]);
          }
        }

        onClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        Swal.fire("Error", errorData.message || "No se pudo guardar la información del producto", "error");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      Swal.fire("Error", "Ocurrió un error con la conexión al servidor", "error");
    }
  };

  if (!render || !data) return null;

  const isReadOnly = tipo === "ver";

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
            {tipo === "actualizar"
              ? "Editar Producto"
              : tipo === "ver"
              ? "Detalle del Producto"
              : "Formulario – Producto"}
          </h2>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-6" onSubmit={onSubmitForm}>
          <SelectD
            text="Tipo Producto"
            name="tipo_producto"
            textId="tipo_producto"
            options={SelectTipoProducto}
            valueData={data.tipo_producto || "Camisa"}
            updateData={inputsUpdate}
            disabled={isReadOnly}
          />

          <InputD
            text="Color"
            type="text"
            name="color"
            textId="color"
            view=""
            valueData={data.color || ""}
            updateData={inputsUpdate}
            disabled={isReadOnly}
          />

          <InputD
            text="Talla"
            type="text"
            name="talla"
            textId="talla"
            view=""
            valueData={data.talla || ""}
            updateData={inputsUpdate}
            disabled={isReadOnly}
          />

          <SelectWD
            text="Tela"
            name="id_tela"
            textId="id_tela"
            options={SelectTelas}
            valueData={data.id_tela || ""}
            updateData={inputsUpdate}
            disabled={isReadOnly}
          />

          <InputD
            text="Costo ($)"
            type="number"
            step="0.01"
            name="costo"
            textId="costo"
            view=""
            valueData={data.costo ?? ""}
            updateData={inputsUpdate}
            disabled={isReadOnly}
          />

          <SelectD
            text="Estado"
            name="estado_producto"
            textId="estado_producto"
            options={SelectEstadoProducto}
            valueData={data.estado_producto || "Disponible"}
            updateData={inputsUpdate}
            disabled={isReadOnly}
          />

          <div className="md:col-span-3 flex justify-end mt-4">
            {!isReadOnly && (
              <button
                type="submit"
                className="bg-[#B4D333] hover:bg-[#a3c02b] text-[#004B57] font-bold px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <CheckCircleIcon className="size-6" />
                {tipo === "actualizar" ? "Actualizar" : "Guardar"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalProducto;