return {
  "neovim/nvim-lspconfig",
  dependencies = {
    "williamboman/mason.nvim",
    "williamboman/mason-lspconfig.nvim",
  },
  config = function()
    require("mason").setup()
    require("mason-lspconfig").setup({
      ensure_installed = {
        "lua_ls",
        "tsserver", -- still needed here for Mason to install it
        "gopls",
        "elixirls",
        "rust_analyzer",
      },
    })

    local lspconfig = require("lspconfig")

    -- tsserver is deprecated → use ts_ls in lspconfig
    local servers = {
      lua_ls = {},
      ts_ls = {}, -- the updated TypeScript/JavaScript server
      gopls = {},
      elixirls = {},
      rust_analyzer = {},
    }

    for server, opts in pairs(servers) do
      lspconfig[server].setup(opts)
    end
  end,
}
