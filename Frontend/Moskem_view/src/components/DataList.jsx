import { useState, useEffect } from "react";

export function DataList({ text, textId, dataList, valueData, updateData }) {
  // Estado local para el texto que ve el usuario en el input
  const [textoMostrar, setTextoMostrar] = useState("");

  // Sincronizar la vista si valueData (el ID) cambia desde el padre
  useEffect(() => {
    if (!valueData) {
      setTextoMostrar("");
      return;
    }

    // Buscamos si valueData es un ID existente en la lista
    const seleccionada = dataList.find((item) => item.id === valueData);

    if (seleccionada) {
      setTextoMostrar(`#${seleccionada.nombre}`);
    } else {
      // Si por alguna razón viene un texto o ID no encontrado, lo dejamos visible
      setTextoMostrar(valueData);
    }
  }, [valueData, dataList]);

  const handleChange = (e) => {
    const valorIngresado = e.target.value;
    setTextoMostrar(valorIngresado);

    // Buscar si lo que escribió/seleccionó coincide con alguna opción
    const opcionEncontrada = dataList.find(
      (item) => `#${item.nombre}` === valorIngresado,
    );

    // Si coincide mandamos el ID, de lo contrario enviamos lo que lleva digitado
    const idAEnviar = opcionEncontrada ? opcionEncontrada.id : valorIngresado;

    // Notificamos al formulario padre con la estructura de evento nativa
    updateData({
      target: {
        name: textId,
        value: idAEnviar,
      },
    });
  };

  return (
    <div className="flex flex-col">
      <label
        htmlFor={textId}
        className="text-md font-semibold text-[#004B57] mb-1.5 block"
      >
        {text}
      </label>

      <input
        list={`lista-${textId}`}
        value={textoMostrar}
        onChange={handleChange}
        name={textId}
        id={textId}
        placeholder="Escribe el código de tela."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#004053] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004B57] focus:border-transparent transition-all bg-[#d9d9d9]"
      />

      <datalist id={`lista-${textId}`}>
        {dataList.map((tela) => (
          <option key={tela.id} value={`#${tela.nombre}`} />
        ))}
      </datalist>
    </div>
  );
}
