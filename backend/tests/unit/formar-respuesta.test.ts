import { catalogoProductos } from "../../src/data/catalogo";
import { normalizarInput, formarRespuestaObjeto, formarRespuestaArray } from "../../src/services/formar-respuesta.service";

describe('formarRespuesta', () => {
    test('debe formar una respuesta correcta para un producto', () => {
        const producto = catalogoProductos[0];
        // Se asumirá desde los test un sistema de normalizado para evitar acomplamiento
        const productoNormalizado = normalizarInput(producto);
        const respuestaObjeto = formarRespuestaObjeto(productoNormalizado);
        expect(respuestaObjeto).toEqual({
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

    test('debe formar una respuesta correcta para un array de productos', () => {
        const productos = catalogoProductos.slice(0, 2);
        // Se asumirá desde los test un sistema de normalizado para evitar acomplamiento
        const productosNormalizados = productos.map(producto => normalizarInput(producto));
        const respuestaArray = formarRespuestaArray(productosNormalizados);
        expect(respuestaArray).toEqual([
            {
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
            },
            {
                id: 2,
                nombre: 'Expreso Pocillo Colombia',
                tipo: 'cafe',
                tipoCafe: 'expreso',
                tamaño: 'pocillo',
                variedad: {
                    nombre: 'colombia',
                    descripcion: 'Acidez muy viva, cuerpo ligero y notas frutales',
                },
                precio: 5740,
            },
        ]);
    });
});