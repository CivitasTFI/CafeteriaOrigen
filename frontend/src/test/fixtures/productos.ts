import type { ProductosBase } from "../../api/esquemas/productos";

// Productos existentes del catálogo actual para escenarios de prueba.
export const productosApi = [
  { id: 5, nombre: "Expreso Mediano Colombia", precio: 7360 },
  { id: 19, nombre: "Muffin de Chocolate", precio: 2500 },
] satisfies ProductosBase;
