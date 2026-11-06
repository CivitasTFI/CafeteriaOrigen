import request from 'supertest';
import app from '../../src/app';

describe('Endpoints de productos', () => {
    describe('GET /productos', () => {
        it('deberia devolver todos los productos del catalogo', async () => {
            const response = await request(app).get('/productos');

            expect(response.status).toBe(200);

            // Solo se comprueba el primer producto del catalogo para no sobrecargar el test
            expect(response.body[0]).toEqual({
                id: 1,
                nombre: 'Expreso Pocillo Brasil',
                tipo: 'cafe',
                tipoCafe: 'expreso',
                tamaño: 'pocillo',
                variedad: {
                    nombre: 'brasil',
                    descripcion: 'Acidez media, cuerpo equilibrado, notas citricas y florales',
                },
                precio: 5020,
            });
        });
    });

    describe('GET /productos/:id', () => {
        it('deberia devolver el producto correspondiente al id', async () => {
            const response = await request(app).get('/productos/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: 1,
                nombre: 'Expreso Pocillo Brasil',
                tipo: 'cafe',
                tipoCafe: 'expreso',
                tamaño: 'pocillo',
                variedad: {
                    nombre: 'brasil',
                    descripcion: 'Acidez media, cuerpo equilibrado, notas citricas y florales',
                },
                precio: 5020,
            });
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