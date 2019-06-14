---
title: "GDAL - Compilación"
date: "2018-11-10"
---

## Descargar binarios

> Listado de releases windows: [enlace](http://www.gisinternals.com/archive.php)

[Versión 2.2.3](http://www.gisinternals.com/query.html?content=filelist&file=release-1911-x64-gdal-2-2-3-mapserver-7-0-7.zip)

## Compilar desde fuente

### Usando visual studio

1. Descargar código fuente desde [aquí](http://download.osgeo.org/gdal/2.2.0/gdal220.zip)
2. Descomprimir
3. Abrir consola de comandos en carpeta
4. Ejecutar script: `generate_vcxproj.bat 15.0 64 gdal_vs2017`
5. Abrir gdal_vs2017.vcxproj
6. Click derecho sobre el proyecto, 'Retarget projects'
7. Compilar

> Referencia: [osgeo](https://trac.osgeo.org/gdal/wiki/GeneratingVisualStudioProject)

### Usando nmake

1. Descargar código fuente desde [aquí](http://download.osgeo.org/gdal/2.2.0/gdal220.zip)
2. Descomprimir
3. Abrir consola de comandos en carpeta
4. Compilar con comando `nmake -f makefile.vc MSVC_VER=1916 WIN64=1`
5. Instalar con comando `nmake -f makefile.vc MSVC_VER=1916 WIN64=1 install`
6. Copiar archivos de desarrollo (includes) con comando`nmake -f makefile.vc MSVC_VER=1916 WIN64=1 devinstall`
7. El resultado se instalará, por defecto, en c:\warmerda\bld

Otros parámetros que pueden ser pasados a nmake:

- GDAL_HOME: Directorio donde instalar GDAL. Prefijo que usarán todos los siguientes directorios:
  - BINDIR: Directorio donde instalar dlls
  - LIBDIR: Directorio donde isntalar gdal_i.lib
  - INCDIR: Directorio donde instalar GDAL/OGR includes
  - DATADIR: Directorio donde instalar data files

> Referencia:
>
> - [OsGeo](https://trac.osgeo.org/gdal/wiki/BuildingOnWindows)
>
> - [Pasos definidos en stackoverflow](https://stackoverflow.com/a/52453687)
>
> - [listado de versiones msvc](https://en.wikipedia.org/wiki/Microsoft_Visual_C%2B%2B)
