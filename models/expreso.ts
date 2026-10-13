import { Cafe } from "./cafe";

export class Expreso extends Cafe {
    protected readonly precioBase: number = 2500;

    constructor(id: number, nombre: string, tamaño: string, variedad: string) {
        const tamañosG: { [key: string]: number } = {
            'pocillo': 18,
            'mediano': 27,
            'taza grande': 36,
        };

        const gramos = tamañosG[tamaño];
        super(id, nombre, gramos, variedad);
    }
}