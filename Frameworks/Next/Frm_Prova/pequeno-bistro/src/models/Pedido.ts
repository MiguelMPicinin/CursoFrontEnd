import mongoose, { Schema, Document } from 'mongoose';

export interface IItemPedido {
  item: mongoose.Types.ObjectId;
  quantidade: number;
  precoUnitario: number;
  observacao?: string;
}

export interface IPedido extends Document {
  numeroMesa: number;
  itens: IItemPedido[];
  status: 'Recebido' | 'Em Preparo' | 'Entregue' | 'Pago';
  total: number;
  garcom: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ItemPedidoSchema: Schema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'ItemCardapio', required: true },
  quantidade: { type: Number, required: true },
  precoUnitario: { type: Number, required: true },
  observacao: { type: String }
});

const PedidoSchema: Schema = new Schema({
  numeroMesa: { type: Number, required: true },
  itens: [ItemPedidoSchema],
  status: { 
    type: String, 
    enum: ['Recebido', 'Em Preparo', 'Entregue', 'Pago'], 
    default: 'Recebido' 
  },
  total: { type: Number, required: true },
  garcom: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, {
  timestamps: true
});

export default mongoose.models.Pedido || mongoose.model<IPedido>('Pedido', PedidoSchema);