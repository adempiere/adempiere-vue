(window.webpackJsonp=window.webpackJsonp||[]).push([[168],{363:function(t,a,s){"use strict";s.r(a);var e=s(0),n=Object(e.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"content"},[t._m(0),t._v(" "),s("p",[t._v("页面整体布局是一个产品最外层的框架结构，往往会包含导航、侧边栏、面包屑以及内容等。想要了解一个后台项目，先要了解它的基础布局。")]),t._v(" "),t._m(1),t._v(" "),t._m(2),t._v(" "),s("div",{staticClass:"tip custom-block"},[s("p",{staticClass:"custom-block-title"},[t._v("对应代码")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/adempiere/adempiere-vue/tree/master/src/layout",target:"_blank",rel:"noopener noreferrer"}},[t._v("@/layout"),s("OutboundLink")],1)])]),t._v(" "),s("p",[s("code",[t._v("@")]),t._v(" 是 webpack 的 "),s("a",{attrs:{href:"https://webpack.js.org/configuration/resolve/#resolve-alias",target:"_blank",rel:"noopener noreferrer"}},[t._v("alias"),s("OutboundLink")],1),t._v(" 不懂得请自行研究")]),t._v(" "),s("br"),t._v(" "),t._m(3),t._v(" "),t._m(4),s("p",[t._v("这里使用了 vue-router "),s("a",{attrs:{href:"https://router.vuejs.org/zh/guide/essentials/nested-routes.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("路由嵌套"),s("OutboundLink")],1),t._v(", 所以一般情况下，你增加或者修改页面只会影响 "),s("code",[t._v("app-main")]),t._v("这个主体区域。其它配置在 "),s("code",[t._v("layout")]),t._v(" 中的内容如：侧边栏或者导航栏都是不会随着你主体页面变化而变化的。")]),t._v(" "),t._m(5),t._m(6),t._v(" "),s("br"),t._v(" "),t._m(7),t._v(" "),s("div",{staticClass:"tip custom-block"},[s("p",{staticClass:"custom-block-title"},[t._v("对应代码")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/adempiere/adempiere-vue/blob/master/src/layout/components/AppMain.vue",target:"_blank",rel:"noopener noreferrer"}},[t._v("@/layout/components/AppMain"),s("OutboundLink")],1)])]),t._v(" "),s("p",[t._v("这里在 "),s("code",[t._v("app-main")]),t._v(" 外部包了一层 "),s("code",[t._v("keep-alive")]),t._v(" 主要是为了缓存 "),s("code",[t._v("<router-view>")]),t._v(" 的，配合页面的 "),s("code",[t._v("tabs-view")]),t._v(" 标签导航使用，如不需要可自行"),s("router-link",{attrs:{to:"./tags-view.html"}},[t._v("去除")]),t._v("。")],1),t._v(" "),s("p",[t._v("其中"),s("code",[t._v("transition")]),t._v(" 定义了页面之间切换动画，可以根据自己的需求，自行修改转场动画。相关"),s("a",{attrs:{href:"https://cn.vuejs.org/v2/guide/transitions.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("文档"),s("OutboundLink")],1),t._v("。默认提供了"),s("code",[t._v("fade")]),t._v("和"),s("code",[t._v("fade-transform")]),t._v("两个转场动画，具体 css 实现见"),s("a",{attrs:{href:"https://github.com/adempiere/adempiere-vue/blob/master/src/styles/transition.scss",target:"_blank",rel:"noopener noreferrer"}},[t._v("transition.scss"),s("OutboundLink")],1),t._v("。如果需要调整可在"),s("a",{attrs:{href:"https://github.com/adempiere/adempiere-vue/blob/master/src/layout/components/AppMain.vue",target:"_blank",rel:"noopener noreferrer"}},[t._v("AppMain.vue"),s("OutboundLink")],1),t._v("中调整"),s("code",[t._v("transition")]),t._v(" 的 "),s("code",[t._v("name")]),t._v("。")]),t._v(" "),s("br"),t._v(" "),t._m(8),t._v(" "),t._m(9),t._v(" "),t._m(10),t._v(" "),s("p",[t._v("我"),s("code",[t._v("创建")]),t._v("和"),s("code",[t._v("编辑")]),t._v("的页面使用的是同一个 component，默认情况下这两个页面切换时并不会触发 vue 的 created 或者 mounted 钩子，"),s("a",{attrs:{href:"https://router.vuejs.org/zh/guide/advanced/data-fetching.html#%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96",target:"_blank",rel:"noopener noreferrer"}},[t._v("官方说"),s("OutboundLink")],1),t._v("你可以通过 watch $route 的变化来进行处理，但说真的还是蛮麻烦的。后来发现其实可以简单的在 "),s("code",[t._v("router-view")]),t._v(" 上加上一个唯一的 key，来保证路由切换时都会重新渲染触发钩子了。这样简单的多了。")]),t._v(" "),t._m(11),s("div",{staticClass:"tip custom-block"},[s("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),t._m(12),t._v(" "),s("p",[t._v("示例代码："),s("a",{attrs:{href:"https://github.com/adempiere/adempiere-vue/tree/master/src/views/example",target:"_blank",rel:"noopener noreferrer"}},[t._v("@/views/example"),s("OutboundLink")],1)])]),t._v(" "),t._m(13),s("blockquote"),t._v(" "),t._m(14),t._v(" "),t._m(15),t._v(" "),t._m(16)])}),[function(){var t=this.$createElement,a=this._self._c||t;return a("h1",{attrs:{id:"布局"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#布局"}},[this._v("#")]),this._v(" 布局")])},function(){var t=this.$createElement,a=this._self._c||t;return a("h2",{attrs:{id:"layout"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#layout"}},[this._v("#")]),this._v(" Layout")])},function(){var t=this.$createElement,a=this._self._c||t;return a("p",[a("img",{attrs:{src:"https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/7066d74f-12c5-47d6-b6ad-f22b43fec917.png",alt:""}})])},function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("p",[s("code",[t._v("adempiere-vue")]),t._v(" 中大部分页面都是基于这个 "),s("code",[t._v("layout")]),t._v(" 的，除了个别页面如："),s("code",[t._v("login")]),t._v(" , "),s("code",[t._v("404")]),t._v(", "),s("code",[t._v("401")]),t._v(" 等页面没有使用该"),s("code",[t._v("layout")]),t._v("。如果你想在一个项目中有多种不同的"),s("code",[t._v("layout")]),t._v("也是很方便的，只要在一级路由那里选择不同的"),s("code",[t._v("layout")]),t._v("组件就行。")])},function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// No layout")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  path"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/401'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("component")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'errorPage/401'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Has layout")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  path"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/documentation'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 你可以选择不同的layout组件")]),t._v("\n  component"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Layout"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 这里开始对应的路由都会显示在app-main中 如上图所示")]),t._v("\n  children"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    path"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'index'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("component")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'documentation/index'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    name"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'documentation'")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])},function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[this._v("/foo                                  /bar\n+------------------+                  +-----------------+\n| layout           |                  | layout          |\n| +--------------+ |                  | +-------------+ |\n| | foo.vue      | |  +------------\x3e  | | bar.vue     | |\n| |              | |                  | |             | |\n| +--------------+ |                  | +-------------+ |\n+------------------+                  +-----------------+\n")])])])},function(){var t=this.$createElement,a=this._self._c||t;return a("p",[this._v("当然你也可以一个项目里面使用多个不同的 "),a("code",[this._v("layout")]),this._v("，只要在你想作用的路由父级上引用它就可以了。")])},function(){var t=this.$createElement,a=this._self._c||t;return a("h2",{attrs:{id:"app-main"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#app-main"}},[this._v("#")]),this._v(" app-main")])},function(){var t=this.$createElement,a=this._self._c||t;return a("h2",{attrs:{id:"router-view"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#router-view"}},[this._v("#")]),this._v(" router-view")])},function(){var t=this.$createElement,a=this._self._c||t;return a("p",[a("strong",[this._v("Different router the same component vue")]),this._v(" 真实的业务场景中，这种情况很多。比如：")])},function(){var t=this.$createElement,a=this._self._c||t;return a("p",[a("img",{attrs:{src:"https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/ac5047c9-cb75-4415-89e3-9386c42f3ef9.jpeg",alt:""}})])},function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("router"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("view "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("key"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"key"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("router"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("view"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n\ncomputed"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("key")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 只要保证 key 唯一性就可以了，保证不同页面的 key 不相同")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$route"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("fullPath\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])},function(){var t=this.$createElement,a=this._self._c||t;return a("p",[a("strong",[this._v("或者")]),this._v(" 可以像本项目中 "),a("code",[this._v("editForm")]),this._v(" 和 "),a("code",[this._v("createForm")]),this._v(" 声明两个不同的 view 但引入同一个 component。")])},function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"language-html extra-class"},[s("pre",{pre:!0,attrs:{class:"language-html"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("\x3c!-- create.vue --\x3e")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("template")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("article-detail")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v(":is-edit")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("'")]),t._v("false"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("'")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("article-detail")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v(" //create\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("template")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("script")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token script"}},[s("span",{pre:!0,attrs:{class:"token language-javascript"}},[t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" ArticleDetail "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./components/ArticleDetail'")]),t._v("\n")])]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("script")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("\x3c!-- edit.vue --\x3e")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("template")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n   "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("article-detail")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v(":is-edit")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("'")]),t._v("true"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("'")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("article-detail")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v(" //edit\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("template")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("script")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token script"}},[s("span",{pre:!0,attrs:{class:"token language-javascript"}},[t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" ArticleDetail "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./components/ArticleDetail'")]),t._v("\n")])]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("script")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])])},function(){var t=this.$createElement,a=this._self._c||t;return a("h2",{attrs:{id:"移动端"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#移动端"}},[this._v("#")]),this._v(" 移动端")])},function(){var t=this.$createElement,a=this._self._c||t;return a("p",[a("code",[this._v("element-ui")]),this._v(" 官方对自己的定位是桌面端后台框架，而且对于管理后台这种重交互的项目来说是不能通过简单的适配来满足桌面端和移动端两端不同的交互，所以真要做移动版后台，建议重新做一套系统。")])},function(){var t=this.$createElement,a=this._self._c||t;return a("p",[this._v("所以本项目也不会适配移动端，只是用"),a("code",[this._v("media query")]),this._v("做了一点简单的响应式布局，有需求请自行修改。")])}],!1,null,null,null);a.default=n.exports}}]);