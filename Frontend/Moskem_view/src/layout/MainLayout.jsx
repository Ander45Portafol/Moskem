import { Outlet } from "react-router";
import { Sidebar } from "../components/Sidebar";

export function MainLayout() {
  return (
    <div className="h-screen w-screen">
      <div className="flex h-full w-full bg-white  font-sans select-none">
        {/* 1. EL SIDEBAR FIJO (Izquierda) */}
        {/* Usamos el color turquesa oscuro de tu diseño [#006B76] */}
        <aside className="w-64 bg-[#006B76] text-white flex flex-col justify-between h-full">
          <Sidebar />
        </aside>
        {/* 2. ÁREA DE PÁGINAS DINÁMICAS (Derecha) */}
        {/* Este contenedor tiene scroll independiente para que el Sidebar nunca se mueva */}
        <div className="flex-1 h-full overflow-y-hidden bg-white">
          <main className="p-8 max-w-[1600px] mx-auto w-full ">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
