import { z } from "zod";

export const esquemaItemPedido = z.object({
  productoId: z.number().int().positive(),
  cantidad: z.number().int().positive(),
});

export const esquemaPedido = z.object({
  id: z.number().int().positive(),
  items: z.array(esquemaItemPedido).min(1),
  estado: z.string().regex(/\S/),
  total: z.number().int().nonnegative(),
});

export type ItemPedido = z.infer<typeof esquemaItemPedido>;
export type Pedido = z.infer<typeof esquemaPedido>;
