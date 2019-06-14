---
title: "Rust - Tutorial"
date: "2019-04-07"
---

## Librerías

Diesel

Orm. [Web oficial](http://diesel.rs/guides/schema-in-depth/)

## Formación

async book: [enlace](https://rust-lang.github.io/async-book/)

libro oficial: [enlace](https://doc.rust-lang.org/book/ch01-03-hello-cargo.html)

## Instalación

Instalar rustup

instalar windows build tools para Visual studio 2017

## Hola mundo

Manualmente:

```rust
rustc main.rs
```

Automático:

> Cargo crea un repositorio git local, un archivo de configuración por defecto y una carpeta src con hola mundo

```bash
$ cargo new hello_cargo
$ cd hello_cargo
$ cargo build
```

Como resultado, archivo en ./target/debug/hello_cargo.exe

Para ejecutar el código:

```bash
$ cargo run
```

Además, existe el comando rápido que comprueba el código (sin necesidad de producir ejecutable):

```bash
$ cargo check
```

Para compilar una versión release:

```bash
$ cargo build --release
```

## Introducción al lenguaje

Código básico:

```rust
use std::io; // io library from standard library

fn main() {  // entry point to the program
    println!("Guess the number!");  // La exclamación indica macro (!= función)

    println!("Please input your guess.");  // Finales de expresión con semicolon (;)

    let mut guess = String::new(); // Crea una nueva instancia de String.
                                   // :: indica que new es una función asociada al tipo string
    io::stdin().read_line(&mut guess)
        .expect("Failed to read line");

    println!("You guessed: {}", guess);
}

```

### Variables

Para crear variables:

```rust
let foo = bar; // inmutable
let mut bar=5; // mutable
```

La sintaxys ::new indica que 'new' es una función asociada al tipo 'String'. Está asociada pues, al tipo de datos, y no a una instancia particular. (equivale a metodos estáticos)

La función new crea una nueva cadena vacía.

```rust
io::stdin().read_line(&mut guess)
    .expect("Failed to read line");
```

Si no hubiésemos defiido 'use std::io', tendríamos que haber escrito la funcioón completa.

'.read_line(&mut guess)' llama al método read_line, que coge lo que el usuario escribe en la entrada estandard y lo coloca dentro de la cadena guess. La cadena de entrada tieene, por tanto, que ser mutable. El '&' india que el argumento es una referencia, lo que permite evitar copiar el dato en memoria multiples veces. Las referencias son inmutables por defecto, por lo que necesitamos dejar explícito que la modificaremos '&mut guess'

### El tipo 'result'

```rust
.expect("Failed to read line");
```

Cuando se llama a métodos usando la forma '.foo()' es habitual introducir una nueva linea / espacios en blanco para mejorar la legibilidad.

read_line devuelve 'io::Result'. Rust tiene un tipo de datos 'Result' genérico y uno específico para cada submódulo (en este caso: io::Result). Estos tipos son enumeraciones (enums), esto es, un tipo que puede tener un número fijo de valores (variants). En este caso, para Result, los posibles valores son 'Ok' y 'Err'. 'Ok' variant indica que la operación finalizó bien, y dentro de Ok se encuentra el valor generado. 'Err' indica que la operación falló, y dentro de Err se encuentra información sobre el cómo o por qué falló la operación.

Result, como casi todos los tipos, tiene métodos definidos. io::Result tiene definido el método 'expect'. Si la instancia de io::Result es un error, entonces expect forzará un crash y mostraré el mensaje pasado como argumento. Si io::Result es Ok, entonces expect cogerá el valor que almacena 'Ok' y lo devolverá para que sea usado.

Si no se llama a 'expect' el programa compilará pero dará un warning avisando que no se ha usado result value y, por tanto, no se han manejado posibles errores.

### Placeholders

```rust
let x = 5;
let y = 10;

println!("x = {} and y = {}", x, y);
```

### números aleatorios

Rust no incluye esta funcionalidad por defecto, pero se pueden usar librerías (crates) externas:

crate === colección de Rust source code files

En Cargo.toml (semantic versionnig)

```xml
[dependencies]

rand = "0.3.14"
```

> `0.3.14` is actually shorthand for `^0.3.14`, which means “any version that has a public API compatible with version 0.3.14.”

### Asegurar reproducible builds con cargo.lock file

Cuando se lanza cargo build por porimera vez se crea el archivo cargo.lock. En él cargo incluye todas las dependencias que complen el criterio. Cuando se vuelve a compilar el pryecto en el futuro, cargo mira el archivo cargo.lock y usa la versión especificada en lugar de calcular dicha versión.

> Es decir, el proyecto se mantiene en 0.3.14 hasta que de forma explícita se actualizada)

Para obtener nuevas versiones:

```rust
cargo update
```

## Ownership (continuación)

> [Ways Variables and Data Interact: Move](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#ways-variables-and-data-interact-move)

```rust
let s1 = String::from("hello");
let s2 = s1;

println!("{}, world!", s1);
```

Rust copia 'puntero, longitud, capacidad' en s2 (shallow copy (copia superficial)), pero además invalida s1. A este proceso (shallow copy e invalidación) se le conoce como 'move'. Se dice que s1 fue movida a s2.

Como consecuencia, por defecto Rust nunca creará copias 'profundas' de los datos, por lo que cualquier copia se asume 'barata' en términos de rendimiento

> [Ways Variables and Data Interact: Clone](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#ways-variables-and-data-interact-clone)

```rust
let s1 = String::from("hello");
let s2 = s1.clone();

println!("s1 = {}, s2 = {}", s1, s2);
```

Si se desea una copia profunda de los datos en 'heap' (no sólo stack data), se puede usar el método 'clone'.

> [Stack-Only Data: Copy](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#stack-only-data-copy)

```rust
let x = 5;
let y = x;

println!("x = {}, y = {}", x, y);
```

Para los tipos básicos (como enteros) no se usa 'clone', y aún así 'x' no es movido a 'y'.

Esto se debe a que los tipos cuyo tamano se conoce en tiempo de compilación son almacenados en la stack, por lo que las copias de dichos valores son rápidas. Como consecuencia, no hay diferencia entre deep y shallow copy para tipos de tamano conocido, por lo que 'clone' no marcaría ninguna diferencia.

Para estos tipos que son almacenados en stack, Rust tiene una anotación especial llamada 'Copy trait'. Si un tipo tiene 'copy trait', una variable antigua segurá siendo usable tras una asignación.

Nota: Rust no permite que un tipo se anote con 'Copy trait' si el tipo (o cualquier parte) ha implementado 'Drop trait'.

Los tipos básicos con 'copy trait' son enteros, booleanos, flotantes, caracteres y tuplas (si sólo contienen elementos básicos)

### Ownership y funciones

> Paso de parámetros

La semántica es la misma que la de asignaciones a variables; pasar una variable a una función la moverá o copiará:

```rust
fn main() {
    let s = String::from("hello");  // s comes into scope

    takes_ownership(s);             // s's value moves into the function...
                                    // ... and so is no longer valid here

    let x = 5;                      // x comes into scope

    makes_copy(x);                  // x would move into the function,
                                    // but i32 is Copy, so it’s okay to still
                                    // use x afterward

} // Here, x goes out of scope, then s. But because s's value was moved, nothing
  // special happens.

fn takes_ownership(some_string: String) { // some_string comes into scope
    println!("{}", some_string);
} // Here, some_string goes out of scope and `drop` is called. The backing
  // memory is freed.

fn makes_copy(some_integer: i32) { // some_integer comes into scope
    println!("{}", some_integer);
} // Here, some_integer goes out of scope. Nothing special happens.
```

> Devolución de valores y scope

La devolución de valoers también transfiere 'ownership'.

```rust
fn main() {
    let s1 = gives_ownership();         // gives_ownership moves its return
                                        // value into s1

    let s2 = String::from("hello");     // s2 comes into scope

    let s3 = takes_and_gives_back(s2);  // s2 is moved into
                                        // takes_and_gives_back, which also
                                        // moves its return value into s3
} // Here, s3 goes out of scope and is dropped. s2 goes out of scope but was
  // moved, so nothing happens. s1 goes out of scope and is dropped.

fn gives_ownership() -> String {             // gives_ownership will move its
                                             // return value into the function
                                             // that calls it

    let some_string = String::from("hello"); // some_string comes into scope

    some_string                              // some_string is returned and
                                             // moves out to the calling
                                             // function
}

// takes_and_gives_back will take a String and return one
fn takes_and_gives_back(a_string: String) -> String { // a_string comes into
                                                      // scope

    a_string  // a_string is returned and moves out to the calling function
}
```

Como se observa, el patrón se repite: asignar un valor a otra variable lo mueve. Cuando la variable incluye datos en heap y sale del ámbito, el valor se limpia usando 'drop' a menos que haya sido asignado a otra variable previamente.

Con lo aprendido hasta ahora, para usar en una función una variable con datos en 'heap' y poder seguir usándola al finalizar dicha función, tenemos que devolver esta variable. Esta tarea es tediosa. Por suerte, si queremos que una función use un valor pero que no sea propietario del mismo, podemos usar el concepto de 'referencia'.

### Referencias y préstamo (borrowing)

```rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize { // s is a reference to a String
    s.len()
} // Here, s goes out of scope. But because it does not have ownership of what
  // it refers to, nothing happens.
```

El símbolo ampersand indica referencias, y permiten referir a algún valor sin tomar posesión de él.

![referencia](trpl04-05.svg)

En este caso, no es necesario devolver el valor para devolver la propiedad, pues realmente nunca fuimos propietarios de la variable.

A tener referencia como parámetros de una función se le conoce como 'borrowing' (prestamo)

Al igual que las variables, las referencias son inmutables por defecto.

#### Referencias mutables

Si cambiamos 's' a mutable, creamos una referencia mutable y aceptamos referencias mutables como parámetros, entonces podremos cambiar string:

```rust
fn main() {
    let mut s = String::from("hello");

    change(&mut s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

> Las referencias mutables tienen una restricción muy importante: sólo se puede tener una referencia mutable a un trozo de datos en un scope concreto.

El siguiente código fallará:

```rust
let mut s = String::from("hello");

let r1 = &mut s;
let r2 = &mut s;

println!("{}, {}", r1, r2);
```

Permitir mutaciones de una forma controlada tiene el beneficio de prevenir en tiempo de compilación 'data races'. Un data race se produce cuando se dan estas tres condiciones

- Dos o más punteros acceden al mismo dato al mismo tiempo
- Al menos un puntero se está usando para escribir datos
- No hay mecanismo para sincronizar el acceso al dato.

De nuevo, se pueden usar curly brackets para crear un nuevo ámbito, permitiendo múltiple mutable references (pero no simultáneamente):

```rust
let mut s = String::from("hello");

{
    let r1 = &mut s;

} // r1 goes out of scope here, so we can make a new reference with no problems.

let r2 = &mut s;
```

De la misma forma, no podemos tener una referencia mutable y uhna inmutable a la vez; los usarios de la referencia inmutable no esperan que el valor cambie repentinamente. Sin embargo, múltiple referencias inmutables se aceptan porque ninguna modificará eld ato esperado.

#### Dangling references

En lenguajes con punteros, es facil crear dangling pointers (punteros huérfanos), esto es, punteros que referencian una posición de memoria que ha podido ser liberada por otra entidad.

En Rust, el co mpilador garantiza que los datos no se irán de ámbito antes de que lo haga la referencia.

Ejemplo en rust:

```rust
fn main() {
    let reference_to_nothing = dangle();
}

fn dangle() -> &String { // dangle returns a reference to a String

    let s = String::from("hello"); // s is a new String

    &s // we return a reference to the String, s
} // Here, s goes out of scope, and is dropped. Its memory goes away.
  // Danger!
```

Como s es creada dentro de dangle, cuando dicho método finaliza 's' se 'deallocated'. Como consecuencia, estamos intentando devolver una referencia a una zona de memoria inválida. Por ello, Rust no nos permitirá hacerlo. La solución es deolver String directamente

```rust
fn no_dangle() -> String {
    let s = String::from("hello");

    s
} //  Ownership is moved out, and nothing is deallocated.
```

#### Las reglas de las referencias

- En cualquier momento, sólo es posible tener o bien una referencia mutable o bien cualquier número de referencias inmutables
- Las referencias siempre deben ser válidas

## Slice type

Se trata de otro tipo que no tiene propiedad: slice. Slices te permiten referenciar una secuencia contigua de elementos en una colección en lugar de la colección completa.

Ejemplo: encontrar la primera palabra en un 'String' (separador: espacio). Para resolverlo, pensemos en la signatura de la función:

```rust
fn first_word(s: &String) -> ?
```

El parámetro &string es correcto: no queremos ownership y no vamos a modificar el valor de 's'. Qué deberíamos devolver?

Una opción podría ser devolver el índice del final de la palabra (usize)

```rust
fn first_word(s: &String) -> usize {
    let bytes = s.as_bytes(); // array

    for (i, &item) in bytes.iter().enumerate() { // iter == iterador; enumerate =(indice, valor)
        if item == b' ' {  // buscamos espacio
            return i;
        }
    }

    s.len()
}
```

El problema de éste método es que devuelve un número que sólo tiene sentido en el contexto de &String, pero no hay garantía de que siga siendo así en el futuro. Por ejemplo:

```rust
fn main() {
    let mut s = String::from("hello world");

    let word = first_word(&s); // word will get the value 5

    s.clear(); // this empties the String, making it equal to ""

    // word still has the value 5 here, but there's no more string that
    // we could meaningfully use the value 5 with. word is now totally invalid!
}
```

Éste programa compila bien, pero 'word' no está conectada al estado de 's', por loq ue seguirá valiendo '5' incluso cuando s ya no contiene nada. Para solucionar este problema, Rust propone 'string slices'

#### String slices

Una 'string slice' referencia parte de una cadena. Por ejemplo:

```rust
let s = String::from("hello world");

let hello = &s[0..5];
let world = &s[6..11];
```

[start..end] es un rango que comienza en start y continua hasta end sin incluirlo. Si se quiere incluir: [start..=end]. Internamiente, slice data structure almacena la posición inicial y la longitud, que se corresponde con end_index - start_index.

> Con la sintaxis '..', si se quiere comenzar con cero se puede omitir dicho valor: [..2].
>
> De la misma forma, si se quiere omitir el último elemento y llegar hasta el último byte, se puede omitir dicho término: [1..]

El tipo de string slices es '&str':

```rust
fn first_word(s: &String) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}
```

Gracias a esta nueva definición, el compilador puede avisarnos de errores:

```rust
fn main() {
    let mut s = String::from("hello world");

    let word = first_word(&s);

    s.clear(); // error!

    println!("the first word is: {}", word);
}


error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable
  --> src/main.rs:10:5
   |
8  |     let word = first_word(&s);
   |                           -- immutable borrow occurs here
9  |
10 |     s.clear(); // error!
   |     ^^^^^^^^^ mutable borrow occurs here
11 |
12 |     println!("the first word is: {}", word);
   |                                       ---- borrow later used here
```

clear necesita cambiar string, por lo que intenta obtener una referencia mutable, lo cual falla porque ya tenemos una referencia inmutable en 'word'!!

#### string literals son slices

```rust
let s = "hello world"
```

El tipo de s es &str. Es decir, es un slice apuntando a una zona concreta del binario.

#### string literals como parámetros

Si definimos la signatura de la función usando string slices, podemos hacer la API más general sin perder funcinalidad:

```rust
fn first_word(s: &str) -> &str {
    //...
}

fn main() {
    let my_string = String::from("hello world");

    // first_word works on slices of `String`s
    let word = first_word(&my_string[..]);

    let my_string_literal = "hello world";

    // first_word works on slices of string literals
    let word = first_word(&my_string_literal[..]);

    // Because string literals *are* string slices already,
    // this works too, without the slice syntax!
    let word = first_word(my_string_literal);
}


```

#### Otros slices

```rust
let a = [1, 2, 3, 4, 5];
let slice = &a[1..3];  // &[i32], almacena una referencia al primer elemento y una longitud
```

## Estructuras

Un 'struct' permite empaquetar múltiples valores relacionados en un grupo con significado propio.

A continuación compararemos structs con tuplas. Structs y enums son los bloques usados para crear nuevos tipos en el dominio del programa.

### Definición e instanciación

Al contrario que las tuplas, cada pieza de la estructura tiene un nombre, por lo que no se requiere un orden concreto para acceder a los valores de una instancia.

```rust
// Definition
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

// Instantiation
let user1 = User {
    email: String::from("someone@example.com"),
    username: String::from("someusername123"),
    active: true,
    sign_in_count: 1,
};

// Changing value
let mut user1 = User {
    email: String::from("someone@example.com"),
    username: String::from("someusername123"),
    active: true,
    sign_in_count: 1,
};

user1.email = String::from("anotheremail@example.com");

// Return new struct, transferring ownership
fn build_user(email: String, username: String) -> User {
    User {
        email: email,
        username: username,
        active: true,
        sign_in_count: 1,
    }
}
```

#### Usando 'field init shorthand' cuando variables y campos de la estructura tienen el mismo nombre

```rust
fn build_user(email: String, username: String) -> User {
    User {
        email,
        username,
        active: true,
        sign_in_count: 1,
    }
}
```

#### Crear instancias en base a otras instancias con datos actualizados

```rust
// struct update syntax
let user2 = User {
    email: String::from("another@example.com"),
    username: String::from("anotherusername567"),
    ..user1  // remaining fileds not explicity set should have the save value as user1
};
```

#### Tuple structs sin nombres para crear tipos diferentes

Es posible crear estructuras similares a tuplas, llamadas 'tuple structs'. Éstas estructuras no tienen asociados nombres a sus campos, sólo los tipos. Son útiles cuando se le quiere dar a toda la tupla un nombre y hacer que la tupla sea un tipo diferente a otras tuplas. Por ejemplo:

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

let black = Color(0, 0, 0);
let origin = Point(0, 0, 0);
```

De esta forma, una función que recibe como parámetro un Color no puede recibir un Point. Además, se puede acceder a sus campos a través de 'destructure', o a través de punto seguido de índice.

#### Unit-like structs sin campos

Se pueden crear estructuras sin campos!. Se conocen como 'unit-like structs' porque se comportan de forma similar a '()', el tipo 'unit'.

Son útiles para implementar un trato en un tipo pero no se tienen datos para almacenar en el tipo (se verá más adelante)

#### Ownership de struct data

La definición de 'User' usa el tipo 'String' en lugar de una referencia. Como consecuencia, cada instancia de esta estructura es propietario de todos sus datos, por lo qaue sus datos son válidos mientras la estructura sea válida.

Sin embargo, es posible almacenar en uan estructura referencias a datos de otros propietarios. No obstane, se requiere usar 'lifetimes' (lo veremos más adelante)

#### Agregar funcionalidades a estructuras con derived traits

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };

    println!("rect1 is {}", rect1); // error: trait bound 'std:fmt::Display' not satisfied
}
```

Para representar (imprimir por consola) instancias de Rectangle, hay que implemnetar 'Display'. No obstante, podemos probar con:

```rust
println!("rect1 is {:?}", rect1);
```

El especificador ':?' le indica a println! que use el formato de salida 'Debug'. 'debug trait' permite imprimir estructuras de una forma útil en la fase de desarrollo.

Sin embargo, requiere anotar explicitamente dicha funcionalidad en la estructura:

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };

    println!("rect1 is {:?}", rect1);
}
```

> También se puede usar '{:#?}', que imprime cada parámetro del structu en una nueva linea

### Method syntax

Los métodos son similares a funciones, pero están definidos en el contexto de un struct (o un enum, o un trait object), y su primer parámetro siempre es 'self', que representa a una instancia del struct.

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };

    println!(
        "The area of the rectangle is {} square pixels.",
        rect1.area()
    );
}
```

#### Operador ->

En c, existen dos operadores diferentes para usar métodos:

- '.' si se llama a un método de un objeto
- '->' si se llama a un método de un puntero al objeto.

En Rust, en cambio se usa 'automatic referencing'. Cuando se llama aun método con 'object.method()', Rust automáticamenge agrega &, &mut, \* para que la signatura coincida.

### Associated Functions

Los bloques 'impl' también permiten difinir funciones que no reciben 'self' como parámetro. Se les conoce como 'associated funmctions' porque están asociadas a la estructura, pero no son métodos porque no tienen una instancia con la que trabajar. Por ejemplo 'String::from' Se suelen usar en constructores

```rust
impl Rectangle {
    fn square(size: u32) -> Rectangle {
        Rectangle { width: size, height: size }
    }
}
```

### Múltiples bloques 'impl'

Se permite tener múltiples bloques impl por cada estructura

## Enums y pattern matching

Ejemplo: dirección ip (v4 o v6).

```rust
// definition
enum IpAddrKind {
    V4,
    V6,
}

let four = IpAddrKind::V4;
let six = IpAddrKind::V6;

// both values are of the same type, so we can call with either variant
fn route(ip_type: IpAddrKind) { }
route(IpAddrKind::V4);
route(IpAddrKind::V6);
```

Podemos crear una estructura que indique la dirección y el tipo:

```rust
enum IpAddrKind {
    V4,
    V6,
}

struct IpAddr {
    kind: IpAddrKind,
    address: String,
}

let home = IpAddr {
    kind: IpAddrKind::V4,
    address: String::from("127.0.0.1"),
};

let loopback = IpAddr {
    kind: IpAddrKind::V6,
    address: String::from("::1"),
};
```

No obstante, en Rust podemos representar el mismo concepto usando sólo el enumerado (en lugar de un enumerado dentro de una estructura):

```rust
enum IpAddr {
    V4(String),
    V6(String),
}

let home = IpAddr::V4(String::from("127.0.0.1"));

let loopback = IpAddr::V6(String::from("::1"));
```

Mediante esta forma, se asocian datos a cada variant, por lo que no es necesario crear estructuras adicionales. Además, cada variant puede tener diferente tipo y cantidad de datos asociados. Por ejemplo, Ipv4 siempre tendrá 4 componentes numéricos. Enums permite esto:

```rust
enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}

let home = IpAddr::V4(127, 0, 0, 1);

let loopback = IpAddr::V6(String::from("::1"));
```

De hecho, la std de rust define ipaddr usando enums y estrucutras asi:

```rust
struct Ipv4Addr {
    // --snip--
}

struct Ipv6Addr {
    // --snip--
}

enum IpAddr {
    V4(Ipv4Addr),
    V6(Ipv6Addr),
}
```

De esta forma, cualqueir función puede recibir un IpAddr y manejar simultáneamene v4 y v6. Sin enums, necesitaríamos una función para cada tipo de ip.

En enums también se pueden definir métodos usando 'impl'

### Option enum y ventajas sobre null values

Rust no implementa 'null'.Tony Hoare, el inventor de null, dijo:

(null references: the billion dollar mistake)

El problema es que si usas un 'null value' como un 'no null-value' , se obtiene un error, y es muy fácil que esto suceda. Sin embargo, el concepto que null intenta expresar sí que s útil: un valor que es inválido o la ausencia de un valor por alguna razón. El problema se encuentra en la implementación. Por ello, Rust tiene en su lugar un enumerado que codifica el concepto de presencia/ausencia de valor: option<T>:

```rust
enum Option<T> {
    Some(T),
    None,
}

let some_number = Some(5);
let some_string = Some("a string");

let absent_number: Option<i32> = None; // Si se usa None es necesario especificar el tipo de valor que guardaría Some.
```

Se puede usar 'Some' y None directamente sin usar el prefijo Option::.

Option<T> es mejor que null porque 'Option<T>' y T son diferentes tipos, por lo que el compilador no deja tratar Option<T> como si de T se tratase. Por ejemplo, el siguiente código no compila:

```rust
let x: i8 = 5;
let y: Option<i8> = Some(5);

let sum = x + y;
```

### Match control flow operator

Match permite comparar un valor contra una serie de patrones y ejecutar código basado en su coincidencia. El compilador se encarga de comprobar que todos los posibles casos son manejados

Ejemplo:

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u32 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}

```

#### Patterns that bind to values

Una funcionalidad de match es que puede relacionar partes de un valor que coinciden con el patrón:

```rust
#[derive(Debug)] // so we can inspect the state in a minute
enum UsState {
    Alabama,
    Alaska,
    // --snip--
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u32 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {  // Read state if match coin::quarter
            println!("State quarter from {:?}!", state);
            25
        },
    }
}
```

Importante: Matches en rust son exhaustivos: debe comprobar todas las posibilidades

#### Matching with option<T>

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

let five = Some(5);
let six = plus_one(five);
let none = plus_one(None);
```

#### El '\_' placeholder

Cuando no necesitamos listar todos los posibles valores:

```rust
let some_u8_value = 0u8;
match some_u8_value {
    1 => println!("one"),
    3 => println!("three"),
    5 => println!("five"),
    7 => println!("seven"),
    _ => (),
}
```

### Control de flujo con if let

'if let' permite combinar 'if' y 'let' de una forma más sencilla cuando se quiere hacer coincidir un patrón e ignorar el resto

```rust
let some_u8_value = Some(0u8);
match some_u8_value {
    Some(3) => println!("three"),
    _ => (),
}
```

En lugar de match, podríamos usar:

```rust
if let Some(3) = some_u8_value {
    println!("three");
}
```

Esta sintaxis toma un patrón y una expresión separadas por un paréntesis.

## Paquetes, crates y módulos

Rust tiene una serie de características relacionadas con 'scopes' (conocido como 'the module system'):

- Packages son Cargo features que permiten construir, probar y compartir crates
- Crates son un árbol de módulos que producen una librería o ejecutable
- Modules y la clave 'use' permiten controlar scope y privacidad
- Path es una forma de nombrar un elemento (estructura, función o módulo)

### Packages y crates (cajones/cajas)

- A _crate_ is a binary or library.
- The _crate root_ is a source file that is used to know how to build a crate.
- A _package_ has a _Cargo.toml_ that describes how to build one or more crates. At most one crate in a package can be a library.

> Cuando escribimos 'cargo new' estamos craeando un paquete!

En el interior de Cargo.Toml, no se hace referencia a main.rs. Por convención, si existe un directorio llamado 'src' con un fichero 'main.rs', entonces Cargo sabe que el paquete contiene un 'binary crate' con el mismo nombre que el paquete, y que src/main.rs es la raiz.

De la misma forma, si existe src/lib.rs, entonces el paquete contiene una librería.

Un paquete puede contener cero o una librería y tantos binarios como se quiera. Sin embargo, debe al menos tener un 'crate' en el paquete.

Si existen main.rs y lib.rs, entonces hay dos 'crates', ambos con el mismo nombre.

Un paquete puede tener múltiple binary crates colocándolos en el src/bin directorio.

### Module system

- Módulos: formas de organizar el código y control de la privacidad
- Paths: forma de llamar a elementos
- 'use' keyword, clave para traer un path dentro del scope
- 'pub' keyword, una clave para hacer los items públicos
- Renombrar items al traerlos al scope usando la palabra clave 'as'
- Usar paquetes externos
- Usar nested paths para limpiar 'use'
- Usar 'glob' operator para traer todo lo que hay en un módulo al scope
- Dividir módulos en en ficheros individuales

Ejemplo:

```rust
// Ejemplo 1
mod sound {
    fn guitar() {
        // Function body code goes here
    }
}

fn main() {

}

// Ejemplo 2
mod sound {
    mod instrument {
        mod woodwind {
            fn clarinet() {
                // Function body code goes here
            }
        }
    }

    mod voice {

    }
}

fn main() {

}

//
    crate
 └── sound
     └── instrument
        └── woodwind
     └── voice
```

### Hacer referencia a un item en el arbol de módulos

Una ruta (path) puede tomar dos formas:

- Path absoluto desde el crate_root usando un crate name o un 'crate litera'
- Path relativo que comienza en el módulo actual y usa 'self' o 'super' o un identificador en el módulo actual

```rust
mod sound {
    mod instrument {
        fn clarinet() {
            // Function body code goes here
        }
    }
}

fn main() {
    // Absolute path
    crate::sound::instrument::clarinet();

    // Relative path
    sound::instrument::clarinet();
}
```

### Módulos como límites de privacidad

- Todos los items son privados por defecto

- Se puede usar 'pub' keyword para hacer un item público

- No se permite usar código privado definido en un módulo hijo del actual.

- Se permite usar cualquier código definido en el módulo ascentro o el módulo actual.

  ```rust
  mod sound {
      pub mod instrument {
          pub fn clarinet() {
              // Function body code goes here
          }
      }
  }

  fn main() {
      // Absolute path
      crate::sound::instrument::clarinet();

      // Relative path
      sound::instrument::clarinet(); //sound no es público, pero está en el mismo lugar que la función.
  }
  ```

#### Usar 'pub' con structs y enums

Si se usa pub delante de una struct definition, se hace la estructura pública. Sin embargo, los campos son privados!

#### 'use' keyword para traer paths al scope

```rust
mod sound {
    pub mod instrument {
        pub fn clarinet() {
            // Function body code goes here
        }
    }
}
// absolute paths
use crate::sound::instrument;

fn main() {
    instrument::clarinet();
    instrument::clarinet();
    instrument::clarinet();
}

// relative paths
use self::sound::instrument;

fn main() {
    instrument::clarinet();
    instrument::clarinet();
    instrument::clarinet();
}
```

Para las funciones, es idiomático especificar el módulo padre de la función

Para estructuras y enumerados, es idiomático especificar el full path con 'use'

#### Renombrar usando 'as'

```rust
use std::fmt::Result;
use std::io::Result as IoResult;

fn function1() -> Result {
}
fn function2() -> IoResult<()> {
}
```

#### Nested paths

```rust
use std::{self, cmp::Ordering, io};
// ---snip---
```

#### Bringing All

```rust
use std::collections::*;
```

(\*)== glob operator

#### SEparar módulos en distintos archivos

```rust
// src/main.rs
mod sound;  // semicolon al final para que carge el contenido del módulo de otro archivo con el mismo nombre

fn main() {
    // Absolute path
    crate::sound::instrument::clarinet();

    // Relative path
    sound::instrument::clarinet();
}

// src/sound.rs
pub mod instrument {
    pub fn clarinet() {
        // Function body code goeshere
    }
}
```

## Colecciones

Rust std incluye estructuras comunes llamadas colecciones. Éstas pueden contener múltiples valores, y sus datos se almacenan en heap.

- Vector: almacena un número variable de valores del mismo tipo uno junto a otro
- string: colección de caracteres
- hash map: asocia a cada valur una clave particular. Implementación particular de 'map'

### Vector

```rust
let v: Vec<i32> = Vec::new();  // creación
```

Hemos agregado una anotación de tipo, pues al no haber insertado ningún valor, no se sabe a priori qué tipo de elementos se quieren almacenar.

Para crear un vectror con valores iniciales, rust proporciona la macro 'vec!':

```rust
let v = vec![1, 2, 3];
```

A continuación se enumeran algunas tareas con vectores:

```rust
// Agregar elementos
let mut v = Vec::new();

v.push(5);
v.push(6);
v.push(7);
v.push(8);


// Eliminar un vector elimina sus elementos
{
    let v = vec![1, 2, 3, 4];

    // do stuff with v
} // <- v goes out of scope and is freed here


// Leer elementos
let v = vec![1, 2, 3, 4, 5];

let third: &i32 = &v[2];
println!("The third element is {}", third);

match v.get(2) {
    Some(third) => println!("The third element is {}", third),
    None => println!("There is no third element."),
}


// Iterar sobre elementos
let v = vec![100, 32, 57];
for i in &v {
    println!("{}", i);
}


// Iterar sobre elementos y cambiar valor
let mut v = vec![100, 32, 57];
for i in &mut v {
    *i += 50;   // para cambiar el valor, se usa el operador dereferencia
}
```

#### Usar un enumerado para almacenar múltiples tipos

```rust

enum SpreadsheetCell {
    Int(i32),
    Float(f64),
    Text(String),
}

let row = vec![
    SpreadsheetCell::Int(3),
    SpreadsheetCell::Text(String::from("blue")),
    SpreadsheetCell::Float(10.12),
];
```

Si no se conocen todos los tipos que el programa manejara en tiempo de ejecución, entonces esta técnica no funciona. En su lugar, se pueden usar trait objects (más adelante)

## Manejo de errores

Rust no tiene excepciones. En su lugar, tiene el tipo Result<T,E> para errores recuperables (archivo no encontrado) y panic! macro que para la ejecución cuando un programa encuentra un error irrecuperable.

### Errores irrecuperables con panic!

Cuando la macro panic! se ejecuta, el programa imprime un mensaje de error,unwind (anda hacia atrás y limpia los datos de todas las funciones que encuentra)y limpia el stack y finaliza.

> En lugar de unwind, se puede abortar directamente sin liberar memoria. Es más rápido y requiere menos memoria. Se puede configurar en Cargo.toml:
>
> ```bash
> [profile.release]
> panic = 'abort'
> ```

Forzar un panic!:

```rust
fn main() {
    panic!("crash and burn");
}
```

#### Usar panic! backtrace

```rust
fn main() {
    let v = vec![1, 2, 3];

    v[99];
}
```

El ejemplo anterior trata de acceder a un índice que no existe. En otros lenguaejs (c), se produce buffer overread. En cambio, rust para la ejecución y rechaza continuar. Podemos ver la pila de llamada usando:

```rust
$ RUST_BACKTRACE=1 cargo run
```

### Errores recuperables con Result

Se encuentra incluido en prelude

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

Ejemplo:

```rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt");

    let f = match f {
        Ok(file) => file,
        Err(error) => {
            panic!("There was a problem opening the file: {:?}", error)
        },
    };
}
```

Ejemplo matching different errors:

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let f = File::open("hello.txt");

    let f = match f {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Tried to create file but there was a problem: {:?}", e),
            },
            other_error => panic!("There was a problem opening the file: {:?}", other_error),
        },
    };
}


// Version usando clojures (más refinada)
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let f = File::open("hello.txt").map_err(|error| {
        if error.kind() == ErrorKind::NotFound {
            File::create("hello.txt").unwrap_or_else(|error| {
                panic!("Tried to create file but there was a problem: {:?}", error);
            })
        } else {
            panic!("There was a problem opening the file: {:?}", error);
        }
    });
}
```

#### Accesos directos para panic cuando hay errores: unwrap y expect

'unwrap' es un método de Result que devuelve el resultado dentro del valor Ok. Si Result es Err, unwrap llama a la macro panic! por nosotros.

```rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt").unwrap();
}

thread 'main' panicked at 'called `Result::unwrap()` on an `Err` value: Error {
repr: Os { code: 2, message: "No such file or directory" } }',
src/libcore/result.rs:906:4
```

'expect' es similar a 'unwrap' pero permite elegir el mensaje de error que se muestra en panic!

#### Propagando errores

```rust
use std::io;
use std::io::Read;
use std::fs::File;

fn read_username_from_file() -> Result<String, io::Error> {
    let f = File::open("hello.txt");

    let mut f = match f {
        Ok(file) => file,
        Err(e) => return Err(e),
    };

    let mut s = String::new();

    match f.read_to_string(&mut s) {
        Ok(_) => Ok(s),
        Err(e) => Err(e),
    }
}
```

Esta función devuelve el usuario o un error, propagando el error detectado. Este patrón es tan común que Rust proporciona el operador 'question mark' '?' para hacerlo más facil:

```rust
use std::io;
use std::io::Read;
use std::fs::File;

fn read_username_from_file() -> Result<String, io::Error> {
    let mut f = File::open("hello.txt")?; // Asigna ok a f o deuelve el error
    let mut s = String::new();
    f.read_to_string(&mut s)?; // Devuelve la cadena si ok o error
    Ok(s)
}


// incluso más compacto
use std::io;
use std::io::Read;
use std::fs::File;

fn read_username_from_file() -> Result<String, io::Error> {
    let mut s = String::new();

    File::open("hello.txt")?.read_to_string(&mut s)?;

    Ok(s)
}
```

> El operador '? ' sólo puede usarse dentro de funciones que devuelven Result.
>
> En main, se puede hacer:
>
> ```rust
> use std::error::Error;
> use std::fs::File;
>
> fn main() -> Result<(), Box<dyn Error>> {
>  let f = File::open("hello.txt")?;
>
>  Ok(())
> }
> ```

#### Cuándo usar panic

- En ejemplos, prototipos, tests, etc. es buena idea usar unwrap y expect (código más legible, sin gestión de errores)
- En librerías también es conveniente para forzar una API
- En casos en los que, por la lógica de la aplicación, sabemos que algo no va a fallar (tenemos más información que el compilador), por ejemplo, parse() devuelve Result, pero para ciertas cadenas sabemos que nunca se prpoducirá error
- Cuando el código acaba en un estado incorrecto, se debería provocar panic para evitar que el programa se ejecute de forma extrana.

## Generic data types

### En definición de funciones

```rust
// No compila!!!!!!
fn largest<T>(list: &[T]) -> T {
    let mut largest = list[0];

    for &item in list.iter() {
        if item > largest {
            largest = item;
        }
    }

    largest
}

// Para que compile:
// al comparar item > largest, necesitamos especificar que 'T' debe cumplir 'PartialOrd'
// Además, T tiene que implementar el trait 'Copy' para mover el valor de list[0] en la variable largest
fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut largest = list[0];

    for &item in list.iter() {
        if item > largest {
            largest = item;
        }
    }

    largest
}

fn main() {
    let number_list = vec![34, 50, 25, 100, 65];

    let result = largest(&number_list);
    println!("The largest number is {}", result);

    let char_list = vec!['y', 'm', 'a', 'q'];

    let result = largest(&char_list);
    println!("The largest char is {}", result);
}
```

### En la definición de estructuras

```rust
// mismo tipo
struct Point<T> {
    x: T,
    y: T,
}

fn main() {
    let integer = Point { x: 5, y: 10 };
    let float = Point { x: 1.0, y: 4.0 };
}

// diferente tipo
struct Point<T, U> {
    x: T,
    y: U,
}

fn main() {
    let both_integer = Point { x: 5, y: 10 };
    let both_float = Point { x: 1.0, y: 4.0 };
    let integer_and_float = Point { x: 5, y: 4.0 };
}
```

### En definición de Enums

```rust
enum Option<T> {
    Some(T),
    None,
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

### En definición de métodos

```rust
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}

fn main() {
    let p = Point { x: 5, y: 10 };

    println!("p.x = {}", p.x());
}
```

Podemos, incluso, definir métodos que sólo existirán para instancias concretas, por ejemplo:

```rust
impl Point<f32> {
    fn distance_from_origin(&self) -> f32 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}
```

## Traits

Un 'trait' (rasgo, característica) le indica al compilador que un tipo tiene una funcionalidad particular compartida con otros tipos. Es decir, usamos 'trats' para definir comportamiento común de una forma abstracta. Similar a interfaces, pero con algunas diferencias

Los 'traits' son una forma de agrupar signaturas de métodos para definir un conjunto de comportamientos necesarios para cumplir algún propósito

Ejemplo:

```rust
// Definición del trato:
pub trait Summary {
    fn summarize(&self) -> String; // semicolon. Cada tipo implementará su comportamiento
}

// Ejemplo de tipos que lo implementan:
pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}

pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}

// Implementación por defecto
pub trait Summary {
    fn summarize(&self) -> String {
        String::from("(Read more...)")
    }
}

// Implementación por defecto que usa otra función del 'trait':
pub trait Summary {
    fn summarize_author(&self) -> String;

    fn summarize(&self) -> String {
        format!("(Read more from {}...)", self.summarize_author())
    }
}
```

> Para implementar un 'trait', debemos importarlo al scope actual (use ...). Para ello, debe ser un 'trait' público.
>
> Además, para implementar un 'trait' o bien el tipo o bien el trait deben ser locales a nuestro 'crate'. Es decir, no podemos implementar un 'trait' externo en un tipo 'externo'. A esta propiedad se le conoce como 'orphan rule', y es parte de un término más genérico llamado 'coherence'.

### Traits como argumentos

```rust
// short syntax
pub fn notify(item: impl Summary) {
    println!("Breaking news! {}", item.summarize());
}

// long syntax: Trait Bounds
pub fn notify<T: Summary>(item: T) {
    println!("Breaking news! {}", item.summarize());
}

// Gracias a traits bounds, podemos forzar que dos elementos ean del mismo tipo:
pub fn notify<T: Summary>(item1: T, item2: T){}

// Múltiples traits con '+'
pub fn notify(item: impl Summary + Display) {}
pub fn notify<T: Summary + Display>(item: T) {}

// Cláusula 'where' (más legible)
fn some_function<T, U>(t: T, u: U) -> i32
    where T: Display + Clone,
          U: Clone + Debug
{}

```

### Traits en valor devuelto

```rust
fn returns_summarizable() -> impl Summary {
    Tweet {
        username: String::from("horse_ebooks"),
        content: String::from("of course, as you probably already know, people"),
        reply: false,
        retweet: false,
    }
}
```

> El valor devuelto debe ser del mismo tipo en todas las ramas de la función

### Usar 'traits' para implementar métodos de forma condicional

```rust
use std::fmt::Display;

// Definición de pair
struct Pair<T> {
    x: T,
    y: T,
}

// Implementación de new para todos los tipos
impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Self {
            x,
            y,
        }
    }
}

// implementación de cmp_display para los tipos que implementan display y partialord
impl<T: Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.x >= self.y {
            println!("The largest member is x = {}", self.x);
        } else {
            println!("The largest member is y = {}", self.y);
        }
    }
}
```

### Implementar un 'trait' si el tipo implementa otro 'trait'

> Llamado 'blanket implementation'

```rust
// Implementar un trait si el tipo implementa otro trait
// se implementa ToString para los tipos que implemnetan Display
impl<T: Display> ToString for T {
    // --snip--
}
```

## Lifetime

Toda referencia en Rust tiene un tiempo de vida, que es el scope para el cual la referencia es válida.

La mayor parte del tiempo, lifetime son inferidas (al igual que los tipos). Debemos anotar lifetimes cuando existe más de una posibilidad y el compilador no tiene información para decidir.

A continuación mostraremos algunos tipos de anotiación

### Prevenir dangling references con lifetimes

```rust
{
    let r;
    {
        let x = 5;
        r = &x;
    }

    println!("r: {}", r); // Error, r está referenciando a un valor que salió de scope antes de ser usado.
}
```

Para evaluar las referencias, el compilador usa un 'borrow checker)':

```rust
{
    let r;                // ---------+-- 'a
                          //          |
    {                     //          |
        let x = 5;        // -+-- 'b  |
        r = &x;           //  |       |
    }                     // -+       |
                          //          |
    println!("r: {}", r); //          |
}                         // ---------+

// Corrección
{
    let x = 5;            // ----------+-- 'b
                          //           |
    let r = &x;           // --+-- 'a  |
                          //   |       |
    println!("r: {}", r); //   |       |
                          // --+       |
}                         // ----------+
```

### Generic lifetimes en funciones

```rust
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let string1 = String::from("abcd");
    let string2 = "xyz";

    let result = longest(string1.as_str(), string2);
    println!("The longest string is {}", result);
}
```

La función anterior no compila porque requiere anotar el lifetime del valor devuelto. Rust no sabe en tiempo de compilación si la referencia devuelta será x o y. Al definir la función, no se sabe qué valores concretos se le pasarán, por lo que no se sabe si se entrará en 'if' o 'else'. Además, no se conocen a priori los lifetimes de las referencias x,y, por lo que no se puede determinar si la referencia que se devuelve será siempre valida. Para corregirlo, se requiere anotación:

#### LIfetime annotation syntax

Las anotaciones no cambian el tiempo de vida de una referencia. En cambio, describen la relación entre el tiempo de vida de múltiples referencias, de forma que el compilador puede comprobar si dicha relación se cumple o no.

El nombre de los parámetros de lifetime comienzan con apóstrofe (') y se usan tipos genéricos en lowercase

Ejemplos:

```rust
&i32        // a reference
&'a i32     // a reference with an explicit lifetime
&'a mut i32 // a mutable reference with an explicit lifetime
```

Por ejemplo, imaginemos una fucnión con dos parámetros a y b con lifetime 'a. Esto indica que ambas referencias tienen el mismo lifetime genérico.

Para nuestro ejemplo anterior:

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

La signatura de la función indica que existe un lifetime 'a, que la función toma dos parámetros que viven al menos el mismo tiempo que 'a. Además, el valor devuelto también perdurará dicho lifetime.

Gracias a esta anotación el Borrow checker podrá rechazar cualquier valor que no cumpla dicha condición.

Cuando se usa la función longest con instancias concretas de x e y, el lifetime 'a se sustituye por la parte del scope de x que solapa el scope de y. Esto es, 'a tomará el menor lifetime intersección de x e y.

Ejemplo:

```rust
// Válido
fn main() {
    let string1 = String::from("long string is long");

    {
        let string2 = String::from("xyz");
        let result = longest(string1.as_str(), string2.as_str());
        println!("The longest string is {}", result);
    }
}

// Inválido
// Para que result sea válido en la sentencia println!, string2 tendría que ser valido hasta el final del outer scope.
// Nosotros sabemos que string1 será el valor devuelto de longer, y que string1 tiene el scope amplio, pero el borrow checker no lo sabe.
fn main() {
    let string1 = String::from("long string is long");
    let result;
    {
        let string2 = String::from("xyz");
        result = longest(string1.as_str(), string2.as_str());
    }
    println!("The longest string is {}", result);
}
```

### Lifetime annotations en definiciones de Struct

```rust
struct ImportantExcerpt<'a> {
   part: &'a str,
}

fn main() {
   let novel = String::from("Call me Ishmael. Some years ago...");
   let first_sentence = novel.split('.')
       .next()
       .expect("Could not find a '.'");
   let i = ImportantExcerpt { part: first_sentence };
}
```

La estructura tiene un campo, part, que almacena una referencia. Definimos el parámetro genérico de lifetime y lo usamos en el cuerpo de la estructura. Esto quiere decir que una instancia de la estructura no puede vivir más allá de la referencia que almacena en el campo 'part'

### Omisión de lifetime

La función first_word no tenía lifetime:

```rust
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}
```

Ésto se debe a que este patrón se repite una y otra vez, por lo que ha sido agregado al compilador para que, por defecto, introduzca:

```rust
fn first_word<'a>(s: &'a str) -> &'a str {}
```

Las reglas que sigue el compilador se llaman: lifetime elision rules

#### Lifetime en method definitions

```rust
impl<'a> ImportantExcerpt<'a> {
    fn level(&self) -> i32 {
        3
    }
}
```

### Static lifetime

Un lifetime especial es 'static, el cual denota que el lifetiem es toda la duración del programa.

Todos los string literals tienen un lifetime 'static:

```rust
let s: &'static str = "I have a static lifetime.";

```

### Generic types, trait bounds y lifetime, todo junto

```rust
use std::fmt::Display;

fn longest_with_an_announcement<'a, T>(x: &'a str, y: &'a str, ann: T) -> &'a str
    where T: Display
{
    println!("Announcement! {}", ann);
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

## Testing

Dijkstra: “Program testing can be a very effective way to show the presence of bugs, but it is hopelessly inadequate for showing their absence.”

### Escribir tests

Los Tests son funciones en rust que verifican que el código está funcionando de la forma en que se espera. Normalmente ejecutan las siguientes acciones:

1. Set up data or state
2. Run the code to test
3. Assert the result are what expected.

Un test es una función con el atributo 'test' anotado: '#[test]'

> Los atributos son metadatos sobre piezas de código rust.

Al ejecutar el comando `cargo test`, Rsut construye un binario 'test runner' que ejecuta las funciones anotadas, y reporta el resultado de cada función

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }

     #[test]
    fn another() {
        panic!("Make this test fail");
    }
}
```

Cada test se ejecuta en un nuevo hilo, y cuando el hilo principal comprueba que un test muere, lo marca como fallido.

#### assert! macro

Esta macro se usa para asegurar que una condición se evalua a true.

Si el valor es true, assert no hace nada y el test pasa. Si es false, se llama a la macro panic!.

```rust
#[derive(Debug)]
pub struct Rectangle {
    length: u32,
    width: u32,
}

impl Rectangle {
    pub fn can_hold(&self, other: &Rectangle) -> bool {
        self.length > other.length && self.width > other.width
    }
}

#[cfg(test)]
mod tests {
    use super::*;  // Importa rectangle

    #[test]
    fn larger_can_hold_smaller() {
        let larger = Rectangle { length: 8, width: 7 };
        let smaller = Rectangle { length: 5, width: 1 };

        assert!(larger.can_hold(&smaller));
    }
}
```

#### assert_eq! y assert_ne!

```rust
pub fn add_two(a: i32) -> i32 {
    a + 2
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_adds_two() {
        assert_eq!(4, add_two(2));
    }
}
```

#### Agregar mensajes de error

```rust
pub fn greeting(name: &str) -> String {
    format!("Hello !")
}

#[cfg(test)]
mod tests {
    use super::*;

  #[test]
    fn greeting_contains_name() {
        let result = greeting("Carol");
        assert!(
            result.contains("Carol"),
            "Greeting did not contain name, value was `{}`", result
        );
    }
}
```

#### Checking panic

```rust
impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 {
            panic!("Guess value must be greater than or equal to 1, got {}.",
                   value);
        } else if value > 100 {
            panic!("Guess value must be less than or equal to 100, got {}.",
                   value);
        }

        Guess {
            value
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic(expected = "Guess value must be less than or equal to 100")]
    fn greater_than_100() {
        Guess::new(200);
    }
}
```

#### Result en tests

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() -> Result<(), String> {
        if 2 + 2 == 4 {
            Ok(())
        } else {
            Err(String::from("two plus two does not equal four"))
        }
    }
}
```

### Configuración de cargo test

Test en paralelo -> necesita asegurar independencia. Si se necesita secuencialidad:

```bash
cargo test -- --test-threads=1
```

Mostrar valores que se imprimen durante el test (evitar captura de stdout):

```bash
$ cargo test -- --nocapture
```

Ejecutar un test unitario concreto:

```bash
$ cargo test one_hundred // nombre completo
$ cargo test add  // NOmbre parcial
```

Ignorar test

```rust
#[test]
fn it_works() {
    assert_eq!(2 + 2, 4);
}

#[test]
#[ignore]
fn expensive_test() {
    // code that takes an hour to run
}
```

Ejecutar sólo tests ignorados

```bash
cargo test -- --ignored
```

### Organización de tests

Unit tests: pequenos y enfocados a algo concreto; prueban un módulo de forma independiente, incluso prueban interfaces privadas.

Test de integración: externos a la librería; usan el código de la misma forma que otro lo haría, usando sólo interfaz pública. Potencialmente usa muchos módulos por test

#### Unit tests

> Convención:
>
> incluir los tests unitarios en el directorio src, en cada archivo con código. Crear un módulo llamado tests y anotar dicho módulo como cfg(test).

Esta anotación le dice al compilador que ejecute dicho código sólo cuando se ejecuta cargo test, y no cuando se ejecuta cargo build, ahorrando tiempo de compilación.

Los test de integración van en otro directorio, por lo que no requieren esta anotación

#### Tests de integración

> Convención:
>
> Crear directorio 'tests' junto a 'src' (mismo nivel)

Cargo compilará cada archivo de esta subcarpeta como un crate individual

```rust
// tests/integration_test.rs
use adder;  // Cada archivo en tests es un crate independiente; necesitamos importar el código a probar

#[test]
fn it_adds_two() {
    assert_eq!(4, adder::add_two(2));
}
```

Para ejecutar un test de integración concreto:

```bash
$ cargo test --test integration_test
```

#### Submódulos en tests de integración

Si queremos tener helper functions comunes para todos los tests de integración, no podemos hacerlo creando directamente un nuevo archivo (por ejemplo common.rs) , pues Rust lo trata como un test independiente.

En su lugar, podemos crear 'tests/common/mod.rs'. Esta convención le indica a Rust que no trate el módulo 'common' como un test de integración. Archivos en subdirectorios de tests no se compilan como un crate diferente, ni tienen secciones en la salida de tests.

```rust
//tests/common/mod.rs
pub fn setup() {
    // setup code specific to your library's tests would go here
}

// tests/integration_test.rs
use adder;

mod common;

#[test]
fn it_adds_two() {
    common::setup();
    assert_eq!(4, adder::add_two(2));
}
```

#### Integration tests for binary crates

Si un proyecto es un crate binario que solo contiene main.rs (y no tiene lib.rs), no podemos crear tests de integración y traer las funciones definidas en main.rs.

Por ello, habitualmente main.rs llama a lógica que vive en lib.rs. De sta forma, los tests de integración prueban la libreria.

## I/O Proyect

Ejemplo de proyecto de consola

### Leer argumentos de la línea de comandos

```rust
use std::env;

fn main() {
    let args: Vec<String> = env::args().collect(); // iterator to collection
    println!("{:?}", args);
}
```

#### Leer de archivo

```rust
use std::env;
use std::fs;

fn main() {
    // --snip--
    println!("In file {}", filename);

    let contents = fs::read_to_string(filename)
        .expect("Something went wrong reading the file");

    println!("With text:\n{}", contents);
}
```

#### Manejar errores

```rust
use std::process;

fn main() {
    let args: Vec<String> = env::args().collect();

    let config = Config::new(&args).unwrap_or_else(|err| {
        println!("Problem parsing arguments: {}", err);
        process::exit(1);
    });

```

```rust
use std::error::Error;

// --snip--

fn run(config: Config) -> Result<(), Box<dyn Error>> { // Trait object: La función devuelve un tipo que implementa el trait Error. dyn == dynamic
    let contents = fs::read_to_string(config.filename)?; // Return error value

    println!("With text:\n{}", contents);

    Ok(()) // No devuelve ningún valor; hemos llamado a run por los side effect que provoca
}

fn main() {
    // --snip--

    println!("Searching for {}", config.query);
    println!("In file {}", config.filename);

    if let Err(e) = run(config) {  // Comprobar si devuelve error
        println!("Application error: {}", e);

        process::exit(1);
    }
}
```

#### Environment variable

```rust
        let case_sensitive = env::var("CASE_INSENSITIVE").is_err();

// Windows
$ CASE_INSENSITIVE=1 cargo run to poem.txt

// powershell
$ $env:CASE_INSENSITIVE=1
$ cargo run to poem.txt
```

#### Printing errors to stdrerr

```rust
if let Err(e) = minigrep::run(config) {
        eprintln!("Application error: {}", e);
```

## Closures

Son funciones anónimas que puedes guardar en una variable o pasar como argumento a otras funciones.

Al contrario que las funciones, closures capturan valores del ámbito en que fueron definidas.

### Crear una abstracción de comportamiento con Clojures

Simularemos un algoritmo lento:

```rust
use std::thread;
use std::time::Duration;

fn simulated_expensive_calculation(intensity: u32) -> u32 {
    println!("calculating slowly...");
    thread::sleep(Duration::from_secs(2));
    intensity
}

fn main() {
    let simulated_user_specified_value = 10;
    let simulated_random_number = 7;

    generate_workout(
        simulated_user_specified_value,
        simulated_random_number
    );
}

fn generate_workout(intensity: u32, random_number: u32) {
    if intensity < 25 {
        println!(
            "Today, do {} pushups!",
            simulated_expensive_calculation(intensity)
        );
        println!(
            "Next, do {} situps!",
            simulated_expensive_calculation(intensity)
        );
    } else {
        if random_number == 3 {
            println!("Take a break today! Remember to stay hydrated!");
        } else {
            println!(
                "Today, run for {} minutes!",
                simulated_expensive_calculation(intensity)
            );
        }
    }
}
```

Existen casos en los que se llama dos veces a la función, otras ramas que no llaman a expensive calculation, etc.

A continuación refactorizaremos el código:

```rust
fn generate_workout(intensity: u32, random_number: u32) {
    let expensive_result =
        simulated_expensive_calculation(intensity);

    if intensity < 25 {
        println!(
            "Today, do {} pushups!",
            expensive_result
        );
        println!(
            "Next, do {} situps!",
            expensive_result
        );
    } else {
        if random_number == 3 {
            println!("Take a break today! Remember to stay hydrated!");
        } else {
            println!(
                "Today, run for {} minutes!",
                expensive_result
            );
        }
    }
}
```

Tras la refactorización, hemos unificado la llamada, ero se realiza incluso para ramas que no la necesitan.

Necesitamos definir el código en un lugar, pero sólo usarlo donde se necesita el resultado. Este es un buen caso para closures! Supongamos que, en lugar de la funcikón 'simulated_expensive_calculation', tenemos el closure:

```rust
let expensive_closure = |num| {
    println!("calculating slowly...");
    thread::sleep(Duration::from_secs(2));
    num
}; // need a semicolon
```

> The end of the closure need a semicolon to complete the let statement

> Closures no requieren que se anoten los tipos; ellos son almacenados en variables y usados sin nombrarlos ni exponerlos al usuario dde la librería, por lo que no necesitan ser interfaces explícitas.
>
> Normalmente son cortas y relevantes en un contexto cercano. En dichas con diciones, el compilador puede inferir los tipos de parámetros y vaolor devuelto.
>
> No obstante, es posible agregar anotaciones si se quiere ser más verboso o por claridad.
>
> Los tipos se infieren en tiempo de compilación y se comprueba que siempre sean iguales.

### Almacenar closures usando Generic parámeters y el trait 'Fn'

El código anterior sigue calculando closures más veces de las necesarias. Una opción es guardar el resultado del cálculo en una variable para reusarla. Sin embargo, éste método crea código repetitivo.

En su lugar, podemos crear una estructura que almacena el closure y el valor resultado. La estructura ejecutará el closure sólo si necesitamos el valor resultante, y cacheará este valor para que el resto del código no tenga esta responsabilidad. A esta técnica se le conoce como 'memoization' o 'lazy evaluation'

Para crear una estructura que almacena un closure, se necesita especificar el tipo de closure. Cada instancia de closure tiene su propio tipo anónimo, por lo que para definhir estructuras con closures, necesitamos generics y trait bounds.

Todos los closures implementan al menos uno de estos traits: Fn, FnMut, FnOnce

```rust
struct Cacher<T>
    where T: Fn(u32) -> u32
{
    calculation: T,
    value: Option<u32>,
}

impl<T> Cacher<T>
    where T: Fn(u32) -> u32
{
    fn new(calculation: T) -> Cacher<T> {
        Cacher {
            calculation,
            value: None,
        }
    }

    fn value(&mut self, arg: u32) -> u32 {
        match self.value {
            Some(v) => v,
            None => {
                let v = (self.calculation)(arg);
                self.value = Some(v);
                v
            },
        }
    }
}
```

> Las funciones también pueden implementar Fn traits. Por tanto, si lo que queremos hacer no requiere capturar un valor, podemos usar funciones en lugar de closures

Gracias al closure anterior, el ejemplo queda:

```rust
fn generate_workout(intensity: u32, random_number: u32) {
    let mut expensive_result = Cacher::new(|num| {
        println!("calculating slowly...");
        thread::sleep(Duration::from_secs(2));
        num
    });

    if intensity < 25 {
        println!(
            "Today, do {} pushups!",
            expensive_result.value(intensity)
        );
        println!(
            "Next, do {} situps!",
            expensive_result.value(intensity)
        );
    } else {
        if random_number == 3 {
            println!("Take a break today! Remember to stay hydrated!");
        } else {
            println!(
                "Today, run for {} minutes!",
                expensive_result.value(intensity)
            );
        }
    }
}
```

Ahora, el cálculo 'expensive' sólo se ejecuta, como mucho, una vez.

Problemas de la implmeentación actual: siempre devuelve un único valor, independientemente de los sucesivos argumentos. Para solucionarlo: map en lugar de valor suelto.

SEgundo problema: sólo acepta un tipo concreto de closures.

### Capturando el entorno con closures

Los closures son capaces de capturar su entorno y acceder a variables del scope donde fueron definidas

```rust
// Funciona con closures
fn main() {
    let x = 4;
    let equal_to_x = |z| z == x;
    let y = 4;

    assert!(equal_to_x(y));
}

// No funciona con 'funciones'
fn main() {
    let x = 4;
    fn equal_to_x(z: i32) -> bool { z == x }
    let y = 4;

    assert!(equal_to_x(y));
}
```

Esto tiene una sobrecarga de memoria.

Closures pueden capturar valores de tres formas diferentes:

- taking ownership (FnOnce): consume variable it captures. 'Once' indica que el closure no puede tomar propiedad de la misma variable más de una vez
- borrowing mutably (FnMut); can change environment
- borrowing inmutable (Fn)

Cuando se crea un closure, Rust infiere el tipo de trato basado en los valores del entorno que utiliza.

> Si se quiere forzar que el closure tome la propiedad de los valores, se puede usar 'move' keyword antes de la lista de parámetros. Es útil para pasar un closure a un nuevo hilo donde se deben pasar los datos.

Ej:

```rust
fn main() {
    let x = vec![1, 2, 3];

    let equal_to_x = move |z| z == x;

    println!("can't use x here: {:?}", x); // No compila, x ha sido capturado por el closure

    let y = vec![1, 2, 3];

    assert!(equal_to_x(y));
```

## Iteradores

El patrón iterador permite hacer tareas sobre una secuencia de elementos en orden. El iterador determina la lógica de iteración sobre cada elemento y cuándo la secuencia ha finalizado.

> En rust, los iteradores son lazy
>
> ```rust
>
> let v1 = vec![1, 2, 3];
> let v1_iter = v1.iter(); // no hace nada aún
>
> for val in v1_iter {
>     println!("Got: {}", val);
> }
> ```

### Iterator 'trait' y 'next' method

Todos los iteradores implementan 'Iterator' trait:

```rust
trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;

    // methods with default implementations elided
}

// Implementar el trait iteraotr requiere que se defina el tipo 'item', y que éste tipo sea el devuelto por el método next. Además, sólo requiere que se implemente el método next

// Ejemplo de llamada a next manualmente:
#[test]
fn iterator_demonstration() {
    let v1 = vec![1, 2, 3];

    let mut v1_iter = v1.iter(); // iterador sobre referencias inmutables

    assert_eq!(v1_iter.next(), Some(&1));
    assert_eq!(v1_iter.next(), Some(&2));
    assert_eq!(v1_iter.next(), Some(&3));
    assert_eq!(v1_iter.next(), None);
}
```

> La nueva sintaxis 'type Item' y 'Self::Item' definen un tipo asociado con su trait.

Obsérvese que hay que hacer el iterador mutable porque su estado interno cambia con cada llamada a next. Enm el bucle for no es necesario porque loop toma propiedad de v1_iter y lo hace mutable.

Los valores devueltos por next son referencias inmutables a los valores del vector.

> Si queremos un iterador que tome propiedad sobre v1 y devuelva valores, podemos llamar a 'into_iter'. De la misma forma, podemos llamar a 'iter_mut' para obtener referencias mutables

### Métodos que consumen al 'iterator'

El trait 'iterator' tiene muchos métodos con implementación por defecto. De entre ellos, algunos hacen uso del método 'next' en su definición. A dichos métodos se les conoce como 'consuming adaptors', pues llamarlos hace avanzar en el iterador. Por ejemplo, 'sum':

```rust
#[test]
fn iterator_sum() {
    let v1 = vec![1, 2, 3];

    let v1_iter = v1.iter();

    let total: i32 = v1_iter.sum(); // Tras esta linea, no podemos volver a usar v1_iter, pues sum tomó propiedad del mismo.

    assert_eq!(total, 6);
}
```

### Métodos que producen otros iteradores

Los métodos definiudos en Iterator trait que permiten cambiar al iterador en otro tipo de iterador se conocen como 'iterator adaptors'. Se pueden encadenar múltiples iteradores adaptors para llevar a cabo acciones complejas de una forma legible. Como los iteradores son lazy, hasta que no se llame a un consuming adaptor method no se obtendrán resultados. Ejemplo, 'map':

```rust
let v1: Vec<i32> = vec![1, 2, 3];
v1.iter().map(|x| x + 1); // nunca es llamado

// para consumir el iterador: collect. Éste método cosnume el iterador y recolecta los resultados en una colección:
let v1: Vec<i32> = vec![1, 2, 3];
let v2: Vec<_> = v1.iter().map(|x| x + 1).collect();
assert_eq!(v2, vec![2, 3, 4]);

```

### Usando closures para capturar el entorno

Ahora podemos mostrar el uso de 'filter' iterator adaptor. Éste toma un closure que coje cada item de un iterador y devuelve un booleano. Si el booleano devuelto por el closure es true, entonces el valor se incluye en el iterador producido por filter. Si el closure devuelve falso, el valor no se incluye.

Por ejemplo: closure que captura shoe:

```rust
#[derive(PartialEq, Debug)]
struct Shoe {
    size: u32,
    style: String,
}

fn shoes_in_my_size(shoes: Vec<Shoe>, shoe_size: u32) -> Vec<Shoe> {
    shoes.into_iter()
        .filter(|s| s.size == shoe_size)
        .collect()
}

#[test]
fn filters_by_size() {
    let shoes = vec![
        Shoe { size: 10, style: String::from("sneaker") },
        Shoe { size: 13, style: String::from("sandal") },
        Shoe { size: 10, style: String::from("boot") },
    ];

    let in_my_size = shoes_in_my_size(shoes, 10);

    assert_eq!(
        in_my_size,
        vec![
            Shoe { size: 10, style: String::from("sneaker") },
            Shoe { size: 10, style: String::from("boot") },
        ]
    );
}
```

### Crear tu propio tipo de iteradores

Se pueden crear iteradores para otras colecciones de la librería estandard, como hash map. Incluso en tus propios tipos. Por ejemplo, contador:

```rust
struct Counter {
    count: u32,
}

impl Counter {
    fn new() -> Counter {
        Counter { count: 0 }
    }
}
impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        self.count += 1;

        if self.count < 6 {
            Some(self.count)
        } else {
            None
        }
    }
}

#[test]
fn calling_next_directly() {
    let mut counter = Counter::new();

    assert_eq!(counter.next(), Some(1));
    assert_eq!(counter.next(), Some(2));
    assert_eq!(counter.next(), Some(3));
    assert_eq!(counter.next(), Some(4));
    assert_eq!(counter.next(), Some(5));
    assert_eq!(counter.next(), None);
}

#[test]
fn using_other_iterator_trait_methods() {
    let sum: u32 = Counter::new().zip(Counter::new().skip(1))
                                 .map(|(a, b)| a * b)
                                 .filter(|x| x % 3 == 0)
                                 .sum();
    assert_eq!(18, sum);
}
```

## CArgo y crates.io

Cargo tiene dos perfiles principales: dev (cargo build) y release (cargo build --release)

```ini
[profile.dev]
opt-level = 0

[profile.release]
opt-level = 3
```

### Documentation comments

EStos comentarios especiales generarán documentación html. Usan tres slashes /// y soportan anotaciones markdown

````rust
/// Adds one to the number given.
///
/// # Examples
///
/// ```
/// let five = 5;
///
/// assert_eq!(6, my_crate::add_one(5));
/// ```
pub fn add_one(x: i32) -> i32 {
    x + 1
}
````

Para generar documentación:

```bash
cargo doc --open
```

Secciones comunes:

- Examples. Además de servir de ejemplo, cargo test los ejecutará
- Panics: Escenarios en los que la función causa panic
- Errors: Tipos de errores que puededn ocurrir
- Safety: si la función es unsafe, explicación del por qué y convenciones que se esperan.

Otro estilo de documentación: //!, agrega documentación al item que contiene el comentario. Se suele usar dentro de crate root file (src/lib.rs), o dentro de un módulo para docuemntar el módulo como un todo:

Ej:

```rust
//! # My Crate
//!
//! `my_crate` is a collection of utilities to make performing certain
//! calculations more convenient.

/// Adds one to the number given.
// --snip--
```

### Exportar public API con pub use

Se pueden crear 'alias', esto es, re-exportar items para hacerlos con una estructura pública diferente de la privada. Por ejemplo, una librería art con dos módulos (kinds and utils):

```rust
/! # Art
//!
//! A library for modeling artistic concepts.

pub mod kinds {
    /// The primary colors according to the RYB color model.
    pub enum PrimaryColor {
        Red,
        Yellow,
        Blue,
    }

    /// The secondary colors according to the RYB color model.
    pub enum SecondaryColor {
        Orange,
        Green,
        Purple,
    }
}

pub mod utils {
    use kinds::*;

    /// Combines two primary colors in equal amounts to create
    /// a secondary color.
    pub fn mix(c1: PrimaryColor, c2: PrimaryColor) -> SecondaryColor {
        // --snip--
    }
}
```

Otro crate que depende de esta librería necesitaría usar use para traer elementos de art al scope. Para ello, tiene que saber dónde se encuentran primarycolor y mix

```rust
use art::kinds::PrimaryColor;
use art::utils::mix;

fn main() {
    let red = PrimaryColor::Red;
    let yellow = PrimaryColor::Yellow;
    mix(red, yellow);
}
```

Para simplificar esto, podemos crear una API pública:

```rust
//! # Art
//!
//! A library for modeling artistic concepts.

pub use kinds::PrimaryColor;
pub use kinds::SecondaryColor;
pub use utils::mix;

pub mod kinds {
    // --snip--
}

pub mod utils {
    // --snip--
}
```

De esta forma, en la documentadción aparecern como 'Reexports' PrimaryColor, SecondaryColor, Mix, y el segundo crate podrá usarlos direcatmente:

```rust
use art::PrimaryColor;
use art::mix;

fn main() {
    // --snip--
}

```

### Cargo Wrokspaces

Si el proyecto crece y necesitas dividir el package en muchas librerías, Cargo ofrece una característica llamada workspaces que ayuda a gestionar muchos paquetes relacionados que se desarrollan en tandem

> Un workspace es un conjunto de packages que comparten el mismo Cargo.lock y output directory.

Pongamos por ejemplo un proyecto que use dos librerías y un binario:

```bash
mkdir add
cd add
```

A continuación crearemos el fichero de configuración del workspace:

```bash
vim Cargo.toml

[workspace]

members = [
    "adder",
]
```

A continuadción crearemos el crate binario:

```bash
cargo new adder
cargo build
```

En este punto, el arbol de directorios debe ser:

```bash
├── Cargo.lock
├── Cargo.toml
├── adder
│   ├── Cargo.toml
│   └── src
│       └── main.rs
└── target
```

El adder target no tiene su propio directorio target. En cambio, los artefactos deben compilarse en add/target

Para crear un segundo crate, en el directorio raiz (add) editar Cargo.toml:

```bash
[workspace]

members = [
    "adder",
    "add-one",
]
```

y Crear una nueva librería:

```bash
$ cargo new add-one --lib
```

Ahora la estructura de directorios debe ser:

```bash
├── Cargo.lock
├── Cargo.toml
├── add-one
│   ├── Cargo.toml
│   └── src
│       └── lib.rs
├── adder
│   ├── Cargo.toml
│   └── src
│       └── main.rs
└── target
```

A continuación, indicaremos que el binario depende de add-one. En el fichero adder/Cargo.toml:

```bash
[dependencies]

add-one = { path = "../add-one" }
```

Para ejecutar el binario:

```bash
cargo run -p adder
```

Cabe destacar que Cargo.lock sólo existe en el top level del workspace. Por elo, todos los crates usan la misma versión de dependencias.

No obstante, hay que indicar en cada Cargo.toml las dependencias de esa librería

Para agregar tests al workspace ...

### Instalar binarios de crates.io con cargo install

> Sólo se pueden instalar paquetes que tienen binary targets.

Todos los binarios se almacenarán en la carpeta /bin (por defecto, \$HOME/.cargo/bin)

### Extendiendo cargo con comandos personalizados

si un binario en el PATH se llama cargo-something, se puede llamar con 'cargo something'. En cargo --list pueden verso todos los comandos.

## Smart pointers

Un puntero es un concepto general sobre una variable que dcontiene una dirección de memoria. Eesta dirección apunta a otro dato.

El puntero más común en Rust es la referencia (& toma prestado el valor al que apunta). No tiene sobrecarga ni capacidades especiales.

Los smart pointers, por otro lado, son estructuras de datos que no sólo actúan como punteros, sino que aportan información y capacidades adicionales. En Rust, las referencias son punteros que toman prestado el dato, mientras que los smart pointers se aduenan del dato al que apuntan.

String y Vec<T> son dos smart pointers: toman el control de la memoria y permiten manipularla. ADemás, tienen metadatos (capacity) y capacidades o garantías (por ejemplo, String asegura datos válidos UTF-8)

Un smartpointer es una estructura que implementa:

- 'Deref': Permite instanciar un smart pointer struct para que se comporte como una referencia
- 'Drop': Permite customizar el código que se ejecuta cuando una instancia del smartpointer sale del scope.

De entre todos los smart pointers, existen 3 muy comunes en std:

- Box<T>: Asigna valores en heap
- Rc<T>: Reference counting que permite propiedad múltiple
- Ref<T> y RefMut<T>: Son accesibles a través de RefCell<T>, un tipo que asegura las reglas de préstamo en tiempo de ejecución en lugar de en tiempo de compilación

Por último, cabe destacar el patrón 'interior mutability', donde un tipo inmutable expone una API para mutar un valor interior.

### Box<T>

Boxes permiten almacenar datos en heap en lugar de stack. En stack sólo queda el puntero. No hace nada más.

Se suele usar en los siguientes casos:

- Cuando se tiene un tipo; de tamano variable y se quiere usar un valor de dicho tipo en un contexto que requiere un tamano conocido
- Cuando se tienen muchos datos y se quiere transferir la propiedad asegurando que los datos no se copiarán en el proceso

#### Usar Box<T> para almacenar datos en Heap

```rust
fn main() {
    let b = Box::new(5);
    println!("b = {}", b);
}
```

b es alojado en heap. El programa mostrará al dato dentro de box de la misma forma que lo haría si éste estuviese en stack. Cuando Box sále de su ámbito, se libera la memoria de box (alojado en stack) y del dato al que apunta (alojado en heap)

#### Tipos recursivos con Box

Imaginemos el siguiente ejemplo (cons list, de lisp):

```rust
enum List {
    Cons(i32, List),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    let list = Cons(1, Cons(2, Cons(3, Nil)));
}
```

Rust no puede compilar este enum porque tiene una definición recursiva de sí mismo, por lo que desconoce el tamano en tiempo de compilación (tamano infinito). Para determinar el espacio de un enum, Rust inspecciona cada una de las variantes y comprueba cuál requiere más memoria, siendo este el tamano del enumerado (pues sólo contendrá un tipo de elemento a la vez).

Para solucionar el problema, podemos cambiar la definición de la estructura para que almacena un Box<T> (puntero de tamano conocido). De esta forma, Box apuntará a la siguiente List que estará en heap. De esta forma, hemos roto la cadena recursiva infinita y el compilador puede calcular el tamano requerido para lista

```rust
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    let list = Cons(1,
        Box::new(Cons(2,
            Box::new(Cons(3,
                Box::new(Nil))))));
}
```

### 'Deref' trait

Este trait permite personalizar el comportamiento del operador 'dereference operator \*'. Implementando Deref un smart pointer puede ser tratado como una referencia regular, por lo que cualquier función que opere con referencias puede usar elmismo código con smart pointers.

Una referencia es un tipo de puntero, y una forma de pensar en un puntero es en una flecha que apunta a un valor almacenado en alguna parte. Con el operador dereference se puede seguir la referencia hasta el dato:

```rust
fn main() {
    let x = 5;
    let y = &x;

    assert_eq!(5, x);
    assert_eq!(5, *y);
}
```

Si hiciésemos assert_eq!(5,y); obtendríamos un error de compilación, pues son diferentes tipos.

Si en lugar de una refernecia usamos un smart ponter Box, el funcionamiento es el mismo:

```rust
fn main() {
    let x = 5;
    let y = Box::new(x);

    assert_eq!(5, x);
    assert_eq!(5, *y);
}
```

#### Creando nuestro propio smart pointer

```rust
struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

fn main() {
    let x = 5;
    let y = MyBox::new(x);

    assert_eq!(5, x);
    assert_eq!(5, *y);
}
```

MyBox es un 'tuple struct' con un elemento de tipo T. La función new recibe un parámetro de tipo T y devuelve un MyBox que almacena dicho valor.

Si agregamos la funci'n main anterior, el código no compila, pues MyBox<T> no puede ser dereferenciada (aún no hemos implementado Defer trait)

Si implementamos deref:

```rust
use std::ops::Deref;

impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.0
    }
}
```

Observaciones:

- `type Target = T;` define un tipo asociado para el trait Deref. Un tipo asociado es otra forma de declarar parámetros genéricos.
- El método deref devuelve `&self.0`, esto es, una referencia al valor que queremos acceder con el operador '\*'.
- Cuando en main se usa `*y`, internamente el compilador lo traduce en `*(y.deref())`
  - deref devuelve una referencia y posteriormente se hace la dereferencia para que Mybox mantenga la propiedad de la variable.

#### Implicit Deref coercions con funciones y métodos

Deref coercion es una convención que Rust realiza en argumentos a funciones y métodos. Convierte (una referencia a un tipo que implementa Deref) en (una referencia a un tipo que Deref puede convertir en el tipo original). Esta convención sucede automáticamente cuando pasamos una referencia a un valor de un tipo particular como argumento a una función cuyo tipo de parámetro definido no coincide

Ejemplo:

```rust
fn hello(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    let m = MyBox::new(String::from("Rust"));
    hello(&m);
}
```

Deref coerciion permite llamar a hello usando un MyBox<String>. El argumento &m es una referencia a Mybox<String>,, que Rust convierte (a través de Defer) en &String

Si no existiese éste mecanismo, tendríamos que haber escrito:

```rust
fn main() {
    let m = MyBox::new(String::from("Rust"));
    hello(&(*m)[..]); // (*m) para dereferenciar Mybox<string> en STring. & y [..] para coger un string slice de String
}
```

Rust analiza los tipos y usa Deref::deref tantas veces como sea necesario hasta hacer que el tipo de parámetro coincida con la definición de la función. Dicho número de veces se calcula en tiempo de compilación.

#### Deref y mutabilidad

Deref sobreescribe el operador _ en referencias inmutables. De la misma forma, 'DerefMut' sobreescribe _ en referencias mutables.

Rust ejecuta deref coercion cuando encuentra types y traits en estos casos:

- From `&T` to `&U` when `T: Deref<Target=U>`
- From `&mut T` to `&mut U` when `T: DerefMut<Target=U>`
- From `&mut T` to `&U` when `T: Deref<Target=U>`
  - Este caso indica que Rust también fuerza una referencia mutable a una inmutable (no al contrario)

### Drop trait

Drop permite personalizar lo que sucede cuando un valor sale de scope. Drop se puede especificar para cualquier tipo, no solo punteros.

Ejemplo:

```rust
struct CustomSmartPointer {
    data: String,
}

impl Drop for CustomSmartPointer {
    fn drop(&mut self) {
        println!("Dropping CustomSmartPointer with data `{}`!", self.data);
    }
}

fn main() {
    let c = CustomSmartPointer { data: String::from("my stuff") };
    let d = CustomSmartPointer { data: String::from("other stuff") };
    println!("CustomSmartPointers created.");
}
```

Rust llama a drop cuando las instancias salen de ámbito. Además, las variables son eliminadas en sentido inversio a su creación (d es dropped antes que c)

No podemos llamar a drop por nuestra cuenta. Si queremos forzar un 'drop' antes de que su variable asociada salga de ámbito, tenemos que usar std::mem::drop:

```rust
// MAL
fn main() {
    let c = CustomSmartPointer { data: String::from("some data") };
    println!("CustomSmartPointer created.");
    c.drop();
    println!("CustomSmartPointer dropped before the end of main.");
}

// BIEN
fn main() {
    let c = CustomSmartPointer { data: String::from("some data") };
    println!("CustomSmartPointer created.");
    drop(c);
    println!("CustomSmartPointer dropped before the end of main.");
}
```

### Rc<T>

Reference Counted Smart Pointer. En ocasiones un único valor pertenece a muchos propietarios. Por ejemplo, en un grafo múltiples 'edges' pueden a puntar a un mismo 'nodo', por lo que todos los 'edges' son propietarios de dicho nodo. Un nodo no debería ser eliminado hasta que han sido eliminados todos sus 'edges'.

Rc<T> hace un seguimiento del número de referencias al valor para determinar si dicho valor aún se encuentra en uso o no. Simil: Televisión en habitación familiar (hasta ue no se va el último no se apaga).

> Rc<T> sólo se puede usar en escenarios mono-hilo.

Ejemplo usando list:

```rust
// MAL: cons variant se hace propietaria del dato que almacena, por lo que al crear b, a se mueve a su interior. Por ello, cuando intentamos usar nuevamente a al crear c, no está permitido.
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    let a = Cons(5,
        Box::new(Cons(10,
            Box::new(Nil))));
    let b = Cons(3, Box::new(a));
    let c = Cons(4, Box::new(a));
}


// BIEN: Ahora, cada Cons almacena un valor un Rc<T> apuntando a una List. Cuando se crea b, en lugar de tomar propiedad de a, se clona Rc<List> que 'a' almacena, incrementando el número de referencias y compartiendo propiedad.
// Rc::clone incrementa el contador.
enum List {
    Cons(i32, Rc<List>),
    Nil,
}

use List::{Cons, Nil};
use std::rc::Rc;

fn main() {
    let a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))));
    let b = Cons(3, Rc::clone(&a));  // Por convenio, usar Rc::clone en lugar de a.clone(). Ninguno hace deep copy, pero viendo la syntaxis es más fácil detectar .clone en el código que sí pueden generar probleams de rendimiento.
    let c = Cons(4, Rc::clone(&a));
}

```

Podemos ver el contador usando: `Rc::strong_count(&a)`

Rc<T> no permite múltiple mutable references, pues violaría las reglas de préstamo. Para poder usar Rc<T> y mutar datos, se usa el patrón 'interior mutability' y 'RefCell<T>'

### RefCell<T> y 'Interior Mutability Pattern'

'Interior Mutability' es un patrón de diseno que permite mutar datos inclusoc uando lo que existen son referencias inmutables a datos. Para ello, el patrón usa 'unsafe code' dentro de una estructura de datos para saltarse las reglas de Rust.

Podemos usar tipos que usan este patrón de forma que podemos asegurar las reglas de préstamo en runtime, incluso cuando el compilador no pueda garantizarlas. Para ello, el codigo 'unsafe' es envuelto en una 'safe API', permaneciento el exterior inmutable.

Para analizarlo , presentemos el tipo RefCell<T>, el cual sigue dicho patrón

#### RefCell<T>

Representa propiedad única sobre el dato que almacena (igual que Box<T>). Lo que lo diferencia es que, mientras que en Box las reglas de préstamo se requieren en tiempo de compilación, con RefCell se aseguran en tiempo de ejecución. Recordemos dichas reglas:

- At any given time, you can have _either_ (but not both of) one mutable reference or any number of immutable references.
- References must always be valid.

Con referencias, si se rompen estas reglas, se generan errores de compilación. Con RefCell, si se rompen dichas reglas, el programa generará panic y finalizará. La desventaja de comprobar las reglas en tiempo de ejecución es que tiene impacto en performance, se necesita ejecutar código para comprobar su validez, etc. Como ventaja, ahora podemos usar ciertos escenarios memory-safe que antes estaban prohibidos por el compilador.

El análisis estático de rust es conservativo. Dado que algunos análisis son imposibles, si el compilador de Rust no puede asegurar que el código cumple con las reglas de propiedad, rechaza un programa. RefCell es útil cuando tu estás seguro de que tu código sigue las reglas de préstamo pero el compilador no puede entender y garantizar esta premisa.

> RefCell sólo es válido en escenarios mono-hilo.

En resumen:

- `Rc<T>` enables multiple owners of the same data; `Box<T>` and `RefCell<T>` have single owners.
- `Box<T>` allows immutable or mutable borrows checked at compile time; `Rc<T>` allows only immutable borrows checked at compile time; `RefCell<T>` allows immutable or mutable borrows checked at runtime.
- Because `RefCell<T>` allows mutable borrows checked at runtime, you can mutate the value inside the `RefCell<T>` even when the `RefCell<T>` is immutable.

#### Interior Mutability

Como consecuencia de las rglas de préstamo, el siguiente código no compila

```rust
fn main() {
    let x = 5;
    let y = &mut x; // No se puede prestar una variable local inmutable como mutable
}
```

Sin embargo, hay situacioens en las que es útil que un valor se mute a si mismo haciendo uso de sus métodos, pero que parezca 'inmutable' para el resto. Gracias a RefCell<T> podemos obtener mutabilidad interior: el borrow checker del compilador permitirá dicha mutabilidad interior, y borrowing rules se comprobarán en tiempo de ejecución.

#### Ejemplo de interior mutability: mock objects

Un test double es un tipo que se usa en lugar de otro durante las pruebas. Mock objects son un tipo específico de test doubles que registra lo que sucede durante un test para poder preguntarle cosas.

Rust no tiene objetos en el sentido en que otros lenguajes lo tienen. Tampoco tiene funcionalidades de mock objects en std. Sin embargo, se pueden crear estructuras que sirvan el mismo propósito.

Como ejemplo: crearemos una librería que sigue un valor contra un máximo y envía mensajes para indicar cómo de cerca del máximo se está.

```rust
pub trait Messenger {
    fn send(&self, msg: &str);
}

pub struct LimitTracker<'a, T: 'a + Messenger> {
    messenger: &'a T,
    value: usize,
    max: usize,
}

impl<'a, T> LimitTracker<'a, T>
    where T: Messenger {
    pub fn new(messenger: &T, max: usize) -> LimitTracker<T> {
        LimitTracker {
            messenger,
            value: 0,
            max,
        }
    }

    pub fn set_value(&mut self, value: usize) {
        self.value = value;

        let percentage_of_max = self.value as f64 / self.max as f64;

        if percentage_of_max >= 1.0 {
            self.messenger.send("Error: You are over your quota!");
        } else if percentage_of_max >= 0.9 {
             self.messenger.send("Urgent warning: You've used up over 90% of your quota!");
        } else if percentage_of_max >= 0.75 {
            self.messenger.send("Warning: You've used up over 75% of your quota!");
        }
    }
}
```

Messenger trait tiene un método llamado send, el cual recibe como parámetros una referencia INMUTABLE a send. Esta es la interfaz que el mock object necesita tener. Además, queremos probar el comportamiento de set_value. Queremos probar que se envían los mensajes adecuados.

Supongamos que implementamos el siguiente mock:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    struct MockMessenger {
        sent_messages: Vec<String>,
    }

    impl MockMessenger {
        fn new() -> MockMessenger {
            MockMessenger { sent_messages: vec![] }
        }
    }

    impl Messenger for MockMessenger {
        fn send(&self, message: &str) {
            self.sent_messages.push(String::from(message));
        }
    }

    #[test]
    fn it_sends_an_over_75_percent_warning_message() {
        let mock_messenger = MockMessenger::new();
        let mut limit_tracker = LimitTracker::new(&mock_messenger, 100);

        limit_tracker.set_value(80);

        assert_eq!(mock_messenger.sent_messages.len(), 1);
    }
}
```

Éste código no funciona porque en la línea 11 estamos cambiando 'self', cuando lo que tenemos es unaa referencia inmutable!!. Tampoco podemos cambiar la signatura de la función, pues es la definida en el trato!

En este caso, interior mutability puede ayudar. Para ello, almacenaremos sent_messages en un RefCell<T>:

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use std::cell::RefCell;

    struct MockMessenger {
        sent_messages: RefCell<Vec<String>>,
    }

    impl MockMessenger {
        fn new() -> MockMessenger {
            MockMessenger { sent_messages: RefCell::new(vec![]) }
        }
    }

    impl Messenger for MockMessenger {
        fn send(&self, message: &str) {
            self.sent_messages.borrow_mut().push(String::from(message)); // Obtenemos referencia mutable Ref<T>
        }
    }

    #[test]
    fn it_sends_an_over_75_percent_warning_message() {
        // --snip--

        assert_eq!(mock_messenger.sent_messages.borrow().len(), 1);  // Obtenemos referencia inmutable RefMut<T>
    }
}
```

#### Múltiples owners de datos mutables combinando Rc<T> y RefCell<T>

```rust
#[derive(Debug)]
enum List {
    Cons(Rc<RefCell<i32>>, Rc<List>),
    Nil,
}

use List::{Cons, Nil};
use std::rc::Rc;
use std::cell::RefCell;

fn main() {
    let value = Rc::new(RefCell::new(5));

    let a = Rc::new(Cons(Rc::clone(&value), Rc::new(Nil)));

    let b = Cons(Rc::new(RefCell::new(6)), Rc::clone(&a));
    let c = Cons(Rc::new(RefCell::new(10)), Rc::clone(&a));

    *value.borrow_mut() += 10;

    println!("a after = {:?}", a);
    println!("b after = {:?}", b);
    println!("c after = {:?}", c);
}
```

La std incluye otros tipos que facilitan la mutabilidad, como Cell<T> (el valor es copiado en lugar de dar una referencia) o Mutex<T> (mutabilidad interior multihilo)

### Memory leaks

Rust hace dificil, pero no imposible, crear memoria que nunca se limpia (memory leak).

Rc<T> y RefCell<T> permiten crear referencias donde un item referencia a otro y el otro al primero (referencia cíclica).

Esto crea memory leaks porque el contador de referencias nunca alcanza cero y el valor nunca se elimina Ejemplo:

```rust
use std::rc::Rc;
use std::cell::RefCell;
use List::{Cons, Nil};

#[derive(Debug)]
enum List {
    Cons(i32, RefCell<Rc<List>>),
    Nil,
}

impl List {
    fn tail(&self) -> Option<&RefCell<Rc<List>>> {
        match self {
            Cons(_, item) => Some(item),
            Nil => None,
        }
    }
}
```

Esta nueva lista ahora tiene modificable su segundo campo. ADemás, se proporcina una función auxiliar para acceder al segundo elemento. Si ahora definimos un main:

```rust
fn main() {
    let a = Rc::new(Cons(5, RefCell::new(Rc::new(Nil))));

    println!("a initial rc count = {}", Rc::strong_count(&a));
    println!("a next item = {:?}", a.tail());

    let b = Rc::new(Cons(10, RefCell::new(Rc::clone(&a))));

    println!("a rc count after b creation = {}", Rc::strong_count(&a));
    println!("b initial rc count = {}", Rc::strong_count(&b));
    println!("b next item = {:?}", b.tail());

    if let Some(link) = a.tail() {
        *link.borrow_mut() = Rc::clone(&b);
    }

    println!("b rc count after changing a = {}", Rc::strong_count(&b));
    println!("a rc count after changing a = {}", Rc::strong_count(&a));

    // Uncomment the next line to see that we have a cycle;
    // it will overflow the stack
    // println!("a next item = {:?}", a.tail());
}
```

Dicho main crea a, crea b y lo asocia a y por último modifica a para que se asocie a b (referencia cíclica)

> RefCell que contiene Rc o combinaciones similares de tipos con mutabilidad interior y reference counting, hay que asegurar que no se crean ciclos

Para solucionarlo, se puede hacer que algunas referencias expresen ownership y otros na. Como resultado, se tendrán ciclos formados por relaciones con propiedad y relaciones sin propiedad, y sólo las relaciones con propiedad afectarán a si el valor puede o no ser eliminado.

Para ello, podemos convertir Rc<T> en Weak<T>

Una weak referencia se crea usando Rc::downgrade. Esto incrementa weak_count en 1. Rc<T> usa dicho contador para seguir cuantos weak<t> existen, pero Rc<T> puede limpiarse sin que dicho contador sea cero.

Weak<T> no expresan relación de propiedad; no causan ciclos porque el ciclo se rompe una vez que strong reference valga cero. Por ello, hay que comprobar siempre si el valor al que apunta Weak<T> sigue existiendo (mediante un upgrade method, que devuelve Option<Rc<T>>)

## Concurrencia

Concurrent programming== diferentes partes se ejecutan de forma independiente

Parallel programming == diferentes partes se ejecutan al mismo tiempo.

Para Rust, ownership y type system son herramientas para manejar memory safety y concurrency problems.

A este aspecto rust lo llama concurrencia sin miedo 'fearless concurrency '

### Hilos

En la mayoría de s.o. un programa se ejecuta en un proceso, y el s.o gestiona múltiples procesos a la vez. Dentro del programa, puede haber mucahs partes independientes que se ejecutan simultáneamente. EStas partes se conocen como threads. Problemas:

- Race conditions: los hilos acceden a datos o recursos en un orden inconsistente
- Deadlocks: dos hilos están esperando cada uno a que el otro finalice para usar un recurso que el otro tiene.
- Bugs que sólo suceden en ciertas situaciones dificileds de reproducir y corregir.

Rust intenta mitigar los efectos negativos de los hilos, pero aún así hay que tener cuidad y se requiere una estructrura diferente de código de un solo hilo.

Los S.o. proporcionan una API para crear hilos. Este modelo, donde un lenguaje llama al S.o se conoce como 1:1, pues existe un hilo de S.o por hilo del lenguaje.

Otros lenguajes proporcionan su implementación especial de hilos. Se conocen como green threads, y los lenguajes que los usan los ejecutarán en el contexto de un número diferente de hilos del s.o. Modelo M:N (M green threads per N o.s. thread)

Cada modelo tiene sus ventajas/inconvenientes. Para Rust, el trade-off más importante es el runtime support': código que se incluye en cada binario para que el modelo funcione. Rust trata de minimizar dicho código, por lo que usa el modelo 1:1

#### Crear hilos con spawn

Para crear un hilo, se llama a 'thread::spawn' y se le pasa un closure con el código que quiere ejecutar en el hilo.

```rust
use std::thread;
use std::time::Duration;

fn main() {
    thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {} from the spawned thread!", i);
            thread::sleep(Duration::from_millis(1));
        }
    });

    for i in 1..5 {
        println!("hi number {} from the main thread!", i);
        thread::sleep(Duration::from_millis(1));
    }
}
```

> El hilo nuevo se detiene cuando finaliza el main thread.

#### Esperar a que los hilos finalicen con join

Podemos guardar el valor de vuelto de thread::spawn, de tipo JoinHandle. Éste es un owned value que incluye un método join que espera a que el hilo finalice.

```rust
use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {} from the spawned thread!", i);
            thread::sleep(Duration::from_millis(1));
        }
    });

    for i in 1..5 {
        println!("hi number {} from the main thread!", i);
        thread::sleep(Duration::from_millis(1));
    }

    handle.join().unwrap();
}
```

#### Usar move closures con hilos

Permite usar datos de un hilo en otro hilo

Move permite forcer al closure a que tome posesión de los valores que usa del entorno.

```rust
// MAL. Rust infiere que, al capturar v, el closure debe tomar prestado v (sólo lo usa println como referencia).
// Sin embargo, Rust no sabe el tiempo de vida del hilo, por lo que no sabe si la referencia v será válida todo este tiempo.
use std::thread;

fn main() {
    let v = vec![1, 2, 3];

    let handle = thread::spawn(|| {
        println!("Here's a vector: {:?}", v);
    });

    handle.join().unwrap();
}

// MAL. Por ele motivo anterior, podría suceder lo siguiente:
use std::thread;

fn main() {
    let v = vec![1, 2, 3];

    let handle = thread::spawn(|| {
        println!("Here's a vector: {:?}", v);
    });

    drop(v); // oh no!

    handle.join().unwrap();
}

// BIEN: agregar move para forzar que tome posesión del vector
use std::thread;

fn main() {
    let v = vec![1, 2, 3];

    let handle = thread::spawn(move || {
        println!("Here's a vector: {:?}", v);
    });

    handle.join().unwrap();
}

```

### Transferir datos entre hilos con Message passing

Una forma de asegurar concurrencia es mediante paso de mensajes, donde los hilos (actores) se comunican enviándose mensajes que contienen datos.

> Go language: Do not communicate by sharing memory, instead, share memory by communicating

Para esta labor, Rust implementa el concepto de 'Channel'. (Imagínalo como un río en el que se pone un pato de goma y viaja hasta el final del camino). Un canal tiene dos mitades: transmisor y receptor. El transmisor es el que pone el patito en el rio, y el receptor es quien lo recibe aguas abajo. Un canal se cierra si cualquiera de las dos mitades se elimina. Ejemplo:

```rust
use std::sync::mpsc;  // multiple producer, single consumer

fn main() {
    let (tx, rx) = mpsc::channel(); // nuevo canal con transmitter y receiver

    thread::spawn(move || {  // move tx
        let val = String::from("hi");
        tx.send(val).unwrap();  // send return a resul. Here we call unwrap to panic in case of error
    });

    let received = rx.recv().unwrap();  // recv block the main thread waiting until a value is sent down. try_recv doesn't block.
    println!("Got: {}", received);
}
```

#### Channels y transferencia de propiedad

Ownership rules juegan un rol vital en el envío de mensajes para escribir código seguro. Por ejemplo, intentaremos usar 'val' en un hiilo después de haberlo enviado por el canal:

```rust
use std::thread;
use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap(); // Al enviar el valor, send toma propiedad, y cuando el valor es movido, el receptor toma propiedad!!
        println!("val is {}", val);
    });

    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}
```

#### Enviar múltiples valores con espera

```rust
use std::thread;
use std::sync::mpsc;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];

        for val in vals {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_secs(1));
        }
    });

    for received in rx {
        println!("Got: {}", received);
    }
}
```

Ahora no estamos llamadno a recv explícitamente, sino que tratamos a rx como a un iterador! Cuando el canal se cierra el iterador finaliza

#### Crear múltiples productores clonando el transmisor

```rust
// --snip--

let (tx, rx) = mpsc::channel();

let tx1 = mpsc::Sender::clone(&tx);
thread::spawn(move || {
    let vals = vec![
        String::from("hi"),
        String::from("from"),
        String::from("the"),
        String::from("thread"),
    ];

    for val in vals {
        tx1.send(val).unwrap();
        thread::sleep(Duration::from_secs(1));
    }
});

thread::spawn(move || {
    let vals = vec![
        String::from("more"),
        String::from("messages"),
        String::from("for"),
        String::from("you"),
    ];

    for val in vals {
        tx.send(val).unwrap();
        thread::sleep(Duration::from_secs(1));
    }
});

for received in rx {
    println!("Got: {}", received);
}

// --snip--
```

### Concurrencia con shared-state

Una alternativa a message passing es la indicada por Go 'comunicar compartiendo memoria'. Qué significa? y por qué no usar message-passing?

Channels son similares a single ownership: una vez que se transfiere un valor, ya no se tiene acceso al mismo en el txor. En cambio, shared memory es propiedad múltiple: múltiples hilos pueden acceder a la misma zona de memoria a la vez. Esto agrega complejidad.

#### Usar Mutexes para permitir acceder a un dato un sólo hilo a la vez

> Mutex == mutual exclusion.
>
> Sólo un hilo tiene acceso a un dato en un mismo instante de tiempo

Para acceder al dato en un mutex, el hilo primero debe solicitar el acceso intentando adquirir el mutex lock. El lock es una estructura de datos (parte del mutex) que mantiene un seguimiento de quién está actualmente accediendo al dato. Es decir, es el guardian del dato que almacena. Para usar un mutex hay que recordar dos reglas:

- Hay que intentar adquirir el lock antes de usar el dato
- Cuando se ha terminado de trabajar con el dato que el mutex protege, hay que 'soltar' el dato para que otros hilos puedan adquirir el lock

> metáfora: una conferencia con un sólo micrófono. Hay que pedir usar el micrófono y luego liberalo

La gestión de mutex es muy compleja, pero Rust type system y ownership rules facilitan que no existan bloqueos/desbloqueos erróneos.

#### La API de Mutex<T>

```rust
use std::sync::Mutex;

fn main() {
    let m = Mutex::new(5);

    {
        let mut num = m.lock().unwrap();  // Esta llamada bloquea el hilo hasta que pueda tomar el mutex lock
        *num = 6;
    }

    println!("m = {:?}", m);
}
```

La llamada a lock puede fallar si otro hilo que almacena el lock 'panicked', en cuyo caso nadie podría tomar el lock. De ahí la elección de unwrap para gestionar la situación.

Una vez adquirido el lock, podeoms tratar el valor como una mutable reference.

> El sistema de tipos se asegura de que debemos adquirir el lock para poder usar el valor que contiene el Mutex, evitando el uso indebido de datos dentro del lock

Mutex<T> es un smart poihnter. De hecho, lock devuelve un smart pointer llamado MutexGuard, que implementa Deref para apuntar al dato intero y Drop para liberar el lock automáticamente cuando MutexGuard sale de scope. Como consecuencia, no se corre el riesgo de olvidar liberar el lock y bloquear el mutex.

#### Compartir Mutex<T> entre múltiples hilos

Counter tiene que ser compartido en todos los hilos, pero no podemos hacer 'move' a más de un hilo a la vez!. Para solucionarlo, podríamos usar Rc<T>, pero este smartpointer no está preparado para multihilo (los contadores internos pueden dar problemas en multihilo). Por ello, en su lugar, usamos Arc<T> (Atomic reference counter). Cabe destacar que counter es inmutable pero obtenemos una referencia mutable al valor interior, igual que RefCell!!

```rust
use std::sync::{Mutex, Arc};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();

            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
```

> Mutext<T> tiene el riesgo de crear deadlocks

### Extender concurrencia con sync y send traits

Rust trae muy pocas características de concurrencia (todas las que hemos hablado se incluyen en la std, no en el lenguaje)

Sin embargo, hay dos conceptos clave en el lengauje: std::marker traits Sync y Send

#### Permitir transferencia de propiedad con Send trait

Casi todos los tipos de Rust incluyen Send.

> Cualquier tipo compuesto por completo de tipos con trait send automáticamente se marca como send.

#### Permitir acceso desde múltiples trhreads con sync

Sync indica que es seguro para el tipo que implementa Sync ser referenciado desde múltiples hilos.

> Cualquier tipo compuesto por completo de tipos con trait syncautomáticamente se marca como sync.

## Trait objects

Para implementar un comportamiento, podemos definir un trait. Por ejemplo, imaginemos el trait 'Draw'que define el método draw.

Con él podemos definir un vector que toma como parámetro un 'trait object'. Un trait object apunta a una instancia de un tipo que implementa el trato especificado.

Se pueden crear trait objects especificando algún tipo de puntero (referencia, Box<T>, etc.) y especificando el trato relevante y agregando 'dyn' keyword.

> Traits objects deben usar punteros.

Usaremos traits objects en lugar de tipos genéricos o concretos. De esta forma, Rust type system se asegurará en tiempo de compilaci'n de que cualquier valor usado en ese contexto implementará dicho tratao.

En Rust, en una estructura o enumerado, los campos y el comportamiento en blqoues impl están separados, mientras que en otros lenguaejs ambos conceptos se denominan objetos.

Sin embargo, trait objects son más parecidos a estos objetos de otros lenguajes, en el sentido de que combinan datos y comportamiento. No obstante, no se usan de forma tan general; traits objects únicamente tienen como propósito permitir la abstracción de acuerdo a un comportamiento común

```rust
// Trait se define igual
pub trait Draw {
    fn draw(&self);
}

// Screeen almacena un vector llamado compoennts, de tipo Box<dyn Draw>, que indica que es un trait object
// Dicha línea indica que Box contendrá cualquier tipo que implemente Draw trait
pub struct Screen {
    pub components: Vec<Box<dyn Draw>>,
}

// Definimos el método run que llama'ra al método draw de cada componente
impl Screen {
    pub fn run(&self) {
        for component in self.components.iter() {
            component.draw();
        }
    }
}
```

Un trait object funciona de manera diferente a la definida en estructuras que usan tipos genéricos con trait bounds:

> Un tipo genérico sólo puede ser sustituido con un tipo concreto a la vez. En cambio, trait objects permiten múltiples tipos concretos diferentes a la vez en tiempo de ejecución.

Si hubiésemos definido Screen como un tipo genérico, todos los elementos de la lista de componentes deberían ser del mismo tipo:

```rust
pub struct Screen<T: Draw> {
    pub components: Vec<T>,
}

// Screen sólo permitiría componentes de un mismo tipo (por ejemplo, button, textfield, etc.)
impl<T> Screen<T>
    where T: Draw {
    pub fn run(&self) {
        for component in self.components.iter() {
            component.draw();
        }
    }
}
```

#### Implementando el trait

```rust
pub struct Button {
    pub width: u32,
    pub height: u32,
    pub label: String,
}

impl Draw for Button {
    fn draw(&self) {
        // code to actually draw a button
    }
}

pub struct SelectBox {
    width: u32,
    height: u32,
    options: Vec<String>,
}

impl Draw for SelectBox {
    fn draw(&self) {
        // code to actually draw a select box
    }
}

fn main() {
    let screen = Screen {
        components: vec![
            Box::new(SelectBox {
                width: 75,
                height: 10,
                options: vec![
                    String::from("Yes"),
                    String::from("Maybe"),
                    String::from("No")
                ],
            }),
            Box::new(Button {
                width: 50,
                height: 10,
                label: String::from("OK"),
            }),
        ],
    };

    screen.run();
}
```

> ESte concepto se conoce como duck typing en lenguajes dinámicos: preocuparse por los mensajes a los que un valor responde en lugar del tipo concreto.
>
> En Rust, como ventaja el sistema chequea que se cumple duck typing sin necesidad de comprobarlo en tiempo de ejecución y/o errores en runtime

#### Trait objects realizan dynamic dispatch

En tipos genéricos con traits el compilador genera implementaciones no genéricas para cada tipo concreto (static dispatch).

En cambio, en dynamic dispatch el compilador no puede decir en tiempo de compilación a qué método se está llamando. Con trait objects, Rust debe usar dynamic dispatch. En tiempo de ejecución, Rust usa los punteros delntro del trait object para conocer a qué métodos puede llamar. Por tanto, existe un coste en runtime.

#### Object safety se require en trait objects

OUn trait es object safe si se cumplen las siguiens propiedades:

- No se de vuelve Self
- No hay parámetros de tipo genérico.

## Patrón estado

Ejemplo: blog post workflow:

1. Un post comienza como un borrador vacío
2. Cuando el borrador ha finalizado, se requiere una revisión del post
3. Cuando es aprobado, se publica
4. Sólo los publicados devuelven contenido a imprmir, por lo que los no aprobados no pueden ser publicados

Cualquier otro cambio en un post no debería producir efectos. Ejemplo de uso:

```rust
fn main() {
    let mut post = Post::new();

    post.add_text("I ate a salad for lunch today");
    assert_eq!("", post.content());

    post.request_review();
    assert_eq!("", post.content());

    post.approve();
    assert_eq!("I ate a salad for lunch today", post.content());
}
```

Como se puede comprobar, el usuario no conoce el estado interno del post, pero éste tiene un funcionamiento correcto. Implementación:

```rust
pub struct Post {
    state: Option<Box<dyn State>>,
    content: String,
}

impl Post {
    pub fn new() -> Post {
        Post {
            state: Some(Box::new(Draft {})),
            content: String::new(),
        }
    }
}

impl Post {
    // --snip--
    pub fn add_text(&mut self, text: &str) {  // No depende del estado, por lo que no es parte del patrón
        self.content.push_str(text);
    }
}

impl Post {
    // --snip--
    pub fn request_review(&mut self) {
        if let Some(s) = self.state.take() {
            self.state = Some(s.request_review())
        }
    }

        // --snip--
    pub fn approve(&mut self) {
        if let Some(s) = self.state.take() {
            self.state = Some(s.approve())
        }
    }

     // --snip--
    pub fn content(&self) -> &str {
        self.state.as_ref().unwrap().content(&self)
    }
    // --snip--
}

trait State {
    fn request_review(self: Box<Self>) -> Box<dyn State>;
    fn approve(self: Box<Self>) -> Box<dyn State>;
    fn content<'a>(&self, post: &'a Post) -> &'a str {
        ""
    }

} // comportamiento compartido por los diferentes estados

struct Draft {}

impl State for Draft {
    fn request_review(self: Box<Self>) -> Box<dyn State> {
        Box::new(PendingReview {})
    }
        // --snip--
    fn approve(self: Box<Self>) -> Box<dyn State> {
        self
    }
}

struct PendingReview {}

impl State for PendingReview {
    fn request_review(self: Box<Self>) -> Box<dyn State> {
        self
    }
    fn approve(self: Box<Self>) -> Box<dyn State> {
        Box::new(Published {})
    }
}

struct Published {}

impl State for Published {
    fn request_review(self: Box<Self>) -> Box<dyn State> {
        self
    }

    fn approve(self: Box<Self>) -> Box<dyn State> {
        self
    }

    fn content<'a>(&self, post: &'a Post) -> &'a str {
        &post.content
    }
}
```

Un inconveniente de este patrón es que los estados implementan la transición entre estados, por lo que están acoplados. Si creamos un estado intermedio, se requiere cambiar el código en los dos estados intermedios afectados. ADemás, se duplica lógica.

Implementar el patrón estado de la misma forma que en OOP nos está haciendo perder las ventajas de rust.

VErsión alternativa:

#### Codificando states y behaviour como tipos

Ahora, tendremos un tipo por estado. Post::new devolverá un DraftPost, que ni siquiera tiene definida la función content.

```rust
pub struct Post {
    content: String,
}

pub struct DraftPost {
    content: String,
}

impl Post {
    pub fn new() -> DraftPost {
        DraftPost {
            content: String::new(),
        }
    }

    pub fn content(&self) -> &str {
        &self.content
    }
}

impl DraftPost {
    pub fn add_text(&mut self, text: &str) {
        self.content.push_str(text);
    }
}
```

#### Transiciones como transformaciones de tipos

Implementaremos request_review y approve como métodos que consumen el tipo, haciéndolo inservible, y los transforman en el siguiente tipo (estado)

```rust
impl DraftPost {
    // --snip--

    pub fn request_review(self) -> PendingReviewPost {
        PendingReviewPost {
            content: self.content,
        }
    }
}

pub struct PendingReviewPost {
    content: String,
}

impl PendingReviewPost {
    pub fn approve(self) -> Post {
        Post {
            content: self.content,
        }
    }
}
```

Ahora,. en main, las funciones request_review y approve devuelven nuevas instancias, por lo que hay que actualizar main con nuevos let post para tapar asignaciones anteriores:

```rust
use blog::Post;

fn main() {
    let mut post = Post::new();

    post.add_text("I ate a salad for lunch today");

    let post = post.request_review();

    let post = post.approve();

    assert_eq!("I ate a salad for lunch today", post.content());
}
```

## Patterns and matching

Patterns son una syntaxis especial de Rust que permite matchedar contra el tipo de estructura. Patterns en conjunto con 'match' da mucho control sobre el flujo del programa.

Un patrón consiste en una combinación de:

- literals
- Destructured arrays, enums, structs o tuplas
- variables
- wildcards
- placeholders

Comparamos un patrón con un valor. Si existe coincidencia entre el patrón y el valor, usamos las partes del valor en el código.

### Lugares donde se usan patrones

#### match arms

```rust
match VALUE {
    PATTERN => EXPRESSION,
    PATTERN => EXPRESSION,
    PATTERN => EXPRESSION,
    _       => EXPRESSION,  // Siempre true, último caso. No se enlaza ninguna variable
}
```

#### if let

(equivalente a un match que sólo comprueba un caso)

```rust
fn main() {
    let favorite_color: Option<&str> = None;
    let is_tuesday = false;
    let age: Result<u8, _> = "34".parse();

    if let Some(color) = favorite_color {
        println!("Using your favorite color, {}, as the background", color);
    } else if is_tuesday {
        println!("Tuesday is green day!");
    } else if let Ok(age) = age {
        if age > 30 {
            println!("Using purple as the background color");
        } else {
            println!("Using orange as the background color");
        }
    } else {
        println!("Using blue as the background color");
    }
}
```

#### while let

loop run mientras que el patrón coincida

```rust
let mut stack = Vec::new();

stack.push(1);
stack.push(2);
stack.push(3);

while let Some(top) = stack.pop() {
    println!("{}", top);
}
```

#### for loop

En un bucle for, el patrón es el valor que sigue a la keyword 'for'

```rust
let v = vec!['a', 'b', 'c'];

for (index, value) in v.iter().enumerate() {
    println!("{} is at index {}", value, index);
}
```

enumerate devuelve la tupla con indice y valor. Cuando el valor devuelto coincide con el patrón (index, value), entonces se asignan ambos valores.

#### let statements

> let también usa patterns!!

```rust
let PATTERN = EXPRESSION;

let x = 5; // bind lo que coincida aquí con la variable x
```

#### function parameter

Igual que let

### Refutabilidad

Un patrón que siempre coincide se dice irrefutable (por ejemplo, let x = 5). Patrones que pueden fallar en algunos valores son refutables (ejemplo: if let Some(x) = a_value)

let y for sólo aceptan patrones irrefutables (el programa no puede hacer nada cuando no cincide). En cambio, if let y while let sólo aceptan patrones refutables, pues por definición intentan manejar un posible fallo.

### Ejemplos de usos de patterns

#### named variables

```rust
fn main() {
    let x = Some(5);
    let y = 10;

    match x {
        Some(50) => println!("Got 50"),
        Some(y) => println!("Matched, y = {:?}", y),
        _ => println!("Default case, x = {:?}", x),
    }

    println!("at the end: x = {:?}, y = {:?}", x, y);
}
```

#### múltiple patterns

```rust
let x = 1;

match x {
    1 | 2 => println!("one or two"),
    3 => println!("three"),
    _ => println!("anything"),
}
```

#### Rangos de valores con '...'

La sintaxis ... permite buscar coincidencias con rangos inclusivos.

> Sólo se permite con números y caracteres

```rust
let x = 5;

match x {
    1 ... 5 => println!("one through five"),
    _ => println!("something else"),
}
```

#### Destructuring Structs

```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 0, y: 7 };

    let Point { x: a, y: b } = p;
    assert_eq!(0, a);
    assert_eq!(7, b);
}

// Equivalente
fn main() {
    let p = Point { x: 0, y: 7 };

    let Point { x, y } = p;
    assert_eq!(0, x);
    assert_eq!(7, y);
}

// match
fn main() {
    let p = Point { x: 0, y: 7 };

    match p {
        Point { x, y: 0 } => println!("On the x axis at {}", x),
        Point { x: 0, y } => println!("On the y axis at {}", y),
        Point { x, y } => println!("On neither axis: ({}, {})", x, y),
    }
}
```

#### Destructuring enums

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn main() {
    let msg = Message::ChangeColor(0, 160, 255);

    match msg {
        Message::Quit => {  // variant without data
            println!("The Quit variant has no data to destructure.")
        },
        Message::Move { x, y } => { // structure-like variant
            println!(
                "Move in the x direction {} and in the y direction {}",
                x,
                y
            );
        }
        Message::Write(text) => println!("Text message: {}", text),  // tuple-like variant
        Message::ChangeColor(r, g, b) => {
            println!(
                "Change the color to red {}, green {}, and blue {}",
                r,
                g,
                b
            )
        }
    }
}
```

#### Destructuring nested structs and enums

```rust
enum Color {
   Rgb(i32, i32, i32),
   Hsv(i32, i32, i32)
}

enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(Color),
}

fn main() {
    let msg = Message::ChangeColor(Color::Hsv(0, 160, 255));

    match msg {
        Message::ChangeColor(Color::Rgb(r, g, b)) => {
            println!(
                "Change the color to red {}, green {}, and blue {}",
                r,
                g,
                b
            )
        },
        Message::ChangeColor(Color::Hsv(h, s, v)) => {
            println!(
                "Change the color to hue {}, saturation {}, and value {}",
                h,
                s,
                v
            )
        }
        _ => ()
    }
}
```

#### Destructuring references

Cuando el valor que se intenta comparar con el patrón contiene una referencia, es necesario destructurar la referencia del valor.

Si se especifica & en el patrón, obtendremos una variable que almacena el valor al que apunta la referencia en lugar de la referencia en sí misma.

> Esta técnica es útil en closures donde se tienen iterators que iteran sobre referencias pero queremos usar los valores.

```rust
let points = vec![
    Point { x: 0, y: 0 },
    Point { x: 1, y: 5 },
    Point { x: 10, y: -3 },
];

let sum_of_squares: i32 = points
    .iter()
    .map(|&Point { x, y }| x * x + y * y)
    .sum();
```

#### Ignorando un valores

Ignorar un valor completo con '\_':

```rust
fn foo(_: i32, y: i32) {
    println!("This code only uses the y parameter: {}", y);
}

fn main() {
    foo(3, 4);
}
```

Ignorar parte de un valor con '\_':

```rust
// Ejemplo 1
let mut setting_value = Some(5);
let new_setting_value = Some(10);

match (setting_value, new_setting_value) {
    (Some(_), Some(_)) => {
        println!("Can't overwrite an existing customized value");
    }
    _ => {
        setting_value = new_setting_value;
    }
}

println!("setting is {:?}", setting_value);

// Ejemplo 2
let numbers = (2, 4, 8, 16, 32);

match numbers {
    (first, _, third, _, fifth) => {
        println!("Some numbers: {}, {}, {}", first, third, fifth)
    },
}
```

Ignorar una variable no usada comenzando su nombre con '\_':

```rust
fn main() {
    let _x = 5; // hace binding de _x con 5, pero no muestra warning. '_' no hace binding
    let y = 10;
}
```

Ignorar la parte restante de un valor con '..'

```rust
// Ejemplo 1
struct Point {
    x: i32,
    y: i32,
    z: i32,
}

let origin = Point { x: 0, y: 0, z: 0 };

match origin {
    Point { x, .. } => println!("x is {}", x),
}

// Ejemplo 2
fn main() {
    let numbers = (2, 4, 8, 16, 32);

    match numbers {
        (first, .., last) => {
            println!("Some numbers: {}, {}", first, last);
        },
    }
}
```

#### Condiciones extra con Match Guards

Un 'match guard' es un 'if' adicional que se especifica detrás de un patrón:

```rust
// Ejemplo 1
let num = Some(4);

match num {
    Some(x) if x < 5 => println!("less than five: {}", x),
    Some(x) => println!("{}", x),
    None => (),

// Ejemplo 2
fn main() {
    let x = Some(5);
    let y = 10;

    match x {
        Some(50) => println!("Got 50"),
        Some(n) if n == y => println!("Matched, n = {:?}", n),
        _ => println!("Default case, x = {:?}", x),
    }

    println!("at the end: x = {:?}, y = {:?}", x, y);
}
```

#### '@' bindings

El operador 'at' (@) permite crear una variable que guarda un valor y a la vez comprobar que el valor coincide con un patrón

```rust
enum Message {
    Hello { id: i32 },
}

let msg = Message::Hello { id: 5 };

match msg {
    Message::Hello { id: id_variable @ 3...7 } => { // se asocia id a idvariable
        println!("Found an id in range: {}", id_variable)
    },
    Message::Hello { id: 10...12 } => { // id no se asocia a ninguna variable
        println!("Found an id in another range")
    },
    Message::Hello { id } => {
        println!("Found some other id: {}", id)
    },
}
```

## Unsafe Rust

Unsafe Rust existe porque, por su naturaleza, el análisis estático es conservativo. Cuando no sábe determinar si el código cumple garantías, prefiere rechazar programas válidos en lugar de aceptar uno inválido. Usando código inseguro se le dice al compilador 'Confía en mi, sé lo que hago'. Por otro lado, Rust necesita permitir hacer cosas a bajo nivel como interactuar directamente con el s.o., lo cual suele ser inseguro.

Para cambiar al modo 'unsafe', basta con escribir la keyword 'unsafe' al comienzo de un nuevo bloque. Gracias a ello se puede:

- Dereferenciar un raw pointer
- LLamar a una función/método inseguro
- Acceder o modificar una variable mutable statica
- Implementar un strait inseguro

> Unsafe no desactiva el borrow checker o cualquier otro check de seguridad de Rust. Simplemente da acceso a características que no son chequeadas por el compilador.

### Dereferenciar un raw pointer

Unsafe Rust tiene dos nuevos tipos llamados raw pointers: inmutable raw pointer `(*const T)` y mutable raw pointers `(*mut T)`

El asterisco no es el operador de dereferencia; es parte del nombre del tipo.En este contexto, inmutable significa que el puntero no puede ser directamente asignado tras ser dereferenciado.

Estos raw pointers:

- Pueden ignorar las reglas de préstamo teniendo a la vez inmutable y mutable pointers o muchos punteros mutables a misma localización
- No se garantiza que apunten a una zona de memoria válida
- Se permite que sean null
- No implementan limpieza automática

Ejemplo: creación de inmutable y mutable raw pointers de referencias:

```rust
let mut num = 5;

let r1 = &num as *const i32;
let r2 = &mut num as *mut i32;
```

## Traits avanzados

Ver documentación

### Usar el patrónnewtype para implementar external traits en external types

El patrón newtype implica crear un nuevo tipo en una tuple struct.

La idea es crear un tuple struct con un campo y que éste sea un wrapper alrededor del tipo que queremos que implemente el trato. De esta forma, el wrapper type es local a nuestro crate, y podemos implementar el trait en dicho wrapper. No hay penalización en runtime; el wrapper es omitido en tiempo de compilación.

Por ejemplo, para implementar Display en Vec<T>:

```rust
struct Wrapper(Vec<String>);

impl fmt::Display for Wrapper {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}

fn main() {
    let w = Wrapper(vec![String::from("hello"), String::from("world")]);
    println!("w = {}", w);
}
```

## Tipos avanzados

### Crear sinónimos con type aliases:

```rust
ype Kilometers = i32;

let x: i32 = 5;
let y: Kilometers = 5;

println!("x + y = {}", x + y);
```

### The never type (nunca vuelve)

Rust tiene un tipo llamada ! que es conocidoen el argot de teoría de tipos como 'empty type' porque no tiene valores. En Rust se le llama el tipo 'never' porque se coloca en ell ugar del return type cuando la función nuca termina:

```rust
// the function bar returns never.
// No podemos crear valores de este tipo, por lo que bar nunca tendrá posibilidad de volver
fn bar() -> ! {
    // --snip--
}
```

Para qué es útil?

Si recordamos, match requiere que todos los brazos devuelvan el mismo tipo. Por ejemplo, el siguiente código no compila:

```rust
let guess = match guess.trim().parse() {
    Ok(_) => 5,
    Err(_) => "hello",
}
```

Sin embargo, el siguiente código sí compila:

```rust
let guess: u32 = match guess.trim().parse() {
    Ok(num) => num,
    Err(_) => continue,
};
```

Esto es posible porque continue tiene el tipo devuelto !. Es decir, cuando Rust computa el tipo de guess, mira en ambos brazos y comprueba que uno devuelve u32 y el otro !. Como ! nunca vuelve, Rust decide que el tipo es u32. Es decir, expresiones del tipo ! pueden forzarse a cualquier otro tipo. En el ejemplo, continue no devuelve valor y en su lugar mueve el control al bucle, por lo que en caso de Err nunca se asignará un valor a guess

### Pasar funciones como parámetros de función

Además de closures a funciones, se pueden pasar funciones regulares. Para ello, se usan function pointers

```rust
fn add_one(x: i32) -> i32 {
    x + 1
}

fn do_twice(f: fn(i32) -> i32, arg: i32) -> i32 {
    f(arg) + f(arg)
}

fn main() {
    let answer = do_twice(add_one, 5);

    println!("The answer is: {}", answer);
}
```

### Devolver closures

Closures se representan con traits, por lo que no se pueden devolver directamente.

```rust
// MAL: Rust no sabe el tamano del closure
fn returns_closure() -> Fn(i32) -> i32 {
    |x| x + 1
}

// BIEN: Usamos un trait object
fn returns_closure() -> Box<dyn Fn(i32) -> i32> {
    Box::new(|x| x + 1)
}

```

## Macros

Las macros hacen referencia a una familia de características en Rust:

- Declarative macros con 'macro_rules!'
- Procedural macros, de tres tipos:
  - Custom #[derive] macros
  - Attribute-like macros
  - Function-like macros

### Diferencia entre macro y función

Macro === escribir código que escribe otro código (metaprogramación). Por ejemplo, el atributo 'derive' genera una implementación automática de varios traits. println!, vec! son macros que se expanden para producir más código.

La signatura de una función debe declarar el número y tipo de parámetros. Macros, en cambio, pueden tomar un número variable de parámetros. Además, las macros se expanden antes de que el compilador interprete el significado del código, por lo que pueden , por ejemplo, implementar un trait en un tipo dado. Una función en cambio no puede, pues es llamada en tiempo de ejecución y el trato necesita estar implementado en tiempo de compilación.

Como contrapartida, escribir macros es más complejo que funciones porque se trata de escribir código Rust que escribe código Rust.

Por último, destacar que es necesario definir o traer la macro al scope antes de llamarlas en un archivo, mientras que las funciones se pueden llamar desde cualquier parte del archivo

### Declarative macros

'macro_rules!' permiten escribir algo similar a Rust match. Estas macros comparan un valor con un patrón que tiene código asociado. En este caso, el valor es Rust source code pasado a la macro, los patrones son comparados con la estructura de dicho código fuente, y el código asociado con cada patrón es el código que reemplazará al código pasado a la macro. Todo ello en tiempo de compilación. Ejemplo: vector

```rust
#[macro_export]  // esta anotación indica que la macro debería estar disponible en culaquiedr lugar donde el crate se incluya en el scope
macro_rules! vec {  // nombre de la macro
    ( $( $x:expr ),* ) => {  // brazo de match con patrón ($($x:expr),*). En el ejemplo, se repite el patrón 3 veces. Para cada caso, $x es reemplazado por la expresión
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}

let v: Vec<u32> = vec![1, 2, 3];

```

### Procedural Macros para generar código desde atributos

Este tipo se llama así porque se parecen a funciones (las funciones son un tipo de procedures). Aceptan Rust code como entrada, o peran con él y producen código Rust a la salida (en lugar de hacer matching contra patrones).

La definición de estas macros debe residir en su propio crate con un tipo especial . Además, el uso de estas macros debe tomar la forma :

```rust
use proc_macro;

#[some_attribute]  // placeholder para una macro específica
pub fn some_name(input: TokenStream) -> TokenStream {
}
```

#### Crear una macro personalizada

Primero crearemos un crate llamado 'hello_macro' que defina un trait llamado HelloMacro con una función asociada hello_macro. En lugar de hacer que los usuarios implementen el trait para cada tipo, vamos a proveer una macro con la que el usuario puede anotar sus tipos: #[derive(HelloMacro)]. Esta implementación por defecto imprimirá 'Hello, Macro! My name is TypeName!' donde 'Typename' es el nombre del tipo en el que seaha definido el trato. Ejemplo de uso:

```rust
use hello_macro::HelloMacro;
use hello_macro_derive::HelloMacro;

#[derive(HelloMacro)]
struct Pancakes;

fn main() {
    Pancakes::hello_macro();
}
```

Implementación del trait:

```rust
pub trait HelloMacro {
    fn hello_macro();
}
```

Implementación de la macro:

Convención: Para un crate llamado foo, crear un custom derive procedural macro llamado foo_derive

Primero crearemos el proyecto:

```bash
$ cargo new hello_macro_derive --lib
```

Después, indicar que se trata de una procedural macro:

```bash
[lib]
proc-macro = true

[dependencies]
syn = "0.14.4"
quote = "0.6.3"
```

Tras ello, crear el código de la macro:

```rust
extern crate proc_macro;

use crate::proc_macro::TokenStream;
use quote::quote;
use syn;

#[proc_macro_derive(HelloMacro)]
pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
    // Construct a representation of Rust code as a syntax tree
    // that we can manipulate
    let ast = syn::parse(input).unwrap();

    // Build the trait implementation
    impl_hello_macro(&ast)
}

fn impl_hello_macro(ast: &syn::DeriveInput) -> TokenStream {
    let name = &ast.ident;
    let gen = quote! {
        impl HelloMacro for #name {
            fn hello_macro() {
                println!("Hello, Macro! My name is {}", stringify!(#name));
            }
        }
    };
    gen.into()
}
```

...

### Attribute-like macros

Similares a custom-derive macros, pero permiten crear nuevos atributos en lugar de generar código para el atributo 'derive'

### Function-like macros

Permite definir macros que parecen llamadas de funciones.

## Tools

### Formatting with rustfmt

```bash
$ rustup component add rustfmt
$ cargo fmt
```

### Fix code with rustfix

```bash
$ cargo fix
```

### Lints with clippy

```bash
$ rustup component add clippy
$ cargo clippy
```

### Source code

```bash
$ rustup component add rust-src
```

### IDE integration con Rust Language Server

```
$ rustup component add rls
```

### VS Code

> Referencia: [enlace](https://www.brycevandyk.com/debug-rust-on-windows-with-visual-studio-code-and-the-msvc-debugger/)

Instalar plugins:

- [Microsoft c/c++](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)
- [Rust (rls)](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust)
- [Better TOML](https://marketplace.visualstudio.com/items?itemName=bungcip.better-toml)
- Opcional no probado - snippets: [enlace](https://marketplace.visualstudio.com/items?itemName=polypus74.trusty-rusty-snippets)

#### Depurar usando MSVC

Configurar

settings ->"debug.allowBreakpointsEverywhere": true

En Debug, junto al botón de 'play':

-> Configuration -> Add configuration -> C++ (Windows) -> program: 'ruta del binario a depurar':

`"program": "${workspaceFolder}/target/debug/${workspaceRootFolderName}.exe"`

Ejemplo [referencia](https://fungos.github.io/blog/2017/08/12/setting-up-a-rust-environment-on-windows/#debugging):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug",
      "type": "cppvsdbg",
      "request": "launch",
      "program": "${workspaceRoot}/target/debug/${workspaceRootFolderName}.exe",
      "args": [],
      "stopAtEntry": false,
      "cwd": "${workspaceRoot}",
      "environment": [],
      "externalConsole": true
    },
    {
      "name": "Release",
      "type": "cppvsdbg",
      "request": "launch",
      "program": "${workspaceRoot}/target/release/${workspaceRootFolderName}.exe",
      "args": [],
      "stopAtEntry": false,
      "cwd": "${workspaceRoot}",
      "environment": [],
      "externalConsole": true
    }
  ]
}
```

Para visualizar variables durante la depuración, se usa natvis. Para usarlas: , copiar carpeta:

```
C:\Users\B\.multirust\toolchains\nightly-x86_64-pc-windows-msvc\lib\rustlib\etc
```

to

```
C:\Users\B\.vscode\extensions\ms-vscode.cpptools-0.11.2\debugAdapters\vsdbg\bin\Visualizers
```

#### Depurar usando LLDB

> Referencias:
>
> - [Patrik Svensson](https://www.patriksvensson.se/2018/02/debugging-rust-on-windows-using-vscodea)
> - [hovebear](https://hoverbear.org/2017/03/03/setting-up-a-rust-devenv/)

1. Instalar LLVM (x64. Descargar una versión con soporte para python: [enlace](https://github.com/vadimcn/llvm/releases)
2. Instalar python 3.5 (x64): [enlace](https://www.python.org/downloads/release/python-354/)
3. Instalar vscode-lldb: [enlace](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb)
4. Instalar Rust GNU toolchain: `rustup install stable-gnu`
5. Set active toolchiain: `rustup default stable-gnu`. Comprobar con `rustup show`
6. Edit launch.json: elegir lldb y el archivo binario a depurar

Desde consola:

```bash
rust-lldb ./target/debug/example
```

## Option monads

> Referencia: [enlace](https://hoverbear.org/2014/08/12/option-monads-in-rust/)

Option en rust es lo mismo que Maybe en haskell:

```rust
enum Option<T> { None, Some(T) }
```

Podemos ver Option como una caja que encapsula algo o nada.

```rust
fn main () {
    // Ways to create an Option containing an int.
    let w = Some(3i); // Something
    let x: Option<int> = None; // Nothing
    // Receive from function.
    let y = some_on_even(2); // Something
    let z = some_on_even(3); // Nothing
}

fn some_on_even(val: int) -> Option<int> {
    match val {
        // Matches an even number.
        x if x % 2 == 0 => Some(x),
        // Matches anything else.
        _               => None
    }
}
```

Para extraer el valor que contiene option se puede usar varios métodos. 'unwrap' y 'expect' provocan panic! si el valor devuelto es None, por lo que es recomendable usar alternativas más seguras como 'unwrap_or_default' ó 'unwrap_or()'

```rust
 fn main () {
    // Create an Option containing the value 1.
    let a_monad: Option<int> = Some(1);

    // Extract and branch based on result.
    let value_from_match = match a_monad {
        Some(x) => x,
        None    => 0i // A fallback value.
    };
    // Extract with failure message.
    let value_from_expect = a_monad.expect("No result.");

    // Extract, or get a default value
    let value_or_default = a_monad.unwrap_or_default();
    let value_or_fallback = a_monad.unwrap_or(42i);
}
```

Observaciones sobre Option:

- Es necesario manejar todos los posibles valores. El compilador emitirá errores si no se gestiona Option en todos sus casos
- El consumidr de nuestra api sabrá mediante option que la función puede no devolver un valor significativo
- Option no envuelve punteros; envuelve valores.
- La composición se vuelve más fácil

### Composición con Option

Imaginemos que tenemos las sigujientes funciones

```rust
fn log(value: f64)     -> f64; // This could fail. (log(-2) == ??)
fn sqrt(value: f64)    -> f64; // This could fail. (sqrt(-2) == ??)
fn square(value: f64)  -> f64;
fn double(value: f64)  -> f64;
fn inverse(value: f64) -> f64;
```

Imaginemos que queremos aplicar las siguientes transformaciones a un número '20':

```rust
sqrt(-1 * (log(-1 * (20 * 2)))^2)
```

En un lenguaje clásico, con Null, tendriamos que comprobar el valor devuelto de log, sqrt, etc.

En cambio, en rust podemos hacer que estas dos funciones devuelvan Optional:

```rust
fn main () {
    let number: f64 = 20.;
    // Perform a pipeline of options.
    let result = Some(number)
        .map(inverse) // Described below.
        .map(double)
        .map(inverse)
        .and_then(log) // Described below.
        .map(square)
        .and_then(sqrt);
    // Extract the result.
    match result {
        Some(x) => println!("Result was {}.", x),
        None    => println!("This failed.")
    }
}
// You can ignore these.
fn log(value: f64) -> Option<f64> {
    match value.log2() {
        x if x.is_normal() => Some(x),
        _                  => None
    }
}
fn sqrt(value: f64) -> Option<f64> {
    match value.sqrt() {
        x if x.is_normal() => Some(x),
        _                  => None
    }
}
fn double(value: f64) -> f64 {
    value * 2.
}
fn square(value: f64) -> f64 {
    value.powi(2 as i32)
}
fn inverse(value: f64) -> f64 {
    value * -1.
}
```

Tal y como se puede observar, el usuario de las funciones no necesita gestionar el caso None. Si alguna de las funciones falla (llamadas por 'and_then') el resto de la computación deja pasar el valor. Esta es la definición de map y 'and_then' de la mónad Option:

```rust
fn map<U>     (self, f: |T| -> U)         -> Option<U>
fn and_then<U>(self, f: |T| -> Option<U>) -> Option<U>
```

- map es un functor. Aplica una función de signatura `|T|->U` a un Option<T> y devuelve un Option<U>.
  - Equivalente a fmap en Haskell. Toda Monada (como Option), es también un functor. Por eso Option, que es una mónada, implementa esta función
- and_then es una interfaz de mónada. Aplica una función de signatura `|T|->Option<U>` a un Option<T> y devuelve un Option<U>.
  - Equivalente a bind en Haskell.

### Ejemplos de uso

Con vectores:

```rust
fn main () {
    let strings = vec!("4", "12", "foo", "15", "bar", "baz", "1");
    let numbers: Vec<int> = strings.iter()
        // `filter_map` transforms `Vec<&'static str>` to `Vec<int>`
        // Any `None` will be removed,
        // while any `Some` will be unwrapped.
        .filter_map(|&x| from_str::<int>(x))
        // `collect` forces iteration through the lazy iterator.
        .collect();
    println!("{}", numbers);
}
```

Pipeline:

```rust
fn main () {
    let mut input = "15 Bear".split(' ');
    // Need to pull the number and parse it.
    let number = input.next()
        // Process Option<&'static str> to Option<int>
        .and_then(|x| from_str::<int>(x))
        .expect("Was not provided a valid number.");
    // The next token is our animal.
    let animal = input.next()
        .expect("Was not provided an animal.");
    // Ouput `number` times.
    for x in std::iter::range(0, number) {
        println!("{} {} says hi!", animal, x)
    }
}
```

## Argumentos opcionales en Rust

Rust no ofrece variadic o optional arguments

```rust
fn impossible(val: bool) {}
fn impossible(val: bool, other: bool) {}
fn impossible(val: bool, rest: bool...) {}
```

Para resolverlo: 'Options!'

> Referencia: [enlace](https://hoverbear.org/2018/11/04/optional-arguments/)

## Rust API guidelines

Libro intersante sobre guía para el diseño de APIs.

> Referencias:
>
> - [API guideline](https://rust-lang-nursery.github.io/api-guidelines/)
>
> - [elegant apis](https://deterministic.space/elegant-apis-in-rust.html)

Por ejemplo:

- No devolver bool o el valor, sino información adiciona. (ej: binary search)

- Minimizar suposiciones sobre parámetros:

  ```rust
  fn foo<I: IntoIterator<Item = i64>>(iter: I) { /* ... */ }
  ```

## Rust y seguridad de código

> Referencia: [enlace](https://hoverbear.org/2015/09/12/understand-over-guesswork/)

- Inmutabilidad por defecto (let, let mut)
- Strong type system
- Sin null (error del billón de dolares)
- RAII por defecto para reservar y liberar memoria
- Usar Result para devolver valor/error, y definir From<T> y To<T> para convertir tipos de errores
- Usar try!() macro para obtener el valor si funciona o devolver el error al call stack si falla
- Sin liberar memoria
- Sistema basado en traits: no clases o herencia. zero-cost abstraction
- análisis estático por defecto (sin necesidad de splint en c)
- Hilos con canales
- Sin conversiones automáticas de tipo

## State machines

Ejemplos de patrón state machine:

- https://hoverbear.org/2016/10/12/rust-state-machine-pattern/

## Resumen rust function signatures

[enlace](https://hoverbear.org/2015/07/10/reading-rust-function-signatures/)

## Iteradores (range v3 like)

> Referencia: [enlace](https://hoverbear.org/2015/05/02/a-journey-into-iterators/)

next(), take(n), skip(n)

```rust
fn main() {
    let vals = [ 1, 2, 3, 4, 5];
    let mut iter = vals.iter();
    println!("{:?}", iter.next());
    println!("{:?}", iter.skip(2).take(2)
        .collect::<Vec<_>>());
}
```

inspect()

```rust
fn main() {
    let input = [1, 2, 3];
    let iterator = input.iter();
    let mapped = iterator
        .inspect(|&x| println!("Pre map:\t{}", x))
        .map(|&x| x * 10) // This gets fed into...
        .inspect(|&x| println!("First map:\t{}", x))
        .map(|x| x + 5)   // ... This.
        .inspect(|&x| println!("Second map:\t{}", x));
    mapped.collect::<Vec<usize>>();
}
```

Ranges

```rust
0..5 == [ 0, 1, 2, 3, 4, ]
2..6 == [ 2, 3, 4, 5, ]
(0..100).step_by(2)

    let range = (0..10).collect::<Vec<usize>>();
    println!("{:?}", &range[..5]);
    println!("{:?}", &range[2..5]);
    println!("{:?}", &range[7..]);
```

zip(), unzip(), chain():

```rust
fn main() {
    // Demonstrate Chain
    let first = 0..5;
    let second = 5..10;
    let chained = first.chain(second);
    println!("Chained: {:?}", chained.collect::<Vec<_>>());
    // Demonstrate Zip
    let first = 0..5;
    let second = 5..10;
    let zipped = first.zip(second);
    println!("Zipped: {:?}", zipped.collect::<Vec<_>>());
}
// Chained: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// Zipped: [(0, 5), (1, 6), (2, 7), (3, 8), (4, 9)]
```

count(), max_by(), min_by(), all(), any()

```rust
#![feature(core)] // Must be run on nightly at time of publishing.
#[derive(Eq, PartialEq, Debug)]
enum BearSpecies { Brown, Black, Polar, Grizzly }

#[derive(Debug)]
struct Bear {
    species: BearSpecies,
    age: usize
}

fn main() {
    let bears = [
        Bear { species: BearSpecies::Brown, age: 5 },
        Bear { species: BearSpecies::Black, age: 12 },
        Bear { species: BearSpecies::Polar, age: 15 },
        Bear { species: BearSpecies::Grizzly, age: 16 },
    ];
    // Max/Min of a set.
    let oldest = bears.iter().max_by(|x| x.age);
    let youngest = bears.iter().min_by(|x| x.age);
    println!("Oldest: {:?}\nYoungest: {:?}", oldest, youngest);
    // Any/All
    let has_polarbear = bears.iter().any(|x| {
        x.species == BearSpecies::Polar
    });
    let all_minors = bears.iter().all(|x| {
        x.age <= 18
    });
    println!("At least one polarbear?: {:?}", has_polarbear);
    println!("Are they all minors? (<18): {:?}", all_minors);
}
// Outputs:
// Oldest: Some(Bear { species: Grizzly, age: 16 })
// Youngest: Some(Bear { species: Brown, age: 5 })
// At least one polarbear?: true
// Are they all minors? (<18): true
```

filter(), map(), fold()

```rust
fn main() {
	let input = 1..10;
	let output = input
    	.filter(|&item| item % 2 == 0) // Keep Evens
    	.map(|item| item * 2) // Multiply by two.
    	.fold(0, |accumulator, item| accumulator + item);
	println!("{}", output);
}
```

scan(), partition

```rust
fn main() {
    let set = 0..1000;
    let (even, odd): (Vec<_>, Vec<_>) = set.partition(|&n| n % 2 == 0);
    let even_scanner = even.iter().scan(0, |acc, &x| { *acc += x; Some(*acc) });
    let odd_scanner  = odd.iter().scan(0, |acc, &x| { *acc += x; Some(*acc) });
    let even_always_less = even_scanner.zip(odd_scanner)
        .all(|(e, o)| e <= o);
    println!("Even was always less: {}", even_always_less);
}
// Outputs:
// Even was always less: true
```

### Functional programming - others

> From [Madhukar blog](http://blog.madhukaraphatak.com/functional-programming-in-rust-part-1/)

Definir una función:

```rust
fn simple_function() {
	println!("function called");
}
```

Variables:

```rust
fn add(a:i32, b:i32) -> i32  {
    a + b
    }
let fn_variable = add;
println!("calling using function variable {}",fn_variable(10,20));
```

High order function - function as parameter

```rust
fn higer_order_fn<F>(value:i32, step: F)  -> i32
                    where F: Fn(i32) -> i32 {
    step(value)
}

fn add_one(x:i32)->i32 { x+1}

// Call using named function
let result = higer_order_fn(20, add_one);

// Call using anonymous function
let result = higer_order_fn(20, |x:i32| x +1 );


```

High order function - return a function

```rust
// Take an i32 value as parameter and return a function which wraps this value with logic to increment given value with the step.
// The lifetime the function lives is detetrmited at compile time. 'a is a scope associated with input value. We are saying here to compiler: keep lifetime of function as long as value step_value exist. We use box to create a reference to Fn
// lifetime only exist with references
// The value we take as parameter is created in stack, so when fu nction returns the step_value is destroyed. So move says copy step?value as part of closure
fn higer_order_fn_return<'a>(step_value:& 'a i32) ->
                            Box<Fn(i32) -> i32 + 'a > {
       Box::new(move |x:i32| x+step_value)
}

let step_value = &10;
let step_function = higer_order_fn_return(step_value);
println!("the stepped value is{}", step_function(50));


```

Functional Combinators

All functional combinators (map, filter, etc.) implements Iterator trait. Iterators are lazy in nature.

```rust
let vector = vec!(1,3,4,5,3);

// Map
// Call collect to oforce the computation, specifing the return type
let mapped_vector = vector.iter().map(|&x| x +1).collect::<Vec<i32>>();
println!("{:?}",mapped_vector)

// Filter
let filtered_values = vector.iter().filter(|&x| x%2 ==0).collect::<Vec<&i32>>();

// Count
let vec_count = vector.iter().count();

// Zip
let index_vec = 0..vec_count;
let index_zipped_vector = vector.iter().zip(index_vec).collect::<Vec<(&i32,usize)>>();

// Fold
let sum = vector.iter().fold(0,(|sum,value| sum+value));

// Max
let max = vector.iter().max().unwrap();

// For all
let greater_than_zero = vector.iter().all(|&x| x > 0 ) ;

// Flat map
let lines_vec = vec!("hello,how","are,you");
let words_vec = lines_vec.iter().flat_map(|&x| x.split(",")).collect::<Vec<&str>>();
```

Check types

```rust
assert!(a != 10.0, "not a int");
/* prints can't compare `{integer}` with `{float}`*/
```

Type inference

```rust
// collections
let vector = vec!(1,2,3,4);

// function arguments
fn add( a: i32, b : i32) -> i32 {
    a + b
}
```

Rust is expression (block of code return a result always) (vs statement, where blocks of code does not return anything) In Rust, every construct return an expression (if, conditions, loops, blocks...)

```rust
// In the below code we check if a given variable is even or not. Also we store the result in a variable rather than updating from the condition.
let is_even = if a % 2 == 0 {true} else {false};

let block_result_statement =  {
  1+2; // semicolon turn expression in statement, so return unit value to interop with c/cplusplus
};

println!("block statement result is {:?}",block_result_statement);

let block_result_expression =  {
   1+2
};

println!("block expression result is {:?}",block_result_expression);

```

> From [fpcomplete](https://www.fpcomplete.com/blog/2018/10/is-rust-functional)

Inmutable by default

```rust
fn main() {
    let mut total = 0;
    for i in 1 .. 101 {
        total += i;
    }
}
```

No tail-call optimization :cry:

Total functions (for every valid input there is a valid terminating output)

> From [official book](https://www.fpcomplete.com/blog/2018/10/is-rust-functional)

Closures: Anonymous functions that can capture their environment

> From [worthe](https://www.worthe-it.co.za/programming/2018/02/11/why-functional-programmers-should-care-about-rust.html)

Type called Result. Result is a union type (Ok or Err)

```rust
let s = "one";

// When you parse a string to a number, there's a case where the
// string isn't a valid number, so parse returns a Result.
let parse_result = s.parse::<i32>();

// When we're adding 1, we only case about the successful parsing
// case, so we use map to use that.
// Note, flat_map on Result is called 'and'
let add_one_result = parse_result.map(|x| x+1);

// We can also pattern match on results if we want to handle the Ok
// case and the Error case.
match add_one_result {
    Ok(number) => println!("The number is {}", number),
    Err(parse_error) => eprintln!("The error was \"{}\"", parse_error)
};
```

## Trucos

### Into::into

Para convertir un tipo (ej: Option/result) en otro:

```rust
let bar = foo.map(|i| i.into());

// Alternativa más legible
let bar = foo.map(Into::into);

```

## Rust y raspberry

> Referencia: [enlace](https://github.com/thejpster/pi-workshop-rs)

## Gestión de errores (II)

> Composing errors: [enlace](https://blog.burntsushi.net/rust-error-handling/)

- Option::ok_or - Convierte Option en Result
- Result::map_err - Likemap but apply only to errors

## Alternativa a channels por defecto:

[Crossbeam channels](https://docs.rs/crossbeam-channel/0.3.8/crossbeam_channel/)

## Mensajes human-readable para panic

[human-panic](https://github.com/rust-cli/human-panic)

## Syntactic sugar y rust

Usar cargo-inspect:[enlace](https://fosdem.org/2019/schedule/event/rust_cargo_inspect/)

Canal de youtube: Hello Rust

## Listado de recursos

> Referencia: [enlace](https://github.com/ctjhoa/rust-learning)

- Unsafe rust: https://doc.rust-lang.org/stable/nomicon/
- Rust 101: https://www.ralfj.de/projects/rust-101/main.html
- Learning Rust: https://learning-rust.github.io/
- Rust gentle intro: http://stevedonovan.github.io/rust-gentle-intro
- Rust for cplusplus programmers: https://github.com/nrc/r4cppp
- Rust screencast: https://www.youtube.com/playlist?list=PLTOeCUgrkpMNEHx6j0vCH0cuyAIVZadnc
- My python's little Rust-y (divertida): https://www.youtube.com/watch?v=3CwJ0MH-4MA
- Rust by example: https://doc.rust-lang.org/stable/rust-by-example/
- Advent of code: https://adventofcode.com/
- Into rust: http://intorust.com/
- macros: https://danielkeep.github.io/tlborm/book/index.html
- rust embedded: https://rust-embedded.github.io/book/
- Introduction functional programming in rust: https://www.youtube.com/watch?v=PbLY-cVRiog
- The periodic table of rust types: http://cosmic.mearie.org/2014/01/periodic-table-of-rust-types/
- Rust and wasm: https://prestonrichey.com/blog/react-rust-wasm/
- Patrones de diseno en rust: https://github.com/rust-unofficial/patterns/blob/master/patterns/builder.md
- Aprender rust usando listas enlazadas (linked lists): https://rust-unofficial.github.io/too-many-lists/#learn-rust-with-entirely-too-many-linked-lists
- Rust y visual studio code: https://www.forrestthewoods.com/blog/how-to-debug-rust-with-visual-studio-code/
- Rust the hard parts: https://naftuli.wtf/2019/03/20/rust-the-hard-parts/
- Introducción a procedural macros: https://dev.to/naufraghi/procedural-macro-in-rust-101-k3f

## Otros recursos

- Sistema operativo nixos reliable (es fácil instalar versiones concretas): https://nixos.org/nixos/about.html
- Programación web con rust: https://dev.to/gruberb/web-programming-in-rust-02x-deploy-your-first-app-1k05
- nom parser (ejemplo: flv parser): https://github.com/Geal/nom
- state machine rust: https://github.com/rust-bakery/machine
- rust opensplice dds: https://github.com/corollaries/opensplice-rust
