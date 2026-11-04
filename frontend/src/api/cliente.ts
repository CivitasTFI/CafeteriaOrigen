export async function solicitarJson(
  ruta: string,
  opciones?: RequestInit,
): Promise<unknown> {
  const respuesta = await fetch(new URL(ruta, window.location.origin), opciones);

  // Base provisional del RED: todavía no interpreta los errores HTTP.
  return respuesta.json();
}
