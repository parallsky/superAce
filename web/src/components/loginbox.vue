<template>
  <div class="dkform-box padbot10 login-box">
    <van-tabs v-model="activeType">
      <van-tab title="管理员DK账号" name="leagues">
        <van-field v-model="saccount" clearable center type="text" label-width="0" label="" :placeholder="(this.userActor == 'clubs' ? '联盟' : '平台') + '分配的DK账号'" />
      </van-tab>
      <van-tab title="客服DK账号" name="kefu">
        <van-field v-model="saccount" clearable center type="text" label-width="0" label="" :placeholder="(this.userActor == 'clubs' ? '俱乐部' : '联盟') + '管理员分配的DK账号'" />
      </van-tab>
    </van-tabs>
    <div class="">
      <van-field label-width="0" clearable v-model="password" type="text" label="" placeholder="输入DK账号登录密码" />
    </div>
    <div class="margtop10 padtop10">
      <van-button type="primary" block :loading="btnClick" loading-text="正在登录..." @click="onLoginMyAccount">立即登录</van-button>
    </div>
  </div>
</template>
<script>
import serviceApi from '@/service/index'
import newService from '@/service/newReq'
import axios from 'axios'
import appConfig from '@/config/index'

export default {
  components: {},
  props: {
    isCheck: Boolean,
  },
  data() {
    return {
      btnClick: false,
      saccount: '',
      password: '',
      countryCode: '86',
      phoneNum: '',
      activeType: 'phoneType',
      verifyCode: '',
      popLayerLock: false,
      loginResInfo: {},
      preTitle: '俱乐部'
    }
  },
  mounted() {
    if(this.userActor == 'clubs') {

    }
  },
  methods: {
    async onLoginMyAccount() {
      if(this.btnClick) {
        return false
      }
      this.btnClick = true
      let objs = {
        saccount: this.saccount.trim(),
        password: this.password.trim(),
        activeType: this.activeType
      }

      let res = await newService({
        url: '/api/account/newLogin',
        data: objs
      })
      if(res) {
        this.$emit('login-success', res.data)
      }
      this.btnClick = false
    }
  }
}
</script>
<style lang="less" scoped>
.login-box {
  // width: 100%;
  max-width: 550px;
  margin: 0 auto;
}
.form-label {
  width: 60px;
  font-size: 15px;
  text-align: left;
}
</style>
