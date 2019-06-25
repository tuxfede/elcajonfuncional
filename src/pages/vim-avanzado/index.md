---
title: "Comandos VIM avanzados"
date: "2018-08-30"
---

- `:file` muestra información sobre el buffer abierto actualmente
- `:buffers` muestra listao de buffers. % indica que es el actual. h indica que está oculto. a indica que está activo. # indica alternativo.
- `:ls` === buffers === `:files`
- `C-^` toggle alternate file
- `:w {filename}` guarda como pero mantiene en el buffer el archivo original
- `:saveas {file}` === `:sav` establece el nuevo archivo como buffer actual
- `:wall` Guarda todos los buffers! === `:wa :wa!`
- `:ball` === buffer all Abre una ventana por cada buffer === `:ba` ===`:sba`
- `ZZ` == `:wq`
- `ZQ` == `:q!`
- `:!` permite shell out to prorams like psql
- `:.!` forwards the output al buffer! Ejemplo: `:.! pwd`
- `g C-g` muestra información sobre el cursor (línea x de xx, palabra y de z, etc.)
- `:bprev :bnext` permiten moverte por los buffers (se pueden crear alias [b y ]b)
- `C-o y C-i` permiten saltar atrás y adelante.
- `:!mkdir path` crea directorio.

* `*` siguiente ocurrencia de palabra bajo cursor
* `#` anterior ocurrencia de palabra bajo cursor
* `:%s/foo/bar/g` cambia foo por bar en todo el documento. g === global (todas las ocurrencias de la cad línea)
* `:%s/foo/bar/gc` igual, pero pide confirmación
* `:s/foo/bar/g` cambia foo por bar en la línea actual
* `:noh` Desactiva highlighthing hasta la siguiente búsqueda. Más info: http://vim.wikia.com/wiki/Search_and_replace
* `dtc` borra hasta el caracter 'c' sin incluirlo
* `dfc` borra hasta el caracter c incluyéndolo en sentido contrario: dTc dFc

> Referencias: [Learning vim in 2014](https://benmccormick.org/learning-vim-in-2014/)
