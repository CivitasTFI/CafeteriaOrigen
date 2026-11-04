import { obtenerMensajeError } from "./errores";

export async function solicitarJson(
  ruta: string,
  opciones?: RequestInit,
): Promise<unknown> {
  let respuesta: Response;

  try {
    respuesta = await fetch(new URL(ruta, window.location.origin), opciones);
  } catch {
    throw new Error("No se pudo conectar con el servidor");
  }

  let datos: unknown;

  try {
    datos = await respuesta.json();
  } catch {
    throw new Error("No se pudo interpretar la respuesta del servidor");
  }

  if (!respuesta.ok) {
    throw new Error(obtenerMensajeError(datos));
  }

  return datos;
}
