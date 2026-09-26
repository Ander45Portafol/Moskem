import { useState, useEffect } from "react";

export function DataList({
  text,
  textId,
  dataList = [],
  valueData,
  updateData,
  nametag,
  disabled,
}) {
  const [textoMostrar, setTextoMostrar] = useState("");

  useEffect(() => {
    if (!valueData) {
      setTextoMostrar("");
      return;
    }

    const seleccionada = dataList.find(
      (item) => String(item.id) === String(valueData),
    );

    setTextoMostrar(seleccionada ? seleccionada.nombre : "");
  }, [valueData, dataList]);

  const handleChange = (e) => {
    const valorIngresado = e.target.value;
    setTextoMostrar(valorIngresado);

    // Buscar coincidencia exacta por nombre o por ID
    const opcionEncontrada = dataList.find(
      (item) =>
        item.nombre === valorIngresado || String(item.id) === valorIngresado,
    );

    if (opcionEncontrada) {
      updateData({
        target: {
          name: nametag, // Usamos directamente nametag ("id_producto")
          value: opcionEncontrada.id,
        },
      });
    } else if (valorIngresado === "") {
      updateData({
        target: {
          name: nametag,
          value: "",
        },
      });
    }
  };

  const listId = `lista-${textId || nametag || "datalist"}`;

  return (
    <div className="flex flex-col">
      <label className="text-md font-semibold text-[#004B57] mb-1.5 block">
        {text}
      </label>

      <input
        list={listId}
        value={textoMostrar}
        onChange={handleChange}
        name={nametag}
        disabled={disabled}
        placeholder="Seleccione un producto..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#004053] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004B57] focus:border-transparent transition-all bg-[#d9d9d9] disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <datalist id={listId}>
        {dataList.map((item) => (
          <option key={item.id} value={item.nombre} />
        ))}
      </datalist>
    </div>
  );
}