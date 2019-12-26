<template>
  <div class="center">
    <dcenter-left />
    <div class="dcenter-right">
      <structure v-if="right_index==0" :structureD="structureD" />
      <myDesign v-show="right_index==1" />
      <structureMaterial v-if="right_index==2&&structureD" :structureD="structureD" />
      <myMaterial v-if="right_index==3" />
      <split v-if="right_index==4&&structureD" :structureD="structureD" />
      <designer v-show="right_index==5" />
    </div>
    <top-block />
  </div>
</template>
<style type="text/css" scoped>
.center {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgb(242, 241, 244);
}

.dcenter-right {
  position: absolute;
  width: calc(100% - 210px);
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
}
</style>
<script>
// @ is an alias to /src
import { mapState, mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import bus from '@/eventBus.js'
export default {
  name: 'designerCenter',
  data: function() {
    return {
      right_index: 0,
      structureData: null
    }
  },
  computed: {
    ...mapState({
      api: state => state.api
    }),
    structureD: function() {
      return this.structureData
    }
  },
  created: function() {
    const me = this
    // 获取架构信息
    me.getStructureData()
  },
  mounted: function() {
    const me = this
    bus.$off('dcenterRightC').$on('dcenterRightC', function(index) {
      me.$set(me, 'right_index', index)
    })
  },
  methods: {
    getStructureData() {
      // 获取骨架数据
      const me = this
      axios({
        method: 'get',
        url: me.api.all_framework_info
      })
        .then(function(response) {
          if (response.data.code == '200') {
            me.$set(me, 'structureData', response.data.data)
          }
        })
        .catch(function() {})
    }
  },
  components: {
    'dcenter-left': () => import('../designerComponents/dcenter-left.vue'),
    structure: () => import('../designerComponents/structure.vue'),
    myDesign: () => import('../designerComponents/myDesign.vue'),
    designer: () => import('../designerComponents/designer.vue'),
    structureMaterial: () => import('../designerComponents/structureMaterial.vue'),
    myMaterial: () => import('../designerComponents/myMaterial.vue'),
    split: () => import('../designerComponents/split.vue')
  }
}
</script>
