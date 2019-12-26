<template>
  <div
    class="new_layer_block"
    :class="[layer_show?'layer_show':'layer_hide',activeName=='layer'?'':'textBlock',(!layer_show && activeName=='text')?'text_layer_hide':'']"
  >
    <div class="layer_hide_btn" @click="showHideLayer">
      <div class="hide_arrow" :class="layer_show?'arrow_left':'arrow_right'"></div>
    </div>
    <div class="layer_main_block">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="推荐文案" name="text"></el-tab-pane>
        <el-tab-pane label="图层" name="layer"></el-tab-pane>
      </el-tabs>
      <div class="scroll" v-show="activeName=='layer'">
        <div
          class="new_layer_show"
          v-for="item in layer.layer"
          :key="item.id"
          @click="click_in_move(item.id)"
          :class="{'layer_select':item.select}"
          v-show="(item.type=='image'||item.type=='text')"
        >
          <div
            v-if="item.type=='image'"
            class="layer_block"
            :data-layer-id="item.id"
            style="background-color:#f3f2f5"
          >
            <img :src="item.srcData" class="image_layer" />
            <p class="layer_block_des">元素</p>
            <p class="desRole" v-if="item.role">{{item.role}}</p>
            <p
              class="desPosition"
              v-if="item.replacePosition||item.replacePosition==0"
            >位置：{{item.replacePosition}}</p>
          </div>
          <div
            v-else-if="item.type=='text'"
            class="layer_block"
            :data-layer-name="item.id"
            :style="{'font-family':item.fontFamily,'font-size':item.fontSize+'px',color:item.color,'text-shadow':`4px 4px ${item.dropShadowBlur}px ${item.dropShadowColor}`}"
          >
            {{item.text}}
            <p class="layer_block_des">文本</p>
            <p class="desRole" v-if="item.role">{{item.role}}</p>
            <p class="desPosition" v-if="item.textPosition">{{item.textPosition}}</p>
          </div>
        </div>
      </div>
      <div class="text_recommend" v-show="activeName=='text'">
        <el-card
          class="box-card"
          v-for="(item,index) in tempText"
          :key="index"
          :class="`box-card${index}`"
        >
          <div @click="recommend_text(item.content,index)">
            <div v-for="(it,i) in item.content" :key="i" class="text-item">{{it}}</div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<style type="text/css" lang='less' scoped>
@layer-block-width: 200px;
@layer-block-text-width: 280px;
.box-card {
  width: calc(100% - 40px);
  box-sizing: border-box;
  margin-bottom: 10px;
  cursor: pointer;
}
.mya {
  animation: myaa 0.3s;
  @keyframes myaa {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }
}

// .clicka{
//   animation: bounce-in .5s;
// }
.box-card:hover {
  width: calc(100% - 30px);
  border: 1px solid red
}
.text-item {
  font-size: 14px;
  padding: 5px;
}
.layer_block_des {
  position: absolute;
  font-size: 15px;
  line-height: 15px;
  height: 15px;
  color: #ce3939;
  top: 5px;
  right: 5px;
}
.desPosition {
  position: absolute;
  font-size: 15px;
  line-height: 15px;
  height: 15px;
  color: #ce3939;
  bottom: 5px;
  right: 5px;
}
.desRole {
  position: absolute;
  font-size: 15px;
  line-height: 15px;
  height: 15px;
  color: #ce3939;
  bottom: 5px;
  left: 5px;
}

.new_layer_block {
  width: @layer-block-width;
  height: calc(100% - 8.2vh);
  position: absolute;
  top: 8.2vh;
  left: 0;
  background-color: white;
  transition: transform 0.3s, width 0.2s;
  transition-timing-function: ease-out;
}
.textBlock {
  width: @layer-block-text-width;
}

.layer_show {
  transform: translateX(0);
}

.layer_hide {
  transform: translateX(-@layer-block-width);
  // left: -@layer-block-width;
}
.text_layer_hide {
  transform: translateX(-@layer-block-text-width);
  // left: -@layer-block-text-width;
}

.layer_hide_btn {
  width: 30px;
  height: 154px;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('../assets/side_block/hideBtn.png');
  position: absolute;
  right: -25px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.layer_main_block {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-shadow: 0px 5px 3px rgba(0, 0, 0, 0.2);
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.hide_arrow {
  width: 10px;
  height: 15px;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('../assets/side_block/arrow2.png');
}

.arrow_right {
  transform: translateY(-50%) rotate(180deg);
}

.new_layer_show {
  width: 160px;
  height: 134px;
  background-color: white;
  border-radius: 10px;
  position: relative;
  margin-bottom: 15px;
  background-color: white;
}

.layer_select {
  background-color: #ce3939;
}

.scroll {
  width: @layer-block-width;
  height: calc(100% - 50px);
  overflow-y: scroll;
}
.text_recommend {
  width: @layer-block-text-width;
  height: calc(100% - 50px);
  overflow-y: scroll;
}

.layer_block {
  width: 156px;
  height: 130px;
  background-color: white;
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 8px;
  transform: translateX(-50%) translateY(-50%);
  font-size: 16px;
  line-height: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  cursor: pointer;
  background-image: url('../assets/side_block/mosaic.svg');
  background-size: 20px 20px;
  background-repeat: repeat;
}

.image_layer {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

@media screen and (max-width: 1650px) {
  @layer-block-width: 150px;
  @layer-block-text-width: 230px;
  .new_layer_block {
    width: @layer-block-width;
  }
  .textBlock {
    width: @layer-block-text-width;
  }
  .layer_hide {
    transform: translateX(-@layer-block-width);
  }

  .text_layer_hide {
    transform: translateX(-@layer-block-text-width);
  }
  .new_layer_show {
    width: 110px;
  }

  .scroll {
    width: @layer-block-width;
  }

  .layer_block {
    width: 106px;
  }

  .text_recommend {
    width: @layer-block-text-width;
  }
}

@media screen and (max-height: 830px) {
  .new_layer_block {
    height: calc(100% - 9vh);
    top: 9vh;
  }
}

@media screen and (max-height: 720px) {
  .new_layer_block {
    height: calc(100% - 9.2vh);
    top: 9.2vh;
  }
}
</style>
<script type="text/javascript">
import { mapState, mapActions, mapGetters } from 'vuex'
import bus from '@/eventBus.js'
import axios from 'axios'
export default {
  name: 'new-layer',
  props: {
    msg: String // 例子
  },
  computed: {
    ...mapState({
      user_data: state => state.user.user_data,
      tempId: state => state.homeCanvas.tempId,
      api: state => state.api
    })
  },
  data: function() {
    return {
      layer: {
        layer: []
      },
      layer_show: true,
      activeName: 'text', // 图层和文案侧边栏
      tempText: [{ content: '暂无推荐文案' }]
    }
  },
  created: function() {
    const me = this
    bus.$off('update-layer').$on('update-layer', function(data) {
      data = data.reverse()
      me.$set(me.layer, 'layer', data)
    })
    bus.$off('getRecommend').$on('getRecommend', father_id => {
      me.getRecommend(father_id)
    })
    bus.$off('tabChange').$on('tabChange',name=>{
      me.activeName=name
    })
  },
  mounted: function() {},
  methods: {
    click_in_move: function(id) {
      // const me = this
      bus.$emit('layer_click', id)
    },
    showHideLayer: function() {
      const me = this
      me.$set(me, 'layer_show', !me.layer_show)
    },
    tabClick: function(tab, event) {

    },
    getRecommend: function(father_id) {
      const me = this
      axios({
        method: 'get',
        url: `${me.api.get_word}?template_id=${parseInt(father_id)}`
      })
        .then(res => {
          me.$set(me, 'tempText', res.data.data instanceof Array && res.data.data.length > 0 ? res.data.data : [{ content: '暂无推荐文案' }])
        })
        .catch(_ => {
          me.$set(me, 'tempText', [{ content: '暂无推荐文案' }])
        })
    },
    animateCSS: function(element, animationName, callback) {
      const node = document.querySelector(element)
      node.classList.add(animationName)
      // node.classList.add('animated', animationName)
      let handleAnimationEnd = function() {
        node.classList.remove(animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
      }
      node.addEventListener('animationend', handleAnimationEnd)
    },
    recommend_text: function(textarr, index) {
      if (textarr !== '暂无推荐文案') {
        setTimeout(() => {
          bus.$emit('recommendText', textarr)
        }, 400)
      }
      this.animateCSS(`.box-card${index}`, 'mya')
    }
  }
}
</script>
