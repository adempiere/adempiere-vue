# Reportes

El componente de "Reporte", Muestra una vista minimalista la cual está conformada por múltiples parámetros con los cuales se utilizan para ejecutar el reporte actual. Este componente también cuenta con validaciones dinámicas y visualización de los campos.

#

## Reportes en Versión de Escritorio ADempiere-ZK

<img :src="$withBase('/images/components/reports/report-zk.png')" alt="Reportes en Versión de Escritorio ZK" width="100%">

## Reportes en Versión Escritorio ADempiere-Vue

<img :src="$withBase('/images/components/reports/report-vue.png')" alt="Reportes en Versión de Escritorio ZK" width="100%">

## Reportes en Versión Móvil ADempiere-Vue

<img :src="$withBase('/images/components/reports/mobile-vue.png')" alt="Reportes en Versión Móvil" width="100%">

Dicho componente también cuenta con un menú ubicado en la parte superior alineado a la derecha. El cual está conformada por 3 opciones: Ejecución, Relaciones y Referencias.

## **Menú del Componente Reporte**

- **Ejecución:** Esta opción cuenta con todas las ejecuciones del Reporte actual y se identifica con un fondo azul. Es tanto como de ejecución rápida del reporte como también está conformada por lista desplegable con las diferentes opciones del reporte.
  :::tip
- Generar el reporte en un tipo de extensión en específico
- Cambiar Parámetros del Reporte
- Tipo de Formato de Impresión
- Vista de Reportes
- Compartir Enlace
  :::
  <br>
  <img :src="$withBase('/images/components/reports/run-report-desktop.gif')" alt="Menú del Componente Reporte - Ejecución" width="100%">

  - **Relaciones:** Esta opción cuenta con todas las Ventanas, Reportes, Smart Browser y Reporte que estén relacionada con el Reporte actual. En caso de tener relaciones esta opción cuenta con una lista desplegable el cual al seleccionar una opción redirigirá a la opción seleccionada y esta opción se identifica con un fondo verde.
    <img :src="$withBase('/images/components/reports/relations-report-desktop.gif')" width="100%">
    <br>
  - **Referencia:** Esta opción se encuentra deshabilitada para los Reportes ya que no es relevante para su funcionamiento y esta opción se identifica con un fondo anaranjado.
    <img :src="$withBase('/images/components/reports/referens-report-desktop.gif')" width="100%">

### Vista del Menú en Versión Escritorio ADempiere-Vue

<img :src="$withBase('/images/components/reports/menu-desktop.png')" alt="Menú de Reportes en Versión Escritorio" width="100%">

### Vista del Menú en Versión Móvil ADempiere-Vue

<img :src="$withBase('/images/components/reports/menu-mobile.png')" alt="Menú de Reportes en Versión Escritorio" width="100%">

## Visualización de los campos

Para una vista más minimalista y sencilla los campos en el componente Reporte aunque mantienen el mismo orden se encuentran ocultos por defectos. Al menos que el campo tenga un valor por defecto o sean obligatorio

### Vista del Menú en Versión Escritorio ADempiere-Vue

<img :src="$withBase('/images/components/reports/fields-desktop-vue.gif')" width="100%">

### Vista del Menú en Versión Móvil ADempiere-Vue

<img :src="$withBase('/images/components/reports/fields-Móvil-vue.gif')" width="100%">

## Ejecución

Al ejecutar un `Reporte` se cierra la vista y el reporte queda ejecutándose en segundo plano. Esto le permite al usuario realizar otra acción o tarea dentro del sistema sin interrupción. Al terminar la ejecución del reporte se envía una notificación al usuario informando el resultado. También redirige al usuario a la pestaña con el visor del reporte

### Ejecución Rápida

:::tip <b>Notas:</b>
Cuando usa la opción de `Ejecución Rápida` por defecto siempre generará el reporte con la extensión de `HTML`
:::
<img :src="$withBase('/images/components/reports/run-fast-report.gif')" width="100%">

### Ejecución Eligiendo la Extensión

:::tip <b>Notas:</b>
Actualmente está soportado para la visualización del reporte las siguientes extensiones

- `xml` - Archivo XML
- `pdf` - Archivo PDF de Acrobat
- `html` - Archivo HTML
- `txt` - Archivo delimitado por tabulaciones"
- `ssv` - Archivo de valores separados por punto y coma
- `csv` - Archivo de valores separados por comas de Excel
- `xls` - Archivo de Excel
- `xlsx` - Archivo XLSX
  <br>
  Los formatos de `ps` y `arxml` no están soportados. Al ejecutarse en estos formatos los descargara automáticamente
  :::

<img :src="$withBase('/images/components/reports/pdf-run-report.gif')" width="100%">

### Ejecución Eligiendo Formato de Impresión

<img :src="$withBase('/images/components/reports/run-format-report.gif')" width="100%">

### Ejecución Eligiendo la Vista de Reporte

<img :src="$withBase('/images/components/reports/run-viwer-report.gif')" width="100%">

## Visor de Reporte

En esta vista es a donde se visualiza el reporte después de ejecutarse

<img :src="$withBase('/images/components/reports/report-viwer.png')" width="100%">
:::tip <b>Notas:</b>

Esta cuenta también con el `Menú de Acciones` que cuenta con las misma funcionalidad del la pestaa de reportes la única diferencia es que en el `Visor de Reporte` esta habilitado la opción de `Cambiar Parámetros`
:::

### Cambiar Parámetros

Esta opción permite generar un nuevo reporte con diferentes parámetros de forma dinámica sin que tener que salir de la pestaña de `Visor de Reporte`

<img :src="$withBase('/images/components/reports/change-params-report.gif')" width="100%">

### Opción de Descargar

Esta opción permite descargar el documento de una forma rápida.

<img :src="$withBase('/images/components/reports/download-report.png')" width="100%">
:::tip <b>Notas:</b>
También permite descargar el documento en una extensión distinta a la visualizada 
:::

<img :src="$withBase('/images/components/reports/download-report.gif')" width="100%">

## ¿Cómo se utiliza en la versión de Escritorio?

En la versión de escritorio debe llenar todos los campos obligatorio y dirigirse al menú para poder ejecutar el Reporte

<img :src="$withBase('/images/components/reports/report-desktop.gif')" />

## ¿Cómo se utiliza en la versión móvil?

En la versión de escritorio debe llenar todos los campos obligatorio y dirigirse al menú para poder ejecutar el Reporte

<img :src="$withBase('/images/components/reports/report-mobile.gif')"  width="100%"/>

## Abrir Reporte desde el Histórico de Ejecución

### Abrir el Reporte desde el Histórico de Ejecución

Se agrego una forma rápida y sencilla para abrir reporte con los mismo parámetros ejecutados desde el Histórico de Ejecución

<img :src="$withBase('/images/components/reports/re-open-report.gif')"  width="100%"/>

### Abrir el Visor de Reporte desde el Histórico de Ejecución

Se agrego una forma rápida y sencilla de volver a ver la vista del reporte con los mismo parámetros ejecutados desde el Histórico de Ejecución

<img :src="$withBase('/images/components/reports/re-open-viwer.gif')"  width="100%"/>

## Opciones para el Desarrollador

El panel del `Reporte` se encuentra en la siguiente ruta:

```bash
    └─ src                              # Código fuente principal
        └──views            			# Vistas globales
              └───ADempiere             # Vistas específicos de ADempiere
                    └── Report 			# Contenedor del Reporte
```

El panel del `Visor de Reporte` se encuentra en la siguiente ruta:

```bash
    └─ src                              # Código fuente principal
        └──views              			# Vistas globales
                └─ADempiere             # Vistas específicos de ADempiere
                    └── ReportViewer   	# Contenedor del Visor de Reporte
```

El llamado al consumo de las aplicacin de `Reporte` se encuentra en la siguiente ruta:

```bash
    └──────api                          # Código fuente principal
			└─ADempiere                 # Vistas específicos de ADempiere
					└── report   	    # Contenedor del Visor de Reporte
```

[GET /api/user-interface/process/report-output](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#get-api-user-interface-process-report-output)

[GET /api/user-interface/process/drill-tables](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#get-api-user-interface-process-drill-tables)

[GET /api/user-interface/process/report-views](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#get-api-user-interface-process-report-views)

[GET /api/user-interface/process/print-formats](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#get-api-user-interface-process-print-formats)
