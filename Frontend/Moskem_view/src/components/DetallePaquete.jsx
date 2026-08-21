import { useEffect, useState } from "react";
import { useGet } from "../assets/js/useGet";
import { DataList } from "./DataList";
import { ChevronDownIcon, PlusCircleIcon } from "@heroicons/react/24/solid";

export function DetallePaquete({
  detalle,
  update_input,
  data_detalle,
  dataSet,
  activo,
  dataForm,
  submitHandle,
  index,
  onAplicarCategoriaATodas
}) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const { data: telas } = useGet("telas");

  useEffect(() => {
    if (detalle?.categoria_tela) {
      setCategoriaSeleccionada(detalle.categoria_tela);
    } else {
      setCategoriaSeleccionada("");
    }
  }, [detalle?.categoria_tela, detalle?.id_tela]);

  // CORRECCIÓN: Validamos tanto 'categoria_tela' como 'categoria' por resiliencia con el backend
  const telasFiltradas = (
    categoriaSeleccionada
      ? telas?.filter((tela) => {
          const catTela = tela.categoria_tela || tela.categoria;
          return catTela?.toLowerCase() === categoriaSeleccionada.toLowerCase();
        }) || []
      : telas || []
  ).map((tela) => ({
    id: tela.id_tela || tela.id,
    nombre: `${tela.codigo || tela.id_tela || tela.id} - ${tela.color || tela.nombre || ""}`,
  }));

  const handleCategoriaCheck = (cat) => {
    const nuevaCategoria = categoriaSeleccionada === cat ? "" : cat;
    setCategoriaSeleccionada(nuevaCategoria);

    // Si es la PRIMERA prenda (índice 0), aplicamos la categoría a TODAS
    if (index === 0 && onAplicarCategoriaATodas) {
      onAplicarCategoriaATodas(nuevaCategoria);
    } else {
      // Si es de la segunda en adelante, solo actualiza su propio registro
      dataSet({
        ...detalle,
        categoria_tela: nuevaCategoria,
        id_tela: "",
      });
    }
  };
  const categorias = ["Elite +", "Elite", "Premium"];
  const bloqueado = false;

  return (
    <div className="flex-col w-4/5 relative">
      <div className="w-full flex justify-between">
        <h3 className="text-2xl font-bold text-[#004053]">
          {data_detalle.prenda_paquete}
        </h3>
        <input type="checkbox" className="w-4" />
      </div>

      <div className="w-full flex justify-center">
        <img
          src={data_detalle.imagen}
          alt={data_detalle.prenda_paquete}
          className="w-54 h-44 mt-4"
        />
      </div>

      <form className="flex-col mt-4" onSubmit={submitHandle}>
        <div className="flex w-full">
          <div className="flex-col mr-6 w-36">
            <label className="text-md font-semibold text-[#004B57]">
              Categoría tela
            </label>
            {categorias.map((cat) => (
              <div className="flex" key={cat}>
                <input
                  type="checkbox"
                  disabled={bloqueado}
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
              nametag="id_tela"
              dataList={telasFiltradas}
              valueData={detalle.id_tela}
              updateData={update_input}
              disabled={bloqueado}
            />
          </div>

          <div className="flex flex-col w-28 ml-6">
            <label className="text-md text-[#004053] font-medium mb-2">
              Cantidad
            </label>
            <input
              name="numero_pedido"
              type="number"
              disabled={bloqueado}
              value={detalle.numero_pedido || ""}
              onChange={update_input}
              className="w-full h-10 bg-[#D9D9D9] rounded-md px-2 text-[#004053] font-semibold"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-[#00A29B] text-white font-bold px-4 py-2 rounded-lg w-full"
        >
          Guardar
        </button>
      </form>

      <div className="flex-col mt-4 bg-[#004053] p-4 rounded-lg">
        <div className="w-full">
          <h3 className="text-[#00A29B] font-bold text-2xl">Mercería</h3>
        </div>
        <div className="flex w-full mt-3">
          <div className="flex flex-col gap-1.5 relative w-4/9">
            <label className="text-md font-semibold text-[#B2B2B2]">
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
            <label className="text-md text-[#b2b2b2] font-medium mb-2">
              Cantidad
            </label>
            <input
              type="number"
              className="w-full h-10 bg-[#B2B2B2] rounded-md px-2 text-[#004053] font-semibold"
            />
          </div>
          <button className="w-14 mt-8 ml-4 flex justify-center items-center rounded-lg h-10 bg-[#00A29B] text-[#004053]">
            <PlusCircleIcon className="size-7" />
          </button>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 bg-[#00A29B] text-white font-bold px-4 py-2 rounded-lg w-full"
      >
        Guardar y continuar
      </button>
    </div>
  );
}
