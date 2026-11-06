import request from 'supertest';
import app from '../../src/app';

const descripcionesOrigen = {
    brasil: 'Acidez media, cuerpo equilibrado, notas citricas y florales',
    colombia: 'Acidez muy viva, cuerpo ligero y notas frutales',
    etiopia: 'Acidez baja, cuerpo denso y notas de avellana',
};

// ID, nombre, bebida, tamaño, origen y precio: valores fijos, sin usar el cálculo de la API.
const cafesEsperados = [
    [1, 'Expreso Pocillo Brasil', 'expreso', 'pocillo', 'brasil', 5020],
    [2, 'Expreso Pocillo Colombia', 'expreso', 'pocillo', 'colombia', 5740],
    [3, 'Expreso Pocillo Etiopia', 'expreso', 'pocillo', 'etiopia', 6820],
    [4, 'Expreso Mediano Brasil', 'expreso', 'mediano', 'brasil', 6280],
    [5, 'Expreso Mediano Colombia', 'expreso', 'mediano', 'colombia', 7360],
    [6, 'Expreso Mediano Etiopia', 'expreso', 'mediano', 'etiopia', 8980],
    [7, 'Expreso Taza Grande Brasil', 'expreso', 'taza grande', 'brasil', 7540],
    [8, 'Expreso Taza Grande Colombia', 'expreso', 'taza grande', 'colombia', 8980],
    [9, 'Expreso Taza Grande Etiopia', 'expreso', 'taza grande', 'etiopia', 11140],
    [10, 'Filtrado Pocillo Brasil', 'filtrado', 'pocillo', 'brasil', 4040],
    [11, 'Filtrado Pocillo Colombia', 'filtrado', 'pocillo', 'colombia', 4280],
    [12, 'Filtrado Pocillo Etiopia', 'filtrado', 'pocillo', 'etiopia', 4640],
    [13, 'Filtrado Mediano Brasil', 'filtrado', 'mediano', 'brasil', 5300],
    [14, 'Filtrado Mediano Colombia', 'filtrado', 'mediano', 'colombia', 5900],
    [15, 'Filtrado Mediano Etiopia', 'filtrado', 'mediano', 'etiopia', 6800],
    [16, 'Filtrado Taza Grande Brasil', 'filtrado', 'taza grande', 'brasil', 6700],
    [17, 'Filtrado Taza Grande Colombia', 'filtrado', 'taza grande', 'colombia', 7700],
    [18, 'Filtrado Taza Grande Etiopia', 'filtrado', 'taza grande', 'etiopia', 9200],
] as const;

const catalogoEsperado = [
    ...cafesEsperados.map(([id, nombre, tipoCafe, tamaño, origen, precio]) => ({
        id,
        nombre,
        tipo: 'cafe',
        tipoCafe,
        tamaño,
        variedad: {
            nombre: origen,
            descripcion: descripcionesOrigen[origen],
        },
        precio,
    })),
    {
        id: 19,
        nombre: 'Muffin de Chocolate',
        tipo: 'pasteleria',
        variedad: 'muffin de chocolate',
        precio: 2500,
    },
    {
        id: 20,
        nombre: 'Torta Selva Negra',
        tipo: 'pasteleria',
        variedad: 'torta selva negra',
        precio: 4200,
    },
];

describe('Endpoints de productos', () => {
    describe('GET /productos', () => {
        it('devuelve los 20 productos con sus IDs, precios y campos públicos', async () => {
            const response = await request(app).get('/productos');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(20);
            expect(response.body).toEqual(expect.arrayContaining(catalogoEsperado));
        });
    });

    describe('GET /productos/:id', () => {
        it.each(catalogoEsperado)('devuelve el contrato completo de $nombre (ID $id)', async (productoEsperado) => {
            const response = await request(app).get(`/productos/${productoEsperado.id}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(productoEsperado);
        });

        it('deberia devolver 404 si el producto no existe', async () => {
            const response = await request(app).get('/productos/999');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                error: 'Producto no encontrado'
            });
        });
    });
});
