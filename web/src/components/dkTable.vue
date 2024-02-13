<template>
  <div>
    <van-row type="flex" justify="center">
      <van-col v-for="(item, index) in titles" :key="'dktable-title-' + index" :span="tableSpans[index]">{{item.title}}</van-col>
    </van-row>
    <div v-for="(item, index) in datas" :key="'dktable-con-' + index">
      <van-row type="flex" justify="center" class="padvfix bordertop">
        <van-col v-for="(subitem, subindex) in item" :key="'dktable-title-' + subindex" :span="tableSpans[subindex]">{{subitem[titles[index].colName]}}</van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dktable',
  components: {
  },
  props: {
    titles: Array,
    datas: Array
  },
  data() {
    let detaulSpan = Math.floor(24 / this.titles.length)
    let spans = []
    for(let i in this.titles) {
      if(this.titles[i].span) {
        spans.push(this.titles[i].span)
      } else {
        spans.push(detaulSpan)
      }
    }
    return {
      tableSpans: spans
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
</style>
