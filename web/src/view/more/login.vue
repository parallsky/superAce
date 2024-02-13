<template>
  <div class="">
    <!-- <van-notice-bar
      color="#3DD4A7"
      background="#f8f8f8"
      wrapable
      :scrollable="false"
      text="使用圈子账号和圈子密码登录，探索更多功能。"
    /> -->

    <div class="big-title">
      圈子
      <div class="sub-title">
        登录圈子，探索更多功能
      </div>
    </div>
    <div class="user-more-info margtop10">
      <!-- <div class="form-title">
        登录圈子，探索更多功能
      </div> -->
      <div class="">
        <van-cell-group>
            <van-field
              v-model="qzCountry"
              label="国家码"
              :label-width="60"
              left-icon="plus"
              placeholder="输入国家编号代码"
            />
            <van-field
              v-model="qzAccount"
              label="手机号"
              :label-width="60"
              left-icon="contact"
              placeholder="圈子平台登录账号"
            />
            <van-field
              v-model="qzPassword"
              clearable
              :label-width="60"
              label="密码"
              left-icon="eye-o"
              placeholder="圈子平台登录密码"
            />
        </van-cell-group>
        <div class="margtop5 flex-box padlr10">
          <div class="flex-item">
            <a href="javascript:void(0);" class="link-btn" @click="gotoPage('more_regist')">立即注册</a>
          </div>
          <div class="flex-item textright">
            <a href="javascript:void(0);" class="link-btn" @click="gotoPage('more_regist')">忘记密码？</a>
          </div>
        </div>
        <div class="margtop40 padlr10">
          <van-button type="info" plain block>立即登录</van-button>
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
      qzCountry: '86',
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
