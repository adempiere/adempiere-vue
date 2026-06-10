# Procesos

## Apertura

### Árbol de Menú

Abrir un proceso desde el árbol de menú:

1. Desplegar el árbol de menú en **Relación con Socios del Negocio**.
2. Seleccionar el proceso **Envío Texto Correo Electrónico**.

##### Versión Escritorio ZK:

<img :src="$withBase('/images/use-cases/process-opened-menu-zk.gif')" alt="ZK Desktop" width="100%">

##### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/process/open/open-menu-vue.gif')" alt="ZK Desktop" width="100%">

#### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/process/open/open-menu-mobile-vue.gif')" width="100%">

### Buscador del Menú

Abrir un proceso desde el buscador del menú:

1. Desplegar el árbol de menú.
2. En el buscador de la parte superior escribir **Envío Texto Correo Electrónico**.
3. Seleccionar el proceso coincidente con el resultado.

##### Versión Escritorio ZK:

<video width="100%" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-menu-lookup-zk.mp4')">
  Your browser does not support the mp4 video tag.
</video>

##### Versión Escritorio Vue:

1. Hacer clic en la lupa ubicada a la derecha de la cabecera.
2. En el buscador que se despliega escribir **Envío Texto Correo Electrónico**.
3. Seleccionar el proceso coincidente con el resultado.

<img :src="$withBase('/images/use-cases/process/open/open-search-vue.gif')" width="100%">

#### Versión Móvil Vue:

1. Hacer clic en la lupa ubicada a la derecha de la cabecera.
2. En el buscador que se despliega escribir **Envío Texto Correo Electrónico**.
3. Seleccionar el proceso coincidente con el resultado.

<img :src="$withBase('/images/use-cases/process/open/open-search-mobile-vue.gif')" width="100%">

### Ítems Recientes

Abrir un proceso de ítems recientes:

1. Ubicar el tablero **Ítems Recientes**.
2. Seleccionar cualquier proceso.

##### Versión Escritorio Vue:

<video width="100%" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-recent-items-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>

##### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/process/open/open-recient-item-vue.gif')" alt="ZK Desktop" width="100%">

#### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/process/open/open-recient-item-mobile-vue.gif')" width="100%">

<!-- ### Relaciones
Abrir un proceso desde las relaciones del mismo nivel del menú:

1. Desplegar el árbol de menú en **Relación con Socios del Negocio**.
2. Seleccionar la ventana **Información de Agentes de la Compañía**.
3. Desplegar la lista del el menú de relaciones, en la parte superior a la derecha de la ventana.
4. Ubicar y seleccionar el proceso **Envío Texto Correo Electrónico**.

##### Versión ZK:
El cliente ZK de ADempiere no cuenta con una característica equivalente.

##### Versión Vue:
<video width="100%" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-relations-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video> -->

### Proceso relacionado a la Ventana

Abrir los procesos asociados en la ventana:

##### Versión Escritorio ZK:

1. Desplegar el árbol de menú en **Relación con Socios del Negocio**.
2. Seleccionar la ventana **Información de Agentes de la Compañía**.
3. Dar clic en el icono del engranaje, en la barra superior, para listar los procesos.
4. Seleccionar el proceso **Generar Token para Acceso de Terceros**

<video width="100%" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-window-zk.mp4')">
  Your browser does not support the mp4 video tag.
</video>

##### Versión Escritorio Vue:

1. Desplegar el árbol de menú en **Diccionario de la Aplicación**.
2. Seleccionar la ventana **Vista**.
3. En la parte superior a la derecha listar, listar el menú de acciones.
4. Seleccionar el proceso **Creates columns**

<img :src="$withBase('/images/use-cases/process/open/open-process-window-vue.gif')" width="100%">

##### Versión Móvil Vue:

1. Desplegar el árbol de menú en **Diccionario de la Aplicación**.
2. Seleccionar la ventana **Vista**.
3. En la parte superior a la derecha listar, listar el menú de acciones.
4. Seleccionar el proceso **Creates columns**

<img :src="$withBase('/images/use-cases/process/open/open-process-window-mobile-vue.gif')" width="100%">

### Re Abrir Proceso desde el Histórico Procesos

Abrir un proceso el **Histórico Procesos** con los parámetros ejecutados del proceso seleccionado:

##### Versión Escritorio ZK:

El cliente ZK de ADempiere no cuenta con una característica equivalente.

##### Versión Escritorio Vue:

1. Ubicar en el árbol de menú en **Histórico Procesos** y abrirlo.
2. Seleccionar cualquier proceso con parámetros **Envío Texto Correo Electrónico**.

<img :src="$withBase('/images/use-cases/process/open/open-process-activity-vue.gif')" width="100%">

##### Versión Móvil Vue:

1. Ubicar en el árbol de menú en **Histórico Procesos** y abrirlo.
2. Seleccionar cualquier proceso con parámetros **Envío Texto Correo Electrónico**.

<img :src="$withBase('/images/use-cases/process/open/open-process-activity-mobile-vue.gif')" width="100%">

### Asociado a Campo tipo Botón

Aperturar un proceso asociado a un campo de la ventana tipo boton:

1. Desplegar el árbol de menú en **Gestión de Ventas > Entregas**.
2. Seleccione la ventana de **Entregas (Cliente)**.
3. Darle clic en el boton **Crea Confirmación**.

##### Versión Escritorio ZK:

<video width="100%" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process/open/process-button-window-zk.mp4')">
  Your browser does not support the mp4 video tag.
</video>

##### Versión Escritorio Vue:

<video width="100%" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process/open/process-button-window-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>

##### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/process/open/process-button-window-mobile-vue.gif')" width="100%">

### Proceso relacionado a Consulta Inteligente

Aperturar un proceso asociado a una Consulta Inteligente:

1. Desplegar el árbol de menú en **Gestión de Ventas > Ordenes de Venta**.
2. Seleccionar la consulta inteligente **Procesar Órdenes en Lote**.

##### Versión Escritorio ZK:

<video width="100%" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process/open/process-associated-smart-browser-zk.mp4')">
  Your browser does not support the mp4 video tag.
</video>

##### Versión Escritorio Vue:

<video width="100%" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process/open/process-associated-smart-browser-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>

##### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/process/open/process-associated-smart-browser-mobile-vue.gif')" width="100%">

### Issues

[**Proceso: Apertura #19**](https://github.com/solop-develop/frontend-core/issues/19) <br>
[**Proceso: Apertura > Árbol de Menú #20**](https://github.com/solop-develop/frontend-core/issues/20) <br>
[**Proceso: Apertura > Buscador del Menú #21**](https://github.com/solop-develop/frontend-core/issues/21) <br>
[**Proceso: Apertura > Elementos Recientes #22**](https://github.com/solop-develop/frontend-core/issues/22) <br>
[**Proceso: Apertura > Asociado a Ventana #23**](https://github.com/solop-develop/frontend-core/issues/23) <br>
[**Proceso: Apertura > Re Abrir desde el Histórico Procesos #25**](https://github.com/solop-develop/frontend-core/issues/25) <br>
[**Proceso: Apertura > Asociado a Consulta Inteligente #105**](https://github.com/solop-develop/frontend-core/issues/105) <br>
[**Proceso: Apertura > Asociado a Campo tipo Botón #106**](https://github.com/solop-develop/frontend-core/issues/106) <br>

## Carga

### Parámetros

Los parámetros (campos) de los procesos deben cargar al abrirse en el caso de que el proceso maneje parámetros según cada tipo de visualización.

1. Abrir el proceso **Transferencia Bancaria**.
2. Nótese los diferentes tipos de parámetros: Cadena, Si y No, Fecha, Monto, Lista, Tabla.

##### Versión Escritorio ZK:

<img :src="$withBase('/images/use-cases/process-parameters-zk.png')" alt="ZK Desktop" width="100%">

##### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/process/load/parameters.png')" alt="ZK Desktop" width="100%">

##### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/process/load/parameters-mobile-vue.png')" width="100%">

### Validaciones Dinámicas

Para los campos de seleccionables (Lista, Tabla y Tabla Directa), deben filtrarse los resultados cuando dicho parámetro tenga alguna validación dinámica.

1. Abrir el proceso **Transferencia Bancaria**.
2. Listar los valores del campo **Cuenta Bancaria Desde**.
3. Seleccionar un valor.
4. Listar los valores del campo **Cuenta Bancaria Para** y verificar que el valor seleccionado en el campo anterior se excluye del resultado.

##### Versión Escritorio ZK:

<video width="100%" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-dynamic-validation-zk.mp4')">
  Your browser does not support the mp4 video tag.
</video>

##### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/process/load/process-dynamic-validation-vue.gif')" width="100%">
##### Versión Móvil Vue:
<img :src="$withBase('/images/use-cases/process/load/process-dynamic-validation-mobile-vue.gif')" width="100%">

### Visualización

1. Todos los parámetros con valor por defecto, o con obligatoriedad se visualizan en la primera carga.

### Obligatoriedad

##### Versión Escritorio ZK:

1. Abrir el proceso **Transferencia Bancaria**.
2. Los campos obligatorios muestran con un asterisco (\*) rojo al lado derecho de su nombre.
   <img :src="$withBase('/images/use-cases/process-mandatory-zk.png')" alt="ZK Desktop" width="100%">

##### Versión Escritorio Vue:

1. Abrir el proceso **Transferencia Bancaria**.
2. Los campos obligatorios muestran con un asterisco (\*) rojo al lado derecho de su nombre, y aquellos obligatorios vacíos resaltan con un borde rojo sobre el campo.
   <img :src="$withBase('/images/use-cases/process/load/parameters.png')" alt="ZK Desktop" width="100%">

##### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/process/load/parameters-mobile-vue.png')" width="100%">

<!-- ### Solo Lectura -->

### Valor por Defecto

Manejar valor por defecto para los distintos tipos de parámetros.

##### Versión Escritorio Vue:

1. Abrir el proceso **Transferencia Bancaria**.
2. Hacer clic contrario en el valor del parámetro y seleccionar **Valor de Preferencia**.
3. Observe que el parámetro **Tipo de Pago** tiene valor por defecto (A = Deposito Directo).

<video width="100%" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-default-value-zk.mp4')">
  Your browser does not support the mp4 video tag.
</video>

##### Versión Escritorio Vue:

1. Abrir el proceso **Transferencia Bancaria**.
2. Hacer clic en el nombre del parámetro y seleccionar **Información**.
3. Observe que el parámetro **Fecha de Estado de Cuenta** y parámetro **Tipo de Pago** tienen valores por defectos y debidamente establecidos en los parámetros.

<img :src="$withBase('/images/use-cases/process/load/process-default-value-vue.gif')" width="100%">

### Issues

[**Proceso: Carga #5**](https://github.com/solop-develop/frontend-core/issues/5)<br>
[**Proceso: Carga > Parámetros #6**](https://github.com/solop-develop/frontend-core/issues/6)<br>
[**Proceso: Carga > Solo Lectura #7**](https://github.com/solop-develop/frontend-core/issues/7)<br>
[**Proceso: Carga > Obligatoriedad #8**](https://github.com/solop-develop/frontend-core/issues/8)<br>
[**Proceso: Carga > Visualización #10**](https://github.com/solop-develop/frontend-core/issues/10)<br>
[**Proceso: Carga > Valor por Defecto #11**](https://github.com/solop-develop/frontend-core/issues/11)<br>
[**Proceso: Carga > Validaciones Dinámicas #134**](https://github.com/solop-develop/frontend-core/issues/134)<br>

<!-- #### Acercar -->

## Ejecución

### Validación

Se deben asegurar las siguientes validaciones para poder ejecutar un proceso:

- Todos los campos obligatorios deben tener valores.
- Si es proceso asociado a una ventana no permite ejecutarse en un nuevo registro.
- Si es proceso asociado a una consulta inteligente debe tener mínimo una fila seleccionada.

##### Versión Escritorio Vue:

<!-- <video width="100%" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-validate-mandatory-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>  -->
<img :src="$withBase('/images/use-cases/process/run/process-validate-mandatory--vue.gif')" width="100%">

##### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/process/run/process-validate-mandatory-mobile-vue.gif')" width="100%">

### Ejecución

1. Desplegar el árbol de menú en **Relación con Socios del Negocio**.
2. Seleccionar el proceso **Envío Texto Correo Electrónico**.
3. Llenar los campos.
4. Ejecutar en el menú de acciones.

### Cierre del Proceso al Ejecutarse

Al comenzar la ejecución de un proceso, debe cerrar la vista actual.

##### Versión Escritorio Vue:

<!-- <video width="100%" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-run-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video> -->

<img :src="$withBase('/images/use-cases/process/run/process-run.gif')" width="100%">

##### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/process/run/process-run-vue.gif')" width="100%">

### Salida

La salida es visible al culminar la ejecución del proceso, como notificación, sin embargo puede visualizarse en el histórico de procesos.

##### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/process/run/run-result.png')" width="100%">

##### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/process/run/run-result-mobile.png')" width="100%">

### Issues

[**Proceso: Manejo#12**](https://github.com/solop-develop/frontend-core/issues/12)<br>
[**Proceso: Manejo > Validación #14**](https://github.com/solop-develop/frontend-core/issues/14)<br>
[**Proceso: Manejo > Cierre del Proceso al Ejecutarse #16**](https://github.com/solop-develop/frontend-core/issues/16)<br>
[**Proceso: Manejo > Salida #17**](https://github.com/solop-develop/frontend-core/issues/17)<br>
[**Proceso: Manejo > Ejecución #18**](https://github.com/solop-develop/frontend-core/issues/18)<br>
