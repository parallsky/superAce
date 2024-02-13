<template>
  <div class="">
    <van-notice-bar
      color="#3DD4A7"
      background="#f8f8f8"
      wrapable
      :scrollable="false"
      text="使用圈子账号和圈子密码登录，探索更多功能。"
    />
    <div class="user-more-info margtop10">
      <div class="form-title">
        输入圈子账号信息
      </div>
      <div class="">
        <van-cell-group>
          <div>
            <van-field
              v-model="qzAccount"
              label="圈子账号"
              :label-width="70"
              left-icon="contact"
              placeholder="圈子平台登录账号"
            />
            <van-field
              v-model="qzPassword"
              clearable
              :label-width="70"
              label="圈子密码"
              left-icon="eye-o"
              placeholder="圈子平台登录密码"
            />
          </div>
        </van-cell-group>
        <div class="margtop20">
          <van-button type="primary" plain block>立即登录</van-button>
        </div>
        <!-- <div class="regist-box">
          没有账号，<a href="javascript:void(0);" class="regist-btn" @click="gotoPage('more_regist')">前往注册</a>
        </div> -->
      </div>
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
      qzAccount: '',
      qzPassword: ''
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
