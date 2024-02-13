<template>
  <div class="padbottom">
    <van-divider dashed>新建圈子/加入圈子</van-divider>
    <van-divider dashed>创建的圈子</van-divider>
    <van-divider dashed>加入的圈子</van-divider>
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
      popLayerBool: false,
      companyList: [],
      initInfo: {
        companyId: 0,
        companyName: '',
        diamondChargeLock: 0,
        banSubDiamond: 0,
        gradeHours: 0,
        telegramRobot: ''
      },
      companyInfo: {}
    }
  },
  activated() {},
  watch: {},
  mounted() {},
  methods: {
    openClubList() {
      this.companyInfo = Object.assign({}, this.initInfo)
      this.popType = 'new'
      this.popLayerBool = true
    },
    onEditBtnClick(item) {
      this.companyInfo = Object.assign({}, item)
      this.popType = 'edit'
      this.popLayerBool = true
    },
    async enSureBtnClick() {
      if(!this.companyInfo.companyId || !this.companyInfo.companyName) {
        this.$ErrorTip("参数不正确")
        return
      }

      if(this.btnLock) {
        return false
      }
      this.btnLock = true
      let res = await serviceApi({
        url: '/api/companys/editCompany',
        data: this.companyInfo
      })
      if (res) {
        this.$SuccessTip('操作完成')
        this.popLayerBool = false
        this.freshList()
      }
      this.btnLock = false
    },
    async freshList() {
      let res = await serviceApi({
        url: '/api/companys/companyList',
      })
      if (res) {
        this.$SuccessTip('刷新完成')
        let list = []
        res.data.forEach((element, index) => {
          element.indexNo = index
          list.push(element)
        })
        this.companyList = list
      }
    },
    copyAdminBtnClick(item) {
      let res = `
公司：${item.companyName}[${item.companyId}]
管理后台：${window.location.origin}
管理账号：${item.saccount }
管理密码：${item.password}
`
      return res
    },
    async onAdminBtnClick(item) {
      if(this.btnLock) {
        return false
      }
      this.btnLock = true
      let res = await serviceApi({
        url: '/api/companys/createLogin',
        data: item
      })
      if (res) {
        this.$SuccessTip('管理账号创建完成')
        let tmp = Object.assign({}, item)
        tmp.saccount = res.data.saccount
        tmp.password = res.data.password
        tmp.unionUserId = res.data.unionUserId
        this.$set(this.companyList, item.indexNo, tmp)
      }
      this.btnLock = false
    },
    async onEnsureTheComp(item) {
      // 设置管理信息为当前账户信息
    }
  }
}
</script>
<style lang="less" scoped>
</style>
