import { CarritoProvider } from "./context/CarritoContext";
import MenuPage from "./pages/MenuPage";
import Carrito from "./components/carrito/Carrito";
import SeguimientoPedido from "./components/pedidos/SeguimientoPedido";

function App() {
  return (
    <CarritoProvider>
      <main>
        <h1>Cafetería Origen</h1>
        <MenuPage />
        <Carrito />
        <SeguimientoPedido />
      </main>
    </CarritoProvider>
  );
}

export default App;
