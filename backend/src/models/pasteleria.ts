import { Producto } from "./producto";

export class Pasteleria extends Producto {
    public readonly tipo: 'pasteleria' = 'pasteleria';
    protected readonly precioBase: number;

    private readonly variedadesPrecio: { [key: string]: number } = {
        'muffin de chocolate': 2500,
        'torta selva negra': 4200,
    };

    constructor(id: number, nombre: string, public readonly variedad: 'muffin de chocolate' | 'torta selva negra') {
        super(id, nombre);
        this.precioBase = this.variedadesPrecio[this.variedad];
    }

    calcularPrecio(): number {
        return this.precioBase;
    }
}