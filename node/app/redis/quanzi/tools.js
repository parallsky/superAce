let key = `test_set_key`

let setTest = async(redisClient, value) => {
  let res = await redisClient.setAsync(key, value)
  console.log('redisClient setTest----> res ', res, typeof res)
  return res
}

let getTest = async(redisClient) => {
  let res = await redisClient.getAsync(key)
  console.log('redisClient getTest----> res ', res, typeof res)
  return res
}

module.exports = {
  setTest,
  getTest
}
