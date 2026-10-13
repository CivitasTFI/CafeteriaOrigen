export abstract class Producto {
    protected abstract precioBase: number;

    constructor(public id: number, public nombre: string) {}

    public abstract calcularPrecio(): number;
}