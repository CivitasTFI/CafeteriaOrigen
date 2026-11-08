import { useEffect, useState } from "react";
import type { Productos } from "../api/esquemas/productos";
import { listarProductos } from "../api/productos";

type EstadoMenu =
  | { estado: "cargando" }
  | { estado: "listo"; productos: Productos }
  | { estado: "error"; mensaje: string };

export function useMenu() {
  const [estado, setEstado] = useState<EstadoMenu>({ estado: "cargando" });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;

    void listarProductos()
      .then((productos) => {
        if (activo) {
          setEstado({ estado: "listo", productos });
        }
      })
      .catch((error: unknown) => {
        if (activo) {
          setEstado({
            estado: "error",
            mensaje:
              error instanceof Error ? error.message : "No se pudo cargar el menú",
          });
        }
      });

    return () => {
      activo = false;
    };
  }, [intento]);

  function reintentar() {
    setEstado({ estado: "cargando" });
    setIntento((intentoActual) => intentoActual + 1);
  }

  return { estado, reintentar };
}
