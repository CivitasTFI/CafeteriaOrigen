import { useId, useState } from "react";
import type { Productos } from "../../api/esquemas/productos";
import { formatoPrecio } from "../../utils/formatoPrecio";

type DetalleProductoProps = {
  productos: Productos;
};

export default function DetalleProducto({ productos }: DetalleProductoProps) {
  const tituloId = useId();
  const selectId = useId();
  const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);
  const producto = productos.find((item) => item.id === idSeleccionado) ?? productos[0];

  return (
    <section className="mb-4" aria-labelledby={tituloId}>
      <h2 id={tituloId} className="h5 mb-3">
        Detalle de producto
      </h2>
      {producto === undefined ? (
        <p className="text-muted mb-0" role="status">
          No hay productos disponibles en el catálogo.
        </p>
      ) : (
        <>
          <div className="mb-3">
            <label className="form-label" htmlFor={selectId}>
              Elegir producto por ID
            </label>
            <select
              id={selectId}
              className="form-select"
              value={producto.id}
              onChange={(evento) => setIdSeleccionado(Number(evento.target.value))}
            >
              {productos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} — {item.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="border rounded p-3">
            <p className="fw-semibold mb-1">{producto.nombre}</p>
            <p className="mb-1">{formatoPrecio(producto.precio)}</p>
            {producto.tipo === "cafe" && (
              <p className="small text-body-secondary mb-0">
                {producto.variedad.descripcion}
              </p>
            )}
            {producto.tipo === "pasteleria" && (
              <p className="small text-body-secondary mb-0">{producto.variedad}</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
