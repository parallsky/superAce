import serviceApi from '@/service'
import Vue from 'vue'
import { loginPage } from '@/libs/util'

export default {
  state: {
    accountInfo: {},
    leagueList: []
  },
  mutations: {
    setAccountInfo (state, accountInfo) {
      state.accountInfo = accountInfo
    },
    setLeagueList (state, clubList) {
      state.leagueList = clubList
    }
  },
  getters: {},
  actions: {
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          let url = '/api/users/userInfos'
          serviceApi({
            url: url
          }).then(data => {
            if (data.errorCode === 0) {
              data = data.data
              let accountInfo = data.accountInfo
              commit('setAccountInfo', accountInfo)
              commit('setLeagueList', data.leagueList)

              if(data.leagueList.length > 0) {
                let tmps = data.leagueList[0]
                if(tmps.unionStatus == 1) {
                  if(accountInfo.isAdmin) {
                    // commit('setGoGoUserId', data.leagueList[0].unionUserId)
                  } else {
                    commit('setMyLeagueInfo', data.leagueList[0])
                  }
                }
              }

              resolve(data)
            } else {
              reject && reject(data)
            }
          }).catch(err => {
            console.log(err)
            reject(err)
          })
        } catch (error) {
          console.log(error)
          reject(error)
        }
      })
    },
  }
}
