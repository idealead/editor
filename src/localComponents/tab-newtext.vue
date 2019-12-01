<template>
    <div class="tab_page tab_newtext">
        <textarea class="newtext_input" rows='5' v-model="textC"></textarea>
        <div class="add_text_btn" @click="add_element">加入文本</div>
    </div>
</template>
<style type="text/css">
.newtext_input {
    width: 240px;
    outline: none;
    margin: 0px;
    resize: none;
    border: none;
    padding: 5px;
    box-sizing: border-box;
}

.add_text_btn {
    height: 40px;
    border-radius: 10px;
    color: #fff;
    background-color: #f73;
    position: relative;
    text-align: center;
    font-size: 16px;
    line-height: 40px;
    margin-top: 20px;
    cursor: pointer;
}
</style>
<script type="text/javascript">
import { mapState, mapActions, mapGetters } from 'vuex'
import bus from "@/eventBus.js"
export default {
    name: 'tab-newtext',
    props: {
        msg: String //例子
    },
    computed: {},
    data: function() {
        return {
            textC:''
        }
    },
    created: function() {
        const me = this;

    },
    methods: {
        add_element:function(){
            const me=this;
            let id = `text_${(new Date()).valueOf()}`
            let data = {
                id: id,
                src: '',
                text:me.textC
            }
            //通知side-block打开元素模块分类选择
            me.$emit('add-e', data)
            me.textC=''
        }
    }
};
</script>