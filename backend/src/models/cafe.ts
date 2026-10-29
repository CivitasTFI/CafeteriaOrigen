import { Producto } from "./producto";

export abstract class Cafe extends Producto {
    protected readonly precioVariedad: number;

    protected readonly variedadesPrecio: { [key: string]: number } = {
        'brasil': 140,
        'colombia': 180,
        'etiopia': 240,
    };

    constructor(id: number, nombre: string, protected gramos: number, variedad: string) {
        super(id, nombre);
        this.precioVariedad = this.variedadesPrecio[variedad];
    }

    public calcularPrecio(): number {
        return this.precioBase + this.precioVariedad * this.gramos;
    }
}