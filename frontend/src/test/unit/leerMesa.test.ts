import {describe, expect, it, test} from "vitest";
import {leerMesa} from "../../utils/leerMesa";

describe("leer mesa", () => {

    it("leer mesa válida", () => {
        const parametros = new URLSearchParams("mesaId=4");

        expect(leerMesa(parametros)).toBe(4);
    })
})