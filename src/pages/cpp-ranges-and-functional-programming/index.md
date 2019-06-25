---
title: "CPP Ranges & Functional Programming"
date: "2019-01-30"
---

## Ivan Cukic

> Referencia:
>
> - [Awaiting for the ranges C++17](https://www.youtube.com/watch?v=alMAkmErrbo&t=491s)
> - [Functional reactive programming in C++](https://www.youtube.com/watch?v=a2MmURgc6cU)

Generate a sequence on the fly with a range comprehension and initialize a vector with it:

```cpp
std::vector<int> xs = view::for_each(view::ints(1,10), [](int i){ return yield_from(veiw::repeat(i,i));));

// ys - recevied values
// es - expected values
```

Ejemplo square root:

```cpp
// zip: tienes 2 ranges y creas uno único
// que une ambos como parejas y devuvelve ese nuevo rango
sqrt(accupulate(zip(ys,es) | transform(\_1 - \_2) | transform (\_1 \*\_2)));
```

Ejemplo fizz buzz: devolver con ternario:

```cpp
return fizz && buzz ? "Fizzbuzz"
: fizz ? "Fizz"
: buzz ? "buzz"
: /_ otherwise _/ to_string(0)
```

Simplificar lambdas:

```cpp
response | filter([](auto response) { return response.error(); });
response | filter(\_1.error() == true);
```

Librería general: class error_test_t
De esta forma:

```cpp
responses | filter(error);
responses | filter(error == true);
```

Monadas como contenderos:

- Constructor: `(T) -> C<T>`
  Mete un objeto en una caja
- Transform: `(C<From>, function<To(From)>) -> C<To>`
  Coje todas las cajas y le aplica la función al objeto que contienen
- Flatten: `(C<C<T>>) -> C<T>`
  Coje una caja que contiene cajas con objetos y elimina las cajas interiores, quedando una cajac on todos los objetos.

## Referencias

- [Value semantics and range algorithms](https://www.youtube.com/watch?v=YJIaGRDIyEE)
- [Value semantics: it aint about the syntax](https://www.youtube.com/watch?v=BshgPboz_AQ)
- [Await 2.o Gor nishanov](https://www.youtube.com/watch?v=KUhSjfSbINE)

## Charlas Eric Niebler

- [Concepts of the uncoming ranges TS](https://www.youtube.com/watch?v=4OgAjT6HTG8)
- [Ranges for the standard library](https://www.youtube.com/watch?v=mFUXNMfaciE)
- [videos del canal NWCPP](https://www.youtube.com/channel/UCrg3ot2uEjn3jLs4PmeqEAg)

Se puede tomar la dirección de un data member!

```cpp
strcut Pair{ int first, second; };
vector<Pair> vec;
auto it = std::find_if(vec.begin(), vec.end(), [](auto &a) { return a.first == 42; });
auto it = ranges::find(vec, 42, &Pair::first);
Projections!! === unary function
ranges::equal(employees, ids, std::equal_to<>(), &Employee::id);
```

El último parámetro es una proyección que se aplica antes de aplicar la relación equal-to.
Puede ser cualquier unary function, lambda, etc.

## Phil Nash - Functional c++ for fun and profit phil nash

### Uso de ternario y lambadas para asignar variables constantes

```cpp
const auto colour = (sunnySide() == Dir::Up) ? Colour::Yellow : Colour::White;
Problema: escalar! Ejemplo: switch largo donde se asigna una variable.
Posible solución: return:
const auto state = [trafficLight]{
switch(trafficLight){
case TrafficLight::red:
return state:stopped;
...
}
}();
```

### Algoritmos funcionales

- `std::transform -> map`
- `std::copy_if -> filter`
- `std::accumulate -> reduce`
- `std::find_if/\_if_not`
- `std::count_if`
- `std::replace_if`
- `std::remove_if`

### builder pattern

objetos inmutables:

```cpp
struct Employee {
const int id;
const std::share_ptr<const Person> person;
const std::shared_ptr<const Address> address;
Employee() = delete;
}
Employee { 100, pereson, address, "Software developer", needsLocation});
```

Muy largo. Ventajas: no se neceesitan getters/setters. Para acortar la construcción de objetos: buiilder pattern:

```cpp
struct EmployeeBuilder {
int id;
std::shared_ptr<const Person> person;
std::shared_ptr<const Address> address;
std::string jobTitle;
bool needsRelocation;
auto build() const -> std::shared_ptr<const Employee> {
retgurn std:;make_shared<const Employee>
( Employee { id, person, address, jobtitle, needsRelocation});
}
};

EmployeeBuilder eb;
eb.id=100;
eb.person = std::make_shared<Person>(..);
eb.address...

auto employee = eb.build();
```
