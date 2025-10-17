import Pedido, { IPedido, IItemPedido } from '@/models/Pedido';
import ItemCardapio from '../models/itemCardapio'; // Import ajustado para o caminho do Model
import dbConnect from '@/lib/mongodb';

export class PedidoService {
  static async criarPedido(pedidoData: {
    numeroMesa: number;
    itens: Array<{
      item: string;
      quantidade: number;
      observacao?: string;
      precoUnitario: number;
    }>;
    garcom: string;
  }): Promise<IPedido> {
    await dbConnect();
    
    const itemIds = pedidoData.itens.map(item => item.item);
    
    // Tenta encontrar e garantir que os IDs são válidos e os itens estão ativos
    const itensCardapio = await ItemCardapio.find({
      _id: { $in: itemIds },
      ativo: true
    }).lean(); // Usar .lean() para performance, já que não vamos modificar o objeto Mongoose
    
    if (itensCardapio.length !== itemIds.length) {
      throw new Error('Um ou mais itens do cardápio não foram encontrados, são inválidos ou estão inativos');
    }

    const itensPedido: IItemPedido[] = pedidoData.itens.map(pedidoItem => {
      const itemCardapio = itensCardapio.find(item => item._id.toString() === pedidoItem.item);
      
      // Validação redundante mas segura
      if (!itemCardapio) {
        throw new Error(`Item ${pedidoItem.item} não encontrado`);
      }
      
      return {
        item: itemCardapio._id,
        quantidade: pedidoItem.quantidade,
        // Prioriza o precoUnitario enviado (para flexibilidade), senão usa o do cardápio
        precoUnitario: pedidoItem.precoUnitario || itemCardapio.preco, 
        observacao: pedidoItem.observacao
      } as IItemPedido; // Tipagem explícita
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

  static async buscarPedidosPorStatus(status: IPedido['status']): Promise<IPedido[]> {
    await dbConnect();
    return await Pedido.find({ status })
      .populate('itens.item')
      .populate('garcom', 'nome username')
      .sort({ createdAt: 1 });
  }

  static async buscarPedidosCozinha(): Promise<IPedido[]> {
    await dbConnect();
    return await Pedido.find({ 
      status: { $in: ['Recebido', 'Em Preparo'] } 
    })
      .populate('itens.item')
      .populate('garcom', 'nome username')
      .sort({ createdAt: 1 });
  }

  static async buscarPedidoPorId(id: string): Promise<IPedido | null> {
    await dbConnect();
    return await Pedido.findById(id)
      .populate('itens.item')
      .populate('garcom', 'nome username');
  }

  static async atualizarStatusPedido(id: string, status: IPedido['status']): Promise<IPedido | null> {
    await dbConnect();
    
    const statusValidos: IPedido['status'][] = ['Recebido', 'Em Preparo', 'Pronto', 'Entregue', 'Pago', 'Cancelado'];
    if (!statusValidos.includes(status)) {
      throw new Error('Status inválido');
    }

    return await Pedido.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true, runValidators: true }
    )
    .populate('itens.item')
    .populate('garcom', 'nome username');
  }

  static async fecharContaPedido(id: string): Promise<IPedido | null> {
    await dbConnect();
    return await Pedido.findByIdAndUpdate(
      id,
      { status: 'Pago' as IPedido['status'] }, // Garante que o status é do tipo correto
      { new: true, runValidators: true }
    )
    .populate('itens.item')
    .populate('garcom', 'nome username');
  }

  static async deletarPedido(id: string): Promise<boolean> {
    await dbConnect();
    const result = await Pedido.findByIdAndDelete(id);
    // Retorna true se um documento foi encontrado e deletado (result não é null)
    return !!result;
  }
}