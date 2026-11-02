export abstract class Producto {
    public abstract tipo: 'Cafe' | 'Pasteleria';
    protected abstract readonly precioBase: number;

    constructor(public id: number, public nombre: string) {}

    public abstract calcularPrecio(): number;
}