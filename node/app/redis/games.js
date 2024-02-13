let freshListPush = async(arrs, isCurrent) => {
  let key = `wpk_gamesfresh_${isCurrent ? 'current' : 'history'}_list`
  if(!arrs || arrs.length == 0) return false
  let len = await getListLen(key)
  if(len && len > 0) return false
  try{
    await redisClient.rpushAsync(key, ...arrs)
    return true
  }catch(e){
    console.log(`[error]redis games freshListPush n:${key} err:`, e)
    return false
  }
}

let getListLen = async(name) => {
  try{
    let res = await redisClient.llenAsync(name)
    return res
  }catch(e){
    console.log(`[error]redis games getListLen n:${name} err:`, e)
    return false
  }
}

let freshListPop = async(isCurrent) => {
  let key = `wpk_gamesfresh_${isCurrent ? 'current' : 'history'}_list`
  try{
    let res = await redisClient.lpopAsync(key)
    if(!res) {
      return false
    }
    return res
  }catch(e){
    console.log(`[error]redis games freshListPop k:${key} err:`, e)
    return false
  }
}

module.exports = {
  freshListPush,
  freshListPop,
  getListLen,
}
