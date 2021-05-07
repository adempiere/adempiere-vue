(window.webpackJsonp=window.webpackJsonp||[]).push([[77],{274:function(t,e,s){"use strict";s.r(e);var a=s(0),n=Object(a.a)({},(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"content"},[t._m(0),t._v(" "),t._m(1),t._v(" "),s("p",[t._v("When projects are completed, you can build your application only run one command:")]),t._v(" "),t._m(2),t._m(3),t._v(" "),s("p",[t._v("If you need a custom build, such as specifying the dist directory, you need to configure it through "),s("code",[t._v("outputDir")]),t._v(" in "),s("a",{attrs:{href:"https://github.com/adempiere/adempiere-vue/blob/master/vue.config.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("config"),s("OutboundLink")],1),t._v(".")]),t._v(" "),t._m(4),t._v(" "),s("p",[t._v("The configuration of all test environments or formal environment variables is in the "),s("code",[t._v(".env.xxxx")]),t._v(" file such as "),s("a",{attrs:{href:"https://github.com/adempiere/adempiere-vue/blob/master/.env.development",target:"_blank",rel:"noopener noreferrer"}},[t._v(".env.development"),s("OutboundLink")],1),t._v(".")]),t._v(" "),t._m(5),t._v(" "),s("div",{staticClass:"tip custom-block"},[s("p",{staticClass:"custom-block-title"},[t._v("note! ! !")]),t._v(" "),t._m(6),t._v(" "),s("p",[t._v("You can access them in your application code:")]),t._v(" "),t._m(7),t._m(8),t._v(" "),t._m(9),t._v(" "),t._m(10),s("p",[t._v("After running you can see the specific size distribution at "),s("a",{attrs:{href:"http://localhost:9526/report.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("http://localhost:9526/report.html"),s("OutboundLink")],1)]),t._v(" "),t._m(11),t._v(" "),t._m(12)]),t._v(" "),t._m(13),t._v(" "),t._m(14),t._v(" "),t._m(15),t._v(" "),t._m(16),t._m(17),t._v(" "),t._m(18),t._v(" "),s("p",[t._v("Simply speaking, the difference between them is the deal with routing. "),s("code",[t._v("hashHistory")]),t._v(" is processed by the path following "),s("code",[t._v("#")]),t._v(", front-end routing management through "),s("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/API/History_API",target:"_blank",rel:"noopener noreferrer"}},[t._v("HTML 5 History"),s("OutboundLink")],1),t._v(", and "),s("code",[t._v("browserHistory")]),t._v(" is similar to our usual page access path, and with not "),s("code",[t._v("#")]),t._v(", but must through the server's configuration.")]),t._v(" "),t._m(19),t._v(" "),t._m(20),t._v(" "),t._m(21),s("div",{staticClass:"tip custom-block"},[s("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),s("p",[t._v("Detail see "),s("a",{attrs:{href:"https://router.vuejs.org/zh-cn/essentials/history-mode.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("vue-router document"),s("OutboundLink")],1)])]),t._v(" "),t._m(22),t._v(" "),t._m(23),t._v(" "),s("ul",[s("li",[s("a",{attrs:{href:"https://hub.docker.com/r/erpya/adempiere-grpc-all-in-one",target:"_blank",rel:"noopener noreferrer"}},[t._v("ADempiere gRPC"),s("OutboundLink")],1)])]),t._v(" "),t._m(24),s("ul",[s("li",[s("a",{attrs:{href:"https://hub.docker.com/r/erpya/proxy-adempiere-api",target:"_blank",rel:"noopener noreferrer"}},[t._v("Proxy ADempiere API"),s("OutboundLink")],1)])]),t._v(" "),t._m(25),s("ul",[s("li",[s("a",{attrs:{href:"https://hub.docker.com/r/erpya/adempiere-vue",target:"_blank",rel:"noopener noreferrer"}},[t._v("ADempiere Vue"),s("OutboundLink")],1)])]),t._v(" "),t._m(26),s("ul",[s("li",[s("a",{attrs:{href:"https://hub.docker.com/r/erpya/adempiere-ecommerce",target:"_blank",rel:"noopener noreferrer"}},[t._v("ADempiere eCommerce"),s("OutboundLink")],1)])]),t._v(" "),t._m(27),t._m(28),t._v(" "),t._m(29),t._m(30),t._v(" "),t._m(31),s("p",[t._v("Containers Running:")]),t._v(" "),t._m(32)])}),[function(){var t=this.$createElement,e=this._self._c||t;return e("h1",{attrs:{id:"build-deploy"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#build-deploy"}},[this._v("#")]),this._v(" Build & Deploy")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"build"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#build"}},[this._v("#")]),this._v(" Build")])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# build for production environment")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" run build:prod\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# build for stage environment")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" run build:stage\n")])])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("p",[t._v("After the build package is successful, the "),s("code",[t._v("dist")]),t._v(" folder will be generated in the root directory, which is to build a packaged file, usually static files such as "),s("code",[t._v("***.js")]),t._v(", "),s("code",[t._v("***.css")]),t._v(", "),s("code",[t._v("index.html")]),t._v(", etc. .")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h3",{attrs:{id:"environmental-variables"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#environmental-variables"}},[this._v("#")]),this._v(" Environmental variables")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("They all inject into the global context via the "),e("code",[this._v("webpack.DefinePlugin")]),this._v(" plug-ins.")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("Environment variables must start with "),e("code",[this._v("VUE_APP_")]),this._v(". Such as: "),e("code",[this._v("VUE_APP_API")]),this._v(", "),e("code",[this._v("VUE_APP_TITLE")])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("process"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("env"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("VUE_APP_xxxx"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h3",{attrs:{id:"analyze-the-build-file-size"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#analyze-the-build-file-size"}},[this._v("#")]),this._v(" Analyze the build file size")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("If your build file is large, you can optimize your code by building and analyzing the size distribution of dependent modules using the "),e("code",[this._v("webpack-bundle-analyzer")]),this._v(".")])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token function"}},[this._v("npm")]),this._v(" run preview -- --report\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[e("img",{attrs:{src:"https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/3fddf034-2b38-4299-b0d2-b748fb2abef0.jpg",alt:""}})])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"tip custom-block"},[e("p",{staticClass:"custom-block-title"},[this._v("TIP")]),this._v(" "),e("p",[this._v("It is recommended to use gzip, after using the volume will be only the original 1/3 or so. You can also use lazy loading or Code Splitting.")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"publish"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#publish"}},[this._v("#")]),this._v(" Publish")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("For publishing, you only have to publish the resulting static file after build, which is usually the static file in the "),e("code",[this._v("dist")]),this._v(" folder, to your cdn or static server. Note that the "),e("code",[this._v("index.html")]),this._v(" usually will be an entry page for your backend service. You may need to change the page's import path after determining static for JS and css.")])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"tip custom-block"},[e("p",{staticClass:"custom-block-title"},[this._v("TIP")]),this._v(" "),e("p",[this._v("In deployment may find that the resource path is wrong, just modify the "),e("code",[this._v("@/config/index.js")]),this._v(" file resource path.")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[this._v("// changes configure depending on your own path")]),this._v("\npublicPath"),e("span",{pre:!0,attrs:{class:"token operator"}},[this._v(":")]),this._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[this._v("'./'")]),this._v("\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h3",{attrs:{id:"router-server"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#router-server"}},[this._v("#")]),this._v(" Router & Server")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("In adempiere-vue, the front-end routing uses "),e("code",[this._v("vue-router")]),this._v(", so you have two options:"),e("code",[this._v("browserHistory")]),this._v(" and "),e("code",[this._v("hashHistory")]),this._v(".")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("This project uses "),e("code",[this._v("hashHistory")]),this._v(" by default, so if you have"),e("code",[this._v("#")]),this._v("in your url and you want to get rid of it, you need to switch to"),e("code",[this._v("browserHistory")]),this._v(".")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("Modify "),e("code",[this._v("src/router/index.js")]),this._v(" mode。")])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("default")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Router")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// mode: 'history' // Need backend support")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"deploy-all-ecosystem"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#deploy-all-ecosystem"}},[this._v("#")]),this._v(" Deploy All Ecosystem")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h3",{attrs:{id:"for-all-enviroment-you-should-run-the-follow-images"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#for-all-enviroment-you-should-run-the-follow-images"}},[this._v("#")]),this._v(" For all enviroment you should run the follow images:")])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"language-shell extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[this._v("docker pull erpya/adempiere-grpc-all-in-one\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"language-shell extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[this._v("docker pull erpya/proxy-adempiere-api\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"language-shell extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[this._v("docker pull erpya/adempiere-vue\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"language-shell extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[this._v("docker pull erpya/adempiere-ecommerce\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h3",{attrs:{id:"run-docker-stack"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#run-docker-stack"}},[this._v("#")]),this._v(" Run Docker Stack")])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"language-yaml extra-class"},[s("pre",{pre:!0,attrs:{class:"language-yaml"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# docker-compose.yaml")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("version")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'3.7'")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("services")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("grpc-backend")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("image")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" erpya/adempiere"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("grpc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("all"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("in"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("one\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("container_name")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" adempiere"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("backend\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("stdin_open")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("true")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("tty")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("true")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("environment")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" SERVER_PORT=50059\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" SERVICES_ENABLED=access; business; core; dashboarding; dictionary; enrollment; log; ui; workflow; store; pos; updater;\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" SERVER_LOG_LEVEL=WARNING\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" DB_HOST=postgres_host\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" DB_PORT=5432\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" DB_NAME=adempiere\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" DB_USER=adempiere\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" DB_PASSWORD=adempiere\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" DB_TYPE=PostgreSQL\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("ports")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" 50059"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("50059")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("redis")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("image")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" redis"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("4"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("alpine\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("container_name")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" adempiere"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("redis\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("stdin_open")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("true")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("tty")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("true")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("ports")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'6379:6379'")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("es7")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("image")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" docker.elastic.co/elasticsearch/elasticsearch"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("7.3.2\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("container_name")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" adempiere"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("eslastic"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("search\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("ulimits")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("memlock")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("soft")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("-1")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("hard")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("-1")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("volumes")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" ./elasticsearch.yml"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("/usr/share/elasticsearch/config/elasticsearch.yml"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("ro\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("ports")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'9200:9200'")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'9300:9300'")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("environment")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" discovery.type=single"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("node\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" cluster.name=docker"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("cluster\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" bootstrap.memory_lock=true\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" ES_JAVA_OPTS="),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("Xmx512m "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("Xms512m\n\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("api-rest")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("image")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" erpya/proxy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("adempiere"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("api\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("container_name")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" adempiere"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("proxy\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("depends_on")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" es7\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" redis\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("stdin_open")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("true")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("tty")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("true")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("environment")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" SERVER_PORT=8085\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" AD_DEFAULT_HOST=adempiere"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("backend\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" AD_DEFAULT_PORT=50059\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" ES_HOST=adempiere"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("eslastic"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("search\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" ES_PORT=9200\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" VS_ENV=dev\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" INDEX=vue_storefront_catalog\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" RESTORE_DB=N\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("ports")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" 8085"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("8085")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("vue-app")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("image")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" erpya/adempiere"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("vue\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("container_name")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" adempiere"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("frontend\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("stdin_open")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("true")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("tty")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("true")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("environment")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" API_URL=http"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("//adempiere"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("proxy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("8085")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("ports")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" 9526"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("e-commerce")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("image")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" erpya/adempiere"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("ecommerce\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("container_name")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" adempiere"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("ecommerce\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("stdin_open")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("true")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("tty")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("true")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("environment")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" SERVER_PORT=3000\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" API_URL=http"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("//adempiere"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("proxy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("8085")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" STORE_INDEX=vue_storefront_catalog\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" VS_ENV=dev\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("ports")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" 3000"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3000")]),t._v("\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("Note: Eslastic Search container requires a config file "),e("code",[this._v("elasticsearch.yaml")]),this._v(".")])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"language-shell extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[this._v("# requires superuser permissions of the operating system ('su' or 'sudo')")]),this._v("\ndocker-compose up\n")])])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("ul",[s("li",[t._v("adempiere-backend")]),t._v(" "),s("li",[t._v("adempiere-redis")]),t._v(" "),s("li",[t._v("adempiere-eslastic-search")]),t._v(" "),s("li",[t._v("adempiere-proxy")]),t._v(" "),s("li",[t._v("adempiere-frontend")]),t._v(" "),s("li",[t._v("adempiere-ecommerce")])])}],!1,null,null,null);e.default=n.exports}}]);