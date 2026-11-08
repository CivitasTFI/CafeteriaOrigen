import { describe, it, expect } from "vitest";
import { formatoPrecio } from "../../utils/formatoPrecio";

describe('formatoPrecio', () => {
    it('debe formatear un precio correctamente', () => {
        expect(formatoPrecio(1000)).toBe('$1.000');
    });
});