let dayCountGet = async(leagueId, dayStr) => {
  let key = `wpk_todaygame_${leagueId}_${dayStr}`
  try {
    let res = await redisClient.incrAsync(key)
    if(!res) {
      return 0
    }
    if(res == 1) {
      await redisClient.expire(key, 26 * 60 * 60)
    }
    return parseInt(res)
  }catch(e){
    console.log(`[error]redis dayCountGet ${key}  e:`, e)
    return false
  }
}

let autoCreateSet = async(schemeId, roomId) => {
  let key = `wpk_auto_create_${schemeId}`
  try {
    let res = await redisClient.setAsync(key, roomId)
    await redisClient.expire(key, 8 * 60 * 60)
    return true
  }catch(e){
    console.log(`[error]redis autoCreateSet ${key}  e:`, e)
    return false
  }
}

let autoCreateDel = async(schemeId) => {
  let key = `wpk_auto_create_${schemeId}`
  try {
    let res = await redisClient.delAsync(key)
    return true
  }catch(e){
    console.log(`[error]redis autoCreateSet ${key}  e:`, e)
    return false
  }
}

let autoCreateGet = async(schemeId) => {
  let key = `wpk_auto_create_${schemeId}`
  try {
    let res = await redisClient.getAsync(key)
    return res
  }catch(e){
    console.log(`[error]redis autoCreateSet ${key}  e:`, e)
    return false
  }
}


module.exports = {
  dayCountGet,
  autoCreateSet,
  autoCreateDel,
  autoCreateGet
}
