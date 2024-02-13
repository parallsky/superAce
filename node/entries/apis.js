'use strict';

const fs = require('fs')
const https = require('https')
const Koa = require('koa')
const config = require('config')
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const views = require('koa-views')
const compress = require('koa-compress')
const staticServer = require('koa-static')
const responseTime = require('koa-response-time')
const genres = require('../app/utils/genres')
const utils = require('../app/utils/utils')
// const myredis = require('../app/redis/index')
// const models = require('../app/models/index')

const app = new Koa()

global.HOUR_UNIT = 60 * 60 * 1000
global.DAY_UNIT = 24 * global.HOUR_UNIT
global.appName = process.env.NAME
global.hoseEnv = process.env.NODE_ENV
global.port = process.env.PORT ||  config.get('port')

global.configObj = config
global.genresFun = genres
global.utilsFun = utils

// global.logInfo = (ctx) => {
//   console.log(`${type}`)
// }

app.keys = [global.appName]

app.use(koaBody({
  multipart: true
}))

app.use(cors())
app.use(responseTime())
app.use(views(config.webdir, {
  map: {
    html: 'swig'
  },
  options: {
    cache: false // cache the template string or not
  },
}))

// app.use(compress({
//   threshold: 2048,
//   gzip: {
//     flush: require('zlib').constants.Z_SYNC_FLUSH
//   }
// }))

app.use(staticServer(config.webdir, {
  maxAge: 30 * 24 * 60 * 60 * 1000,
  index: 'demo.html',
  gzip: true
}))

let relogin = (ctx, txt) => {
  let reqpath = ctx.request.path
  if( reqpath.indexOf('/qz/') === 0){
    ctx.redirect('/qz/login/')
  } else {
    ctx.status = 200
    ctx.body = genres.error({
      message: txt || '身份失效，请重新登录',
      errorCode: 401
    })
  }
}

// 拦截非法请求
app.use(async (ctx, next) => {
  let timeStr = Date.now()
  let reqPath = ctx.request.path
  try {
    let isDanger = false
    let headers = ctx.header || ctx.request.headers || {}

    // 域名验证
    let host = headers.host ? headers.host.split(':')[0] : ''

    // 浏览器限制
    let useragent = (ctx.header['user-agent'] && ctx.header['user-agent'].toLowerCase()) || ''
    if (useragent.indexOf('micromessenger') > -1) {
      // 跳转到chrome下载页面
      ctx.status = 200
      ctx.type = 'text'
      ctx.body = '请用chrome浏览器访问'
      return
    }

    let remoteIp = utils.getClientIP(ctx.req)
    // 如果1分钟内，ip访问超过300次，则断开他

    // if(isDanger) {
    //   console.error(`[error]danger request path:${reqpath} host:${host} ip:${remoteIp}`)
    //   ctx.type = 'text'
    //   ctx.body = '网站维护中'
    //   return
    // }

    ctx.state.userIp = remoteIp
    await next()
    console.log(`[info] requestTime req:${reqPath} tu:${Date.now() - timeStr} status:${ctx.status} `)
  }catch(e) {
    console.log(e)
    let res = {
      message: '请求发生了错误 ' + e.message,
      errorCode: 1
    }
    ctx.status = 200
    ctx.body = genres.error(res)
    console.log(`[error] globalErro req:${reqPath} tu:${Date.now() - timeStr} status:${ctx.status} `)
  }
})

// 登录身份验证
app.use(async (ctx, next) => {
  let reqpath = ctx.request.path
  let headers = ctx.request.headers || {}
  if (
    reqpath == '/' ||
    reqpath == '/favicon.ico' ||
    reqpath.indexOf('/main/') == 0 ||
    reqpath.indexOf('/statics/') == 0 ||
    reqpath.indexOf('/api/baseinfo') == 0
  ) {
    await next()
  } else {
    let token = decodeURIComponent(headers[config.cookieKey.toLowerCase()] || ctx.cookies.get(config.cookieKey))
    if(!token) {
      return relogin(ctx, '')
    }

    // token解析失败
    let userInfo = await utils.verifyJwt(token.split(' ')[1])
    if(!userInfo) {
      return relogin(ctx, 'token失效')
    }

    // 检测用户当前的token是否被踢票，redis操作

    // 查看用户信息，并判断状态
  }
})



// 启动初始化，注册路由
const router2controller = require('../app/routers')
const indexController = require('../app/controller/indexController')

// 初始化
indexController.initServer(global.appName).then(async (res)=>{
  let router = router2controller()
  app.use(router.routes()).use(router.allowedMethods())
  app.listen(global.port, function(){})

  if(global.hoseEnv == 'dev') {
    const options = {
      key: fs.readFileSync("./devcert/ssl.key", "utf8"),
      cert: fs.readFileSync("./devcert/ssl.crt", "utf8")
    }
    https.createServer(options, app.callback()).listen(443, (err) => {})
  }

  console.log(`server:${global.appName} 启动完成，本地请访问 http://dev.wpkqz.com`)
})



