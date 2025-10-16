'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './estilos-login.css';

export default function PaginaLogin() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const roteador = useRouter();

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

      if (dados.success) {
        localStorage.setItem('token', dados.token);
        localStorage.setItem('usuario', JSON.stringify(dados.usuario));
        
        switch (dados.usuario.tipo) {
          case 'gerente':
            roteador.push('/gerente');
            break;
          case 'garcom':
            roteador.push('/garcom');
            break;
          case 'cozinha':
            roteador.push('/cozinha');
            break;
          default:
            roteador.push('/');
        }
      } else {
        setErro(dados.error || 'Erro ao fazer login');
      }
    } catch (error) {
      setErro('Erro de conexão com o servidor');
    } finally {
      setCarregando(false);
    }
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
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="botao botao-primario largura-total"
          >
            {carregando ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>

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