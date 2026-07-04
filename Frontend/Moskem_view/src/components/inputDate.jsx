export function InputDate({ text}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-md font-semibold text-[#004B57]">
        Fecha Nacimiento
      </label>
      <input
        type="date"
        className="w-full bg-[#D9D9D9]/50 border-none rounded-lg p-2 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all"
      />
    </div>
  );
}
