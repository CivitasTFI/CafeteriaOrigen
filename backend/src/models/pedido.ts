import { obtenerProducto } from "../data/catalogo";

export class Pedido {
    public estado = "pendiente";
    
    constructor(
        public id: number,
        public items: { productoId: number; cantidad: number }[],
        public mesaId?: number
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