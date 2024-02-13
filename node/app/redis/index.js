const fs = require('fs')
const path = require('path')
const bluebird = require('bluebird')
const redis = require('redis')
const Redlock = require('redlock')

bluebird.promisifyAll(redis)
let findJsFile = (dir) => {
  return fs.readdirSync(dir).filter(f => {
    return f.endsWith('.js')
  })
}

let createRedis = (appName) => {
  let obj = {
    host: configObj.redis[appName].host,
    port: configObj.redis[appName].port,
  }
  if(configObj.redis[appName].password) {
    obj.password = configObj.redis[appName].password
  }
  let client = redis.createClient(obj)
  client.on('error', (err) => {
    console.error(`[error] ${appName} redis err:`, err)
  })
  return client
}

let redLockInit = (clients) => {
  let redlock = new Redlock(
    [...clients],
    {
        // the expected clock drift; for more details
        // see http://redis.io/topics/distlock
        driftFactor: 0.01, // time in ms

        // the max number of times Redlock will attempt
        // to lock a resource before erroring
        retryCount:  3,

        // the time in ms between attempts
        retryDelay:  200, // time in ms

        // the max time in ms randomly added to retries
        // to improve performance under high contention
        // see https://www.awsarchitectureblog.com/2015/03/backoff.html
        retryJitter:  200, // time in ms
    }
  )
  redlock.on('clientError', (err) => {
    console.log('[error]redlock redis error:', err);
  })

  let lock = async(resource, ttl) =>{
    try {
      let mylock = await redlock.lock(resource, ttl || 10000)
      return mylock
    }catch(e) {
      console.log(`[error]redlock lock ${resource} failed`)
      return false
    }
  }
  let unlock = async(mylock) => {
    try {
      await mylock.unlock()
      return true
    }catch(e) {
      console.log('[error]redlock unlock ', e)
      return false
    }
  }

  return {
    lock,
    unlock
  }
}

let createSub = async (appName, channel, messageFn) => {
  // 订阅
  let subscriber = createRedis(appName)
  console.log('subscriber --->', )
  // const subscriber = client.duplicate();
  subscriber.on('subscribe', function(channel, count) {
    console.log('subscriber ---->', appName, channel)
  })
  subscriber.on('message', (channel, message) => {
    try {
      let data = JSON.parse(message)
      messageFn(data, channel)
    }catch(e){
      console.error(`[error] ${appName} redis subscribe parse err:`, e)
    }
  })
  await subscriber.subscribe(channel)
  return subscriber
}

let publishMessage = async(redisClient, channel) => {
  return async(message) => {
    console.log(channel, message)
    let str = JSON.stringify(message || {})
    redisClient.publish(channel, str)
  }
}

let redisUtils = async(dbName, redisClient) => {
  // // 创建sql查询函数
  let funcDir = path.resolve(__dirname, dbName)
  let funcFiles = findJsFile(funcDir)

  let utilsObj = {}

  for(let k in funcFiles) {
    let fn = funcFiles[k]
    let sqlObj = require(path.resolve(funcDir, fn))
    if(sqlObj && typeof sqlObj == 'object') {
      let fileName = fn.replace('.js', '')
      utilsObj[fileName] = {}
      for(let funcName in sqlObj) {
        utilsObj[fileName][funcName] = async(...arrs) => {
          try {
            let res = await sqlObj[funcName](redisClient, ...arrs)
            return res
          } catch(e) {
            console.log(`[error] ${dbName} ${fileName} ${funcName} err:`, e)
            return false
          }
        }
      }
    }
  }
  console.log(`redis ${dbName} --->`, utilsObj)
  return utilsObj
}

module.exports = {
  createRedis,
  createSub,
  publishMessage,
  redLockInit,
  redisUtils
}
