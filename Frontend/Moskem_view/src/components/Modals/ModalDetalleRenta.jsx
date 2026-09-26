import React, { useCallback, useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useForm } from "../../assets/js/Forms/useForm";
import { DetalleRenta } from "../DetallelRenta";
import { API } from "../../assets/js/global";

export default function ModalDetalleRenta({
  isOpen,
  onClose,
  id_renta,
  setRenta,
}) {
  const [render, setRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [detalleRenta, setDetalleRenta] = useState(null);

  // Helper para generar una estructura inicial limpia
  const crearDetalleVacio = useCallback(() => {
    return {
      id_detalle_renta: Date.now(), // ID temporal
      id_renta: id_renta,
      esExtra: true,
      tipo_pedido: "Prenda unica",
      precio_detalle: "0.00",
      id_producto: "",
    };
  }, [id_renta]);

  const cargarRentasExistentes = async (renta) => {
    try {
      const response = await fetch(`${API}renta_detalles/${renta}`);
      if (response.ok) {
        const responseData = await response.json();

        // VALIDACIÓN: Si no hay items, cargamos 1 vacio por defecto
        if (Array.isArray(responseData.data) && responseData.data.length > 0) {
          setDetalleRenta(responseData.data);
        } else {
          setDetalleRenta([crearDetalleVacio()]);
        }
      } else {
        // En caso de que falle la petición, colocamos uno vacío
        setDetalleRenta([crearDetalleVacio()]);
      }
    } catch (error) {
      console.log(error);
      setDetalleRenta([crearDetalleVacio()]);
    }
  };

  const cargarNuevoProducto = useCallback(() => {
    setDetalleRenta((prev) => [...(prev || []), crearDetalleVacio()]);
  }, [crearDetalleVacio]);

  const ruta = "empleados";
  const estadoInicial = {
    nombres_empleado: "",
    apellidos_empleado: "",
    usuario_empleado: "",
    tipo_empleado: "",
    documentos_empleados: "",
    correo_empleado: "",
    estado_empleado: "",
    id_producto: "",
  };

  const { data, setData, handleSubmit } = useForm({
    id: id_renta,
    setForm: setRenta,
    isOpen,
    onClose,
    ruta,
    estadoInicial,
  });

  const handleDetalleChange = (e, index) => {
    const { name, value } = e.target;

    setDetalleRenta((prevDetalles) => {
      const nuevosDetalles = [...prevDetalles];
      nuevosDetalles[index] = {
        ...nuevosDetalles[index],
        [name]: value,
      };
      return nuevosDetalles;
    });
  };

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      setTimeout(() => setIsAnimating(true), 10);
      cargarRentasExistentes(id_renta);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, id_renta]);

  if (!render) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Tarjeta del Modal */}
      <div
        className={`bg-white w-[1000px] max-w-[100vw] rounded-[32px] p-10 shadow-2xl relative flex flex-col gap-8 transition-all duration-300 transform ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
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
        </div>
        <div className="flex-1 overflow-x-auto overflow-y-auto pb-4">
          <div className="flex min-h-full w-max items-stretch">
            {Array.isArray(detalleRenta) &&
              detalleRenta.map((detalle, index) => {
                return (
                  <div
                    key={detalle.id_detalle_renta || index}
                    className="flex min-h-full items-stretch shrink-0"
                  >
                    <DetalleRenta
                      renta={detalle}
                      updateInputs={(e) => handleDetalleChange(e, index)}
                    />
                    {index < detalleRenta.length - 1 && (
                      <div className="w-1 mx-8 bg-[#004B57] self-stretch"></div>
                    )}
                  </div>
                );
              })}
            <div className="w-58 h-100 ml-5 flex items-center justify-center cursor-pointer">
              <button
                type="button"
                onClick={cargarNuevoProducto}
                className="w-32 h-32 rounded-3xl bg-[#004053] hover:bg-[#013342] hover:text-[#FFF] text-[#B2B2B2] flex items-center justify-center"
              >
                <PlusCircleIcon className="size-16" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-[#009BAE] text-[#004053] font-bold px-5 py-2 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <ClipboardDocumentListIcon className="size-6" />
            Agregar Medidas
          </button>
          <button
            type="submit"
            className="bg-[#B4D333] hover:bg-[#a3c02b] text-[#004B57] font-bold px-5 py-2 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <CheckCircleIcon className="size-6" />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
