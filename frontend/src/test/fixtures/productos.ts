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

export const cafeExpresoPocilloColombia = {
  id: 2,
  nombre: "Expreso Pocillo Colombia",
  precio: 5740,
  tipo: "cafe",
  tipoCafe: "expreso",
  tamaño: "pocillo",
  variedad: {
    nombre: "colombia",
    descripcion: "Acidez muy viva, cuerpo ligero y notas frutales",
  },
} satisfies Producto;

export const cafeExpresoMedianoBrasil = {
  id: 4,
  nombre: "Expreso Mediano Brasil",
  precio: 6280,
  tipo: "cafe",
  tipoCafe: "expreso",
  tamaño: "mediano",
  variedad: {
    nombre: "brasil",
    descripcion: "Acidez media, cuerpo equilibrado, notas citricas y florales",
  },
} satisfies Producto;

export const cafeExpresoMedianoEtiopia = {
  id: 6,
  nombre: "Expreso Mediano Etiopia",
  precio: 8980,
  tipo: "cafe",
  tipoCafe: "expreso",
  tamaño: "mediano",
  variedad: {
    nombre: "etiopia",
    descripcion: "Acidez baja, cuerpo denso y notas de avellana",
  },
} satisfies Producto;

export const pasteleriaApi = {
  id: 19,
  nombre: "Muffin de Chocolate",
  precio: 2500,
  tipo: "pasteleria",
  variedad: "muffin de chocolate",
} satisfies Producto;

export const tortaApi = {
  id: 20,
  nombre: "Torta Selva Negra",
  precio: 4800,
  tipo: "pasteleria",
  variedad: "torta selva negra",
} satisfies Producto;

export const productosApi = [cafeApi, pasteleriaApi] satisfies Productos;

export const catalogoPrueba = [
  cafeExpresoPocilloColombia,
  cafeExpresoMedianoBrasil,
  cafeApi,
  cafeExpresoMedianoEtiopia,
  pasteleriaApi,
  tortaApi,
] satisfies Productos;
