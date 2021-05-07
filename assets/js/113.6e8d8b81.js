(window.webpackJsonp=window.webpackJsonp||[]).push([[113],{308:function(t,e,s){"use strict";s.r(e);var a=s(0),n=Object(a.a)({},(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"content"},[t._m(0),t._v(" "),s("p",[t._v("本项目基于 element-ui 默认视觉风格搭建了。如果对视觉风格有额外的要求可以按照"),s("a",{attrs:{href:"http://element-cn.eleme.io/#/zh-CN/component/custom-theme",target:"_blank",rel:"noopener noreferrer"}},[t._v("官方自定义主题指导"),s("OutboundLink")],1),t._v("。该方案是通过样式变量覆盖的方式。")]),t._v(" "),t._m(1),t._v(" "),s("p",[t._v("element-ui 的通用样式变量可能无法满足所有定制需求，你可以通过覆盖默认的组件样式的方式实现。\n由于 element-ui 的样式我们是在全局引入的，所以你想在某个"),s("code",[t._v("view")]),t._v("里面覆盖它的样式就不能加 scoped，但你又想只覆盖这个页面的 element 样式，你就可在它的父级加一个 class，以用命名空间来解决问题。或者使用"),s("a",{attrs:{href:"https://vue-loader.vuejs.org/zh/guide/scoped-css.html#%E6%B7%B1%E5%BA%A6%E4%BD%9C%E7%94%A8%E9%80%89%E6%8B%A9%E5%99%A8",target:"_blank",rel:"noopener noreferrer"}},[t._v("深度作用选择器"),s("OutboundLink")],1),t._v("。")]),t._v(" "),t._m(2),s("p",[t._v("一些全局的 element-ui 样式修改可以在 "),s("a",{attrs:{href:"https://github.com/adempiere/adempiere-vue/blob/master/src/styles/element-ui.scss",target:"_blank",rel:"noopener noreferrer"}},[t._v("@/styles/element-ui.scss"),s("OutboundLink")],1),t._v(" 中进行设置。")]),t._v(" "),s("br"),t._v(" "),t._m(3),t._v(" "),s("p",[t._v("本项目提供了两种动态换肤的功能，各有利弊，请结合个人需求自行选择。")]),t._v(" "),t._m(4),t._v(" "),s("p",[t._v("element-ui 升级为 2.0 之后官方文档的右上角提供了动态换肤的功能，本项目也提供了该功能。\n代码地址："),s("a",{attrs:{href:"https://github.com/adempiere/adempiere-vue/blob/master/src/components/ThemePicker/index.vue",target:"_blank",rel:"noopener noreferrer"}},[t._v("@/components/ThemePicker"),s("OutboundLink")],1),t._v("。")]),t._v(" "),s("p",[s("strong",[t._v("简单说明一下它的原理：")]),t._v("\nelement-ui 2.0 版本之后所有的样式都是基于 SCSS 编写的，所有的颜色都是基于几个基础颜色"),s("a",{attrs:{href:"https://github.com/adempiere/custom-element-theme/blob/master/element-variables.scss",target:"_blank",rel:"noopener noreferrer"}},[t._v("变量"),s("OutboundLink")],1),t._v("来设置的，所以就不难实现动态换肤了，只要找到那几个颜色变量修改它就可以了。\n首先我们需要拿到通过 "),s("code",[t._v("package.json")]),t._v(" 拿到 element-ui 的版本号，根据该版本号去请求相应的样式。拿到样式之后将样色，通过正则匹配和替换，将颜色变量替换成你需要的，之后动态添加 "),s("code",[t._v("style")]),t._v(" 标签来覆盖原有的 css 样式。")]),t._v(" "),t._m(5),t._v(" "),t._m(6),t._m(7),t._v(" "),s("p",[t._v("在项目中引入 ThemePicker 组件即可")]),t._v(" "),t._m(8),t._m(9),t._v(" "),s("br"),t._v(" "),s("br"),t._v(" "),t._m(10),t._v(" "),t._m(11),t._v(" "),t._m(12),t._v(" "),s("blockquote",[s("p",[t._v("我们这里基于官方的主题生成库 "),s("a",{attrs:{href:"https://github.com/ElementUI/element-theme",target:"_blank",rel:"noopener noreferrer"}},[t._v("element-theme"),s("OutboundLink")],1),t._v(" 进行了相应的改造。")])]),t._v(" "),s("p",[t._v("首先我们下载 "),s("a",{attrs:{href:"https://github.com/adempiere/custom-element-theme",target:"_blank",rel:"noopener noreferrer"}},[t._v("custom-element-theme"),s("OutboundLink")],1),t._v(" 项目")]),t._v(" "),t._m(13),s("p",[t._v("之后全局安装主题生成工具")]),t._v(" "),t._m(14),s("p",[t._v("进入项目目录 安装相关依赖")]),t._v(" "),t._m(15),t._m(16),t._v(" "),s("div",{staticClass:"tip custom-block"},[s("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),s("p",[t._v("如果需要修改打包生成样式命名空间的名字 只要修改该"),s("a",{attrs:{href:"https://github.com/adempiere/custom-element-theme/blob/master/gulpfile.js#L6",target:"_blank",rel:"noopener noreferrer"}},[t._v("变量"),s("OutboundLink")],1),t._v("即可")])]),t._v(" "),t._m(17),t._v(" "),s("p",[s("a",{attrs:{href:"https://segmentfault.com/a/1190000009762198#articleHeader2",target:"_blank",rel:"noopener noreferrer"}},[t._v("更多动态换肤文章"),s("OutboundLink")],1)])])}),[function(){var t=this.$createElement,e=this._self._c||t;return e("h1",{attrs:{id:"更换主题"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#更换主题"}},[this._v("#")]),this._v(" 更换主题")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"样式覆盖"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#样式覆盖"}},[this._v("#")]),this._v(" 样式覆盖")])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"language-css extra-class"},[s("pre",{pre:!0,attrs:{class:"language-css"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* 你的命名空间 */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token selector"}},[t._v(".article-page")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* element-ui 元素 */")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token selector"}},[t._v(".el-tag")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v("margin-right")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" 0px"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"动态换肤"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#动态换肤"}},[this._v("#")]),this._v(" 动态换肤")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h3",{attrs:{id:"element-ui-官方文档页面-换肤方式"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#element-ui-官方文档页面-换肤方式"}},[this._v("#")]),this._v(" element-ui 官方文档页面 换肤方式")])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"tip custom-block"},[e("p",{staticClass:"custom-block-title"},[this._v("TIP")]),this._v(" "),e("p",[this._v("这里需要获取 element-ui 的版本号，从而锁定版本，以免将来 Element 升级时受到非兼容性更新的影响。")])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" version "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'element-ui/package.json'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("version\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" url "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token template-string"}},[s("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("https://unpkg.com/element-ui@")]),s("span",{pre:!0,attrs:{class:"token interpolation"}},[s("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("${")]),t._v("version"),s("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("}")])]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("/lib/theme-chalk/index.css")]),s("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getCSSString")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("url"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" chalkHandler"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'chalk'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getCSSString")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("url"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" callback"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" variable")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" xhr "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("XMLHttpRequest")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  xhr"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("onreadystatechange")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("xhr"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("readyState "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("===")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("4")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&&")]),t._v(" xhr"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("status "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("===")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("200")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("variable"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" xhr"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("responseText"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("replace")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token regex"}},[s("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[t._v("/")]),s("span",{pre:!0,attrs:{class:"token regex-source language-regex"}},[t._v("@font-face{[^}]+}")]),s("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[t._v("/")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("''")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("callback")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  xhr"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("open")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'GET'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" url"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  xhr"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("send")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[e("strong",[this._v("使用方式")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[this._v("import")]),this._v(" ThemePicker "),e("span",{pre:!0,attrs:{class:"token keyword"}},[this._v("from")]),this._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[this._v("'@/components/ThemePicker'")]),this._v("\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("优点\n"),e("ul",[e("li",[this._v("无需准备多套主题，可以自由动态换肤")])])]),this._v(" "),e("li",[this._v("缺点\n"),e("ul",[e("li",[this._v("自定义不够，只支持基础颜色的切换")])])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h3",{attrs:{id:"多套主题换肤"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#多套主题换肤"}},[this._v("#")]),this._v(" 多套主题换肤")])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("p",[t._v("本方法就是最常见的换肤方式，本地存放多套主题，两者有不同的命名空间，如写两套主题，一套叫 "),s("code",[t._v("day-theme")]),t._v(" ，一套叫 "),s("code",[t._v("night-theme")]),t._v(" ，"),s("code",[t._v("night-theme")]),t._v(" 主题都在一个 "),s("code",[t._v(".night-theme")]),t._v(" 的命名空间下，我们动态的在 body 上 add "),s("code",[t._v(".night-theme")]),t._v(" ; remove "),s("code",[t._v(".night-theme")]),t._v("。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h4",{attrs:{id:"使用"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#使用"}},[this._v("#")]),this._v(" 使用")])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[this._v("git@github.com:PanJiaChen/custom-element-theme.git\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token function"}},[this._v("npm")]),this._v(" i element-theme -g\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token function"}},[this._v("npm")]),this._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[this._v("install")]),this._v("\n")])])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("p",[t._v("首先执行 "),s("code",[t._v("et -i")]),t._v(" 生成 "),s("code",[t._v("element-variables.scss")]),t._v(" 存放样式变量的文件，然后进入 "),s("code",[t._v("element-variables.scss")]),t._v(" 文件 修改你自己需要的变量，修改完成之后执行 "),s("code",[t._v("et")]),t._v(" ， 编译主题，最后执行"),s("code",[t._v("gulp")]),t._v(" 生成命名空间。所有生成文件在 "),s("code",[t._v("dist")]),t._v(" 目录下，你只需复制文件下所有内容到 "),s("code",[t._v("adempiere-vue")]),t._v(" 项目中 "),s("code",[t._v("src/assets/custom-theme")]),t._v(" 进行覆盖替换就行")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[e("img",{attrs:{src:"https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/0726b472-90f4-4fe9-a665-26fb8f9795c3.gif",alt:""}})])}],!1,null,null,null);e.default=n.exports}}]);