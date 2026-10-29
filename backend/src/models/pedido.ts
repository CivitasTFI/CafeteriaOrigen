import { obtenerProducto } from "../data/catalogo";

export class Pedido {

    constructor(
        public id: number,
        public items: { productoId: number; cantidad: number }[],
        public estado: string
    ) {}

    public calcularTotal(): number {
        return this.items.reduce((total, item) => {
            const producto = obtenerProducto(item.productoId);

            if (!producto) {
                throw new Error(
                    `No existe el producto ${item.productoId}`
                );
            }

            return total + producto.calcularPrecio() * item.cantidad;
        }, 0);
    }
}