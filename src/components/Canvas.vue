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
import computed_func from '@/pixiFunc/computational_function.js'
import element_func from '@/pixiFunc/element_function.js'
import container_func from '@/pixiFunc/container_function.js'
import other_func from '@/pixiFunc/other_function.js'
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
      img_loading: false, //图片元素加载变量，控制每次只有一个图片加载
      click_ass_id: '', //上一个click对象
      can_scale: 0,
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
      }, {
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
              letterSpacing: 0,
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
        me.newContainerText(data, false)
        //将元素加入图层tab
        me.update_layer()
      }
    })
    bus.$on('layer_click', function(id) {
      me.show_click(id)
    })
  },
  methods: {
    renderTemplate: function() {
      const me = this;
      container_func.renderTemplate.bind(me)()
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
        me.renderTemplate();
      })
    },
    renderStage: function() {
      const me = this;
      container_func.renderStage.bind(me)()
    },
    addCancleRect: function(mainStage) {
      container_func.addCancleRect.bind(this)(mainStage)
    },
    outLine: function(mainStage) {
      container_func.outLine.bind(this)(mainStage)
    },
    maskInit: function() {
      container_func.maskInit.bind(this)()
    },
    cancelInMove: function() {
      container_func.cancelInMove.bind(this)()
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
      let style = me.in_move.style;
      style.wordWrapWidth = num * value
      if (me.in_move.style.fontStyle == 'normal') {
        style.wordWrapWidth += style.fontSize * 0.2
      }
      me.in_move.style = style;
      me.in_move.style.fontSize = value;
      me.in_move.style.lineHeight = me.in_move.style.fontSize + me.in_move.lineHeightM;
      me.p_app.renderer.render(me.in_move)
      //
      me.containerLine(me.in_move, false);
      me.scaleTextEnd(me.in_move)
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
      container_func.newContainer.bind(this)(set_data, render_add, func)
    },
    addContainer: function(set_data, position = { x: this.canvas_width / 2, y: this.canvas_height / 2 }) {
      container_func.addContainer.bind(this)(set_data, position)
    },
    containerArrAdd: function(m_comp_name, container, id) {
      container_func.containerArrAdd.bind(this)(m_comp_name, container, id)
    },
    findFinalIndex: function(m_comp_name) {
      //递归函数好像放不进container_func
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
                return me.findFinalIndex(me.project_m_comp[i + 1].name)
              }
            }
          }
        } else {
          return final_index
        }
      }
    },
    loadSprite: function(set_data, render_add, func) {
      container_func.loadSprite.bind(this)(set_data, render_add, func)
    },
    loadSvgImg: function(src, sprite, my_set_data, render_add) {
      container_func.loadSvgImg.bind(this)(src, sprite, my_set_data, render_add)
    },
    addImg: function(sprite, set_data, render_add) {
      container_func.addImg.bind(this)(sprite, set_data, render_add)
    },
    updateSvgScale: function(obj) {
      element_func.updateSvgScale.bind(this)(obj)
    },
    newContainerText: function(set_data, render_add) {
      container_func.newContainerText.bind(this)(set_data, render_add)
    },
    addText: function(set_data, render_add) {
      container_func.addText.bind(this)(set_data, render_add)
    },
    ruler: function() {
      container_func.ruler.bind(this)()
    },
    containerLine: function(obj, t_a, a_r_btn = false) {
      container_func.containerLine.bind(this)(obj, t_a, a_r_btn)
    },
    createBorder: function(obj, t_a, a_r_btn, show_btn = true) {
      container_func.createBorder.bind(this)(obj, t_a, a_r_btn, show_btn)
    },
    addScaleIcon: function(outLineC, obj, t_a, a_r_btn = false) {
      container_func.addScaleIcon.bind(this)(outLineC, obj, t_a, a_r_btn)
    },
    addRotateIcon: function(outLineC, obj, t_a, a_r_btn = false) {
      container_func.addRotateIcon.bind(this)(outLineC, obj, t_a, a_r_btn)
    },
    addStretchIcon: function(outLineC, obj) {
      container_func.addStretchIcon.bind(this)(outLineC, obj)
    },
    onRightC: function(event) {
      element_func.onRightC.bind(this)(event)
    },
    onRightFunc: function(f_parm, event = null) {
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
        me.clearTemAss(false)
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          me.delete_someone(me.ctrl_arr[i].name, false, function() {})
        }
        me.renderStage()
        me.$set(me.right_block, 'show', false)
      }
      //更新图层tab
      me.update_layer();
      me.cancelInMove();
    },
    delete_someone: function(name, render, callback) {
      const me = this;
      let index_c = me.findCont(name)
      if (index_c !== -1) {
        //新增了取消面板所以index+1
        me.mainStage_container.removeChildAt(index_c + 1)
        me.container_arr.splice(index_c, 1)
        me.in_move = null;
        me.sortContainerArr(true)
        if (render) {
          me.renderStage()
        }
        callback()
      }
    },
    onRightAss: function() {
      const me = this;
      //将临时组合设置为组合，不同元素模块的不能组合
      me.arrToAss(me.ctrl_arr)
      me.$set(me.right_block, 'show', false)
    },
    arrToAss: function(element_arr, association_id = -1, render_create = false) {
      other_func.arrToAss.bind(this)(element_arr, association_id, render_create)
    },
    onRight_unAss: function() {
      const me = this;
      //取消组合，删除组合矩形，清空元素的组合名称 
      //情空临时矩形区域,清空包含在ctrl_arr数组里的其他组合矩形
      me.removeLine()
      me.clearTemAss(true, true);
      me.ctrl_arr.map(function(value, index, array) {
        value.association_name = ''
      })
      me.ctrl_arr.length = 0;
      me.$set(me.right_block, 'show', false)
      me.cancelInMove(); //取消右侧编辑栏
    },
    onDragStart: function(sprite, event) {
      const me = this;
      element_func.onDragStart.bind(me)(sprite, event)
    },
    onDragMove: function(obj, event) {
      const me = this;
      element_func.onDragMove.bind(me)(obj, event)
    },
    onDragEnd: function(sprite, event) {
      const me = this;
      element_func.onDragEnd.bind(me)(sprite, event)
    },
    onScaleStart: function(event) {
      const me = this;
      element_func.onScaleStart.bind(me)(event)
    },
    onScaleMove: function(btn, event) {
      const me = this
      element_func.onScaleMove.bind(me)(btn, event)
    },
    onScaleEnd: function() {
      const me = this;
      element_func.onScaleEnd.bind(me)()
    },
    onRotateStart: function() {
      element_func.onRotateStart.bind(this)()
    },
    onRotateMove: function(event) {
      const me = this;
      element_func.onRotateMove.bind(me)(event)
    },
    onRotateEnd: function() {
      const me = this;
      element_func.onRotateEnd.bind(me)()
    },
    onTemporaryStart: function(event) {
      const me = this;
      element_func.onTemporaryStart.bind(me)(event)
    },
    onTemporaryEnd: function() {
      const me = this;
      element_func.onTemporaryEnd.bind(me)()
    },
    onTScaleStart: function(event) {
      const me = this;
      element_func.onTScaleStart.bind(me)(event);
    },
    onTScaleMove: function(btn, event) {
      const me = this;
      element_func.onTScaleMove.bind(me)(btn, event);
    },
    onTScaleEnd: function() {
      const me = this;
      element_func.onTScaleEnd.bind(me)()
    },
    onTRotateStart: function(event = null) {
      const me = this;
      element_func.onTRotateStart.bind(me)(event)
    },
    onTRotateMove: function(event) {
      const me = this;
      element_func.onTRotateMove.bind(me)(event)
    },
    onTRotateEnd: function() {
      const me = this;
      element_func.onTRotateEnd.bind(me)()
    },
    onAssociationStart: function(event) {
      const me = this
      element_func.onAssociationStart.bind(me)(event)
    },
    onAScaleStart: function(event) {
      const me = this;
      element_func.onAScaleStart.bind(me)(event)
    },
    onAScaleMove: function(btn, event) {
      const me = this;
      element_func.onAScaleMove.bind(me)(btn, event)
    },
    onAScaleEnd: function() {
      element_func.onAScaleEnd.bind(this)()
    },
    onARotateStart: function(event = null) {
      element_func.onARotateStart.bind(this)(event)
    },
    onARotateMove: function(btn = null, event = null) {
      element_func.onARotateMove.bind(this)(btn, event)
    },
    onARotateEnd: function(btn = null, event = null) {
      element_func.onARotateEnd.bind(this)(btn, event)
    },
    forChangeAssociation: function(ass_id = undefined) {
      element_func.forChangeAssociation.bind(this)(ass_id)
    },
    onStretchStart: function(event) {
      element_func.onStretchStart.bind(this)(event)
    },
    onStretchMove: function(event) {
      element_func.onStretchMove.bind(this)(event)
    },
    onStretchEnd: function() {
      element_func.onStretchEnd.bind(this)()
    },
    normalStart: function(that, data) {
      element_func.normalStart.bind(this)(that,data)
    },
    ctrlDeviation: function(data, t_r, tem_move = true) {
      element_func.ctrlDeviation.bind(this)(data, t_r, tem_move)
    },
    rotateOBj: function(num, x) {
      element_func.rotateOBj.bind(this)(num, x)
    },
    tRotateOBj: function(num, x) {
      element_func.tRotateOBj.bind(this)(num, x)
    },
    aRotateOBj: function(num, x, centerX) {
      element_func.aRotateOBj.bind(this)(num, x, centerX)
    },
    scaleAll: function(n, d_value, text_num = 0) {
      element_func.scaleAll.bind(this)(n, d_value, text_num)
    },
    tScaleAll: function(n, that, present_w) {
      element_func.tScaleAll.bind(this)(n, that, present_w)
    },
    aScaleAll: function(n, that) {
      element_func.aScaleAll.bind(this)(n, that)
    },
    scaleTextEnd(text) {
      element_func.scaleTextEnd.bind(this)(text)
    },
    moveIcon: function(obj) {
      element_func.moveIcon.bind(this)(obj)
    },
    removeLine: function(id = null) {
      container_func.removeLine.bind(this)(id)
    },
    clearTemporary: function() {
      container_func.clearTemporary.bind(this)()
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
    sortContainerArr: function(clear_rotation) {
      container_func.sortContainerArr.bind(this)(clear_rotation)
    },
    findMinAndAdd: function(data, a_length = 0, a_name = '') {
      container_func.findMinAndAdd.bind(this)(data, a_length, a_name)
    },
    createAssociation: function(name, m_comp_name, render_create) {
      container_func.createAssociation.bind(this)(name, m_comp_name, render_create)
    },
    createAssociationRect: function(container, name, render_create) {
      container_func.createAssociationRect.bind(this)(container, name, render_create)
    },
    clearTemAss: function(clear_rotation, clear_association = false) {
      container_func.clearTemAss.bind(this)(clear_rotation, clear_association)
    },
    findRect: function(container, data, tem_move) {
      container_func.findRect.bind(this)(container, data, tem_move)
    },
    renderTLine: function(t_r, a_r_btn = false, name = '') {
      container_func.renderTLine.bind(this)(t_r, a_r_btn, name)
    },
    aSingleClick: function(that, data) {
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
          //加边框和改变矩形方法
          me.aSingleClickBorder(me.ctrl_arr[i].association_name)
          break;
        }
      }
      me.showEdit('association')
    },
    aSingleClickBorder: function(ass_name) {
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
    addACtrlarr: function(a_name) {
      const me = this;
      for (let i = 0; i < me.container_arr.length; i++) {
        if (me.container_arr[i].cont.children[0].association_name == a_name) {
          me.ctrl_arr.push(me.container_arr[i].cont.children[0]);
        }
      }
    },
    setCtrlArrAssname: function() {
      const me = this;
      let a = [];
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].association_name !== '') a.push(me.ctrl_arr[i].association_name)
      }
      a = new Set(a)
      return [...a]
    },
    ctrlAddAss: function(name, ass_name_arr) {
      const me = this;
      for (let i = 0; i < me.container_arr.length; i++) {
        if (name == me.container_arr[i].cont.children[0].association_name) {
          me.ctrl_arr.push(me.container_arr[i].cont.children[0])
        }
      }
      return ass_name_arr.push(name)
    },
    ctrlDisAss: function(name, ass_name_arr) {
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
      } else {
        me.aSingleClickBorder(me.in_move.association_name)
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
      me.sortContainerArr(true)
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
