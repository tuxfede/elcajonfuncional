---
title: "Neovim básico"
date: "2018-06-10"
---



# Neovim

## Instalación

Fichero .zshrc

```bash
# vim8
export VIMCONFIG=~/.vim
export VIMDATA=~/.vim

# neovim
export VIMCONFIG=~/.config/nvim
export VIMDATA= ~/.local/share/nvim
```

```bash
# use Neovim instead of vim or vi
alias vim=nvim
alias vi=nvim

#neovim as preferred editor
export VISUAL=nvim 
```



Windows: 

Crear Variables de entorno:

```bash
VIMCONFIG=%userprofile%\AppData\Local\nvim\
VIMDATA=%userprofile%\AppData\Local\nvim\
```

Tras ello, usar msys2 shell para ejecutar los compandos:

Configurar neovim para que carge configuración de vim. 

```bash
mkdir -p $VIMCONFIG/pack/bundle/start
mkdir -p $VIMDATA/undo
```

En fichero $VIMCONFIG/init.vim

```bash
set runtimepath^=~/.vim runtimepath+=~/.vim/after
let &packpath = &runtimepath
source ~/.vim/vimrc
```



Habilitar python para permitir plugins python.

```
pip3 install --upgrade neovim
```



Validar instalación de provider

```
:py3 print('hello')
```



Actualizar python

```
python -m pip3 install --upgrade pip3
```



Habilitar neovim-remote

```
pip3 install --upgrade neovim-remote
nvr -h
```



## Plugins

### Definiciones

- Package: directorio que contiene uno o más plugins.
- plugin: directorio que contiene uno o más scripts
- script: archivo que contiene instrucciones escritas en python

### Instalación de scripts en vim

```
#Hello.vim
function! SayHello()
   echo 'Hello world'
endfunction
command! Hello call SayHellow()
nnoremap Q :Hello<CR>

#En vim
:source hello.vim
:Hello
```



### Crear plugin

carpetas:

demo-plugin

​    doc

​        demo.txt

​    plugin

​        demo.vim

Instalar un directorio === agregarlo a runtimepath



### Crear paquetes

Un paquete es un directorio que contiene uno o más plugins:

$VIMCONFIG/pack

El paquete debe contener un subdirectorio llamado start, donde se instalarán los plugins que se quieren cargar al inicio:

Al arrancar, vim busca en $VIMCONFIG/pack/*/start/

Al instalar un plugin nuevo: :helptags



### Instalr plugin vim-unimpaired

Agrega muchas combinaciones de teclas útiles

https://github.com/tpope/vim-unimpaired

```
mkdir -p $VIMCONFIG/pack/bundle/start
cd $VIMCONFIG/pack/bundle/start
git clone https://github.com/tpope/vim-unimpaired.git 
```

Para cargar la ayuda, desde nvim:

```
:helptags ALL
:help unimpaired
```



### Plugins opcionales

```
mkdir -p $VIMCONFIG/pack/bundle/opt
cd $VIMCONFIG/pack/bundle/opt
git clone https://github.com/tpope/vim-scriptease.git 
```

Desde vim:

```
:echo join(split(&runtimepath, ','), "\n")
:packadd vim-scriptease
:echo join(split(&runtimepath, ','), "\n")
```



### Actualizar plugins

#### Opción 1:

git pull

#### Opción 2:

plugin para gestionar plugins:"minpac"

```
 mkdir -p $VIMCONFIG/pack/minpac/opt
  cd $VIMCONFIG/pack/minpac/opt
   git clone https://github.com/k-takata/minpac.git 
```

CArgarlo al iniciar:

windows:

```
vim $VIMCONFIG/init.vim
packadd minpac
call minpac#init()
```

linux

```
vim ~/.vimrc
packadd minpac
call minpac#init()
```

en ambos

```
:source % 
:echo join(split(&runtimepath, ','), "\n") 
```

Uso de minpac:

```
vim $VIMCONFIG/init.vim
call minpac#add('tpope/vim-unimpaired')
call minpac#add('tpope/vim-scriptease', {'type': 'opt'})
call minpac#add('k-takata/minpac', {'type': 'opt'})
```

Para actualizar paquetes, desde nvim

 ```
:call minpac#update()
:messages
 ```

Tras ello, reiniciar nvim para que se carguen.

Para eliminar plugins, borrarlos de init.vim y ejecutar desde nvim:

```
q:call minpac#clean()
```

Accesos directos en init.vim:

```
command! PackUpdate call minpac#update()
command! PackClean call minpac#clean()
```



## Gestión de archivos

#### fuzzy finder

instalar aplicación fzf:

Windows 

```
scoop install fzf
```

Agregar paquete con minpac:

```
call minpac#add('k-takata/minpac', {'type': 'opt'})
```

Instalar

```
:PackUpdate
```

Lanzar

```
:FZF
```

Salir

```
<C-c>
```

Sugerencia: crear acceso directo en vimrc

```
nnoremap <C-p> :<C-u>FZF<CR>
```

Como usarlo:

1. escribir caracteres que aparezcan en el mismo orden en el nombre del archivo
2. <CR> para aceptar
3. <C-c> cancelar
4. <C-x> divide horizontalmente
5. <C-t> en nueva pestaña
6. <C-v> para abrir dividido verticalmente
7. <C-k> y <C-j> para seleccionar entre resultados

Hacer que fzf no busque en archivos ignorados por .gitignore: 

export FZF_DEFAULT_COMMAND='git ls-files'

alternativa: ripgrep (scoop install ripgrep)

export FZF_DEFAULT_COMMAND='rg --files'

(crear variable de entorno sin comillas)



Fzf también permite gestionar buffers, históricos, etc!!

Para ello, usar el otro plugin https://github.com/junegunn/fzf.vim

(agregar a minpac)



#### Projectionits

Permite agrupar archivos en base a un 'concepto' y asignarles una etiqueta. Por ejemplo: todos los archivos de. Por ejemplo, todos los archivos que contengan la cadena 'model' estarán asociados a la etiqueta 'model'. De esta forma, podremos buscar abrir archivos que cumplen con la etiqueta.

Repositorio para  minpac:

```
tpope/vim-projectionist
```

fichero de configuración: .projections.json

```
{
    "app/app.js":          { "type": "main" },
    "app/models/*.js":     { "type": "model" },
	"app/adapters/*.js":   { "type": "adapter" },
	"src/data/ui/*/ui.js": { "type": "ui" }
}
```

Listado de comandos:

```
Command
Opens the specified type in the current window :Etype
Opens the specified type in a horizontal split :Stype
Opens the specified type in a vertical split :Vtype
Opens the specified type in a new tabpage :Ttype
```

Ejemplo (se puede usar Tab para autocompletar)

```
:Tmain
:Vmodel comment
```





#### Cambiar a archivo .h/cpp/test usando el plugin projectionist

```
tpope/vim-projectionist
```

En carpeta raíz del proyecto, crear

.projections.json

```
{
    app/models
}
```



