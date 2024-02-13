import config from '@/config'
import dayjs from 'dayjs'
import serviceApi from '@/service/index'

export default {
  data() {
    return {
      letsTalk: config.letsTalk,
      telegram: config.telegram,
      isMobile: this.$isMobile || false,
      userActor: window._userActor,
      appUrls: {
        docs: config.docSite
      },
    }
  },
  computed: {
    audioLock() {
      if(this.$store && this.$store.state) {
        return this.$store.state.audioLock
      }
      return false
    },
    currentBuyinCount() {
      if (this.$store && this.$store.state) {
        return this.$store.state.currentBuyinCount
      }
      return {}
    },
    currentLeagueInfo() {
      if (this.$store && this.$store.state) {
        return this.$store.state._myLeagueInfo
      }
      return {}
    },
    currentLeagueId() {
      if (this.$store && this.$store.state) {
        return this.$store.state._GogoLeagueId
      }
      return {}
    },
    blindGrades() {
      if (this.$store && this.$store.state) {
        return this.$store.state.blindGrades
      }
      return []
    },
    playerLoginHost1() {
      if (this.$store && this.$store.state) {
        return this.$store.state.playerLoginHost1
      }
      return []
    },
    diamondUserId() {
      if (this.$store && this.$store.state) {
        return this.$store.state.diamondUserId
      }
      return 0
    },
    blindGradeObj() {
      if (this.$store && this.$store.state) {
        return this.$store.state.blindGradeObj
      }
      return []
    },
    diamondList() {
      if (this.$store && this.$store.state) {
        return this.$store.state.diamondList
      }
      return []
    },
    accountInfo() {
      if (this.$store && this.$store.state && this.$store.state.user) {
        return this.$store.state.user.accountInfo
      }
      return {}
    },
    leagueList() {
      if (this.$store && this.$store.state && this.$store.state.user) {
        return this.$store.state.user.leagueList || []
      }
      return []
    },
    leagueListObj() {
      if (this.$store && this.$store.state && this.$store.state.user) {
        let tmp = {}
        this.$store.state.user.leagueList.forEach(element => {
          tmp[element.leagueId] = element
        })
        return tmp
      }
      return {}
    },
    leaguePicks() {
      let initOption = {
        text: '选择联盟', value: 0
      }
      if (this.$store && this.$store.state && this.$store.state.user) {
        let tmp = [initOption]
        this.$store.state.user.leagueList.forEach(element => {
          if(!element.unionStatus && !this.$store.state.user.accountInfo.isAdmin) {
            return
          }
          tmp.push({
            text: element.leagueName, value: element.leagueId
          })
        })
        console.log('leaguePicks ---->', tmp)
        return tmp
      }
      return [initOption]
    },
    buyStypeText() {
      if (this.$store && this.$store.state) {
        return this.$store.state.buyStypeText
      }
      return {}
    },
    logId2Title() {
      if (this.$store && this.$store.state) {
        return this.$store.state.logId2Title
      }
      return {}
    },
    logTitle2Id() {
      if (this.$store && this.$store.state) {
        return this.$store.state.logTitle2Id
      }
      return {}
    },
    opLogTitle() {
      if (this.$store && this.$store.state) {
        return this.$store.state.opLogTitle
      }
      return {}
    },
    gameTypeName() {
      if (this.$store && this.$store.state) {
        return this.$store.state.gameTypeName
      }
      return {}
    },
    gameStatusText() {
      if (this.$store && this.$store.state) {
        return this.$store.state.gameStatusText
      }
      return {}
    },
    mySubClubs() {
      if (this.$store && this.$store.state) {
        return this.$store.state._mySubClubs || []
      }
      return []
    },
    mySubClubNames() {
      if (this.$store && this.$store.state) {
        let tmp = {}
        this.$store.state._mySubClubs.forEach(item => {
          tmp[item.subClubId] = item.subClubName
        })
        return tmp
      }
      return {}
    },
    leagueSubClubs() {
      if (this.$store && this.$store.state) {
        return this.$store.state._leagueSubClubs || []
      }
      return []
    },
    leagueSubClubNames() {
      if (this.$store && this.$store.state) {
        let tmp = {}
        this.$store.state._leagueSubClubs.forEach(item => {
          tmp[item.subClubId] = item.subClubName
        })
        return tmp
      }
      return {}
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    audioPlay(type) {
      let list = {
        'buy': '/statics/buyin.mp3',
        'accept': '/statics/girl_acc.mp3',
        'deny': '/statics/boy_deny.mp3'
      }
      if(window._myAudio && this.audioLock) {
        window._myAudio.src = list[type || 'buy']
        window._myAudio.play()
      }
    },
    formatTime(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    },
    gotoPage(pageName, query) {
      this.$router.push({
        name: pageName,
        query
      })
    },
    getDiamondInfo(type) {
      for(let i = 0; i < this.diamondList.length; i ++){
        if(type == this.diamondList[i].id) {
          return this.diamondList[i]
        }
      }
      return false
    },
    updateLeagueSubClub(info) {
      let list = []
      this.leagueSubClubs.forEach(item => {
        if(info.subClubId == item.subClubId) {
          list.push(info)
        } else {
          list.push(item)
        }
      })
      this.$store.commit('setLeagueSubClubs', list)
    },
    updateLeagueList(info) {
      let list = []
      this.leagueList.forEach(item => {
        if(info.leagueId == item.leagueId) {
          list.push(info)
        } else {
          list.push(item)
        }
      })
      this.$store.commit('setLeagueList', list)
    },
    formatCredit(item) {
      return this.formatFloat(item.creditInit + item.creditCharge - item.creditBuying + item.creditGrade + item.gradeBenefit)
    },
    selfCreditCash(item) {
      return this.formatFloat(item.creditCharge - item.creditBuying + item.creditGrade + item.gradeBenefit)
    },
    subCashLeft(item) {
      return this.formatFloat(item.externalCredit + item.GradeTotal + item.GradeBenefit)
    },
    subCashLeftPlus(item) {
      if(item.maxLoseNum > item.BuyinTotal) {
        return this.formatFloat( item.externalCredit + item.GradeTotal + item.GradeBenefit)
      } else {
        return this.formatFloat( item.maxLoseNum + item.externalCredit + item.GradeTotal + item.GradeBenefit - item.BuyinTotal )
      }
    },
    subMaxLoseLeft(item) {
      return this.formatFloat(item.maxLoseNum + item.externalCredit + item.GradeTotal  + item.GradeBenefit)
    },
    subMaxBuyinLeft(item) {
      return this.formatFloat(item.GradeTotal + item.externalCredit + item.GradeBenefit - item.BuyinTotal  + item.maxBuyIn )
    },
    formatFloat(item, sizelen) {
      if(typeof item === 'number') {
        if(~~item == item) {
          return parseInt(item)
        }
        return parseFloat(item.toFixed(sizelen || 2))
      }
      for(let i in item) {
        if(typeof item[i] === 'number') {
          let tmp = item[i]
          if(~~tmp == tmp) {
            item[i] = parseInt(tmp)
          } else {
            item[i] = parseFloat(tmp.toFixed( sizelen || 2 ))
          }
        }
      }
      return item
    }
  }
}
