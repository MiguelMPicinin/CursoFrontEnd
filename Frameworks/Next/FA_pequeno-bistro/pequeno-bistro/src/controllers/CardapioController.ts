import { CardapioService } from '@/services/CardapioService';
import { IItemCardapio } from '../models/itemCardapio';

export async function getItensCardapio() {
  try {
    return await CardapioService.buscarTodosItens();
  } catch (error) {
    console.error('Erro ao buscar itens do cardápio:', error);
    throw error;
  }
}

export async function getItemCardapioById(id: string) {
  try {
    return await CardapioService.buscarItemPorId(id);
  } catch (error) {
    console.error('Erro ao buscar item do cardápio por ID:', error);
    throw error;
  }
}

export async function createItemCardapio(data: Partial<IItemCardapio>) {
  try {
    return await CardapioService.criarItem(data);
  } catch (error) {
    console.error('Erro ao criar item do cardápio:', error);
    throw error;
  }
}

export async function updateItemCardapio(id: string, data: Partial<IItemCardapio>) {
  try {
    return await CardapioService.atualizarItem(id, data);
  } catch (error) {
    console.error('Erro ao atualizar item do cardápio:', error);
    throw error;
  }
}

export async function deleteItemCardapio(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const success = await CardapioService.deletarItem(id);
    if (success) {
      return { success: true };
    } else {
      return { success: false, message: 'Item do cardápio não encontrado' };
    }
  } catch (error) {
    console.error('Erro ao deletar item do cardápio:', error);
    return { success: false, message: 'Erro interno ao deletar item' };
  }
}

export async function desativarItemCardapio(id: string) {
  try {
    return await CardapioService.desativarItem(id);
  } catch (error) {
    console.error('Erro ao desativar item do cardápio:', error);
    throw error;
  }
}