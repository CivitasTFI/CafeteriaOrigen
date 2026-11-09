import { crearPedido } from "../api/pedidos";
import type { ItemPedido } from "../api/esquemas/pedidos";
import {consultarPedido} from "../api/pedidos.ts";

export function usePedido() {
    async function enviarPedido(items: ItemPedido[], mesaId?: number){
        return await crearPedido(items, mesaId);
    }

     async function consultarEstadoPedido(id: number) {
        return await consultarPedido(id);
    }

    return { enviarPedido, consultarEstadoPedido };
}