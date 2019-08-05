<template>
  <div id="mainCanvas">
    <div class="mouse_right_block" v-show="right_block.show" v-bind:style="{left:right_block.rb_left,top:right_block.rb_top}">
      <div class="mouse_right_btn right_btn_association" v-show='right_block_ass'>
        <div v-if="right_block.menu.ass==1" @click="onRightAss">组合</div>
        <div v-else-if="right_block.menu.ass==2" @click='onRight_unAss'>取消组合</div>
      </div>
      <div class="mouse_right_btn right_btn_delete" v-show='right_block.menu.del' @click="onRightDelete">删除</div>
      <div class="mouse_right_btn" @click='toImage'>导出图片</div>
    </div>
    <transition name="slide-fade">
      <div class="edit_bar" v-show="edit_bar.btn.show">
        <el-tooltip class="item" effect="dark" content="编辑文字" placement="right">
          <div class="edit_btn text_btn" v-show="edit_bar.btn.text" @click.self="show_text_block">
            <div class="text_block" v-show="edit_bar.edit_text">
              <el-row class="text_row">
                <el-col :span="12">
                  <div class="grid-content text_left">字号<el-input v-model="edit_bar.text.fontSize" @change="fontSize_change" class="text_input" type="number"></el-input>
                  </div>
                </el-col>
                <el-col :span="12">
                  style
                  <el-select v-model="edit_bar.text.fontStyle" placeholder="" class="text_select" @change="fontStyle_change">
                    <el-option v-for="item in edit_bar.text_fontStyle" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="grid-content">行高<el-slider v-model="edit_bar.text.lineHeight" class="" :min="-20" :max="30" @change="lineHeight_change"></el-slider>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="block">
                    <span class="demonstration"></span>
                    <el-color-picker v-model="edit_bar.text.color" @active-change="fontColor_change"></el-color-picker>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="位置" placement="right">
          <div class="edit_btn location_btn" v-show="edit_bar.btn.location">
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="旋转" placement="right">
          <div class="edit_btn rotation_btn" v-show="edit_bar.btn.rotation" @click.self="show_rotation_block">
            <div class="rotation_block" v-show="edit_bar.edit_rotation">
              <el-slider v-model="edit_bar.rotation" @change="rotation_change" :min="-180" :max="180"></el-slider>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="不透明度" placement="right">
          <div class="edit_btn opacity_btn" v-show="edit_bar.btn.opacity" @click.self="show_opacity_block">
            <div class="opacity_block" v-show="edit_bar.edit_opacity">
              <el-slider v-model="edit_bar.opacity" @change="opacity_change"></el-slider>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="上移一层" placement="right">
          <div class="edit_btn up_btn" v-show="edit_bar.btn.updown" @click="move_index(true)"></div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="下移一层" placement="right">
          <div class="edit_btn down_btn" v-show="edit_bar.btn.updown" @click="move_index(false)"></div>
        </el-tooltip>
      </div>
    </transition>
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#mainCanvas {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0%;
  top: 0%;
}

#mainCanvas canvas {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: 0% 0%;
  -webkit-transform-origin: 0% 0%;
  -moz-transform-origin: 0% 0%;
  transform: scale(1) translateX(-810px) translateY(-710px);
}

.mouse_right_block {
  width: 170px;
  height: 200px;
  background-color: white;
  box-shadow: 5px 5px 3px rgba(0, 0, 0, .2);
  position: absolute;
  border-radius: 10px;
  padding: 10px;
  z-index: 9;
}

.mouse_right_btn {
  position: relative;
  text-align: center;
  font-size: 16px;
  line-height: 35px;
  height: 35px;
  border-radius: 15px;
  cursor: pointer
}

.mouse_right_btn:hover {
  background-color: rgb(243, 242, 245);
}

.edit_bar {
  width: 60px;
  text-align: center;
  padding: 10px;
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  box-sizing: border-box;
  z-index: 9;
}

.slide-fade-enter-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  transition-delay: .3s;
}

.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  transition-delay: .3s;
}

.slide-fade-enter,
.slide-fade-leave-to

/* .slide-fade-leave-active for below version 2.1.8 */
  {
  transform: translateX(50px) translateY(-50%);
  opacity: 0;
}

.edit_btn {
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  position: relative;
}

.up_btn {
  background-image: url('../assets/canvas/up_container.png')
}

.down_btn {
  background-image: url('../assets/canvas/down_container.png')
}

.opacity_btn {
  background-image: url('../assets/canvas/mirror.png')
}

.rotation_btn {
  background-image: url('../assets/canvas/rotation.png')
}

.location_btn {
  background-image: url('../assets/canvas/location.svg')
}

.text_btn {
  background-image: url('../assets/canvas/text.png')
}

.opacity_block,
.rotation_block {
  position: absolute;
  right: 70px;
  width: 280px;
  height: 40px;
  padding: 0 20px;
  background-color: #303133;
  box-sizing: border-box;
}

.text_block {
  position: absolute;
  right: 70px;
  width: 240px;
  background-color: #303133;
  box-sizing: border-box;
  padding: 10px;
  color: white;
}

.text_input {
  width: 60%;
}

.text_input input,
.text_select input {
  height: 25px;
  line-height: 25px;
  margin: 0 5px;
  padding: 0 5px;
}

.text_left {
  text-align: left;
}

.text_right {
  text-align: right;
}

.text_row {
  font-size: 14px;
  margin: 5px 0;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.text_select {
  width: 60%;
}

.text_select .el-input__icon {
  line-height: 25px;
}

</style>
<script>
import * as PIXI from 'pixi.js'
import { mapState, mapActions, mapGetters } from 'vuex'
import bus from "@/eventBus.js"
import logo from '../assets/logo.png'
import scale from '../assets/scale.png'
import rotate from '../assets/rotate.png'
import stretch from '../assets/stretch.png'
document.oncontextmenu = function() {
  event.returnValue = false;
}
export default {
  name: 'Canvas',
  props: {
    msg: String
  },
  data: function() {
    return {
      logo: logo,
      scale: scale,
      rotate: rotate,
      stretch: stretch,
      p_app: null,
      img_app: null,
      r_btn_h: 30, //旋转按钮偏移量
      association: [], //组合对象数组，一个组合可以包含多个容器
      ass_r_data: {}, //补充的组合旋转时运算的数据
      container_arr: [], //容器数组中index越小，层级越低
      outLine_container: null,
      mainStage_container: null,
      in_move: null,
      temporary_rect: null,
      ctrl_arr: [],
      imgLoading: false, //图片元素加载变量，控制每次只有一个图片加载
      click_time: 0, //鼠标点击的时间
      click_ass_id: '', //上一个click对象
      can_change: 0,
      can_rotate: 0,
      can_stretch: 0,
      right_block: { //右键点击面板的属性数据
        rb_left: '0px',
        rb_top: '0px',
        show: false,
        menu: {
          ass: 1, //1代表组合，2代表取消组合，3代表没有组合按钮
          del: true,
          top: false,
          bot: false,
          cop: true,
        },
        delete_type: 0
      },
      edit_bar: {
        btn: {
          show: false,
          text: true,
          location: true,
          rotation: true,
          opacity: true,
          updown: false,
        },
        edit_text: false,
        text: {
          fontSize: 0,
          lineHeight: 0,
          fontStyle: 'normal',
          color: '#000000'
        },
        text_fontStyle: [{
          label: "normal",
          value: 'normal'
        }, {
          label: "italic",
          value: "italic"
        }, {
          label: "oblique",
          value: "oblique"
        }],
        edit_opacity: false,
        opacity: 100,
        edit_opacity: false,
        rotation: 0,
      },
      render_data: [{
        m_comp_name: 'product',
        z_index: 1,
        children: [{
          ass_children: [{
            src: require('../assets/canvas/bg.jpg'),
            type: 'image',
            id: 'image123',
            m_comp_name: 'product',
            rotation: 0,
            scale: 1,
            position: {
              x: 277.7,
              y: 392.9
            },
            text: '',
            alpha: 1
          }],
          association_id: ''
        }]
      }, {
        m_comp_name: 'product',
        z_index: 1,
        children: [{
          ass_children: [{
            src: require('../assets/canvas/army.png'),
            type: 'image',
            id: 'image563',
            m_comp_name: 'product',
            rotation: 0,
            scale: 1,
            position: {
              x: 277.7,
              y: 488
            },
            text: '',
            alpha: 1
          }],
          association_id: ''
        }]
      },{
        m_comp_name: 'product',
        z_index: 2,
        children: [{
          ass_children: [{
            src: '',
            type: 'text',
            id: 'text111',
            m_comp_name: 'product',
            rotation: 0,
            scale: 1,
            position: {
              x: 134,
              y: 189
            },
            text: '强军梦',
            style: {
              fontFamily: '方正美黑',
              fontSize: 75,
              lineHeight: 85,
              fontStyle: 'normal',
              fontWeight: 'normal',
              fill: '#efe4d4',
              stroke: '#000',
              strokeThickness: 0,
              letterSpacing:0,
              dropShadow: false,
              dropShadowColor: '#000000',
              dropShadowAngle: Math.PI / 6,
              dropShadowDistance: 8,
              wordWrap: true,
              wordWrapWidth: 250,
              breakWords: true,
              padding: 70,
              trim: true
            },
            alpha: 1
          }],
          association_id: ''
        }]
      }, {
        m_comp_name: 'product',
        z_index: 2,
        children: [{
          ass_children: [{
            src: '',
            type: 'text',
            id: 'text11',
            m_comp_name: 'product',
            rotation: 0,
            scale: 1,
            position: {
              x: 134,
              y: 86
            },
            text: '中国梦',
            style: {
              fontFamily: '方正美黑',
              fontSize: 75,
              lineHeight: 85,
              fontStyle: 'normal',
              fontWeight: 'normal',
              fill: '#efe4d4',
              stroke: '#000',
              strokeThickness: 0,
              dropShadow: false,
              dropShadowColor: '#000000',
              dropShadowAngle: Math.PI / 6,
              dropShadowDistance: 8,
              wordWrap: true,
              wordWrapWidth: 230,
              breakWords: true,
              padding: 70,
              trim: true
            },
            alpha: 1
          }],
          association_id: ''
        }]
      }, {
        m_comp_name: 'product',
        z_index: 2,
        children: [{
          ass_children: [{
            src: '',
            type: 'text',
            id: 'text11123',
            m_comp_name: 'product',
            rotation: 0,
            scale: 1,
            position: {
              x: 65,
              y: 133
            },
            text: '演讲献礼',
            style: {
              fontFamily: '',
              fontSize: 12,
              lineHeight: 22,
              letterSpacing: 5,
              fontStyle: 'normal',
              fontWeight: 'normal',
              fill: '#efe4d4',
              stroke: '#000',
              strokeThickness: 0,
              dropShadow: false,
              dropShadowColor: '#000000',
              dropShadowAngle: Math.PI / 6,
              dropShadowDistance: 8,
              wordWrap: true,
              wordWrapWidth: 300,
              breakWords: true,
              padding: 70,
              trim: true
            },
            alpha: 1
          }],
          association_id: ''
        }]
      }, {
        m_comp_name: 'product',
        z_index: 2,
        children: [{
          ass_children: [{
            src: '',
            type: 'text',
            id: 'text11273',
            m_comp_name: 'product',
            rotation: 0,
            scale: 1,
            position: {
              x: 200,
              y: 133
            },
            text: '扬我军威',
            style: {
              fontFamily: '',
              fontSize: 12,
              lineHeight: 22,
              letterSpacing: 5,
              fontStyle: 'normal',
              fontWeight: 'normal',
              fill: '#efe4d4',
              stroke: '#000',
              strokeThickness: 0,
              dropShadow: false,
              dropShadowColor: '#000000',
              dropShadowAngle: Math.PI / 6,
              dropShadowDistance: 8,
              wordWrap: true,
              wordWrapWidth: 300,
              breakWords: true,
              padding: 70,
              trim: true
            },
            alpha: 1
          }],
          association_id: ''
        }]
      }, {
        m_comp_name: 'product',
        z_index: 2,
        children: [{
          ass_children: [{
            src: '',
            type: 'text',
            id: 'text112739',
            m_comp_name: 'product',
            rotation: 0,
            scale: 1,
            position: {
              x: 134,
              y: 235
            },
            text: '"热血军魂" 主题演讲比赛',
            style: {
              fontFamily: '',
              fontSize: 12,
              lineHeight: 22,
              letterSpacing: 5,
              fontStyle: 'normal',
              fontWeight: 'normal',
              fill: '#efe4d4',
              stroke: '#000',
              strokeThickness: 0,
              dropShadow: false,
              dropShadowColor: '#000000',
              dropShadowAngle: Math.PI / 6,
              dropShadowDistance: 8,
              wordWrap: true,
              wordWrapWidth: 300,
              breakWords: true,
              padding: 70,
              trim: true
            },
            alpha: 1
          }],
          association_id: ''
        }]
      }]
    }
  },
  computed: {
    ...mapState({
      window_w: state => state.window_w,
      window_h: state => state.window_h,
      canvas_width: state => state.canvas_width,
      canvas_height: state => state.canvas_height,
      project_m_comp: state => state.project_m_comp
    }),
    key_ctrlf: function() {
      let ctrlf = this.keyboard(17);
      ctrlf.press = () => {};
      ctrlf.release = () => {};
      return ctrlf;
    },
    right_block_ass: function() {
      if (this.right_block.menu.ass == 1 || this.right_block.menu.ass == 2) {
        return true
      } else { return false }
    }
  },
  created: function() {
    const me = this;
    this.p_app = new PIXI.Application({
      backgroundColor: 0xf5f5f5,
      width: me.window_w,
      height: me.window_h,
      antialias: 1
    });
    this.initPixiApp();
    bus.$on('add_element_func', function(data) {
      //添加元素进canvas
      if (data.src !== '' && data.text == '') {
        me.newContainer(data, false, function() {
          me.update_layer()
        })
      } else if (data.src == '' && data.text !== '') {
        me.newContainer_text(data, false)
        //将元素加入图层tab
        me.update_layer()
      }
    })
    bus.$on('layer_click', function(id) {
      me.show_click(id)
    })
  },
  methods: {
    render_template: function() {
      const me = this;
      let data = me.render_data;
      //获取数据，先渲染图片和文字，再对相应的组合进行渲染
      //收集模版中每个模块的首要组合的资源进入缓存
      let img_src = [];
      for (let i = 0; i < data.length; i++) {
        for (let k = 0; k < data[i].children[0].ass_children.length; k++) {
          if (data[i].children[0].ass_children[k].type == 'image' || data[i].children[0].ass_children[k].type == 'svg') {
            img_src.push(data[i].children[0].ass_children[k].src)
          }
        }
      }
      me.p_app.loader.add(img_src, {
        crossOrigin: true
      }).load(function() {
        for (let i = 0; i < data.length; i++) {
          for (let k = 0; k < data[i].children[0].ass_children.length; k++) {
            let element_data = data[i].children[0].ass_children[k];
            element_data.association_id = data[i].children[0].association_id
            if (data[i].children[0].ass_children[k].type == 'image' || data[i].children[0].ass_children[k].type == 'svg') {
              //增加图片父级，添加图片并设置图片
              me.newContainer(element_data, true)
            } else if (data[i].children[0].ass_children[k].type == 'text') {
              me.newContainer_text(element_data, true)
            }
          }
        }
        me.renderStage()
        //渲染组合矩形
        let ass_arr_obj = {};
        for (let j = 0; j < me.container_arr.length; j++) {
          if (me.container_arr[j].cont.children[0].association_name !== '') {
            let ass_id = me.container_arr[j].cont.children[0].association_name;
            if (ass_arr_obj[ass_id]) {} else {
              ass_arr_obj[ass_id] = []
            }
            ass_arr_obj[ass_id].push(me.container_arr[j].cont.children[0])
          }
        }
        let keys_arr = Object.keys(ass_arr_obj)
        for (let l = 0; l < keys_arr.length; l++) {
          let key = keys_arr[l]
          me.ctrl_arr = ass_arr_obj[key];
          me.create_association(key, ass_arr_obj[key][0].m_comp_name, true)
        }

        //渲染
        me.renderStage()
        me.update_layer()
      })
    },
    initPixiApp: function() {
      const me = this;
      //加载一些必要的配图
      me.p_app.loader.add([me.scale, me.rotate, me.stretch]).load(function() {
        document.getElementById('mainCanvas').appendChild(me.p_app.view)
        me.p_app.view.style.width = me.window_w + "px";
        me.p_app.view.style.height = me.window_h + "px";

        me.p_app.stage.off().on('mousedown', me.cancel_something);
        //创建主内容容器，包含所有内容，固定尺寸，container_arr作为其子元素
        let mainStage = new PIXI.Container;
        mainStage.width = me.canvas_width;
        mainStage.height = me.canvas_height;
        mainStage.position.set((me.window_w - me.canvas_width) / 2, (me.window_h - me.canvas_height) / 2);
        mainStage.accessible = true;
        me.mainStage_container = mainStage;
        me.p_app.stage.addChild(me.mainStage_container)
        //增加遮罩,遮罩加在stage
        me.maskInit()
        //增加标尺加在stage
        me.ruler();
        me.render_template();

      })
    },
    renderStage: function() {
      const me = this;
      me.p_app.stage.children[0].removeChildren();

      //有可能要加入一个点击的矩形，用于取消之前选中的对象
      me.add_cancle_rect(me.mainStage_container)
      //
      for (let i = 0; i < me.container_arr.length; i++) {
        //按顺序渲染容器
        me.mainStage_container.addChild(me.container_arr[i].cont);
        me.container_arr[i].cont.buttonMode = false;
      }
      //增加按钮线框容器
      me.outLine(me.mainStage_container)

      me.p_app.renderer.render(me.p_app.stage);
      // const graphics = new PIXI.Graphics();
      // graphics.beginFill(0xFF0000,1);
      // graphics.drawRect((me.window_w-me.canvas_width)/2, (me.window_h-me.canvas_height)/2, me.canvas_width, me.canvas_height);
      // graphics.endFill();
      // me.p_app.stage.mask=graphics
      me.p_app.stage.interactive = true;
      me.p_app.stage.hitArea = new PIXI.Rectangle(0, 0, me.window_w, me.window_h);
    },
    add_cancle_rect: function(mainStage) {
      const me = this;
      //创建矩形
      let rectangle = new PIXI.Graphics();
      rectangle.interactive = true;
      rectangle.width = me.window_w;
      rectangle.height = me.window_h;
      rectangle.beginFill(0xFF3300);
      rectangle.alpha = 0;
      rectangle.drawRect(0, 0, me.window_w, me.window_h);
      rectangle.endFill();
      rectangle.name = 'cancel_block';
      rectangle.rotation_num = 0;
      rectangle.x = -(me.window_w - me.canvas_width) / 2;
      rectangle.y = -(me.window_h - me.canvas_height) / 2;
      //监听事件
      rectangle.on('click', me.cancel_in_move)
      mainStage.addChild(rectangle);
    },
    outLine: function(mainStage) {
      const me = this;
      let container = new PIXI.Container;
      container.type = 'outLine';
      container.name = 'outLine';
      mainStage.addChild(container);
      me.outLine_container = container
    },
    maskInit: function() {
      const me = this; //遮罩
      let rectangle = new PIXI.Graphics();
      rectangle.beginFill(0x000000, .2);
      rectangle.drawRect(0, 0, me.window_w, (me.window_h - me.canvas_height) / 2);
      rectangle.endFill();
      rectangle.x = 0;
      rectangle.y = 0;
      rectangle.interactive = false;
      me.p_app.stage.addChild(rectangle);
      let rectangle1 = new PIXI.Graphics();
      rectangle1.beginFill(0x000000, .2);
      rectangle1.drawRect(0, 0, me.window_w, (me.window_h - me.canvas_height) / 2);
      rectangle1.endFill();
      rectangle1.x = 0;
      rectangle1.y = me.canvas_height + (me.window_h - me.canvas_height) / 2;
      rectangle1.interactive = false;
      me.p_app.stage.addChild(rectangle1);
      let rectangle2 = new PIXI.Graphics();
      rectangle2.beginFill(0x000000, .2);
      rectangle2.drawRect(0, 0, (me.window_w - me.canvas_width) / 2, me.canvas_height);
      rectangle2.endFill();
      rectangle2.x = 0;
      rectangle2.y = (me.window_h - me.canvas_height) / 2;
      rectangle2.interactive = false;
      me.p_app.stage.addChild(rectangle2);
      let rectangle3 = new PIXI.Graphics();
      rectangle3.beginFill(0x000000, .2);
      rectangle3.drawRect(0, 0, (me.window_w - me.canvas_width) / 2, me.canvas_height);
      rectangle3.endFill();
      rectangle3.x = me.canvas_width + (me.window_w - me.canvas_width) / 2;
      rectangle3.y = (me.window_h - me.canvas_height) / 2;
      rectangle3.interactive = false;
      me.p_app.stage.addChild(rectangle3);
    },
    cancel_in_move: function() {
      const me = this;
      //取消当前选中对象
      me.removeLine()
      if (me.in_move) {
        me.in_move = null;
      } else if (me.temporary_rect) {
        me.clearTemporary()
      }
      me.click_ass_id = '';
      //右侧编辑栏
      me.$set(me.edit_bar.btn, 'show', false)
      me.hide_edit_f()
    },
    cancel_something: function(event) {
      const me = this;
      me.$set(me.right_block, 'show', false)
    },
    hide_edit_f: function() {
      const me = this;
      //隐藏编辑面板按钮里的功能面板
      me.$set(me.edit_bar, 'edit_opacity', false)
      me.$set(me.edit_bar, 'edit_rotation', false)
      me.$set(me.edit_bar, 'edit_text', false)
    },
    showEdit: function(type) {
      const me = this;
      let edit_btn = {}
      me.hide_edit_f()
      if (type == 'image') {
        edit_btn = {
          show: true,
          text: false,
          location: true,
          rotation: true,
          opacity: true,
          updown: true,
        }
      } else if (type == 'text') {
        edit_btn = {
          show: true,
          text: true,
          location: true,
          rotation: true,
          opacity: true,
          updown: true,
        }
      } else if (type == 'temporary') {
        edit_btn = {
          show: true,
          text: false,
          location: true,
          rotation: true,
          opacity: false,
          updown: false,
        }
      } else if (type == 'association') {
        edit_btn = {
          show: true,
          text: false,
          location: true,
          rotation: false,
          opacity: false,
          updown: true,
        }
      }
      me.change_edit_bar(edit_btn);
    },
    change_edit_bar: function(data) {
      const me = this;
      for (let key in me.edit_bar.btn) {
        me.$set(me.edit_bar.btn, key, data[key])
      }
    },
    show_text_block: function() {
      const me = this;
      me.hide_edit_f()
      let text_data = {
        fontSize: Math.floor(me.in_move.style.fontSize),
        lineHeight: me.in_move.lineHeightM,
        fontStyle: me.in_move.style.fontStyle,
        color: me.in_move.style.fill
      }
      me.$set(me.edit_bar, 'text', text_data)
      me.$set(me.edit_bar, 'edit_text', true)
    },
    fontSize_change: function(value) {
      value = parseInt(value)
      const me = this;
      //start
      let num = me.in_move.width / me.in_move.style.fontSize;
      me.in_move.text_num = num;
      //move
      let style=me.in_move.style;
      style.wordWrapWidth = num * value
      if (me.in_move.style.fontStyle == 'normal') {
        style.wordWrapWidth += style.fontSize * 0.2
      }
      console.log(style.wordWrapWidth)
      me.in_move.style=style;
      me.in_move.style.fontSize = value;
      console.log(me.in_move.width)
      me.in_move.style.lineHeight = me.in_move.style.fontSize + me.in_move.lineHeightM;
      me.p_app.renderer.render(me.in_move)
      //
      me.containerLine(me.in_move, false);
      me.scale_text_end(me.in_move)
    },
    fontStyle_change: function(value) {
      const me = this;
      me.in_move.style.fontStyle = value;
    },
    lineHeight_change: function(value) {
      value = parseInt(value)
      const me = this;
      me.in_move.lineHeightM = value;
      me.in_move.style.lineHeight = me.in_move.style.fontSize + me.in_move.lineHeightM;
      me.containerLine(me.in_move, false);
    },
    show_opacity_block: function() {
      const me = this;
      me.hide_edit_f()
      me.$set(me.edit_bar, 'opacity', me.in_move.alpha * 100)
      me.$set(me.edit_bar, 'edit_opacity', true)
    },
    opacity_change: function(value) {
      const me = this;
      me.in_move.alpha = value / 100;

    },
    show_rotation_block: function() {
      //初始化旋转值，和in_move一样或者和临时组合、组合一样
      const me = this;
      me.hide_edit_f()
      if (me.in_move && !me.temporary_rect && me.ctrl_arr.length == 0) {
        me.$set(me.edit_bar, 'rotation', Math.floor(me.in_move.rotation * 180 / Math.PI))
      } else if (me.temporary_rect) {
        me.$set(me.edit_bar, 'rotation', Math.floor(me.temporary_rect.rotation * 180 / Math.PI))
      }
      me.$set(me.edit_bar, 'edit_rotation', true)
    },
    rotation_change: function(value) {
      const me = this;
      if (me.in_move && !me.temporary_rect && me.ctrl_arr.length == 0) {
        me.in_move.rotation = value * Math.PI / 180;
        me.outLine_container.getChildByName(me.in_move.name).rotation = value * Math.PI / 180
      } else if (me.temporary_rect) {
        me.onTRotateStart();
        if (value > 0) {
          me.tRotateOBj(value * Math.PI / 180, 10000)
        } else {
          me.tRotateOBj(-value * Math.PI / 180, -10000)
        }
        me.onTRotateEnd()
      }
    },
    fontColor_change: function(value) {
      const me = this;
      me.in_move.style.fill = value
    },
    newContainer: function(set_data, render_add, func = () => {}) {
      //增加新图层新元素
      const me = this;
      if (!me.imgLoading) {
        me.cancel_in_move()
        // let position={};
        // if(render_add){
        //     position=set_data.position
        // }
        me.addContainer(set_data, set_data.position)
        me.loadSprite(set_data, render_add, func)
      } else {
        alert("已有元素再加载中")
      }
    },
    addContainer: function(set_data, position = { x: this.canvas_width / 2, y: this.canvas_height / 2 }) {
      const me = this;
      let container = new PIXI.Container;
      container.width = me.canvas_width;
      container.height = me.canvas_height;
      container.position.set(position.x, position.y);
      // container.name = `${set_data.id}_c`;
      container.type = `${set_data.type}_c`;
      container.rotation_num = 0;
      //按素材模块分类加入，找到此模块中元素的最高层级，在其后面加入
      me.container_arr_add(set_data.m_comp_name, container, set_data.id)
    },
    container_arr_add: function(m_comp_name, container, name) {
      const me = this;
      let final_index = me.find_final_index(m_comp_name);

      //相同模块中最后一个元素的index
      let arr1 = [];
      let arr2 = [{
        cont: container,
        index: 0,
        name: name,
        m_comp_name: m_comp_name
      }];
      let arr3 = [];
      if (final_index == me.container_arr.length - 1 || (final_index == 0 && me.container_arr.length == 0)) {
        me.container_arr = [...me.container_arr, ...arr2]
      } else {
        for (let i = 0; i < me.container_arr.length; i++) {
          if (i <= final_index) {
            arr1.push(me.container_arr[i])
          } else if (i > final_index) {
            arr3.push(me.container_arr[i])
          }
        }
        me.container_arr = [...arr1, ...arr2, ...arr3]
      }
      me.sort_container_arr(true)

    },
    find_final_index: function(m_comp_name) {
      const me = this;
      let final_index = -100; //相同模块中最后一个元素的index
      let len = me.project_m_comp.length - 1
      if (me.container_arr.length == 0) {
        final_index = 0
        return final_index
      } else if (me.project_m_comp[0].name == m_comp_name && me.container_arr.length > 0) {
        final_index = me.container_arr.length - 1;
        return final_index
      } else {
        me.container_arr.map(function(value, index, array) {
          if (value.m_comp_name == m_comp_name) {
            final_index = index;
          }
        })
        if (final_index == -100) {
          if (me.project_m_comp[len].name == m_comp_name) {
            return final_index = -1
          } else {
            for (let i = 0; i < me.project_m_comp.length; i++) {
              if (me.project_m_comp[i].name == m_comp_name) {
                return me.find_final_index(me.project_m_comp[i + 1].name)
              }
            }
          }
        } else {
          return final_index
        }
      }

    },
    loadSprite: function(set_data, render_add, func) {
      //加载精灵
      const me = this;
      let src = set_data.src;
      let my_set_data = _.cloneDeep(set_data);
      me.imgLoading = true;
      let sprite;
      if (me.p_app.loader.resources[src]) {
        //缓存过src的就直接新增
        sprite = new PIXI.Sprite(me.p_app.loader.resources[src].texture);
        me.addImg(sprite, my_set_data, render_add);
        me.imgLoading = false;
        func();
      } else {
        me.p_app.loader.add(src, {
          crossOrigin: true
        }).load(function() {
          if (/.svg$/.test(src)) {
            let res = new PIXI.resources.SVGResource(src, { scale: 1, autoLoad: true })
            res.load().then(function() {
              let texture = new PIXI.BaseTexture(res)
              let texture1 = new PIXI.Texture(texture)
              sprite = new PIXI.Sprite(texture1);
              sprite.svg = true;
              me.addImg(sprite, my_set_data, render_add);
              me.imgLoading = false;
              func();
            })
          } else {
            sprite = new PIXI.Sprite(me.p_app.loader.resources[src].texture);
            me.addImg(sprite, my_set_data, render_add);
            me.imgLoading = false;
            func();
          }
        });
      }
    },
    addImg: function(sprite, set_data, render_add) {
      //添加图片精灵(监听点击，有移动，拉伸功能)精灵名称和容器名称相同
      const me = this

      sprite.interactive = true;
      sprite.anchor.set(0.5);
      sprite.cursor = 'grab';
      sprite.name = set_data.id;
      sprite.type = 'image' //精灵类型为图片
      sprite.srcData = set_data.src;
      sprite.rotation_num = 0;
      sprite.originalw = sprite.width;
      sprite.originalh = sprite.height;
      sprite.position.set(0, 0);
      sprite.association_name = ''; //组合名字，为空说明没有组合
      sprite.m_comp_name = set_data.m_comp_name;
      if (render_add) {
        sprite.rotation = set_data.rotation;
        sprite.rotation_num = set_data.rotation;
        sprite.alpha = set_data.alpha;
        sprite.scale.set(set_data.scale)
        sprite.association_name = set_data.association_id
      }

      //监听事件
      sprite.on('rightdown', me.onRightC).on('mousedown', function(event) {
        me.onDragStart(sprite, event)
      }).on('mousemove', function(event) {
        me.onDragMove(sprite, event)
      }).on('pointerupoutside', function(event) {
        me.onDragEnd(sprite, event)
      }).on('pointerup', function(event) {
        me.onDragEnd(sprite, event)
      });
      //
      //
      me.container_arr[me.findCont(set_data.id)].cont.addChild(sprite);
      if (!render_add) {
        me.renderStage()
        //在图层面板增加图层

        //激活当前选中状态
        me.in_move = sprite
        me.containerLine(me.in_move, false);
        me.showEdit(me.in_move.type)
        //图层面板监听
      }

    },
    update_svg_scale: function(obj) {
      const me = this;
      let src = obj.texture.baseTexture.resource.svg;
      let res = new PIXI.resources.SVGResource(src, { scale: obj.scale.x * obj.texture.baseTexture.resource.scale, autoLoad: true })
      res.load().then(function() {
        obj.texture.baseTexture.destroy()
        obj.texture.baseTexture.setResource(res);
        obj.texture.baseTexture.update();
        obj.scale.set(1)
      })
    },
    newContainer_text: function(set_data, render_add) {
      //containerName文字元素名称（唯一）text_content文本内容
      const me = this;
      me.addContainer(set_data, set_data.position)
      me.addText(set_data, render_add)
    },
    addText: function(set_data, render_add) {
      const me = this;
      let style = {
        fontFamily: 'Lantinghei SC',
        fontSize: 50,
        lineHeight: 60,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fill: '#000',
        stroke: '#000',
        strokeThickness: 0,
        dropShadow: false,
        dropShadowColor: '#000000',
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 8,
        wordWrap: true,
        wordWrapWidth: 300,
        breakWords: true,
        padding: 70,
        trim: true
      };

      var richText = new PIXI.Text(set_data.text, style);
      richText.interactive = true;
      richText.anchor.set(0.5);
      richText.cursor = 'grab';
      richText.name = set_data.id;
      richText.type = 'text' //精灵类型为文本
      richText.rotation_num = 0;
      richText.originalw = richText.width;
      richText.originalh = richText.height;
      richText.ofonts = richText.style.fontSize;
      richText.position.set(0, 0);
      richText.lineHeightM = 10;
      richText.association_name = ''; //组合名字，为空说明没有组合
      richText.m_comp_name = set_data.m_comp_name;

      if (render_add) {
        richText.style = set_data.style;
        richText.rotation = set_data.rotation;
        richText.rotation_num = set_data.rotation;
        richText.alpha = set_data.alpha;
        richText.association_name = set_data.association_id;
      }
      me.container_arr[me.findCont(set_data.id)].cont.addChild(richText);
      if(set_data.text_num){
        richText.text_num = set_data.text_num;
      }else{
        richText.text_num = richText.width / richText.style.fontSize;
      }

      //监听事件
      richText.on('rightdown', me.onRightC).on('mousedown', function(event) {
        me.onDragStart(richText, event)
      }).on('mousemove', function(event) {
        me.onDragMove(richText, event)
      }).on('pointerupoutside', function(event) {
        me.onDragEnd(richText, event)
      }).on('pointerup', function(event) {
        me.onDragEnd(richText, event)
      });
      if (!render_add) {
        me.renderStage()
        me.in_move = richText;
        me.containerLine(richText, false);
        me.showEdit(me.in_move.type)
      }

      //*********
    },
    ruler: function() {
      const me = this;
      let ruler_container = new PIXI.Container;
      ruler_container.width = me.canvas_width;
      ruler_container.height = me.canvas_height;
      ruler_container.position.set(me.window_w / 2, me.window_h / 2)

      let line = new PIXI.Graphics();
      line.lineStyle(1, 0x827D7D, 1);
      for (let i = 1; i <= me.canvas_width; i++) {
        if (i % 100 == 0) {
          line.moveTo(i, 0)
          line.lineTo(i, -20)
        } else if (i % 50 == 0) {
          line.moveTo(i, 0)
          line.lineTo(i, -10)
        } else if (i % 10 == 0) {
          line.moveTo(i, 0)
          line.lineTo(i, -5)
        }
      }
      line.x = -me.canvas_width / 2;
      line.y = -me.canvas_height / 2;

      let line2 = new PIXI.Graphics();
      line2.lineStyle(1, 0x827D7D, 1);
      for (let i = 1; i <= me.canvas_height; i++) {
        if (i % 100 == 0) {
          line.moveTo(0, i)
          line.lineTo(-20, i)
        } else if (i % 50 == 0) {
          line.moveTo(0, i)
          line.lineTo(-10, i)
        } else if (i % 10 == 0) {
          line.moveTo(0, i)
          line.lineTo(-5, i)
        }
      }
      line2.x = -me.canvas_width / 2;
      line2.y = -me.canvas_height / 2;
      ruler_container.addChild(line)
      ruler_container.addChild(line2)
      me.p_app.stage.addChild(ruler_container);
    },
    containerLine: function(obj, t_a, a_r_btn = false) {
      const me = this
      //t_a用于判断是否是组合对象或者临时组合，是否添加按钮
      if (!t_a) {
        me.removeLine();
      }
      me.createBorder(obj, t_a, a_r_btn);
    },
    createBorder: function(obj, t_a, a_r_btn, show_btn = true) {
      const me = this;
      let dash = 5;
      //dash是虚线空隙
      let sprite_Border = new PIXI.Container;
      sprite_Border.width = me.canvas_width;
      sprite_Border.height = me.canvas_height;
      if (obj.type == 'association_gap' || obj.type == 'association_gap_notT') {
        //是组合空白区域或者临时组合的
        sprite_Border.position.set(obj.centerX, obj.centerY);
      } else {
        sprite_Border.position.set(obj.parent.position.x, obj.parent.position.y);
      }
      sprite_Border.pivot.set(0, 0);
      sprite_Border.type = 'outLine_child';
      sprite_Border.name = obj.name;
      me.outLine_container.addChild(sprite_Border);
      for (let i = 1; i <= 4; i++) {
        let line = new PIXI.Graphics();
        line.lineStyle(1, 0x87CEFF, 1);
        line.moveTo(0, 0);
        line.type = 'line';
        line.name = 'line'
        switch (i) {
          case 1:
            for (let k = 0; k < obj.height / dash; k++) {
              if (k % 2 == 0 || k == 0) {
                line.lineTo(0, dash * k);
              } else {
                line.moveTo(0, dash * k)
              }
              if (k + 1 >= obj.height / dash) {
                line.lineTo(0, obj.height);
              }
            }
            line.x = obj.width / 2;
            line.y = -obj.height / 2;
            break;
          case 2:
            for (let k = 0; k < obj.width / dash; k++) {
              if (k % 2 == 0 || k == 0) {
                line.lineTo(-k * dash, 0);
              } else {
                line.moveTo(-k * dash, 0)
              }
              if (k + 1 >= obj.width / dash) {
                line.lineTo(-obj.width, 0);
              }
            }
            line.x = obj.width / 2;
            line.y = -obj.height / 2;
            break;
          case 3:
            for (let k = 0; k < obj.width / dash; k++) {
              if (k % 2 == 0 || k == 0) {
                line.lineTo(k * dash, 0);
              } else {
                line.moveTo(k * dash, 0)
              }
              if (k + 1 >= obj.width / dash) {
                line.lineTo(obj.width, 0);
              }
            }
            // line.lineTo(obj.width, 0);
            line.x = -obj.width / 2;
            line.y = obj.height / 2;
            break;
          case 4:
            for (let k = 0; k < obj.height / dash; k++) {
              if (k % 2 == 0 || k == 0) {
                line.lineTo(0, -dash * k);
              } else {
                line.moveTo(0, -dash * k)
              }
              if (k + 1 >= obj.height / dash) {
                line.lineTo(0, -obj.height);
              }
            }
            line.x = -obj.width / 2;
            line.y = obj.height / 2;
        }
        sprite_Border.addChild(line)
      }
      //参数为边框按钮容器对象和选中元素对象
      if (t_a && show_btn) {
        if (obj.type == 'association_gap' || obj.type == 'association_gap_notT') {
          //临时组合的缩放选择按钮
          if (obj.type == 'association_gap_notT' && a_r_btn) {
            me.addScaleIcon(sprite_Border, obj, false, true)
            me.addRotateIcon(sprite_Border, obj, false, true)
          } else if (obj.type == 'association_gap') {
            me.addScaleIcon(sprite_Border, obj, t_a)
            me.addRotateIcon(sprite_Border, obj, t_a)
          }
        }
      } else if (show_btn) {
        if (obj.type == 'text') {
          me.addScaleIcon(sprite_Border, obj)
          me.addStretchIcon(sprite_Border, obj)
          me.addRotateIcon(sprite_Border, obj)
        } else {
          me.addScaleIcon(sprite_Border, obj)
          me.addRotateIcon(sprite_Border, obj)
        }
      }
      //边框图层旋转角度和对象元素选择角度一致
      sprite_Border.rotation = obj.rotation;
    },
    addScaleIcon: function(outLineC, obj, t_a, a_r_btn = false) {
      const me = this;
      let sprite;
      sprite = new PIXI.Sprite(me.p_app.loader.resources[me.scale].texture);
      sprite.interactive = true;
      sprite.scale.set(.5);
      sprite.anchor.set(0.5);
      sprite.name = 'scale-btn';
      sprite.cursor = 'move';
      sprite.type = 'btn' //精灵类型为按钮
      sprite.position.set(obj.width / 2, -obj.height / 2);
      if (t_a) {
        //临时组合监听
        sprite.on('pointerdown', me.onTScaleStart).on('pointerup', me.onTScaleEnd).on('mousemove', function(event) {
          me.onTScaleMove(sprite, event)
        }).on('pointerupoutside', me.onTScaleEnd);
      } else if (a_r_btn) {
        //组合矩形按钮监听
        sprite.on('pointerdown', me.onAScaleStart).on('pointerup', me.onAScaleEnd).on('mousemove', function(event) {
          me.onAScaleMove(sprite, event)
        }).on('pointerupoutside', me.onAScaleEnd);
      } else {
        //监听事件
        sprite.on('pointerdown', me.onScaleStart).on('pointerup', me.onScaleEnd).on('mousemove', function(event) {
          me.onScaleMove(sprite, event)
        }).on('pointerupoutside', me.onScaleEnd);
        // 
      }
      outLineC.addChild(sprite);
    },
    addRotateIcon: function(outLineC, obj, t_a, a_r_btn = false) {
      const me = this;
      let sprite;
      sprite = new PIXI.Sprite(me.p_app.loader.resources[me.rotate].texture);
      sprite.interactive = true;
      sprite.scale.set(.5);
      sprite.anchor.set(0.5);
      sprite.name = 'rotate-btn';
      sprite.cursor = 'pointer';
      sprite.type = 'btn' //精灵类型为按钮
      sprite.position.set(0, -obj.height / 2 - me.r_btn_h);
      if (t_a) {
        //临时组合监听
        sprite.on('pointerdown', me.onTRotateStart).on('pointerup', me.onTRotateEnd).on('mousemove', me.onTRotateMove).on('pointerupoutside', me.onTRotateEnd);
      } else if (a_r_btn) {
        //组合矩形按钮监听
        sprite.on('pointerdown', me.onARotateStart).on('pointerup', function(event) {
          me.onARotateEnd(sprite, event)
        }).on('mousemove', function(event) {
          me.onARotateMove(sprite, event)
        }).on('pointerupoutside', function(event) {
          me.onARotateEnd(sprite, event)
        });
      } else {
        //监听事件
        sprite.on('pointerdown', me.onRotateStart).on('mousemove', me.onRotateMove).on('pointerup', me.onRotateEnd).on('pointerupoutside', me.onRotateEnd);
      }
      outLineC.addChild(sprite);
    },
    addStretchIcon: function(outLineC, obj) {
      const me = this;
      let sprite;
      sprite = new PIXI.Sprite(me.p_app.loader.resources[me.stretch].texture);
      sprite.interactive = true;
      // sprite.buttonMode = true;
      sprite.scale.set(.5);
      sprite.anchor.set(0.5);
      sprite.name = 'stretch-btn';
      sprite.cursor = 'ew-resize';
      sprite.type = 'btn' //精灵类型为按钮
      sprite.position.set(obj.width / 2, 0);
      //监听事件
      sprite.on('pointerdown', me.onStretchStart).on('pointerup', me.onStretchEnd).on('mousemove', me.onStretchMove).on('pointerupoutside', me.onStretchEnd);
      outLineC.addChild(sprite);
    },
    onRightC: function(event) {
      const me = this;
      event.stopped = true;
      //右键点击，如果是单独元素则有置顶，置底，删除，复制
      //如果有临时组合则，有删除，复制
      //如果有组合，是组合的置顶，置底，复制，删除功能
      //根据画布外canvas缩放等级来判断位置，显示右键弹窗
      let browser_w = document.body.clientWidth;
      let browser_h = document.body.clientHeight;
      let canvas_scale = 1;
      let mouse_x = browser_w / 2 + ((380 / canvas_scale / 2) - me.window_w / 2) + (event.data.global.x * canvas_scale)
      let mouse_y = browser_h / 2 + ((80 / canvas_scale / 2) - me.window_h / 2) + (event.data.global.y * canvas_scale)
      //右键面板展示
      me.$set(me.right_block, 'rb_left', `${mouse_x}px`)
      me.$set(me.right_block, 'rb_top', `${mouse_y}px`)
      me.$set(me.right_block, 'show', true)
      //
      if (event.currentTarget.type == 'text' || event.currentTarget.type == 'image') {
        //右键点击的元素是图片或者文字
        let inorNot = false;
        let has_ass = false;
        let has_noass = false;
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          if (me.ctrl_arr[i].name == event.currentTarget.name) {
            inorNot = true;
          }
          if (me.ctrl_arr[i].association_name !== '') {
            has_ass = true;
          }
          if (me.ctrl_arr[i].association_name == '') {
            has_noass = true;
          }
        }
        if (event.currentTarget.association_name == '') {
          //右键的元素不在组合中
          if (!inorNot) {
            //类型1 为单个元素的删除功能,模拟单个元素点击
            let f_parm = {
              type: 1,
              currentTarget: event.currentTarget,
              data: event.data
            }
            me.onRight_func(f_parm)
            // me.onRightDelete(1, in_move)***************************************************************************************************
          } else if (inorNot) {
            //类型2 为临时组合的删除功能
            let f_parm = {
              type: 2
            }
            me.onRight_func(f_parm, event)

          }
        } else {
          if (has_noass) {
            //类型2 为临时组合的删除功能
            let f_parm = {
              type: 2
            }
            me.onRight_func(f_parm, event)
          } else {
            //类型3 为组合的删除功能，模拟组合点击
            let f_parm = {
              type: 3
            }
            me.onRight_func(f_parm, event)
          }
        }
      } else if (event.currentTarget.type == 'association_gap') {
        //类型2 为临时组合的删除功能
        let f_parm = {
          type: 2
        }
        me.onRight_func(f_parm, event)
      } else if (event.currentTarget.type == 'association_gap_notT') {
        //类型3 为组合的删除功能，模拟组合点击
        let f_parm = {
          type: 3
        }
        me.onRight_func(f_parm, event)
      }
    },
    onRight_func: function(f_parm, event = null) {
      const me = this;
      if (f_parm.type == 1) {
        //类型1 为单个元素的删除功能,模拟单个元素点击
        me.normalStart(f_parm.currentTarget, f_parm.data)
        me.in_move.dragging = false;
        me.$set(me.right_block.menu, 'ass', 3) //没有组合功能 
        me.$set(me.right_block, 'delete_type', 1) //设置成单个元素的删除
      } else if (f_parm.type == 2) {
        //类型2 为临时组合的删除功能
        me.$set(me.right_block.menu, 'ass', 1)
        me.$set(me.right_block, 'delete_type', 2) //设置成临时组合的删除
      } else if (f_parm.type == 3) {
        //类型3 为组合的删除功能，模拟组合点击
        me.onAssociationStart(event)
        me.$set(me.right_block.menu, 'ass', 2)
      }
    },
    onRightDelete: function() {
      const me = this;
      if (me.right_block.delete_type == 1) {
        //删除单个元素
        me.delete_someone(me.in_move.name, true, function() {
          //删除回调,隐藏右键弹窗
          me.$set(me.right_block, 'show', false)
        })
      } else if (me.right_block.delete_type == 2) {
        me.clear_temporary(false)
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          me.delete_someone(me.ctrl_arr[i].name, false, function() {})
        }
        me.renderStage()
        me.$set(me.right_block, 'show', false)
      }
      //更新图层tab
      me.update_layer();
      me.cancel_in_move();
    },
    delete_someone: function(name, render, callback) {
      const me = this;
      let index_c = me.findCont(name)
      if (index_c !== -1) {
        //新增了取消面板所以index+1
        me.mainStage_container.removeChildAt(index_c + 1)
        me.container_arr.splice(index_c, 1)
        me.in_move = null;
        me.sort_container_arr(true)
        if (render) {
          me.renderStage()
        }
        callback()
      }
    },
    onRightAss: function() {
      const me = this;
      //将临时组合设置为组合，不同元素模块的不能组合
      me.arr_to_ass(me.ctrl_arr)
      me.$set(me.right_block, 'show', false)
    },
    arr_to_ass: function(element_arr, association_id = -1, render_create = false) {
      const me = this;
      if (element_arr.length > 1) {
        let time = (new Date()).valueOf();
        if (association_id == -1) {
          association_id = `association_${time}`
        }
        let m_comp_name = element_arr[1].m_comp_name;
        let same = element_arr.every(function(item) {
          if (item.type == 'association_gap_notT' || item.m_comp_name == m_comp_name) {
            return true
          }
        })
        if (same) {
          for (let i = 0; i < element_arr.length; i++) {
            //组合空隙不添加成新组合
            if (element_arr[i].type == 'association_gap_notT') {} else {
              element_arr[i].association_name = association_id
            }
          }
          me.create_association(association_id, m_comp_name, render_create)
        } else {
          alert('不同归属模块的元素不能组合')
        }
      }
    },
    onRight_unAss: function() {
      const me = this;
      //取消组合，删除组合矩形，清空元素的组合名称 
      //情空临时矩形区域,清空包含在ctrl_arr数组里的其他组合矩形
      me.removeLine()
      me.clear_temporary(true, true);
      me.ctrl_arr.map(function(value, index, array) {
        value.association_name = ''
      })
      me.ctrl_arr.length = 0;
      me.$set(me.right_block, 'show', false)
      me.cancel_in_move(); //取消右侧编辑栏
    },
    onDragStart: function(sprite, event) {
      const me = this;
      //点击时判断是否是按着ctrl选择多个,且点击的不是带组合的元素
      if (me.key_ctrlf.isDown && !me.key_ctrlf.isUp) {
        //ctrl选择第二个元素或多个元素
        if (me.ctrl_arr.length == 0 && me.in_move.name !== sprite.name) {
          me.ctrl_arr.push(me.in_move);
          //如果是单个元素就加入，如果是组合元素就加入组合
          if (sprite.association_name.length == 0) {
            me.ctrl_arr.push(sprite);
          }
          //新增临时组合,找出其中层级最低的容器，在它之前加入临时组合的空白区
          me.findMinAndAdd(event.data);
        } else if (me.ctrl_arr.length >= 2) {
          let inorNot = false;
          if (sprite.association_name.length == 0) {
            //ctrl点击单个元素的
            for (let i = 0; i < me.ctrl_arr.length; i++) {
              if (me.ctrl_arr[i].name == sprite.name) {
                inorNot = true;
                me.removeLine(me.ctrl_arr[i].name)
                me.ctrl_arr.splice(i, 1)
              }
            }
            if (inorNot == false) {
              me.ctrl_arr.push(sprite);
            }
            //新增临时组合,找出其中层级最低的容器，在它之前加入临时组合的空白区
            me.findMinAndAdd(event.data);
          } else if (sprite.association_name !== '') {
            //ctrl点击了其他组合,重复点击去除，否则添加
            //计算当期ctrl_arr有多少个组合，对ass名字查重
            let ass_name_arr = me.set_ctrl_arr_ass_name()
            if (ass_name_arr.length == 1) {
              if (sprite.association_name !== ass_name_arr[0]) {
                ass_name_arr = me.ctrl_add_ass(sprite.association_name, ass_name_arr)
                me.findMinAndAdd(event.data, ass_name_arr.length);
              }
            } else if (ass_name_arr.length > 1) {
              //重复的组合去掉，新的组合增加
              let inarr = false;
              for (let i = 0; i < ass_name_arr.length; i++) {
                if (ass_name_arr[i] == sprite.association_name) {
                  inarr = true;
                  break;
                }
              }
              if (inarr) {
                ass_name_arr = me.ctrl_dis_ass(sprite.association_name, ass_name_arr)
              } else {
                ass_name_arr = me.ctrl_add_ass(sprite.association_name, ass_name_arr)
              }
              me.findMinAndAdd(event.data, ass_name_arr.length, ass_name_arr[0]);
            }
          }

        }

        //
      } else {
        me.click_time = Date.now();

        //普通元素点击判断是否在临时组合中
        let inorNot1 = false;
        if (sprite.association_name !== '') {
          //如果有组合，将组合加入ctrl_arr
          if (me.temporary_rect) {

          } else {
            me.ctrl_arr.length = 0;
          }
          me.add_a_ctrl_arr(sprite.association_name)
        } else {
          me.click_ass_id = ''
        }
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          if (me.ctrl_arr[i].name == sprite.name) {
            inorNot1 = true;
            break;
          }
        }
        if (inorNot1) {
          if (me.temporary_rect) {
            me.ctrlDeviation(event.data, true);
          } else if (!me.temporary_rect && sprite.association_name !== '') {
            //属于当前激活的组合中的
            // if (sprite.name == me.click_obj_name) {
            //   //上一次点击也是这个对象
            //   me.a_single_click(sprite, event.data)
            // } else {
            //   // me.ctrlDeviation(event.data, false); 
            //   me.onAssociationStart(event)
            // }
            if (sprite.association_name == me.click_ass_id && me.click_ass_id !== '' && me.in_move) {
              me.a_single_click(sprite, event.data)
            } else {
              me.onAssociationStart(event)
            }

          }
        } else {
          me.normalStart(sprite, event.data)
        }
      }
    },
    onDragMove: function(obj, event) {
      const me = this;
      if (me.ctrl_arr.length > 0) {
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          if (me.ctrl_arr[i].dragging) {
            let newPosition = me.ctrl_arr[i].data.getLocalPosition(me.mainStage_container);
            if (me.ctrl_arr[i].type == 'association_gap_notT') {
              me.ctrl_arr[i].x = newPosition.x - me.ctrl_arr[i].deviationX;
              me.ctrl_arr[i].y = newPosition.y - me.ctrl_arr[i].deviationY;
              me.ctrl_arr[i].centerX = (me.ctrl_arr[i].vertexData[0] + me.ctrl_arr[i].vertexData[6]) / 2 - (me.window_w - me.canvas_width) / 2;
              me.ctrl_arr[i].centerY = (me.ctrl_arr[i].vertexData[1] + me.ctrl_arr[i].vertexData[7]) / 2 - (me.window_h - me.canvas_height) / 2;
              me.moveOutLine(me.ctrl_arr[i].centerX, me.ctrl_arr[i].centerY, me.ctrl_arr[i]);
            } else {
              me.ctrl_arr[i].parent.x = newPosition.x - me.ctrl_arr[i].deviationX;
              me.ctrl_arr[i].parent.y = newPosition.y - me.ctrl_arr[i].deviationY;
              //移动icon线框位置
              me.moveOutLine(me.ctrl_arr[i].parent.x, me.ctrl_arr[i].parent.y, me.ctrl_arr[i])
            }
          }
        }
        //如果是单独移动组合中的元素，组合矩形需要变化

        if (obj.association_name == me.click_ass_id && obj.dragging) {
          me.click_ass_id = ''
          // me.for_change_association(obj.association_name)
        }
        if (me.temporary_rect && me.temporary_rect.dragging) {
          let newPosition = me.temporary_rect.data.getLocalPosition(me.mainStage_container);
          me.temporary_rect.x = newPosition.x - me.temporary_rect.deviationX;
          me.temporary_rect.y = newPosition.y - me.temporary_rect.deviationY;
          // 矩形中心点用对角线计算出中心点
          me.temporary_rect.centerX = (me.temporary_rect.vertexData[0] + me.temporary_rect.vertexData[6]) / 2 - (me.window_w - me.canvas_width) / 2;
          me.temporary_rect.centerY = (me.temporary_rect.vertexData[1] + me.temporary_rect.vertexData[7]) / 2 - (me.window_h - me.canvas_height) / 2;
          me.moveOutLine(me.temporary_rect.centerX, me.temporary_rect.centerY, me.temporary_rect)
        }
      } else {
        if (obj.dragging) {
          let newPosition = obj.data.getLocalPosition(me.mainStage_container);
          obj.parent.x = newPosition.x - obj.deviationX;
          obj.parent.y = newPosition.y - obj.deviationY;
          //移动icon线框位置
          me.moveOutLine(obj.parent.x, obj.parent.y, obj)
          // btn_box.position.set(newPosition.x, newPosition.y);
        }
      }
    },
    onDragEnd: function(sprite, event) {
      const me = this;
      var that = sprite;
      // let time = Date.now() - me.click_time;
      // me.click_time = 0;
      // if (time <= 160 && !me.key_ctrlf.isDown && me.key_ctrlf.isUp && that.dragging) {
      //   //判断为点击
      //   //清空临时组合,情况ctrl_arr数组
      //   me.clearTemporary()
      //   me.in_move = that;
      //   that.dragging = false;
      //   that.data = null;
      //   if (me.in_move.association_name.length > 0) {
      //     //是有组合的元素，要给其他成员加边框,清除除组合外的元素
      //     me.add_a_ctrl_arr(me.in_move.association_name)
      //     me.a_single_click(sprite, event.data)

      //   } else {
      //     //删除之前的边框按钮图层，增加此对象的边框按钮
      //     me.containerLine(that, false);
      //     me.showEdit(me.in_move.type);
      //   }

      //   //记录这个点击对象的名字
      //   me.click_obj_name = that.name;
      // } else {
      //拖动结束
      that.dragging = false;
      that.data = null;
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        me.ctrl_arr[i].dragging = false;
        me.ctrl_arr[i].data = null;

      }
      //组合点击的逻辑
      if (me.click_ass_id !== '' && me.click_ass_id == that.association_name && that.type !== 'btn' && that.type !== 'association_gap_notT') {
        me.in_move = that
        me.a_single_click_border(that.association_name)
      }
      if (me.click_ass_id == '' && that.association_name !== '') {
        me.click_ass_id = that.association_name
      }
      //如果是组合元素拖动结束，渲染组合边框
      if (that.association_name !== '' && that.type !== 'association_gap_notT' && me.in_move) {
        me.a_single_click_border(that.association_name)
      }
      // }
      if (me.temporary_rect && me.temporary_rect.dragging) {
        me.temporary_rect.dragging = false;
        me.temporary_rect.data = null;
        // $('.association').removeClass('association_un_click');
      }
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        me.ctrl_arr[i].dragging = false;
        me.ctrl_arr[i].data = null;
      }

    },
    onScaleStart: function(event) {
      const me = this;
      event.target.data = event.data;
      me.in_move.dragging = !1;
      me.can_change = 1;
      //
      if (me.in_move.association_name !== '') {
        //组合空白矩形
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          if (me.ctrl_arr[i].type == 'association_gap_notT' && me.ctrl_arr[i].association_name == me.in_move.association_name) {
            //缩放结束后，改变组合空白矩形change
            me.ctrl_arr[i].change = true;
            break;
          }
        }
      }
      if (me.in_move.type == 'text') {
        let num = me.in_move.width / me.in_move.style.fontSize;
        me.in_move.text_num = num;
        console.log(me.in_move.style.wordWrapWidth + '开始时')
      }
    },
    onScaleMove: function(btn, event) {
      const me = this
      if (me.can_change) {
        var e = event.data.getLocalPosition(me.mainStage_container);
        //目前拉伸的到原点连线的长度
        var n = me.LENGTH_SIZE({
          x: me.in_move.parent.position.x,
          y: me.in_move.parent.position.y
        }, e);
        //计算缩放值，并改变元素移动边框和icon
        let d_value = Math.abs(e.x - me.in_move.parent.position.x)
        if (me.in_move.type == 'text') {
          me.scale_all(n, d_value, me.in_move.text_num);
        } else {
          me.scale_all(n, d_value);
        }

      }
    },
    onScaleEnd: function() {
      const me = this;
      me.can_change = 0;
      me.containerLine(me.in_move, false);
      // //改变组合空白矩形,在元素拖动方法中已经修改，放大后改change为假
      if (me.in_move.association_name !== '') {
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          if (me.ctrl_arr[i].type == 'association_gap_notT' && me.ctrl_arr[i].change && me.in_move.association_name == me.ctrl_arr[i].association_name) {
            me.a_single_click_border(me.ctrl_arr[i].association_name)
          }
        }
      }
      if (me.in_move.type == 'text') {
        me.scale_text_end(me.in_move)
      } else if (me.in_move.svg) {
        me.update_svg_scale(me.in_move)
      }
    },
    onRotateStart: function() {
      const me = this;
      me.in_move.dragging = !1;
      me.can_rotate = 1;
      if (me.in_move.association_name !== '') {
        //组合空白矩形
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          if (me.ctrl_arr[i].type == 'association_gap_notT' && me.ctrl_arr[i].association_name == me.in_move.association_name) {
            //缩放结束后，改变组合空白矩形change
            me.ctrl_arr[i].change = true;
            break;
          }
        }
      }
    },
    onRotateMove: function(event) {
      const me = this;
      if (me.can_rotate) {
        let e = event.data.getLocalPosition(me.mainStage_container);
        //计算向量夹角
        let a1 = {};
        a1.x = 0;
        a1.y = -me.in_move.height / 2 - me.r_btn_h;
        let a2 = {};
        a2.x = e.x - me.in_move.parent.position.x;
        a2.y = e.y - me.in_move.parent.position.y;
        //
        let cos;
        let numerator = a1.x * a2.x + a1.y * a2.y;
        let denominator = Math.sqrt(a1.x * a1.x + a1.y * a1.y) * Math.sqrt(a2.y * a2.y + a2.x * a2.x);
        cos = numerator / denominator;
        //反余弦值
        me.rotateOBj(Math.acos(cos), e.x)
      }
    },
    onRotateEnd: function() {
      const me = this;
      me.in_move.rotation_num = me.outLine_container.getChildByName(me.in_move.name).rotation
      me.can_rotate = 0;
      // //改变组合空白矩形,在元素拖动方法中已经修改，放大后改change为假
      if (me.in_move.association_name !== '') {
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          if (me.ctrl_arr[i].type == 'association_gap_notT' && me.in_move.association_name == me.ctrl_arr[i].association_name) {
            me.a_single_click_border(me.ctrl_arr[i].association_name)
          }
        }
      }
    },
    onTemporaryStart: function(event) {
      //计算临时组合的偏差值用于移动,布尔值表示移动临时组合矩形，false表示移动组合矩形(包含在ctrl_arr里)
      const me = this;
      me.ctrlDeviation(event.data, true);
    },
    onTemporaryEnd: function() {
      const me = this;
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        me.ctrl_arr[i].dragging = false;
        me.ctrl_arr[i].data = null;
        if (me.ctrl_arr[i].type == 'association_gap_notT') {
          setTimeout(function() {
            me.ctrl_arr[i].centerX = (me.ctrl_arr[i].vertexData[0] + me.ctrl_arr[i].vertexData[6]) / 2 - (me.window_w - me.canvas_width) / 2;
            me.ctrl_arr[i].centerY = (me.ctrl_arr[i].vertexData[1] + me.ctrl_arr[i].vertexData[7]) / 2 - (me.window_h - me.canvas_height) / 2;
            me.moveOutLine(me.ctrl_arr[i].centerX, me.ctrl_arr[i].centerY, me.ctrl_arr[i])
            me.ctrl_arr[i].change = false;
          }, 150)
        }
      }
      if (me.temporary_rect) {
        me.temporary_rect.dragging = false;
        me.temporary_rect.data = null;
        //添加临时组合边框,vertexData数据返回可能有延迟，所以设个延迟时间
        setTimeout(function() {
          me.temporary_rect.centerX = (me.temporary_rect.vertexData[0] + me.temporary_rect.vertexData[6]) / 2 - (me.window_w - me.canvas_width) / 2;
          me.temporary_rect.centerY = (me.temporary_rect.vertexData[1] + me.temporary_rect.vertexData[7]) / 2 - (me.window_h - me.canvas_height) / 2;
          me.moveOutLine(me.temporary_rect.centerX, me.temporary_rect.centerY, me.temporary_rect)
        }, 150)
      }
      //上次点击对象清空
      // if (me.in_move && me.click_obj_name !== me.in_move.name) {
      //   me.click_obj_name = '';
      // } else if (!me.in_move) {
      //   me.click_obj_name = '';
      // }
    },
    onTScaleStart: function(event) {
      const me = this;
      event.target.data = event.data;
      me.can_change = 1;
      let ctrl_arr_pivot = [];
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        me.ctrl_arr[i].oScale = me.ctrl_arr[i].scale.x;
        if (me.ctrl_arr[i].type == 'association_gap_notT') {
          ctrl_arr_pivot.push({
            index: i,
            x: me.ctrl_arr[i].position.x,
            y: me.ctrl_arr[i].position.y
          })
        } else {
          if (me.ctrl_arr[i].type == 'text') {
            let num = me.ctrl_arr[i].width / me.ctrl_arr[i].style.fontSize;
            me.ctrl_arr[i].text_num = num;
            me.ctrl_arr[i].ratio = 2 * (-me.temporary_rect.x + me.temporary_rect.centerX) / me.ctrl_arr[i].width;
          }
          ctrl_arr_pivot.push({
            index: i,
            x: me.ctrl_arr[i].parent.position.x,
            y: me.ctrl_arr[i].parent.position.y
          })
        }
      };
      //用于处理缩放时对称点不对影响错位，实时根据缩放改变位置
      event.target.pivotX = me.temporary_rect.centerX;
      event.target.pivotY = me.temporary_rect.centerY;
      event.target.temporary_rectX = me.temporary_rect.x;
      event.target.temporary_rectY = me.temporary_rect.y;
      event.target.ctrl_arr_pivot = ctrl_arr_pivot;
      me.temporary_rect.oScale = me.temporary_rect.scale.x
    },
    onTScaleMove: function(btn, event) {
      const me = this;
      if (me.can_change) {
        var e = event.data.getLocalPosition(me.mainStage_container);
        //目前拉伸的到原点连线的长度
        var n = me.LENGTH_SIZE({
          x: me.temporary_rect.centerX,
          y: me.temporary_rect.centerY
        }, e);
        //计算缩放值，并改变元素移动边框和icon
        me.tScale_all(n, btn);
      }
    },
    onTScaleEnd: function() {
      const me = this;
      me.can_change = 0;
      me.temporary_rect.originalw = me.temporary_rect.width;
      me.temporary_rect.originalh = me.temporary_rect.height;
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'text') {
          me.scale_text_end(me.ctrl_arr[i])
        } else if (me.ctrl_arr[i].svg) {
          me.update_svg_scale(me.ctrl_arr[i])
        }
        setTimeout(function() {
          me.ctrl_arr[i].centerX = (me.ctrl_arr[i].vertexData[0] + me.ctrl_arr[i].vertexData[6]) / 2 - (me.window_w - me.canvas_width) / 2;
          me.ctrl_arr[i].centerY = (me.ctrl_arr[i].vertexData[1] + me.ctrl_arr[i].vertexData[7]) / 2 - (me.window_h - me.canvas_height) / 2;
          if (i == me.ctrl_arr.length - 1) me.render_t_line(true)
        }, 150)
      }
    },
    onTRotateStart: function(event = null) {
      const me = this;
      me.temporary_rect.dragging = false;
      me.temporary_rect.beforeRX = me.temporary_rect.x;
      me.temporary_rect.beforeRY = me.temporary_rect.y;
      //临时组合元素设置pivot点是从自己锚点开始的相对位置，将其设置到空白矩形中点
      //再将元素的位置补差值，维持原位(差值涉及缩放比例)
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        me.ctrl_arr[i].dragging = false;
        me.ctrl_arr[i].data = null;
        //元素线框,旋转后直接重新渲染线框，所以结束时不用恢复pivot
        if (me.ctrl_arr[i].type == 'association_gap_notT') {
          me.ctrl_arr[i].beforeRX = me.ctrl_arr[i].x;
          me.ctrl_arr[i].beforeRY = me.ctrl_arr[i].y;
          me.ctrl_arr[i].pivot.set((me.temporary_rect.centerX - me.ctrl_arr[i].x) / me.ctrl_arr[i].scale.x, (me.temporary_rect.centerY - me.ctrl_arr[i].y) / me.ctrl_arr[i].scale.y);
          me.ctrl_arr[i].x = me.temporary_rect.centerX
          me.ctrl_arr[i].y = me.temporary_rect.centerY
        } else {
          me.ctrl_arr[i].beforeRX = me.ctrl_arr[i].parent.x;
          me.ctrl_arr[i].beforeRY = me.ctrl_arr[i].parent.y;
          me.ctrl_arr[i].parent.pivot.set((me.temporary_rect.centerX - me.ctrl_arr[i].parent.position.x) / 1, (me.temporary_rect.centerY - me.ctrl_arr[i].parent.position.y) / 1);
          me.ctrl_arr[i].parent.x = me.temporary_rect.centerX
          me.ctrl_arr[i].parent.y = me.temporary_rect.centerY
        }
      }
      //(相对位置不计算角度)
      me.temporary_rect.pivot.set((me.temporary_rect.width / 2) / me.temporary_rect.scale.x, (me.temporary_rect.height / 2) / me.temporary_rect.scale.y);
      me.temporary_rect.x = me.temporary_rect.centerX;
      me.temporary_rect.y = me.temporary_rect.centerY;
      me.can_rotate = 1;
    },
    onTRotateMove: function(event) {
      const me = this;
      if (me.can_rotate) {
        let e = event.data.getLocalPosition(me.mainStage_container);
        //计算向量夹角
        let a1 = {};
        a1.x = 0;
        a1.y = -me.temporary_rect.height / 2 - me.r_btn_h;
        let a2 = {};
        a2.x = e.x - (me.temporary_rect.centerX);
        a2.y = e.y - (me.temporary_rect.centerY);
        //
        let cos;
        let numerator = a1.x * a2.x + a1.y * a2.y;
        let denominator = Math.sqrt(a1.x * a1.x + a1.y * a1.y) * Math.sqrt(a2.y * a2.y + a2.x * a2.x);
        cos = numerator / denominator;
        //反余弦值
        me.tRotateOBj(Math.acos(cos), e.x)
      }
    },
    onTRotateEnd: function() {
      const me = this;
      let temporary_rect = me.temporary_rect;
      let ctrl_arr = me.ctrl_arr;

      temporary_rect.pivot.set(0)
      let param1 = [-temporary_rect.width / 2, -temporary_rect.height / 2, temporary_rect.rotation]
      param1 = me.changeAngle(param1);
      temporary_rect.x = parseFloat(param1[0]) + (temporary_rect.centerX)
      temporary_rect.y = parseFloat(param1[1]) + (temporary_rect.centerY)
      me.can_rotate = 0;
      for (let i = 0; i < ctrl_arr.length; i++) {
        if (ctrl_arr[i].type !== 'association_gap_notT') {
          ctrl_arr[i].rotation_num = ctrl_arr[i].rotation + ctrl_arr[i].parent.rotation;
          ////将临时组合元素恢复位置,将父级的旋转取消，本身旋转
          ctrl_arr[i].parent.pivot.set(0);
          let param;
          param = [ctrl_arr[i].beforeRX - (temporary_rect.centerX), ctrl_arr[i].beforeRY - (temporary_rect.centerY), ctrl_arr[i].parent.rotation]
          param = me.changeAngle(param);
          ctrl_arr[i].parent.x = parseFloat(param[0]) + (temporary_rect.centerX)
          ctrl_arr[i].parent.y = parseFloat(param[1]) + (temporary_rect.centerY)
          ctrl_arr[i].parent.rotation_num += ctrl_arr[i].parent.rotation; //记录父级旋转的角度，
          ctrl_arr[i].parent.rotation = 0;
          ctrl_arr[i].rotation = ctrl_arr[i].rotation_num;
        } else if (ctrl_arr[i].type == 'association_gap_notT') {
          ctrl_arr[i].pivot.set(0);
          let param2;
          param2 = [ctrl_arr[i].beforeRX - (temporary_rect.centerX), ctrl_arr[i].beforeRY - (temporary_rect.centerY), ctrl_arr[i].rotation - ctrl_arr[i].rotation_num]
          param2 = me.changeAngle(param2);
          ctrl_arr[i].x = parseFloat(param2[0]) + (temporary_rect.centerX)
          ctrl_arr[i].y = parseFloat(param2[1]) + (temporary_rect.centerY)
          ctrl_arr[i].rotation_num = ctrl_arr[i].rotation;
          setTimeout(function() {
            ctrl_arr[i].centerX = (ctrl_arr[i].vertexData[0] + ctrl_arr[i].vertexData[6]) / 2 - (me.window_w - me.canvas_width) / 2;
            ctrl_arr[i].centerY = (ctrl_arr[i].vertexData[1] + ctrl_arr[i].vertexData[7]) / 2 - (me.window_h - me.canvas_height) / 2;
          }, 50)
        }
      }
      //渲染边框
      setTimeout(function() {
        me.render_t_line(true)
      }, 130)
    },
    onAssociationStart: function(event) {
      const me = this
      if (me.key_ctrlf.isDown && !me.key_ctrlf.isUp) {
        me.onDragStart(event.currentTarget, event)
      } else {
        me.clearTemporary();
        me.add_a_ctrl_arr(event.target.association_name)
        me.ctrlDeviation(event.data, false);
        //添加组合边框给组合矩形加按钮,不渲染临时边框
        me.render_t_line(false, true, event.target.association_name)
      }

    },
    onAssociationEnd: function() {
      this.onTemporaryEnd()
    },
    onAScaleStart: function(event) {
      const me = this;
      me.can_change = 1;
      let ctrl_arr_pivot = [];
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        me.ctrl_arr[i].oScale = me.ctrl_arr[i].scale.x;
        if (me.ctrl_arr[i].type == 'association_gap_notT') {
          event.target.pivotX = me.ctrl_arr[i].centerX
          event.target.pivotY = me.ctrl_arr[i].centerY;
          event.target.association_rectX = me.ctrl_arr[i].x;
          event.target.association_rectY = me.ctrl_arr[i].y;
          event.target.owidth = me.ctrl_arr[i].width;
          event.target.oheight = me.ctrl_arr[i].height;
          //充数用的
          ctrl_arr_pivot.push({
            index: i,
            x: me.ctrl_arr[i].position.x,
            y: me.ctrl_arr[i].position.y
          })
        } else {
          if (me.ctrl_arr[i].type == 'text') {

          }
          ctrl_arr_pivot.push({
            index: i,
            x: me.ctrl_arr[i].parent.position.x,
            y: me.ctrl_arr[i].parent.position.y
          })
        }
      };
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'text') {
          let num = me.ctrl_arr[i].width / me.ctrl_arr[i].style.fontSize;
          me.ctrl_arr[i].text_num = num;
          me.ctrl_arr[i].ratio = event.target.owidth / me.ctrl_arr[i].width;
        }
      }
      event.target.ctrl_arr_pivot = ctrl_arr_pivot;
    },
    onAScaleMove: function(btn, event) {
      const me = this;
      if (me.can_change) {
        var e = event.data.getLocalPosition(me.mainStage_container);
        //目前拉伸的到原点连线的长度
        var n = me.LENGTH_SIZE({
          x: btn.pivotX,
          y: btn.pivotY
        }, e);
        //计算缩放值，并改变元素移动边框和icon
        me.aScale_all(n, btn);
      }
    },
    onAScaleEnd: function() {
      const me = this;
      me.can_change = 0;
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'text') {
          me.scale_text_end(me.ctrl_arr[i])
        } else if (me.ctrl_arr[i].svg) {
          me.update_svg_scale(me.ctrl_arr[i])
        }
        if (me.ctrl_arr[i].type == 'association_gap_notT') {
          me.ctrl_arr[i].change = true;
          me.change_association(me.ctrl_arr[i])
          setTimeout(function() {
            me.render_t_line(false, true, me.ctrl_arr[i].association_name)
          }, 150)
        }
      }
    },
    onARotateStart: function(event = null) {
      const me = this;
      //组合旋转
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        me.ctrl_arr[i].dragging = false;
        me.ctrl_arr[i].data = null;
        //元素线框,旋转后直接重新渲染线框，所以结束时不用恢复pivot
        if (me.ctrl_arr[i].type == 'association_gap_notT') {
          //更新矩形中心点
          me.ctrl_arr[i].centerX = (me.ctrl_arr[i].vertexData[0] + me.ctrl_arr[i].vertexData[6]) / 2 - (me.window_w - me.canvas_width) / 2;
          me.ctrl_arr[i].centerY = (me.ctrl_arr[i].vertexData[1] + me.ctrl_arr[i].vertexData[7]) / 2 - (me.window_h - me.canvas_height) / 2;
          me.ctrl_arr[i].beforeRX = me.ctrl_arr[i].x;
          me.ctrl_arr[i].beforeRY = me.ctrl_arr[i].y;
          me.ctrl_arr[i].pivot.set((me.ctrl_arr[i].width / 2) / me.ctrl_arr[i].scale.x, (me.ctrl_arr[i].height / 2) / me.ctrl_arr[i].scale.y);
          me.ctrl_arr[i].x = me.ctrl_arr[i].centerX
          me.ctrl_arr[i].y = me.ctrl_arr[i].centerY
          //更多数据
          me.ass_r_data.associationH = me.ctrl_arr[i].height;
          me.ass_r_data.association_centerX = me.ctrl_arr[i].centerX;
          me.ass_r_data.association_centerY = me.ctrl_arr[i].centerY;
          me.ass_r_data.association_name = me.ctrl_arr[i].association_name
        }
      }
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type !== 'association_gap_notT') {
          me.ctrl_arr[i].beforeRX = me.ctrl_arr[i].parent.x;
          me.ctrl_arr[i].beforeRY = me.ctrl_arr[i].parent.y;
          me.ctrl_arr[i].parent.pivot.set((me.ass_r_data.association_centerX - me.ctrl_arr[i].parent.position.x) / 1, (me.ass_r_data.association_centerY - me.ctrl_arr[i].parent.position.y) / 1);
          me.ctrl_arr[i].parent.x = me.ass_r_data.association_centerX
          me.ctrl_arr[i].parent.y = me.ass_r_data.association_centerY
        }
      }
      me.can_rotate = 1;
    },
    onARotateMove: function(btn = null, event = null) {
      const me = this;
      if (me.can_rotate) {
        let e = event.data.getLocalPosition(me.mainStage_container);
        //计算向量夹角
        let a1 = {};
        a1.x = 0;
        a1.y = -me.ass_r_data.associationH / 2 - me.r_btn_h;

        let a2 = {};
        a2.x = e.x - (me.ass_r_data.association_centerX);
        a2.y = e.y - (me.ass_r_data.association_centerY);
        //
        let cos;
        let numerator = a1.x * a2.x + a1.y * a2.y;
        let denominator = Math.sqrt(a1.x * a1.x + a1.y * a1.y) * Math.sqrt(a2.y * a2.y + a2.x * a2.x);
        cos = numerator / denominator;
        //反余弦值
        me.aRotateOBj(Math.acos(cos), e.x, me.ass_r_data.association_centerX)
      }
    },
    onARotateEnd: function(btn = null, event = null) {
      const me = this;
      me.can_rotate = 0;
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type !== 'association_gap_notT') {
          me.ctrl_arr[i].rotation_num = me.ctrl_arr[i].rotation + me.ctrl_arr[i].parent.rotation;
          ////将临时组合元素恢复位置,将父级的旋转取消，本身旋转
          me.ctrl_arr[i].parent.pivot.set(0);
          let param;
          param = [me.ctrl_arr[i].beforeRX - (me.ass_r_data.association_centerX), me.ctrl_arr[i].beforeRY - (me.ass_r_data.association_centerY), me.ctrl_arr[i].parent.rotation]
          param = me.changeAngle(param);
          me.ctrl_arr[i].parent.x = parseFloat(param[0]) + (me.ass_r_data.association_centerX)
          me.ctrl_arr[i].parent.y = parseFloat(param[1]) + (me.ass_r_data.association_centerY)
          // me.ctrl_arr[i].parent.rotation_num += me.ctrl_arr[i].parent.rotation; //记录父级旋转的角度，
          me.ctrl_arr[i].parent.rotation = 0;
          me.ctrl_arr[i].rotation = me.ctrl_arr[i].rotation_num;
        } else if (me.ctrl_arr[i].type == 'association_gap_notT') {
          me.ctrl_arr[i].pivot.set(0);
          let param2;
          param2 = [-me.ctrl_arr[i].width / 2, -me.ctrl_arr[i].height / 2, me.ctrl_arr[i].rotation]
          param2 = me.changeAngle(param2);
          me.ctrl_arr[i].x = parseFloat(param2[0]) + (me.ass_r_data.association_centerX)
          me.ctrl_arr[i].y = parseFloat(param2[1]) + (me.ass_r_data.association_centerY)
          me.ctrl_arr[i].rotation_num = me.ctrl_arr[i].rotation;
        }
      }
      //渲染边框
      me.for_change_association();
      setTimeout(() => {
        me.render_t_line(false, true, me.ass_r_data.association_name)
      }, 100)


    },
    for_change_association: function(ass_name = undefined) {
      const me = this;
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'association_gap_notT') {
          if (ass_name == undefined || ass_name == me.ctrl_arr[i].association_name) {
            me.ctrl_arr[i].change = true;
            me.change_association(me.ctrl_arr[i])
            break;
          }

        }
      }
    },
    onStretchStart: function(event) {
      const me = this;
      me.in_move.dragging = false;
      me.can_change = 0;
      me.can_rotate = 0;
      me.can_stretch = 1;
    },
    onStretchMove: function(event) {
      const me = this;
      if (me.can_stretch) {
        let e = event.data.getLocalPosition(me.mainStage_container);
        let centerx = me.in_move.parent.position.x;
        let wordWrapWidth = (e.x - centerx) * 2;
        if (wordWrapWidth > me.in_move.style.fontSize) {
          me.in_move.style.wordWrapWidth = wordWrapWidth;
          //移动文字icon
          me.move_icon(me.in_move)
        }
      }
    },
    onStretchEnd: function() {
      const me = this;
      me.can_stretch = 0;
      me.in_move.originalw = me.in_move.width;
      me.in_move.originalh = me.in_move.height;
      me.in_move.ofonts = me.in_move.style.fontSize;
      me.containerLine(me.in_move, false);
      if (me.in_move.association_name !== '') {
        me.a_single_click_border(me.in_move.association_name)
      }
    },
    normalStart: function(that, data) {
      const me = this;
      me.clearTemporary()
      that.data = data;
      that.dragging = true;
      me.in_move = that;
      //偏差值，鼠标点击目标任何位置移动都不会闪烁
      let newPosition = that.data.getLocalPosition(me.mainStage_container);
      that.deviationX = newPosition.x - that.parent.x;
      that.deviationY = newPosition.y - that.parent.y;
      //删除之前的边框按钮图层，增加此对象的边框按钮
      me.containerLine(that, false);
      me.showEdit(me.in_move.type)
      console.log(me.in_move)
    },
    ctrlDeviation: function(data, t_r, tem_move = true) {
      const me = this;
      me.in_move = null;
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        me.ctrl_arr[i].data = data;
        me.ctrl_arr[i].dragging = tem_move;
        //偏差值，鼠标点击目标任何位置移动都不会闪烁
        let newPosition = me.ctrl_arr[i].data.getLocalPosition(me.mainStage_container);
        if (me.ctrl_arr[i].type == 'association_gap_notT') {
          me.ctrl_arr[i].deviationX = newPosition.x - me.ctrl_arr[i].x;
          me.ctrl_arr[i].deviationY = newPosition.y - me.ctrl_arr[i].y;
          me.showEdit('association');
        } else {
          me.ctrl_arr[i].deviationX = newPosition.x - me.ctrl_arr[i].parent.x;
          me.ctrl_arr[i].deviationY = newPosition.y - me.ctrl_arr[i].parent.y;
        }
      }
      //临时组合矩形
      if (t_r) {
        me.temporary_rect.data = data;
        me.temporary_rect.dragging = tem_move;
        let newPosition1 = me.temporary_rect.data.getLocalPosition(me.mainStage_container);
        me.temporary_rect.deviationX = newPosition1.x - me.temporary_rect.x;
        me.temporary_rect.deviationY = newPosition1.y - me.temporary_rect.y;
        me.showEdit('temporary');
      }
    },
    rotateOBj: function(num, x) {
      const me = this;
      if (x - me.in_move.parent.position.x >= 0) {
        me.in_move.rotation = num;
        me.outLine_container.getChildByName(me.in_move.name).rotation = num;
      } else {
        me.in_move.rotation = -num;
        me.outLine_container.getChildByName(me.in_move.name).rotation = -num;
      }
      me.for_change_association(me.in_move.association_name)
    },
    tRotateOBj: function(num, x) {
      const me = this;
      if (x - (me.temporary_rect.centerX) >= 0) {
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          if (me.ctrl_arr[i].type == 'association_gap_notT') {
            me.ctrl_arr[i].rotation = num;
          } else {
            me.ctrl_arr[i].parent.rotation = num - me.ctrl_arr[i].parent.rotation_num;
          }
          // outLine_container.getChildByName(ctrl_arr[i].name).rotation = num- ctrl_arr[i].parent.rotation_num;
        }
        me.temporary_rect.rotation = num
        me.outLine_container.getChildByName(me.temporary_rect.name).rotation = num
        // outLine_container.getChildByName(temporary_rect.name).rotation = num;
      } else {
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          if (me.ctrl_arr[i].type == 'association_gap_notT') {
            me.ctrl_arr[i].rotation = -num;
          } else {
            me.ctrl_arr[i].parent.rotation = -num - me.ctrl_arr[i].parent.rotation_num
          }
          // outLine_container.getChildByName(ctrl_arr[i].name).rotation = -num-ctrl_arr[i].parent.rotation_num;
        }
        me.temporary_rect.rotation = -num
        me.outLine_container.getChildByName(me.temporary_rect.name).rotation = -num
        // outLine_container.getChildByName(temporary_rect.name).rotation = -num;
      }
      // outLine_container.getChildByName(temporary_rect.name).getChildByName('line').alpha=0;
    },
    aRotateOBj: function(num, x, centerX) {
      const me = this;
      if (x - (centerX) >= 0) {
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          if (me.ctrl_arr[i].type == 'association_gap_notT') {
            me.ctrl_arr[i].rotation = num;
            me.outLine_container.getChildByName(me.ctrl_arr[i].name).rotation = num
          } else {
            me.ctrl_arr[i].parent.rotation = num
          }
        }
      } else {
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          if (me.ctrl_arr[i].type == 'association_gap_notT') {
            me.ctrl_arr[i].rotation = -num;
            me.outLine_container.getChildByName(me.ctrl_arr[i].name).rotation = -num
          } else {
            me.ctrl_arr[i].parent.rotation = -num
          }
        }
      }
    },
    LENGTH_SIZE: function(i, e) {
      var n = e.x - i.x,
        t = e.y - i.y,
        a = Math.sqrt(n * n + t * t)
      return a;
    },
    scale_all: function(n, d_value, text_num = 0) {
      const me = this;
      let dw = 2 * d_value
      if (n <= 0) {
        return
      }
      //x1 x2为原始拉伸对象的长宽
      var x1,
        x2;
      x1 = me.in_move.originalw / 2;
      x2 = me.in_move.originalh / 2;
      let original_scale = Math.sqrt(x1 * x1 + x2 * x2);
      let scale = n / original_scale;
      if (scale <= 0.1) {
        scale = 0.1
      }
      if (me.in_move.type == 'text') {
        // 
        let fs = dw / text_num
        if (fs >= 12) {
          me.in_move.style.wordWrapWidth = dw
          if (me.in_move.style.fontStyle == 'normal') {
            me.in_move.style.wordWrapWidth += fs * 0.2
          }
          me.in_move.style.fontSize = fs;
          me.$set(me.edit_bar.text, 'fontSize', fs)
          me.in_move.style.lineHeight = me.in_move.style.fontSize + me.in_move.lineHeightM;
          //
          me.move_icon(me.in_move)
        }
      } else {
        if (me.in_move.svg) {
          me.in_move.scale.set(scale / me.in_move.texture.baseTexture.resource.scale);
        } else {
          me.in_move.scale.set(scale);
        }
        //删除边框、旋转按钮，保留缩放按钮，拉伸结束恢复
        me.move_icon(me.in_move)
      }
      me.for_change_association(me.in_move.association_name)
    },
    tScale_all: function(n, that, present_w) {
      const me = this;
      if (n <= 0) {
        return
      }
      //x1 x2为原始拉伸对象的长宽
      var x1,
        x2;
      x1 = me.temporary_rect.originalw / 2;
      x2 = me.temporary_rect.originalh / 2;
      let original_scale = Math.sqrt(x1 * x1 + x2 * x2);
      let scale = n / original_scale;
      if (scale <= 0.1) {
        scale = 0.1
      }
      me.temporary_rect.scale.set(scale * me.temporary_rect.oScale)
      me.temporary_rect.x = that.pivotX - (that.pivotX - that.temporary_rectX) * scale;
      me.temporary_rect.y = that.pivotY - (that.pivotY - that.temporary_rectY) * scale;
      //删除边框、旋转按钮，保留缩放按钮，拉伸结束恢复
      me.move_icon(me.temporary_rect)
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'association_gap_notT') {
          me.ctrl_arr[i].scale.set(scale * me.ctrl_arr[i].oScale);
          me.ctrl_arr[i].x = that.pivotX - (that.pivotX - that.ctrl_arr_pivot[i].x) * scale;
          me.ctrl_arr[i].y = that.pivotY - (that.pivotY - that.ctrl_arr_pivot[i].y) * scale
        } else if (me.ctrl_arr[i].type == 'text') {
          let fs = me.temporary_rect.width / me.ctrl_arr[i].ratio / me.ctrl_arr[i].text_num
          me.ctrl_arr[i].style.wordWrapWidth = me.ctrl_arr[i].text_num * fs
          if (me.ctrl_arr[i].style.fontStyle == 'normal') {
            me.ctrl_arr[i].style.wordWrapWidth += fs * 0.2
          }
          me.ctrl_arr[i].style.fontSize = fs;
          me.$set(me.edit_bar.text, 'fontSize', fs)
          me.ctrl_arr[i].style.lineHeight = me.ctrl_arr[i].style.fontSize + me.ctrl_arr[i].lineHeightM;
          me.ctrl_arr[i].parent.x = that.pivotX - (that.pivotX - that.ctrl_arr_pivot[i].x) * scale;
          me.ctrl_arr[i].parent.y = that.pivotY - (that.pivotY - that.ctrl_arr_pivot[i].y) * scale
        } else {
          if (me.ctrl_arr[i].svg) {
            me.ctrl_arr[i].scale.set(scale);
          } else {
            me.ctrl_arr[i].scale.set(scale * me.ctrl_arr[i].oScale);
          }
          //补充位移
          me.ctrl_arr[i].parent.x = that.pivotX - (that.pivotX - that.ctrl_arr_pivot[i].x) * scale;
          me.ctrl_arr[i].parent.y = that.pivotY - (that.pivotY - that.ctrl_arr_pivot[i].y) * scale
        }
      }
    },
    aScale_all: function(n, that) {
      const me = this;
      if (n <= 0) {
        return
      }
      //x1 x2为原始拉伸对象的长宽
      var x1,
        x2;
      x1 = that.owidth / 2;
      x2 = that.oheight / 2;
      let original_scale = Math.sqrt(x1 * x1 + x2 * x2);
      let scale = n / original_scale;
      if (scale <= 0.1) {
        scale = 0.1
      }
      let ass_width = 0;
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'association_gap_notT') {
          me.ctrl_arr[i].scale.set(scale * me.ctrl_arr[i].oScale);
          me.ctrl_arr[i].x = that.pivotX - (that.pivotX - that.association_rectX) * scale;
          me.ctrl_arr[i].y = that.pivotY - (that.pivotY - that.association_rectY) * scale;
          me.move_icon(me.ctrl_arr[i])
          ass_width = me.ctrl_arr[i].width;
        } else if (me.ctrl_arr[i].type !== 'text') {
          if (me.ctrl_arr[i].svg) {
            me.ctrl_arr[i].scale.set(scale);
          } else {
            me.ctrl_arr[i].scale.set(scale * me.ctrl_arr[i].oScale);
          }
          me.ctrl_arr[i].parent.x = that.pivotX - (that.pivotX - that.ctrl_arr_pivot[i].x) * scale;
          me.ctrl_arr[i].parent.y = that.pivotY - (that.pivotY - that.ctrl_arr_pivot[i].y) * scale
        }
      }
      for (let k = 0; k < me.ctrl_arr.length; k++) {
        if (me.ctrl_arr[k].type == 'text') {
          let fs = ass_width / me.ctrl_arr[k].ratio / me.ctrl_arr[k].text_num
          me.ctrl_arr[k].style.wordWrapWidth = me.ctrl_arr[k].text_num * fs
          if (me.ctrl_arr[k].style.fontStyle == 'normal') {
            me.ctrl_arr[k].style.wordWrapWidth += fs * 0.2
          }
          me.ctrl_arr[k].style.fontSize = fs;
          me.$set(me.edit_bar.text, 'fontSize', fs)
          me.ctrl_arr[k].style.lineHeight = me.ctrl_arr[k].style.fontSize + me.ctrl_arr[k].lineHeightM;
          me.ctrl_arr[k].parent.x = that.pivotX - (that.pivotX - that.ctrl_arr_pivot[k].x) * scale;
          me.ctrl_arr[k].parent.y = that.pivotY - (that.pivotY - that.ctrl_arr_pivot[k].y) * scale
        }
      }
    },
    scale_text_end(text) {
      const me = this;
      // text.style.wordWrapWidth = text.width;
      text.ofonts = text.style.fontSize;
      text.originalw = text.width;
      text.originalh = text.height;
    },
    changeAngle: function(param) {
      //此方法为逆时针旋转，顺时针时角度要为负
      var x = param[0];
      var y = param[1];
      var tha1 = param[2];
      var value = Math.sqrt(x * x + y * y);
      var cos1 = x / value;
      var sin1 = y / value;
      var cos2 = Math.cos(tha1);
      var sin2 = Math.sin(tha1);
      var cos3 = cos1 * cos2 - sin1 * sin2;
      var sin3 = sin1 * cos2 + cos1 * sin2;
      param[0] = (value * cos3);
      param[1] = (value * sin3);
      return param
    },
    move_icon: function(obj) {
      const me = this;
      me.outLine_container.getChildByName(obj.name).getChildByName('scale-btn').position.set(obj.width / 2, -obj.height / 2);
      me.outLine_container.getChildByName(obj.name).getChildByName('rotate-btn').position.set(0, (-obj.height / 2) - me.r_btn_h);
      if (obj.type == 'text') {
        me.outLine_container.getChildByName(me.in_move.name).getChildByName('stretch-btn').position.set(me.in_move.width / 2, 0);
      }
    },
    removeLine: function(name = null) {
      const me = this;
      if (name !== null) {
        let removeObj = me.outLine_container.getChildByName(name);
        me.outLine_container.removeChild(removeObj)
      } else if (me.outLine_container) {
        me.outLine_container.removeChildren()
      }
    },
    clearTemporary: function(name) {
      const me = this;
      let index = me.findCont('temporary_c')
      //清空临时组合
      if (index !== -1) {
        //新增了个取消面板，所以index+1
        me.mainStage_container.removeChildAt(index + 1)
        me.container_arr.splice(index, 1)
      }
      if (me.ctrl_arr.length >= 1) {
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          me.ctrl_arr[i].dragging = false;
          me.ctrl_arr[i].data = null;
        }
      }
      me.ctrl_arr.length = 0;
      me.temporary_rect = null;
      //将数组容器里的index排序
      me.sort_container_arr(true)
    },
    findCont: function(containerName) {
      const me = this;
      let index = -1;
      for (let i = 0; i < me.container_arr.length; i++) {
        if (me.container_arr[i].name == containerName) {
          index = i
        }
      }
      return index;
    },
    sort_container_arr: function(clear_rotation) {
      const me = this;
      //将数组容器里的index排序
      me.container_arr.map(function(value, index, array) {
        value.index = index;
        if (clear_rotation && (value.cont.type == 'image_c' || value.cont.type == 'text_c')) {
          value.cont.rotation_num = 0;
        }
      })
    },
    findMinAndAdd: function(data, a_length = 0, a_name = '') {
      const me = this;
      let index_arr = [];
      if ((me.ctrl_arr.length >= 2 && a_length == 0) || (a_length > 1)) {
        me.in_move = null;
        //删除之前的空白区容器，临时组合的空白区容器,不删除临时组合数组
        me.clear_temporary(true) //true表示清空数组中元素的父级旋转角度
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          index_arr.push(me.findCont(me.ctrl_arr[i].name))
        }
        index_arr.sort((a, b) => a - b)
        let container = new PIXI.Container;
        container.width = me.canvas_width;
        container.height = me.canvas_height;
        container.pivot.set(0, 0);
        container.name = 'temporary_c';
        me.container_arr.splice(index_arr[0], 0, {
          cont: container,
          index: index_arr[0],
          name: 'temporary_c'
        })
        //将数组容器里的index排序
        me.sort_container_arr(true)
        //找到临时组合中，最小、最大的x，y，并创建矩形
        me.findRect(container, data, true);
      } else if (me.ctrl_arr.length == 1 && a_length == 0) {
        //单独一个元素
        me.normalStart(me.ctrl_arr[0], data)
        me.in_move.dragging = false;
      } else if (a_length == 1) {
        me.clear_temporary(true)
        //添加组合边框给组合矩形加按钮,不渲染临时边框
        me.render_t_line(false, true, a_name)
      }
    },
    create_association: function(name, m_comp_name, render_create) {
      const me = this;

      //情空临时矩形区域,清空包含在ctrl_arr数组里的其他组合矩形
      if (!render_create) {
        me.clear_temporary(true, true)
      }
      //对组合元素进行排序，全部移动至组合中最高层之下，并维持原组合内顺序
      //找到组合中最高级
      let index_arr = []
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        index_arr.push(me.findCont(me.ctrl_arr[i].name))
      }
      index_arr.sort(function(a, b) {
        return a - b;
      })
      //保存原container_arr中组合最高级之前除去组合中的元素
      let arr1 = [],
        arr2 = [],
        arr3 = [];
      for (let i = 0; i < me.container_arr.length; i++) {
        if (i < index_arr[index_arr.length - 1]) {
          if (me.container_arr[i].cont.children[0].association_name !== name) {
            arr1.push(me.container_arr[i])
          }
        } else if (i > index_arr[index_arr.length - 1]) {
          if (me.container_arr[i].cont.children[0].association_name !== name) {
            arr3.push(me.container_arr[i])
          }
        }
        if (me.container_arr[i].cont.children[0].association_name == name) {
          arr2.push(me.container_arr[i])
        }
      }
      me.container_arr = [...arr1, ...arr2, ...arr3]
      //将数组容器里的index排序
      me.sort_container_arr(true)
      let index_min = -1;
      for (let i = 0; i < me.container_arr.length; i++) {
        if (me.container_arr[i].cont.children[0].association_name == name) {
          index_min = i;
          break;
        }
      }
      //创建组合空白矩形
      let container = new PIXI.Container;
      container.width = me.canvas_width;
      container.height = me.canvas_height;
      container.pivot.set(0, 0);
      container.rotation_num = 0;
      container.name = name;
      me.container_arr.splice(index_min, 0, {
        cont: container,
        index: index_arr[0],
        name: name,
        m_comp_name: m_comp_name
      })
      //将数组容器里的index排序
      me.sort_container_arr(true)
      me.create_association_rect(container, name, render_create)
    },
    create_association_rect: function(container, name, render_create) {
      const me = this;
      let x_arr = [];
      let y_arr = [];
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        let vertexData = me.ctrl_arr[i].vertexData
        for (let k = 0; k < vertexData.length; k++) {
          if (k % 2 == 0 || k == 0) {
            x_arr.push(vertexData[k])
          } else {
            y_arr.push(vertexData[k])
          }
        }
      }
      x_arr.sort(function(a, b) {
        return a - b;
      })
      y_arr.sort(function(a, b) {
        return a - b;
      })
      let width = x_arr[x_arr.length - 1] - x_arr[0];
      let height = y_arr[y_arr.length - 1] - y_arr[0];
      //设置父级矩形容器的位置
      container.position.set(0, 0);
      //创建矩形
      let rectangle = new PIXI.Graphics();
      rectangle.interactive = true;
      // rectangle.buttonMode = true;
      rectangle.width = width;
      rectangle.height = height;
      rectangle.originalw = width;
      rectangle.originalh = height;
      rectangle.beginFill(0xE6E6FA);
      rectangle.alpha = .7;
      // rectangle.pivot.set(0.5,0.5);
      rectangle.drawRect(0, 0, width, height);
      rectangle.endFill();
      rectangle.name = name;
      rectangle.association_name = name;
      //正式组合的空白矩形
      rectangle.type = 'association_gap_notT';
      rectangle.rotation_num = 0;
      rectangle.x = x_arr[0] - (me.window_w - me.canvas_width) / 2;
      rectangle.y = y_arr[0] - (me.window_h - me.canvas_height) / 2;
      rectangle.cursor = 'grab';
      //矩形中心点
      rectangle.centerX = rectangle.x + rectangle.width / 2;
      rectangle.centerY = rectangle.y + rectangle.height / 2;
      me.ctrl_arr.push(rectangle) //没有顺序之分
      //监听事件
      rectangle.on('rightdown', me.onRightC).on('pointerdown', me.onAssociationStart).on('mousemove', function(event) {
        me.onDragMove(rectangle, event)
      }).on('pointerupoutside', me.onAssociationEnd).on('pointerup', me.onAssociationEnd);
      container.addChild(rectangle);
      if (!render_create) {
        me.renderStage()
        //添加组合边框给组合矩形加按钮,不渲染临时边框
        me.render_t_line(false, true, name)
        me.showEdit('association')
      }

    },
    clear_temporary: function(clear_rotation, clear_association = false) {
      const me = this;
      //删除之前的空白区容器，临时组合的空白区容器,不删除临时组合数组
      if (me.temporary_rect !== null) {
        let index_c = me.findCont('temporary_c')
        if (index_c !== -1) {
          //新增了取消面板所以index+1
          me.mainStage_container.removeChildAt(index_c + 1)
          me.container_arr.splice(index_c, 1)
        }
        me.temporary_rect = null;
      }
      //是否删除数组中元素组合的矩形，新合并数组时删除
      if (clear_association) {
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          if (me.ctrl_arr[i].type == 'association_gap_notT') {
            let index_c = me.findCont(me.ctrl_arr[i].name)
            if (index_c !== -1) {
              me.mainStage_container.removeChildAt(index_c + 1)
              me.container_arr.splice(index_c, 1)
            }
          }
        }
      }
      me.sort_container_arr(clear_rotation)
    },
    findRect: function(container, data, tem_move) {
      const me = this;
      let x_arr = [];
      let y_arr = [];
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        let vertexData = me.ctrl_arr[i].vertexData
        for (let k = 0; k < vertexData.length; k++) {
          if (k % 2 == 0 || k == 0) {
            x_arr.push(vertexData[k])
          } else {
            y_arr.push(vertexData[k])
          }
        }
      }
      x_arr.sort((a, b) => a - b)
      y_arr.sort((a, b) => a - b)
      let width = x_arr[x_arr.length - 1] - x_arr[0];
      let height = y_arr[y_arr.length - 1] - y_arr[0];
      //设置父级矩形容器的位置
      container.position.set(0, 0);
      //创建矩形
      let rectangle = new PIXI.Graphics();
      rectangle.interactive = true;
      rectangle.width = width;
      rectangle.height = height;
      rectangle.originalw = width;
      rectangle.originalh = height;
      rectangle.beginFill(0xFF3300);
      rectangle.alpha = .7;
      rectangle.drawRect(0, 0, width, height);
      rectangle.endFill();
      rectangle.name = 'temporary';
      rectangle.type = 'association_gap';
      rectangle.rotation_num = 0;
      rectangle.x = x_arr[0] - (me.window_w - me.canvas_width) / 2;
      rectangle.y = y_arr[0] - (me.window_h - me.canvas_height) / 2;
      rectangle.cursor = 'grab';
      //矩形中心点
      rectangle.centerX = rectangle.x + rectangle.width / 2;
      rectangle.centerY = rectangle.y + rectangle.height / 2;
      me.temporary_rect = rectangle;
      //监听事件
      rectangle.on('rightdown', me.onRightC).on('pointerdown', me.onTemporaryStart).on('mousemove', function(event) {
        me.onDragMove(rectangle, event)
      }).on('pointerupoutside', me.onTemporaryEnd).on('pointerup', me.onTemporaryEnd);
      container.addChild(rectangle);
      me.renderStage()
      //添加临时组合边框
      me.render_t_line(true)
      //计算临时组合的偏差值用于移动
      me.ctrlDeviation(data, true, tem_move);
    },
    render_t_line: function(t_r, a_r_btn = false, name = '') {
      const me = this;
      //添加临时组合边框
      me.removeLine();
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (a_r_btn && me.ctrl_arr[i].association_name == name) {
          me.containerLine(me.ctrl_arr[i], true, a_r_btn)
        } else {
          me.containerLine(me.ctrl_arr[i], true)
        }
      }
      //值为真则需要添加临时矩形边框
      if (t_r) {
        me.containerLine(me.temporary_rect, true)
      }
    },
    a_single_click: function(that, data) {
      //单机组合中的元素
      const me = this;
      that.data = data;
      that.dragging = true;
      me.in_move = that;
      //偏差值，鼠标点击目标任何位置移动都不会闪烁
      let newPosition = that.data.getLocalPosition(me.mainStage_container);
      that.deviationX = newPosition.x - that.parent.x;
      that.deviationY = newPosition.y - that.parent.y;
      //组合内的元素不能上下层级移动
      //组合空白矩形

      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'association_gap_notT' && me.ctrl_arr[i].association_name == that.association_name) {
          //矩形变化方法
          me.ctrl_arr[i].data = data;

          // me.change_association(me.ctrl_arr[i])
          //加边框和改变矩形方法
          me.a_single_click_border(me.ctrl_arr[i].association_name)
          break;
        }
      }
      me.showEdit('association')
    },
    a_single_click_border: function(ass_name) {
      const me = this
      me.removeLine()
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'association_gap_notT' && me.ctrl_arr[i].association_name == ass_name) {
          me.ctrl_arr[i].change = true;
          me.change_association(me.ctrl_arr[i])

          //加边框
          me.createBorder(me.ctrl_arr[i], true, true, false)
        } else if (me.ctrl_arr[i].name == me.in_move.name) {
          me.createBorder(me.ctrl_arr[i], false, false)
        } else {}
      }
    },
    moveOutLine: function(x, y, obj) {
      const me = this;
      let outLineC = me.outLine_container;
      for (let i = 0; i < outLineC.children.length; i++) {
        if (obj.name == outLineC.children[i].name) {
          outLineC.children[i].position.set(x, y);
        }
      }
    },
    change_association: function(obj) {
      if (obj.change) {
        const me = this;
        let x_arr = [];
        let y_arr = [];
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          if (obj.association_name == me.ctrl_arr[i].association_name && me.ctrl_arr[i].type !== 'association_gap_notT') {
            let vertexData = me.ctrl_arr[i].vertexData
            for (let k = 0; k < vertexData.length; k++) {
              if (k % 2 == 0 || k == 0) {
                x_arr.push(vertexData[k])
              } else {
                y_arr.push(vertexData[k])
              }
            }
          }
        }
        x_arr.sort((a, b) => a - b)
        y_arr.sort((a, b) => a - b)
        let width = x_arr[x_arr.length - 1] - x_arr[0];
        let height = y_arr[y_arr.length - 1] - y_arr[0];
        obj.clear();
        obj.width = width;
        obj.height = height;
        obj.originalw = width;
        obj.originalh = height;
        obj.rotation_num = 0;
        obj.rotation = 0;
        obj.beginFill(0xE6E6FA);
        obj.alpha = .7;
        obj.drawRect(0, 0, width, height);
        obj.endFill();
        obj.x = x_arr[0] - (me.window_w - me.canvas_width) / 2;
        obj.y = y_arr[0] - (me.window_h - me.canvas_height) / 2;
        //矩形中心点
        obj.centerX = obj.x + obj.width / 2;
        obj.centerY = obj.y + obj.height / 2;
        obj.change = false
      }

    },
    add_a_ctrl_arr: function(a_name) {
      const me = this;
      for (let i = 0; i < me.container_arr.length; i++) {
        if (me.container_arr[i].cont.children[0].association_name == a_name) {
          me.ctrl_arr.push(me.container_arr[i].cont.children[0]);
        }
      }
    },
    set_ctrl_arr_ass_name: function() {
      const me = this;
      let a = [];
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].association_name !== '') a.push(me.ctrl_arr[i].association_name)
      }
      a = new Set(a)
      return [...a]
    },
    ctrl_add_ass: function(name, ass_name_arr) {
      const me = this;
      for (let i = 0; i < me.container_arr.length; i++) {
        if (name == me.container_arr[i].cont.children[0].association_name) {
          me.ctrl_arr.push(me.container_arr[i].cont.children[0])
        }
      }
      return ass_name_arr.push(name)
    },
    ctrl_dis_ass: function(name, ass_name_arr) {
      const me = this;
      me.ctrl_arr = me.ctrl_arr.filter(function(item) {
        me.removeLine(item.name)
        return item.association_name !== name
      });
      return ass_name_arr.filter(item => item !== name);
    },
    update_layer: function() {
      const me = this;
      let data = [];
      for (let i = 0; i < me.container_arr.length; i++) {
        //排除临时组合和组合矩形
        if (me.container_arr[i].cont.children[0].type !== 'temporary_rect' && me.container_arr[i].cont.children[0].type !== 'association_gap_notT') {
          data.push(me.container_arr[i].cont.children[0])
        }
      }
      //通知tab-layer更新图层
      bus.$emit('update-layer', data)
    },
    show_click: function(id) {
      const me = this;
      let index = me.findCont(id)
      me.in_move = me.container_arr[index].cont.children[0];
      if (me.in_move.association_name == '') {
        //没有组合的单个图层
        me.clearTemporary()
        //删除之前的边框按钮图层，增加此对象的边框按钮
        me.containerLine(me.in_move, false);
        me.showEdit(me.in_move.type)
      }else{
        me.a_single_click_border(me.in_move.association_name)
        me.showEdit('association')
      }
    },
    move_index: function(up) {
      const me = this;
      if (me.in_move) {
        me.up_down_move(me.findCont(me.in_move.name), up)
      } else {
        me.up_down_move(me.findCont(me.ctrl_arr[0].name), up)
      }
    },
    up_down_move: function(index, up) {
      const me = this;
      let arr1 = [],
        arr2 = [],
        arr3 = [],
        arr4 = [];
      let upindex = null;
      if (up) {
        upindex = index + 1
      } else {
        upindex = index - 1
      }

      //找出本index是否是组合，还有前后的是否是组合
      let self_f_index = null;
      let change_f_index = null;
      if (me.container_arr[index].cont.children[0].association_name !== '') {
        let sa_name = me.container_arr[index].cont.children[0].association_name;
        for (let i = 0; i < me.container_arr.length; i++) {
          if (sa_name == me.container_arr[i].cont.children[0].association_name) {
            arr2.push(me.container_arr[i])
            self_f_index = i;
          }
        }
        if (up) {
          upindex = self_f_index + 1;
          for (let i = 0; i < arr2[0].index; i++) {
            arr1.push(me.container_arr[i])
          };
        } else {
          upindex = arr2[0].index - 1
        }
      } else {
        arr2.push(me.container_arr[index])
        self_f_index = index
      }
      //判断替换顺序的两个是否来自同一归属模块
      if (!me.container_arr[upindex]) return false;
      if (me.container_arr[index].m_comp_name !== me.container_arr[upindex].m_comp_name) return false;
      if (me.container_arr[upindex]) {
        if (me.container_arr[upindex].cont.children[0].association_name !== '') {
          let a_name = me.container_arr[upindex].cont.children[0].association_name;
          for (let i = 0; i < me.container_arr.length; i++) {
            if (a_name == me.container_arr[i].cont.children[0].association_name) {
              arr3.push(me.container_arr[i])
              change_f_index = i
            }
          }
        } else {
          arr3.push(me.container_arr[upindex])
          change_f_index = upindex
        }
      }
      if (up) {
        for (let i = change_f_index + 1; i < me.container_arr.length; i++) {
          arr4.push(me.container_arr[i])
        }
        me.container_arr = [...arr1, ...arr3, ...arr2, ...arr4]
      } else {
        for (let i = self_f_index + 1; i < me.container_arr.length; i++) {
          arr4.push(me.container_arr[i])
        }
        let change_first_index = arr3[0].index;
        arr1.length = 0;
        for (let i = 0; i < change_first_index; i++) {
          arr1.push(me.container_arr[i])
        }
        me.container_arr = [...arr1, ...arr2, ...arr3, ...arr4]
      }
      me.sort_container_arr(true)
      me.renderStage()
      me.update_layer()
    },
    toImage: function() {
      //组合或者单个元素导成图片
      const me = this;
      let width, height, centerX, centerY = 0;
      let img_arr = [];
      if (me.ctrl_arr.length > 0) {
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          if (me.ctrl_arr[i].type == 'association_gap_notT') {
            width = me.ctrl_arr[i].width;
            height = me.ctrl_arr[i].height;
            centerX = me.ctrl_arr[i].centerX;
            centerY = me.ctrl_arr[i].centerY;
          }
        }
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          let data = {};
          if (me.ctrl_arr[i].type !== 'association_gap_notT' && me.ctrl_arr[i].type !== 'text') {
            data = {
              src: me.ctrl_arr[i].srcData,
              x: (width / 2) - (centerX - me.ctrl_arr[i].parent.x),
              y: (height / 2) - (centerY - me.ctrl_arr[i].parent.y),
              scale: me.ctrl_arr[i].scale.x,
              rotation: me.ctrl_arr[i].parent.rotation,
              type: me.ctrl_arr[i].type
            }
          } else if (me.ctrl_arr[i].type == 'text') {
            data = _.cloneDeep(me.ctrl_arr[i]);
            data.position.set(me.ctrl_arr[i].position.x, me.ctrl_arr[i].position.y)
          }
          img_arr.push(data)
        }

      } else if (me.in_move && me.in_move.association_name == '') {
        width = me.in_move.width;
        height = me.in_move.height;
        let data = {};
        if (me.in_move.type !== 'text') {
          data = {
            src: me.in_move.srcData,
            x: (width / 2),
            y: (height / 2),
            scale: me.in_move.scale.x,
            rotation: me.in_move.parent.rotation,
            type: me.in_move.type
          }
        } else if (me.in_move.type == 'text') {
          //深拷贝
          data = _.cloneDeep(me.in_move);
          data.position.set(me.in_move.position.x, me.in_move.position.y)
        }
        img_arr.push(data)
      }
      me.img_app = null;
      me.img_app = new PIXI.Application({
        backgroundColor: 0xff0000,
        width: width,
        height: height,
        antialias: 1
      });

      let cont = new PIXI.Container;
      cont.width = width;
      cont.height = height;
      cont.position.set(0, 0);
      cont = me.addImgTwo(cont, img_arr);
      me.img_app.stage.addChild(cont)
      let img = me.img_app.renderer.plugins.extract.base64(me.img_app.stage);
      me.$set(me.right_block, 'show', false)
    },
    addImgTwo: function(cont, img_arr) {
      const me = this;
      for (let i = 0; i < img_arr.length; i++) {
        if (img_arr[i].type !== 'text') {
          let sprite = new PIXI.Sprite(me.p_app.loader.resources[img_arr[i].src].texture);
          sprite.position.set(img_arr[i].x, img_arr[i].y)
          sprite.scale.set(img_arr[i].scale);
          sprite.rotation = img_arr[i].rotation
          cont.addChild(sprite)
        } else if (img_arr[i].type == 'text') {
          cont.addChild(img_arr[i])
        }

      }
      return cont
    },
    canvasToimg: function() {
      const me = this;
      let img = me.p_app.renderer.plugins.extract.base64(me.p_app.stage);
    },
    keyboard: function(keyCode) {
      let key = {};
      key.code = keyCode;
      key.isDown = false;
      key.isUp = true;
      key.press = undefined;
      key.release = undefined;
      //The `downHandler`
      key.downHandler = event => {
        if (event.keyCode === key.code) {
          if (key.isUp && key.press) key.press();
          key.isDown = true;
          key.isUp = false;
          event.preventDefault();
        }
      };
      //The `upHandler`
      key.upHandler = event => {
        if (event.keyCode === key.code) {
          if (key.isDown && key.release) key.release();
          key.isDown = false;
          key.isUp = true;
          event.preventDefault();
        }
      };
      //Attach event listeners
      window.addEventListener("keydown", key.downHandler.bind(key), false);
      window.addEventListener("keyup", key.upHandler.bind(key), false);
      return key;
    },
  }
};

</script>
