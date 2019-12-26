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
  // state: {
  //   window_w: 3000,
  //   window_h: 2300,
  //   canvas_width: 750,
  //   canvas_height: 1334,
  //   user_type: 'designer',
  //   // user_name: '小智',
  //   user_data: { id: 13 },
  //   structure_id: '', // 当时是为了默认骨架设置的
  //   new_structure_id: '', // 添加新骨架，设置绑定对应模板id
  //   structure_position: null,
  //   tempId: null,
  //   changeTitle: '',
  //   changeSubtitle: '',
  //   changeLogo: '',
  //   changeMain: '',
  //   logoFileId: '',
  //   mainFileId: '',
  //   token: '',
  //   mould_name: '封面图',
  //   project_m_comp: [{
  //     name: 'text',
  //     chinese: '文案'
  //   }, {
  //     name: 'slogan',
  //     chinese: 'slogan'
  //   }, {
  //     name: 'product',
  //     chinese: '产品图'
  //   }, {
  //     name: 'logo',
  //     chinese: 'logo'
  //   }, {
  //     name: 'ornament',
  //     chinese: '装饰'
  //   }, {
  //     name: 'model',
  //     chinese: '模特'
  //   }, {
  //     name: 'code',
  //     chinese: '二维码'
  //   }, {
  //     name: 'other',
  //     chinese: '版权信息'
  //   }, {
  //     name: 'background',
  //     chinese: '背景'
  //   }],
  //   // 接口路径文件
  //   api: apifile
  // },
  // mutations: {
  //   changeUser: function (state, name) {
  //     state.user_type = name
  //   },
  //   changeTempId: function (state, id) {
  //     state.tempId = id
  //   },
  //   setCanvas: function (state, num) {
  //     state.canvas_width = parseInt(num[0])
  //     state.canvas_height = parseInt(num[1])
  //   },
  //   changeRender: function (state, data) {
  //     state[data.key] = data.value
  //   },
  //   changeStructureId: function (state, id) {
  //     state.structure_id = id
  //   },
  //   changeNewStructureId: function (state, id) {
  //     state.new_structure_id = id
  //   },
  //   changeUserData: function (state, data) {
  //     state.user_data = data
  //   }
  // },
  // actions: {
  //   changeUserFunc: function (context, name) {
  //     context.commit('changeUser', name)
  //   },
  //   changeTempIdFunc: function (context, id) {
  //     context.commit('changeTempId', id)
  //   },
  //   setCanvasFunc: function (context, num) {
  //     context.commit('setCanvas', num)
  //   },
  //   ChangeRenderFunc: function (context, data) {
  //     context.commit('changeRender', data)
  //   },
  //   changeStructureIdFunc: function (context, id) {
  //     context.commit('changeStructureId', id)
  //   },
  //   changeNewStructureIdFunc: function (context, id) {
  //     context.commit('changeNewStructureId', id)
  //   },
  //   changeUserDataFunc: function (context, data) {
  //     context.commit('changeUserData', data)
  //   }
  // }
})
