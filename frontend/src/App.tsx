import { useState } from "react";
import { CarritoProvider } from "./context/CarritoContext";
import MenuPage from "./pages/MenuPage";
import VerProductosPage from "./pages/VerProductosPage";
import BuscarProductosPage from "./pages/BuscarProductosPage";
import NavegacionPrincipal, {
  type VistaApp,
} from "./components/layout/NavegacionPrincipal";
import Carrito from "./components/carrito/Carrito";
import Encabezado from "./components/layout/Encabezado";
import { leerMesa } from "./utils/leerMesa";

function App() {
  const [vista, setVista] = useState<VistaApp>("pedido");
  const [enviandoPedido, setEnviandoPedido] = useState(false);
  const mesaId = leerMesa(new URLSearchParams(window.location.search));

  return (
    <CarritoProvider>
      <Encabezado mesaId={mesaId} />
      <main>
        <fieldset
          className="border-0 p-0 m-0"
          aria-label="Preparar pedido"
          disabled={enviandoPedido}
        >
          <NavegacionPrincipal vista={vista} onCambiar={setVista} />
          {vista === "pedido" && <MenuPage />}
          {vista === "ver" && <VerProductosPage />}
          {vista === "buscar" && <BuscarProductosPage />}
          <Carrito mesaId={mesaId} onCambiarEnvio={setEnviandoPedido} />
        </fieldset>
      </main>
    </CarritoProvider>
  );
}

export default App;
