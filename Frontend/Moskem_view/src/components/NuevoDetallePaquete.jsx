import { useEffect, useMemo, useState } from "react";
import { useGet } from "../assets/js/useGet";
import { DataList } from "./DataList";
import { ChevronDownIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { ListaMerceria } from "./ListaMerceria";
import { API } from "../assets/js/global";
import { SelectD } from "./SelectD";

export function NuevoDetallePaquete({
  detalle,
  update_input,
  data_detalle,
  dataSet,
  submitHandle,
  index,
  guardado,
  onAplicarCategoriaATodas,
  onGuardarMerceria,
  onEliminarMerceria,
}) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [itemsMerceriaLista, setItemsMerceriaLista] = useState([]);

  // Estados locales independientes para evitar la colisión entre tarjetas
  const [selectedMerceria, setSelectedMerceria] = useState("");
  const [cantidadMerceria, setCantidadMerceria] = useState("");

  const { data: catalogoPrendas } = useGet("prendas");
  const { data: telas } = useGet("telas");
  const { data: merceria } = useGet("mercerias");

  const listaPrendas = useMemo(() => {
    if (Array.isArray(catalogoPrendas)) return catalogoPrendas;
    if (Array.isArray(catalogoPrendas?.data)) return catalogoPrendas.data;
    return [];
  }, [catalogoPrendas]);

  // 2. Opciones para el selector de prendas
  const prendasOptions = useMemo(() => {
    if (!listaPrendas.length) return [];
    return listaPrendas.map((p) => p.prenda_paquete).filter(Boolean);
  }, [listaPrendas]);

  // 3. Búsqueda de imagen de la prenda seleccionada
  const imagenPrendaSeleccionada = useMemo(() => {
    const prendaNombreActual = detalle?.prenda || data_detalle?.prenda_paquete;

    if (!prendaNombreActual || !listaPrendas.length) {
      return data_detalle?.imagen || null;
    }

    const prendaEncontrada = listaPrendas.find(
      (p) =>
        p.prenda_paquete?.toLowerCase().trim() ===
        prendaNombreActual.toLowerCase().trim(),
    );

    return prendaEncontrada?.imagen || data_detalle?.imagen || null;
  }, [
    detalle?.prenda,
    data_detalle?.prenda_paquete,
    data_detalle?.imagen,
    listaPrendas,
  ]);

  const SelectMercerias =
    merceria?.map((registro) => ({
      id: registro.id_merceria,
      nombre:
        registro.tipo +
        " - " +
        registro.color +
        " - " +
        registro.tamanio +
        " - " +
        registro.unidad_medida,
    })) || [];

  const cargarListaMerceria = async (idDetallePedido) => {
    try {
      const response = await fetch(`${API}lista_merceria/${idDetallePedido}`);
      const result = await response.json();

      if (!result.data || !Array.isArray(result.data)) {
        return [];
      }

      // Objeto para agrupar insumos repetidos
      const conteo = {};

      result.data.forEach((item) => {
        // Clave única para agrupar por tipo, color y tamaño
        const tipo = item.tipo_merceria || "Insumo";
        const color = item.color || "";
        const tamanio = item.tamanio_merceria || "";

        const clave = `${tipo}-${color}-${tamanio}`;

        // Extraemos la cantidad real que devuelve la API (cantidad_merceria)
        const cantidadReal = Number(item.cantidad_merceria || 0);

        if (!conteo[clave]) {
          conteo[clave] = {
            cantidad: 0,
            nombre: tipo,
            color: color,
            tamanio: tamanio,
          };
        }

        // Sumamos la cantidad de la API
        conteo[clave].cantidad += cantidadReal;
      });

      // Mapeamos el objeto agrupado a la lista de strings para renderizar
      return Object.values(conteo).map((item) => {
        const detalles = [
          item.color,
          item.tamanio ? `${item.tamanio} mm` : null,
        ]
          .filter(Boolean)
          .join(" - ");

        return {
          nombre: detalles ? `${item.nombre} - ${detalles}` : item.nombre,
          cantidad: item.cantidad,
        };
      });
    } catch (error) {
      console.error("Error al cargar la lista de mercería:", error);
      return [];
    }
  };

  useEffect(() => {
    if (detalle?.categoria_tela) {
      setCategoriaSeleccionada(detalle.categoria_tela);
    } else {
      setCategoriaSeleccionada("");
    }

    if (detalle?.id_detalle_pedido) {
      cargarListaMerceria(detalle.id_detalle_pedido).then((data) => {
        setItemsMerceriaLista(data);
      });
    } else {
      setItemsMerceriaLista([]);
    }
  }, [detalle?.categoria_tela, detalle?.id_tela, detalle?.id_detalle_pedido]);

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

    if (index === 0 && onAplicarCategoriaATodas) {
      onAplicarCategoriaATodas(nuevaCategoria);
    } else {
      dataSet({
        ...detalle,
        categoria_tela: nuevaCategoria,
        id_tela: "",
      });
    }
  };

  const handleAgregarMerceria = async (e) => {
    e.preventDefault();

    if (!selectedMerceria || !cantidadMerceria) return;

    if (onGuardarMerceria) {
      const exito = await onGuardarMerceria(selectedMerceria, cantidadMerceria);
      if (exito) {
        setSelectedMerceria("");
        setCantidadMerceria("");

        if (detalle?.id_detalle_pedido) {
          const listaActualizada = await cargarListaMerceria(
            detalle.id_detalle_pedido,
          );
          setItemsMerceriaLista(listaActualizada);
        }
      }
    }
  };

  const categorias = ["Elite +", "Elite", "Premium"];
  const prendas = [
    "Camisa",
    "Chaleco",
    "Saco",
    "Pantalón",
    "Accesorio",
    "Complemento",
    "Faja",
    "Saco tipo pingüino",
    "Guayabera / Camisa de Lino",
    "Tirantes",
  ];
  const bloqueado = false;

  return (
    <div className="flex flex-col w-[520px] shrink-0 relative">
      <div className="w-full flex justify-between">
        <h3 className="text-2xl font-bold text-[#004053]">
          {detalle?.prenda ||
            data_detalle?.prenda_paquete ||
            "Seleccionar Prenda"}
        </h3>
        <input
          type="checkbox"
          checked={Boolean(guardado)}
          readOnly
          className="w-4 rounded cursor-not-allowed"
        />
      </div>

      <div className="w-full flex justify-center">
        {imagenPrendaSeleccionada ? (
          <img
            src={imagenPrendaSeleccionada}
            alt={detalle?.prenda || "Prenda"}
            className="w-54 h-44 object-contain transition-all duration-200"
          />
        ) : (
          <div className="w-54 h-44 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 italic text-sm border-2 border-dashed border-gray-300">
            Sin imagen disponible
          </div>
        )}
      </div>

      <form className="flex-col mt-4" onSubmit={submitHandle}>
        <div className="w-54">
          <SelectD
            text="Prenda"
            textId="prenda"
            options={prendasOptions}
            valueData={detalle?.prenda || ""}
            updateData={update_input}
          />
        </div>
        <div className="flex w-full mt-4">
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

      <form
        onSubmit={handleAgregarMerceria}
        className="flex-col mt-4 bg-[#004053] p-4 rounded-lg"
      >
        <div className="w-full">
          <h3 className="text-[#00A29B] font-bold text-2xl">Mercería</h3>
        </div>
        <div className="flex w-full mt-3">
          <div className="flex flex-col gap-1.5 relative w-4/9">
            <div className="flex flex-col gap-1.5 relative w-50">
              <label className="text-md font-semibold text-[#B2B2B2] ">
                Merceria
              </label>
              <div className="relative">
                <select
                  className="w-full bg-[#B2B2B2] border-none rounded-lg p-2 text-[#004053] font-medium focus:ring-2 focus:ring-[#004053] outline-none transition-all appearance-none pr-10"
                  name="id_merceria"
                  value={selectedMerceria}
                  onChange={(e) => setSelectedMerceria(e.target.value)}
                >
                  <option value="">Seleccione una opción</option>
                  {SelectMercerias.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.nombre}
                    </option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#004B57]">
                  <ChevronDownIcon className="size-6" />
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-28 ml-6">
            <label className="text-md text-[#b2b2b2] font-medium mb-2">
              Cantidad
            </label>
            <input
              type="number"
              name="cantidad_merceria"
              value={cantidadMerceria}
              onChange={(e) => setCantidadMerceria(e.target.value)}
              className="w-full h-10 bg-[#B2B2B2] rounded-md px-2 text-[#004053] font-semibold"
            />
          </div>
          <button
            type="submit"
            className="w-14 mt-8 ml-4 flex justify-center items-center rounded-lg h-10 bg-[#00A29B] text-[#004053]"
          >
            <PlusCircleIcon className="size-7" />
          </button>
        </div>
        <div className="flex">
          <ListaMerceria
            items={itemsMerceriaLista}
            onEliminar={async (indexItem) => {
              if (onEliminarMerceria && detalle?.id_detalle_pedido) {
                const itemTarget = detalle.mercerias?.[indexItem];
                const exito = await onEliminarMerceria(
                  itemTarget?.id_detalle_merceria,
                  indexItem,
                );
                if (exito) {
                  const listaActualizada = await cargarListaMerceria(
                    detalle.id_detalle_pedido,
                  );
                  setItemsMerceriaLista(listaActualizada);
                }
              }
            }}
          />
        </div>
      </form>
    </div>
  );
}
