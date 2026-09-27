import { API } from "../assets/js/global";

export const apiFetch = async (endpoint, options = {}) => {
  const config = {
    ...options,
    credentials: "include", // Envía y recibe las cookies HttpOnly
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(`${API}${endpoint}`, config);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Si la respuesta no es 2xx, creamos un objeto de error con el status y los datos
    const error = new Error(data.error || "Ocurrió un error en la petición");
    error.status = response.status;
    error.data = data;

    // Lanzamos el error para que lo maneje el try/catch del AuthContext o del componente
    throw error;
  }

  return data;
};
