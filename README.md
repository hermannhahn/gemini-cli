# Gemini Dev CLI

[![Gemini CLI CI](https://github.com/google-gemini/gemini-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/google-gemini/gemini-cli/actions/workflows/ci.yml)
[![Version](https://img.shields.io/npm/v/@google/gemini-cli)](https://www.npmjs.com/package/@google/gemini-cli)
[![License](https://img.shields.io/github/license/google-gemini/gemini-cli)](https://github.com/google-gemini/gemini-cli/blob/main/LICENSE)

![Gemini CLI Screenshot](./docs/assets/gemini-screenshot.png)

---

## English Version

This repository contains the **Gemini Dev CLI**, a personal fork of the [official Gemini CLI](https://github.com/google-gemini/gemini-cli). Our goal is to extend and customize the tool for specific development workflows, while maintaining compatibility for future updates from the original project.

The Gemini CLI is a command-line AI workflow tool that connects to your tools, understands your code, and accelerates your workflows. With it, you can:

- Query and edit large codebases within and beyond Gemini's 1M token context window.
- Generate new applications from PDFs or sketches, using Gemini's multimodal capabilities.
- Automate operational tasks, such as querying pull requests or handling complex rebases.
- Use tools and MCP servers to connect new capabilities, including [media generation with Imagen, Veo, or Lyria](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia).
- Ground your queries with the [Google Search](https://ai.google.dev/gemini-api/docs/grounding) tool, built into Gemini.

### Quickstart

1.  **Prerequisites:** Ensure you have [Node.js version 20](https://nodejs.org/en/download) or higher installed.
2.  **Run the CLI:** Execute the following command in your terminal to install and use the Gemini Dev CLI:

    ```bash
    npm install -g @hahnd/gemini-dev
    ```

    Then, run the CLI from anywhere:

    ```bash
    gemini-dev
    ```

3.  **Pick a color theme**
4.  **Authenticate:** When prompted, sign in with your personal Google account. This will grant you up to 60 model requests per minute and 1,000 model requests per day using Gemini.

You are now ready to use the Gemini Dev CLI!

#### Use a Gemini API key:

The Gemini API provides a free tier with [100 requests per day](https://ai.google.dev/gemini-api/docs/rate-limits#free-tier) using Gemini 2.5 Pro, control over which model you use, and access to higher rate limits (with a paid plan):

1.  Generate a key from [Google AI Studio](https://aistudio.google.com/apikey).
2.  Set it as an environment variable in your terminal. Replace `YOUR_API_KEY` with your generated key.

    ```bash
    export GEMINI_API_KEY="YOUR_API_KEY"
    ```

3.  (Optional) Upgrade your Gemini API project to a paid plan on the API key page (will automatically unlock [Tier 1 rate limits](https://ai.google.dev/gemini-api/docs/rate-limits#tier-1))

#### Use a Vertex AI API key:

The Vertex AI API provides a [free tier](https://cloud.google.com/vertex-ai/generative-ai/docs/start/express-mode/overview) using express mode for Gemini 2.5 Pro, control over which model you use, and access to higher rate limits with a billing account:

1.  Generate a key from [Google Cloud](https://cloud.google.com/vertex-ai/generative-ai/docs/start/api-keys).
2.  Set it as an environment variable in your terminal. Replace `YOUR_API_KEY` with your generated key and set GOOGLE_GENAI_USE_VERTEXAI to true

    ```bash
    export GOOGLE_API_KEY="YOUR_API_KEY"
    export GOOGLE_GENAI_USE_VERTEXAI=true
    ```

3.  (Optional) Add a billing account to your project to get access to [higher usage limits](https://cloud.google.com/vertex-ai/generative-ai/docs/quotas)

For other authentication methods, including Google Workspace accounts, see the [authentication](./docs/cli/authentication.md) guide.

### Examples

Once the CLI is running, you can start interacting with Gemini from your shell.

You can start a project from a new directory:

```sh
cd new-project/
gemini-dev
> Write me a Gemini Discord bot that answers questions using a FAQ.md file I will provide
```

Or work with an an existing project:

```sh
git clone https://github.com/hermannhahn/gemini-cli
cd gemini-cli
gemini-dev
> Give me a summary of all of the changes that went in yesterday
```

### Next steps

- Explore the available **[CLI Commands](./docs/cli/commands.md)**.
- If you encounter any issues, review the **[troubleshooting guide](./docs/troubleshooting.md)**.
- For more comprehensive documentation, see the [full documentation](./docs/index.md).
- Take a look at some [popular tasks](#popular-tasks) for more inspiration.
- For details on the development workflow and contribution, consult the [WORKFLOW.md](./WORKFLOW.md).

### Troubleshooting

Head over to the [troubleshooting guide](docs/troubleshooting.md) if you're having issues.

### Popular tasks

#### Explore a new codebase

Start by `cd`ing into an existing or newly-cloned repository and running `gemini-dev`.

```text
> Describe the main pieces of this system's architecture.
```

```text
> What security mechanisms are in place?
```

#### Work with your existing code

```text
> Implement a first draft for GitHub issue #123.
```

```text
> Help me migrate this codebase to the latest version of Java. Start with a plan.
```

#### Automate your workflows

Use MCP servers to integrate your local system tools with your enterprise collaboration suite.

```text
> Make me a slide deck showing the git history from the last 7 days, grouped by feature and team member.
```

```text
> Make a full-screen web app for a wall display to show our most interacted-with GitHub issues.
```

#### Interact with your system

```text
> Convert all the images in this directory to png, and rename them to use dates from the exif data.
```

```text
> Organize my PDF invoices by month of expenditure.
```

### Uninstall

Head over to the [Uninstall](docs/Uninstall.md) guide for uninstallation instructions.

## Terms of Service and Privacy Notice

For details on the terms of service and privacy notice applicable to your use of Gemini CLI, see the [Terms of Service and Privacy Notice](./docs/tos-privacy.md).

---

## Versão em Português

Este repositório contém o **Gemini Dev CLI**, um fork pessoal do [Gemini CLI oficial](https://github.com/google-gemini/gemini-cli). Nosso objetivo é estender e personalizar a ferramenta para fluxos de trabalho de desenvolvimento específicos, mantendo a compatibilidade para futuras atualizações do projeto original.

O Gemini CLI é uma ferramenta de fluxo de trabalho de IA de linha de comando que se conecta às suas ferramentas, entende seu código e acelera seus fluxos de trabalho. Com ele, você pode:

- Query and edit large codebases in and beyond Gemini's 1M token context window.
- Generate new apps from PDFs or sketches, using Gemini's multimodal capabilities.
- Automate operational tasks, like querying pull requests or handling complex rebases.
- Use tools and MCP servers to connect new capabilities, including [media generation with Imagen,
  Veo or Lyria](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia)
- Ground your queries with the [Google Search](https://ai.google.dev/gemini-api/docs/grounding)
  tool, built into Gemini.

## Quickstart

You have two options to install Gemini CLI.

### Início Rápido

1.  **Pré-requisitos:** Certifique-se de ter o [Node.js versão 20](https://nodejs.org/en/download) ou superior instalado.
2.  **Executar o CLI:** Execute o seguinte comando em seu terminal para instalar e usar o Gemini Dev CLI:

    ```bash
    npm install -g @hahnd/gemini-dev
    ```

    Em seguida, execute o CLI de qualquer lugar:

```bash
npm install -g @google/gemini-cli
```

```bash
npm install -g @google/gemini-cli
```

Then, run the CLI from anywhere:

```bash
gemini
```

### With Homebrew

1. **Prerequisites:** Ensure you have [Homebrew](https://brew.sh/) installed.
2. **Install the CLI** Execute the following command in your terminal:

```bash
brew install gemini-cli
```

#### System Requirements

- Node.js version 20 or higher
- macOS, Linux, or Windows

## 📋 Key Features

With Gemini CLI you can:

- **Code Understanding & Generation**
  - Query and edit large codebases
  - Generate new apps from PDFs, images, or sketches using multimodal capabilities
  - Debug issues and troubleshoot with natural language
- **Automation & Integration**
  - Automate operational tasks like querying pull requests or handling complex rebases
  - Use MCP servers to connect new capabilities, including [media generation with Imagen, Veo or Lyria](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia)
  - Run non-interactively in scripts for workflow automation
- **Advanced Capabilities**
  - Ground your queries with built-in [Google Search](https://ai.google.dev/gemini-api/docs/grounding) for real-time information
  - Conversation checkpointing to save and resume complex sessions
  - Custom context files (GEMINI.md) to tailor behavior for your projects

- **🔗 GitHub Integration**
  - Use the Gemini CLI GitHub Action for automated PR reviews
  - Automated issue triage and on-demand AI assistance directly in your repositories
  - Seamless integration with your GitHub workflows

## 🔐 Authentication Options

Choose the authentication method that best fits your needs:

### Option 1: OAuth login (Using your Google Account)

**✨ Best for:** Individual developers as well as anyone who has a Gemini Code Assist License. (see [quota limits and terms of service](https://cloud.google.com/gemini/docs/quotas) for details)

**Benefits:**

- **Free tier**: 60 requests/min and 1,000 requests/day
- **Gemini 2.5 Pro** with 1M token context window
- **No API key management** - just sign in with your Google account
- **Automatic updates** to latest models

#### Start Gemini CLI, then choose OAuth and follow the browser authentication flow when prompted

```bash
gemini
```

### Common Configuration steps

3. **Pick a color theme**
4. **Authenticate:** When prompted, sign in with your personal Google account. This will grant you up to 60 model requests per minute and 1,000 model requests per day using Gemini.

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
gemini-dev
> Write me a Gemini Discord bot that answers questions using a FAQ.md file I will provide
```

Ou trabalhar com um projeto existente:

```sh
git clone https://github.com/hermannhahn/gemini-cli
cd gemini-cli
gemini-dev
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
