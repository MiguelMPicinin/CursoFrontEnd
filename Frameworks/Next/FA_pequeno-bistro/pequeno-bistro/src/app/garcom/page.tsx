'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './estilos-garcom.css';

interface ItemCardapio {
  _id: string;
  nome: string;
  preco: number;
  categoria: string;
}

interface ItemPedido {
  item: string;
  quantidade: number;
  observacao?: string;
  precoUnitario: number;
  nome: string;
}

// Função centralizada de Logout (pode ser importada de um arquivo utils)
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

export default function PaginaGarcom() {
  const [itensCardapio, setItensCardapio] = useState<ItemCardapio[]>([]);
  const [numeroMesa, setNumeroMesa] = useState('');
  const [itensPedido, setItensPedido] = useState<ItemPedido[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const [carregando, setCarregando] = useState(false);
  const [usuario, setUsuario] = useState<{ id: string; nome: string; tipo: string } | null>(null);
  const [erro, setErro] = useState('');
  const router = useRouter();

  // Categorias são geradas a partir dos itens do cardápio
  const categorias = ['Todas', ...new Set(itensCardapio.map(item => item.categoria))];

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
        
        // Verificar permissão
        if (dadosUsuario.tipo !== 'garcom') {
          console.log('Usuário não tem permissão para garçom, redirecionando...');
          await handleLogout();
          return;
        }
        
        setUsuario(dadosUsuario);
        await carregarCardapio(token);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push('/login');
      }
    };

    verificarAutenticacao();
  }, [router]);

  // 2. Função de Carregamento de Cardápio
  const carregarCardapio = async (token: string) => {
    try {
      setErro('');
      const resposta = await fetch('/api/cardapio', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!resposta.ok) {
        throw new Error('Erro ao carregar cardápio. Status: ' + resposta.status);
      }
      
      const dados = await resposta.json();
      if (dados.success) {
        // Filtra apenas itens ativos
        setItensCardapio(dados.data.filter((item: any) => item.ativo)); 
      } else {
         throw new Error(dados.error || 'Falha ao carregar cardápio');
      }
    } catch (erro: any) {
      console.error('Erro ao carregar cardápio:', erro);
      setErro('Erro ao carregar cardápio: ' + erro.message);
    }
  };

  // 3. Funções de manipulação do pedido (sem alterações)
  const adicionarItem = (item: ItemCardapio) => {
    // ... lógica de adicionar item ...
    const itemExistente = itensPedido.find(i => i.item === item._id);
    
    if (itemExistente) {
      setItensPedido(itensPedido.map(i =>
        i.item === item._id
          ? { ...i, quantidade: i.quantidade + 1 }
          : i
      ));
    } else {
      setItensPedido([
        ...itensPedido,
        {
          item: item._id,
          quantidade: 1,
          precoUnitario: item.preco,
          nome: item.nome
        }
      ]);
    }
  };

  const removerItem = (itemId: string) => {
    setItensPedido(itensPedido.filter(item => item.item !== itemId));
  };

  const atualizarQuantidade = (itemId: string, quantidade: number) => {
    if (quantidade < 1) {
      removerItem(itemId);
      return;
    }
    
    setItensPedido(itensPedido.map(item =>
      item.item === itemId
        ? { ...item, quantidade }
        : item
    ));
  };

  const totalPedido = itensPedido.reduce((total, item) => {
    return total + (item.quantidade * item.precoUnitario);
  }, 0);

  // 4. Envio do Pedido
  const enviarPedido = async () => {
    setErro('');
    if (!numeroMesa || isNaN(parseInt(numeroMesa))) {
      setErro('Preencha um número de mesa válido.');
      return;
    }

    if (itensPedido.length === 0) {
      setErro('Adicione itens ao pedido antes de enviar.');
      return;
    }

    setCarregando(true);

    try {
      const token = localStorage.getItem('token');
      if (!token || !usuario) throw new Error('Dados de usuário ausentes. Faça login novamente.');

      const resposta = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          numeroMesa: parseInt(numeroMesa),
          itens: itensPedido.map(item => ({
            item: item.item,
            quantidade: item.quantidade,
            observacao: item.observacao,
            precoUnitario: item.precoUnitario
          })),
          garcom: usuario.id
        }),
      });

      const dados = await resposta.json();
      
      if (resposta.ok && dados.success) {
        alert('Pedido enviado para a cozinha com sucesso!');
        setItensPedido([]);
        setNumeroMesa('');
      } else {
        throw new Error(dados.error || 'Erro desconhecido ao enviar pedido');
      }
    } catch (erro: any) {
      console.error('Erro ao enviar pedido:', erro);
      setErro('Erro ao enviar pedido: ' + erro.message);
    } finally {
      setCarregando(false);
    }
  };

  // 5. Filtragem
  const itensFiltrados = categoriaAtiva === 'Todas' 
    ? itensCardapio 
    : itensCardapio.filter(item => item.categoria === categoriaAtiva);

  if (!usuario) return null; // Não renderiza antes de carregar o usuário

  // Renderização
  return (
    <div className="pagina-garcom">
      <header className="cabecalho">
        <div className="controle">
          <div className="cabecalho-conteudo">
            <div className="flex centralizar-itens">
              <div className="icone-garcom">
                <span>👨‍🍳</span>
              </div>
              <h1 className="titulo-pagina">Pequeno Bistrô - Garçom</h1>
            </div>
            <div className="flex centralizar-itens">
              <span className="saudacao-usuario">Olá, {usuario.nome}</span>
              <button
                onClick={handleLogout} // Usando a função centralizada
                className="botao botao-perigo"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="controle espacamento-vertical-grande">
        {erro && (
          <div className="mensagem-erro">
            {erro}
          </div>
        )}
        
        <div className="grade grade-1 lg-grade-3-2">
          {/* Seção Cardápio */}
          <div className="secao-cardapio">
            <div className="cartao">
              <div className="cartao-conteudo">
                <h2 className="titulo-secao">Cardápio</h2>
                
                <div className="filtros-categoria">
                  {categorias.map(categoria => (
                    <button
                      key={categoria}
                      onClick={() => setCategoriaAtiva(categoria)}
                      className={`botao-categoria ${categoriaAtiva === categoria ? 'ativo' : ''}`}
                    >
                      {categoria}
                    </button>
                  ))}
                </div>

                <div className="grade grade-1 md-grade-2">
                  {itensFiltrados.map(item => (
                    <div
                      key={item._id}
                      className="cartao-item-cardapio"
                    >
                      <div className="cabecalho-item-cardapio">
                        <h3 className="nome-item-cardapio">{item.nome}</h3>
                        <span className="preco-item-cardapio">
                          R$ {item.preco.toFixed(2)}
                        </span>
                      </div>
                      <p className="categoria-item-cardapio">{item.categoria}</p>
                      <div className="acao-item-cardapio">
                        <button 
                          onClick={() => adicionarItem(item)}
                          className="botao botao-secundario largura-total"
                        >
                          Adicionar ao Pedido
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Seção Pedido Atual */}
          <div className="secao-pedido">
            <div className="cartao pedido-fixo">
              <div className="cartao-conteudo">
                <h2 className="titulo-secao">Pedido Atual</h2>
                
                <div className="grupo-formulario">
                  <label className="rotulo-formulario">
                    Número da Mesa
                  </label>
                  <input
                    type="number"
                    value={numeroMesa}
                    onChange={(e) => setNumeroMesa(e.target.value)}
                    className="entrada-formulario"
                    min="1"
                    placeholder="Ex: 1"
                  />
                </div>

                <div className="lista-itens-pedido">
                  {itensPedido.length === 0 ? (
                    <p className="pedido-vazio">
                      Nenhum item adicionado ao pedido
                    </p>
                  ) : (
                    itensPedido.map(item => (
                      <div key={item.item} className="item-pedido-atual">
                        <div className="info-item-pedido">
                          <p className="nome-item-pedido">{item.nome}</p>
                          <p className="preco-unitario-item">
                            R$ {item.precoUnitario.toFixed(2)} cada
                          </p>
                        </div>
                        <div className="controles-quantidade">
                          <button
                            onClick={() => atualizarQuantidade(item.item, item.quantidade - 1)}
                            className="botao-quantidade"
                          >
                            -
                          </button>
                          <span className="quantidade-item">{item.quantidade}</span>
                          <button
                            onClick={() => atualizarQuantidade(item.item, item.quantidade + 1)}
                            className="botao-quantidade"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removerItem(item.item)}
                            className="botao-remover-item"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="resumo-pedido">
                  <div className="linha-total">
                    <span className="texto-total">Total do Pedido:</span>
                    <span className="valor-total">
                      R$ {totalPedido.toFixed(2)}
                    </span>
                  </div>
                  
                  <button
                    onClick={enviarPedido}
                    disabled={carregando || !numeroMesa || itensPedido.length === 0}
                    className="botao botao-primario largura-total"
                  >
                    {carregando ? (
                      <>
                        <div className="carregando"></div>
                        Enviando...
                      </>
                    ) : (
                      'Enviar para Cozinha'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}