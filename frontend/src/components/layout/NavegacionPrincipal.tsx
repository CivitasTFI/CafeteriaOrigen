export type VistaApp = "pedido" | "ver" | "buscar";

type NavegacionPrincipalProps = {
  vista: VistaApp;
  onCambiar: (vista: VistaApp) => void;
};

const enlaces: { id: VistaApp; etiqueta: string }[] = [
  { id: "pedido", etiqueta: "Pedir" },
  { id: "ver", etiqueta: "Ver productos" },
  { id: "buscar", etiqueta: "Buscar productos" },
];

export default function NavegacionPrincipal({
  vista,
  onCambiar,
}: NavegacionPrincipalProps) {
  return (
    <nav
      aria-label="Secciones principales"
      className="navegacion-principal mb-4 d-flex flex-wrap gap-2"
    >
      {enlaces.map(({ id, etiqueta }) => (
        <button
          key={id}
          type="button"
          className={`btn btn-sm ${
            vista === id ? "btn-primary" : "btn-outline-primary"
          }`}
          aria-current={vista === id ? "page" : undefined}
          onClick={() => onCambiar(id)}
        >
          {etiqueta}
        </button>
      ))}
    </nav>
  );
}
