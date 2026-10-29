import { Producto } from '../models/producto';
import { Expreso } from '../models/expreso';
import { Filtrado } from '../models/filtrado';
import { Pasteleria } from '../models/pasteleria';

const expresoPocilloBrasil = new Expreso(1, 'Expreso Pocillo Brasil', 'pocillo', 'brasil');
const expresoPocilloColombia = new Expreso(2, 'Expreso Pocillo Colombia', 'pocillo', 'colombia');
const expresoPocilloEtiopia = new Expreso(3, 'Expreso Pocillo Etiopia', 'pocillo', 'etiopia');
const expresoMedianoBrasil = new Expreso(4, 'Expreso Mediano Brasil', 'mediano', 'brasil');
const expresoMedianoColombia = new Expreso(5, 'Expreso Mediano Colombia', 'mediano', 'colombia');
const expresoMedianoEtiopia = new Expreso(6, 'Expreso Mediano Etiopia', 'mediano', 'etiopia');
const expresoGrandeBrasil = new Expreso(7, 'Expreso Taza Grande Brasil', 'taza grande', 'brasil');
const expresoGrandeColombia = new Expreso(8, 'Expreso Taza Grande Colombia', 'taza grande', 'colombia');
const expresoGrandeEtiopia = new Expreso(9, 'Expreso Taza Grande Etiopia', 'taza grande', 'etiopia');

const filtradoPocilloBrasil = new Filtrado(10, 'Filtrado Pocillo Brasil', 'pocillo', 'brasil');
const filtradoPocilloColombia = new Filtrado(11, 'Filtrado Pocillo Colombia', 'pocillo', 'colombia');
const filtradoPocilloEtiopia = new Filtrado(12, 'Filtrado Pocillo Etiopia', 'pocillo', 'etiopia');
const filtradoMedianoBrasil = new Filtrado(13, 'Filtrado Mediano Brasil', 'mediano', 'brasil');
const filtradoMedianoColombia = new Filtrado(14, 'Filtrado Mediano Colombia', 'mediano', 'colombia');
const filtradoMedianoEtiopia = new Filtrado(15, 'Filtrado Mediano Etiopia', 'mediano', 'etiopia');
const filtradoGrandeBrasil = new Filtrado(16, 'Filtrado Taza Grande Brasil', 'taza grande', 'brasil');
const filtradoGrandeColombia = new Filtrado(17, 'Filtrado Taza Grande Colombia', 'taza grande', 'colombia');
const filtradoGrandeEtiopia = new Filtrado(18, 'Filtrado Taza Grande Etiopia', 'taza grande', 'etiopia');

const muffinDeChocolate = new Pasteleria(19, 'Muffin de Chocolate', 'muffin de chocolate');
const tortaSelvaNegra = new Pasteleria(20, 'Torta Selva Negra', 'torta selva negra');

export const catalogoProductos: Producto[] = [
    expresoPocilloBrasil,
    expresoPocilloColombia,
    expresoPocilloEtiopia,
    expresoMedianoBrasil,
    expresoMedianoColombia,
    expresoMedianoEtiopia,
    expresoGrandeBrasil,
    expresoGrandeColombia,
    expresoGrandeEtiopia,
    filtradoPocilloBrasil,
    filtradoPocilloColombia,
    filtradoPocilloEtiopia,
    filtradoMedianoBrasil,
    filtradoMedianoColombia,
    filtradoMedianoEtiopia,
    filtradoGrandeBrasil,
    filtradoGrandeColombia,
    filtradoGrandeEtiopia,
    muffinDeChocolate,
    tortaSelvaNegra
];

export function obtenerProducto(id: number): Producto | undefined {
    return catalogoProductos.find(p => p.id === id);
}