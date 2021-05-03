(window.webpackJsonp=window.webpackJsonp||[]).push([[79],{276:function(t,s,e){"use strict";e.r(s);var a=e(0),n=Object(a.a)({},(function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"content"},[t._m(0),t._v(" "),t._m(1),t._v(" "),t._m(2),t._v(" "),t._m(3),t._v(" "),t._m(4),t._v(" "),t._m(5),t._m(6),t._v(" "),e("p",[e("code",[t._v("@/utils/request.js")]),t._v(" is based on the "),e("a",{attrs:{href:"https://github.com/axios/axios",target:"_blank",rel:"noopener noreferrer"}},[t._v("axios"),e("OutboundLink")],1),t._v(", to facilitate the uniform handling of POST, GET and other request parameters, request headers, and error messages。Specific can see "),e("a",{attrs:{href:"https://github.com/adempiere/adempiere-vue/blob/master/src/utils/request.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("request.js"),e("OutboundLink")],1),t._v(".")]),t._v(" "),t._m(7),t._v(" "),t._m(8),t._v(" "),t._m(9),t._m(10),t._v(" "),e("p",[t._v("We can request multiple api addresses by setting multiple "),e("code",[t._v("baseURL")]),t._v("s through "),e("router-link",{attrs:{to:"/guide/essentials/deploy.html"}},[t._v("environment variables")]),t._v(".")],1),t._v(" "),t._m(11),e("p",[t._v("Then create an "),e("code",[t._v("axios")]),t._v(" instance based on the environment variable, giving it a different "),e("code",[t._v("baseURL")]),t._v(" "),e("a",{attrs:{href:"https://github.com/adempiere/adempiere-vue/blob/master/src/utils/request.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("@/utils/request.js"),e("OutboundLink")],1)]),t._v(" "),t._m(12),e("p",[t._v("Or")]),t._v(" "),t._m(13),t._m(14),t._v(" "),e("p",[t._v("See "),e("router-link",{attrs:{to:"./mock-api.html"}},[t._v("Mock Data")])],1)])}),[function(){var t=this.$createElement,s=this._self._c||t;return s("h1",{attrs:{id:"work-with-server"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#work-with-server"}},[this._v("#")]),this._v(" Work with Server")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"front-end-request-flow"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#front-end-request-flow"}},[this._v("#")]),this._v(" Front-end request flow")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("In "),s("code",[this._v("adempiere-vue")]),this._v(" , a complete front-end UI interacts to the server-side processing flow as follows:")])},function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("ol",[e("li",[t._v("UI component interaction;")]),t._v(" "),e("li",[t._v("Call unified management API service request function;")]),t._v(" "),e("li",[t._v("Send requests using encapsulated request.js;")]),t._v(" "),e("li",[t._v("Get server return;")]),t._v(" "),e("li",[t._v("Update data;")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("As you can see from the above flow, in order to facilitate management and maintenance, unified request processing is placed in the "),s("code",[this._v("src/api")]),this._v(" folder and the files are generally split according to the model latitude,such as:")])},function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[this._v("api/\n  login.js\n  article.js\n  remoteSearch.js\n  ...\n")])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"request-js"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#request-js"}},[this._v("#")]),this._v(" request.js")])},function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("p",[t._v("It encapsulates the global "),e("code",[t._v("request interceptor")]),t._v(", "),e("code",[t._v("response interceptor")]),t._v(","),e("code",[t._v("unified error handling")]),t._v(", "),e("code",[t._v("unified timeout, baseURL settings, etc.")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"an-example-of-a-request-article-list"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#an-example-of-a-request-article-list"}},[this._v("#")]),this._v(" An example of a request article list:")])},function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// api/article.js")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" request "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'../utils/request'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("fetchList")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("query")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("request")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    url"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/article/list'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    method"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'get'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    params"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" query\n  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// views/example/list")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" fetchList "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'@/api/article'")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("default")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("data")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    list"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    listLoading"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  methods"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("fetchData")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("listLoading "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),t._v("\n      "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("fetchList")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("then")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("response")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("list "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" response"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("items\n        "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("listLoading "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),t._v("\n      "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"set-multiple-baseurls"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#set-multiple-baseurls"}},[this._v("#")]),this._v(" Set multiple baseURLs")])},function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# .env.development")]),t._v("\nVUE_APP_BASE_API "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/dev-api'")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("#Inject the root path of the api")]),t._v("\nVUE_APP_BASE_API2 "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/dev-api2'")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("#Inject the root path of the api")]),t._v("\n")])])])},function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// create an axios instance")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" service "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" axios"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("create")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  baseURL"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" process"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("env"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token constant"}},[t._v("BASE_API")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// api base_url")]),t._v("\n  timeout"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("5000")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// request timeout")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" service2 "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" axios"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("create")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  baseURL"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" process"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("env"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token constant"}},[t._v("BASE_API2")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// api base_url")]),t._v("\n  timeout"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("5000")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// request timeout")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])},function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("fetchList")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("query")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("request")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    url"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/article/list'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    method"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'get'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    params"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" query"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    baseURL"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'xxxx'")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// direct coverage")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"switch-from-mock-directly-to-server-request"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#switch-from-mock-directly-to-server-request"}},[this._v("#")]),this._v(" Switch from mock directly to server request")])}],!1,null,null,null);s.default=n.exports}}]);