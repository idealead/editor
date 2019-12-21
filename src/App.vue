<template>
  <div id="app">
    <!-- <div class='mask'>
    </div>-->
    <div class="font">字体</div>
    <router-view />
  </div>
</template>
<script type="text/javascript">
import { mapState, mapActions, mapGetters } from 'vuex'
import bus from '@/eventBus.js'
export default {
  computed: {
    ...mapState({
      user_type: state => state.user_type,
      user_data: state => state.user_data
    })
  },
  data: function () {
    return {}
  },
  methods: {
    saveState: function () {
      const me = this
      let data = localStorage.getItem('userData')
        ? JSON.parse(localStorage.getItem('userData'))
        : {
          id: '' // 数据列表
        }
      me.$store.dispatch('changeUserDataFunc', data)
    },
    judgeUser: function () {
      const me = this
      let user_id = parseInt(me.$route.query.user_id)
      if (!isNaN(user_id) && user_id) {
        let userD = { id: user_id }
        me.$store.dispatch('changeUserDataFunc', userD)
      }
    },
    before: function () {
      const me = this
      me.$router.beforeEach((to, from, next) => {
        me.judgeUser()
        if (from.path == '/canvas') {
          // 摧毁canvas实例
          bus.$emit('canvasDestroy')
        }
        if (!me.user_data.id || me.user_data.id === '') {
          // 判断有没有用户信息
          me.$router.push({ path: '/login' })
          return false
        }
        next()
      })
    }
  },
  mounted: function () {
    const me = this
    me.before()
  },
  created: function () {
    const me = this
    window.addEventListener('unload', me.saveState())
    // 路由前设置
  }
}
</script>
<style type="text/css" lang='less'>
/* .mask {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  z-index: 100;
  top: 0;
  pointer-events: none;
} */
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.font {
  position: absolute;
  right: -10%;
  font-family: 'pfht', 'japanhymc', 'yrdzsl-Bold', 'fzchft', 'fzmhft', 'fzytft', 'FZHLFW', 'bulmer_bt', 'FZHLFW', 'fzxlft', 'hkktlj', 'fzfmjt', 'fzzch', 'fzmshljt', 'ygytkjt',
    'jhrhz', 'fzwbft', 'fzmhjt', 'hyzzsdh', 'tttgb', 'czsldkpj', 'hkpp', 'fzcygbk', 'alba', 'fzxs24', 'fzyx', 'fzljdkt', 'hydsyxt','hyjsj','bdzyjt','fzltzch_gbk','fzchyjt';
  transform: translateX(1000%);
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
/* # addpop 上传按钮 */
.addPop_image_blcok {
  .el-upload {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
}
</style>
