# 进程

进程 "组件显示一个简约的视图，它由多个参数组成，用于执行当前的进程。这个组件也有动态验证和可视化的字段。

#

## ADempye-ZK 桌面版流程

<img :src="$withBase('/images/components/process/zk.png')" alt="Procesos en Versión de Escritorio ZK" width="600px">

## ADempier-Vue 桌面版进程

<img :src="$withBase('/images/components/process/vue.png')" alt="Procesos en Versión Escritorio" width="600px">

## ADempier-Vue 移动版进程

<img :src="$withBase('/images/components/process/vue-mobile.png')" alt="Procesos en Versión Móvil" width="600px">

这个组件也有一个位于右上方的菜单。它由 3 个选项组成。执行、关系和参考。

## **过程组件菜单**

<img :src="$withBase('/images/components/process/menu-process.png')" alt="Menu de Procesos en Versión Escritorio" width="800px">

- **执行：**这个选项有当前进程的所有执行情况，用蓝色背景标识。这个选项既是一个快速运行，也是一个带有进程名称和描述的下拉列表。默认情况下，运行列表中的主要行动总是排在第一位。
  <br>
  <img :src="$withBase('/images/components/process/menu-action.gif')" alt="Procesos en Versión Escritorio" width="800px">
- **关系：**这个选项有所有与当前进程有关的窗口、进程、智能浏览器和报告。在有关系的情况下，这个选项有一个下拉列表，当选择一个选项时，将重定向到所选的选项，这个选项以绿色背景标识。
  <img :src="$withBase('/images/components/process/menu-releations.gif')" alt="Procesos en Versión Escritorio" width="800px">
  <br>
- **参考资料：**该选项对进程来说是禁用的，因为它与它们的操作无关，该选项以橙色背景标识。
  <img :src="$withBase('/images/components/process/menu-referens.gif')" alt="Procesos en Versión Escritorio" width="800px">

## 显示字段

为了获得更简约、更简单的视图，流程组件中的字段虽然保持相同的顺序，但默认是隐藏的，除非该字段有默认值或者是强制性的。

<img :src="$withBase('/images/components/process/field.gif')" width="800px">

## ¿如何在桌面版中使用?

在桌面版中，你必须填写所有需要的字段，然后到菜单上执行这个过程。

<img :src="$withBase('/images/components/process/run-process.gif')" />

## ¿如何在移动版中使用?

在桌面版中，你必须填写所有需要的字段，然后到菜单上执行这个过程。

<img :src="$withBase('/images/components/process/run-process-mobile.gif')"  width="800px"/>
