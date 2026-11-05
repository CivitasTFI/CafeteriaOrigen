type MensajeErrorProps = {
  mensaje: string;
};

export default function MensajeError({ mensaje }: MensajeErrorProps) {
  return <p role="alert">{mensaje}</p>;
}
