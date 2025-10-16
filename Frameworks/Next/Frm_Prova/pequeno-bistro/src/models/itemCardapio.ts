import mongoose, { Schema, Document } from 'mongoose';

export interface IItemCardapio extends Document {
  nome: string;
  preco: number;
  categoria: string;
  descricao?: string;
  ativo: boolean;
}

const ItemCardapioSchema: Schema = new Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  categoria: { type: String, required: true },
  descricao: { type: String },
  ativo: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.models.ItemCardapio || mongoose.model<IItemCardapio>('ItemCardapio', ItemCardapioSchema);