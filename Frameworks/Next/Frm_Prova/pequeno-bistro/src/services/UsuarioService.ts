import Usuario, { IUsuario } from '@/models/Usuario';
import bcrypt from 'bcryptjs';

export class UsuarioService {
  static async criarUsuario(usuarioData: Partial<IUsuario>): Promise<IUsuario> {
    const hashedPassword = await bcrypt.hash(usuarioData.password!, 10);
    const usuario = new Usuario({
      ...usuarioData,
      password: hashedPassword
    });
    return await usuario.save();
  }

  static async buscarPorUsername(username: string): Promise<IUsuario | null> {
    return await Usuario.findOne({ username });
  }

  static async validarSenha(senha: string, hashedSenha: string): Promise<boolean> {
    return await bcrypt.compare(senha, hashedSenha);
  }

  static async buscarTodosUsuarios(): Promise<IUsuario[]> {
    return await Usuario.find().select('-password');
  }

  static async buscarUsuarioPorId(id: string): Promise<IUsuario | null> {
    return await Usuario.findById(id).select('-password');
  }

  static async atualizarUsuario(id: string, dados: Partial<IUsuario>): Promise<IUsuario | null> {
    if (dados.password) {
      dados.password = await bcrypt.hash(dados.password, 10);
    }
    return await Usuario.findByIdAndUpdate(id, dados, { new: true }).select('-password');
  }

  static async deletarUsuario(id: string): Promise<void> {
    await Usuario.findByIdAndDelete(id);
  }
}