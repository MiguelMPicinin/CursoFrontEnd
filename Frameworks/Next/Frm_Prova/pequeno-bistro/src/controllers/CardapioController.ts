import { CardapioService } from '../services/CardapioService';
import { IItemCardapio } from '../models/itemCardapio';
import dbConnect from '@/lib/mongodb';

export async function getItensCardapio() {
  await dbConnect();
  return await CardapioService.buscarTodosItens();
}

export async function getItemCardapioById(id: string) {
  await dbConnect();
  return await CardapioService.buscarItemPorId(id);
}

export async function createItemCardapio(data: Partial<IItemCardapio>) {
  await dbConnect();
  return await CardapioService.criarItem(data);
}

export async function updateItemCardapio(id: string, data: Partial<IItemCardapio>) {
  await dbConnect();
  return await CardapioService.atualizarItem(id, data);
}

export async function deleteItemCardapio(id: string) {
  await dbConnect();
  return await CardapioService.deletarItem(id);
}