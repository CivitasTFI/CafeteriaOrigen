import type { ErrorApi } from "../../api/esquemas/errores";

export const erroresApi = {
  pedidoIdInvalido: {
    error: "El ID debe ser un número entero positivo",
  },
  productoNoEncontrado: {
    error: "Producto no encontrado",
  },
  pedidoSinItems: {
    error: "El pedido debe contener al menos un producto",
  },
  errorInterno: {
    error: "Error interno del servidor",
  },
} satisfies Record<string, ErrorApi>;
