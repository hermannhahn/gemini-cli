# Short-Term Memory (STM) Feature Design

## Visão Geral

A feature Short-Term Memory (STM) visa fornecer ao modelo um conjunto de ferramentas para gerenciar memórias de curto prazo de forma estruturada. Essas memórias serão armazenadas em um arquivo JSON, permitindo que o modelo adicione, pesquise e limpe entradas de forma eficiente.

## Ferramentas Propostas

As seguintes ferramentas serão desenvolvidas como parte da feature STM:

1.  **`add_stm`**: Adiciona uma nova entrada de memória ao arquivo JSON.
    *   **Parâmetros**: `key` (string), `value` (string)
    *   **Funcionalidade**: Armazena um par chave-valor no arquivo de memória.

2.  **`search_stm`**: Pesquisa entradas de memória no arquivo JSON.
    *   **Parâmetros**: `query` (string, opcional), `key` (string, opcional)
    *   **Funcionalidade**: Permite pesquisar memórias por um termo geral ou por uma chave específica.

3.  **`clean_stm`**: Limpa entradas de memória do arquivo JSON.
    *   **Parâmetros**: `key` (string, opcional), `all` (boolean, opcional)
    *   **Funcionalidade**: Remove memórias específicas por chave ou limpa todas as memórias.

## Estrutura de Armazenamento

As memórias serão armazenadas em um arquivo JSON (ex: `stm.json`) dentro do diretório de configuração do usuário ou do projeto. O formato será um array de objetos, onde cada objeto representa uma memória com `key`, `value` e um timestamp.

```json
[
  {
    "key": "exemplo_chave",
    "value": "exemplo_valor",
    "timestamp": "2025-07-20T12:00:00Z"
  }
]
```

## Próximos Passos

*   Definir a localização exata do arquivo `stm.json`.
*   Implementar as funções de leitura, escrita e manipulação do arquivo JSON.
*   Integrar as ferramentas `add_stm`, `search_stm` e `clean_stm` ao `ToolRegistry` do modelo.
*   Desenvolver testes unitários e de integração para todas as ferramentas.
