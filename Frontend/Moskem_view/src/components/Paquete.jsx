export function Paquete({
  id,
  guardarId,
  isSelected,
  isDisabled,
  nombre,
  list,
}) {
  return (
    <div
      onClick={() => {
        if (!isDisabled) guardarId();
      }}
      className={`border rounded-2xl p-4 transition-all ${
        isDisabled
          ? "opacity-50 grayscale cursor-not-allowed pointer-events-none bg-gray-100" // 👈 Estilos de bloqueo
          : isSelected
            ? "border-[#004B57] bg-[#004B57]/10 shadow-lg cursor-pointer"
            : "border-gray-300 hover:border-[#004B57] cursor-pointer"
      }`}
    >
      <h4 className="font-bold text-lg text-[#004053]">{nombre}</h4>
      <ul className="text-sm mt-2 list-disc list-inside text-gray-600">
        {list?.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
