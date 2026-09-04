import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useGet } from "../assets/js/useGet";
import { DataList } from "./DataList";
import { ChevronDownIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { ListaMerceria } from "./ListaMerceria";
import { API } from "../assets/js/global";
import Swal from "sweetalert2";

// Apartado para variables y constantes de configuración inicial
const CATEGORIAS_TELA = ["Elite +", "Elite", "Premium"];

export const DetallePaquete = memo(function DetallePaquete({
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
  // Variables reactivas que guardan información del estado local
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [itemsMerceriaLista, setItemsMerceriaLista] = useState([]);
  const [selectedMerceria, setSelectedMerceria] = useState("");
  const [cantidadMerceria, setCantidadMerceria] = useState("");

  // Custom Hooks hechos para extraer datos de la API
  const { data: telas } = useGet("telas");
  const { data: merceria } = useGet("mercerias");

  // Variable que almacena toda la información de las mercerías para el select (memorizada)
  const SelectMercerias = useMemo(() => {
    if (!Array.isArray(merceria)) return [];
    return merceria.map((registro) => ({
      id: registro.id_merceria,
      nombre: `${registro.tipo} - ${registro.color} - ${registro.tamanio} - ${registro.unidad_medida}`,
    }));
  }, [merceria]);

  // Lista de telas filtradas según la categoría seleccionada (memorizada)
  const telasFiltradas = useMemo(() => {
    const listaOriginal = Array.isArray(telas) ? telas : [];
    const filtradas = categoriaSeleccionada
      ? listaOriginal.filter((tela) => {
          const catTela = tela.categoria_tela || tela.categoria;
          return catTela?.toLowerCase() === categoriaSeleccionada.toLowerCase();
        })
      : listaOriginal;

    return filtradas.map((tela) => ({
      id: tela.id_tela || tela.id,
      nombre: `${tela.codigo || tela.id_tela || tela.id} - ${tela.color || tela.nombre || ""}`,
    }));
  }, [telas, categoriaSeleccionada]);

  // Función para extraer toda la información de mercerías aplicadas (Soporta AbortController)
  // Función para extraer la lista de mercerías desde la BD
  const cargarListaMerceria = useCallback(async (idDetallePedido, signal) => {
    try {
      const response = await fetch(`${API}lista_merceria/${idDetallePedido}`, {
        signal,
      });
      const result = await response.json();

      if (!result.data || !Array.isArray(result.data)) {
        return [];
      }

      return result.data.map((item) => {
        const tipo = item.tipo_merceria || item.tipo || "Insumo";
        const color = item.color || "";
        const tamanio = item.tamanio_merceria || item.tamanio || "";
        const detalles = [color, tamanio ? `${tamanio} mm` : null]
          .filter(Boolean)
          .join(" - ");

        const cantidadActual = Number(
          item.cantidad_merceria || item.cantidad || 0,
        );

        return {
          id_detalle_merceria:
            item.id_detalle_merceria || item.id_detalle_mercerias || item.id,
          // 🔍 Mapeo flexible para evitar que id_merceria se vaya como null
          id_merceria:
            item.id_merceria ||
            item.id_mercerias ||
            item.id_mercerias_pk ||
            item.merceria_id,
          id_detalle_pedidos: idDetallePedido,
          nombre: detalles ? `${tipo} - ${detalles}` : tipo,
          cantidad: cantidadActual,
          cantidadOriginal: cantidadActual, // 📌 Referencia para comparar si hubo cambios
        };
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error al cargar la lista de mercería:", error);
      }
      return [];
    }
  }, []);
  // Función para actualizar las cantidades mediante PUT directo a la BD
  const handleGuardarCambiosMerceria = useCallback(async () => {
    const idDetallePedido = detalle?.id_detalle_pedido;

    if (!idDetallePedido) {
      Swal.fire({
        icon: "warning",
        title: "Guarda la prenda primero",
        text: "Debes guardar los datos de la prenda antes de actualizar la mercería.",
        confirmButtonColor: "#004053",
      });
      return;
    }

    // 🚀 Filtrar solo los elementos que sufrieron modificaciones en la cantidad
    const itemsModificados = itemsMerceriaLista.filter(
      (item) => item.cantidad !== item.cantidadOriginal,
    );

    if (itemsModificados.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Sin cambios",
        text: "No has realizado ninguna modificación en las cantidades.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      // Mapeamos únicamente las peticiones PUT de los elementos modificados
      const peticiones = itemsModificados.map((item) => {
        const payload = {
          id_detalle_pedidos: idDetallePedido,
          id_mercerias: Number(item.id_merceria),
          cantidad_merceria: Number(item.cantidad),
        };

        return fetch(`${API}detalle_mercerias/${item.id_detalle_merceria}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      });

      const respuestas = await Promise.all(peticiones);
      const todasExitosas = respuestas.every((res) => res.ok);

      if (todasExitosas) {
        // Recargar lista desde el servidor para renovar las referencias de cantidadOriginal
        const listaActualizada = await cargarListaMerceria(idDetallePedido);
        setItemsMerceriaLista(listaActualizada);

        Swal.fire({
          icon: "success",
          title: "Mercería actualizada",
          text: `Se actualizaron ${itemsModificados.length} registro(s) correctamente.`,
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: "Ocurrió un problema al procesar las peticiones en el servidor.",
          confirmButtonColor: "#004053",
        });
      }
    } catch (error) {
      console.error("Error al actualizar la mercería:", error);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "Ocurrió un problema al conectar con el servidor.",
        confirmButtonColor: "#004053",
      });
    }
  }, [detalle?.id_detalle_pedido, itemsMerceriaLista, cargarListaMerceria]);
  // Función para actualizar localmente la cantidad de un ítem en la lista
  const handleCambiarCantidad = useCallback((indexItem, nuevaCantidad) => {
    setItemsMerceriaLista((prev) => {
      const copy = [...prev];
      if (typeof copy[indexItem] === "object") {
        copy[indexItem] = {
          ...copy[indexItem],
          cantidad: nuevaCantidad,
        };
      }
      return copy;
    });
  }, []);

  // Función para cambiar o aplicar la categoría de tela
  const handleCategoriaCheck = useCallback(
    (cat) => {
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
    },
    [categoriaSeleccionada, index, onAplicarCategoriaATodas, dataSet, detalle],
  );

  // Función para guardar insumos de mercería en la prenda
  const handleAgregarMerceria = useCallback(
    async (e) => {
      e.preventDefault();

      if (!selectedMerceria || !cantidadMerceria) return;

      if (onGuardarMerceria) {
        const exito = await onGuardarMerceria(
          selectedMerceria,
          cantidadMerceria,
        );
        if (exito) {
          setSelectedMerceria("");
          setCantidadMerceria("");

          // 🔄 Recargamos la lista desde la API para traer el ID recién asignado por la BD
          if (detalle?.id_detalle_pedido) {
            const listaActualizada = await cargarListaMerceria(
              detalle.id_detalle_pedido,
            );
            setItemsMerceriaLista(listaActualizada);
          }
        }
      }
    },
    [
      selectedMerceria,
      cantidadMerceria,
      onGuardarMerceria,
      detalle?.id_detalle_pedido,
      cargarListaMerceria,
    ],
  );

  // Función para eliminar un insumo de mercería
  // Función para eliminar un insumo de mercería directamente de la BD usando DELETE
  const handleEliminarMerceria = useCallback(
    async (indexItem) => {
      // 1. Obtenemos el objeto correspondiente a esa posición del array
      const itemTarget = itemsMerceriaLista[indexItem];

      // Log de depuración para verificar en consola
      console.log("Índice presionado:", indexItem);
      console.log("Objeto encontrado:", itemTarget);

      // 2. Extraemos el ID del registro en la BD
      const idDetalleMerceria = itemTarget?.id_detalle_merceria;

      if (!idDetalleMerceria) {
        // Si fue agregado recientemente y no tiene ID de BD, se remueve solo del estado local
        setItemsMerceriaLista((prev) => prev.filter((_, i) => i !== indexItem));
        return;
      }

      try {
        const result = await Swal.fire({
          title: "Confirmar acción",
          text: "¿Estás seguro de que deseas eliminar este registro?",
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#cc4224",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#31b65c",
          confirmButtonText: "Eliminar",
        });

        if (result.isConfirmed) {
          const response = await fetch(
            `${API}detalle_mercerias/${idDetalleMerceria}`,
            {
              method: "DELETE",
            },
          );

          if (response.ok) {
            if (detalle?.id_detalle_pedido) {
              const listaActualizada = await cargarListaMerceria(
                detalle.id_detalle_pedido,
              );
              setItemsMerceriaLista(listaActualizada);
            } else {
              setItemsMerceriaLista((prev) =>
                prev.filter((_, i) => i !== indexItem),
              );
            }

            Swal.fire({
              icon: "success",
              title: "Mercería eliminada",
              timer: 1500,
              showConfirmButton: false,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error al eliminar",
              text: "No se pudo eliminar el registro en la base de datos.",
              confirmButtonColor: "#004053",
            });
          }
        }
      } catch (error) {
        console.error("Error al eliminar mercería:", error);
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "Ocurrió un problema al conectar con el servidor.",
          confirmButtonColor: "#004053",
        });
      }
    },
    [itemsMerceriaLista, detalle?.id_detalle_pedido, cargarListaMerceria],
  );
  // Hook reactivo para sincronizar categorías y cargar insumos
  useEffect(() => {
    const controller = new AbortController();

    setCategoriaSeleccionada(detalle?.categoria_tela || "");

    if (detalle?.id_detalle_pedido) {
      cargarListaMerceria(detalle.id_detalle_pedido, controller.signal).then(
        (data) => {
          setItemsMerceriaLista(data);
        },
      );
    } else {
      setItemsMerceriaLista([]);
    }

    return () => {
      controller.abort();
    };
  }, [
    detalle?.categoria_tela,
    detalle?.id_detalle_pedido,
    cargarListaMerceria,
  ]);

  const nombrePrenda =
    data_detalle?.prenda_paquete || data_detalle?.prenda || "Prenda";
  const imagenPrenda = data_detalle?.imagen;

  return (
    <div className="flex flex-col w-[520px] shrink-0 relative">
      <div className="w-full flex justify-between">
        <h3 className="text-2xl font-bold text-[#004053]">{nombrePrenda}</h3>
        <input
          type="checkbox"
          className="w-4 rounded cursor-not-allowed"
          checked={Boolean(guardado)}
          readOnly
        />
      </div>

      {imagenPrenda && (
        <div className="w-full flex justify-center">
          <img
            src={imagenPrenda}
            alt={nombrePrenda}
            className="w-54 h-44 mt-4 object-contain"
          />
        </div>
      )}

      <form className="flex-col mt-4" onSubmit={submitHandle}>
        <div className="flex w-full">
          <div className="flex-col mr-6 w-36">
            <label className="text-md font-semibold text-[#004B57]">
              Categoría tela
            </label>
            {CATEGORIAS_TELA.map((cat) => (
              <div className="flex items-center" key={cat}>
                <input
                  type="checkbox"
                  checked={categoriaSeleccionada === cat}
                  onChange={() => handleCategoriaCheck(cat)}
                />
                <label className="ml-2 text-sm">{cat}</label>
              </div>
            ))}
          </div>

          <div className="w-54">
            <DataList
              text="Tela"
              textId="id_tela"
              nametag="id_tela"
              dataList={telasFiltradas}
              valueData={detalle.id_tela || ""}
              updateData={update_input}
            />
          </div>

          <div className="flex flex-col w-28 ml-6">
            <label className="text-md text-[#004053] font-medium mb-2">
              Cantidad
            </label>
            <input
              name="numero_pedido"
              type="number"
              value={detalle.numero_pedido || ""}
              onChange={update_input}
              className="w-full h-10 bg-[#D9D9D9] rounded-md px-2 text-[#004053] font-semibold"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-[#00A29B] hover:bg-[#008781] transition-colors text-white font-bold px-4 py-2 rounded-lg w-full"
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
              <label className="text-md font-semibold text-[#B2B2B2]">
                Mercería
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
            className="w-14 mt-8 ml-4 flex justify-center items-center rounded-lg h-10 bg-[#00A29B] hover:bg-[#008781] text-[#004053] transition-colors"
          >
            <PlusCircleIcon className="size-7 text-white" />
          </button>
        </div>
        <div className="flex mt-2">
          <ListaMerceria
            items={itemsMerceriaLista}
            onEliminar={handleEliminarMerceria}
            onCambiarCantidad={handleCambiarCantidad}
            onGuardarTodo={handleGuardarCambiosMerceria}
          />
        </div>
      </form>
    </div>
  );
});
