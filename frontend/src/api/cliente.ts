import { esquemaError } from "./esquemas/errores";

export async function solicitarJson(
  ruta: string,
  opciones?: RequestInit,
): Promise<unknown> {
  const respuesta = await fetch(new URL(ruta, window.location.origin), opciones);
  let datos: unknown;

  try {
    datos = await respuesta.json();
  } catch {
    throw new Error("No se pudo interpretar la respuesta del servidor");
  }

  if (!respuesta.ok) {
    const errorApi = esquemaError.safeParse(datos);

    if (!errorApi.success) {
      throw new Error("No se pudo interpretar la respuesta de error del servidor");
    }

    throw new Error(errorApi.data.error);
  }

  return datos;
}
