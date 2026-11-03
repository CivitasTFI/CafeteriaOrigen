import { Cafe } from "./cafe";

export class Filtrado extends Cafe {
    public readonly tipoCafe: 'filtrado' = 'filtrado';
    protected readonly precioBase: number = 3200;
    public tamaño;

    constructor(id: number,
        nombre: string,
        tamaño: 'pocillo' | 'mediano' | 'taza grande',
        variedad: 'brasil' | 'colombia' | 'etiopia'
        ) {
        const tamañosG: { [key: string]: number } = {
            'pocillo': 6,
            'mediano': 15,
            'taza grande': 25,
        };

        const gramos = tamañosG[tamaño];
        super(id, nombre, gramos, variedad);
        this.tamaño = tamaño;
    }
}