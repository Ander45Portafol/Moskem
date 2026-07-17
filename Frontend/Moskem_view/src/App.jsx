import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/Login";
import { MainLayout } from "./layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Clientes } from "./pages/Clientes";
import { Empleados } from "./pages/Empleados";
import { Rentas } from "./pages/Rentas";
import Productos from "./pages/Productos";
import { OrdenesCompra } from "./pages/OrdenesCompra";
import { Pedidos } from "./pages/Pedidos";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="cliente" element={<Clientes />} />
        <Route path="empleado" element={<Empleados />} />
        <Route path="pedido" element={ <Pedidos/>} />
        <Route path="renta" element={<Rentas />} />
        <Route path="producto" element={<Productos />} />
        <Route path="orden_compra" element={<OrdenesCompra/>}/>
      </Route>
    </Routes>
  );
}

export default App;
