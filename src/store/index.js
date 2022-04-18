// import Vue from 'vue'
// import Vuex from 'vuex'
import { createApp } from 'vue'
import { createStore } from 'vuex'
import getters from './getters'

// Vue.use(Vuex)
createApp.use(createStore)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  var moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  moduleName = moduleName.substring(moduleName.indexOf('/') + 1)
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

// const store = new Vuex.Store({
//   modules,
//   getters
// })
const store = createStore({
  modules,
  getters
})

// const app = createApp({ /* your root component */ })

// // Install the store instance as a plugin
// app.use(store)

export default store
