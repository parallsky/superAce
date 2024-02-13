
// 做账号的永久登录，做token的获取刷新
// login ： 取出所有的合法的账号，登录， 成功就结束，不成功不处理

// 只获取clubs列表，做分拣装桶
const myredis = require('../redis/index')
const models = require('../models/index')
const config = require('config')
const services = require('../services/index')

let tokenCheck = async () => {
  let lockKey = 'wpk:token:fresh:lock'
  let userId = await myredis.token.freshListPop()
  if(userId) {
    let mylock = await global.lock(lockKey + userId, 10000)
    if(!mylock) {
      return false
    }
    try {
      await services.accounts.tokenFreshJob(userId)
    } catch(err) {
      console.log(`[error] tokenCheck freshfail uid:${userId} err:`, err)
    }
    await global.unlock(mylock)
    return true
  }
  return 'noJob'
}

let memberCheck = async () => {
  let lockKey = 'wpk:members:lock'
  let leagueId = await myredis.token.memberListPop()
  if(leagueId) {
    let mylock = await global.lock(lockKey + leagueId, 3 * 60 * 1000)
    if(!mylock) {
      return false
    }
    try {
      await services.accounts.memberFreshJob(leagueId)
    } catch(err) {
      console.log(`[error] memberCheck freshfail lid:${leagueId} err:`, err)
    }
    await global.unlock(mylock)
    return true
  }
  return 'noJob'
}

let diamondTokenCheck = async() => {
  if(!config.diamondUserId) {
    return true
  }
  let token = await myredis.token.tokenInfo(config.diamondUserId)
  if(!token || token == 'null') {
    return true
  }

  try {
    await services.accounts.getUserClubs(config.diamondUserId)
  } catch(err) {
    console.log(`[error] diamondTokenCheck freshfail err:`, err)
  }
}

module.exports = {
  tokenCheck,
  memberCheck,
  diamondTokenCheck
}
