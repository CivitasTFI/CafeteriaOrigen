import { useEffect, useState } from "react";
import type { ProductosBase } from "../api/esquemas/productos";
import { listarProductos } from "../api/productos";

type EstadoMenu =
  | { estado: "cargando" }
  | { estado: "listo"; productos: ProductosBase }
  | { estado: "error"; mensaje: string };

export function useMenu(): EstadoMenu {
  const [estado, setEstado] = useState<EstadoMenu>({ estado: "cargando" });

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
  }, []);

  return estado;
}
