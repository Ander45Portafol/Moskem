import {
  UsersIcon,
  IdentificationIcon,
  Square3Stack3DIcon,
  TagIcon,
  HomeIcon,
  ArchiveBoxIcon,
  Cog8ToothIcon,
  TableCellsIcon,
  InboxStackIcon,
  ClipboardDocumentCheckIcon,
  WalletIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { Link } from "react-router";
export function Sidebar() {
  const [active, setActive] = useState('dashboard');




  //Trabajar botones del menu como estado con el useState y que cada boton sea tipo boolean si esta activo sera true y si no sera false, para hacer que se activen
  return (
    <div className="flex-col h-full">
      <nav className="flex flex-col gap-1  max-h-5/6  pr-1 custom-scrollbar flex-1 relative">
        <img src="/images/logo_blanco.svg" alt="logoblanco" />
        {/* 💡 LA PASTILLA FLOTANTE: Ahora reacciona al hover oscureciéndose un poco */}
        <div className="absolute left-0 w-full bg-[#009BAE] rounded-xl shadow-md transition-all duration-300 ease-out z-0 pointer-events-none" />

        {/* Dashboard */}
        <Link to="/admin" className="" onClick={()=>setActive("dashboard")}>
          <div
            className={
              active === "dashboard"
                ? "p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-[#009BAE] text-[#004053] font-bold translate-x-1"
                : "p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal translate-x-1"
            }
          >
            <HomeIcon className="size-6" />
            <span className="text-md">Dashboard</span>
          </div>
        </Link>

        {/* Clientes */}
        <Link to="/admin/cliente" onClick={()=>setActive("cliente")}>
          <div
            className={
              active === "cliente"
                ? "p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-[#009BAE] text-[#004053] font-bold translate-x-1"
                : "p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal translate-x-1 hover:bg-[#009BAE] hover:text-[#004053] hover:font-bold"
            }
          >
            <IdentificationIcon className="size-6" />
            <span className="text-md">Clientes</span>
          </div>
        </Link>
        {/* Empleados */}
        <Link to="/">
          <div className="p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal translate-x-1 hover:bg-[#009BAE] hover:text-[#004053] hover:font-bold">
            <UsersIcon className="size-6" />
            <span className="text-md">Empleados</span>
          </div>
        </Link>

        {/* Órdenes de Compra */}
        <Link to="/">
          <div className="p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal translate-x-1 hover:bg-[#009BAE] hover:text-[#004053] hover:font-bold">
            <WalletIcon className="size-6" />
            <span className="text-md">Ordenes compra</span>
          </div>
        </Link>

        {/* Pedidos */}
        <Link to="/">
          <div className="p-3 rounded-xl flex items-center gap-4 ml-6 mr-2 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal translate-x-1 hover:bg-[#009BAE] hover:text-[#004053] hover:font-bold">
            <TableCellsIcon className="size-6" />
            <span className="text-md">Pedidos</span>
          </div>
        </Link>

        {/* Productos */}
        <Link to="/">
          <div className="p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal translate-x-1 hover:bg-[#009BAE] hover:text-[#004053] hover:font-bold">
            <TagIcon className="size-6" />
            <span className="text-md">Productos</span>
          </div>
        </Link>

        {/* Rentas */}
        <Link to="/">
          <div className="p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal  translate-x-1 hover:bg-[#009BAE] hover:text-[#004053] hover:font-bold">
            <ArchiveBoxIcon className="size-6" />
            <span className="text-md">Rentas</span>
          </div>
        </Link>

        {/* Órdenes de Trabajo */}
        <Link to="/">
          <div className="p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal translate-x-1 hover:bg-[#009BAE] hover:text-[#004053] hover:font-bold">
            <ClipboardDocumentCheckIcon className="size-6" />
            <span className="text-md">Ordenes trabajo</span>
          </div>
        </Link>

        {/* Telas */}
        <Link to="/">
          <div className="p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal translate-x-1 hover:bg-[#009BAE] hover:text-[#004053] hover:font-bold">
            <Square3Stack3DIcon className="size-6" />
            <span className="text-md">Telas</span>
          </div>
        </Link>

        {/* Accesorios */}
        <Link href="/">
          <div className="p-3 rounded-xl flex items-center gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal ml-6 mr-2 translate-x-1 hover:bg-[#009BAE] hover:text-[#004053] hover:font-bold">
            <InboxStackIcon className="size-6" />
            <span className="text-md">Complementos</span>
          </div>
        </Link>
      </nav>
      <div className=" flex h-1/6 items-end w-full">
        <Link href="/">
          <div className="p-3 pr-8 w-full rounded-xl flex items-center gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal ml-6 mr-2 translate-x-1 hover:bg-[#009BAE] hover:text-[#004053] hover:font-bold">
            <Cog8ToothIcon className="size-6" />
            <span className="text-md">Configuración</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
