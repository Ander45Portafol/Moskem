import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../../../services/api";

export function useForm({ id, setForm, isOpen, onClose, ruta, estadoInicial }) {
  const [data, setData] = useState(estadoInicial);
  const idCargadoRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setData(estadoInicial);
      idCargadoRef.current = null;
      return;
    }

    if (id && id !== idCargadoRef.current) {
      chargeData(id);
    } else if (!id) {
      setData(estadoInicial);
      idCargadoRef.current = null;
    }
  }, [id, isOpen]);

  // Carga los datos de un registro individual para edición
  const chargeData = async (idToLoad) => {
    try {
      const responseData = await apiFetch(`${ruta}/${idToLoad}`, {
        method: "GET",
      });
      setData(responseData.data ?? responseData);
      idCargadoRef.current = idToLoad;
    } catch (e) {
      console.error("Error al cargar los datos del registro:", e);
    }
  };

  // Manejador principal para Crear o Actualizar registros
  const handleSubmit = async (e, customData = null) => {
    if (e && e.preventDefault) e.preventDefault();

    const payload = customData || data;
    const esFormData = payload instanceof FormData;

    // Determinar URL y método
    const endpoint = id ? `${ruta}/${id}` : ruta;
    let method = id ? "PUT" : "POST";

    // Si es actualización y viene como FormData, Laravel requiere que viaje como POST con _method = 'PUT'
    if (id && esFormData) {
      method = "POST";
      payload.append("_method", "PUT");
    }

    // Configurar opciones de petición
    const options = {
      method,
      body: esFormData ? payload : JSON.stringify(payload),
      headers: {},
    };

    // Si es FormData, dejamos que el navegador genere automáticamente el boundary
    if (esFormData) {
      delete options.headers["Content-Type"];
    }

    try {
      const result = await apiFetch(endpoint, options);

      // Alerta de éxito con SweetAlert2
      Swal.fire({
        toast: true,
        position: "top-end",
        title:
          result.message ||
          (id ? "Registro actualizado con éxito" : "Registro creado con éxito"),
        icon: "success",
        showConfirmButton: false,
        timer: 3000,
      });

      // Recargamos o actualizamos la lista en el estado padre si setForm está disponible
      if (setForm) {
        try {
          const listResponse = await apiFetch(ruta, { method: "GET" });
          setForm(listResponse.data ?? listResponse);
        } catch (errList) {
          console.error("Error al refrescar la lista:", errList);
        }
      }

      // Cerramos el modal si aplica
      if (onClose) onClose();

      // Retornamos el resultado completo para que la vista pueda leer clave_inicial, empleado, etc.
      return result;
    } catch (error) {
      const errorMsg =
        error.data?.error ||
        error.data?.message ||
        error.message ||
        "Error al procesar la solicitud.";

      Swal.fire({
        title: id ? "Error al actualizar" : "Error al registrar",
        text: errorMsg,
        icon: "error",
        showConfirmButton: true,
        confirmButtonColor: "#006272",
      });

      return false;
    }
  };

  return { data, setData, handleSubmit, chargeData };
}