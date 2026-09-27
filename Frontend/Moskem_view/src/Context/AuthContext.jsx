import React, { createContext, useState, useEffect, useContext } from "react";
import { apiFetch } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al cargar la app, consultamos si el backend reconoce la Cookie de sesión activa
    const checkAuth = async () => {
      try {
        const userData = await apiFetch("/me", { method: "GET" });
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (correo_electronico, clave) => {
    const data = await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ correo_electronico, clave }),
    });

    // La cookie HttpOnly la guarda automáticamente el navegador.
    // Nosotros solo guardamos la información del usuario devuelta.
    setUser(data.user);

    return data;
  };

  const logout = async () => {
    try {
      await apiFetch("/logout", { method: "POST" });
    } catch (error) {
      // Ignorar error si el token ya venció
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);