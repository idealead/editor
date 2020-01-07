export default {
  state: {
    user_type: 'designer',
    user_data: { id: '', user_name: '' }
  },
  mutations: {
    changeUser: function (state, name) {
      state.user_type = name
    },
    changeUserData: function (state, data) {
      state.user_data = data
    }
  },
  actions: {
    changeUserFunc: function (context, name) {
      context.commit('changeUser', name)
    },
    changeUserDataFunc: function (context, data) {
      context.commit('changeUserData', data)
    }
  }
}
