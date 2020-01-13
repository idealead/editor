<style type="text/css">
.upload_btn {
  height: 40px;
  border-radius: 10px;
  color: #fff;
  background-color: #f73;
  position: relative;
  text-align: center;
  font-size: 16px;
  line-height: 40px;
}

.upload_input {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer
}

.local_upload {
  text-align: center;
  padding-top: 20px;
}

.el-upload-list__item {
  margin: 0 !important;
}

</style>
<template>
  <div class="tab_page tab_upload">
    <!--         <el-upload action="#" list-type="picture-card" :auto-upload="true" :multiple="false" :file-list="fileList.list">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                        <i class="el-icon-zoom-in"></i>
                    </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="add_element(file)">
                        <i class="el-icon-plus"></i>
                    </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                        <i class="el-icon-delete"></i>
                    </span>
                </span>
            </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog> -->
    <el-upload class="upload-demo" action="http://cyrd.intech.gdinsight.com/api/files/upload_file_once/author_id/1.html" :on-success="on_success" :on-preview="add_element" :on-remove="handleRemove" :file-list="fileList.list" list-type="picture" :data="mydata" :before-upload="before_upload">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>
<script type="text/javascript">
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  computed: {

  },
  data: function() {
    return {
      fileList: {
        list: [{ name: 'food.jpeg', src: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1343015815,2335192405&fm=26&gp=0.jpg', url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1343015815,2335192405&fm=26&gp=0.jpg', id: 'qweqweq' }, { name: 'food2.jpeg', url: require('../assets/canvas/Lighthouse.jpg'), src: require('../assets/canvas/Lighthouse.jpg') }]
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      mydata: {
        upload_file_once: {}
      }
    }
  },
  methods: {
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
    add_element: function(file) {
      const me = this
      let id = `upload_${(new Date()).valueOf()}`
      let data = {
        id: id,
        src: file.src,
        text: ''
      }
      // 通知side-block打开元素模块分类选择
      me.$emit('add-e', data)
    },
    on_success: function(response, file, fileList) {
      file.src = 'http://cyrd.intech.gdinsight.com' + response.data.savepath
      this.$set(this.fileList, 'list', fileList)
    },
    before_upload: function(file) {
      this.$set(this.mydata, 'upload_file_once', file)
    }
  }
}

</script>
