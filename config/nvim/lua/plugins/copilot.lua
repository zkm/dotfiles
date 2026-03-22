return {
  "github/copilot.vim",
  lazy = false,
  cmd = "Copilot",
  config = function()
    -- Keep Tab for nvim-cmp and use Ctrl-l to accept Copilot suggestions.
    vim.g.copilot_no_tab_map = true
    vim.keymap.set("i", "<C-l>", 'copilot#Accept("\\<CR>")', {
      expr = true,
      replace_keycodes = false,
      silent = true,
    })
  end,
}
