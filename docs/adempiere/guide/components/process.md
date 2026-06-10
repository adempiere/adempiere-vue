# Process

The **Process** component displays a minimalistic view which is made up of multiple parameters which are used to execute the current process. This component also has dynamic validations and visualization of the fields.

## Interface

### Processes in Desktop Version ADempiere-ZK

<img :src="$withBase('/images/components/process/zk.png')" alt="ZK Desktop Version Processes" width="600px">

### ADempiere-Vue Desktop Version Processes

It consists of a panel with [**Field display**](#field-display) and a [**Execution Menu**](#process-component-menu) located at the top, aligned to the right.

<img :src="$withBase('/images/components/process/vue.png')" alt="Desktop Version Processes" width="600px">

### ADempiere-Vue Mobile Version Processes

This consists of a panel with [**Field display**](#field-display) and a [**Execution Menu**](#process-component-menu) located at the top right aligned.

<img :src="$withBase('/images/components/process/vue-mobile.png')" alt="Processes in Mobile Version" width="600px">

## Process Component Menu

- **Execution:** This option counts all executions of the current process and is identified with a blue background. This option is both as a quick run and also a drop down list with the process name and description. By default the main action of the run list is always first.

<img :src="$withBase('/images/components/process/menu-process.png')" alt="Desktop Version Process Menu" width="800px">

## Field display

For a more minimalistic and simpler view the fields in the process component although they keep the same order are hidden by default unless the field has a default value or are mandatory

<img :src="$withBase('/images/components/process/field.gif')" width="800px">

## How does it work?

### Desktop Version

In the desktop version you must fill in all the required fields and go to the menu in order to run the process

<img :src="$withBase('/images/components/process/run-process.gif')" />

### Mobile version

In the mobile version you must fill in all the required fields and go to the menu in order to run the process

<img :src="$withBase('/images/components/process/run-process-mobile.gif')" width="800px"/>

## Developer Options

### File Location

[Process](#Process) window is located in the following path:

```bash
    └─ src                              # Main source code
        └──views            			# Global views
              └───ADempiere             # ADempiere specific views
                    └── Process     	# Process Container
```

Here you can see the [**Process**](https://github.com/solop-develop/frontend-core/blob/experimental/src/views/ADempiere/Process/index.vue) file.

Logics of the [**Process**](#process) window is located at the following path:

```bash
    └─ src                                   # Main source code
        └──views              			     # Global views
                └─ADempiere                  # ADempiere specific views
                    └── Process         	 # Process Container
                      └── mixinProcess.js    # Report Logic Container
```

Here you can see the [**mixinProcess.js**](https://github.com/solop-develop/frontend-core/blob/experimental/src/api/ADempiere/mixinProcess.js) file.

The [**Process**](#process) service consumption call is located in the following path:

```bash
    └─ src                                   # Main source code
        └──views              			     # Global Services
                └─ADempiere                  # ADempiere specific services
                    └── process.js         	 # Process service main directory
```

Here you can see the [**process.js**](https://github.com/solop-develop/frontend-core/blob/experimental/src/api/ADempiere/process.js) file.

### The called services of the component are:

[GET /api/dictionary/process](https://adempiere.github.io/proxy-adempiere-api/guide/es/default-modules/adempiere-api/dictionary.html#get-api-dictionary-process)<br>
[POST /api/common/api/process](#)

## Demo

Here you can see a [Demo](https://vue-develop.solopcloud.com/#/6b1c00f8-a762-48c1-9e30-b634ff2953ba/a3e5c878-fb40-11e8-a479-7a0060f0aa01/process/383)
