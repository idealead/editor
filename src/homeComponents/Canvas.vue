<template>
  <div id="mainCanvas" v-loading.fullscreen.lock="fullscreenLoading">
    <div
      class="mouse_right_block"
      v-show="right_block.show"
      v-bind:style="{ left: right_block.rb_left, top: right_block.rb_top }"
    >
      <div
        class="mouse_right_btn right_btn_association"
        v-show="right_block_ass && user_type != 'designer'"
      >
        <div v-if="right_block.menu.ass == 1" @click="onRightAss">组合</div>
        <div v-else-if="right_block.menu.ass == 2" @click="onRight_unAss">取消组合</div>
      </div>
      <div class="mouse_right_btn" v-show="right_block.menu.show_lock">
        <div v-if="!right_block.menu.lock" @click="lockFunc">{{ right_block.lock_text }}</div>
        <div v-if="right_block.menu.lock" @click="unlockFunc">{{ right_block.unlock_text }}</div>
      </div>
      <div v-if="new_structure_id != ''" class="mouse_right_btn" @click="moveIndex(true)">上移</div>
      <div v-if="new_structure_id != ''" class="mouse_right_btn" @click="moveIndex(false)">下移</div>
      <div
        v-if="new_structure_id != ''"
        class="mouse_right_btn"
        @click="moveIndex(true, 'maxUp')"
      >置顶</div>
      <div
        v-if="new_structure_id != ''"
        class="mouse_right_btn"
        @click="moveIndex(false, 'maxDown')"
      >置底</div>
      <div
        class="mouse_right_btn"
        @click="onEdit"
        v-if="right_block.menu.edit_text && user_type != 'designer'"
      >更改文字</div>
      <div
        class="mouse_right_btn"
        @click="changeImage"
        v-if="right_block.menu.change && user_type != 'designer'"
      >更换图片</div>
      <div class="mouse_right_btn" @click="toImage(false)" v-if="user_type != 'designer'">导出图片</div>
      <div
        class="mouse_right_btn right_btn_delete"
        v-show="right_block.menu.del && in_move && !in_move.structure"
        @click="onRightDelete"
      >删除</div>
      <div v-if="user_type == 'designer'">
        <!-- <div class="mouse_right_btn" @click="setRole('title')" v-show="in_move && in_move.type == 'text' && in_move.role != 'title'">设为标题</div>
        <div class="mouse_right_btn" @click="setRole('subtitle')" v-show="
            in_move && in_move.type == 'text' && in_move.role != 'subtitle'
        ">设为副标题</div>-->
        <div
          class="mouse_right_btn"
          @click="setRole('arc_title')"
          v-show="
            in_move && in_move.type == 'text' && in_move.role != 'arc_title'
          "
        >设为弧形标题</div>
        <div
          class="mouse_right_btn"
          @click="setRole('arc_subtitle')"
          v-show="
            in_move && in_move.type == 'text' && in_move.role != 'arc_subtitle'
          "
        >设为弧形副标题</div>
        <div
          class="mouse_right_btn"
          @click="setRole('logo')"
          v-show="in_move && in_move.type == 'image' && in_move.role != 'logo'"
        >设为logo</div>
        <div
          class="mouse_right_btn"
          @click="setRole('main')"
          v-show="in_move && in_move.type == 'image' && in_move.role != 'main'"
        >设为主图</div>
        <div
          class="mouse_right_btn"
          @click="setRole('arc_titleImg')"
          v-show="
            in_move && in_move.type == 'image' && in_move.role != 'arc_titleImg'
          "
        >设为弧形标题装饰</div>
        <div
          class="mouse_right_btn"
          @click="setRole('arc_subtitleImg')"
          v-show="
            in_move &&
              in_move.type == 'image' &&
              in_move.role != 'arc_subtitleImg'
          "
        >设为弧形副标题装饰</div>
        <div
          v-show="
            in_move &&
              in_move.type == 'image' &&
              in_move.replacePosition == null &&
              new_structure_id != ''
          "
          v-for="(item, index) in structure_position"
          :key="index"
          class="mouse_right_btn"
          @click="setPosition(item.position)"
        >"{{ item.position_name }}"替换位置</div>
        <div
          class="mouse_right_btn"
          @click="setPosition(null)"
          v-if="
            in_move &&
              in_move.type == 'image' &&
              in_move.replacePosition >= 0 &&
              new_structure_id != '' &&
              (in_move.replacePosition || in_move.replacePosition == 0)
          "
        >取消替换位置</div>
        <div
          class="mouse_right_btn"
          @click="setRole('bg')"
          v-show="
            in_move &&
              in_move.type == 'image' &&
              in_move.role != 'bg' &&
              tempRoleMsg.bg == 0
          "
        >设为背景</div>
        <el-dropdown class="mouse_right_btn" @command="handleCommand">
          <span class="el-dropdown-link">
            文案替换
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="drodown-select">
            <el-dropdown-item
              v-for="(item, index) in textPositionArr"
              :key="index"
              :command="[index, item]"
            >{{ item }}</el-dropdown-item>
            <el-dropdown-item :command="[-1, '']">取消替换位置</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <div class="mouse_right_btn" @click="recommendText">测试推荐文案</div> -->
        <div
          class="mouse_right_btn"
          @click="setRole('normal')"
          v-show="in_move && in_move.role != 'normal'"
        >取消角色</div>
        <div
          class="mouse_right_btn"
          @click="textReverse(null)"
          v-show="in_move && in_move.type == 'text'"
        >文本倒序</div>
      </div>
    </div>
    <transition name="slide-fade">
      <div class="edit_bar" v-show="edit_bar.btn.show">
        <el-tooltip
          class="item"
          effect="light"
          content="编辑"
          placement="right"
          popper-class="tooltip"
        >
          <div class="edit_btn editf_btn" v-show="edit_bar.btn.edit" @click="onEdit"></div>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="light"
          content="编辑文字"
          placement="right"
          popper-class="tooltip"
        >
          <div
            class="edit_btn text_btn"
            v-show="edit_bar.btn.text"
            @click.self="show_text_block"
            :class="{ text_btn_active: edit_bar.edit_text }"
          >
            <div class="text_block" v-show="edit_bar.edit_text">
              <div class="block_title block_title_text">文 字</div>
              <div class="text_body_block">
                <el-row class="text_row">
                  <el-col :span="24">
                    <div class="grid-content text_left">字体</div>
                    <el-button class="text_fontFamily" @click="showFontFamily">{{ ffName }}</el-button>
                  </el-col>
                </el-row>
                <el-row class="text_row">
                  <el-col :span="24">
                    <div class="grid-content text_left">字号</div>
                    <!-- <el-input v-model="edit_bar.text.fontSize" @change="fontSize_change" class="text_fontSize align_right" type="number">
                    </el-input>-->
                    <el-input-number
                      v-model="edit_bar.text.fontSize"
                      controls-position="right"
                      @change="fontSize_change"
                      :min="1"
                      :max="500"
                      class="text_fontSize align_right"
                    ></el-input-number>
                  </el-col>
                </el-row>
                <el-row class="text_row">
                  <el-col :span="24">
                    <div class="grid-content text_left">
                      倾斜
                      <el-switch
                        class="align_right"
                        :value="
                          edit_bar.text.fontStyle == 'normal' ? false : true
                        "
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="fontStyle_change"
                      ></el-switch>
                    </div>
                  </el-col>
                </el-row>
                <el-row class="text_row">
                  <el-col :span="24">
                    <div class="grid-content text_left">
                      加粗
                      <el-switch
                        class="align_right"
                        :value="
                          this.edit_bar.text.fontWeight == 'normal'
                            ? false
                            : true
                        "
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="fontWeightChange"
                      ></el-switch>
                    </div>
                  </el-col>
                </el-row>
                <el-row class="text_row" style="padding-bottom:0">
                  <el-col :span="24">
                    <div class="grid-content text_left">
                      字间距
                      <el-slider
                        v-model="edit_bar.text.letterSpacing"
                        class
                        :min="-40"
                        :max="50"
                        @change="letterSpacing_change"
                      ></el-slider>
                    </div>
                  </el-col>
                </el-row>
                <el-row class="text_row" style="padding-bottom:0">
                  <el-col :span="24">
                    <div class="grid-content text_left">
                      行间距
                      <el-slider
                        v-model="edit_bar.text.leading"
                        class
                        :min="-20"
                        :max="100"
                        @change="leading_change"
                      ></el-slider>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div class="fontFamily_select" v-show="edit_bar.edit_fontFamily_select">
                <div class="block_title block_title_text">字 体</div>
                <div class="fontFamily_body_block">
                  <div
                    class="fontFamily_option"
                    v-for="item in edit_bar.fontFamily"
                    :key="item.value"
                    @click="fontFamily_change(item.value)"
                    :style="{ 'font-family': item.value }"
                  >{{ item.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="light"
          content="颜色"
          placement="right"
          popper-class="tooltip"
        >
          <div
            class="edit_btn color_btn"
            v-show="edit_bar.btn.color"
            @click.self="showColorBlock"
            :class="{ color_btn_active: edit_bar.edit_color }"
          >
            <div class="rotation_block" v-show="edit_bar.edit_color">
              <div class="block_title">颜 色</div>
              <div class="rotation_body_block">
                <el-row class>
                  <el-col :span="24">
                    <div class="block text_left">
                      <el-color-picker
                        class="align_right font_color_picker"
                        v-model="edit_bar.text.color"
                        @active-change="fontColor_change"
                        popper-class="font_color"
                      ></el-color-picker>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="light"
          content="对齐"
          placement="right"
          popper-class="tooltip"
        >
          <div
            class="edit_btn align_btn"
            v-show="edit_bar.btn.align"
            @click.self="showEditAlign"
            :class="{ align_btn_active: edit_bar.edit_align }"
          >
            <div class="align_block" v-show="edit_bar.edit_align">
              <div class="block_title">对 齐</div>
              <div class="align_body_block">
                <el-row type="flex" class="row-bg" justify="space-between">
                  <el-col :span="8">
                    <div class="grid-content">
                      <div @click="alignChange('left')" class="location_in_btn align_left"></div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="grid-content">
                      <div @click="alignChange('center')" class="location_in_btn align_center"></div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="grid-content">
                      <div @click="alignChange('right')" class="location_in_btn align_right_img"></div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="light"
          content="阴影"
          placement="right"
          popper-class="tooltip"
        >
          <div
            class="edit_btn shadow_btn"
            v-show="edit_bar.btn.shadow"
            @click.self="showEditShadow"
            :class="{ shadow_btn_active: edit_bar.edit_shadow }"
          >
            <div class="shadow_block" v-show="edit_bar.edit_shadow">
              <div class="block_title">阴 影</div>
              <div class="shadow_body_block">
                <el-row class="text_row">
                  <el-col :span="24">
                    <div class="grid-content text_left">
                      开启阴影
                      <el-switch
                        class="align_right"
                        v-model="edit_bar.text.dropShadow"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="dropShadow"
                      ></el-switch>
                    </div>
                  </el-col>
                </el-row>
                <div v-show="edit_bar.text.dropShadow">
                  <el-row class="text_row">
                    <el-col :span="24">
                      <div class="block text_left">
                        阴影颜色
                        <el-color-picker
                          color-format="hex"
                          class="align_right shadow_color_picker"
                          v-model="edit_bar.text.dropShadowColor"
                          @active-change="dropShadowColorChange"
                          size="small"
                          popper-class="font_color shadow_color"
                        ></el-color-picker>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="text_row">
                    <el-col :span="24">
                      <div class="grid-content text_left">
                        阴影模糊
                        <el-slider
                          v-model="edit_bar.text.dropShadowBlur"
                          class
                          :min="0"
                          :max="20"
                          @change="dropShadowBlurChange"
                        ></el-slider>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="text_row">
                    <el-col :span="24">
                      <div class="grid-content text_left">
                        阴影距离
                        <el-slider
                          v-model="edit_bar.text.dropShadowDistance"
                          class
                          :min="0"
                          :max="30"
                          @change="dropShadowDistanceChange"
                        ></el-slider>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="light"
          content="更换图片"
          placement="right"
          popper-class="tooltip"
        >
          <div class="edit_btn changef_btn" v-show="edit_bar.btn.change_image" @click="changeImage"></div>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="light"
          content="位置"
          placement="right"
          popper-class="tooltip"
        >
          <div
            class="edit_btn location_btn"
            v-show="edit_bar.btn.location"
            @click.self="showEditLocation"
            :class="{ location_btn_active: edit_bar.edit_location }"
          >
            <div class="location_block" v-show="edit_bar.edit_location">
              <div class="block_title">位 置</div>
              <div class="location_body_block">
                <el-row type="flex" class="row-bg" justify="space-between">
                  <el-col :span="8">
                    <div class="grid-content">
                      <div @click="locationMove('left')" class="location_in_btn location_left"></div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="grid-content">
                      <div @click="locationMove('center')" class="location_in_btn location_center"></div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="grid-content">
                      <div @click="locationMove('right')" class="location_in_btn location_right"></div>
                    </div>
                  </el-col>
                </el-row>
                <el-row type="flex" class="row-bg" justify="space-between" style="margin-top:2px">
                  <el-col :span="8">
                    <div class="grid-content">
                      <div @click="locationMove('up')" class="location_in_btn location_top"></div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="grid-content">
                      <div @click="locationMove('middle')" class="location_in_btn location_middle"></div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="grid-content">
                      <div @click="locationMove('down')" class="location_in_btn location_bottom"></div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="light"
          content="旋转"
          placement="right"
          popper-class="tooltip"
        >
          <div
            class="edit_btn rotation_btn"
            v-show="edit_bar.btn.rotation"
            @click.self="show_rotation_block"
            :class="{ rotation_btn_active: edit_bar.edit_rotation }"
          >
            <div class="rotation_block" v-show="edit_bar.edit_rotation">
              <div class="block_title">旋 转</div>
              <div class="rotation_body_block">
                <el-slider
                  v-model="edit_bar.rotation"
                  @change="rotationChange"
                  :min="-180"
                  :max="180"
                  :show-tooltip="false"
                ></el-slider>
                <p>{{ edit_bar.rotation }}°</p>
              </div>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="light"
          content="倾斜"
          placement="right"
          popper-class="tooltip"
        >
          <div
            class="edit_btn skew_btn"
            v-show="edit_bar.btn.skew"
            @click.self="show_skew_block"
            :class="{ skew_btn_active: edit_bar.edit_skew }"
          >
            <div class="skew_block" v-show="edit_bar.edit_skew">
              <div class="block_title">倾斜</div>
              <div class="skew_body_block">
                <p>X轴倾斜</p>
                <el-slider
                  v-model="edit_bar.skewX"
                  @change="skewChange('x')"
                  :min="-1"
                  :max="1"
                  :show-tooltip="true"
                  :step="0.1"
                ></el-slider>
                <p>Y轴倾斜</p>
                <el-slider
                  v-model="edit_bar.skewY"
                  @change="skewChange('y')"
                  :min="-1"
                  :max="1"
                  :show-tooltip="true"
                  :step="0.1"
                ></el-slider>
              </div>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="light"
          content="透明度"
          placement="right"
          popper-class="tooltip"
        >
          <div
            class="edit_btn opacity_btn"
            v-show="edit_bar.btn.opacity"
            @click.self="show_opacity_block"
            :class="{ opacity_btn_active: edit_bar.edit_opacity }"
          >
            <div class="opacity_block" v-show="edit_bar.edit_opacity">
              <div class="block_title">透 明 度</div>
              <div class="opacity_body_block">
                <el-slider
                  v-model="edit_bar.opacity"
                  @change="opacity_change"
                  class="opacity_slider"
                  :show-tooltip="false"
                ></el-slider>
                <p>{{ edit_bar.opacity }}%</p>
              </div>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="light"
          content="色相"
          placement="right"
          popper-class="tooltip"
        >
          <div
            class="edit_btn hue_btn"
            v-show="edit_bar.btn.hue"
            @click.self="show_hue_block"
            :class="{ hue_btn_active: edit_bar.edit_hue }"
          >
            <div class="hue_block" v-show="edit_bar.edit_hue">
              <div class="block_title">色相</div>
              <div class="hue_body_block">
                <el-slider
                  v-model="edit_bar.hue"
                  class="opacity_slider"
                  :show-tooltip="true"
                  @change="changeHue"
                  :min="0"
                  :max="1"
                  :step="0.05"
                ></el-slider>
              </div>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="light"
          content="层级"
          placement="right"
          popper-class="tooltip"
        >
          <div
            class="edit_btn upDown_btn"
            v-show="edit_bar.btn.updown"
            @click="showLayerBlock"
            :class="{ upDown_btn_active: edit_bar.edit_layer }"
          >
            <div class="layer_block" v-show="edit_bar.edit_layer">
              <div class="block_title">图 层</div>
              <div class="layer_body_block">
                <div class="up_btn" @click="moveIndex(true)">
                  <div class="up_btn_logo"></div>
                  <p class="btn_p">上移</p>
                </div>
                <div class="down_btn" @click="moveIndex(false)">
                  <div class="down_btn_logo"></div>
                  <p class="btn_p">下移</p>
                </div>
                <div class="up_btn maxUp_btn" @click="moveIndex(true, 'maxUp')">
                  <div class="maxUp_btn_logo"></div>
                  <p class="btn_p">置顶</p>
                </div>
                <div class="down_btn maxDown_btn" @click="moveIndex(false, 'maxDown')">
                  <div class="maxDown_btn_logo"></div>
                  <p class="btn_p">置底</p>
                </div>
              </div>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="light"
          content="删除"
          placement="right"
          popper-class="tooltip"
        >
          <div class="edit_btn delete_btn" v-show="edit_bar.btn.delete" @click="onRightDelete"></div>
        </el-tooltip>
      </div>
    </transition>
    <div class="mouldFuncButton">
      <el-tooltip
        class="item"
        effect="dark"
        content="添加文案替换功能"
        placement="top"
        v-if="user_type == 'designer'"
      >
        <div class="replaceTextButton funcButton" @click="setReplaceText"></div>
      </el-tooltip>
      <!-- <div class="hueButton funcButton">
        <div class="hue_block">
          <div class="block_title">色相</div>
          <div class="hue_body_block">
            <el-slider v-model="main_hue" class="opacity_slider" :show-tooltip="true" @change="allHue" :min="0" :max="1" :step="0.05"></el-slider>
          </div>
        </div>
      </div>-->
      <div class="addButton funcButton" @click="addPopShow(true)"></div>
    </div>
    <addPop v-show="addPop" />
    <mould-func
      v-if="mouldFuncShow"
      :open-block="openF"
      :text-position-arr="textPositionArr"
      v-model="saveTextRule"
      @update-text-position="updateTextPosition"
      @close-mould-funcshow="mouldFuncShow = false"
    />
    <div class="bottom_f">
      <div class="bottom_f_btn">{{ canvas_ratio_arr[0] }}:{{ canvas_ratio_arr[1] }}</div>
      <div class="bottom_f_btn" @click="showRuler">
        <div class="ruler"></div>
      </div>
      <div class="bottom_f_btn" @click="moveActiveLog('prev')">
        <div class="prevBtn"></div>
      </div>
      <div class="bottom_f_btn" @click="moveActiveLog('next')">
        <div class="nextBtn"></div>
      </div>
      <div class="bottom_f_btn">
        <span class="reduce_scale" @click="canvasScale('reduce')">-</span>
        <span>{{ parseInt(canvas_scale * 100) }}%</span>
        <span class="plus_scale" @click="canvasScale('plus')">+</span>
      </div>
    </div>
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
<script>
import * as PIXI from 'pixi.js'
import { mapState, mapActions, mapGetters } from 'vuex'
import bus from '@/eventBus.js'
import axios from 'axios'
import element_func from '@/homeComponents/pixiFunc/element_function.js'
import container_func from '@/homeComponents/pixiFunc/container_function.js'
import other_func from '@/homeComponents/pixiFunc/other_function.js'
import logo from '../assets/logo.png'
import scale from '../assets/scale.png'
import rotate from '../assets/rotate.png'
import stretch from '../assets/stretch.png'
import '../css/canvas.less'
document.oncontextmenu = function () {
  event.returnValue = false
}
export default {
  name: 'Canvas',
  props: {
    msg: String
  },
  data () {
    return {
      reRender: true,
      logo: logo,
      scale: scale,
      rotate: rotate,
      stretch: stretch,
      p_app: null,
      img_app: null,
      r_btn_h: 30, // 旋转按钮偏移量
      association: [], // 组合对象数组，一个组合可以包含多个容器
      ass_r_data: {}, // 补充的组合旋转时运算的数据
      container_arr: [], // 容器数组中index越小，层级越低
      outLine_container: null,
      mainStage_container: null,
      ruler_container: null,
      in_move: null,
      temporary_rect: null,
      ctrl_arr: [],
      img_loading: false, // 图片元素加载变量，控制每次只有一个图片加载
      click_ass_id: '', // 上一个click对象
      can_scale: 0,
      can_rotate: 0,
      can_stretch: 0,
      after_move: false,
      after_scale: false,
      after_rotate: false,
      after_stretch: false,
      canvas_scale: 1,
      addPop: false,
      right_block: {
        // 右键点击面板的属性数据
        rb_left: '0px',
        rb_top: '0px',
        show: false,
        menu: {
          ass: 1, // 1代表组合，2代表取消组合，3代表没有组合按钮
          lock: false,
          del: true,
          top: false,
          bot: false,
          cop: true,
          show_lock: false,
          change: false,
          edit_text: false
        },
        delete_type: 0,
        lock_text: '锁定',
        unlock_text: '解锁'
      },
      edit_bar: {
        // 右侧编辑栏按钮
        btn: {
          show: false,
          text: true,
          location: true,
          rotation: true,
          opacity: true,
          updown: true,
          delete: true,
          color: true,
          align: true,
          shadow: true,
          edit: true,
          change_image: true,
          skew: true,
          hue: true
        },
        // 右侧编辑栏点击按钮出现的面板(显示与否的控制参数)
        edit_text: false,
        edit_location: false,
        edit_layer: false,
        edit_color: false,
        edit_align: false,
        edit_shadow: false,
        edit_fontFamily_select: false,
        edit_rotation: false,
        edit_skew: false,
        edit_hue: false,
        edit_opacity: false,
        text: {
          fontSize: 0,
          leading: 0,
          letterSpacing: 0,
          fontStyle: 'normal',
          fontWeight: 'normal',
          color: '#000000',
          fontFamily: 'st',
          align: 'center',
          dropShadow: false,
          dropShadowColor: '#000000',
          dropShadowBlur: 0,
          dropShadowDistance: 5
        },
        fontFamily: [
          { name: '宋体', value: 'st' },
          { name: '苹方黑体', value: 'pfht' },
          { name: '日本花园明朝体', value: 'japanhymc' },
          { name: '杨任东竹石体-Bold', value: 'yrdzsl-Bold' },
          { name: '方正粗黑繁体', value: 'fzchft' },
          { name: '方正美黑繁体', value: 'fzmhft' },
          { name: '方正美黑简体', value: 'fzmhjt' },
          { name: '方正姚体繁体', value: 'fzytft' },
          { name: '方正华隶繁体', value: 'FZHLFW' },
          { name: '方正祥隶繁体', value: 'fzxlft' },
          { name: '方正魏碑繁体', value: 'fzwbft' },
          { name: '方正正粗黑', value: 'fzzch' },
          { name: '方正牟氏黑隶简体', value: 'fzmshljt' },
          { name: '方正方魅简体', value: 'fzfmjt' },
          { name: '方正粗圆GBK', value: 'fzcygbk' },
          { name: '方正像素24', value: 'fzxs24' },
          { name: '方正幼线', value: 'fzyx' },
          { name: '方正兰亭中粗黑_GBK', value: 'fzltzch_gbk' },
          { name: '方正粗活意简体', value: 'fzchyjt' },
          { name: '华康勘亭流_简&繁', value: 'hkktlj' },
          { name: '叶根友特楷简体', value: 'ygytkjt' },
          { name: '建行儒黑中', value: 'jhrhz' },
          { name: '汉仪铸字苏打黑', value: 'hyzzsdh' },
          { name: '汉仪家书简', value: 'hyjsj' },
          { name: 'TTTGB', value: 'tttgb' },
          { name: '潮字社凌渡鲲鹏简', value: 'czsldkpj' },
          { name: '华康翩翩', value: 'hkpp' },
          { name: 'ALBA', value: 'alba' },
          { name: '方正吕建德楷体', value: 'fzljdkt' },
          { name: '汉仪迪升英雄体', value: 'hydsyxt' },
          { name: '百度综艺简体', value: 'bdzyjt' }
          // { name: "凌渡鲲鹏简", value: "REEJI-CHAO-KunPengGB" }
        ],
        align: [
          {
            value: 'left',
            label: '居左'
          },
          {
            value: 'center',
            label: '居中'
          },
          {
            value: 'right',
            label: '居右'
          }
        ],
        opacity: 100,
        rotation: 0,
        skewX: 0,
        skewY: 0,
        hue: 0
      },
      active_log: [],
      active_index: -1,
      render_data: [
        {
          m_comp_name: 'product',
          z_index: 1,
          children: [
            {
              ass_children: [
                {
                  src: '',
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
                }
              ],
              association_id: ''
            }
          ]
        }
      ],
      textTime: true,
      tempRoleMsg: { main: 0, logo: 0, title: 0, subtitle: 0, bg: 0 },
      arc_obj: {
        arc_title: '',
        arc_subtitle: '',
        arc_titleImg: '',
        arc_subtitleImg: '',
        // 上面是弧形文字的setData，不是实例
        title_obj: null,
        subtitle_obj: null
      },
      // main_hue: 0, // 色相
      father_id: '',
      thisTempLevel: '',
      mouldFuncShow: false, // 模板添加功能（文案替换）
      textPositionArr: [], // 文案替换位置数组
      saveTextRule: false, // 文本规则是否更新（在保存模板之后）
      openF: 'text',
      fullscreenLoading: false // 显示loading
    }
  },
  computed: {
    ...mapState({
      window_w: state => state.window_w,
      window_h: state => state.window_h,
      canvas_width: state => state.canvas_width,
      canvas_height: state => state.canvas_height,
      project_m_comp: state => state.project_m_comp,
      user_type: state => state.user_type,
      tempId: state => state.tempId,
      // changeTitle: state => state.changeTitle,
      // changeSubtitle: state => state.changeSubtitle,
      // changeLogo: state => state.changeLogo,
      // changeMain: state => state.changeMain,
      // logoFileId: state => state.logoFileId,
      // mainFileId: state => state.mainFileId,
      token: state => state.token,
      mould_name: state => state.mould_name,
      structure_id: state => state.structure_id,
      user_data: state => state.user_data,
      new_structure_id: state => state.new_structure_id,
      structure_position: state => state.structure_position,
      api: state => state.api,
      ffName: function () {
        for (let item of this.edit_bar.fontFamily) {
          if (item.value == this.edit_bar.text.fontFamily) {
            return item.name
          }
        }
      }
    }),
    key_ctrlf: function () {
      let second = 91
      // 判断内核
      let u = navigator.userAgent
      if (u.indexOf('Trident') > -1) {
        // IE内核
      } else if (u.indexOf('Presto') > -1) {
        // opera内核
        second = 17
      } else if (u.indexOf('AppleWebKit') > -1) {
        // 苹果、谷歌内核
        second = 91
      } else if (u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1) {
        // 火狐内核
        second = 224
      }
      let ctrlf = this.keyboard(17, second)
      ctrlf.press = () => {}
      ctrlf.release = () => {}
      return ctrlf
    },
    key_zf: function () {
      const me = this
      let zf = this.keyboard(90)
      zf.press = () => {}
      zf.release = () => {}
      return zf
    },
    key_yf: function () {
      let yf = this.keyboard(89)
      yf.press = () => {}
      yf.release = () => {}
      return yf
    },
    right_block_ass: function () {
      if (this.right_block.menu.ass == 1 || this.right_block.menu.ass == 2) {
        return true
      } else {
        return false
      }
    },
    canvas_ratio_arr: function () {
      const me = this
      let m = me.canvas_width
      let n = me.canvas_height
      var arr = []
      var a = m
      var b = n
      a >= b ? ((a = m), (b = n)) : ((a = n), (b = m))
      if (m != 1 && n != 1) {
        for (var i = b; i >= 2; i--) {
          if (m % i == 0 && n % i == 0) {
            m = m / i
            n = n / i
          }
        }
      }
      arr[0] = m
      arr[1] = n
      return arr
    },
    mypixi: function () {
      return PIXI
    }
  },
  watch: {},
  beforeDestroy: function () {
    const me = this
    me.$store.dispatch('changeTempIdFunc', '')
    // 尝试解决，内存泄露
    // let pixi=document.getElementById("pixiCanvas")
    // document.getElementById("mainCanvas").removeChild(pixi);
    // me.key_zf = null;
    // me.key_yf = null;
    window.onresize = null
    bus
      .$off('add_element_func')
      .$off('layer_click')
      .$off('addPopShow')
      .$off('change_text')
      .$off('designer_save')
      .$off('client_save')
      .$off('change_in_move_image')
      .$off('canvasDestroy')
    me.p_app = null
    me.data = () => null
  },
  created: function () {
    const me = this
    this.p_app = new PIXI.Application({
      backgroundColor: 0xf5f5f5,
      width: me.window_w,
      height: me.window_h,
      antialias: 1
    })
    // 摧毁实例
    bus.$on('canvasDestroy', function () {
      me.$destroy()
    })
    // 清空，初始化数据
    bus.$on('add_element_func', function (data) {
      // 添加元素进canvas
      if (data.src !== '' && data.text == '') {
        me.newContainer(data, false, function () {
          me.updateLayer()
          // 存储进活动日志
          me.pushActiveLog(true)
        })
      } else if (data.src == '' && data.text !== '') {
        me.newContainerText(data, false)
        // 将元素加入图层tab
        me.updateLayer()
        // 存储进活动日志
        me.pushActiveLog(true)
      }
    })
    bus.$on('layer_click', function (id) {
      me.show_click(id)
    })
    bus.$on('addPopShow', function (show) {
      me.addPopShow(show)
    })
    bus.$on('change_text', function (text) {
      // 加载压缩字体
      let fontData = {
        user_id: me.user_data.id,
        font_name: me.in_move.style.fontFamily,
        text: text
      }
      me.loadCutFont(fontData)
        .then(function (res) {
          if (me.in_move.textReverse) {
            me.textReverse(text)
          } else {
            me.in_move.text = text
          }
          me.inMoveChangeBorder()
          me.moveStructureText()
          // 存储进活动日志
          me.pushActiveLog(true)
        })
        .catch(res => res)
    })
    bus.$on('designer_save', function (mould_name, link) {
      me.saveMould(mould_name, link)
    })
    bus.$on('client_save', function (mould_name, leave, link) {
      me.saveMould(mould_name, link, leave)
    })
    bus.$on('change_in_move_image', function (data) {
      me.changeInMoveImage(data)
    })
    bus.$off('recommendText').$on('recommendText', function (textarr) {
      me.recommendText(textarr)
    })
    bus.$off('editbarClose').$on('editbarClose', function () {
      me.$set(me.edit_bar.btn, 'show', false)
    })
    if (!window.localStorage.getItem('firstEdit')) {
      // 用户第一次打开编辑工具
      me.$set(me.edit_bar.btn, 'show', true)
    }
    // bus.$on("closeMouldFuncShow",function() {
    //   me.$set(me, 'mouldFuncShow', false)
    // })
    me.key_zf.press = function () {
      // 快捷键监听
      if (me.key_ctrlf.isDown && !me.key_ctrlf.isUp) {
        me.moveActiveLog('prev')
      }
    }
    me.key_yf.press = function () {
      // 快捷键监听
      if (me.key_ctrlf.isDown && !me.key_ctrlf.isUp) {
        me.moveActiveLog('next')
      }
    }
    window.onresize = function () {
      me.resetCanvas()
    }
    setTimeout(() => {
      if (me.tempId || me.structure_id) {
        me.getTemplateData()
      } else {
        me.initPixiApp()
      }
    }, 200)
  },
  methods: {
    recommendText: function (arr) {
      other_func.recommendText.bind(this)(arr)
    },
    handleCommand: function (items) {
      other_func.handleCommand.bind(this)(items[0], items[1])
    },
    updateTextPosition: function (arr) {
      other_func.updateTextPosition.bind(this)(arr)
    },
    setReplaceText: function () {
      other_func.setReplaceText.bind(this)()
    },
    setSkew: function () {
      const me = this
      me.in_move.skew.set(-0.5, 0)
    },
    changeHue: function (value) {
      const me = this
      me.in_move.hueNumber = value
      value *= 360
      let filter = new PIXI.filters.ColorMatrixFilter()
      filter.hue(value, true)
      me.in_move.filters = [filter]
      // 存储进活动日志
      me.pushActiveLog(true)
    },
    dynamicLoadCss: function (url) {
      var head = document.getElementsByTagName('head')[0]
      var link = document.createElement('link')
      link.type = 'text/css'
      link.rel = 'stylesheet'
      link.href = url
      head.appendChild(link)
    },
    getCssWoff: function (cssPath, woffPath) {
      const me = this
      return [
        axios({
          headers: {
            Accept: 'text/css,*/*;q=0.1'
          },
          method: 'get',
          url: `${me.api.file_path}${cssPath}`,
          responseType: 'ms-stream'
        }),
        axios({
          method: 'get',
          url: `${me.api.file_path}${woffPath}`,
          responseType: 'ms-stream'
        })
      ]
    },
    loadCutFont: function (data) {
      // 加载压缩字体包的请求
      const me = this
      return new Promise(function (resolve, reject) {
        if (data.font_name == 'st') {
          resolve('st')
        }
        axios({
          method: 'post',
          url: me.api.cutFont,
          data: data
        })
          .then(function (res) {
            res = res.data
            if (res.code == 1) {
              // 加载css和字体文件用于缓存
              axios
                .all(me.getCssWoff(res.path, res.woffPath))
                .then(function (response) {
                  // 下方的linkcss，以及字体的加载读缓存就好了。
                  me.dynamicLoadCss(me.api.file_path + res.path)
                  setTimeout(() => {
                    resolve(res)
                  }, 50)
                })
                .catch(res => {})
              // 需要判断css有没有加载完毕
            } else {
              reject(res)
            }
          })
          .catch(function (err) {
            reject(err)
          })
      })
    },
    setRole: function (content) {
      other_func.setRole.bind(this)(content)
    },
    setPosition: function (num) {
      other_func.setPosition.bind(this)(num)
    },
    getNewFont: function (fontName, text) {},
    mouldImg: function () {
      const me = this
      me.cancelInMove()
      // me.downloadImg(me.p_app.renderer.plugins.extract.base64(me.p_app.stage))
      return me.ClippingImage(me.p_app.renderer.plugins.extract.base64(me.p_app.stage), me.canvas_width, me.canvas_height, 0.92, function (
        base64Result
      ) {
        return base64Result
      })
    },
    ClippingImage: function (base64Codes, width, height, quality, callback) {
      const me = this
      var img = new Image()
      img.src = base64Codes
      // 生成canvas
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      var createw = document.createAttribute('width')
      var createh = document.createAttribute('height')
      createw.nodeValue = width
      createh.nodeValue = height
      canvas.setAttributeNode(createh)
      canvas.setAttributeNode(createw)
      img.onload = function () {
        ctx.drawImage(img, (me.window_w - me.canvas_width) / 2, (me.window_h - me.canvas_height) / 2, width, height, 0, 0, width, height)
        var base64Result = canvas.toDataURL('image/jpeg', quality)
        callback(base64Result)
      }
    },
    saveMould: function (mould_name, link, leave = false) {
      const me = this
      // 保存模板，第一步保存个个元素或组合为素材（图片组合需要生成预览图），第二步将所有素材id上传保存成新模板
      let last = _.cloneDeep(me.active_log[me.active_log.length - 1])
      let material_data = []
      me.getMaterialData(last)
        .then(function (res) {
          let material_data = res
          me.uploadMaterial(mould_name, material_data, link, leave)
        })
        .catch(res => {
          console.log(res)
          bus.$emit('saveError')
        })
    },
    getMaterialData: function (last) {
      const me = this
      let allArr = []
      for (let i = 0; i < last.length; i++) {
        allArr.push(me.getMd(last[i]))
      }
      return Promise.all(allArr)
    },
    getMd: function (last) {
      const me = this
      return new Promise(function (resolve, reject) {
        let material_children = {}
        if (last.children[0].ass_children.length == 1) {
          // 单个图片或者文字
          if (last.children[0].ass_children[0].type == 'image') {
            material_children.material_type = 'img'
            material_children.file_id = me.json_f([parseInt(last.children[0].ass_children[0].file_id)])
            material_children.author = me.user_data.id
            material_children.preview = parseInt(last.children[0].ass_children[0].file_id)
            material_children.content = me.json_f(last)
          } else if (last.children[0].ass_children[0].type == 'text') {
            material_children['material_type'] = 'text'
            material_children['author'] = me.user_data.id
            material_children['dimension_id'] = 0
            material_children['content'] = me.json_f(last)
            material_children['text_content'] = last.children[0].ass_children[0].text
          }
          resolve(material_children)
        } else if (last.children[0].ass_children.length > 1) {
          let file_id = []
          for (let k = 0; k < last.children[0].ass_children.length; k++) {
            if (last.children[0].ass_children[k].type == 'image') {
              file_id.push(last.children[0].ass_children[k].file_id)
            }
          }
          material_children.material_type = 'whole'
          material_children.file_id = me.json_f(file_id)
          material_children.author = me.user_data.id
          // idToimg,上传组合预览图
          me.addACtrlarr(file_id[0])
          let file = me.toImage(true)
          let formdata = new FormData()
          formdata.append('upload_file_once', file)
          axios({
            method: 'post',
            url: `${me.api.upload_file_once}1.html`,
            data: formdata
          })
            .then(function (response) {
              material_children.preview = response.data.data.file_id
              material_children.content = me.json_f(last)
              resolve(material_children)
            })
            .catch(function (error) {
              reject(error)
            })
        }
      })
    },
    uploadMaterial: function (mould_name, material_data, link, leave) {
      const me = this
      // 上传素材
      let material_id = []
      let material_id_obj = {}
      me.uploadAllMaterial(material_data)
        .then(function (res) {
          // 获取元素id，用于上传模板
          for (let i = 0; i < res.length; i++) {
            material_id.push(parseInt(res[i].data.data.materialId))
          }
          me.uploadTemp(mould_name, material_id, link, leave)
        })
        .catch(function (res) {
          console.log(res)
          bus.$emit('saveError')
        })
    },
    renderARCF: function () {
      // 编辑模板或者保存新模板时渲染弧形文字，为了预览图
      const me = this
      if (me.arc_obj.arc_title != '' && me.arc_obj.arc_titleImg != '' && me.user_type == 'designer') {
        let wordArr = me.arc_obj.arc_title.text.split('')
        me.renderARC('arc_title', wordArr)
      }
      if (me.arc_obj.arc_subtitle != '' && me.arc_obj.arc_subtitleImg != '' && me.user_type == 'designer') {
        let wordArr = me.arc_obj.arc_subtitle.text.split('')
        me.renderARC('arc_subtitle', wordArr)
      }
    },
    deleteARCF: function () {
      const me = this
      // 刚添加的弧形文字，渲染后立刻删除
      let len = 0
      if (me.arc_obj.arc_title != '' && me.arc_obj.arc_titleImg != '' && me.user_type == 'designer') {
        let wordArr = me.arc_obj.arc_title.text.split('')
        len += wordArr.length
      }
      if (me.arc_obj.arc_subtitle != '' && me.arc_obj.arc_subtitleImg != '' && me.user_type == 'designer') {
        let wordArr = me.arc_obj.arc_subtitle.text.split('')
        len += wordArr.length
      }
      // 依据弧形文字的字数，删除图层
      let c_len = _.cloneDeep(me.container_arr.length)
      me.container_arr.splice(c_len - len, len)
      for (let i = 0; i < len; i++) {
        me.mainStage_container.removeChildAt(c_len - len + 1)
      }
      me.renderStage()
      // 删除结束
    },
    uploadTemp: function (mould_name, material_id, link, leave) {
      const me = this
      // 上传模板
      me.cancelInMove()

      // 上传模板预览图文件,如果有弧形文字，需要渲染出来形成图片，但不保存进模板数据
      // 判断有没有弧形文字，渲染弧形文字******************************************************************************************************************************
      let beforeAlpha = 1
      let subBeforeAlpha = 1
      // 标题先隐藏，生成图片后显示
      me.renderARCF()
      if (me.arc_obj.title_obj != null) {
        beforeAlpha = _.cloneDeep(me.arc_obj.title_obj.alpha)
        me.arc_obj.title_obj.alpha = 0
      }
      if (me.arc_obj.subtitle_obj != null) {
        subBeforeAlpha = _.cloneDeep(me.arc_obj.subtitle_obj.alpha)
        me.arc_obj.subtitle_obj.alpha = 0
      }

      // 判断有没有弧形文字，渲染弧形文字****************************************************************************************************************************
      //
      let img = null
      setTimeout(function () {
        me.ClippingImage(me.p_app.renderer.plugins.extract.base64(me.p_app.stage), me.canvas_width, me.canvas_height, 0.52, function (base64Result) {
          img = base64Result
          // me.downloadImg(img);
          // 如果有"弧形标题（直的）"，则显示回来
          if (me.arc_obj.title_obj != null) {
            me.arc_obj.title_obj.alpha = beforeAlpha
          }
          if (me.arc_obj.subtitle_obj != null) {
            me.arc_obj.subtitle_obj.alpha = subBeforeAlpha
          }
          me.deleteARCF()
          // 图片转文件， 上传文件， 拿回文件id
          img = me.dataURLtoFile(img, 'mould.jpg')
          let formdata = new FormData()
          formdata.append('upload_file_once', img)
          me.uploadImgF(formdata, me.axiosTempF, {
            material_id: material_id,
            mould_name: mould_name,
            link: link,
            leave: leave
          })
        })
      }, 400)
    },
    axiosTempF: function (response, funcData) {
      const me = this
      let preview = response.data.data.file_id
      let level = ''
      // 分为用户模板保存，设计师模板保存，渲染临时模板保存
      let tempData = {
        preview: preview,
        author: me.user_data.id,
        material_content: me.json_f(funcData.material_id),
        name: funcData.mould_name,
        id: '',
        t_width: me.canvas_width,
        t_height: me.canvas_height,
        level: level,
        has_product: 0,
        has_logo: 0,
        has_title: 0,
        has_subtitle: 0,
        condition: 1,
        father_id: ''
      }
      if (me.user_type == 'client') {
        if (me.thisTempLevel == 'storage') {
          id = parseInt(me.tempId)
        }
        tempData.level = 'storage'
        // 用户修改的模板绑定根id
        tempData.father_id = me.father_id
      } else if (me.user_type == 'designer') {
        tempData.author = me.user_data.id
        if (me.tempId) tempData.id = parseInt(me.tempId)
        tempData.level = 'permanent'
        // 新增骨架专属模板
        if (me.new_structure_id) {
          tempData.condition = 2
          tempData.framework_id = me.new_structure_id
        }
      }
      // if (me.user_type == 'render' && me.token) {
      //   tempData.level = 'temporary'
      //   tempData.id = parseInt(me.tempId)
      //   tempData.token = me.token
      //   upload_temp_url = 'http://dev.cyrd.gdinsight.com/api/template/auto_upload_template.html'
      // }
      if (me.tempRoleMsg.main > 0) tempData.has_product = 1
      if (me.tempRoleMsg.logo > 0) tempData.has_logo = 1
      if (me.tempRoleMsg.title > 0) tempData.has_title = 1
      if (me.tempRoleMsg.subtitle > 0) tempData.has_subtitle = 1
      // 有素材集，模板预览图id，模板名称，用户id，可以真正上传模板了
      axios({
        method: 'post',
        url: me.api.upload_template,
        data: tempData
      })
        .then(function (response) {
          if (me.user_type == 'designer') {
            bus.$emit('designerSave')
            // 如果是骨架专属模板保存成功则清除骨架id
            if (me.new_structure_id) {
              me.$store.dispatch('changeNewStructureIdFunc', '')
            }
            // 如果是新建模板，要保存文案规则
            if (tempData.level === 'permanent' && me.textPositionArr.length > 0 && me.saveTextRule) {
              axios({
                method: 'post',
                url: me.api.add_word_rule,
                data: {
                  template_id: parseInt(response.data.data.templateId),
                  rule: me.textPositionArr
                }
              }).then(res => {
                console.log('成功保存文案规则')
              })
            }
          } else if (me.user_type == 'client') {
            me.$store.dispatch('changeTempIdFunc', parseInt(response.data.data.templateId))
            bus.$emit('clientSave')
            if (funcData.leave) {
              // 跳转
              setTimeout(() => {
                window.location.href = funcData.link
              }, 500)
            }
          }
        })
        .catch(function () {
          bus.$emit('saveError')
        })
    },
    uploadImgF: function (formdata, wantF, funcData) {
      // 上传图片功能函数，formdata为图片表单，wanF为回调执行方法，funcData为回调传入的函数
      const me = this
      return axios({
        method: 'post',
        url: `${me.api.upload_file_once}1.html`,
        data: formdata
      })
        .then(function (response) {
          wantF.bind(me)(response, funcData)
        })
        .catch(function (error) {
          console.log(error)
          bus.$emit('saveError')
        })
    },
    uploadMF: function (data) {
      const me = this
      return axios.post(me.api.upload_material, data)
    },
    uploadAllMaterial: function (material_data) {
      // 上传全部素材返回素材id，有组合的为一个素材（建议设计师不要使用组合）
      const me = this
      let allArr = []
      for (let i = 0; i < material_data.length; i++) {
        allArr.push(me.uploadMF(material_data[i]))
      }
      return Promise.all(allArr)
    },
    json_f: function (obj) {
      return other_func.json_f.bind(this)(obj)
    },
    obj_f: function (json) {
      return other_func.obj_f.bind(this)(json)
    },
    renderTemplate: function (firstLoad = false) {
      const me = this
      container_func.renderTemplate.bind(me)(firstLoad)
    },
    afterLoad: function (data, firstLoad) {
      container_func.afterLoad.bind(this)(data, firstLoad)
    },
    initPixiApp: function () {
      const me = this
      // 加载一些必要的配图
      me.p_app.loader.add([me.scale, me.rotate, me.stretch]).load(function () {
        me.p_app.view.id = 'pixiCanvas'
        document.getElementById('mainCanvas').appendChild(me.p_app.view)
        me.p_app.view.style.width = me.window_w + 'px'
        me.p_app.view.style.height = me.window_h + 'px'
        me.p_app.stage.off().on('mousedown', me.cancel_something)
        // 创建主内容容器，包含所有内容，固定尺寸，container_arr作为其子元素
        let mainStage = new PIXI.Container()
        mainStage.width = me.canvas_width
        mainStage.height = me.canvas_height
        mainStage.position.set((me.window_w - me.canvas_width) / 2, (me.window_h - me.canvas_height) / 2)
        mainStage.accessible = true
        me.mainStage_container = mainStage
        me.p_app.stage.addChild(me.mainStage_container)
        // 增加遮罩,遮罩加在stage
        me.maskInit()
        // 增加标尺加在stage
        me.ruler()
        me.resetCanvas()
        if (me.tempId || me.structure_id) {
          me.renderTemplate(true)
        }
        mainStage = null
      })
    },
    getTemplateData: function () {
      const me = this
      if (me.tempId) {
        let tempId = parseInt(me.tempId)
        axios({
          method: 'post',
          url: `${me.api.template}${tempId}.html`,
          data: {
            condition: 1
          }
        })
          .then(function (response) {
            let render_data = []
            for (let i = 0; i < response.data.data.material_content.length; i++) {
              if (response.data.data.material_content[i].content) {
                render_data.push(me.obj_f(response.data.data.material_content[i].content))
              }
            }
            // render_data = render_data.reverse();
            me.$set(me, 'render_data', render_data)
            // 设置模板宽高，名字
            me.$store.dispatch('setCanvasFunc', [response.data.data.template_width, response.data.data.template_height])
            me.$store.dispatch('ChangeRenderFunc', {
              key: 'mould_name',
              value: response.data.data.template_name
            })
            // 获取模板level，判断是否是设计师或者用户模板
            me.thisTempLevel = response.data.data.level
            // 获取模板根ID,获取推荐文案
            me.father_id = response.data.data.father_id
            bus.$emit('getRecommend', me.father_id)
            if (response.data.data.rule && response.data.data.rule.length > 0) {
              let textPosition = []
              for (let item of response.data.data.rule) {
                textPosition.push(item.rule_name)
              }
              me.$set(me, 'textPositionArr', textPosition)
            }
            me.initPixiApp()
          })
          .catch(function (error) {
            console.log(error)
          })
      } else if (me.structure_id) {
        // 骨架A：
        // me.$store.dispatch("setCanvasFunc", [750, 1334])
        // let r_data = [{
        //   m_comp_name: 'product',
        //   z_index: 1,
        //   children: [{
        //     ass_children: [{
        //       src: '',
        //       type: 'text',
        //       id: 'text123',
        //       m_comp_name: 'product',
        //       rotation: 0,
        //       scale: 1,
        //       position: {
        //         x: 200,
        //         y: 100
        //       },
        //       structure: me.structure_id,
        //       text: '请输入主标题',
        //       style: {
        //         fontFamily: '思源黑体',
        //         fontSize: 50,
        //         lineHeight: 50,
        //         leading: 0,
        //         fontStyle: 'normal',
        //         fontWeight: 'normal',
        //         fill: '#000',
        //         stroke: '#000',
        //         strokeThickness: 0,
        //         dropShadow: false,
        //         dropShadowColor: '#000000',
        //         dropShadowAngle: Math.PI / 6,
        //         dropShadowBlur: 0,
        //         dropShadowDistance: 18,
        //         wordWrap: true,
        //         wordWrapWidth: 700,
        //         breakWords: true,
        //         padding: 0,
        //         textBaseline: 'Middle',
        //         trim: true,
        //         whiteSpace: 'pre'
        //       },
        //       alpha: 1,
        //       role: 'title'
        //     }],
        //     association_id: ''
        //   }]
        // }, {
        //   m_comp_name: 'product',
        //   z_index: 1,
        //   children: [{
        //     ass_children: [{
        //       src: '',
        //       type: 'text',
        //       id: 'text563',
        //       m_comp_name: 'product',
        //       rotation: 0,
        //       scale: 1,
        //       position: {
        //         x: 200,
        //         y: 175
        //       },
        //       structure: me.structure_id,
        //       text: '请输入副标题',
        //       style: {
        //         fontFamily: '思源黑体',
        //         fontSize: 30,
        //         lineHeight: 30,
        //         leading: 0,
        //         fontStyle: 'normal',
        //         fontWeight: 'normal',
        //         fill: '#000',
        //         stroke: '#000',
        //         strokeThickness: 0,
        //         dropShadow: false,
        //         dropShadowColor: '#000000',
        //         dropShadowAngle: Math.PI / 6,
        //         dropShadowBlur: 0,
        //         dropShadowDistance: 18,
        //         wordWrap: true,
        //         wordWrapWidth: 700,
        //         breakWords: true,
        //         padding: 0,
        //         textBaseline: 'Middle',
        //         trim: true,
        //         whiteSpace: 'pre'
        //       },
        //       alpha: 1,
        //       role: 'subtitle'
        //     }],
        //     association_id: ''
        //   }]
        // }]
        // me.$set(me, 'render_data', r_data)
        // me.initPixiApp()
      }
    },
    resetCanvas: function () {
      other_func.resetCanvas.bind(this)()
    },
    pushActiveLog: function (permit = false) {
      other_func.pushActiveLog.bind(this)(permit)
    },
    renderStage: function () {
      const me = this
      container_func.renderStage.bind(me)()
    },
    addCancleRect: function (mainStage) {
      container_func.addCancleRect.bind(this)(mainStage)
    },
    outLine: function () {
      container_func.outLine.bind(this)()
    },
    maskInit: function () {
      container_func.maskInit.bind(this)()
    },
    cancelInMove: function () {
      container_func.cancelInMove.bind(this)()
    },
    cancel_something: function (event) {
      const me = this
      me.$set(me.right_block, 'show', false)
    },
    hide_edit_f: function () {
      const me = this
      // 隐藏编辑面板按钮里的功能面板
      for (let key in me.edit_bar) {
        if (key.startsWith('edit_')) {
          me.edit_bar[key] = false
        }
      }
      // me.$set(me.edit_bar, "edit_opacity", false);
      // me.$set(me.edit_bar, "edit_location", false);
      // me.$set(me.edit_bar, "edit_rotation", false);
      // me.$set(me.edit_bar, "edit_text", false);
      // me.$set(me.edit_bar, "edit_layer", false);
      // me.$set(me.edit_bar, "edit_color", false);
      // me.$set(me.edit_bar, "edit_align", false);
      // me.$set(me.edit_bar, "edit_shadow", false);
      // me.$set(me.edit_bar, "edit_fontFamily_select", false);
      // me.$set(me.edit_bar, "edit_skew", false);
    },
    showEdit: function (type) {
      const me = this
      let edit_btn = {}
      me.hide_edit_f()
      if (me.in_move && me.in_move.type == 'text' && me.in_move.structure) {
        type = 'structure_text'
      }
      switch (type) {
        case 'image':
          edit_btn = {
            show: true,
            text: false,
            location: true,
            rotation: true,
            opacity: true,
            updown: true,
            delete: true,
            color: false,
            align: false,
            shadow: false,
            edit: false,
            change_image: true,
            skew: true,
            hue: true
          }
          break
        case 'text':
          edit_btn = {
            show: true,
            text: true,
            location: true,
            rotation: true,
            opacity: true,
            updown: true,
            delete: true,
            color: true,
            align: true,
            shadow: true,
            edit: true,
            change_image: false,
            skew: true,
            hue: true
          }
          break
        case 'structure_text':
          edit_btn = {
            show: true,
            text: true,
            location: false,
            rotation: false,
            opacity: true,
            updown: true,
            delete: false,
            color: true,
            align: false,
            shadow: true,
            edit: true,
            change_image: false,
            skew: false
          }
          break
        case 'temporary':
          edit_btn = {
            show: true,
            text: false,
            location: true,
            rotation: true,
            opacity: false,
            updown: false,
            delete: true,
            color: false,
            align: false,
            shadow: false,
            edit: false,
            change_image: false,
            skew: false
          }
          break
        case 'association':
          edit_btn = {
            show: true,
            text: false,
            location: true,
            rotation: false,
            opacity: false,
            updown: true,
            delete: true,
            color: false,
            align: false,
            shadow: false,
            edit: false,
            change_image: false,
            skew: false
          }
          break
        case 'image_in':
          edit_btn = {
            show: true,
            text: false,
            location: true,
            rotation: true,
            opacity: true,
            updown: false,
            delete: false,
            color: false,
            align: false,
            shadow: false,
            edit: false,
            change_image: true,
            skew: true,
            hue: true
          }
          break
        case 'text_in':
          edit_btn = {
            show: true,
            text: true,
            location: true,
            rotation: true,
            opacity: true,
            updown: false,
            delete: false,
            color: true,
            align: true,
            shadow: true,
            edit: true,
            change_image: false,
            skew: true,
            hue: true
          }
          break
      }
      me.change_edit_bar(edit_btn)
      me.updateLayer()
    },
    change_edit_bar: function (data) {
      const me = this
      for (let key in me.edit_bar.btn) {
        me.$set(me.edit_bar.btn, key, data[key])
      }
    },
    showEditLocation: function () {
      const me = this
      me.hide_edit_f()
      me.$set(me.edit_bar, 'edit_location', true)
    },
    showEditAlign: function () {
      const me = this
      me.hide_edit_f()
      me.$set(me.edit_bar, 'edit_align', true)
    },
    show_text_block: function () {
      const me = this
      me.hide_edit_f()
      me.updateText()
      me.$set(me.edit_bar, 'edit_text', true)
    },
    updateText: function () {
      const me = this
      let text_data = {
        fontSize: Math.floor(me.in_move.style.fontSize),
        leading: me.in_move.style.leading,
        letterSpacing: me.in_move.style.letterSpacing,
        fontStyle: me.in_move.style.fontStyle,
        fontWeight: me.in_move.style.fontWeight,
        color: me.in_move.style.fill,
        fontFamily: me.in_move.style.fontFamily,
        align: me.in_move.style.align,
        dropShadow: me.in_move.style.dropShadow,
        dropShadowColor: me.in_move.style.dropShadowColor,
        dropShadowBlur: me.in_move.style.dropShadowBlur,
        dropShadowDistance: me.in_move.style.dropShadowDistance
      }
      me.$set(me.edit_bar, 'text', text_data)
    },
    fontFamily_change: function (value) {
      const me = this
      if (value == me.in_move.style.fontFamily) return false
      if (value == 'st') {
        me.in_move.style.fontFamily = value
        me.$set(me.edit_bar, 'edit_fontFamily_select', false)
        me.updateText()
        // 存储进活动日志
        me.pushActiveLog(true)
        return false
      }
      let fontData = {
        user_id: me.user_data.id,
        font_name: value,
        text: me.in_move.text
      }
      me.loadCutFont(fontData)
        .then(function (res) {
          me.in_move.style.fontFamily = value
          me.$set(me.edit_bar, 'edit_fontFamily_select', false)
          me.updateText()
          me.updateLayer()
          // 存储进活动日志
          me.pushActiveLog(true)
        })
        .catch(res => res)
    },
    showFontFamily: function () {
      const me = this
      me.$set(me.edit_bar, 'edit_fontFamily_select', true)
    },
    fontSize_change: function (value) {
      value = parseInt(value)
      const me = this
      // start
      let num = me.in_move.width / me.in_move.style.fontSize
      me.in_move.text_num = num
      // move
      let style = me.in_move.style
      style.wordWrapWidth = num * value
      if (me.in_move.style.fontStyle == 'normal') {
        style.wordWrapWidth += style.fontSize * 0.2
      }
      me.in_move.style = style
      me.in_move.style.fontSize = value
      // me.in_move.style.lineHeight = me.in_move.style.fontSize + me.in_move.lineHeightM;
      // me.p_app.renderer.render(me.in_move);
      //
      me.containerLine(me.in_move, false)
      me.scaleTextEnd(me.in_move)
      // 存储进活动日志
      me.pushActiveLog(true)
    },
    alignChange: function (value) {
      const me = this
      me.in_move.style.align = value
      // 存储进活动日志
      me.pushActiveLog(true)
    },
    fontStyle_change: function (value) {
      const me = this
      if (value) {
        me.in_move.style.fontStyle = 'italic'
        me.$set(me.edit_bar.text, 'fontStyle', 'italic')
      } else {
        me.in_move.style.fontStyle = 'normal'
        me.$set(me.edit_bar.text, 'fontStyle', 'normal')
      }
      // 存储进活动日志
      me.pushActiveLog(true)
    },
    fontWeightChange: function (value) {
      const me = this
      if (value) {
        me.in_move.style.fontWeight = 'bolder'
        me.$set(me.edit_bar.text, 'fontWeight', 'bolder')
      } else {
        me.in_move.style.fontWeight = 'normal'
        me.$set(me.edit_bar.text, 'fontWeight', 'normal')
      }
      // 存储进活动日志
      me.pushActiveLog(true)
    },
    leading_change: function (value) {
      value = parseInt(value)
      const me = this
      me.in_move.style.leading = value
      me.containerLine(me.in_move, false)
      // 存储进活动日志
      me.pushActiveLog(true)
    },
    letterSpacing_change: function (value) {
      value = parseInt(value)
      const me = this
      me.in_move.style.letterSpacing = value
      me.containerLine(me.in_move, false)
      // 存储进活动日志
      me.pushActiveLog(true)
    },
    fontColor_change: function (value) {
      const me = this
      me.in_move.style.fill = value
      // 存储进活动日志
      me.pushActiveLog(true)
    },
    dropShadow: function (value) {
      const me = this
      me.in_move.style.dropShadow = value
      me.inMoveChangeBorder()
      me.updateLayer()
      // 存储进活动日志
      me.pushActiveLog(true)
    },
    inMoveChangeBorder: function () {
      // 单个元素改变边框
      const me = this
      if ((me.ctrl_arr && me.ctrl_arr.length == 0) || !me.ctrl_arr) {
        me.containerLine(me.in_move, false)
      } else if (me.ctrl_arr && me.ctrl_arr.length > 0) {
        me.aSingleClickBorder(me.in_move.association_name)
      }
    },
    dropShadowColorChange: function (value) {
      const me = this
      let color = me.colorRGB2Hex(value)
      me.in_move.style.dropShadowColor = color
      me.updateLayer()
      // 存储进活动日志
      me.pushActiveLog(true)
    },
    colorRGB2Hex: function (color) {
      var rgb = color.split(',')
      var r = parseInt(rgb[0].split('(')[1])
      var g = parseInt(rgb[1])
      var b = parseInt(rgb[2].split(')')[0])
      var hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
      return hex
    },
    dropShadowBlurChange: function (value) {
      const me = this
      me.in_move.style.dropShadowBlur = value
      me.containerLine(me.in_move, false)
      // 存储进活动日志
      me.pushActiveLog(true)
    },
    dropShadowDistanceChange: function (value) {
      const me = this
      me.in_move.style.dropShadowDistance = value
      me.containerLine(me.in_move, false)
      // 存储进活动日志
      me.pushActiveLog(true)
    },
    onEdit: function () {
      const me = this
      me.hide_edit_f()
      me.$set(me.right_block, 'show', false)
      me.$set(me, 'addPop', true)
      bus.$emit('text_edit_mode', me.in_move.text)
    },
    show_opacity_block: function () {
      const me = this
      me.hide_edit_f()
      me.$set(me.edit_bar, 'opacity', me.in_move.alpha * 100)
      me.$set(me.edit_bar, 'edit_opacity', true)
    },
    show_hue_block: function () {
      const me = this
      me.hide_edit_f()
      me.edit_bar.hue = me.in_move.hueNumber
      me.$set(me.edit_bar, 'edit_hue', true)
    },
    showLayerBlock: function () {
      const me = this
      me.hide_edit_f()
      me.$set(me.edit_bar, 'edit_layer', true)
    },
    opacity_change: function (value) {
      const me = this
      me.in_move.alpha = value / 100
      // 存储进活动日志
      me.pushActiveLog(true)
    },
    show_rotation_block: function () {
      // 初始化旋转值，和in_move一样或者和临时组合、组合一样
      const me = this
      me.hide_edit_f()
      if (me.in_move && !me.temporary_rect) {
        me.$set(me.edit_bar, 'rotation', Math.floor((me.in_move.rotation * 180) / Math.PI))
      } else if (me.temporary_rect) {
        me.$set(me.edit_bar, 'rotation', Math.floor((me.temporary_rect.rotation * 180) / Math.PI))
      }
      me.$set(me.edit_bar, 'edit_rotation', true)
    },
    show_skew_block: function () {
      const me = this
      me.hide_edit_f()
      me.$set(me.edit_bar, 'skewX', me.in_move.skew.x)
      me.$set(me.edit_bar, 'skewY', me.in_move.skew.y)
      me.$set(me.edit_bar, 'edit_skew', true)
    },
    showColorBlock: function () {
      const me = this
      me.hide_edit_f()
      me.updateText()
      me.$set(me.edit_bar, 'edit_color', true)
    },
    showEditShadow: function () {
      const me = this
      me.hide_edit_f()
      me.updateText()
      me.$set(me.edit_bar, 'edit_shadow', true)
    },
    rotationChange: function (value) {
      const me = this
      if (me.in_move && !me.temporary_rect) {
        me.in_move.rotation = (value * Math.PI) / 180
        me.outLine_container.getChildByName(me.in_move.name).rotation = (value * Math.PI) / 180
        setTimeout(() => {
          if (me.in_move.association_name !== '') {
            me.aSingleClickBorder(me.in_move.association_name)
          }
        }, 25)
      } else if (me.temporary_rect) {
        me.onTRotateStart()
        if (value > 0) {
          me.tRotateOBj((value * Math.PI) / 180, 10000)
        } else {
          me.tRotateOBj((-value * Math.PI) / 180, -10000)
        }
        me.onTRotateEnd()
      } else if (!me.temporary_rect && me.ctrl_arr.length > 0) {
        // 组合旋转
      }
      // 存储进活动日志
      me.pushActiveLog(true)
    },
    skewChange: function (xy) {
      const me = this
      let [x, y] = xy === 'x' ? [me.edit_bar.skewX, me.in_move.skew.y] : [me.in_move.skew.x, me.edit_bar.skewY]
      me.in_move.skew.set(x, y)
    },
    locationMove: function (way, d_value = 0) {
      other_func.locationMove.bind(this)(way, d_value)
    },
    newContainer: function (set_data, render_add, func = () => {}) {
      container_func.newContainer.bind(this)(set_data, render_add, func)
    },
    addContainer: function (set_data, position = { x: this.canvas_width / 2, y: this.canvas_height / 2 }) {
      container_func.addContainer.bind(this)(set_data, position)
    },
    containerArrAdd: function (m_comp_name, container, id) {
      container_func.containerArrAdd.bind(this)(m_comp_name, container, id)
    },
    findFinalIndex: function (m_comp_name) {
      // 递归函数好像放不进container_func
      const me = this
      let final_index = -100 // 相同模块中最后一个元素的index
      let len = me.project_m_comp.length - 1
      if (me.container_arr.length == 0) {
        final_index = 0
        return final_index
      } else if (me.project_m_comp[0].name == m_comp_name && me.container_arr.length > 0) {
        final_index = me.container_arr.length - 1
        return final_index
      } else {
        me.container_arr.map(function (value, index, array) {
          if (value.m_comp_name == m_comp_name) {
            final_index = index
          }
        })
        if (final_index == -100) {
          if (me.project_m_comp[len].name == m_comp_name) {
            return (final_index = -1)
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
    loadSprite: function (set_data, render_add, func) {
      container_func.loadSprite.bind(this)(set_data, render_add, func)
    },
    loadSvgImg: function (src, sprite, my_set_data, render_add, func) {
      container_func.loadSvgImg.bind(this)(src, sprite, my_set_data, render_add, func)
    },
    addImg: function (sprite, set_data, render_add) {
      container_func.addImg.bind(this)(sprite, set_data, render_add)
    },
    updateSvgScale: function (obj) {
      element_func.updateSvgScale.bind(this)(obj)
    },
    newContainerText: function (set_data, render_add, saveLog = true) {
      container_func.newContainerText.bind(this)(set_data, render_add, saveLog)
    },
    addText: function (set_data, render_add, saveLog) {
      container_func.addText.bind(this)(set_data, render_add, saveLog)
    },
    ruler: function () {
      container_func.ruler.bind(this)()
    },
    containerLine: function (obj, t_a, a_r_btn = false, color = 0x87ceff, lock = false) {
      container_func.containerLine.bind(this)(obj, t_a, a_r_btn, color, lock)
    },
    createBorder: function (obj, t_a, a_r_btn, show_btn = true, color = 0x87ceff) {
      container_func.createBorder.bind(this)(obj, t_a, a_r_btn, show_btn, color)
    },
    addScaleIcon: function (outLineC, obj, t_a, a_r_btn = false) {
      container_func.addScaleIcon.bind(this)(outLineC, obj, t_a, a_r_btn)
    },
    addRotateIcon: function (outLineC, obj, t_a, a_r_btn = false) {
      container_func.addRotateIcon.bind(this)(outLineC, obj, t_a, a_r_btn)
    },
    addStretchIcon: function (outLineC, obj) {
      container_func.addStretchIcon.bind(this)(outLineC, obj)
    },
    onRightC: function (event) {
      element_func.onRightC.bind(this)(event)
    },
    onRightFunc: function (f_parm, event = null) {
      const me = this
      if (f_parm.type == 1) {
        // 类型1 为单个元素的删除功能,模拟单个元素点击
        me.normalStart(f_parm.currentTarget, f_parm.data)
        f_parm.currentTarget.dragging = false
        me.$set(me.right_block.menu, 'ass', 3) // 没有组合功能
        me.$set(me.right_block, 'delete_type', 1) // 设置成单个元素的删除
        me.$set(me.right_block.menu, 'change', false)
        me.$set(me.right_block.menu, 'edit_text', false)
        if (f_parm.currentTarget.type == 'image') {
          // 更换图片功能
          me.$set(me.right_block.menu, 'change', true)
        } else if (f_parm.currentTarget.type == 'text') {
          me.$set(me.right_block.menu, 'edit_text', true)
        }
        // 锁定解锁功能判断
        me.$set(me.right_block.menu, 'show_lock', true)
        if (!f_parm.currentTarget.lock) {
          me.$set(me.right_block.menu, 'lock', false)
          me.$set(me.right_block, 'lock_text', '锁定')
        } else {
          me.$set(me.right_block.menu, 'lock', true)
          me.$set(me.right_block, 'unlock_text', '解锁')
          me.containerLine(f_parm.currentTarget, false, false, '#D62B25', true)
        }
      } else if (f_parm.type == 2) {
        // 类型2 为临时组合的删除功能
        me.$set(me.right_block.menu, 'change', false)
        me.$set(me.right_block.menu, 'edit_text', false)
        me.$set(me.right_block.menu, 'ass', 1)
        me.$set(me.right_block, 'delete_type', 2) // 设置成临时组合的删除
        me.$set(me.right_block.menu, 'show_lock', false)
      } else if (f_parm.type == 3) {
        // 类型3 为组合的删除功能，模拟组合点击
        me.onAssociationStart(event, true)
        me.$set(me.right_block.menu, 'ass', 2)
        me.$set(me.right_block.menu, 'change', false)
        me.$set(me.right_block.menu, 'edit_text', false)
        // 锁定解锁功能判断
        me.$set(me.right_block.menu, 'show_lock', true)
        if (!event.currentTarget.lock) {
          me.$set(me.right_block.menu, 'lock', false)
          me.$set(me.right_block, 'lock_text', '锁定组合')
        } else {
          me.$set(me.right_block.menu, 'lock', true)
          me.$set(me.right_block, 'unlock_text', '解锁组合')
        }
      }
    },
    onRightDelete: function () {
      container_func.onRightDelete.bind(this)()
    },
    deleteSomeone: function (name, render, callback) {
      container_func.deleteSomeone.bind(this)(name, render, callback)
    },
    onRightAss: function () {
      const me = this
      // 将临时组合设置为组合，不同元素模块的不能组合
      me.arrToAss(me.ctrl_arr)
      me.$set(me.right_block, 'show', false)
    },
    arrToAss: function (element_arr, association_id = -1, render_create = false) {
      other_func.arrToAss.bind(this)(element_arr, association_id, render_create)
    },
    onRight_unAss: function () {
      const me = this
      // 取消组合，删除组合矩形，清空元素的组合名称
      // 情空临时矩形区域,清空包含在ctrl_arr数组里的其他组合矩形
      me.removeLine()
      me.clearTemAss(true, true)
      me.ctrl_arr.map(function (value, index, array) {
        value.association_name = ''
      })
      me.ctrl_arr.length = 0
      me.$set(me.right_block, 'show', false)
      me.cancelInMove() // 取消右侧编辑栏
    },
    onDragStart: function (event) {
      element_func.onDragStart.bind(this)(event)
    },
    onDragMove: function (event) {
      element_func.onDragMove.bind(this)(event)
    },
    onDragEnd: function (event) {
      element_func.onDragEnd.bind(this)(event)
    },
    onScaleStart: function (event) {
      element_func.onScaleStart.bind(this)(event)
    },
    onScaleMove: function (btn, event) {
      element_func.onScaleMove.bind(this)(btn, event)
    },
    onScaleEnd: function () {
      element_func.onScaleEnd.bind(this)()
    },
    onRotateStart: function () {
      element_func.onRotateStart.bind(this)()
    },
    onRotateMove: function (event) {
      element_func.onRotateMove.bind(this)(event)
    },
    onRotateEnd: function () {
      element_func.onRotateEnd.bind(this)()
    },
    onTemporaryStart: function (event) {
      element_func.onTemporaryStart.bind(this)(event)
    },
    onTemporaryEnd: function () {
      element_func.onTemporaryEnd.bind(this)()
    },
    onTScaleStart: function (event) {
      element_func.onTScaleStart.bind(this)(event)
    },
    onTScaleMove: function (btn, event) {
      element_func.onTScaleMove.bind(this)(btn, event)
    },
    onTScaleEnd: function () {
      element_func.onTScaleEnd.bind(this)()
    },
    onTRotateStart: function (event = null) {
      element_func.onTRotateStart.bind(this)(event)
    },
    onTRotateMove: function (event) {
      element_func.onTRotateMove.bind(this)(event)
    },
    onTRotateEnd: function () {
      element_func.onTRotateEnd.bind(this)()
    },
    onAssociationStart: function (event, right = false, lock = false) {
      element_func.onAssociationStart.bind(this)(event, right, lock)
    },
    onAScaleStart: function (event) {
      element_func.onAScaleStart.bind(this)(event)
    },
    onAScaleMove: function (btn, event) {
      element_func.onAScaleMove.bind(this)(btn, event)
    },
    onAScaleEnd: function () {
      element_func.onAScaleEnd.bind(this)()
    },
    onARotateStart: function (event = null) {
      element_func.onARotateStart.bind(this)(event)
    },
    onARotateMove: function (btn = null, event = null) {
      element_func.onARotateMove.bind(this)(btn, event)
    },
    onARotateEnd: function (btn = null, event = null) {
      element_func.onARotateEnd.bind(this)(btn, event)
    },
    forChangeAssociation: function (ass_id = undefined) {
      element_func.forChangeAssociation.bind(this)(ass_id)
    },
    onStretchStart: function (event) {
      element_func.onStretchStart.bind(this)(event)
    },
    onStretchMove: function (event) {
      element_func.onStretchMove.bind(this)(event)
    },
    onStretchEnd: function () {
      element_func.onStretchEnd.bind(this)()
    },
    normalStart: function (that, data) {
      element_func.normalStart.bind(this)(that, data)
    },
    ctrlDeviation: function (data, t_r, tem_move = true) {
      element_func.ctrlDeviation.bind(this)(data, t_r, tem_move)
    },
    rotateOBj: function (num, x) {
      element_func.rotateOBj.bind(this)(num, x)
    },
    tRotateOBj: function (num, x) {
      element_func.tRotateOBj.bind(this)(num, x)
    },
    aRotateOBj: function (num, x, centerX) {
      element_func.aRotateOBj.bind(this)(num, x, centerX)
    },
    scaleAll: function (n, d_value, text_num = 0) {
      element_func.scaleAll.bind(this)(n, d_value, text_num)
    },
    tScaleAll: function (n, that, present_w) {
      element_func.tScaleAll.bind(this)(n, that, present_w)
    },
    aScaleAll: function (n, that) {
      element_func.aScaleAll.bind(this)(n, that)
    },
    scaleTextEnd (text) {
      element_func.scaleTextEnd.bind(this)(text)
    },
    moveIcon: function (obj) {
      element_func.moveIcon.bind(this)(obj)
    },
    removeLine: function (id = null) {
      container_func.removeLine.bind(this)(id)
    },
    clearTemporary: function () {
      container_func.clearTemporary.bind(this)()
    },
    findCont: function (containerName) {
      return other_func.findCont.bind(this)(containerName)
    },
    sortContainerArr: function (clear_rotation) {
      container_func.sortContainerArr.bind(this)(clear_rotation)
    },
    findMinAndAdd: function (data, a_length = 0, a_name = '') {
      container_func.findMinAndAdd.bind(this)(data, a_length, a_name)
    },
    createAssociation: function (name, m_comp_name, render_create) {
      container_func.createAssociation.bind(this)(name, m_comp_name, render_create)
    },
    createAssociationRect: function (container, name, render_create) {
      container_func.createAssociationRect.bind(this)(container, name, render_create)
    },
    clearTemAss: function (clear_rotation, clear_association = false) {
      container_func.clearTemAss.bind(this)(clear_rotation, clear_association)
    },
    findRect: function (container, data, tem_move) {
      container_func.findRect.bind(this)(container, data, tem_move)
    },
    renderTLine: function (t_r, a_r_btn = false, name = '', lock = false) {
      container_func.renderTLine.bind(this)(t_r, a_r_btn, name, lock)
    },
    aSingleClick: function (that, data) {
      element_func.aSingleClick.bind(this)(that, data)
    },
    aSingleClickBorder: function (ass_name) {
      element_func.aSingleClickBorder.bind(this)(ass_name)
    },
    moveOutLine: function (x, y, obj) {
      other_func.moveOutLine.bind(this)(x, y, obj)
    },
    changeAssociation: function (obj) {
      other_func.changeAssociation.bind(this)(obj)
    },
    addACtrlarr: function (a_name) {
      const me = this
      for (let i = 0; i < me.container_arr.length; i++) {
        if (me.container_arr[i].cont.children[0].association_name == a_name) {
          me.ctrl_arr.push(me.container_arr[i].cont.children[0])
        }
      }
    },
    setCtrlArrAssname: function () {
      const me = this
      let a = []
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].association_name !== '') {
          a.push(me.ctrl_arr[i].association_name)
        }
      }
      a = new Set(a)
      return [...a]
    },
    ctrlAddAss: function (name, ass_name_arr) {
      const me = this
      for (let i = 0; i < me.container_arr.length; i++) {
        if (name == me.container_arr[i].cont.children[0].association_name) {
          me.ctrl_arr.push(me.container_arr[i].cont.children[0])
        }
      }
      return ass_name_arr.push(name)
    },
    ctrlDisAss: function (name, ass_name_arr) {
      const me = this
      me.ctrl_arr = me.ctrl_arr.filter(function (item) {
        me.removeLine(item.name)
        return item.association_name !== name
      })
      return ass_name_arr.filter(item => item !== name)
    },
    updateLayer: function () {
      other_func.updateLayer.bind(this)()
    },
    moveActiveLog: function (way) {
      container_func.moveActiveLog.bind(this)(way)
    },
    show_click: function (id) {
      const me = this
      let index = me.findCont(id)
      me.in_move = me.container_arr[index].cont.children[0]
      if (me.in_move.association_name == '') {
        if (me.in_move.lock) {
          me.containerLine(me.in_move, false, false, '#D62B25', true)
          me.$set(me.edit_bar.btn, 'show', false)
        } else {
          // 没有组合的单个图层
          me.clearTemporary()
          // 删除之前的边框按钮图层，增加此对象的边框按钮
          me.containerLine(me.in_move, false)
          me.showEdit(me.in_move.type)
        }
      } else {
        me.ctrl_arr.length = 0
        me.addACtrlarr(me.in_move.association_name)
        // 锁定的组合的点击
        if (me.in_move.lock) {
          // 渲染锁定后的组合边框
          me.renderTLine(false, true, me.in_move.association_name, true)
          me.$set(me.edit_bar.btn, 'show', false)
        } else {
          me.aSingleClickBorder(me.in_move.association_name)
          me.click_ass_id = me.in_move.association_name
          if (me.in_move.type == 'image') {
            me.showEdit('image_in')
          } else if (me.in_move.type == 'text') {
            me.showEdit('text_in')
          }
        }
        //
      }
    },
    moveStructureText: function () {
      other_func.moveStructureText.bind(this)()
    },
    lockFunc: function () {
      other_func.lockFunc.bind(this)()
    },
    unlockFunc: function () {
      other_func.unlockFunc.bind(this)()
    },
    moveIndex: function (up, max = '') {
      const me = this
      if (me.in_move) {
        me.upDownMove(me.findCont(me.in_move.name), up, max)
      } else {
        me.upDownMove(me.findCont(me.ctrl_arr[0].name), up, max)
      }
    },
    upDownMove: function (index, up, max = '') {
      container_func.upDownMove.bind(this)(index, up, max)
    },
    renderUpDown: function () {
      container_func.renderUpDown.bind(this)()
    },
    toImage: function (returnFile = false) {
      if (!returnFile) {
        other_func.toImage.bind(this)(returnFile)
      } else {
        return other_func.toImage.bind(this)(returnFile)
      }
    },
    addImgTwo: function (cont, img_arr) {
      return other_func.addImgTwo.bind(this)(cont, img_arr)
    },
    downloadImg: function (imgsrc) {
      other_func.downloadImg.bind(this)(imgsrc)
    },
    canvasToimg: function () {
      const me = this
      let img = me.p_app.renderer.plugins.extract.base64(me.p_app.stage)
    },
    keyboard: function (keyCode, second) {
      let key = {}
      key.code = keyCode
      key.secondCode = second || -111
      key.isDown = false
      key.isUp = true
      key.press = undefined
      key.release = undefined
      let agent = navigator.userAgent.toLowerCase()
      let isMac = /macintosh|mac os x/i.test(navigator.userAgent)
      // The `downHandler`
      key.downHandler = event => {
        if (event.keyCode === key.code || event.keyCode === key.secondCode) {
          if ((key.isUp || isMac) && key.press) {
            key.press()
          }
          key.isDown = true
          key.isUp = false
          if (event.keyCode == 91 || event.keyCode == 93) {
            event.preventDefault()
          }
        }
      }
      // The `upHandler`
      key.upHandler = event => {
        if (event.keyCode === key.code || event.keyCode === key.secondCode) {
          if (key.isDown && key.release) key.release()
          key.isDown = false
          key.isUp = true
          if (event.keyCode == 91 || event.keyCode == 93) {
            event.preventDefault()
          }
        }
      }
      // Attach event listeners
      window.addEventListener('keydown', key.downHandler.bind(key), false)
      window.addEventListener('keyup', key.upHandler.bind(key), false)
      return key
    },
    addPopShow: function (show) {
      const me = this
      me.$set(me, 'addPop', show)
    },
    canvasScale: function (type) {
      other_func.canvasScale.bind(this)(type)
    },
    showRuler: function () {
      other_func.showRuler.bind(this)()
    },
    idToImg: function (idArr) {
      return other_func.idToImg.bind(this)(idArr)
    },
    dataURLtoFile: function (dataurl, filename) {
      return other_func.dataURLtoFile.bind(this)(dataurl, filename)
    },
    changeImage: function () {
      const me = this
      me.hide_edit_f()
      me.$set(me, 'addPop', true)
      bus.$emit('image_change')
      me.$set(me.right_block, 'show', false)
    },
    changeInMoveImage: function (data) {
      const me = this
      let last = _.cloneDeep(me.active_log[me.active_log.length - 1])
      for (let i = 0; i < last.length; i++) {
        if (last[i].children[0].ass_children.length == 1) {
          if (last[i].children[0].ass_children[0].type == 'image' && last[i].children[0].ass_children[0].file_id == me.in_move.file_id) {
            last[i].children[0].ass_children[0].file_id = data.file_id
            last[i].children[0].ass_children[0].src = data.src
          }
        }
      }
      if (me.active_log.length >= 30) {
        me.active_log.splice(0, 1)
      }
      me.active_log.splice(me.active_index + 1, 30)
      me.active_log.push(last)
      // 渲染
      me.$set(me, 'render_data', me.active_log[me.active_log.length - 1])
      me.$set(me, 'active_index', me.active_log.length - 1)
      me.renderTemplate()
    },
    renderARC: function (titleType, wordArr, textReplace = null) {
      container_func.renderARC.bind(this)(titleType, wordArr, textReplace)
    },
    fontPost: function (data) {
      return container_func.fontPost.bind(this)(data)
    },
    getAllfontFamily: function (font_family) {
      return container_func.getAllfontFamily.bind(this)(font_family)
    },
    getfontFamilyBack: function (font_family) {
      return other_func.getfontFamilyBack.bind(this)(font_family)
    },
    textReverse: function (text = null) {
      other_func.textReverse.bind(this)(text)
    }
    // changeSaveRule: function(bool){
    //   this.saveTextRule=bool
    // }
  },
  components: {
    addPop: () => import('./addPop.vue'),
    'mould-func': () => import('./mould-func.vue')
  }
}
</script>
