import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../Context/AuthContext";

export default function Login2() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Estado para capturar las credenciales
  const [formData, setFormData] = useState({
    usuario: "",
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
      await login(formData);
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
    <div className="relative font-poppins w-full h-screen overflow-hidden flex justify-end">
      {/* Imagen de fondo anclada a la izquierda */}
      <img
        src="/images/imagen.jpg"
        alt="Fondo Sastrería"
        className="absolute inset-0 w-full h-full object-cover object-left -z-10"
      />

      {/* Contenedor del Formulario a la derecha */}
      <div className="w-full lg:w-3/10 xl:pt-10 xl:px-6 rounded-l-4xl h-full flex justify-center z-10 bg-gradient-to-b from-[#004053] via-[#006272] to-[#00A29B] text-white">
        <form onSubmit={handleSubmit} className="flex-col p-6 w-full">
          <div className="flex justify-center">
            <img
              src="/images/logo_blanco.svg"
              alt="moskem_menswear"
              className="w-84 h-auto object-contain"
            />
          </div>

          <div className="flex-col">
            <h1 className="font-extrabold text-2xl">Iniciar sesión</h1>
            <p className="font-normal text-sm">
              Ingrese todas sus credenciales para poder acceder a su perfil.
            </p>
            <div className="mt-10 flex-col">
              <label htmlFor="" className="font-bold text-md">
                Usuario
              </label>
              <input
                type="text"
                name="usuario"
                required
                value={formData.usuario}
                onChange={handleChange}
                className="w-full text-[#004053] font-semibold text-xl bg-[#D9D9D9] h-14 p-6 rounded-xl mt-3"
              />
            </div>
            <div className="mt-4 flex-col">
              <label htmlFor="" className="font-bold text-md">
                Contraseña
              </label>
              <input
                type="password"
                name="clave"
                value={formData.clave}
                onChange={handleChange}
                required
                className="w-full text-[#004053] font-semibold text-xl bg-[#D9D9D9] h-14 p-6 rounded-xl mt-3"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Link to="/recuperar_contraseña">
                <p className="text-xs text-white font-semibold cursor-pointer hover:underline hover:text-[#D9D9D9]">
                  ¿Olvidaste tu contraseña?
                </p>
              </Link>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#BCCF00] text-[#004053] text-lg font-bold w-1/2 mt-10 rounded-lg py-2 hover:bg-[#A1AD2A]"
              >
                {isSubmitting ? "Cargando..." : "Iniciar sesión"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
