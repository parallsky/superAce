let memberLockGet = async (clubId) => {
  let res
  try {
    res = await redisClient.hgetAsync(`wpk_joblock_${clubId}`, 'member')
    if(!res) {
      return 0
    }
    return parseInt(res)
  }catch(e){
    console.log(`[error]wpk_redis memberLockGet cid:${clubId} `, e)
    return false
  }
}

let memberLockSet = async(clubId, timeVal) => {
  try {
    await redisClient.hsetAsync(`wpk_joblock_${clubId}`, 'member', timeVal)
    return true
  }catch(e){
    console.log(`[error]wpk_redis memberLockSet uid:${clubId} token:${timeVal} err:`, e)
    return false
  }
}

let currentGameGet = async (clubId) => {
  let res
  try {
    res = await redisClient.hgetAsync(`wpk_joblock_${clubId}`, 'curgame')
    if(!res) {
      return 0
    }
    return parseInt(res)
  }catch(e){
    console.log(`[error]wpk_redis currentGameGet cid:${clubId}`, e)
    return false
  }
}

let currentGameSet = async(clubId, timeVal) => {
  try {
    await redisClient.hsetAsync(`wpk_joblock_${clubId}`, 'curgame', timeVal)
    return true
  }catch(e){
    console.log(`[error]wpk_redis currentGameSet uid:${clubId} token:${timeVal} err:`, e)
    return false
  }
}

let historyGameGet = async (clubId) => {
  let res
  try {
    res = await redisClient.hgetAsync(`wpk_joblock_${clubId}`, 'history')
    if(!res) {
      return 0
    }
    return parseInt(res)
  }catch(e){
    console.log(`[error]wpk_redis historyGameGet cid:${clubId}`, e)
    return false
  }
}

let historyGameSet = async(clubId, timeVal) => {
  try {
    await redisClient.hsetAsync(`wpk_joblock_${clubId}`, 'history', timeVal)
    return true
  }catch(e){
    console.log(`[error]wpk_redis historyGameSet uid:${clubId} token:${timeVal} err:`, e)
    return false
  }
}

module.exports = {
  memberLockSet,
  memberLockGet,
  currentGameSet,
  currentGameGet,
  historyGameGet,
  historyGameSet
}
