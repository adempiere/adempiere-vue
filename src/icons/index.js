import { createApp } from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
createApp.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
