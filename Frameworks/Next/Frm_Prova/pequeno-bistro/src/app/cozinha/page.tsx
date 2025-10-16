'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './estilos-cozinha.css';

interface Pedido {
  _id: string;
  numeroMesa: number;
  status: string;
  total: number;
  createdAt: string;
  itens: Array<{
    quantidade: number;
    precoUnitario: number;
    observacao?: string;
    item: {
      _id: string;
      nome: string;
      categoria: string;
    };
  }>;
}

export default function PaginaCozinha() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const roteador = useRouter();

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (!usuarioSalvo) {
      roteador.push('/login');
      return;
    }
    
    const dadosUsuario = JSON.parse(usuarioSalvo);
    setUsuario(dadosUsuario);
    
    if (dadosUsuario.tipo !== 'cozinha') {
      roteador.push('/login');
      return;
    }

    carregarPedidos();
    
    const intervalo = setInterval(carregarPedidos, 10000);
    return () => clearInterval(intervalo);
  }, [roteador]);

  const carregarPedidos = async () => {
    try {
      const resposta = await fetch('/api/pedidos/cozinha');
      const dados = await resposta.json();
      if (dados.success) {
        setPedidos(dados.data);
      }
      setCarregando(false);
    } catch (erro) {
      console.error('Erro ao carregar pedidos:', erro);
      setCarregando(false);
    }
  };

  const atualizarStatus = async (pedidoId: string, novoStatus: string) => {
    try {
      const resposta = await fetch(`/api/pedidos/${pedidoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      const dados = await resposta.json();
      
      if (dados.success) {
        carregarPedidos();
      }
    } catch (erro) {
      console.error('Erro ao atualizar status:', erro);
    }
  };

  const fazerLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    roteador.push('/login');
  };

  if (carregando) {
    return (
      <div className="tela-carregamento">
        <div className="carregando"></div>
        <p className="texto-carregamento">Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="pagina-cozinha">
      <header className="cabecalho">
        <div className="controle">
          <div className="cabecalho-conteudo">
            <div className="flex centralizar-itens">
              <div className="icone-cozinha">
                <span>👨‍🔧</span>
              </div>
              <h1 className="titulo-pagina">Pequeno Bistrô - Cozinha</h1>
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

      <main className="controle espacamento-vertical-grande">
        <div className="cabecalho-cozinha">
          <h2 className="titulo-principal-cozinha">
            Pedidos para Preparar
          </h2>
          <p className="subtitulo-cozinha">
            {pedidos.length} pedido(s) aguardando preparo
          </p>
        </div>

        {pedidos.length === 0 ? (
          <div className="cartao pedido-vazio-cozinha">
            <div className="icone-pedido-vazio">
              <span>✅</span>
            </div>
            <h3 className="titulo-pedido-vazio">
              Todos os pedidos estão prontos!
            </h3>
            <p className="descricao-pedido-vazio">
              Não há pedidos aguardando preparo no momento.
            </p>
          </div>
        ) : (
          <div className="grade grade-1 lg-grade-2 xl-grade-3">
            {pedidos.map((pedido) => (
              <div key={pedido._id} className="cartao pedido-cozinha">
                <div className="cartao-conteudo">
                  <div className="cabecalho-pedido-cozinha">
                    <div>
                      <h3 className="mesa-pedido-cozinha">
                        Mesa {pedido.numeroMesa}
                      </h3>
                      <p className="data-pedido-cozinha">
                        {new Date(pedido.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <span className="status-pedido-cozinha">
                      Aguardando Preparo
                    </span>
                  </div>

                  <div className="itens-pedido-cozinha">
                    <h4 className="titulo-itens-cozinha">Itens do Pedido:</h4>
                    {pedido.itens.map((item, index) => (
                      <div key={index} className="item-pedido-cozinha">
                        <div className="info-item-cozinha">
                          <p className="nome-item-cozinha">
                            {item.quantidade}x {typeof item.item === 'object' ? item.item.nome : 'Item'}
                          </p>
                          {item.observacao && (
                            <p className="observacao-item">
                              Observação: {item.observacao}
                            </p>
                          )}
                        </div>
                        <span className="valor-item-cozinha">
                          R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="rodape-pedido-cozinha">
                    <div className="total-pedido-cozinha">
                      <span className="texto-total-cozinha">Total:</span>
                      <span className="valor-total-cozinha">
                        R$ {pedido.total.toFixed(2)}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => atualizarStatus(pedido._id, 'Em Preparo')}
                      className="botao botao-aviso largura-total"
                    >
                      Iniciar Preparo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="secao-preparo">
          <h2 className="titulo-secao">Pedidos em Preparo</h2>
          <div className="cartao">
            <div className="cartao-conteudo">
              <p className="texto-funcionalidade-futura">
                Em breve: acompanhamento dos pedidos em preparo
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}