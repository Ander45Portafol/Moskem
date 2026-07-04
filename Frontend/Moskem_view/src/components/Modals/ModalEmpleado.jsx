import React, { useEffect, useState } from 'react';

export default function ModalEmpleado({ isOpen, onClose, formData, onChange, onSave }) {
    const [render, setRender] = useState(isOpen);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setRender(true);
            // Pequeño delay para que el navegador registre el cambio de estado y ejecute la animación de entrada
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            // Espera a que termine la animación de salida (300ms) antes de desmontar el componente
            const timer = setTimeout(() => setRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!render) return null;

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
                isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {/* Tarjeta del Modal con animación de escala y opacidad */}
            <div 
                className={`bg-white w-[900px] max-w-[95vw] rounded-[32px] p-10 shadow-2xl relative flex flex-col gap-8 transition-all duration-300 transform ${
                    isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
            >
                
                {/* Botón Cerrar (X) arriba a la derecha */}
                <button 
                    type="button"
                    onClick={onClose}
                    className="absolute top-8 right-8 text-[#004B57] hover:scale-110 transition-transform"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Encabezado del Modal */}
                <div>
                    <h2 className="text-4xl font-black text-[#004B57] tracking-wide uppercase">
                        Formulario - Empleados
                    </h2>
                </div>

                {/* Formulario estructurado en Grid de 3 columnas */}
                <form onSubmit={onSave} className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                        
                        {/* Nombres */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#004B57] font-bold text-base">Nombres</label>
                            <input 
                                type="text" 
                                name="nombres"
                                value={formData.nombres || ''}
                                onChange={onChange}
                                required
                                className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 px-4 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
                            />
                        </div>

                        {/* Apellidos */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#004B57] font-bold text-base">Apellidos</label>
                            <input 
                                type="text" 
                                name="apellidos"
                                value={formData.apellidos || ''}
                                onChange={onChange}
                                required
                                className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 px-4 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
                            />
                        </div>

                        {/* Código Empleado */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#004B57] font-bold text-base">Código Empleado</label>
                            <input 
                                type="text" 
                                name="codigo"
                                value={formData.codigo || ''}
                                onChange={onChange}
                                className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 px-4 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
                            />
                        </div>

                        {/* Tipo Empleado */}
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-[#004B57] font-bold text-base">Tipo Empleado</label>
                            <div className="relative">
                                <select 
                                    name="tipo"
                                    value={formData.tipo || ''}
                                    onChange={onChange}
                                    required
                                    className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 pl-4 pr-10 text-gray-500 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none appearance-none"
                                >
                                    <option value="" disabled hidden>Seleccione una opción</option>
                                    <option value="Sastre">Sastre</option>
                                    <option value="Vendedor">Vendedor</option>
                                    <option value="Administrador">Administrador</option>
                                </select>
                                <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#004B57]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* DUI */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#004B57] font-bold text-base">DUI</label>
                            <input 
                                type="text" 
                                name="dui"
                                placeholder="00000000-0"
                                value={formData.dui || ''}
                                onChange={onChange}
                                className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 px-4 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
                            />
                        </div>

                        {/* Usuario */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#004B57] font-bold text-base">Usuario</label>
                            <input 
                                type="text" 
                                name="usuario"
                                value={formData.usuario || ''}
                                onChange={onChange}
                                className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 px-4 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
                            />
                        </div>

                        {/* Correo Electrónico */}
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-[#004B57] font-bold text-base">Correo Electronico</label>
                            <input 
                                type="email" 
                                name="correo"
                                value={formData.correo || ''}
                                onChange={onChange}
                                className="w-full bg-[#D9D9D9]/50 border-none rounded-xl py-3 px-4 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none"
                            />
                        </div>
                    </div>

                    {/* Botón Guardar / Editar */}
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="bg-[#C1D700] hover:bg-[#adc000] text-[#004B57] font-bold py-3 px-8 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95 text-base"
                        >
                            <svg xmlns="http://www.w3.org/2000/xl" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                            Editar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}