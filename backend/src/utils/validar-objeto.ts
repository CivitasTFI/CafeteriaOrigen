import { ErrorValidacion } from "../errors/error-validacion";

export function validarObjeto(valor: unknown, mensajeError: string): void {
    if (
        typeof valor !== "object" ||
        valor === null ||
        Array.isArray(valor)
    ) {
        throw new ErrorValidacion(mensajeError);
    }
}
