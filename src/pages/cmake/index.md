---
title: "CMake"
date: "2019-03-13"
---

# CMake

> Build system generator

Referencias:

- [CMake - Introduction and best practices (2015)](https://www.slideshare.net/DanielPfeifer1/cmake-48475415)
- [An introduction to modern CMake](https://cliutils.gitlab.io/modern-cmake/)

## Introducción

Modern Cmake trata sobre 'targets' y 'properties'.

- Targets modelan los componentes de la aplicación (ejecutagbles, librerías)
  - La aplicación estará formada por una colección de targets que dependen unos de otros
- Los targets tienen propiedades archivos fuente asociados, opciones de compilador, librerías contra las que enlazar, etc)

## Parámetros básicos

### Forzar versión mínima requerida

```bash
cmake_minimum_required(VERSION 3.2 FATAL_ERROR)
```

### Establecer el nombre, versión y lenguaje del proyecto

```bash
project(<name> VERSION <version> LANGUAGES CXX)
```

Gracias e este comando, CMake fija un conjunto de variables basadas en project()

### Agregar proyectos como sub-proyectos

```bash
add_subdirectory(<sourcedir> [binarydir])
```

CMake crea un Makefile/Solución por cada subproyecto.

Los subproyectos no tienen por qué residir en una subcarpeta

> Es importante asegurar que todos los proyectos pueden compilarse de forma independiente ('standalone') y como un subproyecto de otro proyecto. Para ello
>
> - No hay que asumir que tu proyecto es el build root
> - No hay que modificar flags globales de compilación/linkado
> - No hay que hacer cambios globales

### Encontrar dependencias preinstaladas

```bash
find_packages(Qt5 REQUIRED COMPONENTS Widgets)
```

- Puede establecer variables y definir 'objetivos importados (imported targets)'
- Soporta componentes

find_packages usa un script cmake (FindQt5.cmake) para buscar la instalación de Qt5.

Estos scripts se buscan en el directorio de instalación de cmake o bien se pueden especificar con la línea:

```bash
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} ${CMAKE_CURRENT_SOURCE_DIR}/../cmake)
```

### Agregar objetivos 'ejecutables'

```bash
add_executable(tool
	main.cpp
	another_file.cpp
)

add_executable(my::tool ALIAS tool)
```

### Agregar objetivos 'biblioteca'

```bash
add_library(foo STATIC
	foo1.cpp
	foo2.cpp
	)

add_library(my::foo ALIAS foo)
```

- Las bibliotecas pueden ser STATIC, SHARED, MODULE o INTERFACE
- El valor por defecto puede ser controlado con el parámetro de consola 'BUILD_SHARED_LIBS'

> Importante:
>
> - Siempre agregar namespaced alias a las librerías
> - No forzar las librerías STATIC/SHARED a menos que no puedan construirse de otra forma
> - Dejar el control de BUILD_SHARED_LIBS a los clientes

### Agregar dependencia de biblioteca

```bash
target_link_libraries(foobar
    PUBLIC  my::foo
    PRIVATE my::bar
   )
```

> Importante:
>
> - enlazar contra 'namespaced targets'
> - Especificar si la dependencia es privada o pública
> - Evitar el comando 'link_libraries()'
> - Evitar el comando 'link_directories()'
> - No es necesario llamar a call_dependencies()

### Establecer directorios a incluir

```bash
target_include_directories(foo
	PUBLIC  include
	private src
	)
```

> Importante
>
> - Evitar el comando include_directories()

### Establecer constantes del preprocesador

```bash
target_compile_definitions(foo
	PRIVATE SRC_DIR=${Foo_SOURCE_DIR}
	)
```

> Importante:
>
> - Evitar el comando 'add_definitions()'
> - Evitar agregar definiciones a `CMAKE_<LANG>_FLAGS`

### Establecer opciones de compilación

```bash
if(CMAKE_COMPILER_IS_GNUCXX)
	target_compile_options(foo
	PUBLIC -fno-elide-constructors
	)
endif()
```

> Importante
>
> - Envolver opciones específicas de compilador en una condición apropiada
> - evitar el comando 'add_compile_options()'
> - Evitar agregar opciones a `CMAKE_<LANG>_FLAGS`

### Establecer requisitos del compilador

```bash
target_compile_features(foo
	PUBLIC
		cxx_auto_type
		cxx_range_for
	PRIVATE
		cxx_variadic_templates
		)
```

- Cmake se encargará de agregar las banderas requeridas
- Se mostrarán errores si el compilador no soporta dichos requisitos

> Importante:
>
> - No agregar `-std=c++11` a `CMAKE_<LANG>_FLAGS`
> - No pasar el argumento `-std=c++11` a `target_compile_options()`

## Buenas prácticas (y antipatrones)

### No usar funciones globales

> Incluye link_directories, include_libraries, etc

### No agregar requerimientos públicos innecesarios

> Se deberá evitar forzar algo en usuarios que no lo requieren

### (no enlazar contra archivos)

> En su lugar

### No usar variables personalizas

Por ejemplo, es recomendable usar la siguiente forma:

```bash
target_link_libraries(foobar PRIVATE my::foo)

if(WIN32)
    target_link_libraries(foobar PRIVATE my::bar)
endif()
```

### No usar `FILE(GLOB)!

- file(GLOB) es util en modo de scripting
- No usar en configuración!!

No usar:

```bash
file(GLOB sources "*.cpp")
add_library(mylib ${sources})
```

En su lugar, listar todas las fuentes explícitamente

```bash
add_library(mylib
	main.cpp
	file1.cpp
	file2.cpp
	)
```

> Explicit is better than implicit

### Meta: no usar funciones personalizadas

### 'Usage requirements signature'

```bash
target_<usage requirement>(<target>
	<PRIVATE|PUBLIC|INTERFACE> <lib> ...
)
```

- PRIVATE: Elemento usado sólo por el target actual
- PUBLIC: Elemento usado por el target actual y por todos los targets que enlazan con el target actual
- INTERFACE: Sólo usado por los targets que enlazan contra esta librería.

## Línea de comandos

### Generación de build scripts

```bash
cmake .. -DCMAKE_INSTALL_PREFIX=../_install
```

### Elegir un generador

LIstado de generadores:

```bash
cmake --help
```

Ejemplo:

```
cmake -G"MinGW ...
```

### Establecer opciones:

Usar el parámetro `-D`. Listado de opciones con `-LH`

Opciones comunes:

- `-DCMAKE_BUILD_TYPE=` Release, RelWithDebInfo, Debug
- `-DCMAKE_INSTALL_PREFIX=` The location to install to. System install on UNIX would often be `/usr/local` (the default), user directories are often `~/.local`, or you can pick a folder.
- `-D BUILD_SHARED_LIBS=` You can set this `ON` or `OFF` to control the default for shared libraries (the author can pick one vs. the other explicitly instead of using the default, though)

### Depurar ficheros cmake

Parámetro `--trace` o `--trace-source="filename"`

### Elegir un compiladoren bash linux

En un directorio vacío:

```bash
~/package/build $ CC=clang CXX=clang++ cmake ..
```

### Compilación

Aunque podríamos lanzar los comandos:

```bash
mkdir build
cd build
time cmake ..
time cmake .
time make
```

mkdir y time no son portables. Además, el comando 'make' no siempre será el más adecuado (ninja, jom, etc.).

Para hacer un script de compilación independiente de la plataforma:

```bash
cmake -E help

cmake -E make_directory build
cmake -E chdir cmake -E time cmake ..
cmake -E time cmake build
```

De forma alternativa:

```bash
cmake --build build --target mylibrary --config Release --clean-first
```

## CMake como lenguaje de scripting

Ejemplo:

```bash
> cat hellow_world.cmake
foreach(greet Hello Goodbye)
	message("${greet}, World!")
endforeach()

> cmake -P hello_world.cmake
Hello, World!
Goodbye, World!

```
