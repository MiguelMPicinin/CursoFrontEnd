## Curso FrontEnd - Prof Diogo

## Diagramas com Mermaid

### Diagrama de fluxo de arquitetura de projeto
'''mermaid
graph TD
    subgraph Cliente["Navegador"]
        UI
    end
    subgraph Front["React"]
        FrontEnd
    endsubgraph Back["API"]
        BackEnd
    endsubgraph Banco["MongoDB"]
        BD
    end

    %% fluxo

    UI-->FrontEnd
    FrontEnd-->BackEnd
    BackEnd--BD
    BD-->BackEnd
    BackEnd-->FrontEnd
    FrontEnd-->UI

'''