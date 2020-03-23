<template>
  <div class="myDesign">
    <h2>
      {{pageIndex==0?'未提交':''}}{{pageIndex==1?'已提交':''}}
      <span>{{projectArr.length}}</span>
    </h2>
    <div class="designArea">
      <div
        class="designProject"
        v-for="(item,index) in projectArr"
        :key="item.id"
        v-bind:style="{backgroundImage:`url('${api.images}${item.path}')`}"
        @mouseover="hoverFunc(index)"
        @mouseleave="outFunc(index)"
      >
        <div class="hoverBlock" v-if="item.select">
          <div v-if="pageIndex==0" class="blockBtn">
            <div class="designBtn" @click="changeProject(item.id,index)">修改项目</div>
            <div class="designBtn" @click="submit(item.id,index)">提交审核</div>
            <div class="designBtn">删除</div>
          </div>
          <p class="projectState" v-if="pageIndex==1">审核通过</p>
          <div v-if="pageIndex==1" class="blockBtn">
            <div class="designBtn" @click="showTagFunc(true,index)">设置标签</div>
            <div
              class="designBtn"
              @click="online(item.id,item.status==3?1:3)"
            >{{item.status==3?'上线':'下线'}}</div>
            <div class="designBtn" v-if="item.status==3" @click="online(item.id,0)">撤回提交</div>
          </div>
        </div>
        <el-badge
          :value="item.status==3?'未上线':'已上线'"
          class="itemNew"
          v-if="pageIndex==1"
          v-bind:type="item.status==3?'primary':'success'"
        ></el-badge>
      </div>
    </div>
    <div class="alertBg" v-if="showTag">
      <div class="alertTag">
        <div
          class="theDesign"
          v-bind:style="{backgroundImage:`url('${api.images}${tempData.img}')`}"
        ></div>
        <div class="theMsg">
          <div class="msgBlock">
            <p>名称：{{tempData.name}}</p>
            <p>id：{{tempData.id}}</p>
            <p>状态：{{tempData.status}}</p>
          </div>
        </div>
        <div class="theTag">
          <div class="designTagPool">
            <p>模板标签：</p>
            <el-tag
              :key="tag.id"
              v-for="(tag,index) in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(index)"
            >{{tag.answer_t}}</el-tag>
          </div>
          <p class="textleft">标签池：</p>
          <div class="tagPool">
            <el-tag
              type="info"
              v-for="tag in tagPool"
              :key="tag[0]"
              class="selectTag"
              @click="selectTagFunc(tag)"
            >{{tag[1]}}</el-tag>
          </div>
          <!--           <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>-->
          <el-button type="primary" round class="saveBtn" @click="saveTag" size="small">保存</el-button>
          <el-button type="info" round class="cancelBtn" @click="showTagFunc(false)" size="small">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style type="text/css" lang='less' scoped>
@margin-top: 100px;
.myDesign {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin-top: @margin-top;
}

h2 {
  padding-left: 2.5%;
  text-align: left;
  span {
    font-size: 14px;
    color: gray;
    margin-left: 4%;
  }
}

.designArea {
  width: 100%;
  margin-left: 1.25%;
  height: calc(100% - 200px);
  overflow-y: auto;
  margin-top: 10px;
}

.designProject {
  width: 30%;
  float: left;
  margin: 0 1.25%;
  height: 34%;
  border-radius: 15px;
  background-color: white;
  margin-bottom: 25px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
}

.hoverBlock {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  position: absolute;
  left: 0;
  top: 0;
}

.blockBtn {
  width: 100%;
  height: 35px;
  position: absolute;
  bottom: 5%;
  text-align: center;
}

.designBtn {
  width: 22%;
  height: 35px;
  background-color: rgb(205, 57, 56);
  border-radius: 35px;
  line-height: 35px;
  display: inline-block;
  font-size: 14px;
  color: white;
  margin: 0 5%;
  cursor: pointer;
}

.projectState {
  position: absolute;
  width: 100%;
  height: 35px;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: white;
  font-size: 20px;
  line-height: 35px;
}

.itemNew {
  float: right;
}
.alertBg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.alertTag {
  width: 1200px;
  height: 500px;
  background-color: white;
  border-radius: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.theDesign {
  width: 30%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  left: 0;
  top: 0;
}

.theMsg {
  width: 15%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 30%;
}

.msgBlock {
  width: 100%;
  position: absolute;
  bottom: 10px;
}

.msgBlock p {
  font-size: 13px;
  line-height: 25px;
  text-align: left;
}

.theTag {
  width: 55%;
  height: 100%;
  position: absolute;
  right: 0;
  padding: 10px;
  box-sizing: border-box;
}

/* /标签 ***************************/
.el-tag + .el-tag,
.el-tag {
  margin-left: 10px;
  margin-bottom: 10px;
}

.button-new-tag {
  margin-left: 10px;
  margin-bottom: 10px;
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

/* /标签 ***************************/
.designTagPool {
  width: 100%;
  height: 40%;
  overflow-y: auto;
  /* border-bottom: 1px solid rgb(205, 57, 56) */
}

.tagPool {
  width: 100%;
  height: 40%;
  overflow-y: auto;
  padding-top: 10px;
}

.selectTag {
  cursor: pointer;
}

.tagPool p,
.designTagPool p,
.textleft {
  text-align: left;
  font-size: 15px;
}

.saveBtn {
  position: absolute;
  bottom: 10px;
  left: 20%;
  width: 100px;
  margin: 0;
}

.cancelBtn {
  position: absolute;
  bottom: 10px;
  right: 20%;
  width: 100px;
  margin: 0;
}
</style>
<script>
// @ is an alias to /src
import { mapState, mapActions, mapGetters } from 'vuex'
import bus from '@/eventBus.js'
import axios from 'axios'
// import _ from 'lodash'
export default {
  name: 'myDesign',
  data: function() {
    return {
      pageIndex: 0,
      projectArr: [
        {
          img: '',
          id: '1',
          select: false
        },
        {
          img: '',
          id: '2',
          select: false
        },
        {
          img: '',
          id: '3',
          select: false
        }
      ],
      tempData: null,
      showTag: false,
      dynamicTags: [[0, '标签一'], [1, '标签一as'], [2, '标签一12wer3']],
      inputVisible: false,
      inputValue: '',
      tagPool: [[0, '标签一'], [1, '标签一as'], [2, '标签一12wer3'], [3, '标签一123erter']]
    }
  },
  computed: {
    ...mapState({
      user_type: state => state.user.user_type,
      user_data: state => state.user.user_data,
      api: state => state.api
    })
  },
  created: function() {},
  mounted: function() {
    const me = this
    me.getTempData(0)
    bus.$off('myDesignIndex').$on('myDesignIndex', function(index) {
      if (index == me.pageIndex) {
      } else {
        me.getTempData(index)
        me.$set(me, 'pageIndex', index)
      }
    })
  },
  methods: {
    getTempData: function(index) {
      const me = this
      // 我的设计tab切换
      let postData = {
        user_id: me.user_data.id,
        status: index == 1 ? '1,3' : `${index}`
      }
      axios({
        method: 'post',
        url: me.api.template_audit_list,
        data: postData
      }).then(function(res) {
        res = res.data
        // 处理设计师用户的模板项目
        if (res.data.length > 0) {
          let projectArr = res.data
          let outLine = []
          let onLine = []
          for (let i = 0; i < projectArr.length; i++) {
            projectArr[i].select = false
            if (projectArr[i].status == 3 || projectArr[i].status == 0) {
              outLine.push(projectArr[i])
            }
            if (projectArr[i].status == 1) {
              onLine.push(projectArr[i])
            }
          }
          let newArr = [...outLine, ...onLine]
          me.$set(me, 'projectArr', newArr)
        } else {
          let empty = []
          me.$set(me, 'projectArr', empty)
        }
      })
    },
    hoverFunc: function(index) {
      const me = this
      // let project=me.projectArr.map((item)=>{item.select=false;
      //   return item
      // })
      // me.$set(me,'projectArr',project)
      me.$set(me['projectArr'][index], 'select', true)
    },
    outFunc: function(index) {
      const me = this
      me.$set(me['projectArr'][index], 'select', false)
    },
    submit: function(id, index) {
      const me = this
      axios({
        method: 'post',
        url: me.api.temp_change_status,
        data: {
          id: parseInt(id),
          status: 3,
          author: me.user_data.id
        }
      })
        .then(function(res) {
          me.projectArr.splice(index, 1)
          me.$message({
            message: '项目提交成功，请前往“已提交”查看',
            type: 'success'
          })
        })
        .catch(function() {
          me.$message.error('提交错误请稍后再试')
        })
    },
    showTagFunc: function(show, index = 0) {
      const me = this
      if (show) {
        // 查看标签池
        axios({
          method: 'get',
          url: me.api.find_label_list
        }).then(function(res) {
          res = res.data
          if (res.data.length > 0) {
            let tagPool = []
            for (let i = 0; i < res.data.length; i++) {
              let item = []
              item.push(parseInt(res.data[i].id))
              item.push(res.data[i].answer_t)
              tagPool.push(item)
            }
            me.$set(me, 'tagPool', tagPool)
          }
        })
        // 更新此模板数据
        me.$set(me, 'dynamicTags', me.projectArr[index].label_id)
        me.$set(me, 'tempData', {
          img: me.projectArr[index].path,
          name: me.projectArr[index].template_name,
          id: me.projectArr[index].id,
          status: me.projectArr[index].status == 1 ? '已上线' : '未上线'
        })
        //
      }
      me.$set(me, 'showTag', show)
    },
    handleClose(index) {
      this.dynamicTags.splice(index, 1)
    },
    selectTagFunc: function(tag) {
      const me = this
      let tagIn = false
      if (me.dynamicTags && me.dynamicTags.length > 0) {
        tagIn = me.dynamicTags.some(item => item.id == tag[0])
      } else {
      }
      if (!tagIn) {
        let data = _.cloneDeep(me.dynamicTags)
        if (!(data instanceof Array)) data = []
        data.push({ id: tag[0], answer_t: tag[1] })
        me.$set(me, 'dynamicTags', data)
        data = null
      }
    },
    saveTag: function() {
      const me = this
      // 保存标签
      let tagArr = []
      for (let i = 0; i < me.dynamicTags.length; i++) {
        tagArr.push(parseInt(me.dynamicTags[i].id))
      }
      axios({
        method: 'post',
        url: me.api.add_template_label,
        data: {
          id: me.tempData.id,
          label_id: JSON.stringify(tagArr)
        }
      }).then(function(res) {
        me.getTempData(me.pageIndex)
        me.$message({
          message: '标签保存成功',
          type: 'success'
        })
      })
    },
    changeProject: function(id) {
      const me = this
      // me.$router.push({ path: `/canvas?userType=designer&tempId=1520` })
      me.$router.push({
        path: `/canvas?userType=designer&tempId=${parseInt(id)}`
      })
    },
    online: function(id, status) {
      const me = this
      axios({
        method: 'post',
        url: me.api.complete_template_audit,
        data: {
          id: parseInt(id),
          status: status,
          author: me.user_data.id
        }
      })
        .then(function(res) {
          if (status === 1) {
            me.$message({
              message: '项目上线成功',
              type: 'success'
            })
          } else if (status === 0) {
            me.$message({
              message: '撤销成功，回到《未提交》',
              type: 'success'
            })
          } else if (status === 3) {
            me.$message({
              message: '下线成功',
              type: 'success'
            })
          }

          me.getTempData(1)
        })
        .catch(function() {
          me.$message.error('提交错误请稍后再试')
        })
    }
    // showInput() {
    //   this.inputVisible = true;
    //   this.$nextTick(_ => {
    //     this.$refs.saveTagInput.$refs.input.focus();
    //   });
    // },

    // handleInputConfirm() {
    //   let inputValue = this.inputValue;
    //   if (inputValue) {
    //     this.dynamicTags.push(inputValue);
    //   }
    //   this.inputVisible = false;
    //   this.inputValue = '';
    // }
  }
}
</script>
