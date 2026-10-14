import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import {
  ChevronLeftIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import { API } from "../assets/js/global";

export function Recuperacion() {
  const navigate = useNavigate();

  // Estado para solicitar código
  const [formData, setFormData] = useState({
    usuario: "",
    correo_empleado: "",
  });

  // Estado de los 6 dígitos del PIN
  const [code, setCode] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);

  // Estados UI
  const [loadingCode, setLoadingCode] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  // Manejador para inputs de usuario/correo
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar solicitud de código al correo
  const handleSubmitSendCode = async (e) => {
    e.preventDefault();

    // Alerta de carga mientras envía el correo
    Swal.fire({
      title: "Enviando código...",
      text: "Por favor espera un momento.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setLoadingCode(true);

    try {
      const response = await fetch(`${API}sendResetCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Ocurrió un error inesperado al enviar el código.",
        );
      }

      // Alerta de éxito
      Swal.fire({
        icon: "success",
        title: "¡Código Enviado!",
        text:
          data.message ||
          "Se ha enviado el código de verificación a tu correo.",
        confirmButtonColor: "#004053",
      });

      setTimeout(() => inputRefs.current[0]?.focus(), 300);
    } catch (err) {
      // Alerta de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
        confirmButtonColor: "#004053",
      });
    } finally {
      setLoadingCode(false);
    }
  };
  // Lógica de los 6 inputs independientes
  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setCode(digits);
      inputRefs.current[5]?.focus();
    }
  };

  // 2. Validar el PIN de 6 dígitos enviado por el usuario
  const handleSubmitVerifyCode = async (e) => {
    e.preventDefault();

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      Swal.fire({
        icon: "warning",
        title: "Código incompleto",
        text: "Por favor ingresa el código completo de 6 dígitos.",
        confirmButtonColor: "#004053",
      });
      return;
    }

    // Alerta de carga mientras se valida
    Swal.fire({
      title: "Validando código...",
      text: "Verificando la información.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setLoadingVerify(true);

    try {
      const response = await fetch(`${API}verifyResetCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          usuario: formData.usuario,
          codigo: fullCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Código incorrecto o expirado.");
      }

      // Notificación rápida antes de redirigir
      await Swal.fire({
        icon: "success",
        title: "¡Código Validado!",
        text: "Código correcto. Redirigiendo...",
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirección al segundo componente pasando el usuario y el código
      navigate("/cambio_contraseña", {
        state: { usuario: formData.usuario, codigo: fullCode },
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Validación Fallida",
        text: err.message,
        confirmButtonColor: "#004053",
      });
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[url('../../public/images/fondo_cuadros.png')] bg-cover flex justify-center items-center overflow-y-auto">
      <Link to="/">
        <button className="absolute top-6 left-6 flex items-center gap-2 font-bold text-white hover:opacity-80 transition-opacity">
          <ChevronLeftIcon className="size-7" /> Regresar
        </button>
      </Link>
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
              ingresar su correo electrónico y usuario. Se validará la
              información y se enviará un código de verificación.
            </p>

            {/* Formulario 1: Enviar correo */}
            <form className="flex-col" onSubmit={handleSubmitSendCode}>
              <div className="mt-6 flex-col">
                <label
                  htmlFor="usuario"
                  className="font-bold text-lg text-[#004053]"
                >
                  Usuario
                </label>
                <input
                  id="usuario"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  required
                  type="text"
                  className="w-full text-[#004053] font-normal text-md bg-[#D9D9D9] h-10 p-6 rounded-xl mt-2 outline-none"
                />
              </div>
              <div className="mt-4 flex-col">
                <label
                  htmlFor="correo"
                  className="font-bold text-lg text-[#004053]"
                >
                  Correo electrónico
                </label>
                <input
                  id="correo"
                  name="correo_empleado"
                  value={formData.correo_empleado}
                  onChange={handleChange}
                  required
                  type="email"
                  className="w-full text-[#004053] font-normal text-md bg-[#D9D9D9] h-10 p-6 rounded-xl mt-2 outline-none"
                />
              </div>
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  disabled={loadingCode}
                  className="bg-[#BCCF00] w-48 h-12 rounded-xl font-bold text-[#004053] flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="size-6" />
                  {loadingCode ? "Enviando..." : "Enviar código"}
                </button>
              </div>
            </form>

            {/* Formulario 2: Validar Código */}
            <form className="mt-6 flex-col" onSubmit={handleSubmitVerifyCode}>
              <label className="font-bold text-lg text-[#004053]">Código</label>

              <div className="flex mt-2 gap-4 justify-center">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-14 bg-white text-[#004053] font-semibold text-xl border-b-5 h-10 p-1 mt-2 outline-none text-center"
                  />
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  disabled={loadingVerify}
                  className="flex justify-center items-center bg-[#BCCF00] w-48 h-12 rounded-xl font-bold text-[#004053] gap-2 disabled:opacity-50"
                >
                  <ShieldCheckIcon className="size-6" />
                  {loadingVerify ? "Validando..." : "Validar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}