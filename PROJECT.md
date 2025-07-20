# Visão Geral do Projeto Gemini CLI

Este projeto é um *fork* do repositório oficial do Gemini CLI, com o objetivo principal de aplicar e demonstrar as melhores práticas de desenvolvimento de software do mercado atual.

## Modificações Realizadas

Durante o desenvolvimento, foram implementadas as seguintes modificações:

1.  **Refatoração de Terminologia:** A palavra "fact" (fato) foi substituída por "instruction" (instrução) em todo o código-fonte e documentação do projeto. Essa alteração visa alinhar a terminologia com o papel da ferramenta de memória, que agora armazena "instruções" para o agente, em vez de "fatos" genéricos.

    *   **Arquivos Afetados:**
        *   `docs/tools/memory.md`
        *   `packages/core/src/tools/memoryTool.ts`
        *   `packages/core/src/tools/memoryTool.test.ts`
        *   `packages/core/src/core/prompts.ts`
        *   `packages/cli/src/ui/hooks/useGeminiStream.test.tsx`
        *   `packages/cli/src/ui/commands/memoryCommand.ts`
        *   `packages/cli/src/ui/commands/memoryCommand.test.ts`

2.  **Ajuste de Formatação Numérica em Testes:** Foi corrigido um problema de formatação numérica em arquivos de teste que causava falhas de snapshot devido à diferença entre o uso de vírgulas e pontos como separadores de milhares (ex: "1,000" vs "1.000"). Os testes foram atualizados para refletir a formatação esperada.

    *   **Arquivos Afetados:**
        *   `packages/cli/src/ui/components/StatsDisplay.test.tsx`

Essas modificações contribuem para a clareza do código, a consistência da terminologia e a robustez dos testes, alinhando o projeto com padrões de alta qualidade.
