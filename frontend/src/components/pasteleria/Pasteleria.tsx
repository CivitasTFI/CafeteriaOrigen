import { useId, useMemo } from "react";
import type { Producto, Productos } from "../../api/esquemas/productos";
import { useCarrito } from "../../hooks/useCarrito";
import { filtrarProductos } from "../../utils/filtrarProductos";
import { formatoPrecio } from "../../utils/formatoPrecio";

type PasteleriaProps = {
  productos: Productos;
};

function esPasteleria(
  producto: Producto,
): producto is Producto & { tipo: "pasteleria" } {
  return producto.tipo === "pasteleria";
}

export default function Pasteleria({ productos }: PasteleriaProps) {
  const tituloId = useId();
  const { agregarProducto } = useCarrito();
  const itemsPasteleria = useMemo(
    () => filtrarProductos(productos, { tipo: "pasteleria" }).filter(esPasteleria),
    [productos],
  );

  return (
    <section className="pasteleria mb-4" aria-labelledby={tituloId}>
      <h2 id={tituloId} className="h4 mb-3">
        Pastelería
      </h2>

      {itemsPasteleria.length === 0 && (
        <p className="text-muted mb-0" role="status">
          No hay pastelería disponible en el catálogo.
        </p>
      )}

      {itemsPasteleria.length > 0 && (
        <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
          {itemsPasteleria.map((producto) => (
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
