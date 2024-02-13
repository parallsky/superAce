<template>
  <div class="">
    <van-notice-bar
      color="#1989fa"
      background="#ecf9ff"
      wrapable
      :scrollable="false"
      text="花名只能设置一次，终身无法修改。"
    />
    <div class="form-title">
      输入花名
    </div>
    <van-cell-group>
      <van-field
        v-model="value1"
        :label-width="0"
        label=""
        placeholder="花名长度为15个汉字或30个英文字符"
      />
    </van-cell-group>
    <div class="margtop20">
      <van-button type="info" plain block>立即确认</van-button>
    </div>
  </div>
</template>
<script>
import * as utils from '@/libs/util'
import serviceApi from '@/service/index'

export default {
  name: 'index_mainpage',
  components: {},
  data() {
    return {
      btnLock: false,
      popType: 'new',
      loginStatus: false,
      popLayerBool: false,
      platType: 1,
      loginModel: 'phone',
    }
  },
  activated() {},
  watch: {},
  mounted() {},
  methods: {
  }
}
</script>
<style lang="less" scoped>
</style>
