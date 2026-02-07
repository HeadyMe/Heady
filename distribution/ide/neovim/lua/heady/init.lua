-- Heady Dev Companion for Neovim
-- AI code assistant: completions, chat, refactors, agents, voice
-- Sacred Geometry Architecture

local M = {}

M.config = {
  api_endpoint = "http://localhost:3300",
  mode = "hybrid", -- "local", "hybrid", "cloud"
  inline_completions = true,
  voice_enabled = false,
  auto_approve_safe = false,
  keymaps = {
    chat = "<leader>hc",
    explain = "<leader>he",
    refactor = "<leader>hr",
    tests = "<leader>ht",
    docs = "<leader>hd",
    fix = "<leader>hf",
    agent = "<leader>ha",
    voice = "<leader>hv",
  },
}

function M.setup(opts)
  M.config = vim.tbl_deep_extend("force", M.config, opts or {})

  -- Register commands
  vim.api.nvim_create_user_command("HeadyChat", function() require("heady.chat").open() end, {})
  vim.api.nvim_create_user_command("HeadyExplain", function() require("heady.actions").explain() end, { range = true })
  vim.api.nvim_create_user_command("HeadyRefactor", function() require("heady.actions").refactor() end, { range = true })
  vim.api.nvim_create_user_command("HeadyTests", function() require("heady.actions").generate_tests() end, {})
  vim.api.nvim_create_user_command("HeadyDocs", function() require("heady.actions").generate_docs() end, {})
  vim.api.nvim_create_user_command("HeadyFix", function() require("heady.actions").fix() end, {})
  vim.api.nvim_create_user_command("HeadyAgent", function() require("heady.agent").start() end, {})
  vim.api.nvim_create_user_command("HeadyVoice", function() require("heady.voice").toggle() end, {})
  vim.api.nvim_create_user_command("HeadyLogin", function() require("heady.auth").login() end, {})

  -- Register keymaps
  local km = M.config.keymaps
  vim.keymap.set("n", km.chat, ":HeadyChat<CR>", { silent = true, desc = "Heady: Open Chat" })
  vim.keymap.set("v", km.explain, ":HeadyExplain<CR>", { silent = true, desc = "Heady: Explain Selection" })
  vim.keymap.set("v", km.refactor, ":HeadyRefactor<CR>", { silent = true, desc = "Heady: Refactor Selection" })
  vim.keymap.set("n", km.tests, ":HeadyTests<CR>", { silent = true, desc = "Heady: Generate Tests" })
  vim.keymap.set("n", km.docs, ":HeadyDocs<CR>", { silent = true, desc = "Heady: Generate Docs" })
  vim.keymap.set("n", km.fix, ":HeadyFix<CR>", { silent = true, desc = "Heady: Fix Error" })
  vim.keymap.set("n", km.agent, ":HeadyAgent<CR>", { silent = true, desc = "Heady: Agent Mode" })

  -- Setup inline completions if enabled
  if M.config.inline_completions then
    require("heady.completion").setup(M.config)
  end
end

return M
