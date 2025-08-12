# TODO

## Erros

### Problema de Publicação Nightly no NPM

**General Status**: Resolved

**Main Objective**: Publicar pacotes nightly no NPM com a versão correta (ex: `0.1.33-nightly-XXXX`) e resolver o erro "No workspaces found".

**Resolution Attempts**:

- **Attempt 1**:
  - **Action Plan**:
    1.  Identificar a causa do erro "No workspaces found" no comando `npm publish`.
    2.  Verificar o `package.json` do `@hahnd/gemini-cli-core` para confirmar o nome do workspace.
    3.  Analisar o `nightly-release.yml` para entender como o comando `npm publish` é construído.
    4.  Analisar o `scripts/get-nightly-version.js` para entender como a versão nightly é gerada.
    5.  Propor e aplicar alterações no `nightly-release.yml` para:
        -   Remover a versão do argumento `--workspace` no `npm publish`.
        -   Adicionar um passo para atualizar a versão no `package.json` dos pacotes (`@hahnd/gemini-cli-core` e `@hahnd/geminid`) com a versão nightly gerada, antes da publicação.
  - **Attempt Status**: Completed
  - **Result**: As alterações foram aplicadas no `nightly-release.yml`. O fluxo de publicação agora deve gerar a versão nightly, atualizar o `package.json` dos pacotes com essa versão e, em seguida, publicar corretamente no NPM.

### Falha Intermitente no Teste useCompletion.test.ts

**General Status**: Intermittent

**Main Objective**: Investigar e resolver a falha intermitente no teste `src/ui/hooks/useCompletion.test.ts > useCompletion > File Path Completion (` @`) > Basic Completion > should use glob for top-level @ completions when available`.

**Resolution Attempts**:

- **Attempt 1**:
  - **Action Plan**:
    1.  Analisar o `TODO.md` para histórico do erro (nenhum encontrado).
    2.  Analisar o código do teste `useCompletion.test.ts` e da função `useCompletion.ts`.
    3.  Identificar que o teste espera 2 sugestões, mas recebe 0.
    4.  Suspeitar de problemas na criação de arquivos de teste, lógica de `glob` ou temporização.
    5.  Adicionar `console.log`s em `findFilesWithGlob` para depuração.
    6.  Recompilar o projeto.
    7.  Rodar o teste novamente.
  - **Attempt Status**: Awaiting User
  - **Result**: O teste passou após a adição dos `console.log`s e também após a remoção e recompilação. O erro não é reproduzível consistentemente.
