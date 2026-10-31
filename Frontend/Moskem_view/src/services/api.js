import { API } from "../assets/js/global";

export const apiFetch = async (endpoint, options = {}) => {
  const isFormData = options.body instanceof FormData;

  const headers = {
    Accept: "application/json",
    ...options.headers,
  };

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (isFormData) {
    delete headers["Content-Type"];
  }

  const config = {
    ...options,
    credentials: "include", // Envía y recibe las cookies HttpOnly
    headers,
  };

  // Normalización de la URL para evitar // accidentales
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const cleanBaseUrl = API.endsWith("/") ? API : `${API}/`;

  const response = await fetch(`${cleanBaseUrl}${cleanEndpoint}`, config);

  // 1. Manejo específico de sesión expirada / No autenticado
  if (response.status === 401) {
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
    const error = new Error("Sesión vencida. Inicie sesión nuevamente.");
    error.status = 401;
    throw error;
  }

  // Manejo de respuestas 204 No Content
  if (response.status === 204) {
    return { success: true };
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || data.error || "Ocurrió un error en la petición",
    );
    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};