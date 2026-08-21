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

    if (seleccionada) {
      setTextoMostrar(`#${seleccionada.nombre}`);
    } else {
      // Si la tela seleccionada previamente no existe en la categoría actual, limpia el input
      setTextoMostrar("");
    }
  }, [valueData, dataList]);

  const handleChange = (e) => {
    const valorIngresado = e.target.value;
    setTextoMostrar(valorIngresado);

    // Buscar coincidencia en la lista
    const opcionEncontrada = dataList.find(
      (item) =>
        `#${item.nombre}` === valorIngresado ||
        item.nombre === valorIngresado ||
        String(item.id) === valorIngresado,
    );

    if (opcionEncontrada) {
      updateData({
        target: {
          name: textId || nametag,
          value: opcionEncontrada.id,
        },
      });
    } else if (valorIngresado === "") {
      // Limpiar selección si se borra el texto
      updateData({
        target: {
          name: textId || nametag,
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
        list={listId} // CORRECCIÓN: Vinculación con el datalist
        value={textoMostrar}
        onChange={handleChange}
        name={nametag}
        disabled={disabled}
        placeholder="Escribe el código de tela."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#004053] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004B57] focus:border-transparent transition-all bg-[#d9d9d9] disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <datalist id={listId}>
        {" "}
        {/* CORRECCIÓN: Se agrega el id obligatorio */}
        {dataList.map((tela) => (
          <option key={tela.id} value={`#${tela.nombre}`} />
        ))}
      </datalist>
    </div>
  );
}
