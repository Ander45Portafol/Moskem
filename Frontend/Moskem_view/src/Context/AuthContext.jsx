// src/Context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
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
    // Alerta de carga mientras autentica con el servidor
    Swal.fire({
      title: "Iniciando sesión...",
      text: "Validando credenciales",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Petición POST a /login
      const response = await apiFetch("login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      // Guardamos la información del usuario en el estado
      setUser(response.user);

      // Notificación tipo "Toast" rápida y elegante arriba a la derecha
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Bienvenido/a, ${response.user?.usuario || "Usuario"}`,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

      return response;
    } catch (error) {
      // Manejo de error si las credenciales fallan o el servidor responde con error
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: error.message || "Usuario o contraseña incorrectos.",
        confirmButtonColor: "#004053",
      });
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    // Confirmación opcional previa a cerrar sesión
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas salir del sistema?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#004053",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Cerrando sesión...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await apiFetch("logout", { method: "POST" });
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor:", error);
    } finally {
      setUser(null); // Limpiamos el estado en React

      Swal.fire({
        icon: "success",
        title: "Sesión cerrada",
        text: "Has salido correctamente del sistema.",
        timer: 1500,
        showConfirmButton: false,
      });
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