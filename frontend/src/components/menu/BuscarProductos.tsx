import { useId, useState } from "react";
import {
  buscarProductos,
  type CriteriosBusquedaProducto,
} from "../../api/productos";
import type { Productos } from "../../api/esquemas/productos";
import { formatoPrecio } from "../../utils/formatoPrecio";

const criteriosVacios: CriteriosBusquedaProducto = {};

function armarCriterios(formulario: {
  tipo: "" | "cafe" | "pasteleria";
  tipoCafe: "" | "expreso" | "filtrado";
  tamaño: "" | "pocillo" | "mediano" | "taza grande";
  variedad: CriteriosBusquedaProducto["variedad"] | "";
}): CriteriosBusquedaProducto | null {
  const criterios: CriteriosBusquedaProducto = { ...criteriosVacios };

  if (formulario.tipo !== "") {
    criterios.tipo = formulario.tipo;
  }
  if (formulario.tipoCafe !== "") {
    criterios.tipoCafe = formulario.tipoCafe;
  }
  if (formulario.tamaño !== "") {
    criterios.tamaño = formulario.tamaño;
  }
  if (formulario.variedad !== "") {
    criterios.variedad = formulario.variedad;
  }

  return Object.keys(criterios).length === 0 ? null : criterios;
}

export default function BuscarProductos() {
  const tituloId = useId();
  const [tipo, setTipo] = useState<"" | "cafe" | "pasteleria">("");
  const [tipoCafe, setTipoCafe] = useState<"" | "expreso" | "filtrado">("");
  const [tamaño, setTamaño] = useState<
    "" | "pocillo" | "mediano" | "taza grande"
  >("");
  const [variedad, setVariedad] = useState<
    CriteriosBusquedaProducto["variedad"] | ""
  >("");
  const [resultados, setResultados] = useState<Productos | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const criteriosListos = armarCriterios({ tipo, tipoCafe, tamaño, variedad });

  async function ejecutarBusqueda() {
    const criterios = armarCriterios({ tipo, tipoCafe, tamaño, variedad });
    if (criterios === null) {
      return;
    }

    setCargando(true);
    setError(null);
    setResultados(null);

    try {
      const coincidencias = await buscarProductos(criterios);
      setResultados(coincidencias);
    } catch (err: unknown) {
      setResultados(null);
      setError(
        err instanceof Error ? err.message : "No se pudo completar la búsqueda",
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="buscar-productos mb-4" aria-labelledby={tituloId}>
      <h2 id={tituloId} className="h5 mb-3">
        Búsqueda por criterios
      </h2>

      <form
        className="d-flex flex-column gap-3"
        onSubmit={(evento) => {
          evento.preventDefault();
          void ejecutarBusqueda();
        }}
      >
        <div>
          <label className="form-label" htmlFor="buscar-tipo">
            Tipo de producto
          </label>
          <select
            id="buscar-tipo"
            className="form-select"
            value={tipo}
            onChange={(evento) =>
              setTipo(evento.target.value as typeof tipo)
            }
          >
            <option value="">—</option>
            <option value="cafe">Café</option>
            <option value="pasteleria">Pastelería</option>
          </select>
        </div>

        <div>
          <label className="form-label" htmlFor="buscar-tipo-cafe">
            Tipo de café
          </label>
          <select
            id="buscar-tipo-cafe"
            className="form-select"
            value={tipoCafe}
            onChange={(evento) =>
              setTipoCafe(evento.target.value as typeof tipoCafe)
            }
          >
            <option value="">—</option>
            <option value="expreso">Expreso</option>
            <option value="filtrado">Filtrado</option>
          </select>
        </div>

        <div>
          <label className="form-label" htmlFor="buscar-tamano">
            Tamaño
          </label>
          <select
            id="buscar-tamano"
            className="form-select"
            value={tamaño}
            onChange={(evento) =>
              setTamaño(evento.target.value as typeof tamaño)
            }
          >
            <option value="">—</option>
            <option value="pocillo">Pocillo</option>
            <option value="mediano">Mediano</option>
            <option value="taza grande">Taza grande</option>
          </select>
        </div>

        <div>
          <label className="form-label" htmlFor="buscar-variedad">
            Variedad
          </label>
          <select
            id="buscar-variedad"
            className="form-select"
            value={variedad}
            onChange={(evento) =>
              setVariedad(evento.target.value as typeof variedad)
            }
          >
            <option value="">—</option>
            <option value="brasil">Brasil</option>
            <option value="colombia">Colombia</option>
            <option value="etiopia">Etiopía</option>
            <option value="muffin de chocolate">Muffin de chocolate</option>
            <option value="torta selva negra">Torta selva negra</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary align-self-start"
          disabled={criteriosListos === null || cargando}
        >
          Buscar
        </button>
      </form>

      {cargando && (
        <p className="text-muted mt-3 mb-0" role="status">
          Buscando productos...
        </p>
      )}

      {error !== null && (
        <p className="text-danger mt-3 mb-0" role="alert">
          {error}
        </p>
      )}

      {resultados !== null && (
        <ul
          className="list-unstyled mt-3 mb-0 d-flex flex-column gap-1"
          aria-label="Resultados de búsqueda"
        >
          {resultados.map((producto) => (
            <li
              key={producto.id}
              className="d-flex justify-content-between gap-2 border-bottom pb-1"
            >
              <span>{producto.nombre}</span>
              <span className="text-body-secondary text-nowrap">
                {formatoPrecio(producto.precio)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
