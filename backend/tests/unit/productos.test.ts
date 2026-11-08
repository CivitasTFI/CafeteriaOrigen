import { Expreso } from '../../src/models/expreso';
import { Filtrado } from '../../src/models/filtrado';
import { Pasteleria } from '../../src/models/pasteleria';

describe('calcularPrecios', () => {
    it('deberia calcular el precio de 3 expresos de distinto tamaño y variedad', () => {
        const expresoPocilloBrasil = new Expreso(1, 'Expreso Pocillo Brasil', 'pocillo', 'brasil');
        const expresoMedianoColombia = new Expreso(5, 'Expreso Mediano Colombia', 'mediano', 'colombia');
        const expresoGrandeEtiopia = new Expreso(9, 'Expreso Taza Grande Etiopia', 'taza grande', 'etiopia');

        expect(expresoPocilloBrasil.calcularPrecio()).toBe(5020);
        expect(expresoMedianoColombia.calcularPrecio()).toBe(7360);
        expect(expresoGrandeEtiopia.calcularPrecio()).toBe(11140);
    });

    it ('deberia calcular el precio de 3 filtrados de distinto tamaño y variedad', () => {
        const filtradoPocilloBrasil = new Filtrado(10, 'Filtrado Pocillo Brasil', 'pocillo', 'brasil');
        const filtradoMedianoColombia = new Filtrado(14, 'Filtrado Mediano Colombia', 'mediano', 'colombia');
        const filtradoGrandeEtiopia = new Filtrado(18, 'Filtrado Taza Grande Etiopia', 'taza grande', 'etiopia');

        expect(filtradoPocilloBrasil.calcularPrecio()).toBe(4040);
        expect(filtradoMedianoColombia.calcularPrecio()).toBe(5900);
        expect(filtradoGrandeEtiopia.calcularPrecio()).toBe(9200);
    });

    it ('deberia calcular el precio de 2 productos de pasteleria', () => {
        const muffinDeChocolate = new Pasteleria(19, 'Muffin de Chocolate', 'muffin de chocolate');
        const tortaSelvaNegra = new Pasteleria(20, 'Torta Selva Negra', 'torta selva negra');
        
        expect(muffinDeChocolate.calcularPrecio()).toBe(2500);
        expect(tortaSelvaNegra.calcularPrecio()).toBe(4200);
    })
});
