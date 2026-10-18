import { obtenerProducto} from "../data/catalogo";

export class Pedido {

    constructor(public id: number, public items:{productoId:number, cantidad:number}[], public estado:string){}

    public calcularTotal(): number {
        return this.items.reduce((total, item) => {
                const producto = obtenerProducto(item.productoId);
        
                //Esta validación la había agregado en la función pero me salía una alerta así que la deje acá xd
                 if (!producto) {
                    throw new Error(
                        `No existe el producto ${item.productoId}`
                    );
                }
        
                return total + producto.calcularPrecio() * item.cantidad
            }, 0)
    }
}