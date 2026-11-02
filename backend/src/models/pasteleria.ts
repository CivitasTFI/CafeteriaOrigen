import { Producto } from "./producto";

export class Pasteleria extends Producto {
    public readonly tipo: 'Pasteleria' = 'Pasteleria';
    protected readonly precioBase: number;

    private readonly variedadesPrecio: { [key: string]: number } = {
        'muffin de chocolate': 2500,
        'torta selva negra': 4200,
    };

    constructor(id: number, nombre: string, variedad: string) {
        super(id, nombre);
        this.precioBase = this.variedadesPrecio[variedad];
    }

    calcularPrecio(): number {
        return this.precioBase;
    }
}