---
title: "Bibliotecas Compartidas"
date: "2019-04-22"
---

## TL;DR

> Referencias:
>
> - [Explicación RPATH](https://flameeyes.blog/2010/06/20/the-why-and-how-of-rpath/)

Cuando se usa dynamic linking, el sistema operativo necesita conocer dónde buscar las librerías que el ejecutable usa.

Para ello, el s.o. hace uso de variables del PATH, ficheros de configuración, etc.

Por ejemplo, en windows la variable PATH se usa para encontrar comandos y librerías, así como el mismo directorio donde se encuentra el ejecutable.

En linux, en cambio, los comandos (ejecutables) y las librerías usan diferentes directorios. Además, el directorio del ejecutable no es un directorio de búisqueda por defecto. El 'GNU/Linux Loader' (glibc) se comporta de forma diferente de otros loaders (como el de windows, o Sun)

En sistemas Linux genéricos, ell listado de paths donde buscar se definen en `/etc/ld.so.conf`. A dicha lista se agregan 'prepend' los directorios enumerados en `LD_LIBRARY_PATH`

Existe una segunda variable, `LIBRARY_PATH`, con la que gcc le dice al linker donde buscar librerías en tiempo de compilación.

Qué sucede con librerías privadas, que no queremos instalar en directorios genéricos? Si las instalamos en directorios genéricos, el linker podría encontrar dichas librerías en tiempo de compilación incluso cuando no es lo que queremos. ADemás, el directorio genérico se puede llenar de librerías y funcionar más lentamente.

Para solucionarlo, se suelen instalar las librerías en un subdirecotrio específico al paquete. Aunque este subdirectorio se puede agreagr al path local, no es una solución aconsejada pues expondríamos la librería a todo el s.o. y además agregaríamos nuevas rutas en las que el s.o tendría que buscar siempre cualquier librería. Como alternativa, se usan 'runpath' en primer lugar y 'rpath'

En el ejecutable, en los atributos '.dynamic', existe un atributo llamado `DT_RPATH` que proporciona otras rutas donde buscar. Esta lista definida en DT_RPATH se inserta entre la variable de entorno LD_LIBRARY_PATH y la lista de /etc/ld.so.conf. En `DT_RPATH` pueden existir dos casos especiales: `$ORIGIN` que hace referencia al path del directorio donde se encuentra el objeto, y `.` o `vacío` que indican el directorio de trabajo actual (también llamado insecure rpath)

Aunque la solución de rpath no es la panacea, tiene ventajas especialmente durante la fase de desarrollo

Para crear una entrada RPATH, basta con decirle al linker (no al compilador): `LDFLAGS=-Wl,-rpath,/home/fede/lib/.libs`. Con dicho parámetro, se compila y ejecuta contra dicha versión específica.

Qué sucede con binarios ya lincados? Podemos editar su RPATH? Existe una herramienta llamada `chrpath` [enlace](https://linux.die.net/man/1/chrpath)que permite editar y eliminar RPATH, aunque tiene dos limitaciones: el nuevo RPATH no puede ser más largo que el anterior, y no se puede agregar un RPATH si no existía. Esto se debe a que .dynamic son de tamaño fijo, por lo que se puede extender.

Para mejorar el problema anterior (RPATH de tamano fijo), Sun Solaris creó una nueva zona en .dynamic (padding) junto con entradas DT_NULL que pueden convertirse en DT_RPATH. No obstante , esta solución no existe en GNU toolchain (binutils, donde se encuentra ld)

## En detalle

> Referencias:
>
> - [Shared libraries](https://amir.rachum.com/blog/2016/09/17/shared-libraries/)

### Qué son

Una library es un fichero que contiene datos y código compilado. Permiten modular la aplicación y disminuir el tiempo de compilación. Las librerías estáticas son enlazadas en un solo ejecutable, de forma que el objeto resultante contiene los datos y código de la librería. En cambio, las librerías compartidas son cargadas por el ejecutable (u otra librería compartida) en tiempo de ejecución.

### Ejemplo de compilación de librería dinámica

Compilación del objeto:

```
$ clang++ -o random.o -c random.cpp
```

- `-o random.o`: Define the output file name to be `random.o`.
- `-c`: Don’t attempt any linking (only compile).
- `random.cpp`: Select the input file.

Creación de librería dinámica:

```
$ clang++ -shared -o librandom.so random.o
```

En linux, las librerías dinámicas siguen el formato lib<nombre>.so

### Ejemplo de linkado de librería dinámica:

Compilación del 'main':

```
$ clang++ -o main main.o -lrandom -L.
```

El compilador necesita:

- Crear el objeto main.o
- indicarle que main usará la librería llamada random
  - (En tiempo de compilación, para que compruebe que ésta contiene todos los símbolos de los que depende main)
- Indicarle donde se encuentra dicha librería (.)
  - Esta ruta de búsqueda solo afecta al proceso de linkado, es decir, no se como ruta de búsqueda en runtime

### Ejemplo de ejecutar main junto con la librería dinámica

```
$ ./main
./main: error while loading shared libraries: librandom.so: cannot open shared object file: No such file or directory
```

El error se debe a que el s.o. no encuentra la librería librandom. Nótese que sucede antes de que la aplicación se lance, ya que la librería se carga antes que los símbolos del ejecutable.

Este resultado arroja las siguientes preguntas:

- Cómo sabe main que depende de librandom?
- Dónde busca main librandom?
- Cómo podemos decirle a main que busque librandom en el mismo directorio?

Para responder a dichas cuestiones, primero debemos conocer la estructura de los ficheros implicados (ejecutable, librería)

### ELF - Executable and Linkable Format

Ejecutables y librerías compartidas siguen el formato ELF. Estos ficheros contienen:

- Cabeceras ELF
- Datos de archivo, entre ellos:
  - Program header table (lista de segment headers)
  - Section header table (lista de section headers)
  - Datos a los que apuntan las dos zonas anteriores

En las cabeceras ELF se especifica el tamano y número de segmentos, así como tamano y número de secciones.. Todas las entradas (de segment o section) son de tamano fijo y contienen punteros (offsets) que apuntan a una zona concreta del body.

> Para leer ficheros ELF, se puede usar el comando `readelf`

- readelf -h main
  - Cabeceras
    - 64 bits, ejecutable/librería, etc.
- readelf -l main
  - Program headers
    - De tipo LOAD, DYNAMIC, NOTE, etc.
- readelf -S main
  - Section headers
    - Nombres (.note.ABI)
    - Tipos (SYMTAB)

La parte intersante que nos concierne es 'Program headers table'. Los ficheros ELF pueden tener un segment header que describe un segment de tipo `PT_DINAMIC`. En el caso de shared libraries, este segmetn header es obligatorio.

Dicho segmento `PT_DINAMIC` incluye una sección llamada `.dynamic` que contiene información sobre las dependencias dinámicas

## Dependencias directas

Podemos usar readelf para explorar la sección .dynamic:

```text
$ readelf -d main | grep NEEDED
 0x0000000000000001 (NEEDED)             Shared library: [librandom.so]
 0x0000000000000001 (NEEDED)             Shared library: [libstdc++.so.6]
 0x0000000000000001 (NEEDED)             Shared library: [libm.so.6]
 0x0000000000000001 (NEEDED)             Shared library: [libgcc_s.so.1]
 0x0000000000000001 (NEEDED)             Shared library: [libc.so.6]
```

En general, además de las dependencias que nosotros mismso especificamos, existen otras. En este ca so:

- libstdc++: C++ standard librar
- libm: basic math functions
- libgcc_s: GCC runtime library
- libc: C library (define system calls, open, malloc, printf, etc.

### Runtime search path

Conocemos las dependencias de main, pero por qué no encuentra librandom en tiempo de ejecución?

`ldd` Es una herramienta que nos permite ver de forma recursiva las dependencias de shared libraries. Además, nos permite ver dónde se encuentran

```text
$ ldd main
	linux-vdso.so.1 =>  (0x00007fff889bd000)
	librandom.so => not found
	libstdc++.so.6 => /usr/lib/x86_64-linux-gnu/libstdc++.so.6 (0x00007f07c55c5000)
	libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x00007f07c52bf000)
	libgcc_s.so.1 => /lib/x86_64-linux-gnu/libgcc_s.so.1 (0x00007f07c50a9000)
	libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f07c4ce4000)
	/lib64/ld-linux-x86-64.so.2 (0x00007f07c58c9000)
```

Por qué encuentra ciertas librerías y otras no? La búsqueda sigue las siguientes localizaciones, en orden:

1. Directories listed in the executable’s `rpath`.
2. Directories in the `LD_LIBRARY_PATH` environment variable, which contains colon-separated list of directories (e.g., `/path/to/libdir:/another/path`)
3. Directories listed in the executable’s `runpath`.
4. The list of directories in the file `/etc/ld.so.conf`. This file can include other files, but it is basically a list of directories - one per line.
5. Default system libraries - usually `/lib` and `/usr/lib` (skipped if compiled with `-z nodefaultlib`).

### Corrigiendo el ejecutable para que encuentre la librería

Podemos ver los directorios usados en el search path usando ldd:

```text
$ LD_DEBUG=libs ldd main
      [..]

      3650:	find library=librandom.so [0]; searching
      3650:	 search cache=/etc/ld.so.cache
      3650:	 search path=/lib/x86_64-linux-gnu/tls/x86_64:/lib/x86_64-linux-gnu/tls:/lib/x86_64-linux-gnu/x86_64:/lib/x86_64-linux-gnu:/usr/lib/x86_64-linux-gnu/tls/x86_64:/usr/lib/x86_64-linux-gnu/tls:/usr/lib/x86_64-linux-gnu/x86_64:/usr/lib/x86_64-linux-gnu:/lib/tls/x86_64:/lib/tls:/lib/x86_64:/lib:/usr/lib/tls/x86_64:/usr/lib/tls:/usr/lib/x86_64:/usr/lib		(system search path)
      3650:	  trying file=/lib/x86_64-linux-gnu/tls/x86_64/librandom.so
      3650:	  trying file=/lib/x86_64-linux-gnu/tls/librandom.so
      3650:	  trying file=/lib/x86_64-linux-gnu/x86_64/librandom.so
      3650:	  trying file=/lib/x86_64-linux-gnu/librandom.so
      3650:	  trying file=/usr/lib/x86_64-linux-gnu/tls/x86_64/librandom.so
      3650:	  trying file=/usr/lib/x86_64-linux-gnu/tls/librandom.so
      3650:	  trying file=/usr/lib/x86_64-linux-gnu/x86_64/librandom.so
      3650:	  trying file=/usr/lib/x86_64-linux-gnu/librandom.so
      3650:	  trying file=/lib/tls/x86_64/librandom.so
      3650:	  trying file=/lib/tls/librandom.so
      3650:	  trying file=/lib/x86_64/librandom.so
      3650:	  trying file=/lib/librandom.so
      3650:	  trying file=/usr/lib/tls/x86_64/librandom.so
      3650:	  trying file=/usr/lib/tls/librandom.so
      3650:	  trying file=/usr/lib/x86_64/librandom.so
      3650:	  trying file=/usr/lib/librandom.so

      [..]
```

Para solucionarlo, podemos agregar el path usando LD_LIBRARY_PATH (no es portable)

```
$ LD_LIBRARY_PATH=. ./main
```

### rpath y runpath

Ambas son entradas opcionales de la sección `.dynamic` que contienen listas de directorios.

La única diferencia es que rpath se usa en la búsqueda antes de LD_LIBRARY_PATH y runpath despúes. Como consecuencia, rpath no puede ser cambiado dinámicamente con variables de entorno, pero runpath sí se puede.

> **Importante**: Otra diferencia importante es que, si se establece runpath, rpath se cancela.
>
> RPATH está obsoleto y se desaconseja su uso

Podemos agregar rpath al ejecutable:

```
$ clang++ -o main main.o -lrandom -L. -Wl,-rpath,.
```

`Wl` flag pasa una lista de banderas separadas por coma al linker. En este caso, se le pasa `-rpath .`

Como resultado, llamar a main de esta forma funcionará:

```text
$ readelf main -d | grep path
 0x000000000000000f (RPATH)              Library rpath: [.]

$ ./main
```

En cambio, si lanzamos main desde un directorio diferente, el directorio . hará referencia al working dir y la aplicación no se lanzará.

```text
$ cd /tmp
$ ~/code/shared_lib_demo/main
/home/nurdok/code/shared_lib_demo/main: error while loading shared libraries: librandom.so: cannot open shared object file: No such file or directory
```

Para solucionarlo, podemos especificar rpath relativo al ejecutable:

### \$ORIGIN

Las rutas de rpath y runpath pueden ser absolutas (/path/to/lib/), relativas al directorio de trabajo (.) y también relativas al ejecutable!

```
$ clang++ -o main main.o -lrandom -L. -Wl,-rpath,"\$ORIGIN"
```

> Hemos tenido que 'escapar' el signo de dolar para que el shell no lo expanda

Gracias a esta nueva compilación, main se puede lanzar desde cualquier lugar:

```text
$ readelf main -d | grep path
 0x000000000000000f (RPATH)              Library rpath: [$ORIGIN]

$ ldd main
	linux-vdso.so.1 =>  (0x00007ffe13dfe000)
	librandom.so => /home/nurdok/code/shared_lib_demo/./librandom.so (0x00007fbd0ce06000)
	[..]
```

### Runtime search path: seguridad

El comando passwd sirve para cambiar la clave, la cual se almacena en /etc/shadow, directorio protegido para root. Entonces... cómo puede un usuario no-root acceder a dicho archivo y cambiarlo?

La respuesta se debe a que passwd tiene establecido el bit 'setuid':

```text
$ ls -l `which passwd`
-rwsr-xr-x 1 root root 39104 2009-12-06 05:35 /usr/bin/passwd
#  ^--- This means that the "setuid" bit is set for user execution.
```

Dicha 's' indica que el programa se ejecuta usando el usuario definido en owner (root en este caso, tercera columna)

Qué tiene todo esto que ver con shared libraries? Para averiguarlo, vamos a asignarle el bit setuid a main:

```text
$ ls
libs  main
$ ls libs
librandom.so
$ readelf -d main | grep path
 0x000000000000000f (RPATH)              Library rpath: [$ORIGIN/libs]

$ sudo chown root main
$ sudo chmod a+s main
$ ./main
./main: error while loading shared libraries: librandom.so: cannot open shared object file: No such file or directory
Alright, rpat
```

Ahora rpath no funciona. Si agregamos dicho PATH a LD_LIBRARY_PATH, tampoco funciona.

Por razones de seguridad, cuando se ejecuta un ejecutable con privilegios elevados (setuid, setgid, etc.) el search path es diferente del normal: LD_LIBRARY_PATH se ignora, así como cualquier ruta de rpath o runpath que contenga \$ORIGIN. Si no fuese así, se permitirá que el ejecutable cargase nuestra propia librería como root, tomando el control de la máquina.

> Por tanto, si un ejecutable necesita privilegios elevados, se requiere especificar las dependencias en absoluthe path o en rutas por defecto

**Importante**: ldd no tiene en cuenta setuid, por lo que puede dar la impresión de que se está siguiendo esa ruta cuando realmente no es así.

### Hoja de ruta para depurar

If you ever get this error when running an executable:

```
$ ./main
./main: error while loading shared libraries: librandom.so: cannot open shared object file: No such file or directory
```

You can try doing the following:

- Find out what dependencies are missing with `ldd <executable>`.
- If you don’t identify them, you can check if they are direct dependencies by running `readelf -d <executable> | grep NEEDED`.
- Make sure the dependencies actually exist. Maybe you forgot to compile them or move them to a `libs` directory?
- Find out where dependencies are searched by using `LD_DEBUG=libs ldd <executable>`.
- If you need to add a directory to the search:
  - Ad-hoc: add the directory to the `LD_LIBRARY_PATH` environment variable.
  - Baked in the file: add the directory to the executable or shared library’s `rpath` or `runpath` by passing `-Wl,-rpath,<dir>` (for `rpath`) or `-Wl,--enable-new-dtags,-rpath,<dir>`(for `runpath`). Use `$ORIGIN` for paths relative to the executable.
- If `ldd` shows that no dependencies are missing, see if your application has elevated privileges. If so, `ldd` might lie. See security concerns above.

## Anexos

### Resumen orden de búsqueda:

> Referencia: [enlace](http://longwei.github.io/rpath_origin/)

1. DT_RPATH in the ELF binary, unless DT_RUNPATH set.
2. LD_LIBRARY_PATH entries, unless setuid/setgid
3. DT_RUNPATH in ELF binary
4. /etc/ld.so.cache entries, unless -z nodeflib given at link time
5. /lib, /usr/lib unless -z nodeflib
6. Done, “not found”.

however, exceptions(small print…)

- step1 & 2 if DT_RPATH will ignored is DT_RUNPATH is set. then LD_LIBRARY_PATH will search first
- step 3 LD_LIBRARY can be override by calling dynamic linker with option –library-path
- step6 if executable is linked with ``-z` so #6 is skipped.
- if using origin flag, remember to pass `-z origin` to mark the obejct as requiring origin processing
- LD_PRELOAD happen before all those.
- `LD_LIBRARY_PATH` inherited by all processes generated by parent and it is considered evil

### Permitir que el compilador expanda \$ORIGIN

Es posible que sea necesario indicarle a gcc que permita expandir \$ORIGIN: -Wl,-z,origin

### Funcionamiento antiguo y nuevo del linker

El linker, por defecto, usa runpath. Para deshabilitar dicho nuevo funcionamiento:

`-Wl,--disable-new-dtags`

Documentación de ld:

```
--enable-new-dtags
--disable-new-dtags
This linker can create the new dynamic tags in ELF. But the older ELF systems may not understand them. If you specify --enable-new-dtags, the new dynamic tags will be created as needed and older dynamic tags will be omitted. If you specify --disable-new-dtags, no new dynamic tags will be created. By default, the new dynamic tags are not created. Note that those options are only available for ELF systems.
```

### Mac os vs linux

Existen diferencias:

> Referencia: [enlace](http://jorgen.tjer.no/post/2014/05/20/dt-rpath-ld-and-at-rpath-dyld/)

### Qt y qmake

#### Limpiar rpath que introduce qmake:

```
unix:!mac{
	QMAKE_LFLAGS += -Wl,--rpath=$$ORIGIN
    QMAKE_RPATH=
}
```

#### Agregar rpath al ejecutable final, manualmente

Mismo directorio que el ejecutable:

```cpp
unix:{
    # suppress the default RPATH if you wish
    QMAKE_LFLAGS_RPATH=
    # quoting to make sure $ORIGIN gets to the command line unexpanded
    QMAKE_LFLAGS += "-Wl,-rpath,\'\$$ORIGIN\'"
}
```

Subdirectorio relativo:

```cpp
QMAKE_LFLAGS += "-Wl,-rpath,\'\$$ORIGIN/libs\'"
```

#### Agregar rpath al ejecutablel final, con variable de QT: QMAKE_RPATHDIR

> Referencias:
>
> - [enlace](https://forum.qt.io/topic/85632/linking-internal-libraries/24)
> - [web oficial qt](https://doc.qt.io/qt-5/qmake-variable-reference.html#qmake-rpathdir)

```
QMAKE_RPATHDIR

i.e.: QMAKE_RPATHDIR += $$RELATIVE_PATH_TO_SHLIB_BUILD
```

### Secondary dependencies - Dependencias secundarias

> Referencia: [enlace](https://stackoverflow.com/questions/11055569/linking-with-dynamic-library-with-dependencies)

La mejor forma de corregirlas es forzar que todas sean dependencias directas. En el compilador, se puede fijar:

```
-Wl,--as-needed
Ej:gcc main.c -o main -I. -L. -Wl,--as-needed -lB -lA


```

#### Alternativa

> Referencia: [Better understanding linux secondary dependencies](http://www.kaizou.org/2015/01/linux-libraries/)

### Otras herramientas

Comandos:

- objdump
- ldconfig:
- ltrace: library call tracer
- strace
- ld.so/ld-linux.so: dynamic linker/loader
- libtool: https://www.gnu.org/software/libtool/manual/html_node/Inter_002dlibrary-dependencies.html

Archivos:

- /lib/ld-linux.so.\*: Execution time linker/loader
- /etc/ld.so.conf
- /etc/ld.so.cache: cache
- lib\*.so.version: Librerías compartidas almacenadas en /lib, /usr/lib, /usr/lib64, /lib64, /usr/local/lib

### CMAKE y RPATH

> Referencia:
>
> - [cmake y rpath](https://gitlab.kitware.com/cmake/community/wikis/doc/cmake/RPATH-handling)
> - [cmake dependencies done right](https://floooh.github.io/2016/01/12/cmake-dependency-juggling.html)
