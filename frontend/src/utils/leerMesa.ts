const MESA_VALIDAS = [1,2,3,4,5,6,7,8];

export function leerMesa (parametros: URLSearchParams): number | undefined {
    
    const valor = parametros.get("mesaId");

    if (valor === null) {
        return undefined;
    }

    const mesaId = Number(valor);

    return mesaId;
}