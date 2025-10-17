'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './estilos-gerente.css';

interface ItemCardapio {
  _id: string;
  nome: string;
  preco: number;
  categoria: string;
  descricao?: string;
  ativo: boolean;
}

interface Pedido {
  _id: string;
  numeroMesa: number;
  status: string;
  total: number;
  createdAt: string;
  itens: Array<{
    quantidade: number;
    precoUnitario: number;
    item: ItemCardapio;
  }>;
}

export default function PaginaGerente() {
  const [abaAtiva, setAbaAtiva] = useState('cardapio');
  const [itensCardapio, setItensCardapio] = useState<ItemCardapio[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [faturamento, setFaturamento] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const roteador = useRouter();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: '',
    preco: '',
    categoria: '',
    descricao: ''
  });

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (!usuarioSalvo) {
      roteador.push('/login');
      return;
    }
    
    const dadosUsuario = JSON.parse(usuarioSalvo);
    setUsuario(dadosUsuario);
    
    if (dadosUsuario.tipo !== 'gerente') {
      roteador.push('/login');
      return;
    }

    carregarDados();
  }, [roteador]);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      
      if (abaAtiva === 'cardapio') {
        const resposta = await fetch('/api/cardapio');
        const dados = await resposta.json();
        if (dados.success) setItensCardapio(dados.data);
      } else {
        const resposta = await fetch('/api/pedidos');
        const dados = await resposta.json();
        if (dados.success) {
          setPedidos(dados.data);
          const totalFaturamento = dados.data
            .filter((pedido: Pedido) => pedido.status === 'Pago')
            .reduce((soma: number, pedido: Pedido) => soma + pedido.total, 0);
          setFaturamento(totalFaturamento);
        }
      }
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (usuario) carregarDados();
  }, [abaAtiva, usuario]);

  const fazerLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    roteador.push('/login');
  };

  const enviarFormulario = async (evento: React.FormEvent) => {
    evento.preventDefault();
    try {
      const resposta = await fetch('/api/cardapio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...dadosFormulario,
          preco: parseFloat(dadosFormulario.preco)
        }),
      });

      const dados = await resposta.json();
      
      if (dados.success) {
        setMostrarFormulario(false);
        setDadosFormulario({ nome: '', preco: '', categoria: '', descricao: '' });
        carregarDados();
      }
    } catch (erro) {
      console.error('Erro ao criar item:', erro);
    }
  };

  const excluirItem = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item do cardápio?')) return;
    
    try {
      const resposta = await fetch(`/api/cardapio/${id}`, {
        method: 'DELETE',
      });

      if (resposta.ok) {
        carregarDados();
      }
    } catch (erro) {
      console.error('Erro ao excluir item:', erro);
    }
  };

  if (carregando && !itensCardapio.length && !pedidos.length) {
    return (
      <div className="tela-carregamento">
        <div className="carregando"></div>
        <p className="texto-carregamento">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="pagina-gerente">
      <header className="cabecalho">
        <div className="controle">
          <div className="cabecalho-conteudo">
            <div className="flex centralizar-itens">
              <div className="icone-gerente">
                <span>👨‍💼</span>
              </div>
              <h1 className="titulo-pagina">Pequeno Bistrô - Gerente</h1>
            </div>
            <div className="flex centralizar-itens espaco-entre">
              <span className="saudacao-usuario">Olá, {usuario?.nome}</span>
              <button
                onClick={fazerLogout}
                className="botao botao-perigo"
              >
                Sair do Sistema
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="navegacao-abas">
        <div className="controle">
          <ul className="lista-abas">
            <li 
              className={`aba ${abaAtiva === 'cardapio' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('cardapio')}
            >
              Gerenciar Cardápio
            </li>
            <li 
              className={`aba ${abaAtiva === 'pedidos' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('pedidos')}
            >
              Pedidos e Faturamento
            </li>
          </ul>
        </div>
      </nav>

      <main className="controle espacamento-vertical-grande">
        {abaAtiva === 'cardapio' && (
          <div className="secao-cardapio">
            <div className="cabecalho-secao">
              <h2 className="titulo-secao">Cardápio do Restaurante</h2>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="botao botao-primario"
              >
                + Adicionar Novo Item
              </button>
            </div>

            {mostrarFormulario && (
              <div className="fundo-modal">
                <div className="conteudo-modal">
                  <div className="cartao-conteudo">
                    <h3 className="titulo-modal">Adicionar Item ao Cardápio</h3>
                    <form onSubmit={enviarFormulario} className="formulario-modal">
                      <div className="grupo-formulario">
                        <label className="rotulo-formulario">
                          Nome do Item
                        </label>
                        <input
                          type="text"
                          value={dadosFormulario.nome}
                          onChange={(e) => setDadosFormulario({ ...dadosFormulario, nome: e.target.value })}
                          className="entrada-formulario"
                          required
                        />
                      </div>
                      <div className="grupo-formulario">
                        <label className="rotulo-formulario">
                          Preço (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={dadosFormulario.preco}
                          onChange={(e) => setDadosFormulario({ ...dadosFormulario, preco: e.target.value })}
                          className="entrada-formulario"
                          required
                        />
                      </div>
                      <div className="grupo-formulario">
                        <label className="rotulo-formulario">
                          Categoria
                        </label>
                        <input
                          type="text"
                          value={dadosFormulario.categoria}
                          onChange={(e) => setDadosFormulario({ ...dadosFormulario, categoria: e.target.value })}
                          className="entrada-formulario"
                          required
                        />
                      </div>
                      <div className="grupo-formulario">
                        <label className="rotulo-formulario">
                          Descrição (Opcional)
                        </label>
                        <textarea
                          value={dadosFormulario.descricao}
                          onChange={(e) => setDadosFormulario({ ...dadosFormulario, descricao: e.target.value })}
                          className="entrada-formulario area-texto"
                          rows={3}
                        />
                      </div>
                      <div className="botoes-formulario">
                        <button
                          type="submit"
                          className="botao botao-primario flex-1"
                        >
                          Salvar Item
                        </button>
                        <button
                          type="button"
                          onClick={() => setMostrarFormulario(false)}
                          className="botao botao-perigo flex-1"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <div className="grade grade-3">
              {itensCardapio.map((item) => (
                <div key={item._id} className="cartao">
                  <div className="cartao-conteudo">
                    <div className="cabecalho-item">
                      <h3 className="nome-item">{item.nome}</h3>
                      <span className="preco-item">
                        R$ {item.preco.toFixed(2)}
                      </span>
                    </div>
                    <p className="categoria-item">{item.categoria}</p>
                    {item.descricao && (
                      <p className="descricao-item">{item.descricao}</p>
                    )}
                    <div className="rodape-item">
                      <span className={`status-item ${item.ativo ? 'ativo' : 'inativo'}`}>
                        {item.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                      <button
                        onClick={() => excluirItem(item._id)}
                        className="botao-excluir"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {abaAtiva === 'pedidos' && (
          <div className="secao-pedidos">
            <div className="cartao-faturamento">
              <h2 className="titulo-faturamento">Faturamento Total</h2>
              <p className="valor-faturamento">R$ {faturamento.toFixed(2)}</p>
              <p className="descricao-faturamento">Valor total dos pedidos já pagos</p>
            </div>

            <div className="lista-pedidos">
              <h2 className="titulo-secao">Todos os Pedidos</h2>
              <div className="espacamento-vertical-grande">
                {pedidos.map((pedido) => (
                  <div key={pedido._id} className="cartao pedido">
                    <div className="cartao-conteudo">
                      <div className="cabecalho-pedido">
                        <div>
                          <h3 className="mesa-pedido">
                            Mesa {pedido.numeroMesa}
                          </h3>
                          <p className="data-pedido">
                            {new Date(pedido.createdAt).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div className="info-pedido">
                          <span className={`etiqueta-status status-${pedido.status.toLowerCase().replace(' ', '-')}`}>
                            {pedido.status}
                          </span>
                          <p className="total-pedido">
                            R$ {pedido.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="itens-pedido">
                        <h4 className="titulo-itens">Itens do Pedido:</h4>
                        <div className="lista-itens">
                          {pedido.itens.map((item, index) => (
                            <div key={index} className="item-pedido">
                              <span>
                                {item.quantidade}x {typeof item.item === 'object' ? item.item.nome : 'Item'}
                              </span>
                              <span>R$ {(item.quantidade * item.precoUnitario).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}