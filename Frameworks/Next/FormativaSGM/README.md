# Sistema de Gestão de Manutenção (Formativa)

## Briefing

## Escopo

- Objetivos:

- Público-Alvo:

- Recursos Tecnológicos:

## Diagramas (Mermaid, Miro, Draw.io)

- Classe

 ```mermaid
classDiagram
    class User {
        +String id
        +String name
        +String email
        +String senha
        +bool isEmServico
    }

    class Gestor {
        +cadastrarEquipamento()
        +agendarManutencaoPrev()
        +agendarManutencaoCorretiva()
        +gerarRelatorios()
    }

    class Tecnico {
        +criarOrdemServico()
        +atualizarOrdemServico()
        +visualizarEquipamentos()
    }

    class Equipamento {
        +String id
        +String name
        +String status
        +bool isFuncionando
    }

    class AgendamentoMPreventiva {
        +String id
        +Date diaManutencao
        +bool isAgendadaPrev
    }

    class AgendamentoMCorretiva {
        +String id
        +Date diaManutencao
        +bool isAgendadaCorretiva
    }

    class OrdemServico {
        +String id
        +String idFuncionario  %% FK -> Tecnico.id
        +String idMaquina      %% FK -> Equipamento.id
        +Date inicio
        +Date fim
        +bool isConcluido
    }

    %% Herança
    Gestor --|> User
    Tecnico --|> User

    %% Relacionamentos
    Gestor "1" --> "0..*" Equipamento : cadastra
    Gestor "1" --> "0..*" AgendamentoMPreventiva : agenda
    Gestor "1" --> "0..*" AgendamentoMCorretiva : agenda

    Tecnico "1" --> "0..*" OrdemServico : cria/atualiza
    OrdemServico "1" --> "1" Equipamento : refere-se
```


- Casos de Uso


```mermaid
usecaseDiagram
    actor Tecnico
    actor Gestor

    rectangle Sistema {
        (Cadastrar Equipamento) as UC1
        (Agendar Manutenção Preventiva) as UC2
        (Agendar Manutenção Corretiva) as UC3
        (Criar Ordem de Serviço) as UC4
        (Visualizar Equipamentos) as UC5
        (Atualizar Status da Ordem) as UC6
        (Gerar Relatórios de Manutenção) as UC7
    }

    Gestor --> UC1
    Gestor --> UC2
    Gestor --> UC3
    Gestor --> UC7

    Tecnico --> UC4
    Tecnico --> UC5
    Tecnico --> UC6
```


- Fluxo


```mermaid
flowchart TD
    subgraph Sistema["Sistema de Gestão de Manutenção"]
        ORD[Ordem de Serviço]
        EQP[Cadastro de Equipamentos]
        AGP[Agendamento Preventivo]
        AGC[Agendamento Corretivo]
        REL[Relatórios]
    end

    Gestor -->|Dados do Equipamento| EQP
    Gestor -->|Dados de Agendamento| AGP
    Gestor -->|Dados de Agendamento| AGC
    Gestor <--|Relatórios| REL

    Tecnico -->|Nova Ordem| ORD
    Tecnico -->|Atualiza Ordem| ORD
    Tecnico <--|Lista de Equipamentos| EQP

    ORD -->|Atualiza Status| REL
    AGP -->|Info para Relatórios| REL
    AGC -->|Info para Relatórios| REL
```

## Analise de Risco