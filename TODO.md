# TODO List

## Short-Term Memory (STM) Feature

- [x] Define the exact location of the `stm.json` file.
- [x] Implement the functions for reading, writing, and manipulating the JSON file.
- [x] Integrate the `add_stm` and `search_stm` tools into the model's `ToolRegistry`.
- [x] Implement the `delete_stm` tool to be used by the model to remove specific entries when requested.
- [x] Implement the `clear_stm` tool to auto remove all entries older than 35 days. This tool shouldn't be used by the model. Automatically run once on session start.
- [x] Develop unit and integration tests for all tools.
- [x] Create/Update the documentation for the STM feature.
- [x] Ensure the STM instructions exposed to the model are clear and concise.
- [ ] Testar a funcionalidade de pesquisa e visualização de memórias após a correção da supressão de saída da ferramenta `search_stm`, garantindo que o resultado da pesquisa retorne para o modelo de IA (`llmContent`) mesmo quando o status de exibição (`returnDisplay`) estiver suprimido.
- [ ] Investigate complete suppression of tool name and description display in the terminal when `STM_SHOW_STATUS` is false, without affecting `llmContent`.
