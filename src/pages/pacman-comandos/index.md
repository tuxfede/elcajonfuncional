---
title: "Pacman - Comandos básicos"
date: "2020-01-10"
---

## Obtener el paquete al que pertenece un archivo instalado

```bash
pacman -Qo <ruta-archivo>
pacman -Qo /mingw64/bin/gcc.exe
```



## Obtener el paquete al que pertenece un archivo no instalado

Usar `pkgfile`, perteneciente al paquete `pkgtools`

```bash
pkgfile --update
pkgfile <filename>
pkgfile libpoppler-93.dll
```