import type { ErrorApi } from "../../api/esquemas/errores";

export const erroresApi = {
  pedidoIdInvalido: {
    error: "El ID debe ser un número entero positivo",
  },
  pedidoNoEncontrado: {
    error: "No se encontró un pedido con ese ID",
  },
  productoNoEncontrado: {
    error: "Producto no encontrado",
  },
  pedidoSinItems: {
    error: "El pedido debe contener al menos un producto",
  },
  mesaInexistente: {
    error: "Mesa inexistente",
  },
  errorInterno: {
    error: "Error interno del servidor",
  },
} satisfies Record<string, ErrorApi>;
