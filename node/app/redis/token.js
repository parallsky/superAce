let tokenInfo = async (userId) => {
  let res
  try {
    res = await redisClient.getAsync(`wpk_token_${userId}`)
    return res
  }catch(e){
    console.log(`[error]wpk_redis token tokenInfo cid:${userId} err:`, e)
    return false
  }
}

let tokenDel = async(userId, oldToken) => {
  try {
    if (!oldToken) {
      await redisClient.delAsync(`wpk_token_${userId}`)
    } else {
      let tmp = await tokenInfo(userId)
      if(tmp == oldToken) {
        await redisClient.delAsync(`wpk_token_${userId}`)
      }
    }
    return true
  }catch(e){
    console.log(`[error]wpk_redis token tokenDel cid:${clubId} err:`, e)
    return false
  }
}

let tokenUpdate = async(userId, token) => {
  try {
    await redisClient.setAsync(`wpk_token_${userId}`, token)
    return true
  }catch(e){
    console.log(`[error]wpk_redis token tokenUpdate uid:${userId} token:${token} err:`, e)
    return false
  }
}

let accountErrorSet = async(account, times) => {
  let res
  try {
    if(times <= 0) {
      await redisClient.delAsync(`wpk_account_error_${account}`)
      return true
    }

    res = await redisClient.setAsync(`wpk_account_error_${account}`, times)
    if(times == 1) {
      await redisClient.expire(`wpk_account_error_${account}`, 5 * 60)
    }
    return true
  }catch(e){
    console.log(`[error]wpk_redis token accountErrorSet `, e)
    return false
  }
}

let accountErrorGet = async(account) => {
  let res
  try {
    res = await redisClient.getAsync(`wpk_account_error_${account}`)
    if(res) {
      return parseInt(res)
    }
    return 0
  }catch(e){
    console.log(`[error]wpk_redis token accountErrorGet `, e)
    return false
  }
}

let accountErrorTtl = async(account) => {
  let res
  try {
    res = await redisClient.ttlAsync(`wpk_account_error_${account}`)
    if(res) {
      return parseInt(res)
    }
    return 0
  }catch(e){
    console.log(`[error]wpk_redis token accountErrorGet `, e)
    return false
  }
}

let freshListPush = async(arrs) => {
  if(!arrs || arrs.length == 0) return false
  let len = await freshListLen()
  if(len && len > 0) return false
  try{
    await redisClient.rpushAsync('wpk_token_fresh_list', ...arrs)
    return true
  }catch(e){
    console.log(`[error]redis token freshListPush `, e)
    return false
  }
}

let freshListPop = async() => {
  try{
    let res = await redisClient.lpopAsync('wpk_token_fresh_list')
    return res
  }catch(e){
    console.log(`[error]redis token freshListPop `, e)
    return false
  }
}

let freshListLen = async() => {
  try{
    let res = await redisClient.llenAsync('wpk_token_fresh_list')
    if(res) {
      return parseInt(res)
    }
    return 0
  }catch(e){
    console.log(`[error]redis token freshListLen`, e)
    return false
  }
}

let memberListPush = async(arrs) => {
  if(!arrs || arrs.length == 0) return false
  let len = await memberListLen()
  if(len && len > 0) return false
  try{
    await redisClient.rpushAsync('wpk_members_fresh_list', ...arrs)
    return true
  }catch(e){
    console.log(`[error]redis token memberListPush `, e)
    return false
  }
}

let memberListPop = async() => {
  try{
    let res = await redisClient.lpopAsync('wpk_members_fresh_list')
    return res
  }catch(e){
    console.log(`[error]redis token memberListPop `, e)
    return false
  }
}

let memberListLen = async() => {
  try{
    let res = await redisClient.llenAsync('wpk_members_fresh_list')
    return res
  }catch(e){
    console.log(`[error]redis token memberListLen`, e)
    return false
  }
}

module.exports = {
  tokenInfo,
  tokenDel,
  tokenUpdate,
  accountErrorSet,
  accountErrorGet,
  freshListPush,
  freshListPop,
  freshListLen,
  memberListPush,
  memberListPop,
  memberListLen,
  accountErrorTtl
}
