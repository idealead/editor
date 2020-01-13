<style type="text/css" scoped>
.tab_page_block::-webkit-scrollbar {
  width: 0 !important
}

.tab_page_block {
  -ms-overflow-style: none
}

.tab_page_block {
  overflow: -moz-scrollbars-none;
}

.side_block {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: rgb(243, 242, 245);
}

.side_tab_blcok {
  height: 100%;
  width: 100px;
  position: absolute;
  left: 0;
  top: 0;
  padding-top: 80px;
  /*  background-color: white; */
}

.tab_page_block {
  position: absolute;
  width: 280px;
  height: 100%;
  padding-top: 110px;
  left: 100px;
  top: 0;
  box-sizing: border-box;
  overflow-y: auto;
}

.side_tab {
  width: 100%;
  height: 100px;
  position: relative;
  background-color: white;
  cursor: pointer;
}

.tab_on {
  background-color: rgb(243, 242, 245);
}

.side_tab_prev {
  border-bottom-right-radius: 12px;
}

.side_tab_next {
  border-top-right-radius: 12px;
}

.side_tab_other {
  height: 100%;
  background-color: white
}

.tab_icon_blcok {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%)
}

.tab_icon {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('../assets/side_block/icon-2-2.png');
}

.tab_text {
  font-size: 16px;
  line-height: 16px;
  text-align: center;
  margin-top: 10px;
  color: #333;
}

.tab_on .tab_text {
  color: #ce3939;
}

.tab_page {
  position: absolute;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.alertmask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, .5)
}

.select_comp {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  width: 180px;
}

.select_comp_sure {
  margin-top: 10px;
}
</style>
<template>
  <div class="side_block">
    <div class="side_tab_blcok" v-if="false">
      <div v-for="item in side_tab">
        <div class="side_tab" :class='[item.class]' v-bind:data-id="item.id" @click='tab_click_f(item.id)'>
          <div class="tab_icon_blcok">
            <div class="tab_icon"></div>
            <p class="tab_text">{{item.name}}</p>
          </div>
        </div>
      </div>
      <div class="side_tab_other" :class='[other_data.lastclass]'>
      </div>
    </div>
    <div class="tab_page_block" v-if="false">
      <tab-project v-show="other_data.tab_page_id=='tab_project'" />
      <tab-layer v-show="other_data.tab_page_id=='tab_layer'" />
      <tab-material v-show="other_data.tab_page_id=='tab_material'" @add-e="add_element_select" />
      <tab-newtext v-show="other_data.tab_page_id=='tab_newtext'" @add-e="add_element_select" />
      <tab-upload v-show="other_data.tab_page_id=='tab_upload'" @add-e="add_element_select" />
      <div class="alertmask" v-if="add_element.show">
        <div class="select_comp">
          <el-select v-model="add_element.m_comp_name" placeholder="请选择归属模块">
            <el-option v-for="item in project_m_comp" :key="item.name" :label="item.chinese" :value="item.name">
            </el-option>
          </el-select>
          <el-button type="primary" class="select_comp_sure" @click="add_element_sure">确认</el-button>
        </div>
      </div>
    </div>
    <new-layer />
  </div>
</template>
<script type="text/javascript">
import { mapState, mapActions, mapGetters } from 'vuex'
import bus from '@/eventBus.js'
export default {
  name: 'side-block',
  props: {
    msg: String // 例子
  },
  computed: {
    ...mapState({
      project_m_comp: state => state.project_m_comp
    })
  },
  data: function() {
    return {
      side_tab: [
        // {
        //     id: 'tab_project',
        //     name: '项目',
        //     on: true,
        //     class: 'tab_on'
        // },
        {
          id: 'tab_layer',
          name: '图层',
          on: false,
          class: 'tab_on'
        }, {
          id: 'tab_material',
          name: '素材库',
          on: false,
          class: 'side_tab_next'
        }, {
          id: 'tab_newtext',
          name: '文本',
          on: false,
          class: ''
        }, {
          id: 'tab_upload',
          name: '上传',
          on: false,
          class: ''
        }
      ],
      other_data: {
        lastclass: '',
        tab_page_id: 'tab_layer'
      },
      add_element: {
        show: false,
        id: '',
        src: '',
        text: '',
        m_comp_name: 'product'
      }
    }
  },
  methods: {
    tab_click_f: function(id) {
      const me = this
      let click_i = -1
      for (let i = 0; i < me.side_tab.length; i++) {
        me.$set(me.side_tab[i], 'on', false)
        me.$set(me.side_tab[i], 'class', '')
        if (id == me.side_tab[i].id) click_i = i
      }
      if (click_i !== -1) {
        me.$set(me.side_tab[click_i], 'on', true)
        me.$set(me.side_tab[click_i], 'class', 'tab_on')
        me.$set(me.other_data, 'tab_page_id', id)
        if (click_i == me.side_tab.length - 1) {
          me.$set(me.other_data, 'lastclass', 'side_tab_next')
        } else {
          me.$set(me.side_tab[click_i + 1], 'class', 'side_tab_next')
        }
        if (click_i !== 0) me.$set(me.side_tab[click_i - 1], 'class', 'side_tab_prev')
      }
    },
    add_element_select: function(data) {
      const me = this
      // me.$set(me.add_element, 'show', true)
      me.$set(me.add_element, 'id', data.id)
      me.$set(me.add_element, 'src', data.src)
      me.$set(me.add_element, 'text', data.text)
      me.add_element_sure()
    },
    add_element_sure: function() {
      const me = this
      // 选择好元素归属模块后，通过中转站通信，告诉canvas要添加新元素
      bus.$emit('add_element_func', me.add_element)
      me.$set(me.add_element, 'show', false)
      me.$set(me.add_element, 'id', '')
      me.$set(me.add_element, 'src', '')
      me.$set(me.add_element, 'text', '')
      // me.$set(me.add_element, 'm_comp_name', '')
    }

  },
  components: {
    'tab-layer': () => import('../localComponents/tab-layer.vue'),
    'tab-project': () => import('../localComponents/tab-project.vue'),
    'tab-material': () => import('../localComponents/tab-material.vue'),
    'tab-newtext': () => import('../localComponents/tab-newtext.vue'),
    'tab-upload': () => import('../localComponents/tab-upload.vue'),
    'new-layer': () => import('../localComponents/new-side-layer.vue')
  }
}

</script>
