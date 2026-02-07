# Heady Dev Companion for Emacs

AI code assistant for Emacs — chat, explain, refactor, generate tests and docs.

## Requirements

- Emacs 27.1+
- `request.el` package
- HeadyManager running (local or cloud)

## Installation

```elisp
;; Add to load-path
(add-to-list 'load-path "/path/to/distribution/ide/emacs")
(require 'heady)

;; Configure
(setq heady-api-endpoint "http://localhost:3300")
(setq heady-mode "hybrid")  ; "local", "hybrid", or "cloud"

;; Optional keybindings
(global-set-key (kbd "C-c h c") 'heady-chat)
(global-set-key (kbd "C-c h e") 'heady-explain-region)
(global-set-key (kbd "C-c h r") 'heady-refactor-region)
(global-set-key (kbd "C-c h t") 'heady-generate-tests)
(global-set-key (kbd "C-c h d") 'heady-generate-docs)
```

## Commands

| Command | Keybinding | Description |
|---------|-----------|-------------|
| `heady-chat` | `C-c h c` | Ask Heady anything |
| `heady-explain-region` | `C-c h e` | Explain selected code |
| `heady-refactor-region` | `C-c h r` | Refactor selected code |
| `heady-generate-tests` | `C-c h t` | Generate tests |
| `heady-generate-docs` | `C-c h d` | Generate documentation |
| `heady-health-check` | — | Check HeadyManager status |
