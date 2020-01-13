<style type="text/css">
.project_comp_block {
    margin-bottom: 15px;
}

.project_m_comp {
    height: 40px;
    border-radius: 10px;
    color: #666666;
    background-color: white;
    position: relative;
    text-align: left;
    padding-left: 27px;
    font-size: 16px;
    line-height: 40px;
    cursor: pointer;
    position: relative;
}

.project_m_ass {
    text-align: left;
    padding-top: 20px;
}

.ass_block {
    width: 70px;
    height: 70px;
    display: inline-block;
    background-size: cover;
    background-repeat: no-repeat;
    cursor: pointer;
    background-color: red;
    margin: 0 5px 10px 5px;
    border-radius: 10px;
}

.arrow {
    position: absolute;
    right: 11px;
    top: 50%;
    width: 16px;
    height: 9px;
    transform: translateY(-50%);
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('../assets/side_block/arrow.png')
}

.arrowup {
    transform: translateY(-50%) rotate(180deg);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
<template>
    <div class="tab_page tab_project">
        <div class="project_comp_block" v-for="(item,index) in project_m_comp">
            <div class="project_m_comp" @click="project_comp_show(index)">
                {{item.chinese}}
                <div class="arrow" :class="{'arrowup':project_more[index]}"></div>
            </div>
            <transition name="fade">
                <div class='project_m_ass' v-show="project_more[index]">
                    <div class="ass_block">
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script type="text/javascript">
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'tab-project',
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
      project_more: []
    }
  },
  created: function() {
    this.init_project_more()
  },
  methods: {
    project_comp_show: function(index) {
      const me = this
      me.$set(me.project_more, index, !me.project_more[index])
    },
    init_project_more: function() {
      const me = this
      for (let i = 0; i < me.project_m_comp.length; i++) {
        me.$set(me.project_more, i, false)
      }
    }
  }
}
</script>
