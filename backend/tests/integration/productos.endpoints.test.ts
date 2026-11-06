import request from 'supertest';
import app from '../../src/app';
import { catalogoEsperado } from '../fixtures/productos';

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
