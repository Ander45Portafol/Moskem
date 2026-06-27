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

export function useClientForm({ id_cliente, setCliente, isOpen }) {
  const [data, setData] = useState(estadoInicial);
  const idCargadoRef = useRef(null);
  useEffect(() => {
    // Si el modal está cerrado, limpiamos todo y no hacemos peticiones
    if (!isOpen) {
      setData(estadoInicial);
      idCargadoRef.current = null;
      return;
    }

    // Si hay un ID y es diferente al que ya cargamos, hacemos la petición
    if (id_cliente && id_cliente !== idCargadoRef.current) {
      chargeData(id_cliente);
    } else if (!id_cliente) {
      setData(estadoInicial);
      idCargadoRef.current = null;
    }
  }, [id_cliente, isOpen]);

  //funcion para cargar los datos cada que se realiza alguna acción
  const chargeData = async (id_cliente) => {
    try {
      const response = await fetch(`${API}clientes/${id_cliente}`);
      if (response.ok) {
        const responseData = await response.json();
        setData(responseData.data);
        idCargadoRef.current = id; // Registramos que este ID ya fue cargado con éxito
      }
    } catch (e) {
      console.log(e);
    }
  };
  const createData = async (formData) => {
    try {
      const response = await fetch(`${API}clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          toast: true,
          position: "top-end",
          title: result.message,
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        });
        setCliente((prev) => [...prev, result.data]);
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
  const updateData = async (formData, id) => {
    try {
      const response = await fetch(`${API}clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        Swal.fire({
          toast: true,
          position: "top-end",
          title: result.message,
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        });
        const updateClient = await fetch(`${API}clientes`);
        const responseData = await updateClient.json();
        setCliente(responseData.data);
      }
    } catch (e) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(id_cliente);
    if (!id_cliente) {
      console.log(data);
      await createData(data);
    } else {
      await updateData(data, id_cliente);
    }
  };

  return { data, setData, handleSubmit };
}
