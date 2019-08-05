import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        window_w: 2000,
        window_h: 1500,
        canvas_width: 555.45,
        canvas_height: 785.75,
        project_m_comp: [{
            name: 'text',
            chinese: '文案'
        }, {
            name: 'slogan',
            chinese: 'slogan'
        }, {
            name: 'product',
            chinese: '产品图'
        }, {
            name: 'logo',
            chinese: 'logo'
        }, {
            name: 'ornament',
            chinese: '装饰'
        }, {
            name: 'model',
            chinese: '模特'
        }, {
            name: 'code',
            chinese: '二维码'
        }, {
            name: 'other',
            chinese: '版权信息'
        }, {
            name: 'background',
            chinese:'背景'
        }]
    },
    mutations: {},
    actions: {}
})