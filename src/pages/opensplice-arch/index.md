---
title: "Opensplice en Arch (Manjaro)"
date: "2019-03-16"
---

## Opensplice and manjaro

### Dependencias

#### Java

```bash
$ sudo pacman -Sy jdk8-openjdk
$ export JAVA_HOME=/usr/lib/jvm/default
```

#### Maven

```bash
$ sudo pacman -Sy maven
$ export M2_HOME=/opt/maven
```

#### Doxygen

```bash
$ sudo pacman -Sy doxygen
```

#### Protocol Buffer

> Referencia: [protobuf](https://github.com/protocolbuffers/protobuf/blob/master/src/README.md)

```bash
$ wget https://github.com/protocolbuffers/protobuf/archive/v2.6.1.tar.gz
$ tar -xzf protobuf-2.6.1
$ cd protobuf-2.6.1
$ wget https://github.com/google/googletest/archive/release-1.5.0.tar.gz
$ tar -xzf googletest-release-1.5.0.tar.gz
$ mv googletest-release-1.5.0 gtest
$ ./autogen.sh
$ ./configure
$ make -j4
$ make check
$ sudo make install
$ export PROTOBUF_HOME=/usr/flo/Downloads/protocol-buffer-2.6.1
```

### Instalación principal

#### Manualmente

```bash
$ bash
$ source ./configure
$ make -j4
$ make install
```

Para forzar una compilación release/debug:

```bash
source ./configure x86_64.linux-release
source ./configure x86_64.linux-dev

```

Tras compilar y generar ficheros comprimidos
en la subcarpeta `install/VC/` se encuentran los ficheros a distribuir (RTS) y los ficheros de desarrollo (HDE)

Para instalar en el equipo, seguir las instrucciones de INSTALL.txt:

1. Crear directorio donde se instalará Opensplice:

```bash
sudo mkdir -p /opt/OpenSplice/V6.9.190403OSS
```

2. Cambiar al directorio creado en paso anterior

```bash
cd -p /opt/OpenSplice/V6.9.190403OSS
```

3. Desempaquetar el archivo

```bash
tar xf OpenSplice<version>-<platform>-type>.tar
tar xf /home/flo/opensplice/install/VC/PXXX-VortexOpenSplice-7.9.190403OSS-HDE-x86_64.linux-gcc8.3.0-glibc2.29-installer.tar
```

Donde type es HDE (Host development environment) o RTS (Runtime System)

4. Abrir el archivo 'release.com' en el editor de textos favorito
5. Cambiar la cadena '@@INSTALLDIR@@' con el directorio actual donde se ha instalado opensplice
6. Guardar el archivo y cerrarlo

#### Usando PKGBUILD (arch)

Crear un paquete similar al del repositorio AUR ([enlace](https://aur.archlinux.org/cgit/aur.git/tree/PKGBUILD?h=opensplice-dds))
Tras ello, instalar dicho paquete

### Iniciar entorno

Ejecutar:

```bash
export OSPL_HOME=/opt/OpenSplice/V6.9.190403OSS/HDE/x86_64.linux
source /opt/OpenSplice/V6.9.190403OSS/HDE/x86_64.linux/release.com
```

### Iniciar entorno en qtcreator

Agregar a "Build environment"

```bash
LD_LIBRARY_PATH=/opt/OpenSplice/V6.9.190403OSS/HDE/x86_64.linux/lib
OSPL_HOME=/opt/OpenSplice/V6.9.190403OSS/HDE/x86_64.linux
OSPL_URI=file:///opt/OpenSplice/V6.9.190403OSS/HDE/x86_64.linux/etc/config/ospl.xml
PATH=/usr/bin:/home/flo/.cargo/bin:/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/lib/jvm/default/bin:/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl:/opt/OpenSplice/V6.9.190403OSS/HDE/x86_64.linux/bin
```
