# Bitácora de desarrollo

## Cómo construí el proyecto

Creé un workspace de Angular con dos proyectos: `ui-lib` y `demo-app`.
Construí y probé los componentes uno por uno: botón, tarjeta, selector y tabla.
Después conecté la aplicación a la API de Rick and Morty mediante un servicio
que guarda el recurso, el filtro, las filas y los estados de carga y error.

## Retos y soluciones

- PowerShell bloqueaba `npm.ps1`. Usé `npm.cmd` y `npx.cmd` para ejecutar los
  comandos del proyecto.
- La app mostró un error al intentar importar `ui-lib` mientras la librería
  se estaba compilando. Detuve el servidor, compilé la librería y volví a iniciar
  la app después de ver `Built ui-lib`.
- El filtro de estado quedó disponible para personajes porque ese recurso
  admite el parámetro `status`. Al cambiar de recurso, el filtro vuelve a Todos.
- El sticker no cargaba porque el archivo se llamaba `rick-morty.png.png`.
  Revisé el nombre completo en PowerShell y corregí la extensión duplicada.

## Uso de IA

Usé ChatGPT como guía paso a paso. Me ayudó a entender comandos, escribir
fragmentos de Angular y revisar errores. Apliqué los cambios en mi computadora
y comprobé el resultado en el navegador.

| Prompt textual | Qué acepté y por qué | Qué cambié o descarté |
| --- | --- | --- |
| «podemos hacer que cuando abra el ver detalle se mire asi?» | Agregué un retrato circular para que el personaje se reconozca al abrir la ficha. | Conservé los campos del registro debajo de la imagen para mostrar la información completa. |
| «aqui no deverian salir todos los episodios donde sale el personaje?» | Agregué una lista desplegable con enlaces a los episodios. | La primera propuesta de ChatGPT mostraba solo el total de episodios. Lo reemplacé por una lista que permite abrir cada episodio. |
| «lo que aparece en detalle lo podemos cambiar al idioma español?» | Traduje las etiquetas y valores comunes como el estado, la especie y el género. | Conservé los nombres propios de personajes y ubicaciones. |
| «este tambien lo podemos pasar al español?» | Traduje los nombres de las especies en la tabla de personajes. | Apliqué la traducción al texto de la tabla y conservé el valor original en el registro. |


## Verificación

Comprobé que la app consulta los tres recursos, filtra personajes por estado
y abre el detalle de una fila. También probé la confirmación de eliminación:
Cancelar conserva la fila y Eliminar la quita de la tabla actual.

## Mejoras en el detalle de personajes y traducción

- Agregué la imagen del personaje a su ficha de detalle.
- Simplifiqué la presentación del origen y la ubicación para mostrar sus nombres.
- Agregué una lista desplegable con enlaces a los episodios del personaje.
- Traduje las etiquetas de la ficha y los nombres de las especies en la tabla.
