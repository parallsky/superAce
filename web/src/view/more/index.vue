<template>
  <div class="">
    <div class="user-more-info">
      <!-- <van-divider dashed :style="{borderColor: '#1989fa'}">基础设置</van-divider> -->
      <van-cell-group inset>
      </van-cell-group>
      <!-- <van-divider dashed :style="{borderColor: '#1989fa'}">安全设置</van-divider> -->
      <van-cell-group inset class="margtop20">
        <!-- <van-cell title="切换账号" value="" is-link /> -->
        <van-cell title="游戏账号" value="管理" is-link />
        <van-cell title="登录密码" value="修改" label="" is-link />
        <van-cell title="锁屏密码" value="设置" is-link />
        <van-cell title="支付密码" value="设置" is-link />
        <van-cell title="支付账户管理" value="" label="" is-link />
      </van-cell-group>
      <!-- <van-divider dashed :style="{borderColor: '#1989fa'}">账号管理</van-divider> -->
      <van-cell-group inset class="margtop10">
        <van-cell title="声音设置" value="关" label="" is-link />
        <van-cell title="语言（Language）" value="简体中文" label="" is-link />
        <van-cell title="清理缓存" value="3MB" label="" is-link />
        <van-cell title="邀请好友" value="" label="" is-link />
        <van-cell title="关于我们" value="版本1.2.1" label="" is-link />
      </van-cell-group>
      <!-- <van-divider dashed :style="{borderColor: '#1989fa'}">退出当前账号</van-divider> -->
      <van-cell-group inset class="margtop20">
        <van-button type="default" size="large" block>退出</van-button>
      </van-cell-group>
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
