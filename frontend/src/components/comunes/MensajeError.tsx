type MensajeErrorProps = {
  mensaje: string;
  onReintentar?: () => void;
};

export default function MensajeError({
  mensaje,
  onReintentar,
}: MensajeErrorProps) {
  return (
    <>
      <p role="alert">{mensaje}</p>
      {onReintentar && (
        <button type="button" onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </>
  );
}
