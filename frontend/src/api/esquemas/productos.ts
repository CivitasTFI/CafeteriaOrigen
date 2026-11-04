import { z } from "zod";

// Contrato base de los campos que la API devuelve actualmente.
// La información adicional del café se incorporará cuando esté expuesta por HTTP.
export const esquemaProductoBase = z.object({
  id: z.number().int().positive(),
  nombre: z.string(),
  precio: z.number().nonnegative(),
});

export const esquemaProductosBase = z.array(esquemaProductoBase);

export type ProductoBase = z.infer<typeof esquemaProductoBase>;
export type ProductosBase = z.infer<typeof esquemaProductosBase>;
