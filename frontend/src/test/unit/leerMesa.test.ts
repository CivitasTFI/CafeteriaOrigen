import {describe, expect, it} from "vitest";
import {leerMesa} from "../../utils/leerMesa";

describe("leer mesa", () => {

    it("parámetro ausente", () => {
        const parametros = new URLSearchParams();

        expect(leerMesa(parametros)).toBeUndefined();
    })

    it("leer mesa válida", () => {
        const parametros = new URLSearchParams("mesaId=4");

        expect(leerMesa(parametros)).toBe(4);
    })

    it("leer mesa inválida", () => {
        const parametros = new URLSearchParams("mesaId=9");

        expect(() => leerMesa(parametros))
            .toThrow("mesa inválida");
    })

    it("texto", () => {
        const parametros = new URLSearchParams("mesaId=abc");

        expect(() => leerMesa(parametros))
            .toThrow("ingresar un número entero");
    })

    it("parámetro vacío", () => {
        const parametros = new URLSearchParams("mesaId=");

        expect(() => leerMesa(parametros))
            .toThrow("El parámetro no debe estar vacío");
    })
})