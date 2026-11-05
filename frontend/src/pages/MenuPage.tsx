import IndicadorCarga from "../components/comunes/IndicadorCarga";
import { useMenu } from "../hooks/useMenu";

export default function MenuPage() {
  const estado = useMenu();

  if (estado.estado === "cargando") {
    return <IndicadorCarga mensaje="Cargando menú..." />;
  }

  if (estado.estado === "error") {
    return <p role="alert">{estado.mensaje}</p>;
  }

  return (
    <ul aria-label="Productos del menú">
      {estado.productos.map((producto) => (
        <li key={producto.id}>{producto.nombre}</li>
      ))}
    </ul>
  );
}
