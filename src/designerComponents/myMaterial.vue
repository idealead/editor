<template>
  <div class="myMaterial">
    <el-upload :action="uploadUrl" list-type="picture-card" :on-success="inputMsg" :file-list="fileList" :data="mydata" :before-upload="before_upload">
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}" class="imgDiv">
        <img
        class="el-upload-list__item-thumbnail"
        v-lazy="file.url" alt=""
        >
        <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleData(file)"
        >
          <i class="el-icon-tickets"></i>
        </span>
        <span
          v-if="file.status==3"
          class="el-upload-list__item-delete"
          @click="handleRemove(file)"
        >
          <i class="el-icon-paperclip lock"></i>
        </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
      <div class="alertBg" v-if="setNew">
        <div class="layoutBlock">
          <div class="inputBlock">
            <el-input placeholder="单位(px)" v-model="file.size.height" size="small" type="number">
              <template slot="prepend">图片高</template>
            </el-input>
          </div>
          <div class="inputBlock">
            <el-input placeholder="单位(px)" v-model="file.size.width" size="small" type="number">
              <template slot="prepend">图片宽</template>
            </el-input>
          </div>
          <el-button type="primary" plain size="mini" @click="showArc" class="arcBtn">弧形文字装饰 <i :class="edit_arc?'el-icon-arrow-up':'el-icon-arrow-down'"></i></el-button>
          <div class="arc" v-show="edit_arc">
            <div class="inputBlock">
              <el-input placeholder="单位(deg)" v-model="file.arc.arc_deg" size="small" type="number">
                <template slot="prepend">角度</template>
              </el-input>
            </div>
            <div class="inputBlock">
              <el-input placeholder="单位(px)" v-model="file.arc.radius" size="small" type="number">
                <template slot="prepend">半径</template>
              </el-input>
            </div>
            <div class="inputBlock">
              <el-input placeholder="文字中线至顶部距离——单位(px)" v-model="file.arc.centerToTop" size="small" type="number">
                <template slot="prepend">距离</template>
              </el-input>
            </div>
            <div class="inputBlock">
              <el-input placeholder="弧形方向(up,down)" v-model="file.arc.direction" size="small" type="text">
                <template slot="prepend">弧形方向</template>
              </el-input>
            </div>
          </div>
          <div class="setBtn">
            <el-button type="primary" round class="saveBtn" @click="saveUpload" size="small">保存</el-button>
            <el-button type="info" round class="cancelBtn" @click="cancelBlock" size="small">取消</el-button>
          </div>
        </div>
      </div>
  </div>
</template>
<style type="text/css" scoped>
.myMaterial {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  padding: 20px;
  box-sizing: border-box;
  padding-top: 100px;
  overflow-y: auto;
  text-align: left;
}

.alertBg {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, .5);
  z-index: 9
}

.layoutBlock {
  width: 600px;
  height: 400px;
  background-color: white;
  border-radius: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  box-sizing: border-box;
  padding: 20px;
}

.inputBlock {
  margin-bottom: 10px;
}

.arcBtn {
  margin-bottom: 10px
}

.setBtn {
  position: absolute;
  width: 100%;
  bottom: 20px;
  left: 0;
}

.saveBtn {
  position: absolute;
  left: 20%;
  bottom: 0
}

.cancelBtn {
  position: absolute;
  right: 20%;
  bottom: 0;
}

.lock {
  color: red
}
.imgDiv{
  position: relative; 
  height: 100%;
}
.el-upload-list__item-thumbnail{
  object-fit: contain;
}
</style>
<script>
// @ is an alias to /src
import { mapState, mapActions, mapGetters } from 'vuex'
// import bus from "@/eventBus.js"
import axios from 'axios'
export default {
  name: 'myMaterial',
  data: function() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: [],
      mydata: {
        upload_file_once: {}
      },
      file: {
        size: {
          height: 0,
          width: 0
        },
        arc: {
          arc_deg: 0,
          radius: 0,
          centerToTop: 0,
          direction: 'down'
        }
      },
      file_id: '',
      setNew: false,
      edit_arc: false,
      newAdd: true, //判断是新上传还是，修改之前的信息

    }
  },
  computed: {
    ...mapState({
      user_type: state => state.user.user_type,
      user_data: state => state.user.user_data,
      api: state => state.api
    }),
    uploadUrl: function() {
      return `${this.api.upload_file_once}${this.user_data.id}.html`
    }
  },
  created: function() {
    
  },
  mounted: function() {
    const me = this;
    //获取用户之前上传的图片
    me.getImg()
  },
  methods: {
    getImg: function() {
      const me = this;
      let id = me.user_data.id
      axios({
        method: 'post',
        url: me.api.find_file,
        data: {
          id: id
        }
      }).then(function(response) {
        if (response.data.code == '200') {
          let imgA = response.data.data;
          for (let i = 0; i < imgA.length; i++) {
            imgA[i].file_id = imgA[i].id;
            imgA[i].url = `${me.api.images}${imgA[i].path}`
          }
          me.$nextTick(()=>{
            me.$set(me, 'fileList', imgA)
          })
        }
      }).catch(function(error) {

      });
    },
    showArc: function() {
      const me = this;
      me.$set(me, 'edit_arc', !me.edit_arc)
    },
    before_upload: function(file) {
      this.$set(this.mydata, 'upload_file_once', file)
    },
    inputMsg: function(response, file, fileList) {
      const me = this;
      if (response && response.code == 0) {
        //上传文件成功
        me.$set(me, 'setNew', true)
        me.$set(me, 'file_id', response.data.file_id)
      }
    },
    handleData: function(file) {
      //修改上传图片的数据
      const me = this
      console.log(file)
      if (file.response) {
        me.$set(me, 'file_id', file.response.data.file_id)
      } else if (file.file_id) {
        me.$set(me, 'file_id', file.file_id)
        //重置属性
        if (file.size) {
          me.$set(me.file, 'size', file.size)
        } else {
          me.$set(me.file, 'size', {
            height: null,
            width: null
          })
        }
        if (file.arc) {
          me.$set(me.file, 'arc', JSON.parse(file.arc))
        } else {
          me.$set(me.file, 'arc', {
            arc_deg: null,
            radius: null,
            centerToTop: null,
            direction: null
          })
        }
      }

      me.$set(me, 'newAdd', false)
      me.$set(me, 'setNew', true)
    },
    cancelBlock: function() {
      //取消输入数据面板
      const me = this;
      // if(me.newAdd)me.beforeList.splice(-1,1)
      me.$set(me, 'setNew', false)
    },
    saveUpload: function() {
      //设置参数
      const me = this;
      axios({
        method: 'post',
        url: me.api.change_file_rule,
        data: {
          size: JSON.stringify(me.file.size),
          arc: JSON.stringify(me.file.arc),
          file_id: me.file_id
        }
      }).then(function(response) {
        me.$message({
          message: '图片参数设置成功',
          type: 'success'
        });
        me.$set(me, 'setNew', false)
      }).catch(function(error) {

      });
    },
    handleRemove(file) {
      me.$message({
        message: '该图片已经被添加，锁定',
        type: 'warning'
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload (file) {
      console.log(file)
    }
  }
}

</script>
