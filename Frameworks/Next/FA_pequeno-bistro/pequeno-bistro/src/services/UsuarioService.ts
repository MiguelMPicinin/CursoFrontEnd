import Usuario, { IUsuario } from '@/models/Usuario';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';

export class UsuarioService {
  static async criarUsuario(usuarioData: Partial<IUsuario>): Promise<IUsuario> {
    await dbConnect();
    
    const usuarioExistente = await Usuario.findOne({ username: usuarioData.username });
    if (usuarioExistente) {
      throw new Error('Username já está em uso');
    }

    // Garante que a senha exista antes de hashear
    if (!usuarioData.password) {
      throw new Error('A senha é obrigatória para criação de usuário');
    }

    const hashedPassword = await bcrypt.hash(usuarioData.password, 12);
    const usuario = new Usuario({
      ...usuarioData,
      password: hashedPassword
    });
    
    return await usuario.save();
  }

  static async buscarPorUsername(username: string): Promise<IUsuario | null> {
    await dbConnect();
    return await Usuario.findOne({ username });
  }

  static async validarSenha(senha: string, hashedSenha: string): Promise<boolean> {
    return await bcrypt.compare(senha, hashedSenha);
  }

  static async buscarTodosUsuarios(): Promise<IUsuario[]> {
    await dbConnect();
    return await Usuario.find().select('-password').sort({ tipo: 1, nome: 1 });
  }

  static async buscarUsuarioPorId(id: string): Promise<IUsuario | null> {
    await dbConnect();
    return await Usuario.findById(id).select('-password');
  }

  static async atualizarUsuario(id: string, dados: Partial<IUsuario>): Promise<IUsuario | null> {
    await dbConnect();
    
    if (dados.username) {
      const usuarioExistente = await Usuario.findOne({ 
        username: dados.username, 
        _id: { $ne: id } 
      });
      if (usuarioExistente) {
        throw new Error('Username já está em uso');
      }
    }

    const updateData: Partial<IUsuario> = { ...dados };
    if (dados.password) {
      updateData.password = await bcrypt.hash(dados.password, 12);
    }

    return await Usuario.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');
  }

  static async deletarUsuario(id: string): Promise<boolean> {
    await dbConnect();
    const result = await Usuario.findByIdAndDelete(id);
    // Retorna true se um documento foi encontrado e deletado (result não é null)
    return !!result;
  }

  static async buscarPorTipo(tipo: 'gerente' | 'garcom' | 'cozinha'): Promise<IUsuario[]> {
    await dbConnect();
    return await Usuario.find({ tipo }).select('-password');
  }
}