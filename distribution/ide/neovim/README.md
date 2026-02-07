# Heady Dev Companion for Neovim

AI code assistant with completions, chat, refactors, agents, and voice input.

## Installation

### lazy.nvim
```lua
{
  "HeadySystems/heady.nvim",
  config = function()
    require("heady").setup({
      api_endpoint = "http://localhost:3300",
      mode = "hybrid",
      inline_completions = true,
    })
  end,
}
```

### packer.nvim
```lua
use {
  "HeadySystems/heady.nvim",
  config = function()
    require("heady").setup()
  end,
}
```

## Keymaps (defaults)

| Key | Action |
|-----|--------|
| `<leader>hc` | Open Chat |
| `<leader>he` | Explain Selection (visual) |
| `<leader>hr` | Refactor Selection (visual) |
| `<leader>ht` | Generate Tests |
| `<leader>hd` | Generate Docs |
| `<leader>hf` | Fix Error |
| `<leader>ha` | Agent Mode |
| `<leader>hv` | Voice Input |

## Commands

`:HeadyChat`, `:HeadyExplain`, `:HeadyRefactor`, `:HeadyTests`, `:HeadyDocs`, `:HeadyFix`, `:HeadyAgent`, `:HeadyVoice`, `:HeadyLogin`
