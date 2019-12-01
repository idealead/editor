<template>
  <div class="loginPage">
    <div class="loginBlock">
      <el-input placeholder="请输入账号" v-model="accountId" clearable class="inputDiv">
      </el-input>
      <el-input placeholder="请输入密码" v-model="passWord" show-password class="inputDiv"></el-input>
      <el-button class="inputDiv" type="primary" :loading="loading" @click="loginFunc">{{loading?'登录中':'登录'}}</el-button>
    </div>
  </div>
</template>
<style type="text/css" scoped>
.loginPage {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

}

.loginBlock {
  position: absolute;
  width: 300px;
  /* height: 500px; */
  top: 50%;
  box-sizing: border-box;
  /* border: 1px blue solid; */
  border-radius: 5px;
  transform: translateY(-50%);
  right: 15%;
  padding: 10px;
}

.inputDiv {
  margin-top: 20px;
}

.loginBlock>:first-child {
  margin-top: 0px;
}

</style>
<script>
// @ is an alias to /src
import { mapState, mapActions, mapGetters } from 'vuex'
import axios from 'axios'
export default {
  name: 'login',
  data: function() {
    return {
      accountId: '',
      passWord: '',
      loading: false
    }
  },
  computed: {
    ...mapState({
      user_type: state => state.user_type,
      user_data: state => state.user_data,
      api: state => state.api
    })
  },
  created: function() {
    const me = this;
  },
  methods: {
    loginFunc: function() {
      const me = this;
      if (me.accountId != '' && me.passWord != '') {
        me.$set(me, 'loading', true)
        //请求登录接口，成功后，设置localStorage，然后设置store。刷新页面后store从localStorage拿数据，没有则重新登录
        let loginData = {
          user_login: me.accountId,
          user_pass: me.passWord
        }
        axios({
          method: 'post',
          url: '/user/user_login',
          data: loginData
        }).then(function(res) {
          if (res.data.code == '200') {
            let userD={ 
              id: res.data.id,
              user_nickname:res.data.data.user_nickname }
            localStorage.setItem("userData", JSON.stringify(userD))
            me.$store.dispatch("changeUserDataFunc", userD);
            setTimeout(() => {
              me.$set(me, 'loading', false)
              me.$router.push({ path: '/designerCenter' })
            }, 500)
          }else{
            me.$set(me, 'loading', false)
            me.$message.error(res.data.message);
          }

        })

      } else {
        me.$message.error('请正确输入账号与密码');
      }

    }
  },
}

</script>
