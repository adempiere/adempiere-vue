(window.webpackJsonp=window.webpackJsonp||[]).push([[120],{315:function(t,e,s){"use strict";s.r(e);var n=s(0),_=Object(n.a)({},(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"content"},[t._m(0),t._v(" "),t._m(1),t._v(" "),s("p",[s("a",{attrs:{href:"https://cli.vuejs.org/zh/guide/mode-and-env.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("官方文档"),s("OutboundLink")],1)]),t._v(" "),t._m(2),s("p",[t._v("一个环境文件只包含环境变量的“键=值”对：")]),t._v(" "),t._m(3),t._m(4),t._v(" "),t._m(5),t._v(" "),t._m(6),t._v(" "),t._m(7),t._v(" "),t._m(8),t._v(" "),t._m(9),t._v(" "),s("p",[t._v("具体代码可借鉴"),s("a",{attrs:{href:"https://github.com/adempiere/adempiere-vue/blob/master/vue.config.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("vue.config.js"),s("OutboundLink")],1)])])}),[function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"环境变量"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#环境变量"}},[this._v("#")]),this._v(" 环境变量")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[e("code",[this._v("adempiere-vue")]),this._v(" 4.0 之后是基于 "),e("code",[this._v("vue-cli")]),this._v("来进行构建，所以所有的环境变量配置都是基于"),e("code",[this._v("vue-cli")]),this._v("来实现和控制的。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[this._v(".env                # 在所有的环境中被载入\n.env.[mode]         # 只在指定的模式中被载入\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[this._v("FOO=bar\nVUE_APP_SECRET=secret\n")])])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"tip custom-block"},[s("p",{staticClass:"custom-block-title"},[t._v("注意！！！")]),t._v(" "),s("p",[t._v("环境变量必须以"),s("code",[t._v("VUE_APP_")]),t._v("为开头。如:"),s("code",[t._v("VUE_APP_API")]),t._v("、"),s("code",[t._v("VUE_APP_TITLE")])]),t._v(" "),s("p",[t._v("你在代码中可以通过如下方式获取:")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("process"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("env"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("VUE_APP_xxxx"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("除了 "),e("code",[this._v("VUE_APP_*")]),this._v(" 变量之外，在你的应用代码中始终可用的还有两个特殊的变量：")])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("ul",[s("li",[s("code",[t._v("NODE_ENV")]),t._v(' - 会是 "development"、"production" 或 "test" 中的一个。具体的值取决于应用运行的模式。')]),t._v(" "),s("li",[s("code",[t._v("BASE_URL")]),t._v(" - 会和 "),s("code",[t._v("vue.config.js")]),t._v(" 中的 "),s("code",[t._v("publicPath")]),t._v(" 选项相符，即你的应用会部署到的基础路径。")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h3",{attrs:{id:"构建相关"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#构建相关"}},[this._v("#")]),this._v(" 构建相关")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("除了一些写在"),e("code",[this._v(".env")]),this._v("的环境变量之外，还有一些构建和部署相关的变量都是需要在"),e("code",[this._v("vue.config.js")]),this._v("中配置的。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("你可以通过"),e("code",[this._v("process.env.NODE_ENV")]),this._v("来执行判断环境，来设置不同的参数。")])}],!1,null,null,null);e.default=_.exports}}]);