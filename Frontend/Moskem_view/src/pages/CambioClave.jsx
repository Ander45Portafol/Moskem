import { useState } from "react";
import Swal from "sweetalert2";
import { Link, useLocation, useNavigate } from "react-router";
import {
  ArrowPathIcon,
  ChevronLeftIcon
} from "@heroicons/react/24/solid";
import { API } from "../assets/js/global";
import { RequirementItem } from "../components/RequirementItem";

export function CambioClave() {
  const location = useLocation();
  const navigate = useNavigate();

  const usuario = location.state?.usuario || "";
  const codigo = location.state?.codigo || "";

  const [passwords, setPasswords] = useState({
    clave: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Reglas OWASP (Ajustado a mínimo 8 caracteres)
  const validationRules = {
    length: passwords.clave.length >= 8,
    hasUpper: /[A-Z]/.test(passwords.clave),
    hasLower: /[a-z]/.test(passwords.clave),
    hasNumber: /\d/.test(passwords.clave),
    hasSpecial: /[@$!%*?&._\-\W]/.test(passwords.clave),
  };

  const isPasswordValid = Object.values(validationRules).every(Boolean);

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitChangePassword = async (e) => {
    e.preventDefault();

    // Validar que la contraseña cumpla los criterios
    if (!isPasswordValid) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña poco segura",
        text: "La contraseña debe tener al menos 8 caracteres e incluir mayúsculas, minúsculas, números y un símbolo especial.",
        confirmButtonColor: "#004053",
      });
      return;
    }

    // Validar coincidencia
    if (passwords.clave !== passwords.confirm_password) {
      Swal.fire({
        icon: "warning",
        title: "Las contraseñas no coinciden",
        text: "Asegúrate de escribir la misma contraseña en ambos campos.",
        confirmButtonColor: "#004053",
      });
      return;
    }

    setLoading(true);
    Swal.fire({
      title: "Actualizando contraseña...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const response = await fetch(`${API}resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          usuario: usuario,
          codigo: codigo,
          clave: passwords.clave,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cambiar la contraseña.");
      }
      // Alerta de exito
      await Swal.fire({
        icon: "success",
        title: "¡Contraseña cambiada!",
        text: data.message,
        confirmButtonColor: "#004053",
      });

      navigate("/");
    } catch (err) {
      //Alerta de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
        confirmButtonColor: "#004053",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[url('../../public/images/fondo_cuadros.png')] bg-cover flex justify-center items-center overflow-y-auto">
      <Link to="/">
        <button className="absolute top-6 left-6 flex items-center gap-2 font-bold text-white hover:opacity-80 transition-opacity">
          <ChevronLeftIcon className="size-7" /> Regresar
        </button>
      </Link>
      <div className="w-2/5 bg-white rounded-2xl flex justify-center my-8 pb-10 shadow-lg">
        <div className="flex-col w-full">
          <div className="w-full flex justify-center">
            <img src="/images/MoskemLogo2.jpg" alt="moskem_logo2" />
          </div>

          <div className="mt-2 px-20 flex-col">
            <h1 className="text-[#004053] font-extrabold text-2xl">
              Cambio de contraseña
            </h1>
            <p className="text-[#004053] font-normal text-sm mt-2">
              Bienvenido al proceso de cambio de contraseña, en esta sección
              deberá colocar su nueva contraseña para el usuario{" "}
              <span className="font-bold">{usuario}</span>.
            </p>

            {message && (
              <div className="mt-4 p-3 bg-emerald-600/80 rounded-lg text-sm text-white font-medium text-center">
                {message}
              </div>
            )}
            {error && (
              <div className="mt-4 p-3 bg-rose-600/80 rounded-lg text-sm text-white font-medium text-center">
                {error}
              </div>
            )}

            <form className="flex-col" onSubmit={handleSubmitChangePassword}>
              <div className="mt-6 flex-col">
                <label
                  htmlFor="clave1"
                  className="font-bold text-lg text-[#004053]"
                >
                  Nueva contraseña
                </label>
                <input
                  id="clave1"
                  name="clave"
                  type="password"
                  value={passwords.clave}
                  onChange={handleChange}
                  required
                  className="w-full text-[#004053] font-normal text-md bg-[#D9D9D9] h-10 p-6 rounded-xl mt-2 outline-none"
                />

                {/* Requisitos dinámicos */}
                {passwords.clave.length > 0 && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                    <p className="font-semibold text-[#004053] mb-1">
                      Requisitos de contraseña:
                    </p>
                    <RequirementItem
                      isValid={validationRules.length}
                      label="Mínimo 8 caracteres"
                    />
                    <RequirementItem
                      isValid={validationRules.hasUpper}
                      label="Al menos una letra mayúscula"
                    />
                    <RequirementItem
                      isValid={validationRules.hasLower}
                      label="Al menos una letra minúscula"
                    />
                    <RequirementItem
                      isValid={validationRules.hasNumber}
                      label="Al menos un número"
                    />
                    <RequirementItem
                      isValid={validationRules.hasSpecial}
                      label="Al menos un símbolo (@, $, !, %, *, ?, &, etc.)"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 flex-col">
                <label
                  htmlFor="clave2"
                  className="font-bold text-lg text-[#004053]"
                >
                  Confirmar contraseña
                </label>
                <input
                  id="clave2"
                  name="confirm_password"
                  type="password"
                  value={passwords.confirm_password}
                  onChange={handleChange}
                  required
                  className="w-full text-[#004053] font-normal text-md bg-[#D9D9D9] h-10 p-6 rounded-xl mt-2 outline-none"
                />
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#BCCF00] w-48 h-12 rounded-xl font-bold text-[#004053] flex justify-center items-center gap-2 disabled:opacity-50 hover:bg-[#a6b800] transition-colors"
                >
                  <ArrowPathIcon
                    className={`size-6 ${loading ? "animate-spin" : ""}`}
                  />
                  {loading ? "Cambiando..." : "Cambiar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}