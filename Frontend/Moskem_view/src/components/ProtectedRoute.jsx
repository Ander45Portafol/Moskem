// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../Context/AuthContext";

// Componente visual de carga mientras se consulta /api/me al presionar F5
const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center bg-[#006272]">
    <p className="text-xl font-bold text-white">Verificando sesión...</p>
  </div>
);

/**
 * Guardián para rutas privadas (/admin y sus hijas)
 * Si no hay sesión, envía al usuario a la pantalla de Login (/)
 */
export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

/**
 * Guardián para rutas públicas (Login)
 * Si el usuario ya está autenticado y presiona F5 o intenta ir a /, lo redirige directamente a /admin
 */
export const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return isAuthenticated ? <Navigate to="/admin" replace /> : <Outlet />;
};