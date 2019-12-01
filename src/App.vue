<template>
  <div id="app">
    <!--     <div id="nav">
      <router-link to="/canvas?userType=designer">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <div class="font">
      在
    </div>
    <router-view />
  </div>
</template>
<script type="text/javascript">
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState({
      user_type: state => state.user_type,
      user_data: state => state.user_data
    })
  },
  data: function() {
    return {};
  },
  methods: {
    saveState: function() {
      const me = this
      let data = localStorage.getItem("userData")
        ? JSON.parse(localStorage.getItem("userData"))
        : {
            id: "" // 数据列表
          };
      me.$store.dispatch("changeUserDataFunc", data)
    },
    judgeUser: function() {
      const me=this
      let user_id = parseInt(me.$route.query.user_id);
      if (user_id !== NaN && user_id) {
        let userD = { id: user_id };
        me.$store.dispatch("changeUserDataFunc", userD);
      }
    },
    before: function() {
      const me = this
      me.$router.beforeEach((to, from, next) => {
        me.judgeUser()
        if (from.path == "/canvas") {
          //摧毁canvas实例
          bus.$emit("canvasDestroy");
        }
        if(!me.user_data.id || me.user_data.id===''){
          // 判断有没有用户信息
          me.$router.push({ path: "/login" });
          return false
        }
        next();
      });
    }
  },
  mounted: function() {
    const me = this;
    window.addEventListener("unload", me.saveState());
    // 路由前设置
  }
};
</script>
<style>
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
  font-family: "pfht", "japanhymc", "yrdzsl-Bold";
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
</style>
