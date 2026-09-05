import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "../../assets/js/Forms/useForm";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { API } from "../../assets/js/global";
import { DetallePaquete } from "../DetallePaquete";
import Swal from "sweetalert2";
import { NuevoDetallePaquete } from "../NuevoDetallePaquete";

const RUTA_API = "detalle_pedidos";

export function ModalDetallePedido({
  isOpen,
  onRegresar,
  onClose,
  id_pedido,
  id_paquete,
  id_detallepedido,
  detallesData,
}) {
  const [prendas, setPrendas] = useState([]);
  const [pasoActivo, setPasoActivo] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formsData, setFormsData] = useState([]);
  const [guardados, setGuardados] = useState([]);
  const [render, setRender] = useState(isOpen);
  const [tipoPedido, setTipoPedido] = useState(false);

  const estadoInicialDetallePedido = useMemo(
    () => ({
      id_pedido: id_pedido || "",
      id_tela: "",
      id_empleado: 1,
      id_paquete: id_paquete || "",
      cantidad_tela: "",
      prenda: "",
      tipo_pedido: tipoPedido ? "Prenda unica" : "Paquete",
      precio_detalle: "",
      categoria_pedido: "Adulto",
      numero_pedido: "",
    }),
    [id_pedido, id_paquete, tipoPedido],
  );

  const formHook = useForm({
    id: id_detallepedido,
    setForm: detallesData,
    isOpen,
    onClose,
    ruta: RUTA_API,
    estadoInicialDetallePedido,
  });

  const data = formHook?.data || {};

  // Función que mantiene todo el código para guardar toda la información de una prenda
  const guardarPrenda = useCallback(
    async (index, idPaqueteDirecto) => {
      const registro = formsData[index] || {};

      if (!registro?.id_tela || isNaN(Number(registro.id_tela))) {
        Swal.fire({
          icon: "warning",
          title: "Tela requerida",
          text: "Debes seleccionar una tela válida del listado antes de continuar.",
          confirmButtonColor: "#004053",
        });
        return false;
      }

      // Resolucion estricta de id_paquete
      const idPaqueteCalculado =
        idPaqueteDirecto !== undefined && idPaqueteDirecto !== null
          ? idPaqueteDirecto
          : id_paquete !== undefined && id_paquete !== null
            ? id_paquete
            : registro?.id_paquete;

      const idPaqueteFinal =
        idPaqueteCalculado && !isNaN(Number(idPaqueteCalculado))
          ? Number(idPaqueteCalculado)
          : null;

      const payload = {
        id_pedido: Number(registro?.id_pedido || id_pedido),
        id_tela: Number(registro.id_tela),
        id_empleado: Number(registro?.id_empleado || 1),
        id_paquete: idPaqueteFinal,
        cantidad_tela: registro?.cantidad_tela
          ? Number(registro.cantidad_tela)
          : null,
        prenda: registro?.prenda,
        tipo_pedido: idPaqueteFinal ? "Paquete" : "Prenda unica",
        precio_detalle:
          registro?.precio_detalle ||
          data?.precio_detalle ||
          registro?.precio_unitario ||
          "0.00",
        categoria_pedido:
          registro?.categoria_pedido || data?.categoria_pedido || "Adulto",
        numero_pedido: Number(registro?.numero_pedido || 1),
      };

      console.log("PAYLOAD REAL ENVIADO A LA API:", payload);

      try {
        const esActualizacion = !!registro?.id_detalle_pedido;
        const url = esActualizacion
          ? `${API}${RUTA_API}/${registro.id_detalle_pedido}`
          : `${API}${RUTA_API}`;
        const metodo = esActualizacion ? "PUT" : "POST";

        const response = await fetch(url, {
          method: metodo,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const responseData = await response.json();

          setFormsData((prev) => {
            const copy = [...prev];
            copy[index] = {
              ...copy[index],
              id_detalle_pedido:
                registro?.id_detalle_pedido ||
                responseData?.data?.id_detalle_pedido,
              id_paquete: idPaqueteFinal,
            };
            return copy;
          });

          setGuardados((prev) => {
            const copy = [...prev];
            copy[index] = true;
            return copy;
          });

          if (!esActualizacion && index < (prendas?.length || 0) - 1) {
            setPasoActivo(index + 1);
          }

          Swal.fire({
            icon: "success",
            title: esActualizacion ? "Detalle actualizado" : "Detalle guardado",
            text: `La prenda "${registro.prenda || "seleccionada"}" se guardó correctamente.`,
            timer: 2000,
            showConfirmButton: false,
          });

          return true;
        } else {
          const errorData = await response.json();
          Swal.fire({
            icon: "error",
            title: "Error al guardar",
            text: errorData?.message || "No se pudo guardar el detalle.",
            confirmButtonColor: "#004053",
          });
          return false;
        }
      } catch (error) {
        console.error("Error al guardar el detalle:", error);
        return false;
      }
    },
    [formsData, id_pedido, id_paquete, data, prendas],
  );

  const guardarDetalleMerceria = useCallback(
    async (indexPrenda, idMerceria, cantidad) => {
      const prendaActual = formsData[indexPrenda];
      const idDetallePedido = prendaActual?.id_detalle_pedido;

      if (!idDetallePedido) {
        Swal.fire({
          icon: "warning",
          title: "Guarda la prenda primero",
          text: "Debes guardar los datos de la prenda antes de agregarle insumos de mercería.",
          confirmButtonColor: "#004053",
        });
        return false;
      }

      if (!idMerceria || !cantidad || Number(cantidad) <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Datos incompletos",
          text: "Selecciona una mercería y especifica una cantidad válida.",
          confirmButtonColor: "#004053",
        });
        return false;
      }

      const payload = {
        id_detalle_pedidos: idDetallePedido,
        id_mercerias: Number(idMerceria),
        cantidad_merceria: Number(cantidad),
      };

      try {
        const response = await fetch(`${API}detalle_mercerias`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const responseData = await response.json();
          const nuevoRegistro = responseData?.data || payload;

          setFormsData((prev) => {
            const copy = [...prev];
            const merceriasPrevias = copy[indexPrenda]?.mercerias || [];
            copy[indexPrenda] = {
              ...copy[indexPrenda],
              mercerias: [...merceriasPrevias, nuevoRegistro],
            };
            return copy;
          });

          Swal.fire({
            icon: "success",
            title: "Mercería agregada",
            timer: 1500,
            showConfirmButton: false,
          });

          return true;
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al guardar",
            text: "No se pudo registrar el insumo de mercería.",
            confirmButtonColor: "#004053",
          });
          return false;
        }
      } catch (error) {
        console.error("Error al guardar mercería:", error);
        return false;
      }
    },
    [formsData],
  );

  const cargarDetallesExistentes = async (pedido_id, signal) => {
    try {
      const response = await fetch(`${API}detalles/${pedido_id}`, { signal });
      if (response.ok) {
        const responseData = await response.json();
        return responseData?.data || [];
      }
      return [];
    } catch (error) {
      if (error.name !== "AbortError") console.log(error);
      return [];
    }
  };

  const cargarDetallesSinPaquete = useCallback(
    async (targetPedidoId, signal) => {
      try {
        if (!targetPedidoId) {
          setPrendas([{ esExtra: true }]);
          setFormsData([
            {
              ...estadoInicialDetallePedido,
              categoria_pedido: "Adulto",
              id_paquete: null,
            },
          ]);
          setGuardados([false]);
          setPasoActivo(0);
          return;
        }

        const resData = await cargarDetallesExistentes(targetPedidoId, signal);
        const detallesExistentes = Array.isArray(resData)
          ? resData
          : resData?.data || [];

        if (detallesExistentes.length > 0) {
          const nuevasPrendas = detallesExistentes.map((d) => ({
            esExtra: true,
            prenda: d.prenda || "",
          }));

          const nuevosGuardados = detallesExistentes.map(() => true);

          const nuevosFormsData = detallesExistentes.map((d) => ({
            id_pedido: d.id_pedido,
            id_tela: d.id_tela || "",
            id_empleado: d.id_empleado || 1,
            id_paquete: null,
            cantidad_tela: d.cantidad_tela || "",
            prenda: d.prenda || "",
            tipo_pedido: d.tipo_pedido || "Prenda unica",
            precio_detalle: d.precio_detalle || "0.00",
            categoria_pedido: d.categoria_pedido || "Adulto",
            numero_pedido: d.numero_pedido || 1,
            id_detalle_pedido: d.id_detalle_pedido,
            categoria_tela: d.telas?.categoria_tela || d.categoria_tela || "",
            mercerias: d.mercerias || [],
          }));

          setPrendas(nuevasPrendas);
          setFormsData(nuevosFormsData);
          setGuardados(nuevosGuardados);
          setPasoActivo(0);
        } else {
          setPrendas([{ esExtra: true }]);
          setFormsData([
            {
              ...estadoInicialDetallePedido,
              categoria_pedido: "Adulto",
              id_paquete: null,
            },
          ]);
          setGuardados([false]);
          setPasoActivo(0);
        }
      } catch (e) {
        if (e.name !== "AbortError")
          console.error("Error al cargar detalles:", e);
      }
    },
    [estadoInicialDetallePedido],
  );

  const eliminarDetalleMerceria = useCallback(
    async (indexPrenda, idDetalleMerceria, indexItem) => {
      try {
        if (idDetalleMerceria) {
          await fetch(`${API}detalle_mercerias/${idDetalleMerceria}`, {
            method: "DELETE",
          });
        }

        setFormsData((prev) => {
          const copy = [...prev];
          const merceriasFiltradas = (
            copy[indexPrenda]?.mercerias || []
          ).filter((_, i) => i !== indexItem);
          copy[indexPrenda] = {
            ...copy[indexPrenda],
            mercerias: merceriasFiltradas,
          };
          return copy;
        });

        Swal.fire({
          icon: "success",
          title: "Insumo eliminado",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error al eliminar mercería:", error);
      }
    },
    [],
  );

  // Función corregida para mapear las prendas del paquete de forma limpia
  const cargarPrendasPaquete = useCallback(
    async (paquete_id, targetPedidoId, signal) => {
      try {
        const response = await fetch(`${API}paquetes/${paquete_id}`, {
          signal,
        });

        if (response.ok) {
          const responseData = await response.json();

          const listaPrendasPaquete = (
            responseData?.data?.detalle_paquete || []
          )
            .filter((item) => item && item.prenda)
            .map((item) => item.prenda);

          const detallesExistentes = targetPedidoId
            ? await cargarDetallesExistentes(targetPedidoId, signal)
            : [];

          const nuevosGuardados = [];
          const nuevosFormsData = [];
          const nuevasPrendas = [];

          const detallesProcesadosIds = new Set();

          // 1. Procesar prendas pertenecientes al paquete
          listaPrendasPaquete.forEach((p) => {
            const nombrePrenda =
              p?.prenda_paquete || (typeof p === "string" ? p : "");

            const detalleGuardado = detallesExistentes.find(
              (d) =>
                d.prenda === nombrePrenda &&
                !detallesProcesadosIds.has(d.id_detalle_pedido),
            );

            nuevasPrendas.push(p);

            if (detalleGuardado) {
              detallesProcesadosIds.add(detalleGuardado.id_detalle_pedido);
              nuevosGuardados.push(true);
              nuevosFormsData.push({
                id_pedido: detalleGuardado.id_pedido,
                id_tela: detalleGuardado.id_tela,
                id_empleado: detalleGuardado.id_empleado,
                id_paquete: Number(paquete_id),
                cantidad_tela: detalleGuardado.cantidad_tela,
                prenda: detalleGuardado.prenda,
                tipo_pedido: "Paquete",
                precio_detalle: detalleGuardado.precio_detalle,
                categoria_pedido: detalleGuardado.categoria_pedido,
                numero_pedido: detalleGuardado.numero_pedido,
                id_detalle_pedido: detalleGuardado.id_detalle_pedido,
                categoria_tela: detalleGuardado.telas?.categoria_tela || "",
                mercerias: detalleGuardado.mercerias || [],
              });
            } else {
              nuevosGuardados.push(false);
              nuevosFormsData.push({
                ...estadoInicialDetallePedido,
                id_pedido: targetPedidoId || id_pedido,
                id_paquete: Number(paquete_id),
                prenda: nombrePrenda,
                tipo_pedido: "Paquete",
              });
            }
          });

          // 2. Procesar prendas extras (Corregida la variable del bucle)
          const detallesExtras = detallesExistentes.filter(
            (d) => !detallesProcesadosIds.has(d.id_detalle_pedido),
          );

          detallesExtras.forEach((detalleExtra) => {
            nuevasPrendas.push({ esExtra: true });
            nuevosGuardados.push(true);
            nuevosFormsData.push({
              id_pedido: detalleExtra.id_pedido,
              id_tela: detalleExtra.id_tela || "",
              id_empleado: detalleExtra.id_empleado || 1,
              id_paquete: Number(paquete_id), // O null si es extra pura
              cantidad_tela: detalleExtra.cantidad_tela || "",
              prenda: detalleExtra.prenda,
              tipo_pedido: detalleExtra.tipo_pedido || "Prenda unica",
              precio_detalle: detalleExtra.precio_detalle || "0.00",
              categoria_pedido: detalleExtra.categoria_pedido || "Adulto",
              numero_pedido: detalleExtra.numero_pedido || 1,
              id_detalle_pedido: detalleExtra.id_detalle_pedido,
              categoria_tela: detalleExtra.telas?.categoria_tela || "",
              mercerias: detalleExtra.mercerias || [],
            });
          });

          setPrendas(nuevasPrendas);
          setFormsData(nuevosFormsData);
          setGuardados(nuevosGuardados);

          const indexPendiente = nuevosGuardados.findIndex((g) => !g);
          setPasoActivo(
            indexPendiente === -1 ? nuevosGuardados.length - 1 : indexPendiente,
          );
        }
      } catch (e) {
        if (e.name !== "AbortError") console.log(e);
      }
    },
    [estadoInicialDetallePedido, id_pedido],
  );

  const actualizarDato = useCallback((index, e) => {
    const { name, type, checked, value } = e.target;
    setFormsData((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [name]: type === "checkbox" ? checked : value,
      };
      return copy;
    });
  }, []);

  const actualizarDataCompleta = useCallback(
    (index, nuevoData) => {
      setFormsData((prev) => {
        const copy = [...prev];
        const paqueteExistente = copy[index]?.id_paquete || id_paquete;

        copy[index] = {
          ...nuevoData,
          id_paquete: paqueteExistente ? Number(paqueteExistente) : null,
        };
        return copy;
      });
    },
    [id_paquete],
  );

  const aplicarCategoriaATodas = useCallback((nuevaCategoria) => {
    setFormsData((prev) =>
      prev.map((item) => ({
        ...item,
        categoria_tela: nuevaCategoria,
        id_tela: item.categoria_tela !== nuevaCategoria ? "" : item.id_tela,
      })),
    );
  }, []);

  const cargarNuevaPrenda = useCallback(() => {
    const nuevaPrendaExtra = { esExtra: true };
    const nuevoFormExtra = {
      ...estadoInicialDetallePedido,
      id_paquete: null,
      tipo_pedido: "Prenda unica",
    };

    setPrendas((prev) => [...(prev || []), nuevaPrendaExtra]);
    setFormsData((prev) => [...prev, nuevoFormExtra]);
    setGuardados((prev) => [...prev, false]);
    setPasoActivo((prev) => (prendas ? prendas.length : 0));
  }, [estadoInicialDetallePedido, prendas]);

  useEffect(() => {
    const controller = new AbortController();

    if (isOpen) {
      if (id_paquete) {
        cargarPrendasPaquete(id_paquete, id_pedido, controller.signal);
      } else {
        cargarDetallesSinPaquete(id_pedido, controller.signal);
      }

      setRender(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => {
        clearTimeout(timer);
        controller.abort();
      };
    }
  }, [
    isOpen,
    id_paquete,
    id_pedido,
    cargarPrendasPaquete,
    cargarDetallesSinPaquete,
  ]);

  if (!render) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white w-[1200px] h-[650px] max-w-[100vw] rounded-[32px] p-10 shadow-2xl relative flex flex-col gap-6 transition-all duration-300 transform ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-8 right-8 text-[#004053] hover:scale-110 transition-transform"
        >
          <XMarkIcon className="size-7" />
        </button>

        <div className="flex-col">
          <h2 className="text-3xl font-black text-[#004053] tracking-wide uppercase">
            Detalle - Pedido
          </h2>
          <p className="text-[#004B57] text-lg">
            Completar la siguiente información del formulario
          </p>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-auto pb-4">
          <div className="flex min-h-full w-max items-stretch">
            {Array.isArray(prendas) &&
              prendas.map((prenda, index) => {
                if (!prenda) return null;

                const esPrendaExtra = !!prenda.esExtra;
                const keyContenedor = formsData[index]?.id_detalle_pedido
                  ? `detalle-${formsData[index].id_detalle_pedido}-${index}`
                  : `contenedor-${index}`;

                return (
                  <div
                    key={keyContenedor}
                    className="flex min-h-full items-stretch shrink-0"
                  >
                    {esPrendaExtra ? (
                      <NuevoDetallePaquete
                        key={`nuevo-${keyContenedor}`}
                        index={index}
                        onAplicarCategoriaATodas={aplicarCategoriaATodas}
                        detalle={formsData[index] || estadoInicialDetallePedido}
                        guardado={guardados[index]}
                        update_input={(e) => actualizarDato(index, e)}
                        data_detalle={prenda}
                        dataSet={(nuevoData) =>
                          actualizarDataCompleta(index, nuevoData)
                        }
                        activo={index === pasoActivo}
                        dataForm={data}
                        submitHandle={(e) => {
                          e.preventDefault();
                          setTipoPedido(true);
                          guardarPrenda(index, null);
                        }}
                        onGuardarMerceria={(idMerceria, cantidad) =>
                          guardarDetalleMerceria(index, idMerceria, cantidad)
                        }
                        onEliminarMerceria={(idDetalleMerceria, indexItem) =>
                          eliminarDetalleMerceria(
                            index,
                            idDetalleMerceria,
                            indexItem,
                          )
                        }
                      />
                    ) : (
                      <DetallePaquete
                        key={`paquete-${keyContenedor}`}
                        index={index}
                        onAplicarCategoriaATodas={aplicarCategoriaATodas}
                        detalle={formsData[index] || estadoInicialDetallePedido}
                        guardado={guardados[index]}
                        update_input={(e) => actualizarDato(index, e)}
                        data_detalle={prenda}
                        dataSet={(nuevoData) =>
                          actualizarDataCompleta(index, nuevoData)
                        }
                        activo={index === pasoActivo}
                        dataForm={data}
                        submitHandle={(e) => {
                          e.preventDefault();
                          setTipoPedido(false);
                          // 🎯 Pasar id_paquete explícitamente
                          guardarPrenda(index, id_paquete);
                        }}
                        onGuardarMerceria={(idMerceria, cantidad) =>
                          guardarDetalleMerceria(index, idMerceria, cantidad)
                        }
                        onEliminarMerceria={(idDetalleMerceria, indexItem) =>
                          eliminarDetalleMerceria(
                            index,
                            idDetalleMerceria,
                            indexItem,
                          )
                        }
                      />
                    )}

                    {index < prendas.length - 1 && (
                      <div className="w-1 mx-8 bg-[#004B57] self-stretch"></div>
                    )}
                  </div>
                );
              })}
            <div
              className="w-58 h-100 ml-5 flex items-center justify-center cursor-pointer"
              onClick={cargarNuevaPrenda}
            >
              <button className="w-32 h-32 rounded-3xl bg-[#004053] hover:bg-[#013342] hover:text-[#FFF] text-[#B2B2B2] flex items-center justify-center">
                <PlusCircleIcon className="size-16" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-between">
          <button
            className="bg-[#004B57] text-[#B2B2B2] w-32 h-10 flex justify-center items-center rounded-xl gap-2 text-normal font-bold"
            onClick={onRegresar}
          >
            <ArrowLeftCircleIcon className="size-5" />
            Regresar
          </button>
          <button
            className="w-32 h-10 rounded-xl flex justify-center items-center gap-2 text-normal font-bold bg-[#BCCF00] text-[#004B57]"
            onClick={onClose}
          >
            <ArrowRightCircleIcon className="size-5" />
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
}
