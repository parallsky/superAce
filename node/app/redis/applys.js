let freshListPush = async(arrs, isCurrent) => {
  let key = `wpk_applys_list`
  if(!arrs || arrs.length == 0) return false
  let len = await getListLen(key)
  if(len && len > 0) return false
  try{
    await redisClient.rpushAsync(key, ...arrs)
    return true
  }catch(e){
    console.log(`[error]redis wpk_applys_list freshListPush n:${key} err:`, e)
    return false
  }
}

let getListLen = async(name) => {
  try{
    let res = await redisClient.llenAsync(name)
    return res
  }catch(e){
    console.log(`[error]redis wpk_applys_list getListLen n:${name} err:`, e)
    return false
  }
}

let freshListPop = async(isCurrent) => {
  let key = `wpk_applys_list`
  try{
    let res = await redisClient.lpopAsync(key)
    if(!res) {
      return false
    }
    return res
  }catch(e){
    console.log(`[error]redis wpk_applys_list freshListPop k:${key} err:`, e)
    return false
  }
}

let listObjSet = async(objs, leagueId) => {
  let key = `wpk_buyin_obj_list_${leagueId}`
  try{
    let strs = JSON.stringify(objs)
    let res = await redisClient.setAsync(key, strs)
    await redisClient.expire(key, 30)
    return true
  }catch(e){
    console.log(`[error]redis listObjSet k:${key} err:`, e)
    return false
  }
}

let listObjGet = async(leagueId) => {
  let key = `wpk_buyin_obj_list_${leagueId}`
  try{
    let res = await redisClient.getAsync(key)
    if(!res) {
      return []
    } else {
      return JSON.parse(res)
    }
  }catch(e){
    console.log(`[error]redis listObjGet k:${key} err:`, e)
    return false
  }
}

module.exports = {
  freshListPush,
  freshListPop,
  getListLen,
  listObjSet,
  listObjGet
}
