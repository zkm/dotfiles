set number
set mouse=a
set splitbelow
set splitright
set ignorecase
set smartcase
set incsearch
set hlsearch
set updatetime=300
set signcolumn=yes

if has('termguicolors')
  set termguicolors
endif

if has('clipboard')
  set clipboard=unnamedplus
endif

if exists('*plug#begin') && filereadable(expand('$HOME/.vimrc.plugs'))
  source $HOME/.vimrc.plugs
endif

