import { buscarProducto } from "../../src/services/buscar-producto.service";
import { Producto } from "../../src/models/producto";
import { Cafe } from "../../src/models/cafe";
import { Pasteleria } from "../../src/models/pasteleria";

describe("Servicio de buscar producto", () => {
    it("buscar productos por tipo y variedad", () => {
        const productos = buscarProducto({ tipo: "cafe", variedad: "brasil" });
        expect((productos as Producto[]).every(producto => producto.tipo === "cafe" && (producto as Cafe | Pasteleria).variedad === "brasil")).toBe(true);
    });

    it("buscar productos por tipoCafe y tamaño", () => {
        const producto = buscarProducto({ tipoCafe: "expreso", tamaño: "taza grande" });
        expect((producto as Producto[]).every(producto => (producto as Cafe).tipoCafe === "expreso" && (producto as Cafe).tamaño === "taza grande")).toBe(true);
    });

    it("no encontrar productos", () => {
        const respuesta = buscarProducto({ tipo: "cafe", variedad: "torta selva negra" });
        expect(respuesta).toBe("Producto no encontrado");
    });
});
