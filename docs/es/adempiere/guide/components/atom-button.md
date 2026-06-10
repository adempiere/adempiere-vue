<spam id="epale" ref="alo">

<!-- # Component -->

# Átomos

## Botón

**El componente del botón base. Este componente funcional de Vue3, Nuxt3 y Element-Plus.**

### Tipo de Botón

**Botones comúnmente usados**

<iframe
src="https://codesandbox.io/embed/docs-component-atom-button-all-type-7x5mmj?file=/src/App.vue?view=preview&hidenavigation=1&9"
style="width:100%; height:400px; border:0; border-radius: 4px; overflow:auto;"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

#### Codigo

```vue
<template>
	<div style="text-align: center">
		<P style="text-align: center">
			<el-button>Defecto</el-button>
			<el-button type="primary">Primario</el-button>
			<el-button type="success">Éxito</el-button>
			<el-button type="info">Información</el-button>
			<el-button type="warning">Advertencia</el-button>
			<el-button type="danger">Peligro</el-button>
		</P>

		<P>
			<el-button plain>Plano</el-button>
			<el-button type="primary" plain>Primario</el-button>
			<el-button type="success" plain>Éxito</el-button>
			<el-button type="info" plain>Información</el-button>
			<el-button type="warning" plain>Advertencia</el-button>
			<el-button type="danger" plain>Peligro</el-button>
		</P>
	</div>
</template>
```

### Botón deshabilitado

**El atributo disabled determina su un botón esta deshabilitado.**

<iframe
	src="https://codesandbox.io/embed/docs-component-atom-button-disable-gis8ni?file=/src/App.vue?view=preview&hidenavigation=1&9"
	style="width:100%; height:250px; border:0; border-radius: 4px; overflow:hidden;"
	allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
	sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

#### Codigo

```vue
<template>
	<div>
		<el-button :disabled="true">
			{{ input }}
		</el-button>
		<el-button :disabled="false">
			{{ input }}
		</el-button>
	</div>
</template>
```

### Botón de descarga

**Cuando se hace clic en un botón para descargar datos, el botón muestra un estado de descarga.** <br>
_Ajuste el atributo loading a true para mostrar el estado de descarga_

<iframe
	src="https://codesandbox.io/embed/docs-component-atom-button-loading-slkiy6?file=/src/App.vue?view=preview&hidenavigation=1&9"
	style="width:100%; height:250px; border:0; border-radius: 4px; overflow:hidden;"
	allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
	sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

#### Codigo

```vue
<template>
	<div>
		<el-button type="primary" :loading="true">Cargando</el-button>
	</div>
</template>
```

#### Codesandbox

<iframe
	src="https://codesandbox.io/embed/docs-component-atom-button-dcr72v?from-embed=&file=/src/App.vue?view=preview&hidenavigation=1&9"
	style="width:100%; height:850px; border:0; border-radius: 4px; overflow:auto;"
	allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
	sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

#### **Atributos**

|  Nombre  |                                Descriptión                                 | Valor por Defecto | Tipo de Valor |                 Valores aceptados                  |
| :------: | :------------------------------------------------------------------------: | :---------------: | :-----------: | :------------------------------------------------: |
|   text   |                    Contenido a mostrar dentro del Botón                    |         -         |    String     |                       Texto                        |
|   type   | El Botón tiene diferente tipos [ Primary, Success, Info, Warning, Danger ] |         -         |    String     | primary / success / warning / danger / info / text |
| disabled |       El atributo disabled determina su un botón esta deshabilitado        |       False       |    Boolean    |                         —                          |
|  plain   |                    determinar si es o no un botón plano                    |       False       |    Boolean    |                         —                          |
| loading  |    Ajuste el atributo loading a true para mostrar el estado de descarga    |       False       |    Boolean    |                         —                          |

#### **Estructura**

```bash
		└─ src                           # Código fuente principal
				└── components               # Componentes globales
								└─ Atoms             # Componentes Átomos
										└── buttom       # Componentes específicos del Botón
```

</spam>

<style>
:root {
--content-width: 1100px !important;
}
</style>
