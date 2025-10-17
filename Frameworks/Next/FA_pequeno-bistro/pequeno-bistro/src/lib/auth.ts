import { UsuarioService } from '@/services/UsuarioService';
import { IUsuario } from '@/models/Usuario';
import dbConnect from '@/lib/mongodb';

export async function autenticaUsuario(username: string, password: string): Promise<IUsuario | null> {
  try {
    await dbConnect();
    
    let usuario = await UsuarioService.buscarPorUsername(username);
    
    // Se não encontrou e é usuário de teste, criar automaticamente (apenas desenvolvimento)
    if (!usuario && process.env.NODE_ENV === 'development') {
      const usuariosTeste = ['admin', 'garcom', 'cozinha'];
      if (usuariosTeste.includes(username)) {
        console.log('Criando usuário de teste sob demanda:', username);
        
        const tipoMap: { [key: string]: 'gerente' | 'garcom' | 'cozinha' } = {
          'admin': 'gerente',
          'garcom': 'garcom', 
          'cozinha': 'cozinha'
        };
        
        try {
          usuario = await UsuarioService.criarUsuario({
            username,
            password,
            tipo: tipoMap[username],
            nome: `${username.charAt(0).toUpperCase() + username.slice(1)} do Sistema`
          });
          console.log(`Usuário de teste ${username} criado com sucesso!`);
        } catch (error: any) {
          console.error(`Erro ao criar usuário de teste ${username}:`, error.message);
          return null;
        }
      }
    }
    
    if (!usuario) {
      return null;
    }

    const senhaValida = await UsuarioService.validarSenha(password, usuario.password);
    if (!senhaValida) {
      return null;
    }

    return usuario;
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return null;
  }
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