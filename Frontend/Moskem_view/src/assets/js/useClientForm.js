import Swal from "sweetalert2";
import { API } from "./global";
import { useState } from "react";

export function useClientForm({ id_cliente, setCliente }) {
  const [data, setData] = useState({
    id_cliente: "",
    nombres_cliente: "",
    apellidos_cliente: "",
    correo_electronico: "",
    fecha_nacimiento: "",
    telefono_contacto: "",
    documento_cliente: "",
    tipo_membresia: "",
    codigo_membresia: "",
  });
  //funcion para cargar los datos cada que se realiza alguna acción
  const chargeData = async (id_cliente) => {
    try {
      const response = await fetch(`${API}clientes/${id_cliente}`);
      if (response.ok) {
        const responseData = await response.json();
        setData(responseData.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const createData = async (formData) => {
    try {
      const response = await fetch(`${API}clientes`, {
        method: "POST",
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
  const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(id_cliente)
    if (id_cliente!='null') {
      await createData(data);
    } /*else {
      await updateData(data, idEmpleado);
    }*/
  };

  return { data, setData, handleSubmit };
}
