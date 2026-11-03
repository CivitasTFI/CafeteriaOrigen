import { describe, expect, test } from "vitest";
import { esquemaError } from "../../api/esquemas/errores";

describe("Contrato de errores de la API", () => {
  test("acepta una respuesta de error y conserva su mensaje", () => {
    const respuesta = { error: "El cuerpo de la solicitud contiene JSON inválido" };

    expect(esquemaError.safeParse(respuesta)).toEqual({
      success: true,
      data: respuesta,
    });
  });

  test.each([
    { caso: "una respuesta ausente", respuesta: undefined },
    { caso: "una respuesta nula", respuesta: null },
    { caso: "texto sin el objeto de error", respuesta: "Error del servidor" },
    { caso: "un objeto sin el campo error", respuesta: {} },
    { caso: "un error numérico", respuesta: { error: 400 } },
    { caso: "un error nulo", respuesta: { error: null } },
    { caso: "un error booleano", respuesta: { error: false } },
    { caso: "un error como objeto", respuesta: { error: { mensaje: "Error" } } },
    { caso: "un error como arreglo", respuesta: { error: ["Error"] } },
  ])("rechaza $caso", ({ respuesta }) => {
    expect(esquemaError.safeParse(respuesta).success).toBe(false);
  });
});
