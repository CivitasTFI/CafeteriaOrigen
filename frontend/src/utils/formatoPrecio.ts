const formatoArgentino = new Intl.NumberFormat("es-AR");
export function formatoPrecio(precio: number): string {
    return `$${formatoArgentino.format(precio)}`;
}