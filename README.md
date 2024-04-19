# EngineOfGame2D
Diseño e implementación de librería que ofrece un conjunto de clases que facilitan el desarrollo de videojuegos 2D. Este proyecto tiene como objetivo comprender el funcionamiento de un motor de juego 2D e implementar patrones de diseño, análisis de complejidad algorítmica, correcto uso de estructuras de datos para mayor rendimiento del mismo. Permite el manejo (transformaciones y comunicaciones) entre objetos complejos compuestos con diferentes componentes, sistema de colisiones, renderizado, etc. {Estado: En desarrollo}

**DIAGRAMA DE CLASE:**

![Alt text](LibraryGame2D-DC.png)

Características tenidas en cuenta:
- *Patrón pool de componentes:* técnica/comportamiento que permite mejorar el rendimiento al reutilizar componentes previamente creados en lugar de crear nuevos rápidamente. Utilizado en situaciones donde la creación(añadir) y destrucción(eliminar) frecuentemente de objetos es costosa, como lo es en los arrays, donde la inserción o eliminar elementos en la estructura implica un costo elevado por su naturaleza, donde al estar completa de elemento se realiza un proceso de reasignación a un nuevo bloque de memoria contigua más amplio y copia del resto elementos con el nuevo al mismo. (Sistema de partículas, balas, etc). Esto puede implicar la sustitución de un elemento o manejo de estados de los mismos dentro del array, sin afectar así la longitud. 
  
- *Uso de estructura de datos:* uso de arrays para el manejo de componentes en containers permite una gran velocidad de recorrido/lectura secuencial de componentes para sistema de detección de colisiones, actualización de estado en cada frame, etc. Esto dado que los arrays son un conjunto consecutivo (contiguo) reservado(direcciones) de espacios en memoria, lo que permite una gran velocidad del recorrido/lectura de componentes (Teniendo en cuanta el problema de redimension en arrays que afectan al rendimiento, se encuentran estos casos contemplados por ítem anterior "patrón pool de componentes").
  
  ![image](https://github.com/AxelK1999/EngineOfGame2D/assets/69541858/5f96cc71-f7d6-4888-b726-936644e29621)

  
- *Otros análisis de complejidad para mayor rendimiento:*
  - Reducción de complejidad algorítmica del proceso de verificación de colisiones entre componentes en un espacio de colisión, implementando para colliders polígonos 2D complejos (número elevado de vértices) o conjunto de componentes colisionables (paredes, estructuras, componentes compuestos/complejos etc.) un Rectángulo 2D (colliderAABB) que los encerrara/contendrá, de este modo es menos costoso de verificar colisiones entre rectángulos que polígonos complejos o muchos componentes que pueden no estar colisionando, entonces de colisionar con el AABB(colliderAABB) entonces se procede a ejecutar los algoritmos para verificar polígonos(más costosos al comprobar con cada intersección entre segmentos) o recorrer cada componente de un conjunto de componentes dentro de espacio de colisión AABB, entonces, logramos reducir el número de verificaciones de colisiones (algoritmos costosos) cuando se tiene un gran conjunto de componentes, es decir la complejidad algorítmica (costo) cuando aumenta "N:número de componentes/número de vértices de polígonos en escena".
  - Detección de colisión de componente una sola vez con otros componentes en el método "detecteColision" reduciendo primera implementación con una complejidad de N^2 donde si **N=2=>4, N=3=>6, N=4=>16, N=5=>25, N=6=>36, …** a una complejidad de que si **N=2=>1, N=3=>3, N=4=>6, N=5=>10, N=6=>15, …** .Esto a verificar un elemento A con los demás en el recorrido para en el siguiente recorrido el componente B partir de la posición siguiente a la del él y así sucesivamente para cada elemento, de este modo reducimos el número de comprobaciones e iteraciones a ser realizadas. (doble estructura iterativa, vea función detcteColision2D de la clase Collision2D). **N = número de componentes colisionables** en este caso.
  - Implementación de filtro de colisión en contenedor Composite: de este modo se reduce el número de iteraciones de verificaciones por colisiones en conjunto de componentes o parte de otro más complejo, además de la categorización del componente que determina si será colisionables.

    ![image](https://github.com/AxelK1999/EngineOfGame2D/assets/69541858/5e5fe2ec-7c5d-4508-b157-84b6de93001d)

- *Investigación e implementación de patrones de diseño*, algunos de ellos:
  - Estructurales: Composite, Flyweight
  - Comportamiento: Obsarver, State, Strategy
  - Creacionales: Singleton, Builder, Factory Mehod
- Referencias :
  - [Patterns.dev](https://www.patterns.dev/) - [Refactoring.guru](https://refactoring.guru/es/design-patterns) .
  - Vallejo Fernández, D., Martín Angelina, C. (2015). Desarrollo de Videojuegos: Un Enfoque Práctico (Volumen 1. Arquitectura del Motor). David Vallejo, Carlos González y David Villa (Eds.). Pp. 14-26, Pp. 111-147, Pp. 161-177 .
  - https://www.freecodecamp.org/espanol/news/la-complejidad-de-los-algoritmos-simples-y-las-estructuras-de-datos-en-js/ .
  - https://es.javascript.info/array#performance .
  - https://docs.unity3d.com/es/530/Manual/ExecutionOrder.html
  - https://brm.io/matter-js/docs/
  - Goycoechea, S. y Wallace, T. Fingsics: simulador de colisiones masivas [en línea]. Tesis de grado. Montevideo : Udelar. FI. INCO, 2021.
  - https://docs.unity3d.com/es/530/Manual/ControllingGameObjectsComponents.html
 
