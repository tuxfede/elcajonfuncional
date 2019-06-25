---
title: "Template metaprogramming con Odin Thenerd"
date: "2019-04-01"
---

## Referencia

[Blog](http://odinthenerd.blogspot.com/

## Parte 1. Introducción

El blog introduce template metaprogramming usanado técnicas de C++11/14

### Introducción a las plantillas

Fueron diseñadas para implementar funciones y objetos genéricos, pero luego se descubrió que podían servir para 'metaprogramming'

### Function templates

Permiten sobreescribir funciones para todos los tipos

```c++
template<typename T>
T square(T in){
    return in*in;
}
```

La palabra clave 'template' comienza la definición de la plantilla. 'typename' especifica que el parámetro T debe ser de un tipo (por ejemplo, int o std::string). 'T' es un parámetro que se deduce en tiempo de compilación (o si se prefiere, una wildcard). Al usar la plantilla, el compilador deduce el tipo concreto de T que se necesita:

```c++
int i{2};
long double d{3.4};
auto ii = square(i);
auto dd = square(d);
```

En el ejemplo anterior, el compilador deduce que T es un entero en la primera llamada y un long double en la segunda.

### Class template

Son plantillas sobre estructuras o clases.

> Importante: class se refiere tanto a estructuras como clases. En cplusplus, una estructura y una clase son la misma cosa con la excepción de que en la estructura todos los miembros son públicos por defecto, mientras que en la clase son privados. Además, las estructuras se suelen usar para agrupar datos mientras que las clases se usan para gestionar datos internos.

Imaginemos que necesitamos devolver un array de tamano constante.

Una opción sería ponerlo en 'heap' llamando a new, pero sería muy ineficiente (malloc/new requiere mucho tiempo y es necesario usar delete[].

```c++
int* f(){
    auto a = new int[4];
    return a
}
```

Otra alternativa sería usar una estructura que envuelva el array:

```c++
struct MyArray{
    int data_[4];
};
MyArray f(){
    MyArray a;
    return a;
}
```

En caso de necesitar un array de 5 elementos de floats, para no tener que duplicar la estructura, podemos usar templates. Los parámetros de una plantilla pueden ser tipos (int, enum, short, char, bool, etc), punteros a funciones, punteros a objetos globales, punteros a data members, nullptr_t, etc. Además, para mejorar la seguridad de la estructura podemos hacer el mimebro data privado y proveer un operador indice que compruebe fronteras:

### Template specialization

Imaginemos que queremos usar MyArray, de forma que devuelva un array de 'unique_ptr' (los cuales no son copiables). Con la plantilla anterior, el compilador dará error. Para solucionarlo, podemos crear una versión 'Especializada' de MyArray que se puede usar para tipos no copiables:

```c++
template<typename T_PointerType, int I>
class MyArray<std::unique_ptr<T_PointerType>,I>{
     std::unique_ptr<T_PointerType> data_[I];
public:
    MyArray(const MyArray&) = delete; //no default copy constructor
    MyArray(MyArray&& other){
        //implement move constructor here
    }
};
```

Ahora tenemos una especialización de MyArray!!

En ella aparecen dos listas de parámetros:

- La primera lista (especialización) crea una lista de parámetros (T_pointerType, I)
- La segunda lista (generic template) crea una segunda lista de parámetros (std:unique_ptr<T_Pointertype, I)

Los parámetros de la primera lista pueden usarse para 'matchedar'los parámetros de la segunda lista.

Cuando el compilador trata de construir MyArray y se le pasan parámetros en tiempo de compilación, usará de entre todas las plantillas aquella más especializada que coincida con los parámetros pasados.

Por ejemplo: MyArray<int,4> no será capaz de usar la versión especializada (pues no se puede sustituir std::unique_ptr<T_PointerType> por un int). Sin embargo, MyArra<std::unique_ptr<float>,4> sí que funcionará correctamente, pues el compilador tomará como T_pointer a float, de forma que std::unique_ptr<T_pointer> será std::unique_ptr<float>

### Palabra clave 'using'

Para no tener que escribir 'MyArray<std::unique_ptr<float>, 4>', se pueden crear alias con la palabra clave 'using':

```c++
template<int I>
using FloatPointers = MyArray<std::unique_ptr<float>, I>

FloatPointers<5> a;
```

### Parámetros en tiempo de compilación

> A las plantillas sólo se les pueden pasar parámetros conocidos en tiempo de compilación

Por ejemplo, en el siguiente código el valor de i puede cambiar, por lo que el compilador dará error.

```c++
int i = 5;
f(i); //could change i
FloatPointes<i> a; //compiler error
```

Por tanto, para que compile, debemos hacer que i sea conocida en tiempo de compilación:

- const int i=4
- const int i=f() sólo funcionará si f es constexpr
- cuando se le asigna un class member, éste debe ser static const i
- un enum class member. Además, al no ser lvalue (no podemos obtener su dirección), el compilador puede actuar de forma más eficiente. Sin embargo, no se recomienda porque pueda causar confusión.

## Resumen

Con todas las herramientas anteriores, una variedad de templates llamada 'variadic templates' y un mecanismo llamado SFINAE se puede escribir código muy útil (metaprogramas)

## Parte 2. Factorial, el 'hola mundo' de metaprogramming

Comencemos como la versión clásica del factorial en cpp:

```c++
int factorial(int in){
    int sum{1};
    for(int i=1;i<=in;i++){
        sum = sum*i;
    }
    return sum;
}
```

Si ahora usamos sólo valores constantes:

```c++
int factorial(const int in, const int sum = 1){
    if(in > 1){
        return factorial(in-1,sum*in);
    }
    else {
        return sum;
    }
}

assert(factorial(4) == 24);  //unit test
```

Sin valores mutables no podemos hacer bucles, por lo que en su lugar hemos implementado la función de forma factorial.

A continuación mostraremos cómo podemos escribir esta función para que se ejecute en tiempo de compilación

### Constexpr metafunction

Una función que devuelve el tipo constexpr conocida como constexpr function) puede ejecutarse en tiempo de ejecución o de compilación. La única limitación es que no están permitidas sentencias 'if' (en c++17 sí está permitido). No obstante, para c++11/14, podemos usar el operador ternario:

```c++
constexpr int factorial(const int in, const int sum = 1){
    return (in > 1) ? factorial(in-1,sum*in): sum;
}

enum{ compileTimeGeneratedValue = factorial(4) };
static_assert(compileTimeGeneratedValue == 24,"error"); //unit test
```

Como se puede ver arriba, la función se ejecuta en tiempo de compilación (de otra forma no se podría haber inicializado el enumerado). Además, existe un nuevo asset (static_asset) que permite probar valores en tiempo de compilación y mostrar mensajes de error.

### Template metafunction

Podemos escribir la misma función anterior usando template metaprogramming (por ejemplo, en versiones más antiguas de compiladores no se soporta constexpr).

Cómo se puede escribir una template recursiva? Cómo escribir algo parecido a un 'if' para terminar la recursión? Para resolver las preguntas anterioers, primero veamos los siguientes casos:

```c++
//define a normal function
int f(int in) { return in+4; }

//define a template meta function
template<int In> struct F{ enum{ value = In+4}};

int i = f(9); //call a normal function
int i2 = F<9>::value; //call a template metafunction
```

Observaciones:

- Se usa lowerCalmelCase para nombres de funciones
- se usa UpperCamelCase para tipos
- Es una convención escribir parámetros de plantillas con el prefijo T (cuando elparámetro es un tipo) seguido de un UpperCamelCase name.
- El patrón 'coger un parámetro en tiempo de compilación, calcular un nuevo valor y guardar el resultado en un enumerado' es un bloque de construcción típico de template metaprogramming.

### Tomando decisiones en template metafunctions

Como no podemos usar 'if' (limitación de compiladores antiguos), se usará template specialization para conseguir algo similar:

```c++
// Versión general
int getLanceArmstrongSpeed(bool doping){
    if(doping){
        return 100;
    }
    else {
        return 85;
    }
}
int i1 = getLanceArmstrongSpeed(true);
int i2 = getLanceArmstrongSpeed(false);



// Versión templates
template<bool B_Doping>
struct GetLanceArmstrongSpeed {
    enum { value = 85 }
};
template<> //we must explicitly write an empty parameter list even
           //when we don't need any wildcards
struct  GetLanceArmstrongSpeed<true> {
    enum { value = 100 }
};

int i1 = GetLanceArmstrongSpeed<true>::value;
int i2 = GetLanceArmstrongSpeed<false>::value;
```

Cuando se llama a GetLanceArmstrongSpeed<true>::value, el sistema de especialización encuentra la coincidencia y obtiene el valor 100. Al llamar a false la especialización no funciona y se obtiene la versión genérica. Hemos conseguido una especie de if en el que primero se inteta la versión especializada y, si no funciona (si el if no se cumple), se intenta la versión genérica (else)

### Recursividad en template metafunctions

Se puede conseguir de varias formas. Una de ellas es mediante herencia: si una estructura hereda de ella misma pero con diferentes template parameters, entonces irá instanciándose recursivamente hasta que llegue a una especialización en la que no se hereda de nada..

```c++
//generic metafunction calls (inherits from) it self
template<int IIn, int ISum=1>
struct Factorial : Factorial<IIn-1,IIn*Sum>{}

//specialized metafunction has a value and does not inherit
template<int ISum> //take ISum as a wild card
struct Factorial<1,ISum>{
    enum{ value = ISum }
};

int i = Factorial<4>::value;

```

Explicación:

La plantilla genérica se irá instanciando hasta llegar a la versión especializada con IIn = 1, que recogerá el valor total en un enumerado.:

- Instanciamos una class template (le decimos al compilador que cree una clase por nosotros usando una plantilla y parámetros) Factorial con parámetro 4
- El compilador instancia Factorial<4,1>, usando el valor por defecto para el segundo parámetro ya que no le hemos dado ninguno.
- Para instanciar Factorial<4,1>, primero debe instanciar su clase base Factorial<3,4>, que instancia Factorial<2,12>, que instancia Factorial<1,24>, la cual es una especialización que termina la recursión e inicializa el enum value a 24

## Parte 3. Conociendo las herramientas básicas

En la parte 2, el factorial usado como 'hola mundo' no proporciona demasiado valor más allá de un primer ejemplo. Para poder avanzar, es necesario familizarizarse con algunas herramientas más (y tal vez construir algunas más)

Una función raramente usada en std::iota, la cual rellena un rango especificado con valores ascendentes. En metaprogramming necesitaremos estos valores con frecuencia. No obstante, como todo debe ser constante en metaprograming, necesitamos una alternativa. Por ejemplo, devolver un vector de enteros que comience en cero e incremente hasta un máximo:

```c++
template<int ...Is>
struct IntVector{
    using Type = IntVector<Is...>;
};
//make a vector named SomeNumbers
using SomeNumbers =  IntVector<5,4,3,2,1,0>;
```

El operador '...' se conoce como 'ellipsis operator' y se usa en la implementación de printf, indicando que printf puede tomar un número variable de argumentos. Como problema, la función queda definida en la implementación (y no en la definición).

En cambio, cuando aparece en una lista de parámetros de plantilla, '...Is' es un paquete de cero o más parámetros (conocido como parameter pack), todos de tipo enterno.

- template<int...Is> Is es un paquete de cero o más parámetros de tipo enterno. En el ejemplo, 5,4...,0.

> Cuando la elipsis se encuentra a la izquierda del nombre del parameter pack, se empaquetan todos los parámetros juntos en una única variable 'Is'. En cambio, cuando se usa la elipsis a la izquierda del nombre se le denomina pack expansion, donde los parámetros del paquete son expandidos de nuevo a una lista de elemntos separados por coma.

### Trabajando con IntVector

Veamos cómo usar 'SomeNumbers'. Para ello, creemos una metafunción que tome un IntVector y devuelva el valor del primer elemento:

```c++
//generic version only here to define top level parameters
template<typename T_Vector>
struct Front;

template<int I_First, int ...Is>
struct Front<IntVector<I_First,Is...>>{
    enum { value = I_First };
};

static_assert(Front<SomeNumbers>::value == 5,""); //unit test
```

Cómo funciona el código anterior?

- El compilador instancia Front<SomeNumbers>, que es: Front<IntVector<5,4,3,2,1,0>>. Para ello, el compilador usa la versión más especializada de Front, tomando el valor 5 para I_First y el resto para el paquete Is.

A continuación, crearemos una función llamda 'At' que tome un IntVector, un índice y devuelva el valor en ese índice. Para ello, usaremos nuevamente una función recursiva:

```c++
//generic version only here to define top level parameters
template<typename T_Vector, int I_Index>
struct At;

//specialization 1: not at index
template<int I_First, int... Is, int I_Index>
struct At<IntVector<I_First,Is...>, I_Index> :
    At<IntVector<Is...>, I_Index -1> {};

//specialization 2: at index
template<int I_First, int... Is>
struct At<IntVector<I_First,Is...>, 0>{
    enum { value = I_First };
};

static_assert(At<SomeNumbers,3>::value == 2,""); //unit test
```

Explicación:

- Al instanciar At<SomeNumbers, 3>::value, se elige la especialización 1 con I_First=5, Is=4,3,2,1 y I_Index=3. Dicha versión especializada instancia At<IntVector<3,2,1,0>,1>, que de nuevo instancia una especialización , que a su vez instancia At<IntVector<2,1,0>,0>, la cual es una especializacióhn 2 que define un valor y finaliza la recursión.

Se pueden observar dos parámetros:

- Metafunctions frecuentemente usan generic template sólo para definir los parámetros. La implementación se realiza puramente en diferentes especializaciones. Lo que deseamos realmente no es usar el tipo de entrada como un todo, sino desgranar sus parámetros para usarlos en la especialización. En este caso, como entrada se toma un tipo IntVector y se 'unwrap' usando especialización.
- Usamos funciones recursivas que definen un primer parámetros y un paquete con el resto.

De la misma forma, podemos hacer PushFront y pushBack para el array:

```c++
template<typename T_Vector, int I_New>
struct PushFront;
template<int ...Is, int I_New>
struct PushFront<IntVector<Is...>,I_New> : IntVector<I_New,Is...>{};

template<typename T_Vector, int I_New>
struct PushBack;
template<int ...Is, int I_New>
struct PushBack<IntVector<Is...>,I_New> : IntVector<Is..., I_New>{};

//unit test
static_assert(std::is_same<typename PushFront<typename PushBack<IntVector<1,2>,3>::Type,4>::Type,IntVector<4,1,2,3>>::value,"");

```

Pushback y PUshFront tomanm un Intvector y un entero, expanden IntVector y vuelven a empaquetar junto con el nuevo elemento.

De donde viene la variable 'Type'? De la definición de IntVector (ver arriba). Es una referencia a el objeto en sí.

Qué hace typename en este contexto? Si se instancia una class template y se quiere usar un tipo anidado en el interior de la plantilla, entonces debes decirle explicitamente al compilador que el nombre al final de tu statement es un tipo y no un valor.

Qué hace std::is_same? Es una metafuncion que toma dos tipos y devuelve true si son iguales.

Se podría haber implementado como:

```cpp
template<typename T, typename U>
struct IsSame : std::false_type {};
template<typename T>
struct IsSame<T,T> : std::true_type{};
```

### Encontrando cosas

A continuación vamos a implementar una función Find que devuelve el índice en el que algo se encuentra y otra función Contains que devuelve true o false dependiendo de si un valor puede ser encontrado en la lista:

```cpp
template<typename T_Vector, int I_Find, int I_Index = 0>
struct Find;

//not yet found specialization
template<int I_First, int ...Is, int I_Find, int I_Index>
struct Find<IntVector<I_First,Is...>,I_Find,I_Index> : Find<IntVector<Is...>,I_Find,I_Index+1>{};

//found specialization
template<int I_First, int ...Is, int I_Index>
struct Find<IntVector<I_First, Is...>,I_First,I_Index> {
    enum { value = I_Index };
};
//not found specialization
template<int I_Find, int I_Index>
struct Find<IntVector<>,I_Find,I_Index>{
    enum { value = -1};
};



template<typename T_Vector, int I_Find>
struct Contains {
    enum { value = (Find<T_Vector,I_Find>::value != -1) };
};

static_assert(Find<SomeNumbers,4>::value == 1, "");
// Find<IntVector<5,4,3,2,1,0>, 4, 0> // Match Not yet found
// Find<IntVector<4, 3, 2, 1, 0.>,4, 1>  // Match found

static_assert(Contains<SomeNumbers,1>::value, "");
static_assert(!Contains<SomeNumbers,9>::value, "");
```

### std::iota con template metaprogramming

Gracias a las construcciones de IntVector y PushFront, crear la metafunción iota es posible:

```cpp
template<int I_Size, typename T_Vector = IntVector<>>
struct Iota :
    Iota< I_Size-1, typename PushFront<T_Vector,I_Size-1>::Type> {};

template<typename T_Vector>
struct Iota<0,T_Vector> : T_Vector{};

static_assert(IsSame<typename Iota<4>::Type, IntVector<0,1,2,3>>::value, "");
```

Explicación:

- Instanciamos Iota<4> que en realidad es Iota<4,IntVector<>>
- El paso anterior instancia su clase base Iota<3,IntVector<3>>, que a su vez instancia Iota<2,IntVector<2,3>>... hasta instanciar Iota<0,IntVector<0,1,2,3>>, la cual finaliza la especialización y crea el tipo IntVector<0>.

### Traits classes

Hasta ahora hemos visto class templates que actuan como bien como funciones o bien como vectores. Aunque en template metaprogramming casi todo son class templates, en función de como se use esta tecnica obtendremos comportamientos de funciones, contenedores o lo que sea.

Traits templates son class templates usados de una forma diferente. Se asemejan a un std::map en el que se introduce una clave (un tipo en este caso), y se obtiene información asociada a dicha clave.

```cpp
template<typename T>
struct IsUnsigned : std::false_type{};
template<>
struct IsUnsigned<unsigned char> : std::true_type{};
template<>
struct IsUnsigned<unsigned short> : std::true_type{};
template<>
struct IsUnsigned<unsigned int> : std::true_type{};
template<>
struct IsUnsigned<unsigned long> : std::true_type{};

static_assert(IsUnsigned<unsigned int>::value,"");
static_assert(!IsUnsigned<int>::value,"");
```

La belleza de los traits classes radica en qeu se pueden agregar traits a posteriori. Por ejemplo, si olvidas 'unsigned long long'

## Parte 4. Generando look-up tables en tiempo de compilación

Vamos a estudiar otro ejemplo. en la cebecera ctype.h existe una función 'int touppder(intc')' que devuelve el caracter de entrada si éste no representa una letra minúscula o su equivalencia en mayúsculas en otro caso.

```cpp
int toupper ( int c ){
    if(c >= 'a' && c <='z'){
        return c - ('a'-'A');
    }
    return c;
}
```

En el código anterior se aprecian dos paths de control (3 por el cortocircuito), lo que significa que existen ramas condicionales, lo cual implica tiempo de procesado. Por otro lado, crear una look-up table con 256 valores almacenados en cache nos permitiría tener un único camino. El problema es crear dicha tabla manualmente (error prone).

### Creando una traits class

Primero transformaremos la función anterior en su equivalente plantilla:

```cpp
template<char C_In>
struct ToUpperTraits {
    enum { value = (C_In >= 'a' && C_In <='z') ? C_In -
        ('a'-'A'):C_In };
};
static_assert(ToUpperTraits<'m'>::value == 'M',""); //unit test
```

### Creando una look-up table

```cpp
template<typename T_Indexes>
struct ToUpperTable;
template<int ..Is>
struct ToUpperTable<IntVector<Is...>>{
    static char at(const char in){
        static const char table[] = {ToUpperTraits<Is>::value...};
        return table[in];
    }
}

int tableToUpper(int c){
    using Table =  ToUpperTable<typename Iota<256>::Type>;
    return Table::at(c);
}
```

En este caso el array lo hemos puesto como una funcion miembro estática para que sólo exista una vez y que el usuario no tenga que definirla. Si la hubiesemos puesto como un static member el usuario tendría que haberla definido en un cpp. Si no hubiese sido estática ocuparía mucha memoria y tendríamos que construir objetos ToUpperTable.

Cabe destacar que no se ha usado el operador 'ellipses' despues del parameter pack Is

### Hacinedo la look-up table configurable

Por ejemplo, para hacer que funcione con caracters alemanes, podemos especializar los traits antes del punto de instanciación:

```cpp
template<>
struct ToUpperTraits<'ä'> {
    enum { value = 'Ä' };
};
template<>
struct ToUpperTraits<'ö'> {
    enum { value = 'Ö' };
};
template<>
struct ToUpperTraits<'ü'> {
    enum { value = 'Ü' };
};

int tableToUpper(int c){
    using Table =  ToUpperTable<typename Iota<256>::Type>;
    return Table::at(c);   // <----- point of instantiation is here
}
```

### Parte 5. Overloading metafunctions

Imaginemos que, al igual hemos definido IntVector, queremos definir FooVector:

```cpp
struct Foo {};
Foo f1,f2,f3,f4;

template<Foo* ...Fs>
struct FooVector{};
using Foos = FooVector<&f1,&f2,&f3,&f4>;
```

Aunque todo parece correcto, cuando intentamos implementar PushBack agregando una especialización a la versión original:

```cpp
template<typename T_Vector, int I_New>
struct PushBack;

template<int ...Is, int I_New>
struct PushBack<IntVector<Is...>,I_New> : IntVector<Is..., I_New>{};

//adding specialization for FooVector
template<Foo* ...Fs, Foo* F_New>
struct PushBack<FooVector<Fs...>,F_New> : FooVector<Fs..., F_New>{};
```

El compilador nos muestra un error porque no puede haber dos diferentes tipos como segundo parámetro de la template.

Nótese que el segundo parámetro es un valor, no un tipo, por lo que necesitamos pasar un valor que pueda ser de varios tipos.

### Compile time variant

Para solucionar lo anterior, pasaremos un tipo variable como segundo parámetro que pueda contener entero, enum, puntero, etc.

```cpp
template<typename T, T V_Val>
struct Value{
    static const T value = V_Val;
};
```

De esta forma, Value puede contener cualquier non-type template parameter. Nótese que al declarar el valor como static tendremos que definirlo en un .cpp. Una solución más correcta sería usar constexpr

```cpp
template<typename T, T V_Val>
struct Value{
    constexpr const T value = V_Val;
};
```

### Actualizando PushBack

Gracias al Variant anterior, podemos redefinir PushBack:

```cpp
template<typename T_Vector, typename T_New>
struct PushBack;

template<int ...Is, int I_New>
struct PushBack<IntVector<Is...>,Value<int,I_New>> : IntVector<Is..., I_New>{};

template<Foo* ...Fs, Foo* F_New>
struct PushBack<FooVector<Fs...>,Value<Foo*,F_New>> : FooVector<Fs..., F_New>{};

```

Ahora hay que llamar a PushBack de forma diferente:

```cpp
using N = typename PushBack<SomeNumbers,Value<int,4>>::Type;
//rather than
using N = typename PushBack<SomeNumbers,4>::Type
```

### Usando la palabra clave 'using' para simplificar el uso

Si usamos 'using':

```cpp
template<int I>
using Int = Value<int,I>;
template<typename T, typename U>
using PushBackT = typename PushBack<T,U>::Type;
```

Ahora podemos escribir:

```cpp
using N = PushBackT<SomeNumbers,Int<4>>;
```

Observación. El compilador siempre sabe que un type alias (using) es un tipo, por lo que podemos usar PushBAckT donde necesitemos si tipo anidado 'Type' y no necesitamos escribir 'typename' todo el tiempo

### Haciendo las metafunciones genéricas aún más genéricas

Para no tener que escribir un contenedor Vector por cada non-type template parameter, muchos libros (incluída la librería boost MPL) usan la aproximación de envolver todos estos non-type parameters con type wrappers.

Nosotros, por probar, tomaremos otro camino. Para ello, haremos IntVector y FooVector alias del mismo vector type el cual requiere el tipo como primer argumento de su lista de parámetros:

```cpp
template<typename T, T ...V_Val>
struct Vector {
    using Type = Vector<T,V_Val...>;
};

template<int ...Is>
using IntVector = Vector<int, Is...>;

template<typename T_Vector, typename T_New>
struct PushBack;
template<typename T, T ...Vs, T V_New>
struct PushBack<Vector<T,Vs...>,Value<T,V_New>> : Vector<T, Vs..., V_New>{};
```

La solución anterior funciona para vectores de valores, pero no para vectores de tipos. Para solucionarlo, podemos crear un contenedor especial para una lista de tipos (a los que llamaremos List) y proveeremos especialización para todas nuestras metafunciones:

```cpp
template<typename... Ts>
struct List{
    using Type = List<Ts>;
}

template<typename T_Vector, typename T_New>
struct PushBack;
template<typename T, T ...Vs, T V_New>
struct PushBack<Vector<T,Vs...>,Value<T,V_New>> : Vector<T, Vs..., V_New>{};
template<typename ...Ts, typename T_New>
struct PushBack<List<Ts...>,T_New> : List<Ts..., T_New>{};
```

En esencia, hemos duplicado la cantidad de codigo necesario para cada función!! En esta situación, si quisiéramos especialización para cada ipo, tendríamos que escribir muchísimo código. Por ello, como practica habitual se envuelve todo en un type wrapper.

### Definición formal de metafunction

Es una class template que contiene un tipo anidado llamado Type, el cual puede entenderse como el valor devuelto por la función.

Por comodidad se suele proveer una delcaración 'ussing' con sufijo 'T' para permitir un acceso más directo a 'Type'.

Normalmente, una metafunction se referencia usando su alias FunctionNameT, mientras que un metafunctor (estudiaremos el concepto más adelante) se sufijan con 'F' para evitar colisión de nombres.

### Ejemplos:

Ejemplos de funciones que envuelven valures:

```cpp
template<typename T, T V_Value>
struct Value{
    using Type = Value < T, V_Value > ;
    static const T value = V_Value;
};

template<int I>
using Int = Value < int, I > ;

template<typename... Ts>
struct List{
    using Type = List < Ts... > ;
};

template<int... Is>
using IntList = List < Int<Is>... >;

template<typename T_Lhs, typename... T_Rhs>
struct JoinF;
template<typename... Ts, typename... Us, typename... T_Rest>
struct JoinF<List<Ts...>, List<Us...>, T_Rest...> : JoinF<List < Ts..., Us... >, T_Rest...>{};
template<typename... Ts, typename... Us>
struct JoinF<List<Ts...>, List<Us...>> : List < Ts..., Us... >{};
template<typename... Ts>
struct JoinF<List<Ts...>> : JoinF < Ts... >{};

template<typename T, typename... Ts>
using JoinT = typename JoinF<T, Ts...>::Type;

//takes inclusive exclusive index range [I_Begin, I_End)
template<typename T_List, int I_Begin, int I_End, typename T_Out = List<>>
struct SliceF;
template<typename T_First, typename... Ts, int I_Begin, int I_End, typename... Os>
struct SliceF<List<T_First, Ts...>, I_Begin, I_End, List<Os...>> : SliceF <List<Ts...>, (I_Begin - 1), (I_End - 1), List<Os...>>{};
template<typename T_First, typename... Ts, int I_End, typename... Os>
struct SliceF<List<T_First, Ts...>, 0, I_End, List<Os...>> : SliceF <List<Ts...>, 0, (I_End - 1), List<Os..., T_First>>{};
template<typename T_First, typename... Ts, typename... Os>
struct SliceF<List<T_First, Ts...>, 0, 1, List<Os...>> : List<Os...,T_First>{};

template<typename T_List, int I_Begin, int I_End>
using SliceT = typename SliceF<T_List,I_Begin,I_End>::Type;

template<typename T_List, typename T_New>
struct PushFrontF;
template<typename... Ts, typename T_New>
struct PushFrontF<List<Ts...>, T_New> : List < T_New, Ts... >{};

template<typename T_List, typename T_New>
using PushFrontT = typename PushFrontF<T_List,T_New>::Type;

template<typename T_List, typename T_New>
struct PushBackF;
template<typename... Ts, typename T_New>
struct PushBackF<List<Ts...>, T_New> : List < Ts..., T_New >{};

template<typename T_List, typename T_New>
using PushBackT = typename PushBackF<T_List,T_New>::Type;

template<typename T_List>
struct PopFrontF;
template<typename T_First, typename... Ts>
struct PopFrontF<List<T_First, Ts...>> : List <Ts...>{};

template<typename T_List>
using PopFrontT = typename PopFrontF<T_List>::Type;

template<typename T_List>
struct PopBackF;
template<typename... Ts>
struct PopBackF<List<Ts...>> : SliceF<List<Ts...>,0,sizeof...(Ts)-1>{};

template<typename T_List>
using PopBackT = typename PopBackF<T_List>::Type;

template<typename T_List, typename T_NewList = List<>>
struct ReverseF;
template<typename T_First, typename... T_Rest, typename... T_NewList>
struct ReverseF< List<T_First, T_Rest...>, List<T_NewList...>> : Reverse < List<T_Rest...>, List<T_First,T_NewList...> >{};
template<typename T_NewList>
struct ReverseF<List<>, T_NewList > : T_NewList{};
template<typename T_List>
using ReverseT = typename ReverseF<T_List>::Type;

//later we will see that Iota is just a special case for a more
//generic Sequence metafunction
template<int I_Size, typename T_Vector = List<>>
struct IotaF : IotaF< I_Size - 1, typename PushFront<T_Vector, Int<I_Size - 1>>::Type> {};
template<typename T_Vector>
struct IotaF<0, T_Vector> : T_Vector{};

template<int I>
using IotaT = typename IotaF<I>::Type;

```
