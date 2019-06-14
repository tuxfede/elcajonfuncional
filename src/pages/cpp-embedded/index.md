---
title: "CPP - Programación en sistemas embebidos"
date: "2019-06-10"
---

## Referencias

- [Moder c++ in Embedded Systems](https://www.youtube.com/watch?v=1l2g2dAobXA)
- [C++ for Embedded development](https://www.youtube.com/watch?v=wLq-5lBc7x4)
- [What can cpp do for embedded system developers](https://www.youtube.com/watch?v=VoHOLDdfDhk)

## Eliminar C++ language overhead

- Eliminar excepciones: `fno-exceptions -fno-asynchronous-unwind-tables`
- Si no se usa dynamic_cast, typeid o excepciones: `fno-rtti`
- Si no se usa la stl, compilar contra libsupc++ o libc++abi (usar gcc o clang para enlazar en lugar de g++ o clang++)

## Compiladores y stl en linux:

- GCC: libstc++ (gpl) sobre libsupc++ sobre libc
  - Optimiza mejor en tamaño que clang
- Clang: libc++ (bsd) sobre libc++abi sobre [libm, libpthread]

> En sistemas embbidos no se suele disponer de libc o libpthread, lo cual limita el uso de cpp

## Comparativa cpp y c

### Missing prototypes is an error

```c
void f()
{
    g(-1);
}
```

Resultado del compilador:

```bash
c:
Warning: implicit declaration of function 'g' [-Wimplicit-function-declaration]
c++:
Error: 'g' was not declared in this scope
```

### Stricter type safety - const and pointers

Casting con tipos incompatibles es un error en cpp:

```c
void h(int *);
void f(shor *ptr) {h(ptr);}
```

Resultado del compilador:

```bash
c: warning: passing argument 1 of 'h' from incompatible pointer type
cpp: error: cannot convert short int* to int*
```

> Lo mismo sucede con (int _) y (const int _)

### Stricter type safety - void \*

```c
void h(int *)
void g(void *ptr) {h(ptr);}
void f(short *ptr) {g(ptr);}
```

Resultado:

```bash
c: no error, no warning
c++: error: invalid conversion from void* to int*
```

### Stricter type safety - cast operators

- const_cast: Sólo elimina CV qualifiers
  - const, volatile
- static_cast: No elimina const, volatile.
  - Conversión entre tipos compatibles en tiempo de compilación.
  - Por ejmemplo, no permite que un puntero a int apunte a un char.
- reinterpret_cast
  - Convierte un puntero de un tipo a otro, no importa si las clases están relacioandas o no.
- dynamic_cast: Cambios de tipo en tiempo de ejecución. Sólo puede usarse con objetos polimórficos (clase base/derivada)

### RAII (Resource Acquisition Is Initialisation (RAII)

Permite 'mutex_locker' en lugar de funciones lock / unlock.
El destructor de las variables s encarga de liberar locks/unlocks!

### Contenedores

- cpp stl containers están muy optimizados para performance. Problemas
  - No optimizados para tamaño de código.
  - Informan de errores a través de excepciones.
    - En el nuevo standard c++17, devuelve 'expected'.

### Lambdas

- A partir de C++11
- También funciona como C callbacks!!

### Range for:

```c
for (auto i: table) use(i);
```

### Otros

- Binary literals: 0b01001001
- Group separators: 123'456'78
- Return type auto-deduction
- varibalbe tempaltes
- Folding expressions
- Inline variables
- Initialice if and swtich
- if constexpr

## Constant expressions

Permite evaluar cosas en tiempo de compilación
ej:

```cpp
constexpr int isqrt(int n) {
    int i=1;
    while (i*i<n) ++i;
    return i-(i*i!=n)
}
constexpr int s1 = isqrt(9);
```

## Compile-time computation

Elegir biblioteca: (seleccionar, componer):

```cpp
- using namespace Mylib=std; // set namespace (library)
- using Int = int32_t; // set primitive type (size)
- template<typename T>
  using Storage=std:vector<T>  // set container type
- template<typename E, typename A>
  struct Policy {
      using Executor = E;
      using Allocator = A; // asociated types
  }
  Policy<Sequential, Default_allocator> seq; // define a policy

```

## Interfaces y alternativas

Con Interfaz:

```cpp
class Driver {
    public:
    Driver(int addr);
    virtual int write(...) = 0;
};

class Driver1: public Driver {... };
class Driver2: public Driver {... };

void user(Driver& d, ...) {
    int x = d.write()...
}

/*
3 indirecciones!
- Driver object
Virtual function call
Device address
*/

```

Alternativa:

```cpp
template<typename T, int Addr>
struct Driver1 { // Write values of type T to device register at Addr
    static int write(...)
}

template<typename T, int Addr>
struct Driver2 { // Write values of type T to device register at Addr
    static int write(...)
}

struct Packet {/*...*/};

using Character_Device = Driver1<char,0x80>;
using Block_device = Driver2<Packet, 0xF0>;

/* En este caso:
No se ha generado codigo.
Los Device Registers nunca se pasan como argumentos de función
No hay allocations.
*/
```

Para mejorar el código, y no tener que depender de si escribir character o bloque:

```cpp
template<typename T>
void writer(span<T> s) {
    if constexpr(std::is_same<T, char>::value)
        Character_device::write(s.dta(), s.zie());
    else
        Block_device::write(s.data(), s.size());
}
void user1(span<Packet>sp, span<char>sc)
{
    write(sp);
    write(sc);
}

```

# TDD en sistemas embebidos

> Referencias:
>
> - [Patterns and practices for embedded TDD](https://vimeo.com/131644349)
>   Usar templates para test double: [blog cute](https://www.cute-test.com/guides/mocking-with-cute/)
>   Diferencia Stub/fake/mock: [blog pragmatist](https://blog.pragmatists.com/test-doubles-fakes-mocks-and-stubs-1a7491dfa3da)
>   Mocks en c: [fff library](https://github.com/meekrosoft/fff)

Fases:

1. Escribe un test que falla
2. Build, Deploy & Run test
3. Escribe código que hace que el test pase
4. Build, Deploy & Run test
5. Refactoriza
6. Build, Deploy & Run test

## Donde ejecutar los test? Opciones

- Test en Targets
  - Inconveniente:
    - Slower feedback:
      - Build, Deploy, Run test & receive results. Es muy lento!
    - RAM y código de usuario limitado
    - Se requiere hardware para hacer la prueba (caro, se rompe).
  - Ventaja: test muy precisos
- Test en Plataforma de desarrollo
  - Ventajas:
    - Fast feedback
    - No límites de espacio/ram
    - Reduce la necesidad de hardware
    - código más portable
    - Permite escribir código (en las pruebas) que podría no compilar usando el compilador del targetr
  - Desventajas
    - Al ser plataformas diferentes, algunos problemas sólo suceden en target.
      - Ej: packing, endianness, sizeof(int)
    - Código que no compila cuando se usa el compilador destino
  - Dual Targeting tests:
  - Probar en entorno de desarrollo el ciclo y probar finalmente en target.
    - Ventajas:
      - Fast feedback
      - Código portable
      - Mejora la detección de errores
      - Permite ejecutar análisis de código dinámico (Memory leak, sanitizers)
    - Inconvenientes:
      - Se necesita hardware
      - Limitado a las características del lenguaje implementadas en ambos compiladores
      - Se requiere mantener dos builds.

## Arquitectura

Capas:

```
Application code (hw independent)    # Faster to Test
Hardwre Aware code
BSP (Devide drivers)
HAL (Processor Drivers)              # Slower to test
```

> Capa de nivel bajo que no se prueba: Sólo establece registros del procesador)

## Ejecución de tests

Ejecutar en aislamiento:

- Un test no puede depender del hardware o algo fuera de control
  - Con qué reemplazamos la dependencia: Test double
  - Cómo la reemplazamos:
    - Tiempo de compilación:
      - Macros (C/Cpp)
      - Templates (Cpp)
      - #includes (C/Cpp)
    - Tiempo de ejecución
      - Lincar con otros objetos (C/Cpp)
      - Weak linking functions (C)
    - Runtime:
      - interfaces (C++)
      - Herencia (Cpp)
      - V-Table(C)

### Test dobules

- Stub: Respuestas fijas a llamadas a métodos y puede registrar los valores que recibe (spy).
  - Test environment. Verifica estado.
- Dummy: Usados para cumplir una dependencia que no se usa.
  - Normalmente consisten en definiciones de métodos vacías
  - Sólo se suelen usar para rellenar la lista de parámetros
- Fake: Working fake implementation de la dependencia
  - Por ejemplo, cambiar bbdd por memoria
- Mock: Preprogramado con los métodos a los que se espera que se llame y verifica que sucede.
  - Verifica comportamiento, comprobamos si se lhicieron las llamadas en el orden correcto, etc.

### Estilo de TDD

Escenario:
Dado ...
y ....
Cuando
Entonces ...

- Classical (Chicago/Detroit) Style state verification (con stubs)
  - Ventajas:
    - No especifica cómo debe trabajar el código
    - Fácil de refactorizar
  - Desventaja:
    - Más dificil de saber qué se ha roto. Un simple cambio de código puede romper muchos tests.
    - Trade off entre encapsulación y testabilidad. El estado tiene que ser visible para poder ser verificado
- Mockist (London) Style behaviour verification (con mocks)
  - Ventajas:
    - Cambios de código que rompen funcionalidad sólo rompen los tests asociados.
  - Ventaja/Desventaja:
    - Tienes que pensar en la implementación cuando escribes el test
  - Desventaja:
    - Test acoplados a la implementación (refactorización más dificil)

Para Embedded:

- Mocking Test en HAL, BSP, donde el comportamiento suele estar fijado por el dispositivo.
- Classical (stubs/fakes/dummies en capa de aplicación y hardware relacionado con hw. Facilitan la refactorización.

### Dónde insertar test doubles

Lo más común:

- Link time: Linking other objects (C/Cpp)
- Runtime: Interface (Cpp), V-Table (C)

#### Interface

- Se crea una interfaz del Test double.
- Se crea un Mock para inyectar en tests
  - Define la interfaz
  - Define manualmente el comportamiento esperado

Tras ello, se crea el test:

- Se crea instancia del test double
- Se proprocionan lo que se espra del mock
- Se crea el objeto a testear y se le inyecta el test double
- se ejecuta la función bajo test
- se comprueba que el resultado sea el esperado.

Tras ello, se crea el objeto a probar

- Se inyectan el test double en el constructor
- Se implementa la función, y se usa la interfaz.

Ventaja:

- Método más sencillo de inyectar tests
-

Desventaja de interfaces:

- Funciones virtuales más lenta que llamadas directas
- V table ocupa espacio en ram o rom.

#### C V-Tables (estructuras que contienen function pointers)

> Usar cuando no se puede usar C++

1. Definir el objeto que se inyectará como una estructura con punteros a funciones
2. Para el mock, definir todas las funciones que se usarán
3. Instanciar un objeto 'Mock' de tipo 'objeto a inyectar' usando todas las funciones definidas.
4. Implementar las funciones 'Expected, verify...'

Ejemplo:

```c
struct I2C {
    bool (*setAddres)(unsigned char address);
    bool (*Read)(void *buffer, int lenght);
    //...
}

static bool MockI2C_setAddress(unsigned char address) {
    //...
}
// ...

const struct I2C MockIWC {
    .setAddress = MockI2C_setADdress,
    .Read = //...
}


```

Ventajas:

- Permite runtime substitution en C

Desventajas:

- Facil cometer errores al crear la V-Table
- Permitir múltiples instancias requiere mucho boilerplate.

#### Enlazar objetos diferentes en test/release

> Usar como último recurso cuando las funciones virtuales son demasiado 'caras' en tiempo/rendimiento.

Ventajas:

- No virtual functions
  Desventaja:
- Añade complejidad al sistema de compialción.

### Otros

Usar Continuous integration server, con interfaz indicando estado de cada usuario

- Crear fake BSP para simular!!

## Herramientas

- Ver código ensamblador generado por compilador: [Compiler explorer](https://godbolt.org/)
- Unit testing framework [CUTE](https://www.cute-test.com/)

## Patrones y técnicas:

- [Curiously recurring template pattern](https://en.wikipedia.org/wiki/Curiously_recurring_template_pattern)
  - Usado para clear polimorfismo en tiempo de compilación.
  - [Método Separar interfaz de implementación](https://dev.to/ronalterde/embedded-programming-loose-coupling-best-practices-20n7)
- [Manual C 'build your own lisp](http://www.buildyourownlisp.com/contents)

## Otros enlaces:

- [podcast c++ weekly - Zero cost embedded c++](https://www.youtube.com/watch?v=YJzIcmD7IsY)
  - Algunos ejemplos de optimización
- [Better embedded library interfaces with modern c++](https://www.youtube.com/watch?v=ArRuPzN7JXs&t=3206s)
  - Ejemplos de implementación con templates, concepts.
  -
