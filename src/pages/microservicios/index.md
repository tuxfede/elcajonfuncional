---
title: "Introduccion a microservicios"
date: "2018-10-10"
---

## Microservicios

- Blog de nginx. [enlace](https://www.nginx.com/blog/building-microservices-using-an-api-gateway/)
- Libro [the art of scalability](http://theartofscalability.com/). [descarga](http://docs.google.com/uc?export=download&id=0B6TT5hyBTvL6ODBkNDVkOGQtZjc5MS00N2FhLWIyY2ItOTlkMzA1NmJkOTc1)
- Teorema de CAP (no se pueden garantizar consistencia, disponibilidad y tolerancia a la partición a la vez). [enlace](https://en.wikipedia.org/wiki/CAP_theorem)
- Libro sobre apis de desarrollador netflix 'APIs. A Strategy guide'. [enlace](http://shop.oreilly.com/product/0636920021223.do)

## Elm

- Curso elm avanzado richard feldman. [frontendmasters](https://frontendmasters.com/courses/advanced-elm/)
- Recursos elm [enlace](https://korban.net/posts/elm/2018-07-31-learning-elm-2018-comprehensive-list-resources/)
  - [elm in actioni](https://www.manning.com/books/elm-in-action)
  - [programming elm jeremy fairbank](https://pragprog.com/book/jfelm/programming-elm)
  - [An Outsider's Guide to Statically Typed Functional Programming](https://leanpub.com/outsidefp)
  - [The json survival kit](https://www.brianthicks.com/json-survival-kit/)
  - [Elm beyond the basics](https://courses.knowthen.com/p/elm-beyond-the-basics)
  - [Building web apps with elm](https://pragmaticstudio.com/courses/elm)
  - [Integrating elm](https://pragmaticstudio.com/courses/integrating-elm)
  - [Elmseeds](https://elmseeds.thaterikperson.com/)
  - [Making impossible states impossible](https://www.youtube.com/watch?v=IcgmSRJHu_8)

## Gantt

- Diagramas en plantuml: [enlace](https://ondahostil.wordpress.com/2018/01/27/lo-que-he-aprendido-diagramas-de-gantt-en-plantuml/)

## WSGI

- Hot reload
  - [The art of graceful reloading](https://uwsgi-docs.readthedocs.io/en/latest/articles/TheArtOfGracefulReloading.html)
- [Best practices](https://uwsgi-docs.readthedocs.io/en/latest/ThingsToKnow.html)
- [Run code when django starts. Entry point hook](https://uwsgi-docs.readthedocs.io/en/latest/ThingsToKnow.html)
  - Explica cómo importar todos los módulos y precargar app completa
- [Optimizar python con nginx](https://www.nginx.com/blog/maximizing-python-performance-with-nginx-parti-web-serving-and-caching/)

## Channels

- Intro channels 1.
  - [Presentación 1](https://rlaverde.me/talks/django-channels/django-channels.pdf)
  - [Presentación 2](https://es.slideshare.net/AlbertOConnor/async-tasks-with-django-channels)
- Servicios de daphne y runworker
  - [enlace 1](https://stackoverflow.com/questions/46655488/running-django-channels-with-daphne-on-systemd)
  - [enlace 2](https://stackoverflow.com/questions/50192967/deploying-django-channels-how-to-keep-daphne-running-after-exiting-shell-on-web)
  - [enlace 3](https://gist.github.com/wyde/dbef999aa8b9fc2f96bdc2e841349613)
  - [enlace 4](https://stackoverflow.com/questions/52276913/django-channels-2-apache-centos-7-deploy)
- Channels vs channels 2
  - pycont2018. [enlace 1](https://speakerdeck.com/chairco/pycontw-2018-easy-way-to-build-a-real-time-and-asynchronous-web-or-app-with-django-channels?slide=85)
  - Charla del creador de channels [enlace](https://speakerdeck.com/andrewgodwin/taking-django-async)

## Obs

- Dibujar en pantalla usando paint (telestrator):
  - [enlace 1 youtube](https://www.youtube.com/watch?v=_n-ozCs9xFc)
  - [enlace 2 youtube](https://www.youtube.com/watch?v=JldTr7Qptt8)
  - Alternativa a paint: [smooth draw](http://www.smoothdraw.com/sd)

## Khan academy

- Crear videos estilo khan academy
  - [enlace 1](https://iteachu.uaf.edu/creating-khan-academy-style-screencasts/)
  - [Documentación oficial](https://khanacademy.zendesk.com/hc/en-us/articles/226885367-How-do-I-recreate-Khan-Academy-videos-)
  - [enlace youtube pizarra](https://www.youtube.com/watch?v=Ohu-5sVux28&feature=youtu.be)
  - Guía con recursos alternativos: [enlace](https://docs.google.com/document/d/1GZhcZrbpJiKlc__ofExEZbHn8jVr2l6u85TA8oT8GxY/edit#)
  - Pencil sencillo (https://github.com/geovens/gInk/)

## Openshot

- Crear perfiles personalizados (1024x768): [enlace](https://www.openshot.org/static/files/user-guide/profiles.html#custom-profile)
- Transiciones. [enlace](https://www.openshot.org/static/files/user-guide/transitions.html)

## Python

- Serializar cualquier tipo usando pep 443: [enlace](https://hynek.me/articles/serialization/)
- python async (async await).
  - Tutorial básico del creador de channels: [enlace](https://www.aeracode.org/2018/02/19/python-async-simplified/)

## Django

- Async roadmap. [enlace](https://www.aeracode.org/2018/06/04/django-async-roadmap/)
- Realtime con django, rabbitmq y uwgsi websocket. [enlace](https://danidee10.github.io/2018/01/13/realtime-django-5.html)

## Channels

- Faq. [enlace](https://channels.readthedocs.io/en/1.x/faqs.html)
  - Explica por qué funciona de forma síncrona en lugar de tornado, gevent, asyncio).
    - Los consumers se ejecutan de forma síncrona y bloquean al sistema.
    - El asincronismo sólo sirve para procesar conexiones concurrentes (websocket)
- Cambios en channels 2. [enlace](https://www.aeracode.org/2017/10/18/channels-2-october/)
  - Permite escribir un consumer asíncrono
- Migrar de channels a channels 2. [enlace](https://channels.readthedocs.io/en/latest/one-to-two.html)
  - Ahora requiere python 3.5 (asyncio)
  - Worker y server en un mismo proceso
  - Channels 1 ejecutaba django y consumers en distintos procesos, comunicándose a través de redis
  - Channels 2, en cambio, ejecuta el código django en el mismo proceso usando threadpool. como consecuencia, cada aplicación se instancia una vez por socket y puede usar variables locales en 'self' en lugar de 'channel_session', variable que se elimina.
  - Channel layer sólo se usa para mensajes broadcast.
  - Ahora los consumers funcionan con un diseño turtles-all-the-way-down
  - Sólo se usa la parte síncrona cuando se accede al sistema django view o al orm.
  - Ahora no se conectan eventos a funciones, sino que los consuemrs deben basarse en clases y sólo se conectan al inicio. Además, los argumentos son pasados en el scope.
  - Además, routing es el punto principal de entrada.
  - Se elimina channel_session y enforce_ordering decorators.
  - channels_redis -> .asgi_redis
  - En lugar de delay server -> asyncconsumer

## Celery

- No es asíncrono!!
- Arquitectura: [enlace](https://www.vinta.com.br/blog/2017/celery-overview-archtecture-and-how-it-works/)
- Ejemplo sencillo: [enlace](http://buhoprogramador.com/entrada/14/celery-django)
- El mismo código se encuentra en cliente y gestor de tareas.
- Trucos y consejos:
  - [enlace](https://www.vinta.com.br/blog/2018/celery-wild-tips-and-tricks-run-async-tasks-real-world/)
  - [enlace 2](https://denibertovic.com/posts/celery-best-practices/)
  - [enlace 3](https://blog.balthazar-rouberol.com/celery-best-practices)
  - [enlace 4](http://celerytaskschecklist.com/)
- Gestionar tareas que consumen muchos recursos o mucho tiempo: [enlace](https://www.vinta.com.br/blog/2018/dealing-resource-consuming-tasks-celery/)
- Como distribuir la selección de tareas y poner temporizadores. [enlace](https://medium.com/@taylorhughes/three-quick-tips-from-two-years-with-celery-c05ff9d7f9eb)
- Documentación sobre workers. [enlace](http://docs.celeryproject.org/en/latest/userguide/workers.html)
- Usa un broker (por ejemplo, rabbitmq) para recibir tareas por una cola y procesarla con los workers
- Se pueden crean múltiples workers. Cada worker puede tener varios hilos.
  - [enlace](https://serverfault.com/questions/655387/running-multiple-workers-using-celery)
  - [enlace 2](https://stackoverflow.com/questions/31898311/celery-difference-between-concurrency-workers-and-autoscaling)
- Para priorizar, crear más de una cola y asignar un único worker a esa cola.
- Ojo, no más workers que cores... concurrencia muy limitada (no es asíncrono)
- Documentación oficial: [enlace](http://docs.celeryproject.org/en/latest/index.html)
- Alternativas a celerys: [listado](https://www.fullstackpython.com/task-queues.html)
- web scraping con celery: [enlace youtube](https://www.youtube.com/watch?v=-ISgjBQDnhw)

## Flask

- Es síncrono (no permite ejecutar asincronismo)
- Libro 'Flask web development'. [enlace](http://shop.oreilly.com/product/0636920031116.do?cmp=af-webplatform-books-videos-product_cj_9781449372620_%25zp)

## RabbitMq

- Formado por la zona de intercambio 'exchange' y colas.
  - Se pueden enviar tareas a exchange o a colas. Si se envía a cola, la consumen directamente los workers. En cambio, enviando a exchange se permite más flexibilidad (enviar a múltiples colas, asociar colas a exchanges, etc). Permite patrón publicador/subscriptor.
- Tutorial oficial. [enlace](https://www.rabbitmq.com/getstarted.html)
- backend rabbitmq para asgi: [enlace](https://github.com/proofit404/asgi_rabbitmq)

## Twisted

- Introducción completísima. [enlace](http://krondo.com/an-introduction-to-asynchronous-programming-and-twisted/)
- Event-driven networking engine. [enlace](https://twistedmatrix.com/trac/)
- Permite hacer algo parecido a 'promesas'(success, error), y anidarlas, ponerlas en paralelo, etc.
- DeferredList. Permite seguir a una lista de Deferred y llamar a un único callback cuando todas se han completado. [enlace](https://twistedmatrix.com/documents/current/api/twisted.internet.defer.DeferredList.html)
- pika. Como request pero asíncrono
- Presentación introductoria a twisted y django. [enlace](https://speakerdeck.com/hawkowl/what-django-can-learn-from-twisted-djangoconau-2015-keynote?slide=19)
- Libro [Expert Twisted: Event-Driven and Asynchronous Programming with python](https://www.amazon.com/Expert-Twisted-Event-Driven-Asynchronous-Programming/dp/1484237412)

## Klein

- Microframwork basado en twisted. [Documentación oficial](https://klein.readthedocs.io/en/latest/)

## Wamp protocol

- Protocolo que usa websocket para permitir pub/sub. [web oficial](https://wamp-proto.org/)
-

## Reactive programing RxPy

- Introducción a reactive programming. [enlace](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
- RxPy web oficial: [enlace](https://github.com/ReactiveX/RxPY)
- Transparencias básicas: [enlace](https://keitheis.github.io/reactive-programming-in-python/#89)
- Presentación youtube. [enlace](https://vtalks.net/talk/valery-calderon-reactive-programming-with-rxpy-pycon-2018/)
- Functional python básico: [enlace](https://github.com/EntilZha/PyFunctional)

## Tornado

- Es asíncrono!
-
