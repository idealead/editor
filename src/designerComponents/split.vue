<template>
  <div class="split">
    <div class="structureNav">
      <el-tabs v-model="first" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item,index) in structureD"
          :label="item.data.framework_name"
          :name="`${item.data.id}`"
          :index="index"
          :key="index"
        >{{item.data.framework_name}}</el-tab-pane>
      </el-tabs>
    </div>
    <div class="smodelBlock" v-loading="loading">
      <div class="demo-image__preview">
        <div class="splitModel" v-for="(item,index) in splitModelArr" :key="index">
          <el-image
            style="width: 150px; height: 200px"
            :src="item.path==1?url:item.path"
            :preview-src-list="[item.path==1?url:item.path]"
            fit="cover"
          ></el-image>
          <el-tooltip content="通过" placement="bottom" effect="light">
            <i class="el-icon-success"></i>
          </el-tooltip>
          <el-tooltip content="渲染组合" placement="bottom" effect="light">
            <i class="el-icon-picture-outline-round" @click="renderF(item,index)"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
    <el-button type="primary" class="moreSplit" @click="moreF">查看更多</el-button>
  </div>
</template>
<style type="text/css" scoped>
.split {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  padding: 20px;
  box-sizing: border-box;
  padding-top: 100px;
  overflow-y: auto;
}

.structureNav {
  width: 100%;
  height: auto;
  box-sizing: border-box;
}

.smodelBlock {
  width: 100%;
  margin-top: 20px;
  text-align: left;
  min-height: 50%;
}

.splitModel {
  width: 150px;
  height: 200px;
  background-size: contain;
  background-repeat: no-repeat;
  /*   border: 1px solid red; */
  position: relative;
  display: inline-block;
  margin: 15px;
  /*   float: left; */
}

.splitModel .el-image {
  border-radius: 5px;
}

.el-icon-success {
  position: absolute;
  left: 10%;
  bottom: 5%;
  transform: scale(2);
  cursor: pointer;
  color: white;
}

.el-icon-picture-outline-round {
  position: absolute;
  right: 10%;
  bottom: 5%;
  transform: scale(2);
  cursor: pointer;
  color: white;
}

/* .splitDiv{
  position: relative;
}
.splitDiv img{
  width: 100% !important;
  height: auto !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translateX(-50%) translateY(-50%) !important
} */
.moreSplit {
  position: fixed;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
}
</style>
<script>
// @ is an alias to /src
import * as PIXI from 'pixi.js'
import { mapState, mapActions, mapGetters } from 'vuex'
// import bus from '@/eventBus.js'
import axios from 'axios'
import renderTemp from '@/homeComponents/pixiFunc/renderTemp.js'
export default {
  name: 'split',
  props: {
    structureD: {
      type: Array
      // default: []
    }
  },
  data: function() {
    return {
      url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
      srcList: ['https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'],
      splitModelArr: [],
      structureIndex: 0,
      page: 0,
      now_arr: [],
      now_page_arr: [],
      loading: false,
      application: null
    }
  },
  computed: {
    ...mapState({
      user_type: state => state.user.user_type,
      user_data: state => state.user.user_data,
      api: state => state.api
    }),
    structureData: function() {
      console.log(this.structureD)
      return this.structureD
    },
    first: function() {
      if (this.structureData) {
        return `${this.structureData[0].data.id}`
      } else {
        return '1'
      }
    }
  },
  created: function() {
    const me = this
    me.application = new PIXI.Application({
      backgroundColor: 0xf5f5f5,
      width: 2500,
      height: 2500,
      antialias: 1
    })
  },
  mounted: function() {
    const me = this
    me.$set(me, 'page', 0)
    // 获取架构排列组合，然后按10个10个显示渲染
    me.getSplitPermutation(parseInt(me.structureData[0].data.id))
  },
  methods: {
    renderF: function(item, index) {
      const me = this
      if (item.path == 1 && item.template_id == 0) {
        // 执行渲染方法，回调成功后，提交渲染结果
        let replaceData = []
        for (let i = 0; i < item.combination.length; i++) {
          let d = {
            position: i,
            file_id: item.combination[i][0],
            src: `${me.api.images}${item.combination[i][1]}`
          }
          replaceData.push(d)
        }
        me.$set(me, 'loading', true)
        let tempId = me.structureData[me.structureIndex].data.template_id
        // 渲染函数
        renderTemp.tempInit(renderTemp, { tempId: tempId, app: me.application, expand: false, split: true, splitData: replaceData }, res => {
          me.renderSubmit.bind(me)(res, item, index)
        })
        //
      } else {
        me.$message({
          message: '此组合已经渲染过啦',
          type: 'warning'
        })
      }
    },
    renderSubmit: function(backData, item, index) {
      const me = this
      let path = 'http://ht.idealead.hbindex.com' + backData.render_preview_img
      axios({
        method: 'post',
        url: me.api.change_combination_template,
        data: {
          framework_id: parseInt(item.framework_id),
          template_id: backData.renderTempId,
          path: path,
          combination: item.combination_res
        }
      })
        .then(function(response) {
          if (response.status == 200 && response.data.code == '200') {
            let new_splitModelArr = me.splitModelArr
            new_splitModelArr[index].path = path
            me.$set(me, 'splitModelArr', new_splitModelArr)
            me.$set(me, 'loading', false)
          }
        })
        .catch(function(error) {})
    },
    handleClick(tab, event) {
      const me = this
      if (me.structureIndex !== parseInt(tab.index)) {
        me.$set(me, 'page', 0)

        me.$set(me, 'structureIndex', parseInt(tab.index))
        setTimeout(() => {
          me.getSplitPermutation(parseInt(me.structureData[me.structureIndex].data.id))
        }, 0)
      }
    },
    getSplitPermutation(id) {
      const me = this
      axios({
        method: 'get',
        url: `${me.api.get_combination}?framework_id=${id}`
      })
        .then(function(response) {
          if (response.status == 200 && response.data.code == '200') {
            if (response.data.data.length > 0) {
              me.$set(me, 'now_page_arr', []) // 清空当前页数的数据
              me.$set(me, 'splitModelArr', [])
              me.$set(me, 'now_arr', response.data.data)
              me.separateF(me.getPermutationModelData)
                .then(function(wantF) {
                  wantF()
                })
                .catch(function() {
                  me.$set(me, 'loading', false)
                })
            } else {
              me.$message({
                message: '还没有素材裂变',
                type: 'warning'
              })
              me.$set(me, 'now_arr', response.data.data)
              me.$set(me, 'splitModelArr', [])
              me.$set(me, 'loading', false)
            }
          }
        })
        .catch(function(error) {})
    },
    moreF: function() {
      const me = this
      me.separateF(me.getPermutationModelData)
        .then(function(wantF) {
          wantF()
        })
        .catch(function() {
          me.$set(me, 'loading', false)
        })
    },
    getPermutationModelData: function() {
      const me = this
      let data = {
        framework_id: parseInt(me.structureData[0].data.id),
        data: JSON.stringify(me.now_page_arr)
      }
      // data=data
      axios({
        method: 'post',
        url: me.api.get_framework_combination,
        data: data
      })
        .then(function(response) {
          if (response.status == 200 && response.data.code == '200') {
            // 加载此请求回来的数据，加到splitModelArr数组末端
            me.$set(me, 'splitModelArr', [...me.splitModelArr, ...response.data.data])
            me.$set(me, 'page', me.page + 1)
            me.$set(me, 'loading', false)
          }
        })
        .catch(function() {
          me.$set(me, 'loading', false)
        })
    },
    separateF: function(wantF) {
      const me = this
      me.$set(me, 'loading', true)
      let begin = me.page * 10
      let end = begin + 9
      let now_page_arr = []
      if (end > me.now_arr.length + 9) {
        me.$message({
          message: '已经没有更多了',
          type: 'warning'
        })
      } else {
        for (let i = begin; i <= end; i++) {
          if (me.now_arr[i]) {
            now_page_arr.push(me.now_arr[i])
          }
        }
        me.$set(me, 'now_page_arr', now_page_arr)
      }

      return new Promise(function(resolve, reject) {
        if (typeof wantF === 'function' && end <= me.now_arr.length + 9) {
          resolve(wantF)
        } else if (end > me.now_arr.length - 1) {
          reject('error')
        } else {
          reject('error')
        }
      })
    }
  }
}
</script>
