<template>
    <div class="tab_page tab_layer">
        <div class="layer_show" v-for="item in layer.layer" :key="item.name" @click='click_in_move(item.name)'>
            <div v-if="item.type=='image'" class="layer_block" :data-layer-id="item.name" :style="{backgroundImage: 'url('+item.srcData+')'}"></div>
            <div v-else-if="item.type=='text'" class="layer_block" :data-layer-name="item.name" style='background-color:gray'>{{item._text}}</div>
        </div>
    </div>
</template>
<style type="text/css">
.layer_show {
    height: 60px;
    background-color: white;
    border-radius: 10px;
    position: relative;
    margin-bottom: 15px;
}

.layer_block {
    width: 230px;
    height: 50px;
    position: absolute;
    left: 50%;
    top: 50%;
    border-radius: 8px;
    transform: translateX(-50%) translateY(-50%);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    font-size: 14px;
    line-height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    cursor: pointer;
}
</style>
<script type="text/javascript">
import { mapState, mapActions, mapGetters } from 'vuex'
import bus from "@/eventBus.js"
export default {
    name: 'tab-layer',
    props: {
        msg: String //例子
    },
    computed: {},
    data: function() {
        return {
            layer: {
                layer: []
            }
        }
    },
    created: function() {
        const me = this;
            bus.$on('update-layer', function(data) {
            	data=data.reverse();
                me.$set(me.layer, 'layer', data)
                console.log(me.layer.layer)
            })
    },
    methods: {
        click_in_move:function(id){
            const me=this;
            bus.$emit('layer_click',id)
        }
    }
};
</script>