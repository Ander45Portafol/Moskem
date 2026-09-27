// src/Context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificación de sesión al cargar o refrescar la app (F5)
  const checkAuth = async () => {
    try {
      const userData = await apiFetch("me", { method: "GET" });
      setUser(userData);
    } catch (error) {
      // Si responde 401 o falla la conexión, la sesión no es válida
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Función para procesar el inicio de sesión desde el formulario
  const login = async (credentials) => {
    // Hace la petición POST a /login (Laravel responderá con el user e inyectará la cookie)
    const response = await apiFetch("login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Guardamos la información del usuario en el estado
    setUser(response.user);
    return response;
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await apiFetch("logout", { method: "POST" });
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor:", error);
    } finally {
      setUser(null); // Limpiamos el estado en React
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user, // true si user existe, false si es null
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);