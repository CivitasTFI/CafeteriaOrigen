import { InterfazProducto } from "../data/interfaz-producto";
import { catalogoProductos } from "../data/catalogo";
import { Producto } from "../models/producto";
import { Pasteleria } from "../models/pasteleria";
import { Cafe } from "../models/cafe";

export function buscarProducto(interfaz: InterfazProducto) {
    // Filtro con parámetros opcionales
    const respuesta: Producto[] | undefined = catalogoProductos.filter(
        (p: Producto) => 
            (!interfaz.tipo || p.tipo === interfaz.tipo) && 
            (!interfaz.variedad || (p as Cafe | Pasteleria).variedad === interfaz.variedad) &&
            (!interfaz.tipoCafe || (p as Cafe).tipoCafe === interfaz.tipoCafe) &&
            (!interfaz.tamaño || (p as Cafe).tamaño === interfaz.tamaño)
    );

    // Si no encuentra resultados retorna aviso
    if (respuesta.length === 0) {
        return "Producto no encontrado";
    }

    // Retorna los resultados encontrados al pasar por los filtros
    return respuesta;
}