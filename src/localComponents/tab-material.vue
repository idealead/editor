<style type="text/css">
.material_search {
  height: 40px;
  background-color: white;
  border-radius: 10px;
  position: relative;
}

.material_search input {
  outline: none;
  width: 200px;
  height: 100%;
  line-height: 40px;
  font-size: 16px;
  color: #666;
  position: absolute;
  left: 0;
  top: 0;
  border: none;
  box-sizing: border-box;
  padding: 0 10px;
  border-radius: 10px;
}

.material_search_btn {
  position: absolute;
  top: 50%;
  right: 10px;
  width: 20px;
  height: 19px;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(../assets/side_block/search_btn.png);
  transform: translateY(-50%)
}

.material_kind {
  position: relative;
  float: left;
  width: 80px;
  height: 110px;
  margin-top: 10px;
  cursor: pointer;
}

.material_kind_icon {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 102px;
  height: 102px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(../assets/side_block/img_kind.png);
  background-position: top center;
}

.material_kind p {
  font-size: 16px;
  line-height: 30px;
  color: #333;
  position: absolute;
  bottom: 0;
  display: block;
  text-align: center;
  width: 100%;
}

.clear_both {
  float: unset;
  clear: both;
}

.material_kind_img,
.material_kind_svg {
  text-align: left;
  padding-top: 20px;
}

.material_block,
.my_upload {
  width: 70px;
  height: 70px;
  display: inline-block;
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  margin: 0 5px 10px 5px;
}

</style>
<template>
  <div class="tab_page tab_material">
    <div class="material_search">
      <input placeholder="输入关键词" type='text' />
      <div class="material_search_btn"></div>
    </div>
    <div class="material_kind" @click="kind_click_f('img')">
      <div class="material_kind_icon"></div>
      <p>图片</p>
    </div>
    <div class="material_kind" @click="kind_click_f('svg')">
      <div class="material_kind_icon"></div>
      <p>矢量图</p>
    </div>
    <div class="material_kind" @click="kind_click_f('icon')">
      <div class="material_kind_icon"></div>
      <p>图标</p>
    </div>
    <div class='clear_both'></div>
    <div class="material_kind_img" v-show="material_kind.name=='img'">
      <div v-for="item in img_kind" class="material_block" :data-src='item.src' :id='item.id' :style="{backgroundImage:'url('+item.src+')'}" @click="add_element(item.id,item.src)">
      </div>
    </div>
    <div class="material_kind_svg" v-show="material_kind.name=='svg'">
      <div v-for="item in svg_kind" class="material_block" :data-src='item.src' :id='item.id' :style="{backgroundImage:'url('+item.src+')'}" @click="add_element(item.id,item.src)">
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'tab-material',
  props: {
    msg: String //例子
  },
  computed: {
    ...mapState({
      project_m_comp: state => state.project_m_comp
    })
  },
  data: function() {
    return {
      material_kind: {
        name: 'img'
      },
      img_kind: [{
        src: require('../assets/canvas/Lighthouse.jpg'),
        id: 'img1'
      }, {
        src: require('../assets/canvas/robat.png'),
        id: 'img2'
      }, {
        src: require('../assets/canvas/boss31.png'),
        id: 'img3'
      }, {
        src: require('../assets/canvas/opacity.png'),
        id: 'img4'
      }, {
        src: require('../assets/canvas/role1.png'),
        id: 'img5'
      }, {
        src: require('../assets/canvas/0.png'),
        id: 'img6'
      }],
      svg_kind: [{
        src: require('../assets/canvas/location.svg'),
        id: 'img7'
      },{
        src: require('../assets/canvas/svg.svg'),
        id: 'img8'
      },{
        src: require('../assets/canvas/svg1.svg'),
        id: 'img9'
      }]

    }
  },
  created: function() {

  },
  methods: {
    kind_click_f: function(name) {
      const me = this;
      me.$set(me.material_kind, 'name', name)
    },
    add_element: function(id, src) {
      const me = this;
      id = `${id}_${(new Date()).valueOf()}`
      let data = {
        id: id,
        src: src,
        text: ''
      }
      //通知side-block打开元素模块分类选择
      me.$emit('add-e', data)
    }
  },
  components: {

  }
};

</script>
