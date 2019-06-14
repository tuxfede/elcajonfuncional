---
title: "CPP - Utilidades"
date: "2019-03-28"
---

## Clazy

Clang-based static analyzer for c++

spacialized in Qt

Enforces Qt best practices statically

```bash
$ clang-standalone --checks=level2 foo.cpp -- -I/whatever
```

Clang plugin:

```bash
cat /usr/bin/clazy
```

Fix automatically:

```bash
export CLAZY_FIXIT="fix-function-args-by-ref"
clang-standalone -enable-all-fixits
```

## Concurrencia

Problemas de concurrencia y cómo resolverlos ([enlace](https://www.youtube.com/watch?v=asgO4P2fhTw&list=PL9hrFapz4dsMrrlvFMvuqy_cdpPadCyL8&index=8&t=0s))

Resumen: usar channels, actors, boost:future, etc.

## GDB

trucos: <https://www.youtube.com/watch?v=Yq6g_kvyvPU&list=PL9hrFapz4dsMmDBjD_hiGaYKTXXLo7bAv&index=6&t=823s>

## Consejos

'explicit'

Poner 'explicit' siempre que sea posible (para evitar bugs debido a conversiones implícitas)

[[maybe_unused]]

(ejemplo: para creamos variables temporales

[[fallthrough]]

(ejemplo: cases en switch sin break)

[[nodiscard]] int getNumber() {return 42;}

auto num = getNumber();

getNumber(); // el compilador avisa!

Evitar 'defaults'

- Public y private SIEMPRE
- Agregar return al final de funciones void

Marcar 'override' en funciones virtuales con override

Usar 'noexcept(false)'

## GSL

Librería para soportar funciones y tipos definidos en C++ Core Guidelines

(not_null, span<T>, etc.)

[GSL en github](https://github.com/microsoft/GSL)

## Let's make easy to use libraryes. Martin knoblauch

Para programar librerías compatibles con diferentes compiladores

- O bien se compila cada solución
- O se entrega código fuente
- O se programa correctamente

Hourglass pattern:

- Programar usando c++
- Crear binary interfaces usando C89
- Crear capas adcionales en c++ para exponer dicha funcionalidad a los usuarios

Problemas: No escala, más trabajo, etc.

Solución intermedia: Usar sólo las partes de c++ con:

- 'Tipos' muy estables en cuanto a binario generado
- Clases basadas en dichos tipos
- Smart pointers
  - shared_ptr
    - Ventaja: Contiene un puntero al 'deleter'
    - Inconveniente: Semántica inapropiada, coste de memoria y tiempo, binary incompatibility?
  - uniqued_ptr:
    - Ventajas: Semática perfecta
    - Zero cost
    - Pocos cambios de compatibilidad binaria
    - Inconveniente: no contiene un puntero al deleter.
  - unique_ptr conm 'custom deleter'
    - std::unique*ptr<T, void (*)(T\_)
