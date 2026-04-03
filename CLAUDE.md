# CLAUDE.md

## Tool Management

This project uses **mise** to manage Python versions. Do NOT install Python globally — use the version pinned in `.mise.toml`.

### Key commands

- `mise run install` — install the package and dependencies
- `mise run test` — run tests with pytest
- `mise run lint` — run linters (ruff + black)
- `mise run lint-fix` — auto-fix linting issues
- `mise run ci` — full pipeline (lint + test)

### Rules

- Run `mise run ci` after any code change to validate.
- When adding dependencies, update the package config (pyproject.toml, setup.py, etc.).
