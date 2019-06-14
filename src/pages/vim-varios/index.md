---
title: "VIM - Varios"
date: "2018-08-29"
---

## Comandos útiles

Formato de comandos:
<number><command><text object or motion>

Objetos
[w]ord aw == a word iw == inner word
[s]entence
[p]aragraph
[a"] a double quotted string
[a'] a single quoted string
[i"] inner double quotted string
[i'] inner double quoted string
[a)] a parenthesized block
[i)] inner parenthesized block
[a]] a bracketed block
[i]] inner bracketed block
[a}] a brace block === aB
[i}] inner brace block === iB
[at] a tag block
[it] inner tag block
[a>] a single tag
[i>] inner single tag

MODES:
[Esc] Go to default mode
[i]nsert mode before cursos
[a]fter insert mode after cursor
[I]nsert mode at start of line
[A] insert mode at end of line
[o] new line above
[v]isual

INSERT MODE
[CONTROL]+O Ejecuta un único comando y vuelve al modo INSERTAR
[CONTROL]+R " Pega último elemento copiado

VISUAL MODE
[i"][in]side selecciona el interior del segundo parámetro
[a'][a]round selecciona el envoltorio y el interior del segundo parámetro

DEFAULT MODE
[:e filename] open filename
[:w] write file
[:w filename] write as filename
[:sav filename] write as filename and open buffer
[:sh] run shell until exit
[:!comando] Run command
[y]ank Copy (tirar)
[p]aste Paste
[d]elete (dd to delete line)
[c]hange Change and delete
[u]ndo undo
[CONTROL]+R redo
[.] repeat command
[CONTROL]+W W change window

Movimientos:
[e]nd of current word
[b]eginning of current word
[w]ord begginng of next word
[^] first non white character
[0] start of line
[$] end of line
[CONTROL]+F foreward page
[CONTROL]+B backward page
[gg] go to top
[G] go to eof
[gd] go to local declaration of variable/function
[gD] go to global declaration of variable/function
[:100] Go to line 100
[%] Go to next block delimiter

Marcadores:
[ma] set marker named 'a'
['a] go to marker a

Indent
[>>][<<]

PLUGINS
Plugin ctrlp: Asignar ,c
Plugin surround: cambiar " por ', etc.
Plugin syntastic: análisis junto con tern, eslint, etc.

# Instalación windows vim 8.1

Descargar de web oficial gvim 8.1

crear variable de entorno: \$HOME=c:/Users/flo

En Home, crear \_vimrc

## Comprobar estado en neovim

- `:CheckHealth`.

## Integrar neovim en qtcreator

[enlace github](https://github.com/sassanh/qnvim)

## Diferencias neovim y vim

[enlace pdf](https://vimconf.org/2018/slides/Differences_between_Nvim_and_Vim_in_5_minutes.pdf)

## Interfaces gráficas neovim

[neovim-gtk](https://github.com/daa84/neovim-gtk)

## Depurar:

export NVIM_PYTHON_LOG_FILE=c:\tmp\log

export NVIM_PYTHON_LOG_LEVEL=DEBUG

## configurar python3

En init.vim:

```
" Neovim setup
let g:python3_host_prog = 'C:\Python37-32\python.exe'
set clipboard+=unnamedplus
```

# Configuración neovim

## Compatibilidad cmder

cmder-settings-startup-environment: set TERM=xterm-256color

> Referencia: [enlace](https://jdhao.github.io/2018/11/15/neovim_configuration_windows/)

## Vimrc

vimrc en neovim se llama init.vim.

localizado en

Windows: ~/AppData/Local/nvim/init.vim

Unix: ~/.config/nvim/init.vim

o en la ruta definida por \$XDG_CONFIG_HOME/nvim/init.vim

## plugins

los plugins se cargarán en la carpeta ~/AppData/Local/nvim/autoload

### gestor de paquetes

Windows. En powershell:

```bash
md ~\AppData\Local\nvim\autoload
$uri = 'https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'
(New-Object Net.WebClient).DownloadFile(
  $uri,
  $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath(
    "~\AppData\Local\nvim\autoload\plug.vim"
  )
)
```

En nvim.init:

```
call plug#begin()
" Introducir aquí plugins
call plug#end()
```

Algunos plugins requieren if_python3.

Para ello:

```
// Si en vim :echo has("python3") == 0:
pip3 install --user pynvim
```

Para instalar plugins:

```:PlugInstall

:PlugInstall
:PlugUpgrade
:PlugClean
:PlugStatus
:PlugDiff (D)
```

### Autocompletado c++

1. Instalar autocomlete engine (deoplete) usando vim-plug
2. Instalar LanguageCliente-neovim para poder conectar a LanguageServers
3. Configurar deoplete para que, para cada lenguaje, use como fuente Language cliente
4. Configurar language client para que use el language server adecuado

Primero, instalar deoplete (autocomplete engine). Para ello:

- Installar pynvim

- en init.vim, entre call plug#begin() y call plug#end():

  ```
  " Deoplete - completion framework
  Plug 'Shougo/deoplete.nvim', { 'do': ':UpdateRemotePlugins' }
  let g:deoplete#enable_at_startup = 1
  let g:deoplete#enable_refresh_always = 1
  let g:deoplete#enable_ignore_case = 1
  let g:deoplete#enable_smart_case = 1
  let g:deoplete#enable_camel_case = 1
  let g:deoplete#file#enable_buffer_path = 1
  set omnifunc=syntaxcomplete#Complete
  set completeopt=longest,menuone,preview,noinsert

  ```

Despues, instalar language server para cada lenguaje

```
LanguageClient
Plug 'autozimu/LanguageClient-neovim', {
    \ 'branch': 'next',
    \ 'do': 'powershell -executionpolicy bypass -File install.ps1',
    \ }

" (Optional) Multi-entry selection UI.
Plug 'junegunn/fzf'
" Required for operations modifying multiple buffers like rename.
set hidden
let g:LanguageClient_serverCommands = {
    \ 'cpp': ['clangd'],
    \ }
nnoremap <F5> :call LanguageClient_contextMenu()<CR>
" Or map each action separately
nnoremap <silent> K :call LanguageClient#textDocument_hover()<CR>
nnoremap <silent> gd :call LanguageClient#textDocument_definition()<CR>
nnoremap <silent> <F2> :call LanguageClient#textDocument_rename()<CR>
```

Para lanzar autocompletado (omnicomplete):

- c-x en insert mode

- c-x c-o rellena la lista definida en la variable omnifunc

  - navegar con c-n c-p
  - seleccionar con c-y
  - Mejoras: [enlace](http://vim.wikia.com/wiki/Make_Vim_completion_popup_menu_work_just_like_in_an_IDE)

- c-x c-f file completion

- c-x c-l line completion

\*

#### clang format

https://github.com/rhysd/vim-clang-format

## alternativa a fzf:

https://github.com/jhawthorn/fzy

## temas vim airline

https://github.com/vim-airline/vim-airline/wiki/Screenshots

### fuentes compatibles con airline:

https://powerline.readthedocs.io/en/master/installation.html#patched-fonts

## Configuraciones (dotfiles) populares

https://github.com/thoughtbot/dotfiles

# Algunas configuraciones útgiles

https://gregjs.com/vim/2016/configuring-the-deoplete-asynchronous-keyword-completion-plugin-with-tern-for-vim/

https://afnan.io/2018-04-12/my-neovim-development-setup/

https://gitlab.com/snippets/25691

https://github.com/sheerun/vimrc

https://hackernoon.com/5-vim-plugins-i-cant-live-without-for-javascript-development-f7e98f98e8d5

https://github.com/Shougo/shougo-s-github/blob/master/vim/rc/plugins/deoplete.rc.vim
