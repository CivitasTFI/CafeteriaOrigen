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

export async function solicitarValidado(
  ruta: string,
  _esquema: z.ZodType,
  opciones?: RequestInit,
): Promise<unknown> {
  // Base provisional del RED: todavía no valida las respuestas exitosas.
  return solicitarJson(ruta, opciones);
}
