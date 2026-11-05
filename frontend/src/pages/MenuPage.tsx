import IndicadorCarga from "../components/comunes/IndicadorCarga";
import MensajeError from "../components/comunes/MensajeError";
import { useMenu } from "../hooks/useMenu";

export default function MenuPage() {
  const { estado, reintentar } = useMenu();

  if (estado.estado === "cargando") {
    return <IndicadorCarga mensaje="Cargando menú..." />;
  }

  if (estado.estado === "error") {
    return (
      <>
        <MensajeError mensaje={estado.mensaje} />
        <button type="button" onClick={reintentar}>
          Reintentar
        </button>
      </>
    );
  }

  return (
    <ul aria-label="Productos del menú">
      {estado.productos.map((producto) => (
        <li key={producto.id}>{producto.nombre}</li>
      ))}
    </ul>
  );
}
