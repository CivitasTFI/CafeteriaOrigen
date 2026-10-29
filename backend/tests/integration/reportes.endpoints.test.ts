import request from 'supertest';
import app from '../../src/app';
import { pedidos } from '../../src/data/pedidos';
// Casos borde: sin pedidos y empate en el más vendido.

describe('Endpoints de reportes', () => {
    // Antes de los tests vacio el array de pedidos para que no haya interferencias.
    beforeEach(() => { 
        pedidos.length = 0;
    })
    // Devuelve cuanto se facturó 
    describe('GET /reportes/facturacion', () => { 
        it('verifica que responda 200 y devuelva 0 cuando no hay pedidios', async () => {
            // 1. Ejecuta la petición HTTP
            const response = await request(app).get('/reportes/facturacion');
            // 2. Verifica el código de estado
            expect(response.status).toBe(200);
            // 3. Verifica el contenido del JSON retornado
            expect(response.body).toEqual({ facturacion: 0 });
        })
        it ('verifica que responda 200 y devuelva la facturacion total cuando hay pedidos', async () => {
            pedidos.push({
                id: 1,
                items: [{productoId: 1, cantidad: 3}, {productoId: 3, cantidad: 1}],
                estado: 'completado',
                calcularTotal: () => 1000
            });
            const response = await request(app).get('/reportes/facturacion');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ facturacion: 1000 });
        })
    });
    // Devuelve el o los prodúctos más vendidos 
    describe('GET /reportes/mas-vendido', () => {
        it( 'verifica que responda 200 y devuelva el producto mas vendido cuando hay un único ganador', async () => {
            pedidos.push({
                id: 1,
                items: [
                    { productoId: 1, cantidad: 5 },
                    { productoId: 2, cantidad: 2 }
                ],
                estado: 'completado',
                calcularTotal: () => 10000
            });
            const response = await request(app).get('/reportes/mas-vendido');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({productosMasVendidos:['Expreso Pocillo Brasil']});
        });
        it ('verifica que responda 200 y devuelva los productos más vendidos cuando hay un empate', async() => {
            pedidos.push({
                id: 1,
                items: [{productoId: 2, cantidad: 3}, {productoId: 5, cantidad: 3}],
                estado: 'completado',
                calcularTotal: () => 10000
            });
            const response = await request(app).get('/reportes/mas-vendido');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({productosMasVendidos: ['Expreso Pocillo Colombia', 'Expreso Mediano Colombia']});
        })
        it ('verifica que responda 200 y devuelva un array vacío cuando no hay pedidos', async () => {
            const response = await request(app).get('/reportes/mas-vendido');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({productosMasVendidos: []});
        })
    });
});
