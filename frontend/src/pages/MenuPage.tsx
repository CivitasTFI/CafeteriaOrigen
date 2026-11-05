import { useEffect, useState } from "react";
import type { ProductosBase } from "../api/esquemas/productos";
import { listarProductos } from "../api/productos";
import IndicadorCarga from "../components/comunes/IndicadorCarga";

type EstadoMenu =
  | { estado: "cargando" }
  | { estado: "listo"; productos: ProductosBase }
  | { estado: "error"; mensaje: string };

export default function MenuPage() {
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

  if (estado.estado === "cargando") {
    return <IndicadorCarga mensaje="Cargando menú..." />;
  }

  if (estado.estado === "error") {
    // El mensaje visible y el reintento se incorporan en el siguiente ciclo TDD.
    return null;
  }

  return (
    <ul aria-label="Productos del menú">
      {estado.productos.map((producto) => (
        <li key={producto.id}>{producto.nombre}</li>
      ))}
    </ul>
  );
}
