<template>
  <div class="structureMaterial">
    <div class="structureNav">
      <el-tabs v-model="first" @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in structureData" :label="item.data.framework_name" :name="`${item.data.id}`" :index="index" :key="index">{{item.data.framework_name}}</el-tab-pane>
        <!--     <el-tab-pane label="B2架构" name="second">B2架构</el-tab-pane>
    <el-tab-pane label="C3架构" name="third">C3架构</el-tab-pane>
    <el-tab-pane label="D4架构" name="fourth">D4架构</el-tab-pane> -->
      </el-tabs>
    </div>
    <div class="materialList" v-if="show">
      <div class="materialKind" v-for="(item,index) in now_structureData.data.rule" :key="index">
        <el-tag>{{item.position_name}}：</el-tag>
        <div class="materialDiv">
          <div class="materialBlock" v-for="(it,index) in item.files" :key="index">
            <div class="materialImg" :style="{backgroundImage:`url('${api.images}${it.file_path}')`}"></div>
            <div class="materialBtnBlock">
              <!-- <div class="materialBtn" :fileid="it.id"><i class="el-icon-star-off "></i></div> -->
              <el-tooltip content="下载" placement="bottom" effect="light">
              <div class="materialBtn" @click="donwloadF(img)"><i class="el-icon-download "></i></div>
            </el-tooltip>
              <el-tooltip content="撤销" placement="bottom" effect="light">
              <div class="materialBtn" @click="backF(item.files[index])"><i class="el-icon-refresh-left "></i></div>
            </el-tooltip>
            </div>
          </div>
          <div class="materialBlock" style="cursor:pointer" @click="addImgF(item)">
            <!-- <div class="materialImg"></div> -->
            <i class="el-icon-plus plus" size="normal"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="alertBg" v-if="addImg">
      <div class="layoutBlock">
        <div v-for="(item,index) in myMaterial" :key="index" :style="{backgroundImage:'url('+item.url+')'}" @mouseover="hoverFunc(index)" @mouseleave="outFunc(index)" :class="{'zoom':item.hover,myMaterial:true,'selected':item.select}" @click="selectF(item,index)">
          <i class="el-icon-paperclip lock" v-show="item.status==3"></i>
        </div>
        <div class="setBtn">
          <el-button type="primary" round class="addBtn" @click="addBtn" size="small">添加</el-button>
          <el-button type="info" round class="cancelBtn" @click="cancelBtn" size="small">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style type="text/css" scoped>
.structureMaterial {
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

.materialList {
  width: 100%;
  margin-top: 20px
}

.materialList el-tag {
  font-size: 16px;
}

.materialKind {
  width: 100%;
  /*   margin-bottom: 20px; */
  text-align: left;
}

.materialDiv {
  width: 100%;
  text-align: left;
}

.materialBlock {
  width: 150px;
  height: 200px;
  border-radius: 7%;
  background-color: white;
  margin: 20px;
  display: inline-block;
  position: relative;
}

.materialImg {
  width: 150px;
  height: 150px;
  border-top-left-radius: 7%;
  border-top-right-radius: 7%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.plus {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateY(-50%) translateX(-50%) scale(1.5);
  color: red;
}

.materialBtnBlock {
  width: 100%;
  height: 50px;
  position: relative;
  float: left;
}

.materialBtn {
  width: 50px;
  height: 100%;
  position: relative;
  display: inline-block
}

.materialBtn i {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateY(-50%) translateX(-50%) scale(1.3);
  cursor: pointer;
}

.alertBg {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, .5);
  z-index: 9;
}

.layoutBlock {
  width: 50%;
  height: 50%;
  background-color: white;
  border-radius: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  box-sizing: border-box;
  padding: 20px;
  overflow-y: auto;
  text-align: left;
}

.addBtn {
  position: absolute;
  left: 20%;
  bottom: 20px
}

.cancelBtn {
  position: absolute;
  right: 20%;
  bottom: 20px;
}

.setBtn {
  position: sticky;
  width: 100%;
  bottom: 20px;
  height: 40px;
  left: 0;
}

.myMaterial {
  width: 100px;
  height: 100px;
  margin: 5px;
  background-size: contain;
  background-repeat: no-repeat;
  border-radius: 5px;
  background-position: center;
  border: 1px solid gray;
  position: relative;
  cursor: pointer;
  display: inline-block;
}

.lock {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%) scale(2);
  color: red;
}

.zoom {
  background-size: 150%;
}

.selected {
  border: 1px solid rgb(66, 158, 253);
  background-size: 150%;
}

</style>
<script>
// @ is an alias to /src
import { mapState, mapActions, mapGetters } from 'vuex'
import bus from "@/eventBus.js"
import axios from 'axios'
export default {
  name: 'structureMaterial',
  props: {
    structureD: {
      type: Array,
      default: []
    }
  },
  data: function() {
    return {
      replaceData: [{ tagName: '主图' }, { tagName: '背景' }, { tagName: '装饰1' }],
      activeName: 'first',
      img: 'https://upload-images.jianshu.io/upload_images/2509688-d49b8f5bde26566d.jpeg?imageMogr2/auto-orient/strip|imageView2/2/w/640/format/webp',
      addImg: false,
      structure_index:0,
      structure_id:Number,//添加图片进入裂变区域，需要骨架id和，对应位置（数字，0开始）
      structure_postion:Number,
      select_file_id:Number,
      myMaterial: [{
        url: '',
        hover: false,
        select: false
      }],
      now_structureData:null,
      show:false
    }
  },
  computed: {
    ...mapState({
      user_type: state => state.user_type,
      user_data: state => state.user_data,
      api: state =>state.api
    }),
    structureData: function() {
      const me=this;
      return this.structureD
    },
    first: function() {
      if (this.structureData[0]) {
        return `${this.structureData[0].data.id}`
      } else {
        return '1'
      }
    }
  },
  beforeCreate:function(){
    const me = this;
   
  },
  created: function() {
    const me = this;
    //传递骨架数据，然后加入队列再显示
    me.$set(me,'now_structureData',this.structureD[0])
    setTimeout(()=>{
      me.$set(me,'show',true)
    },0)
    
  },
  mounted: function() {
    const me = this;
    //初始化index为0的骨架的数据，（每个位置的替换素材）
    me.getStructureImg(0)
  },
  methods: {
    backF:function(item){
      const me=this;
      console.log(item)
      axios({
        method: 'post',
        url: me.api.del_framework_material,
        data:{
          id:item.id
        }
      }).then(function(response) {
        if (response.data.code == '200') {

        }
      }).catch(function(error) {

      });
    },
    addBtn(){
      //从我的素材添加图片进入 骨架替换区域
      const me=this;
      axios({
        method: 'post',
        url: me.api.add_framework_material,
        data:{
          user_id:me.user_data.id,
          material_id:me.select_file_id,
          framework_id:me.structure_id,
          position:me.structure_postion
        }
      }).then(function(response) {
        console.log(response)
        if (response.data.code == '200') {
          me.$message({
            message: '添加成功',
            type: 'success'
          });
          me.$set(me, 'addImg', false)
          me.getStructureImg(me.structure_index)
        }
      }).catch(function(error) {

      });
    },
    getStructureImg(index = 0) {
      const me = this;
      let sId = me.structureData[index].data.id;
      axios({
        method: 'get',
        url: `${me.api.find_framework_info}?framework_id=${sId}`
      }).then(function(response) {
        if (response.status==200&&response.data.code == '200') {
          me.$set(me,'now_structureData',response.data)
        }
      }).catch(function(error) {

      });
    },
    handleClick(tab, event) {
      const me = this;
      me.$set(me, 'structure_index', parseInt(tab.index))
      me.getStructureImg(me.structure_index)
    },
    addImgF: function(item) {
      const me = this;
      me.$set(me, 'addImg', true)
      me.$set(me, 'structure_id', item.framework_id)
      me.$set(me, 'structure_postion', item.position)
      //请求我上传的图片
      me.getImg()
      //
    },
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
            imgA[i].hover = false;
            imgA[i].select = false;
            imgA[i].url = `${me.api.images}${imgA[i].path}`
          }
          me.$set(me, 'myMaterial', imgA)
        }
      }).catch(function(error) {

      });
    },
    cancelBtn: function() {
      const me = this;
      me.$set(me, 'addImg', false)
    },
    hoverFunc: function(index) {
      const me = this;
      me.$set(me.myMaterial[index], 'hover', true)
    },
    outFunc: function(index) {
      const me = this;
      me.$set(me.myMaterial[index], 'hover', false)
    },
    selectF: function(item, index) {
      const me = this;
      if (item.status == 3) {
        me.$message({
            message: '该图片已经被添加，锁定',
            type: 'warning'
          });
      } else {
        for (let i = 0; i < me.myMaterial.length; i++) {
          me.myMaterial[i].select = false;
        }
        me.$set(me.myMaterial[index], 'select', true)
        me.$set(me, 'select_file_id', item.id)
      }

    },
    donwloadF: function(imgsrc) {
      fetch(imgsrc).then(res => res.blob().then(blob => {
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(blob);
        var filename = 'myImg.png';
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      }))
    },
  },
}

</script>
