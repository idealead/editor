<template>
  <div class="allmask">
    <div class="mask" v-for="(item,index) in tipsProcess" v-show="item.showif" :key="index">
      <img :src="item.maskimg" class="maskimg" @click="next(index)" />
      <img :src="item.tipsimg" :class="item.tipclassname" />
    </div>
  </div>
</template>
<style type="text/css" lang='less' scoped>
.allmask {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
}
.mask {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
  .maskimg {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
  .tips1 {
    position: absolute;
    right: 10%;
    top: 20%;
  }
  .tips2 {
    position: absolute;
    left: 60%;
    top: 20%;
  }
  .tips3,
  .tips4 {
    position: absolute;
    left: 16%;
    top: 20%;
  }
  .tips5 {
    position: absolute;
    right: 15%;
    top: 12%;
  }
  .tips6 {
    position: absolute;
    left: 20%;
    top: 12%;
  }
  .tips7 {
    position: absolute;
    right: 10%;
    bottom: 12%;
  }
}
</style>
<script type="text/javascript">
import { mapState, mapActions, mapGetters } from 'vuex'
import bus from '@/eventBus.js'
// import axios from 'axios'
export default {
  name: 'tipMask',
  props: {
    msg: String // 例子
  },
  computed: {
    ...mapState({
      user_data: state => state.user.user_data,
      api: state => state.api
    })
  },
  data: function() {
    return {
      tipNumber: 7,
      // 提示功能配置参数
      tipsProcess: []
    }
  },
  beforeDestroy: function() {},
  created: function() {
    this.processInit()
  },
  methods: {
    processInit: function() {
      // 提示功能数据初始化
      const me = this
      let arr = []
      for (let i = 1; i <= this.tipNumber; i++) {
        arr.push({
          maskimg: require(`@/assets/canvas/mask${i}.png`), // 地址
          tipsimg: require(`@/assets/canvas/tips${i}.png`),
          tipclassname: `tips${i}`, // 提示文案classname
          showif: i === 1
        })
      }
      me.$set(me, 'tipsProcess', arr)
    },
    next: function(index) {
      // 此处index从0开始
      const me = this
      me.$set(me.tipsProcess[index], 'showif', false)
      if (index + 1 == me.tipsProcess.length) {
        // 最后一个
        me.$emit('closeTip')
      } else {
        if (index == 2) {
          bus.$emit('tabChange', 'layer')
        } else {
          bus.$emit('tabChange', 'text')
        }
        me.$set(me.tipsProcess[index + 1], 'showif', true)
      }
    }
  }
}
</script>
