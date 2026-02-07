-- ╔══════════════════════════════════════════════════════════╗
-- ║  Heady Dev Companion — Neovim Plugin                     ║
-- ║  AI code assistant via heady-manager API                  ║
-- ╚══════════════════════════════════════════════════════════╝
--
-- Installation (lazy.nvim):
--   { "HeadySystems/heady.nvim", config = function() require("heady").setup() end }
--
-- Installation (packer):
--   use { "HeadySystems/heady.nvim", config = function() require("heady").setup() end }
--
-- Manual: copy this file to ~/.config/nvim/lua/heady.lua

local M = {}

M.config = {
  api_url = "http://localhost:3300",
  prefer_local = true,
  keymaps = {
    chat = "<leader>hc",       -- open chat split
    explain = "<leader>he",    -- explain selection
    refactor = "<leader>hr",   -- refactor selection
    tests = "<leader>ht",      -- generate tests
    docs = "<leader>hd",       -- generate docs
    complete = "<C-h>",        -- inline completion
  },
}

-- Send a message to heady-manager API
local function ask_heady(message, context, callback)
  local url = M.config.api_url .. "/api/buddy/chat"
  local body = vim.fn.json_encode({
    message = message,
    context = context or "",
    source = "neovim",
    history = {},
  })

  vim.fn.jobstart({
    "curl", "-s", "-X", "POST", url,
    "-H", "Content-Type: application/json",
    "-d", body,
  }, {
    stdout_buffered = true,
    on_stdout = function(_, data)
      if data and #data > 0 then
        local ok, result = pcall(vim.fn.json_decode, table.concat(data, "\n"))
        if ok and result then
          callback(result.reply or result.message or "No response")
        else
          callback("Error parsing response")
        end
      end
    end,
    on_stderr = function(_, data)
      if data and data[1] ~= "" then
        callback("Error: " .. table.concat(data, "\n"))
      end
    end,
  })
end

-- Get visual selection
local function get_visual_selection()
  local _, srow, scol, _ = unpack(vim.fn.getpos("'<"))
  local _, erow, ecol, _ = unpack(vim.fn.getpos("'>"))
  if srow == 0 then return "" end
  local lines = vim.api.nvim_buf_get_lines(0, srow - 1, erow, false)
  if #lines == 0 then return "" end
  lines[#lines] = string.sub(lines[#lines], 1, ecol)
  lines[1] = string.sub(lines[1], scol)
  return table.concat(lines, "\n")
end

-- Open a split with response
local function show_response(title, text)
  vim.cmd("botright vnew")
  local buf = vim.api.nvim_get_current_buf()
  vim.bo[buf].buftype = "nofile"
  vim.bo[buf].bufhidden = "wipe"
  vim.bo[buf].filetype = "markdown"
  vim.api.nvim_buf_set_name(buf, "Heady: " .. title)
  local lines = vim.split(text, "\n")
  vim.api.nvim_buf_set_lines(buf, 0, -1, false, lines)
end

-- Commands
function M.chat()
  vim.ui.input({ prompt = "Ask Heady: " }, function(input)
    if not input or input == "" then return end
    local ft = vim.bo.filetype
    local file = vim.fn.expand("%:t")
    local context = "File: " .. file .. " (filetype: " .. ft .. ")"
    ask_heady(input, context, function(reply)
      vim.schedule(function() show_response("Chat", reply) end)
    end)
  end)
end

function M.explain()
  local sel = get_visual_selection()
  if sel == "" then
    vim.notify("Select code first", vim.log.levels.WARN)
    return
  end
  ask_heady("Explain this code:\n```\n" .. sel .. "\n```", "", function(reply)
    vim.schedule(function() show_response("Explain", reply) end)
  end)
end

function M.refactor()
  local sel = get_visual_selection()
  if sel == "" then
    vim.notify("Select code first", vim.log.levels.WARN)
    return
  end
  ask_heady("Refactor this code for clarity and efficiency:\n```\n" .. sel .. "\n```", "", function(reply)
    vim.schedule(function() show_response("Refactor", reply) end)
  end)
end

function M.generate_tests()
  local sel = get_visual_selection()
  local ft = vim.bo.filetype
  local code = sel ~= "" and sel or vim.api.nvim_buf_get_lines(0, 0, -1, false)
  if type(code) == "table" then code = table.concat(code, "\n") end
  ask_heady("Generate tests for this " .. ft .. " code:\n```\n" .. code .. "\n```", "", function(reply)
    vim.schedule(function() show_response("Tests", reply) end)
  end)
end

function M.generate_docs()
  local sel = get_visual_selection()
  local ft = vim.bo.filetype
  local code = sel ~= "" and sel or vim.api.nvim_buf_get_lines(0, 0, -1, false)
  if type(code) == "table" then code = table.concat(code, "\n") end
  ask_heady("Generate documentation for this " .. ft .. " code:\n```\n" .. code .. "\n```", "", function(reply)
    vim.schedule(function() show_response("Docs", reply) end)
  end)
end

function M.health_check()
  local url = M.config.api_url .. "/api/health"
  vim.fn.jobstart({ "curl", "-s", url }, {
    stdout_buffered = true,
    on_stdout = function(_, data)
      vim.schedule(function()
        local text = table.concat(data, "")
        if text:find('"ok":true') then
          vim.notify("Heady: Connected (" .. M.config.api_url .. ")", vim.log.levels.INFO)
        else
          vim.notify("Heady: Unhealthy response", vim.log.levels.WARN)
        end
      end)
    end,
    on_stderr = function()
      vim.schedule(function()
        vim.notify("Heady: Cannot reach " .. M.config.api_url, vim.log.levels.ERROR)
      end)
    end,
  })
end

function M.setup(opts)
  M.config = vim.tbl_deep_extend("force", M.config, opts or {})

  -- Register commands
  vim.api.nvim_create_user_command("HeadyChat", M.chat, {})
  vim.api.nvim_create_user_command("HeadyExplain", M.explain, { range = true })
  vim.api.nvim_create_user_command("HeadyRefactor", M.refactor, { range = true })
  vim.api.nvim_create_user_command("HeadyTests", M.generate_tests, { range = true })
  vim.api.nvim_create_user_command("HeadyDocs", M.generate_docs, { range = true })
  vim.api.nvim_create_user_command("HeadyHealth", M.health_check, {})

  -- Register keymaps
  local km = M.config.keymaps
  vim.keymap.set("n", km.chat, M.chat, { desc = "Heady: Chat" })
  vim.keymap.set("v", km.explain, M.explain, { desc = "Heady: Explain" })
  vim.keymap.set("v", km.refactor, M.refactor, { desc = "Heady: Refactor" })
  vim.keymap.set("v", km.tests, M.generate_tests, { desc = "Heady: Tests" })
  vim.keymap.set("v", km.docs, M.generate_docs, { desc = "Heady: Docs" })

  -- Auto health check on startup
  vim.defer_fn(M.health_check, 2000)
end

return M
