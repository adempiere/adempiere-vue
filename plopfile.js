const viewGenerator = require('./plop-templates/view/prompt')
const componentGenerator = require('./plop-templates/component/prompt')
const storeGenerator = require('./plop-templates/store/prompt.js')
const ADempiereView = require('./plop-templates/ADempiere/view/prompt')
const ADempiereViewCompositionApi = require('./plop-templates/ADempiere/view/promptCompositionApi')
const ADempiereComponent = require('./plop-templates/ADempiere/component/prompt')
const ADempiereComponentCompositionApi = require('./plop-templates/ADempiere/component/promptCompositionApi')
const ADempiereStore = require('./plop-templates/ADempiere/store/prompt')

module.exports = function(plop) {
  plop.setHelper('capitalize', function(str) {
    // str is the argument passed to the helper when called
    str = str || ''
    return str.slice(0, 1).toUpperCase() + str.slice(1)
  })

  plop.setGenerator('view', viewGenerator)
  plop.setGenerator('component', componentGenerator)
  plop.setGenerator('store', storeGenerator)
  plop.setGenerator('ADempiere View', ADempiereView)
  plop.setGenerator('ADempiere View Composition API', ADempiereViewCompositionApi)
  plop.setGenerator('ADempiere Component', ADempiereComponent)
  plop.setGenerator('ADempiere Component Composition API', ADempiereComponentCompositionApi)
  plop.setGenerator('ADempiere Store Module', ADempiereStore)
}
