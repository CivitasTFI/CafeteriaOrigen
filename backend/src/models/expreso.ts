import { Cafe } from "./cafe";

export class Expreso extends Cafe {
    public readonly tipoCafe: 'expreso' = 'expreso';
    protected readonly precioBase: number = 2500;
    public tamaño;

    constructor(id:
        number,
        nombre: string,
        tamaño: 'pocillo' | 'mediano' | 'taza grande',
        variedad: 'brasil' | 'colombia' | 'etiopia',
    ) {
        const tamañosG: { [key: string]: number } = {
            'pocillo': 18,
            'mediano': 27,
            'taza grande': 36,
        };

        const gramos = tamañosG[tamaño];
        super(id, nombre, gramos, variedad);
        this.tamaño = tamaño;
    }
}