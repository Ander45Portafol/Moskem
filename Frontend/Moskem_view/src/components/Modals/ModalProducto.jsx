import { useEffect, useState, useRef } from "react";
import { useGet } from "../../assets/js/useGet";
import { SelectWD } from "../SelectWD";
import { TextArea } from "../TextArea";
import {
  ArrowUpOnSquareIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/solid";
import { useForm } from "../../assets/js/Forms/useForm";
import { API } from "../../assets/js/global";
import Swal from "sweetalert2";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export function ModalProducto({
  isOpen,
  onClose,
  id_producto,
  setProducto,
  onProductoGuardado,
  registroEditar,
  tipo = "agregar",
}) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [openLightbox, setOpenLightbox] = useState(false);

  // Estados y referencias para la imagen de producto
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const ruta = "productos";

  const estadoInicial = {
    codigo_producto: "",
    tipo_producto: "Camisa",
    color: "",
    talla: "",
    id_tela: "",
    costo: "",
    estado_producto: "Disponible",
    descripcion_producto: "",
    descripcion: "",
    imagen_producto: "",
  };

  const { data, setData } = useForm({
    id: id_producto,
    setForm: setProducto,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });

  // Precarga de registro al editar o abrir el modal
  useEffect(() => {
    let timer;
    if (isOpen) {
      if (registroEditar && (tipo === "actualizar" || tipo === "ver")) {
        const descText =
          registroEditar.descripcion_producto ||
          registroEditar.descripcion ||
          "";

        const esTipoZapatos = registroEditar.tipo_producto === "Zapatos";

        const nuevosDatos = {
          codigo_producto:
            registroEditar.codigo_producto || registroEditar.codigo || "",
          tipo_producto: registroEditar.tipo_producto || "Camisa",
          color: esTipoZapatos ? registroEditar.color || "" : "",
          talla: registroEditar.talla || "",
          id_tela: esTipoZapatos
            ? ""
            : registroEditar.id_tela ||
              registroEditar.tela?.id_tela ||
              registroEditar.telas?.id_tela ||
              "",
          costo: registroEditar.costo ?? "",
          estado_producto: registroEditar.estado_producto || "Disponible",
          descripcion_producto: descText,
          descripcion: descText,
          imagen_producto: registroEditar.imagen_producto || "",
        };

        setData(nuevosDatos);

        if (registroEditar.imagen_producto) {
          const urlFinal = registroEditar.imagen_producto.startsWith("http")
            ? registroEditar.imagen_producto
            : `${API.replace(/\/api\/?$/, "")}/storage/${registroEditar.imagen_producto}`;
          setPreviewImage(urlFinal);
        } else {
          setPreviewImage(null);
        }
      } else {
        setData(estadoInicial);
        setPreviewImage(null);
      }

      setRender(true);
      timer = setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      timer = setTimeout(() => setRender(false), 300);
    }

    return () => clearTimeout(timer);
  }, [isOpen, id_producto, registroEditar, tipo]);

  // Obtener catálogo de telas
  const { data: telasResponse } = useGet("telas");

  const telasLista = Array.isArray(telasResponse)
    ? telasResponse
    : Array.isArray(telasResponse?.data)
      ? telasResponse.data
      : [];

  const selectTelas = telasLista.map((reg) => {
    const id = reg.id_tela || reg.id;
    const codigo = reg.codigo_tela || reg.codigo || "";
    const descripcion =
      reg.color_tela ||
      reg.categoria_tela ||
      reg.nombre_tela ||
      reg.color ||
      "";

    const label = [codigo, descripcion].filter(Boolean).join(" - ");

    return {
      id: id,
      nombre: label || `Tela #${id}`,
    };
  });

  const selectTiposProducto = [
    { id: "Camisa", nombre: "Camisa" },
    { id: "Pantalon", nombre: "Pantalón" },
    { id: "Saco", nombre: "Saco" },
    { id: "Traje_completo", nombre: "Traje Completo" },
    { id: "Corbata", nombre: "Corbata" },
    { id: "Zapatos", nombre: "Zapatos" },
  ];

  const selectEstados = [
    { id: "Disponible", nombre: "Disponible" },
    { id: "Rentado", nombre: "Rentado" },
    { id: "Vendido", nombre: "Vendido" },
    { id: "Lavanderia", nombre: "Lavandería" },
    { id: "Ajuste", nombre: "Ajuste" },
  ];

  const esZapatos = data.tipo_producto === "Zapatos";

  const inputsUpdate = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    if (name === "tipo_producto") {
      const esSeleccionZapatos = value === "Zapatos";
      setData((prev) => ({
        ...prev,
        tipo_producto: value,
        id_tela: esSeleccionZapatos ? "" : prev.id_tela,
        color: esSeleccionZapatos ? prev.color : "",
      }));
      return;
    }

    // Sincroniza ambos nombres de propiedad para la descripción
    if (name === "descripcion" || name === "descripcion_producto") {
      setData((prev) => ({
        ...prev,
        descripcion: inputValue,
        descripcion_producto: inputValue,
      }));
      return;
    }

    setData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };

  // Manejador de selección de imagen local
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(URL.createObjectURL(file));
      setData((prev) => ({
        ...prev,
        imagen_producto: file,
      }));
    }
    e.target.value = "";
  };

  const guardarDatos = async (e) => {
    e.preventDefault();

    const targetId =
      id_producto || registroEditar?.id_producto || registroEditar?.id;
    const esEdicion = tipo === "actualizar" || Boolean(targetId);

    // Validación condicional de Tela
    if (!esZapatos && !data.id_tela) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor selecciona una tela para este tipo de producto.",
      });
      return;
    }

    try {
      const formData = new FormData();
      const descVal = data.descripcion_producto || data.descripcion || "";

      formData.append("codigo_producto", data.codigo_producto || "");
      formData.append("tipo_producto", data.tipo_producto || "Camisa");
      formData.append("color", esZapatos ? data.color || "" : "");
      formData.append("talla", data.talla || "");

      if (!esZapatos && data.id_tela) {
        formData.append("id_tela", data.id_tela);
      }

      formData.append("costo", parseFloat(data.costo) || 0);
      formData.append("estado_producto", data.estado_producto || "Disponible");
      formData.append("descripcion_producto", descVal);

      if (data.imagen_producto instanceof File) {
        formData.append("imagen_producto", data.imagen_producto);
      }

      if (esEdicion) {
        formData.append("_method", "PUT");
      }

      const url = esEdicion ? `${API}productos/${targetId}` : `${API}productos`;

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title:
            responseData.message ||
            (esEdicion ? "Producto actualizado" : "Producto guardado"),
          showConfirmButton: false,
          timer: 2500,
        });

        if (setProducto) {
          setProducto((prev) => {
            if (!Array.isArray(prev)) return [responseData.data || data];
            if (esEdicion) {
              return prev.map((item) =>
                (item.id_producto || item.id) === targetId
                  ? responseData.data || { ...item, ...data }
                  : item
              );
            }
            return [...prev, responseData.data || data];
          });
        }

        if (onProductoGuardado) {
          onProductoGuardado(responseData.data || targetId);
        }

        onClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        Swal.fire(
          "Error",
          errorData.message || "No se pudo guardar la información del producto",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "Ocurrió un problema al intentar conectar con el servidor.",
        confirmButtonColor: "#004053",
      });
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
        className={`bg-white w-[980px] max-w-[95vw] rounded-[32px] p-10 shadow-2xl relative flex flex-col gap-6 transition-all duration-300 transform ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-8 right-8 text-[#004B57] hover:scale-110 transition-transform"
        >
          <XMarkIcon className="size-7" />
        </button>

        {/* Título */}
        <div>
          <h2 className="text-3xl font-black text-[#004B57] tracking-wide uppercase">
            Formulario – Producto
          </h2>
        </div>

        <form onSubmit={guardarDatos} className="flex flex-col gap-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex w-full gap-8">
            {/* Sección principal de Campos */}
            <div className="flex-1 flex flex-col gap-5">
              {/* Fila 1: Código Producto, Tipo Producto, Color, Talla */}
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-md font-semibold text-[#004B57]">
                    Código
                  </label>
                  <input
                    type="text"
                    name="codigo_producto"
                    id="codigo_producto"
                    value={data.codigo_producto || ""}
                    onChange={inputsUpdate}
                    className="bg-[#D9D9D9]/50 border-none rounded-lg p-2 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all"
                    placeholder="Ej. PROD-001"
                  />
                </div>

                <div>
                  <SelectWD
                    text="Tipo Producto"
                    options={selectTiposProducto}
                    textId="tipo_producto"
                    valueData={data.tipo_producto || "Camisa"}
                    updateData={inputsUpdate}
                  />
                </div>

                <div
                  className={`flex flex-col gap-1.5 ${
                    !esZapatos
                      ? "opacity-40 pointer-events-none transition-opacity"
                      : "transition-opacity"
                  }`}
                >
                  <label className="text-md font-semibold text-[#004B57]">
                    Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    id="color"
                    value={esZapatos ? data.color || "" : ""}
                    onChange={inputsUpdate}
                    disabled={!esZapatos}
                    required={esZapatos}
                    className="bg-[#D9D9D9]/50 border-none rounded-lg p-2 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all disabled:cursor-not-allowed"
                    placeholder={
                      esZapatos ? "Ej. Negro / Café" : "Definido por la tela"
                    }
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-md font-semibold text-[#004B57]">
                    Talla
                  </label>
                  <input
                    type="text"
                    name="talla"
                    id="talla"
                    value={data.talla || ""}
                    onChange={inputsUpdate}
                    required
                    className="bg-[#D9D9D9]/50 border-none rounded-lg p-2 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all"
                    placeholder="Ej. L / 40"
                  />
                </div>
              </div>

              {/* Fila 2: Tela, Costo ($), Estado */}
              <div className="grid grid-cols-3 gap-4">
                <div
                  className={
                    esZapatos
                      ? "opacity-40 pointer-events-none transition-opacity"
                      : "transition-opacity"
                  }
                >
                  <SelectWD
                    text="Tela"
                    options={selectTelas}
                    textId="id_tela"
                    valueData={esZapatos ? "" : data.id_tela || ""}
                    updateData={inputsUpdate}
                    disabled={esZapatos}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-md font-semibold text-[#004B57]">
                    Costo ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="costo"
                    id="costo"
                    value={data.costo ?? ""}
                    onChange={inputsUpdate}
                    required
                    className="bg-[#D9D9D9]/50 border-none rounded-lg p-2 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <SelectWD
                    text="Estado"
                    options={selectEstados}
                    textId="estado_producto"
                    valueData={data.estado_producto || "Disponible"}
                    updateData={inputsUpdate}
                  />
                </div>
              </div>

              {/* Fila 3: Descripción */}
              <div className="w-full">
                <TextArea
                  text="Descripción"
                  textId="descripcion_producto"
                  valueData={data.descripcion_producto || data.descripcion || ""}
                  updateData={inputsUpdate}
                />
              </div>
            </div>

            {/* Contenedor Lateral para Carga e Imagen */}
            <div className="w-56 flex flex-col items-center justify-start gap-2">
              <label className="text-md font-semibold text-[#004B57] w-full text-left">
                Imagen
              </label>

              <div className="w-full flex items-center gap-2 h-56">
                <div className="bg-[#D9D9D9]/60 rounded-2xl h-full w-full overflow-hidden flex justify-center items-center relative border border-gray-200 shadow-inner">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Vista previa producto"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 font-medium text-xs text-center px-2">
                      Sin imagen
                    </span>
                  )}
                </div>

                {/* Botones de acción laterales */}
                <div className="flex flex-col justify-end h-full gap-2 py-1">
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
                    className="h-9 w-9 bg-[#004053] hover:bg-[#002e3c] rounded-lg flex justify-center items-center text-white transition-colors shadow-sm"
                    title="Ampliar imagen"
                  >
                    <ArrowsPointingInIcon className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-9 w-9 bg-[#00A29B] hover:bg-[#008781] rounded-lg flex justify-center items-center text-white transition-colors shadow-sm"
                    title="Subir imagen"
                  >
                    <ArrowUpOnSquareIcon className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="bg-[#B4D333] hover:bg-[#a3c02b] text-[#004B57] font-bold px-7 py-2.5 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <CheckCircleIcon className="size-6" />
              Guardar
            </button>
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