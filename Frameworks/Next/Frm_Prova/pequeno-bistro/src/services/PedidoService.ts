import Pedido, { IPedido, IItemPedido } from '@/models/Pedido';
import { IItemCardapio } from '../models/itemCardapio';
import dbConnect from '@/lib/mongodb';

export class PedidoService {
  static async criarPedido(pedidoData: {
    numeroMesa: number;
    itens: Array<{
      item: string;
      quantidade: number;
      observacao?: string;
    }>;
    garcom: string;
  }): Promise<IPedido> {
    await dbConnect();
    
    const { default: ItemCardapio } = await import('../models/itemCardapio');
    const itensCardapio = await ItemCardapio.find({
      _id: { $in: pedidoData.itens.map(item => item.item) }
    });

    const itensPedido: IItemPedido[] = pedidoData.itens.map(pedidoItem => {
      const itemCardapio = itensCardapio.find(item => item._id.toString() === pedidoItem.item);
      if (!itemCardapio) {
        throw new Error(`Item ${pedidoItem.item} não encontrado`);
      }
      
      return {
        item: itemCardapio._id as any,
        quantidade: pedidoItem.quantidade,
        precoUnitario: itemCardapio.preco,
        observacao: pedidoItem.observacao
      };
    });

    const total = itensPedido.reduce((sum, item) => {
      return sum + (item.precoUnitario * item.quantidade);
    }, 0);

    const pedido = new Pedido({
      numeroMesa: pedidoData.numeroMesa,
      itens: itensPedido,
      garcom: pedidoData.garcom,
      total,
      status: 'Recebido'
    });

    return await pedido.save();
  }

  static async buscarTodosPedidos(): Promise<IPedido[]> {
    await dbConnect();
    return await Pedido.find()
      .populate('itens.item')
      .populate('garcom', 'nome username')
      .sort({ createdAt: -1 });
  }

  static async buscarPedidosPorStatus(status: string): Promise<IPedido[]> {
    await dbConnect();
    return await Pedido.find({ status })
      .populate('itens.item')
      .populate('garcom', 'nome')
      .sort({ createdAt: 1 });
  }

  static async buscarPedidoPorId(id: string): Promise<IPedido | null> {
    await dbConnect();
    return await Pedido.findById(id)
      .populate('itens.item')
      .populate('garcom', 'nome username');
  }

  static async atualizarStatusPedido(id: string, status: string): Promise<IPedido | null> {
    await dbConnect();
    return await Pedido.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    ).populate('itens.item').populate('garcom', 'nome');
  }

  static async fecharConta(id: string): Promise<IPedido | null> {
    await dbConnect();
    return await Pedido.findByIdAndUpdate(
      id,
      { status: 'Pago' },
      { new: true }
    );
  }

  static async deletarPedido(id: string): Promise<void> {
    await dbConnect();
    await Pedido.findByIdAndDelete(id);
  }
}