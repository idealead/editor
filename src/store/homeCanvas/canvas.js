export default {
  state: {
    window_w: 1500,
    window_h: 1500,
    canvas_width: 750,
    canvas_height: 1334,
    structure_id: '', // 当时是为了默认骨架设置的
    new_structure_id: '', // 添加新骨架，设置绑定对应模板id
    structure_position: null,
    tempId: null,
    changeTitle: '',
    changeSubtitle: '',
    changeLogo: '',
    changeMain: '',
    logoFileId: '',
    mainFileId: '',
    token: '',
    mould_name: '封面图',
    project_m_comp: [
      {
        name: 'text',
        chinese: '文案'
      },
      {
        name: 'slogan',
        chinese: 'slogan'
      },
      {
        name: 'product',
        chinese: '产品图'
      },
      {
        name: 'logo',
        chinese: 'logo'
      },
      {
        name: 'ornament',
        chinese: '装饰'
      },
      {
        name: 'model',
        chinese: '模特'
      },
      {
        name: 'code',
        chinese: '二维码'
      },
      {
        name: 'other',
        chinese: '版权信息'
      },
      {
        name: 'background',
        chinese: '背景'
      }
    ]
  },
  mutations: {
    changeTempId: function (state, id) {
      state.tempId = id
    },
    setCanvas: function (state, num) {
      state.canvas_width = parseInt(num[0])
      state.canvas_height = parseInt(num[1])
    },
    changeRender: function (state, data) {
      state[data.key] = data.value
    },
    changeStructureId: function (state, id) {
      state.structure_id = id
    },
    changeNewStructureId: function (state, id) {
      state.new_structure_id = id
    }
  },
  actions: {
    changeTempIdFunc: function (context, id) {
      context.commit('changeTempId', id)
    },
    setCanvasFunc: function (context, num) {
      context.commit('setCanvas', num)
    },
    ChangeRenderFunc: function (context, data) {
      context.commit('changeRender', data)
    },
    changeStructureIdFunc: function (context, id) {
      context.commit('changeStructureId', id)
    },
    changeNewStructureIdFunc: function (context, id) {
      context.commit('changeNewStructureId', id)
    }
  }
}
