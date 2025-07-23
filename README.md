# Gemini Dev CLI

[![Gemini CLI CI](https://github.com/google-gemini/gemini-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/google-gemini/gemini-cli/actions/workflows/ci.yml)

![Gemini CLI Screenshot](./docs/assets/gemini-screenshot.png)

Este repositório contém o **Gemini Dev CLI**, um fork pessoal do [Gemini CLI oficial](https://github.com/google-gemini/gemini-cli). Nosso objetivo é estender e personalizar a ferramenta para fluxos de trabalho de desenvolvimento específicos, mantendo a compatibilidade para futuras atualizações do projeto original.

O Gemini CLI é uma ferramenta de fluxo de trabalho de IA de linha de comando que se conecta às suas ferramentas, entende seu código e acelera seus fluxos de trabalho. Com ele, você pode:

- Consultar e editar grandes bases de código dentro e além da janela de contexto de 1M de tokens do Gemini.
- Gerar novos aplicativos a partir de PDFs ou esboços, usando os recursos multimodais do Gemini.
- Automatizar tarefas operacionais, como consultar pull requests ou lidar com rebases complexos.
- Usar ferramentas e servidores MCP para conectar novos recursos, incluindo [geração de mídia com Imagen, Veo ou Lyria](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia).
- Fundamentar suas consultas com a ferramenta [Google Search](https://ai.google.dev/gemini-api/docs/grounding), integrada ao Gemini.

## Início Rápido

1.  **Pré-requisitos:** Certifique-se de ter o [Node.js versão 20](https://nodejs.org/en/download) ou superior instalado.
2.  **Executar o CLI:** Execute o seguinte comando em seu terminal para instalar e usar o Gemini Dev CLI:

    ```bash
    npm install -g @hahnd/gemini-dev
    ```

    Em seguida, execute o CLI de qualquer lugar:

    ```bash
    gemini-dev
    ```

3.  **Escolha um tema de cor**
4.  **Autenticar:** Quando solicitado, faça login com sua conta pessoal do Google. Isso concederá até 60 solicitações de modelo por minuto e 1.000 solicitações de modelo por dia usando o Gemini.

Você está pronto para usar o Gemini Dev CLI!

### Usar uma chave de API do Gemini:

A API Gemini oferece um nível gratuito com [100 solicitações por dia](https://ai.google.dev/gemini-api/docs/rate-limits#free-tier) usando o Gemini 2.5 Pro, controle sobre qual modelo você usa e acesso a limites de taxa mais altos (com um plano pago):

1.  Gere uma chave em [Google AI Studio](https://aistudio.google.com/apikey).
2.  Defina-a como uma variável de ambiente em seu terminal. Substitua `YOUR_API_KEY` pela sua chave gerada.

    ```bash
    export GEMINI_API_KEY="YOUR_API_KEY"
    ```

3.  (Opcional) Atualize seu projeto da API Gemini para um plano pago na página da chave da API (desbloqueará automaticamente os [limites de taxa do Nível 1](https://ai.google.dev/gemini-api/docs/rate-limits#tier-1))

### Usar uma chave de API do Vertex AI:

A API Vertex AI oferece um [nível gratuito](https://cloud.google.com/vertex-ai/generative-ai/docs/start/express-mode/overview) usando o modo expresso para o Gemini 2.5 Pro, controle sobre qual modelo você usa e acesso a limites de taxa mais altos com uma conta de faturamento:

1.  Gere uma chave em [Google Cloud](https://cloud.google.com/vertex-ai/generative-ai/docs/start/api-keys).
2.  Defina-a como uma variável de ambiente em seu terminal. Substitua `YOUR_API_KEY` pela sua chave gerada e defina GOOGLE_GENAI_USE_VERTEXAI como true

    ```bash
    export GOOGLE_API_KEY="YOUR_API_KEY"
    export GOOGLE_GENAI_USE_VERTEXAI=true
    ```

3.  (Opcional) Adicione uma conta de faturamento ao seu projeto para ter acesso a [limites de uso mais altos](https://cloud.google.com/vertex-ai/generative-ai/docs/quotas)

Para outros métodos de autenticação, incluindo contas do Google Workspace, consulte o guia de [autenticação](./docs/cli/authentication.md).

## Exemplos

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

## Tarefas populares

### Explorar uma nova base de código

Comece entrando em um repositório existente ou recém-clonado e executando `gemini-dev`.

```text
> Descreva as principais partes da arquitetura deste sistema.
```

```text
> Quais mecanismos de segurança estão em vigor?
```

### Trabalhar com seu código existente

```text
> Implemente um primeiro rascunho para o problema do GitHub #123.
```

```text
> Ajude-me a migrar esta base de código para a versão mais recente do Java. Comece com um plano.
```

### Automatizar seus fluxos de trabalho

Use servidores MCP para integrar suas ferramentas de sistema local com sua suíte de colaboração empresarial.

```text
> Crie uma apresentação de slides mostrando o histórico do git dos últimos 7 dias, agrupado por recurso e membro da equipe.
```

```text
> Crie um aplicativo web em tela cheia para um display de parede para mostrar nossos problemas mais interagidos do GitHub.
```

### Interagir com seu sistema

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