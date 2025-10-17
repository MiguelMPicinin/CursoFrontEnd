import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IItemPedido {
  item: Types.ObjectId;
  quantidade: number;
  precoUnitario: number;
  observacao?: string;
}

export interface IPedido extends Document {
  numeroMesa: number;
  itens: IItemPedido[];
  status: 'Recebido' | 'Em Preparo' | 'Pronto' | 'Entregue' | 'Pago' | 'Cancelado';
  total: number;
  garcom: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ItemPedidoSchema: Schema = new Schema({
  item: { 
    type: Schema.Types.ObjectId, 
    ref: 'ItemCardapio', 
    required: [true, 'Item é obrigatório'] 
  },
  quantidade: { 
    type: Number, 
    required: [true, 'Quantidade é obrigatória'],
    min: [1, 'Quantidade deve ser pelo menos 1']
  },
  precoUnitario: { 
    type: Number, 
    required: [true, 'Preço unitário é obrigatório'],
    min: [0, 'Preço unitário não pode ser negativo']
  },
  observacao: { 
    type: String, 
    trim: true,
    maxlength: [200, 'Observação não pode ter mais de 200 caracteres']
  }
});

const PedidoSchema: Schema = new Schema({
  numeroMesa: { 
    type: Number, 
    required: [true, 'Número da mesa é obrigatório'],
    min: [1, 'Número da mesa deve ser pelo menos 1'],
    max: [50, 'Número da mesa não pode ser maior que 50']
  },
  itens: {
    type: [ItemPedidoSchema],
    required: [true, 'Itens são obrigatórios'],
    validate: {
      validator: function(itens: IItemPedido[]) {
        return itens && itens.length > 0;
      },
      message: 'Pedido deve ter pelo menos um item'
    }
  },
  status: { 
    type: String, 
    enum: {
      values: ['Recebido', 'Em Preparo', 'Pronto', 'Entregue', 'Pago', 'Cancelado'],
      message: 'Status {VALUE} não é válido'
    }, 
    default: 'Recebido' 
  },
  total: { 
    type: Number, 
    required: [true, 'Total é obrigatório'],
    min: [0, 'Total não pode ser negativo']
  },
  garcom: { 
    type: Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: [true, 'Garçom é obrigatório'] 
  }
}, {
  timestamps: true
});

// Índices para melhor performance
PedidoSchema.index({ status: 1, createdAt: 1 });
PedidoSchema.index({ numeroMesa: 1 });
PedidoSchema.index({ garcom: 1 });
PedidoSchema.index({ createdAt: -1 });

// Middleware para calcular o total antes de salvar
PedidoSchema.pre('save', function(next) {
  if (this.isModified('itens')) {
    this.total = this.itens.reduce((sum, item) => {
      return sum + (item.precoUnitario * item.quantidade);
    }, 0);
  }
  next();
});

export default mongoose.models.Pedido || mongoose.model<IPedido>('Pedido', PedidoSchema);