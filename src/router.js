import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
Vue.use(Router)

const newrouter = new Router({
  routes: [
    {
      path: '/canvas',
      name: 'home',
      component: Home
    },
    {
      path: '/designerCenter',
      name: 'designerCenter',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */'./views/designerCenter.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/login.vue')
    }
  ]
})
export default newrouter
