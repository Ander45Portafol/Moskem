import {
  TrashIcon,
  ArchiveBoxIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/solid";

export function ListaMerceria({
  items = [],
  onEliminar,
  onCambiarCantidad,
  onGuardarTodo,
}) {
  const listaProcesable = Array.isArray(items) ? items : [];

  return (
    <div className="bg-[#004053] pt-2 rounded-lg flex flex-col gap-3 w-full relative pb-12">
      <h4 className="text-[#00A29B] font-bold text-xl tracking-wide">
        Lista de Mercería
      </h4>

      <ul className="flex flex-col gap-3 mt-1 w-full">
        {listaProcesable.map((item, index) => {
          // Soporta tanto objetos { nombre, cantidad } como cadenas de texto fallback
          const esObjeto = typeof item === "object" && item !== null;
          const nombreItem = esObjeto ? item.nombre : item;
          const cantidadItem = esObjeto ? item.cantidad : 1;

          return (
            <li
              key={index}
              className="flex w-full items-center justify-between gap-3"
            >
              {/* Círculo indicador + Nombre del insumo */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="w-3 h-3 border-2 border-[#00A29B] rounded-full shrink-0" />
                <span className="text-[#B2B2B2] text-sm font-medium truncate">
                  {nombreItem}
                </span>
              </div>

              {/* Controles de la derecha: Contador + Botón Eliminar */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Control incremental (- cantidad +) */}
                <div className="flex items-center bg-[#B2B2B2] rounded overflow-hidden h-8 text-[#004053] font-bold">
                  <button
                    type="button"
                    onClick={() =>
                      onCambiarCantidad &&
                      onCambiarCantidad(index, Math.max(1, cantidadItem - 1))
                    }
                    className="px-2 hover:bg-[#9e9e9e] transition-colors h-full flex items-center justify-center text-md"
                  >
                    <MinusIcon className="size-3.5 stroke-[3]" />
                  </button>
                  <span className="px-3 bg-white h-full flex items-center justify-center text-sm font-black min-w-[28px]">
                    {cantidadItem}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onCambiarCantidad &&
                      onCambiarCantidad(index, cantidadItem + 1)
                    }
                    className="px-2 hover:bg-[#9e9e9e] transition-colors h-full flex items-center justify-center text-md"
                  >
                    <PlusIcon className="size-3.5 stroke-[3]" />
                  </button>
                </div>

                {/* Botón de Eliminar */}
                <button
                  type="button"
                  onClick={() => onEliminar && onEliminar(index)}
                  className="p-1.5 bg-[#BCCF00] hover:bg-[#a6b700] text-[#004053] rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center"
                  title="Eliminar insumo"
                >
                  <TrashIcon className="size-5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Botón Flotante de la esquina inferior derecha (Caja/Guardar) */}
      <div className="flex justify-end bottom-0 right-0 mt-5">
        <button
          type="button"
          onClick={onGuardarTodo}
          className="p-2.5 bg-[#BCCF00] hover:bg-[#a6b700] text-[#004053] rounded-xl transition-all duration-200 active:scale-95 shadow-md flex items-center justify-center"
          title="Guardar o archivar lista"
        >
          <ArchiveBoxIcon className="size-6" />
        </button>
      </div>
    </div>
  );
}
