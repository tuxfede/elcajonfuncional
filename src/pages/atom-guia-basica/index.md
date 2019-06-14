---
title: "Atom - Guía básica"
date: "2019-05-05"
---

# Guía básica Atom

## Descarga

https://atom.io/download/windows_x64
Junto con atom, se instalará la herramienta de consola atom packaget manager (apm)

## Listado de paquetes:

apm list

## Exportar listado de paquetes

λ apm list --installed --bare > packages.list

## Importar listado de paquetes

apm install --packages-file packages.list

## Instalación de paquetes más comunes

- atom-beautify -> Mejora la presentación de ficheroes html, css, javascript, etc
- atom-ternjs -> code intelligence con tern (soporte para es5, es6, es7, node, angular, etc)
- autoclose-html -> Cierra etiquetas html
- autocomplete-modules -> Autocompletado de modulos javascript (require/import)
- auto-detect-indentation -> Detecta indentación automáticamente
- auto-update-packages -> [os x]los paquetes se actualizan instantáneamente
- auto-update-plus -> [os independent] alternativa a auto-update-packages
- color-picker -> obtiene color
- editorconfig -> mantiene consistencia en el estilo de codificación entre editores. Para ello, creas un archivo con la configuración, y atom avisa si estás usando una distinta.
- emmet -> soporte de emmet (expande abreviaturas html, etc)
- file-icons -> colorea los ficheros según su extensión en la barra de explorador lateral
- highlight-selected -> dolble click en una palabra resalta todas las coincidencias en el archivo
- language-babel -> detecta la gramatica de es2016, jsx, etc. Además, indenta jsx, trasnspila babel al guardar (opcional), etc.
- linter -> linter básico
- linter-eslint -> interfaz a eslint
- open-recent -> agrega opciones open recent
- pigments -> muestra colores directamente en proyectos y archivos
- platformio-ide-terminal -> abre un terminal en atom (control-` o click en status bar))
- synced-sidebar -> sincroniza sidebar y pestañas
- tabs-to-spaces -> permite convertir un fichero con espacios a tabuladores y viceversa
- tasks -> documento para listar tareas
- toggle-quotes -> cambia de comillas simples a dobles
- todo-show -> muestra todos en proyecto
- tool-bar -> permite crear barras laterales con accesos directos
- vim-mode-plus -> vim en atom

Última lista actualizada:

```bash
apm install atom-beautify
apm install highlight-selected
apm install autocomplete-modules
apm install autoclose-html
apm install language-babel
apm install linter-eslint
apm install open-recent
apm install todo-show
apm install pigments
apm install tool-bar
apm install file-icons
```

## Temas

one dark
one light
isotope
atom material

## Accesos directos

control+p sirve para buscar archivos yf uncionalidades
Multiple cursors: dejar pulsado control y hacer
click en todos los lugares donde secribir
click en todos los lugares donde secribir
edit-> lines -> autoindetn
control shift d duplica linesas
control arriba/abajo mueve linea actual
control / comenta descomenta
