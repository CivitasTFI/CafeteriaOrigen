import { useEffect, useId, useState } from "react";
import type { Producto, Productos } from "../../api/esquemas/productos";
import { useCarrito } from "../../hooks/useCarrito";
import { filtrarProductos } from "../../utils/filtrarProductos";
import { formatoPrecio } from "../../utils/formatoPrecio";

type TipoCafe = "expreso" | "filtrado";
type Tamano = "pocillo" | "mediano" | "taza grande";
type Origen = "brasil" | "colombia" | "etiopia";

type SelectorCafeProps = {
  productos: Productos;
};

const BEBIDAS: { valor: TipoCafe; etiqueta: string }[] = [
  { valor: "expreso", etiqueta: "Expreso" },
  { valor: "filtrado", etiqueta: "Filtrado" },
];

const TAMANOS: { valor: Tamano; etiqueta: string }[] = [
  { valor: "pocillo", etiqueta: "Pocillo" },
  { valor: "mediano", etiqueta: "Mediano" },
  { valor: "taza grande", etiqueta: "Taza grande" },
];

const ETIQUETAS_ORIGEN: Record<Origen, string> = {
  brasil: "Brasil",
  colombia: "Colombia",
  etiopia: "Etiopía",
};

function esCafe(producto: Producto): producto is Producto & { tipo: "cafe" } {
  return producto.tipo === "cafe";
}

export default function SelectorCafe({ productos }: SelectorCafeProps) {
  const tituloId = useId();
  const { agregarProducto } = useCarrito();
  const [tipoCafe, setTipoCafe] = useState<TipoCafe | null>(null);
  const [tamano, setTamano] = useState<Tamano | null>(null);
  const [variedad, setVariedad] = useState<Origen | null>(null);
  const [opcionesCafe, setOpcionesCafe] = useState<Producto[]>([]);

  useEffect(() => {
    if (!tipoCafe || !tamano) {
      setOpcionesCafe([]);
      setVariedad(null);
      return;
    }

    setVariedad(null);
    setOpcionesCafe(
      filtrarProductos(productos, { tipoCafe, tamaño: tamano }).filter(esCafe),
    );
  }, [productos, tipoCafe, tamano]);

  const productoElegido =
    variedad === null
      ? undefined
      : opcionesCafe.find(
          (p) => esCafe(p) && p.variedad.nombre === variedad,
        );

  const sinCoincidencias =
    tipoCafe !== null && tamano !== null && opcionesCafe.length === 0;

  function agregarAlCarrito() {
    if (!productoElegido) {
      return;
    }
    agregarProducto(productoElegido);
  }

  return (
    <section
      className="selector-cafe mb-4"
      aria-labelledby={tituloId}
    >
      <h2 id={tituloId} className="h4 mb-3">
        Café
      </h2>

      <fieldset className="mb-3">
        <legend className="form-label fw-semibold">Tipo de bebida</legend>
        <div className="d-flex flex-wrap gap-2" role="radiogroup" aria-label="Tipo de bebida">
          {BEBIDAS.map(({ valor, etiqueta }) => (
            <div className="form-check" key={valor}>
              <input
                className="form-check-input"
                type="radio"
                name="tipoCafe"
                id={`tipo-cafe-${valor}`}
                checked={tipoCafe === valor}
                onChange={() => setTipoCafe(valor)}
              />
              <label className="form-check-label" htmlFor={`tipo-cafe-${valor}`}>
                {etiqueta}
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-3" disabled={tipoCafe === null}>
        <legend className="form-label fw-semibold">Tamaño</legend>
        <div className="d-flex flex-wrap gap-2" role="radiogroup" aria-label="Tamaño">
          {TAMANOS.map(({ valor, etiqueta }) => (
            <div className="form-check" key={valor}>
              <input
                className="form-check-input"
                type="radio"
                name="tamano"
                id={`tamano-${valor.replace(/\s+/g, "-")}`}
                checked={tamano === valor}
                onChange={() => setTamano(valor)}
                disabled={tipoCafe === null}
              />
              <label
                className="form-check-label"
                htmlFor={`tamano-${valor.replace(/\s+/g, "-")}`}
              >
                {etiqueta}
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      {tipoCafe !== null && tamano !== null && (
        <fieldset className="mb-3">
          <legend className="form-label fw-semibold">Origen</legend>
          {sinCoincidencias && (
            <p className="text-muted mb-2" role="status">
              No hay orígenes para esta combinación en el catálogo.
            </p>
          )}
          {!sinCoincidencias && (
            <div className="d-flex flex-column gap-2" role="radiogroup" aria-label="Origen del café">
              {(Object.keys(ETIQUETAS_ORIGEN) as Origen[]).map((origen) => {
                const producto = opcionesCafe.find(
                  (p): p is Producto & { tipo: "cafe" } =>
                    esCafe(p) && p.variedad.nombre === origen,
                );
                const deshabilitado = producto === undefined;
                return (
                  <div
                    className={`form-check border rounded p-2 ${deshabilitado ? "opacity-50" : ""}`}
                    key={origen}
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="variedad"
                      id={`origen-${origen}`}
                      checked={variedad === origen}
                      disabled={deshabilitado}
                      onChange={() => setVariedad(origen)}
                    />
                    <label className="form-check-label w-100" htmlFor={`origen-${origen}`}>
                      <span className="fw-semibold d-block">
                        {ETIQUETAS_ORIGEN[origen]}
                        {producto !== undefined && (
                          <span className="ms-2 text-body-secondary">
                            {formatoPrecio(producto.precio)}
                          </span>
                        )}
                      </span>
                      {producto !== undefined && (
                        <span className="small text-body-secondary d-block">
                          {producto.variedad.descripcion}
                        </span>
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          )}
        </fieldset>
      )}

      <button
        type="button"
        className="btn btn-primary w-100"
        disabled={productoElegido === undefined}
        onClick={agregarAlCarrito}
      >
        Agregar café al carrito
      </button>
    </section>
  );
}
