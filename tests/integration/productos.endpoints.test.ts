import request from 'supertest';
import app from '../../src/app';

describe('Endpoints de productos', () => {
    describe('GET /productos', () => {
        it('deberia devolver todos los productos del catalogo', async () => {
            const response = await request(app).get('/productos');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(20);
        });
    });

    describe('GET /productos/:id', () => {
        it('deberia devolver el producto correspondiente al id', async () => {
            const response = await request(app).get('/productos/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: 1,
                    nombre: 'Expreso Pocillo Brasil'
                })
            );
        });
    });
});