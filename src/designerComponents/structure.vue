<template>
  <div class="structure">
    <h1>选择模板架构{{testextends}}</h1>
    <div class="structure_block">
      <div class="select_div" @click="newStructure">添加架构</div>
      <!-- <div class="select_div" toid='a' @click="selectDiv">A</div> -->
      <div class="select_div" toid @click="selectDiv">normal</div>
    </div>
    <div class="structure_block">
      <div
        class="select_div temp_div"
        v-for="(item,index) in structureData"
        v-bind:style="backgroundImage(item.data.template_info)"
        :key="index"
      >{{item.data.framework_name}}</div>
    </div>
    <div class="alertBg" v-if="setNew">
      <div class="layoutBlock">
        <div class="structureName">
          <p>架构名称：</p>
          <el-input v-model="structureName" placeholder="请输入名称" class="inputArea"></el-input>
        </div>
        <div class="replaceName">
          <p>替换标签：</p>
          <div class="inputArea">
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >{{tag}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            ></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </div>
        </div>
        <div class="setBtn">
          <el-button type="primary" round class="createNewBtn" @click="buildModel" size="small">创建</el-button>
          <el-button type="info" round class="cancelBtn" @click="showAddFunc(false)" size="small">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style type="text/css" scoped>
.structure {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  padding-top: 100px;
  overflow-y: auto;
}

.structure_block {
  width: 100%;
  text-align: center;
  margin-top: 30px;
}

.select_div {
  width: 150px;
  height: 300px;
  box-sizing: border-box;
  border: 1px red solid;
  display: inline-block;
  cursor: pointer;
  font-size: 20px;
  line-height: 300px;
  margin: 0 20px;
  overflow: hidden;
  background-size: contain;
}

.temp_div {
  border-radius: 10px;
}

.alertBg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.layoutBlock {
  width: 600px;
  height: 300px;
  background-color: white;
  border-radius: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  box-sizing: border-box;
  padding: 20px;
}

.setBtn {
  position: absolute;
  width: 100%;
  bottom: 20px;
  left: 0;
}

.createNewBtn {
  position: absolute;
  left: 20%;
  bottom: 0;
}

.cancelBtn {
  position: absolute;
  right: 20%;
  bottom: 0;
}

.structureName,
.replaceName {
  text-align: left;
}

.replaceName {
  margin-top: 40px;
}

.layoutBlock p {
  /* display: inline-block; */
  width: 20%;
  font-size: 16px;
  float: left;
}

.inputArea {
  width: 80%;
  display: inline-block;
}

.el-tag + .el-tag {
  margin-left: 10px;
  margin-bottom: 10px;
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
  margin-bottom: 10px;
}
</style>
<script>
// @ is an alias to /src
import { mapState, mapActions, mapGetters } from 'vuex'
import axios from 'axios'
// import extendf from '@/designerComponents/extend.js'
// import bus from '@/eventBus.js'
export default {
  // extends: extendf,
  name: 'structure',
  props: {
    structureD: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data: function() {
    return {
      setNew: false,
      structureName: '',
      dynamicTags: ['主图', '背景', '装饰1'],
      inputVisible: false,
      inputValue: '',
      testextends: ''
    }
  },
  computed: {
    ...mapState({
      user_type: state => state.user.user_type,
      api: state => state.api
    }),
    structureData: function() {
      return this.structureD
    },
    // backGroundUrl: function(me, template_info) {},
    backgroundImage: function() {
      const me = this
      return function(template_info) {
        if (template_info != '') {
          return {
            backgroundImage: `url(${me.api.images}${template_info[0].preview_path})`
          }
        } else {
          return ''
        }
      }
    }
  },
  created: function() {
    // this.changetext()
  },
  mounted: function() {
    // const me = this
  },
  methods: {
    selectDiv: function(self) {
      const me = this
      let structure_id = self.target.attributes.toid.value
      me.$store.dispatch('changeStructureIdFunc', structure_id)
      me.$store.dispatch('changeNewStructureIdFunc', '')
      me.$router.push({ path: '/canvas?userType=designer' })
    },
    newStructure: function() {
      const me = this
      me.showAddFunc(true)
    },
    showAddFunc: function(add) {
      const me = this
      if (add) {
        me.$set(me, 'setNew', true)
      } else {
        me.$set(me, 'setNew', false)
      }
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    buildModel() {
      const me = this
      let buildData = {}
      let framework_name = me.structureName
      let rule = []
      for (let i = 0; i < me.dynamicTags.length; i++) {
        let ruleD = {}
        ruleD.position = i
        ruleD.position_name = me.dynamicTags[i]
        rule.push(ruleD)
      }
      buildData.framework_name = framework_name
      buildData.rule = rule
      axios({
        method: 'post',
        url: me.api.add_framework_info,
        data: buildData
      })
        .then(function(response) {
          if (response.data.code == '200') {
            // 设置架构名称
            me.$store.dispatch('ChangeRenderFunc', {
              key: 'mould_name',
              value: framework_name
            })
            me.$message({
              message: '架构创建成功，将跳转至模板编辑页面',
              type: 'success'
            })
            setTimeout(() => {
              // 设置骨架id和替换位置标签
              me.$store.dispatch('changeNewStructureIdFunc', parseInt(response.data.id))
              me.$store.dispatch('ChangeRenderFunc', {
                key: 'structure_position',
                value: rule
              })
              me.showAddFunc(false)
              // 数据初始化
              me.$set(me, 'structureName', '')
              me.$set(me, 'dynamicTags', ['主图', '背景', '装饰1'])
              // 跳转至编辑页面，编辑骨架专属模板
              me.$router.push({ path: '/canvas?userType=designer' })
            }, 1000)
          }
        })
        .catch(function() {})
    }
  }
}
</script>
