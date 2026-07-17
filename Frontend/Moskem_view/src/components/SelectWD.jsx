import { ChevronDownIcon } from "@heroicons/react/24/solid";

export function SelectWD({ text, textId, options, updateData, valueData }) {
  return (
    <div className="flex flex-col gap-1.5 relative w-66">
      <label className="text-md font-semibold text-[#004B57] ">{text}</label>
      <div className="relative">
        <select
          className="w-full bg-[#D9D9D9]/50 border-none rounded-lg p-2 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all appearance-none pr-10"
          id={textId}
          name={textId}
          onChange={updateData}
          value={valueData}
        >
          <option value="">Seleccione una opción</option>
          {options &&
            options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.nombre}
              </option>
            ))}
        </select>
        <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#004B57]">
          <ChevronDownIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
