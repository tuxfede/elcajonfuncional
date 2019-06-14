---
title: "OpenSplice DDS - Tutorial"
date: "2019-03-16"
---

# Open Splice DDS

> Tutorial introductorio: <http://download.prismtech.com/docs/Vortex/pdfs/OpenSplice_DDSTutorial.pdf>
>
> Tutorial más completo: <http://www.laas.fr/files/SLides-A_Corsaro.pdf>

## Pre-requisitos

1. Instalar java desde su [web oficial](https://www.java.com/es/download/win10.jsp)
2.

## Instalación precompilados windows

1. Descargar de [github](https://github.com/ADLINK-IST/opensplice/releases/download/OSPL_V6_9_181018OSS_RELEASE/PXXX-VortexOpenSplice-6.9.181018OSS-HDE-x86_64.win-vs2017-installer.zip)

2. Crear carpeta `c:\OpenSplice`

3. Extraer el zip del paso 1 y copiar carpeta HDE en `c:\OpenSplice\HDE

4. Instalar Visual c++ Runtime desde `C:\OpenSplice\HDE\x86_64.win64\redist\install_vcredist.bat`

5. Crear el archivo `C:\OpenSplice\HDE\x86_64.win64\opensplice.bat` y ejecutarlo como administrador:

   ```bash
   setx /m OSPL_HOME %~dp0
   set OSPL_HOME=%~dp0
   setx /m PATH "%OSPL_HOME%bin;%OSPL_HOME%lib;%OSPL_HOME%examples\lib;%PATH%"
   setx /m OSPL_TMPL_PATH %OSPL_HOME%etc\idlpp
   setx /m OSPL_URI file://%OSPL_HOME%etc\config\ospl.xml
   ```

## Compilar versión debug de librerías

1. Abrir proyecto `C:\OpenSplice\HDE\x86_64.win64\custom_lib\Build_DCPS_ISO_Cpp2_Lib.vcxproj`
2. Solution Explorer ->`Build_DCPS_ISO_Cpp2_Lib` -> properties -> Configuration Properties -> General -> Windows SDK Version -> Select last
3. Solution Explorer -> ->`Build_DCPS_ISO_Cpp2_Lib` -> build

## Compilación e instalación desde código fuente (mingw)

> TODO

## Configuración VortexOpenSplice

Se configura usando un XML.

Se puede usar la herramienta osplconf para editar el mismo (\$OSPL_HOME/etc/config).

Por defecto, se definen los siguientes servicios:

- spliced: Domain service. Inicia y monitoriza el resto de servicios
- durability: Responsable de almaceanr datos no volátiles y mantener consistencia en el dominio
- networking: Realiza la comunicación entre nodos en el dominio
- Tuner: Ofrece una interfaz SOAP para conectarse a los nodos remótamente.
-

## Iniciar código de ejemplo

- Descargar Visual Studio community 2017
  - Descargar SDK Windows 8.1
  - Universal CRT SDK

Abrir `C:\OpenSplice\HDE\x86_64.win64\examples\All_Standalone_C_and_CPlusPlus

## Crear un ejemplo básico

### Crear fichero idl

crear un fichero con extensión .idl e incluir en él los diferentes datos (topics)

### Compilar el fichero idl

Aplicación general:

```bash
idlpp -l cpp fichero.idl
idlpp -S -l isocpp2 topics.idl
```

Versión antigua de c++:

```bash
$ cppgen fichero.idl
```

versión iso c++ 11:

```bash
$ cppgen -iso fichero.idl
```

## DDS

### Conceptos básicos

- Dynamic discovery
- Data space completely descentralised
- Topics definidos por:
  - Name: identificador del topic en el dominio
  - type: tipo de datos asociado al topic.
  - qos: colección de políticas que expresan propiedades del topic (reliability, persistence, etc.)
    - Algunas políticas se comprueban en un modelo Request vs Offered RxO model
  - Pueden ser Singleton o tener múltiples instancias
    - Una instancia se identifica por su 'topic key'
      - Una topic Key se identifica por una tupla de atributos
- Domain: Lugar donde viven los datos en dds
  - Identificado con un número no negativo
  - 0 identifica el dominio por defecto
  - Plano de comunicación que limita fronteras
- Partición
  - Mecanismo para organizar la información en un dominio
  - Acceso controlado a a través de políticas QoS
  - Se definen como cadenas: "system:telemetry", "system:log"
  - Se pueden localizar por regular expressions: "system:\*"
- Domains participants dan acceso al dominio DDS
- Publisher/Subscribers dan acceso a la particion
- DataWriter/DataReader escriben/leen datos de topics que pertenecen a una partición asociada a sus subscriptores/publicadores
  - Datawriter: Entidad fuertemente tipada que produce muestras para una o más instancias de un topic con una QoS dada
    - Al menos misma QoS que el topic o más restrictiva
    - Controla el ciclo de vida de la instancia de un topic
    - Cada dataWriter tieen una caché asociada.
      - Las escrituras son siempre locales a la caché
      -
  - DataReade: Entidad fuertemente tipada usada para acceder o consumir muestras de un Topic para una QoS dada
    - Misma Qos que el topic o menos restrictiva.
    - Almacena las últimas n muestras para cada instancia (n pertenece a N..inf)
    - Las muestras pueden ser leidas (read) o extraídas (take) de la caché
      - read: Operación no destructiva
      - take: Operación destructiva
- Samples: Las muestras incluídas en la caché del DataReader tienen asociada metainformación:
  - Sample State: Distingue entre nuevas muestras y muestras leídas (READ, NOT_READ)
  - View state: distingue entre una nueva instancia de una ya existente (NEW, NOT_NEW)
  - Instance state permite controlar los cambios en el ciclo de vida de la instancia a las que pertenece la muestra (ALIVE, NOT_ALIVE_DISPOSED, NOT_ALIVE_NO_WRITERS)
- Modelos de interacción:
  - Polling: La aplicación le pregunta proactivamente por disponibilidad de datos.
  - Synchronous Notificaions: La aplicación espera a que una condición se cumpla
    - WaitSet
      - Communication statuses
      - data_availability
      - data availibility with specific content
      - user-triggered conditions
  - Asynchronous Notificaionts: La aplicación registra su interés en ser notificado asíncronamentemente (callback)
    - Listeners
      - Ver ejemplo LambdaListener
- DDS Content Filtering: Sólo se registra en la cache local solo los topics data que satisfagan un predicado
- DDS Queries seleccionan datos de la cache que coincidan con un preidcado
- Durabilidad de los Streams:
  - A través de QoS es posible controlar qué subset del stream de datos será retenido y hecho disponible para los usuarios que se unan más tarde.
    - last n samples (n=1 == caso especial)
    - Todas las muestras escritas en el topic
  - Par ello, DDS define 3 tipos de durabilidad
    - Volatile: sin durabilidad
    - Transient (local): Datos disponibles para 'late-jointers' (re-play) tanto tiempo como el sistema (data source) esté corriendo
    - Durable: Datos disponibles para 'late-joiners' tanto tiempo como el sistema/fuentes estén corriendo
- Fiabilidad (reliability):
  - Best Effort: DDS entregará una subsecuencia arbitraria de muestras escritas en una instancia de topic
    - Las muestras pueden perderse debido a périddas de red o control de flujo
  - Last n-values Reliability: En condiciones estacionarias se garantiza la recepción de las últimas n-muestras escritas para un topic
    - Se comporta como un circuit breaker para slow ocnsumers
  - Reliable: Todas las muestras son entregadas.
- Tolerancia a fallos (Fault-Tolerance)
  - Mecanismos para detección de fallos
    - Liveliness policy
  - Mecanismos de detección de problemas de rendimiento.
    - Deadline Policy
- Fault-Masking
  - Permite replicar 'Sources' y cambiar a ellas de forma transparente cuando ocurren fallos en la primaria.
    - Fuente activa == fuente con más fortaleza.

### Abreviaturas

- GDS: Global Data Space (=== domain)
- DCPS: Data Centric Publish Subscriber (High level API for programming)
- DDSI-RTPS: DDS Interoperability Protocol (L5 session layer). Wire protocol
- DDS-XTypes: eXtensible Types: Extendes DDS type system (support for evolutions and forward compatibility)
- DDS-Security: Security arch. with pluggable Authentication, Access Control, Crypto and Logging
- DDR-RPC: Remote procedure Calls
- DDS-XRCE: eXtremely Resource Constrained Environments. Power/memory efficient protocol.

### QoS

Para que los datos fluyan desde el datawriter al datareader tienen que cumplirse las siguientes condiciones:

- DR y DW en el mismo dominio
- DR y DW deben pertenecer a la misma partición (en términos de expresiones regulares)
- La QoS ofrecida por DW debe ser compaible (exceder o coincidir) con la requerida por DR

### Datawriter

```cpp
#include <dds.hpp>
int main(int, char**) {
 DomainParticipant dp(0);
 Topic<Meter> topic(“SmartMeter”);
 Publisher pub(dp);
 DataWriter<Meter> dw(pub, topic);
while (!done) {
 auto value = readMeter()
 dw.write(value);
 std::this_thread::sleep_for(SAMPLING_PERIOD);
 }
return 0;
}
```

### Datareader (usando lambda funcionts)

```cpp
#include <dds.hpp>
int main(int, char**) {
 DomainParticipant dp(0);
 Topic<Meter> topic(”SmartMeter”);
 Subscriber sub(dp);
 DataReader<Meter> dr(dp, topic);
 LambdaDataReaderListener<DataReader<Meter>> lst;
 lst.data_available = [](DataReader<Meter>& dr) {
 auto samples = data.read();
 std::for_each(samples.begin(), samples.end(), [](Sample<Meter>& sample) {
 std::cout << sample.data() << std::endl;
 }
 }
 dr.listener(lst);
 // Print incoming data up to when the user does a Ctrl-C
 std::this_thread::join();
 return 0;
}
```

### Ciclo de vida de instancias de topic

El ciclo de vida de un topic puede ser gestionado implícita o explícitamente. Transiciones en el ciclo de vida pueden tener implicaciones en el uso de recursos del publicador y los suscriptores.

Estados del topic:

- ALIVE: Existe al menos un DataWriter registrado en el topic (explícita o implícitamente).
  - El Datawriter que registra una instancia declara que publicará actualizaciones tan pronto como ocurran. Por ello, reserva recursos para mantener la administración de la instancia y al menos una de sus muestras
  - El Datareader también reservará recursos para cada instancia registrada.
- NOT_ALIVE_NO_WRITERS: No hay más DataWriters que hayan registrado la instancia. Es decir, nadie tiene intención de actualizar la instancia (todos liberaron el recurso).
  - En este estado, los DataReaders no esperan recibir datos nuevos, por lo que podrían liberar los recursos asociados.
  - Si un Writer olvida desregistrar la instancia, entonces estará bloqueando recursos locales y de todos los suscriptores
- NOT_ALIVE_DISPOSED: La instancia fue dispuesta implícitamente a tra'ves de QoS settings) o explícitamente por un DataWriter concreto. Este estado indica que la instancia no es relevante para el sistema y debería ser eliminada.
  - La gran diferentecia con NOT_ALIVE_NO_WRITERS es que éste último indica que nadie pretende actualizar la instancia, pero no indica nada sobre la validaez del último estado cnocido.

Por defecto, cuando un DataWriter se destruye, todas sus topic instances se cambiana estado 'disposed'.

El ciclo de vida puede gestionarse de forma explícita a través de la API del DataWriter, lo cual es una buena práctica a seguir cuando una aplicación escribe instancias con mucha frecuencia.

Por ejemplo, para evitar que un topic-instance se disponga cuando un datawriter se desregistra:

```cpp
#include <iostream>
#include <TempControl_DCPS.hpp>
int main(int, char**) {

dds::domain::DomainParticipant dp(org::opensplice::domain::default_id());
dds::topic::Topic<tutorial::TempSensorType> topic(dp, "TempSensorTopic");
dds::pub::Publisher pub(dp);

//[NOTE #1]: Avoid topic-instance dispose on unregister
dds::pub::qos::DataWriterQos dwqos = pub.default_datawriter_qos()
<< dds::core::policy::WriterDataLifecycle::ManuallyDisposeUnregisteredInstances();

    //[NOTE #2]: Creating DataWriter with custom QoS.
// QoS will be covered in detail in article #4.
dds::pub::DataWriter<tutorial::TempSensorType> dw(pub, topic, dwqos);
tutorial::TempSensorType data(0, 24.3F, 0.5F, tutorial::CELSIUS);
dw.write(data);

tutorial::TempSensorType key;
short id = 1;
key.id(id);

//[NOTE #3] Registering topic-instance explicitly
dds::core::InstanceHandle h1 = dw.register_instance(key);
id = 2;
key.id(id);
dds::core::InstanceHandle h2 = dw.register_instance(key);
id = 3;
key.id(id);

dds::core::InstanceHandle h3 = dw.register_instance(key);
dw << tutorial::TempSensorType(1, 24.3F, 0.5F, tutorial::CELSIUS);
dw << tutorial::TempSensorType(2, 23.5F, 0.6F, tutorial::CELSIUS);
dw << tutorial::TempSensorType(3, 21.7F, 0.5F, tutorial::CELSIUS);

    // [NOTE #4]: unregister topic-instance with id=1
    dw.unregister_instance(h1);

    // [NOTE #5]: dispose topic-instance with id=2
dw.dispose_instance(h2);

    //[NOTE #6]:topic-instance with id=3 will be unregistered as
// result of the dw object destruction
return 0;
}

```

Seleccionar datos sólo de una instancia concreta:

```cpp
tutorial::TempSensorType key;
key.id() = 123;
auto handle = dr.lookup_instance(key);
auto samples = dr.select().instance(handle).read();

```

### Iteradores o contenedores

Por defecto, cuando se leen datos de DDS se toman 'prestados' (loan) (se devuelven referencias al objeto).

Es decir, el programador no proporciona almacenamiento para las muestras.

Si queremos almacenar los datos en un contenedor, podemos usar iteradores:

```cpp
// Forward iterator using array.
dds::sub::Sample<tutorial::TempSensorType> samples[MAXSAMPLES];
unsigned int readSamples = dr.read(&samples, MAXSAMPLES);

// Forward iterator using vector.
std::vector<dds::sub::Sample<tutorial::TempSensorType> > fSamples(MAXSAMPLES);
readSamples = dr.read(fSamples.begin(), MAXSAMPLES);

// Back-inserting iterator using vector.
std::vector<dds::sub::Sample<tutorial::TempSensorType> > biSamples;
uint32_t readBiSamples = dr.read(std::back_inserter(biSamples));
```

### Espera bloqueante de datos

Usar waitset para esperar datos disponibles

```cpp
// Create the WaitSet
dds::core::cond::WaitSet ws;
// Create a ReadCondition for our DataReader and configure it for new data

dds::sub::cond::ReadCondition rc(dr, dds::sub::status::DataState::new_data());
// Attach the condition
ws += rc;
// Wait for new data to be available
ws.wait();
// Read the data
auto samples = dr.read();
std::for_each(samples.begin(),
samples.end(),
[](const dds::sub::Sample<tutorial::TempSensorType>& s) {
std::cout << s.data() << std::endl;
});

```

Usar waitset para despachar datos entrantes:

```cpp
// Create the WaitSet
dds::core::cond::WaitSet ws;
// Create a ReadCondition for our DataReader and configure it for new data
dds::sub::cond::ReadCondition rc(dr,
dds::sub::status::DataState::new_data(),
[](const dds::sub::ReadCondition& srcCond) {
dds::sub::DataReader<tutorial::TempSensorType> srcReader = srcCond.data_reader();
// Read the data
auto samples = srcReader.read();
std::for_each(samples.begin(),
samples.end(),
[](const dds::sub::Sample<tutorial::TempSensorType>& s) {
std::cout << s.data() << std::endl;
});
});
// Attach the condition
ws += rc;
// Wait for new data to be available
ws.dispatch();
```

### Espera asíncrona de datos

Crear un listener:

```cpp
class TempSensorListener :
public dds::sub::NoOpDataReaderListener<tutorial::TempSensorType>
{
public:
virtual void on_data_available(
dds::sub::DataReader<tutorial::TempSensorType>& dr) {
auto samples = dr.read();
std::for_each(samples.begin(), samples.end(),
[](const dds::sub::Sample<tutorial::TempSensorType>& s) {
std::cout << s.data().id() << std::endl;
});
}
};

TempSensorListener listener;
dr.listener(&listener, dds::core::status::StatusMask::data_available());

```

### QoS Model

DDS proporciona política de control de propiedades no funcionales como:

- Disponibilidad de datos (data availability). Controlan la disponibilidad de datos en un dominio de participantes
  - Política de DURABILITY: Controla el tiempo de vida del dato escrito en el global data space.
    - VOLATILE: una vez que el dato es publicado deja de ser mantenido por DDS para la entrega a suscriptores posteriores.
    - TRANSIENT_LOCAL: El publicador almacena los datos localmente para que posteriores suscriptores obtengan el último item publicado si el publicador sigue vivo.
    - TRANSIENT: Asegura que el GDS mantenga información fuera del ámbito local de cualquier publicador para cualquier suscriptor.
    - PERSISTENT: Asegura que GDS persista la información incluso después de un reinicio de sistema
    - Esta política hace uso del servicio de durabilidad
  - LIFESPAN: Controla los intervalos de tiempo durante los cuales una muestra es válida (por defecto, infinito)
  - HISTORY: Controla el número de muestras que deben ser almacenados por readers y writers (last, last n, all)
- Entrega de datos (data delivery). Controla cómo se entregan los datos y como el publicador puede solicitar derechos exclusivos de actualizar datos
  - Política PRESENTATION. Controla cómo se presentan al suscriptor cambios en el modelo de información.
    - INSTANCE
    - TOPIC
    - GROUP level
  - RELIABILITY. Grado de fiabilidad asociado a la difusión de datos
    - RELIABLE
    - BEST EFFORT
  - PARTITION. Asociación entre una partición y una instancia específica de publicador/suscriptor. (útil para mejroar escalabilidad, performance)
  - DESTINATION_ORDER: Controla el orden de cambios que un publicador hace sobre instancias de un topic (ordenador de acuerdo a source o destination timestamps)
  - OWNERSHIP. Controla el propietario del acceso a escritura de un topic cuando hay múltiples writers y se quiere ownership EXCLUSIVE. Sólo el writer con más alto OWNERSHIP_STRENGTH puede publicar dato.
- data timeliness. Controlan las propiedades temporales de los datos distribuidos
  - DEADLINE. Permite a las aplicaciones definir el intervalo máximo entre el que se espera la llegada dedatos.
  - LATENCY_BUDGET: Permite informar de la urgencia asociada a la transmisión de un dato.
  - TRANSPORT_PRIORITY: Controla la importancia de un topic/topic instance.
- Uso de recursos (Resource Usage). Controla el uso de recursos de red y computador:
  - TIME_BASED_FILTER. Permite especificar la capacida de consumir información a máxima tasa. Las muestras producidas a una tasa más rápida que la esperada en el consumidor no serán entregadas. Ayuda a DDS a optimizar el ancho de banda, capacidad de congestión del suscriptor, etc
  - RESOURCE_LIMITS. Permite controlar el almacenamiento disponible máximo para almacenar topic instances y muestras.

#### Otra QoS

DDS permite definir y distribuir otra información de usuario a través de otras políticas de QoS

- USER_DATA: Permite asociar octetos a dominios, data readers y data writers. Esta ifnormación es transmistida para un topic
- TOPIC_DATA. Permite asociar octetos a topics y distribuirla a los usuarios del topic
- GROUP_DATA. Permite asociar octetos a publisher y subscribers.

#### Establecer Qos usando un xml (QoSProvider)

Para que una aplicación sea configurable más fácilmente en tiempo de ejecución, se pueden cargar las políticas de QoS de un archivo

```cpp
dds::core::QosProvider qp("file://defaults.xml", "DDS DefaultQosProfile");
// create a Domain Participant, -1 defaults to value defined in configuration file
dds::domain::DomainParticipant dp(-1);
dds::topic::qos::TopicQos topicQos = qp.topic_qos();
dds::topic::Topic<tutorial::TempSensorType> topic(dp, "TempSensor", topicQos);
dds::pub::qos::PublisherQos pubQos = qp.publisher_qos();
dds::pub::Publisher pub(dp, pubQos);
dds::pub::qos::DataWriterQos dwqos = qp.datawriter_qos();
dds::pub::DataWriter<tutorial::TempSensorType> dw(pub, topic, dwqos);

```
