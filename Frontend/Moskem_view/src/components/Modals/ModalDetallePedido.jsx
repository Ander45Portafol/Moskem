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

// Apartado para variables y constantes de configuración inicial
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
  // Variables reactivas que guardan información de los procesos
  const [prendas, setPrendas] = useState([]);
  const [pasoActivo, setPasoActivo] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formsData, setFormsData] = useState([]);
  const [guardados, setGuardados] = useState([]);
  const [render, setRender] = useState(isOpen);
  const [tipoPedido, setTipoPedido] = useState(false);

  // Funcion que almacena toda la informacion del formulario para cada detalle pedido (memorizada para evitar recreación)
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
      categoria_pedido: "",
      numero_pedido: "",
    }),
    [id_pedido, id_paquete],
  );
  // Custom Hook utilizado para cargar hacer todo el proceso de CRUD
  const formHook = useForm({
    id: id_detallepedido,
    setForm: detallesData,
    isOpen,
    onClose,
    ruta: RUTA_API,
    estadoInicialDetallePedido,
  });

  // Protección contra retornos undefined del custom hook al cerrar
  const data = formHook?.data || {};
  const setData = formHook?.setData || (() => {});

  // Funcion que mantiene todo el codigo para guardar toda la información de una prenda
  const guardarPrenda = useCallback(
    async (index) => {
      const registro = formsData[index];

      if (!registro?.id_tela || isNaN(Number(registro.id_tela))) {
        Swal.fire({
          icon: "warning",
          title: "Tela requerida",
          text: "Debes seleccionar una tela válida del listado antes de continuar.",
          confirmButtonColor: "#004053",
        });
        return false;
      }

      const payload = {
        id_pedido: registro?.id_pedido || id_pedido,
        id_tela: Number(registro.id_tela),
        id_empleado: registro?.id_empleado || 1,
        id_paquete: registro?.id_paquete || id_paquete,
        cantidad_tela: registro?.cantidad_tela,
        prenda: registro?.prenda,
        tipo_pedido: registro?.tipo_pedido,
        precio_detalle: registro?.precio_detalle || data?.precio_detalle,
        categoria_pedido: registro?.categoria_pedido || data?.categoria_pedido,
        numero_pedido: registro?.numero_pedido,
      };

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
          Swal.fire({
            icon: "error",
            title: "Error al guardar",
            text: "No se pudo guardar el detalle de la prenda. Inténtalo de nuevo.",
            confirmButtonColor: "#004053",
          });
          return false;
        }
      } catch (error) {
        console.error("Error al guardar el detalle:", error);
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "Ocurrió un problema al comunicarse con el servidor.",
          confirmButtonColor: "#004053",
        });
        return false;
      }
    },
    [formsData, id_pedido, id_paquete, data, prendas],
  );

  // Funcion que guarda la informacion de las mercerias aplicadas a cada prenda
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
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "Ocurrió un problema de red.",
          confirmButtonColor: "#004053",
        });
        return false;
      }
    },
    [formsData],
  );

  // Funcion diseñada para eliminar la merceria
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

  // Funcion para cargar los datos de cada detalle de cada pedido (Soporta AbortController)
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

  // Funcion para cargar prendas de cada paquete (Soporta AbortController)
  // Funcion para cargar prendas de cada paquete y detalles individuales/extras
  const cargarPrendasPaquete = useCallback(
    async (paquete_id, targetPedidoId, signal) => {
      try {
        const response = await fetch(`${API}paquetes/${paquete_id}`, {
          signal,
        });

        if (response.ok) {
          const responseData = await response.json();

          setData((prev) => ({
            ...prev,
            categoria_pedido: responseData?.data?.categoria_paquete || "",
            precio_detalle: responseData?.data?.precio_paquete || "",
          }));

          // 1. Obtener prendas base del paquete
          const listaPrendasPaquete = (
            responseData?.data?.detalle_paquete || []
          )
            .filter((item) => item && item.prenda)
            .map((item) => item.prenda);

          // 2. Obtener todos los detalles guardados en la BD para este pedido
          const detallesExistentes = targetPedidoId
            ? await cargarDetallesExistentes(targetPedidoId, signal)
            : [];

          const nuevosGuardados = [];
          const nuevosFormsData = [];
          const nuevasPrendas = [];

          // Track de los IDs de detalles ya vinculados a las prendas del paquete
          const detallesProcesadosIds = new Set();

          // 3. Procesar las prendas provenientes del Paquete
          listaPrendasPaquete.forEach((p) => {
            const nombrePrenda =
              p?.prenda_paquete || (typeof p === "string" ? p : "");

            // Buscar si existe un detalle en BD que coincida con esta prenda del paquete y no haya sido procesado
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
                id_paquete: detalleGuardado.id_paquete,
                cantidad_tela: detalleGuardado.cantidad_tela,
                prenda: detalleGuardado.prenda,
                tipo_pedido: detalleGuardado.tipo_pedido,
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
                prenda: nombrePrenda,
              });
            }
          });

          // 4. Identificar los detalles de la BD que son prendas extras/únicas
          const detallesExtras = detallesExistentes.filter(
            (d) => !detallesProcesadosIds.has(d.id_detalle_pedido),
          );

          // 5. Reconstruir los estados para las prendas extras
          detallesExtras.forEach((detalleExtra) => {
            nuevasPrendas.push({ esExtra: true });
            nuevosGuardados.push(true);
            nuevosFormsData.push({
              id_pedido: detalleExtra.id_pedido,
              id_tela: detalleExtra.id_tela,
              id_empleado: detalleExtra.id_empleado,
              id_paquete: detalleExtra.id_paquete,
              cantidad_tela: detalleExtra.cantidad_tela,
              prenda: detalleExtra.prenda,
              tipo_pedido: detalleExtra.tipo_pedido,
              precio_detalle: detalleExtra.precio_detalle,
              categoria_pedido: detalleExtra.categoria_pedido,
              numero_pedido: detalleExtra.numero_pedido,
              id_detalle_pedido: detalleExtra.id_detalle_pedido,
              categoria_tela: detalleExtra.telas?.categoria_tela || "",
              mercerias: detalleExtra.mercerias || [],
            });
          });

          // 6. Asignar los estados consolidados
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
    [setData, estadoInicialDetallePedido],
  );

  // Funcion para actualizar los datos de cada input
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

  // Funcion para actualizar el form de detalle pedido
  const actualizarDataCompleta = useCallback((index, nuevoData) => {
    setFormsData((prev) => {
      const copy = [...prev];
      copy[index] = nuevoData;
      return copy;
    });
  }, []);

  // Funcion diseñada para cargar las categorias de las telas
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
    const nuevoFormExtra = { ...estadoInicialDetallePedido };

    setPrendas((prev) => [...(prev || []), nuevaPrendaExtra]);
    setFormsData((prev) => [...prev, nuevoFormExtra]);
    setGuardados((prev) => [...prev, false]);

    // Activar la pestaña del nuevo ítem
    setPasoActivo((prev) => (prendas ? prendas.length : 0));
  }, [estadoInicialDetallePedido, prendas]);

  // Hook que renderiza el modal dependiendo de cada cambio
  useEffect(() => {
    const controller = new AbortController();

    if (isOpen && id_paquete) {
      cargarPrendasPaquete(id_paquete, id_pedido, controller.signal);
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
  }, [isOpen, id_paquete, id_pedido, cargarPrendasPaquete]);

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

                // Generamos una key garantizada y única combinando el ID y el índice
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
                          setTipoPedido(false);
                          guardarPrenda(index);
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
                          setTipoPedido(true);
                          guardarPrenda(index);
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

                    <input
                      type="text"
                      className="hidden"
                      name="prenda"
                      value={data?.prenda || ""}
                      readOnly
                    />

                    {index < prendas.length - 1 && (
                      <div className="w-1 mx-8 bg-[#004B57] self-stretch"></div>
                    )}
                  </div>
                );
              })}
            <div
              className="w-58 h-100 ml-5 flex items-center justify-center"
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
