---
title: "Mavlink 1.1"
date: "2018-04-24"
---

# Mavlink 1.1

## Pre-requisitos

python 3.3+

python future module

Tkinter

## Descarga de sources

Descargar última versión del repositorio oficial

```bash
$ git clone https://github.com/mavlink/mavlink.git
```

Descargar submódulos:

```bash
$ cd mavlink
$ git submodule update --init --recursive
```

## Preparación de archivos de configuración

Copiar archivos XML de mavlink en una carpeta conocida (p.e. c:\gcsmavlink)

## Generación de código desde interfaz gráfica

Copiar archivos XML de mavlink en una carpeta conocida (p.e. c:\gcsmavlink)

Lanzar la interfaz gráfica del generador de código pymavlink:

```bash
$ python -m mavgenerate
```

Completar el formulario con los siguientes datos:

- XML: `c:/gcsmavlink/mis_definiciones.xml`
- Out: `c:/gcsmavlink`
- Language: `C`
- Protocol: `1.0`
- Validate: `Checked`

Por último, pulsar el botón `Validate`

## Generación de código desde la consola de comandos

Ejecutar el comando:

```sh
python -m pymavlink.tools.mavgen --lang=C --wire-protocol=1.0 --output=c:/gcsmavlink/generated/include/mavlink/v1.0 c:/gcsmavlink/mis_definiciones.xml
```

## Copia de cabeceras en proyecto gcs

...
