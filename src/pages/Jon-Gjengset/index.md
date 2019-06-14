---
title: "Rust - Jon Gjengset"
date: "2019-02-01"
---

# Jon Gjengset

[canal youtube](https://www.youtube.com/watch?v=ycMiMDHopNc)

[github](https://github.com/jonhoo/configs)

## Entorno de desarrollo

arch linux

Tiling window manager: xmonad

bottom bar: jaagr/polybar

terminal: alacritty

temas: base16 chris -> atelier dune themes

shell: fish

- Abbreviaturas: .config/fish/config.fish
  - o=xdg-open
  - g=git
  - gc=git checkout
  - vimdiff=nvim -d
  - gah=git stash; and git pull -- rebase; and git stash pop'

Exa: replacement for ls in rust. color codes, human readable,

- l=exa
- ls=exa
- ll=exa -l
- lll= exa -la

tmux

editor: neovim

vimrc:

- nvim/plugged
- securemodelines
- lightline
- ale
- highlightedyank
- vim-rooter
- fzf (también en buffers)
- atajo: leader leader switch last file
- lenguageclient-neovim
- ncm2 (autocomplete)
- rg busca en todo el proyecto
- leader semicolon: :Buffers<CR>
- C-p :Files<CR>
- leader w :w<CR>
- gd: go to definition languageclient
- undodir undofile puedes deshacer incluso al volver a abrir un archivo (undo history)
- Search results centered:
  - n nzz
  - N Nzz
  - '\* \*zz'
  - '# #zz'
  - 'g* g*zz'
- cc: centra editor en linea
- ct: pone arriba; cb abajo
- xclipboard integration: ,p ,c:
  - <leader>p :read !xsel -jclipboard --output<cr>
  - <leader>c :w !xsel -ib<cr><cr>
  - <leader>s Rg search

Alternativa a gmail: fastmail

firefox:

- multi-account-containers: muchas sesiones en un único firefox
- Tabs on bottom: userChrome.css

Aprender rust:

- os-phil-opp.com (operating system in rust from scratch)

Rust language server

- Terminal setup:
  - muestra arriba os, uptime, hostname, diskusage in home, network, todos
  - autojump jump to directorio 'j tokio'

mupdf

herramienta para dibujar (estilo sketch de autodesk): [mypaint](https://github.com/mypaint/mypaint/wiki)
