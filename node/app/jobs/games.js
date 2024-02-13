
// 做账号的永久登录，做token的获取刷新
// login ： 取出所有的合法的账号，登录， 成功就结束，不成功不处理

// 只获取clubs列表，做分拣装桶
const myredis = require('../redis/index')
const models = require('../models/index')
const dayjs = require('dayjs')
const services = require('../services/index')

let historyGameCheck = async () => {
  let lockKey = 'wpk:history:game:lock'
  let leagueId = await myredis.games.freshListPop()
  if(leagueId) {
    let mylock = await global.lock(lockKey + leagueId, 10000)
    if(!mylock) {
      return false
    }
    try {
      await services.games.historyGameJob(leagueId)
    } catch(err) {
      console.log(`[error] historyGameCheck freshfail lid:${leagueId} err:`, err)
    }
    await global.unlock(mylock)
    return true
  }
  return 'noJob'
}

let currentGameCheck = async () => {
  let lockKey = 'wpk:current:game:lock'
  let leagueId = await myredis.games.freshListPop(true)
  if(leagueId) {
    let mylock = await global.lock(lockKey + leagueId, 30000)
    if(!mylock) {
      return false
    }
    try {
      await services.games.currentGameJob(leagueId)
    } catch(err) {
      console.log(`[error] currentGameCheck freshfail lid:${leagueId} err:`, err)
    }
    await global.unlock(mylock)
    return true
  }
  return 'noJob'
}

let liveGradeCheck = async () => {
  let lockKey = 'wpk:grades:livedetail:lock'
  let roomId = await myredis.grades.currentSpop()
  if(roomId) {
    let mylock = await global.lock(lockKey + roomId.split('_')[0], 10000)
    if(!mylock) {
      return false
    }
    try {
      await services.games.liveGradeJob(roomId)
    } catch(err) {
      console.log(`[error] liveGradeCheck freshfail lid:${roomId} err:`, err)
    }
    await global.unlock(mylock)
    return true
  }
  return 'noJob'
}

let historyGradeCheck = async () => {
  let lockKey = 'wpk:grades:detail:lock'
  let roomId = await myredis.grades.historySpop()
  if(roomId) {
    let mylock = await global.lock(lockKey + roomId.split('_')[0], 90000)
    if(!mylock) {
      return false
    }
    try {
      await services.games.historyGradeJob(roomId)
    } catch(err) {
      console.log(`[error] historyGradeJob freshfail lid:${roomId} err:`, err)
    }
    await global.unlock(mylock)
    return true
  }
  return 'noJob'
}

let playLogOneJob = async () => {
  let lockKey = 'wpk:playlog:lock'
  let roomId = await myredis.playlog.freshListPop()
  if(roomId) {
    let infos = roomId.split('_')
    if(infos.length != 3) {
      return false
    }
    let mylock = await global.lock(lockKey +  + infos[0], 120000)
    if(!mylock) {
      return false
    }
    try {
      await services.playlog.playLogGetJobNew({
        roomId: infos[0],
        userId: infos[1],
        handTotal: infos[2]
      })
    } catch(err) {
      console.log(`[error] playLogGetJobNew freshfail lid:${roomId} err:`, err)
    }
    await global.unlock(mylock)
    return true
  }
  return 'noJob'
}

let autoCreateTableJob = async () => {
  // 获取所有schema，联盟正常状态，开局开关打开
  let schemes = await models.wpk_schemes.selectAutoSchemes({
    startTime: dayjs().subtract(24, 'hour').valueOf()
  })

  console.log('autoCreateTableJob ---->', schemes)
  if(!schemes || !schemes.length) {
    return true
  }

  // 循环schemas
  let roomInfos = {}
  for(let i = 0; i < schemes.length; i ++) {
    let item = schemes[i]
    if(item.nowTotalGame && item.maxAutoNum && item.nowTotalGame >= item.maxAutoNum) {
      continue
    }

    // 检查是否存在，不存在创建
    let res = await myredis.tables.autoCreateGet( item.schemeId)
    if(!res) {
      await services.leagues.createSchemaTable({
        userId: item.userId,
        leagueId: item.leagueId,
        gradeHours: item.gradeHours
      }, item.schemeId)
      continue
    }
    roomInfos[res] = item
  }

  let roomIds = Object.keys(roomInfos)
  console.log('autoCreateTableJob roomIds---->', roomIds)
  if(!roomIds.length) {
    return true
  }

  let roomDbs = await models.wpk_games.select({
    roomId: ` in(${roomIds.join(',')})`
  })
  if(!roomDbs) {
    return true
  }

  // 存在的room是否开始，未开始，不创建
  let notCreates = {}
  roomDbs.forEach(item => {
    // 开始了，看看里面有几个位置，<=2，创建
    if(item.roomStatus == 3 || (item.personNumMax - item.personNumPlay > 0 && item.roomStatus != 4)) {
      notCreates[item.roomId] = 1
    }
  })

  for(let roomId in roomInfos) {
    if(notCreates[roomId]) {
      continue
    }
    let item = roomInfos[roomId]
    await services.leagues.createSchemaTable({
      userId: item.userId,
      leagueId: item.leagueId,
      gradeHours: item.gradeHours
    }, item.schemeId)
  }
}

module.exports = {
  historyGameCheck,
  currentGameCheck,
  liveGradeCheck,
  historyGradeCheck,
  playLogOneJob,
  autoCreateTableJob
}
