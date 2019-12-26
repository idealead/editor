<template>
  <div class="top_block">
    <img
      class="insight_logo"
      @click="backToList(false,'http://ht.idealead.hbindex.com/html/design/#/cover')"
      src="../assets/logo.png"
    />
    <p class="project_name" v-show="$router.currentRoute.path=='/canvas'">
      项目名称：
      <input
        type="text"
        name
        v-model="set_mould_name"
        @change="mouldNameChange"
        :placeholder="mould_name"
      />
    </p>
    <div class="user_block">
      <el-tooltip
        class="item"
        effect="light"
        :content="saveMsg"
        placement="bottom"
        popper-class="tip"
        :manual="true"
        :value="tipSaveError"
      >
        <div
          class="save_btn"
          @click="save(false)"
          :class="{'saved_btn':saved,'btn_click':save_click}"
          v-show="$router.currentRoute.path=='/canvas'"
        >{{saved?'已保存':'保 存'}}</div>
      </el-tooltip>
      <!-- <div class="save_btn" @click="backToList(false,'')">返回列表</div> -->
      <el-tooltip
        class="item"
        effect="light"
        :content="'已保存 '+mould_name+' 模板，可前往个人中心查看'"
        placement="bottom"
        popper-class="tip"
        :manual="true"
        :value="tipShow"
      >
        <div
          class="user_head"
          v-bind:style="{backgroundImage:'url('+head+')'}"
          @click="toUserCenter()"
        ></div>
      </el-tooltip>
      <div class="user_name">{{name?name:'用户'}}</div>
      <div class="logout" @click="logout">{{user_type=='designer'?'退出登录':'      '}}</div>
    </div>
    <div class="alert_mask" v-if="alert_show">
      <div class="alert">
        <p>当前模板未保存，离开会丢失数据，您确定要离开吗？</p>
        <div class="alertBtn sure" @click="backToList(true,jump_link)">保存并离开</div>
        <div class="alertBtn not" @click="alert_close(true,jump_link)">直接离开</div>
        <div class="addPop_close" @click="alert_close(false,'')"></div>
      </div>
    </div>
  </div>
</template>
<style type="text/css" scoped>
.addPop_close {
  position: absolute;
  width: 62px;
  height: 62px;
  right: -13px;
  top: -13px;
  background-image: url('../assets/canvas/addPop_close.png');
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
  transition: background-image 0.5s;
}

.addPop_close:hover {
  background-image: url('../assets/canvas/addPop_close_active.png');
}
.alert_mask {
  width: 100%;
  height: 3000px;
  background-color: rgba(0, 0, 0, 0.2);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 19;
}

.alert .alertBtn {
  background-color: rgb(237, 237, 237);
  color: #adadad;
  width: 120px;
  height: 35px;
  border-radius: 35px;
  line-height: 35px;
  position: absolute;
  bottom: 40px;
  left: 50%;
  cursor: pointer;
}

.alertBtn:hover {
  color: white;
  background-color: #ce3939;
}

.alert .sure {
  transform: translateX(calc(-50% - 65px));
}

.alert .not {
  transform: translateX(calc(-50% + 65px));
}

.alert p {
  margin: 80px 0 20px 0;
  font-size: 18px;
  color: #888785;
  padding: 0 40px;
}

.alert {
  width: 403px;
  height: 244px;
  background-image: url('../assets/canvas/alert.png');
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.tip {
  padding: 10px;
  font-size: 18px;
}

.top_block {
  position: absolute;
  background-color: white;
  width: 100%;
  height: 8.2vh;
  top: 0;
  -moz-box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.1);
  /* 老的 Firefox */
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.1);
  z-index: 99;
}

.insight_logo {
  width: 8.3vw;
  position: absolute;
  top: 50%;
  left: 40px;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  /*   background-image: url('../assets/insight_logo.png');
  background-size: contain;
  background-repeat: no-repeat; */
  cursor: pointer;
}

.project_name {
  font-family: '方正美黑', 'HYDiShengYingXiongTiW';
  width: 250px;
  font-size: 16px;
  color: #666666;
  line-height: 20px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  left: 330px;
}

.project_name input {
  width: 140px;
  border: none;
  font-size: 14px;
  color: #666666;
  /*   border-bottom: 1px solid #ce3939; */
  display: inline-block;
  outline: none;
}

.user_block {
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  padding-right: 50px;
}

.save_btn {
  width: 145px;
  height: 40px;
  line-height: 40px;
  margin: 20px 0;
  font-size: 16px;
  color: white;
  background-color: rgb(206, 57, 57);
  border-radius: 30px;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  vertical-align: top;
  margin-left: 25px;
}

.btn_click {
  animation: click 0.5s;
}

@keyframes click {
  50% {
    transform: scale(0.94);
  }

  100% {
    transform: scale(1);
  }
}

.saved_btn {
  background-color: rgb(237, 237, 237);
  color: #aeaeae;
}

.user_head {
  width: 3.15vw;
  height: 6.2vh;
  display: inline-block;
  margin: 10px 35px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 50%;
  cursor: pointer;
}

.user_name,
.logout {
  line-height: 20px;
  font-size: 1rem;
  height: 20px;
  margin-top: 3.2vh;
  color: #333;
  display: inline-block;
  vertical-align: top;
  font-family: 'SiYuan';
}
.logout{
  min-height: 60px
}
@media only screen and (max-width: 1600px) and (min-width: 1280px) {
  .user_name,
  .logout,
  .save_btn {
    font-size: 14px;
  }
}

@media only screen and (max-width: 1280px) and (min-width: 960px) {
  .user_name,
  .logout,
  .save_btn {
    font-size: 12px;
  }
}

@media only screen and (max-width: 960px) {
  .user_name,
  .logout,
  .save_btn {
    font-size: 10px;
  }
}

@media screen and (max-height: 830px) {
  .top_block {
    height: 9vh;
  }

  /*   .user_head {
    width: 50px;
    height: 50px;
  } */

  .save_btn {
    margin: 15px 0;
  }

  /* 
  .user_name,
  .logout {
    margin: 25px 0;
  } */
}

@media screen and (max-height: 720px) {
  .top_block {
    height: 9.2vh;
  }

  /*   .user_head {
    width: 40px;
    height: 40px;
  } */

  .save_btn {
    margin: 15px 0;
  }

  /* 
  .user_name,
  .logout {
    margin: 20px 0;
    font-size: 14px
  } */

  .save_btn {
    width: 130px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
}

.logout {
  margin-left: 25px;
  cursor: pointer;
}
</style>
<script type="text/javascript">
import { mapState, mapActions, mapGetters } from 'vuex'
import bus from '@/eventBus.js'
export default {
  name: 'top-block',
  props: {
    msg: String // 例子
  },
  data: function() {
    return {
      head: require('../assets/head.png'),
      saved: false,
      tipShow: false,
      alert_show: false,
      tipSaveError: false,
      saveMsg: '系统繁忙，保存失败',
      jump_link: '',
      save_click: false
    }
  },
  created: function() {
    const me = this
    bus.$off('mould_change').$on('mould_change', function() {
      me.$set(me, 'saved', false)
    })
    bus.$off('clientSave').$on('clientSave', function() {
      me.clientSave()
    })
    bus.$off('designerSave').$on('designerSave', function() {
      me.designerSave()
    })
    bus.$off('saveError').$on('saveError', function() {
      me.saveError()
    })
  },
  computed: {
    ...mapState({
      user_type: state => state.user.user_type,
      mould_name: state => state.homeCanvas.mould_name,
      name: state => state.user.user_data.name,
      user_data: state => state.user.user_data
    }),
    set_mould_name: function() {
      return this.mould_name
    },
    clientCenter: function() {
      return `http://ht.idealead.hbindex.com/html/design/#/personal/edited?user_id=${this.user_data.id}`
    }
  },
  methods: {
    save: function(leave, link) {
      const me = this
      me.$set(me, 'save_click', true)
      setTimeout(() => {
        me.$set(me, 'save_click', false)
      }, 510)
      if (me.user_type == 'designer') {
        bus.$emit('designer_save', me.mould_name, link)
      } else if (me.user_type == 'client') {
        bus.$emit('client_save', me.mould_name, leave, link)
      }
    },
    designerSave: function() {
      const me = this
      me.$set(me, 'saveMsg', '模板保存成功')
      me.$set(me, 'saved', true)
      me.$set(me, 'tipSaveError', true)
      setTimeout(() => {
        me.$set(me, 'tipSaveError', false)
      }, 3000)
    },
    clientSave: function() {
      const me = this
      me.$set(me, 'saved', true)
      me.$set(me, 'tipShow', true)
      setTimeout(() => {
        me.$set(me, 'tipShow', false)
        window.location.href = me.clientCenter
      }, 2000)
    },
    saveError: function() {
      const me = this
      me.$set(me, 'saveMsg', '系统繁忙，保存失败')
      me.$set(me, 'tipSaveError', true)
      setTimeout(() => {
        me.$set(me, 'tipSaveError', false)
      }, 3000)
    },
    alert_close: function(leave, link) {
      const me = this
      me.$set(me, 'alert_show', false)
      if (leave) {
        window.location.href = link
      }
    },
    backToList: function(direct = false, link) {
      const me = this
      if (me.$route.path.search('canvas') === -1) {
        window.location.href = link
      }
      if (!me.saved && !direct) {
        // 离开
        me.$set(me, 'alert_show', true)
        me.$set(me, 'jump_link', link)
      } else if (!me.saved && direct) {
        // 保存并跳转
        me.$set(me, 'alert_show', false)
        let leave = true
        me.save(leave, link)
      } else if (!direct && me.saved) {
        window.location.href = link
      }
    },
    toUserCenter: function() {
      const me = this
      if (me.user_type == 'client') {
        me.backToList(false, me.clientCenter)
      } else {
        me.$router.push({ path: '/designerCenter' })
      }
    },
    mouldNameChange: function(e) {
      const me = this
      me.$store.dispatch('ChangeRenderFunc', { key: 'mould_name', value: e.target.value })
    },
    logout: function() {
      const me = this
      if (me.user_type == 'designer') {
        // 退出登录
        // localStorage.setItem("userData", JSON.stringify({ id: '' }))
        localStorage.removeItem('userData')
        me.$router.push({ path: '/login' })
        me.$store.dispatch('changeUserDataFunc', { id: '' })
      }
    }
  }
}
</script>
