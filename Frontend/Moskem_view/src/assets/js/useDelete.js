import Swal from "sweetalert2";
import { API } from "./global";
export function useDelete({ruta,setData }) {
    const deleteRecord = async ( id ) => {
      try {
        Swal.fire({
          title: "Confirmar acción",
          text: "¿Estás seguro de que deseas eliminar este registro?",
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#cc4224",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#31b65c",
          confirmButtonText: "Eliminar",
          showConfirmButton: true,
        }).then(async (result) => {
          if (result.isConfirmed) {
            const response = await fetch(`${API}${ruta}/${id}`, {
              method: "DELETE",
            });

            if (response.ok) {
              const responseData = await response.json();

              Swal.fire({
                toast: true,
                position: "top-end",
                title: responseData.message || "Eliminado correctamente",
                icon: "success",
                showConfirmButton: false,
                timer: 3000,
              });

              // Si la respuesta fue exitosa, filtramos el estado local
              if (setData) {
                setData((prevData) =>
                  prevData.filter((item) => item.id !== id),
                );
              }
            } else {
              // Opcional: Manejar errores de respuesta del servidor (ej. código 400 o 500)
              Swal.fire({
                title: "Error",
                text: "No se pudo eliminar el registro.",
                icon: "error",
              });
            }
          }
        });
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    };

    // Retornamos la función para que pueda ser usada en los componentes
    return { deleteRecord };
}
