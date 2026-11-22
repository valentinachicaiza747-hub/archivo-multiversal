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

| Prompt que usé | Qué acepté y por qué | Qué cambié o descarté |
| --- | --- | --- |
| «hagamosla de cero paso a paso te parece?» | Seguí la guía para crear el workspace y probar cada componente por separado. | Construí el proyecto en mi equipo partiendo de un workspace nuevo. |
| «no le podemos cambiar la parte que q si no se le pone nada usara ver detalle?» | Usé `input.required<string>()` para que la app indique el texto de cada botón. | Quité «Ver detalle» como texto predeterminado del componente. |
| «podemos poner el negro asulado en el recuadro nombre especie y acciones ?» | Usé el mismo tono oscuro en el encabezado y en los títulos de la tabla. | Elegí el fondo espacial y mi sticker para el encabezado. Probé varios tamaños y conservé el que me gustó más. |

## Verificación

Comprobé que la app consulta los tres recursos, filtra personajes por estado
y abre el detalle de una fila. También probé la confirmación de eliminación:
Cancelar conserva la fila y Eliminar la quita de la tabla actual.