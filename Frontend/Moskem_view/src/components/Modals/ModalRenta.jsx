import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { InputD } from "../InputD";
import { useForm } from "../../assets/js/Forms/useForm";
import { SelectD } from "../SelectD";
import { useGet } from "../../assets/js/useGet";
import { InputDate } from "../inputDate";
import { TextArea } from "../TextArea";
import "yet-another-react-lightbox/styles.css";
import { DataList } from "../DataList";
import { useAuth } from "../../Context/AuthContext";

export default function ModalRenta({
  isOpen,
  onClose,
  id_renta,
  setRenta,
  setIdRenta,
  isModalDetalle,
}) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const { data: clientes } = useGet("clientes");
  const { user } = useAuth();

  const SelectClientes =
    clientes?.map((registro) => ({
      id: registro.id,
      nombre: `${registro.nombres} ${registro.apellidos}`,
    })) || [];

  const ruta = "rentas";
  const estadoInicial = {
    id_cliente: "",
    id_empleado: user?.id_empleado ?? user?.empleado?.id_empleado ?? "",
    fecha_inicio: "",
    fecha_devolucion: "",
    fecha_evento: "",
    monto_total: "",
    deposito: "",
    estado_renta: "",
    notas_descripcion: "",
    tipo_paquete:"",
    visibilidad_renta: "",
  };

  const { data, setData, handleSubmit } = useForm({
    id: id_renta,
    setForm: setRenta,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Ejecutas la petición al backend (esperamos a que responda)
      const result = await handleSubmit(e);
      if (!result || result.error) return;

      const rentaGuardada = result.data ?? {};
      const idRentaGuardada =
        rentaGuardada.id_renta ?? data.id_renta ?? id_renta;

      if (!idRentaGuardada) {
        console.error("La API guardó la renta sin devolver su identificador.");
        return;
      }

      // 5. Ahora sí cerramos este modal y abrimos el de detalle de forma segura
      setIdRenta?.(idRentaGuardada);
      onClose();
      isModalDetalle?.(true);
    } catch (error) {
      console.error("Error al guardar la renta:", error);
    }
  };

  // ... (tus useEffects e inputsUpdate se mantienen exactamente igual) ...

  const estado_renta = ["Entregado", "En proceso", "Finalizado"];

  const inputsUpdate = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    const nuevosDatos = {
      ...data,
      [name]: inputValue,
    };

    // Recálculo automático con límite a 2 decimales
    if (name === "anticipo" || name === "costo_total") {
      const costo =
        parseFloat(name === "costo_total" ? inputValue : data.costo_total) || 0;
      const ant =
        parseFloat(name === "anticipo" ? inputValue : data.anticipo) || 0;

      const calculoRestante = Math.max(0, costo - ant);

      // Formatea con 2 decimales (.toFixed(2))
      nuevosDatos.restante = calculoRestante.toFixed(2);
    }

    setData(nuevosDatos);
  };

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!render) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white w-[700px] max-w-[100vw] rounded-[32px] p-10 shadow-2xl relative flex flex-col gap-8 transition-all duration-300 transform ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-8 right-8 text-[#004B57] hover:scale-110 transition-transform"
        >
          <XMarkIcon className="size-7" />
        </button>

        <div>
          <h2 className="text-4xl font-black text-[#004B57] tracking-wide uppercase">
            Formulario - Rentas
          </h2>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col">
          {/* CAMPOS DEL FORMULARIO */}
          <div className="flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-5">
              <InputDate
                type="date"
                text="Fecha Inicio"
                valueData={data.fecha_inicio}
                textId="fecha_inicio"
                view=""
                updateData={inputsUpdate}
              />
              <InputD
                type="date"
                text="Fecha Devolución"
                valueData={data.fecha_devolucion}
                textId="fecha_devolucion"
                view=""
                updateData={inputsUpdate}
              />
              <InputD
                type="date"
                text="Fecha Evento"
                valueData={data.fecha_evento}
                textId="fecha_evento"
                view=""
                updateData={inputsUpdate}
              />
              <DataList
                text="Cliente"
                textId="id_cliente"
                nametag="id_cliente"
                dataList={SelectClientes}
                valueData={data.id_cliente}
                updateData={inputsUpdate}
              />
            </div>
            <TextArea
              text="Notas"
              textId="notas_descripcion"
              valueData={data.notas_descripcion}
              updateData={inputsUpdate}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 mt-4">
              <SelectD
                text="Estado Renta"
                textId="estado_renta"
                options={estado_renta}
                valueData={data.estado_renta}
                updateData={inputsUpdate}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-md font-semibold text-[#004B57]">
                  Pago Final
                </label>
                <input
                  type="number"
                  className="bg-[#D9D9D9]/50 border-none rounded-lg p-2 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all disabled:cursor-not-allowed"
                  value={data.monto_total}
                  id="monto_total"
                  name="monto_total"
                  onChange={inputsUpdate}
                  disabled={true}
                />
              </div>
              <InputD
                text="Deposito"
                type="number"
                textId="deposito"
                view=""
                valueData={data.deposito}
                updateData={inputsUpdate}
              />
            </div>
            <div className="grid grid-cols-1 mt-4">
              <div className="flex-col mr-14">
                <label className="text-md font-semibold text-[#004B57]">
                  Tipo Paquete
                </label>
                <div className="flex">
                  <input
                    type="checkbox"
                    id="paquetefull"
                    checked={data.tipo_paquete === "Paquete Full"}
                    onChange={(e) => {
                      setData({
                        ...data,
                        tipo_paquete: e.target.checked ? "Paquete Full" : "",
                      });
                    }}
                  />
                  <label htmlFor="paquetefull" className="ml-2">
                    Paquete Full
                  </label>
                </div>
                <div className="flex">
                  <input
                    type="checkbox"
                    id="sacoypantalon"
                    checked={data.tipo_paquete === "Saco y Pantalón"}
                    onChange={(e) => {
                      setData({
                        ...data,
                        tipo_paquete: e.target.checked ? "Saco y Pantalón" : "",
                      });
                    }}
                  />
                  <label htmlFor="sacoypantalon" className="ml-2">
                    Saco y Pantalón
                  </label>
                </div>
                <div className="flex">
                  <input
                    type="checkbox"
                    id="prenda"
                    checked={data.tipo_paquete === "Prenda"}
                    onChange={(e) => {
                      setData({
                        ...data,
                        tipo_paquete: e.target.checked ? "Prenda" : "",
                      });
                    }}
                  />
                  <label htmlFor="prenda" className="ml-2">
                    Prenda
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* BOTÓN GUARDAR SIN onClick INLINE */}
          <div className="flex justify-end mt-4 gap-4">
            <button
              type="submit"
              className="bg-[#B4D333] hover:bg-[#a3c02b] text-[#004B57] font-bold px-5 py-2 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <CheckCircleIcon className="size-6" />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
