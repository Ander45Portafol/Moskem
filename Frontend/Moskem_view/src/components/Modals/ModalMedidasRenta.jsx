import { useEffect, useMemo, useState } from "react";
import { CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { InputD } from "../InputD";
import { SelectWD } from "../SelectWD";
import Swal from "sweetalert2";
import { apiFetch } from "../../services/api";

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
  pantalon: [
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

const normalizarTipoPrenda = (tipo) =>
  String(tipo || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const clasificarTipoPrenda = (tipo) => {
  const tipoNormalizado = normalizarTipoPrenda(tipo);
  if (tipoNormalizado.includes("camisa")) return "camisa";
  if (tipoNormalizado.includes("pantalon")) return "pantalon";
  if (tipoNormalizado.includes("chaleco")) return "chaleco";
  if (
    tipoNormalizado.includes("saco") ||
    tipoNormalizado.includes("chaque") ||
    tipoNormalizado.includes("frac") ||
    tipoNormalizado.includes("blazer")
  ) {
    return "saco";
  }

  return tipoNormalizado;
};

const obtenerCamposMedida = (tipo) => {
  const tipoNormalizado = normalizarTipoPrenda(tipo);

  if (tipoNormalizado.includes("camisa")) return CAMPOS_POR_PRENDA.camisa;
  if (tipoNormalizado.includes("pantalon")) return CAMPOS_POR_PRENDA.pantalon;
  if (tipoNormalizado.includes("chaleco")) return CAMPOS_POR_PRENDA.chaleco;
  if (
    tipoNormalizado.includes("saco") ||
    tipoNormalizado.includes("chaque") ||
    tipoNormalizado.includes("frac") ||
    tipoNormalizado.includes("blazer")
  ) {
    return CAMPOS_POR_PRENDA.saco;
  }

  return CAMPOS_POR_PRENDA[tipoNormalizado] || [];
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
  muslo: "",
};

export function ModalMedidasRenta({ isOpen, onClose, id_renta }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [render, setRender] = useState(isOpen);
  const [prendas, setPrendas] = useState([]);
  const [selectedPrendaId, setSelectedPrendaId] = useState("");
  const [medidasVisibles, setMedidasVisibles] = useState([]);
  const [medidas, setMedidas] = useState(estadoInicialMedida);
  const [historialMedidas, setHistorialMedidas] = useState([]);

  const selectPrendas = useMemo(
    () =>
      prendas.map((registro) => ({
        id: registro.id_detalle_renta,
        nombre: `${registro.producto?.tipo_producto || "Prenda"} - ${
          registro.producto?.nombre_producto || ""
        }`.trim(),
      })),
    [prendas],
  );
  const medidasDisponibles = useMemo(() => {
    if (!selectedPrendaId) return historialMedidas;

    const prendaSeleccionada = prendas.find(
      (detalle) =>
        String(detalle.id_detalle_renta) === String(selectedPrendaId),
    );
    const tipoPrenda =
      prendaSeleccionada?.producto?.tipo_producto ||
      prendaSeleccionada?.tipo_producto ||
      prendaSeleccionada?.prenda ||
      "";
    const tipoBuscado = clasificarTipoPrenda(tipoPrenda);

    return historialMedidas.filter(
      (medida) => clasificarTipoPrenda(medida.tipo_prenda) === tipoBuscado,
    );
  }, [historialMedidas, prendas, selectedPrendaId]);

  useEffect(() => {
    if (!isOpen || !id_renta) {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setRender(false);
        setPrendas([]);
        setSelectedPrendaId("");
        setMedidasVisibles([]);
        setMedidas(estadoInicialMedida);
        setHistorialMedidas([]);
      }, 300);

      return () => clearTimeout(timer);
    }

    setRender(true);
    setPrendas([]);
    setSelectedPrendaId("");
    setMedidasVisibles([]);
    setMedidas(estadoInicialMedida);
    setHistorialMedidas([]);

    const controller = new AbortController();
    let isMounted = true;

    apiFetch(`renta_detalles/${id_renta}`, { signal: controller.signal })
      .then((response) => {
        if (isMounted) setPrendas(response?.data || []);
      })
      .catch((error) => {
        if (error.name !== "AbortError") console.error(error);
      });

    apiFetch(`medidas_renta/${id_renta}`, { signal: controller.signal })
      .then((response) => {
        if (isMounted) setHistorialMedidas(response?.data || []);
      })
      .catch((error) => {
        if (error.name !== "AbortError") console.error(error);
      });

    const timer = setTimeout(() => {
      if (isMounted) setIsAnimating(true);
    }, 10);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [isOpen, id_renta]);

  useEffect(() => {
    if (!selectedPrendaId) return;

    const prendaSeleccionada = prendas.find(
      (detalle) =>
        String(detalle.id_detalle_renta) === String(selectedPrendaId),
    );
    if (!prendaSeleccionada?.id_medidas) return;

    const medidaGuardada = historialMedidas.find(
      (item) =>
        String(item.id_medidas) === String(prendaSeleccionada.id_medidas),
    );
    if (!medidaGuardada) return;

    const medidaLimpia = Object.fromEntries(
      Object.keys(estadoInicialMedida).map((key) => [
        key,
        medidaGuardada[key] ?? "",
      ]),
    );
    setMedidas({ ...estadoInicialMedida, ...medidaLimpia });
  }, [historialMedidas, prendas, selectedPrendaId]);

  const handlePrendaChange = (event) => {
    const idSeleccionado = event?.target ? event.target.value : event;

    setSelectedPrendaId(idSeleccionado || "");
    setMedidas(estadoInicialMedida);
    const prendaSeleccionada = idSeleccionado
      ? prendas.find(
          (detalle) =>
            String(detalle.id_detalle_renta) === String(idSeleccionado),
        )
      : null;
    const nombrePrenda =
      prendaSeleccionada?.producto?.tipo_producto ||
      prendaSeleccionada?.tipo_producto ||
      prendaSeleccionada?.prenda ||
      "";

    setMedidasVisibles(obtenerCamposMedida(nombrePrenda));
  };

  const inputsUpdateMedidas = (event) => {
    const { name, value } = event.target;

    if (name === "codigo_medida") {
      const codigoNormalizado = value.trim().toLocaleLowerCase();
      const coincidencia = medidasDisponibles.find(
        (item) =>
          String(item.codigo_medida || "")
            .trim()
            .toLocaleLowerCase() === codigoNormalizado,
      );

      if (coincidencia) {
        const medidaLimpia = Object.fromEntries(
          Object.keys(estadoInicialMedida).map((key) => [
            key,
            coincidencia[key] ?? "",
          ]),
        );
        setMedidas({ ...estadoInicialMedida, ...medidaLimpia });
        return;
      }

      setMedidas((prev) => ({ ...prev, codigo_medida: value, id_medidas: "" }));
      return;
    }

    setMedidas((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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

    const idMedidaExistente = medidas.id_medidas;
    const tieneMedidas = medidasVisibles.some(
      ({ textId }) => medidas[textId] !== "" && medidas[textId] !== null,
    );

    if (!tieneMedidas) {
      Swal.fire({
        toast: true,
        position: "top-end",
        title: "Ingresa al menos una medida de la prenda",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    try {
      const medidasEnviar = Object.fromEntries(
        Object.entries(medidas)
          .filter(
            ([key, value]) =>
              key !== "id_medidas" && (key !== "codigo_medida" || value !== ""),
          )
          .map(([key, value]) => [key, value === "" ? null : value]),
      );
      if (!idMedidaExistente) {
        medidasEnviar.codigo_medida = `TMP-${id_renta}-${selectedPrendaId}-${Date.now()}`;
      }

      const respuestaMedida = await apiFetch(
        idMedidaExistente ? `medidas/${idMedidaExistente}` : "medidas",
        {
          method: idMedidaExistente ? "PUT" : "POST",
          body: JSON.stringify(medidasEnviar),
        },
      );

      const idMedidaGuardada = idMedidaExistente
        ? idMedidaExistente
        : respuestaMedida?.data?.id_medidas ||
          respuestaMedida?.data?.medidas?.id_medidas;

      if (!idMedidaGuardada) {
        throw new Error("No se pudo obtener el ID de la medida guardada.");
      }

      if (!idMedidaExistente) {
        await apiFetch(
          `create_codigo_medida/${id_renta}/${idMedidaGuardada}?tipo=renta`,
          { method: "PUT" },
        );
      }

      await apiFetch("renta_detalles", {
        method: "PUT",
        body: JSON.stringify({
          id_detalle_renta: Number(selectedPrendaId),
          id_medidas: Number(idMedidaGuardada),
        }),
      });

      setPrendas((prevPrendas) =>
        prevPrendas.map((prenda) =>
          String(prenda.id_detalle_renta) === String(selectedPrendaId)
            ? { ...prenda, id_medidas: Number(idMedidaGuardada) }
            : prenda,
        ),
      );

      Swal.fire({
        toast: true,
        position: "top-end",
        title: idMedidaExistente
          ? "Medidas actualizadas con éxito"
          : "Medidas guardadas con éxito",
        icon: "success",
        showConfirmButton: false,
        timer: 3000,
      });

      if (onClose) onClose();
    } catch (error) {
      console.error("Error al guardar las medidas:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        title: error.message || "No se pudieron guardar las medidas",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

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
          aria-label="Cerrar"
        >
          <XMarkIcon className="size-7" />
        </button>

        <div className="flex-col">
          <h2 className="text-3xl font-black text-[#004053] tracking-wide uppercase">
            Medidas de renta
          </h2>
          <p className="text-[#004B57] text-lg">
            Selecciona una prenda e ingresa sus medidas
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-col overflow-y-auto overflow-x-hidden pb-4"
        >
          <div className="grid grid-cols-2">
            <div className="w-full max-w-xl">
              <SelectWD
                text="Prenda"
                textId="id_detalle_renta"
                options={selectPrendas}
                valueData={selectedPrendaId}
                updateData={handlePrendaChange}
              />
            </div>

            <div className="w-full max-w-xl pr-20 ml-10">
              <label
                htmlFor="codigo_medida"
                className="text-md font-semibold text-[#004B57]"
              >
                Código de medida
              </label>
              <input
                type="text"
                id="codigo_medida"
                name="codigo_medida"
                list="lista_codigos_medida_renta"
                value={medidas.codigo_medida || ""}
                onChange={inputsUpdateMedidas}
                placeholder="Buscar por código"
                autoComplete="off"
                className="mt-1.5 bg-[#D9D9D9]/50 border-none w-full rounded-lg p-2 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all"
              />
              <datalist id="lista_codigos_medida_renta">
                {medidasDisponibles.map((item, index) => (
                  <option
                    key={`${item.id_medidas}-${item.tipo_prenda}-${index}`}
                    value={item.codigo_medida}
                  />
                ))}
              </datalist>
            </div>
          </div>

          <div className="flex-col w-full mt-3">
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
                  {selectedPrendaId
                    ? "No hay campos de medida configurados para esta prenda."
                    : "Selecciona una prenda para cargar sus campos de medida..."}
                </p>
              )}
            </div>

            <div className="w-full flex justify-end mt-5">
              <button
                type="submit"
                disabled={!selectedPrendaId}
                className="h-10 w-42 flex justify-center items-center bg-[#BCCF00] text-[#004053] font-bold rounded-xl gap-2 text-lg hover:bg-[#a3c02b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
