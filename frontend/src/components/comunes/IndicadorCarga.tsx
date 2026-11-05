type IndicadorCargaProps = {
  mensaje: string;
};

export default function IndicadorCarga({ mensaje }: IndicadorCargaProps) {
  return <p role="status">{mensaje}</p>;
}
