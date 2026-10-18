
import { obtenerProducto} from "../data/catalogo";


// Valida los datos del pedido
export function validarPedido(pedido:{productoId:number, cantidad:number}[]): void {

    // Validar que haya items
    if (!pedido || pedido.length === 0) {
        throw new Error("El pedido debe contener al menos un producto");
    }

    for (const item of pedido) {

        // Validar que la cantidad sea un entero positivo
        if (!Number.isInteger(item.cantidad) || item.cantidad <= 0) {
            throw new Error(
                `La cantidad del producto ${item.productoId} debe ser un entero positivo`
            );
        }

        // Validar que el producto exista
        const producto = obtenerProducto(item.productoId);

        if (!producto) {
            throw new Error(
                `No existe el producto ${item.productoId}`
            );
        }
    }
}