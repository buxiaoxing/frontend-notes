<template>
  <div id="app">
    <my-avatar :url="require('./assets/logo.png')" />
    <my-icon type="home" />
    <my-pager :current-page="currentPage" :total="total" @pageChange="handlePageChange" />
  </div>
</template>

<script>
import MyAvatar from './components/MyAvatar.vue';
import MyIcon from './components/MyIcon.vue';
import MyPager from './components/MyPager.vue'
export default {
  name: 'App',
  components: {
    MyAvatar,
    MyIcon,
    MyPager
  },
  data(){
    return {
      currentPage: 1,
      total: 302
    }
  },

  methods: {
    handlePageChange(newPage){
      this.currentPage = newPage
    }
  }
}
</script>

<style scoped>
  /* 父组件的样式可以对子组件样式影响 */
  .my-icon-container{ 
    font-size: 26px;
    color: #f40
  }

</style>
