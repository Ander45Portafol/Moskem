import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../../services/api";


export function useGet(url) {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState(null);
  const fetchedRef = useRef(false);

  async function getData() {
    try {
      // apiFetch ya incluye credentials: "include" y la constante API
      const responseData = await apiFetch(url, { method: "GET" });

      setMessage(responseData.message || null);
      // Si Laravel responde con la estructura estándar de ApiResponse, los datos están en .data
      setData(responseData.data ?? responseData);
    } catch (e) {
      // Capturamos la excepción lanzada por apiFetch cuando response.ok es false o falla la red
      const errorMsg =
        e.data?.error || e.message || "Error al conectar con el servidor.";

      Swal.fire({
        title: "Ocurrió un problema",
        text: errorMsg,
        icon: "error",
        showConfirmButton: true, // Se activa para que el usuario pueda cerrar la alerta
        confirmButtonColor: "#006272",
      });
    }
  }

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    getData();
  }, [url]);

  return { data, message, setData, refetch: getData };
}