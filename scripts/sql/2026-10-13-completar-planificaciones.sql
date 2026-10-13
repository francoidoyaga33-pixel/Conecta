-- Completa huecos del módulo Académico detectados al comparar con el Drive "Académico Conecta".
-- Correr manualmente en el SQL Editor de Supabase. Es idempotente: se puede correr más de una vez.

-- 1) Mes 4 · Mundial para Nivel 2 Conectados (Robótica y Programación).
--    Se copian las 4 clases de cada materia ya cargadas en Nivel 1 Conectados (mismo material del Drive)
--    y se ubican después de Misión Artemis, corriendo el orden de los temas siguientes.
do $$
declare
  destino record;
  orden_mundial integer;
begin
  for destino in
    select * from (values
      ('c51c76c0-6097-4e5f-b816-d03abe80f2bf'::uuid, array[
        '16448561-7ec7-458e-ab7e-2d383d80098e', 'f737cc0a-c349-4330-9281-091511cb5601',
        '1cc5c0f6-014e-40e7-9f3d-3c6f745c8385', '6590f03b-ba7d-4f01-b4ae-c8c1c0a855a0']::uuid[]),
      ('58423600-bb93-4923-98ec-0f794b9aed73'::uuid, array[
        '3ea8f0ba-b41f-46fd-94db-8ec054ba6bc9', '813d14b6-62e2-4d4b-9bc5-eb6b0655d15b',
        '6a0c6321-54d1-44cd-8871-9353ff7836be', 'd5698aff-d08a-46fb-8066-1f1d854c437f']::uuid[])
    ) as t(grupo_id, origen_ids)
  loop
    if exists (
      select 1 from conecta_planificaciones
      where grupo_id = destino.grupo_id and ciclo_lectivo = 2026 and unidad like 'Mes 4 · Mundial%'
    ) then
      continue;
    end if;

    select orden + 1 into orden_mundial
    from conecta_planificaciones
    where grupo_id = destino.grupo_id and ciclo_lectivo = 2026 and unidad = 'Proyecto especial · Misión Artemis';

    if orden_mundial is null then
      raise exception 'No se encontró Misión Artemis en el grupo %', destino.grupo_id;
    end if;

    update conecta_planificaciones
    set orden = orden + 4
    where grupo_id = destino.grupo_id and ciclo_lectivo = 2026 and orden >= orden_mundial;

    insert into conecta_planificaciones
      (grupo_id, docente_id, ciclo_lectivo, orden, unidad, titulo, descripcion, guia_docente, guia_estudiante)
    select
      destino.grupo_id,
      p.docente_id,
      2026,
      orden_mundial + (o.n - 1)::int,
      replace(p.unidad, '2026 · ', ''),
      p.titulo,
      p.descripcion,
      p.guia_docente,
      p.guia_estudiante
    from conecta_planificaciones p
    join unnest(destino.origen_ids) with ordinality as o(id, n) on o.id = p.id;
  end loop;
end $$;

-- 2) Guías de Fábrica Digital Nivel 1 Conectaditos, semanas 2 a 4.
--    En el Drive no hay plan diario de estas clases; las guías se redactaron a partir de la actividad
--    e indicador de logro ya cargados, con la misma estructura que la semana 1.
update conecta_planificaciones set
  guia_docente = $g$1. Inicio (15 min) - ¿Cómo funciona una catapulta?
1. Mostrar una catapulta armada (o un video corto) y lanzar un pompón o bollito de papel.
2. Preguntas: ¿de dónde sale la fuerza que lanza el objeto?, ¿qué pasa si estiramos más la liga?
3. Presentar el reto: construir una catapulta con palitos de helado y ligas que lance un pompón lo más lejos y preciso posible.

2. Desarrollo (50 min) - Construcción y experimentación
Fase 1: Construcción (25 min):
- Apilar 5-7 palitos y atarlos con ligas en los extremos para hacer la base.
- Cruzar dos palitos unidos en una punta con una liga y encajar la base entre ellos (el brazo).
- Pegar una tapita en la punta del brazo como cuchara.
Fase 2: Pruebas (25 min):
- Desafío 1: lanzar un pompón y medir la distancia con cinta métrica.
- Desafío 2: cambiar la cantidad de palitos de la base o la tensión de la liga y comparar resultados.
- Desafío 3: acertar en un vaso ubicado a 1 metro.
Adaptaciones: trabajo en parejas para quienes tienen dificultades de motricidad; dejar una catapulta modelo a la vista como referencia.

3. Cierre (25 min) - Reflexión
1. Cada equipo muestra su mejor lanzamiento.
2. Preguntas: ¿qué cambio hizo que la catapulta lance más lejos?, ¿por qué?
3. Relacionar la tensión de la liga con la energía que se acumula y se libera.

Indicadores de logro:
- Construye una catapulta que funciona.
- Relaciona la tensión de la liga con la distancia del lanzamiento.

Materiales: palitos de helado, ligas, tapitas plásticas, cinta, pompones o bollitos de papel, cinta métrica, vasos.
Evaluación: observación del proceso de prueba y explicación de los cambios realizados.$g$,
  guia_estudiante = $g$Hoy vas a construir una catapulta con palitos de helado y ligas. Vas a probar cómo cambia el lanzamiento si estirás más la liga o cambiás la base, y vas a intentar embocar un pompón en un vaso.$g$,
  updated_at = now()
where id = 'fafc231b-ffee-453d-b6f4-b9056ed87a3a' and guia_docente is null;

update conecta_planificaciones set
  guia_docente = $g$1. Inicio (15 min) - ¿Cómo llega la luz a una lamparita?
1. Mostrar una linterna desarmada: pila, cable y foquito.
2. Preguntas: ¿qué necesita la lamparita para encenderse?, ¿qué pasa si se corta el camino?
3. Presentar el reto: armar un circuito con pila, papel aluminio y clips que encienda un LED con un interruptor casero.
Seguridad: usar solo pilas comunes (AA o de 3 V tipo botón), nunca enchufes.

2. Desarrollo (50 min) - Construcción del circuito
Fase 1: Circuito simple (20 min):
- Hacer tiras de papel aluminio doblado como cables.
- Unir la pila y el LED con las tiras y probar que encienda (si no prende, dar vuelta el LED).
Fase 2: Interruptor casero (30 min):
- Desafío 1: cortar el circuito y agregar un clip sobre una base de cartón que abra y cierre el paso.
- Desafío 2: encender y apagar el LED solo con el interruptor.
- Desafío 3: probar qué materiales dejan pasar la corriente (lápiz, goma, moneda, papel).
Adaptaciones: entregar las tiras de aluminio ya preparadas; dibujo del circuito paso a paso.

3. Cierre (25 min) - Reflexión
1. Cada equipo muestra su interruptor funcionando.
2. Preguntas: ¿por qué el LED se apaga cuando abrimos el clip?, ¿dónde hay interruptores en casa?
3. Introducir la idea de circuito abierto y circuito cerrado.

Indicadores de logro:
- Arma un circuito cerrado que enciende un LED.
- Explica la diferencia entre circuito abierto y cerrado.

Materiales: pilas, LEDs, papel aluminio, clips, cartón, cinta adhesiva, objetos para probar conductividad.
Evaluación: funcionamiento del circuito y explicación oral del recorrido de la corriente.$g$,
  guia_estudiante = $g$Hoy vas a hacer que un LED se prenda usando una pila, papel aluminio y clips. Después vas a construir tu propio interruptor para prenderlo y apagarlo, y descubrir qué materiales dejan pasar la electricidad.$g$,
  updated_at = now()
where id = 'a990e050-e227-4067-a082-ef730ce600fb' and guia_docente is null;

update conecta_planificaciones set
  guia_docente = $g$1. Inicio (15 min) - Un problema en el escritorio
1. Mostrar un escritorio desordenado (foto o real) y preguntar qué problema ven.
2. Mostrar ejemplos de organizadores hechos con cartón y botellas.
3. Presentar el reto: diseñar y construir un organizador de escritorio con materiales reciclados que tenga al menos dos compartimentos.

2. Desarrollo (50 min) - Diseño y construcción
Fase 1: Diseño (15 min):
- Cada equipo decide qué va a guardar (lápices, tijeras, gomas, hojas) y dibuja su organizador.
- Preguntas guía: ¿qué tamaño necesita cada compartimento?, ¿cómo hacemos que no se caiga?
Fase 2: Construcción (35 min):
- Cortar botellas plásticas y tubos de cartón a distintas alturas (el docente ayuda con los cortes).
- Pegarlos sobre una base de cartón firme.
- Desafío 1: que entren al menos 5 lápices y una tijera.
- Desafío 2: que no se vuelque al sacar los útiles.
- Desafío extra: decorarlo y agregarle un nombre.
Adaptaciones: piezas precortadas para quienes lo necesiten; trabajo en parejas.

3. Cierre (25 min) - Presentación
1. Cada equipo prueba su organizador con útiles reales delante de la clase.
2. Preguntas: ¿qué problema resuelve?, ¿qué materiales funcionaron mejor?, ¿qué mejorarían?

Indicadores de logro:
- Construye un objeto útil con materiales reciclados.
- Explica qué problema resuelve y cómo lo construyó.

Materiales: botellas plásticas, tubos de cartón, cajas, cartón grueso, tijeras, plasticola o pistola de silicona (uso del docente), cinta, elementos para decorar.
Evaluación: funcionalidad del organizador y explicación del diseño.$g$,
  guia_estudiante = $g$Hoy vas a inventar y construir un organizador para tu escritorio con botellas y cartón. Tiene que tener lugar para lápices y tijeras y no volcarse. Al final lo vas a probar delante de todos.$g$,
  updated_at = now()
where id = '66616a00-5983-49f7-bca3-8d7131d14a93' and guia_docente is null;
