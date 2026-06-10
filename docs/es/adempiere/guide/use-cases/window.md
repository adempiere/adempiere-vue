# Ventanas

## Apertura

### Árbol de Menú

Aperturar un reporte desde el árbol de menú:

1. Desplegar el árbol de menú en **Diccionario de la Aplicación**.
2. Seleccione **Vista**.

##### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/window/open/open-menu-desktop-vue.gif')" alt="ZK Desktop" width="100%">

##### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/window/open/open-menu-mobile-vue.gif')" alt="ZK Desktop" width="100%">

### Buscador del Menú

Apertura una Ventana desde el buscador del árbol de menú:

1. Enfocar la entrada de texto encima del menú.
2. Escribir el nombre de la Ventana que desea buscar.
3. Seleccionar Vistas

##### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/window/open/open-search-desktop.vue.gif')" alt="ZK Desktop" width="100%">

##### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/window/open/open-search-mobile.gif')" alt="ZK Desktop" width="100%">

### Ítems Recientes

Abrir una Ventana desde el tablero de elementos recientes:

1. Iniciar sesión como Garden Admin.
2. Ubicar el tablero de elementos recientes.
3. Seleccionar cualquier ventana que recientemente se haya abierto.

##### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/window/open/open-recient-item-desktop-vue.gif')" alt="ZK Desktop" width="100%">

##### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/window/open/open-recient-item-mobile-vue.gif')" alt="ZK Desktop" width="100%">

### Abrir Ventana desde el Acercador de Proceso

En ADempiere actualmente se puede acceder a una ventana desde un campo que está en otro que está relacionado, como se muestra a continuación.

##### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/window/open/open-zoom-process-desktop-vue.gif')" alt="ZK Desktop" width="100%">

##### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/window/open/open-zoom-process-mobile-vue.gif')" alt="ZK Desktop" width="100%">

### Abrir Ventana desde el Smart Browser

En ADempiere actualmente se puede acceder a una ventana desde los **Smart Browser**, como se muestra a continuación.

##### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/window/open/open-zoom-sb-desktop-vue.gif')" alt="ZK Desktop" width="100%">

##### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/window/open/open-zoom-sb-mobile-vue.gif')" alt="ZK Desktop" width="100%">

## Carga

### Pestaña (Modo Mono Registro)

En modo de Mono Registro se muestra el panel con los campos de la ventana

:::tip <h3> Nota </h3>
Al Abrir o cargar una ventana se posicionara en la primera pestaña padre y todas las pestañas que estén a un nivel inferior que tengan el mismo nombre de tabla.
En el caso de socio de negocio que todavía estaban a un nivel inferior eh cliente, proveedores, empleados, pero tienen el mismo nombre de tabla.

Esto pemite visualizar la informacion de 2 pestañás al mismo tiempo
:::

<h3> Versión Escritorio ZK: </h3>
<img :src="$withBase('/images/use-cases/window/load/tab/tab-zk.png')" alt="ZK Desktop" width="100%">

<h3> Versión Escritorio Vue:</h3>
<img :src="$withBase('/images/use-cases/window/load/tab/tab-vue.png')" alt="ZK Desktop" width="100%">

<h3> Versión Móvil Vue:</h3>
<img :src="$withBase('/images/use-cases/window/load/tab/tab-vue-mobile.png')" alt="ZK Desktop" width="100%">

#### Lógica de Visualización

<h3> Versión Escritorio ZK:</h3>
<img :src="$withBase('/images/use-cases/window/load/tab/display-logi-zk.gif')" alt="ZK Desktop" width="100%">

<h3> Versión Escritorio Vue:</h3>
<img :src="$withBase('/images/use-cases/window/load/tab/display-logi-vue.gif')" alt="ZK Desktop" width="100%">

<h3> Versión Móvil Vue:</h3>
<img :src="$withBase('/images/use-cases/window/load/tab/display-logi-vue-mobile.gif')" alt="ZK Desktop" width="100%">

### Tabla (Modo Multi Registro)

En modo de Multi Registro se muestra una tabla con registro

:::tip <h3> Opciones y Herramientas de la Tabla </h3>

- Seleccion
- Paginacion
- Cambiar la Visualizacion de la columna
- Cambios de registro
  :::

<h3> Versión Escritorio ZK:</h3>
<img :src="$withBase('/images/use-cases/window/load/table/table-zk.png')" alt="ZK Desktop" width="100%">

<h3> Versión Escritorio Vue:</h3>
<img :src="$withBase('/images/use-cases/window/load/table/table-vue.png')" alt="ZK Desktop" width="100%">

## CRUD

### Nuevo Registro

Crear Nuevo Registro. Para crear un nuevo registro puede usar los **Botones de Conveniencia** o dirigirse al menu ubicado en el lado derecho y seleccione la opción de **Nuevo Registro**
Para guardar solo debe llenar los campos obligatorio

##### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/window/ejecute/new-record-desktop-vue.gif')" alt="ZK Desktop" width="100%">

##### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/window/ejecute/new-record-mobile-vue.gif')" alt="ZK Desktop" width="100%">

### Lectura

Navegación entre registro, Navegación entre Pestaña, modo Multivista y Mono Vista

##### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/window/ejecute/navegation-desktop-vue.gif')" alt="ZK Desktop" width="100%">

##### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/window/ejecute/navegation-mobile-vue.gif')" alt="ZK Desktop" width="100%">

### Actualizar

Al modificar un valor de un campo apenas pueda el focos o pulse Enter se guardar los campos

##### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/window/ejecute/update-desktop-vue.gif')" alt="ZK Desktop" width="100%">

##### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/window/ejecute/update-mobile-vue.gif')" alt="ZK Desktop" width="100%">

### Eliminar

Para eliminar un registro puede usar los **Botones de Conveniencia** o dirigirse al menu ubicado en el lado derecho y seleccione la opción de **Eliminar Registro**

Al seleccionar la Acción de **Eliminar** aparecerá un diálogo con el cual tendrá que confirmar eliminar un registro en casos de equivocarse

##### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/window/ejecute/delete-desktop-vue.gif')" alt="ZK Desktop" width="100%">

##### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/window/ejecute/delete-mobile-vue.gif')" alt="ZK Desktop" width="100%">
