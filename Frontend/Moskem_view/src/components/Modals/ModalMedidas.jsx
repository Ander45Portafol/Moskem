import { useEffect, useState, useMemo, useCallback } from "react";
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

const estado_orden = [
  "Anotado",
  "Revision",
  "En proceso",
  "Finalizado",
  "Entregado",
];

// Aqui cargamos como esta definido el orden para cargar las medidas establecidas para cada prenda
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
// Variable que guarda predefino los valores para el estado de la orden
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
};

export function ModalMedidas({ isOpen, onClose, id_pedido, id_cliente }) {
  // Estados para manejar el comportamiento del modal y los datos reactivos
  const [isAnimating, setIsAnimating] = useState(false);
  const [render, setRender] = useState(isOpen);
  const [prendas, setPrendas] = useState(null);
  const [sastres, setSastres] = useState(null);
  const [selectedPrendaId, setSelectedPrendaId] = useState("");
  const [medidasVisibles, setMedidasVisibles] = useState([]);
  const [medidas, setMedidas] = useState(estadoInicialMedida);
  const [ordenTrabajo, setOrdenTrabajo] = useState(estadoInicialOrden_trabajo);

  // Apartado para funciones y metodos que funcionarán dentro del componente

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const medidasEnviar = Object.fromEntries(medidas).filter(
        ([_, value]) => value !== "",
      );

      const resMedidas = await fetch(`${API}medidas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medidasEnviar),
      });
      if (!resMedidas.ok) {
        throw new Error("Error en medidas");
      }
      const dataMedidas = await resMedidas.json();
      const idMedidaGenerado = dataMedidas.id_medidas;

      const resCodigo = await fetch(
        `${API}create_codigo_medida/${selectedPrendaId}/${idMedidaGenerado}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!resCodigo.ok) {
        if (!resCodigo.ok)
          throw new Error("Error al generar el código de medida");
      }
      const resOrden = await fetch(`${API}orden_trabajo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...ordenTrabajo,
          id_medidas: idMedidaGenerado,
          id_detalle_pedido: selectedPrendaId,
        }),
      });
      if (resOrden.ok) {
        Swal.fire({
          toast: true,
          position: "top-end",
          title: "Orden de trabajo creada con éxito",
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        });
      }
      if (onClose) onClose();
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        title: "No se pudo crear la orden",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
      console.log(error);
    }
  };

  // Variable que almacena las prendas de cada pedido para luego cargar el selectWD (Optimizado con useMemo)
  const selectPrendas = useMemo(() => {
    return (
      prendas?.map((registro) => ({
        id: registro.id_detalle_pedido,
        nombre: registro.prenda,
      })) || []
    );
  }, [prendas]);

  // Variable que almacena el nombre y el id de cada sastre para luego cargar el selectWD (Optimizado con useMemo)
  const selectSastres = useMemo(() => {
    return (
      sastres?.map((registro) => ({
        id: registro.id,
        nombre: registro.nombres + " " + registro.apellidos,
      })) || []
    );
  }, [sastres]);

  // El trabajo de esta funcion es cargar los campos necesarios dependiendo de la prenda que se seleccione
  const handlePrendaChange = (e) => {
    const idSeleccionado = e?.target ? e.target.value : e;

    if (!idSeleccionado) return;

    setSelectedPrendaId(idSeleccionado);

    // Buscamos la prenda seleccionada en el listado
    const prendaSeleccionada = prendas?.find(
      (p) => String(p.id_detalle_pedido) === String(idSeleccionado),
    );
    // Extraemos la cantidad de prendas asociadas
    const cantidad =
      prendaSeleccionada?.numero_pedido ??
      prendaSeleccionada?.cantidad_prenda ??
      prendaSeleccionada?.cantidad ??
      "";

    // Actualizamos directamente el estado de la Orden de Trabajo
    setOrdenTrabajo((prev) => ({
      ...prev,
      id_detalle_pedido: idSeleccionado,
      cantidad_prenda: cantidad,
    }));

    // Carga de campos dinámicos de medidas
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
  };

  // Funcion controladora de los cambios en los inputs para la orden de trabajo
  const inputsUpdateOrden = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setOrdenTrabajo((prev) => ({
      ...prev,
      [name]: val,
    }));
  };
  //Funcion controladora de los cambios en los inputs para las medidas
  const inputsUpdateMedidas = (e) => {
    const { name, value } = e.target;

    setMedidas((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Funcion creada para cargar las prendas del pedido y en base a eso tomar las medidas
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

  // Funcione que extrae los sastres de la API
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

  // Manejador del renderizado del componente
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
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setRender(false), 300);
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
                    updateData={handlePrendaChange}
                  />
                </div>
                <div className="w-3/10 ml-6">
                  <SelectWD
                    text="Sastre"
                    textId="id_empleado"
                    options={selectSastres}
                    updateData={inputsUpdateOrden}
                  />
                </div>
                <div className="w-1/5 ml-6">
                  <InputD
                    text="Cantidad Tela"
                    type="number"
                    textId="cantidad_tela"
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
                    view=""
                    updateData={inputsUpdateOrden}
                  />
                </div>
                <div className="w-3/10 ml-6">
                  <SelectD
                    text="Estado Orden"
                    textId="estado_orden"
                    options={estado_orden}
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

            <div className="flex w-1/5">
              <div className="flex-col">
                <h3 className="text-md font-semibold text-[#004B57]">
                  Imagen Diseño
                </h3>
                <div className="h-7/8 mt-1 w-32 rounded-xl bg-gray-300"></div>
              </div>
              <div className="flex items-end h-full ml-2">
                <div className="flex-col">
                  <button className="w-12 h-10 rounded-lg flex justify-center items-center bg-[#004053] text-[#B2B2B2]">
                    <ArrowsPointingOutIcon className="size-7" />
                  </button>
                  <button className="bg-[#00A29B] text-[#004053] w-12 h-10 flex justify-center items-center rounded-lg mt-1">
                    <ArrowUpOnSquareIcon className="size-7" />
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
                    placeholder=""
                    onChange={inputsUpdateMedidas}
                  />
                  <datalist id="codigo_medida">
                    <option value="Escoja una opcion" />
                  </datalist>
                </div>
              </div>
              <div className="w-1/7 flex items-end">
                <button className="px-3.5 h-12 rounded-lg ml-6 bg-[#004B57] text-[#B2B2B2] flex-wrap hover:text-[#FFF]">
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
                className="h-10 w-42 flex justify-center items-center bg-[#BCCF00] text-[#004053] font-bold rounded-xl gap-2 text-lg hover:bg-[#a3c02b]"
              >
                <CheckBadgeIcon className="size-6" />
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
