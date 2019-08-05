<template>
    <div class="top_block">
        <div class="insight_logo"></div>
        <p class="project_name">项目名称：网页banner</p>
        <div class="user_block">
            <div class="save_btn">保 存</div>
            <div class="user_head" v-bind:style="{backgroundImage:'url('+head+')'}"></div>
            <div class="user_name">哈哈哈</div>
            <div class="logout">退出登录</div>
        </div>
    </div>
</template>
<style type="text/css" scoped>
.top_block {
    position: absolute;
    background-color: white;
    width: 100%;
    height: 80px;
    -moz-box-shadow: 5px 5px 3px rgba(0, 0, 0, .2);
    /* 老的 Firefox */
    box-shadow: 5px 5px 3px rgba(0, 0, 0, .2);
}

.insight_logo {
    width: 312.9px;
    height: 34.75px;
    position: absolute;
    top: 50%;
    left: 40px;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    background-image: url('../assets/logo.png');
    background-size: contain;
    background-repeat: no-repeat;
}

.project_name {
    font-size: 16px;
    color: #666666;
    line-height: 20px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    left: 400px;
}

.user_block {
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    padding-right: 50px;
}

.save_btn {
    width: 145px;
    height: 40px;
    line-height: 40px;
    margin: 20px 0;
    font-size: 16px;
    color: white;
    background-color: rgb(206, 57, 57);
    border-radius: 30px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
    vertical-align: top;
}

.user_head {
    width: 60px;
    height: 60px;
    display: inline-block;
    margin: 10px 35px;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-size: cover;
}

.user_name,
.logout {
    line-height: 20px;
    font-size: 16px;
    height: 20px;
    margin: 30px 0;
    color: #333;
    display: inline-block;
    vertical-align: top;
}

.logout {
    margin-left: 25px;
    cursor: pointer;
}
</style>
<script type="text/javascript">
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    name: 'top-block',
    props: {
        msg: String //例子
    },
    data: function() {
        return {
            head: require('../assets/head.png')
        }
    },
    created: function() {
        console.log(this.head)
    },
};
</script>