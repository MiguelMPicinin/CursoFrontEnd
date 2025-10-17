import mongoose, { Schema, Document } from 'mongoose';

export interface IUsuario extends Document {
  username: string;
  password: string;
  tipo: 'gerente' | 'garcom' | 'cozinha';
  nome: string;
  createdAt: Date;
  updatedAt: Date;
}

const UsuarioSchema: Schema = new Schema({
  username: { 
    type: String, 
    required: [true, 'Username é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username deve ter pelo menos 3 caracteres'],
    maxlength: [50, 'Username não pode ter mais de 50 caracteres']
  },
  password: { 
    type: String, 
    required: [true, 'Password é obrigatório'],
    minlength: [6, 'Password deve ter pelo menos 6 caracteres']
  },
  tipo: { 
    type: String, 
    enum: {
      values: ['gerente', 'garcom', 'cozinha'],
      message: 'Tipo {VALUE} não é válido'
    }, 
    required: [true, 'Tipo é obrigatório'] 
  },
  nome: { 
    type: String, 
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  }
}, {
  timestamps: true
});

// Índices
UsuarioSchema.index({ username: 1 }, { unique: true });
UsuarioSchema.index({ tipo: 1 });

export default mongoose.models.Usuario || mongoose.model<IUsuario>('Usuario', UsuarioSchema);