import { crearPedido } from "../api/pedidos";
import type { ItemPedido } from "../api/esquemas/pedidos";

export function usePedido() {
    async function enviarPedido(items: ItemPedido[], mesaId?: number){
        return await crearPedido(items, mesaId);
    }


    return { enviarPedido };
}