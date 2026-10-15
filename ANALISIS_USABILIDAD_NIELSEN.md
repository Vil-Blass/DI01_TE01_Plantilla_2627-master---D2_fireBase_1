# Análisis de usabilidad según los criterios de Jakob Nielsen

**Aplicación analizada:** Guía de Restaurantes Euskadi  
**Fecha:** 9 de octubre de 2026

## Introducción

Este documento analiza la usabilidad de la aplicación «Guía de Restaurantes Euskadi» a partir de los diez heurísticos de Jakob Nielsen. La evaluación se basa en la interfaz y el comportamiento implementado en la pantalla principal y en la ficha de cada restaurante. No sustituye una prueba de usabilidad con usuarios reales.

## 1. Visibilidad del estado del sistema

**Valoración: cumple parcialmente.**

Al iniciar, la pantalla indica que hay que pulsar «Cargar datos». Después, muestra una confirmación temporal y un contador con los restaurantes visibles respecto al total. También informa cuando los filtros no encuentran coincidencias.

**Mejoras propuestas:** indicar de forma persistente que los datos están cargados y mostrar qué filtros están activos. Como la carga es inmediata desde un archivo local, no parece necesario añadir una animación de espera.

## 2. Correspondencia entre el sistema y el mundo real

**Valoración: cumple.**

La interfaz está en español y presenta conceptos reconocibles para buscar restaurantes: nombre, localidad, territorio, dirección, teléfono, estrellas Michelin y soles Repsol. La ficha de detalle mantiene esos datos y ofrece un botón para volver.

**Mejoras propuestas:** convertir el teléfono y la web en enlaces accionables y ofrecer una acción para abrir la dirección en un mapa. También convendría comprobar con usuarios si «territorio» es el término más claro para todos.

## 3. Control y libertad del usuario

**Valoración: cumple parcialmente.**

Se puede modificar la búsqueda y los selectores, y la ficha permite volver a la lista. Si no hay resultados, aparece la opción «Limpiar filtros». Sin embargo, esta opción solo se muestra en ese caso, aunque el usuario puede querer empezar de nuevo antes. Además, al cambiar de territorio pueden eliminarse localidades seleccionadas que ya no correspondan, sin explicitarlo.

**Mejoras propuestas:** mostrar «Limpiar filtros» siempre que haya algún filtro activo y avisar cuando un cambio de territorio quite selecciones incompatibles.

## 4. Consistencia y estándares

**Valoración: cumple parcialmente.**

Se usan componentes Ionic y los filtros tienen una estructura visual similar. No obstante, se presentan una tabla y tarjetas con los mismos restaurantes, duplicando información. Cuando hay datos, el campo de búsqueda muestra la etiqueta «Cargar datos de los restaurantes», que no describe la búsqueda. Además, el título de la pestaña del navegador sigue siendo «Ionic App», aunque la interfaz se identifica como una guía de restaurantes.

**Mejoras propuestas:** unificar etiquetas y nombres, actualizar el título del navegador y utilizar una sola presentación según el dispositivo: tabla en pantallas amplias y tarjetas en móviles.

## 5. Prevención de errores

**Valoración: cumple parcialmente.**

Los filtros se deshabilitan antes de cargar los datos y las localidades disponibles dependen del territorio elegido. Esto evita selecciones inválidas. En cambio, la búsqueda acepta cualquier texto y puede dejar la lista vacía.

**Mejoras propuestas:** conservar la búsqueda libre, pero facilitar la recuperación con una acción visible para borrar el texto y restablecer los filtros. Si el usuario llega a una ficha sin restaurante disponible, convendría ofrecer una salida clara a la lista.

## 6. Reconocimiento antes que recuerdo

**Valoración: cumple parcialmente.**

Los nombres de los campos y las opciones disponibles se muestran en pantalla; el contador ayuda a entender el resultado de los filtros y el estado inicial explica cómo empezar.

**Mejoras propuestas:** usar una etiqueta inequívoca en la búsqueda, por ejemplo, «Buscar por nombre», y mostrar un resumen visible de los filtros seleccionados. Así el usuario no tendrá que recordar qué opciones aplicó, especialmente si hay varias localidades.

## 7. Flexibilidad y eficiencia de uso

**Valoración: cumple parcialmente.**

La búsqueda por nombre puede combinarse con filtros por territorio y varias localidades, lo que permite acotar la lista de distintas maneras.

**Mejoras propuestas:** facilitar acciones frecuentes con un borrado rápido de la búsqueda y el restablecimiento general de filtros. Si el volumen de restaurantes lo justifica, se podrían añadir ordenación y una alternativa de visualización más cómoda en móvil; la tabla tiene muchas columnas y requiere desplazamiento horizontal.

## 8. Diseño estético y minimalista

**Valoración: cumple parcialmente.**

La interfaz separa filtros, resultados y detalles, y utiliza estilos diferenciados para la tabla y la ficha. Sin embargo, la tabla y las tarjetas muestran los mismos restaurantes simultáneamente, y cada tarjeta repite numerosos campos. Esto alarga la pantalla y puede distraer de la tarea principal: encontrar y abrir un restaurante.

**Mejoras propuestas:** eliminar la duplicación, priorizar en la lista el nombre y la localidad, y dejar el resto de la información para la ficha de detalle.

## 9. Ayudar a reconocer, diagnosticar y recuperarse de errores

**Valoración: cumple parcialmente.**

Cuando los filtros no producen resultados, la interfaz explica que ningún restaurante coincide y ofrece limpiar los filtros. Si no se encuentra un restaurante para mostrar en el detalle, aparece «No hay restaurante seleccionado», que informa del problema, pero no explica qué hacer.

**Mejoras propuestas:** sustituir el mensaje genérico por una explicación más concreta y un botón para volver a la lista. En el estado sin resultados, mantener la opción de limpiar los filtros y hacerla accesible siempre que haya filtros activos.

## 10. Ayuda y documentación

**Valoración: no cumple suficientemente.**

La pantalla inicial incluye una instrucción breve para cargar los datos, pero no hay una ayuda que explique cómo funcionan la búsqueda, los filtros combinados o la selección de varias localidades. Para una interfaz sencilla no hace falta un manual extenso, pero la indicación aislada puede no bastar para orientar a todos los usuarios.

**Mejoras propuestas:** añadir una breve ayuda integrada, por ejemplo, una línea junto a los filtros que indique que la búsqueda se combina con territorio y localidad, y mantener etiquetas claras.

## Conclusión

La aplicación cubre bien el flujo básico de cargar, filtrar y consultar restaurantes. Las mejoras prioritarias son:

1. Corregir la etiqueta del campo de búsqueda.
2. Evitar que la tabla y las tarjetas dupliquen los resultados.
3. Hacer que «Limpiar filtros» esté disponible siempre que haya filtros activos.
4. Explicar mejor los estados vacíos y ofrecer una salida clara desde una ficha sin datos.
5. Mostrar de forma reconocible los filtros activos y actualizar el título de la pestaña del navegador.
