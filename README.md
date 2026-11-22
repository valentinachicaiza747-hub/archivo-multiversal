
# Archivo Multiversal

Aplicación web en español para explorar personajes, episodios y ubicaciones de Rick and Morty. Consulta la API pública de la serie y muestra los resultados en una tabla que cambia sus columnas según el recurso seleccionado.

En **Personajes** se puede filtrar por estado y abrir una ficha con el retrato, el origen, la ubicación y enlaces a los episodios en los que aparece cada personaje. La acción **Eliminar** pide confirmación y retira la fila de la lista actual.

## Requisitos

- Node.js 22.12 o superior dentro de la rama 22, o Node.js 24.
- npm, incluido con Node.js.
- Conexión a internet para instalar las dependencias y consultar la API.

## Instalación y ejecución

Desde una terminal:

```bash
git clone https://github.com/valentinachicaiza747-hub/archivo-multiversal.git
cd archivo-multiversal
npm install
npx ng build ui-lib
npx ng serve demo-app
```

Abre **http://localhost:4200/**. Los comandos usan el Angular CLI instalado en el proyecto. En Windows, si PowerShell bloquea `npm.ps1` o `npx.ps1`, usa `npm.cmd` y `npx.cmd` en los mismos comandos.

La biblioteca debe compilarse antes de iniciar la aplicación. Si modificas sus componentes, puedes mantenerla compilada en otra terminal con `npx ng build ui-lib --watch`.

Para generar la compilación de producción, ejecuta `npx ng build ui-lib` y luego `npx ng build demo-app`. El resultado queda en `dist/demo-app`.

## Arquitectura

El workspace usa Angular 20, TypeScript en modo estricto y Tailwind CSS 3. Contiene dos proyectos:

| Ruta | Responsabilidad |
| --- | --- |
| `projects/demo-app/src/app` | Pantalla principal, filtros, columnas de la tabla y diálogos. |
| `projects/demo-app/src/app/explorer.service.ts` | Consulta HTTP, transformación de registros en filas y estado de la consulta. |
| `projects/demo-app/src/app/explorer.models.ts` | Tipos de personajes, episodios y ubicaciones. |
| `projects/ui-lib/src/lib` | Componentes reutilizables de botón, tarjeta, selector y tabla. |
| `projects/ui-lib/src/public-api.ts` | Exportaciones que la aplicación consume con `import … from 'ui-lib'`. |

Al seleccionar un recurso o cambiar el filtro, la aplicación llama a `ExplorerService`. El servicio consulta la API con `HttpClient` y publica las filas, el estado de carga y los errores mediante señales. La tabla recibe esos datos por entradas y emite la fila seleccionada cuando el usuario abre un detalle o solicita eliminarla.

## API de componentes

### Button · `ui-button`

| API | Tipo | Uso |
| --- | --- | --- |
| `label` | Entrada `string`, obligatoria | Texto visible. |
| `variant` | Entrada `'primary' \| 'secondary' \| 'danger'` | Estilo del botón. Por defecto, `primary`. |
| `size` | Entrada `'sm' \| 'md' \| 'lg'` | Tamaño. Por defecto, `md`. |
| `disabled`, `loading` | Entradas `boolean` | Estado deshabilitado o de carga. Ambas empiezan en `false`. |
| `clicked` | Salida `void` | Emite solo cuando `disabled` y `loading` son `false`. |

```html
<ui-button label="Eliminar" variant="danger" size="sm"
  [loading]="removing()" (clicked)="confirmRemoval()" />
```

### Card · `ui-card`

| API | Tipo | Uso |
| --- | --- | --- |
| `title` | Entrada `string`, obligatoria | Título del encabezado. |
| `subtitle` | Entrada `string \| null` | Subtítulo opcional. |
| `elevation` | Entrada `'flat' \| 'raised' \| 'outlined'` | Apariencia. Por defecto, `flat`. |
| `headerClicked` | Salida `void` | Notifica un clic en el encabezado. |
| Contenido | Proyección mediante `ng-content` | Renderiza el contenido que se coloca dentro de la tarjeta. |
```html
<ui-card title="Rick Sanchez" subtitle="Personaje" elevation="outlined">
  <p>Origen: Earth (C-137)</p>
</ui-card>
```

### Select · `ui-select`

| API | Tipo | Uso |
| --- | --- | --- |
| `label` | Entrada `string`, obligatoria | Etiqueta del selector. |
| `options` | Entrada `SelectOption[]` | Opciones con `label` y `value`, ambos de tipo `string`. |
| `placeholder` | Entrada `string` | Texto visible cuando el valor está vacío. |
| `allowClear` | Entrada `boolean` | Permite volver a una selección vacía. Por defecto, `true`. |
| `disabled`, `loading` | Entradas `boolean` | Estado deshabilitado o de carga. Ambas empiezan en `false`. |
| `value` | Modelo `string \| null` | Opción seleccionada. Admite `[(value)]` y emite `valueChange`. |
| `selectionChange` | Salida `SelectOption` | Emite la opción elegida. Al limpiar el selector, `valueChange` emite `null`. |
```html
<ui-select label="Recurso" [options]="resources" [(value)]="resource" />
```

### Table · `ui-table`

| API | Tipo | Uso |
| --- | --- | --- |
| `columns` | Entrada `TableColumn<T>[]`, obligatoria | Cada columna define `key`, una clave de la fila, y `header`, el encabezado visible. |
| `rows` | Entrada `T[]`, obligatoria | Filas que se muestran. |
| `loading` | Entrada `boolean` | Muestra el estado de carga. Por defecto, `false`. |
| `emptyMessage` | Entrada `string` | Mensaje cuando la consulta no devuelve filas. |
| `errorMessage` | Entrada `string \| null` | Mensaje de error, si existe. |
| `actionTriggered` | Salida `TableAction<T>` | Emite `{ action, row }`, con `action` igual a `view` o `delete`. |
```html
<ui-table [columns]="columns()" [rows]="rows()" [loading]="loading()"
  (actionTriggered)="handleAction($event)" />
```

## Decisiones de diseño

- **Una tabla para tres recursos.** La app adapta cada registro a una fila con nombre, resumen y el registro original. El resumen contiene la especie, la fecha de emisión o la dimensión según el recurso. La ficha usa el registro original para mostrar los detalles.
- **Componentes reutilizables.** Los cuatro componentes son independientes y usan `OnPush`, `input()`, `output()` o `model()` según corresponda. La aplicación decide qué datos mostrar y cómo responder a las acciones.
- **Consultas y estados de interfaz.** El filtro de estado se envía a la API solo para personajes. Al cambiar de recurso o filtro, el servicio cancela la consulta anterior. La tabla distingue entre carga, error y ausencia de resultados.
- **Detalle legible en pantallas pequeñas.** La ficha usa un diálogo con contenido desplazable. Muestra el origen y la ubicación por nombre, traduce etiquetas y valores comunes al español y agrupa los enlaces a episodios en una lista desplegable.
- **Eliminación local.** Tras confirmar la acción, la fila se retira de los resultados actuales. Una nueva consulta puede volver a mostrarla.
## Pruebas

El proyecto usa Jasmine y Karma. Las pruebas del botón verifican que `clicked` se emite al pulsarlo cuando está habilitado y se bloquea durante la carga o cuando el botón está deshabilitado. La demo verifica que la aplicación se crea y muestra el título «Archivo Multiversal» con una respuesta HTTP simulada.

Con Chrome instalado, ejecuta desde la raíz del proyecto:

```bash
npx ng build ui-lib
npx ng test ui-lib --watch=false --browsers=ChromeHeadless
npx ng test demo-app --watch=false --browsers=ChromeHeadless
```

## Documentación

- [Bitácora de desarrollo y uso de IA](DEVELOPMENT_LOG.md)
- [API pública de Rick and Morty](https://rickandmortyapi.com/documentation)
