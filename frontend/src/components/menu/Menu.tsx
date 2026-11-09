import type { Productos } from "../../api/esquemas/productos";
import { formatoPrecio } from "../../utils/formatoPrecio";

type MenuProps = {
  productos: Productos;
};

export default function Menu({ productos }: MenuProps) {
  return (
    <section className="mb-4" aria-labelledby="listado-menu-titulo">
      <h2 id="listado-menu-titulo" className="h5 mb-3">
        Catálogo
      </h2>
      <ul
        className="list-unstyled mb-0 d-flex flex-column gap-1"
        aria-label="Productos del menú"
      >
        {productos.map((producto) => (
          <li
            key={producto.id}
            className="d-flex justify-content-between gap-2 border-bottom pb-1"
          >
            <span>{producto.nombre}</span>
            <span className="text-body-secondary text-nowrap">
              {formatoPrecio(producto.precio)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
