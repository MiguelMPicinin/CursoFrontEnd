import ItemCardapio, { IItemCardapio } from '../models/itemCardapio'; // Caminho ajustado para '@/models/ItemCardapio'
import dbConnect from '@/lib/mongodb';

export class CardapioService {
  static async criarItem(itemData: Partial<IItemCardapio>): Promise<IItemCardapio> {
    await dbConnect();
    const item = new ItemCardapio(itemData);
    return await item.save();
  }

  static async buscarTodosItens(): Promise<IItemCardapio[]> {
    await dbConnect();
    return await ItemCardapio.find().sort({ categoria: 1, nome: 1 });
  }

  static async buscarItensPorCategoria(categoria: string): Promise<IItemCardapio[]> {
    await dbConnect();
    return await ItemCardapio.find({ categoria, ativo: true });
  }

  static async buscarItemPorId(id: string): Promise<IItemCardapio | null> {
    await dbConnect();
    return await ItemCardapio.findById(id);
  }

  static async atualizarItem(id: string, dados: Partial<IItemCardapio>): Promise<IItemCardapio | null> {
    await dbConnect();
    return await ItemCardapio.findByIdAndUpdate(id, dados, { new: true, runValidators: true });
  }

  static async deletarItem(id: string): Promise<boolean> {
    await dbConnect();
    const result = await ItemCardapio.findByIdAndDelete(id);
    // Retorna true se um documento foi encontrado e deletado (result não é null)
    return !!result;
  }

  static async desativarItem(id: string): Promise<IItemCardapio | null> {
    await dbConnect();
    return await ItemCardapio.findByIdAndUpdate(
      id, 
      { ativo: false }, 
      { new: true, runValidators: true }
    );
  }
}