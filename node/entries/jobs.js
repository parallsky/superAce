'use strict';

const Koa = require('koa')
const fs = require('fs')
const path = require('path')
const config = require('config')
const indexController = require('../app/controller/indexController')
const jobs = require('../app/jobs/index')
const app = new Koa()
let port = process.env.PORT
const protoBufObj = require('../app/utils/protoObj')

protoBufObj.loadInit()

global.HOUR_UNIT = 60 * 60 * 1000
global.DAY_UNIT = 24 * global.HOUR_UNIT
global.appName = process.env.NAME
app.keys = [global.appName]

// let dirPath = path.resolve(config.fileDir)
// if (!fs.existsSync(dirPath)) {
//   fs.mkdirSync(dirPath)
// }

// 数据库初始化
indexController.init(global.appName).then( async (res)=>{
  await jobs[global.appName]()
  app.listen(port, function(){})
  console.log(`[info]job init ${global.appName} worker start on port ` + port)
})
