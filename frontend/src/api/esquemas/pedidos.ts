import { z } from "zod";

export const esquemaPedido = z.object({
  id: z.number().int().positive(),
  items: z.array(
    z.object({
      productoId: z.number().int().positive(),
      cantidad: z.number().int().positive(),
    }),
  ).min(1),
  estado: z.string().regex(/\S/),
  total: z.number().int().nonnegative(),
});

export type Pedido = z.infer<typeof esquemaPedido>;
