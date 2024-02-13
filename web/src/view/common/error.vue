<template>
  <div class="center-box error-box">
    <div class="title">出错啦～</div>
    <div class="desc">
      <span>页面不存在哦～</span>
      <a href="javascript:void(0);" @click="gotoPage('find_index')">返回首页</a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'error_page',
  components: {},
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.error-box {
  text-align: center;
  .title {
    .font-title;
    line-height: 60px;
  }
  .desc {
    font-size: 16px;
  }
}

</style>
