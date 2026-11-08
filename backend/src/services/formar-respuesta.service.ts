import { InterfazPropiedadesProducto } from "../data/interfaz-propiedades-producto";
import { Producto } from "../models/producto";
import { Cafe } from "../models/cafe";
import { Pasteleria } from "../models/pasteleria";

const variedadesDescripcion: { [key: string]: string } = {
    'brasil': 'Acidez media, cuerpo equilibrado, notas citricas y florales',
    'colombia': 'Acidez muy viva, cuerpo ligero y notas frutales',
    'etiopia': 'Acidez baja, cuerpo denso y notas de avellana',
}

export function normalizarInput(input: Producto) : InterfazPropiedadesProducto {
    switch (input.tipo) {
        case 'cafe':
            const cafe = input as Cafe;
            return {
                id: cafe.id,
                nombre: cafe.nombre,
                tipo: cafe.tipo,
                tipoCafe: cafe.tipoCafe,
                tamaño: cafe.tamaño,
                variedad: cafe.variedad,
                variedadDescripcion: variedadesDescripcion[cafe.variedad],
                precio: cafe.calcularPrecio(),
            }
        case 'pasteleria':
            const pasteleria = input as Pasteleria;
            return {
                id: pasteleria.id,
                nombre: pasteleria.nombre,
                tipo: pasteleria.tipo,
                variedad: pasteleria.variedad,
                precio: pasteleria.calcularPrecio(),
            }
    }
}

export function formarRespuestaObjeto(producto: InterfazPropiedadesProducto) {
    switch (producto.tipo) {
        case 'cafe':
            return {
                id: producto.id,
                nombre: producto.nombre,
                tipo: producto.tipo,
                tipoCafe: producto.tipoCafe,
                tamaño: producto.tamaño,
                variedad: {nombre: producto.variedad, descripcion: producto.variedadDescripcion},
                precio: producto.precio
            }
        case 'pasteleria':
            return {
                id: producto.id,
                nombre: producto.nombre,
                tipo: producto.tipo,
                variedad: producto.variedad,
                precio: producto.precio
            }
    }
}

export function formarRespuestaArray(data: Array<InterfazPropiedadesProducto>) {
    return data.map(producto => {
        switch (producto.tipo) {
            case 'cafe':
                return {
                    id: producto.id,
                    nombre: producto.nombre,
                    tipo: producto.tipo,
                    tipoCafe: producto.tipoCafe,
                    tamaño: producto.tamaño,
                    variedad: {nombre: producto.variedad, descripcion: producto.variedadDescripcion},
                    precio: producto.precio
                }
            case 'pasteleria':
                return {
                    id: producto.id,
                    nombre: producto.nombre,
                    tipo: producto.tipo,
                    variedad: producto.variedad,
                    precio: producto.precio
                }
        }
    }).filter(producto => producto !== null)
}