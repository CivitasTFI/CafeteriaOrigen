import { buscarProducto } from "../../src/services/buscar-producto.service";
import { Producto } from "../../src/models/producto";
import { Cafe } from "../../src/models/cafe";
import { Pasteleria } from "../../src/models/pasteleria";

describe("Servicio de buscar producto", () => {
    it("devuelve los seis cafés de Brasil al filtrar por tipo y variedad", () => {
        const productos = buscarProducto({ tipo: "cafe", variedad: "brasil" });
        expect((productos as Producto[])
            .map(producto => producto.id)
            .sort((a, b) => a - b)).toEqual([1, 4, 7, 10, 13, 16]);
        expect((productos as Producto[]).every(producto => producto.tipo === "cafe" && (producto as Cafe | Pasteleria).variedad === "brasil")).toBe(true);
    });

    it("devuelve los tres expresos grandes al filtrar por bebida y tamaño", () => {
        const producto = buscarProducto({ tipoCafe: "expreso", tamaño: "taza grande" });
        expect((producto as Producto[])
            .map(producto => producto.id)
            .sort((a, b) => a - b)).toEqual([7, 8, 9]);
        expect((producto as Producto[]).every(producto => (producto as Cafe).tipoCafe === "expreso" && (producto as Cafe).tamaño === "taza grande")).toBe(true);
    });

    it("no encontrar productos", () => {
        const respuesta = buscarProducto({ tipo: "cafe", variedad: "torta selva negra" });
        expect(respuesta).toBe("Producto no encontrado");
    });
});
