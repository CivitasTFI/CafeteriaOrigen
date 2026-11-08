import IndicadorCarga from "../components/comunes/IndicadorCarga";
import MensajeError from "../components/comunes/MensajeError";
import SelectorCafe from "../components/cafe/SelectorCafe";
import Pasteleria from "../components/pasteleria/Pasteleria";
import { useMenu } from "../hooks/useMenu";

export default function MenuPage() {
  const { estado, reintentar } = useMenu();

  if (estado.estado === "cargando") {
    return <IndicadorCarga mensaje="Cargando menú..." />;
  }

  if (estado.estado === "error") {
    return (
      <MensajeError mensaje={estado.mensaje} onReintentar={reintentar} />
    );
  }

  return (
    <div className="menu-pagina">
      <SelectorCafe />
      <Pasteleria />
    </div>
  );
}
