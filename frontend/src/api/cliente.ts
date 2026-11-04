import { obtenerMensajeError } from "./errores";

async function realizarPeticion(
  ruta: string,
  opciones?: RequestInit,
): Promise<Response> {
  try {
    return await fetch(new URL(ruta, window.location.origin), opciones);
  } catch {
    throw new Error("No se pudo conectar con el servidor");
  }
}

export async function solicitarJson(
  ruta: string,
  opciones?: RequestInit,
): Promise<unknown> {
  const respuesta = await realizarPeticion(ruta, opciones);
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
