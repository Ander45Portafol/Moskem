// App.jsx
import { Route, Routes, Navigate } from "react-router";
import Login from "./pages/Login";
import { MainLayout } from "./layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Clientes } from "./pages/Clientes";
import { Empleados } from "./pages/Empleados";
import { Rentas } from "./pages/Rentas";
import Productos from "./pages/Productos";
import { OrdenesCompra } from "./pages/OrdenesCompra";
import { Pedidos } from "./pages/Pedidos";
import { Mercerias } from "./pages/Mercerias";
import { Telas } from "./pages/Telas";
import { Cupones } from "./pages/Cupones";

// Importamos los guardianes de ruta
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import { Recuperacion } from "./pages/Recuperacion";
import Login2 from "./pages/Login2";
import { Configuracion } from "./pages/Configuracion";

function App() {
  return (
    <Routes>
      {/* Rutas Públicas (Login) */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Login2 />} />
        <Route path="/recuperar_contraseña" element={<Recuperacion />} />
      </Route>

      {/* Rutas Protegidas (Solo accesible si está autenticado) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="cliente" element={<Clientes />} />
          <Route path="empleado" element={<Empleados />} />
          <Route path="pedido" element={<Pedidos />} />
          <Route path="renta" element={<Rentas />} />
          <Route path="cupones" element={<Cupones />} />
          <Route path="producto" element={<Productos />} />
          <Route path="orden_compra" element={<OrdenesCompra />} />
          <Route path="merceria" element={<Mercerias />} />
          <Route path="tela" element={<Telas />} />
          <Route path="config" element={ <Configuracion/>} />
        </Route>
      </Route>

      {/* Redirección para cualquier ruta inexistente */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
