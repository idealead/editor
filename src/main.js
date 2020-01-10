import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import ElementUI from 'element-ui'
import axios from 'axios'
import bus from '@/eventBus.js'
import 'element-ui/lib/theme-chalk/index.css'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload)
Vue.use(ElementUI)
Vue.config.productionTip = false

axios.defaults.baseURL = '/api'
axios.defaults.timeout = 3000

const requireComponent = require.context(
  // 其组件目录的相对路径
  './components',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /\.vue$/
)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    camelCase(
      // 获取和目录深度无关的文件名
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})

router.beforeEach((to, from, next) => {
  let userId = parseInt(to.query.user_id)
  if (typeof userId === 'number' && !isNaN(userId)) {
    next()
  } else {
    let data = localStorage.getItem('userData')
      ? JSON.parse(localStorage.getItem('userData'))
      : {
        id: '',
        name: '' // 数据列表
      }
    store.dispatch('changeUserDataFunc', data)
    if (from.path == '/canvas') {
      // 摧毁canvas实例
      bus.$emit('canvasDestroy')
    }
    if (to.path === '/login' || (store.state.user.user_data.id || store.state.user.user_data.id !== '')) {
      next()
    } else {
      // 判断有没有用户信息
      next('/login')
    }
  }
})

window.Vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
