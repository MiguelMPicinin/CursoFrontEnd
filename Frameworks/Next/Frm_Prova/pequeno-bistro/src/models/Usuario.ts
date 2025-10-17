import mongoose, { Schema, Document } from 'mongoose';

export interface IUsuario extends Document {
  username: string;
  password: string;
  tipo: 'gerente' | 'garcom' | 'cozinha';
  nome: string;
}

const UsuarioSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tipo: { type: String, enum: ['gerente', 'garcom', 'cozinha'], required: true },
  nome: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.models.Usuario || mongoose.model<IUsuario>('Usuario', UsuarioSchema);