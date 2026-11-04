import { esquemaError } from "./esquemas/errores";

export async function solicitarJson(
  ruta: string,
  opciones?: RequestInit,
): Promise<unknown> {
  const respuesta = await fetch(new URL(ruta, window.location.origin), opciones);
  const datos: unknown = await respuesta.json();

  if (!respuesta.ok) {
    const errorApi = esquemaError.safeParse(datos);

    if (!errorApi.success) {
      throw new Error("No se pudo interpretar la respuesta de error del servidor");
    }

    throw new Error(errorApi.data.error);
  }

  return datos;
}
