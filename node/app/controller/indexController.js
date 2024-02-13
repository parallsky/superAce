'use strict'

const path = require('path')
const fs = require('fs')
const config = require('config')
const myredis = require('../redis/index')
const models = require('../models/index')
const unionList = require('../../config/unionrouter')
const clubList = require('../../config/clubrouter')

let initServer = async (name) => {
  // global.appName
  // apis服务
  // wpk的数据同步任务
  // dpq的数据同步任务
  // dpzx的数据同步任务

  // 数据库初始化，多个数据库连接
  let quanziMysql = await models.mysqlInit('quanzi')
  global.modelTools = await models.modelUtils('quanzi', quanziMysql)
  // let sqlRes = await global.quanziMysql.users.updateQuery({}, {
  //   changeNum: `=0`
  // })

  // console.log('sqlRes ----->', sqlRes)

  // redis初始化，多个redis连接
  let quanziRedis = myredis.createRedis('quanzi')
  global.redisTools = await myredis.redisUtils('quanzi', quanziRedis)

  global.redlockTools = myredis.redLockInit([quanziRedis])

  // await redlockTools.lock('roomid--1000', 5000)
  // let lock = await redlockTools.lock('roomid--1000', 5000)
  // await redlockTools.lock('roomid--1000', 5000)
  // await redisTools.tools.setTest(10000)
  // await redlockTools.unlock(lock)
  // await redisTools.tools.getTest()


  // redis订阅数据同步源
  global.redisHostSub = await myredis.createSub('quanzi', 'channel_host_change', (data) => {
    console.log('createSub --->', data)
  })

  global.redisHostPub = await myredis.publishMessage(quanziRedis, 'channel_host_change')

  setTimeout(() => {
    global.redisHostPub({
      type: 'wpk',
      url: 'https://baidu.com'
    })
  }, 1000)


  return true
}

let userInfoFromDb = async (name) => {
  // 获取用户信息



  return true
}

module.exports = {
  initServer,
}
