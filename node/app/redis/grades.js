let currentSpop = async () => {
  try{
    let res = await redisClient.spopAsync('wpk_grades_current_sort')
    return res
  }catch(err){
    console.log(`[error]redis grades wpk_grades_current_sort err:`, err)
    return false
  }
}

let currentSadd = async(ids) => {
  if(!ids || ids.length == 0) return false
  try{
    await redisClient.saddAsync('wpk_grades_current_sort', ...ids)
    return true
  }catch(err){
    console.log(`[error]redis grades wpk_grades_current_sort, id:${ids.join(',')} err:`, err)
    return false
  }
}

let historySpop = async () => {
  try{
    let res = await redisClient.spopAsync('wpk_grades_history_sort')
    return res
  }catch(err){
    console.log(`[error]redis grades wpk_grades_history_sort err:`, err)
    return false
  }
}

let historySadd = async(ids) => {
  if(!ids || ids.length == 0) return false
  try{
    await redisClient.saddAsync('wpk_grades_history_sort', ...ids)
    return true
  }catch(err){
    console.log(`[error]redis grades wpk_grades_history_sort, id:${ids.join(',')} err:`, err)
    return false
  }
}

module.exports = {
  currentSpop,
  currentSadd,
  historySpop,
  historySadd
}
