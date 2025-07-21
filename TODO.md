# TODO List

## Short-Term Memory (STM) Feature

- [x] Define the exact location of the `stm.json` file.
- [x] Implement the functions for reading, writing, and manipulating the JSON file.
- [x] Integrate the `add_stm` and `search_stm` tools into the model's `ToolRegistry`.
- [x] Implement the `delete_stm` tool to be used by the model to remove specific entries when requested.
- [x] Implement the `clear_stm` tool to auto remove all entries older than 35 days. This tool shouldn't be used by the model. Automatically run once on session start.
- [x] Develop unit and integration tests for all tools.
- [ ] Create/Update the documentation for the STM feature.
- [ ] Ensure the STM instructions exposed to the model are clear and concise.
