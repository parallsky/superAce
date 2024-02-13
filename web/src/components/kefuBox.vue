<template>
  <div class="padtop20 textleft">
    <div class="padvfix20 color-error textcenter">选择操作者账号</div>
    <div v-for="(item, index) in kefuListData" :key="'subname-'+index" class="padvfix padfix flex-box borderbot">
      <div class="flex-item">
        <span class="font-middle color-primary">{{item.kefuName}}</span>
      </div>
      <div class="flex-item textright">
        <van-button size="mini" type="info" plain @click="onPickPlayer(item)">点击选择</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import serviceApi from '@/service/index'

export default {
  name: 'wpk_players',
  components: {},
  props: {
    searchLeagueId: Number
  },
  data() {
    return {
      btnLock: false,
      kefuListData: [],
    }
  },
  mounted() {
    this.freshLish()
  },
  methods: {
    freshLish() {
      if(this.btnLock) {
        return
      }
      this.btnLock = true
      serviceApi({
        url: '/api/users/kefuList',
        data: {}
      }).then((res) => {
        if (res.errorCode === 0) {
          this.kefuListData = [
          {
            kefuId: 0,
            kefuName: '任意操作者'
          }, {
            kefuId: -1,
            kefuName: '管理员'
          }].concat(res.data)
        } else {
          this.$ErrorTip(res.data || '请求错误', {
            duration: 2000
          })
        }
        this.btnLock = false
      }).catch((err) => {
        console.log('网络报错：', err)
        this.btnLock = false
        this.$ErrorTip('网络错误')
      })
    },
    onPickPlayer(item) {
      this.$emit('on-pickkf-success', item)
    },
  }
}
</script>
<style lang="less" scoped>
</style>
