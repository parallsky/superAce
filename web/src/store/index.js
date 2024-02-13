import Vue from 'vue'
import Vuex from 'vuex'
import serviceApi from '@/service'

Vue.use(Vuex)

let createStore = async (mode) => {
  let user = (await import('./module/user')).default

  let obj = {
    state: {
      _myLeagueInfo: {},
      _GogoLeagueId: 0,
      _GogoUserId: 0,
      _GogoSubClubId: 0,
      _leagueSubClubs: [],
      _mySubClubs: [],
      logTypeText: {},
      gameTypeName: {},
      gameStatusText: {},
      normalConfigInfo: {},
      buyStypeText: {},
      blindGradeObj: {},
      blindGrades: [],
      audioLock: false,
      currentBuyinCount: 0
    },
    mutations: {
      setMyLeagueInfo(state, info) {
        state._myLeagueInfo = info
        state._GogoLeagueId = info.leagueId
      },
      setMyLeagueOneKey(state, info) {
        state._myLeagueInfo = info
      },
      setGoGoUserId(state, info) {
        state._GogoUserId = info
      },
      setGogoSubClubId(state, info) {
        state._GogoSubClubId = info
      },
      setLeagueSubClubs(state, info) {
        state._leagueSubClubs = info
      },
      setMySubClubs(state, info) {
        state._mySubClubs = info
      },
      setMsgCount(state, info) {
        state.currentBuyinCount = info
      },
      setAudio (state, lock) {
        state.audioLock = lock
      },
    },
    actions: {
      getSubClubsList() {
        if(!this.state._GogoLeagueId) {
          this.commit('setLeagueSubClubs', [])
        }else {
          serviceApi({
            url: '/api/leagues/getSubClubs',
            data: {}
          }).then((res) => {
            if (res.errorCode === 0) {
              this.commit('setLeagueSubClubs', res.data)
            } else {
              window._Vue.$ErrorTip(res.data || '请求错误：获取子俱乐部', {
                duration: 2000
              })
            }
          }).catch((err) => {
            console.log('网络报错：', err)
            window._Vue.$ErrorTip('网络错误：获取子俱乐部')
          })
        }
      },
      getMySubClubsList() {
        serviceApi({
          url: '/api/users/getMySubClubs',
          data: {
            onlyMe: true
          }
        }).then((res) => {
          if (res.errorCode === 0) {
            this.commit('setMySubClubs', res.data)
          } else {
            window._Vue.$ErrorTip(res.data || '请求错误：获取子俱乐部', {
              duration: 2000
            })
          }
        }).catch((err) => {
          console.log('网络报错：', err)
          window._Vue.$ErrorTip('网络错误：获取子俱乐部')
        })
      },
      initConfigInfo({ state, commit }) {
        return new Promise((resolve, reject) => {
          try {
            serviceApi({
              url: '/api/baseinfo'
            }).then(data => {
              if (data.errorCode === 0) {
                for(let key in data.data) {
                  state[key] = data.data[key]
                }

                let version = data.data.cmsVersion
                if (!window.__CurrentVersion__) {
                  window.__CurrentVersion__ = version
                } else {
                  if(window.__CurrentVersion__ !== version) {
                    Vue.prototype.$Confirm({
                      title: '更新提示',
                      message: `最新版本<span class="colorred font-normal">${version}</span>已发布上线，是否更新至最新版本？`,
                      cancelButtonText: '下次再说',
                      confirmButtonText: '立即更新',
                      onOk: () => {
                        window.location.reload()
                      },
                      onCancel: () => {
                        // window.__CurrentVersion__ = res.data.version
                      }
                    })
                  }
                }
                resolve(true)
              } else {
                console.log('errorCode ===>')
                resolve(false)
              }
            }).catch(err => {
              console.log(err)
              resolve(false)
            })
          } catch (error) {
            console.log(error)
            resolve(false)
          }
        })
      },
    },
    modules: {
      user
    }
  }
  return new Vuex.Store(obj)
}

export default createStore
