<template>
  <div class="padvfix20 font-small flex-box" :class="{'flex-box': formType == 'login'}">
    <div class="color-gray textcenter flex-item" v-clipboard="{value: letsTalk}">
      <span class="color-primary font-normal">{{ letsTalk }}</span>
      <div class="padtop5">Letstalk</div>
    </div>
    <div class="flex-item color-gray textcenter" v-clipboard="{value: telegram}">
      <span class="color-primary font-normal">{{ telegram }}</span>
      <div class="padtop5">Telegram</div>
    </div>
    <!-- <div class="flex-item color-gray textcenter" v-clipboard="{value: tiChart}">
      <span class="color-primary font-normal">{{ tiChart }}</span>
      <div class="padtop5">Tichat</div>
    </div> -->
    <!-- <div class="flex-item color-gray textcenter" v-clipboard="{value: batChat}">
      <span class="color-primary font-normal">{{ batChat }}</span>
      <div class="padtop5">蝙蝠</div>
    </div> -->
  </div>
</template>
<script>
import appConfig from '@/config/index'

export default {
  name: 'letstalk',
  props: {
    formType: String
  },
  components: {
  },
  data() {
    return {
      copyText: '',
      copySuccText: '',
      letsTalk: appConfig.letsTalk,
      telegram: appConfig.telegram,
      tiChart: appConfig.tiChart,
      batChat: appConfig.batChat
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
</style>
