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

export default function PaginaGarcom() {
  const [itensCardapio, setItensCardapio] = useState<ItemCardapio[]>([]);
  const [numeroMesa, setNumeroMesa] = useState('');
  const [itensPedido, setItensPedido] = useState<ItemPedido[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const [carregando, setCarregando] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const roteador = useRouter();

  const categorias = ['Todas', ...new Set(itensCardapio.map(item => item.categoria))];

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (!usuarioSalvo) {
      roteador.push('/login');
      return;
    }
    
    const dadosUsuario = JSON.parse(usuarioSalvo);
    setUsuario(dadosUsuario);
    
    if (dadosUsuario.tipo !== 'garcom') {
      roteador.push('/login');
      return;
    }

    carregarCardapio();
  }, [roteador]);

  const carregarCardapio = async () => {
    try {
      const resposta = await fetch('/api/cardapio');
      const dados = await resposta.json();
      if (dados.success) {
        setItensCardapio(dados.data.filter((item: any) => item.ativo));
      }
    } catch (erro) {
      console.error('Erro ao carregar cardápio:', erro);
    }
  };

  const adicionarItem = (item: ItemCardapio) => {
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

  const enviarPedido = async () => {
    if (!numeroMesa || itensPedido.length === 0) {
      alert('Preencha o número da mesa e adicione itens ao pedido');
      return;
    }

    setCarregando(true);
    try {
      const resposta = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numeroMesa: parseInt(numeroMesa),
          itens: itensPedido.map(item => ({
            item: item.item,
            quantidade: item.quantidade,
            observacao: item.observacao
          })),
          garcom: usuario.id
        }),
      });

      const dados = await resposta.json();
      
      if (dados.success) {
        alert('Pedido enviado para a cozinha!');
        setItensPedido([]);
        setNumeroMesa('');
      } else {
        alert('Erro ao enviar pedido: ' + dados.error);
      }
    } catch (erro) {
      alert('Erro de conexão');
    } finally {
      setCarregando(false);
    }
  };

  const fazerLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    roteador.push('/login');
  };

  const itensFiltrados = categoriaAtiva === 'Todas' 
    ? itensCardapio 
    : itensCardapio.filter(item => item.categoria === categoriaAtiva);

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
              <span className="saudacao-usuario">Olá, {usuario?.nome}</span>
              <button
                onClick={fazerLogout}
                className="botao botao-perigo"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="controle espacamento-vertical-grande">
        <div className="grade grade-1 lg-grade-3-2">
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
                      onClick={() => adicionarItem(item)}
                    >
                      <div className="cabecalho-item-cardapio">
                        <h3 className="nome-item-cardapio">{item.nome}</h3>
                        <span className="preco-item-cardapio">
                          R$ {item.preco.toFixed(2)}
                        </span>
                      </div>
                      <p className="categoria-item-cardapio">{item.categoria}</p>
                      <div className="acao-item-cardapio">
                        <button className="botao botao-secundario largura-total">
                          Adicionar ao Pedido
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

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
                    {carregando ? 'Enviando...' : 'Enviar para Cozinha'}
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