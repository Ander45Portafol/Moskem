import { useEffect, useRef, useState } from "react";
import {
  CheckCircleIcon,
  XMarkIcon,
  ArrowsPointingInIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/solid";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useForm } from "../../assets/js/Forms/useForm";
import { InputD } from "../InputD";
import { SelectD } from "../SelectD";
import { SelectWD } from "../SelectWD";
import { useGet } from "../../assets/js/useGet";
import { TextArea } from "../TextArea";
import { API } from "../../assets/js/global";

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
  const [localPreviewImage, setLocalPreviewImage] = useState(null);
  const [openLightbox, setOpenLightbox] = useState(false);
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);
  const ruta = "mercerias";

  const estadoInicial = {
    tipo_merceria: "Botones",
    tamanio_merceria: "",
    unidad_medida: "mm",
    color: "",
    codigo_merceria: "",
    codigo_merceria_proveedor: "",
    stock: "",
    descripcion_merceria: "",
    fecha_ingreso_merceria: "",
    imagen_merceria: "",
    id_proveedor: "",
  };

  const targetId = id_merceria || registroEditar?.id_merceria;

  const { data, setData, handleSubmit } = useForm({
    id: targetId,
    setForm: setMerceria,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });
  const imagenMerceria = data?.imagen_merceria;
  const previewImage =
    imagenMerceria instanceof File
      ? localPreviewImage
      : typeof imagenMerceria === "string" && imagenMerceria
        ? imagenMerceria.startsWith("http")
          ? imagenMerceria
          : `${API.replace(/\/api\/?$/, "")}/storage/${imagenMerceria}`
        : null;
  // EFECTO ÚNICO: Gestiona animación, desmontaje y precarga de datos al abrir/cerrar
  useEffect(() => {
    let timer;

    if (isOpen) {
      setRender(true);
      timer = setTimeout(() => setIsAnimating(true), 30);

      // Precarga de datos
      if (tipo === "actualizar" && registroEditar) {
        setData({
          tipo_merceria:
            registroEditar.tipo_merceria || registroEditar.tipo || "Botones",
          tamanio_merceria:
            registroEditar.tamanio_merceria ?? registroEditar.tamanio ?? "",
          unidad_medida: registroEditar.unidad_medida || "mm",
          color: registroEditar.color || "",
          codigo_merceria:
            registroEditar.codigo_merceria || registroEditar.codigo || "",
          codigo_merceria_proveedor:
            registroEditar.codigo_merceria_proveedor || "",
          stock: registroEditar.stock ?? "",
          descripcion_merceria: registroEditar.descripcion_merceria || "",
          id_proveedor:
            registroEditar.id_proveedor ||
            registroEditar.proveedor?.id_proveedor ||
            "",
        });
      } else if (tipo === "agregar") {
        setData(estadoInicial);
      }
    } else {
      setIsAnimating(false);
      timer = setTimeout(() => {
        setRender(false);
        // Limpiamos la URL temporal de la imagen de la memoria
        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
          previewUrlRef.current = null;
        }
        setLocalPreviewImage(null);
      }, 300);
    }

    return () => {
      clearTimeout(timer);
      // Cleanup de seguridad por si el componente se desmonta de golpe
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, [isOpen, tipo, registroEditar]);

  const { data: proveedores } = useGet("proveedores");

  const SelectProveedores =
    proveedores?.map((reg) => ({
      id: reg.id_proveedor || reg.id,
      nombre: reg.nombre_proveedor || reg.nombre,
    })) || [];

  const SelectTipoMerceria = [
    "Botones",
    "Ganchos",
    "Zipper",
    "Agujas",
    "Hilos",
  ];
  const SelectUnidadesMedida = ["Pulgadas", "mm", "#"];

  const inputsUpdate = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        Swal.fire({
          icon: "warning",
          title: "Imagen demasiado pesada",
          text: "El archivo no debe superar los 8MB.",
          confirmButtonColor: "#004053",
        });
        e.target.value = "";
        return;
      }

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      const localUrl = URL.createObjectURL(file);
      previewUrlRef.current = localUrl;
      setLocalPreviewImage(localUrl);
      setData((prev) => ({ ...prev, imagen_merceria: file }));
      e.target.value = "";
    }
  };
  // Handler que formatea los datos numéricos y reutiliza handleSubmit de useForm
  const onSubmitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Agregamos todos los campos de texto y números
    formData.append("tipo_merceria", data.tipo_merceria || "");
    formData.append("tamanio_merceria", data.tamanio_merceria || "");
    formData.append("codigo_merceria", data.codigo_merceria || "");
    formData.append("stock", data.stock || "");
    formData.append("color", data.color || "");
    formData.append(
      "fecha_ingreso_merceria",
      data.fecha_ingreso_merceria || "",
    );
    formData.append("unidad_medida", data.unidad_medida || "");
    formData.append("id_proveedor", data.id_proveedor || "");
    formData.append(
      "codigo_merceria_proveedor",
      data.codigo_merceria_proveedor || "",
    );
    formData.append("descripcion_merceria", data.descripcion_merceria || "");

    // Si la imagen es un archivo nuevo (File), la agregamos al FormData
    if (data.imagen_merceria instanceof File) {
      formData.append("imagen_merceria", data.imagen_merceria);
    }

    await handleSubmit(e, formData);
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
        className={`bg-white rounded-[32px] shadow-2xl w-full max-w-5xl p-8 relative flex flex-col gap-6 border border-gray-100 transform transition-all duration-300 ${
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
            {tipo === "actualizar"
              ? "Editar Mercería"
              : "Formulario – Mercería"}
          </h2>
        </div>

        <form className="flex-col" onSubmit={onSubmitForm}>
          <div className="flex">
            <div className="flex-col">
              <div className="grid grid-cols-3 gap-x-2 gap-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
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

                <InputD
                  text="Fecha ingreso"
                  type="date"
                  name="fecha_ingreso_merceria"
                  textId="fecha_ingreso_merceria"
                  view=""
                  valueData={data.fecha_ingreso_merceria || ""}
                  updateData={inputsUpdate}
                />
              </div>
              <div className="mt-2">
                <TextArea
                  text="Descripcion"
                  type="text"
                  name="descripcion_merceria"
                  textId="descripcion_merceria"
                  view=""
                  valueData={data.descripcion_merceria || ""}
                  updateData={inputsUpdate}
                />
              </div>
            </div>

            <div className="h-64 w-64 flex text-center rounded-2xl ml-2">
              <div className="h-full w-10/12 flex flex-col items-center">
                <label className="text-md font-semibold text-[#004B57] mb-1">
                  Imagen Referencia
                </label>
                <div className="bg-[#D9D9D9] rounded-2xl h-full w-full overflow-hidden flex justify-center items-center relative border border-gray-200">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Referencia"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 font-medium text-sm">
                      Sin imagen
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-col content-end mb-3 items-start">
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
                  className="h-10 w-10 bg-[#004053] hover:bg-[#002e3c] rounded-lg flex justify-center items-center text-white m-2 transition-colors"
                >
                  <ArrowsPointingInIcon className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="h-10 w-10 bg-[#00A29B] hover:bg-[#008781] rounded-lg m-2 flex justify-center items-center text-[#004053] transition-colors"
                >
                  <ArrowUpOnSquareIcon className="size-6" />
                </button>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-[#B4D333] hover:bg-[#a3c02b] text-[#004B57] font-bold px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <CheckCircleIcon className="size-6" />
              {tipo === "actualizar" ? "Actualizar" : "Guardar"}
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
