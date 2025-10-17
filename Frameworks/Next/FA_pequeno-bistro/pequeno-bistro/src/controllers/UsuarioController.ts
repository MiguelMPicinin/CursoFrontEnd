import { UsuarioService } from '@/services/UsuarioService';
import { IUsuario } from '@/models/Usuario';

export async function autenticaUsuario(username: string, password: string): Promise<IUsuario | null> {
  const usuario = await UsuarioService.buscarPorUsername(username);
  if (!usuario) return null;

  const senhaValida = await UsuarioService.validarSenha(password, usuario.password);
  if (!senhaValida) return null;

  return usuario;
}

export async function getUsuarios() {
  return await UsuarioService.buscarTodosUsuarios();
}

export async function getUsuarioById(id: string) {
  return await UsuarioService.buscarUsuarioPorId(id);
}

export async function createUsuario(data: Partial<IUsuario>) {
  return await UsuarioService.criarUsuario(data);
}

export async function updateUsuario(id: string, data: Partial<IUsuario>) {
  return await UsuarioService.atualizarUsuario(id, data);
}

export async function deleteUsuario(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const success = await UsuarioService.deletarUsuario(id);
    if (success) {
      return { success: true };
    } else {
      return { success: false, message: 'Usuário não encontrado' };
    }
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return { success: false, message: 'Erro interno ao deletar usuário' };
  }
}