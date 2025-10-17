import mongoose, { Schema, Document } from 'mongoose';

export interface IItemCardapio extends Document {
  nome: string;
  preco: number;
  categoria: string;
  descricao?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ItemCardapioSchema: Schema = new Schema({
  nome: { 
    type: String, 
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  preco: { 
    type: Number, 
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço não pode ser negativo']
  },
  categoria: { 
    type: String, 
    required: [true, 'Categoria é obrigatória'],
    trim: true
  },
  descricao: { 
    type: String, 
    trim: true,
    maxlength: [500, 'Descrição não pode ter mais de 500 caracteres']
  },
  ativo: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

// Índices para melhor performance
ItemCardapioSchema.index({ categoria: 1, ativo: 1 });
ItemCardapioSchema.index({ ativo: 1 });

export default mongoose.models.ItemCardapio || mongoose.model<IItemCardapio>('ItemCardapio', ItemCardapioSchema);