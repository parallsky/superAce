
// 做账号的永久登录，做token的获取刷新
// login ： 取出所有的合法的账号，登录， 成功就结束，不成功不处理

// 只获取clubs列表，做分拣装桶
const myredis = require('../redis/index')
const models = require('../models/index')
const services = require('../services/index')

let buyinJobCheck = async () => {
  let lockKey = 'buyin:list:lock:'
  let leagueId = await myredis.applys.freshListPop()
  if(!leagueId) {
    return 'noJob'
  }
  try {
    let mylock = await global.lock(lockKey + leagueId, 5000)
    if(!mylock) {
      return true
    }
    await services.creditlogs.autoApplyJob(leagueId)
    await global.unlock(mylock)
  } catch(e) {
    console.log(`[error]job buyin autoApply lid:${leagueId} err:`, e)
  }

  return true
}

module.exports = {
  buyinJobCheck
}
