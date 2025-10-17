// app/gerente/page.tsx
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

interface ItemPedido {
  quantidade: number;
  precoUnitario: number;
  item: ItemCardapio | string;
}

interface Pedido {
  _id: string;
  numeroMesa: number;
  status: string;
  total: number;
  createdAt: string;
  itens: ItemPedido[];
}

export default function PaginaGerente() {
  const [abaAtiva, setAbaAtiva] = useState('cardapio');
  const [itensCardapio, setItensCardapio] = useState<ItemCardapio[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [faturamento, setFaturamento] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState<{ id: string; nome: string; tipo: string } | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: '',
    preco: '',
    categoria: '',
    descricao: ''
  });

  // Função de logout dentro do componente
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Erro no logout via API:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
  };

  // 1. Hook de Autenticação e Autorização
  useEffect(() => {
    const verificarAutenticacao = async () => {
      const usuarioSalvo = localStorage.getItem('usuario');
      const token = localStorage.getItem('token');
      
      if (!usuarioSalvo || !token) {
        router.push('/login');
        return;
      }
      
      try {
        const dadosUsuario = JSON.parse(usuarioSalvo);
        
        if (dadosUsuario.tipo !== 'gerente') {
          console.log('Usuário não tem permissão para gerente, redirecionando...');
          await handleLogout();
          return;
        }
        
        setUsuario(dadosUsuario);
        setCarregando(false);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push('/login');
      }
    };

    verificarAutenticacao();
  }, [router]);
  
  // 2. Função de Carregamento de Dados - CORRIGIDA
  const carregarDados = async () => {
    if (!usuario) return;
    setCarregando(true);
    setErro(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      if (abaAtiva === 'cardapio') {
        const resposta = await fetch('/api/cardapio', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const dados = await resposta.json();
        if (resposta.ok && dados.success) {
          setItensCardapio(dados.data);
        } else {
          throw new Error(dados.error || 'Falha ao carregar cardápio');
        }
      } else {
        console.log('💰 Carregando pedidos para faturamento...');
        const resposta = await fetch('/api/pedidos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const dados = await resposta.json();
        
        console.log('📦 Resposta completa dos pedidos:', dados);
        
        if (resposta.ok && dados.success) {
          setPedidos(dados.data);
          
          // DEBUG: Verificar todos os pedidos e seus status
          console.log('📊 Total de pedidos:', dados.data.length);
          dados.data.forEach((pedido: Pedido) => {
            console.log(`📋 Pedido ${pedido._id}: Status=${pedido.status}, Total=${pedido.total}`);
          });
          
          // CÁLCULO CORRIGIDO: Usar o campo total dos pedidos
          const pedidosPagos = dados.data.filter((pedido: Pedido) => {
            const isPagoOuEntregue = pedido.status === 'Pago' || pedido.status === 'Entregue';
            console.log(`🔍 Pedido ${pedido._id}: ${pedido.status} -> ${isPagoOuEntregue ? 'INCLUÍDO' : 'excluído'}`);
            return isPagoOuEntregue;
          });
          
          let totalFaturamento = 0;
          
          // Soma os totais dos pedidos pagos/entregues
          pedidosPagos.forEach((pedido: Pedido) => {
            console.log(`➕ Somando pedido ${pedido._id}: R$ ${pedido.total}`);
            totalFaturamento += pedido.total;
          });
          
          console.log('💵 Faturamento calculado:', totalFaturamento);
          console.log('✅ Pedidos pagos/entregues encontrados:', pedidosPagos.length);
          
          setFaturamento(totalFaturamento);
        } else {
          throw new Error(dados.error || 'Falha ao carregar pedidos');
        }
      }
    } catch (erro: any) {
      console.error('❌ Erro ao carregar dados:', erro);
      setErro('Erro ao carregar dados: ' + erro.message);
    } finally {
      setCarregando(false);
    }
  };

  // 3. Hook para recarregar dados ao mudar de aba ou após o login
  useEffect(() => {
    if (usuario) carregarDados();
  }, [abaAtiva, usuario]);

  // 4. Manipulação do Formulário
  const enviarFormulario = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErro(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado. Faça login novamente.');

      const precoNumerico = parseFloat(dadosFormulario.preco);
      if (isNaN(precoNumerico) || precoNumerico <= 0) {
        throw new Error('Preço inválido.');
      }

      const resposta = await fetch('/api/cardapio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...dadosFormulario,
          preco: precoNumerico,
          ativo: true
        }),
      });

      const dados = await resposta.json();
      
      if (resposta.ok && dados.success) {
        setMostrarFormulario(false);
        setDadosFormulario({ nome: '', preco: '', categoria: '', descricao: '' });
        await carregarDados();
      } else {
        throw new Error(dados.error || 'Erro desconhecido ao criar item');
      }
    } catch (erro: any) {
      console.error('Erro ao criar item:', erro);
      setErro('Erro ao criar item: ' + erro.message);
    }
  };

  // 5. Exclusão de Item
  const excluirItem = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item do cardápio?')) return;
    
    setErro(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado.');

      const resposta = await fetch(`/api/cardapio/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (resposta.status === 204) {
        await carregarDados();
      } else {
        let mensagemErro = 'Erro desconhecido ao excluir item';
        try {
          const dados = await resposta.json();
          mensagemErro = dados.error || mensagemErro;
        } catch (e) {
          mensagemErro = resposta.statusText || mensagemErro;
        }
        throw new Error(mensagemErro);
      }
    } catch (erro: any) {
      console.error('Erro ao excluir item:', erro);
      setErro('Erro ao excluir item: ' + erro.message);
    }
  };

  // Função auxiliar para obter o nome do item
  const obterNomeItem = (item: ItemCardapio | string): string => {
    if (typeof item === 'object' && item !== null) {
      return item.nome || 'Item sem nome';
    }
    return 'Item não encontrado';
  };

  // Função auxiliar para calcular o total de um item específico
  const calcularTotalItem = (item: ItemPedido): number => {
    return item.quantidade * item.precoUnitario;
  };

  if (carregando && !usuario) {
    return (
      <div className="tela-carregamento">
        <div className="carregando"></div>
        <p className="texto-carregamento">Verificando autenticação...</p>
      </div>
    );
  }
  
  if (!usuario) return null;

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
            <div className="flex centralizar-itens">
              <span className="saudacao-usuario">Olá, {usuario.nome}</span>
              <button
                onClick={handleLogout}
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
              📋 Gerenciar Cardápio
            </li>
            <li 
              className={`aba ${abaAtiva === 'pedidos' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('pedidos')}
            >
              📊 Pedidos e Faturamento
            </li>
          </ul>
        </div>
      </nav>

      <main className="controle espacamento-vertical-grande">
        {erro && (
          <div className="mensagem-erro">
            {erro}
          </div>
        )}
        
        {abaAtiva === 'cardapio' && (
          <div className="secao-cardapio">
            <div className="cabecalho-secao">
              <h2 className="titulo-secao">🍽️ Cardápio do Restaurante</h2>
              <button
                onClick={() => {
                  setErro(null);
                  setMostrarFormulario(true);
                }}
                className="botao botao-primario"
              >
                ➕ Adicionar Novo Item
              </button>
            </div>

            {mostrarFormulario && (
              <div className="fundo-modal">
                <div className="conteudo-modal">
                  <div className="cartao-conteudo">
                    <h3 className="titulo-modal">Adicionar Item ao Cardápio</h3>
                    <form onSubmit={enviarFormulario} className="formulario-modal">
                      <div className="grupo-formulario">
                        <label className="rotulo-formulario">Nome do Item</label>
                        <input
                          type="text"
                          value={dadosFormulario.nome}
                          onChange={(e) => setDadosFormulario({ ...dadosFormulario, nome: e.target.value })}
                          className="entrada-formulario"
                          required
                          placeholder="Ex: Pizza Margherita"
                        />
                      </div>
                      <div className="grupo-formulario">
                        <label className="rotulo-formulario">Preço (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={dadosFormulario.preco}
                          onChange={(e) => setDadosFormulario({ ...dadosFormulario, preco: e.target.value })}
                          className="entrada-formulario"
                          required
                          placeholder="Ex: 29.90"
                        />
                      </div>
                      <div className="grupo-formulario">
                        <label className="rotulo-formulario">Categoria</label>
                        <input
                          type="text"
                          value={dadosFormulario.categoria}
                          onChange={(e) => setDadosFormulario({ ...dadosFormulario, categoria: e.target.value })}
                          className="entrada-formulario"
                          required
                          placeholder="Ex: Prato Principal"
                        />
                      </div>
                      <div className="grupo-formulario">
                        <label className="rotulo-formulario">Descrição (Opcional)</label>
                        <textarea
                          value={dadosFormulario.descricao}
                          onChange={(e) => setDadosFormulario({ ...dadosFormulario, descricao: e.target.value })}
                          className="entrada-formulario area-texto"
                          rows={3}
                          placeholder="Descreva o item..."
                        />
                      </div>
                      <div className="botoes-formulario">
                        <button
                          type="submit"
                          className="botao botao-primario flex-1"
                        >
                          💾 Salvar Item
                        </button>
                        <button
                          type="button"
                          onClick={() => setMostrarFormulario(false)}
                          className="botao botao-secundario flex-1"
                        >
                          ❌ Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {carregando ? (
              <div className="tela-carregamento">
                <div className="carregando"></div>
                <p className="texto-carregamento">Carregando cardápio...</p>
              </div>
            ) : (
              <div className="grade grade-3">
                {itensCardapio.length === 0 ? (
                  <div className="cartao cartao-vazio">
                    <div className="cartao-conteudo">
                      <p>Nenhum item no cardápio. Adicione o primeiro item!</p>
                    </div>
                  </div>
                ) : (
                  itensCardapio.map((item) => (
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
                            {item.ativo ? '✅ Ativo' : '❌ Inativo'}
                          </span>
                          <button
                            onClick={() => excluirItem(item._id)}
                            className="botao botao-perigo botao-excluir"
                          >
                            🗑️ Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'pedidos' && (
          <div className="secao-pedidos">
            <div className="cartao-faturamento">
              <h2 className="titulo-faturamento">💰 Faturamento Total</h2>
              <p className="valor-faturamento">R$ {faturamento.toFixed(2)}</p>
              <p className="descricao-faturamento">
                Soma de todos os pedidos com status "Pago" ou "Entregue"
              </p>
              <div className="info-faturamento">
                <small>
                  💡 <strong>Dica:</strong> Para um pedido contar no faturamento, 
                  ele deve ser marcado como "Entregue" na cozinha ou "Pago" no sistema.
                </small>
              </div>
            </div>

            <div className="lista-pedidos">
              <h2 className="titulo-secao">📋 Todos os Pedidos</h2>
              
              {carregando ? (
                <div className="tela-carregamento">
                  <div className="carregando"></div>
                  <p className="texto-carregamento">Carregando pedidos...</p>
                </div>
              ) : (
                <div className="espacamento-vertical">
                  {pedidos.length === 0 ? (
                    <div className="cartao">
                      <div className="cartao-conteudo">
                        <p>Nenhum pedido encontrado.</p>
                      </div>
                    </div>
                  ) : (
                    pedidos.map((pedido) => (
                      <div key={pedido._id} className="cartao pedido">
                        <div className="cartao-conteudo">
                          <div className="cabecalho-pedido">
                            <div>
                              <h3 className="mesa-pedido">
                                🪑 Mesa {pedido.numeroMesa}
                              </h3>
                              <p className="data-pedido">
                                📅 {new Date(pedido.createdAt).toLocaleString('pt-BR')}
                              </p>
                            </div>
                            <div className="info-pedido">
                              <span className={`etiqueta-status status-${pedido.status.toLowerCase().replace(' ', '-')}`}>
                                {pedido.status === 'Pago' ? '💰' : 
                                 pedido.status === 'Entregue' ? '✅' :
                                 pedido.status === 'Pronto' ? '👨‍🍳' :
                                 pedido.status === 'Em Preparo' ? '🍳' :
                                 pedido.status === 'Recebido' ? '📥' : '❌'} {pedido.status}
                              </span>
                              <p className="total-pedido">
                                R$ {pedido.total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="itens-pedido">
                            <h4 className="titulo-itens">🍽️ Itens do Pedido:</h4>
                            <div className="lista-itens">
                              {pedido.itens.map((item, index) => (
                                <div key={index} className="item-pedido">
                                  <span>
                                    {item.quantidade}x {obterNomeItem(item.item)}
                                  </span>
                                  <span>
                                    R$ {calcularTotalItem(item).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}