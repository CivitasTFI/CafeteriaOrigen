import { useEffect, useId, useState } from "react";
import { buscarProductos } from "../../api/productos";
import type { Producto } from "../../api/esquemas/productos";
import { useCarrito } from "../../hooks/useCarrito";
import { formatoPrecio } from "../../utils/formatoPrecio";

function esPasteleria(
  producto: Producto,
): producto is Producto & { tipo: "pasteleria" } {
  return producto.tipo === "pasteleria";
}

export default function Pasteleria() {
  const tituloId = useId();
  const { agregarProducto } = useCarrito();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    (async () => {
      try {
        const resultados = await buscarProductos({ tipo: "pasteleria" });
        if (!cancelado) {
          setProductos(resultados.filter(esPasteleria));
        }
      } catch (err) {
        if (!cancelado) {
          setError(
            err instanceof Error ? err.message : "No se pudo cargar pastelería",
          );
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    })();

    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <section className="pasteleria mb-4" aria-labelledby={tituloId}>
      <h2 id={tituloId} className="h4 mb-3">
        Pastelería
      </h2>

      {cargando && (
        <p className="text-muted" role="status">
          Cargando pastelería...
        </p>
      )}

      {error !== null && (
        <p className="text-danger" role="alert">
          {error}
        </p>
      )}

      {!cargando && error === null && (
        <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
          {productos.map((producto) => (
            <li
              key={producto.id}
              className="border rounded p-3 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2"
            >
              <div>
                <span className="fw-semibold d-block">{producto.nombre}</span>
                <span className="text-body-secondary">{formatoPrecio(producto.precio)}</span>
              </div>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => agregarProducto(producto)}
              >
                Agregar {producto.nombre}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
