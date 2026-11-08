import { CarritoProvider } from "./context/CarritoContext";
import MenuPage from "./pages/MenuPage";
import Carrito from "./components/carrito/Carrito";

function App() {
  return (
    <CarritoProvider>
      <main>
        <h1>Cafetería Origen</h1>
        <MenuPage />
        <Carrito />
      </main>
    </CarritoProvider>
  );
}

export default App;
