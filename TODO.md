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