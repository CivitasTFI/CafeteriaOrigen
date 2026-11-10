import { obtenerMensajeError } from "./errores";
import type { z } from "zod";

const TIEMPO_LIMITE_MS = 15_000;

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

async function leerRespuestaJson(
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

export async function solicitarJson(
  ruta: string,
  opciones?: RequestInit,
): Promise<unknown> {
  const controlador = new AbortController();
  const senalExterna = opciones?.signal;
  const cancelar = () => controlador.abort();
  if (senalExterna?.aborted) cancelar();
  else senalExterna?.addEventListener("abort", cancelar, { once: true });

  let temporizador: ReturnType<typeof setTimeout> | undefined;
  const limite = new Promise<never>((_resolve, reject) => {
    temporizador = setTimeout(() => {
      reject(new Error("El servidor tardó demasiado en responder"));
      controlador.abort();
    }, TIEMPO_LIMITE_MS);
  });

  try {
    return await Promise.race([
      leerRespuestaJson(ruta, { ...opciones, signal: controlador.signal }),
      limite,
    ]);
  } finally {
    clearTimeout(temporizador);
    senalExterna?.removeEventListener("abort", cancelar);
  }
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
