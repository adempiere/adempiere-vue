# Consulta Inteligente (Smart Browser)

## Apertura

### Árbol de Menú

Abrir un reporte desde el árbol de menú:

1. Desplegar el árbol de menú en **Gestión del Sistema/Reglas Generales/Seguridad**.
2. Seleccionar el Consulta Inteligente **(Smart Browser)** > **Consulta de Usuarios/Contactos**.

#### Versión Escritorio ZK:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-menu-destok-zk.gif')" width="100%">

#### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-menu-destok-ui.gif')" width="100%">

#### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-menu-mobile-ui.gif')" width="100%">

### Buscador del Menú

Abrir un reporte desde el buscador del menú:

2. En el buscador de la parte superior escribir **Consulta de Usuarios/Contactos**.
3. Seleccionar el Consulta Inteligente **(Smart Browser)** coincidente con el resultado.

#### Versión Escritorio ZK:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-search-menu-destok-zk.gif')" width="100%">

#### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-search-menu-destok-ui.gif')" width="100%">

#### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-search-menu-mobile-ui.gif')" width="100%">

### Ítems Recientes

Abrir un Consulta Inteligente **(Smart Browser)** de ítems recientes:

1. Ubicar el tablero **Ítems Recientes**.
2. Seleccionar cualquier Consulta Inteligente **(Smart Browser)** o en caso de usar la búsqueda rápida de la tabla de ítems recientes seleccionar el Consulta Inteligente **(Smart Browser)** coincidente con el resultado.

##### Versión Escritorio ZK:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-recien-item-mobile-ui.gif')" width="100%">

##### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-recien-item-destok-ui.gif')" width="100%">

#### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-recien-item-mobile-ui.gif')" width="100%">

### Issues

[**Consulta Inteligente: Apertura > Árbol de Menú #112**](https://github.com/solop-develop/frontend-core/issues/112) <br>
[**Consulta Inteligente: Apertura > Elementos Recientes #114**](https://github.com/solop-develop/frontend-core/issues/114) <br>
[**Consulta Inteligente: Apertura > Asociado a Proceso de Ventana #116**](https://github.com/solop-develop/frontend-core/issues/116) <br>
[**Consulta Inteligente: Apertura > Asociado a Campo tipo Botón #117**](https://github.com/solop-develop/frontend-core/issues/117)

## Carga

### Parámetros

Los parámetros (campos) de los **Consulta Inteligente (Smart Browser)** Se utiliza para realizar la búsqueda de registro. Solo se mostrara los campos con valor por defecto, o con obligatoriedad.

1. Abrir el **Consulta Inteligente (Smart Browser)** **Procesar Órdenes en Lote**.
2. Nota el parámetro **Estado del Documento**

#### Versión Escritorio ZK:

<img :src="$withBase('/images/use-cases/smartbrowser/load/params-zk.png')" width="100%">

#### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/load/mandatory-vue.gif')" width="100%">

#### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/load/params-mobile-ui.gif')" width="100%">

### Visualización

Al cargar todos los parámetros con valor por defecto, o con obligatoriedad se visualizan en la primera carga.

#### Versión Escritorio ZK:

Actualmente en la interfaz del Zk al abrir un **Consulta Inteligente (Smart Browser)** en este caso **Procesar Órdenes en Lote** carga todos los campos en la vista
<img :src="$withBase('/images/use-cases/smartbrowser/load/mandatory-zk.gif')" width="100%">

#### Versión Escritorio Vue:

En la interfaz de ADempiere-Vue abrir un **Consulta Inteligente (Smart Browser)** en este caso **Procesar Órdenes en Lote** solo muestra los campos con valor por defecto, o con obligatoriedad.

<img :src="$withBase('/images/use-cases/smartbrowser/load/mandatory-vue.gif')" width="100%">

#### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/load/params-mobile-ui.gif')" width="100%">

### Obligatoriedad

##### Versión ZK:

1. Abrir el reporte **Procesar Órdenes en Lote**.
2. Los campos obligatorios muestran con un asterisco (\*rojo al lado derecho de su nombre.
   <img :src="$withBase('/images/use-cases/smartbrowser/load/display-zk.png')" width="100%">

##### Versión Vue:

1. Abrir el reporte **Procesar Órdenes en Lote**.
2. Los campos obligatorios muestran con un asterisco (\*rojo al lado derecho de su nombre, y aquellos obligatorios vacíos resaltan con un borde rojo sobre el campo).
   <img :src="$withBase('/images/use-cases/smartbrowser/load/mandatory-vue.gif')" width="100%">

#### Versión Móvil Vue:

1. Abrir el reporte **Procesar Órdenes en Lote**.
2. Los campos obligatorios muestran con un asterisco (\*rojo al lado derecho de su nombre, y aquellos obligatorios vacíos resaltan con un borde rojo sobre el campo).
   <img :src="$withBase('/images/use-cases/smartbrowser/load/params-mobile-ui.gif')" width="100%">

### Registro

Es una tabla donde se encuentran los registros dependiendo de los parámetros que se encuentre en el [**Criterio de Búsqueda**](#criterio-de-búsqueda)

#### Versión Escritorio ZK:

Actualmente en la interfaz del Zk al abrir un **Consulta Inteligente (Smart Browser)** en este caso **Procesar Órdenes en Lote** no se logra observar la tabla con registro de una forma dinámica
<img :src="$withBase('/images/use-cases/smartbrowser/load/search-record-zk.gif')" width="100%">

#### Versión Escritorio Vue:

En la interfaz de ADempiere-Vue abrir un **Consulta Inteligente (Smart Browser)** en este caso **Procesar Órdenes en Lote** la tabla con los registro se encuentra abajo el cual agrega un parámetro en el [**Criterio de Búsqueda**](#criterio-de-búsqueda) podrá observar cómo se filtran los registro de la tabla
<img :src="$withBase('/images/use-cases/smartbrowser/load/search-record-ui.gif')" width="100%">

#### Versión Móvil Vue:

En la interfaz de ADempiere-Vue abrir un **Consulta Inteligente (Smart Browser)** en este caso **Procesar Órdenes en Lote** la tabla con los registro se encuentra abajo el cual agrega un parámetro en el [**Criterio de Búsqueda**](#criterio-de-búsqueda) podrá observar cómo se filtran los registro de la tabla
<img :src="$withBase('/images/use-cases/smartbrowser/load/mandatory-vue.gif')" width="100%">

### Criterio de Búsqueda

Es a donde se encuentran los [**parámetros**](#parámetros) los cuales se toman en cuenta para el filtrado de registro

#### Versión Escritorio ZK:

Actualmente en la interfaz del Zk en el Criterio de Búsqueda muestra todos los parámetros de búsqueda y luego de seleccionar los parámetros hay que darle click al botón de Comenzar Búsqueda. También al traer registro se oculta. También es difícil saber dónde se puede desplegar de nuevo la opción de Criterio de Búsqueda

<img :src="$withBase('/images/use-cases/smartbrowser/load/search-criteria-zk.gif')" width="100%">

#### Versión Escritorio Vue:

En la interfaz de ADempiere-Vue en el Criterio de Búsqueda muestra todos solo los parámetros que sean [**obligatorio**](#obligatoriedad) o tengan un valor por defecto. También si se requiere agregar más parámetros en la parte superior ubicado a la derecha hay una lista con los parámetros disponibles
<img :src="$withBase('/images/use-cases/smartbrowser/load/mandatory-vue.gif')" width="100%">

#### Versión Móvil Vue:

En la interfaz de ADempiere-Vue en el Criterio de Búsqueda muestra todos solo los parámetros que sean [**obligatorio**](#obligatoriedad) o tengan un valor por defecto. También si se requiere agregar más parámetros en la parte superior ubicado a la derecha hay una lista con los parámetros disponibles
<img :src="$withBase('/images/use-cases/smartbrowser/load/params-mobile-ui.gif')" width="100%">

:::tip <b>Notas:</b>
En la interfaz de ADempiere-Vue si en el Criterio de Búsqueda en el parámetro pierda el foco o al presionar Enter realizará la búsqueda automáticamente
:::

### Paginación

Si en la búsqueda obtiene muchos registro debería paginar

#### Versión Escritorio ZK:

Actualmente en la interfaz del Zk carga en la tabla toda la cantida de registro del resultado de la búsqueda
<img :src="$withBase('/images/use-cases/smartbrowser/load/paging-zk.gif')" width="100%">

#### Versión Escritorio Vue:

En la interfaz de ADempiere-Vue si el resultado de la búsqueda obtiene muchos registro se muestra en la tabla el total de registro que se encontró y su cantidad de página para que la carga de registro no sea tan pesada
<img :src="$withBase('/images/use-cases/smartbrowser/load/paging-vue.gif')" width="100%">

#### Versión Móvil Vue:

En la interfaz de ADempiere-Vue si el resultado de la búsqueda obtiene muchos registro se muestra en la tabla el total de registro que se encontró y su cantidad de página para que la carga de registro no sea tan pesada
<img :src="$withBase('/images/use-cases/smartbrowser/load/paging-mobile-ui.gif')" width="100%">

### Issues

[**Consulta Inteligente: Carga > Parámetros #96**](https://github.com/solop-develop/frontend-core/issues/96) <br>
[**Consulta Inteligente: Carga > Visualización #97**](https://github.com/solop-develop/frontend-core/issues/97) <br>
[**Consulta Inteligente: Carga > Valor por Defecto #98**](https://github.com/solop-develop/frontend-core/issues/98) <br>
[**Consulta Inteligente: Carga > Criterio de Búsqueda #99**](https://github.com/solop-develop/frontend-core/issues/99)

## Ejecución

### Parámetros

Al ejecutar un proceso en el **Consulta Inteligente (Smart Browser)** despliega un modal con los parametros.

#### Versión Escritorio ZK:

<img :src="$withBase('/images/use-cases/smartbrowser/run/params-zk.png')" width="100%">

#### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/run/params-ui.gif')" width="100%">

#### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/run/params-mobile-ui.gif')" width="100%">

### Validación

En la interfaz de ADempiere-Vue cuando no se cumple una avalidacion en los **Consulta Inteligente (Smart Browser)** muestra en una notificacion

#### Versión Escritorio ZK:

<img :src="$withBase('/images/use-cases/smartbrowser/run/validation-zk.gif')" width="100%">

#### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/run/validation-ui.gif')" width="100%">

#### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/run/validation-mobile-ui.gif')" width="100%">

### Salida

La salida es visible al culminar la ejecución del proceso, como notificación, sin embargo puede visualizarse en el [Historico de Proceso](procesos-ejecutados).

#### Versión Escritorio ZK:

Actualmente en la interfaz del Zk cuando lo ejecuta un proceso sale la informacion en la barra de estado
<img :src="$withBase('/images/use-cases/smartbrowser/run/output-zk.gif')" width="100%">

#### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/run/output-ui.gif')" width="100%">

#### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/run/output-mobile-ui.gif')" width="100%">

### Historico de Procesos

En la interfaz de ADempiere-Vue desde el Historico de Proceso se pueden ver la salida de los procesos ejecutados durante la sesion. El cliente ZK de ADempiere no cuenta con una característica.

#### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/run/output-process-activity-ui.gif')" width="100%">

#### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/run/output-process-activity-mobile-ui.gif')" width="100%">

### Issues

[**Consulta Inteligente: Manejo > Búsqueda #127**](https://github.com/solop-develop/frontend-core/issues/127) <br>
[**Consulta Inteligente: Manejo > Eliminación de Registros #128**](https://github.com/solop-develop/frontend-core/issues/128) <br>
[**Consulta Inteligente: Manejo > Ejecucion de Proceso #130**](https://github.com/solop-develop/frontend-core/issues/130) <br>
