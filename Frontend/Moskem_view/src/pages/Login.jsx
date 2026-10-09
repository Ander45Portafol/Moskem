import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../Context/AuthContext";

export default function Login() {
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
    <div className="font-poppins flex w-full h-screen overflow-hidden bg-[#004053]">
      <div className="w-2/5 hidden lg:block lg:bg-[url('../../public/images/Imagen_login2.png')] bg-cover"></div>
      <div className="w-full lg:w-3/5 bg-gradient-to-b from-[#004053] via-[#10566B] to-[#B2B2B2] flex-col">
        <div className="flex justify-end w-full mt-4">
          <img
            src="/images/logo_blanco.svg"
            alt="moskem_menswear"
            className="w-84 h-auto object-contain"
          />
        </div>
        <div className="flex justify-center mt-4">
          <div className="flex-col text-white">
            <h1 className="text-5xl font-bold">Inicio de sesión</h1>
            <p className="mt-2 font-normal text-lg">
              ¡Bienvenido a grupo Moskem!
            </p>
            <p className=" text-xl">
              Ingrese todas sus credenciales para poder acceder a su perfil.
            </p>
            {errorMsg && (
              <div className="mt-6 mr-10 rounded-lg bg-red-100 border border-red-400 p-4 text-red-700 text-sm font-semibold">
                {errorMsg}
              </div>
            )}
            <form className="flex-col" onSubmit={handleSubmit}>
              <div className="mt-10 flex-col">
                <label htmlFor="" className="font-bold text-lg">
                  Usuario
                </label>
                <input
                  type="text"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  required
                  className="w-full text-[#004053] font-semibold text-xl bg-[#D9D9D9] h-14 p-6 rounded-xl mt-3"
                />
              </div>
              <div className="mt-6 flex-col">
                <label htmlFor="" className="font-bold text-xl">
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
                  <p className="text-sm text-white font-semibold cursor-pointer hover:underline hover:text-[#D9D9D9]">
                    ¿Olvidaste tu contraseña?
                  </p>
                </Link>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#BCCF00] text-[#004053] text-xl font-bold w-2/3 mt-10 rounded-lg py-3 hover:bg-[#A1AD2A]"
                >
                  {isSubmitting ? "Cargando..." : "Iniciar sesión"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
