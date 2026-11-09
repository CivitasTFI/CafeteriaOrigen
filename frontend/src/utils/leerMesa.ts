import { esquemaPedido } from "../api/esquemas/pedidos";

export function leerMesa(parametros: URLSearchParams): number | undefined {
  const valores = parametros.getAll("mesa");
  if (valores.length !== 1) return undefined;
  return validarMesa(valores[0] ?? "");
}

function validarMesa(valor: string): number | undefined {
  if (!/^\d+$/.test(valor)) return undefined;
  const resultado = esquemaPedido.shape.mesaId.safeParse(Number(valor));
  return resultado.success ? resultado.data : undefined;
}
