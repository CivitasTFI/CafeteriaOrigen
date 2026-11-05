import { CarritoProvider } from "./context/CarritoContext";
import MenuPage from "./pages/MenuPage";

function App() {
  return (
    <CarritoProvider>
      <main>
        <h1>Cafetería Origen</h1>
        <MenuPage />
      </main>
    </CarritoProvider>
  );
}

export default App;
