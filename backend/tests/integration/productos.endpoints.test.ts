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

    describe('GET /productos/buscar', () => {
        it('devuelve los cafés que coinciden con tipoCafe y tamaño', async () => {
            const response = await request(app).get('/productos/buscar').query({
                tipoCafe: 'expreso',
                tamaño: 'taza grande',
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(3);
            expect(response.body.every((p: { tipoCafe: string }) => p.tipoCafe === 'expreso')).toBe(true);
        });

        it('devuelve pastelería por tipo y variedad', async () => {
            const response = await request(app).get('/productos/buscar').query({
                tipo: 'pasteleria',
                variedad: 'muffin de chocolate',
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].id).toBe(19);
        });

        it('devuelve 404 si no hay coincidencias', async () => {
            const response = await request(app).get('/productos/buscar').query({
                tipo: 'cafe',
                variedad: 'torta selva negra',
            });

            expect(response.status).toBe(404);
        });

        it('devuelve 400 sin criterios', async () => {
            const response = await request(app).get('/productos/buscar');

            expect(response.status).toBe(400);
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
