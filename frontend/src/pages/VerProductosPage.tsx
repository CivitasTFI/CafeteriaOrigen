import ContenedorCatalogo from "../components/comunes/ContenedorCatalogo";
import Menu from "../components/menu/Menu";
import DetalleProducto from "../components/menu/DetalleProducto";

export default function VerProductosPage() {
  return (
    <ContenedorCatalogo mensajeCarga="Cargando productos...">
      {(productos) => (
        <div className="ver-productos-pagina">
          <Menu productos={productos} />
          <DetalleProducto productos={productos} />
        </div>
      )}
    </ContenedorCatalogo>
  );
}
