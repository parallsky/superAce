<template>
  <div class="wapmain-box">
    <div class="nav-banner" v-show="!isChatPage && !isSecondPage">
      <div class="flex-box">
        <div class="avatar">
          <span>王</span>
        </div>
        <div class="user-name">
          <div class="name">王大拿的快乐时光</div>
          <div class="userid">82398547</div>
        </div>
        <div class="user-wallet">
          <div class="text">当前真气值</div>
          <div class="fund">
            <span class="fund-add"><van-icon name="add-o" /></span>
            <span>100000</span>
          </div>
        </div>
      </div>
      <div class="login-tip-box">
        <div class="tips">登录你的圈子账号，探索更多权限</div>
        <div class="login-box">
          <a href="javascript:void(0);" class="login-btn" @click="gotoPage('more_login')">立即登录</a>
        </div>
      </div>
    </div>
    <div class="" v-show="isSecondPage">
      <div class="second-nav" @click="gotoBackPage()">
        <div class="back-icon">
          <van-icon name="arrow-left" />
        </div>
        <div class="title">
          {{title}}
        </div>
      </div>
    </div>
    <div class="wapcontent-box">
      <keep-alive>
        <router-view class="wapcontent-right-pad" :class="{'wapcontent-right': menuOpenStatus}" />
      </keep-alive>
    </div>
    <van-tabbar v-show="!isSecondPage" v-model="activeTab" @change="onChange" :safe-area-inset-bottom="true" :route="true">
      <van-tabbar-item icon="chat-o" name="chat" :to="{'name': 'chat_index'}">消息</van-tabbar-item>
      <van-tabbar-item icon="friends-o" name="quanzi" :to="{'name': 'quanzi_index'}">圈子</van-tabbar-item>
      <van-tabbar-item icon="aim" name="find" :to="{'name': 'find_index'}">探索</van-tabbar-item>
      <van-tabbar-item icon="cart-o" name="tool" :to="{'name': 'tool_index'}">道具</van-tabbar-item>
      <van-tabbar-item icon="apps-o" name="more" :to="{'name': 'more_index'}">更多</van-tabbar-item>
    </van-tabbar>
    <van-popup v-model="popOpenStatus" closeable position="left" :style="{ width: '95%', height: '100%', 'max-width': '600px' }" >
      <div class="padvfix textcenter font-normal">

      </div>
    </van-popup>
  </div>
</template>
<script>
import serviceApi from '@/service/index'

export default {
  name: 'Main',
  components: {
  },
  data() {
    return {
      menulist: [],
      firstMenu: {},
      subMenuList: {},
      popOpenStatus: false,
      mainMenu: '',
      userActor: window._userActor,
      subMenu: '',
      notNeedPush: false,
      menuOpenStatus: true,
      popType: '',
      superInfoList: {},
      btnLock: false,
      targetLevel: '',
      levelList: [],
      showPicker: false,
      freshInit: null,
      activeTab: 'find'
    }
  },
  computed: {
    isChatPage(){
      console.log('this.$route.name ---->', this.$route)
      return this.$route.name.indexOf('chat_') > -1
    },
    isSecondPage() {
      return this.$route.name.indexOf('_index') == -1
    },
    title() {
      return this.$route.meta.title || '标题'
    }
  },
  watch: {
  },
  mounted() {
    // console.log('this.$route.name ---->', this.$route)
    // this.initMenu(true)
    // if(!this.freshInit) {
    //   this.freshInit = setInterval(() => {
    //     if(!this.btnLock) {
    //       this.onApplyClub(true)
    //     }
    //   }, 5000)
    // }
    // window._myAudio = new Audio()
    // window._myAudio.muted = false
    // window._myAudio.volume = 0.9
  },
  methods: {
    gotoBackPage() {
      this.$router.go(-1)
    },
    onChange() {

    },
    onOpenPop(type) {
      this.popType = type
      this.popOpenStatus = true
    },
    onApplyClub() {
      serviceApi({
        url: '/api/users/buyinList',
        data: {
          needCount: true
        }
      }).then((res) => {
        if (res.errorCode === 0) {
          if(res.data.counts > 0 && res.data.counts != this.currentBuyinCount) {
            this.audioPlay()
          }
          this.$store.commit('setMsgCount', res.data.counts)
        }
      }).catch(() => {
      })
    },
    clearCreditRq(opType) {
      if(this.btnLock) {
        return
      }
      this.btnLock = true
      serviceApi({
        url: '/api/clubs/clearAllCredit',
        data: {
          opType
        }
      }).then((res) => {
        if (res.errorCode === 0) {
          if(opType == 'cancel') {
            this.$SuccessTip('已忽略')
          } else {
            this.$SuccessTip('成功恢复所有账户的余额为初始信用')
          }
          // this.creditClearBtn = false
          let tmp = this.accountInfo
          tmp.clearOpTime = res.data.reslog
          this.$store.commit('setAccountInfo', tmp)
          // this.accountInfo.clearOpTime = res.data.reslog
        } else {
          this.$ErrorTip(res.data || '请求错误', {
            duration: 2000
          })
        }
        this.btnLock = false
      }).catch(() => {
        this.$ErrorTip('网络错误')
        this.btnLock = false
      })
    },
    clearAllCredit(opType) {
      if(opType == 'cancel') {
        this.clearCreditRq(opType)
      } else {
        this.$Confirm({
          title: '清理所有账户变化',
          message: `清理玩家共享账户变化额度即恢复玩家的账户余额为初始信用额度，确定要进行所有共享账户的清理操作吗？`,
          onOk: () => {
            this.clearCreditRq(opType)
          },
          onCancel: () => {}
        })
      }
    },
    freshClubInfo(clubId) {
      serviceApi({
        url: '/api/clubs/clubInfoCmsRq',
        data: {
          clubId: clubId
        }
      }).then((res) => {
        if (res.errorCode === 0) {
          this.$set(this.superInfoList, clubId, res.data)
        } else {
          this.$ErrorTip(res.data || '请求错误', {
            duration: 2000
          })
        }
      }).catch((e) => {
        console.log(e)
        this.$ErrorTip('网络错误')
      })
    }
  },
  destroyed() {
    if(this.freshInit) {
      clearInterval(this.freshInit)
    }
  }
}
</script>
<style lang="less">
.wapmain-box {
  height: 100%;
  margin-top: 0;
  .wapmain-bottom-menu {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    .tab-box {
      position: relative;
      background-color: @color-green;
    }
  }
  .wapcontent-box {
    padding-bottom: 80px;
  }
  .nav-banner {
    padding: 10px 6px;
    background-color: white;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 36px;
      background-color: @color-light-green;
      color: white;
      font-weight: bold;
      padding-left: 7px;
      line-height: 36px;
      font-size: 22px;
    }
    .user-name {
      padding-left: 5px;
      .name {
        font-size: 13px;
        color: #666;
      }
      .userid {
        font-size: 18px;
        // font-weight: 400;
        color: #555;
      }
    }
    .user-wallet {
      flex: 1;
      text-align: right;
      .text {
        font-size: 12px;
        color: #666;
      }
      .fund {
        font-size: 20px;
        color: @color-light-green;
        // font-weight: 400;
        line-height: 24px;
        .fund-add {
          font-size: 12px;
          color: @color-light-green;
          vertical-align: middle;
        }
      }
    }
  }
  .login-tip-box {
    text-align: center;
    .tips {
      font-size: 13px;
      color: #999;
    }
    .login-box {
      margin-top: 5px;
      font-size: 18px;
      a {
        color: @color-green;
      }
    }
  }
  .second-nav {
    // padding-top: 10px;
    // padding-bottom: 10px;
    background-color: #fff;
    text-align: center;
    .title {
      font-size: 20px;
      line-height: 48px;
      font-weight: 300px;
      color: #333;
    }
    .back-icon {
      position: absolute;
      left: 0;
      top: 0;
      font-size: 28px;
      line-height: 28px;
      padding: 10px 10px;
    }
  }
}

</style>
