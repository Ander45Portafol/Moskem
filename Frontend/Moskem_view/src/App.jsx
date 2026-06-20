import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/Login";
import { MainLayout } from "./layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Clientes } from "./pages/Clientes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="cliente" element={ <Clientes/>} />
      </Route>
    </Routes>
  );
}

export default App;
