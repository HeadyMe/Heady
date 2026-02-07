# Install Heady IDE Extensions

## VS Code / VS Codium

```bash
# From .vsix file (when built):
code --install-extension distribution/ide/vscode/heady-dev-companion.vsix

# Or from marketplace (when published):
code --install-extension heady.heady-dev-companion
```

**Features:** Inline completions, chat panel, explain code, refactor, write tests, generate docs, terminal integration.

## JetBrains (IntelliJ, PyCharm, WebStorm, GoLand, etc.)

```
1. Open IDE → Settings → Plugins → Install Plugin from Disk
2. Select: distribution/ide/jetbrains/heady-dev-companion.zip
3. Restart IDE
```

Or build from source:
```bash
cd distribution/ide/jetbrains
./gradlew buildPlugin
# Output: build/distributions/heady-dev-companion.zip
```

## Neovim

```lua
-- Using lazy.nvim:
{
  dir = "distribution/ide/neovim",
  config = function()
    require("heady").setup({
      api_url = "http://localhost:3300",
      keymaps = true,
    })
  end,
}

-- Or copy manually:
-- cp -r distribution/ide/neovim/lua/heady ~/.config/nvim/lua/
```

**Keymaps:** `<leader>hc` chat, `<leader>he` explain, `<leader>hr` refactor, `<leader>ht` tests.

## Sublime Text

```
1. Open Sublime → Preferences → Browse Packages
2. Copy distribution/ide/sublime/ into the Packages folder
3. Restart Sublime
```

## Visual Studio

```
1. Open Visual Studio → Extensions → Manage Extensions
2. Install from Disk: distribution/ide/visual-studio/HeadyDevCompanion.vsix
3. Restart Visual Studio
```

## Xcode

```
1. Open: distribution/ide/xcode/ in Xcode
2. Build the Source Editor Extension target
3. Enable in System Settings → Extensions → Xcode Source Editor
```

## All IDEs — Configuration

After installing, configure the Heady endpoint:

| Setting | Value |
|---------|-------|
| API URL | `http://localhost:3300` (local) or `https://api.heady.systems` (cloud) |
| API Key | Set via `HEADY_API_KEY` environment variable |
| Workspace | Your active workspace name |

---
*HeadySystems / HeadyConnection — Sacred Geometry Architecture*
