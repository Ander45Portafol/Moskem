import { useEffect, useRef, useState } from "react";
import {
  CheckCircleIcon,
  XMarkIcon,
  ArrowsPointingInIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/solid";
import { useForm } from "../../assets/js/Forms/useForm";
import { InputD } from "../InputD";
import { SelectD } from "../SelectD";
import Swal from "sweetalert2";
import { SelectWD } from "../SelectWD";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useGet } from "../../assets/js/useGet";
import { API } from "../../assets/js/global";

export function ModalTelas({
  isOpen,
  onClose,
  tipo, // "agregar" o "actualizar"
  id_tela,
  setTela, // setData de la vista Telas.jsx
}) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [localPreviewImage, setLocalPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);
  const ruta = "telas";

  const estadoInicial = {
    categoria_tela: "",
    color_tela: "",
    codigo_tela: "",
    cantidad_stock: "",
    id_proveedor: "",
    tipo_prenda: "",
    imagen_telas: "",
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
  const imagenTela = data?.imagen_telas;
  const previewImage =
    imagenTela instanceof File
      ? localPreviewImage
      : typeof imagenTela === "string" && imagenTela
        ? imagenTela.startsWith("http")
          ? imagenTela
          : `${API.replace(/\/api\/?$/, "")}/storage/${imagenTela}`
        : null;

  // Se usa para extraer los datos de los proveedores que se cargarán en el select
  const { data: proveedores } = useGet("proveedores");

  const SelectProveedores =
    proveedores?.map((registro) => ({
      id: registro.id_proveedor,
      nombre: registro.nombre_proveedor,
    })) || [];

  const SelectCategoria = ["Elite", "Elite +", "Premium"];
  const SelectTipoPrenda = [
    "Camisa",
    "Pantalon / Saco / Chaleco",
    "Accesorios",
  ];

  // Captura el cambio de valor de cada input dinámicamente
  const inputsUpdate = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
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
      setData((prev) => ({ ...prev, imagen_telas: file }));
      e.target.value = "";
    }
  };
  // Función manual para estructurar los datos antes de enviar
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Agregamos todos los campos de texto y números
    formData.append("categoria_tela", data.categoria_tela || "");
    formData.append("tipo_prenda", data.tipo_prenda || "");
    formData.append("color_tela", data.color_tela || "");
    formData.append("codigo_tela", data.codigo_tela || "");
    formData.append("cantidad_stock", data.cantidad_stock || "");
    formData.append("id_proveedor", data.id_proveedor || "");
    formData.append("codigo_tela_proveedor", data.codigo_tela_proveedor || "");

    // Si la imagen es un archivo nuevo (File), la agregamos al FormData
    if (data.imagen_telas instanceof File) {
      formData.append("imagen_telas", data.imagen_telas);
    }

    // Enviamos la petición usando el handleSubmit de tu custom hook
    // y pasándole nuestro formData perfectamente estructurado
    await handleSubmit(e, formData);
  };
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsAnimating(true), 30);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setRender(false);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, [isOpen]);

  if ((!isOpen && !render) || !data) return null;

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

        <form className="flex-col" onSubmit={onSubmit}>
          <div className="flex">
            <div className="grid grid-cols-2 gap-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
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

          <div className="hidden md:block"></div>

          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-[#B4D333] hover:bg-[#a3c02b] text-[#004B57] font-bold px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
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
