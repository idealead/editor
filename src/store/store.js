import Vue from 'vue'
import Vuex from 'vuex'
import { apifile } from './apiPath/api.js'
import homeCanvas from './homeCanvas/canvas.js'
import user from './user/user.js'
Vue.use(Vuex)
const api = {
  state: apifile
}
export default new Vuex.Store({
  modules: {
    api,
    homeCanvas,
    user
  }
})
