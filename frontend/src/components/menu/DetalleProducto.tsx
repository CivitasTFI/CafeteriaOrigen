import { useEffect, useId, useState } from "react";
import { obtenerProducto } from "../../api/productos";
import type { Producto, Productos } from "../../api/esquemas/productos";
import { formatoPrecio } from "../../utils/formatoPrecio";

type DetalleProductoProps = {
  productos: Productos;
};

export default function DetalleProducto({ productos }: DetalleProductoProps) {
  const tituloId = useId();
  const selectId = useId();
  const [idSeleccionado, setIdSeleccionado] = useState<number>(productos[0]?.id ?? 1);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const enCatalogo = productos.find((p) => p.id === idSeleccionado);
    if (enCatalogo !== undefined) {
      setProducto(enCatalogo);
      setError(null);
      setCargando(false);
      return;
    }

    let cancelado = false;
    setCargando(true);
    setError(null);

    void obtenerProducto(idSeleccionado)
      .then((detalle) => {
        if (!cancelado) {
          setProducto(detalle);
        }
      })
      .catch((err: unknown) => {
        if (!cancelado) {
          setProducto(null);
          setError(
            err instanceof Error ? err.message : "No se pudo cargar el producto",
          );
        }
      })
      .finally(() => {
        if (!cancelado) {
          setCargando(false);
        }
      });

    return () => {
      cancelado = true;
    };
  }, [idSeleccionado, productos]);

  return (
    <section className="mb-4" aria-labelledby={tituloId}>
      <h2 id={tituloId} className="h5 mb-3">
        Detalle de producto
      </h2>
      <div className="mb-3">
        <label className="form-label" htmlFor={selectId}>
          Elegir producto por ID
        </label>
        <select
          id={selectId}
          className="form-select"
          value={idSeleccionado}
          onChange={(evento) => setIdSeleccionado(Number(evento.target.value))}
        >
          {productos.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id} — {item.nombre}
            </option>
          ))}
        </select>
      </div>

      {cargando && (
        <p className="text-muted mb-0" role="status">
          Cargando producto...
        </p>
      )}

      {error !== null && (
        <p className="text-danger mb-0" role="alert">
          {error}
        </p>
      )}

      {!cargando && error === null && producto !== null && (
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
      )}
    </section>
  );
}
