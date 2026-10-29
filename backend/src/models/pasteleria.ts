import { Producto } from "./producto";

export class Pasteleria extends Producto {
    protected readonly precioBase: number;

    protected readonly variedadesG: { [key: string]: number } = {
        'muffin de chocolate': 2500,
        'torta selva negra': 4200,
    };

    constructor(id: number, nombre: string, variedad: string) {
        super(id, nombre);
        this.precioBase = this.variedadesG[variedad];
    }

    calcularPrecio(): number {
        return this.precioBase;
    }
}