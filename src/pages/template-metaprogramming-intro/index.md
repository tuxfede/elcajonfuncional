---
title: "Template Metaprogramming - Introducción"
date: "2019-03-30"
---

## Introducción

Una template crea una familia de funciones.
Se realiza una traducción en dos fases:

- Se analiza el formato de la plantilla sintácticamente
- Se convierte la plantilla al tipo concreto y se vuelve a comprobar.
  Como consecuencia, cuando una function template es usada, necesita su definición! rompiéndose el flujo de compilado/linkado.
  Como solución temporal, se implementará cada plantilla en la cabecera.

Type conversions during type deduction

- Cuando los parámetros se pasan por referencia, no se aplica ninguna deducción para convertir valores
- Cuando se pasan por valor, sólo las conversiones triviales son aplicadas

Para resolver ambiguedades:

- hacer un casting: max(static_cast<double(4), 72)
- Especificar el tipo: max<double>(4,7.2);
- Definir cada parámetro de un tipo deferente

Tipo de parámetros devueltos:
template<typen, typename T2, typename RT>
RT max(T1 a, T2 b)
::max<int,double,double>(4, 7.2) // Tedioso!
// Mejor:
template<typename RT, typename T1, typename T2>
RT max (T1 a, T2 b)
::max<double(4, 7.2

RECOMENDACIÓN:Mantener la plantilla lo más simple posible y usar un sólo parámetro
El tipo devuelto puede ser deducido por el compilador desde C++14:
template<typename T1, typename T2>
auto max(T1 a, T2 b) { return b<a ? a:b; }; // Fuerza que se deduzca en función de la sentencia 'return'
Si se usara trailing return type (->) auto max(T1 a, T2 b) -> decltype(b<a?a:b)
Problema: si T es una referencia, se devolvería una referencia. Por ello, se debe devolver el tipo 'decayed from T':
(decay asegura que no se devuelven referencias)
#include <type_traits>
auto max(T1 a, T2 b) -> typename std::decay<decltype(true?a:b)>::type
Otra opción:
#include <type_traits>
template<typename T1, typename T2>
std::common_type_t<T1,T2> max(T1 a, T2 b)

## Default template arguments

El siguiente caso requiere que los tipos tengan default constructor.
#include <type_traits>
template <typename T1, typename T2,
typename RT = std::decay_t<decltype(true?T1() : T2()) >>
RT max(T1 a, T2 b)
Como alternativa: typename RT = std::common_type_t<T1, T2>

## Overloading function templates

Reglas de decisión:
la explícita por el usuario o 'La que mejor se ajuste', sin necesidad de hacer convoersiones implícitas/explícitas.
En general, es buena idea no cambiar más de lo necesario cuando se hace overloading, limitando los cambios al número de parámetros o especificando un tipo de ellos. Es decir, no pasar de paso por valor a puntero, etc.

# Recomendaciones

En general, es mejor definir los templates con paso por valor.
Si lo desea, cualquiero usuario puede crear una referencia con std::ref y std::cref

- El compilador optimiza mejor
- move semantic permite crear copias 'baratas'

- En general no hay que definir como inline. Se pueden incluir en muchos translation units.
  - únicamente hay que definirlo si hay una especialización para tipos específicos donde todos los parámetros son definidos).

'inline' significa que una definición puede aparecer muchas veces en un programa.

constexpr permite usar codigo para computar algunos valores en tiempo de compilación.
Por ejemplo, la función maxium se puede definir para usarse en tiemp ode compilación:
template<typename T, typename T2>
constexpr auto max (T1 a, T2 b) { return b<a ? a:b;}
De esta forma, podemos hacer int a[::max(sizeof(char, 1000u)];
