import ContenedorCatalogo from "../components/comunes/ContenedorCatalogo";
import SelectorCafe from "../components/cafe/SelectorCafe";
import Pasteleria from "../components/pasteleria/Pasteleria";

export default function MenuPage() {
  return (
    <ContenedorCatalogo>
      {(productos) => (
        <div className="menu-pagina">
          <SelectorCafe productos={productos} />
          <Pasteleria productos={productos} />
        </div>
      )}
    </ContenedorCatalogo>
  );
}
