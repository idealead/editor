<template>
    <div class="home">
        <Canvas />
        <side-block />
        <top-block />
    </div>
</template>
<style type="text/css">
.home {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    left: 0;
    top: 0; 
}
</style>
<script>
// @ is an alias to /src

export default {
    name: 'home',
    data: function() {
        return {
            logo_path: ''
        }
    },
    created: function() {

    }
}
</script>