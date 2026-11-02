import { Producto } from "./producto";

export abstract class Cafe extends Producto {
    public readonly tipo: 'Cafe' = 'Cafe';
    public abstract readonly tipoCafe: 'Expreso' | 'Filtrado';
    protected readonly precioVariedad: number;

    private readonly variedadesPrecio: { [key: string]: number } = {
        'brasil': 140,
        'colombia': 180,
        'etiopia': 240,
    };

    constructor(id: number, nombre: string, private readonly gramos: number, variedad: string) {
        super(id, nombre);
        this.precioVariedad = this.variedadesPrecio[variedad];
    }

    public calcularPrecio(): number {
        return this.precioBase + this.precioVariedad * this.gramos;
    }
}