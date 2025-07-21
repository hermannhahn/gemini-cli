# Short-Term Memory (STM) Feature Design

## Overview

The Short-Term Memory (STM) feature aims to provide the model with a set of tools to manage short-term memories in a structured way. These memories will be stored in a JSON file, allowing the model to efficiently add, search, and clean entries.

## Proposed Tools

The following tools have been developed as part of the STM feature:

1.  **`add_stm`**: Adds a new memory entry to the JSON file.
    - **Parameters**: `key` (string), `value` (string)
    - **Functionality**: Stores a key-value pair in the memory file.

2.  **`search_stm`**: Searches for memory entries in the JSON file.
    - **Parameters**: `query` (string, optional), `key` (string, optional)
    - **Functionality**: Allows searching memories by a general term or by a specific key. Returns up to 3 most relevant results based on keyword occurrences. This tool should be used when the model needs to recall information to understand the context or formulate a response, using descriptive keywords in the query.

3.  **`clean_stm`**: Cleans (removes) memory entries from the JSON file.
    - **Parameters**: `key` (string, optional), `all` (boolean, optional)
    - **Functionality**: Removes specific memories by key or clears all memories.

## Storage Structure

Memories will be stored in a JSON file (e.g., `stm.json`) within the user's or project's configuration directory. The format will be an array of objects, where each object represents a memory with `key`, `value`, and a timestamp.

```json
[
  {
    "key": "example_key",
    "value": "example_value",
    "timestamp": "2025-07-20T12:00:00Z"
  }
]
```

## Implementation Status

- The exact location of the `stm.json` file has been defined in `packages/core/src/utils/paths.ts`.
- The functions for reading, writing, and manipulating the JSON file have been implemented within `packages/core/src/tools/stm.ts`.
- The `add_stm`, `search_stm`, and `clean_stm` tools have been integrated into the `ToolRegistry` of the model.
- Unit and integration tests for all tools are pending development.
