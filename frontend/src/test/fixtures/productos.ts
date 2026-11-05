import type { Producto, Productos } from "../../api/esquemas/productos";

// Productos existentes del catálogo actual para escenarios de prueba.
export const cafeApi = {
  id: 5,
  nombre: "Expreso Mediano Colombia",
  precio: 7360,
  tipo: "cafe",
  tipoCafe: "expreso",
  tamaño: "mediano",
  variedad: {
    nombre: "colombia",
    descripcion: "Acidez muy viva, cuerpo ligero y notas frutales",
  },
} satisfies Producto;

export const pasteleriaApi = {
  id: 19,
  nombre: "Muffin de Chocolate",
  precio: 2500,
  tipo: "pasteleria",
  variedad: "muffin de chocolate",
} satisfies Producto;

export const productosApi = [cafeApi, pasteleriaApi] satisfies Productos;
