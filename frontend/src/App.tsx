import { useState } from "react";
import { CarritoProvider } from "./context/CarritoContext";
import MenuPage from "./pages/MenuPage";
import VerProductosPage from "./pages/VerProductosPage";
import BuscarProductosPage from "./pages/BuscarProductosPage";
import NavegacionPrincipal, {
  type VistaApp,
} from "./components/layout/NavegacionPrincipal";
import Carrito from "./components/carrito/Carrito";

function App() {
  const [vista, setVista] = useState<VistaApp>("pedido");

  return (
    <CarritoProvider>
      <main>
        <h1>Cafetería Origen</h1>
        <NavegacionPrincipal vista={vista} onCambiar={setVista} />
        {vista === "pedido" && <MenuPage />}
        {vista === "ver" && <VerProductosPage />}
        {vista === "buscar" && <BuscarProductosPage />}
        <Carrito />
      </main>
    </CarritoProvider>
  );
}

export default App;
