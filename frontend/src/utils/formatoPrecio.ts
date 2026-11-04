export function formatoPrecio(precio: number): string {
    return `$${precio.toLocaleString('es-AR')}`;
}