(window.webpackJsonp=window.webpackJsonp||[]).push([[67],{264:function(t,e,s){"use strict";s.r(e);var a=s(0),n=Object(a.a)({},(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"content"},[t._m(0),t._v(" "),t._m(1),t._v(" "),s("p",[t._v("Import and export of Excel is implemented by relying on "),s("a",{attrs:{href:"https://github.com/SheetJS/js-xlsx",target:"_blank",rel:"noopener noreferrer"}},[t._v("js-xlsx"),s("OutboundLink")],1),t._v(".")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/adempiere/adempiere-vue/blob/master/src/vendor/Export2Excel.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("Export2Excel.js"),s("OutboundLink")],1),t._v(" is packaged on the on "),s("code",[t._v("js-xlsx")]),t._v(" to facilitate exporting data.")]),t._v(" "),t._m(2),t._v(" "),t._m(3),t._v(" "),s("p",[t._v("So you first need to install the following command:")]),t._v(" "),t._m(4),t._m(5),t._v(" "),t._m(6),s("div",{staticClass:"warning custom-block"},[s("p",{staticClass:"custom-block-title"},[t._v("Warning "),s("Badge",{attrs:{text:"v3.9.1+"}})],1),t._v(" "),s("p",[t._v("The compatibility code for Blob has been removed in the later versions of "),s("code",[t._v("v3.9.1+")]),t._v(". If you need to be compatible with very low-level browsers, you can manually introduce "),s("a",{attrs:{href:"https://www.npmjs.com/package/blob-polyfill",target:"_blank",rel:"noopener noreferrer"}},[t._v("blob-polyfill"),s("OutboundLink")],1),t._v(" .")])]),t._v(" "),t._m(7),t._v(" "),s("table",[t._m(8),t._v(" "),s("tbody",[t._m(9),t._v(" "),t._m(10),t._v(" "),t._m(11),t._v(" "),t._m(12),t._v(" "),s("tr",[s("td",[t._v("bookType")]),t._v(" "),s("td",[t._v("Export file type")]),t._v(" "),s("td",[t._v("String")]),t._v(" "),s("td",[t._v("xlsx, csv, txt, "),s("a",{attrs:{href:"https://github.com/SheetJS/js-xlsx#supported-output-formats",target:"_blank",rel:"noopener noreferrer"}},[t._v("more"),s("OutboundLink")],1)]),t._v(" "),s("td",[t._v("xlsx")])])])]),t._v(" "),t._m(13),t._v(" "),t._m(14),s("ul",[s("li",[s("a",{attrs:{href:"https://adempiere.github.io/adempiere-vue/#/excel/export-excel",target:"_blank",rel:"noopener noreferrer"}},[t._v("Online Demo"),s("OutboundLink")],1)]),t._v(" "),s("li",[s("a",{attrs:{href:"https://github.com/adempiere/adempiere-vue/blob/master/src/views/excel/export-excel.vue",target:"_blank",rel:"noopener noreferrer"}},[t._v("Online Code"),s("OutboundLink")],1)])]),t._v(" "),t._m(15),t._v(" "),s("p",[t._v("Encapsulated "),s("a",{attrs:{href:"https://github.com/adempiere/adempiere-vue/blob/master/src/components/UploadExcel/index.vue",target:"_blank",rel:"noopener noreferrer"}},[t._v("UploadExcel"),s("OutboundLink")],1),t._v(" Excel import component, support click and drag upload, also it is also Depends on "),s("code",[t._v("js-xlsx")]),t._v(".")]),t._v(" "),s("p",[t._v("It provides two callback functions:")]),t._v(" "),t._m(16),t._v(" "),t._m(17),t._m(18),t._v(" "),t._m(19),s("ul",[s("li",[s("a",{attrs:{href:"https://adempiere.github.io/adempiere-vue/#/excel/upload-excel",target:"_blank",rel:"noopener noreferrer"}},[t._v("Online Demo"),s("OutboundLink")],1)]),t._v(" "),s("li",[s("a",{attrs:{href:"https://github.com/adempiere/adempiere-vue/blob/master/src/views/excel/upload-excel.vue",target:"_blank",rel:"noopener noreferrer"}},[t._v("Online Code"),s("OutboundLink")],1)])])])}),[function(){var t=this.$createElement,e=this._self._c||t;return e("h1",{attrs:{id:"excel"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#excel"}},[this._v("#")]),this._v(" Excel")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"excel-export"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#excel-export"}},[this._v("#")]),this._v(" Excel Export")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h3",{attrs:{id:"use"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#use"}},[this._v("#")]),this._v(" Use")])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("p",[t._v("Since "),s("code",[t._v("Export2Excel")]),t._v(" depends not only on "),s("code",[t._v("js-xlsx")]),t._v(" but also on "),s("code",[t._v("file-saver")]),t._v(" and "),s("code",[t._v("script-loader")]),t._v(".")])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" xlsx file-saver -S\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" script-loader -S -D\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("Since "),e("code",[this._v("js-xlsx")]),this._v(" size is still very large, the export function is not a very common function, so lazy loading is recommended when using it. The method of use is as follows:")])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'@/vendor/Export2Excel'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("then")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("excel")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  excel"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("export_json_to_excel")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    header"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" tHeader"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//Header Required")]),t._v("\n    data"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//Specific data Required")]),t._v("\n    filename"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'excel-list'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//Optional")]),t._v("\n    autoWidth"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//Optional")]),t._v("\n    bookType"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'xlsx'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//Optional")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h3",{attrs:{id:"params"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#params"}},[this._v("#")]),this._v(" Params")])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("thead",[s("tr",[s("th",[t._v("Params")]),t._v(" "),s("th",[t._v("Description")]),t._v(" "),s("th",[t._v("Type")]),t._v(" "),s("th",[t._v("Accepted Values")]),t._v(" "),s("th",[t._v("Default")])])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("tr",[s("td",[t._v("header")]),t._v(" "),s("td",[t._v("Export header of data")]),t._v(" "),s("td",[t._v("Array")]),t._v(" "),s("td",[t._v("/")]),t._v(" "),s("td",[t._v("[]")])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("tr",[s("td",[t._v("data")]),t._v(" "),s("td",[t._v("Exported specific data")]),t._v(" "),s("td",[t._v("Array")]),t._v(" "),s("td",[t._v("/")]),t._v(" "),s("td",[t._v("[]")])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("tr",[s("td",[t._v("filename")]),t._v(" "),s("td",[t._v("Export file name")]),t._v(" "),s("td",[t._v("String")]),t._v(" "),s("td",[t._v("/")]),t._v(" "),s("td",[t._v("excel-list")])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("tr",[s("td",[t._v("autoWidth")]),t._v(" "),s("td",[t._v("Whether the cell auto width")]),t._v(" "),s("td",[t._v("Boolean")]),t._v(" "),s("td",[t._v("true / false")]),t._v(" "),s("td",[t._v("true")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h3",{attrs:{id:"example"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#example"}},[this._v("#")]),this._v(" Example")])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'@/vendor/Export2Excel'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("then")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("excel")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" tHeader "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Id'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Title'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Author'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Readings'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Date'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" data "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("list\n  excel"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("export_json_to_excel")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    header"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" tHeader"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//Header Required")]),t._v("\n    data"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//Specific data Required")]),t._v("\n    filename"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'excel-list'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//Optional")]),t._v("\n    autoWidth"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//Optional")]),t._v("\n    bookType"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'xlsx'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//Optional")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"excel-import"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#excel-import"}},[this._v("#")]),this._v(" Excel Import")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[e("p",[this._v("beforeUpload")]),this._v(" "),e("p",[this._v("You can make some special judgments before uploading. For example, if the size of the file is greater than 1 megabyte? If it is greater than 1 megabyte, it stops parsing and prompts an error message.")])])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("  "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("beforeUpload")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("file")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" isLt1M "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" file"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("size "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1024")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1024")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("isLt1M"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("$message")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      message"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Please do not upload files larger than 1m in size.'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      type"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'warning'")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("onSuccess\nA callback function that fires when parsing succeeds, which returns the header and content of the table.")])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("  "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("handleSuccess")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" results"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" header "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("tableData "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" results\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("tableHeader "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" header\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])}],!1,null,null,null);e.default=n.exports}}]);