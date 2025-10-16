import { PedidoService } from '@/services/PedidoService';
import dbConnect from '@/lib/mongodb';

export async function getPedidos() {
  return await PedidoService.buscarTodosPedidos();
}

export async function getPedidosCozinha() {
  return await PedidoService.buscarPedidosPorStatus('Recebido');
}

export async function getPedidoById(id: string) {
  return await PedidoService.buscarPedidoPorId(id);
}

export async function createPedido(data: any) {
  return await PedidoService.criarPedido(data);
}

export async function updateStatusPedido(id: string, status: string) {
  return await PedidoService.atualizarStatusPedido(id, status);
}

export async function fecharContaPedido(id: string) {
  return await PedidoService.fecharConta(id);
}

export async function deletePedido(id: string) {
  return await PedidoService.deletarPedido(id);
}