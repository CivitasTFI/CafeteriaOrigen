import { z } from "zod";

// Base provisional del RED para los campos que la API devuelve actualmente.
// La información adicional del café se incorporará cuando esté expuesta por HTTP.
export const esquemaProductoBase = z.unknown();
export const esquemaProductosBase = z.unknown();
