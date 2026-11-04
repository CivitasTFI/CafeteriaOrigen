import { esquemaError } from "./esquemas/errores";

export function obtenerMensajeError(datos: unknown): string {
  const errorApi = esquemaError.safeParse(datos);

  return errorApi.success
    ? errorApi.data.error
    : "No se pudo interpretar la respuesta de error del servidor";
}
