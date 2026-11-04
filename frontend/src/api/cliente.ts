import { obtenerMensajeError } from "./errores";
import type { z } from "zod";

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

export async function solicitarValidado<Esquema extends z.ZodType>(
  ruta: string,
  esquema: Esquema,
  opciones?: RequestInit,
): Promise<z.infer<Esquema>> {
  const datos = await solicitarJson(ruta, opciones);
  const resultado = esquema.safeParse(datos);

  if (!resultado.success) {
    throw new Error("La respuesta del servidor no tiene el formato esperado");
  }

  return resultado.data;
}
