import {
  ArrowRightEndOnRectangleIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  KeyIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "../Context/AuthContext";
import Swal from "sweetalert2";

export function Configuracion() {
  const { logout } = useAuth();
  const handleLogout = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Confirmar acción",
      text: "¿Estás seguro de salir del sitio?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#cc4224",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#31b65c",
      confirmButtonText: "Eliminar",
      showConfirmButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout();
      }
    });
  };

  return (
    <div className="flex-1 p-6 flex h-screen w-full flex-col gap-6">
      {/* Título de la sección */}
      <div>
        <h1 className="text-5xl font-black text-[#004053]">CONFIGURACIÓN</h1>
        <p className="text-[#004053] text-lg font-semibold mt-1">
          En está sección se encontrará todas las opciones extra que puede
          realizar del sistema.
        </p>
      </div>
      <div className="flex-col mt-10">
        <div className="border-4 border-[#006272] text-[#006272] w-full h-16 rounded-xl flex px-6">
          <div className="w-5/6 flex text-lg font-bold items-center justify-strech gap-6">
            <UserCircleIcon className="size-8" />
            Perfil de usuario
          </div>
          <div className="w-1/6 flex justify-end items-center">
            <button className="hover:bg-[#006272] hover:text-white w-8 flex justify-center items-center rounded-md">
              <ChevronRightIcon className="size-7" />
            </button>
          </div>
        </div>
        <div className="border-4 mt-4 border-[#006272] text-[#006272] w-full h-16 rounded-xl flex px-6">
          <div className="w-5/6 flex text-lg font-bold items-center justify-strech gap-6">
            <KeyIcon className="size-8" />
            Cambio de contraseña
          </div>
          <div className="w-1/6 flex justify-end items-center">
            <button className="hover:bg-[#006272] hover:text-white w-8 flex justify-center items-center rounded-md">
              <ChevronRightIcon className="size-7" />
            </button>
          </div>
        </div>
        <div className="border-4 mt-4 border-[#006272] text-[#006272] w-full h-16 rounded-xl flex px-6">
          <div className="w-5/6 flex text-lg font-bold items-center justify-strech gap-6">
            <QuestionMarkCircleIcon className="size-8" />
            Sobre MOSKEM
          </div>
          <div className="w-1/6 flex justify-end items-center">
            <button className="hover:bg-[#006272] hover:text-white w-8 flex justify-center items-center rounded-md">
              <ChevronRightIcon className="size-7" />
            </button>
          </div>
        </div>
        <div className=" mt-4 border-4 border-[#006272] text-[#006272] w-full h-16 rounded-xl flex px-6">
          <div className="w-5/6 flex text-lg font-bold items-center justify-strech gap-6">
            <InformationCircleIcon className="size-8" />
            Términos y condiciones
          </div>
          <div className="w-1/6 flex justify-end items-center">
            <button className="hover:bg-[#006272] hover:text-white w-8 flex justify-center items-center rounded-md">
              <ChevronRightIcon className="size-7" />
            </button>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 bg-[#C04F4F] hover:bg-[#782B2B] text-white w-full h-16 rounded-xl px-6 flex justify-center items-center gap-6 font-bold text-lg"
        >
          <ArrowRightEndOnRectangleIcon className="size-8" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
