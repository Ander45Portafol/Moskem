import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../Context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Estado para capturar las credenciales
  const [formData, setFormData] = useState({
    correo_electronico: "",
    clave: "",
  });

  // Estados para errores y carga
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Manejador del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      await login(formData.correo_electronico, formData.clave);
      // Redirige al panel correspondiente una vez autenticado
      navigate("/admin");
    } catch (err) {
      // Captura el mensaje de error retornado por Laravel
      if (err.data && err.data.error) {
        setErrorMsg(err.data.error);
      } else {
        setErrorMsg("Ocurrió un error inesperado al intentar iniciar sesión.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-poppins flex h-screen overflow-hidden">
      <div className="h-full w-1/2 rounded-r-4xl bg-[#006272] pt-32 pl-10 text-start">
        <h3 className="text-5xl font-extrabold text-white">
          ¡Bienvenidos a MOSKEM!
        </h3>
        <div className="flex-col pt-14 text-start text-white">
          <p className="text-3xl font-extrabold">Iniciar sesión</p>
          <p className="text-md gap-8 font-sm">
            Ingrese todas sus credenciales para poder acceder a su perfil
          </p>
        </div>

        {/* Mensaje de error dinámico de Laravel */}
        {errorMsg && (
          <div className="mt-6 mr-10 rounded-lg bg-red-100 border border-red-400 p-4 text-red-700 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="h-full flex-col pt-6 font-bold"
        >
          <div className="h-30 w-full">
            <p className="text-lg text-white">Correo Electrónico</p>
            <input
              type="email"
              name="correo_electronico"
              value={formData.correo_electronico}
              onChange={handleChange}
              placeholder="ejemplo@moskem.com"
              required
              className="mt-3 h-14 w-10/11 rounded-lg bg-[#B2B2B2] border-none px-6 text-gray-900 focus:outline-none placeholder-gray-600"
            />
          </div>

          <div className="h-28 w-full">
            <p className="text-xl text-white">Contraseña</p>
            <input
              type="password"
              name="clave"
              value={formData.clave}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="mt-3 h-14 w-10/11 border-none rounded-lg bg-[#B2B2B2] px-6 text-gray-900 focus:outline-none placeholder-gray-600"
            />
          </div>

          <div className="w-full text-end">
            <p className="mr-20 text-sm text-[#B2B2B2] cursor-pointer hover:underline">
              ¿Olvidaste tu contraseña?
            </p>
          </div>

          <div className="flex h-30 w-full items-center justify-center pr-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-54 rounded-xl bg-[#00A29B] text-xl font-extrabold text-[#004053] hover:bg-[#008f88] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Cargando..." : "Iniciar sesión"}
            </button>
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