const timeoutKey = 'wpk_timeout_counts_str'
const timeoutExpire = 120

let timeoutIncr = async() => {
  let res
  try {
    res = await redisClient.incrAsync(timeoutKey)
    await redisClient.expire(timeoutKey, timeoutExpire)
    return res
  }catch(e){
    console.log(`[error]redis token timeoutIncr `, e)
    return false
  }
}

let timeoutGet = async(clubId) => {
  let res
  try {
    let key = `${keyPre}${clubId}`
    res = await redisClient.getAsync(key)
    return res
  }catch(e){
    console.log(`[error]redis token timeoutGet `, e)
    return false
  }
}

module.exports = {
  timeoutIncr,
  timeoutGet
}
