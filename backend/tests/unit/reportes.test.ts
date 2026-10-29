import { calcularFacturacionTotal, cantidadVendidaPorProducto, productoMasVendido } from '../../src/services/reportes.service';

interface Pedido {
    id: number;
    items: { productoId: number; cantidad: number }[];
    estado: string;
    calcularTotal: () => number;
}

describe('calcularFacturacionTotal', () => {
    it('verifica que la facturación total (suma de los totales de todos los pedidos) sea 0 cuando no hay pedidos', () => {
        const listaPedidos: Pedido[] = [];
        // Llamo a la función que calcula la facturación total y verifico que el resultado sea 0
        // calcularFacturacionTotal es una funcion que recibe un array de pedidos y devuelve la facturación total
        const facturacionTotal = calcularFacturacionTotal(listaPedidos);
        expect(facturacionTotal).toBe(0);
    });

    it('verifica que la facturación total sea la suma de los totales de todos los pedidos cuando hay pedidos', () => {
        const pedido1: Pedido = {
            id: 1,
            items: [
                { productoId: 1, cantidad: 2 },
                { productoId: 2, cantidad: 3 }
            ],
            estado: 'completado',
            calcularTotal: () => 10000
        };
        const pedido2: Pedido = {
            id: 2,
            items: [
                { productoId: 1, cantidad: 1 },
                { productoId: 3, cantidad: 4 }
            ],
            estado: 'completado',
            calcularTotal: () => 5000
        };
        const pedido3: Pedido = {
            id: 3,
            items: [
                { productoId: 2, cantidad: 2 },
                { productoId: 3, cantidad: 1 }
            ],
            estado: 'completado',
            calcularTotal: () => 3000
        };
        const listaPedidos: Pedido[] = [pedido1, pedido2, pedido3];
        const facturacionTotal = calcularFacturacionTotal(listaPedidos);
        // Suma esperada fija: 10000 + 5000 + 3000 = 18000
        expect(facturacionTotal).toBe(18000);
    });
});

describe('cantidadVendidaPorProducto', () => {
    it('verifica la cantidad vendida por producto cuando no hay pedidos', () => {
        const listaPedidos: Pedido[] = [];
        // Se llama a la función que calcula la cantidad vendida por producto
        const cantidadVendida = cantidadVendidaPorProducto(listaPedidos);
        // Se espera que el resultado sea un objeto vacío ya que no hay pedidos
        expect(cantidadVendida).toEqual({});
    });
    it('verifica la cantidad vendida por producto cuando hay pedidos', () => {
        const pedido1: Pedido = {
            id: 1,
            items: [
                { productoId: 1, cantidad: 2 },
                { productoId: 2, cantidad: 3 }
            ],
            estado: 'completado',
            calcularTotal: () => 10000
        };
        const pedido2: Pedido = {
            id: 2,
            items: [
                { productoId: 1, cantidad: 1 },
                { productoId: 3, cantidad: 4 }
            ],
            estado: 'completado',
            calcularTotal: () => 5000
        };
        const listaPedidos: Pedido[] = [pedido1, pedido2];
        const cantidadVendida = cantidadVendidaPorProducto(listaPedidos);
        // Se espera que el resultado sea un objeto con la cantidad vendida por producto
        expect(cantidadVendida).toEqual({ 'Expreso Pocillo Brasil': 3, 'Expreso Pocillo Colombia': 3, 'Expreso Pocillo Etiopia': 4 });
    })
});

describe('productoMasVendido', () => {
    it('verifica que devuelva los dos productos mas vendidos cuando hay un empate', () => {
        // se calcula a partir del resultado de la funcion anterior
        const pedido1: Pedido = {
            id: 1,
            items: [
                { productoId: 1, cantidad: 2 },
                { productoId: 2, cantidad: 2 }
            ],
            estado: 'completado',
            calcularTotal: () => 10000
        }
        const pedido2: Pedido = {
            id: 2,
            items: [
                { productoId: 1, cantidad: 2 },
                { productoId: 2, cantidad: 2 }
            ],
            estado: 'completado',
            calcularTotal: () => 5000
        }
        const pedido3: Pedido = {
            id: 3,
            items: [
                { productoId: 1, cantidad: 2 },
                { productoId: 2, cantidad: 2 }
            ],
            estado: 'completado',
            calcularTotal: () => 3000
        }
        const listaPedidos: Pedido[] = [pedido1, pedido2, pedido3];
        // Se llama a la función que calcula el producto más vendido
        const masVendido = productoMasVendido(listaPedidos);
        // Se espera que el resultado sea un array con los dos productos más vendidos
        expect(masVendido).toEqual(['Expreso Pocillo Brasil', 'Expreso Pocillo Colombia']);
    })
    it('verifica el producto más vendido cuando hay un único ganador', () => { 
        const pedido1: Pedido = {
            id: 1,
            items: [
                { productoId: 1, cantidad: 5 },
                { productoId: 2, cantidad: 2 }
            ],
            estado: 'completado',
            calcularTotal: () => 10000
        }
        const listaPedidos: Pedido[] = [pedido1];
        // Se llama a la función que calcula el producto más vendido
        const masVendido = productoMasVendido(listaPedidos);
        // Se espera que el resultado sea un array con el producto más vendido
        expect(masVendido).toEqual(['Expreso Pocillo Brasil']);

    });
    it('verifica que devuelva un array vacío cuando no hay pedidos', () => {
    const resultado = productoMasVendido([]);
    expect(resultado).toEqual([]);
    });

});