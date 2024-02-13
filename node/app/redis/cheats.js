let existsKey = async(key) => {
  try{
    let res = await redisClient.existsAsync(key)
    return res
  }catch(e){
    console.log(`[error]redis cheats existsKey k:${key} err:`, e)
    return false
  }
}

let getProcess = async(userId) => {
  let key = `wpk_day_cheatprocess_${userId}`
  try{
    let res = await redisClient.getAsync(key)
    if(!res) {
      return 0
    }
    return parseInt(res)
  }catch(e){
    console.log(`[error]redis cheats getProcess n:${key} err:`, e)
    return false
  }
}

let setProcess = async(userId) => {
  let key = `wpk_day_cheatprocess_${userId}`
  try{
    let res = await redisClient.setAsync(key, 1)
    let existFlag = await existsKey(key)
    if(existFlag) {
      await redisClient.expire(key, 5 * 60)
    }
    return res
  } catch(e) {
    console.log(`[error]redis cheats setProcess n:${key} err:`, e)
    return false
  }
}

module.exports = {
  existsKey,
  setProcess,
  getProcess
}
