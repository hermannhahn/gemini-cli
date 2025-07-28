# Gemini Dev CLI

[![Gemini CLI CI](https://github.com/google-gemini/gemini-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/google-gemini/gemini-cli/actions/workflows/ci.yml) ![Gemini CLI Screenshot](./docs/assets/gemini-screenshot.png)

This repository contains the **Gemini Dev CLI**, a personal fork of the [official Gemini CLI](https://github.com/google-gemini/gemini-cli). Our goal is to extend and customize the tool for specific development workflows, while maintaining compatibility for future updates from the original project.

The Gemini CLI is a command-line AI workflow tool that connects to your tools, understands your code, and accelerates your workflows. With it, you can:

- Query and edit large codebases within and beyond Gemini's 1M token context window.
- Generate new applications from PDFs or sketches, using Gemini's multimodal capabilities.
- Automate operational tasks, such as querying pull requests or handling complex rebases.
- Use tools and MCP servers to connect new capabilities, including [media generation with Imagen, Veo, or Lyria](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia).
- Ground your queries with the [Google Search](https://ai.google.dev/gemini-api/docs/grounding) tool, built into Gemini.

## Custom Features

This personal fork of the Gemini CLI includes the following custom features:

- **Long-Term Memory (LTM):** A tool for permanent instructions and information storage, allowing the AI to retain key details across sessions.
- **Short-Term Memory (STM):** Manages structured memories in a JSON file, providing session-specific context and enhancing interaction continuity.
- **Narrator:** Provides audio feedback for the CLI, with modes for AI actions and response summaries.

### Quickstart

1.  **Prerequisites:** Ensure you have [Node.js version 20](https://nodejs.org/en/download) or higher installed.
2.  **Run the CLI:** Execute the following command in your terminal to install and use the Gemini Dev CLI:

    ```bash
    npm install -g @hahnd/geminid
    ```

    Em seguida, execute o CLI de qualquer lugar:

    ```bash
    geminid
    ```

3.  **Escolha um tema de cor**
4.  **Autenticar:** Quando solicitado, faça login com sua conta pessoal do Google. Isso lhe concederá até 60 solicitações de modelo por minuto e 1.000 solicitações de modelo por dia usando o Gemini.

Você está pronto para usar o Gemini Dev CLI!

#### Usar uma chave de API do Gemini:

A API Gemini oferece um nível gratuito com [100 solicitações por dia](https://ai.google.dev/gemini-api/docs/rate-limits#free-tier) usando o Gemini 2.5 Pro, controle sobre qual modelo você usa e acesso a limites de taxa mais altos (com um plano pago):

1.  Gere uma chave em [Google AI Studio](https://aistudio.google.com/apikey).
2.  Defina-a como uma variável de ambiente em seu terminal. Substitua `YOUR_API_KEY` pela sua chave gerada.

    ```bash
    export GEMINI_API_KEY="YOUR_API_KEY"
    ```

3.  (Opcional) Atualize seu projeto da API Gemini para um plano pago na página da chave da API (desbloqueará automaticamente os [limites de taxa do Nível 1](https://ai.google.dev/gemini-api/docs/rate-limits#tier-1))

#### Usar uma chave de API do Vertex AI:

A API Vertex AI oferece um [nível gratuito](https://cloud.google.com/vertex-ai/generative-ai/docs/start/express-mode/overview) usando o modo expresso para o Gemini 2.5 Pro, controle sobre qual modelo você usa e acesso a limites de taxa mais altos com uma conta de faturamento:

1.  Gere uma chave em [Google Cloud](https://cloud.google.com/vertex-ai/generative-ai/docs/start/api-keys).
2.  Defina-a como uma variável de ambiente em seu terminal. Substitua `YOUR_API_KEY` pela sua chave gerada e defina GOOGLE_GENAI_USE_VERTEXAI como true

    ```bash
    export GOOGLE_API_KEY="YOUR_API_KEY"
    export GOOGLE_GENAI_USE_VERTEXAI=true
    ```

3.  (Opcional) Adicione uma conta de faturamento ao seu projeto para ter acesso a [limites de uso mais altos](https://cloud.google.com/vertex-ai/generative-ai/docs/quotas)

Para outros métodos de autenticação, incluindo contas do Google Workspace, consulte o guia de [autenticação](./docs/cli/authentication.md).

### Exemplos

Uma vez que o CLI esteja em execução, você pode começar a interagir com o Gemini a partir do seu shell.

Você pode iniciar um projeto a partir de um novo diretório:

```sh
cd new-project/
geminid
> Write me a Gemini Discord bot that answers questions using a FAQ.md file I will provide
```

Ou trabalhar com um projeto existente:

```sh
git clone https://github.com/hermannhahn/gemini-cli
cd gemini-cli
geminid
> Give me a summary of all of the changes that went in yesterday
```

### Próximos passos

- Explore os **[Comandos CLI](./docs/cli/commands.md)** disponíveis.
- Se você encontrar algum problema, revise o **[guia de solução de problemas](./docs/troubleshooting.md)**.
- Para documentação mais abrangente, consulte a [documentação completa](./docs/index.md).
- Dê uma olhada em algumas [tarefas populares](#popular-tasks) para mais inspiração.
- Para detalhes sobre o fluxo de trabalho de desenvolvimento e contribuição, consulte o [WORKFLOW.md](./WORKFLOW.md).

### Solução de problemas

Dirija-se ao [guia de solução de problemas](docs/troubleshooting.md) se estiver tendo problemas.

### Tarefas populares

#### Explorar uma nova base de código

Comece entrando em um repositório existente ou recém-clonado e executando `gemini-dev`.

```text
> Descreva as principais partes da arquitetura deste sistema.
```

```text
> What security mechanisms are in place?
```

```text
> Provide a step-by-step dev onboarding doc for developers new to the codebase.
```

```text
> Summarize this codebase and highlight the most interesting patterns or techniques I could learn from.
```

```text
> Identify potential areas for improvement or refactoring in this codebase, highlighting parts that appear fragile, complex, or hard to maintain.
```

```text
> Which parts of this codebase might be challenging to scale or debug?
```

```text
> Generate a README section for the [module name] module explaining what it does and how to use it.
```

```text
> What kind of error handling and logging strategies does the project use?
```

```text
> Which tools, libraries, and dependencies are used in this project?
```

#### Trabalhar com seu código existente

```text
> Implemente um primeiro rascunho para o problema do GitHub #123.
```

```text
> Ajude-me a migrar esta base de código para a versão mais recente do Java. Comece com um plano.
```

#### Automatizar seus fluxos de trabalho

Use servidores MCP para integrar suas ferramentas de sistema local com sua suíte de colaboração empresarial.

```text
> Crie uma apresentação de slides mostrando o histórico do git dos últimos 7 dias, agrupado por recurso e membro da equipe.
```

```text
> Crie um aplicativo web em tela cheia para um display de parede para mostrar nossos problemas mais interagidos do GitHub.
```

#### Interagir com seu sistema

```text
> Converta todas as imagens neste diretório para png e renomeie-as para usar datas dos dados exif.
```

```text
> Organize minhas faturas em PDF por mês de despesa.
```

### Desinstalar

Dirija-se ao guia de [Desinstalação](docs/Uninstall.md) para instruções de desinstalação.

## Termos de Serviço e Aviso de Privacidade

Para detalhes sobre os termos de serviço e aviso de privacidade aplicáveis ao seu uso do Gemini CLI, consulte os [Termos de Serviço e Aviso de Privacidade](./docs/tos-privacy.md).
