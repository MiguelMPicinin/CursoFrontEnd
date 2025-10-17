import Link from 'next/link';
import './estilos-inicial.css';

export default function PaginaInicial() {
  return (
    <div className="pagina-inicial">
      <header className="cabecalho">
        <div className="controle">
          <div className="cabecalho-conteudo">
            <div className="flex centralizar-itens">
              <div className="icone-principal">
                <span>🍽️</span>
              </div>
              <h1 className="titulo-principal">Pequeno Bistrô Sabor Local</h1>
            </div>
            <Link
              href="/login"
              className="botao botao-primario"
            >
              Entrar no Sistema
            </Link>
          </div>
        </div>
      </header>

      <main className="controle">
        <section className="secao-hero">
          <div className="conteudo-hero">
            <div className="icone-hero">
              <span>🍽️</span>
            </div>
            
            <h1 className="titulo-hero">
              Sistema de Gestão de Pedidos
            </h1>
            
            <p className="descricao-hero">
              Solução completa para gerenciar pedidos, cardápio e faturamento do seu restaurante. 
              Diga adeus aos papéis perdidos e às anotações ilegíveis!
            </p>

            <div className="grade grade-3">
              <div className="cartao cartao-funcao">
                <div className="icone-funcao icone-gerente">
                  <span>👨‍💼</span>
                </div>
                <h3 className="titulo-funcao">Gerente</h3>
                <p className="descricao-funcao">
                  Gerencie o cardápio, visualize todos os pedidos e acompanhe o faturamento.
                </p>
                <ul className="lista-funcoes">
                  <li>CRUD completo do cardápio</li>
                  <li>Visualização de todos os pedidos</li>
                  <li>Relatórios de faturamento</li>
                </ul>
              </div>

              <div className="cartao cartao-funcao">
                <div className="icone-funcao icone-garcom">
                  <span>👨‍🍳</span>
                </div>
                <h3 className="titulo-funcao">Garçom</h3>
                <p className="descricao-funcao">
                  Crie novos pedidos, adicione itens e envie diretamente para a cozinha.
                </p>
                <ul className="lista-funcoes">
                  <li>Criar pedidos por mesa</li>
                  <li>Adicionar múltiplos itens</li>
                  <li>Envio direto para cozinha</li>
                </ul>
              </div>

              <div className="cartao cartao-funcao">
                <div className="icone-funcao icone-cozinha">
                  <span>👨‍🔧</span>
                </div>
                <h3 className="titulo-funcao">Cozinha</h3>
                <p className="descricao-funcao">
                  Visualize pedidos em ordem de chegada e atualize os status de preparação.
                </p>
                <ul className="lista-funcoes">
                  <li>Pedidos em tempo real</li>
                  <li>Ordem de chegada</li>
                  <li>Atualização de status</li>
                </ul>
              </div>
            </div>

            <div className="acao-principal">
              <Link
                href="/login"
                className="botao botao-primario botao-grande"
              >
                Acessar Sistema
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="rodape">
        <div className="controle">
          <div className="conteudo-rodape">
            <p>© 2024 Pequeno Bistrô Sabor Local. Todos os direitos reservados.</p>
            <p className="texto-rodape">Sistema desenvolvido para otimizar a gestão de pedidos.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}