# Short-Term Memory (STM) Tools

This document describes the `add_memory` and `search_memory` tools for the Gemini CLI, which allow for the management of short-term conversational memory.

## `add_memory`

### Description

Use `add_memory` to add a new entry to the Short-Term Memory (STM) file. This tool is useful for storing important information, such as user preferences, conversation context, or project-specific details, especially when explicitly asked by the user or when crucial for maintaining context across sessions.

### Arguments

`add_memory` takes one argument:

- `content` (string, required): The content of the STM entry to be stored. This should be a clear and concise piece of information.

### Usage

```
add_memory(content="Your memory content here.")
```

### Examples

Remember a user's preference for a specific programming language:

```
add_memory(content="The user's preferred programming language is Python.")
```

Store a key detail from the current conversation:

```
add_memory(content="The user asked to refactor the 'auth' module.")
```

## `search_memory`

### Description

Use `search_memory` to search for relevant entries in the Short-Term Memory (STM) file. This tool should be used when the model needs to recall information to understand the current context or formulate a response. It retrieves up to 3 of the most relevant memories based on the provided query or a specific ID.

### Arguments

`search_memory` takes one of the following arguments:

- `query` (string, optional): A general query to search for in STM entries. Use descriptive keywords to find the most relevant memories.
- `id` (string, optional): A specific ID to search for in a particular STM entry.

### Usage

Search by query:

```
search_memory(query="user's preferred language")
```

Search by ID:

```
search_memory(id="a_specific_memory_id_12345")
```

### Examples

Recall a previously stored user preference:

```
search_memory(query="user's favorite color")
```

Retrieve a specific memory by its ID:

```
search_memory(id="f8d7e6c5-b4a3-2109-8765-43210fedcba9")
```

## `delete_memory`

### Description

Use `delete_memory` to remove a specific entry from the Short-Term Memory (STM) file by its ID. This tool is useful for managing the memory by removing outdated or irrelevant entries.

### Arguments

`delete_memory` takes one argument:

- `id` (string, required): The ID of the STM entry to be deleted.

### Usage

```
delete_memory(id="a_specific_memory_id_12345")
```

### Examples

Delete a memory entry with a known ID:

```
delete_memory(id="f8d7e6c5-b4a3-2109-8765-43210fedcba9")
```

## `clear_stm`

### Description

Use `clear_stm` to remove entries from the Short-Term Memory (STM) file that are older than 35 days based on their `viewed_at` timestamp. This tool is primarily for maintenance and should not be directly invoked by the model. It is designed to be run automatically to manage memory size and relevance.

### Arguments

`clear_stm` does not take any arguments.

### Usage

```
clear_stm()
```

### Examples

Clear old memory entries:

```
clear_stm()
```

## Comportamento de Supressão de Status

As ferramentas STM (`add_memory`, `search_memory`, `delete_memory`) foram projetadas para controlar a exibição de mensagens de status no terminal com base na variável de ambiente `STM_SHOW_STATUS`.

- Quando `STM_SHOW_STATUS` é definido como `TRUE`, as mensagens de status são exibidas no terminal.
- Quando `STM_SHOW_STATUS` não é definido (ou definido para qualquer outro valor), as mensagens de status são suprimidas no terminal.

É importante notar que o `llmContent` (o conteúdo retornado ao modelo de IA) **nunca é suprimido**, independentemente do valor de `STM_SHOW_STATUS`. Isso garante que o modelo sempre receba o resultado completo da operação para processamento e tomada de decisão, enquanto a exibição para o usuário final pode ser controlada para uma experiência mais limpa.
