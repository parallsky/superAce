let playLogSpop = async () => {
  try{
    let res = await redisClient.spopAsync('wpk_playlog_set')
    return res
  }catch(err){
    console.log(`[error]redis playlog wpk_playlog_set err:`, err)
    return false
  }
}

let playLogSadd = async(ids) => {
  if(!ids || ids.length == 0) return false
  try{
    await redisClient.saddAsync('wpk_playlog_set', ...ids)
    return true
  }catch(err){
    console.log(`[error]redis playlog wpk_playlog_set, id:${ids.join(',')} err:`, err)
    return false
  }
}

let logHashSet = async(objs) => {
  try{
    await redisClient.hmsetAsync('wpk_playlog_hash', objs)
    return true
  }catch(err){
    console.log(`[error]redis playlog wpk_playlog_hash err:`, err, objs)
    return false
  }
}

let logHashDel = async(roomId) => {
  try{
    await redisClient.hdelAsync('wpk_playlog_hash', roomId)
    return true
  }catch(err){
    console.log(`[error]redis playlog wpk_playlog_hash, id:${roomId} err:`, err)
    return false
  }
}

let logHashGet = async(roomId) => {
  try{
    let res = await redisClient.hgetAsync('wpk_playlog_hash', roomId)
    if(res) {
      return parseInt(res)
    }
    return 0
  }catch(err){
    console.log(`[error]redis playlog wpk_playlog_hash, id:${roomId} err:`, err)
    return false
  }
}

let logCurHandGet = async(roomId) => {
  try{
    let res = await redisClient.hgetAsync('wpk_handlog_curr_hash', roomId)
    if(res) {
      return parseInt(res)
    }
    return 0
  }catch(err){
    console.log(`[error]redis playlog wpk_handlog_curr_hash, id:${roomId} err:`, err)
    return false
  }
}

let logCurHandSet = async(roomId, handNum) => {
  try{
    await redisClient.hsetAsync('wpk_handlog_curr_hash', roomId, handNum)
    return true
  }catch(err){
    console.log(`[error]redis playlog wpk_handlog_curr_hash, id:${roomId} err:`, err)
    return false
  }
}

let logCurHandDel = async(roomId) => {
  try{
    await redisClient.hdelAsync('wpk_handlog_curr_hash', roomId)
    return true
  }catch(err){
    console.log(`[error]redis playlog wpk_handlog_curr_hash, id:${roomId} err:`, err)
    return false
  }
}

let freshListPush = async(arrs) => {
  let key = `wpk_handlog_lists`
  if(!arrs || arrs.length == 0) return false
  let len = await getListLen(key)
  if(len && len > 0) return false
  try{
    await redisClient.rpushAsync(key, ...arrs)
    return true
  }catch(e){
    console.log(`[error]redis playlog freshListPush n:${key} err:`, e)
    return false
  }
}

let getListLen = async(name) => {
  try{
    let res = await redisClient.llenAsync(name)
    return res
  }catch(e){
    console.log(`[error]redis playlog getListLen n:${name} err:`, e)
    return false
  }
}

let freshListPop = async() => {
  let key = `wpk_handlog_lists`
  try{
    let res = await redisClient.lpopAsync(key)
    if(!res) {
      return false
    }
    return res
  }catch(e){
    console.log(`[error]redis playlog freshListPop k:${key} err:`, e)
    return false
  }
}

module.exports = {
  playLogSadd,
  playLogSpop,
  logHashSet,
  logHashGet,
  logCurHandGet,
  logCurHandDel,
  logCurHandSet,
  logHashDel,
  freshListPop,
  freshListPush
}
