import React, { useState, useEffect } from "react"; // 1. Se importaron useState y useEffect
import { SelectWD } from "./SelectWD";
import { useGet } from "../assets/js/useGet";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { DataList } from "./DataList";

export function DetalleRenta({ renta, updateInputs }) {
  const [previewImage, setPreviewImage] = useState(null);
  const { data: productos } = useGet("productos");

  const SelectProductos =
    productos?.map((registro) => ({
      id: registro.id_producto,
      nombre: `${registro?.tipo_producto} - ${registro.telas?.codigo_tela ?? "Sin tela"}`,
    })) || [];

  // 2. Corregido: se usa renta.id_producto en lugar de data.id_producto
  const productoSeleccionado = productos?.find(
    (p) => String(p.id_producto) === String(renta?.id_producto),
  );

  // 3. Corregido: sincronización correcta de la vista previa de imagen
  useEffect(() => {
    if (productoSeleccionado) {
      const img =
        productoSeleccionado.imagen_producto ||
        null;
      setPreviewImage(img);
    } else {
      setPreviewImage(null);
    }
  }, [productoSeleccionado]);

  return (
    <div className="grid grid-cols-1 w-[320px]">
      <DataList
        text="Producto"
        dataList={SelectProductos}
        textId={renta.id_detalle_renta}
        nametag="id_producto"
        valueData={renta?.id_producto}
        updateData={updateInputs}
      />
      <div className="grid grid-cols-2 gap-2 my-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-md font-semibold text-[#004B57]">Talla:</label>
          <div className="flex justify-center h-10 items-center gap-1.5 bg-[#004053] text-[#B2B2B2] font-bold rounded-2xl">
            {productoSeleccionado?.talla || "-"}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-md font-semibold text-[#004B57]">Color:</label>
          <div className="flex justify-center h-10 items-center gap-1.5 bg-[#004053] text-[#B2B2B2] font-bold rounded-2xl">
            {productoSeleccionado?.color || "-"}
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center w-full my-2">
        <div className="h-52 w-full bg-gray-200 rounded-2xl flex justify-center items-center overflow-hidden">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Referencia del producto"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 font-medium text-sm">
              Sin imagen
            </span>
          )}
        </div>
      </div>

      <button className="mt-2 flex justify-center items-center rounded-lg h-10 bg-[#00A29B] hover:bg-[#008781] text-[#004053] transition-colors font-bold">
        Guardar
      </button>
    </div>
  );
}
