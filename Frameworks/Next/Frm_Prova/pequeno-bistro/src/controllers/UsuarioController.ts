import { UsuarioService } from '@/services/UsuarioService';
import { IUsuario } from '@/models/Usuario';
import dbConnect from '@/lib/mongodb';

export async function autenticaUsuario(username: string, password: string): Promise<IUsuario | null> {
  await dbConnect();
  const usuario = await UsuarioService.buscarPorUsername(username);
  if (!usuario) return null;

  const senhaValida = await UsuarioService.validarSenha(password, usuario.password);
  if (!senhaValida) return null;

  return usuario;
}

export async function getUsuarios() {
  await dbConnect();
  return await UsuarioService.buscarTodosUsuarios();
}

export async function getUsuarioById(id: string) {
  await dbConnect();
  return await UsuarioService.buscarUsuarioPorId(id);
}

export async function createUsuario(data: Partial<IUsuario>) {
  await dbConnect();
  return await UsuarioService.criarUsuario(data);
}

export async function updateUsuario(id: string, data: Partial<IUsuario>) {
  await dbConnect();
  return await UsuarioService.atualizarUsuario(id, data);
}

export async function deleteUsuario(id: string) {
  await dbConnect();
  return await UsuarioService.deletarUsuario(id);
}