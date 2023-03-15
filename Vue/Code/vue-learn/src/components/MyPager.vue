<template>
  <div class="my-pager-container">
    <a @click="handleClick(1)" :class="{ disabled: currentPage === 1 }">|&lt;&lt;</a>
    <a @click="handleClick(currentPage - 1)" :class="{ disabled: currentPage === 1 }">&lt;&lt;</a>
    <a @click="handleClick(n)" v-for="n in numbers" :class="{ active: currentPage === n }" :key="n">{{ n }}</a>
    <a @click="handleClick(currentPage + 1)" :class="{ disabled: currentPage === pageNumber }">&gt;&gt;</a>
    <a @click="handleClick(pageNumber)" :class="{ disabled: currentPage === pageNumber }">&gt;&gt;|</a>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 10
    },
    visibleNumber: {
      type: Number,
      default: 10
    }
  },
  computed: {
    // 总页数
    pageNumber() {
      return Math.ceil(this.total / this.pageSize)
    },
    // 得到最小的页数
    visibleMin() {
      let min = this.currentPage - Math.floor(this.visibleNumber / 2);
      if (min < 1) {
        min = 1;
      }
      return min;
    },

    // 得到最大的页数
    visibleMax() {
      let max = this.visibleMin + this.visibleNumber - 1
      if (max > this.pageNumber) {
        max = this.pageNumber
      }
      return max
    },

    // 得到中间的数字
    numbers() {
      const res = []
      for (let i = this.visibleMin; i <= this.visibleMax; i++) {
        res.push(i)
      }
      return res
    }
  },
  methods: {
    handleClick(newPage) {
      if (newPage < 1) {
        newPage = 1
      }
      if (newPage > this.pageNumber) {
        newPage = this.pageNumber
      }

      if (newPage === this.currentPage) {
        return
      }
      this.$emit("pageChange", newPage)
    }
  }
}
</script>
<style lang="less" scoped>
@import url("~@/assets/styles/var.less");

/* @import url(); 引入css类 */
.my-pager-container {
  a {
    margin: 0 5px;
    color: @primary;

    &.disabled {
      cursor: not-allowed;
      color: @lightWords
    }

    &.active {
      cursor: text;
      color: @words;
      font-weight: bold;
    }
  }


}
</style>