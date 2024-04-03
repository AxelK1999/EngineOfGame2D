# EngineOfGame2D
Diseño e implementación de librería que ofrece un conjunto de clases que facilitan el desarrollo de videojuegos 2D. Este proyecto tiene como objetivo comprender el funcionamiento de un motor de juego 2D e implementar patrones de diseño, análisis de complejidad algorítmica, correcto uso de estructuras de datos para mayor rendimiento del mismo. Permite el manejo (transformaciones y comunicaciones) entre objetos complejos compuestos con diferentes componentes, sistema de colisiones, renderizado, etc. {Estado: En desarrollo}

**DIAGRAMA DE CLASE:**

![Alt text](LibraryGame2D-DC.png)

Características tenidas en cuenta:
- *Patrón pool de componentes:* cuando un conjunto de componentes se destruyen(eliminan) y crean(añaden) con frecuencia, implican un costo de redimensionar la estructura de datos mencionada, entonces, este patrón permite reutilizar(suspendiendo o cambiando de posición/estado en lugar de quitar y añadir) los componentes reduciendo el costo de redimensionar por ejemplo un array de componentes en memoria cada vez que se destruyen. Por ejemplo, sistema de partículas, balas, etc.
  
- *Uso de estructura de datos:* uso de arrays para container o partes de componentes que permite una gran velocidad de recorrido/lectura secuencial de componentes para sistema de detección de colisiones, actualización de estado en cada frame, etc. Esto dado que los arrays son un conjunto consecutivo reservado(direcciones) de espacios en memoria, lo que permite una gran velocidad del recorrido/lectura de componentes (Teniendo en cuanta el problema de redimension en arrays que afectan al rendimiento, se encuentran estos casos contemplados por ítem anterior "patrón pool de componentes").
  
- *Análisis de complejidad:* se busca reducir lo más posible la complejidad algorítmica, implementando para colliders polígonos 2D o conjunto de componentes(paredes, estructuras, etc. colisionables) un Rectángulo 2D (colliderAABB) que los encerrara, de este modo es menos costoso de verificar colisiones entre rectángulos que polígonos complejos o muchos componentes que pueden no estar colisionando, entonces de colisionar con el AABB entonces se procede a ejecutar los algoritmos para verificar polígonos(más costosos al verificar con cada intersección entre segmentos) o recorrer cada componente de un conjunto componentes dentro de espacio de colisión AABB, entonces, logramos reducir el número de verificaciones de colisiones (algoritmos costosos) cuando se tiene un gran conjunto de componentes, es decir la complejidad algorítmica (costo) cuando aumenta "N:número de componentes/polígonos en escena". 
Así como el solo detectar la colisión una sola vez entre componentes en el método "detecteColision" de modo de reducir la complejidad N^2 : 2=4, 3=6, 4=16, 5=25, 6=36, … -- a --> 2=1, 3=3, 4=6, 5=10, 6=15, … 
Implementación de filtro de colisión en containers: de modo de reducir la verificación de colisiones en conjunto de componentes, además de categorizar componentes que serán colisionables. ETC.

- *Investigación e implementación de patrones de diseño*, algunos de ellos:
  - Estructurales: Composite, Flyweight
  - Comportamiento: Obsarver, State
  - Creacionales: Singleton, Builder
- Referencias : [Patterns.dev](https://www.patterns.dev/), [Refactoring.guru](https://refactoring.guru/es/design-patterns) .
