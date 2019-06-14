---
title: "DO-178c - Recursos"
date: "2019-03-21"
---

## DO-178C - enlaces básicos

Documento oficial (300 euros): https://my.rtca.org/nc__store?search=178

[enlace][https://my.rtca.org/nc__product?id=a1b36000001icmqeac]

[Enlaces interesantes sobre doc. necesaria para certificación](http://www.open-do.org/about/software-certification-101/)

[documentación mínima para certificación](http://blog.heicon-ulm.de/rtca-do178c-software-quality-in-aerospace/)

[do 178 y uavs, (muy interesante)](http://interactive.aviationtoday.com/avionicsmagazine/february-2017-march-2017/do-178c-software-for-nextgen-avionics-uavs-and-more/)

# Recursos safety-critical

[awesome-safety-critical](https://github.com/stanislaw/awesome-safety-critical)

# SMACCMPilot (basado en Haskell)

[overview](https://smaccmpilot.org/software/gcs-overview.html)

[code for stm32f4](https://github.com/GaloisInc/smaccmpilot-stm32f4)

# Hionos autopilot (basado en spark)

[hionos](https://www.hionos.com/pulsar-system)

# Spark

[referencia wikipedia](<https://en.wikipedia.org/wiki/SPARK_(programming_language)>)

[Spark pro - Versión de pago](https://www.adacore.com/sparkpro/)

[Intro to spark](https://learn.adacore.com/courses/intro-to-spark/index.html)

[User guide](http://docs.adacore.com/spark2014-docs/html/ug/)

[Libro Building High integrity applications with spark](https://www.cambridge.org/core/books/building-high-integrity-applications-with-spark/F213D9867D2E271F5FF3EDA765D48E95)

[Listado de recursos ada y spark](http://www.adaic.org/learn/materials/#spark_books)

[blog adacore](https://blog.adacore.com/tag/SPARK)

[Juego de acertar número en ada](https://two-wrongs.com/guessing-game-ada-style)

[expressive ada](https://two-wrongs.com/expressive-ada-2012-challenge.html)

[QGen Video](https://www.youtube.com/watch?v=DiBn6g_tAhU)

[MakeWithAda](https://www.makewithada.org/getting-started)

## Videos ada/spark

[Introducción ada](https://www.youtube.com/watch?v=S3I24cIQn3c)

[embedded systems](https://www.youtube.com/watch?v=FTdHWjg38QE)

[Adapilot](http://adapilot.likeabird.eu/Developers/adapilot-develo1.html)

[Evolución de spark y usos](https://www.youtube.com/watch?v=e66tFYm3tSE)

[Vehículos autónomos ada](https://www.youtube.com/watch?v=IU-Tk91KVAk)

[Ejemplos de uso spark (typhoon, sholis, c130J)](https://www.youtube.com/watch?v=QIrpi8_1P9g)

[UAV - legislación y spark](https://www.youtube.com/watch?v=DnsLpEgFUSk)

[Ada e ibm para safety certifications](https://www.youtube.com/watch?v=7wiFX9x19bg)

## Formación Spark/Ada

### Oficial

[Curso gratiuto en París (5 días)](https://www.adacore.com/public-ada-training)

[Curso fundamentos de Ada (5 días)](https://www.adacore.com/training/ada-fundamentals)

[Curso Ada avanzado (5 días)](https://www.adacore.com/training/ada-advanced-topics)

[Spark 2014 (5 días)](https://www.adacore.com/training/software-engineering-with-spark-2014)

[Gnat pro y Do-178C (3 días)](https://www.adacore.com/training/do-178b-and-do-178c-for-software-professionals)

[Tutorías](https://www.adacore.com/mentorship)

### Partners

[Curso universidad edinvurgh](http://www.inf.ed.ac.uk/teaching/courses/fv/)

[Curso youtube básico](https://www.youtube.com/playlist?list=PLkoa8uxigENkneyEEeDWVPgpMhPc9IJ7o)

# Model Based design

[Frama-C](https://www.youtube.com/watch?v=iC4i25jBaYg)

[Frama-C II](https://www.youtube.com/watch?v=lwgil0xlgZ4)

[Matlab y model based design para do-178c](https://www.youtube.com/watch?v=O7xItnkXEOs)

# Métodos formales

[Referencia wikipedia](https://en.wikipedia.org/wiki/Formal_methods)

[videos sobre conceptos de verificación de software](https://www.microsoft.com/en-us/research/project/the-verification-corner/?from=http%3A%2F%2Fresearch.microsoft.com%2Fen-us%2Fprojects%2Fverificationcorner%2F)

[Z-Notation](https://en.wikipedia.org/wiki/Z_notation)

[Conferencias métodos formales](https://www.cs.utexas.edu/~hunt/FMCAD/)

# Análisis estático

[Listado de herramientas](http://www.popflock.com/learn?s=List_of_tools_for_static_code_analysis)

[awesome-static-analysis](https://github.com/mre/awesome-static-analysis)

[LLVM para analizar código](https://www.youtube.com/watch?v=pmy1Ttieh3I)

## Documentación a aportar para certificación

#### Ejemplo 1

- **Plan Templates**
  Plan for Software Aspects of Certification -> Eje central. Overview del proyecto entero, describiendo su esencia y las estrategias para la certificación
  Development Plan (SDP)-> lifecycle, resultados, estructuras de organmización, métodos de desarrollo y herramientas.
  Verification Plan ->? Desarrolla como quieras, pruebame que lo que has hecho es correcto. (estrategia de verificación, responsabilidades organicionales, métodos para asegurar la independencia, métodos de verificación (review, test), verificación del entorno, corrección del compilador)
- scmp (software configuration management plan): herramientas, actividades, etc.
- sqap (software quality assurance plan) reviews, audits, reports, etc.
- **Standards**
  Configuration Management Plan
  Quality Assurance Plan
  Requirements Standard
  Coding Standards
  Design Standard
- **Project Templates and Code**
  Requirements Specification
  Requirements Document
  Design Document
  Unit Test Procedures, Plans, Reports
  Integration Test Procedures, Plans, Reports
  Tool Qualification Plans
  Tool Qualification PlansTrace Matrices
  Life Cycle Configuration Index
  Configuration Index
  Accomplishment Summary
  Safety Manual
- **Reviews**
  Document Review Procedure
  Document Review Sheets
  Code Review Procedure
  Code Review Sheets
  SQA Checklists

#### Ejemplo 2

- Software lifecycle management
  - Planning
    - Define Requeriments (R)
      - Lenguaje a usar
    - Design dthe program (D)
      - Límites de complejidad, memoria dinámica, etc
    - Code the program (C')
      - Sw code standars (sintaxis, semántica y restricciones)
    - Integrate the program (I)
  - Development
- 5 planes:
  - SW Development Plan
  - SW Verification Plan
  - SW quality assurance plan
  - Sw configuration Plan
  - SW aspects of certificaition
- razabilidad de requerimientos con código y tests
  - System requirements allocated to software (pdf, word, excel, doors)
  - High level requirementes/ specification model (pdf, word, excel, doors <> diseno: simulink, scade suite, uml) (black box de un componente). Tener en cuenta requisitos de performance, timing, memory size constraints, hw and sw interface
  - Low-level requirements/Design Model (simulink, scade, uml <> source code ). restricciones de algoritmos, estructuras de datos, definiciones de entrada y salida, funciones, etc.
  - Source Code <> Test Ca
- Coding Standards
  - Misra C, cert c, cwe, hihgh integrity c++, netrino c, ipa/sec c
  - integración en ide.
  - batch mode para peer review
  - Extraer reportes
- Codigo verificable:
  - No unreachable lines or branches
  - No infeasible paths
  - smaller function sizes
  - Comlexity metrics
- Data and control flow analysis
- Structural coverage (functional and unit tests) (probar todos los caminos)
- Integration with targets (system tests)
- Bidirectional linked requirements and source code
- Metodos y notación
- Lenguaje y restricciones
- Herramientas de desarrollo y verificación
  - Reviews: checklist
  - Análisis: evidencias repetible de software 'correctness': data flow, call-tree, memory usage, etc.
  - Trazabilidad: partes de código que cumplen el requerimiento
  - Doors
- Configuration management: Cambios se realizan de una forma controlada.
  - a alto nivel no deberían existir (para eso existe la fase de planificación
  - a bajo nivel, sencillos pero hay que documentarlos.
- Quality assurance. Asegura que se cumple el proceso de calidad. Tiene checks independientes

#### Ejemplo 3

- Plan for Software Aspects of Certification (PSAC)

  Visión global del proyecto

  - System Overview
  - Software Overview
  - Certification Considerations
  - Software Lifecycle
  - Software Lifecycle Data
  - Schedule
  - Additional Considerations

- Software Quality Assurance Plan

  Validará el correcto seguimiento de todos los planes (desarrollo, verificación, etc)

  - Environment
  - Authority
  - Activities
  - Transition Criteria
  - Timing
  - SQA Records
  - Supplier Control

- Software Configuration Management Plan

  Gestión de la configuración (como afectan cambios en el ciclo de vida del proyecto)

  - Problem Reporting
  - Environment
  - Activities
  - Configuration Identification
  - Baselines and Traceability
  - Change Control
  - Change Review
  - Configuration Status Accounting
  - Archive, Retrieval, and Release
  - Software Load Control
  - Software Lifecycle Environment Controls
  - Software Lifecycle Data Controls
  - Transition Criteria
  - SCM Data
  - Supplier Control

- Configuration Control Procedures

- Software Code Standard

  Misra C, cert c, cwe, hihgh integrity c++, netrino c, ipa/sec c

- Software Design Standard

  Límites de complejidad, recursión, asignación dinámica de memoria, etc.

- Software Requirements Standard

  Lenguaje (inglés)/gerkin, uml. Requerimientos de alto nivel: The take-off angle cannot be more than 55deg Requerimiento de bajo nivel: En la función 'xxx' la variable x representa el ángulo de ataque

- Software Development Plan

  Lifecycle

  - Standards
  - Software Lifecycle
  - Software Development Environment

- Software Verification Plan

  Test que se implementarán, análisis estático/dinámico, temporales, data flow, call-tree, reviews (checklist). Structural coverage (decision, statement, etc.)

  - Organization
  - Independence
  - Verification Methods
  - Verification Environment
  - Transition Criterio

- Source, Executable Object Code, SCI and SECI

  Artefacto

- Software Design Document

- Software Requirements Document

- Traceability

- Test Cases and Procedures

- Verification Results

- Quality Assurance Records

- Configuration Management Records

- Problem Reports

- Software Accomplishments Summary

### Estándares de código

codign standards: misra, autosar, high integrity c++, jsfc++, cert
