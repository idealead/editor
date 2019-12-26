<template>
  <div class="designer">
    <div class="user_head" v-bind:style="{backgroundImage:'url('+head+')'}"></div>
    <div class="edit_input">
      用户名：
      <div class="myinput">
        <el-input placeholder v-model="user_account" :disabled="true"></el-input>
      </div>
    </div>
    <div class="edit_input">
      昵称：
      <div class="myinput">
        <el-input placeholder v-model="user_name"></el-input>
      </div>
    </div>
    <el-button type="primary" @click="render">渲染模板测试</el-button>
    <el-button type="primary" @click="fontcut">压缩字体</el-button>
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
import { mapState, mapActions, mapGetters } from 'vuex'
import * as PIXI from 'pixi.js'
import bus from '@/eventBus.js'
// import axios from "axios";
import renderTemp from '@/homeComponents/pixiFunc/renderTemp.js'
export default {
  name: 'designer',
  data: function() {
    return {
      head: require('../assets/head.png'),
      user_account: 'agan'
    }
  },
  computed: {
    ...mapState({
      user_data: function(state) {
        return state.user.user_data
      }
    }),
    user_name: function() {
      return this.user_data.name ? this.user_data.name : '小智'
    }
  },
  created: function() {
    // const me = this
  },
  mounted: function() {},
  methods: {
    render: function() {
      let application = new PIXI.Application({
        backgroundColor: 0xf5f5f5,
        width: 2500,
        height: 2500,
        antialias: 1
      })
      renderTemp
        .tempInit({
          tempId: 1956,
          app: application,
          expand: false,
          changeLogo: '',
          changeMain: '',
          logoFileId: '',
          mainFileId: ''
        })
        .then(backData => {
          console.log(backData)
        })
        .catch(_ => {})
    },
    fontcut: function() {
      const me = this
      renderTemp.getfontFamilyBack({
        syht:
          '鼠年春节主题体验版上线，一键AI设计开始体验 上一步 下一步请告诉我们您的产品行业移动通讯 家电零售 美妆个护请告诉我您的品牌调性关键词新潮有趣 活力张扬 温馨随和 专业可靠 文化品位请告诉我们您选择的推广目标人群Z世代 时尚青年 居家男女 社会中坚 泛人群请告诉我您的推广目的品牌宣传 产品促销 新品发布请选择您的创意画面尺寸开屏页 网站Banner创意智能订制大数据算法决策根据产品图智能布局和配色一键批量出图LOGO产品图素材抠图太麻烦？立即体验一键智能抠图智能生成 加载更多 智能抠图10积分根据你的信息做了设计 个人中心 我的素材 已编辑列表 收藏列表 消费明细目前没有任何已编辑的设计确定下载 该次下载将消耗你10个积分 确定下载时间 消费内容 消费积分 0123456789反馈 发送 取消节省你的时间，把抠图留给我们上传图片我的素材返回'
      })
    }
  }
}
</script>
