// Assumindo o nome do arquivo: lib/scripts/criar-usuarios-iniciais.ts
import dbConnect from '../lib/mongodb';
import { UsuarioService } from '../services/UsuarioService';
import { IUsuario } from '@/models/Usuario'; // Importar a interface para melhor tipagem

// Tipo para os dados iniciais, já que a senha é necessária
type UsuarioDataInicial = Omit<Partial<IUsuario>, 'tipo'> & {
  tipo: 'gerente' | 'garcom' | 'cozinha'; // Especificar o tipo como string literal
  password: string;
};

async function criarUsuariosIniciais() {
  try {
    // A conexão com o DB é feita dentro dos métodos do Service, mas podemos garantir aqui
    // para fins de log e inicialização
    await dbConnect();
    console.log('Conectado ao MongoDB...');

    const usuarios: UsuarioDataInicial[] = [
      {
        username: 'admin',
        password: '123456',
        tipo: 'gerente',
        nome: 'Administrador do Sistema'
      },
      {
        username: 'garcom',
        password: '123456', 
        tipo: 'garcom',
        nome: 'Garçom Principal'
      },
      {
        username: 'cozinha',
        password: '123456',
        tipo: 'cozinha',
        nome: 'Chefe de Cozinha'
      }
    ];

    for (const usuarioData of usuarios) {
      try {
        const usuarioExistente = await UsuarioService.buscarPorUsername(usuarioData.username);
        
        if (usuarioExistente) {
          console.log(`Usuário ${usuarioData.username} já existe, atualizando...`);
          // O service cuidará do hashing
          await UsuarioService.atualizarUsuario(usuarioExistente._id.toString(), usuarioData);
          console.log(`Usuário ${usuarioData.username} atualizado com sucesso!`);
        } else {
          // O service cuidará do hashing
          await UsuarioService.criarUsuario(usuarioData);
          console.log(`Usuário ${usuarioData.username} criado com sucesso!`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Erro ao processar usuário ${usuarioData.username}:`, errorMessage);
      }
    }

    console.log('Processo de criação/atualização de usuários finalizado!');
    
    // Listar usuários criados (sem a senha)
    const todosUsuarios = await UsuarioService.buscarTodosUsuarios();
    console.log('\nUsuários no sistema:');
    todosUsuarios.forEach(usuario => {
      console.log(`- ${usuario.nome} (${usuario.username}) - ${usuario.tipo}`);
    });
    
    // Deixa o processo morrer suavemente
    process.exit(0);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Erro no processo de criação de usuários:', errorMessage);
    process.exit(1);
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  // Configuração necessária para Next.js ler .env.local em scripts node puros
  require('dotenv').config({ path: '.env.local' });
  criarUsuariosIniciais();
}

export { criarUsuariosIniciais };