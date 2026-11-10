import { afterEach, expect, test, vi } from "vitest";
import { solicitarJson } from "../../api/cliente";

const mensajeTimeout = "El servidor tardó demasiado en responder";

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function simularConexionPendiente() {
  let senal: AbortSignal | null | undefined;
  vi.spyOn(globalThis, "fetch").mockImplementation((_url, opciones) => {
    senal = opciones?.signal;
    return new Promise<Response>((_resolve, reject) => {
      const cancelar = () => reject(new DOMException("Solicitud cancelada", "AbortError"));
      if (senal?.aborted) cancelar();
      else senal?.addEventListener("abort", cancelar, { once: true });
    });
  });
  return () => senal;
}

test("interrumpe una conexión pendiente después de 15 segundos", async () => {
  vi.useFakeTimers();
  const obtenerSenal = simularConexionPendiente();
  let errorRecibido: unknown;
  const peticion = solicitarJson("/productos").catch((error: unknown) => { errorRecibido = error; });

  await vi.advanceTimersByTimeAsync(15_000);

  expect(errorRecibido).toEqual(new Error(mensajeTimeout));
  expect(obtenerSenal()?.aborted).toBe(true);
  expect(vi.getTimerCount()).toBe(0);
  await peticion;
});

test("el límite también cubre un cuerpo JSON que no termina de llegar", async () => {
  vi.useFakeTimers();
  let cerrarCuerpo: (() => void) | undefined;
  const cuerpo = new ReadableStream<Uint8Array>({
    start(controlador) {
      controlador.enqueue(new TextEncoder().encode('{"ok":true'));
      cerrarCuerpo = () => {
        controlador.enqueue(new TextEncoder().encode("}"));
        controlador.close();
      };
    },
  });
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(cuerpo));
  let errorRecibido: unknown;
  const peticion = solicitarJson("/productos").catch((error: unknown) => { errorRecibido = error; });
  try {
    await vi.advanceTimersByTimeAsync(15_000);
    expect(errorRecibido).toEqual(new Error(mensajeTimeout));
    expect(vi.getTimerCount()).toBe(0);
  } finally {
    cerrarCuerpo?.();
    await peticion;
  }
});

test("libera el temporizador al terminar una solicitud exitosa", async () => {
  vi.useFakeTimers();
  let senal: AbortSignal | null | undefined;
  vi.spyOn(globalThis, "fetch").mockImplementation(async (_url, opciones) => {
    senal = opciones?.signal;
    return Response.json([]);
  });

  await expect(solicitarJson("/productos")).resolves.toEqual([]);
  expect(vi.getTimerCount()).toBe(0);
  await vi.advanceTimersByTimeAsync(30_000);
  expect(senal?.aborted ?? false).toBe(false);
});

test("libera el temporizador al recibir un error HTTP", async () => {
  vi.useFakeTimers();
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ error: "Pedido rechazado" }, { status: 400 }));

  await expect(solicitarJson("/pedidos")).rejects.toThrow("Pedido rechazado");
  expect(vi.getTimerCount()).toBe(0);
});

test.each([false, true])("respeta la cancelación externa, inicialmente cancelada: %s", async (cancelada) => {
  vi.useFakeTimers();
  const obtenerSenal = simularConexionPendiente();
  const controlador = new AbortController();
  if (cancelada) controlador.abort();
  const peticion = solicitarJson("/productos", { signal: controlador.signal });
  const rechazo = expect(peticion).rejects.toThrow("No se pudo conectar con el servidor");
  if (!cancelada) controlador.abort();

  await rechazo;
  expect(obtenerSenal()?.aborted).toBe(true);
  expect(vi.getTimerCount()).toBe(0);
});
