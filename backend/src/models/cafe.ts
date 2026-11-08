import { Producto } from "./producto";

export abstract class Cafe extends Producto {
    public readonly tipo: 'cafe' = 'cafe';
    public abstract readonly tipoCafe: 'expreso' | 'filtrado';
    public abstract tamaño: 'pocillo' | 'mediano' | 'taza grande';
    protected readonly precioVariedad: number;

    private readonly variedadesPrecio: { [key: string]: number } = {
        'brasil': 140,
        'colombia': 180,
        'etiopia': 240,
    };

    constructor(id: number,
        nombre: string,
        private readonly gramos: number,
        public readonly variedad: 'brasil' | 'colombia' | 'etiopia',
    ) {
        super(id, nombre);
        this.precioVariedad = this.variedadesPrecio[this.variedad];
    }

    public calcularPrecio(): number {
        return this.precioBase + this.precioVariedad * this.gramos;
    }
}