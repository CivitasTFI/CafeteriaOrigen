import type { ReactNode } from "react";
import type { Productos } from "../../api/esquemas/productos";
import { useMenu } from "../../hooks/useMenu";
import IndicadorCarga from "./IndicadorCarga";
import MensajeError from "./MensajeError";

type ContenedorCatalogoProps = {
  mensajeCarga?: string;
  children: (productos: Productos) => ReactNode;
};

export default function ContenedorCatalogo({
  mensajeCarga = "Cargando menú...",
  children,
}: ContenedorCatalogoProps) {
  const { estado, reintentar } = useMenu();

  if (estado.estado === "cargando") {
    return <IndicadorCarga mensaje={mensajeCarga} />;
  }

  if (estado.estado === "error") {
    return (
      <MensajeError mensaje={estado.mensaje} onReintentar={reintentar} />
    );
  }

  return <>{children(estado.productos)}</>;
}
