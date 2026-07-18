import React from "react";
import { Link, useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="font-poppins flex h-screen overflow-hidden">
      <div className="h-full w-1/2 rounded-r-4xl bg-[#006272] pt-32 pl-10 text-start">
        <h3 className="text-5xl font-extrabold text-white">
          ¡Bienvenidos a MOSKEM!
        </h3>
        <div className="flex-col pt-14 text-start text-white">
          <p className="text-3xl font-extrabold">Iniciar sesion</p>
          <p className="text-md gap-8 font-sm">
            Ingrese todas sus credenciales para poder acceder a su perfil
          </p>
        </div>
        <form className="h-full flex-col pt-10 font-bold">
          <div className="h-30 w-full">
            <p className="text-lg text-white">Usuario</p>
            <input
              type="text"
              className="mt-5 h-14 w-10/11 rounded-lg bg-[#B2B2B2] border-none px-6"
            />
          </div>
          <div className="h-28 w-full">
            <p className="text-xl text-white">Contraseña</p>
            <input
              type="text"
              className="mt-5 h-14 w-10/11 border-none rounded-lg bg-[#B2B2B2] px-6"
            />
          </div>
          <div className="w-full text-end">
            <p className="mr-20 text-sm text-[#B2B2B2]">
              ¿Olvidaste tu constraseña?
            </p>
          </div>
          <div className="flex h-30 w-full items-center justify-center">
            <Link to="/admin">
              <button className="h-12 w-54 rounded-xl bg-[#00A29B] text-xl font-extrabold text-[#004053]">
                Iniciar sesion
              </button>
            </Link>
          </div>
        </form>
      </div>
      <div className="flex h-full w-1/2 justify-center">
        <div className="m-auto flex-col">
          <img
            src="/images/Logo.svg"
            alt="Moskem_image"
            className="mb-10 w-auto object-contain"
          />
          <img
            src="/images/singel.svg"
            alt="imagen_ilustrativa"
            className="m-auto w-auto"
          />
        </div>
      </div>
    </div>
  );
}
