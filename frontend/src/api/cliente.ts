import { esquemaError } from "./esquemas/errores";

export async function solicitarJson(
  ruta: string,
  opciones?: RequestInit,
): Promise<unknown> {
  const respuesta = await fetch(new URL(ruta, window.location.origin), opciones);
  const datos: unknown = await respuesta.json();

  if (!respuesta.ok) {
    const errorApi = esquemaError.parse(datos);
    throw new Error(errorApi.error);
  }

  return datos;
}
