import { useEffect, useState, useMemo, useRef } from "react";
import {
  ArrowsPointingOutIcon,
  ArrowUpOnSquareIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { SelectWD } from "../SelectWD";
import { API } from "../../assets/js/global";
import { InputD } from "../InputD";
import { SelectD } from "../SelectD";
import Swal from "sweetalert2";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";


const estado_orden = [
  "Anotado",
  "Revision",
  "En proceso",
  "Finalizado",
  "Entregado",
];

const CAMPOS_POR_PRENDA = {
  camisa: [
    { text: "Largo", textId: "largo" },
    { text: "Pecho", textId: "pecho" },
    { text: "Cintura", textId: "cintura" },
    { text: "Cadera", textId: "cadera" },
    { text: "Talle", textId: "talle" },
    { text: "Sisa", textId: "sisa" },
    { text: "Entrepecho", textId: "entrepecho" },
    { text: "Largo Manga", textId: "largo_manga" },
    { text: "Ancho Manga", textId: "ancho_manga" },
    { text: "Puño", textId: "punio" },
    { text: "Cuello", textId: "cuello" },
  ],
  "guayabera / camisa de lino": [
    { text: "Largo", textId: "largo" },
    { text: "Pecho", textId: "pecho" },
    { text: "Cintura", textId: "cintura" },
    { text: "Cadera", textId: "cadera" },
    { text: "Talle", textId: "talle" },
    { text: "Sisa", textId: "sisa" },
    { text: "Entrepecho", textId: "entrepecho" },
    { text: "Largo Manga", textId: "largo_manga" },
    { text: "Ancho Manga", textId: "ancho_manga" },
    { text: "Puño", textId: "punio" },
    { text: "Cuello", textId: "cuello" },
  ],
  pantalón: [
    { text: "Largo Pant.", textId: "largo_pant" },
    { text: "Cintura", textId: "cintura" },
    { text: "Cadera", textId: "cadera" },
    { text: "Rodilla", textId: "rodilla" },
    { text: "Campana", textId: "campana" },
    { text: "Tiro", textId: "tiro" },
    { text: "Muslo", textId: "muslo" },
  ],
  saco: [
    { text: "Largo", textId: "largo" },
    { text: "Pecho", textId: "pecho" },
    { text: "Cintura", textId: "cintura" },
    { text: "Cadera", textId: "cadera" },
    { text: "Talle", textId: "talle" },
    { text: "Sisa", textId: "sisa" },
    { text: "Hombro", textId: "hombro" },
    { text: "Entrepecho", textId: "entrepecho" },
    { text: "Largo Manga", textId: "largo_manga" },
    { text: "Ancho Manga", textId: "ancho_manga" },
    { text: "Puño", textId: "punio" },
    { text: "Escote", textId: "escote" },
  ],
  "saco tipo pingüino": [
    { text: "Largo", textId: "largo" },
    { text: "Pecho", textId: "pecho" },
    { text: "Cintura", textId: "cintura" },
    { text: "Cadera", textId: "cadera" },
    { text: "Talle", textId: "talle" },
    { text: "Sisa", textId: "sisa" },
    { text: "Hombro", textId: "hombro" },
    { text: "Entrepecho", textId: "entrepecho" },
    { text: "Largo Manga", textId: "largo_manga" },
    { text: "Ancho Manga", textId: "ancho_manga" },
    { text: "Puño", textId: "punio" },
    { text: "Escote", textId: "escote" },
  ],
  chaleco: [
    { text: "Largo", textId: "largo" },
    { text: "Pecho", textId: "pecho" },
    { text: "Cintura", textId: "cintura" },
    { text: "Cadera", textId: "cadera" },
    { text: "Talle", textId: "talle" },
    { text: "Sisa", textId: "sisa" },
    { text: "Escote", textId: "escote" },
  ],
};

const estadoInicialMedida = {
  id_medidas: "",
  codigo_medida: "",
  largo: "",
  pecho: "",
  cintura: "",
  cadera: "",
  talle: "",
  sisa: "",
  hombro: "",
  entrepecho: "",
  largo_manga: "",
  ancho_manga: "",
  punio: "",
  escote: "",
  cuello: "",
  largo_pant: "",
  campana: "",
  rodilla: "",
  tiro: "",
};

const estadoInicialOrden_trabajo = {
  id_orden: "",
  id_detalle_pedido: "",
  id_empleado: "",
  id_medidas: "",
  visibilidad_ordentrabajo: "",
  fecha_asignacion: "",
  estado_orden: "",
  tiempo_sastre: "",
  imagen_diseño: "",
  cantidad_tela: "",
};

export function ModalMedidas({ isOpen, onClose, id_pedido, id_cliente }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [render, setRender] = useState(isOpen);
  const [prendas, setPrendas] = useState(null);
  const [sastres, setSastres] = useState(null);
  const [ordenesExistentes, setOrdenesExistentes] = useState([]);
  const [selectedPrendaId, setSelectedPrendaId] = useState("");
  const [medidasVisibles, setMedidasVisibles] = useState([]);
  const [medidas, setMedidas] = useState(estadoInicialMedida);
  const [ordenTrabajo, setOrdenTrabajo] = useState(estadoInicialOrden_trabajo);

  // Referencias y estados para el manejo de la imagen
  const [openLightbox, setOpenLightbox] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const historialMedidasRef = useRef([]);

  // Resetear formulario
  const resetFormularios = (idSeleccionado, cantidad) => {
    setOrdenTrabajo({
      ...estadoInicialOrden_trabajo,
      id_detalle_pedido: idSeleccionado,
      cantidad_prenda: cantidad,
    });
    setMedidas(estadoInicialMedida);
    setPreviewImage(null);
  };

  // Carga de imagen desde el explorador de archivos local
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
        return;
      }
      setPreviewImage(URL.createObjectURL(file));
      setOrdenTrabajo((prev) => ({
        ...prev,
        imagen_diseño: file,
      }));
    }
  };

  // Guardar / Actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPrendaId) {
      Swal.fire({
        toast: true,
        position: "top-end",
        title: "Por favor selecciona una prenda",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    const esEdicionMedida = Boolean(medidas.id_medidas);
    const esEdicionOrden = Boolean(ordenTrabajo.id_orden);
    const fechaActual = new Date().toISOString().split("T")[0];

    try {
      // 1. Filtrar campos vacíos de medidas
      const medidasEnviar = Object.fromEntries(
        Object.entries(medidas).filter(
          ([_, value]) => value !== "" && value !== null,
        ),
      );

      // PASO 1: Guardar (POST) o Actualizar (PUT) Medida
      const urlMedidas = esEdicionMedida
        ? `${API}medidas/${medidas.id_medidas}`
        : `${API}medidas`;

      const resMedidas = await fetch(urlMedidas, {
        method: esEdicionMedida ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(medidasEnviar),
      });

      const dataMedidas = await resMedidas.json();

      if (!resMedidas.ok) {
        throw new Error(dataMedidas.message || "Error al procesar la medida");
      }

      const idMedidaGenerado = esEdicionMedida
        ? medidas.id_medidas
        : dataMedidas.id_medidas || dataMedidas.data?.id_medidas;

      if (!idMedidaGenerado) {
        throw new Error("No se pudo obtener el ID de la medida.");
      }

      // PASO 2: Asociar / Actualizar código de medida
      const resCodigo = await fetch(
        `${API}create_codigo_medida/${id_pedido}/${idMedidaGenerado}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      if (!resCodigo.ok) {
        throw new Error("Error al asociar el código de medida");
      }

      // PASO 3: Actualizar el Detalle del Pedido enviando los campos obligatorios
      if (
        ordenTrabajo.cantidad_tela !== undefined &&
        ordenTrabajo.cantidad_tela !== "" &&
        ordenTrabajo.cantidad_tela !== null
      ) {
        const prendaActual = prendas?.find(
          (p) => String(p.id_detalle_pedido) === String(selectedPrendaId),
        );

        const valorTelaNum = parseFloat(ordenTrabajo.cantidad_tela);

        const payloadDetalle = {
          id_pedido: prendaActual?.id_pedido,
          id_tela: prendaActual?.id_tela,
          id_empleado: prendaActual?.id_empleado,
          tipo_pedido: prendaActual?.tipo_pedido,
          id_paquete: prendaActual?.id_paquete ?? null,
          cantidad_tela: isNaN(valorTelaNum) ? 0 : valorTelaNum,
          numero_pedido:
            prendaActual?.numero_pedido ?? prendaActual?.cantidad ?? 1,
          categoria_pedido: prendaActual?.categoria_pedido,
          precio_detalle: prendaActual?.precio_detalle ?? prendaActual?.precio,
          prenda: prendaActual?.prenda,
        };

        const resDetalle = await fetch(
          `${API}detalle_pedidos/${selectedPrendaId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payloadDetalle),
          },
        );

        const dataDetalle = await resDetalle.json();

        if (!resDetalle.ok) {
          const msgError = dataDetalle.errors
            ? Object.values(dataDetalle.errors).flat().join(", ")
            : dataDetalle.message || "Error al actualizar la cantidad de tela";
          throw new Error(msgError);
        }

        setPrendas((prevPrendas) =>
          prevPrendas.map((p) =>
            String(p.id_detalle_pedido) === String(selectedPrendaId)
              ? { ...p, cantidad_tela: ordenTrabajo.cantidad_tela }
              : p,
          ),
        );
      }

      // PASO 4: Guardar (POST) o Actualizar (PUT) Orden de Trabajo usando FormData
      const formData = new FormData();

      const { cantidad_prenda, cantidad_tela, ...datosOrdenLimpios } =
        ordenTrabajo;

      const rawPayload = {
        ...datosOrdenLimpios,
        id_empleado: ordenTrabajo.id_empleado
          ? parseInt(ordenTrabajo.id_empleado, 10)
          : null,
        id_medidas: parseInt(idMedidaGenerado, 10),
        id_detalle_pedido: parseInt(selectedPrendaId, 10),
        fecha_asignacion: ordenTrabajo.fecha_asignacion || fechaActual,
      };

      // Empaquetar formulario en FormData
      Object.keys(rawPayload).forEach((key) => {
        if (key === "imagen_diseño") {
          if (rawPayload[key] instanceof File) {
            formData.append("imagen_diseño", rawPayload[key]);
          }
        } else if (
          rawPayload[key] !== null &&
          rawPayload[key] !== undefined &&
          rawPayload[key] !== ""
        ) {
          formData.append(key, rawPayload[key]);
        }
      });

      // Simular PUT para Laravel en actualizaciones con FormData
      if (esEdicionOrden) {
        formData.append("_method", "PUT");
      }

      const urlOrden = esEdicionOrden
        ? `${API}orden_trabajo/${ordenTrabajo.id_orden}`
        : `${API}orden_trabajo`;

      const resOrden = await fetch(urlOrden, {
        method: "POST", // Las peticiones con archivos viajan como POST
        body: formData,
      });

      const dataOrden = await resOrden.json();

      if (!resOrden.ok) {
        const msgError = dataOrden.errors
          ? Object.values(dataOrden.errors).flat().join(", ")
          : dataOrden.message || "Error al procesar la orden de trabajo";
        throw new Error(msgError);
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        title:
          esEdicionOrden || esEdicionMedida
            ? "Registro actualizado con éxito"
            : "Registro creado con éxito",
        icon: "success",
        showConfirmButton: false,
        timer: 3000,
      });

      if (onClose) onClose();
    } catch (error) {
      console.error("Error en el proceso de guardado:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        title: error.message || "No se pudo completar el proceso",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const selectPrendas = useMemo(() => {
    return (
      prendas?.map((registro) => ({
        id: registro.id_detalle_pedido,
        nombre: registro.prenda,
      })) || []
    );
  }, [prendas]);

  const selectSastres = useMemo(() => {
    return (
      sastres?.map((registro) => ({
        id: registro.id || registro.id_empleado,
        nombre: `${registro.nombres || registro.nombre || ""} ${
          registro.apellidos || registro.apellido || ""
        }`.trim(),
      })) || []
    );
  }, [sastres]);

  // Manejador de cambio de prenda
  const handlePrendaChange = async (e) => {
    const idSeleccionado = e?.target ? e.target.value : e;
    if (!idSeleccionado) return;

    setSelectedPrendaId(idSeleccionado);

    const prendaSeleccionada = prendas?.find(
      (p) => String(p.id_detalle_pedido) === String(idSeleccionado),
    );

    const cantidad =
      prendaSeleccionada?.numero_pedido ??
      prendaSeleccionada?.cantidad_prenda ??
      prendaSeleccionada?.cantidad ??
      "";

    const cantidadTelaIndividual = prendaSeleccionada?.cantidad_tela ?? "";
    const nombrePrenda = prendaSeleccionada?.prenda || "";

    // 1. Cargar campos visibles de medidas según el tipo de prenda
    if (prendaSeleccionada) {
      const tipo = (
        prendaSeleccionada.tipo_prenda ||
        prendaSeleccionada.prenda ||
        ""
      )
        .toLowerCase()
        .trim();

      setMedidasVisibles(CAMPOS_POR_PRENDA[tipo] || []);
    } else {
      setMedidasVisibles([]);
    }

    // 2. CONSULTAR MEDIDAS PREVIAS DEL CLIENTE Y PRENDA PARA EL DATALIST
    if (id_cliente && nombrePrenda) {
      try {
        const resHistorial = await fetch(
          `${API}medidas_prendas/${id_cliente}/${encodeURIComponent(
            nombrePrenda,
          )}`,
        );

        if (resHistorial.ok) {
          const responseData = await resHistorial.json();
          historialMedidasRef.current = responseData?.data || [];
        } else {
          historialMedidasRef.current = [];
        }
      } catch (err) {
        console.error("Error al obtener el historial de medidas:", err);
        historialMedidasRef.current = [];
      }
    } else {
      historialMedidasRef.current = [];
    }

    // 3. CONSULTAR LA MEDIDA Y ORDEN ASOCIADAS AL DETALLE SELECCIONADO
    try {
      const res = await fetch(`${API}getMedidas/${idSeleccionado}`);

      if (res.ok) {
        const responseData = await res.json();
        const ordenEncontrada = responseData?.data?.[0];

        if (ordenEncontrada) {
          // Cargar los campos de la orden de trabajo
          setOrdenTrabajo({
            id_orden: ordenEncontrada.id_orden || "",
            id_detalle_pedido:
              ordenEncontrada.id_detalle_pedido || idSeleccionado,
            id_empleado: ordenEncontrada.id_empleado || "",
            id_medidas: ordenEncontrada.id_medidas || "",
            visibilidad_ordentrabajo:
              ordenEncontrada.visibilidad_ordentrabajo ?? "",
            fecha_asignacion: ordenEncontrada.fecha_asignacion || "",
            estado_orden: ordenEncontrada.estado_orden || "",
            tiempo_sastre: ordenEncontrada.tiempo_sastre || "",
            imagen_diseño: ordenEncontrada.imagen_diseño || "",
            cantidad_prenda: cantidad,
            cantidad_tela:
              ordenEncontrada.cantidad_tela ?? cantidadTelaIndividual,
          });

          // Previsualizar la imagen si existe una ruta guardada
          if (ordenEncontrada.imagen_diseño) {
            const urlImagen = ordenEncontrada.imagen_diseño.startsWith("http")
              ? ordenEncontrada.imagen_diseño
              : `${API.replace(/\/api\/?$/, "")}/storage/${ordenEncontrada.imagen_diseño}`;
            setPreviewImage(urlImagen);
          } else {
            setPreviewImage(null);
          }

          // Cargar los campos numéricos de las medidas
          if (ordenEncontrada.medida) {
            const medidaLimpia = Object.fromEntries(
              Object.entries(ordenEncontrada.medida).map(([key, value]) => [
                key,
                value === null ? "" : value,
              ]),
            );

            setMedidas({
              ...estadoInicialMedida,
              ...medidaLimpia,
            });
          } else {
            setMedidas(estadoInicialMedida);
          }
        } else {
          resetFormularios(idSeleccionado, cantidad);
          setOrdenTrabajo((prev) => ({
            ...prev,
            cantidad_tela: cantidadTelaIndividual,
          }));
        }
      } else {
        resetFormularios(idSeleccionado, cantidad);
        setOrdenTrabajo((prev) => ({
          ...prev,
          cantidad_tela: cantidadTelaIndividual,
        }));
      }
    } catch (error) {
      console.error("Error al obtener las medidas del detalle:", error);
      resetFormularios(idSeleccionado, cantidad);
      setOrdenTrabajo((prev) => ({
        ...prev,
        cantidad_tela: cantidadTelaIndividual,
      }));
    }
  };

  const inputsUpdateOrden = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setOrdenTrabajo((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const inputsUpdateMedidas = (e) => {
    const name = e?.target ? e.target.name : "codigo_medida";
    const value = e?.target ? e.target.value : e;

    if (name === "codigo_medida") {
      const coincidencia = historialMedidasRef.current.find(
        (item) =>
          item.codigo_medida === value || item.medida?.codigo_medida === value,
      );

      if (coincidencia) {
        const datosMedida = coincidencia.medida || coincidencia;

        const medidaLimpia = Object.fromEntries(
          Object.entries(datosMedida).map(([key, val]) => [key, val ?? ""]),
        );

        setMedidas({
          ...estadoInicialMedida,
          ...medidaLimpia,
          codigo_medida: value,
        });

        if (coincidencia.id_orden) {
          setOrdenTrabajo((prev) => ({
            ...prev,
            id_orden: coincidencia.id_orden,
            id_medidas: datosMedida.id_medidas || prev.id_medidas,
          }));
        }

        return;
      }
    }

    setMedidas((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getPrendas = async (pedido, signal) => {
    try {
      const response = await fetch(`${API}detalles/${pedido}`, { signal });
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

  const getSastres = async (signal) => {
    try {
      const response = await fetch(`${API}sastres`, { signal });
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

  const getOrdersByPedido = async (pedido, signal) => {
    try {
      const response = await fetch(`${API}getOrders/${pedido}`, { signal });
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

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    if (isOpen && id_pedido) {
      setRender(true);

      getPrendas(id_pedido, controller.signal).then((data) => {
        if (isMounted) setPrendas(data);
      });

      getSastres(controller.signal).then((data) => {
        if (isMounted) setSastres(data);
      });

      getOrdersByPedido(id_pedido, controller.signal).then((data) => {
        if (isMounted) setOrdenesExistentes(data);
      });

      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setRender(false);
        setOrdenesExistentes([]);
        setOrdenTrabajo(estadoInicialOrden_trabajo);
        setMedidas(estadoInicialMedida);
        setSelectedPrendaId("");
        setPreviewImage(null);
        historialMedidasRef.current = [];
      }, 300);
      return () => {
        clearTimeout(timer);
        controller.abort();
        isMounted = false;
      };
    }
  }, [isOpen, id_pedido]);

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

        {/* Input file OCULTO para seleccionar imagen de la PC */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />

        <div className="flex-col">
          <h2 className="text-3xl font-black text-[#004053] tracking-wide uppercase">
            Orden Trabajo
          </h2>
          <p className="text-[#004B57] text-lg">
            Completar la siguiente información del formulario
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-col overflow-y-auto overflow-x-hidden pb-4"
        >
          <div className="flex w-full">
            <div className="flex-col w-5/6">
              <div className="flex w-full">
                <div className="w-3/10">
                  <SelectWD
                    text="Prenda"
                    textId="id_detalle_pedido"
                    options={selectPrendas}
                    valueData={ordenTrabajo.id_detalle_pedido}
                    updateData={handlePrendaChange}
                  />
                </div>
                <div className="w-3/10 ml-6">
                  <SelectWD
                    text="Sastre"
                    textId="id_empleado"
                    options={selectSastres}
                    valueData={ordenTrabajo.id_empleado}
                    updateData={inputsUpdateOrden}
                  />
                </div>
                <div className="w-1/5 ml-6">
                  <InputD
                    text="Cantidad Tela"
                    type="number"
                    textId="cantidad_tela"
                    valueData={ordenTrabajo.cantidad_tela ?? ""}
                    view=""
                    updateData={inputsUpdateOrden}
                  />
                </div>
              </div>

              <div className="flex mt-4">
                <div className="w-1/5">
                  <InputD
                    text="Tiempo"
                    type="time"
                    textId="tiempo_sastre"
                    valueData={ordenTrabajo.tiempo_sastre}
                    view=""
                    updateData={inputsUpdateOrden}
                  />
                </div>
                <div className="w-3/10 ml-6">
                  <SelectD
                    text="Estado Orden"
                    textId="estado_orden"
                    options={estado_orden}
                    valueData={ordenTrabajo.estado_orden}
                    updateData={inputsUpdateOrden}
                  />
                </div>
                <div className="w-1/5 ml-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-md font-semibold text-[#004B57]">
                      Cantidad Prenda
                    </label>
                    <input
                      type="number"
                      className="bg-[#D9D9D9]/50 border-none rounded-lg p-2 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all"
                      id="cantidad_prenda"
                      name="cantidad_prenda"
                      value={ordenTrabajo.cantidad_prenda || ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bloque de Previsualización y Control de Imagen */}
            <div className="flex w-1/5">
              <div className="flex-col">
                <h3 className="text-md font-semibold text-[#004B57]">
                  Imagen Diseño
                </h3>
                <div className="h-32 w-32 rounded-xl bg-gray-200 overflow-hidden flex justify-center items-center relative border border-gray-300 mt-1">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Diseño"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs font-medium">
                      Sin imagen
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-end h-full ml-2 pb-1">
                <div className="flex-col gap-1">
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
                    className="w-10 h-10 rounded-lg flex justify-center items-center bg-[#004053] hover:bg-[#002e3c] text-white transition-colors"
                    title="Quitar imagen"
                  >
                    <ArrowsPointingOutIcon className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="bg-[#00A29B] hover:bg-[#008781] text-[#004053] w-10 h-10 flex justify-center items-center rounded-lg mt-1 transition-colors"
                    title="Seleccionar imagen"
                  >
                    <ArrowUpOnSquareIcon className="size-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-1 bg-[#B2B2B2] mt-6"></div>

          <div className="flex-col w-full mt-3">
            <h2 className="text-3xl font-black text-[#004053] tracking-wide uppercase">
              Medidas
            </h2>
            <div className="flex">
              <div className="flex-col w-1/4 mt-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-md font-semibold text-[#004B57]">
                    Codigo Medida
                  </label>
                  <input
                    type="text"
                    className="bg-[#D9D9D9]/50 border-none rounded-lg p-2 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all"
                    id="codigo_medida"
                    name="codigo_medida"
                    list="list_codigo_medida"
                    value={medidas.codigo_medida || ""}
                    onChange={inputsUpdateMedidas}
                  />
                  <datalist id="list_codigo_medida">
                    {historialMedidasRef.current.map((item, index) => {
                      const codigo =
                        item.codigo_medida || item.medida?.codigo_medida;
                      return codigo ? (
                        <option key={index} value={codigo} />
                      ) : null;
                    })}
                  </datalist>
                </div>
              </div>
              <div className="w-1/7 flex items-end">
                <button
                  type="button"
                  className="px-3.5 h-12 rounded-lg ml-6 bg-[#004B57] text-[#B2B2B2] flex-wrap hover:text-[#FFF]"
                >
                  Nueva Medida
                </button>
              </div>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-4">
              {medidasVisibles.length > 0 ? (
                medidasVisibles.map((campo) => (
                  <div key={campo.textId}>
                    <InputD
                      text={campo.text}
                      type="text"
                      textId={campo.textId}
                      valueData={medidas[campo.textId] ?? ""}
                      view=""
                      updateData={inputsUpdateMedidas}
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-400 col-span-4 py-4 italic">
                  Selecciona una prenda para cargar sus campos de medida...
                </p>
              )}
            </div>

            <div className="w-full flex justify-end mt-5">
              <button
                type="submit"
                className="h-10 w-42 flex justify-center items-center bg-[#BCCF00] text-[#004053] font-bold rounded-xl gap-2 text-lg hover:bg-[#a3c02b] transition-colors"
              >
                <CheckBadgeIcon className="size-6" />
                Guardar
              </button>
            </div>
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
