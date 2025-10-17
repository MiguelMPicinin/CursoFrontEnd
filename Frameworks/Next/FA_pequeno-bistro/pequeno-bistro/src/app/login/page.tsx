'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './estilos-login.css';

// Interface para o payload do usuário (para evitar 'any')
interface UsuarioPayload {
  id: string;
  username: string;
  nome: string;
  tipo: 'gerente' | 'garcom' | 'cozinha';
}

export default function PaginaLogin() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  // Função centralizada para redirecionamento
  const redirecionarPorTipo = (dadosUsuario: UsuarioPayload) => {
    let caminho = '/';
    switch (dadosUsuario.tipo) {
      case 'gerente':
        caminho = '/gerente';
        break;
      case 'garcom':
        caminho = '/garcom';
        break;
      case 'cozinha':
        caminho = '/cozinha';
        break;
      default:
        caminho = '/';
    }
    // Usar window.location.href garante um hard reload, limpando o estado global
    // e verificando a autenticação novamente na nova página.
    window.location.href = caminho;
  };

  // Limpar dados antigos ao carregar a página de login
  useEffect(() => {
    const limparDadosAntigos = async () => {
      console.log('Limpando dados de login antigos...');
      
      // Limpar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      
      // Tentar limpar cookies chamando a API de logout
      try {
        // Usar fetch para GET em logout não é ideal (melhor POST), mas seu backend aceita GET
        await fetch('/api/auth/logout', { method: 'POST' }); 
      } catch (error) {
        console.warn('Não foi possível limpar cookies via API', error);
      }
    };

    limparDadosAntigos();
  }, []);

  const manipularLogin = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      const resposta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usuario, password: senha }),
      });

      const dados = await resposta.json();

      if (dados.success && dados.usuario) {
        // Salvar no localStorage
        localStorage.setItem('token', dados.token);
        localStorage.setItem('usuario', JSON.stringify(dados.usuario));
        
        redirecionarPorTipo(dados.usuario as UsuarioPayload);
      } else {
        // Capturar mensagens de erro específicas do backend (400, 401)
        setErro(dados.error || 'Credenciais inválidas. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro de rede ou interno:', error);
      setErro('Erro de conexão com o servidor. Verifique sua rede.');
    } finally {
      setCarregando(false);
    }
  };

  const limparTudoERecarregar = async () => {
    // Tenta limpar via API antes de recarregar
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
        console.warn('Falha na chamada de logout durante a limpeza.', error);
    }

    // Limpeza local forçada e hard reload
    localStorage.clear();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; max-age=0";
    document.cookie = "usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; max-age=0";
    
    window.location.href = '/login';
  };

  return (
    <div className="container-login">
      <div className="cartao-login">
        <div className="cabecalho-login">
          <div className="icone-login">
            <span>🍽️</span>
          </div>
          <h1 className="titulo-login">Pequeno Bistrô</h1>
          <p className="subtitulo-login">Sabor Local</p>
        </div>

        {/* ... restante do JSX do formulário ... */}
        
        <form onSubmit={manipularLogin} className="formulario-login">
          {erro && (
            <div className="mensagem-erro">
              {erro}
            </div>
          )}

          <div className="grupo-formulario">
            <label className="rotulo-formulario">
              Nome de Usuário
            </label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="entrada-formulario"
              placeholder="Digite seu usuário"
              required
              disabled={carregando}
            />
          </div>

          <div className="grupo-formulario">
            <label className="rotulo-formulario">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="entrada-formulario"
              placeholder="Digite sua senha"
              required
              disabled={carregando}
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="botao botao-primario botao-login"
          >
            {carregando ? (
              <>
                <div className="carregando"></div>
                Entrando...
              </>
            ) : (
              'Entrar no Sistema'
            )}
          </button>
        </form>

        <div className="container-botoes-auxiliares">
          <button
            type="button"
            onClick={limparTudoERecarregar}
            className="botao botao-perigo botao-limpar-tudo"
            disabled={carregando}
          >
            🔄 Limpar Tudo e Recarregar
          </button>

          <button
            type="button"
            onClick={() => router.push('/')}
            className="botao botao-secundario botao-voltar"
            disabled={carregando}
          >
            ← Voltar para Página Inicial
          </button>
        </div>

        <div className="informacoes-login">
          <h3 className="titulo-informacoes">Usuários de Teste:</h3>
          <div className="lista-usuarios">
            <p className="usuario-teste">👨‍💼 Gerente: admin / 123456</p>
            <p className="usuario-teste">👨‍🍳 Garçom: garcom / 123456</p>
            <p className="usuario-teste">👨‍🔧 Cozinha: cozinha / 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}