import { useState } from "react";

export function SwitchD({ valueData, text, textId, updateData }) {
    const isChecked = !valueData;

    const handleChange = () => {
      if (updateData) {
        updateData({
          target: {
            name: textId,
            type: "checkbox",
            checked: isChecked,
            value: isChecked, // Enviamos ambos por seguridad
          },
        });
      }
    };
  return (
    <div className="flex flex-col gap-1.5 mt-2">
      {/* 1. Un checkbox HTML estándar, que ocultamos con Tailwind */}
      <label className="text-md font-semibold text-[#004B57] ">{text}</label>
      <input
        type="checkbox"
        id={textId}
        name={textId}
        className="sr-only" // 'sr-only' oculta el elemento pero lo mantiene accesible para lectores de pantalla
              checked={!isChecked}
              value={!isChecked}
        onChange={handleChange}
      />

      {/* 2. La Label que funciona como el riel del Switch */}
      <label
        htmlFor={textId}
        className={`relative flex h-7 w-20 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
          !isChecked ? "bg-[#006272]" : "bg-neutral-600"
        }`}
      >
        {/* 3. El Span que funciona como la bolita deslizante */}
        <span
          className={`h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                !isChecked ? "translate-x-13" : "translate-x-0"
          }`}
        />
      </label>
    </div>
  );
}
