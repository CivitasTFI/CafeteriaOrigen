interface EncabezadoProps {
  mesaId?: number;
}

export default function Encabezado({ mesaId }: EncabezadoProps) {
  return (
    <header className="text-center px-3 pt-3">
      <h1>Cafetería Origen</h1>
      <p>{mesaId === undefined ? "retiro en barra" : `mesa ${mesaId}`}</p>
    </header>
  );
}
