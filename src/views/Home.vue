<template>
  <div class="home">
    <Canvas v-if="re_build_canvas" />
    <side-block />
    <top-block />
    <tipMask @closeTip="closeTip" v-if="showTip" />
  </div>
</template>
<style type="text/css">
.home {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  left: 0;
  top: 0;
}

#mainCanvas canvas {
  position: absolute;
  left: 50%;
  top: 0%;
  transform-origin: 0% 0%;
  /* transform: scale(1) translateX(-1500px) translateY(-960px); */
}
</style>
<script>
// @ is an alias to /src
import { mapState, mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import bus from '@/eventBus.js'
export default {
  name: 'home',
  data: function() {
    return {
      logo_path: '',
      re_build_canvas: false,
      showTip: false
    }
  },
  computed: {
    ...mapState({
      user_type: state => state.user.user_type,
      changeTitle: state => state.homeCanvas.changeTitle,
      changeSubtitle: state => state.homeCanvas.changeSubtitle,
      changeLogo: state => state.homeCanvas.changeLogo,
      changeMain: state => state.homeCanvas.changeMain,
      user_data: state => state.user.user_data,
      api: state => state.api
    })
  },
  created: function() {
    const me = this
    bus.$off('canvasDestroy').$on('canvasDestroy', function() {
      me.shutdown()
    })
    // 判断用户是否第一次使用编辑工具，增加提示
    if (!window.localStorage.getItem('firstEdit')) {
      me.showTip = true
      setTimeout(() => {
        window.localStorage.setItem('firstEdit', true)
      }, 1000)
    } else {
      bus.$emit('editbarClose')
    }
  },
  mounted: function() {
    const me = this
    // 判断url是client还是designer
    me.judgeUser()
    setTimeout(() => {
      me.$set(me, 're_build_canvas', true)
    }, 10)
    // 字体测试
    // Promise.all([import('../font/font.css'), import('../font/fontFile/DMFT1542118809471.css')]).then((res) => { console.log(res) })
  },
  methods: {
    shutdown: function() {
      const me = this
      // 销毁，重置canvas
      me.$set(me, 're_build_canvas', false)
    },
    judgeUser: function() {
      const me = this
      let userType = me.$route.query.userType
      if (userType) me.$store.dispatch('changeUserFunc', userType)

      let tempId = me.$route.query.tempId
      if (tempId) me.$store.dispatch('changeTempIdFunc', tempId)

      let user_id = parseInt(me.$route.query.user_id)
      if (user_id && me.user_type == 'client') {
        // 获取用户信息
        axios({
          methods: 'get',
          url: `${me.api.get_user_info}?user_id=${user_id}`
        }).then((res) => {
          me.$store.dispatch('changeUserDataFunc', {
            id: user_id,
            name: res.data.data.user_name
          })
        }).catch(() => {
          me.$message.error('获取用户信息失败，请刷新重试')
        })
      }
      // 替换标题、副标题、logo、主图
      //
      let token = me.$route.query.token
      if (token) me.$store.dispatch('ChangeRenderFunc', { key: 'token', value: token })

      let changeTitle = me.$route.query.changeTitle
      if (changeTitle) {
        me.$store.dispatch('ChangeRenderFunc', {
          key: 'changeTitle',
          value: changeTitle
        })
      }

      let changeSubtitle = me.$route.query.changeSubtitle
      if (changeSubtitle) {
        me.$store.dispatch('ChangeRenderFunc', {
          key: 'changeSubtitle',
          value: changeSubtitle
        })
      }

      let changeLogo = me.$route.query.changeLogo
      if (changeLogo) {
        me.$store.dispatch('ChangeRenderFunc', {
          key: 'changeLogo',
          value: changeLogo
        })
      }

      let changeMain = me.$route.query.changeMain
      if (changeMain) {
        me.$store.dispatch('ChangeRenderFunc', {
          key: 'changeMain',
          value: changeMain
        })
      }

      let logoFileId = me.$route.query.logoFileId
      if (logoFileId) {
        me.$store.dispatch('ChangeRenderFunc', {
          key: 'logoFileId',
          value: logoFileId
        })
      }

      let mainFileId = me.$route.query.mainFileId
      if (mainFileId) {
        me.$store.dispatch('ChangeRenderFunc', {
          key: 'mainFileId',
          value: mainFileId
        })
      }
    },
    closeTip: function() {
      // 指引结束
      this.showTip = false
      bus.$emit('editbarClose')
    }
  },
  components: {
    Canvas: () => import('../homeComponents/Canvas.vue'),
    'side-block': () => import('../homeComponents/new-side-layer.vue'),
    tipMask: () => import('../homeComponents/tipMask.vue')
  }
}
</script>
