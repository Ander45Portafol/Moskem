export function Paquete({ id,guardarId,isSelected,nombre, list}) {
  return (
    <div
      className={
        isSelected
          ? "flex flex-col text-center mt-4 mx-4 min-h-[9.5rem] w-68 bg-[#9E9E9E] hover:bg-[#9E9E9E] p-4 rounded-2xl transition-colors duration-200"
          : "flex flex-col text-center mt-4 mx-4 min-h-[9.5rem] w-68 bg-[#D9D9D9] hover:bg-[#9E9E9E] p-4 rounded-2xl transition-colors duration-200"
      }
      onClick={guardarId}
    >
      {/* Título Dinámico */}
      <h4 className="text-xl font-bold text-[#004053]">{nombre}</h4>

      {/* Lista Dinámica en Grid (2 Columnas) */}

      {/*<input type="text" className="hidden" name="id_paquete" value={id} />*/}
      <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-left font-normal text-[#004053] list-disc list-inside pt-3">
        {list.map((item, index) => (
          <li key={item.id || index} className="hitespace-nowrap ">
            {item.descripcion || item.nombre || item}
          </li>
        ))}
      </ul>
    </div>
  );
}
