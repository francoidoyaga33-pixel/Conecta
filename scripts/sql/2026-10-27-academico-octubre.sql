-- Módulo académico: clases de octubre (Mes 8) para Robótica y Programación,
-- Conectaditos y Conectados, Nivel 1 (Año 1) y Nivel 2 (Año 2). 32 clases.
-- Fuente: Drive "Académico Conecta" / 2026 / Segunda etapa 2026 / */Octubre (descarga del 2026-10-27).
-- Nota: Nivel 2 Conectados – Robótica recibe las mismas 4 clases que Nivel 2 Conectaditos,
-- porque así están en la carpeta original.
-- Correr manualmente en el SQL Editor de Supabase. Es idempotente: no duplica si se corre dos veces.

begin;

with nuevas (grupo_id, clase, unidad, titulo, descripcion, guia_docente, guia_estudiante) as (
  values
  ('3e023ca7-f643-489d-bf2d-172f5d1f0c00'::uuid, 1, $t$2026 · Mes 8 · Clase 1$t$, $t$Mi segunda pantalla$t$, $t$Crear un proyecto con 2 páginas. Página 1: Conectito en su casa con fondo naranja. Programar: Al presionar la pantalla → ir a la página 2. Página 2: Conectito afuera con fondo azul. Programar: Al presionar la pantalla → volver a la página 1. Probar que el cambio funcione al tocar.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 1 (5-7 años)
- Eje curricular: Scratch Jr — escenas: cambiar de página y crear historias con múltiples fondos

Objetivo de la clase:
- El alumno crea un proyecto con al menos dos escenas (páginas) en Scratch Jr y programa el cambio automático o por toque entre ellas.

Escenario — la voz de Conectito:
Conectito quiere contar una historia larga en Scratch Jr pero la pantalla es muy chica para todo. Descubrió que puede agregar más pantallas — se llaman páginas — y hacer que el personaje viaje de una a otra. Hoy armamos la primera historia de Conectito con dos mundos distintos.

Momento 1 — activación emocional · 10 min:
Conectito muestra un libro de cuentos con ilustraciones. Pregunta: ¿cómo hacemos eso en Scratch Jr? ¿Cómo pasamos de una imagen a otra? Los alumnos exploran la app buscando como agregar una página nueva.

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Cuento Viviente
- El aula se divide en dos zonas: ZONA 1 (fondo azul) y ZONA 2 (fondo verde). Los alumnos son personajes. Cuando el facilitador dice 'cambia de escena' todos corren a la otra zona y hacen una nueva acción. Reflexión: eso es cambiar de página en Scratch Jr.

Momento 3 — formalización · 15 min:
Concreto: mostrar en Scratch Jr el panel de páginas (abajo a la izquierda) y como agregar una nueva.
- Pictórico: dibujar dos rectangulos con contenidos diferentes — eso es tener dos páginas.
- Simbólico: Conectito explica — cada página es un mundo independiente. Los personajes y fondos pueden ser distintos en cada una.

Momento 4 — aplicación y transferencia · 35 min:
Crear un proyecto con 2 páginas. Página 1: Conectito en su casa con fondo naranja. Programar: Al presionar la pantalla → ir a la página 2. Página 2: Conectito afuera con fondo azul. Programar: Al presionar la pantalla → volver a la página 1. Probar que el cambio funcione al tocar.

Piso bajo:

Techo alto:
- El proyecto tiene 2 páginas y el personaje cambia de una a otra al tocar la pantalla.
- El proyecto tiene 3 páginas con personajes y fondos distintos en cada una. El cambio entre páginas tiene una animación de salida (el personaje camina hacia el borde antes de cambiar).

Momento 5 — metacognición · 10 min:
Conectito viaja de su casa al jardín al mercado: las páginas me permiten contar una historia completa con principio, medio y fin. Un programa puede tener tantas pantallas como necesite.
- ¿Qué historia quieren contar con dos páginas? ¿Qué pasa en cada una?

Notas para el facilitador:
En Scratch Jr el cambio de página es el bloque naranja con la flecha al costado. El panel de páginas está en la parte inferior de la pantalla. Si los alumnos no lo encuentran, guiarlos directamente — es el primer contacto con esta función.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Como agregar páginas en Scratch Jr
- https://www.youtube.com/watch?v=Rk4BWSZ7bIs
- Contar historias con Scratch Jr — tutorial
- https://www.youtube.com/watch?v=2RYX-BFXO0A$t$, $t$Conectito quiere contar una historia larga en Scratch Jr pero la pantalla es muy chica para todo. Descubrió que puede agregar más pantallas — se llaman páginas — y hacer que el personaje viaje de una a otra. Hoy armamos la primera historia de Conectito con dos mundos distintos.$t$),
  ('3e023ca7-f643-489d-bf2d-172f5d1f0c00'::uuid, 2, $t$2026 · Mes 8 · Clase 2$t$, $t$El personaje que aparece y desaparece$t$, $t$Abrir el proyecto de la S01. Agregar un personaje nuevo a la página 2 (estrella, sol, flor). Al inicio de la página 2: esconder el personaje nuevo. Después de 2 segundos: mostrar el personaje con un efecto de sorpresa (saltar o crecer). Agregar un segundo personaje que también aparece, pero 1 segundo después.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 1 (5-7 años)
- Eje curricular: Scratch Jr — bloques mostrar y esconder, efectos de aparición

Objetivo de la clase:
- El alumno programa personajes para que aparezcan y desaparezcan usando los bloques de mostrar y esconder, creando efectos de presencia en la historia.

Escenario — la voz de Conectito:
Conectito quiere que algunos personajes de su historia aparezcan por sorpresa. La flor que brota de la tierra, el sol que sale detrás de una nube, la estrella que aparece de noche. Para eso usamos los bloques de mostrar y esconder — como el truco de magia de los programadores.

Momento 1 — activación emocional · 10 min:
Conectito hace un truco: tapa un objeto con sus manos (esconder) y lo descubre de golpe (mostrar). Pregunta: ¿cómo programamos ese truco en Scratch Jr para que lo haga automáticamente?

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Juego del Escondite Digital
- Los alumnos son personajes. El facilitador dice ESCONDERSE — todos se agachan (escondidos). APARECER — todos se levantan con sorpresa. ESPERAR 2 SEGUNDOS — cuentan en voz alta. APARECER. Reflexión: esa es exactamente la secuencia de bloques que va a usar en Scratch Jr.

Momento 3 — formalización · 15 min:
Concreto: mostrar en Scratch Jr los bloques naranja de mostrar y esconder en el menú de apariencia.
- Pictórico: dibujar la secuencia: ojo abierto (mostrar) - reloj (esperar) - ojo cerrado (esconder).
- Simbólico: Conectito explica — cuando escondo un personaje sigue existiendo en el programa, solo que invisible. Eso es diferente a borrarlo.

Momento 4 — aplicación y transferencia · 35 min:
Abrir el proyecto de la S01. Agregar un personaje nuevo a la página 2 (estrella, sol, flor). Al inicio de la página 2: esconder el personaje nuevo. Después de 2 segundos: mostrar el personaje con un efecto de sorpresa (saltar o crecer). Agregar un segundo personaje que también aparece, pero 1 segundo después.

Piso bajo:

Techo alto:
- Un personaje aparece en pantalla usando el bloque mostrar después de estar escondido.
- Dos personajes aparecen en momentos distintos (con esperas diferentes) creando un efecto de historia progresiva. El orden de aparición hace sentido narrativo.

Momento 5 — metacognición · 10 min:
Conectito ve aparecer la estrella de sorpresa: esconder y mostrar es el truco de los animadores. Con tiempo y orden controlo que el usuario vea en cada momento de la historia.
- ¿Qué pasaría si muestro y escondo un personaje muy rápido muchas veces? ¿Qué efecto crea?

Notas para el facilitador:
Un error común: esconder el personaje al inicio pero olvidar el bloque mostrar después. El personaje queda invisible para siempre. Recordar que esconder no borra — solo hace invisible.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Bloques de mostrar y esconder en Scratch Jr
- https://www.youtube.com/watch?v=TkF_tEKCMW4
- Efectos de aparición en animación — principios básicos
- https://www.youtube.com/watch?v=8yHgldk5mPo$t$, $t$Conectito quiere que algunos personajes de su historia aparezcan por sorpresa. La flor que brota de la tierra, el sol que sale detrás de una nube, la estrella que aparece de noche. Para eso usamos los bloques de mostrar y esconder — como el truco de magia de los programadores.$t$),
  ('3e023ca7-f643-489d-bf2d-172f5d1f0c00'::uuid, 3, $t$2026 · Mes 8 · Clase 3$t$, $t$Dos personajes en una historia$t$, $t$Crear una escena de encuentro: Personaje A (Conectito) empieza a la izquierda y camina a la derecha durante 2 segundos. Personaje B (mariposa) empieza escondido, espera 2 segundos y aparece a la derecha. Ambos ejecutan una animación de saludo (saltar o girar) al mismo tiempo. Ensayar el timing hasta que se vea natural.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 1 (5-7 años)
- Eje curricular: Scratch Jr — sincronizar dos personajes con mensajes y esperas

Objetivo de la clase:
- El alumno programa dos personajes que interactúan entre si en la misma página, usando esperas y secuencias coordinadas para crear un diálogo o encuentro.

Escenario — la voz de Conectito:
Conectito quiere que en su historia aparezca su amiga la mariposa. Primero llega Conectito, después llega la mariposa, se saludan y bailan juntos. Para que eso pase en Scratch Jr los dos personajes necesitan coordinar sus movimientos — uno espera mientras el otro se mueve.

Momento 1 — activación emocional · 10 min:
Conectito muestra una escena de una película animada donde dos personajes se saludan. Pregunta: ¿cómo creen que se programa eso? ¿Los dos se mueven a la vez? ¿Uno espera al otro? Los alumnos debaten.

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Dueto
- En parejas: Personaje A camina de un lado al otro (5 pasos). Personaje B espera quieto hasta que A termina. Luego B camina 5 pasos en dirección a A. Se saludan. Reflexión: la clave es el tiempo — B sabe cuánto dura el recorrido de A y espera ese tiempo exacto antes de moverse.

Momento 3 — formalización · 15 min:
Concreto: mostrar en Scratch Jr que cada personaje tiene su propio script independiente. Para coordinarlos se usan bloques Esperar con tiempos calculados.
- Pictórico: dibujar una línea de tiempo con los dos personajes y sus acciones en paralelo.
- Simbólico: Conectito explica — en Scratch Jr no hay mensajes, pero si hay tiempo. Si sé cuánto tarda A en llegar, puedo hacer esperar a B exactamente eso.

Momento 4 — aplicación y transferencia · 35 min:
Crear una escena de encuentro: Personaje A (Conectito) empieza a la izquierda y camina a la derecha durante 2 segundos. Personaje B (mariposa) empieza escondido, espera 2 segundos y aparece a la derecha. Ambos ejecutan una animación de saludo (saltar o girar) al mismo tiempo. Ensayar el timing hasta que se vea natural.

Piso bajo:

Techo alto:
- Dos personajes aparecen o se mueven en la misma escena, uno después del otro.
- El encuentro tiene 4 fases: llegada de A, llegada de B, saludo sincronizado, despedida. El timing esta calibrado para que se vea natural y con sentido narrativo.

Momento 5 — metacognición · 10 min:
Conectito y la mariposa se saludan perfectamente: coordinar dos personajes con tiempo es como ser el director de una película. El programa no ve la pantalla — ejecuta ciegamente, y yo decido el tiempo.
- ¿Qué pasa si uno de los personajes tarda más de lo previsto? ¿Cómo afecta eso al otro?

Notas para el facilitador:
El principal desafío es calcular el tiempo de espera correcto. Si el personaje A tarda 2 segundos en moverse, el personaje B tiene que esperar 2 segundos antes de aparecer. Invitar a los alumnos a contar en voz alta mientras prueban.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Como coordinar personajes en Scratch Jr
- https://www.youtube.com/watch?v=Gb4jKkD2Kes
- Animación de diálogos en Scratch Jr — tutorial
- https://www.youtube.com/watch?v=Rk4BWSZ7bIs$t$, $t$Conectito quiere que en su historia aparezca su amiga la mariposa. Primero llega Conectito, después llega la mariposa, se saludan y bailan juntos. Para que eso pase en Scratch Jr los dos personajes necesitan coordinar sus movimientos — uno espera mientras el otro se mueve.$t$),
  ('3e023ca7-f643-489d-bf2d-172f5d1f0c00'::uuid, 4, $t$2026 · Mes 8 · Clase 4$t$, $t$Mi historia animada de octubre$t$, $t$Construcción de la historia animada. Dos páginas mínimo. Dos personajes que interactúan. Al menos un efecto de mostrar/esconder. Presentación final: cada grupo muestra su historia en la tablet mientras uno de los integrantes la narra como un locutor de cine.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 1 (5-7 años)
- Eje curricular: Scratch Jr — proyecto integrador: páginas + mostrar/esconder + dos personajes

Objetivo de la clase:
- El alumno crea una historia animada completa con dos páginas, dos personajes coordinados y efectos de aparición, y la presenta al grupo.

Escenario — la voz de Conectito:
Llegó el momento de crear la historia animada de Conectito en Scratch Jr. Tiene que tener dos pantallas, dos personajes que interactúan y al menos un efecto de aparición. No hay una historia correcta — la historia es de cada ingeniero.

Momento 1 — activación emocional · 10 min:
Conectito pide que cada alumno piense en una historia corta antes de abrir la tablet: ¿quién es el personaje principal? ¿Qué pasa en la primera pantalla? ¿Y en la segunda? Cinco minutos de boceto en papel.

Momento 2 — exploración del concepto · 20 min:
El Pitch de la Historia
- Cada equipo presenta su historia en 30 segundos: personajes, dos escenas, que pasa en cada una. El grupo da un pulgar arriba si la historia se puede hacer con lo aprendido en Scratch Jr. El facilitador ayuda a simplificar las ideas muy complejas.

Momento 3 — formalización · 15 min:
Sin formalización nueva. El facilitador recuerda los bloques disponibles del mes: páginas (cambio de escena), mostrar/esconder (efectos de aparición), esperar (coordinación de personajes). Cada alumno elige cuántos usa en su historia.

Momento 4 — aplicación y transferencia · 35 min:
Construcción de la historia animada. Dos páginas mínimo. Dos personajes que interactúan. Al menos un efecto de mostrar/esconder. Presentación final: cada grupo muestra su historia en la tablet mientras uno de los integrantes la narra como un locutor de cine.

Piso bajo:

Techo alto:
- Historia con 2 páginas y 2 personajes moviéndose en la misma escena.
- Historia con 3 páginas, efectos de aparición sincronizados y una narrativa clara que el espectador puede seguir sin explicación.

Momento 5 — metacognición · 10 min:
Conectito ve todas las historias juntas: cada una es diferente porque cada programador tiene ideas distintas. Eso es lo más importante — el código es una herramienta de expresión.
- ¿Qué parte de la historia fue la más difícil de programar? ¿La cambiarías si tuvieras más tiempo?

Notas para el facilitador:
Grabar con el teléfono del facilitador las historias finales para el portafolio. El video de la historia animada con la voz del narrador es el entregable más valioso del mes.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Historias animadas con Scratch Jr — galería de proyectos
- https://www.youtube.com/watch?v=IpXM1FkjhSY
- Técnicas de narración para niños
- https://www.youtube.com/watch?v=mz7-D5bKY4g$t$, $t$Llegó el momento de crear la historia animada de Conectito en Scratch Jr. Tiene que tener dos pantallas, dos personajes que interactúan y al menos un efecto de aparición. No hay una historia correcta — la historia es de cada ingeniero.$t$),
  ('f01e2e16-ff80-42ac-8270-7168469a1d62'::uuid, 1, $t$2026 · Mes 8 · Clase 1$t$, $t$El sensor de inclinación de Conectito$t$, $t$Conectar el sensor de inclinación al puerto 2. Programar: Si inclinación = TILT hacia adelante -> Motor adelante 2 seg. Si inclinación = TILT hacia atrás -> Motor atrás 2 seg. Si inclinación = FLAT -> Detener. Probar inclinando el Hub en distintas direcciones y verificar que el motor reaccione correctamente.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 1 (5-7 años)
- Eje curricular: Sensor de inclinación WeDo 2.0 — detectar orientación del Hub

Objetivo de la clase:
- El alumno conecta el sensor de inclinación al Hub de WeDo 2.0, identifica sus cuatro posiciones básicas y programa una reacción distinta para al menos dos orientaciones.

Escenario — la voz de Conectito:
Conectito encontró un sensor nuevo en su taller: el sensor de inclinación. No detecta movimiento ni color — detecta hacia donde está inclinado el Hub. Si lo inclinas hacia adelante hace una cosa, hacia atrás hace otra. Hoy descubrimos los secretos de este sensor.

Momento 1 — activación emocional · 10 min:
Conectito muestra el sensor de inclinación y lo inclina en distintas direcciones. Pregunta: ¿Cuántas posiciones diferentes creen que puede detectar? Los alumnos predicen. Abrir la app y mostrar el monitor del sensor en tiempo real.

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Robot Inclinado
- Los alumnos sostienen un libro plano. Cuando el facilitador dice ADELANTE todos inclinan el libro hacia adelante. ATRÁS — inclinan hacia atrás. IZQUIERDA / DERECHA. PLANO — lo mantienen horizontal. Reflexión: eso es exactamente lo que detecta el sensor de inclinación.

Momento 3 — formalización · 15 min:
Concreto: conectar el sensor al puerto 2, abrir el monitor y ver los valores: Flat (plano), Tilt (inclinado), Up (arriba), Down (abajo).
- Pictórico: dibujar el Hub con flechas indicando cada posición.
- Simbólico: Conectito explica — el sensor no mide ángulos exactos, detecta la orientación general del Hub.

Momento 4 — aplicación y transferencia · 35 min:
Conectar el sensor de inclinación al puerto 2. Programar: Si inclinación = TILT hacia adelante -> Motor adelante 2 seg. Si inclinación = TILT hacia atrás -> Motor atrás 2 seg. Si inclinación = FLAT -> Detener. Probar inclinando el Hub en distintas direcciones y verificar que el motor reaccione correctamente.

Piso bajo:

Techo alto:
- El motor arranca cuando el Hub se inclina en una dirección y se detiene cuando esta plano.
- El robot reacciona diferente a cuatro orientaciones distintas (adelante, atrás, izquierda, derecha). El alumno puede controlarlo inclinando el Hub como un control remoto.

Momento 5 — metacognición · 10 min:
Conectito inclina el Hub y ve el motor obedecer: el sensor de inclinación convierte mi Hub en un control remoto. Sin apretar botones, sin teclado — solo inclinandolo.
- ¿Qué juguetes o dispositivos reales usan un sensor de inclinación? ¿Qué ventaja tiene sobre un botón?

Notas para el facilitador:
El sensor de inclinación en WeDo 2.0 es el mismo físicamente que el sensor de movimiento pero con otro modo de uso. En algunos kits puede no estar disponible — en ese caso usar el sensor de movimiento de la sesión anterior como repaso y agregar variaciones nuevas.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Sensor de inclinación WeDo 2.0 — tutorial
- https://www.youtube.com/watch?v=bvKOkL4XICE
- Controles por inclinación en juegos y robots
- https://www.youtube.com/watch?v=FJpR4OtHoqQ$t$, $t$Conectito encontró un sensor nuevo en su taller: el sensor de inclinación. No detecta movimiento ni color — detecta hacia donde está inclinado el Hub. Si lo inclinas hacia adelante hace una cosa, hacia atrás hace otra. Hoy descubrimos los secretos de este sensor.$t$),
  ('f01e2e16-ff80-42ac-8270-7168469a1d62'::uuid, 2, $t$2026 · Mes 8 · Clase 2$t$, $t$El robot equilibrista$t$, $t$Construir una base con motor en el centro y un contrapeso móvil en el eje. Programar: Repetir siempre { Si inclinación = izquierda -> Motor derecha 0.5 seg | Si inclinación = derecha -> Motor izquierda 0.5 seg | Si inclinación = plano -> Detener }. Probar inclinando la base y viendo si el motor compensa.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 1 (5-7 años)
- Eje curricular: WeDo 2.0 — combinar sensor de inclinación con motor para simular equilibrio

Objetivo de la clase:
- El alumno construye un mecanismo que usa el sensor de inclinación para mantener el equilibrio: si el robot se inclina, el motor lo corrige.

Escenario — la voz de Conectito:
Conectito quiere construir un robot equilibrista como los de circo. Si se inclina a la izquierda, el motor lo empuja a la derecha para compensar. Si se inclina a la derecha, lo empuja al otro lado. Es como el cuerpo humano manteniendo el equilibrio — pero con motor.

Momento 1 — activación emocional · 10 min:
El facilitador hace una demostración de equilibrio: caminar por una línea imaginaría. Cuando pierde el equilibrio, el cuerpo lo corrige automáticamente. Pregunta: ¿Cómo le enseñamos a un robot a hacer lo mismo con un motor?

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Humano Equilibrista
- Los alumnos caminan por una línea de cinta en el piso con los brazos extendidos. Cuando pierden el equilibrio, los brazos se mueven en sentido contrario para compensar. Reflexión: eso es control por retroalimentación — el sensor detecta la caida y el motor corrige.

Momento 3 — formalización · 15 min:
Concreto: construir un mecanismo con contrapeso en el eje del motor.
- Pictórico: dibujar el ciclo de retroalimentación: inclinación detectada -> sensor -> motor corrige -> equilibrio.
- Simbólico: Conectito explica — un sistema que se corrige a si mismo con información de un sensor se llama sistema de control.

Momento 4 — aplicación y transferencia · 35 min:
Construir una base con motor en el centro y un contrapeso móvil en el eje. Programar: Repetir siempre { Si inclinación = izquierda -> Motor derecha 0.5 seg | Si inclinación = derecha -> Motor izquierda 0.5 seg | Si inclinación = plano -> Detener }. Probar inclinando la base y viendo si el motor compensa.

Piso bajo:

Techo alto:
- El motor responde a la inclinación detectada, aunque la corrección no sea perfecta.
- El robot mantiene el contrapeso centrado automáticamente ante inclinaciones leves. El sistema responde en menos de 0.5 segundos de inclinación.

Momento 5 — metacognición · 10 min:
Conectito ve el robot equilibrarse solo: un robot que se corrige a si mismo es un robot inteligente. Este mes aprendemos que la inteligencia robótica no es magia — es un sensor, un motor y un programa bien conectados.
- ¿Qué otros sistemas en la vida real usan este principio de corrección automática? ¿Un auto, un avión, un teléfono?

Notas para el facilitador:
El equilibrio perfecto es difícil de lograr con WeDo 2.0 — el objetivo pedagogico es que el alumno entienda el ciclo sensor-decisión-acción, no que el robot se equilibre perfectamente. Valorar el razonamiento del programa.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Robots equilibristas — como funcionan
- https://www.youtube.com/watch?v=s3CiYqOhB9w
- Sistemas de control y retroalimentación — explicación simple
- https://www.youtube.com/watch?v=9gOfE9ch7Ug$t$, $t$Conectito quiere construir un robot equilibrista como los de circo. Si se inclina a la izquierda, el motor lo empuja a la derecha para compensar. Si se inclina a la derecha, lo empuja al otro lado. Es como el cuerpo humano manteniendo el equilibrio — pero con motor.$t$),
  ('f01e2e16-ff80-42ac-8270-7168469a1d62'::uuid, 3, $t$2026 · Mes 8 · Clase 3$t$, $t$La balanza de Conectito$t$, $t$Construir una palanca con el Hub como punto central y dos extremos como platillos. Programar: Si inclinación = izquierda -> Mostrar en app 'IZQUIERDA MÁS PESADA' + Motor gira izquierda. Si derecha -> Mostrar 'DERECHA MÁS PESADA' + Motor gira derecha. Si plano -> Mostrar 'IGUALES'. Comparar objetos del aula.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 1 (5-7 años)
- Eje curricular: WeDo 2.0 — sensor de inclinación como medidor de peso relativo

Objetivo de la clase:
- El alumno usa el sensor de inclinación como una balanza: el lado que pesa más inclina el Hub, el sensor lo detecta y el programa indica cual lado es más pesado.

Escenario — la voz de Conectito:
Conectito necesita comparar el peso de dos objetos pero no tiene pesa. Se le ocurrió usar el sensor de inclinación como balanza: pone un objeto en cada extremo del Hub, y el lado que pesa más lo inclina. El sensor detecta hacia donde cae y el motor anuncia el ganador.

Momento 1 — activación emocional · 10 min:
Conectito muestra dos objetos de pesos diferentes y pregunta: ¿cómo sabemos cual pesa más sin usar una balanza? Los alumnos proponen ideas. El facilitador pone ambos en los extremos del Hub y lo suelta — el más pesado lo inclina.

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: La Balanza Humana
- En parejas: uno es la balanza (extiende los brazos horizontales). El otro pone objetos reales o imaginarios en cada mano. La balanza inclina el brazo hacia el lado más pesado. Reflexión: eso es exactamente lo que hace el sensor de inclinación cuando el Hub actúa como palanca.

Momento 3 — formalización · 15 min:
Concreto: colocar objetos en extremos del Hub y observar el valor del sensor en el monitor.
- Pictórico: dibujar la balanza con el punto de apoyo en el centro.
- Simbólico: Conectito explica — el Hub actúa como palanca. El punto de apoyo es el centro, los extremos son los platillos de la balanza.

Momento 4 — aplicación y transferencia · 35 min:
Construir una palanca con el Hub como punto central y dos extremos como platillos. Programar: Si inclinación = izquierda -> Mostrar en app 'IZQUIERDA MÁS PESADA' + Motor gira izquierda. Si derecha -> Mostrar 'DERECHA MÁS PESADA' + Motor gira derecha. Si plano -> Mostrar 'IGUALES'. Comparar objetos del aula.

Piso bajo:

Techo alto:
- La balanza detecta correctamente cual lado es más pesado y lo comunica con texto o motor.
- La balanza compara 5 pares de objetos distintos y el alumno anota los resultados en la bitácora, verificando luego con una balanza real.

Momento 5 — metacognición · 10 min:
Conectito pesa sus llaves y su goma de borrar: transforme un sensor digital en una herramienta de medición real. Eso es ciencia — usar lo que tenemos de manera creativa para responder preguntas.
- ¿Qué tan precisa es esta balanza comparada con una real? ¿Qué la hace menos precisa? ¿Cómo se podría mejorar?

Notas para el facilitador:
Buscar objetos con diferencia de peso clara para las pruebas (borrador vs lápiz, libro vs hoja). Para diferencias muy pequeñas el sensor puede no detectarlas — es una oportunidad para hablar de precisión y límites del instrumento.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Como funciona una balanza — física simple
- https://www.youtube.com/watch?v=RXoSMWk7pss
- Sensores en la ciencia y la ingeniería
- https://www.youtube.com/watch?v=n4kDfz-nnfM$t$, $t$Conectito necesita comparar el peso de dos objetos pero no tiene pesa. Se le ocurrió usar el sensor de inclinación como balanza: pone un objeto en cada extremo del Hub, y el lado que pesa más lo inclina. El sensor detecta hacia donde cae y el motor anuncia el ganador.$t$),
  ('f01e2e16-ff80-42ac-8270-7168469a1d62'::uuid, 4, $t$2026 · Mes 8 · Clase 4$t$, $t$Mi robot de octubre$t$, $t$Construcción del proyecto integrador. Tiempo de construcción: 20 min. Tiempo de programación: 10 min. Tiempo de prueba y ajuste: 5 min. Presentación al grupo: 15 min (2-3 min por equipo). En la presentación explicar: que hace el robot, que detecta el sensor y como responde el motor.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 1 (5-7 años)
- Eje curricular: WeDo 2.0 — proyecto integrador libre: motor + sensor a elección

Objetivo de la clase:
- El alumno diseña y construye un robot que integra al menos dos elementos del mes (sensor de inclinación + motor), presenta su funcionamiento al grupo y completa la ficha técnica en la bitácora.

Escenario — la voz de Conectito:
Conectito abre las puertas de su taller para el proyecto final de octubre. Cada ingeniero elige su robot: equilibrista, balanza, control remoto, o algo completamente nuevo. Lo importante es que use el motor y el sensor de inclinación juntos con un propósito claro.

Momento 1 — activación emocional · 10 min:
Conectito muestra los tres robots del mes (control remoto, equilibrista, balanza) y pregunta: ¿cuál fue el más interesante? ¿Qué le cambiarían? ¿O prefieren diseñar algo completamente nuevo? Los alumnos deciden antes de tocar las piezas.

Momento 2 — exploración del concepto · 20 min:
Conferencia de Ingenieros
- Cada equipo presenta su idea en 45 segundos: que va a construir, que hace el sensor, que hace el motor. Los demás hacen UNA pregunta técnica. Si la idea no es posible con WeDo 2.0 el grupo lo detecta antes de construir.

Momento 3 — formalización · 15 min:
Sin formalización nueva. El facilitador recuerda los elementos disponibles del mes: sensor de inclinación (4 posiciones), motor (velocidad, tiempo, dirección), app WeDo 2.0 (condicionales, sonidos, textos). Cada equipo elige cuántos combina.

Momento 4 — aplicación y transferencia · 35 min:
Construcción del proyecto integrador. Tiempo de construcción: 20 min. Tiempo de programación: 10 min. Tiempo de prueba y ajuste: 5 min. Presentación al grupo: 15 min (2-3 min por equipo). En la presentación explicar: que hace el robot, que detecta el sensor y como responde el motor.

Piso bajo:

Techo alto:
- Un robot funcional con motor + sensor de inclinación integrados y un propósito claro.
- Un robot con 3 o más comportamientos distintos según la orientación del Hub, con un objetivo real (medir, equilibrar, controlar, transportar).

Momento 5 — metacognición · 10 min:
Conectito cierra el taller de octubre: este mes aprendimos que un sensor transforma la información del mundo en números, y que un programa transforma esos números en acciones. Esa cadena es el corazón de cualquier robot.
- ¿Qué aprendiste este mes que no sabía hacer antes? ¿Qué robot de la vida real usa el mismo principio que el tuyo?

Notas para el facilitador:
Reservar 15 minutos para las presentaciones. Fotografiar o filmar cada robot para el portafolio. Si un equipo no termino igual presenta el avance y explica que falta y por qué.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Proyectos creativos con WeDo 2.0 — inspiración
- https://www.youtube.com/watch?v=HpCWfV3TSRI
- Robótica educativa — ciclo de diseño de ingeniería
- https://www.youtube.com/watch?v=WijyEL4dOW4$t$, $t$Conectito abre las puertas de su taller para el proyecto final de octubre. Cada ingeniero elige su robot: equilibrista, balanza, control remoto, o algo completamente nuevo. Lo importante es que use el motor y el sensor de inclinación juntos con un propósito claro.$t$),
  ('c4fde980-5b81-4e93-bcd6-f553c896f9e4'::uuid, 1, $t$2026 · Mes 8 · Clase 1$t$, $t$Crear y controlar clones$t$, $t$Crear un sprite de mariposa. Script del original: Al presionar bandera → Repetir 10 { Crear un clon de mi mismo | Esperar 0.5 seg }. Script del clon: Al empezar como clon → Ir a posición aleatoria X Y → Repetir siempre { Mover 3 pasos | Rebotar si toca el borde }. Eliminar el clon al tocar el borde inferior. Probar.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectados Año 1 (9-10 años)
- Eje curricular: Scratch 3.0 — clones: crear copias de un sprite con comportamiento propio

Objetivo de la clase:
- El alumno usa el bloque Crear un clon de para generar múltiples copias de un sprite y programa cada clon para que tenga comportamiento independiente al nacer.

Escenario — la voz de ConecTeo:
ConecTeo descubrió que en Scratch 3.0 puede crear copias de un sprite al instante — se llaman clones. Con un solo bot puede llenar la pantalla de robots, abejas o estrellas. Cada clon es una copia del original pero vive su propia vida. Hoy aprendemos a crear un ejército de clones.

Momento 1 — activación emocional · 10 min:
ConecTeo muestra una pantalla de Scratch vacía y pregunta: ¿cuántos bloques necesitarían para tener 10 mariposas moviéndose a la vez? Los alumnos calculan. Luego el facilitador muestra que con clones alcanza con 3 bloques para crear las 10.

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: La Fábrica de Clones
- El facilitador es el sprite original. Da instrucciones: CLONAR — un alumno se levanta y hace lo mismo que el facilitador. CLONAR de nuevo — otro alumno se suma. Todos ejecutan la misma animación al mismo tiempo. Reflexión: eso es exactamente lo que hace el bloque Crear un clon.

Momento 3 — formalización · 15 min:
Concreto: mostrar los tres bloques de clones en Scratch: Crear un clon de mi mismo, Cuando empiece como clon, Eliminar este clon.
- Pictórico: dibujar el sprite original (padre) con sus clones (hijos) ejecutando el mismo script.
- Simbólico: ConecTeo explica — el clon hereda el script del Al empezar como clon. El original se queda quieto o desaparece. Los clones viven hasta que los eliminás.

Momento 4 — aplicación y transferencia · 35 min:
Crear un sprite de mariposa. Script del original: Al presionar bandera → Repetir 10 { Crear un clon de mi mismo | Esperar 0.5 seg }. Script del clon: Al empezar como clon → Ir a posición aleatoria X Y → Repetir siempre { Mover 3 pasos | Rebotar si toca el borde }. Eliminar el clon al tocar el borde inferior. Probar.

Piso bajo:

Techo alto:
- Al menos 5 clones aparecen en posiciones distintas y se mueven independientemente.
- 10 clones aparecen con retraso de 0.5 seg entre cada uno, se mueven con trayectorias distintas y desaparecen al tocar el borde inferior. La pantalla se ve llena de vida.

Momento 5 — metacognición · 10 min:
ConecTeo ve 10 mariposas volando con 5 bloques: los clones cambian completamente la escala de lo que podemos hacer en Scratch. Con un sprite puedo llenar el mundo — eso no era posible antes.
- ¿Qué pasa con los clones si el sprite original se mueve o cambia de disfraz? ¿Los clones lo copian?

Notas para el facilitador:
El sprite original tiene que estar ESCONDIDO para que los clones sean los unicos visibles en pantalla. Si el original aparece el resultado se ve raro. Agregar el bloque Esconder justo después de la bandera en el script del original.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Clones en Scratch 3.0 — tutorial completo
- https://www.youtube.com/watch?v=jZkNLT0QHPU
- Proyectos creativos con clones en Scratch
- https://www.youtube.com/watch?v=8yHgldk5mPo$t$, $t$ConecTeo descubrió que en Scratch 3.0 puede crear copias de un sprite al instante — se llaman clones. Con un solo bot puede llenar la pantalla de robots, abejas o estrellas. Cada clon es una copia del original pero vive su propia vida. Hoy aprendemos a crear un ejército de clones.$t$),
  ('c4fde980-5b81-4e93-bcd6-f553c896f9e4'::uuid, 2, $t$2026 · Mes 8 · Clase 2$t$, $t$Clones con comportamiento propio$t$, $t$Agregar variable VELOCIDAD con opción Solo para este sprite. En el Al empezar como clon: Fijar VELOCIDAD en número al azar entre 2 y 8. Usar VELOCIDAD como argumento del bloque Mover pasos. Crear 10 clones y observar que cada uno se mueve a velocidad distinta. Extender: agregar variable COLOR para cambiar el disfraz de cada clon.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectados Año 1 (9-10 años)
- Eje curricular: Scratch 3.0 — clones con variables propias y comportamiento diferenciado

Objetivo de la clase:
- El alumno usa variables para diferenciar el comportamiento de los clones entre si, haciendo que cada clon tenga una velocidad o trayectoria distinta basada en un valor aleatorio.

Escenario — la voz de ConecTeo:
ConecTeo quiere que sus clones no sean todos iguales. Cada mariposa tiene que volar diferente: una rápido, otra lento, una a la izquierda, otra en zigzag. Para eso cada clon necesita su propia variable — un número aleatorio que le da su personalidad única.

Momento 1 — activación emocional · 10 min:
ConecTeo muestra el ejército de clones idénticos de la S01 y pregunta: ¿cómo hacemos para que cada uno se mueva diferente? ¿Si todos usan el mismo script como pueden tener velocidades distintas? Los alumnos proponen ideas.

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: Los Clones Personalizados
- Cada alumno recibe un papel con un número del 1 al 5 (velocidad). Cuando el facilitador dice MOVER todos caminan — pero cada uno a la velocidad de su número (1 muy lento, 5 muy rápido). Los clones son iguales en estructura pero distintos en velocidad. Reflexión: el número del papel es la variable propia de cada clon.

Momento 3 — formalización · 15 min:
Concreto: usar Número al azar entre X e Y para asignar velocidades distintas en el Al empezar como clon.
- Pictórico: dibujar 5 clones con flechas de distinto largo indicando distintas velocidades.
- Simbólico: ConecTeo explica — en Scratch una variable local del clon se crea con la opción Solo para este sprite. Cada clon tiene su propia copia de esa variable.

Momento 4 — aplicación y transferencia · 35 min:
Agregar variable VELOCIDAD con opción Solo para este sprite. En el Al empezar como clon: Fijar VELOCIDAD en número al azar entre 2 y 8. Usar VELOCIDAD como argumento del bloque Mover pasos. Crear 10 clones y observar que cada uno se mueve a velocidad distinta. Extender: agregar variable COLOR para cambiar el disfraz de cada clon.

Piso bajo:

Techo alto:
- Los clones se mueven a velocidades distintas gracias a la variable aleatoria.
- Los clones tienen velocidad y color distintos (2 variables independientes). La pantalla muestra 10 clones claramente diferenciados en comportamiento visual.

Momento 5 — metacognición · 10 min:
ConecTeo ve 10 mariposas distintas volando juntas: cada clon es único porque tiene su propia variable. Eso es la diferencia entre copiar y personalizar — con una variable el clon deja de ser una copia y se convierte en un individuo.
- ¿Cuántas variables propias puede tener un clon? ¿Puede un clon comunicarse con otro clon?

Notas para el facilitador:
La opción Solo para este sprite en variables es la clave de esta sesión. Si la variable es global todos los clones comparten el mismo valor — que es incorrecto. Si es local cada clon tiene la suya — que es lo que queremos.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Variables locales en clones de Scratch 3.0
- https://www.youtube.com/watch?v=dm_5RMXNC5I
- Comportamiento emergente en sistemas de clones
- https://www.youtube.com/watch?v=jZkNLT0QHPU$t$, $t$ConecTeo quiere que sus clones no sean todos iguales. Cada mariposa tiene que volar diferente: una rápido, otra lento, una a la izquierda, otra en zigzag. Para eso cada clon necesita su propia variable — un número aleatorio que le da su personalidad única.$t$),
  ('c4fde980-5b81-4e93-bcd6-f553c896f9e4'::uuid, 3, $t$2026 · Mes 8 · Clase 3$t$, $t$El ejército de ConecTeo: clones más variable global$t$, $t$Implementar variable ACTIVOS global. Crear clones en un bucle. En cada clon: al nacer ACTIVOS += 1, al morir (por borde) ACTIVOS -= 1. Agregar condición: Si ACTIVOS > 8 → no crear más clones. Si ACTIVOS < 3 → crear 2 clones nuevos automáticamente. Ver como el sistema se autoregula.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectados Año 1 (9-10 años)
- Eje curricular: Scratch 3.0 — clones + variable global: contar y coordinar múltiples clones

Objetivo de la clase:
- El alumno combina clones con una variable global de conteo para rastrear cuántos clones están activos y reaccionar cuando se alcanza un número determinado.

Escenario — la voz de ConecTeo:
ConecTeo necesita saber cuántas mariposas están volando en todo momento. Si hay más de 8, el programa esta sobrecargado. Si quedan menos de 3, hay que crear más. Para eso usa una variable global ACTIVOS que sube cuando nace un clon y baja cuando muere.

Momento 1 — activación emocional · 10 min:
ConecTeo muestra el ejército de clones de la S02 y pregunta: ¿cómo sabemos cuántos clones hay en pantalla en este momento sin contarlos a mano? Los alumnos proponen ideas. El facilitador lleva al debate hacia la variable global.

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Contador de Presencia
- El facilitador tiene un pizarrón con el número 0. Cuando un alumno entra al aula dice SUMO y el pizarrón sube 1. Cuando sale dice RESTO y baja 1. El pizarrón siempre muestra cuántos están dentro. Reflexión: eso es la variable ACTIVOS — sube al nacer el clon y baja al eliminarse.

Momento 3 — formalización · 15 min:
Concreto: variable global ACTIVOS = 0. En Al empezar como clon: ACTIVOS += 1. En Eliminar este clon: ACTIVOS -= 1.
- Pictórico: dibujar el ciclo de vida de un clon con los puntos donde ACTIVOS cambia.
- Simbólico: ConecTeo explica — la variable global es compartida por todos los clones. Cuando uno nace suma 1. Cuando muere resta 1. El total siempre es exacto.

Momento 4 — aplicación y transferencia · 35 min:
Implementar variable ACTIVOS global. Crear clones en un bucle. En cada clon: al nacer ACTIVOS += 1, al morir (por borde) ACTIVOS -= 1. Agregar condición: Si ACTIVOS > 8 → no crear más clones. Si ACTIVOS < 3 → crear 2 clones nuevos automáticamente. Ver como el sistema se autoregula.

Piso bajo:

Techo alto:
- La variable ACTIVOS sube y baja correctamente con cada clon que nace o muere.
- El sistema se autorregula: crea nuevos clones cuando hay menos de 3 y deja de crear cuando hay más de 8. El número en pantalla siempre es exacto.

Momento 5 — metacognición · 10 min:
ConecTeo ve el contador subir y bajar con cada mariposa: los clones y la variable global trabajan juntos como un ecosistema. El programa no solo ejecuta — se autoregula. Eso es pensar en sistemas.
- ¿Qué pasaría si la variable ACTIVOS no se decrementara al morir el clon? ¿Qué error produciría?

Notas para el facilitador:
El decremento en el Eliminar este clon tiene que estar justo ANTES del bloque Eliminar — no después, porque una vez eliminado el clon no puede ejecutar más instrucciones.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Variable global con clones en Scratch 3.0
- https://www.youtube.com/watch?v=dm_5RMXNC5I
- Sistemas autoregulados — concepto y ejemplos reales
- https://www.youtube.com/watch?v=s3CiYqOhB9w$t$, $t$ConecTeo necesita saber cuántas mariposas están volando en todo momento. Si hay más de 8, el programa esta sobrecargado. Si quedan menos de 3, hay que crear más. Para eso usa una variable global ACTIVOS que sube cuando nace un clon y baja cuando muere.$t$),
  ('c4fde980-5b81-4e93-bcd6-f553c896f9e4'::uuid, 4, $t$2026 · Mes 8 · Clase 4$t$, $t$Proyecto integrador de octubre — Scratch y clones$t$, $t$Construcción del proyecto integrador con los tres componentes. Presentación: mostrar el proyecto en acción durante 1 minuto, explicar como funciona la variable local y la variable global, y leer el valor de la variable global al terminar.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectados Año 1 (9-10 años)
- Eje curricular: Scratch 3.0 — proyecto integrador: clones + variable local + variable global + broadcasts

Objetivo de la clase:
- El alumno diseña y presenta un proyecto que integra clones con variable local (comportamiento propio), variable global (estado del sistema) y al menos un broadcast para coordinar eventos.

Escenario — la voz de ConecTeo:
ConecTeo abre el estudio de octubre. Cada programador crea SU proyecto con clones: puede ser un juego de atrapar clones, una simulación de particulas, un universo de estrellas o algo completamente nuevo. La única regla: tiene que usar clones con personalidad propia y una variable global que mida algo del sistema.

Momento 1 — activación emocional · 10 min:
ConecTeo presenta cuatro ideas de proyectos con clones: lluvia de estrellas (clones caen desde arriba), juego de atrapar (clones se tocan con otro sprite), ecosistema (clones nacen y mueren con reglas), arte generativo (clones dibujan patrones). Los alumnos eligen o inventan su propio concepto.

Momento 2 — exploración del concepto · 20 min:
El Pitch del Proyecto
- Cada equipo presenta su idea en 60 seg: concepto del proyecto, que hace el clon al nacer, que variable local tiene, que mide la variable global. Los demás equipos hacen UNA pregunta técnica.

Momento 3 — formalización · 15 min:
Sin formalización nueva. El facilitador anota los criterios en el pizarrón: variable local en cada clon, variable global que mida algo del sistema, al menos 1 broadcast. Cada equipo confirma que su plano los incluye.

Momento 4 — aplicación y transferencia · 35 min:
Construcción del proyecto integrador con los tres componentes. Presentación: mostrar el proyecto en acción durante 1 minuto, explicar como funciona la variable local y la variable global, y leer el valor de la variable global al terminar.

Piso bajo:

Techo alto:
- Proyecto con clones con variable local y variable global visible en pantalla.
- Proyecto completo con clones diferenciados (variable local), sistema con estado medible (variable global) y al menos un broadcast que coordina un evento entre el original y los clones.

Momento 5 — metacognición · 10 min:
ConecTeo ve todos los proyectos: algunos tienen lluvia de estrellas, otros tienen juegos, otros tienen ecosistemas. Todos usaron los mismos bloques. La diferencia está en la idea — y eso no se puede programar desde afuera.
- ¿Qué aprendiste sobre los clones este mes? ¿Cómo los usarías en un proyecto real fuera de Scratch?

Notas para el facilitador:
Fotografiar o grabar en video cada proyecto para el portafolio. Los proyectos con clones son especialmente buenos para mostrar en ferias o a familias porque son visualmente impactantes.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Proyectos creativos con clones en Scratch — galería
- https://www.youtube.com/watch?v=jZkNLT0QHPU
- Arte generativo con Scratch 3.0
- https://www.youtube.com/watch?v=IpXM1FkjhSY$t$, $t$ConecTeo abre el estudio de octubre. Cada programador crea SU proyecto con clones: puede ser un juego de atrapar clones, una simulación de particulas, un universo de estrellas o algo completamente nuevo. La única regla: tiene que usar clones con personalidad propia y una variable global que mida algo del sistema.$t$),
  ('bcaef68a-8994-40e8-b53a-4323d9b6c968'::uuid, 1, $t$2026 · Mes 8 · Clase 1$t$, $t$El sensor de distancia de ConecTeo$t$, $t$Conectar sensor al puerto E. Programar tres rangos con if/elif: Si distancia < 10 → Motor stop + sonido alarma. Elif distancia < 30 → Motor velocidad reducida. Else → Motor velocidad normal. Probar acercando objetos y verificando que el robot cambia de comportamiento en cada rango.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectados Año 1 (9-10 años)
- Eje curricular: SPIKE Prime — sensor ultrasónico de distancia: leer valores y detectar rangos

Objetivo de la clase:
- El alumno conecta el sensor de distancia al SPIKE Prime, lee los valores en tiempo real y programa reacciones distintas para tres rangos de distancia (cerca, medio, lejos).

Escenario — la voz de ConecTeo:
ConecTeo encontró un nuevo sensor en su laboratorio: el sensor de distancia ultrasónico. Mide cuántos centímetros hay hasta el objeto más cercano. Si algo está a menos de 10 cm: peligro. Entre 10 y 30 cm: atención. A más de 30 cm: libre. Hoy el robot aprende a ver la distancia.

Momento 1 — activación emocional · 10 min:
ConecTeo muestra el sensor de distancia y lo acerca y aleja de la mano. El facilitador abre el monitor en la SPIKE App y los alumnos ven el número cambiar en tiempo real. Pregunta: ¿qué número da cuando no hay nada enfrente? ¿Y cuando la mano está a 5 cm?

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Sonar Humano
- Un alumno cierra los ojos (el sensor). Otro camina lentamente hacia el. El alumno sensor golpea la mesa cuando siente algo cerca (sin tocarlo — solo por el sonido de los pasos). Los demás cuentan cuántos pasos faltan. Reflexión: el sensor de distancia hace lo mismo con ultrasonido — envía una onda y mide cuánto tarda en volver.

Momento 3 — formalización · 15 min:
Concreto: conectar el sensor de distancia al puerto E, abrir el monitor y medir objetos reales.
- Pictórico: dibujar los tres rangos con sus umbrales (0-10 cm: peligro, 10-30 cm: atención, +30 cm: libre).
- Simbólico: ConecTeo explica — el sensor no ve ni toca. Emite ultrasonido y mide el eco. El tiempo del eco indica la distancia.

Momento 4 — aplicación y transferencia · 35 min:
Conectar sensor al puerto E. Programar tres rangos con if/elif: Si distancia < 10 → Motor stop + sonido alarma. Elif distancia < 30 → Motor velocidad reducida. Else → Motor velocidad normal. Probar acercando objetos y verificando que el robot cambia de comportamiento en cada rango.

Piso bajo:

Techo alto:
- El robot reacciona diferente cuando algo está cerca (menos de 10 cm) vs cuando está lejos.
- Los tres rangos funcionan correctamente y el robot ajusta la velocidad de forma proporcional a la distancia (más cerca = más lento, más lejos = más rápido).

Momento 5 — metacognición · 10 min:
ConecTeo ve el robot frenar solo cuando algo se acerca: el sensor de distancia le da al robot la capacidad de ver obstáculos sin ojos. Con tres rangos ya puede navegar con cierta autonomía.
- ¿El sensor de distancia funciona igual con objetos negros que con objetos blancos? ¿Y con espejos? ¿Por qué?

Notas para el facilitador:
El sensor ultrasónico de SPIKE Prime mide entre 3 y 200 cm. Objectos muy pequeños o materiales absorbentes pueden dar lecturas incorrectas. Usar objetos planos y claros para las pruebas.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Sensor de distancia SPIKE Prime — tutorial oficial LEGO
- https://www.youtube.com/watch?v=XbpBgm9NBBY
- Como funciona el ultrasonido en robótica
- https://www.youtube.com/watch?v=FJpR4OtHoqQ$t$, $t$ConecTeo encontró un nuevo sensor en su laboratorio: el sensor de distancia ultrasónico. Mide cuántos centímetros hay hasta el objeto más cercano. Si algo está a menos de 10 cm: peligro. Entre 10 y 30 cm: atención. A más de 30 cm: libre. Hoy el robot aprende a ver la distancia.$t$),
  ('bcaef68a-8994-40e8-b53a-4323d9b6c968'::uuid, 2, $t$2026 · Mes 8 · Clase 2$t$, $t$El robot que esquiva obstáculos$t$, $t$Construir el robot con sensor de distancia apuntando al frente. Programar el esquive en bucle infinito: Si distancia < 20 → detener 0.5 seg → girar izquierda (motor izquierdo atrás 1 seg) → seguir adelante. Sino → ambos motores adelante velocidad 5. Crear un circuito de obstáculos con libros y probar.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectados Año 1 (9-10 años)
- Eje curricular: SPIKE Prime — sensor de distancia + movimiento: navegación autónoma con esquive

Objetivo de la clase:
- El alumno programa un robot que se mueve hacia adelante y esquiva obstáculos automáticamente usando el sensor de distancia, sin intervención del usuario.

Escenario — la voz de ConecTeo:
ConecTeo quiere un robot que navegue solo por el laboratorio sin chocar con nada. El sensor de distancia detecta el obstáculo, el robot gira y sigue adelante. Sin que nadie le diga que hacer en cada momento — el robot decide solo según lo que ve el sensor.

Momento 1 — activación emocional · 10 min:
ConecTeo muestra un video de un robot aspiradora evitando obstáculos. Pregunta: ¿cómo creen que decide cuando girar y hacia donde? Los alumnos exploran ideas. El facilitador las anota y al final las compara con lo que realmente hace el sensor de distancia.

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Robot Navegador
- Los alumnos forman parejas. Uno camina con ojos cerrados hacia adelante. El otro le dice GIRO cuando está a 50 cm de una silla o pared. El que camina gira 90 grados y sigue. Reflexión: el compañero es el sensor. El caminante es el motor. El programa es la regla: si el compañero grita giro.

Momento 3 — formalización · 15 min:
Concreto: construir el programa de esquive: Repetir siempre { Si distancia < 15 → Detener + Girar izquierda 2 seg + Continuar | Sino → Motor adelante }.
- Pictórico: dibujar el diagrama de flujo del esquive en bucle.
- Simbólico: ConecTeo explica — el bucle infinito es lo que hace que el robot siga esquivando indefinidamente. Sin el bucle el robot esquiva una vez y para.

Momento 4 — aplicación y transferencia · 35 min:
Construir el robot con sensor de distancia apuntando al frente. Programar el esquive en bucle infinito: Si distancia < 20 → detener 0.5 seg → girar izquierda (motor izquierdo atrás 1 seg) → seguir adelante. Sino → ambos motores adelante velocidad 5. Crear un circuito de obstáculos con libros y probar.

Piso bajo:

Techo alto:
- El robot detecta un obstáculo, se detiene y gira antes de chocar al menos 3 veces seguidas.
- El robot navega un circuito de 5 obstáculos sin chocar con ninguno. La velocidad y el ángulo de giro están calibrados para que la navegación sea fluida.

Momento 5 — metacognición · 10 min:
ConecTeo ve el robot esquivar obstáculos solo durante 2 minutos sin intervention: un robot que no necesita que le digan que hacer en cada momento es un robot autónomo. Eso es lo que distingue a un robot inteligente de un juguete controlado.
- ¿Qué pasa si el obstáculo está a los costados y no al frente? ¿Cómo mejorarías el esquive?

Notas para el facilitador:
Para el circuito de obstáculos usar objetos con superficie plana (libros parados, cajas). Separar los obstáculos al menos 30 cm entre si para dar espacio de giro. Si el robot choca igual, reducir el umbral de distancia de 20 a 25 cm.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Robot esquiva obstáculos con SPIKE Prime
- https://www.youtube.com/watch?v=2sXbbrVjmJI
- Como funciona la navegación autónoma en robots reales
- https://www.youtube.com/watch?v=9gOfE9ch7Ug$t$, $t$ConecTeo quiere un robot que navegue solo por el laboratorio sin chocar con nada. El sensor de distancia detecta el obstáculo, el robot gira y sigue adelante. Sin que nadie le diga que hacer en cada momento — el robot decide solo según lo que ve el sensor.$t$),
  ('bcaef68a-8994-40e8-b53a-4323d9b6c968'::uuid, 3, $t$2026 · Mes 8 · Clase 3$t$, $t$El robot con radar: distancia más variable$t$, $t$Agregar al programa de esquive: variable DISTANCIA_MINIMA = 999 al inicio. En el bucle de esquive: Si distancia < DISTANCIA_MINIMA → DISTANCIA_MINIMA = distancia. Al terminar el recorrido (botón del Hub): mostrar DISTANCIA_MINIMA en el display del Hub. Hacer el recorrido y comparar el valor registrado con el obstáculo más cercano.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectados Año 1 (9-10 años)
- Eje curricular: SPIKE Prime — sensor de distancia + variable: registrar la distancia mínima detectada

Objetivo de la clase:
- El alumno agrega una variable al robot de esquive para registrar la distancia mínima detectada durante el recorrido, creando un registro de datos del entorno.

Escenario — la voz de ConecTeo:
ConecTeo quiere saber cual fue el obstáculo más cercano que su robot encontró en el recorrido. Si el sensor detected algo a 5 cm, ese es el momento de mayor peligro. Una variable llamada DISTANCIA_MINIMA guarda ese dato y al final del recorrido ConecTeo puede leer el reporte del robot.

Momento 1 — activación emocional · 10 min:
ConecTeo muestra el robot de la sesión anterior y pregunta: después de hacer el recorrido, ¿cómo sabemos cual fue el objeto más cercano que detecto? Sin variable, no hay manera de saberlo. ¿Cómo lo agregamos?

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Récord del Sonar
- Los alumnos hacen el juego del sonar de la S01 pero ahora uno lleva un papel anotando el número de pasos de la menor distancia detectada. Al final comparan el récord de cada uno. Reflexión: ese papel con el número mínimo es exactamente la variable DISTANCIA_MINIMA.

Momento 3 — formalización · 15 min:
Concreto: crear variable DISTANCIA_MINIMA = 999 al inicio. En el bucle: Si distancia actual < DISTANCIA_MINIMA → actualizar DISTANCIA_MINIMA al valor actual.
- Pictórico: dibujar el algoritmo de comparación y actualización.
- Simbólico: ConecTeo explica — la variable empieza en un número muy alto (999) para que cualquier distancia real la actualice. Eso se llama inicialización con valor máximo.

Momento 4 — aplicación y transferencia · 35 min:
Agregar al programa de esquive: variable DISTANCIA_MINIMA = 999 al inicio. En el bucle de esquive: Si distancia < DISTANCIA_MINIMA → DISTANCIA_MINIMA = distancia. Al terminar el recorrido (botón del Hub): mostrar DISTANCIA_MINIMA en el display del Hub. Hacer el recorrido y comparar el valor registrado con el obstáculo más cercano.

Piso bajo:

Techo alto:
- La variable DISTANCIA_MINIMA se actualiza correctamente y muestra un valor razonable al terminar.
- La variable registra el valor correcto. Al comparar con una regla el obstáculo más cercano del circuito, el error no supera 5 cm. El alumno puede leer el reporte del robot y usarlo para mejorar el circuito.

Momento 5 — metacognición · 10 min:
ConecTeo lee el display del Hub: 8 cm. Eso significa que en algún momento del recorrido hubo algo a 8 cm del sensor. Con datos puedo mejorar el robot — sin datos solo tengo suposiciones.
- ¿Cómo registrarías la DISTANCIA_MAXIMA además de la mínima? ¿Para qué sería útil?

Notas para el facilitador:
La inicialización con valor muy alto (999) es un patrón clasico en programación para encontrar el mínimo. Explicarlo brevemente: si empezara en 0 nunca se actualizaría porque nada puede tener distancia menor a 0.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Variables en SPIKE Prime Python — tutorial
- https://www.youtube.com/watch?v=AWek49wXGkI
- Registro de datos con sensores — aplicaciones reales
- https://www.youtube.com/watch?v=GNsUm01i3EE$t$, $t$ConecTeo quiere saber cual fue el obstáculo más cercano que su robot encontró en el recorrido. Si el sensor detected algo a 5 cm, ese es el momento de mayor peligro. Una variable llamada DISTANCIA_MINIMA guarda ese dato y al final del recorrido ConecTeo puede leer el reporte del robot.$t$),
  ('bcaef68a-8994-40e8-b53a-4323d9b6c968'::uuid, 4, $t$2026 · Mes 8 · Clase 4$t$, $t$Robot autónomo integrador$t$, $t$Construcción del robot autónomo integrador. Mínimo requerido: sensor de distancia + if/elif + variable mostrando datos al final + movimiento en bucle. Presentación: explicar la misión, mostrar el robot en acción durante 1 minuto y leer el dato de la variable al terminar.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectados Año 1 (9-10 años)
- Eje curricular: SPIKE Prime — proyecto integrador: sensor distancia + if/elif + variable + movimiento

Objetivo de la clase:
- El alumno diseña y presenta un robot autónomo que integra los elementos del mes: sensor de distancia con tres rangos, variable de registro y movimiento libre.

Escenario — la voz de ConecTeo:
ConecTeo encarga el proyecto final del mes: un robot autónomo que navega, mide y registra. Cada equipo elige su misión: explorador de obstáculos, guardaespaldas de distancia, robot medidor de espacios, o lo que imaginen. Lo importante es que use el sensor de distancia, una variable y un programa en bucle.

Momento 1 — activación emocional · 10 min:
ConecTeo presenta cuatro posibles misiones para el robot de octubre: explorador, guardaespaldas, medidor, sorpresa. Cada equipo vota por cual quiere construir. Si tienen una idea propia, el facilitador evalúa si es factible.

Momento 2 — exploración del concepto · 20 min:
La Conferencia de Misión
- Cada equipo presenta su misión en 60 seg: que hace el robot, que detecta el sensor, que guarda la variable, cual es el objetivo de la misión. Los demás equipos aprueban o sugieren ajustes técnicos.

Momento 3 — formalización · 15 min:
Sin formalización nueva. El facilitador recuerda los tres componentes del mes: sensor de distancia (rangos con if/elif), variable de registro (guardar datos), movimiento autónomo (bucle + decisión). Cada equipo confirma cuáles usa.

Momento 4 — aplicación y transferencia · 35 min:
Construcción del robot autónomo integrador. Mínimo requerido: sensor de distancia + if/elif + variable mostrando datos al final + movimiento en bucle. Presentación: explicar la misión, mostrar el robot en acción durante 1 minuto y leer el dato de la variable al terminar.

Piso bajo:

Techo alto:
- Robot con sensor de distancia + if/else + variable funcionando con un objetivo claro.
- Robot con tres rangos de if/elif, variable de registro precisa y movimiento autónomo que cumple una misión específica sin intervención del usuario.

Momento 5 — metacognición · 10 min:
ConecTeo lee los datos de todos los robots: cada uno es un robot diferente pero todos usan el mismo sensor. La creatividad no está en las piezas — está en que le preguntas al sensor y que hacés con la respuesta.
- ¿Qué aprendiste este mes sobre los sensores de distancia que no sabias? ¿En qué robot real usarías lo que aprendiste?

Notas para el facilitador:
La presentación final es el momento pedagogico más valioso — cada equipo explica su diseño con sus propias palabras. Si un robot no funcionó perfectamente, igual presentar el análisis de por qué falló.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Robots autónomos con SPIKE Prime — proyectos creativos
- https://www.youtube.com/watch?v=XbpBgm9NBBY
- Como presentar un proyecto de robótica
- https://www.youtube.com/watch?v=HpCWfV3TSRI$t$, $t$ConecTeo encarga el proyecto final del mes: un robot autónomo que navega, mide y registra. Cada equipo elige su misión: explorador de obstáculos, guardaespaldas de distancia, robot medidor de espacios, o lo que imaginen. Lo importante es que use el sensor de distancia, una variable y un programa en bucle.$t$),
  ('c4d6e402-9ed4-4ad4-be0b-ea9aba41596c'::uuid, 1, $t$Mes 8 · Clase 1$t$, $t$El mensaje secreto: broadcasts entre personajes$t$, $t$Crear dos sprites: abeja y flor. La flor empieza cerrada (disfraz cerrado). La abeja se mueve hacia la flor y cuando llega envía el mensaje POLINIZAR. La flor tiene el script Al recibir POLINIZAR → cambiar a disfraz abierto → esperar 1 seg → volver a cerrado. Probar que la coordinación sea exacta.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 2 (6-8 años)
- Eje curricular: Scratch 3.0 — broadcasts: enviar y recibir mensajes para coordinar sprites

Objetivo de la clase:
- El alumno usa el bloque Enviar mensaje y el bloque Al recibir mensaje para que dos personajes de Scratch se coordinen sin necesidad de esperas cronometradas.

Escenario — la voz de Conectito:
Conectito descubrió que en Scratch 3.0 los personajes pueden mandarse mensajes secretos. La abeja le manda un mensaje a la flor: LA ABEJA LLEGA. La flor lo recibe y se abre exactamente en ese momento. No necesitan saber el tiempo exacto — el mensaje los conecta directamente.

Momento 1 — activación emocional · 10 min:
Conectito muestra dos versiones del mismo programa: una con esperas cronometradas (como en Scratch Jr) y otra con broadcasts. Pregunta: ¿cuál creen que es más precisa? ¿Por qué? Los alumnos debaten.

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Mensajero del Jardín
- Un alumno es la abeja. Cuando llega a una flor (compañero) le entrega una tarjeta (mensaje). La flor recibe la tarjeta y se abre (levanta los brazos). La abeja no sabe cuánto tarda en llegar — manda el mensaje cuando llega y la flor reacciona exactamente en ese momento. Reflexión: eso es el broadcast.

Momento 3 — formalización · 15 min:
Concreto: arrastrar el bloque Enviar Mensaje al script de la abeja y el bloque Al Recibir al script de la flor.
- Pictórico: dibujar la cadena: Abeja llega → Enviar LLEGO → Flor recibe LLEGO → Flor se abre.
- Simbólico: Conectito explica — el broadcast es más preciso que esperar porque no depende del tiempo: reacciona exactamente cuando pasa el evento.

Momento 4 — aplicación y transferencia · 35 min:
Crear dos sprites: abeja y flor. La flor empieza cerrada (disfraz cerrado). La abeja se mueve hacia la flor y cuando llega envía el mensaje POLINIZAR. La flor tiene el script Al recibir POLINIZAR → cambiar a disfraz abierto → esperar 1 seg → volver a cerrado. Probar que la coordinación sea exacta.

Piso bajo:

Techo alto:
- La flor cambia de disfraz cuando recibe el mensaje, sin espera cronometrada.
- Tres personajes coordinados con dos mensajes distintos: abeja llega → flor abre (mensaje 1) → sol brilla (mensaje 2 enviado por la flor al recibir el primero).

Momento 5 — metacognición · 10 min:
Conectito ve la flor abrirse exactamente cuando llega: el broadcast es más inteligente que esperar porque reacciona a lo que pasa, no al reloj. Esa es la diferencia entre esperar y escuchar.
- ¿Qué pasa si dos sprites distintos reciben el mismo mensaje? ¿Los dos reaccionan?

Notas para el facilitador:
El error más común es poner el Al Recibir en el mismo sprite que el Enviar — el personaje se manda mensajes a si mismo. Verificar que cada bloque este en el sprite correcto.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Broadcasts en Scratch 3.0 — tutorial completo
- https://www.youtube.com/watch?v=jZkNLT0QHPU
- Coordinar personajes con mensajes en Scratch
- https://www.youtube.com/watch?v=8yHgldk5mPo$t$, $t$Conectito descubrió que en Scratch 3.0 los personajes pueden mandarse mensajes secretos. La abeja le manda un mensaje a la flor: LA ABEJA LLEGA. La flor lo recibe y se abre exactamente en ese momento. No necesitan saber el tiempo exacto — el mensaje los conecta directamente.$t$),
  ('c4d6e402-9ed4-4ad4-be0b-ea9aba41596c'::uuid, 2, $t$Mes 8 · Clase 2$t$, $t$El contador de puntos: mi primera variable$t$, $t$Agregar al proyecto de la S01: variable FLORES que empieza en 0 al presionar la bandera. Al recibir POLINIZAR: además de abrir la flor, cambiar FLORES por 1. Mostrar la variable en pantalla. Agregar 3 flores más al escenario y probar que el contador sube correctamente con cada polinización.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 2 (6-8 años)
- Eje curricular: Scratch 3.0 — variables: crear un contador de puntos visible en pantalla

Objetivo de la clase:
- El alumno crea su primera variable en Scratch 3.0, la inicializa en 0 al inicio del programa y la incrementa con cada evento, mostrando el contador en pantalla.

Escenario — la voz de Conectito:
Conectito quiere saber cuántas flores polinice su abeja. Cada vez que la abeja llega a una flor, el contador sube 1. Al final del recorrido, el número en pantalla dice exactamente cuántas flores fueron polinizadas. Eso es una variable — la memoria del programa.

Momento 1 — activación emocional · 10 min:
Conectito pregunta: si la abeja visita 5 flores durante el programa, ¿cómo sabe el usuario cuántas visitó? ¿Lo tiene que contar el? Los alumnos proponen ideas. Mostrar como sin variable la pantalla no guarda ningún número.

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Marcador del Partido
- El facilitador tiene un papel en blanco (la variable). Empieza en 0. Cada vez que un alumno responde correctamente una pregunta, el facilitador escribe el nuevo número. Al final todos ven cuántos puntos tiene el grupo. Reflexión: ese papel es exactamente lo que hace una variable en Scratch.

Momento 3 — formalización · 15 min:
Concreto: crear variable FLORES en Scratch 3.0. Mostrar los bloques: Fijar FLORES en 0, Cambiar FLORES por 1, Mostrar variable.
- Pictórico: dibujar la variable como un marcador que sube con cada evento.
- Simbólico: Conectito explica — la variable FLORES es la memoria del contador. Sin ella el programa olvida cada número anterior.

Momento 4 — aplicación y transferencia · 35 min:
Agregar al proyecto de la S01: variable FLORES que empieza en 0 al presionar la bandera. Al recibir POLINIZAR: además de abrir la flor, cambiar FLORES por 1. Mostrar la variable en pantalla. Agregar 3 flores más al escenario y probar que el contador sube correctamente con cada polinización.

Piso bajo:

Techo alto:
- La variable FLORES empieza en 0 y sube 1 con cada broadcast recibido. El número se ve en pantalla.
- Cuando FLORES llega a 5 el programa muestra un mensaje de felicitación y el juego termina (detener todo). El usuario puede jugar de nuevo presionando la bandera.

Momento 5 — metacognición · 10 min:
Conectito ve el número 5 en pantalla después de polinizar todas las flores: la variable guardó cada polinización aunque el programa no las vio todas a la vez. Eso es la memoria del código.
- ¿Qué pasa si olvido fijar la variable en 0 al inicio? ¿Y si quiero contar flores rojas por separado de las amarillas?

Notas para el facilitador:
El error más común es poner el Cambiar FLORES por 1 en el script de la bandera en vez de en el Al Recibir POLINIZAR. Verificar que el incremento ocurra exactamente cuando se recibe el mensaje.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Variables en Scratch 3.0 — primer contacto
- https://www.youtube.com/watch?v=dm_5RMXNC5I
- Como crear un marcador de puntos en Scratch
- https://www.youtube.com/watch?v=6AzZyHqSoSE$t$, $t$Conectito quiere saber cuántas flores polinice su abeja. Cada vez que la abeja llega a una flor, el contador sube 1. Al final del recorrido, el número en pantalla dice exactamente cuántas flores fueron polinizadas. Eso es una variable — la memoria del programa.$t$),
  ('c4d6e402-9ed4-4ad4-be0b-ea9aba41596c'::uuid, 3, $t$Mes 8 · Clase 3$t$, $t$El juego del jardín: broadcast más variable$t$, $t$Construir el mini-juego: Abeja se mueve con flechas del teclado (scripts de teclas). Al tocar una flor: la abeja envía el broadcast TOQUE. La flor al recibir TOQUE: cambia de color (polinizada) + variable FLORES sube 1. Si FLORES = 5: mensaje GANASTE y detener. Probar que el juego funcione completo.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 2 (6-8 años)
- Eje curricular: Scratch 3.0 — combinar broadcasts y variables en un mini-juego interactivo

Objetivo de la clase:
- El alumno combina broadcasts y variables en un mini-juego donde el usuario controla la abeja para polinizar flores, acumulando puntos y llegando a una meta.

Escenario — la voz de Conectito:
Conectito tiene todos los ingredientes para su primer mini-juego: un personaje controlable, flores que reaccionan al contacto, y un contador de puntos. Hoy los unimos en un juego real donde el objetivo es polinizar todas las flores antes de que se acabe el tiempo.

Momento 1 — activación emocional · 10 min:
Conectito presenta el concepto de mini-juego: tiene un objetivo (polinizar 5 flores), un personaje controlable (la abeja con teclas) y un marcador (variable). Los alumnos discuten que más podría tener un juego completo.

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Juego Físico
- Los alumnos son la abeja. El facilitador pega tarjetas de flores en distintos lugares del aula. Los alumnos deben tocar 5 flores lo más rápido posible mientras el facilitador cuenta en voz alta. Al terminar: ¿cuántas llegaron a 5? Reflexión: eso es el juego que vamos a programar.

Momento 3 — formalización · 15 min:
Concreto: mostrar el proyecto completo antes de construirlo — abeja movible con teclas, flores que reaccionan al contacto, contador visible.
- Pictórico: dibujar el flujo completo del juego con sus tres componentes.
- Simbólico: Conectito explica — un juego es un programa con reglas, objetivo y retroalimentación al jugador.

Momento 4 — aplicación y transferencia · 35 min:
Construir el mini-juego: Abeja se mueve con flechas del teclado (scripts de teclas). Al tocar una flor: la abeja envía el broadcast TOQUE. La flor al recibir TOQUE: cambia de color (polinizada) + variable FLORES sube 1. Si FLORES = 5: mensaje GANASTE y detener. Probar que el juego funcione completo.

Piso bajo:

Techo alto:
- La abeja se mueve con el teclado y la variable sube cuando toca una flor.
- El juego completo funciona: abeja movible, flores que se poliinizan al contacto, contador visible y mensaje de victoria cuando llega a 5. Se puede jugar más de una vez con la bandera.

Momento 5 — metacognición · 10 min:
Conectito juega su propio juego: hoy pasamos de animar personajes a crear una experiencia interactiva con reglas. Un juego es un programa con objetivo, y un objetivo hace que el usuario quiera seguir jugando.
- ¿Qué reglas le agregarías al juego? ¿Un limite de tiempo? ¿Vidas? ¿Puntos extra por velocidad?

Notas para el facilitador:
Si el teclado no detecta bien el movimiento de la abeja, verificar que el script de cada flecha tenga Si se presiona tecla dentro de un Repetir siempre (no solo el bloque Al presionar tecla). El primer da movimiento fluido, el segundo solo detecta el primer toque.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Crear un mini-juego en Scratch 3.0
- https://www.youtube.com/watch?v=jXUZaf5D12A
- Como detectar colisiones entre sprites en Scratch
- https://www.youtube.com/watch?v=nYBHSlAqrCk$t$, $t$Conectito tiene todos los ingredientes para su primer mini-juego: un personaje controlable, flores que reaccionan al contacto, y un contador de puntos. Hoy los unimos en un juego real donde el objetivo es polinizar todas las flores antes de que se acabe el tiempo.$t$),
  ('c4d6e402-9ed4-4ad4-be0b-ea9aba41596c'::uuid, 4, $t$Mes 8 · Clase 4$t$, $t$Mi proyecto de octubre$t$, $t$Construcción del proyecto integrador. Tiempo construcción: 20 min. Programación: 10 min. Prueba: 5 min. Presentación: 15 min. En la presentación: mostrar el proyecto en pantalla, explicar el broadcast y la variable, y dejar que otro equipo lo pruebe 30 segundos.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 2 (6-8 años)
- Eje curricular: Scratch 3.0 — proyecto integrador: broadcast + variable + personaje interactivo

Objetivo de la clase:
- El alumno diseña y presenta un proyecto de Scratch 3.0 que integra los tres elementos del mes: broadcast, variable y un personaje controlable por el usuario.

Escenario — la voz de Conectito:
El jardín de octubre de Conectito necesita su proyecto final. Puede ser un juego, una historia interactiva o algo completamente nuevo — siempre que use un broadcast, una variable y que el usuario pueda hacer algo con el teclado o el clic.

Momento 1 — activación emocional · 10 min:
Conectito presenta los tres elementos del mes: BROADCAST (coordinar personajes), VARIABLE (guardar y contar), INTERACCIÓN (teclas o clic). Cada equipo decide que tipo de proyecto hace: juego, historia interactiva u otro.

Momento 2 — exploración del concepto · 20 min:
El Estudio de Diseño
- Cada equipo tiene 5 minutos para dibujar el plano de su proyecto en papel: personajes, objetivo para el usuario, que envía el broadcast y que guarda la variable. El facilitador revisa cada plano antes de abrir Scratch.

Momento 3 — formalización · 15 min:
Sin formalización nueva. El facilitador anota en el pizarrón los criterios mínimos: 1 broadcast funcionando, 1 variable visible en pantalla, el usuario puede hacer algo. Cada equipo los señala en su plano.

Momento 4 — aplicación y transferencia · 35 min:
Construcción del proyecto integrador. Tiempo construcción: 20 min. Programación: 10 min. Prueba: 5 min. Presentación: 15 min. En la presentación: mostrar el proyecto en pantalla, explicar el broadcast y la variable, y dejar que otro equipo lo pruebe 30 segundos.

Piso bajo:

Techo alto:
- Proyecto con broadcast + variable funcionando y al menos 1 acción del usuario.
- Proyecto completo jugable o narrable, con broadcast encadenado, variable con meta y experiencia clara para el usuario desde el inicio hasta el final.

Momento 5 — metacognición · 10 min:
Conectito ve todos los proyectos: cada uno uso los mismos bloques para crear algo distinto. Eso es exactamente lo que hace la programación — con pocas herramientas se pueden construir mundos muy diferentes.
- ¿Qué aprendiste este mes que no sabias hacer en Scratch? ¿En qué se diferencia tu proyecto de octubre del de septiembre?

Notas para el facilitador:
Documentar todos los proyectos con una captura de pantalla y el nombre del equipo para el portafolio del mes. Si hay tiempo, armar una galería de proyectos en el proyector al final.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Galería de proyectos creativos en Scratch 3.0
- https://www.youtube.com/watch?v=jXUZaf5D12A
- Como presentar un proyecto de programación
- https://www.youtube.com/watch?v=IpXM1FkjhSY$t$, $t$El jardín de octubre de Conectito necesita su proyecto final. Puede ser un juego, una historia interactiva o algo completamente nuevo — siempre que use un broadcast, una variable y que el usuario pueda hacer algo con el teclado o el clic.$t$),
  ('a015aed5-7610-4966-9269-1c2bb4f056b2'::uuid, 1, $t$Mes 8 · Clase 1$t$, $t$El sensor de inclinación: ángulos y umbrales$t$, $t$Programar tres zonas de respuesta: Si inclinación leve (zona 1) -> Motor velocidad 3. Si inclinación moderada (zona 2) -> Motor velocidad 6. Si inclinación fuerte (zona 3) -> Motor velocidad 9. Usar la inclinación del Hub como control de velocidad proporcional. Probar con distintos ángulos y medir si el motor cambia de velocidad correctamente.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 2 (6-8 años)
- Eje curricular: WeDo 2.0 — sensor de inclinación: calibración de umbrales y precisión

Objetivo de la clase:
- El alumno calibra el sensor de inclinación para detectar ángulos específicos y programa umbrales de activación precisos para distintas reacciones.

Escenario — la voz de Conectito:
Conectito descubrió que el sensor de inclinación puede ser muy preciso si lo calibramos bien. No es solo adelante-atrás — tiene niveles. Un poco inclinado es distinto a muy inclinado. Hoy aprendemos a diferenciar esos niveles y a programar reacciones distintas para cada uno.

Momento 1 — activación emocional · 10 min:
Conectito muestra el monitor del sensor inclinando el Hub muy poco, moderadamente y mucho. Pregunta: ¿el sensor da el mismo valor en los tres casos? Los alumnos observan. ¿Se puede programar que reaccione diferente según cuánto se inclina?

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Angulometro Humano
- Los alumnos extienden un brazo. Poco inclinado = 15 grados (casi horizontal). Moderado = 45 grados. Mucho = 90 grados. El facilitador pregunta: si tuviera que activar un motor solo cuando el ángulo supera los 45 grados, ¿cómo lo programaría? Reflexión: eso es un umbral de activación.

Momento 3 — formalización · 15 min:
Concreto: usar el bloque Si Inclinación > umbral en la app WeDo 2.0.
- Pictórico: dibujar la escala de inclinación con tres zonas: baja (0-20), media (20-60), alta (60+).
- Simbólico: Conectito explica — un umbral es el valor mínimo necesario para que algo ocurra. Sin umbral el sensor reacciona a cualquier movimiento involuntario.

Momento 4 — aplicación y transferencia · 35 min:
Programar tres zonas de respuesta: Si inclinación leve (zona 1) -> Motor velocidad 3. Si inclinación moderada (zona 2) -> Motor velocidad 6. Si inclinación fuerte (zona 3) -> Motor velocidad 9. Usar la inclinación del Hub como control de velocidad proporcional. Probar con distintos ángulos y medir si el motor cambia de velocidad correctamente.

Piso bajo:

Techo alto:
- El motor tiene al menos 2 velocidades distintas según el nivel de inclinación.
- El motor tiene 3 velocidades proporcionales a la inclinación (leve-media-fuerte). El alumno puede controlar la velocidad inclinando el Hub como un acelerador analógico.

Momento 5 — metacognición · 10 min:
Conectito inclina el Hub suavemente y ve el motor ir lento; lo inclina más y el motor acelera. Aprendí que un sensor bien calibrado da mucho más control que uno sin calibrar.
- ¿Dónde más usarías un control por inclinación proporcional? ¿Una grúa, un vehículo, un juego?

Notas para el facilitador:
Los valores exactos de inclinación en WeDo 2.0 varian según el kit. Dejar que los alumnos encuentren sus propios umbrales midiendo con el monitor — ese proceso de calibración es en si mismo parte del aprendizaje.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Calibración de sensores — que es y para que sirve
- https://www.youtube.com/watch?v=bvKOkL4XICE
- Control proporcional en robótica — explicación
- https://www.youtube.com/watch?v=9gOfE9ch7Ug$t$, $t$Conectito descubrió que el sensor de inclinación puede ser muy preciso si lo calibramos bien. No es solo adelante-atrás — tiene niveles. Un poco inclinado es distinto a muy inclinado. Hoy aprendemos a diferenciar esos niveles y a programar reacciones distintas para cada uno.$t$),
  ('a015aed5-7610-4966-9269-1c2bb4f056b2'::uuid, 2, $t$Mes 8 · Clase 2$t$, $t$Dos sensores: movimiento e inclinación juntos$t$, $t$Programar: Repetir siempre { Si movimiento detectado: Si inclinación = adelante → Motor adelante rápido | Si inclinación = atrás → Motor atrás rápido | Si NO movimiento detectado: Motor a velocidad base (inclinación controla velocidad baja) }. Probar acercando la mano mientras inclinan el Hub.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 2 (6-8 años)
- Eje curricular: WeDo 2.0 — combinar sensor de movimiento y sensor de inclinación en un programa

Objetivo de la clase:
- El alumno programa un robot que usa dos sensores simultaneamente: el sensor de movimiento decide si hay algo cerca, y el sensor de inclinación controla la velocidad o dirección.

Escenario — la voz de Conectito:
Conectito tiene un nuevo desafío: un robot que usa dos sentidos al mismo tiempo. El sensor de movimiento es como la vista — detecta si algo se acerca. El sensor de inclinación es como el oido del equilibrio — detecta la posición del cuerpo. Juntos hacen al robot mucho más inteligente.

Momento 1 — activación emocional · 10 min:
Conectito muestra dos sensores conectados al Hub. Pregunta: ¿cómo creen que un programa puede usar dos sensores a la vez? ¿Se turnan? ¿Trabajan al mismo tiempo? Los alumnos debaten. El facilitador muestra el monitor de ambos sensores en simultáneo.

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Robot de Dos Sentidos
- Un alumno es el sensor de movimiento (mira al frente y grita STOP cuando alguien se acerca). Otro es el sensor de inclinación (sostiene un libro e indica ADELANTE o ATRÁS según lo inclinen). El motor humano (un tercer alumno) obedece a ambos al mismo tiempo. Si STOP + ADELANTE → que hace?

Momento 3 — formalización · 15 min:
Concreto: conectar sensor de movimiento al puerto 1 y sensor de inclinación al puerto 2.
- Pictórico: dibujar el diagrama de flujo con dos condiciones en paralelo.
- Simbólico: Conectito explica — cuando dos sensores actúan a la vez usamos condiciones anidadas: Si (sensor 1 activo) Y Si (sensor 2 = X) → acción.

Momento 4 — aplicación y transferencia · 35 min:
Programar: Repetir siempre { Si movimiento detectado: Si inclinación = adelante → Motor adelante rápido | Si inclinación = atrás → Motor atrás rápido | Si NO movimiento detectado: Motor a velocidad base (inclinación controla velocidad baja) }. Probar acercando la mano mientras inclinan el Hub.

Piso bajo:

Techo alto:
- El robot reacciona diferente cuando el sensor de movimiento esta activo vs cuando no lo esta.
- El robot usa ambos sensores juntos: el de movimiento decide el modo (rápido/lento) y el de inclinación decide la dirección. 4 comportamientos distintos posibles.

Momento 5 — metacognición · 10 min:
Conectito ve al robot obedecer dos sensores a la vez: combinar sensores es como combinar sentidos. Cada uno agrega información y juntos el robot puede tomar decisiones más complejas.
- ¿Qué dispositivo real usa más de un sensor a la vez? ¿Un teléfono? ¿Un auto? ¿Una alarma?

Notas para el facilitador:
El mayor desafío es que los alumnos entiendan la lógica anidada. Si tienen dificultad, empezar con solo un sensor funcionando y agregar el segundo después de que el primero este estable.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Múltiples sensores en robótica — como se combinan
- https://www.youtube.com/watch?v=v0TymwG5xgQ
- WeDo 2.0 — programar con dos sensores
- https://www.youtube.com/watch?v=bvKOkL4XICE$t$, $t$Conectito tiene un nuevo desafío: un robot que usa dos sentidos al mismo tiempo. El sensor de movimiento es como la vista — detecta si algo se acerca. El sensor de inclinación es como el oido del equilibrio — detecta la posición del cuerpo. Juntos hacen al robot mucho más inteligente.$t$),
  ('a015aed5-7610-4966-9269-1c2bb4f056b2'::uuid, 3, $t$Mes 8 · Clase 3$t$, $t$El mecanismo inteligente de Conectito$t$, $t$Usar una variable llamada ESTADO que empieza en REPOSO. Repetir siempre { Si ESTADO=REPOSO Y movimiento detectado → ESTADO=ACTIVO, Motor inicia. Si ESTADO=ACTIVO Y inclinación=plano → ESTADO=REPOSO, Motor para. Si ESTADO=ACTIVO → ejecutar comportamiento según inclinación }. Probar el ciclo completo.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 2 (6-8 años)
- Eje curricular: WeDo 2.0 — mecanismo con dos sensores y lógica de estados

Objetivo de la clase:
- El alumno construye un mecanismo que cambia entre dos modos (activo/reposo) según los sensores, comprendiendo el concepto de estado en programación.

Escenario — la voz de Conectito:
Conectito quiere un robot que tenga dos modos: modo reposo (espera sin gastar energía) y modo activo (trabaja cuando lo necesitan). El sensor de movimiento lo despierta del reposo. El sensor de inclinación controla lo que hace cuando esta activo. Es como un robot que tiene sueño.

Momento 1 — activación emocional · 10 min:
El facilitador actúa como un robot en reposo (quieto). Cuando alguien se acerca lo despierta. Al despertar, la inclinación del Hub decide que hace. Esto ilustra el concepto de estado. Pregunta: ¿conocen dispositivos que funcionen igual? (pantalla del teléfono, luces automáticas).

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Robot con Sueño
- Un alumno es el robot dormido (ojos cerrados, inmovil). Cuando alguien le toca el hombro (sensor de movimiento), se despierta. Luego alguien inclina un libro frente a el y el robot ejecuta la acción correspondiente. Cuando nadie se acerca, vuelve a dormirse. Rotar roles.

Momento 3 — formalización · 15 min:
Concreto: definir dos variables de estado: REPOSO y ACTIVO. El sensor de movimiento cambia el estado.
- Pictórico: dibujar el diagrama de estados con dos círculos y las transiciones entre ellos.
- Simbólico: Conectito explica — un estado es la condición actual del robot. Las transiciones son los eventos que lo cambian.

Momento 4 — aplicación y transferencia · 35 min:
Usar una variable llamada ESTADO que empieza en REPOSO. Repetir siempre { Si ESTADO=REPOSO Y movimiento detectado → ESTADO=ACTIVO, Motor inicia. Si ESTADO=ACTIVO Y inclinación=plano → ESTADO=REPOSO, Motor para. Si ESTADO=ACTIVO → ejecutar comportamiento según inclinación }. Probar el ciclo completo.

Piso bajo:

Techo alto:
- El robot cambia entre dos modos (reposo/activo) según el sensor de movimiento.
- El robot tiene lógica completa de estados: se activa con movimiento, ejecuta según inclinación, vuelve a reposo cuando queda plano. El ciclo funciona infinitamente sin intervención.

Momento 5 — metacognición · 10 min:
Conectito duerme y se despierta según quien se acerca: los estados hacen al robot más eficiente. Un robot que espera en modo reposo gasta menos energía y reacciona mejor cuando lo necesitan.
- ¿Cuántos estados distintos podría tener un robot más complejo? ¿Y un celular tiene estados?

Notas para el facilitador:
La variable de estado puede ser una variable numerica (0=reposo, 1=activo) o usar bloques condicionales anidados. La versión con variable es más escalable — si tienen tiempo mostrar ambas.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Máquinas de estado — introducción para no programadores
- https://www.youtube.com/watch?v=AWek49wXGkI
- Robots con modos de operación — como se implementan
- https://www.youtube.com/watch?v=s3CiYqOhB9w$t$, $t$Conectito quiere un robot que tenga dos modos: modo reposo (espera sin gastar energía) y modo activo (trabaja cuando lo necesitan). El sensor de movimiento lo despierta del reposo. El sensor de inclinación controla lo que hace cuando esta activo. Es como un robot que tiene sueño.$t$),
  ('a015aed5-7610-4966-9269-1c2bb4f056b2'::uuid, 4, $t$Mes 8 · Clase 4$t$, $t$Mi robot de octubre — Año 2$t$, $t$Construcción del proyecto integrador con mínimo 2 sensores y al menos 2 estados o comportamientos distintos. Tiempo de construcción: 20 min. Programación: 10 min. Prueba y ajuste: 5 min. Presentación con ficha técnica completa: 15 min.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 2 (6-8 años)
- Eje curricular: WeDo 2.0 — proyecto integrador Año 2: dos sensores + lógica de estados

Objetivo de la clase:
- El alumno diseña y construye un robot de octubre que integra dos sensores con lógica de estados, presenta el funcionamiento y documenta la ficha técnica completa.

Escenario — la voz de Conectito:
El taller de octubre de Conectito cierra con el proyecto más ambicioso del mes: un robot con dos sensores y dos modos de operación. Cada ingeniero del Año 2 elige su propio desafío y lo presenta al grupo con la ficha técnica completa.

Momento 1 — activación emocional · 10 min:
Conectito presenta los conceptos del mes como herramientas disponibles: calibración de umbrales, dos sensores simultaneos, estados (reposo/activo). Cada equipo elige cuántas herramientas incorpora — mínimo 2.

Momento 2 — exploración del concepto · 20 min:
La Feria del Taller
- Cada equipo presenta el plano técnico de su robot en 60 seg: sensores usados, estados posibles, comportamientos. Los demás equipos hacen UNA pregunta técnica. El facilitador evalúa si el plan es realizable en el tiempo disponible.

Momento 3 — formalización · 15 min:
Sin formalización nueva. El facilitador recuerda las herramientas disponibles en el pizarrón: calibración de umbrales, dos sensores simultaneos, diagrama de estados. Cada equipo señala cuáles va a usar.

Momento 4 — aplicación y transferencia · 35 min:
Construcción del proyecto integrador con mínimo 2 sensores y al menos 2 estados o comportamientos distintos. Tiempo de construcción: 20 min. Programación: 10 min. Prueba y ajuste: 5 min. Presentación con ficha técnica completa: 15 min.

Piso bajo:

Techo alto:
- Robot con 2 sensores y 2 comportamientos distintos documentados en la ficha técnica.
- Robot con 2 sensores, lógica de estados completa (mínimo 3 transiciones) y calibración de umbrales demostrada.

Momento 5 — metacognición · 10 min:
Conectito cierra el taller de octubre: este mes pasamos de un sensor a dos, de una reacción a un sistema de estados. Cada semana el robot fue un poco más inteligente porque el programa fue un poco más sofisticado.
- ¿Qué diferencia hay entre el robot que hiciste en octubre y el que hiciste en septiembre? ¿Qué aprendiste sobre como piensan los robots?

Notas para el facilitador:
Pedir ficha técnica escrita en la bitácora antes de la presentación oral. La ficha es el registro de ingeniería — sin ella la presentación no esta completa.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Proyectos de robótica educativa — exhibición
- https://www.youtube.com/watch?v=HpCWfV3TSRI
- Como documentar un proyecto de ingeniería
- https://www.youtube.com/watch?v=WijyEL4dOW4$t$, $t$El taller de octubre de Conectito cierra con el proyecto más ambicioso del mes: un robot con dos sensores y dos modos de operación. Cada ingeniero del Año 2 elige su propio desafío y lo presenta al grupo con la ficha técnica completa.$t$),
  ('58423600-bb93-4923-98ec-0f794b9aed73'::uuid, 1, $t$Mes 8 · Clase 1$t$, $t$Funciones con el Agent de ConecTeo$t$, $t$Definir tres funciones: def columna(): (Agent construye columna de 5 bloques), def fila(): (Agent construye fila de 8 bloques), def esquina(): (llama a columna y fila para hacer una esquina). Usar las funciones para construir un recinto cuadrado llamando a esquina() 4 veces. Verificar que el recinto quede cerrado.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectados Año 2 (9-10 años, segundo mes en Minecraft Education)
- Eje curricular: Minecraft Education — definir funciones reutilizables en Code Builder

Objetivo de la clase:
- El alumno define y llama funciones propias en Code Builder para que el Agent ejecute tareas complejas con una sola línea de código, comprendiendo el principio de reutilización.

Escenario — la voz de ConecTeo:
ConecTeo tiene una queja del Agent: cada vez que quiere construir una columna de 5 bloques tiene que escribir el mismo código. Hoy le enseña al Agent a recordar tareas completas — se llaman funciones. Una vez definidas, puede llamarlas cuando quiera con una sola línea.

Momento 1 — activación emocional · 10 min:
ConecTeo muestra el código de septiembre para construir una fila de bloques (con el bucle for). Pregunta: si quiero hacer eso 3 veces en lugares distintos, ¿tengo que escribirlo 3 veces? Los alumnos calculan cuántas líneas necesitarían. Después muestra la versión con función: 3 líneas.

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Manual de Instrucciones
- El facilitador escribe en el pizarrón: PASO 1: avanzar 5 → PASO 2: girar derecha → PASO 3: avanzar 3. Eso es la función PATRULLA. Después en vez de repetir los 3 pasos dice: PATRULLA. Los alumnos ejecutan los 3 pasos con esa sola palabra. Reflexión: la función es un nombre para una secuencia de instrucciones.

Momento 3 — formalización · 15 min:
Concreto: en Python escribir def nombre_función(): y los bloques adentro con indentación.
- Pictórico: dibujar la función como una caja con nombre y contenido.
- Simbólico: ConecTeo explica — definir una función es como darle un nombre a una receta. Llamarla es como decir hacé la receta. El código de adentro puede ser tan largo como se necesite.

Momento 4 — aplicación y transferencia · 35 min:
Definir tres funciones: def columna(): (Agent construye columna de 5 bloques), def fila(): (Agent construye fila de 8 bloques), def esquina(): (llama a columna y fila para hacer una esquina). Usar las funciones para construir un recinto cuadrado llamando a esquina() 4 veces. Verificar que el recinto quede cerrado.

Piso bajo:

Techo alto:
- Al menos 1 función definida y llamada correctamente. El código es más corto que la versión sin funciones.
- Las 3 funciones definidas y el recinto cuadrado construido correctamente. El alumno puede agregar una 4a función (techo) y construir una estructura más compleja.

Momento 5 — metacognición · 10 min:
ConecTeo ve el recinto construido con solo 8 líneas de código: las funciones son el ahorro más grande en programación. Una vez que definis como hacer algo, jamas tenés que explicarlo de nuevo.
- ¿Puede una función llamar a otra función? ¿Qué se llama una función que se llama a si misma?

Notas para el facilitador:
La indentación en Python es obligatoria — si los bloques del cuerpo de la función no tienen el sangrado correcto el programa da error. Mostrar el error común y como corregirlo antes de que los alumnos empiecen.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Funciones en Python para Minecraft Education
- https://www.youtube.com/watch?v=h5ahFp1WNTU
- Que son las funciones en programación — explicación simple
- https://www.youtube.com/watch?v=AWek49wXGkI$t$, $t$ConecTeo tiene una queja del Agent: cada vez que quiere construir una columna de 5 bloques tiene que escribir el mismo código. Hoy le enseña al Agent a recordar tareas completas — se llaman funciones. Una vez definidas, puede llamarlas cuando quiera con una sola línea.$t$),
  ('58423600-bb93-4923-98ec-0f794b9aed73'::uuid, 2, $t$Mes 8 · Clase 2$t$, $t$El Agent arquitecto: funciones complejas$t$, $t$Redefinir columna con parámetro altura. Redefinir fila con parámetro largo. Definir nueva función pared(alto, ancho) que llama a columna(alto) en un bucle de range(ancho) veces. Construir tres paredes de distintas dimensiones con pared(3,5), pared(5,3), pared(4,8). Verificar que cada una tenga las dimensiones correctas.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectados Año 2 (9-10 años, segundo mes en Minecraft Education)
- Eje curricular: Minecraft Education — funciones con parámetros: construir estructuras configurables

Objetivo de la clase:
- El alumno define funciones con parámetros para que el Agent pueda construir estructuras de tamaño variable, llamando a la misma función con distintos argumentos.

Escenario — la voz de ConecTeo:
ConecTeo quiere que el Agent construya ventanas de distintos tamaños. Una función sin parámetros solo construye del mismo tamaño siempre. Con parámetros, una sola función puede hacer ventanas de 2x2, 3x3 o 5x5 según lo que le pasemos. Los parámetros son los ingredientes configurables de la receta.

Momento 1 — activación emocional · 10 min:
ConecTeo muestra la función columna() de la sesión anterior que siempre construye 5 bloques. Pregunta: ¿cómo hago una columna de 3? ¿Y de 10? ¿Escribo 3 funciones distintas? Los alumnos proponen soluciones. El facilitador lleva hacia el concepto de parámetro.

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: La Receta Configurable
- El facilitador muestra la receta de un sandwich: 2 rebanadas de pan, 1 feta de jamon, 1 feta de queso. Luego dice: ¿cómo hago la misma receta pero con 3 fetas de jamon? Los alumnos cambian el número. Reflexión: el número de fetas es el parámetro. La receta es la función. El número que pasamos al llamarla es el argumento.

Momento 3 — formalización · 15 min:
Concreto: def columna(altura): for i in range(altura): agent.place(DOWN) → agent.move(UP, 1). Llamar con columna(3), columna(7), columna(10).
- Pictórico: dibujar la función como una caja con una ranura de entrada (el parámetro) y la estructura de salida que varía.
- Simbólico: ConecTeo explica — el parámetro es la variable de la función. Cambia cada vez que la llamamos. El cuerpo de la función usa ese valor para decidir cuánto construir.

Momento 4 — aplicación y transferencia · 35 min:
Redefinir columna con parámetro altura. Redefinir fila con parámetro largo. Definir nueva función pared(alto, ancho) que llama a columna(alto) en un bucle de range(ancho) veces. Construir tres paredes de distintas dimensiones con pared(3,5), pared(5,3), pared(4,8). Verificar que cada una tenga las dimensiones correctas.

Piso bajo:

Techo alto:
- Al menos 1 función con parámetro definida y llamada con 2 argumentos distintos. Las estructuras resultantes tienen distintos tamaños.
- Las 3 funciones con parámetros funcionan correctamente. La función pared(alto, ancho) construye una pared de dimensiones exactas verificables en el juego.

Momento 5 — metacognición · 10 min:
ConecTeo ve tres paredes de distintos tamaños construidas con una sola función: un parámetro convierte una función fija en una herramienta versátil. Con eso, un mismo código puede construir infinitas variaciones.
- ¿Cuántos parámetros puede tener una función? ¿Hay un limite? ¿Para qué usarías una función con 3 parámetros?

Notas para el facilitador:
Si los alumnos no tienen experiencia con parámetros, empezar solo con columna(altura) antes de pasar a pared(alto, ancho). No es necesario llegar a 2 parámetros si el primer paso no esta consolidado.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Funciones con parámetros en Python — tutorial
- https://www.youtube.com/watch?v=AWek49wXGkI
- Arquitectura procedural en Minecraft — conceptos
- https://www.youtube.com/watch?v=KNvsq8Xqz4g$t$, $t$ConecTeo quiere que el Agent construya ventanas de distintos tamaños. Una función sin parámetros solo construye del mismo tamaño siempre. Con parámetros, una sola función puede hacer ventanas de 2x2, 3x3 o 5x5 según lo que le pasemos. Los parámetros son los ingredientes configurables de la receta.$t$),
  ('58423600-bb93-4923-98ec-0f794b9aed73'::uuid, 3, $t$Mes 8 · Clase 3$t$, $t$El mundo con datos: funciones más variables$t$, $t$Definir 3 funciones de construcción (casa, fortaleza, torre — pueden ser estructuras simples de 3-5 bloques). Combinar con inspect + if/elif para elegir cual construir. Crear una zona de prueba con los 3 tipos de terreno en el mundo. Ejecutar el Agent sobre cada zona y verificar que construye la estructura correcta.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectados Año 2 (9-10 años, segundo mes en Minecraft Education)
- Eje curricular: Minecraft Education — combinar funciones con variables y comandos de chat

Objetivo de la clase:
- El alumno combina funciones definidas con variables de estado para que el Agent tome decisiones sobre que función ejecutar según el contexto del mundo.

Escenario — la voz de ConecTeo:
ConecTeo quiere un Agent que elige que construir según el terreno: si el suelo es tierra construye una casa, si es piedra construye una fortaleza, si es arena construye una torre. Para eso combina las funciones de construcción con el inspect del Agent y una variable que guarda el tipo de terreno.

Momento 1 — activación emocional · 10 min:
ConecTeo muestra el código de inspect de septiembre y las funciones del mes. Pregunta: ¿cómo los uno para que el Agent decida que función ejecutar según lo que encuentra? Los alumnos proponen el esquema del programa antes de codificarlo.

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Arquitecto Inteligente
- El facilitador muestra tarjetas de terreno (tierra, piedra, arena). Cuando ve TIERRA todos dicen CASA. PIEDRA — FORTALEZA. ARENA — TORRE. El facilitador mezcla las tarjetas aleatoriamente. El grupo responde con la construcción correcta. Reflexión: eso es exactamente el if/elif que activa distintas funciones según el terreno.

Momento 3 — formalización · 15 min:
Concreto: terreno = agent.inspect(DOWN). If terreno == DIRT: construir_casa(). elif terreno == STONE: construir_fortaleza(). elif terreno == SAND: construir_torre().
- Pictórico: dibujar el árbol de decisión que activa distintas funciones.
- Simbólico: ConecTeo explica — las funciones son verbos y el if/elif decide cuando usarlos. La variable terreno es el sustantivo — lo que hay en el mundo.

Momento 4 — aplicación y transferencia · 35 min:
Definir 3 funciones de construcción (casa, fortaleza, torre — pueden ser estructuras simples de 3-5 bloques). Combinar con inspect + if/elif para elegir cual construir. Crear una zona de prueba con los 3 tipos de terreno en el mundo. Ejecutar el Agent sobre cada zona y verificar que construye la estructura correcta.

Piso bajo:

Techo alto:
- El Agent construye 2 estructuras distintas según 2 tipos de terreno usando if/elif con funciones.
- El Agent construye 3 estructuras distintas correctamente según los 3 tipos de terreno. El código es limpio: las funciones están definidas arriba y el if/elif abajo las llama.

Momento 5 — metacognición · 10 min:
ConecTeo ve el Agent construir una casa donde había tierra y una fortaleza donde había piedra: cuando el código combina funciones y decisiones el Agent deja de ser un ejecutor y empieza a ser un agente autónomo. Por eso se llama Agent.
- ¿Qué pasaría si defines la función después de llamarla? ¿Python puede ejecutar código antes de que se defina la función?

Notas para el facilitador:
En Python las funciones tienen que estar definidas ANTES de ser llamadas. Si se definen después da error. Mostrar el error común y como corregirlo — es una lección útil sobre el orden de ejecución.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Combinar funciones y condicionales en Python
- https://www.youtube.com/watch?v=AWek49wXGkI
- Agent autónomo en Minecraft Education — proyectos avanzados
- https://www.youtube.com/watch?v=KNvsq8Xqz4g$t$, $t$ConecTeo quiere un Agent que elige que construir según el terreno: si el suelo es tierra construye una casa, si es piedra construye una fortaleza, si es arena construye una torre. Para eso combina las funciones de construcción con el inspect del Agent y una variable que guarda el tipo de terreno.$t$),
  ('58423600-bb93-4923-98ec-0f794b9aed73'::uuid, 4, $t$Mes 8 · Clase 4$t$, $t$Ciudad de octubre: proyecto integrador$t$, $t$Construcción del barrio en el mundo de Minecraft usando el código planificado. Mínimo: 3 funciones distintas, al menos 1 con parámetros, 1 variable que registre cuántos edificios se construyeron. Presentación: tour del barrio en el proyector con explicación del código de cada función.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectados Año 2 (9-10 años, segundo mes en Minecraft Education)
- Eje curricular: Minecraft Education — proyecto integrador: funciones + parámetros + inspect + variables

Objetivo de la clase:
- El alumno diseña y construye una ciudad o estructura compleja en Minecraft usando funciones con parámetros, inspect para decidir que construir y variables para registrar lo construido.

Escenario — la voz de ConecTeo:
ConecTeo inaugura la Ciudad de Octubre en Minecraft. Cada equipo es la empresa constructora: diseña su barrio de la ciudad usando funciones propias. Un barrio residencial, uno industrial, uno recreativo. Las funciones definen los edificios, los parámetros definen el tamaño, el inspect decide donde van.

Momento 1 — activación emocional · 10 min:
ConecTeo presenta el proyecto: cada equipo diseña un barrio con al menos 3 funciones de construcción distintas. El barrio tiene que ser coherente visualmente — no edificios al azar sino una lógica de distribución.

Momento 2 — exploración del concepto · 20 min:
El Plano del Barrio
- Cada equipo dibuja en papel el plano de su barrio: donde va cada tipo de edificio, que función lo construye y que parámetros usa. El facilitador revisa cada plano antes de que empiecen a codificar.

Momento 3 — formalización · 15 min:
Sin formalización nueva. El facilitador recuerda los elementos disponibles del mes: funciones sin y con parámetros, inspect + if/elif para ubicación inteligente, variables para registrar lo construido. Cada equipo confirma cuáles usa en su barrio.

Momento 4 — aplicación y transferencia · 35 min:
Construcción del barrio en el mundo de Minecraft usando el código planificado. Mínimo: 3 funciones distintas, al menos 1 con parámetros, 1 variable que registre cuántos edificios se construyeron. Presentación: tour del barrio en el proyector con explicación del código de cada función.

Piso bajo:

Techo alto:
- Barrio con 2 funciones de construcción y al menos 1 con parámetros funcionando.
- Barrio completo con 3+ funciones, parámetros variables, inspect para ubicación inteligente y variable de registro de edificios construidos. La ciudad tiene coherencia visual y lógica de distribución.

Momento 5 — metacognición · 10 min:
ConecTeo recorre la Ciudad de Octubre: cada barrio fue construido con código. Lo que antes tomaba horas de construcción manual ahora toma minutos. Las funciones no solo ahorran código — ahorran tiempo.
- ¿Qué aprendiste en octubre sobre funciones que no sabias en septiembre? ¿Cómo usarías funciones en un proyecto de programación fuera de Minecraft?

Notas para el facilitador:
El tour del barrio en el proyector es el momento más impactante — ver la ciudad construida por código impresiona a todos, incluyendo al facilitador. Sacar capturas de pantalla para el portafolio.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Ciudades construidas con código en Minecraft Education
- https://www.youtube.com/watch?v=KNvsq8Xqz4g
- Arquitectura procedural — arte generada por algoritmos
- https://www.youtube.com/watch?v=h5ahFp1WNTU$t$, $t$ConecTeo inaugura la Ciudad de Octubre en Minecraft. Cada equipo es la empresa constructora: diseña su barrio de la ciudad usando funciones propias. Un barrio residencial, uno industrial, uno recreativo. Las funciones definen los edificios, los parámetros definen el tamaño, el inspect decide donde van.$t$),
  ('c51c76c0-6097-4e5f-b816-d03abe80f2bf'::uuid, 1, $t$Mes 8 · Clase 1$t$, $t$El sensor de inclinación: ángulos y umbrales$t$, $t$Programar tres zonas de respuesta: Si inclinación leve (zona 1) -> Motor velocidad 3. Si inclinación moderada (zona 2) -> Motor velocidad 6. Si inclinación fuerte (zona 3) -> Motor velocidad 9. Usar la inclinación del Hub como control de velocidad proporcional. Probar con distintos ángulos y medir si el motor cambia de velocidad correctamente.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 2 (6-8 años)
- Eje curricular: WeDo 2.0 — sensor de inclinación: calibración de umbrales y precisión

Objetivo de la clase:
- El alumno calibra el sensor de inclinación para detectar ángulos específicos y programa umbrales de activación precisos para distintas reacciones.

Escenario — la voz de Conectito:
Conectito descubrió que el sensor de inclinación puede ser muy preciso si lo calibramos bien. No es solo adelante-atrás — tiene niveles. Un poco inclinado es distinto a muy inclinado. Hoy aprendemos a diferenciar esos niveles y a programar reacciones distintas para cada uno.

Momento 1 — activación emocional · 10 min:
Conectito muestra el monitor del sensor inclinando el Hub muy poco, moderadamente y mucho. Pregunta: ¿el sensor da el mismo valor en los tres casos? Los alumnos observan. ¿Se puede programar que reaccione diferente según cuánto se inclina?

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Angulometro Humano
- Los alumnos extienden un brazo. Poco inclinado = 15 grados (casi horizontal). Moderado = 45 grados. Mucho = 90 grados. El facilitador pregunta: si tuviera que activar un motor solo cuando el ángulo supera los 45 grados, ¿cómo lo programaría? Reflexión: eso es un umbral de activación.

Momento 3 — formalización · 15 min:
Concreto: usar el bloque Si Inclinación > umbral en la app WeDo 2.0.
- Pictórico: dibujar la escala de inclinación con tres zonas: baja (0-20), media (20-60), alta (60+).
- Simbólico: Conectito explica — un umbral es el valor mínimo necesario para que algo ocurra. Sin umbral el sensor reacciona a cualquier movimiento involuntario.

Momento 4 — aplicación y transferencia · 35 min:
Programar tres zonas de respuesta: Si inclinación leve (zona 1) -> Motor velocidad 3. Si inclinación moderada (zona 2) -> Motor velocidad 6. Si inclinación fuerte (zona 3) -> Motor velocidad 9. Usar la inclinación del Hub como control de velocidad proporcional. Probar con distintos ángulos y medir si el motor cambia de velocidad correctamente.

Piso bajo:

Techo alto:
- El motor tiene al menos 2 velocidades distintas según el nivel de inclinación.
- El motor tiene 3 velocidades proporcionales a la inclinación (leve-media-fuerte). El alumno puede controlar la velocidad inclinando el Hub como un acelerador analógico.

Momento 5 — metacognición · 10 min:
Conectito inclina el Hub suavemente y ve el motor ir lento; lo inclina más y el motor acelera. Aprendí que un sensor bien calibrado da mucho más control que uno sin calibrar.
- ¿Dónde más usarías un control por inclinación proporcional? ¿Una grúa, un vehículo, un juego?

Notas para el facilitador:
Los valores exactos de inclinación en WeDo 2.0 varian según el kit. Dejar que los alumnos encuentren sus propios umbrales midiendo con el monitor — ese proceso de calibración es en si mismo parte del aprendizaje.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Calibración de sensores — que es y para que sirve
- https://www.youtube.com/watch?v=bvKOkL4XICE
- Control proporcional en robótica — explicación
- https://www.youtube.com/watch?v=9gOfE9ch7Ug$t$, $t$Conectito descubrió que el sensor de inclinación puede ser muy preciso si lo calibramos bien. No es solo adelante-atrás — tiene niveles. Un poco inclinado es distinto a muy inclinado. Hoy aprendemos a diferenciar esos niveles y a programar reacciones distintas para cada uno.$t$),
  ('c51c76c0-6097-4e5f-b816-d03abe80f2bf'::uuid, 2, $t$Mes 8 · Clase 2$t$, $t$Dos sensores: movimiento e inclinación juntos$t$, $t$Programar: Repetir siempre { Si movimiento detectado: Si inclinación = adelante → Motor adelante rápido | Si inclinación = atrás → Motor atrás rápido | Si NO movimiento detectado: Motor a velocidad base (inclinación controla velocidad baja) }. Probar acercando la mano mientras inclinan el Hub.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 2 (6-8 años)
- Eje curricular: WeDo 2.0 — combinar sensor de movimiento y sensor de inclinación en un programa

Objetivo de la clase:
- El alumno programa un robot que usa dos sensores simultaneamente: el sensor de movimiento decide si hay algo cerca, y el sensor de inclinación controla la velocidad o dirección.

Escenario — la voz de Conectito:
Conectito tiene un nuevo desafío: un robot que usa dos sentidos al mismo tiempo. El sensor de movimiento es como la vista — detecta si algo se acerca. El sensor de inclinación es como el oido del equilibrio — detecta la posición del cuerpo. Juntos hacen al robot mucho más inteligente.

Momento 1 — activación emocional · 10 min:
Conectito muestra dos sensores conectados al Hub. Pregunta: ¿cómo creen que un programa puede usar dos sensores a la vez? ¿Se turnan? ¿Trabajan al mismo tiempo? Los alumnos debaten. El facilitador muestra el monitor de ambos sensores en simultáneo.

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Robot de Dos Sentidos
- Un alumno es el sensor de movimiento (mira al frente y grita STOP cuando alguien se acerca). Otro es el sensor de inclinación (sostiene un libro e indica ADELANTE o ATRÁS según lo inclinen). El motor humano (un tercer alumno) obedece a ambos al mismo tiempo. Si STOP + ADELANTE → que hace?

Momento 3 — formalización · 15 min:
Concreto: conectar sensor de movimiento al puerto 1 y sensor de inclinación al puerto 2.
- Pictórico: dibujar el diagrama de flujo con dos condiciones en paralelo.
- Simbólico: Conectito explica — cuando dos sensores actúan a la vez usamos condiciones anidadas: Si (sensor 1 activo) Y Si (sensor 2 = X) → acción.

Momento 4 — aplicación y transferencia · 35 min:
Programar: Repetir siempre { Si movimiento detectado: Si inclinación = adelante → Motor adelante rápido | Si inclinación = atrás → Motor atrás rápido | Si NO movimiento detectado: Motor a velocidad base (inclinación controla velocidad baja) }. Probar acercando la mano mientras inclinan el Hub.

Piso bajo:

Techo alto:
- El robot reacciona diferente cuando el sensor de movimiento esta activo vs cuando no lo esta.
- El robot usa ambos sensores juntos: el de movimiento decide el modo (rápido/lento) y el de inclinación decide la dirección. 4 comportamientos distintos posibles.

Momento 5 — metacognición · 10 min:
Conectito ve al robot obedecer dos sensores a la vez: combinar sensores es como combinar sentidos. Cada uno agrega información y juntos el robot puede tomar decisiones más complejas.
- ¿Qué dispositivo real usa más de un sensor a la vez? ¿Un teléfono? ¿Un auto? ¿Una alarma?

Notas para el facilitador:
El mayor desafío es que los alumnos entiendan la lógica anidada. Si tienen dificultad, empezar con solo un sensor funcionando y agregar el segundo después de que el primero este estable.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Múltiples sensores en robótica — como se combinan
- https://www.youtube.com/watch?v=v0TymwG5xgQ
- WeDo 2.0 — programar con dos sensores
- https://www.youtube.com/watch?v=bvKOkL4XICE$t$, $t$Conectito tiene un nuevo desafío: un robot que usa dos sentidos al mismo tiempo. El sensor de movimiento es como la vista — detecta si algo se acerca. El sensor de inclinación es como el oido del equilibrio — detecta la posición del cuerpo. Juntos hacen al robot mucho más inteligente.$t$),
  ('c51c76c0-6097-4e5f-b816-d03abe80f2bf'::uuid, 3, $t$Mes 8 · Clase 3$t$, $t$El mecanismo inteligente de Conectito$t$, $t$Usar una variable llamada ESTADO que empieza en REPOSO. Repetir siempre { Si ESTADO=REPOSO Y movimiento detectado → ESTADO=ACTIVO, Motor inicia. Si ESTADO=ACTIVO Y inclinación=plano → ESTADO=REPOSO, Motor para. Si ESTADO=ACTIVO → ejecutar comportamiento según inclinación }. Probar el ciclo completo.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 2 (6-8 años)
- Eje curricular: WeDo 2.0 — mecanismo con dos sensores y lógica de estados

Objetivo de la clase:
- El alumno construye un mecanismo que cambia entre dos modos (activo/reposo) según los sensores, comprendiendo el concepto de estado en programación.

Escenario — la voz de Conectito:
Conectito quiere un robot que tenga dos modos: modo reposo (espera sin gastar energía) y modo activo (trabaja cuando lo necesitan). El sensor de movimiento lo despierta del reposo. El sensor de inclinación controla lo que hace cuando esta activo. Es como un robot que tiene sueño.

Momento 1 — activación emocional · 10 min:
El facilitador actúa como un robot en reposo (quieto). Cuando alguien se acerca lo despierta. Al despertar, la inclinación del Hub decide que hace. Esto ilustra el concepto de estado. Pregunta: ¿conocen dispositivos que funcionen igual? (pantalla del teléfono, luces automáticas).

Momento 2 — exploración del concepto · 20 min:
Dinámica motriz: El Robot con Sueño
- Un alumno es el robot dormido (ojos cerrados, inmovil). Cuando alguien le toca el hombro (sensor de movimiento), se despierta. Luego alguien inclina un libro frente a el y el robot ejecuta la acción correspondiente. Cuando nadie se acerca, vuelve a dormirse. Rotar roles.

Momento 3 — formalización · 15 min:
Concreto: definir dos variables de estado: REPOSO y ACTIVO. El sensor de movimiento cambia el estado.
- Pictórico: dibujar el diagrama de estados con dos círculos y las transiciones entre ellos.
- Simbólico: Conectito explica — un estado es la condición actual del robot. Las transiciones son los eventos que lo cambian.

Momento 4 — aplicación y transferencia · 35 min:
Usar una variable llamada ESTADO que empieza en REPOSO. Repetir siempre { Si ESTADO=REPOSO Y movimiento detectado → ESTADO=ACTIVO, Motor inicia. Si ESTADO=ACTIVO Y inclinación=plano → ESTADO=REPOSO, Motor para. Si ESTADO=ACTIVO → ejecutar comportamiento según inclinación }. Probar el ciclo completo.

Piso bajo:

Techo alto:
- El robot cambia entre dos modos (reposo/activo) según el sensor de movimiento.
- El robot tiene lógica completa de estados: se activa con movimiento, ejecuta según inclinación, vuelve a reposo cuando queda plano. El ciclo funciona infinitamente sin intervención.

Momento 5 — metacognición · 10 min:
Conectito duerme y se despierta según quien se acerca: los estados hacen al robot más eficiente. Un robot que espera en modo reposo gasta menos energía y reacciona mejor cuando lo necesitan.
- ¿Cuántos estados distintos podría tener un robot más complejo? ¿Y un celular tiene estados?

Notas para el facilitador:
La variable de estado puede ser una variable numerica (0=reposo, 1=activo) o usar bloques condicionales anidados. La versión con variable es más escalable — si tienen tiempo mostrar ambas.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Máquinas de estado — introducción para no programadores
- https://www.youtube.com/watch?v=AWek49wXGkI
- Robots con modos de operación — como se implementan
- https://www.youtube.com/watch?v=s3CiYqOhB9w$t$, $t$Conectito quiere un robot que tenga dos modos: modo reposo (espera sin gastar energía) y modo activo (trabaja cuando lo necesitan). El sensor de movimiento lo despierta del reposo. El sensor de inclinación controla lo que hace cuando esta activo. Es como un robot que tiene sueño.$t$),
  ('c51c76c0-6097-4e5f-b816-d03abe80f2bf'::uuid, 4, $t$Mes 8 · Clase 4$t$, $t$Mi robot de octubre — Año 2$t$, $t$Construcción del proyecto integrador con mínimo 2 sensores y al menos 2 estados o comportamientos distintos. Tiempo de construcción: 20 min. Programación: 10 min. Prueba y ajuste: 5 min. Presentación con ficha técnica completa: 15 min.$t$, $t$Ficha técnica:
- Duración: 90 minutos
- Nivel: Conectaditos Año 2 (6-8 años)
- Eje curricular: WeDo 2.0 — proyecto integrador Año 2: dos sensores + lógica de estados

Objetivo de la clase:
- El alumno diseña y construye un robot de octubre que integra dos sensores con lógica de estados, presenta el funcionamiento y documenta la ficha técnica completa.

Escenario — la voz de Conectito:
El taller de octubre de Conectito cierra con el proyecto más ambicioso del mes: un robot con dos sensores y dos modos de operación. Cada ingeniero del Año 2 elige su propio desafío y lo presenta al grupo con la ficha técnica completa.

Momento 1 — activación emocional · 10 min:
Conectito presenta los conceptos del mes como herramientas disponibles: calibración de umbrales, dos sensores simultaneos, estados (reposo/activo). Cada equipo elige cuántas herramientas incorpora — mínimo 2.

Momento 2 — exploración del concepto · 20 min:
La Feria del Taller
- Cada equipo presenta el plano técnico de su robot en 60 seg: sensores usados, estados posibles, comportamientos. Los demás equipos hacen UNA pregunta técnica. El facilitador evalúa si el plan es realizable en el tiempo disponible.

Momento 3 — formalización · 15 min:
Sin formalización nueva. El facilitador recuerda las herramientas disponibles en el pizarrón: calibración de umbrales, dos sensores simultaneos, diagrama de estados. Cada equipo señala cuáles va a usar.

Momento 4 — aplicación y transferencia · 35 min:
Construcción del proyecto integrador con mínimo 2 sensores y al menos 2 estados o comportamientos distintos. Tiempo de construcción: 20 min. Programación: 10 min. Prueba y ajuste: 5 min. Presentación con ficha técnica completa: 15 min.

Piso bajo:

Techo alto:
- Robot con 2 sensores y 2 comportamientos distintos documentados en la ficha técnica.
- Robot con 2 sensores, lógica de estados completa (mínimo 3 transiciones) y calibración de umbrales demostrada.

Momento 5 — metacognición · 10 min:
Conectito cierra el taller de octubre: este mes pasamos de un sensor a dos, de una reacción a un sistema de estados. Cada semana el robot fue un poco más inteligente porque el programa fue un poco más sofisticado.
- ¿Qué diferencia hay entre el robot que hiciste en octubre y el que hiciste en septiembre? ¿Qué aprendiste sobre como piensan los robots?

Notas para el facilitador:
Pedir ficha técnica escrita en la bitácora antes de la presentación oral. La ficha es el registro de ingeniería — sin ella la presentación no esta completa.

Recursos y videos de referencia:
- Videos de referencia — proyectar al inicio del momento correspondiente:
- Proyectos de robótica educativa — exhibición
- https://www.youtube.com/watch?v=HpCWfV3TSRI
- Como documentar un proyecto de ingeniería
- https://www.youtube.com/watch?v=WijyEL4dOW4$t$, $t$El taller de octubre de Conectito cierra con el proyecto más ambicioso del mes: un robot con dos sensores y dos modos de operación. Cada ingeniero del Año 2 elige su propio desafío y lo presenta al grupo con la ficha técnica completa.$t$)
),
pendientes as (
  select n.* from nuevas n
  where not exists (
    select 1 from conecta_planificaciones p
    where p.grupo_id = n.grupo_id and p.ciclo_lectivo = 2026 and p.unidad = n.unidad and p.titulo = n.titulo
  )
),
base as (
  select g.grupo_id, coalesce(max(p.orden), -1) as max_orden
  from (select distinct grupo_id from pendientes) g
  left join conecta_planificaciones p on p.grupo_id = g.grupo_id and p.ciclo_lectivo = 2026
  group by g.grupo_id
)
insert into conecta_planificaciones
  (grupo_id, docente_id, ciclo_lectivo, orden, unidad, titulo, descripcion, guia_docente, guia_estudiante)
select n.grupo_id, '07c431a7-8a65-4625-900b-e3ebac00ace0'::uuid, 2026,
       b.max_orden + row_number() over (partition by n.grupo_id order by n.clase),
       n.unidad, n.titulo, n.descripcion, n.guia_docente, n.guia_estudiante
from pendientes n join base b using (grupo_id);

commit;

-- Verificación: debería dar 4 filas "Mes 8" por grupo (8 grupos).
select g.nombre, g.materia, count(*) filter (where p.unidad like '%Mes 8%') as mes8, count(*) as total, max(p.orden) as max_orden
from conecta_grupos g
join conecta_planificaciones p on p.grupo_id = g.id and p.ciclo_lectivo = 2026
where g.materia in ('Robótica', 'Programación') and g.nombre like 'Nivel%'
group by g.nombre, g.materia
order by g.materia, g.nombre;
