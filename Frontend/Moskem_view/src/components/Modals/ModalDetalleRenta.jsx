import React, { useCallback, useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ArrowLeftIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import { useGet } from "../../assets/js/useGet";
import { apiFetch } from "../../services/api";
import { DetalleRenta } from "../DetallelRenta";
import { SelectD } from "../SelectD";
import { ModalMedidasRenta } from "./ModalMedidasRenta";

const limitesPaquete = {
  "Saco y Pantalón": 2,
  "Paquete Full": 8,
};
const PRENDAS_INICIALES_FULL = 4;
const LIMITE_FORMAL = 4;

const normalizarTipoProducto = (tipo) =>
  String(tipo || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

export default function ModalDetalleRenta({
  isOpen,
  onClose,
  onBack,
  id_renta,
  setRenta,
}) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [detalleRenta, setDetalleRenta] = useState(null);
  const [tipoPaquete, setTipoPaquete] = useState("");
  const [tipoTraje, setTipoTraje] = useState("");
  const [detallesFullIniciales, setDetallesFullIniciales] = useState([]);
  const [isModalMedidasOpen, setIsModalMedidasOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { data: productos } = useGet("productos");

  const crearDetalleVacio = useCallback(
    () => ({
      id_renta,
      id_producto: "",
      cantidad: 1,
      fecha_renta: "",
      estado_producto_renta: "Solicitado",
      clientKey: `nuevo-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    }),
    [id_renta],
  );

  useEffect(() => {
    let cancelado = false;
    let timerAnimacion;

    if (!isOpen) {
      setIsAnimating(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }

    setRender(true);
    timerAnimacion = setTimeout(() => setIsAnimating(true), 10);
    setDetalleRenta(null);
    setTipoTraje("");
    setDetallesFullIniciales([]);

    const cargarRentaYDetalles = async () => {
      if (!id_renta) {
        setDetalleRenta([]);
        setTipoPaquete("");
        setTipoTraje("");
        setDetallesFullIniciales([]);
        return;
      }

      try {
        const [rentaResponse, detallesResponse] = await Promise.all([
          apiFetch(`rentas/${id_renta}`, { method: "GET" }),
          apiFetch(`renta_detalles/${id_renta}`, { method: "GET" }),
        ]);

        if (cancelado) return;

        const renta = rentaResponse.data ?? rentaResponse;
        const tipo = renta.tipo_paquete || "Prenda";
        const trajeSeleccionado = renta.tipo_traje || "";
        const detalles = Array.isArray(detallesResponse.data)
          ? detallesResponse.data
          : [];
        const limite =
          tipo === "Paquete Full" && trajeSeleccionado === "Traje Formal"
            ? LIMITE_FORMAL
            : limitesPaquete[tipo];
        const detallesOrdenados =
          tipo === "Saco y Pantalón"
            ? [...detalles].sort((a, b) => {
                const orden = (detalle) => {
                  const tipoProducto = normalizarTipoProducto(
                    detalle.producto?.tipo_producto,
                  );
                  if (tipoProducto === "saco") return 0;
                  if (tipoProducto === "pantalon") return 1;
                  return 2;
                };
                return orden(a) - orden(b);
              })
            : tipo === "Paquete Full"
              ? [...detalles].sort((a, b) => {
                  const orden = (detalle) => {
                    const productoTipo = normalizarTipoProducto(
                      detalle.producto?.tipo_producto,
                    );
                    if (productoTipo === "saco") return 0;
                    if (productoTipo === "pantalon") return 1;
                    if (productoTipo === "camisa") return 2;
                    if (
                      normalizarTipoProducto(
                        detalle.producto?.categoria_producto,
                      ) === "accesorios"
                    ) {
                      return 3;
                    }
                    return 4;
                  };
                  return orden(a) - orden(b);
                })
              : detalles;

        setTipoPaquete(tipo);
        setTipoTraje(trajeSeleccionado);
        setDetallesFullIniciales(detallesOrdenados);
        if (tipo === "Prenda") {
          setDetalleRenta(
            detalles.length > 0 ? detalles : [crearDetalleVacio()],
          );
          return;
        }

        if (tipo === "Paquete Full") {
          if (!trajeSeleccionado) {
            setDetalleRenta([]);
            return;
          }

          const cantidadVisible = Math.max(
            PRENDAS_INICIALES_FULL,
            detallesOrdenados.length,
          );
          if (detallesOrdenados.length > limite) {
            Swal.fire({
              title: "La renta supera el límite del tipo de traje",
              text: `Hay ${detallesOrdenados.length} prendas guardadas, pero ${trajeSeleccionado} permite ${limite}.`,
              icon: "warning",
              confirmButtonColor: "#004053",
            });
          }
          setDetalleRenta(
            Array.from(
              { length: cantidadVisible },
              (_, index) => detallesOrdenados[index] || crearDetalleVacio(),
            ),
          );
          return;
        }

        const cantidadVisible = limite || 1;
        if (detallesOrdenados.length > cantidadVisible) {
          Swal.fire({
            title: "La renta supera el límite del paquete",
            text: `Hay ${detallesOrdenados.length} prendas guardadas, pero ${tipo} permite ${cantidadVisible}.`,
            icon: "warning",
            confirmButtonColor: "#004053",
          });
          setDetalleRenta(detallesOrdenados);
          return;
        }

        setDetalleRenta(
          Array.from(
            { length: cantidadVisible },
            (_, index) => detallesOrdenados[index] || crearDetalleVacio(),
          ),
        );
      } catch (error) {
        if (!cancelado) {
          setDetalleRenta([]);
          setTipoTraje("");
          setDetallesFullIniciales([]);
          Swal.fire({
            title: "No se pudo cargar la renta",
            text: error.message || "Intenta nuevamente.",
            icon: "error",
            confirmButtonColor: "#004053",
          });
        }
      }
    };

    cargarRentaYDetalles();

    return () => {
      cancelado = true;
      clearTimeout(timerAnimacion);
    };
  }, [isOpen, id_renta, crearDetalleVacio]);

  const cargarNuevoProducto = useCallback(() => {
    setDetalleRenta((prev) => {
      const actual = prev || [];
      if (
        tipoPaquete === "Paquete Full" &&
        (tipoTraje !== "Traje Smoking" ||
          actual.length >= limitesPaquete["Paquete Full"])
      ) {
        return actual;
      }
      return [...actual, crearDetalleVacio()];
    });
  }, [crearDetalleVacio, tipoPaquete, tipoTraje]);

  const handleTipoTrajeChange = (event) => {
    const nuevoTipoTraje = event.target.value;
    const filasActuales =
      Array.isArray(detalleRenta) && detalleRenta.length > 0
        ? detalleRenta
        : detallesFullIniciales;

    if (
      nuevoTipoTraje === "Traje Formal" &&
      filasActuales.slice(LIMITE_FORMAL).some((detalle) => {
        const idProducto =
          typeof detalle?.id_producto === "object"
            ? detalle.id_producto?.id_producto
            : detalle?.id_producto;
        return Boolean(detalle?.id_detalle_renta || idProducto);
      })
    ) {
      Swal.fire({
        title: "No se puede cambiar a Traje Formal",
        text: "Ya hay prendas guardadas o seleccionadas después de las primeras cuatro.",
        icon: "warning",
        confirmButtonColor: "#004053",
      });
      return;
    }

    setTipoTraje(nuevoTipoTraje);
    if (!nuevoTipoTraje) {
      setDetalleRenta([]);
      return;
    }

    const limite =
      nuevoTipoTraje === "Traje Formal"
        ? LIMITE_FORMAL
        : limitesPaquete["Paquete Full"];
    const cantidadVisible = Math.max(
      PRENDAS_INICIALES_FULL,
      Math.min(filasActuales.length, limite),
    );
    setDetalleRenta(
      Array.from(
        { length: cantidadVisible },
        (_, index) => filasActuales[index] || crearDetalleVacio(),
      ),
    );
  };

  const handleDetalleChange = (e, index) => {
    const { name, value } = e.target;

    setDetalleRenta((prevDetalles) =>
      prevDetalles.map((detalle, detalleIndex) =>
        detalleIndex === index ? { ...detalle, [name]: value } : detalle,
      ),
    );
  };

  const guardarDetalles = async (indices) => {
    const seleccionados = indices
      .map((index) => ({ index, detalle: detalleRenta?.[index] }))
      .filter(({ detalle }) => {
        // Extraemos id_producto sin importar si viene directo o dentro de un objeto
        const idProducto =
          typeof detalle?.id_producto === "object"
            ? detalle?.id_producto?.id_producto
            : detalle?.id_producto;

        return Boolean(idProducto);
      });

    if (!seleccionados.length) {
      await Swal.fire({
        title: "Selecciona un producto",
        text: "Elige al menos una prenda antes de guardar.",
        icon: "warning",
        confirmButtonColor: "#004053",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await apiFetch("renta_detalles", {
        method: "POST",
        body: JSON.stringify({
          id_renta: Number(id_renta),
          ...(tipoPaquete === "Paquete Full" ? { tipo_traje: tipoTraje } : {}),
          detalles: seleccionados.map(({ detalle }) => {
            // 1. Extraer id_detalle_renta asegurando escalar primitivo
            let idDetalleRaw = detalle.id_detalle_renta;
            if (typeof idDetalleRaw === "object" && idDetalleRaw !== null) {
              idDetalleRaw = idDetalleRaw.id_detalle_renta;
            }

            // 2. Extraer id_producto asegurando escalar primitivo
            let idProductoRaw = detalle.id_producto;
            if (typeof idProductoRaw === "object" && idProductoRaw !== null) {
              idProductoRaw = idProductoRaw.id_producto;
            }

            return {
              ...(idDetalleRaw
                ? { id_detalle_renta: Number(idDetalleRaw) }
                : {}),
              id_producto: Number(idProductoRaw),
            };
          }),
        }),
      });

      const guardados = response.data?.saved ?? [];
      setDetalleRenta((prev) => {
        const actualizados = [...prev];
        seleccionados.forEach(({ index }, guardadoIndex) => {
          if (guardados[guardadoIndex]) {
            actualizados[index] = guardados[guardadoIndex];
          }
        });
        return actualizados;
      });

      if (setRenta) {
        try {
          const listaResponse = await apiFetch("rentas", { method: "GET" });
          setRenta(listaResponse.data ?? listaResponse);
        } catch (error) {
          console.error("Error al actualizar la lista de rentas:", error);
        }
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        title: response.message || "Prendas guardadas correctamente",
        icon: "success",
        showConfirmButton: false,
        timer: 2500,
      });
    } catch (error) {
      Swal.fire({
        title: "No se pudieron guardar las prendas",
        text: error.data?.message || error.message || "Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#004053",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!render) return null;

  const productosLista = Array.isArray(productos)
    ? productos
    : productos?.data || [];
  const maximoPaquete =
    tipoPaquete === "Paquete Full" && tipoTraje === "Traje Formal"
      ? LIMITE_FORMAL
      : limitesPaquete[tipoPaquete];
  const productoPrimero = productosLista.find(
    (producto) =>
      String(producto.id_producto) ===
      String(detalleRenta?.[0]?.id_producto || ""),
  );
  const sacoGuardadoPrimero =
    Boolean(detalleRenta?.[0]?.id_detalle_renta) &&
    normalizarTipoProducto(productoPrimero?.tipo_producto) === "saco";

  const obtenerProductoDetalle = (detalle) => {
    if (detalle?.producto) return detalle.producto;
    const idProducto =
      typeof detalle?.id_producto === "object"
        ? detalle.id_producto?.id_producto
        : detalle?.id_producto;
    return productosLista.find(
      (producto) => String(producto.id_producto) === String(idProducto),
    );
  };

  const fullAnteriorGuardado = (index) => {
    if (index === 0) return true;
    const anterior = detalleRenta?.[index - 1];
    if (!anterior?.id_detalle_renta) return false;

    const productoAnterior = obtenerProductoDetalle(anterior);
    const tipoAnterior = normalizarTipoProducto(
      productoAnterior?.tipo_producto,
    );
    const categoriaAnterior = normalizarTipoProducto(
      productoAnterior?.categoria_producto,
    );

    if (index === 1) return tipoAnterior === "saco";
    if (index === 2) return tipoAnterior === "pantalon";
    if (index === 3) return tipoAnterior === "camisa";
    return categoriaAnterior === "accesorios";
  };

  const selectTipoTraje = ["Traje Formal", "Traje Smoking"];

  return (
    <>
    {!isModalMedidasOpen && (
      <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Tarjeta del Modal */}
      <div
        className={`bg-white w-[1000px] max-w-[100vw] h-11/12 rounded-[32px] p-3 px-10 shadow-2xl relative flex flex-col gap-8 transition-all duration-300 transform ${
          isAnimating
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 overflow-y-auto"
        }`}
      >
        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-8 right-8 text-[#004B57] hover:scale-110 transition-transform"
        >
          <XMarkIcon className="size-7" />
        </button>
        <div>
          <h2 className="text-4xl font-black text-[#004B57] tracking-wide uppercase">
            Detalle - Rentas
          </h2>
          {tipoPaquete && (
            <p className="mt-2 font-medium text-[#004B57]/80">
              Tipo de paquete: {tipoPaquete}
              {tipoPaquete === "Paquete Full" && !tipoTraje
                ? " · Selecciona el tipo de traje"
                : tipoPaquete === "Paquete Full" &&
                    tipoTraje === "Traje Smoking"
                  ? ` · ${PRENDAS_INICIALES_FULL} prendas iniciales, máximo ${limitesPaquete["Paquete Full"]}`
                  : maximoPaquete
                    ? ` · Máximo ${maximoPaquete} prendas`
                    : " · Puedes agregar las prendas que necesites"}
            </p>
          )}
          {tipoPaquete === "Paquete Full" && (
            <div className="mt-5">
              <SelectD
                text="Tipo Traje"
                textId="tipo_traje"
                valueData={tipoTraje}
                updateData={handleTipoTrajeChange}
                options={selectTipoTraje}
              />
            </div>
          )}
        </div>
        <div className="flex-1 overflow-x-auto overflow-y-auto pb-4">
          <div className="flex min-h-full w-max items-stretch">
            {tipoPaquete === "Paquete Full" && !tipoTraje && (
              <p className="px-4 py-8 text-center font-medium text-[#004B57]/70">
                Selecciona el tipo de traje para ingresar las prendas.
              </p>
            )}
            {Array.isArray(detalleRenta) &&
              detalleRenta.map((detalle, index) => {
                const esSacoYPantalon = tipoPaquete === "Saco y Pantalón";
                const esPaqueteFull = tipoPaquete === "Paquete Full";
                const tipoProducto = esPaqueteFull
                  ? ["Saco", "Pantalón", "Camisa"][index]
                  : esSacoYPantalon
                    ? ["Saco", "Pantalón"][index] || "Sin productos"
                    : undefined;
                const categoriaProducto =
                  esPaqueteFull && index >= 3 ? "Accesorios" : undefined;
                const segundoPendiente =
                  esSacoYPantalon && index === 1 && !sacoGuardadoPrimero;
                const fullPendiente =
                  esPaqueteFull && index > 0 && !fullAnteriorGuardado(index);
                const ayudaOrdenFull = {
                  1: "Primero selecciona y guarda el Saco.",
                  2: "Primero selecciona y guarda el Pantalón.",
                  3: "Primero selecciona y guarda la Camisa.",
                };

                return (
                  <div
                    key={detalle.id_detalle_renta || detalle.clientKey || index}
                    className="flex min-h-full items-stretch shrink-0"
                  >
                    <DetalleRenta
                      renta={detalle}
                      productos={productosLista}
                      tipoProducto={tipoProducto}
                      categoriaProducto={categoriaProducto}
                      isDisabled={
                        segundoPendiente ||
                        (esSacoYPantalon && index > 1) ||
                        fullPendiente
                      }
                      helperText={
                        segundoPendiente
                          ? "Primero selecciona y guarda el Saco."
                          : fullPendiente
                            ? ayudaOrdenFull[index] ||
                              "Primero selecciona y guarda el accesorio anterior."
                            : ""
                      }
                      updateInputs={(e) => handleDetalleChange(e, index)}
                      onSave={() => guardarDetalles([index])}
                      isSaving={isSaving}
                    />
                    {index < detalleRenta.length - 1 && (
                      <div className="w-1 mx-8 bg-[#004B57] self-stretch"></div>
                    )}
                  </div>
                );
              })}
            {(tipoPaquete === "Prenda" ||
              (tipoPaquete === "Paquete Full" &&
                tipoTraje === "Traje Smoking" &&
                detalleRenta?.length < limitesPaquete["Paquete Full"])) &&
              Array.isArray(detalleRenta) && (
                <div className="w-58 h-100 ml-5 flex items-center justify-center cursor-pointer">
                  <button
                    type="button"
                    onClick={cargarNuevoProducto}
                    className="w-32 h-32 rounded-3xl bg-[#004053] hover:bg-[#013342] hover:text-[#FFF] text-[#B2B2B2] flex items-center justify-center"
                    aria-label="Agregar otra prenda"
                  >
                    <PlusCircleIcon className="size-16" />
                  </button>
                </div>
              )}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onBack}
            className="bg-[#004B57] hover:bg-[#00363E] text-white font-bold px-5 py-2 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <ArrowLeftIcon className="size-6" />
            Regresar
          </button>
          <button
            type="button"
            onClick={() => setIsModalMedidasOpen(true)}
            className="bg-[#009BAE] text-[#004053] font-bold px-5 py-2 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <ClipboardDocumentListIcon className="size-6" />
            Medidas
          </button>
          <button
            type="button"
            onClick={() =>
              guardarDetalles(detalleRenta?.map((_, index) => index) || [])
            }
            disabled={
              isSaving ||
              !Array.isArray(detalleRenta) ||
              (tipoPaquete === "Paquete Full" && !tipoTraje)
            }
            className="bg-[#B4D333] hover:bg-[#a3c02b] text-[#004B57] font-bold px-5 py-2 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircleIcon className="size-6" />
            Guardar
          </button>
        </div>
      </div>
      </div>
    )}
    <ModalMedidasRenta
      isOpen={isModalMedidasOpen}
      onClose={() => setIsModalMedidasOpen(false)}
      id_renta={id_renta}
    />
    </>
  );
}
