# Reports

The "Report" component displays a minimalistic view which is made up of multiple parameters which are used to run the actual report. This component also has dynamic validations and visualization of the fields.

#

## Reports in Desktop Version ADempiere-ZK

<img :src="$withBase('/images/components/reports/report-zk.png')" alt="ZK Desktop Version Reports" width="100%">

## Reports in ADempiere-Vue Desktop Version

<img :src="$withBase('/images/components/reports/report-vue.png')" alt="Reports in ZK Desktop Version" width="100%">

## Reports in ADempiere-Vue Mobile Version

<img :src="$withBase('/images/components/reports/mobile-vue.png')" alt="Reports in Mobile Version" width="100%">

This component also has a menu located on the upper right-hand side. It is made up of 3 options: Execution, Relations and References.

**Reporting Component Menu** \*\*Execution

- Execution:\*\* This option has all the executions of the current Report and is identified with a blue background. It is both a quick run of the report as well as a drop down list of the different report options.
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

### Menu View in ADempiere-Vue Desktop Version

<img :src="$withBase('/images/components/reports/menu-desktop.png')" alt="Reports Menu in Desktop Version" width="100%">

### Menu View in ADempiere-Vue Mobile Version

<img :src="$withBase('/images/components/reports/menu-mobile.png')" alt="Reports Menu in Desktop Version" width="100%">

## Field display

For a more minimalist and simple view the fields in the Report component although they keep the same order are hidden by default. Unless the field has a default value or is mandatory, the fields are hidden by default.

### Menu view in ADempiere-Vue Desktop Version

<img :src="$withBase('/images/components/reports/fields-desktop-vue.gif')" width="100%">

### Menu View in Mobile Version ADempiere-Vue

<img :src="$withBase('/images/components/reports/fields-Mobile-vue.gif')" width="100%">

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

## How to use it in the Desktop version?

In the desktop version you must fill in all the required fields and go to the menu to be able to run the Report

<img :src="$withBase('/images/components/reports/report-desktop.gif')" />

## How to use it in the mobile version?

In the desktop version you must fill in all the required fields and go to the menu in order to run the Report

<img :src="$withBase('/images/components/reports/report-mobile.gif')" width="100%"/>

## Open Report from Execution History

### Open Report from Execution History

Added a quick and easy way to open report with the same parameters executed from Run History

<img :src="$withBase('/images/components/reports/re-open-report.gif')" width="100%"/>

### Open the Report Viewer from the Run History

Added a quick and easy way to reopen the report view with the same parameters executed from the Run History

<img :src="$withBase('/images/components/reports/re-open-viwer.gif')" width="100%"/>

## Developer Options

The `Report` panel is located in the following path:

```bash
    └─ src # Main source code.
        └──views # Global views.
              └────ADempiere # ADempiere specific views.
                    └└── Report # Report container.
```

The `Report Viewer` pane is located in the following path:

```bash
    └─ src # Main source code.
        └──views # Global views.
                └─ADempiere # ADempiere-specific views
                    └─── ReportViewer # Report Viewer container.
```

The `Report` application consumption call is located in the following path:

```bash
    └──────api # Main source code.
			└─ADempiere # ADempiere specific views
					└└── report # Report Viewer container.
```

[GET /api/user-interface/process/report-output](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#get-api-user-interface-process-report-output)

[GET /api/user-interface/process/drill-tables](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#get-api-user-interface-process-drill-tables)

[GET /api/user-interface/process/report-views](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#get-api-user-interface-process-report-views)

[GET /api/user-interface/process/print-formats](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#get-api-user-interface-process-print-formats)
