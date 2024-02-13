<template>
  <div class="font-middle">
    <div class="padvfix">
      应用下载地址
      <span class="color-success font-big">
        <van-icon name="replay" @click="getUrlInfo" />
      </span>
      <div class="font-small color-gray">获取时间{{formatTime(freshTime)}}</div>
    </div>
    <div class="flex-box">
      <div class="flex-item">
        <div>
          <van-button :loading="lockBtn" plain hairline size="mini" type="primary" v-clipboard="{value: getUrl('iosEnterprise')}">复制地址</van-button>
          <div>苹果企业版</div>
          <div>版本号<span class="color-error">{{iosEnterprise.version}}</span></div>
          <div class="font-small">发版<span class="color-primary">{{formatTime(iosEnterprise.updateTime)}}</span></div>
        </div>
      </div>
      <!-- <div class="flex-item">
        <div>
          <van-button :loading="lockBtn" plain hairline size="mini" type="primary" v-clipboard="{value: getUrl('iosEnterprise')}">复制地址</van-button>
          <div>苹果TF版本</div>
          <div>苹果<span class="color-error">{{iosEnterprise.version}}</span></div>
          <div class="font-small">发版<span class="color-primary">{{formatTime(iosEnterprise.updateTime)}}</span></div>
        </div>
      </div> -->
      <div class="flex-item">
        <div>
          <van-button :loading="lockBtn" plain hairline size="mini" type="primary" v-clipboard="{value: getUrl('android')}">复制地址</van-button>
          <div>安卓<span class="color-error">{{android.version}}</span></div>
          <div class="font-small">发版<span class="color-primary">{{formatTime(android.updateTime)}}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import newService from '@/service/newReq'

export default {
  components: {},
  props: {
    isCheck: Boolean,
  },
  data() {
    return {
      lockBtn: false,
      freshTime: 0,
      iosEnterprise: {},
      android: {}
    }
  },
  mounted() {
    this.getUrlInfo()
  },
  methods: {
    async getUrlInfo() {
      if(this.btnClick) {
        return false
      }
      this.btnClick = true
      let res = await newService({
        url: '/api/account/getDownloadConfig',
        data: {}
      })
      if(res) {
        res = res.data
        this.freshTime = res.sysTime
        this.iosEnterprise = res.data.iosEnterprise
        this.android = res.data.android
      }
      this.btnClick = false
    },
    getUrl(type) {
      let url = this[type].downUrl

      return `
WPK${type == 'android' ? '安卓应用下载' : '苹果应用下载'}
当前版本：${this[type].version}
当前版本：${this[type].name}
发布时间：${this.formatTime(this[type].updateTime)}
下载地址：（请复制完整地址）
${url}

${type == 'android' ? '* 请卸载旧软件后再重载，避免使用 uc、360、微信 打开链接，请使用国际浏览器：Chrome、Firefox。' : '请使用safari浏览器打开下载地址'}
`
    }
  }
}
</script>
<style lang="less" scoped>
</style>
