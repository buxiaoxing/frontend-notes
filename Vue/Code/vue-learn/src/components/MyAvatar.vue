<template>
  <img :src="url" :style="{
    width: size + 'px', height: size + 'px' }" 
    class="my-avatar-container"
  />
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: () => 150
    }
  }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.my-avatar-container{
  border-radius: 50%;
  /* 指定<img/> <video/>内容应该如何适应到其使用高度和宽度确定的框 */
  object-fit: cover;  
  display: block;
}
</style>