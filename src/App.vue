<template>
  <div id="app">
    <!-- <div class='mask'>
    </div>-->
    <div class="font">
      <span v-for="(item,index) of fontF" :class="`font${index+1}`" :key="index">字体是啥呢</span>
    </div>
    <router-view />
  </div>
</template>
<script type="text/javascript">
import { mapState, mapActions, mapGetters } from 'vuex'
// import bus from '@/eventBus.js'
export default {
  computed: {
    ...mapState({
      user_type: state => state.user.user_type,
      user_data: state => state.user.user_data
    }),
    fontF: function() {
      return new Array(22)
    }
  },
  data: function() {
    return {}
  },
  methods: {
    saveState: function() {}
    // judgeUser: function () {
    //   const me = this
    //   let user_id = parseInt(me.$route.query.user_id)
    //   if (!isNaN(user_id) && user_id) {
    //     let userD = { id: user_id }
    //     me.$store.dispatch('changeUserDataFunc', userD)
    //   }
    // },
    // before: function () {
    //   const me = this
    //   me.$router.beforeEach((to, from, next) => {
    //     me.judgeUser()
    //     if (from.path == '/canvas') {
    //       // 摧毁canvas实例
    //       bus.$emit('canvasDestroy')
    //     }
    //     if (!me.user_data.id || me.user_data.id === '') {
    //       // 判断有没有用户信息
    //       me.$router.push({ path: '/login' })
    //       return false
    //     }
    //     next()
    //   })
    // }
  },
  mounted: function() {
    const me = this
    // window.addEventListener('unload', me.saveState())
  },
  created: function() {
    const me = this
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
  transform: translateX(1000%);
  .font1 {
    font-family: 'myrzzyt', 'fzht_gbk', 'rzrxnfhj';
  }
  .font2 {
    font-family: 'pfht', 'japanhymc', 'yrdzsl-Bold';
  }
  .font3 {
    font-family: 'fzchft', 'fzmhft', 'fzytft', 'FZHLFW';
  }
  .font4 {
    font-family: 'FZHLFW', 'bulmer_bt', 'fzxlft';
  }
  .font5 {
    font-family: 'hkktlj', 'fzfmjt', 'fzzch';
  }
  .font6 {
    font-family: 'fzmshljt', 'ygytkjt', 'jhrhz';
  }
  .font7 {
    font-family: 'fzwbft', 'fzmhjt', 'hyzzsdh';
  }
  .font8 {
    font-family: 'tttgb', 'czsldkpj', 'hkpp';
  }
  .font9 {
    font-family: 'fzcygbk', 'alba', 'fzxs24';
  }
  .font10 {
    font-family: 'fzyx', 'fzljdkt', 'hydsyxt';
  }
  .font11 {
    font-family: 'hyjsj', 'bdzyjt', 'fzltzch_gbk';
  }
  .font12 {
    font-family: 'fzchyjt', 'fzcysbft', 'fzdz';
  }
  .font13 {
    font-family: 'fzyht', 'hkstw12', 'adobefs';
  }
  .font14 {
    font-family: 'ymct', 'fzhlgbk', 'fzqkst';
  }
  .font15 {
    font-family: 'mcst','Herculanum','fzdbs';
  }
  .font16 {
    font-family: 'fzdbsjt','STsong';
  }
  .font17 {
    font-family: 'fzdhjt','fzzys_gbk';
  }
  .font18 {
    font-family: 'fztcghjt','fzjtjt';
  }
  .font19 {
    font-family: 'fzgljt','syht_bold';
  }
  .font20 {
    font-family: 'adobehtstd','fzhpft';
  }
  .font21 {
    font-family: 'fzzyft','fzxs14';
  }
  .font22 {
    font-family: 'fzzyjt','hwkt';
  }
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
