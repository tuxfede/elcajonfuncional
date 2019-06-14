---
title: "Wireshark WSDG"
date: "2018-12-08"
---

## Plugins dissectors

- Wireshark proporciona un framewrok para leer, diseccionar y visualizar tráfico de red.
- Permite a 'dissectors' individuales acceder a datos de red a través de wiretap
- Ofrece funciones útiles para los 'dissectors' cuando están diseccionando datos
- Por último, permiten escribir salidas a los dissectors (para mostrarlas, por ejemplo, en GUI)


> Referencia: https://www.youtube.com/watch?v=IbOVR7QQkvI

- Registran su interés en datos de un protocolo de nivel bajo. Por ejemplo: `tcp port 54321`
- El dissector de nivel bajo le pasa el payload al dissector registrado
- Tras ello, el dissector divide el protocolo en los elementos individuales que componen el mensaje
  - Cada elemento debe tener unt ipo entero, bit, timestamp, etc
- Los dissectors proveen elementos que pueden ser usados en 'display filters' (elementos con nombres)
- Como salida, proporcionan:
  - Protocol column (filtros para mostrar sólo este protocolo)
  - Info column (múltiples paths para ir mostrando más y más información (summary, etc.))
  - Entradas de árbol (subtrees, agregar valores, texto, etc.)
  - Llamar a otros sub-dissectors si se requiere

### Procesar nuevos protocolos

3 Métodos:

- Basado en texto:
  - Built-in, con compilación - ASN.1, IDL
  - Externo, sin compilación - Wireshark Generic Disector (WSGD)
- Basado en scripting:
  - Built-in: Lua
- Basado en C:
  - Formato tradicional, requiere entorno de desarrollo



#### Basado en texto

- ASN.1, IDL
  - El protocolo se define en un fichero de texto (human readable)
  - Las definiciones se interpretarn/compilan para producir el dissector
  - Barrera de entrada baja, aunque se ASN.1 y IDL requieren un entorno de desarrollo para compilar el dissector esultante
  - Método más lento de diseccionar paquetes
  - Poco flexible, pues apenas da acceso a la infraestructura de libwireshark
- WSGD
  - Add-on de Wireshark (http://wsgd.free.fr)
  - Permite diseccionar un protocolo basada en una descripción textual de los elementos del protocolo
  - Disponible para Windows y Linux como un plug-in 
  - Algunas limitaciones, pero relativamente simple y no requiere entorno de desarrollo
    - Sólo el plugin, un editor de texto y wireshark
  - Instalación:
    - Copiar la versión adecuada del plugin en la instalación de Wireshark. Los directorios se pueden ver en `help -> About Wireshark -> Folders` (incluir en subcarpeta epan, ejemplo: `C:\Users\flo\AppData\Roaming\Wireshark\plugins\3.0\epan`)
      - Global plugins
      - Personal plugins
    - Copiar / crear el fichero de definición en una de estas rutas:
      - variable de entorno WIRESHARK_GENERIC_DISSECTOR_DIR
      - Profiles directory
      - User data directory
      - Global plugin directory
      - Wireshark main directory
  - Requiere definir dos archivos:
    - un protocol definition file (nffi.wsgd), que describe los detalles de nivel alto del protocolo a diseccionar. 
      - Ejemplo: nombre, abreviatura
    - Un fichero de definición de los campos

## Plugin WSGD

> Referencia: [wsgd](http://wsgd.free.fr)

Se trata de un plugin de wireshark que permite diseccionar un protocolo a partir de una descripción textual de sus elementos.

## Instalación

1. Instalar Wireshark 3.0.x
2. Copiar el plugin (`generico.dll`) en una de las rutas por defecto de plugins de Wireshark (`help -> About Wireshark -> Folders` )

- (incluir en subcarpeta `epan`, ejemplo: `C:\Users\flo\AppData\Roaming\Wireshark\plugins\3.0\epan`)
- Global plugins
- Personal plugins

3. Crear la variable de entorno `WIRESHARK_GENERIC_DISSECTOR_DIR` y hacer que apunte al directorio donde se almacenarán las definiciones de protocolos. Por ejemplo, `c:\wireshark_protocols`
4. Copiar las definiciones de protocolos `(*.wsgd, *.fdesc)` en una de las siguientes rutas

- Path apuntado por `WIRESHARK_GENERIC_DISSECTOR_DIR`
- Profiles directory
- User data directory
- Global plugin directory
- Wireshark main directory

## Captura de paquetes

Abrir wireshark y capturar paquetes en la interfaz/puerto/dirección definidos en el protocolo.

Por ejemplo, para capturar todo el tráfico con destino a 10.10.3.108, puerto 9999 y que haga uso del protocolo TCP:

```bash
dst host 10.10.3.108 and tcp port 9999
```
