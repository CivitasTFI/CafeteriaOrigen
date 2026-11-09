interface EncabezadoProps {
  mesaId?: number;
}

export default function Encabezado({ mesaId }: EncabezadoProps) {
  return (
    <header>
      <h1>Cafetería Origen</h1>
      <p>{mesaId === undefined ? "retiro en barra" : `mesa ${mesaId}`}</p>
    </header>
  );
}
