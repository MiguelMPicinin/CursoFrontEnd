// app/cozinha/page.tsx
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import './estilos-cozinha.css';

type StatusPedido = 'Recebido' | 'Em Preparo' | 'Pronto' | 'Entregue' | 'Pago' | 'Cancelado';

interface ItemPedido {
  quantidade: number;
  precoUnitario: number;
  observacao?: string;
  item: {
    _id: string;
    nome: string;
    categoria: string;
  };
}

interface Pedido {
  _id: string;
  numeroMesa: number;
  status: StatusPedido;
  total: number;
  createdAt: string;
  itens: Array<ItemPedido>;
}

export default function PaginaCozinha() {
  const [todosPedidos, setTodosPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  const carregarPedidos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCarregando(false);
        return;
      }
      
      console.log('🔄 Carregando pedidos para cozinha...');
      
      const resposta = await fetch('/api/pedidos/cozinha', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (resposta.status === 401) {
        fazerLogout();
        return;
      }

      if (!resposta.ok) {
        throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
      }

      const dados = await resposta.json();
      console.log('📦 Pedidos da cozinha recebidos:', dados);
      
      if (dados.success && dados.data) {
        setTodosPedidos(dados.data);
        
        // Debug: verificar status dos pedidos
        const statusCount: {[key: string]: number} = {};
        dados.data.forEach((pedido: Pedido) => {
          statusCount[pedido.status] = (statusCount[pedido.status] || 0) + 1;
        });
        console.log('📊 Contagem por status:', statusCount);
        setErro(null);
      } else {
        throw new Error(dados.error || 'Erro ao carregar pedidos');
      }
    } catch (erro: any) {
      console.error('❌ Erro ao carregar pedidos:', erro);
      setErro('Erro ao carregar pedidos: ' + erro.message);
      setTodosPedidos([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  const fazerLogout = useCallback(async () => {
    try {
      console.log('🚪 Iniciando logout...');
      
      const resposta = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (resposta.ok) {
        console.log('✅ Logout API chamada com sucesso');
      } else {
        console.log('⚠️ Erro na API de logout, continuando...');
      }
    } catch (erro) {
      console.error('❌ Erro ao chamar API de logout:', erro);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      console.log('🧹 LocalStorage limpo, redirecionando para login...');
      
      router.push('/login');
      router.refresh();
    }
  }, [router]);

  useEffect(() => {
    const verificarAutenticacao = async () => {
      const usuarioSalvo = localStorage.getItem('usuario');
      const token = localStorage.getItem('token');
      
      if (!usuarioSalvo || !token) {
        console.log('🔐 Sem usuário ou token no localStorage, redirecionando...');
        router.push('/login');
        return;
      }
      
      try {
        const dadosUsuario = JSON.parse(usuarioSalvo);
        
        if (dadosUsuario.tipo !== 'cozinha') {
          console.log('🚫 Usuário não tem permissão para cozinha, redirecionando...');
          fazerLogout();
          return;
        }
        
        setUsuario(dadosUsuario);
        await carregarPedidos();
      } catch (error) {
        console.error('❌ Erro ao verificar autenticação:', error);
        fazerLogout();
      }
    };

    verificarAutenticacao();
    
    const intervalo = setInterval(carregarPedidos, 10000);
    
    return () => clearInterval(intervalo);
  }, [router, carregarPedidos, fazerLogout]);

  const atualizarStatus = async (pedidoId: string, novoStatus: StatusPedido) => {
    try {
      console.log(`🔄 Atualizando pedido ${pedidoId} para status: ${novoStatus}`);
      
      const token = localStorage.getItem('token');
      const resposta = await fetch(`/api/pedidos/${pedidoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      const dados = await resposta.json();
      console.log('📨 Resposta da atualização:', dados);
      
      if (dados.success) {
        console.log('✅ Status atualizado com sucesso, recarregando pedidos...');
        setErro(null);
        await carregarPedidos();
      } else {
        const mensagemErro = dados.error || 'Erro desconhecido ao atualizar status';
        console.error('❌ Erro ao atualizar status:', mensagemErro);
        setErro('Erro ao atualizar status: ' + mensagemErro);
      }
    } catch (erro: any) {
      console.error('❌ Erro ao atualizar status:', erro);
      setErro('Erro ao atualizar status: ' + erro.message);
    }
  };
  
  const pedidosAguardandoPreparo = useMemo(() => {
    const filtrados = todosPedidos.filter(p => p.status === 'Recebido');
    console.log(`🍽️ Pedidos aguardando preparo: ${filtrados.length}`);
    return filtrados;
  }, [todosPedidos]);

  const pedidosEmPreparo = useMemo(() => {
    const filtrados = todosPedidos.filter(p => p.status === 'Em Preparo');
    console.log(`👨‍🍳 Pedidos em preparo: ${filtrados.length}`);
    return filtrados;
  }, [todosPedidos]);

  const pedidosProntos = useMemo(() => {
    const filtrados = todosPedidos.filter(p => p.status === 'Pronto');
    console.log(`✅ Pedidos prontos: ${filtrados.length}`);
    return filtrados;
  }, [todosPedidos]);
  
  const PedidoCard = ({ pedido }: { pedido: Pedido }) => {
    return (
      <div className="cartao pedido-cozinha">
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
            <span className={`status-pedido-cozinha status-${pedido.status.toLowerCase().replace(' ', '-')}`}>
              {pedido.status}
            </span>
          </div>

          <div className="itens-pedido-cozinha">
            <h4 className="titulo-itens-cozinha">Itens do Pedido:</h4>
            {pedido.itens.map((item, index) => {
                const nomeItem = (item.item && typeof item.item === 'object' && item.item.nome) 
                                 ? item.item.nome 
                                 : 'Item Desconhecido';
                return (
                  <div key={index} className="item-pedido-cozinha">
                    <div className="info-item-cozinha">
                      <p className="nome-item-cozinha">
                        {item.quantidade}x {nomeItem}
                      </p>
                      {item.observacao && (
                        <p className="observacao-item">
                          📝 Observação: {item.observacao}
                        </p>
                      )}
                    </div>
                    <div className="preco-item-cozinha">
                      R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
                    </div>
                  </div>
                );
            })}
          </div>

          <div className="rodape-pedido-cozinha">
            <div className="total-pedido-cozinha">
              <span className="texto-total-cozinha">Total:</span>
              <span className="valor-total-cozinha">
                R$ {pedido.total.toFixed(2)}
              </span>
            </div>
            
            <div className="botoes-acao-cozinha">
              {pedido.status === 'Recebido' && (
                <button
                  onClick={() => atualizarStatus(pedido._id, 'Em Preparo')}
                  className="botao botao-aviso"
                >
                  🍳 Iniciar Preparo
                </button>
              )}
              
              {pedido.status === 'Em Preparo' && (
                <button
                  onClick={() => atualizarStatus(pedido._id, 'Pronto')}
                  className="botao botao-sucesso"
                >
                  ✅ Marcar como Pronto
                </button>
              )}
              
              {pedido.status === 'Pronto' && (
                <button
                  onClick={() => atualizarStatus(pedido._id, 'Entregue')}
                  className="botao botao-info"
                >
                  🚀 Marcar como Entregue
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
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
                <span>👨‍🍳</span>
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
        {erro && (
          <div className="mensagem-erro">
            {erro}
          </div>
        )}
        
        {/* ==================== Pedidos Recebidos (Aguardando Preparo) ==================== */}
        <section className="secao-pedidos">
          <div className="cabecalho-cozinha">
            <h2 className="titulo-principal-cozinha">
              🍽️ Pedidos para Preparar
            </h2>
            <p className="subtitulo-cozinha">
              {pedidosAguardandoPreparo.length} pedido(s) aguardando preparo
            </p>
          </div>

          {pedidosAguardandoPreparo.length === 0 ? (
            <div className="cartao pedido-vazio-cozinha">
              <div className="icone-pedido-vazio">
                <span>🎉</span>
              </div>
              <h3 className="titulo-pedido-vazio">
                Nenhum pedido novo no momento!
              </h3>
              <p className="descricao-pedido-vazio">
                Todos os pedidos novos já foram iniciados.
              </p>
            </div>
          ) : (
            <div className="grade grade-1 lg-grade-2 xl-grade-3">
              {pedidosAguardandoPreparo.map((pedido) => (
                <PedidoCard key={pedido._id} pedido={pedido} />
              ))}
            </div>
          )}
        </section>
        
        <div className="separador"></div>

        {/* ==================== Pedidos Em Preparo ==================== */}
        <section className="secao-pedidos">
          <div className="cabecalho-cozinha">
            <h2 className="titulo-principal-cozinha">
              👨‍🍳 Pedidos em Preparo
            </h2>
            <p className="subtitulo-cozinha">
              {pedidosEmPreparo.length} pedido(s) sendo preparados
            </p>
          </div>
          
          {pedidosEmPreparo.length === 0 ? (
            <div className="cartao">
              <div className="cartao-conteudo">
                <p className="texto-funcionalidade-futura">
                  Nenhum pedido está sendo preparado no momento.
                </p>
              </div>
            </div>
          ) : (
            <div className="grade grade-1 lg-grade-2 xl-grade-3">
              {pedidosEmPreparo.map((pedido) => (
                <PedidoCard key={pedido._id} pedido={pedido} />
              ))}
            </div>
          )}
        </section>
        
        <div className="separador"></div>

        {/* ==================== Pedidos Prontos (Aguardando Entrega) ==================== */}
        <section className="secao-pedidos">
          <div className="cabecalho-cozinha">
            <h2 className="titulo-principal-cozinha">
              ✅ Pedidos Prontos
            </h2>
            <p className="subtitulo-cozinha">
              {pedidosProntos.length} pedido(s) pronto(s) aguardando retirada
            </p>
          </div>
          
          {pedidosProntos.length === 0 ? (
            <div className="cartao">
              <div className="cartao-conteudo">
                <p className="texto-funcionalidade-futura">
                  Nenhum pedido pronto aguardando retirada.
                </p>
              </div>
            </div>
          ) : (
            <div className="grade grade-1 lg-grade-2 xl-grade-3">
              {pedidosProntos.map((pedido) => (
                <PedidoCard key={pedido._id} pedido={pedido} />
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}