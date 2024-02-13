const keyPre = 'wpk_tele_msg_'
const expireVal = 40

let msgSendedSet = async(clubId) => {
  let res
  try {
    let key = `${keyPre}${clubId}`
    res = await redisClient.setAsync(key, 1)
    await redisClient.expire(key, expireVal)
    return true
  }catch(e){
    console.log(`[error]redis token msgSendedSet `, e)
    return false
  }
}

let msgSendedGet = async(clubId) => {
  let res
  try {
    let key = `${keyPre}${clubId}`
    res = await redisClient.getAsync(key)
    return res
  }catch(e){
    console.log(`[error]redis token msgSendedGet `, e)
    return false
  }
}

let msgTmpSendHashSet = async(keys, msgId) => {
  let res
  try {
    let key = `wpk_tmpmsg_sended_h`
    res = await redisClient.hmsetAsync(key, keys, msgId)
    return true
  }catch(e){
    console.log(`[error]redis token msgTmpSendHashSet `, e)
    return false
  }
}

let msgTmpSendHashGet = async(keys) => {
  let res
  try {
    let key = `wpk_tmpmsg_sended_h`
    res = await redisClient.hgetAsync(key, keys)
    return res
  }catch(e){
    console.log(`[error]redis token msgTmpSendHashGet `, e)
    return false
  }
}

module.exports = {
  msgSendedSet,
  msgSendedGet,
  msgTmpSendHashSet,
  msgTmpSendHashGet
}
