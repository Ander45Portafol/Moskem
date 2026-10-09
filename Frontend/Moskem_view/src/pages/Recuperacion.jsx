import { ChevronLeftIcon, PaperAirplaneIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router";

export function Recuperacion() {
  return (
    // 1. Agregamos relative al contenedor principal
    <div className="relative w-full h-screen bg-[url('../../public/images/fondo_cuadros.png')] bg-cover flex justify-center items-center overflow-y-auto">
      {/* 2. Botón posicionado absolutamente en la esquina superior izquierda */}
      <Link to="/">
        <button className="absolute top-6 left-6 flex items-center gap-2 font-bold text-white hover:opacity-80 transition-opacity">
          <ChevronLeftIcon className="size-7" /> Regresar
        </button>
      </Link>

      {/* Tarjeta central */}
      <div className="w-2/5 bg-white rounded-2xl flex justify-center my-8 pb-10">
        <div className="flex-col w-full">
          <div className="w-full flex justify-center">
            <img src="/images/MoskemLogo2.jpg" alt="moskem_logo2" />
          </div>
          <div className="mt-2 px-20 flex-col">
            <h1 className="text-[#004053] font-extrabold text-2xl">
              Restablecimiento de contraseña
            </h1>
            <p className="text-[#004053] font-normal text-sm mt-2">
              Para realizar el proceso de restablecimiento de contraseña debe
              ingresar su correo electronico y usuario, se validará la
              información y se enviará un código de verificación, luego se
              deberá ingresar ese codigo en el espacio correspondiente
            </p>
            <div className="mt-8 flex-col">
              <label
                htmlFor="usuario"
                className="font-bold text-lg text-[#004053]"
              >
                Usuario
              </label>
              <input
                id="usuario"
                type="text"
                className="w-full text-[#004053] font-semibold text-xl bg-[#D9D9D9] h-10 p-6 rounded-xl mt-2 outline-none"
              />
            </div>
            <div className="mt-6 flex-col">
              <label
                htmlFor="correo"
                className="font-bold text-lg text-[#004053]"
              >
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                className="w-full text-[#004053] font-semibold text-xl bg-[#D9D9D9] h-10 p-6 rounded-xl mt-2 outline-none"
              />
            </div>
            <div className="flex justify-center mt-4">
              <button className="bg-[#BCCF00] w-48 h-12 rounded-xl font-bold text-[#004053] flex justify-center items-center gap-2">
                <PaperAirplaneIcon className="size-6" />
                Enviar
              </button>
            </div>
            <div className="mt-6 flex-col">
              <label
                htmlFor="correo"
                className="font-bold text-lg text-[#004053]"
              >
                Código
              </label>
              <div className="flex mt-2 gap-4 justify-center">
                <input
                  type="text"
                  className="w-14 bg-white
                   text-[#004053] font-semibold text-xl border-b-5 h-10 p-1 mt-2 outline-none text-center"
                />
                <input
                  type="text"
                  className="w-14 bg-white
                   text-[#004053] font-semibold text-xl border-b-5 h-10 p-1 mt-2 outline-none text-center"
                />
                <input
                  type="text"
                  className="w-14 bg-white
                   text-[#004053] font-semibold text-xl border-b-5 h-10 p-1 mt-2 outline-none text-center"
                />
                <input
                  type="text"
                  className="w-14 bg-white
                   text-[#004053] font-semibold text-xl border-b-5 h-10 p-1 mt-2 outline-none text-center"
                />
                <input
                  type="text"
                  className="w-14 bg-white
                   text-[#004053] font-semibold text-xl border-b-5 h-10 p-1 mt-2 outline-none text-center"
                />
                <input
                  type="text"
                  className="w-14 bg-white
                   text-[#004053] font-semibold text-xl border-b-5 h-10 p-1 mt-2 outline-none text-center"
                />
              </div>
              <div className="flex justify-center mt-8">
                <button className="flex justify-center items-center bg-[#BCCF00] w-48 h-12 rounded-xl">
                  <ShieldCheckIcon className="size-6"/>
                  Validar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
