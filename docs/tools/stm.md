# Short-Term Memory (STM) Tools

This document describes the `add_stm` and `search_stm` tools for the Gemini CLI, which allow for the management of short-term conversational memory.

## `add_stm`

### Description

Use `add_stm` to add a new entry to the Short-Term Memory (STM) file. This tool is useful for storing important information, such as user preferences, conversation context, or project-specific details, especially when explicitly asked by the user or when crucial for maintaining context across sessions.

### Arguments

`add_stm` takes one argument:

- `content` (string, required): The content of the STM entry to be stored. This should be a clear and concise piece of information.

### Usage

```
add_stm(content="Your memory content here.")
```

### Examples

Remember a user's preference for a specific programming language:

```
add_stm(content="The user's preferred programming language is Python.")
```

Store a key detail from the current conversation:

```
add_stm(content="The user asked to refactor the 'auth' module.")
```

## `search_stm`

### Description

Use `search_stm` to search for relevant entries in the Short-Term Memory (STM) file. This tool should be used when the model needs to recall information to understand the current context or formulate a response. It retrieves up to 3 of the most relevant memories based on the provided query or a specific ID.

### Arguments

`search_stm` takes one of the following arguments:

- `query` (string, optional): A general query to search for in STM entries. Use descriptive keywords to find the most relevant memories.
- `id` (string, optional): A specific ID to search for in a particular STM entry.

### Usage

Search by query:

```
search_stm(query="user's preferred language")
```

Search by ID:

```
search_stm(id="a_specific_memory_id_12345")
```

### Examples

Recall a previously stored user preference:

```
search_stm(query="user's favorite color")
```

Retrieve a specific memory by its ID:

```
search_stm(id="f8d7e6c5-b4a3-2109-8765-43210fedcba9")
```

## `delete_stm`

### Description

Use `delete_stm` to remove a specific entry from the Short-Term Memory (STM) file by its ID. This tool is useful for managing the memory by removing outdated or irrelevant entries.

### Arguments

`delete_stm` takes one argument:

- `id` (string, required): The ID of the STM entry to be deleted.

### Usage

```
delete_stm(id="a_specific_memory_id_12345")
```

### Examples

Delete a memory entry with a known ID:

```
delete_stm(id="f8d7e6c5-b4a3-2109-8765-43210fedcba9")
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
