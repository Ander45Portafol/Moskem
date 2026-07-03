import Swal from "sweetalert2";
import { API } from "./global";
import { useEffect, useRef, useState } from "react";

export function useGet(url) {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState(null);
  const fetchedRef = useRef(false)

  async function getData() {
    try {
      const response = await fetch(API + url, { method: "GET" });
      const responseData = await response.json();
      setMessage(responseData.message);
      setData(responseData.data);
    } catch (e) {
      Swal.fire({
        title: "Ocurrio un problema",
        text: "No se puede establecer la conexión con el servidor. Error 401",
        icon: "error",
        showConfirmButton: false, // Desactiva el botón de confirmación
        showCancelButton: false, // Desactiva el botón de cancelar
        allowOutsideClick: false, // Opcional: Evita que el usuario cierre el modal haciendo clic fuera
        allowEscapeKey: false,
      });
    }
  }

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    // fetch(url, action)
    //   .then((response) => setData(response.json().data))
    //   .then((info) => setData(info.data))
    //   .catch((error) => setError(error))
    getData();
  }, [url]);
  //se retornan estas variables porque serán que se uilizaremos para cargar los datos y mostrar los datos
  return { data, message, setData };
}
