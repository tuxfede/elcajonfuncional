---
title: "Functional Programming, BDD, Templates, ..."
date: "2019-04-01"
---

##BDD

> Framework más importante: cucumber-cpp

Lenguaje universal que utiliza: Gherkin.

### Instalación

```bash
git clone https://github.com/cucumber/cucumber-cpp.git
sudo apt install ruby
sudo apt-get install ruby-dev
sudo gem install b undler
bundle install
cd cucumber-cpp
git submodule init
git submodule update
sudo apt-get install ninja-bu9ild
sudo apt-get install libboost-all-dev
sudo ./travis.sh
```

alternativa:

```bash
git submodule init
git submodule update
cmake -E make_directory build
cmake -E chdir build cmake --DCUKE_ENABLE_EXAMPLES=on ..
cmake --build build
cmake --build build --target test
cmake --build build --target features
```

Cada característica del producto debe tener un feature file dedicado (extensión .feature). Puede contener cualquier número de escenarios, y cada escenario es equivalente a un test case.
Ejemplo:

```bdd
# language: en
Feature: Application should authenticate user login.
  Scenario: Successful login
    Given I navigate to application login web_page
    And I type xxx as email
    And I type xxx as password
    When I click the login button
    Then I expect Home page after successful login
```

A contninuación, la implementación de test-case se escribe en un Steps file.
Cada línea del escenario se traducirá en una función en Steps_definition.cpp.
Estructura: src -> roduction code
features: contendrá las features
Steps: gtest cases.
Para crear la estructura de directorios:

```bash
cucumber --init
mkdir src
cd features
touch CmakeList.txt
touch features
```

## Depuración

Depuradores:

- gnu ddd
- gnu emacs gdb

Usar assert <cassert> (desactivar en release)
Comandos básicos gdb:

```bash
gdb aplicación
break main   (b main)
run (r)
next (n) (linea a linea (sin entrar en funciones))
step (s) (entra dentro de funciones)
continue (c) (continua al siguiente breakpoint)
backtrace (bt) imprime callstack
quit (q) se sale de gdb
-h (ayuda)
print variable
```

## Otras herramientas

valgrind: fugas de memoria
cachegrind (cache profiler)
helgrind (detecta thread synchronization
drd -. thread error detetor)
massif (heap profiler)
memcheck (memory leaks, crashes, etc.)

Ejecutar valgrind para analizar fugas de memoria:

```bash
valgrind --leak-check=full --show-leak-kind=all ejecutable
```

Extraer funcinoes generadas por compilador a partir de templates:

```bash
nm 'ejecutable' | grep sort -> Muestra tabla de símbolos
c++filt _Z4sortIdLi5EEvPT_ -> Para un símbolo, muestra la signatura de la función.
```

## Compiladores y template metaprogramming

Para ver el árbol que se genera en tiempo de compilación:

```bash
g++ -fdump-tree-original main.cpp
```

Sobrecarga de templates:
Posible igual que la sobrecarga de funciones. Se basa en sobrecarga de argumentos y tipos de datods.
C++ primero busca en funciones non-template.

Explicit class specializations:
Reemplaza la plantilla primaria (genérica) con uno implementación concreta para el tipo específico definido.

```cpp
template <class T>
class Dynamicarray {};

template<>
class Dynamicarray<bool> {};
```

Partial template specialization. Especializa un subset de parámetros soportados por la plantilla primaria, mientras que los otros tipos son los mismos que los de la plantilla primaria.

```cpp
template<typename T1, typename T2, typename T3>
class MyTemplateClass {
void F1(T1 t1, T2 t2, T3, t3);
void F2(T1 t1, T2 t2);
}

template <typename T1, typename T2, typename T3>
class MyTemplateClass<T1, T2*, T3*> : public MyTemplateClass<T1, T2, T3> { // Hereda de la plantilla primaria para reusar los métodos publicos y privados, pero especializa algunos parámetros.
void F1(T1 t1, T2* t2, T3* t3);
// F2 lo herede de la primaria!
}
```

## constexpr

constant expressions are availabe as variables, user defined types and functions. Can be evaluated at compiled time.
En el código se ven como variables, pero se evaluan en tiempo de compilación (los objectos se crean en compile time!)

## Comandos útiles

Generar proyecto qt

```
qmake -project // Genera el fichero .pro!!!
```

Ver la estructura de directorios:

```bash
tree
```

ver los id que el sistema operativo asigna a los hilos de un proceso:

```bash
ps -T -p <process-id>
```

ver los ids de un proceso:

```bash
top -H -p <process-id>
ps -ef | grep -i <application name>
htop
```

Encontrar deadlocks:

```bash
g++ main.cpp -o deadlock.exe -std=c++17 -lpthread -g
valgrind --tool=helgrind ./deadlock.exe
C++ 17 ofrece: std::timed_mutex, std::scoped_lock, mutex::try_lock(), shared_mutex, semaphore
```

## Concurrencia

```cpp
#include <iostream>
#include <future>
using namespace std;
void sayHello(){ cout << "hello" << endl;
}

int main() {
future<void> futureObj = async (launch::async, sayHello);
futureObj.wait();
return 0;
}
```

Future es un objeto del módulo de concurrencia que ayuda al llamante a recivir el mensaje pasado por el hilo de una forma asíncrona.

- future<void> indica que no se espera valor devuelto
- launch::async mode permite lanzar sayhello() en un hilo separado
- En cambio: launch::deferred retrasará la llamada hasta future::get();
- futureObj.wait() se usa para bloquear el hilo principal y que la aplicación no termie

versión alternativa:

```cpp
void sayHello(promise<string> promise*) {
promise*.set_value("hello");
)}

int main() {
promise<string> promiseObj;
future<string> futureObj = promiseObj.get_future();
async(launch::async, sayHello, move(promiseObj));
cout << futureObj.get() << endl;
return 0;
}
```

Note que future::get() debe llamarse una sóla vez, pues el correspondiente objeto promesa será destruido tras su llamada.
std::move() mueve promiseObj a sayHello thread, por lo que no es accesible desde main tras ello.

### Concurrency tasks

task es un trabajo que sucede de forma concurrente a través de varios hilos.

```cpp
#include <iostream.
#include <future>
#include <promise>
#include <thread>
#include <functional>
using namespace std;

int main() {
packaged_task<int (int, int)> addTask([](int firstInput, int secondInput) { return firstInput+secondInput;});
future<int> output = addTask.get_future();
addTask(15,10);
cout << "The sum of 15+10 is " << output.get() << endl;
return 0;
}
```

## TDD

Probar sólo la interfaz pública!

Instalación google tests:

```bash
git clone https://github.com/google/googletest.git
cd googletest
cmake CMakeList.txt
sudo make install
// Se habrá creado libgmock.a y libgtest.a static library en /usr/local/lib
g++ -o tester src/Math.cpp test/MathTest.cpp -I src /usr/local/lib/libgtest.a -lpthread
```

## Datos inmutables

Se puede crear operadores peresonalizados:

```cpp
namespace Unit {
Dist constexpr operator ""\_km(long double d) { return dist(1000\*d); }
}

class Dist {
public:
constexpr Dist(long double i):m(i) {}
frirend constexpr Dist operator +(const Dist&a, const Dist&b) { return Dist(a.m + b.m); }
private
long double m;
};
```

## CPP 17

Mejora c++17: inicializar if!!

```cpp
if(const auto it= ... ; it!)
else
```

## Heap vs stack

Cuando se llama una función, se crea un stack frame en el que se incluyen las variables locales, un puntero a la dirección donde continuar al finalizar la función, etc.
Si se requiere más memoria, se puede reservar en la zona libre 'heap', usando para ello 'new'. . La memoria reservada en heap permanece hasta que se libera usando delete. Heap allocation es más lento que stack. Si se olvida liberar la memoria, existe un memory leak
Tail recursion: el compilador es capaz de optimizar el código recursivo si lo último ques e aplica es la recursión. Cuando no se puede hacer directametne, se puede hacer que la función recursiva reciba dos parámetros: uno sobre el que aplicar la recursión y otro que se corresponde con el resultado anterior.
Por ejemplo:

```cpp
int factorial(int n) {
if(n ==0)
return 1;
else
return n* factorial(n-1);
}
```

Aunque el factorial es la recursión es la última función que se invoca, el resultado es usado para
multiplicarse por n y entonces es cuando se sale de la función, por lo que no es tail recursion.
Para convertirla en tail recursion:

```cpp
int factorialtail(int n, int i) {
if(n == 0)
return i;
return factorialtail(n-1, n\*i);
}
```

Ahora al final de factorialtail la última instrucción es la llamada recursiva.
Para simplificar la complejidad añadida (hemos introducido un segundo parámetro en factorialtail),
podemos crear una función auxiliar:

```cpp
int factorial(int n) {
return factorialtail(n, 1);
}
```

## Tipos de recursividad

functional recursion: devuelve algún valor
procedural recursion: no devuelve un valor; realiza acciones en cada iteración
backtracking recursion: divide las tareas en pequeñas subtareas que pueden ser canceladas.

eager evaluation (strict) vs lazy evaluation (non-strict)
eager == ansioso
lazy == perezoso
Técnicas de caching, memoization

## metaprogramming

tecnica que crea código fuente usando código fuente: escribimos un programa que manipula a otros programas y los trata como datos.
Además, las plantillas son un mecanismo en tiempo de compilación en c++ 'turing-complete', esto es, cualquier cáculo puede ser computado de alguna forma por un template metaprogram antes de ser corrido ent iempo de ejecución. Creamos código que se ejecutara cuando el codigo es compilado.

# Tema 3 - funciones

## Qué puede ser una función en c++

Cualquier cosa que pueda ser llamada como una función es un objeto función (duck-typing).
Es decir, si podemos escribir el nombre de una entidad, seguida por argumentos entre paréntesis, esa entidad es un objeto función.
Una función es un grupo de sentencias que pueden ser invocadas desde otra parte del programa, o desde la función en si misma (recursión).

En c++ 14, se puede omitir el tipo devuelto para que el compilador lo deduzca de la expresión 'return'.
formas de devolver auto:

```cpp
auto ask1 () {return 1;}
decltype(auto) ask() {return 1;} // return int (decltype(int))
decltype(auto) ask() {return (answer); } // return reference to int
```

Es útil cuando se devuelve el mismo valor de otra función sin modificarlo.
Para que devuelva lo mismo que la función llamada (ya sea referencia o por valor):

```cpp
template <typename Object, typename Funtion>
decltype(auto) call_on_object(Object&& object, Function function) {
return function(std::forward<Object>(object));
}
```

'class member functions' no son consideradas function objects porque no soportan function call syntax (debido a la inclusión de this como primera parámetro)

forwarding references (universal references) es una doble referencia en un tipo templated:
template <typename T>
void f(T&& fwd, int&& value) {...}

El primer argumento es una referencia forwarding, mientras que value es una referencia rvalue.
Gracias a ello, con std::forward pasamos el argumento con el mismo valor/categoría que ha sido recibido.

Punteros a funciones (y referencias a funciones) son también objetos función. De forma adicional, todos los tipos que pueden ser convertidos a punteros a función son también function objects, pero deberían ser evitados.
Ejemplo página 56

C++ ofrece otra forma de crear nuevos tipos que se comportan como funciones: creando clases y sobreescribiendo 'call operators'.

```cpp
class function_object {
public:
return_type operator()(arguments) {
}
}.
```

Ventaja: permite tener un estado por instancia (mutable o no), y personalizar el comportamiento de la función sin que el llamante tenga que especificarlo. Por ejemplo:

```cpp
class older_than {
public:
older_than(int limit): m_limit(limit) {}
bool operator()(const person_t& pereson) const {
return person.age() > m_limit;
}
private:
int m_limit;
}

older_than older_than_42(42);
```

> Importante: clases con overloaded call operator se suelen llamar functors. No obstante, functor tiene un significado distinto en la teoría de categorías, por lo que llamaremos a estas clases function objects.

### Generic function-objects

Si hacemos una clase con parámetros templated, habría que pasar el tipo de parámetro en cada instancia.
En cambio, en lugar de crear class template, podemos crear sólo templated member function.

```
class older_than {
public:
older_than(int limit): m_limit(limit) {}

    template <typename T>
    bool operator()(T&& object) const {
        return std::forward<T>(object).age() > m_limit; // con forward forzamos a que se use la versión de la función correcta (lvalue o rvalue)
    }

private:
int m_limit;
}

// Ejemplo: misma función sirve para diferentes objetos
older_than predicate(5);
std::count_if(persons.cbegin(), persons.cend(), predicate);
std::count_if(cars.cbegin(), cars.cend(), predicate);
```

### Lambdas y closures

Lambda == azucar sintáctico para crear anónimas (unnamed) function objects.
[](){}
Los paréntesis son opcionales.

- head: especifica las variables del scope que serán visibles dentro del body. Pueden ser capturadas como valor o referencia.
  - todas por valor: =
  - todas por referencia: &
  - capturar this-pointer by-value: this
  - Toas por referencia, excepto una: [&, a]
    arguments
    body
    Importnate: call operator de lambda es constant por defecto
    Si se usa el paso por valor, y el objeto no tiene el constructor copia (ejemplO: unique_ptr), capturar dicha variable provoca un error de compilación.
    Para solucionarlo, se puede inicializar la variable capturada haciendo std::move
    [session = std::move(session), time = currenttime()](...){}

Generic lambda
Es una clase en la que el call operator es templated.
Se puede usar auto como argumentos!
auto predicate = [limit = 42](auto&& object) {
return object.age() > limit;
return std::forwrd<decltype(object)>(object); // no disponemos del tipo definido en template)
}

Escribir function objects que son incluso más concisos que los lambdas
ok*response = filter(responses, *.error() == false);
donde \_ corresponde con cada response concreta.
Como?

```cpp
class error_test_t {
public:
error_test_t(bool error = true) :m_error(error) {}

    template <typename T>
    bool operator()(T&& value) const {
        return m_error ==
            (bool)std::forward<T>(value).error();
    }

    error_test_t operator ==(bool test) const {
        return error_test_t(test ? m_error : !m_error);
    }

    error_test_t operator!() const {
        return error_test_t(!m_error);
    }

private:
bool m_error;
}

error_test_t error(true);
error test_t no_error(false);
```

De esta forma:

```cpp
ok_response = filter(resopnses, not_error);
//or filter(responses, !error);
//or filter(responses, error == false);

failed_response = filter(responses, error);
// or filter(responses, error == true);
// or filter(responses, not_error == false);
```

### Operator function objects in STL

Listado de operator wrappers en stl: página 74
Desde c++14, es posible omitir el tipo cuando se usan operator wrappers de std. Por ejemplo, en lugar de std::greater<int(), se puede usar std::greater<>()

Librerías auxiliares: boost.phoenix
Por ejemplo, para no podemos usar std::partition (requiere una función a la que se le pasa un argumento)con std::less_equal (requiere dos argumentos).
phoenix define placeholders y operadores que permite componer los placeholders:
using namespace boost::phoenix:;arg_names;
std::vector<int> numbers {21, 5, 62, 42};
std::partition(numbers.begin(), numbers.end(), arg1 <= 42); // arg1 es un placeholder.
Al llamar a <= en el placeholder, no comparará arg1 con 42, sino que devolverá una función unaria.
Inconveniente, ralentiza el tiempo de compilación.

Envolver function objects con std::function
Hay casos en los que es imposible usar las soluciones anteriores (por ejemplo, guardar function objects como un miembro en una clase que no puede ser templated)
Para ello: std::function<float(float,float)> test_function

### Tema 4 - Crear funciones a partir de otras antiguas

Así como en programación orientada a objetos se usan las clases para combianar objetos en otros más complejos, fp proporciona mecanismos que permiten crear nuevas funciones a partir de otras existentes, bien especializando funciones o bien generalizando funciones.

Partial function application.
consiste en proveer sólo alguno de los argumenots neesarios para calcular el resultado final.
crearemos una genérica greather_than:

```
class greater_than {
public:
greater_than(int value) : m_value(value) {}
bool operator()(int arg) const {
return arg > m_value;
}
private:
int m_value;

}

greater_than greater_than_42(42);
greater_than_42(1); // false;
```

Forma genérica de convertir funciones binarias en unarias
std::bind primer argumento, función a linkar, resto de argumentos serán los valores a enlazar.
bind no invoca a la f unción, simplemente crea un function object que llamará con los valores específicos.

```cpp
auto is_greather_than_42 = std::bind(std::greater<double>(), +1, 42);
auto is_less+than_or_equal_to_42 = std::bind(std::greater<double(), 42, \_1);))
```

Inverrtir parámetros: less_than = std::bind(greater, \_2, \_1)
std::bind copia los argumenots, por lo que cuando se pasan objetos que tienen deshabilitada la copia, se require usar std::ref al parámetro.
Para más de dos argumentos, igual
para usar funnciones miembro, &person_t::print
Inconvenientes de bind: dificulta al compilador y dificil de optimizar.

Alternativa a std::bind: lambdas
Mucho más rápido, optimizado, pero sintaxis más verbosa.
Basta con capturar cualquier argumetno en una variable.
Los placeholders serán lambda arguments

```cpp
std::bind(greater, \_1, value) --> [value](int arg) { return greater(arg, value()};
```

### Currying

En nombre de Haskell Curry. Se suele confundir con partial function application.
En lugar de crear funciones que toman dos argumentos y devuelven un valor, podemos crear funciones unarias que devuelven una segunda función unaria. Cuando esta segunda función es llamada, significa que tenemos todos los argumentos que necesitamos y podemos devolver el resultado.
En currying se debe seguir el mismo orden de llamada. No obstante, en bind se necesitan saber el número de argumentos, mientras que con las funciones curried, no nos pruecopa.

```cpp
auto greater_curried(double first) {
return [first](double second) {
return firste > second;
}
}
greater_curried(2)(3);
```

Para facilitar la creación de curried, usaremos un helper llamado make_curried

function lifting
Es un patrón que permite transforamr una función en otra similar que es aplicable en un contexto más amplio. Por ejemplo, dada una función que es opera sobre un string, lifting permite crear funciones que opera sobre un vector o lista de cadenas, etc.

### Tema 6. Pureza y mutabilidad

Necesitamos cierta mutabilidad para hacer aplicaciaones interactivas, que puedan almacenar información en archivos, leer de base de datos, etc.
Por ello, nos ceñiremos a minimizar la mutabilidad y sus efectos laterales.
Definiremos la mutabilidad a traés del concepto de referencia transparencial. Es una característica de expresiones, no solo de funciones. Diremos queuna expresión es referencialmente transparente si el programa no se cmporta de forma diferetne si sustit;imos toda la expresión por el valor devuelto. si una expresión es referencialmente transparente, entonces no tiene efectos colaterales observables y, por tanto, todas las funciones usadas en dicha expresión son puras.
mutabale
v | x
not shared ------- shared
v | v
inmutable

Para minimizar mutabilidad, c++ proporciona const y constexpr
Cuando se declara una instancia de algún tipo T como const, realmente se declara el tipo como const T.
const std::string name("john smith");

std::string name_copy = name; // ok, copiará name a una nueva variable. Si cambia name_copy, no cambia name
std::string& name_ref = name; // error El compilador compara const std::string y string y observa que no son del mismo tipo
cosnt std::string& name_constref = name; // const ref es especial, pues además de hacer un bind a la variable, también lo hace a un valor temporal, en cuyo caso prolonga su tiempo de vida.
std::string* nameptr = &name; //error El compialdor detecta que no son del mismo tipo
const std::string* name_constptr = &name;

En las funciones de una clase, const se refiere a this:
class hola { function hello() const} === class hola {function hello(const hola& this)}

Nota: Por razones históricas, this es un puntero aunque no pueda ser cambiado a aotro objeto y no pueda ser null (podría ser una refenrecia)

Podríamos crear todas las variables miembro de una clase como const, pero no se realizarían algunas optimizaciones durante la compilación, pues se pierden move constructor y move assginment operator.
En su lugar, haremos todas las funciones miembro publicas constantes. De esta forma, no será posible que el usuario modifique las variables (aunque no sean declaradas const).
cuando queremos internamente tener una variable mutable (incluso para las funciones miembro const), podemos usar 'mutable'

```cpp
class person_t {
public:
employment_history_t employment_history() const {
std::unique_lock<std::mutex>
lock{m_employment_history_mutex};

        if (!m_employment_history.loaded()) {
            load_employment_history();
        }

        return m_employment_history;
    }

private:
mutable std::mutex m_employment_history_mutex;
mutable employment_history_t m_employment_history;
}
```

Cuando se diseña una clase para ser inmutable, una función setter de esta clase debe crear una nueva copia del objeto con los valores cambiados (en lugar de modificar la clase actual). Si no se necesita el objeto original tras el set, se pueden realizar optimizaciones.
Ejemplo:

```cpp
person_t new_person {
old_person.with_name("asdf").with_surname("jonasdf")
}
```

si se detecta que el objeto sobre el que se llama el método es temporal, y que no se necesita su copia, se pueden mover los datos:

```cpp
class person_t {
public:
person_t with_name(const std::string& name) const & { // trabaja con normal values y lvalue references
person_t resutl(\*this); // Se crea una copia
result.m_name = name; // Se cambia el nombre. No hay problema porque aún no se ha expuesto el objeto
return result; // Se devuelve el objeto. A partir de ahora, es inmutable
}

    person_t with_name(const std::string &name) && { // será llamado en objetos temporales y rvalue references
        person_t result(std::move(*this)); // se llama a move constructor en lugar del copia
        result.m_name = name;
        return result;
    }

}
```

> Importante: const deshabilita move constructor
> En punteros, sólo dice que la dirección no cambia, pero permite cambiar el objeto al que apunta! Para remediarlo, propagate_const

### Tema 6 - Lazy evaluation

### Tema 7

ranges: Estructura que contiene dos iteradores: uno apunta al principio y otro al elemento después del último.

Librería más usada: range-v3.
También existe boost.range.

De esta forma, es poisible devolver un rango completo como resultado, y que dicho rango se pase directamente a otra función.
Además, evita errores (paso de iteradores de diferentes colecciones, paso de iteradores en orden contrario, etc.)
Además, range libraries proporcinan una sintaxis de tubería (pipe) que sobreescribe el operador |:

```cpp
sdt::vector<std::string> names = peopel | filter(is_female) | transform(name);
```

Vistas de sólo lectura:
Filter:
Ranges son una abstracción que representa a colecciones, pero no son colecciones reales (sólo necesitan comportarse como tal: inicio, fin e iteración).
En realidad , devuelven smart proxy iterator que contiene referencias a los elementos originales de la colección que cumplen una condición.
Son, pues, vistas de la colección original.
Transform:
También puede devolver una vista sobre una colección existente.

Si, en su lugar, necesitamos cambiar la colección original, entonces usaremos 'actions' en lugar de 'views'
En ranges-v3: range::view y range::action.
En actions, la evaluación es inmediata.
Además, en ranges, end iterator apunta al siguiente elemento tras el último! (se le conoce como sentinel) Como consecuencia, permite crear ranges infinites and delimited

Función view::zip: Toma dos rangos y los empareja. El primer elemento en el rango resultante será una pareja de items que contiene le primer item de cada rango, ...
función istream_range<std::string>(std::cin);
action::sort
ranges v3 solo funciona en c++17. Para usar con compiladores más antiguos, provee la macro RANGES_FOR()

### Tema 8 Estructuras de datos funcionales

(leer)

### Tema 9: Algebraic data types and pattern matching

Como tratar estados inesperados o inválidos?
En FP la creación de un nuevo tipo a partir de otros antiguos se realiza a través de dos operaciones (suma y producto).
Producto A y B == nuevo tipo que contiene una instancia de A y una instancia de B.
std::pair es un producto de dos tipos, mientras que std::tuple es producto de tantos tipos como se requieran. Ambos proporcionan comparison operators.
Por ejemplO std::tie(nombre, apellido) < std::tie(nombre2, apellido2); (std::tie crea una tupla de referencias a los valores pasados).
No obstante, pair no almacena un nombre para los valores almacenados, por lo que no podemos saber qué es qué a simple vista. Por ello, se intenta evitarlos.

La suma de A y B almacena una instancia de A o una instancia de B, pero no ambas al mismo tiempo. Enums son un caso concreto de suma.
Podemos definir una estructura por estado (con los campos asociados a dicho estado), y modelar el estado actual como una suma de los diferntes tipos asociados a cada estado.
dicha suma puede hacerse de diversas formas:

- A través de herencia: super-class representa el estado, subclass para cada estado concreto. En lugar de hacer dynamic_cast (es muy lento), se puede definir una etiqueta (tipo entero) que identifique cada subclase.
- A través de uniones y std::variant. De esta forma, todos los posibles estados tiene que ser explícitamente especificados al definir la viarble estado. Ejemplo:

```cpp
  class init_t {};
  class running_t {
  public:
  unsigned count() const { return m_count; }
  private:
  unsigned m_count = 0;
  }
  class finished_t {
  public:
  finished_t(unsigned count) : m_count(count) {}
  unsigned count() const { return m_count; }
  private:
  unsigned m_count;
  }
  class program_t {
  public:
  program_t() : m_state()) {}
  //..
  void counting_finished() {
  auto \*state = std::get_if<running_t>(&m_state);
  assert(state != nullptr);
  m_state = finsihed_t(state->count());
  }
  private:
  std::variant<init_t, running_t, finished_t> m_state;
  }
```

Ventajas: No necesitamos crear punteros, variant destruye automáticamente, get_if devuelve nullptr si no es del tipo, etc.
Inconvenientes: para extenderlo, hay que redefinir m_state.

La siguiente pregunta es dónde implementar la lógica de la aplicación
Si se hace en program_t, hay que estar comprobonda continuamente el estado.
ej:

```cpp
count_words(const std::string& web_page) {
assert(m_state.index() == 0);
m_state = runining_t(web_page);
...
counting_finished();
}
void counting_finished() {
const auto\* state = std::get_if<running_t>(&m_state);
assert(state e!= nullptr);
m_state = finsihed_t(state->count());
}
```

La forma recomendada es: poner la lógica que trata con un estado dentro del objeto que define el estado, y la lógica que realiza transiciones de estado en la aplicación principal.

Nota: medir tamaño: std::distance
Nota2: por qué get_if devuelve punteros? Para gestionar un caso especial: missing value.
Los punteros pueden tener muchos significados diferentes en diferentes situacioens, por lo que no son apropiados para comunicar para qué son usados.
Cuando una función devuelve un puntero, puede significar que:

- La función es una factoría que devuelve un objeto del cual nos haremos dueños.
- La función devuelve un puntero a un objeto ya existente del cual no somos dueños.
- La función puede fallar, y devuelve nullpointer como resultado.
  Por ello, en su lugar, es mejor declarar tipos que comunican con claridad el resultado. Por ejemplo:
- factoría: devolver std::unique_ptr;
- Segundo caso: std::shared_ptr
- Tercer aso: sustitir por un valor opcional 'no value present'. Es decir, podemos definir un tipo como una suma de type T o empty:
  struct nothing_t {};
  template <typename T>;
  using optional = std::variant<nothing_t, T>;

De hecho ya existe std::optional (y es más conveniente usarla).
Con ella, podemos reimplementar get_if:

```cpp
tempalte<typename T, template Variant>
std:::optiona<T> get_if(const Variant& variant) {
T* ptr = std::get_if<T>(&variant);
if(ptr) {
return *ptr;
} else {
return std::optional<T>();
}
}
```

si no sólo necesitamos saber si ha habido error o no, sino que necesitamos información sobre el error, podemomos devolver um sum type que puede contener un valor un error.
Por ejemplo,

```cpp
template<typename T, typename E>
class expected {
private:
union {
T m_value;
E m_error;
}

bool m_valid;
public:
T& get() {
if(!m_valid) {
throw std::logic_error("Missing a value");
}
return m_value;
}

E& error() {
if(m_valid) {
throw std::logic_error("there is no error");
}
return m_error;
}
```

}
.. Mirar resultado página 219

> Nota: funcionamientod e unsigned en c++ (super curioso: https://critical.eschertech.com/2010/04/07/danger-unsigned-types-used-here/)

Recomendación: en lugar de pensar en todos los datos encesarios para cubrir todos los posibles estados, y ubicarlos en una clase, es mejor pensar en como definir
el dato para que cubra sólo los posibles estados.

Para evitar estar constantemente comprobando si existe un valor en el std::variant, optianl, etc, muchos lenguajes funcioanles proveen una
sintaxis especial. Es algo parecido a un switch con esteroides, ya que no solo matchea contra valores específicos, sino con types y complex patterns.
template <typename... Ts>
struct overloaded : Ts... {using Ts::operator()...;};
template <typename... Ts> overloaded(Ts...) -> overloaded<Ts...>;

Con ello:

```cpp
void point_for(player wich_player) {
std::visit(
overloaded {
[&](const normal_scoring& state) {
// Increment score or switch state
},
[&](const forty_scoring& state) {
// player wins or switch to douce
},
[&](const deuce& state) {
// switch to advantage
},
[&](const advantage& state) {
// player wins or go back to deuce
},
m_state

    }

);
}
```

std::visit llamará a la función overloaded, y el objeto matcheará el tipo dado contra todos los overloads, ejecutando el que mejor matchee (type-wise).
Para desarrollar todo esto, existe la librería Mach7, capaz de escribir patrones avanzados.

### Tema 10 - Monads

Definiciones:
Functor:
Erroneamente se conoce como una clase con el operador llamada (class with call operator).
Realmente es un concepto muy abstracto, pero nosotros lo definiremos de una forma más intuitiva.
Una template class F es un functor si tiene definida una función transform (map) en ella.
Dicha función 'transform'toma una instancia 'f' de tipo F<T1> y una función t:T1 -> T2, y devuelve un valor de tipo F<T2>.
Es decir, devuelve como resultado de la transformación una instancia del mismo functor, pero en cuyo interior ha aplicado la transformación t.
La funcion transform necesita obedecer a las siguientes reglas:

- Transformar una instancia con una función identidad debe devolver el mismo functor.
- Transofrmar un functor con una función, y después con otro es lo mismo que transforma el functor con la composición de esas dos funciones:
  f | t1 | t2 == f | t2(t1)
  En resumen, un functor es un wrapper type que tieen una función transform cuyo comportamiento está bien definido.
  Por ejemplo, optional es un wrapper que contiene un único valor o nada. Si transformamos una instancia con valor, entonces recibimos otro option con el valor transformado.
  si transformamos una instancia optional sin ningún valor, entonces devolvemos un optional vacío.
  Por tanto, functors nos permiten con facilidad manejar transformaciones de wrapped values, pero tienen un inconveniente.
  Supongamos que las funciones intermedias pueden fallar, y que en vez de devolver strings, devuelven std::optional para manejar ese fallo.
  si intentamos componer multiples f unciones que reciben un valor y devuelven una instancia de un functor, los valores devueltos se irán apilando
  (en el caso de optional, se irán creando optional de optional de optional, por lo que habrá que elevar (lift), (desempaquetar) el valor anterior antes de pasarlo a la función transform siguiente.
  Para resolver el anidamiento, se puede crear una función (join) que elimina un nivel de animdamiento.
  Una mónada M<T> es un functor que tiene una función adicional definida que elimina un nivel de anidamiento:
  join: M<M<T>> -> M<T>
  De esta forma, podemos aplicar: transform | join | transform | joion.
  Para evitar tener que introducir todos estos join, se suelen integrar transform y join en una sola fución.
  De esta forma, decimos que una monada M es un wrapper type que tiene un constructor (una función que construye una instancia de M<T> a partir de un valor de typo T), y una función mbind (o bind), la cual es una composición de transform y joion:
  constructor: T -> M<T>
  mbind: (M<T1>, T1 ->M<T2>) -> M<T2>

Existen unas cuantas reglas para que un functor sea mónada. Sólo por enumerarlas:

- Si tenemos una función T1 -> M<T2>, y un valor de tipo T1, entonces envolver dicho valor con la mónada M y hacer binding con la función f es lo mismo que simplemente llamar a la función f sobre él:
  mbind(construct(a),f)) == f(a)
  - De la misma forma, si enlazamos un wrapped value a la función constructor, debemos obtener elmismo wrapped value:
    mbind(m,construct) == m\_
  - Por último, se define la asociatividad de mbind operation:
    mbind(mbind(m,f),g) == mbind(m, [](auto x) { return mbind(f(x), g) })

Ejemplos:
convertir un vector en un functor y después en una mónada.
