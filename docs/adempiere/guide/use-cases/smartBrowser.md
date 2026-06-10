# Smart Browser

## Opening

### Menu Tree

Open a report from the menu tree:

1. Pull down the menu tree under **System Management/General Rules/Security**.
2. Select the Smart Browser > **User/Contacts Query**.

#### ZK Desktop Version:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-menu-destok-zk.gif')" width="100%">

#### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-menu-destok-ui.gif')" width="100%">

#### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-menu-mobile-ui.gif')" width="100%">

### Menu Browser

Open a report from the menu browser:

2. In the search engine at the top type **User/Contacts Query**.
3. Select the Smart Browser that matches the result.

#### ZK Desktop Version:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-search-menu-destok-zk.gif')" width="100%">

#### Vue Desktop Version:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-search-menu-destok-ui.gif')" width="100%">

#### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-search-menu-mobile-ui.gif')" width="100%">

### Recent Items

Open a Smart Browser **(Smart Browser)** of recent items:

1. Locate the **Recent Items** dashboard.
2. Select any **Smart Browser** or in case of using the quick search of the recent items table select the **Smart Browser** matching the result.

##### ZK Desktop Version:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-recien-item-mobile-ui.gif')" width="100%">

##### Versión Escritorio Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-recien-item-destok-ui.gif')" width="100%">

#### Versión Móvil Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-recien-item-mobile-ui.gif')" width="100%">

### Relationships

Open a Smart Browser **(Smart Browser)** from the same menu level relations:

ADempiere's ZK client does not have a feature.

### Steps to follow

1. Pull down the menu tree in **System Management/General Rules/Security**.
2. Select the **My Profile** window.
3. Pull down the Relationship menu list at the top right of the window.
4. Locate and select the **Smart Browser** > **User/Contact Query**.

### Issues

[**Consulta Inteligente: Apertura > Árbol de Menú #112**](https://github.com/solop-develop/frontend-core/issues/112) <br>
[**Consulta Inteligente: Apertura > Elementos Recientes #114**](https://github.com/solop-develop/frontend-core/issues/114) <br>
[**Consulta Inteligente: Apertura > Asociado a Proceso de Ventana #116**](https://github.com/solop-develop/frontend-core/issues/116) <br>
[**Consulta Inteligente: Apertura > Asociado a Campo tipo Botón #117**](https://github.com/solop-develop/frontend-core/issues/117)

#### Vue Version:

<img :src="$withBase('/images/use-cases/smartbrowser/open/open-relations-destok-ui.gif')" width="100%">

## Load

### Parameters

The parameters (fields) of the **Smart Browser** are used to perform the record search. Only the fields with default value will be displayed, or with mandatory value.

1. Open the **Smart Browser** **Process Orders in Batch**.
2. Note the **Document Status** parameter.

#### ZK Desktop Version:

<img :src="$withBase('/images/use-cases/smartbrowser/load/params-zk.png')" width="100%">

#### Vue Desktop Version:

<img :src="$withBase('/images/use-cases/smartbrowser/load/mandatory-vue.gif')" width="100%">

#### Vue Mobile Version:

<img :src="$withBase('/images/use-cases/smartbrowser/load/params-mobile-ui.gif')" width="100%">

### Display

When loading all parameters with default value, or with mandatory are displayed on first load.

#### ZK Desktop Version:

Currently in the Zk interface when opening a **Smart Browser** in this case **Process Orders in Batch** loads all fields in the view.
<img :src="$withBase('/images/use-cases/smartbrowser/load/mandatory-zk.gif')" width="100%">

#### Vue Desktop Version:

In the ADempiere-Vue interface open a **Smart Browser** in this case **Process Orders in Batch** only shows the fields with default value, or with mandatory.

<img :src="$withBase('/images/use-cases/smartbrowser/load/mandatory-vue.gif')" width="100%">

#### Mobile Version Vue:

<img :src="$withBase('/images/use-cases/smartbrowser/load/params-mobile-ui.gif')" width="100%">

### Mandatory

##### ZK Version:

1. Open the **Process Orders in Batch** report.
2. Mandatory fields show with an asterisk (\*red on the right side of their name.
   <img :src="$withBase('/images/use-cases/smartbrowser/load/display-zk.png')" width="100%">

##### Vue Desktop Version:

1. Open the **Process Orders in Batch** report.
2. Mandatory fields show with an asterisk (\*red on the right side of their name, and those mandatory empty ones highlight with a red border above the field.
   <img :src="$withBase('/images/use-cases/smartbrowser/load/mandatory-vue.gif')" width="100%">

#### Mobile Version Vue:

1. Open the **Process Orders in Batch** report.
2. Mandatory fields show with an asterisk (\*red on the right side of their name, and those mandatory empty ones highlight with a red border above the field.
   <img :src="$withBase('/images/use-cases/smartbrowser/load/params-mobile-ui.gif')" width="100%">

### Record

It is a table where the records are found depending on the parameters found in the [**Search Criteria**](#search-criteria).

#### ZK Desktop Version:

Currently in the Zk interface when opening a **Smart Browser** in this case **Process Orders in Batch** it is not possible to observe the table with records in a dynamic way.
<img :src="$withBase('/images/use-cases/smartbrowser/load/search-record-zk.gif')" width="100%">

#### Vue Desktop Version:

In the ADempiere-Vue interface open a **Smart Browser** in this case **Process Orders in Batch** the table with the records is below which add a parameter in the [**Search Criteria**](#search-criteria) you can see how the records are filtered from the table
<img :src="$withBase('/images/use-cases/smartbrowser/load/search-record-ui.gif')" width="100%">

#### Vue Mobile Version:

In the ADempiere-Vue interface open a **Smart Browser** in this case **Process Orders in Batch** the table with the records is below which add a parameter in the [**Search Criteria**](#search-criteria) you can see how the records are filtered from the table
<img :src="$withBase('/images/use-cases/smartbrowser/load/mandatory-vue.gif')" width="100%">

### Search Criteria

This is where the [**parameters**](#parameters) which are taken into account for log filtering are located.

#### ZK Desktop Version:

Currently in the Zk interface in the Search Criteria it shows all the search parameters and after selecting the parameters you have to click on the Start Search button. Also when bringing record it is hidden. It is also difficult to know where to display the Search Criteria option again.

<img :src="$withBase('/images/use-cases/smartbrowser/load/search-criteria-zk.gif')" width="100%">

#### Vue Desktop Version:

En la interfaz de ADempiere-Vue en el Criterio de Búsqueda muestra todos solo los parámetros que sean [**obligatorio**](#obligatoriedad) o tengan un valor por defecto. También si se requiere agregar más parámetros en la parte superior ubicado a la derecha hay una lista con los parámetros disponibles
<img :src="$withBase('/images/use-cases/smartbrowser/load/mandatory-vue.gif')" width="100%">

#### Versión Móvil Vue:

En la interfaz de ADempiere-Vue en el Criterio de Búsqueda muestra todos solo los parámetros que sean [**obligatorio**](#obligatoriedad) o tengan un valor por defecto. También si se requiere agregar más parámetros en la parte superior ubicado a la derecha hay una lista con los parámetros disponibles
<img :src="$withBase('/images/use-cases/smartbrowser/load/params-mobile-ui.gif')" width="100%">

:::tip <b>Notes:</b>.
In the ADempiere-Vue interface if in the Search Criteria in the parameter lose focus or pressing Enter will automatically perform the search.
:::

### Pagination

If in the search you get a lot of records you should paginate

#### ZK Desktop Version:

Currently in the Zk interface it loads in the table all the record quantity of the search result.
<img :src="$withBase('/images/use-cases/smartbrowser/load/paging-zk.gif')" width="100%">

#### Vue Desktop Version:

In the ADempiere-Vue interface if the search result gets many records the total number of records found and their page count are displayed in the table so that the log load is not so heavy
<img :src="$withBase('/images/use-cases/smartbrowser/load/paging-vue.gif')" width="100%">

#### Vue Mobile Version:

In the ADempiere-Vue interface if the search result gets many records the total number of records found and their page count are displayed in the table so that the record load is not so heavy
<img :src="$withBase('/images/use-cases/smartbrowser/load/paging-mobile-ui.gif')" width="100%">

### Issues

[**Consulta Inteligente: Carga > Parámetros #96**](https://github.com/solop-develop/frontend-core/issues/96) <br>
[**Consulta Inteligente: Carga > Visualización #97**](https://github.com/solop-develop/frontend-core/issues/97) <br>
[**Consulta Inteligente: Carga > Valor por Defecto #98**](https://github.com/solop-develop/frontend-core/issues/98) <br>
[**Consulta Inteligente: Carga > Criterio de Búsqueda #99**](https://github.com/solop-develop/frontend-core/issues/99)

## Execution

### Parameters

Running a process in the **Smart Browser** displays a modal with the parameters.

#### ZK Desktop Version:

<img :src="$withBase('/images/use-cases/smartbrowser/run/params-zk.png')" width="100%">

#### Vue Desktop Version:

<img :src="$withBase('/images/use-cases/smartbrowser/smartbrowser/run/params-ui.gif')" width="100%">

#### Vue Mobile Version:

<img :src="$withBase('/images/use-cases/smartbrowser/smartbrowser/run/params-mobile-ui.gif')" width="100%">

### Validation

In the ADempiere-Vue interface when a validation is not fulfilled in the **Smart Browser** shows in a notification

#### ZK Desktop Version:

<img :src="$withBase('/images/use-cases/smartbrowser/run/validation-zk.gif')" width="100%">

#### Vue Desktop Version:

<img :src="$withBase('/images/use-cases/smartbrowser/smartbrowser/run/validation-ui.gif')" width="100%">

#### Vue Mobile Version:

<img :src="$withBase('/images/use-cases/smartbrowser/smartbrowser/run/validation-mobile-ui.gif')" width="100%">

### Output

The output is visible at the end of the process execution, as a notification, however it can be viewed in the [Process History](processes-executed).

#### ZK Desktop Version:

Currently in the Zk interface when a process executes it the information is displayed in the status bar.
<img :src="$withBase('/images/use-cases/smartbrowser/run/output-zk.gif')" width="100%">

#### Vue Desktop Version:

<img :src="$withBase('/images/use-cases/smartbrowser/smartbrowser/run/output-ui.gif')" width="100%">

#### Vue Mobile Version:

<img :src="$withBase('/images/use-cases/smartbrowser/smartbrowser/run/output-mobile-ui.gif')" width="100%">

### Process History

In the ADempiere-Vue interface from the Process History you can see the output of the processes executed during the session. The ADempiere ZK client does not have a feature.

#### Vue Desktop Version:

<img :src="$withBase('/images/use-cases/smartbrowser/smartbrowser/run/output-process-activity-ui.gif')" width="100%">

#### Vue Mobile Version:

<img :src="$withBase('/images/use-cases/smartbrowser/smartbrowser/run/output-process-activity-mobile-ui.gif')" width="100%">

### Issues

[**Consulta Inteligente: Manejo > Búsqueda #127**](https://github.com/solop-develop/frontend-core/issues/127) <br>
[**Consulta Inteligente: Manejo > Eliminación de Registros #128**](https://github.com/solop-develop/frontend-core/issues/128) <br>
[**Consulta Inteligente: Manejo > Ejecucion de Proceso #130**](https://github.com/solop-develop/frontend-core/issues/130) <br>
