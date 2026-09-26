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
}) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [openLightbox, setOpenLightbox] = useState(false);

  // Estados y referencias para la imagen de producto
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const ruta = "productos";

  const estadoInicial = {
    id_tipo_producto: "",
    color: "",
    talla: "",
    id_tela: "",
    costo: "",
    estado: "Disponible",
    descripcion: "",
    imagen: "",
  };

  const { data, setData, handleSubmit } = useForm({
    id: id_producto,
    setForm: setProducto,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });

  // Peticiones para los selects (tipos de producto y telas)
  const { data: tiposProducto } = useGet("tipos-productos");
  const { data: telas } = useGet("telas");

  const selectTiposProducto =
    tiposProducto?.map((reg) => ({
      id: reg.id_tipo_producto || reg.id,
      nombre: reg.nombre_tipo || reg.nombre || reg.tipo,
    })) || [];

  const selectTelas =
    telas?.map((reg) => ({
      id: reg.id_tela || reg.id,
      nombre: reg.nombre_tela || reg.nombre,
    })) || [];

  const selectEstados = [
    { id: "Disponible", nombre: "Disponible" },
    { id: "Agotado", nombre: "Agotado" },
    { id: "Inactivo", nombre: "Inactivo" },
  ];

  const inputsUpdate = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setData({
      ...data,
      [name]: inputValue,
    });
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
        imagen: file,
      }));
    }
    e.target.value = "";
  };

  useEffect(() => {
    let timer;
    if (isOpen) {
      if (data?.imagen) {
        if (data.imagen instanceof File) {
          setPreviewImage(URL.createObjectURL(data.imagen));
        } else if (typeof data.imagen === "string") {
          const urlFinal = data.imagen.startsWith("http")
            ? data.imagen
            : `${API.replace(/\/api\/?$/, "")}/storage/${data.imagen}`;
          setPreviewImage(urlFinal);
        }
      } else {
        setPreviewImage(null);
      }

      setRender(true);
      timer = setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      timer = setTimeout(() => setRender(false), 300);
    }

    return () => clearTimeout(timer);
  }, [isOpen, id_producto, data?.imagen]);

  const guardarDatos = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "imagen") {
          if (data[key] instanceof File) {
            formData.append("imagen", data[key]);
          }
        } else if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      if (id_producto) {
        formData.append("_method", "PUT");
      }

      const productoGuardado = await handleSubmit(e, formData);

      if (productoGuardado || id_producto) {
        const idActual = productoGuardado?.id_producto || id_producto;

        Swal.fire({
          icon: "success",
          title: id_producto ? "Producto actualizado" : "Producto guardado",
          text: id_producto
            ? "Los datos del producto se actualizaron correctamente."
            : "El producto se ha registrado con éxito.",
          timer: 2000,
          showConfirmButton: false,
        });

        if (onProductoGuardado) {
          onProductoGuardado(idActual);
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "Ocurrió un problema al intentar guardar el producto.",
        confirmButtonColor: "#004053",
      });
      return false;
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
        className={`bg-white w-[950px] max-w-[95vw] rounded-[32px] p-10 shadow-2xl relative flex flex-col gap-6 transition-all duration-300 transform ${
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
              {/* Fila 1: Tipo Producto, Color, Talla */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <SelectWD
                    text="Tipo Producto"
                    options={selectTiposProducto}
                    textId="id_tipo_producto"
                    valueData={data.id_tipo_producto}
                    updateData={inputsUpdate}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-md font-semibold text-[#004B57]">
                    Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    id="color"
                    value={data.color || ""}
                    onChange={inputsUpdate}
                    required
                    className="bg-[#D9D9D9]/50 border-none rounded-lg p-2 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all"
                    placeholder="Ej. Azul marino"
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
                <div>
                  <SelectWD
                    text="Tela"
                    options={selectTelas}
                    textId="id_tela"
                    valueData={data.id_tela}
                    updateData={inputsUpdate}
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
                    value={data.costo || ""}
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
                    textId="estado"
                    valueData={data.estado || "Disponible"}
                    updateData={inputsUpdate}
                  />
                </div>
              </div>

              {/* Fila 3: Descripción */}
              <div className="w-full">
                <TextArea
                  text="Descripción"
                  textId="descripcion"
                  valueData={data.descripcion || ""}
                  updateData={inputsUpdate}
                />
              </div>
            </div>

            {/* Contenedor Lateral para Carga e Imagen */}
            <div className="w-65 flex flex-col items-center justify-start gap-2">
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