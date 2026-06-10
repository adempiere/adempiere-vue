# Proceso

El componente de **Proceso** Muestra una vista minimalista la cual está conformada de múltiples parámetros con los cuales se utilizan para ejecutar el proceso actual. Este componente también cuenta con validaciones dinámicas y visualización de los campos.

## Interfaz

### Procesos en Versión de Escritorio ADempiere-ZK

<img :src="$withBase('/images/components/process/zk.png')" alt="Procesos en Versión de Escritorio ZK" width="600px">

### Procesos en Versión Escritorio ADempiere-Vue

Este conformado por un panel donde se encuentran [**Visualización de los campos**](#visualizacion-de-los-campos) y un [**Menú de Ejecución**](#menu-del-componente-proceso) ubicado en la parte superior alineado a la derecha

<img :src="$withBase('/images/components/process/vue.png')" alt="Procesos en Versión Escritorio" width="600px">

### Procesos en Versión Móvil ADempiere-Vue

Este conformado por un panel donde se encuentran [**Visualización de los campos**](#visualizacion-de-los-campos) y un [**Menú de Ejecución**](#menu-del-componente-proceso) ubicado en la parte superior alineado a la derecha

<img :src="$withBase('/images/components/process/vue-mobile.png')" alt="Procesos en Versión Móvil" width="600px">

## **Menú del Componente Proceso**

- **Ejecución:** Esta opción cuenta con todas las ejecuciones del proceso actual y se identifica con un fondo azul. Esta opción es tanto como de ejecución rápida como también una lista desplegable con el nombre del proceso y descripción. Por defecto la acción principal de la lista de ejecución siempre esta de primera

<img :src="$withBase('/images/components/process/menu-process.png')" alt="Menu de Procesos en Versión Escritorio" width="800px">

## Visualización de los campos

Para una vista más minimalista y sencilla los campos en el componente proceso aunque mantienen el mismo orden se encuentran ocultos por defectos al menos que el campo tenga un valor por defecto o sean obligatorio

<img :src="$withBase('/images/components/process/field.gif')" width="800px">

## ¿Cómo Funciona ?

### Versión de Escritorio

En la versión de escritorio debe llenar todos los campos obligatorio y dirigirse al menú para poder ejecutar el proceso

<img :src="$withBase('/images/components/process/run-process.gif')" />

### Versión móvil

En la versión de móvil debe llenar todos los campos obligatorio y dirigirse al menú para poder ejecutar el proceso

<img :src="$withBase('/images/components/process/run-process-mobile.gif')"  width="800px"/>

## Opciones para el Desarrollador

### Ubicación de Archivos

Ventana de [**Proceso**](#proceso) se encuentra en la siguiente ruta:

```bash
    └─ src                              # Código fuente principal
        └──views            			# Vistas globales
              └───ADempiere             # Vistas específicos de ADempiere
                    └── Process     	# Contenedor del Proceso
```

Aquí puede ver el archivo [**Process**](https://github.com/solop-develop/frontend-core/blob/experimental/src/views/ADempiere/Process/index.vue)

Lógicas de la ventana de [**Proceso**](#proceso) se encuentra en la siguiente ruta:

```bash
    └─ src                                   # Código fuente principal
        └──views              			     # Vistas globales
                └─ADempiere                  # Vistas específicos de ADempiere
                    └── Process         	 # Contenedor del Visor de Proceso
                      └── mixinProcess.js    # Contenedor de las Logicas de Reporte
```

Aquí puede ver el archivo [**mixinProcess.js**](https://github.com/solop-develop/frontend-core/blob/experimental/src/api/ADempiere/mixinProcess.js)
