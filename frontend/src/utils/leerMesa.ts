const MESA_VALIDAS = [1,2,3,4,5,6,7,8];

export function leerMesa (parametros: URLSearchParams): number | undefined {
    
    const valor = parametros.get("mesaId");

    if (valor === null) {
        return undefined;
    }

    return validarMesa(valor);
}

function validarMesa (valor:string): number {

    if (valor.trim() === ""){
        throw new Error("El parámetro no debe estar vacío");
    }

    const mesaId = Number(valor);

    
    if (!Number.isInteger(mesaId)){
        throw new Error("ingresar un número entero")
    }

    if(!MESA_VALIDAS.includes(mesaId)){
        throw new Error("mesa inválida");
    }

    return mesaId;
}