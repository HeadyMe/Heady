# Heady Dev Companion for Vim

AI assistant for Vim 8.0+ — chat, explain, refactor, generate tests and docs.

## Requirements

- Vim 8.0+ (for `json_decode`)
- `curl` in PATH
- HeadyManager running

## Installation

Copy `plugin/heady.vim` to `~/.vim/plugin/` or use your plugin manager:

```vim
" vim-plug
Plug 'HeadySystems/Heady', { 'rtp': 'distribution/ide/vim' }

" In your .vimrc
let g:heady_api_endpoint = 'http://localhost:3300'
let g:heady_mode = 'hybrid'
```

## Commands & Keybindings

| Command | Key | Description |
|---------|-----|-------------|
| `:HeadyChat <msg>` | `<leader>hc` | Ask Heady anything |
| `:HeadyExplain` | `<leader>he` (visual) | Explain selected code |
| `:HeadyRefactor` | `<leader>hr` (visual) | Refactor selected code |
| `:HeadyTests` | `<leader>ht` | Generate tests |
| `:HeadyDocs` | `<leader>hd` | Generate docs |
| `:HeadyHealth` | — | Check connection |
