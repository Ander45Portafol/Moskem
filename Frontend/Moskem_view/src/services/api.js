import { API } from "../assets/js/global";

export const apiFetch = async (endpoint, options = {}) => {
  const config = {
    ...options,
    credentials: "include", // <--- IMPORTANTE: Le dice al navegador que envíe y reciba cookies
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(`${API}${endpoint}`, config);

  // Si la respuesta es 401 (No autorizado / Token vencido)
  if (response.status === 401) {
    localStorage.removeItem("user"); // Solo limpiamos datos informativos si los usas
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || "Ocurrió un error en la petición");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};