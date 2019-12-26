<template>
  <transition name="upDown" appear>
    <div class="addPop">
      <transition name="fade">
        <div class="addPop_block" v-show="addBtn_show">
          <div class="addPop_btn addPop_textBtn" @click="addChose('text')">
            <div class="addPop_addText addPop_addBtn"></div>
            <p>添加文字</p>
          </div>
          <div class="addPop_btn addPop_imageBtn" @click="addChose('image')">
            <div class="addPop_addImage addPop_addBtn"></div>
            <p>添加图片</p>
          </div>
        </div>
      </transition>
      <transition name="fade">
        <div class="addPop_text_block" v-show="text_block_show">
          <input type="text" name v-model="textC" />
          <div class="addPop_submit" @click="add_element('text')">确定</div>
          <p class="addPop_back" @click="back" v-if="!edit_mode">返回</p>
        </div>
      </transition>
      <div class="addPop_image_blcok" v-show="image_block_show">
        <div class="addPop_upload_demo">
          <div class="el-upload-list">
            <el-upload
              class="uploadbtn"
              :action="uploadUrl"
              list-type="picture-card"
              :on-success="on_success"
              :on-preview="add_element_image"
              :data="mydata"
              :before-upload="before_upload"
              :show-file-list="false"
            >
              <i class="el-icon-plus"></i>
              <p>本地上传</p>
              <!-- <div slot="tip" class="el-upload__tip">
            <p slot="tip" class="addPop_back" @click="back" v-if="!image_change">返回</p>
              </div>-->
            </el-upload>
            <div
              class="chosseImg"
              v-for="(item, index) in fileList.list"
              :key="index"
              @click="add_element_image(item)"
            >
              <img :src="item.src" />
            </div>
          </div>
        </div>
      </div>
      <div class="addPop_close" @click="closePop"></div>
    </div>
  </transition>
</template>
<style type="text/css" lang="less" scoped>
.uploadbtn {
  text-align: center;
  display: inline-block;
  overflow: hidden;
  margin: 5px;
  position: relative;
  p{
    position: absolute;
    bottom: 5px;
    text-align: center;
    font-size: 12px;
    width: 100%;
    line-height: 12px;
  }
}
.chosseImg {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  display: inline-block;
  margin: 5px;
  overflow: hidden;
  position: relative;
  background-color: rgb(203, 203, 203);
  cursor: pointer;
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
}
.addPop_upload_demo .el-upload-list__item {
  width: 17.7%;
  margin: 0 1%;
  /*   transform: translateX(-8.5px); */
  display: inline-block;
  border: 1px solid #ce3939;
  margin-bottom: 5px;
}
.el-upload-list__item-thumbnail {
  width: auto;
}
.el-upload-list__item-name {
  margin-right: 10px;
}
.addPop_upload_demo .el-upload__tip {
  margin: 7px 0 15px 0;
}

.el-upload__tip {
  display: inline-block;
  position: absolute;
  right: 10%;
}

.addPop_upload_demo .el-upload-list {
  width: calc(100% + 18px);
  height: calc(100% - 50px);
  overflow-y: auto;
  margin-top: 10px;
  transform: translatex(-8.5px);
}

.uploadbtn .el-button {
  background-color: #fff;
  color: #ce3939;
  border: 1px solid #ce3939;
}

.uploadbtn .el-button:hover {
  background-color: #ce3939;
  color: #fff;
}

.addPop_upload_demo {
  width: 90%;
  height: 100%;
  overflow: hidden;
  display: inline-block;
  box-sizing: border-box;
}

.addPop_back {
  display: inline-block;
  font-size: 10px;
  color: #c9c9c9;
  margin-left: 20px;
  cursor: pointer;
}

.addPop_text_block,
.addPop_image_blcok {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

.addPop_image_blcok {
  height: 100%;
}

.addPop_text_block input {
  outline: none;
  width: 800px;
  height: 30px;
  border: none;
  border-bottom: 2px solid #ce3939;
  display: inline-block;
  font-size: 16px;
  padding: 0 5px;
}

.addPop_submit {
  width: 80px;
  height: 30px;
  background-color: #ce3939;
  border-radius: 30px;
  display: inline-block;
  font-size: 16px;
  line-height: 30px;
  color: white;
  margin-left: 20px;
  cursor: pointer;
}

.addPop {
  width: 1300px;
  height: 300px;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) translateZ(0);
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  background-color: white;
  box-shadow: 0px 0px 25px rgba(133, 93, 93, 0.5);
  // background-image: url("../assets/canvas/addPop.png");
  // background-repeat: no-repeat;
  // background-size: cover;
  z-index: 10;
}

@media screen and (max-width: 1700px) {
  .addPop {
    width: 1100px;
    height: 300px;
  }

  .addPop_text_block input {
    width: 600px;
  }
}

@media screen and (max-width: 1500px) {
  .addPop {
    width: 1000px;
    height: 270px;
  }

  .addPop_text_block input {
    width: 450px;
  }
}

.addPop_block {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.addPop_btn {
  display: inline-block;
  margin: 0 30px;
  text-align: center;
  color: #c9c9c9;
  font-size: 16px;
  cursor: pointer;
}

.addPop_btn:hover {
  color: #ce3939;
}

.addPop_textBtn:hover .addPop_addText {
  background-image: url('../assets/canvas/addText_active.png');
}

.addPop_imageBtn:hover .addPop_addImage {
  background-image: url('../assets/canvas/addImage_active.png');
}

.addPop_addBtn {
  width: 93px;
  height: 93px;
  background-repeat: no-repeat;
  background-size: cover;
  margin-bottom: 10px;
  transition: background-image 0.4s;
}

.addPop_addText {
  background-image: url('../assets/canvas/addText.png');
}

.addPop_addImage {
  background-image: url('../assets/canvas/addImage.png');
}

.addPop_close {
  position: absolute;
  width: 62px;
  height: 62px;
  right: -20px;
  top: -20px;
  background-image: url('../assets/canvas/addPop_close.png');
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
  transition: background-image 0.5s;
}

.addPop_close:hover {
  background-image: url('../assets/canvas/addPop_close_active.png');
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
 {
  opacity: 0;
}

.upDown-enter-active,
.upDown-leave-active {
  transition: bottom 0.5s;
}

.upDown-enter,
.upDown-leave-to {
  bottom: -350px;
}
</style>
<script type="text/javascript">
import { mapState, mapActions, mapGetters } from 'vuex'
import bus from '@/eventBus.js'
import axios from 'axios'
export default {
  name: 'addPop',
  props: {
    msg: String // 例子
  },
  computed: {
    ...mapState({
      user_data: state => state.user.user_data,
      api: state => state.api
    }),
    key_entf: function() {
      let entf = this.keyboard(13)
      entf.press = () => {}
      entf.release = () => {}
      return entf
    },
    uploadUrl: function() {
      // return `http://dev.cyrd.gdinsight.com/api/files/upload_file_once/author_id/${this.user_data.id}.html`
      return `${this.api.upload_file_once}${this.user_data.id}.html`
    }
  },
  data: function() {
    return {
      edit_mode: false,
      textC: '',
      addBtn_show: true,
      text_block_show: false,
      image_block_show: false,
      fileList: {
        list: []
        // list: [{ name: 'food.jpeg', src: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1343015815,2335192405&fm=26&gp=0.jpg", url: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1343015815,2335192405&fm=26&gp=0.jpg", id: 'qweqweq' }, { name: 'food2.jpeg', url: require('../assets/canvas/Lighthouse.jpg'), src: require('../assets/canvas/Lighthouse.jpg') }, { name: 'food2.jpeg', url: require('../assets/canvas/Lighthouse.jpg'), src: require('../assets/canvas/Lighthouse.jpg') }]
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      image_change: false,
      mydata: {
        upload_file_once: {}
      }
    }
  },
  beforeDestroy: function() {},
  created: function() {
    const me = this
    bus.$off('text_edit_mode').$on('text_edit_mode', function(text) {
      me.$set(me, 'edit_mode', true)
      me.$set(me, 'textC', text)
      me.$set(me, 'addBtn_show', false)
      me.$set(me, 'text_block_show', true)
    })
    bus.$off('image_change').$on('image_change', function() {
      me.$set(me, 'edit_mode', true)
      me.$set(me, 'addBtn_show', false)
      me.$set(me, 'image_block_show', true)
      me.$set(me, 'image_change', true)
    })
    me.key_entf.press = function() {
      // 快捷键监听
      if (me.text_block_show) {
        me.add_element('text')
      }
    }
    // 获取上传过的图片
    me.getImg()
  },
  methods: {
    addChose: function(type) {
      const me = this
      me.$set(me, 'addBtn_show', false)
      if (type == 'text') {
        me.$set(me, 'text_block_show', true)
      } else if (type == 'image') {
        me.$set(me, 'image_block_show', true)
      }
    },
    getImg: function() {
      const me = this
      let id = me.user_data.id
      axios({
        method: 'post',
        url: me.api.find_file,
        data: {
          id: id
        }
      })
        .then(function(response) {
          if (response.data.code == '200') {
            let imgA = response.data.data
            for (let i = 0; i < imgA.length; i++) {
              imgA[i].file_id = imgA[i].id
              imgA[i].url = `${me.api.images}${imgA[i].path}`
              imgA[i].src = `${me.api.images}${imgA[i].path}`
              imgA[i].name = 'qwe'
            }
            imgA.reverse()
            me.$set(me.fileList, 'list', imgA)
          }
        })
        .catch(function() {})
    },
    closePop: function() {
      const me = this
      me.reset()
      bus.$emit('addPopShow', false)
    },
    back: function() {
      const me = this
      me.$set(me, 'image_block_show', false)
      me.$set(me, 'text_block_show', false)
      me.$set(me, 'addBtn_show', true)
      me.$set(me, 'textC', '')
    },
    add_element: function(type) {
      const me = this
      if (me.textC !== '') {
        if (type == 'text' && !me.edit_mode) {
          let id = `text_${new Date().valueOf()}`
          let data = {
            id: id,
            src: '',
            text: me.textC,
            m_comp_name: 'product'
          }
          bus.$emit('add_element_func', data)
        } else if (me.edit_mode) {
          // 向canvas.vue发送通知
          bus.$emit('change_text', me.textC)
        }
        me.reset()
        me.closePop()
        me.textC = ''
      }
    },
    add_element_image: function(file) {
      const me = this
      if (me.image_change) {
        // 替换图片
        let data = {
          file_id: file.id,
          src: file.src
        }
        bus.$emit('change_in_move_image', data)
      } else {
        // 新增图片
        let time = new Date().getTime()
        let data = {
          file_id: file.id,
          id: `${file.id}${time}`,
          src: file.src,
          text: '',
          m_comp_name: 'product'
        }
        console.log(data.src)
        bus.$emit('add_element_func', data)
      }
      me.reset()
      me.closePop()
      me.textC = ''
    },
    handleRemove: function(file) {
      const me = this
      let u_id = file.uid
      let list = me.fileList.list.filter(item => item.uid != u_id)
      me.$set(me.fileList, 'list', list)
    },
    handlePictureCardPreview: function(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    on_success: function(response, file, fileList) {
      const me = this
      let item = {
        size: null,
        arc: null,
        status: 1,
        name: 'userup'
      }
      Object.assign(
        item,
        { src: me.api.images + response.data.savepath },
        { url: me.api.images + response.data.savepath },
        { file_id: parseInt(response.data.file_id) },
        { id: parseInt(response.data.file_id) }
      )
      // item.src = this.api.images + response.data.savepath
      // item.url = this.api.images + response.data.savepath
      // item.file_id = parseInt(response.data.file_id)

      this.$set(this.fileList, 'list', [item, ...this.fileList.list])
    },
    before_upload: function(file) {
      this.$set(this.mydata, 'upload_file_once', file)
    },
    reset: function() {
      const me = this
      me.$set(me, 'edit_mode', false)
      me.$set(me, 'textC', '')
      me.$set(me, 'text_block_show', false)
      me.$set(me, 'image_block_show', false)
      me.$set(me, 'addBtn_show', true)
      me.$set(me, 'image_change', false)
    },
    keyboard: function(keyCode) {
      let key = {}
      key.code = keyCode
      key.isDown = false
      key.isUp = true
      key.press = undefined
      key.release = undefined
      // The `downHandler`
      key.downHandler = event => {
        if (event.keyCode === key.code) {
          if (key.isUp && key.press) key.press()
          key.isDown = true
          key.isUp = false
          event.preventDefault()
        }
      }
      // The `upHandler`
      key.upHandler = event => {
        if (event.keyCode === key.code) {
          if (key.isDown && key.release) key.release()
          key.isDown = false
          key.isUp = true
          event.preventDefault()
        }
      }
      // Attach event listeners
      window.addEventListener('keydown', key.downHandler.bind(key), false)
      window.addEventListener('keyup', key.upHandler.bind(key), false)
      return key
    }
  }
}
</script>
