import { PedidoService } from '@/services/PedidoService';
import { IPedido } from '@/models/Pedido'; // Tipagem importada

export async function getPedidos() {
  try {
    return await PedidoService.buscarTodosPedidos();
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    throw error;
  }
}

export async function getPedidosCozinha() {
  try {
    return await PedidoService.buscarPedidosCozinha();
  } catch (error) {
    console.error('Erro ao buscar pedidos da cozinha:', error);
    throw error;
  }
}

export async function getPedidoById(id: string) {
  try {
    return await PedidoService.buscarPedidoPorId(id);
  } catch (error) {
    console.error('Erro ao buscar pedido por ID:', error);
    throw error;
  }
}

// Adicione esta função ao seu PedidoController
export async function getPedidosProntos(): Promise<IPedido[]> {
  try {
    return await PedidoService.buscarPedidosProntos();
  } catch (error) {
    console.error('Erro no controller getPedidosProntos:', error);
    throw error;
  }
}

export async function createPedido(data: Parameters<typeof PedidoService.criarPedido>[0]) {
  try {
    return await PedidoService.criarPedido(data);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
}

export async function updateStatusPedido(id: string, status: IPedido['status']) {
  try {
    return await PedidoService.atualizarStatusPedido(id, status);
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    throw error;
  }
}

export async function fecharContaPedido(id: string) {
  try {
    return await PedidoService.fecharContaPedido(id);
  } catch (error) {
    console.error('Erro ao fechar conta do pedido:', error);
    throw error;
  }
}

export async function deletePedido(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const success = await PedidoService.deletarPedido(id);
    if (success) {
      return { success: true };
    } else {
      return { success: false, message: 'Pedido não encontrado' };
    }
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    return { success: false, message: 'Erro interno ao deletar pedido' };
  }
}