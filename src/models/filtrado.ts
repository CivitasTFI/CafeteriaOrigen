import { Cafe } from "./cafe";

export class Filtrado extends Cafe {
    protected readonly precioBase: number = 3200;

    constructor(id: number, nombre: string, tamaño: string, variedad: string) {
        const tamañosG: { [key: string]: number } = {
            'pocillo': 6,
            'mediano': 15,
            'taza grande': 25,
        };

        const gramos = tamañosG[tamaño];
        super(id, nombre, gramos, variedad);
    }
}