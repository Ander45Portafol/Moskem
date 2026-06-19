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
import { Link } from "react-router";
export function Sidebar() {
    //Trabajar botones del menu como estado con el useState y que cada boton sea tipo boolean si esta activo sera true y si no sera false, para hacer que se activen
  return (
    <div className="h-screen">
      <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-160px)] pr-1 custom-scrollbar flex-1 relative">
        <img src="/images/logo_blanco.svg" alt="logoblanco" />
        {/* 💡 LA PASTILLA FLOTANTE: Ahora reacciona al hover oscureciéndose un poco */}
        <div className="absolute left-0 w-full bg-[#009BAE] rounded-xl shadow-md transition-all duration-300 ease-out z-0 pointer-events-none" />

        {/* Dashboard */}
        <Link to="/" className="">
          <div className="p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-[#009BAE] text-[#004053] font-bold shadow-md translate-x-1">
            <HomeIcon className="size-6" />
            <span className="text-md">Dashboard</span>
          </div>
        </Link>

        {/* Clientes */}
        <Link to="/">
          <div className="p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal translate-x-1">
            <IdentificationIcon className="size-6" />
            <span className="text-md">Clientes</span>
          </div>
        </Link>
        {/* Empleados */}
        <Link to="/">
          <div className="p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal translate-x-1">
            <UsersIcon className="size-6" />
            <span className="text-md">Empleados</span>
          </div>
        </Link>

        {/* Órdenes de Compra */}
        <Link to="/">
          <div className="p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal translate-x-1">
            <WalletIcon className="size-6" />
            <span className="text-md">Ordenes compra</span>
          </div>
        </Link>

        {/* Pedidos */}
        <Link to="/">
          <div className="p-3 rounded-xl flex items-center gap-4 ml-6 mr-2 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal translate-x-1">
            <TableCellsIcon className="size-6" />
            <span className="text-md">Pedidos</span>
          </div>
        </Link>

        {/* Productos */}
        <Link to="/">
          <div className="p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal translate-x-1">
            <TagIcon className="size-6" />
            <span className="text-md">Productos</span>
          </div>
        </Link>

        {/* Rentas */}
        <Link to="/">
          <div className="p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal  translate-x-1">
            <ArchiveBoxIcon className="size-6" />
            <span className="text-md">Rentas</span>
          </div>
        </Link>

        {/* Órdenes de Trabajo */}
        <Link to="/">
          <div className="p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal translate-x-1">
            <ClipboardDocumentCheckIcon className="size-6" />
            <span className="text-md">Ordenes trabajo</span>
          </div>
        </Link>

        {/* Telas */}
        <Link to="/">
          <div className="p-3 rounded-xl flex items-center ml-6 mr-2 gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal translate-x-1">
            <Square3Stack3DIcon className="size-6" />
            <span className="text-md">Telas</span>
          </div>
        </Link>

        {/* Accesorios */}
        <Link href="/">
          <div className="p-3 rounded-xl flex items-center gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal ml-6 mr-2 translate-x-1">
            <InboxStackIcon className="size-6" />
            <span className="text-md">Complementos</span>
          </div>
        </Link>
      </nav>
      <div className="mt-16 border-t-4 border-[#00363E]">
        <Link href="/">
          <div className="p-3 rounded-xl pt-8 flex items-center gap-4 transition-all duration-300 ease-out group transform active:scale-95 bg-transparent text-white font-normal ml-6 mr-2 translate-x-1">
            <Cog8ToothIcon className="size-6" />
            <span className="text-md">Configuración</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
