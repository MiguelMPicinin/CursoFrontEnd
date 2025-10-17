import ItemCardapio, { IItemCardapio } from '../models/itemCardapio';

export class CardapioService {
  static async criarItem(itemData: Partial<IItemCardapio>): Promise<IItemCardapio> {
    const item = new ItemCardapio(itemData);
    return await item.save();
  }

  static async buscarTodosItens(): Promise<IItemCardapio[]> {
    return await ItemCardapio.find().sort({ categoria: 1, nome: 1 });
  }

  static async buscarItensPorCategoria(categoria: string): Promise<IItemCardapio[]> {
    return await ItemCardapio.find({ categoria, ativo: true });
  }

  static async buscarItemPorId(id: string): Promise<IItemCardapio | null> {
    return await ItemCardapio.findById(id);
  }

  static async atualizarItem(id: string, dados: Partial<IItemCardapio>): Promise<IItemCardapio | null> {
    return await ItemCardapio.findByIdAndUpdate(id, dados, { new: true });
  }

  static async deletarItem(id: string): Promise<void> {
    await ItemCardapio.findByIdAndDelete(id);
  }
}