<template>
  <div class="dcenter-left">
    <div class="tab-block" @click="toTab(0)" :class="{'tab-select':selectIndex==0}">
      <div class="tab-icon tab-new"></div>
      新建项目
    </div>
    <div class="tab-block" @click="toTab(1)" :class="{'tab-select':selectIndex==1}">
      <div class="tab-icon tab-mydes"></div>
      我的设计
      <div class="tab-down" :class="{'tab-up':selectIndex==1}"></div>
    </div>
    <transition name="fade">
      <div v-show="selectIndex==1" class="second-tab-block">
        <div class="tab-block second-tab" @click="designTab(0)">
          <p :class="{'secondIndex':secondIndex==0}">未提交</p>
        </div>
        <div class="tab-block second-tab" @click="designTab(1)">
          <p :class="{'secondIndex':secondIndex==1}">已提交</p>
        </div>
      </div>
    </transition>
    <div class="tab-block" @click="toTab(2)" :class="{'tab-select':selectIndex==2}">
      <div class="tab-icon tab-mydes"></div>
      架构素材
    </div>
    <div class="tab-block" @click="toTab(3)" :class="{'tab-select':selectIndex==3}">
      <div class="tab-icon tab-mydes"></div>
      我的素材
    </div>
    <div class="tab-block" @click="toTab(4)" :class="{'tab-select':selectIndex==4}">
      <div class="tab-icon tab-mydes"></div>
      模板裂变
    </div>
    <div class="tab-block" @click="toTab(5)" :class="{'tab-select':selectIndex==5}">
      <div class="tab-icon tab-mydes"></div>
      我的信息
    </div>
  </div>
</template>
<style type="text/css" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: height .3s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
  {
  height: 0px !important;
}

.dcenter-left {
  width: 210px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: white;
  padding-top: 150px
}

.dcenter-left>:last-child {
  border-bottom: none;
}

.tab-block {
  width: calc(100% - 40px);
  height: 70px;
  margin-left: 20px;
  position: relative;
  font-size: 16px;
  line-height: 70px;
  box-sizing: border-box;
  border-bottom: 1px rgb(241, 241, 241) solid;
  cursor: pointer;
  border-radius: 10px;
}
.second-tab-block{
  overflow: hidden;
  height: 160px;
}
.second-tab {
  border-bottom: none;

}

.second-tab p {
  display: inline-block;
  position: absolute;
  left: 50%;
  transform: translateX(-50%)
}

.tab-select {
  background-color: rgba(241, 241, 241, .4);
  color: #ce3939;
}

.tab-block:hover {
  background-color: rgba(241, 241, 241, .4)
}

.tab-icon {
  position: absolute;
  width: 23px;
  height: 23px;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);

}

.tab-new {
  background-image: url('../assets/designerCenter/center-new.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.tab-mydes {
  background-image: url('../assets/designerCenter/center-mydes.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.tab-down {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 9px;
  background-image: url('../assets/designerCenter/center-down.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.tab-up {
  transform: translateY(-50%) rotate(180deg);
}

.secondIndex {
  color: #ce3939
}

</style>
<script>
// @ is an alias to /src
import { mapState, mapActions, mapGetters } from 'vuex'
import bus from '@/eventBus.js'
export default {
  name: 'dcenter-left',
  data: function() {
    return {
      selectIndex: 0,
      secondIndex: 0
    }
  },
  computed: {
  },
  created: function() {
    // const me = this
  },
  methods: {
    toTab: function(index) {
      const me = this
      me.$set(me, 'selectIndex', index)
      bus.$emit('dcenterRightC', index)
      // 提交事件给views designerCenter.vue
    },
    designTab: function(index) {
      const me = this
      me.$set(me, 'secondIndex', index)
      bus.$emit('myDesignIndex', index)
    }
  }
}

</script>
