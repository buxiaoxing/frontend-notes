<template>
  <i class="iconfont my-icon-container" :class="fontClass"></i>
</template>

<script>
const classMap = {
  home: "iconzhuye",
  success: "iconzhengque",
  error: "iconcuowu",
  close: "iconguanbi",
  warn: "iconjinggao",
  info: "iconxinxi",
  blog: "iconblog",
  code: "iconcode",
  about: "iconset_about_hov",
  weixin: "iconweixin",
  mail: "iconemail",
  github: "icongithub",
  qq: "iconsign_qq",
  arrowUp: "iconiconfonticonfonti2copy",
  arrowDown: "iconiconfonticonfonti2",
  empty: "iconempty",
  chat: "iconliuyan",
};
export default {
  props: {
    type: {
      type: String,
      required: true,
    }
  },

  computed: {
    fontClass(){
      return classMap[this.type]
    }
  },
  data() {
    return {

    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {

  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {

  }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
@import "//at.alicdn.com/t/font_2164449_nalfgtq7il.css";

.iconfont {
  color: inherit;
  font-size: inherit;
}
</style>