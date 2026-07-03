import Swal from "sweetalert2";
import { API } from "../global";
import { useEffect, useRef, useState } from "react";

const estadoInicial = {
  nombres_cliente: "",
  apellidos_cliente: "",
  correo_electronico: "",
  fecha_nacimiento: "",
  telefono_contacto: "",
  documento_cliente: "",
  tipo_membresia: "",
};

export function useClientForm({ id, setForm, isOpen, onClose,ruta }) {
  const [data, setData] = useState(estadoInicial);
  const idCargadoRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setData(estadoInicial);
      idCargadoRef.current = null;
      return;
    }

    if (id && id !== idCargadoRef.current) {
      console.log(id)
      chargeData(id);
    } else if (!id) {
      setData(estadoInicial);
      idCargadoRef.current = null;
    }
  }, [id, isOpen]);

  const chargeData = async (id) => {
    try {
      const response = await fetch(`${API}${ruta}/${id}`);
      if (response.ok) {
        const responseData = await response.json();
        setData(responseData.data);
        idCargadoRef.current = id;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const createData = async (formData) => {
    try {
      const response = await fetch(`${API}${ruta}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          toast: true,
          position: "top-end",
          title: result.message || "Registro creado con éxito",
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        });
        setForm((prev) => [...prev, result.data]);
        if (onClose) onClose();
      }
    } catch (e) {
      Swal.fire({
        title: "Ocurrió un problema",
        text: e.message,
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const updateData = async (formData, id_form) => {
    try {
      const response = await fetch(`${API}${ruta}/${id_form}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // 1. Convertimos la respuesta a JSON para obtener el "message" del backend
        const result = await response.json();

        // 2. Mostramos la alerta usando el mensaje real de tu API de Laravel
        Swal.fire({
          toast: true,
          position: "top-end",
          title: result.message || "Registro actualizado con éxito",
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        });

        // 3. Volvemos a pedir la lista completa para actualizar el componente padre
        const updateClient = await fetch(`${API}${ruta}`);
        if (updateClient.ok) {
          const responseData = await updateClient.json();
          setForm(responseData.data);
        }

        // 4. Cerramos el modal de forma segura
        if (onClose) onClose();
      } else {
        // Si el backend responde con un error (ej. 500 o 422)
        const errorResult = await response.json();
        Swal.fire({
          title: "Error al actualizar",
          text: errorResult.data || "Verifica los datos enviados",
          icon: "error",
          showConfirmButton: true,
        });
      }
    } catch (e) {
      // Importante: No dejar el catch vacío para saber si algo falla en JS
      console.error("Error en la petición de actualización:", e);
      Swal.fire({
        title: "Ocurrió un problema",
        text: "No se pudo conectar con el servidor.",
        icon: "error",
        timer: 3000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      await createData(data);
    } else {
      await updateData(data, id);
    }
  };

  return { data, setData, handleSubmit };
}
