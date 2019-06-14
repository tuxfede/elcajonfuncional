---
title: "QML - Introducción"
date: "2019-03-20"
---

## Curso qt desde cero

> Referencia: [CleanQt](https://www.cleanqt.io/blog/crash-course-in-qt-for-c%2B%2B-developers,-part-7)

## FAQ

- Elegir el método de integración entre C++ y QML: [doc qt](https://doc.qt.io/qt-5/qtqml-cppintegration-overview.html#choosing-the-correct-integration-method-between-c-and-qml)

![cpp-qml-integration-flowchart.png](cpp-qml-integration-flowchart.png)

- Extensiones: QML pueden tener la extensión ".ui.qml", útil para Qt Creator (los tratará como UI forms). Los ficheros ui.qml solo pueden contener un subset de QML para que el Qt Quick Designer los interprete correctamente. Características no soportadas por .ui:

  - Javascript blocks
  - bindings distintos de expresiones puras
  - signal handlers
  - Estados en otros items que no sean el principal
  - Root items no derivados de QQuickItem o Item
  - Behavior
  - Binding
  - Canvas
  - Component
  - Shader Efect
  - Timer
  - Transform
  - Transition

- Imports:

  ```javascript
  // Definiciones
  import Namespace VersionMajor.VersionMinor
  import Namespace VersionMajor.VersionMinor as SingletonTypeIdentifier
  import "directory"
  import "file.js" as ScriptIdentifier

  // Ejemplos concretos
  import QtQuick 2.0
  import QtQuick.LocalStorage 2.0 as Database
  import "../privateComponents"
  import "somefile.js" as Script
  ```

* The template for creating `Qt Quick Application` adds `QQmlApplicationEngine` to launch the QML. But `QQmlApplicationEngine` dont work directly with `Rectangle` or `Item` as root element but requires any window like `Window` or `ApplicationWindow`.
  So to make it work for `Rectangle` use [QQuickView](http://doc.qt.io/qt-5/qquickview.html#details) instead of `QQmlApplicationEngine`.

## Buenas prácticas

- Convención de código: [QML coding conventions](https://doc.qt.io/qt-5/qml-codingconventions.html)

- Agrupar resources:

  ```
  # En .pro
  images.files = $$files(assets/*.png)
  RESOURCES += images

  # en .qml
  source: "assets/image1.png"
  ```

- Separar UI de Lógica:

  1. Crear Objeto C++ con slots

  2. Exponer referencia al objeto en UI:

     ```cpp
     int main(int argc, char *argv[])
     {
         QGuiApplication app(argc, argv);

         Backend backend;

         QQmlApplicationEngine engine;
         engine.rootContext()->setContextProperty("backend", &backend);
         engine.load(QUrl(QStringLiteral("qrc:/main.qml")));
         if (engine.rootObjects().isEmpty())
             return -1;

         return app.exec();
     }
     ```

  3. Llamar al slot del objeto c++ directamente en UI

     ```javascript
     import QtQuick 2.12
     import QtQuick.Controls 2.12

     Page {
         Button {
             text: qsTr("Restore default settings")
             onClicked: backend.restoreDefaults()
         }
     }
     ```

- Uso de Qt Quick Layouts:

  - Usar anchors o width/height para especificar el tamaño del layot en comparación con el elemento padre que no tiene layout
  - Usar la propiedad 'Layout' para fijar el tamaño y alineamiento del layout del elemento hijo
  - No definir preferred sizes para elementos que tienen implicitWidth e implicitHeigh a menos que sus tamaños implícitos no sean satisfactorios
  - No usar anchors en items que son hijos directos de un layout. en su lugar, usar Layout.preferredWidth y Layout.preferredHeight
  - Tanto Layouts como anchors consumen más memoria y tiempo de instanciación. Evitar usarlos sobre todo el listas, tablas, etc, cuando un simple binding a x,y,width es suficiente

- Tipos:A unque se puede usar 'property var name', es mejor indicar el tipo para análisis estáticos: 'property int size'

- Interfaz gráfica escalable

  - Usar anchors o Qt Quick Layouts
  - No especificar de forma explícita width y height
  - Proporcionar UI resources para cada resolución(qt-logo.png@2x, qtlogo.png@3x). Qt selecciona automáticamente la imagen adecuada
  - Usar SVG para iconos pequeños
    - En imágenes grandes tarda m;as en renderizar
  - Usar iconos basados en fuentes (Font Awesome)

### Recomendaciones de rendimiento

> Referencia: [qtquick-performance](https://doc.qt.io/qt-5/qtquick-performance.html)

Muy importante, leer todas las recomendaciones:

En general:

- Usar QML profiler de Qt Creator
- Usar bindings sencillos

  - Que no declaren javascript intermedio
  - Que no accedan a propiedadeds var
  - ...

- Resolver propiedades el menor número de veces posible

- Evitar reevaluar propiedades con bindings asociados en bucles cuando sólo se requiere el resultado final. Usar en su lugar variables temporales

- Cargar imágenes asíncronamente 'asynchronous: true'

- Definir el tamaño de imagen explícitamente cuando se va a representar una imagen grande en un tamano pequeño.

- Posicionar elementos con anchors en lugar de binding

  - En lugar de:

    ```
    Rectangle {
        id: rect1
        x: 20
        width: 200; height: 200
    }
    Rectangle {
        id: rect2
        x: rect1.x
        y: rect1.y + rect1.height
        width: rect1.width - 20
        height: 200
    }
    ```

  - Usar:

    ```
    Rectangle {
        id: rect1
        x: 20
        width: 200; height: 200
    }
    Rectangle {
        id: rect2
        height: 200
        anchors.left: rect1.left
        anchors.top: rect1.bottom
        anchors.right: rect1.right
        anchors.rightMargin: 20
    }
    ```

- Escribir custom models en c++ para asociarlos a las vistas de )QML

  - Ser tan asíncrono como sea posible
  - Hacer todo el procesamiento en un worker thread de baja prioridad
  - Usar una 'sliding slice window' para cachear resultados.

- Usar clipping sólo cuando sea necesario (es un efecto visual, no una optimización)

- Opaco sobre 'translucent'

-

## Manual qmlbook cadaques

> Referencia [qmlbook](https://qmlbook.github.io/ch04-qmlstart/qmlstart.html)

### Propiedades: key-value

- id: Usado para referenciar elementos dentro de un ardchivo QML
  - No es de tipo string; es un identificador
- Asociar relación entre propiedades: binding
- Se pueden crear propiedades propias: `property <type> <name> : <value>`
- Se pueden agrupar propiedades: `font { family: "Ubuntu"; pixelSize: 24 }`

### Alias:

- `property alias <name> : <reference>`

### Diferencia `:` y `=`

`:` (QML binding) es un contrato que se mantiene todo el tiempo de vida del binding

`=` (asignación Javascript) funciona una sola vez

### Elementos básicos

- Visuales. (Item, Rectangle, Text, Image, MouseArea)
- No visuales (Timer)

#### Item

| Group            | Properties                                                                                                                                                                                 |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Geometry         | `x` and `y` to define the top-left position, `width` and `height` for the expansion of the element and also the `z` stacking order to lift elements up or down from their natural ordering |
| Layout handling  | `anchors` (left, right, top, bottom, vertical and horizontal center) to position elements relative to other elements with their `margins`                                                  |
| Key handling     | attached `Key` and `KeyNavigation` properties to control key handling and the input `focus` property to enable key handling in the first place                                             |
| Transformation   | `scale` and `rotate` transformation and the generic `transform` property list for _x,y,z_ transformation and their `transformOrigin` point                                                 |
| Visual           | `opacity` to control transparency, `visible` to show/hide elements, `clip` to restrain paint operations to the element boundary and `smooth` to enhance the rendering quality              |
| State definition | `states` list property with the supported list of states and the current `state` property as also the `transitions` list property to animate state changes.                                |

### Posicionar elementos

Elementos básicos

- Row
  - spacing
- Column
  - spacing
- Grid
  - rows
  - columns
  - flow
  - layoutDirection
  - spacing
- Flow
  - spacing
  - layoutDirection

Todos los posicionadores tiene la propiedad Repeater, la cual funciona como un 'for-loop' para iterar sobre un modelo

```json
Repeater {
    model: 16
    Rectangle {
    // ...
	}
}
```

### Layouts items

Los elementos dentro de un posicionador básico (row Column Grid Flow) pueden ser ajustados usando 'Layout'. Se pueden definir restricciones de tamaño (min/max), preferido, espacio entre elementos, alineamiento, etc.

Ejemplo 1:

```javascript
Window {
    RowLayout {
        anchors.fill: parent
        spacing: 6
        Rectangle {
            color: 'azure'
            Layout.preferredWidth: 100
            Layout.preferredHeight: 150
        }
        Rectangle {
            color: "plum"
            Layout.fillWidth: true
            Layout.fillHeight: true
        }
    }
}
```

Ejemplo 2:

```
RowLayout {
    id: layout
    anchors.fill: parent
    spacing: 6
    Rectangle {
        color: 'azure'
        Layout.fillWidth: true
        Layout.minimumWidth: 50
        Layout.preferredWidth: 100
        Layout.maximumWidth: 300
        Layout.minimumHeight: 150
        Text {
            anchors.centerIn: parent
            text: parent.width + 'x' + parent.height
        }
    }
    Rectangle {
        color: 'plum'
        Layout.fillWidth: true
        Layout.minimumWidth: 100
        Layout.preferredWidth: 200
        Layout.preferredHeight: 100
        Text {
            anchors.centerIn: parent
            text: parent.width + 'x' + parent.height
        }
    }
}
```

Se puede conectar el tamaño de la ventana con el de un layout, forzando a que esta no crezca demasiado más allá de los límites del layout:

```javascript
RowLayout {
    id: layout
    anchors.fill: parent

    minimumWidth: layout.Layout.minimumWidth
	minimumHeight: layout.Layout.minimumHeight
	maximumWidth: 1000
	maximumHeight: layout.Layout.maximumHeight

    width: layout.implicitWidth
	height: layout.implicitHeight
```

### Anchors

QML proporciona el concepto de 'anchors', parte de las propiedades fundamentales de Item. Son contratos más 'fuertes' que la geometría definida. Cualquier elemento tiene 6 líneas maestras de anclaje (top, bottom, left, right, horizontalCenter, verticalCenter). De manera adicional, existe el anchor 'baseline' para elementos Text.

Todos los anchors tienen un offset

- Llamados 'margins' en los anchors top, bottom, left, right
- Llamados offsets en (horizontalCenter, verticalCenter)

Ejemplos:

1. An element fills a parent element

   > ```
   >         GreenSquare {
   >             BlueSquare {
   >                 width: 12
   >                 anchors.fill: parent
   >                 anchors.margins: 8
   >                 text: '(1)'
   >             }
   >         }
   > ```

2. An element is left aligned to the parent

   > ```
   >         GreenSquare {
   >             BlueSquare {
   >                 width: 48
   >                 y: 8
   >                 anchors.left: parent.left
   >                 anchors.leftMargin: 8
   >                 text: '(2)'
   >             }
   >         }
   > ```

3. An element left side is aligned to the parent’s right side

   > ```
   >         GreenSquare {
   >             BlueSquare {
   >                 width: 48
   >                 anchors.left: parent.right
   >                 text: '(3)'
   >             }
   >         }
   > ```

4. Center-aligned elements. `Blue1` is horizontally centered on the parent. `Blue2` is also horizontal centered but on `Blue1` and it’s top is aligned to the `Blue1`bottom line.

   > ```
   >         GreenSquare {
   >             BlueSquare {
   >                 id: blue1
   >                 width: 48; height: 24
   >                 y: 8
   >                 anchors.horizontalCenter: parent.horizontalCenter
   >             }
   >             BlueSquare {
   >                 id: blue2
   >                 width: 72; height: 24
   >                 anchors.top: blue1.bottom
   >                 anchors.topMargin: 4
   >                 anchors.horizontalCenter: blue1.horizontalCenter
   >                 text: '(4)'
   >             }
   >         }
   > ```

5. An element is centered on a parent element

   > ```
   >         GreenSquare {
   >             BlueSquare {
   >                 width: 48
   >                 anchors.centerIn: parent
   >                 text: '(5)'
   >             }
   >         }
   > ```

6. An element is centered with a left-offset on a parent element using horizontal and vertical center lines

   > ```
   >         GreenSquare {
   >             BlueSquare {
   >                 width: 48
   >                 anchors.horizontalCenter: parent.horizontalCenter
   >                 anchors.horizontalCenterOffset: -12
   >                 anchors.verticalCenter: parent.verticalCenter
   >                 text: '(6)'
   >             }
   >         }
   > ```

### Input elements

- MouseArea
- TextInput.
  - Permite insertar una línea de texto
    - validator
    - inputMask
    - echoMode
  - Permiten asociar acciones a pulsaciones de teclado: `KeyNavigation.tab: input2`
- TextEdit
  - Igual que TextInput, pero soporta multilínea.

### Keys elements

Permiten ejecutar código basado en ciertas pulsaciones de teclas:

```json
Keys.onLeftPressed: ...
```

### Elementos Fluidos

Gracias a las animaciones podremos describir la interfaz de usuario usando estados y transiciones.

Cada estado define una serie de cambios de propiedades que se pueden combinar con animaciones en cambios de estado (llamadas transiciones)

#### Animaciones

Se aplican a cambios de propiedades.

## Componentes qml libres:

- [dolby](https://developer.dolby.com/technology/dolby-voice/dcpsdk/com-dolby-dcp-components-qmlmodule/)
-

## Mostrar GUI de varios procesos unificados

Se requiere Linux (Wayland):

> Referencia: [QtApplicationManager](https://doc.qt.io/QtApplicationManager/)
