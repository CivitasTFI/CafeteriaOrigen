import { z } from "zod";

// Campos comunes de los productos, ampliados según el tipo que devuelve la API.
export const esquemaProductoBase = z.object({
  id: z.number().int().positive(),
  nombre: z.string(),
  precio: z.number().nonnegative(),
});

export const esquemaProductosBase = z.array(esquemaProductoBase);

export type ProductoBase = z.infer<typeof esquemaProductoBase>;
export type ProductosBase = z.infer<typeof esquemaProductosBase>;

const esquemaCafe = esquemaProductoBase.extend({
  tipo: z.literal("cafe"),
  tipoCafe: z.enum(["expreso", "filtrado"]),
  tamaño: z.enum(["pocillo", "mediano", "taza grande"]),
  variedad: z.object({
    nombre: z.enum(["brasil", "colombia", "etiopia"]),
    descripcion: z.string(),
  }),
});

const esquemaPasteleria = esquemaProductoBase.extend({
  tipo: z.literal("pasteleria"),
  variedad: z.enum(["muffin de chocolate", "torta selva negra"]),
});

export const esquemaProducto = z.discriminatedUnion("tipo", [
  esquemaCafe,
  esquemaPasteleria,
]);

export const esquemaProductos = z.array(esquemaProducto);

export type Producto = z.infer<typeof esquemaProducto>;
export type Productos = z.infer<typeof esquemaProductos>;
