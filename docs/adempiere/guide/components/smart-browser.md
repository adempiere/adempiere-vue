# Smart Browser

The **Smart Browser** component displays a minimalistic view which is made up of multiple search criteria fields which are used to query records.
The result table has selections for current process execution.

## Interface

### ADempiere-ZK Desktop Version

<img :src="$withBase('/images/components/smart-browser/smart-browser/desktop-zk.png')" alt="ZK Desktop Version Reports" width="100%">

### ADempiere-Vue Desktop Version

<img :src="$withBase('/images/components/smart-browser/smart-browser/desktop-ui.png')" alt="ZK Desktop Version Reports" width="100%">

### ADempiere-Vue Mobile Version

<img :src="$withBase('/images/components/smart-browser/mobile-ui.png')" alt="Reports in Mobile Version" width="100%">

## **Actions Component Menu**.

This component also has a menu located on the top right side. It is made up of 3 options: Execution, Relations and References.

- This option has all the executions of the current Smart Browser and is identified with a blue background. It is both as a quick execution of the process and also consists of a drop-down list with the different options.
  :::tip
- Exportar Registros Seleccionados
- Eliminar
- Refrescar Registros
- Acercar Ventana
- Compartir Enlace
  :::
  <br>

### Menu View in ADempiere-Vue Desktop Version

<img :src="$withBase('/images/components/smart-browser/smart-browser/run-action-ui.gif')" alt="Report Component Menu - Execution" width="100%">

### Menu View in Mobile Version ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/smart-browser/run-action-ui-mobile.gif')" alt="Report Menu in Desktop Version" width="100%">

## Field display

For a better view the **Smart Browser** component, although they keep the same order, they are hidden by default. Unless the field has a default value or they are mandatory

### View in Desktop Version ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/smart-browser/fields-mobile-vue.gif')" width="100%">

### View in Mobile Version ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/smart-browser/fields-desktop-vue.gif')" width="100%">

## Execution

To execute a process associated to a **Smart Browser** you must first select a record then go to the top left in the actions menu. select the process fill in the required parameters and execute the associated process.

### View in Desktop Version ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/smart-browser/run-desktop-vue.gif')" width="100%">

### View in Mobile Version ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/smart-browser/run-mobile-vue.gif')" width="100%">

## Export Selected Records

This option is located in the [actions menu](#component-actions-menu) under the Execution option

### View in Desktop Version ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/smart-browser/export-browser-desktop.gif')" width="100%">

### View in Mobile Version ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/smart-browser/export-browser.gif')" width="100%">

## Zoom In Window

This option is found in the [actions menu](#menu-component-actions) under the Execute option.

### View in Desktop Version ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/smart-browser/zoom-browser-desktop.gif')" width="100%">

### View in Mobile Version ADempiere-Vue

<img :src="$withBase('/images/components/smart-browser/smart-browser/zoom-browser-mobile.gif')" width="100%">

## Developer Options

The `Browser` panel is located in the following path:

````bash
    └─ src # Main source code.
        └└──views # Global views
              └────ADempiere # ADempiere specific views.
                    └─── Browser # Browser container.
```

The `Browser` application consumption call is located in the following path:


```bash
    └──────api # Main source code
			└─ADempiere # ADempiere specific views
					└└── Browser # Browser Viewer container.
```


[GET /api/user-interface/smart-browser/browser-items](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#get-api-user-interface-smart-browser-browser-items)
````
