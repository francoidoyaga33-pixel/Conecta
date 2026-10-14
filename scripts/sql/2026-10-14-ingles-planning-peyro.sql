-- Clases de Inglés del planning 2026 de Araceli Peyró (Flyers y 4th Year).
-- Fuente: "ARACELI PEYRO planning 2026.docx" (compartido por la coordinación de Inglés).
-- Se agregan como temas fechados al final de cada curso, sin tocar las unidades ya cargadas.
-- Correr manualmente en el SQL Editor de Supabase. Es idempotente: se puede correr más de una vez.

insert into conecta_planificaciones
  (grupo_id, docente_id, ciclo_lectivo, orden, unidad, titulo, descripcion, fecha_estimada, guia_docente, guia_estudiante)
select 'f617e27f-8554-4680-acb6-6ef93a3be26c', (select docente_id from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' order by orden limit 1), 2026,
  (select coalesce(max(orden), -1) + 1 from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026),
  $t$Clase 09/03$t$, $t$All about me: presentación personal$t$, $t$Semana 1 de consolidación grupal: presentarse y conocer a los compañeros.$t$, '2026-03-09', $t$Warm-up (5–10 min):
Icebreaker en ronda: se pasa una pelota con música; cuando se corta, quien la tiene dice su nombre, edad y algo que le gusta.

Practice (15–20 min):
Hoja de trabajo "All About Me": nombre, edad, color y comida favoritos, hobbies y otros datos personales.

Production (10–15 min):
En parejas se entrevistan con preguntas simples dadas por la docente; después cada uno presenta a su compañero/a a la clase con oraciones cortas en inglés.

Closing (5–10 min):
Reflexión: cada estudiante dice una palabra o frase corta sobre lo que le gustó o aprendió.$t$, $t$Hoy nos presentamos: vas a decir tu nombre, tu edad y algo que te gusta, completar tu ficha "All About Me" y presentar a un compañero en inglés.$t$
where not exists (
  select 1 from conecta_planificaciones
  where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026 and fecha_estimada = '2026-03-09' and unidad = $t$Clase 09/03$t$
);

insert into conecta_planificaciones
  (grupo_id, docente_id, ciclo_lectivo, orden, unidad, titulo, descripcion, fecha_estimada, guia_docente, guia_estudiante)
select 'f617e27f-8554-4680-acb6-6ef93a3be26c', (select docente_id from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' order by orden limit 1), 2026,
  (select coalesce(max(orden), -1) + 1 from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026),
  $t$Clase 11/03$t$, $t$Classroom language$t$, $t$Expresiones útiles para comunicarse en la clase de inglés.$t$, '2026-03-11', $t$Warm-up (5–10 min):
Preguntar qué expresiones en inglés conocen para usar en clase y anotar sus ideas en el pizarrón.

Presentation (10–15 min):
Presentar con pizarrón o flashcards: "Can you repeat, please?", "I don't understand", "How do you say ___ in English?", "Can I go to the bathroom?", "Can you help me?". Explicar el significado, modelar la pronunciación y repetir en voz alta.

Practice (15–20 min):
Hoja de trabajo.

Production (10–15 min):
Role-play en parejas: uno hace de docente y otro de estudiante, usando las expresiones en diálogos breves. Algunas parejas lo muestran a la clase.

Closing (5–10 min):
Exit ticket: cada estudiante escribe una expresión aprendida y su significado y lo entrega al salir.$t$, $t$Hoy aprendés frases para pedir ayuda, permiso o que te repitan algo en inglés, y las vas a usar actuando una situación de clase con un compañero.$t$
where not exists (
  select 1 from conecta_planificaciones
  where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026 and fecha_estimada = '2026-03-11' and unidad = $t$Clase 11/03$t$
);

insert into conecta_planificaciones
  (grupo_id, docente_id, ciclo_lectivo, orden, unidad, titulo, descripcion, fecha_estimada, guia_docente, guia_estudiante)
select 'f617e27f-8554-4680-acb6-6ef93a3be26c', (select docente_id from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' order by orden limit 1), 2026,
  (select coalesce(max(orden), -1) + 1 from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026),
  $t$Clase 18/03$t$, $t$Days of the week y números ordinales$t$, $t$Vocabulario de los días de la semana y uso de números ordinales en fechas.$t$, '2026-03-18', $t$Warm-up (5–10 min):
Repaso oral de las normas de convivencia del aula.

Presentation (10–15 min):
Canción de los días de la semana: https://www.youtube.com/watch?v=8GKmCQOy88Y. Luego video "Ordinal Numbers" de Jack Hartmann y explicación del uso de los ordinales en el pizarrón.

Practice (15–20 min):
Cantar y bailar con la canción (https://www.youtube.com/watch?v=3afEr61KNDk) y completar hojas de trabajo.

Production (10–15 min):
Escribir fechas usando ordinales y días de la semana. Ejemplo: Christmas is on Friday 25th.

Closing (5–10 min):
Juegos online: https://wordwall.net/es/resource/3545879/days-of-the-week y https://wordwall.net/es/resource/13449661/days-of-the-week$t$, $t$Hoy aprendés los días de la semana con una canción y los números ordinales (first, second, third…) para escribir fechas como "Christmas is on Friday 25th".$t$
where not exists (
  select 1 from conecta_planificaciones
  where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026 and fecha_estimada = '2026-03-18' and unidad = $t$Clase 18/03$t$
);

insert into conecta_planificaciones
  (grupo_id, docente_id, ciclo_lectivo, orden, unidad, titulo, descripcion, fecha_estimada, guia_docente, guia_estudiante)
select 'f617e27f-8554-4680-acb6-6ef93a3be26c', (select docente_id from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' order by orden limit 1), 2026,
  (select coalesce(max(orden), -1) + 1 from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026),
  $t$Clase 25/03$t$, $t$Numbers 1 to 100$t$, $t$Decenas y formación de números hasta el 100.$t$, '2026-03-25', $t$Warm-up (5–10 min):
En ronda se pasan una pelota y cada uno dice el número siguiente de la secuencia en inglés.

Presentation (10–15 min):
Escribir thirty, forty, fifty… one hundred; pronunciar y repetir en grupo e individualmente. Remarcar la escritura de "forty" y las terminaciones. Explicar cómo se forman los números compuestos (thirty-two, forty-five, seventy-eight) con ejemplos en el pizarrón.

Practice (15–20 min):
Ruleta online de dictado de números (https://wordwall.net/es/resource/73939162/ingl%C3%A9s/dictation-numbers-1-100). Después suman y pintan la imagen según el resultado y el color correspondiente.

Closing (5–10 min):
Contar juntos de 100 hacia atrás de diez en diez y preguntas de control: "What number comes after sixty?", "What number comes before ninety?".$t$, $t$Hoy aprendés a contar hasta 100 en inglés: las decenas y cómo se arman números como forty-five. Vas a jugar con una ruleta y pintar según los resultados.$t$
where not exists (
  select 1 from conecta_planificaciones
  where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026 and fecha_estimada = '2026-03-25' and unidad = $t$Clase 25/03$t$
);

insert into conecta_planificaciones
  (grupo_id, docente_id, ciclo_lectivo, orden, unidad, titulo, descripcion, fecha_estimada, guia_docente, guia_estudiante)
select 'f617e27f-8554-4680-acb6-6ef93a3be26c', (select docente_id from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' order by orden limit 1), 2026,
  (select coalesce(max(orden), -1) + 1 from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026),
  $t$Clase 30/03$t$, $t$My family$t$, $t$Vocabulario de la familia (libro: SB y WB página 4).$t$, '2026-03-30', $t$Warm-up (5–10 min):
Mostrar fotos de familias y preguntar "Who is she/he?", modelando respuestas como "She is the mother", "He is the brother".

Revision (10–15 min):
Repaso del vocabulario de la familia con una presentación de Canva; los estudiantes repiten cada palabra.

Practice (15–20 min):
SB pág. 4: mirar el árbol genealógico, leer la presentación y completar con el nombre correcto. WB pág. 4: encontrar y marcar las palabras de familia en rojo y los números en azul.

Production (10–15 min):
WB pág. 4: escribir oraciones sobre las fotos de la familia de Max y Holly. Después dibujar su propia familia y escribir oraciones similares.

Closing (5–10 min):
Describir oralmente sus dibujos.$t$, $t$Hoy aprendés a nombrar a los miembros de la familia en inglés. Vas a dibujar a tu familia y contar quién es quién.$t$
where not exists (
  select 1 from conecta_planificaciones
  where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026 and fecha_estimada = '2026-03-30' and unidad = $t$Clase 30/03$t$
);

insert into conecta_planificaciones
  (grupo_id, docente_id, ciclo_lectivo, orden, unidad, titulo, descripcion, fecha_estimada, guia_docente, guia_estudiante)
select 'f617e27f-8554-4680-acb6-6ef93a3be26c', (select docente_id from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' order by orden limit 1), 2026,
  (select coalesce(max(orden), -1) + 1 from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026),
  $t$Clase 15/04$t$, $t$Verb to be: countries$t$, $t$Verbo to be (am / is / are), preguntas y respuestas cortas con países (WB pág. 13).$t$, '2026-04-15', $t$Warm-up (5–10 min):
Repasar países con imágenes o banderas; los estudiantes los reconocen y responden preguntas simples.

Presentation (10–15 min):
Modelar oraciones como "I am from Argentina" y escribir ejemplos con distintos sujetos (I, you, he, she) remarcando am, is, are. Explicar preguntas como "Is she from Argentina?" y las respuestas cortas "Yes, she is" / "No, she isn't".

Practice (15–20 min):
Completar oraciones con la forma correcta de to be en el pizarrón. WB pág. 13, ejercicio 1.

Production (10–15 min):
WB pág. 13, ejercicios 2 y 3.$t$, $t$Hoy aprendés a decir de dónde es cada persona con el verbo to be: "I am from Argentina", "Is she from Brazil? Yes, she is".$t$
where not exists (
  select 1 from conecta_planificaciones
  where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026 and fecha_estimada = '2026-04-15' and unidad = $t$Clase 15/04$t$
);

insert into conecta_planificaciones
  (grupo_id, docente_id, ciclo_lectivo, orden, unidad, titulo, descripcion, fecha_estimada, guia_docente, guia_estudiante)
select 'f617e27f-8554-4680-acb6-6ef93a3be26c', (select docente_id from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' order by orden limit 1), 2026,
  (select coalesce(max(orden), -1) + 1 from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026),
  $t$Clase 03/06$t$, $t$Comparative adjectives: animals$t$, $t$Adjetivos comparativos (-er than / more … than) usando animales.$t$, '2026-06-03', $t$Warm-up (5–10 min):
Mostrar imágenes de animales y preguntar "How is the lion?" para que digan adjetivos (big, small, fast, slow, tall, strong, dangerous). Anotar la lista en el pizarrón. Presentación: https://www.canva.com/design/DAHLhqleBSI/a8Ax7eZ1mu2uvaOgxEDDWA/edit

Revision (10–15 min):
Repasar la estructura de los comparativos con el vocabulario del warm-up: "The lion is bigger than the cat", "The cheetah is faster than the turtle". Remarcar adjetivo + -er + than y more + adjetivo + than; cuándo se usan adjetivos cortos y largos.

Practice (15–20 min):
En grupos, con tarjetas de animales: elegir dos y armar una oración comparativa ("The elephant is bigger than the dog").

Production (10–15 min):
Escribir en la carpeta oraciones comparando animales.$t$, $t$Hoy vas a comparar animales en inglés: "The elephant is bigger than the dog", "The snake is more dangerous than the cat".$t$
where not exists (
  select 1 from conecta_planificaciones
  where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026 and fecha_estimada = '2026-06-03' and unidad = $t$Clase 03/06$t$
);

insert into conecta_planificaciones
  (grupo_id, docente_id, ciclo_lectivo, orden, unidad, titulo, descripcion, fecha_estimada, guia_docente, guia_estudiante)
select 'f617e27f-8554-4680-acb6-6ef93a3be26c', (select docente_id from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' order by orden limit 1), 2026,
  (select coalesce(max(orden), -1) + 1 from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026),
  $t$Clase 08/06$t$, $t$Countries and nationalities: World Cup$t$, $t$Países y nacionalidades con jugadores del Mundial 2026.$t$, '2026-06-08', $t$Warm-up (5–10 min):
Escuchar la canción de Argentina para el Mundial 2026 e identificar y nombrar a los jugadores argentinos.

Practice (15–20 min):
Mirar la imagen, identificar a los jugadores y escribir correctamente sus países y nacionalidades.

Production (10–15 min):
Cada estudiante elige un jugador en secreto y escribe 2 o 3 oraciones para describirlo ("He is from Brazil. He is Brazilian."). Las leen y el resto adivina quién es.

Closing (5–10 min):
Escribir una oración sobre su jugador favorito: "My favourite player is Messi. He is from Argentina. He is Argentinian."$t$, $t$Hoy jugamos con el Mundial: vas a decir de qué país y nacionalidad es cada jugador y hacer adivinar a la clase quién es tu jugador secreto.$t$
where not exists (
  select 1 from conecta_planificaciones
  where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026 and fecha_estimada = '2026-06-08' and unidad = $t$Clase 08/06$t$
);

insert into conecta_planificaciones
  (grupo_id, docente_id, ciclo_lectivo, orden, unidad, titulo, descripcion, fecha_estimada, guia_docente, guia_estudiante)
select 'f617e27f-8554-4680-acb6-6ef93a3be26c', (select docente_id from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' order by orden limit 1), 2026,
  (select coalesce(max(orden), -1) + 1 from conecta_planificaciones where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026),
  $t$Clase 31/08$t$, $t$Animal body parts: has got$t$, $t$Partes del cuerpo de los animales y la estructura has got.$t$, '2026-08-31', $t$Warm-up (5–10 min):
Mostrar imágenes de animales y pedir que los nombren; preguntar "What colour is it?", "Is it big or small?".

Presentation (10–15 min):
Presentar el vocabulario de partes del cuerpo de los animales con una presentación de Canva: https://www.canva.com/design/DAHT5JsJkOI/WucIK3XL7-lxLKRsBtH6IA/edit

Practice (15–20 min):
Sopa de letras con el vocabulario. Luego la docente señala cada parte del animal y los estudiantes la nombran en voz alta.

Production (10–15 min):
Elegir un animal, dibujarlo y describirlo con "has got" y adjetivos vistos. Ejemplo: Cat: It has got a small head and a long tail.

Closing (5–10 min):
Señalar cada parte de su animal y describirla oralmente.$t$, $t$Hoy aprendés las partes del cuerpo de los animales. Vas a dibujar tu animal favorito y describirlo: "It has got a long tail".$t$
where not exists (
  select 1 from conecta_planificaciones
  where grupo_id = 'f617e27f-8554-4680-acb6-6ef93a3be26c' and ciclo_lectivo = 2026 and fecha_estimada = '2026-08-31' and unidad = $t$Clase 31/08$t$
);

insert into conecta_planificaciones
  (grupo_id, docente_id, ciclo_lectivo, orden, unidad, titulo, descripcion, fecha_estimada, guia_docente, guia_estudiante)
select 'f78a01e4-5837-43bc-ae1c-f3a8007a688c', (select docente_id from conecta_planificaciones where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' order by orden limit 1), 2026,
  (select coalesce(max(orden), -1) + 1 from conecta_planificaciones where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' and ciclo_lectivo = 2026),
  $t$Clase 10/03$t$, $t$Daily routine: present simple$t$, $t$Repaso de presente simple y vocabulario de rutina diaria.$t$, '2026-03-10', $t$Warm-up (5–10 min):
Ruleta online con preguntas personales (What is your favorite food?, What do you like to do in your free time?, What music do you like?); cada estudiante gira y responde.

Revision (10–15 min):
Repaso del presente simple y del vocabulario de rutina en el pizarrón, con preguntas para activar conocimientos previos.

Practice (15–20 min):
Leer textos sobre las rutinas de distintas personas y completar un cuadro con las actividades y horarios. Luego leer el texto sobre la rutina de Johny, que tiene 20 errores de conjugación: encontrarlos, marcarlos y corregirlos (-s, -es, -ies). Corrección grupal.

Production (10–15 min):
Escribir un texto corto sobre su propia rutina en presente simple, con actividades y horarios.

Closing (5–10 min):
Lectura en voz alta de las producciones.$t$, $t$Hoy repasamos el presente simple: vas a corregir los errores en la rutina de Johny y escribir un texto sobre tu propia rutina diaria.$t$
where not exists (
  select 1 from conecta_planificaciones
  where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' and ciclo_lectivo = 2026 and fecha_estimada = '2026-03-10' and unidad = $t$Clase 10/03$t$
);

insert into conecta_planificaciones
  (grupo_id, docente_id, ciclo_lectivo, orden, unidad, titulo, descripcion, fecha_estimada, guia_docente, guia_estudiante)
select 'f78a01e4-5837-43bc-ae1c-f3a8007a688c', (select docente_id from conecta_planificaciones where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' order by orden limit 1), 2026,
  (select coalesce(max(orden), -1) + 1 from conecta_planificaciones where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' and ciclo_lectivo = 2026),
  $t$Clase 17/03$t$, $t$Telling the time$t$, $t$Decir la hora en inglés (o'clock, half past, quarter past, quarter to).$t$, '2026-03-17', $t$Warm-up (5–10 min):
Repaso del vocabulario de rutina con juegos online: https://wordwall.net/es/resource/17400809/daily-routines y https://wordwall.net/es/resource/28088726/esl/daily-routines-chores

Revision (10–15 min):
Dibujar un reloj en el pizarrón y repasar o'clock, half past, quarter past, quarter to, etc.

Practice (15–20 min):
En parejas: de una caja sacan papeles con expresiones de hora y los ubican en el reloj analógico del pizarrón; gana la pareja más rápida. Después, hoja de trabajo para pasar horas digitales a relojes analógicos dibujando las agujas.

Production (10–15 min):
La docente escribe horas digitales y los estudiantes las escriben en palabras (4:40 → It's twenty to five).

Closing (5–10 min):
Juego online: https://wordwall.net/es/resource/37518428/ingl%C3%A9s/telling-the-time$t$, $t$Hoy aprendés a decir la hora en inglés: o'clock, half past, quarter past y quarter to. Vas a competir en parejas armando el reloj del pizarrón.$t$
where not exists (
  select 1 from conecta_planificaciones
  where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' and ciclo_lectivo = 2026 and fecha_estimada = '2026-03-17' and unidad = $t$Clase 17/03$t$
);

insert into conecta_planificaciones
  (grupo_id, docente_id, ciclo_lectivo, orden, unidad, titulo, descripcion, fecha_estimada, guia_docente, guia_estudiante)
select 'f78a01e4-5837-43bc-ae1c-f3a8007a688c', (select docente_id from conecta_planificaciones where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' order by orden limit 1), 2026,
  (select coalesce(max(orden), -1) + 1 from conecta_planificaciones where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' and ciclo_lectivo = 2026),
  $t$Clase 31/03$t$, $t$Present simple vs present continuous$t$, $t$Diferencias de forma y uso entre presente simple y continuo (SB págs. 4–5).$t$, '2026-03-31', $t$Warm-up (5–10 min):
Preguntar en qué se diferencian. Escribir "I play football every weekend" y "I am playing football now"; discutir en parejas y guiar a que el presente simple es para rutinas y el continuo para acciones en el momento.

Revision (10–15 min):
Comparar en el pizarrón la estructura de ambos tiempos y las expresiones de tiempo asociadas (always, usually, every day / now, at the moment, right now). Los estudiantes dan ejemplos.

Practice (15–20 min):
SB págs. 4–5: leer los diálogos, identificar las oraciones subrayadas y responder el ejercicio 3a; verdadero o falso en el ejercicio c; ejercicio b: completar el email con la forma correcta de los verbos.

Production (10–15 min):
SB pág. 5, ejercicio 4b: lista de seis ideas para que un estudiante nuevo se sienta bienvenido en la escuela.

Closing (5–10 min):
Kahoot: https://create.kahoot.it/details/present-simple-and-present-continuous/2f2e0202-f0d2-4aee-bf38-c09590815a3d$t$, $t$Hoy comparamos dos tiempos verbales: lo que hacés siempre ("I play football every weekend") y lo que estás haciendo ahora ("I am playing football now").$t$
where not exists (
  select 1 from conecta_planificaciones
  where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' and ciclo_lectivo = 2026 and fecha_estimada = '2026-03-31' and unidad = $t$Clase 31/03$t$
);

insert into conecta_planificaciones
  (grupo_id, docente_id, ciclo_lectivo, orden, unidad, titulo, descripcion, fecha_estimada, guia_docente, guia_estudiante)
select 'f78a01e4-5837-43bc-ae1c-f3a8007a688c', (select docente_id from conecta_planificaciones where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' order by orden limit 1), 2026,
  (select coalesce(max(orden), -1) + 1 from conecta_planificaciones where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' and ciclo_lectivo = 2026),
  $t$Clase 20/04$t$, $t$Verb to be: countries$t$, $t$Verbo to be con países (WB pág. 13). En el planning original esta clase es idéntica a la de Flyers del 15/04: revisar si corresponde a 4th Year.$t$, '2026-04-20', $t$Warm-up (5–10 min):
Repasar países con imágenes o banderas; los estudiantes los reconocen y responden preguntas simples.

Presentation (10–15 min):
Modelar oraciones como "I am from Argentina" con distintos sujetos (I, you, he, she) remarcando am, is, are. Explicar preguntas como "Is she from Argentina?" y las respuestas cortas "Yes, she is" / "No, she isn't".

Practice (15–20 min):
Completar oraciones con la forma correcta de to be en el pizarrón. WB pág. 13, ejercicio 1.

Production (10–15 min):
WB pág. 13, ejercicios 2 y 3.$t$, $t$Hoy repasamos el verbo to be para decir de dónde es cada persona.$t$
where not exists (
  select 1 from conecta_planificaciones
  where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' and ciclo_lectivo = 2026 and fecha_estimada = '2026-04-20' and unidad = $t$Clase 20/04$t$
);

insert into conecta_planificaciones
  (grupo_id, docente_id, ciclo_lectivo, orden, unidad, titulo, descripcion, fecha_estimada, guia_docente, guia_estudiante)
select 'f78a01e4-5837-43bc-ae1c-f3a8007a688c', (select docente_id from conecta_planificaciones where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' order by orden limit 1), 2026,
  (select coalesce(max(orden), -1) + 1 from conecta_planificaciones where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' and ciclo_lectivo = 2026),
  $t$Clase 04/05$t$, $t$Jobs and professions$t$, $t$Vocabulario de profesiones (a partir del 1° de mayo, Día del Trabajador).$t$, '2026-05-04', $t$Warm-up (5–10 min):
Preguntar qué se celebra el 1° de mayo y por qué es feriado.

Presentation (10–15 min):
Presentar profesiones con flashcards o imágenes (teacher, doctor, police officer, firefighter, pilot, dentist). Modelar "He is a doctor", "She is a teacher" y repetir.

Practice (15–20 min):
Comprensión lectora: leer descripciones cortas de trabajadores (qué hacen y dónde trabajan, p. ej. "This person helps sick people. He works in a hospital.") e identificar la profesión.

Production (10–15 min):
Dibujar el trabajo que les gustaría tener y escribir una descripción con la misma estructura. Algunos lo presentan oralmente.

Closing (5–10 min):
Quiz online: https://wordwall.net/es/resource/6367776/jobs-quiz$t$, $t$Hoy aprendés nombres de profesiones en inglés. Vas a dibujar el trabajo que te gustaría tener y describirlo: qué hace y dónde trabaja.$t$
where not exists (
  select 1 from conecta_planificaciones
  where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' and ciclo_lectivo = 2026 and fecha_estimada = '2026-05-04' and unidad = $t$Clase 04/05$t$
);

insert into conecta_planificaciones
  (grupo_id, docente_id, ciclo_lectivo, orden, unidad, titulo, descripcion, fecha_estimada, guia_docente, guia_estudiante)
select 'f78a01e4-5837-43bc-ae1c-f3a8007a688c', (select docente_id from conecta_planificaciones where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' order by orden limit 1), 2026,
  (select coalesce(max(orden), -1) + 1 from conecta_planificaciones where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' and ciclo_lectivo = 2026),
  $t$Clase 05/05$t$, $t$Conjunctions: reason, time, contrast and result$t$, $t$Conectores because, when, while, until, but, although y so (SB pág. 12).$t$, '2026-05-05', $t$Warm-up (5–10 min):
Completar en parejas oraciones incompletas del pizarrón: "I stayed at home because…", "I was watching TV when…", "I like pizza but…", "It was raining so…".

Presentation (10–15 min):
Escribir oraciones con conectores de causa, tiempo, contraste y resultado (because, when, while, until, but, although, so). Analizar la función de cada uno con preguntas de control y organizarlos en un cuadro que copian en la carpeta.

Practice (15–20 min):
SB pág. 12: completar el artículo con sustantivos y unirlos con su definición; ejercicios 4a, 4b y 5a. WB: ejercicios 3 y 4.

Production (10–15 min):
Escribir un párrafo sobre su rutina o una experiencia pasada usando al menos un conector de cada tipo. Algunos lo leen en voz alta.$t$, $t$Hoy aprendés a unir ideas con conectores como because, when, but, although y so, y los vas a usar en un párrafo sobre tu rutina o algo que te pasó.$t$
where not exists (
  select 1 from conecta_planificaciones
  where grupo_id = 'f78a01e4-5837-43bc-ae1c-f3a8007a688c' and ciclo_lectivo = 2026 and fecha_estimada = '2026-05-05' and unidad = $t$Clase 05/05$t$
);

