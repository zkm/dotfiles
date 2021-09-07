" Turn off silly swap files.
set noswapfile

" Leader
let mapleader = " "

" Quicker window movement
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-h> <C-w>h
nnoremap <C-l> <C-w>l

" Softtabs, 2 spaces
set tabstop=2
set shiftwidth=2
set shiftround
set expandtab

" Show ze ruler
set ruler
set textwidth=80
set colorcolumn=+1

" Numbers
set number
set numberwidth=5

" Allow the dot command in all modes
xnoremap . :norm.<CR>

" Set `jk` mapping for ESC
set timeoutlen=350
map! jk <ESC>

" CtrlP w/ FZF
nmap <c-p> :FZF<return>

" Tab completion
set wildmode=list:longest,list:full
function! InsertTabWrapper()
  let col = col('.') - 1
  if !col || getline('.')[col - 1] !~ '\k'
    return "\<tab>"
  else
    return "\<c-p>"
  endif
endfunction
inoremap <Tab> <c-r>=InsertTabWrapper()<cr>
inoremap <S-Tab> <c-n>

" Plugins
if filereadable(expand("~/.vimrc.plugs"))
  source ~/.vimrc.plugs
endif

" Enable syntax highlighting
syntax enable

" vim-test mappings
nnoremap <silent> <Leader>t :TestFile<CR>
nnoremap <silent> <Leader>s :TestNearest<CR>
nnoremap <silent> <Leader>l :TestLast<CR>
nnoremap <silent> <Leader>a :TestSuite<CR>
nnoremap <silent> <leader>gt :TestVisit<CR>

" vim-rspec mappings
let g:rspec_command = 'call Send_to_Tmux("bin/rspec {spec}\n")'
map <Leader>t :call RunCurrentSpecFile()<CR>
map <Leader>s :call RunNearestSpec()<CR>
map <Leader>l :call RunLastSpec()<CR>
map <Leader>a :call RunAllSpecs()<CR>

" Start interactive EasyAlign in visual mode (e.g. vipga)
xmap ga <Plug>(EasyAlign)
" Start interactive EasyAlign for a motion/text object (e.g. gaip)
nmap ga <Plug>(EasyAlign)

" vimrc.js
if filereadable(expand("~/.vimrc.js"))
  source ~/.vimrc.js/vimrc
endif
