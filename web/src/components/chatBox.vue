<template>
  <div class="chat-panel">
    <div class="font-middle padvfix textcenter">
      <div>{{roomInfo.roomTitle}}</div>
      <div class="font-small">{{roomInfo.roomId}}</div>
    </div>
    <div class="borderbot flex-box" v-for="(item, index) in recordList" :key="'chatbox-'+index">
      <div class="flex-item">
        <div v-if="item.userId">
          <span class="color-error">{{item.nickname}}</span>
          <span class="color-primary margleft5">{{item.userId}}</span>
          {{formatTime(item.createTime).substr(11)}}
        </div>
        <p v-if="item.userId" style="white-space: pre-line;">{{item.content}}</p>
        <p v-else style="">{{item.content}}</p>
      </div>
      <div class="textright">
        <div >
          <van-button v-if="item.userId != accountInfo.userId" plain size="mini" type="danger" @click="onDropMember(item)">拉黑</van-button>
          <van-button plain size="mini" type="info" @click="clickAtBtn(item)">@回复</van-button>
          <van-button plain size="mini" type="info" @click="sendMsgAgain(item)">再发一条</van-button>
        </div>
        <div class="" >
        </div>
      </div>
    </div>
    <div class="textleft borderfull foot-chatbox">
      <van-field
        v-model="msgText"
        rows="2"
        label=""
        type="textarea"
        maxlength="80"
        placeholder="输入文字信息"
        show-word-limit
      >
        <template #button>
          <div>
            <van-button plain size="mini" type="primary" @click="sendMessageClick">立即发送</van-button>
          </div>
          <div>
            <van-button plain size="mini" type="info" @click="getChatRecordList">刷新信息</van-button>
          </div>
        </template>
      </van-field>
    </div>
  </div>
</template>
<script>
import serviceApi from '@/service/newReq'

export default {
  name: 'dkchatInfo',
  components: {
  },
  props: {
    roomInfo: Object
  },
  data() {
    return {
      btnLock: false,
      msgText: '',
      recordList: []
    }
  },
  mounted() {
    this.getChatRecordList()
  },
  watch: {
    roomInfo(oldItem, newItem) {
      console.log('watch ===>')
      this.getChatRecordList()
    }
  },
  methods: {
    async getChatRecordList() {
      if(this.btnLock) {
        return false
      }
      this.btnLock = true
      let res = await serviceApi({
        url: '/api/leagues/getChatRecord',
        data: {
          roomId: this.roomInfo.roomId,
        }
      })

      if(res) {
        let list = (res.data.data || []).reverse()
        let reslist = []
        list.forEach(element => {
          if(element.userId) {
            reslist.push(element)
          }
        })
        this.recordList = reslist
      }
      this.btnLock = false
    },
    clickAtBtn(item) {
      this.msgText = `@${item.nickname} `
    },
    async sendMessageClick() {
      let text = this.msgText.trim()
      if(this.btnLock || !text) {
        return false
      }
      this.btnLock = true
      let res = await serviceApi({
        url: '/api/leagues/sendWpkMsgReq',
        data: {
          roomId: this.roomInfo.roomId,
          urlPath: this.roomInfo.urlPath,
          msgText: text
        }
      })

      if(res) {
        this.recordList.push({
          nickname: '我',
          userId: '',
          content: text,
          createTime: Date.now()
        })
        this.msgText = ''
      }
      this.btnLock = false
    },
    async sendMsgAgain(item) {
      let text = item.content
      if(this.btnLock || !text) {
        return false
      }
      this.btnLock = true
      let res = await serviceApi({
        url: '/api/leagues/sendWpkMsgReq',
        data: {
          roomId: this.roomInfo.roomId,
          msgText: text,
          urlPath: this.roomInfo.urlPath
        }
      })

      if(res) {
        this.recordList.push({
          nickname: '我',
          userId: this.accountInfo.userId,
          content: text,
          createTime: Date.now()
        })
        this.msgText = ''
      }
      this.btnLock = false
    },
    async onDropMember(item) {
      this.$Confirm({
        title: `拉黑玩家`,
        message: `确定要将玩家 <span class="color-primary">${item.nickname}</span>拉黑，永不允许再加入本联盟吗？`,
        onOk: async() => {
          if(this.btnLock) {
            return false
          }
          this.btnLock = true
          let res = await serviceApi({
            url: '/api/leagues/setBlackType',
            data: {
              userId: item.userId,
              blackType: 1,
              pageFrom: '聊天'
            }
          })
          if(res) {
            this.$SuccessTip(`成功拉黑玩家`)
          }
          this.btnLock = false
        },
        onCancel: () => {
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.chat-panel {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 120px;
}
.foot-chatbox {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
