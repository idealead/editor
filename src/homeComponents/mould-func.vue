<template>
  <div class="shadow">
    <div class="setTextPositionBlock" v-if="showText">
      <h4>配置文本替换位置</h4>
      <div class="textSwitch">
        <el-switch
          v-bind:checked="saveTextRule"
          active-text="上传规则"
          inactive-text="不上传规则"
          v-on:change="change"
          v-model="textval"
        ></el-switch>
      </div>
      <el-tag
        :key="tag"
        v-for="tag in textRepalceF.textPositionArr"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
      >{{tag}}</el-tag>
      <el-input
        class="input-new-tag"
        v-if="textRepalceF.inputVisible"
        v-model="textRepalceF.inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      ></el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      <div class="buttonBlock">
        <el-button type="primary" round size="medium" @click="saveTextPosition">保存</el-button>
        <el-button type="primary" round @click="hideTextFunc" size="medium">取消</el-button>
      </div>
    </div>
  </div>
</template>
<style type="text/css" lang='less' scoped>
.textSwitch {
  margin-bottom: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
  margin-top: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.shadow {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
.setTextPositionBlock {
  width: 500px;
  height: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;

  .buttonBlock {
    display: flex;
    position: absolute;
    width: 100%;
    height: 50px;
    left: 0;
    bottom: 10px;
    justify-content: space-around;
    align-items: center;
  }
  h4 {
    margin-bottom: 10px;
  }
}
</style>
<script type="text/javascript">
import { mapState, mapActions, mapGetters } from 'vuex'
// import bus from '@/eventBus.js'
// import axios from 'axios'
export default {
  name: 'mouldFunc',
  props: {
    openBlock: String, // 打开哪个功能模板
    textPositionArr: Array, // 文案替换功能的数据数组
    saveTextRule: Boolean // 文案规则是否保存
  },
  model: {
    prop: 'saveTextRule',
    event: 'change'
  },
  computed: {
    ...mapState({
      user_data: state => state.user.user_data,
      api: state => state.api
    })
  },
  data: function() {
    return {
      showText: false,
      textRepalceF: {
        textPositionArr: [],
        inputVisible: false,
        inputValue: ''
      },
      textval: false
    }
  },
  beforeDestroy: function() {},
  created: function() {
    const me = this
    me.$set(me, 'textval', me.saveTextRule)
  },
  mounted: function() {
    const me = this
    if (me.openBlock === 'text') {
      me.$set(me, 'showText', true)
      me.$set(me.textRepalceF, 'textPositionArr', _.cloneDeep(me.textPositionArr))
      // $set是浅拷贝，
    }
  },
  methods: {
    change: function(val) {
      this.$emit('change', val)
    },
    hideTextFunc: function() {
      // 关闭文案位置设置面板
      const me = this
      // if (me.textRepalceF.textPositionArr.length === 0) {
      //   // 发出事件，让canvas取消textReplacePosition
      // }
      me.$set(me, 'showText', false)
      me.$emit('close-mould-funcshow')
    },
    saveTextPosition: function() {
      // 保存文案位置信息
      const me = this
      me.$emit('update-text-position', me.textRepalceF.textPositionArr)
      me.$emit('close-mould-funcshow')
      // me.$emit("changeSaveRule",me.saveTextRule)
    },
    handleClose(tag) {
      this.textRepalceF.textPositionArr.splice(this.textRepalceF.textPositionArr.indexOf(tag), 1)
    },
    showInput() {
      this.textRepalceF.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      let inputValue = this.textRepalceF.inputValue
      if (inputValue) {
        this.textRepalceF.textPositionArr.push(inputValue)
      }
      this.textRepalceF.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>
