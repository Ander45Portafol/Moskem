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
      const response = await apiFetch("me", { method: "GET" });
      // Normalización en caso de que la API devuelva { data: { user } } o el objeto directo
      setUser(response?.data || response);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Función para procesar el inicio de sesión
  const login = async (credentials) => {
    Swal.fire({
      title: "Iniciando sesión...",
      text: "Validando credenciales",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await apiFetch("login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      const userObj = response.user || response.data || response;
      setUser(userObj);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Bienvenido/a, ${userObj?.usuario || "Usuario"}`,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

      return response;
    } catch (error) {
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
      setUser(null);

      Swal.fire({
        icon: "success",
        title: "Sesión cerrada",
        text: "Has salido correctamente del sistema.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // Bloqueo de renderizado durante la carga inicial para evitar que las rutas
  // hagan redirecciones anticipadas mientras valida el token
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#004053] border-t-transparent" />
          <p className="text-sm font-semibold text-[#004053]">
            Cargando sesión...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
