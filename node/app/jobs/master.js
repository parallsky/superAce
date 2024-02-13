
// 做账号的永久登录，做token的获取刷新
// login ： 取出所有的合法的账号，登录， 成功就结束，不成功不处理

// 只获取clubs列表，做分拣装桶
const myredis = require('../redis/index')
const models = require('../models/index')
const utils = require('../utils/utils')
const config = require('config')
const dayjs = require('dayjs')
const services = require('../services/index')

let allJobBegin = async () => {
  // 1天过期还能用， today = 昨天
  let today = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

  let endDay = dayjs().format('YYYY-MM-DD')
  let leagueList = await models.wpk_accounts.selectWithUser({
    unionStatus: 1,
    leagueStatus: 0,
    userStatus: 0,
  })

  let gradedLeagues = []
  let leagueUsers = {}

  if(!leagueList) {
    console.log('[error] allJobBegin failed ')
    return true
  }

  let clubBuyinList = []
  let historyGameList = []
  let currentGameList = []
  let tokenList = []
  let memberList = []

  if(config.diamondUserId) {
    let token = await myredis.token.tokenInfo(config.diamondUserId)
    if(!token || token == 'null') {
      tokenList.push(config.diamondUserId)
    }
  }

  // leagueId一样


  let nowVal = Date.now()
  let nimute = 1000 * 60

  for(let i in leagueList) {
    let league = leagueList[i]

    // token的更新队列，2s检测
    let token = await myredis.token.tokenInfo(league.unionUserId)

    if(!token || token == 'null') {
      tokenList.push(league.unionUserId)
      continue
    }

    if(global.allJobBeginRate % 3 == 0) {
      let lockNow = await myredis.lockHash.memberLockGet(league.leagueId)
      if(!lockNow) {
        memberList.push(league.leagueId)
        // await myredis.lockHash.memberLockSet(league.leagueId, Date.now())
        continue
      } else if((nowVal - lockNow) > 10 * nimute){
        memberList.push(league.leagueId)
        // await myredis.lockHash.memberLockSet(league.leagueId, Date.now())
      }
      // memberList.push(league.leagueId)

    }

    gradedLeagues.push(league.leagueId)
    leagueUsers[league.leagueId] = league.unionUserId

    if(global.allJobBeginRate % 10 == 0) {
      // 获取成员列表 10 * 2s， 超过10分钟：请求一次wpk
      // if(currentLock === false) {
      //   continue
      // }

      // if(!lockNow || (nowVal - lockNow) >= 10 * 1000) {
      //   currentGameList.push(league.leagueId)
      // }
      currentGameList.push(league.leagueId)
    }

    if(global.allJobBeginRate % 3 == 0) {
      // 获取游戏列表 3 * 2s, 6个小时， 1个小时
      historyGameList.push(league.leagueId)
    }

    if(global.allJobBeginRate % 2 == 0) {
      if(!league.buyinClose ) {
        // 申请带入 2 * 2s 一次
        clubBuyinList.push(league.leagueId)
      }
    }
  }

  await myredis.token.freshListPush(tokenList)
  await myredis.token.memberListPush(memberList)

  await myredis.games.freshListPush(currentGameList, true)
  await myredis.games.freshListPush(historyGameList)

  await myredis.applys.freshListPush(clubBuyinList)

  let gradeCans = []
  if(gradedLeagues.length > 0) {
    // 读出所有战绩：结束的，未下载战绩的
    let nowVal = dayjs().subtract(16, 'day').valueOf()
    let unGradeList = await models.wpk_games.select({
      leagueId: ` in(${gradedLeagues.join(',')})`,
      roomStatus: `=4`,
      gradeStatus: `=0`,
      startTime: `>=${nowVal}`
    }, 16, ' order by startTime asc ')
    if(unGradeList && unGradeList.length) {
      // 存入队列，等待同步
      unGradeList.forEach(item => {
        gradeCans.push(`${item.roomId}_${leagueUsers[item.leagueId]}`)
      })
      if(gradeCans.length > 0) {
        await myredis.grades.historySadd(gradeCans)
      }
    }
  }

  console.log(`[info] masterJob token:${tokenList.join(',')} members:${memberList.join(',')} curr:${currentGameList.join(',')} history:${historyGameList.join(',')} apply:${clubBuyinList.join(',')}`)
}

let playLogCheck = async () => {
  let today = dayjs().format('YYYY-MM-DD')
  let leagueList = await models.wpk_accounts.selectWithUser({
    unionStatus: 1,
    leagueStatus: 0,
    userStatus: 0
  })

  if(!leagueList) {
    console.log('[error] gamingGradeCheck failed ')
    return true
  }

  let gradedLeagues = []
  let leagueUsers = {}

  for(let i in leagueList) {
    let league = leagueList[i]
    if(league.stopCardLogJob) {
      continue
    }
    let token = await myredis.token.tokenInfo(league.unionUserId)
    if(!token) {
      continue
    }
    gradedLeagues.push(league.leagueId)
    leagueUsers[league.leagueId] = league.unionUserId
  }

  let gradeLogs = []
  if(gradedLeagues.length > 0) {
    // 读出所有战绩：结束的，未下载战绩的， 每次5条
    let unGradeList = await models.wpk_games.select({
      leagueId: ` in(${gradedLeagues.join(',')})`,
      roomStatus: `=4`,
      gradeStatus: `=1`,
      currentBoutNum: `>0`,
      logStatus: `=0`,
      startTime: `>${dayjs().subtract( config.cardLogHour || 60, 'hour').valueOf()}`
    }, 100, ' order by startTime asc ' )

    if(unGradeList && unGradeList.length) {
      // 手数存入hash
      unGradeList.forEach(item => {
        gradeLogs.push(`${item.roomId}_${leagueUsers[item.leagueId]}_${item.currentBoutNum}`)
      })
    }

    if(gradeLogs.length) {
      await myredis.playlog.freshListPush(gradeLogs)
    }
  }

  console.log(`[info] playLogCheck len:${gradeLogs.length}`)
}

module.exports = {
  allJobBegin,
  playLogCheck
}
