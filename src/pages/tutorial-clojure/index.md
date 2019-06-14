---
title: "Tutorial Clojure"
date: "2019-01-11"
---

# Clojure

Clojure es un lenguaje y un compilador.

- El lenguaje es un dialecto de Listp
- El compilador es un ejecutable (JAR file) clojure.jar, que coge código escrito en Clojure y lo compila a bytecode de la máquina virtual de java (JVM).
  - JVM procesa y ejecuta Java bytecode
  - Los ficheros JAR son colecciones de Java bytecode
  - Los programas Java se suelen distribuir como ficheros JAR
  - El bytecode genrado por clojure.jar se ejecuta por el mismo proceso JVM por el que se ejecuta closure.jar



Resumen sintaxis:

- No usa 'return' (el último valor es el devuelto por defecto)
- () listas
- {} hash
- Todos los listas y valores

## Entorno de desarrollo

1. Instalar java 1.6
2. Instalar [Leiningen](https://leiningen.org/)
3. Ejecutar `lein.bat self-install`

### Crear nuevo proyecto

```bash
lein new app clojure-noob
```

Por defecto, lein creará un proyecto básico (incluyendo gitignore, readme, etc)

El fichero project.clj define toda la configuración de lein: dependencias, cómo ejecutar el programa, etc.

### Ejecutar el proyecto

Desde la terminal, acceder al directorio clojure_noob y lanzar el comando

```bash
lein run
```

> La primera vez que se ejecute, lein descargará todas las dependencias necesarias.

### Compilar el proyecto

Par crear un ejecutable independiente:

```bash
lein uberjar
```

Dicho comando creará el fichero `target\uberjar\clojure-noob-0.1.0-SNAPSHOT-standalone.jar`

Se puede ejecutar con el comando:

```bash
java -jar target\uberjar\clojure-noob-0.1.0-SNAPSHOT-standalone.jar
```

### REPL

REPL es un shell interactivo (reads input, evaluates it, prints result, loop). Para iniciarlo:

```bash
lein repl
```

> La primera vez que se ejecuta tarda bastante tiempo.

Al iniciarse, el prompt indica que estamos en el namespace clojure-noob.core, donde sólo existe la función main. Se puede llamar con `(-main)`

> Todos los dialectos LISP usan 'prefix notation' (operador primero en la expresión)

## Editores

- [Nightcode](https://sekao.net/nightcode/) - Un editor desarrollado en clojure con integración de lein, repl, parinfer, rainbow parenthesis, etc.
- vim:
  - [thoughbot - writing clojure in vim](https://thoughtbot.com/blog/writing-clojure-in-vim)
  - [endot - developing clojure in vim](http://endot.org/2018/07/14/vim-clojure-dev-2018/)
  - [juxt - clojure and vim](https://juxt.pro/blog/posts/vim-1.html)

### Emacs

Es el entorno que mejor se integra con REPL y permite editar paréntesis de una forma más cercana a LISP.

#### Instalación básica windows con spacemacs

> Referencia: [kiranshila](https://kiranshila.com/index.php/2018/09/15/setting-up-spacemacs-my-new-favorite-text-editor/)

1. Crear variable de entorno 'HOME' que apunte a un directorio conocido ( c:\home)
   1. Si no existe esta variable, la carpeta `.emacs.d` se ubicará en `c:\Users\<Username>\Appdata\Roaming\`
   2.
2. Descargar Emacs para windows: [versión 26.1 64bits](http://ftp.rediris.es/mirror/GNU/emacs/windows/emacs-26/emacs-26.1-x86_64.zip)
3. Instalar en c:\emacs y agregar a path
4. Ejecutar runemacs.exe para asegurarse que todo funciona bien, y que se ha creado el directorio `.emacs.d`
5. Instalar spacemacs (configuraciones de emacs que incluyen, entre otros, vim mode)
6. Configurar spacemacs para clojure:

#### Configuración para clojure según spacemacs

http://spacemacs.org/layers/+lang/clojure/README.html

http://spacemacs.org/doc/DOCUMENTATION.html#editing-lisp-code

Guias de spacemacs:

https://thecode.pub/an-introduction-into-spacemacs-from-a-vim-user-f0d9c860911e

Agregar capa clojure y actualizar con:

- estilo vim: SPC f e R
- estilo emacs: M-m f e R

#### Configuración para clojure según libro

https://github.com/flyingmachine/emacs-for-clojure

Descargar la configuración y sustituir .emacs.d por dicha configuración.

> Importante: la versión actual no funciona tal cual. Para reinstalar cider, hay que entrar en la carpeta .emacs.d/elpa y borarr las carpetas cider*, sesman*. Tras ello, iniciar emacs y ejecutar:
>
> - M-x package-refresh contents
> - M-x package-install cider
> - M-x package-install sesman
>
> Y reiniciar emacs

#### Comandos básicos

- C-g: Cancela los comandos actuales de emacs
- C-x b: New buffer (introducir nombre)
- C-x k enter: Matar el buffer
- C-x C-f: abrir archivo (mantener control y pulsar xf)
- C-x C-s: guardar archivo
- Tecla Meta (M): normalmente Alt
-

Realmente, emacs es un intérprete de Lisp! CAda keystroke está asociada a un comando!. (f == self-insert-command)

#### Modos

En emacs un modo es una colección de key-bindings y funcionalidades empaquetadas juntas para ser más productivo. Por ejemplo, cuando se carga un archivo clojure, se activa el 'Clojure mode'. En este modo, por ejemplo:

- C-c C-k: carga el buffer actual en REPL y lo compila

Existen dos tipos de modos:

- 'major'. configurados por defecto al abrir un archivo con una extensión conocida, o llamados explícitamente M-x clojure mode. Sólo puede existir un major mode simultáneamente
- 'minor'. Proporcionan funcionalidades comunes en muchos tipos de ficheros. Por ejemplo abbrev mode expande abreviaturas

Estos modos aparecen en la barra inferior de emacs

#### Instalación de paquetes

Muchos modos se distribuyen como paquetes. Para instalar:

- M-x package-list-packages
- M-x package-install

#### Terminología y navegación

Lo que normalmente conocemos como ventana 'window' en emacs se conoce como frame, y un frame puede dividirse en varias ventanas.

Movimientos

- C-a al principio de la línea
- M-m primer caracter no blanco
- C-e final de la línea
- C-f un carácter hacia adelante
- C-b un carácter hacia atrás
- M-f hacia adelante una palabra
- M-b hacia atrás una palabra
- C-s Regex search. C-s para siguiente match
- C-r Como C-s, pero reverse order
- M-< Principio del buffer
- M-> Final del buffer
- M-g g Ir a linea

Cambiar de ventanas:

- C-x o Cambiar a otra window
- C-x 1 Eliminar todas las otras ventanas, dejando sólo la actual.
  - No cierra los buffers y no causa ninguna pérdida
- C-x 2 Dividir frame arriba abajo
- C-x 3 Dividir frame izqda y dcha
- C-x 0 Borrar ventana actual
- C-x b cargar un buffer en una ventana concreta

Selección de regiones

En emacs, no se selecciona texto; en su lugar, se crean regiones con :

- C-spc (control+spacebar) (igual que shift selecting).

Las regiones también permiten limitar las operaciones al área seleccionada

Borrado

En emacs se 'matan' regiones y se agregan al 'kill ring'. Una vez hecho, se puede hacer yank. También se puede copiar texto al kill ring sin eliminar la región.

Emacs permite almacenar múltiples bloques de texto en el kill ring, y se puede recorrer estos elementos de forma cíclica.

- C-k kill line (elimina todo el texto tras el cursor)
- C-/ undo
- M-x replace-string
- M-w Es como copiar (kill-ring-save)
- M-d Es como cortar (kill-word)
- C-y Pega el último texto 'matado' (yank)
- M-y Elimina el último elemento matado y pega el siguiente elemento del kill-ring. Cycle through kill ring after yhanking
- C-w Kill region
- M-d kill word

Editar:

- Tab: Indentar línea
- C-j: Nueva línea con indentación
- M-/ Expandir
- M-\ Borra todos los espacios y tabs en torno al cursor
- C-h k (describe funcionalidad de la siguiente tecla)
- C-h f (describe función)

#### Emacs y clojure

Para conectar emacs a REPL, se requiere [packageCIDER](https://github.com/clojure-emacs/cider/) (instalado siguiendo las instrucciones del libro)

> SE puede instalar manualmente con M-x package-install cider

CIDER permite iniciar REPL con emacs:

- M-x cider-jack-in para lanzar un buffer con repl
- M-x cider-connect para conectarse a un servidor existente

Tras ello, podrán ejecutarse los siguientes comandos sobre ficheros clojure:

- C-e (para navegar al final de una lína) C-x C-e Para ejecutarla (cider-eval-last-expression)
- C-u C-x C-e (para evaluar lo posterior)
- C-c M-n M-n Establece el namespace al namespace listado al principio del archivo, de tal forma que ahora en la ventana aparece clojure-noob.core
- C-c C-k par compilar fichero actual

Estando en REPL, C-flecha te mueve por el historial.

Otros comandos intersantes:

- C-c C-d C-d: documentación para el símbolo bajo el cursor
  - Pulsar q para cerrar dicho buffer
- M-. navega por el código fuente buscando el símbolo bajo el cursor.
  - M-, vuelve al punto original
- C-c C-d C-a busca un texto arbitrario en documentación y nombres de función

En resumen:

1. Table 2-6: Clojure Buffer Key Bindings

| Keys            | Description                                                                        |
| --------------- | ---------------------------------------------------------------------------------- |
| **C-c M-n M-n** | Switch to namespace of current buffer.                                             |
| **C-x C-e**     | Evaluate expression immediately preceding point.                                   |
| **C-c C-k**     | Compile current buffer.                                                            |
| **C-c C-d C-d** | Display documentation for symbol under point.                                      |
| **M-. and M-,** | Navigate to source code for symbol under point and return to your original buffer. |
| **C-c C-d C-a** | Apropros search; find arbitrary text across function names and documentation.      |

1. Table 2-7: CIDER Buffer Key Bindings

| Keys         | Description                     |
| ------------ | ------------------------------- |
| **C-**↑, C-↓ | Cycle through REPL history.     |
| **C-enter**  | Close parentheses and evaluate. |

#### Manejar errores

RePL y el código fuente muestran un nuevo buffer con el stack trace cuando se detectan errores

Se puede cerrar pulsando 'q', filtrar con los botones que aparecen en la segunda fila del buffer, tec.

#### Paredit mode

Cuando se escribe un paréntesis izquierdo, automáticamente se autocompleta gracias al modo 'minor' 'paredit' Éste modo asegura que tdoso los paréntesis, comillas dobles, llaves, etc se abren y cierran correctamente.

Para habilitarlo-deshabilitarlo: M-x paredit-mode (toggle)

ADemás, ofrece key bindings: [enlace](https://github.com/georgek/paredit-cheatsheet/blob/master/paredit-cheatsheet.pdf)

Los más populares son:

- Slurping: mueve un paréntesis de cierre a la siguiente expresión a la derecha.
  - Pulsar M-(
  - Escribir lo que se desee
  - Pulsar C-flecha_dcha
- Navegar entre expresiones
- C-M-f y C-M-b te llevan hacia el paréntesis de cierre/apertura siguietnes.

Reesumen:

| Keys                 | Description                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| **M-x** paredit-mode | Toggle paredit mode.                                                     |
| **M-(**              | Surround expression after point in parentheses (paredit-wrap-round).     |
| **C-**→              | Slurp; move closing parenthesis to the right to include next expression. |
| **C-**←              | Barf; move closing parenthesis to the left to exclude last expression.   |
| **C-M-f**, **C-M-b** | Move to the opening/closing parenthesis.                                 |

## Otros recursos

- [Librería re-frame (estilo react-redux)](https://github.com/Day8/re-frame)
- [mastering emacs](https://www.masteringemacs.org/reading-guide)





## Nociones básicas clojure

Todo el código escrito en clojure sigue una estructura uniforme. Dos tipos de estructuras:

- Representación literal de estrucutras de datos (números, strings, mapas, vectores)
- Operaciones

El término 'form', o 'expressions' hace referencia a código válido. 

Todas las operaciones son de la forma 'apertura de paréntesis, operador, opreandos, cierre de paréntesis'

Los espacios en blanco separan los operandos (no hay comas; éstas son tratadas como espacios en blanco)



### Control de flujo

if:

```clojure
(if boolean-form
    then-form
    optional-else-form)
```

Si se omite else y no se cumple el if, éste devuelve nil



do:

```clojure
(if true
  (do (println "Success!")
      "By Zeus's hammer!")
  (do (println "Failure!")
      "By Aquaman's trident!"))
; => Success!
; => "By Zeus's hammer!"
```

Do permite 'envolver' múltiples forms en paréntesis y ejecutar cada uno de ellos.



when:

Es una combinación de 'if' y 'do' sin el 'else'.

```clojure
(when true
  (println "Success!")
  "abra cadabra")
; => Success!
; => "abra cadabra"v
```



### nil, true, false, igualdad, or, and

nil se usa para indicar que no hay valor. Se puede comprobar si un valor es nil con la función `nil?`

```clojure
(nil? 1)
; => false

(nil? nil)
; => true
```



operador de igualdad:

```clojure
(= 1 1)
; => true

(= nil nil)
; => true

(= 1 2)
; => false
```



operadores or

or devuelve el primer valor verdadero o el último valor

```clojure
(or false nil :large_I_mean_venti :why_cant_I_just_say_large)
; => :large_I_mean_venti

(or (= 0 1) (= "yes" "no"))
; => false

(or nil)
; => nil
```



operador and

and devuelve el primer valor falso o el último verdadero

```clojure
(and :free_wifi :hot_coffee)
; => :hot_coffee

(and :feelin_super_cool nil false)
; => nil
```



### asociar nombres a valores

Con `def` se asocian 'bind' nombres a valores

```clojure
(def failed-protagonist-names
  ["Larry Potter" "Doreen the Explorer" "The Incredible Bulk"])

failed-protagonist-names
; => ["Larry Potter" "Doreen the Explorer" "The Incredible Bulk"]
```



En clojure no se puede cambiar el valor asociado a un nombre (por eso no se llama asignación, sino 'bind', para dejar claro que no se puede en un mismo scope  volver a asignar un nombre a otro valor diferente)

En su lugar, podemos usar funciones! Por ejemplo, en lugar de definir 'error-message' como un dato y cambiarlo, podemos definirlo como una función

```clojure
(defn error-message
  [severity]
  (str "OH GOD! IT'S A DISASTER! WE'RE "
       (if (= severity :mild)
         "MILDLY INCONVENIENCED!"
         "DOOOOOOOMED!")))

(error-message :mild)
; => "OH GOD! IT'S A DISASTER! WE'RE MILDLY INCONVENIENCED!"
```



### Estructuras de datos

Todas las estructuras de datos de clojure son inmutables. Existen muy pocas pero muy completas



Números:

Clojure tiene enteros, floats y ratios

```clojure
93
1.2
1/5
```



strings

Representan texto. Siempre se expresan entre comillas dobles. Para concatenar strings sólo se permite usar la función 'str'

```clojure
"Lord Voldemort"
"\"He who must not be named\""
"\"Great cow of Moscow!\" - Hermes Conrad"

(def name "Chewbacca")
(str "\"Uggllglglglglglglglll\" - " name)
; => "Uggllglglglglglglglll" - Chewbacca
```



mapas

Son similares a diccionarios o hashes en otros lenguajes. Clojure tiene hash maps  y sorted maps. se representan por `{}` . Ejemplo:

```clojure
{:first-name "Charlie"
 :last-name "McFishwich"}

{"string-key" +}

{:name {:first "John" :middle "Jacob" :last "Jingleheimerschmidt"}}

```

En el ejemplo anterior, las palabras que comienzan con `:` representan 'keywords'

Como alternativa, se puede usar la función ( hash-map')

```python
(hash-map :a 1 :b 2)
; => {:a 1 :b 2}
```

Se pueden buscar valores con la función `get`

```clojure
(get {:a 0 :b 1} :b)
; => 1

(get {:a 0 :b {:c "ho hum"}} :b)
; => {:c "ho hum"}
```

Para buscar de forma anidada, `get-in`

```clojure
(get-in {:a 0 :b {:c "ho hum"}} [:b :c])
; => "ho hum"
```

Otra forma de buscar un valor en el mapa es tratar al mapa como a una función, y a la clave como su argumento:

```clojure
({:name "The Human Coffeepot"} :name)
; => "The Human Coffeepot"
```

De forma si milar, se puede usar la keyword como funciones para buscar el valor!



keywords

Comienzan con `: `. Se suelen usar en mapas o como funciones que buscan un valores en una estructura de datos.

```clojure
(:a {:a 1 :b 2 :c 3})
; => 1

(get {:a 1 :b 2 :c 3} :a)
; => 1
```

Se le pueden asignar valores pordefecto, igual que con get:

```clojure
(:d {:a 1 :b 2 :c 3} "No gnome knows homes like Noah knows")
; => "No gnome knows homes like Noah knows"
```



vectores

Se expresan con corchetes `[]`. Similares a arrays (colecciones con índice que comienza en 0).

Se puede usar get para obtener valores por índice:

```clojure
(get [3 2 1] 0)
; => 3
```

También se pueden crear con la función 'vector'. 

```clojure
(vector "creepy" "full" "moon")
; => ["creepy" "full" "moon"]
```

La función `conj` sue puede usar para agregar elementos al final del vector:

```clojure
(conj [1 2 3] 4)
; => [1 2 3 4]
```



Listas

Se expresan entre paréntesis y usando comillas simple al principio.

```clojure
'(1 2 3 4)
; => (1 2 3 4)

(nth '(:a :b :c) 2)
; => :c
```

 Las listas son, igual que los vectores, colecciones lineales de valores.  Son diferentes en algunos aspectos:

- No pueden obtenerse valores con get
- En su lugar, se usa la función`nth`. Esta función es mucho más lenta que get, pues se tienen que recorrer todos los elementos hasta llegar al objetivo

Se pueden crear listascon la función 'list'. 

Se pueden agregar elementos al principio de la lista usando la función `conj`:

```clojure
(conj '(1 2 3) 4)
; => (4 1 2 3)
```

> Regla de uso: 
>
> Usar listas cuando se requieren insertar elementos al principio de una secuencia o cuando se escriben macros. En caso contrario, usar vector



Sets

Son colecciones de valores únicos. Clojure tiene hash sets y sorted sets. 

```clojure
#{"kurt vonnegut" 20 :icicle}

(hash-set 1 1 2 2)
; => #{1 2}
```

Cuando se tratan de insertar múltiples valores repetidos, set los convierte en un único valor.

De nuevo, se puede usar `conj` para insertar valores a un set

Para comprobar si un valor existe en el set, se puede usar 'get' o 'contains?'. Ell primero devuelve el valor si lo encuentra o niml, mientras que contains devuelve true o false:

```clojure
(contains? #{:a :b} :a)
; => true

(contains? #{:a :b} 3)
; => false

(contains? #{nil} nil)
; => true

(:a #{:a :b})
; => :a

(get #{:a :b} :a)
; => :a

(get #{:a nil} nil)
; => nil

(get #{:a :b} "kurt vonnegut")
; => nil
```

En el penúltimo caso, get está devolviendo nul, que es un elemento del set, por lo que es confuso.



### Funciones

LLamar a una función

```clojure
(+ 1 2 3 4)
(* 1 2 3 4)
(first [1 2 3 4])

((or + -) 1 2 3)
; => 6

(inc 1.1)
; => 2.1

(map inc [0 1 2 3])
; => (1 2 3 4)
```

Clojure evalua todos los argumentos de la función recursivamente antes de pasárselos a la función:

```clojure
(+ (inc 199) (/ 100 (- 7 2)))
(+ 200 (/ 100 (- 7 2))) ; evaluated "(inc 199)"
(+ 200 (/ 100 5)) ; evaluated (- 7 2)
(+ 200 20) ; evaluated (/ 100 5)
220 ; final evaluation
```



Function calls, Macro calls y special forms

