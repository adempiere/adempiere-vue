# Consulta Inteligente (Smart Browser)

El componente de **Consulta Inteligente (Smart Browser)** Muestra una vista minimalista la cual está conformada por múltiples campos de criterio de búsqueda con los cuales se utilizan para la consulta de registros.
La tabla de resultados cuenta con selecciones para ejecución del proceso actual.

## Interfaz

### Versión Escritorio ADempiere-ZK

<img :src="$withBase('/images/components/smart-browser/desktop-zk.png')" alt="Reportes en Versión de Escritorio ZK" width="100%">

### Versión Escritorio ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/desktop-ui.png')" alt="Reportes en Versión de Escritorio ZK" width="100%">

### Versión Móvil ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/mobile-ui.png')" alt="Reportes en Versión Móvil" width="100%">

## **Menú del Componente Acciones**

Dicho componente también cuenta con un menú ubicado en la parte superior alineado a la derecha. El cual está conformada por 3 opciones: Ejecución, Relaciones y Referencias.

- **Ejecución:** Esta opción cuenta con todas las ejecuciones del **Consulta Inteligente (Smart Browser)** actual y se identifica con un fondo azul. Es tanto como de ejecución rápida del proceso como también está conformada por lista desplegable con las diferentes opciones.
  :::tip
- Exportar Registros Seleccionados
- Eliminar
- Refrescar Registros
- Acercar Ventana
- Compartir Enlace
  :::
  <br>

### Vista del Menú en Versión Escritorio ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/run-action-ui.gif')" alt="Menú del Componente Reporte - Ejecución" width="100%">

### Vista del Menú en Versión Móvil ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/run-action-ui-mobile.gif')" alt="Menú de Reportes en Versión Escritorio" width="100%">

## Visualización de los campos

Para una mejor vista el componente **Consulta Inteligente (Smart Browser)** aunque mantienen el mismo orden se encuentran ocultos por defectos. Al menos que el campo tenga un valor por defecto o sean obligatorio

### Vista en Versión Escritorio ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/fields-vue.gif')" width="100%">

### Vista en Versión Móvil ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/fields-mobile-vue.gif')" width="100%">

## Ejecución

Para ejecutar un proceso asociado a un **Consulta Inteligente (Smart Browser)** primero se debe seleccionar un registro luego dirigirse a la parte superior a la izquierda en el menú de acciones. seleccione el proceso llene los parámetros obligatorios y ejecute el proceso asociado

### Vista en Versión Escritorio ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/run-desktop-vue.gif')" width="100%">

### Vista en Versión Móvil ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/run-mobile-vue.gif')" width="100%">

## Exportar Registros Seleccionados

Esta opción se encuentra en el [menú de acciones](#menú-del-componente-acciones) en la opción de Ejecución

### Vista en Versión Escritorio ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/export-browser-desktop.gif')" width="100%">

### Vista en Versión Móvil ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/export-browser.gif')" width="100%">

## Acercar Ventana

Esta opción se encuentra en el [menú de acciones](#menú-del-componente-acciones) en la opción de Ejecución

### Vista en Versión Escritorio ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/zoom-browser-desktop.gif')" width="100%">

### Vista en Versión Móvil ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/zoom-browser-mobile.gif')" width="100%">

## Opciones para el Desarrollador

El panel del `Browser` se encuentra en la siguiente ruta:

```bash
    └─ src                              # Código fuente principal
        └──views            			# Vistas globales
              └───ADempiere             # Vistas específicos de ADempiere
                    └── Browser 			# Contenedor del Browser
```

El llamado al consumo de las aplicacin de `Browser` se encuentra en la siguiente ruta:

```bash
    └──────api                          # Código fuente principal
			└─ADempiere                 # Vistas específicos de ADempiere
					└── Browser   	    # Contenedor del Visor de Browser
```

[GET /api/user-interface/smart-browser/browser-items](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#get-api-user-interface-smart-browser-browser-items)
