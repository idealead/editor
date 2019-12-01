<template>
  <div class="designer">
    <div class="user_head" v-bind:style="{backgroundImage:'url('+head+')'}"></div>
    <div class="edit_input">
      用户名：
      <div class="myinput">
        <el-input placeholder="" v-model="user_account" :disabled="true">
        </el-input>
      </div>
    </div>
    <div class="edit_input">
      昵称：
      <div class="myinput">
        <el-input placeholder="" v-model="user_name">
        </el-input>
      </div>
    </div>
    <el-button type="primary" @click="render">渲染模板测试</el-button>
  </div>
</template>
<style type="text/css" scoped>
.designer {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  padding-top: 100px;
  padding-left: 50px;
  box-sizing: border-box;
}

.user_head {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 50%;
}
.edit_input {
  width: 500px;
  font-size: 15px;
  margin-top: 15px;
  text-align: left;
  height: 40px;
  line-height: 40px;
}
.myinput {
  /* display: inline-block; */
  width: 80%;
  float: right;
}
</style>
<script>
// @ is an alias to /src
import { mapState, mapActions, mapGetters } from "vuex";
import * as PIXI from "pixi.js";
import bus from "@/eventBus.js";
// import axios from "axios";
import renderTemp from "@/homeComponents/pixiFunc/renderTemp.js";
export default {
  name: "designer",
  data: function() {
    return {
      head: require("../assets/head.png"),
      user_account: "agan"
    };
  },
  computed: {
    ...mapState({
      user_type: state => state.user_type,
      user_data: state => state.user_data
    }),
    user_name: function() {
      return this.user_data.user_nickname
        ? this.user_data.user_nickname
        : "小智";
    }
  },
  created: function() {
    const me = this;
  },
  mounted: function() {},
  methods: {
    render: function() {
      let application = new PIXI.Application({
        backgroundColor: 0xf5f5f5,
        width: 2500,
        height: 2500,
        antialias: 1
      });
      renderTemp
        .tempInit({
          tempId: 1956,
          app: application,
          expand: false,
          changeLogo: "",
          changeMain:
            "",
          logoFileId: "",
          mainFileId: ""
        })
        .then(backData => {
          console.log(backData);
        })
        .catch(_ => {});
    }
  }
};
</script>
