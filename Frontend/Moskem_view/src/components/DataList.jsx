export function DataList({text,textId,dataList,valueData,updateData}){
    return (
      <div>
        <label
          style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}
        >
          {text}
        </label>

        {/* El input se conecta al datalist mediante el atributo list */}
        <input
          list="lista-telas"
          value={valueData}
                onChange={updateData}
                name={textId}
                id={textId}
          placeholder="Escribe el codigo de tela."
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        {/* El datalist contiene las opciones que se filtrarán automáticamente */}
        <datalist id="lista-telas">
          {dataList.map((tela) => (
            // Al poner el código y el nombre en el "value", el usuario puede buscar por cualquiera de los dos
            <option
              key={tela.id}
              value={"#"+tela.nombre}
            />
          ))}
        </datalist>
      </div>
    );
}