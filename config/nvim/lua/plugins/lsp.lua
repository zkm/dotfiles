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
        "gopls",
        "elixirls",
        "rust_analyzer",
      },
    })

    local lspconfig = require("lspconfig")
    local configs = require("lspconfig.configs")

    local servers = {
      lua_ls = {},
      gopls = {},
      elixirls = {},
      rust_analyzer = {},
    }

    for server, opts in pairs(servers) do
      if configs[server] then
        lspconfig[server].setup(opts)
      end
    end
  end,
}
