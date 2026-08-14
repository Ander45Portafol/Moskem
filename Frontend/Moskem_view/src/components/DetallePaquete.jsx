import { useState } from "react";
import { useGet } from "../assets/js/useGet";
import { DataList } from "./DataList";
import {
  ChevronDownIcon,
  PlusCircleIcon
} from "@heroicons/react/24/solid";

export function DetallePaquete({ detalle,update_input, data_detalle}) {
      const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    
      const { data: telas } = useGet("telas");
    console.log(data_detalle)
  //Se guardan las telas que se filtran
  const telasFiltradas = (
    categoriaSeleccionada
      ? telas?.filter((tela) => tela.categoria === categoriaSeleccionada) || [] // 👈 ajustar nombre real
      : telas || []
  ).map((tela) => ({
    id: tela.id, // 👈 antes: tela.codigo_tela || tela.id_tela
    nombre: `${tela.codigo} - ${tela.color}`, // 👈 antes: codigo_tela / nombre_tela (usa lo que tenga sentido mostrar)
  }));

  const handleCategoriaCheck = (cat) => {
    const nuevaCategoria = categoriaSeleccionada === cat ? "" : cat;
    setCategoriaSeleccionada(nuevaCategoria);
    // opcional: si también quieres reflejarlo en `data`
    setData({ ...detalle, categoria_tela: nuevaCategoria });
    };
    
  const categoria_tela = telas
    ? [...new Set(telas.map((tela) => tela.categoria))] // 👈 ajustar al nombre real del campo
        : [];
    
    const categorias = ["Elite+", "Elite", "Premium"];
    
  return (
    <div className="flex-col w-4/5">
      <div className="w-full flex justify-between">
        <h3 className="text-2xl font-bold text-[#004053]">{ data_detalle.prenda_paquete}</h3>
        <input type="checkbox" className="w-4" />
      </div>
      <div className="w-full flex justify-center">
        <img src={data_detalle.imagen} alt={ data_detalle.prenda_paquete} className="w-54 h-44 mt-4" />
      </div>
      <div className="flex mt-4">
        <div className="flex-col mr-14">
          <label htmlFor="" className="text-md font-semibold text-[#004B57]">
            Categoría tela
          </label>
          {categorias.map((cat) => (
            <div className="flex" key={cat}>
              <input
                type="checkbox"
                checked={categoriaSeleccionada === cat}
                onChange={() => handleCategoriaCheck(cat)}
              />
              <label className="ml-2">{cat}</label>
            </div>
          ))}
        </div>
        <div className="w-54">
          <DataList
            text="Tela"
            textId="id_tela"
            dataList={telasFiltradas}
            valueData={detalle.id_tela}
            updateData={update_input}
          />
        </div>
        <div className="flex flex-col w-28 ml-6">
          <label
            htmlFor="cantidad"
            className="text-md text-[#004053] font-medium mb-2"
          >
            Cantidad
          </label>
          <input
            id="cantidad"
            type="number"
            className="w-full h-10 bg-[#D9D9D9]  rounded-md px-2 text-[#004053] font-semibold"
          />
        </div>
      </div>
      <div className="flex-col mt-4 bg-[#004053] p-4 rounded-lg">
        <div className="w-full">
          <h3 className="text-[#00A29B] font-bold text-2xl">Mercería</h3>
        </div>
        <div className="flex w-full mt-3">
          <div className="flex flex-col gap-1.5 relative w-4/9">
            <label className="text-md font-semibold text-[#B2B2B2] ">
              Mercería
            </label>
            <div className="relative">
              <select className="w-full bg-[#B2B2B2] border-none rounded-lg p-2 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all appearance-none pr-10">
                <option value="">Seleccione una opción</option>
              </select>
              <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#004B57]">
                <ChevronDownIcon className="size-6" />
              </span>
            </div>
          </div>
          <div className="flex flex-col w-28 ml-6">
            <label
              htmlFor="cantidad"
              className="text-md text-[#b2b2b2] font-medium mb-2"
            >
              Cantidad
            </label>
            <input
              id="cantidad"
              type="number"
              className="w-full h-10 bg-[#B2B2B2]  rounded-md px-2 text-[#004053] font-semibold"
            />
          </div>
          <button className="w-14 mt-8 ml-4 flex justify-center items-center rounded-lg h-10 bg-[#00A29B] text-[#004053]">
            <PlusCircleIcon className="size-7" />
          </button>
        </div>
      </div>
    </div>
  );
}