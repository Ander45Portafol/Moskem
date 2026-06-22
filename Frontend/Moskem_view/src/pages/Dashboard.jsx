import { useState } from "react";
import '../assets/css/calendar.css'
import Calendar from "react-calendar";
import {
  CalendarDaysIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
const datosEjemplo = [
  { name: "Lun", clientes: 12 },
  { name: "Mar", clientes: 19 },
  { name: "Mié", clientes: 15 },
  { name: "Jue", clientes: 27 },
  { name: "Vie", clientes: 22 },
  { name: "Sáb", clientes: 34 },
  { name: "Dom", clientes: 45 },
];

export function Dashboard() {
  const [fecha, setFecha] = useState(new Date());

  return (
    <div className="flex">
      {/* Fila Central (Tarjetas + Gráfico) */}
      <div className="flex-1 p-10 flex flex-col gap-8">
        {/* Encabezado de Bienvenida */}
        <div>
          <h1 className="text-3xl font-bold text-[#004B57]">
            Buenos días, Diego Vasconcelos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            En esta pantalla se muestra un resumen de todos los datos de hoy.
          </p>
        </div>

        {/* FILA DE TARJETAS DE ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tarjeta 1: Citas de Hoy */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Citas Hoy
              </span>
              <span className="p-2 bg-[#009BAE]/10 rounded-xl text-[#009BAE]">
                <CalendarDaysIcon className="w-6 h-6" />
              </span>
            </div>
            <h3 className="text-3xl font-bold text-[#004B57]">12</h3>
            <p className="text-xs text-emerald-500 font-medium">
              ↑ 3 más que ayer
            </p>
          </div>

          {/* Tarjeta 2: Clientes Atendidos */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Atendidos
              </span>
              <span className="p-2 bg-[#004B57]/10 rounded-xl text-[#004B57]">
                <UserGroupIcon className="w-6 h-6" />
              </span>
            </div>
            <h3 className="text-3xl font-bold text-[#004B57]">45</h3>
            <p className="text-xs text-gray-400 font-medium">Meta diaria: 50</p>
          </div>

          {/* Tarjeta 3: Ingresos Estimados */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Ganancias
              </span>
              <span className="p-2 bg-emerald-50 rounded-xl text-emerald-500">
                <CurrencyDollarIcon className="w-6 h-6" />
              </span>
            </div>
            <h3 className="text-3xl font-bold text-[#004B57]">$340.00</h3>
            <p className="text-xs text-emerald-500 font-medium">
              ↑ 12% esta semana
            </p>
          </div>
        </div>

        {/* Gráfico Principal */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 h-[350px]">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-[#004B57] text-lg">
                Flujo de Clientes Semanal
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Resumen visual de asistencia en los últimos 7 días
              </p>
            </div>
            <span className="text-xs bg-[#009BAE]/10 text-[#009BAE] font-semibold px-2.5 py-1 rounded-full">
              En vivo
            </span>
          </div>

          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={datosEjemplo}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="colorClientes"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#009BAE" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#009BAE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F3F4F6"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#004B57",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                  }}
                  labelStyle={{
                    fontWeight: "bold",
                    color: "#B4D333",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="clientes"
                  stroke="#009BAE"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorClientes)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ================= PANEL DERECHO EXCLUSIVO DE ESTA PÁGINA ================= */}
      <div className="w-80 bg-white p-6 flex flex-col gap-6 h-screen justify-start">
        <div className="font-bold text-[#004B57] text-lg border-b border-gray-100 pb-3">
          Calendario de Citas
        </div>

        <div className="custom-calendar-container p-1 bg-transparent rounded-2xl border border-gray-100">
          <Calendar
            onChange={setFecha}
            value={fecha}
            locale="es-ES"
            className="w-full border-none bg-transparent font-sans"
            navigationLabel={({ date, locale }) => {
              const mes = date.toLocaleDateString(locale, {
                month: "long",
              });
              const anio = date.getFullYear();
              return `${mes} ${anio}`;
            }}
          />
        </div>

        <div className="mt-2 bg-[#00A29B] p-4 rounded-xl border border-[#004B57]/10">
          <span className="text-sm font-bold text-white uppercase tracking-wider block">
            Día seleccionado
          </span>
          <span className="text-sm font-semibold text-[#004053] capitalize mt-1 block">
            {fecha.toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
