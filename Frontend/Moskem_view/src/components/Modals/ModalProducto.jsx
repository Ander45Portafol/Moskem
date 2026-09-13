import { useEffect, useState } from "react";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useForm } from "../../assets/js/Forms/useForm";
import { InputD } from "../InputD";
import { SelectD } from "../SelectD";
import { SelectWD } from "../SelectWD";
import { API } from "../../assets/js/global";
import Swal from "sweetalert2";
import { useGet } from "../../assets/js/useGet";

export default function ModalProducto({
  isOpen,
  show,
  onClose,
  tipo, // "agregar" o "actualizar" / "ver"
  registroEditar,
  producto,
  id_producto,
  setProductos,
  setProducto,
}) {
  const isModalOpen = isOpen ?? show;
  const targetProducto = registroEditar || producto;
  const targetId = id_producto || targetProducto?.id_producto || targetProducto?.id;
  const updateList = setProductos || setProducto;

  const [render, setRender] = useState(isModalOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  const ruta = "productos";

  const estadoInicial = {
    tipo_producto: "",
    id_tela: "",
    color: "",
    talla: "",
    costo: "",
    estado_producto: "Disponible",
  };

  const { data, setData } = useForm({
    id: targetId,
    setForm: updateList,
    isOpen: isModalOpen,
    onClose,
    ruta,
    estadoInicial,
  });

  // Gestiona animación y precarga de datos al abrir/cerrar
  useEffect(() => {
    let timer;

    if (isModalOpen) {
      setRender(true);
      timer = setTimeout(() => setIsAnimating(true), 30);

      if ((tipo === "actualizar" || tipo === "ver") && targetProducto) {
        setData({
          tipo_producto: targetProducto.tipo_producto || targetProducto.tipoProducto || "",
          id_tela: targetProducto.id_tela || targetProducto.tela?.id_tela || "",
          color: targetProducto.color || "",
          talla: targetProducto.talla || "",
          costo: targetProducto.costo || "",
          estado_producto: targetProducto.estado_producto || targetProducto.estado || "Disponible",
        });
      } else {
        setData(estadoInicial);
      }
    } else {
      setIsAnimating(false);
      timer = setTimeout(() => setRender(false), 300);
    }

    return () => clearTimeout(timer);
  }, [isModalOpen, tipo, targetProducto]);

  // Consulta dinámica de telas para el select
  const { data: telas } = useGet("telas");

  const SelectTelas =
    telas?.map((reg) => ({
      id: reg.id_tela || reg.id,
      nombre: reg.nombre_tela || reg.codigo_tela || reg.nombre,
    })) || [];

  const SelectTipoProducto = ["Camisa ML", "Chaleco", "Pantalón", "Saco", "Corbata"];
  const SelectEstadoProducto = ["Disponible", "No disponible", "Rentado"];

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
      const isEdit = (tipo === "actualizar" || tipo === "ver") && targetId;
      const url = isEdit ? `${API}productos/${targetId}` : `${API}productos`;
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...data,
        id_tela: parseInt(data.id_tela, 10) || null,
        costo: parseFloat(data.costo) || 0,
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

        if (updateList) {
          if (isEdit) {
            updateList((prev) =>
              prev.map((item) =>
                (item.id_producto || item.id) === targetId
                  ? responseData.data || { ...item, ...payload }
                  : item
              )
            );
          } else {
            updateList((prev) => [...prev, responseData.data || payload]);
          }
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
            {tipo === "actualizar" || tipo === "ver" ? "Editar Producto" : "Formulario – Producto"}
          </h2>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-6" onSubmit={onSubmitForm}>
          <SelectD
            text="Tipo Producto"
            name="tipo_producto"
            textId="tipo_producto"
            options={SelectTipoProducto}
            valueData={data.tipo_producto || ""}
            updateData={inputsUpdate}
          />

          <SelectWD
            text="Tela"
            name="id_tela"
            textId="id_tela"
            options={SelectTelas}
            valueData={data.id_tela || ""}
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
            text="Talla"
            type="text"
            name="talla"
            textId="talla"
            view=""
            valueData={data.talla || ""}
            updateData={inputsUpdate}
          />

          <InputD
            text="Costo ($)"
            type="number"
            name="costo"
            textId="costo"
            view=""
            valueData={data.costo ?? ""}
            updateData={inputsUpdate}
          />

          <SelectD
            text="Estado Producto"
            name="estado_producto"
            textId="estado_producto"
            options={SelectEstadoProducto}
            valueData={data.estado_producto || "Disponible"}
            updateData={inputsUpdate}
          />

          <div className="md:col-span-3 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-[#B4D333] hover:bg-[#a3c02b] text-[#004B57] font-bold px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <CheckCircleIcon className="size-6" />
              {tipo === "actualizar" || tipo === "ver" ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}