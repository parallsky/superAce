'use strict'
const jwt = require('jsonwebtoken')
const util = require('util')
const config = require('config')
const dayjs = require('dayjs')
const xlsx = require('node-xlsx')
const myredis = require('../redis/index')

let tokenCheckFull = (token) => {
  if(token.indexOf(config.jwt.prefixStr) == -1) {
    return config.jwt.prefixStr + token
  }
  return token
}

let createToken = (data, expireDay) => {
  console.log('createToken ====>', data)

  let expires = ''
  if(expireDay) {
    expires = expireDay + 'd'
  } else {
    expires = config.jwt.expire
  }
  const token = jwt.sign(data, config.jwt.secret, { expiresIn: expires })  //token签名 有效期

  return token.replace(config.jwt.prefixStr, '')
}

let verifyJwt = async(token) => {
  if(!token) {
    return false
  }

  try {
    const verify = util.promisify(jwt.verify)
    let res = await verify(tokenCheckFull(token), config.jwt.secret)
    return res
  } catch(e) {
    console.log(`[error]verifyJwt error t:${token}`)
    return false
  }
}

let getHost = (host) => {
  if(!host) {
    return false
  }
  let str = host.split(':')[0]
  let len = str.split('.').length
  if(len < 2) {
    return false
  }

  return str
}

let setCookie = async(ctx, data, newTime) => {
  if(!ctx.request.header) {
    return
  }
  let host = ctx.request.header.host
  if(!host) {
    return
  }

  let cookieExpireMoment = dayjs().add(30, 'day').format()
  let token = createToken(data || {}, 30)

  token = 'Bearer ' + token

  ctx.cookies.set(
    config.cookieKey, token, {
      signed: false,
      domain: host, // 写cookie所在的域名
      path: '/',       // 写cookie所在的路径
      expires: new Date(cookieExpireMoment), // cookie失效时间
      httpOnly: true,  // 是否只用于http请求中获取
      overwrite: false  // 是否允许重写
    }
  )
  return token
}

let formatFloat = (item, sizelen) => {
  if(typeof item === 'number') {
    if(~~item == item) {
      return parseInt(item)
    }
    return parseFloat(item.toFixed(sizelen || 2))
  }
  for(let i in item) {
    if(typeof item[i] === 'number') {
      let tmp = item[i]
      if(~~tmp == tmp) {
        item[i] = parseInt(tmp)
      } else {
        item[i] = parseFloat(tmp.toFixed(sizelen || 2))
      }
    }
  }
  return item
}
let formatInt = (item, sizelen) => {
  if(typeof item === 'number') {
    return parseInt(item)
  }
  for(let i in item) {
    if(typeof item[i] === 'number') {
      let tmp = item[i]
      item[i] = parseInt(tmp)
    }
  }
  return item
}
let compareFloat = (a, b) => {
  return parseFloat((a - b).toFixed(2)) >= 0
}
let compareFloatEq = (a, b) => {
  return parseFloat((a - b).toFixed(2)) == 0
}

let accountCheck = (str) => {
  let reg = /\d{5,}$/
  if (reg.test(str)) {
    return 'number'
  }
  reg = /^[a-zA-Z0-9_]+$/

  if (!reg.test(str)) {
    return 'string'
  }
  return false
}

let str2Float = (a) => {
  a = parseFloat(a)
  if(~~a == a) {
    return parseInt(a)
  }
  return a
}

let objEncrypt = (data) => {
  let encryptedData = Buffer.from(JSON.stringify(data)).toString('base64')
  encryptedData = Buffer.from(encryptedData).toString('base64')
  return encryptedData
}

let objDecrypt = (hexData) => {
  try {
    let text = Buffer.from(hexData, 'base64').toString()
    text = Buffer.from(text, 'base64').toString()
    return JSON.parse(text)
  } catch(e) {
    console.log('objDecrypt -> ', hexData)
    return false
  }
}

let emojiReg = (str) => {
  if(!str) {
    return false
  }

  let regs = new RegExp('[\u2190-\u21FF]|[\u2600-\u26FF]|[\u2700-\u27BF]|[\u3000-\u303F]|[\u1F300-\u1F64F]|[\u1F680-\u1F6FF]')
  return regs.test(str)
}

let emojiMatch = (str) => {
  if(!str) {
    return ''
  }

  let regs = /[\/\-a-zA-Z0-9_\u4e00-\u9fa5]/g
  return str.replace(regs, '')
}

let getClientIP = (req) => {
  let ip= req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.ip  ||
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress || ''
  if(ip) {
    ip = ip.replace('::ffff:', '')
  }
  return ip;
}

let formatZero = (req) => {
  console.log('req 000>', req)
  if(req > 1000) {
    return req + ''
  } else {
    return '0' + ((1000 + req) + '').substr(1)
  }
}

let todayTime = (userInfo) => {
  let nowT = dayjs()
  let hours = nowT.hour()
  let dayStr = nowT.format('YYYY-MM-DD')
  if(hours < userInfo.gradeHours) {
    dayStr = nowT.subtract(1, 'day').format('YYYY-MM-DD')
  }
  let todayShort = dayStr.substr(5).replace(/-/g, '')
  let todayBegin = dayjs(dayStr).add(userInfo.gradeHours, 'hour')

  let todayVal = todayBegin.valueOf()
  let todayStr = todayBegin.format('YYYY-MM-DD HH点')
  let todayFormat = todayBegin.format('YYYYMMDD')
  return {
    todayShort,
    todayStr,
    todayVal,
    todayFormat
  }
}

let trimDay = (dayBegin) => {
  console.log('trimDay ---->-----', (dayBegin >= 10 ? dayBegin + '' : '0' + dayBegin) + ':00:00')
  return (dayBegin >= 10 ? dayBegin + '' : '0' + dayBegin) + ':00:00'
}

let formatDates = (params, userInfo) => {
  let dayBegin = userInfo.gradeHours
  let now = dayjs()
  let hours = now.hour()
  let startTime
  let endTime

  if(params.dateType != 'history') {
    if(params.dateType == 'today') {
      endTime = now.format('YYYY-MM-DD HH:mm:ss')
      if(hours >= dayBegin) {
        startTime = now.format('YYYY-MM-DD ') + trimDay(dayBegin)
      } else {
        startTime = now.subtract(1, 'day').format('YYYY-MM-DD ') + trimDay(dayBegin)
      }
    } else {
      if(hours >= dayBegin) {
        endTime = now.format('YYYY-MM-DD ') + trimDay(dayBegin)
        startTime = now.subtract(1, 'day').format('YYYY-MM-DD ') + trimDay(dayBegin)
      } else {
        endTime = now.subtract(1, 'day').format('YYYY-MM-DD ') + trimDay(dayBegin)
        startTime = now.subtract(2, 'day').format('YYYY-MM-DD ') + trimDay(dayBegin)
      }
    }
  } else {
    startTime = dayjs(params.startTime).format('YYYY-MM-DD ') + trimDay(dayBegin)
    endTime = dayjs(params.endTime).format('YYYY-MM-DD ') + trimDay(dayBegin)
  }

  console.log(params.dateType, userInfo.gradeHours, startTime, endTime)
  return {
    startTimeStr: startTime,
    endTimeStr: endTime,
    startTime: dayjs(startTime).valueOf(),
    endTime: dayjs(endTime).valueOf()
  }
}

let calcGradeLeft = (item) => {
  return formatFloat(item.maxLoseNum + item.GradeTotal + item.externalCredit + item.GradeBenefit)
}

let calcCreditLeft = (item) => {
  return formatFloat(item.maxLoseNum + item.GradeTotal + item.externalCredit + item.GradeBenefit - item.BuyinTotal)
}

let calcPlayerCredit = (item) => {
  return formatFloat(item.creditInit - item.creditBuying + item.creditCharge + item.creditGrade + item.gradeBenefit)
}

let calcPlayerCash = (item) => {
  return formatFloat(item.creditCharge - item.creditBuying + item.creditGrade + item.gradeBenefit)
}

let getBillDate = (endTime, beginHour) => {
  if(!endTime) {
    return ''
  }
  let time = dayjs(endTime)
  if(time.hour() < beginHour) {
    // 说明是0-beginhour
    return dayjs(endTime).subtract(24, 'hour').format('YYYY-MM-DD')
  } else {
    return endTime.substr(0, 10)
  }
}

let exportXlsx = (ctx, name, data) => {
  var buffer = xlsx.build([{name, data}])
  // ctx.type = 'text/csv'
  // ctx.type = 'application/vnd.ms-excel'
  ctx.type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ctx.set("Content-Disposition", "attachment; filename=" + `${encodeURIComponent(name)}.xlsx`)
  ctx.body = buffer
  return buffer
}

let uniqueArray = (arrs) => {
  let nArr = {}
  arrs.forEach(item => {
    nArr[item] = 1
  })
  return Object.keys(nArr)
}

let randomString = (e) => {
  e = e || 16
  let t = 'abcde01fghi23jk45lmnopqrstuv89wxyz67'
  let n = ''
  let len = t.length
  for (let i = 0; i < e; i ++) {
    n += t.charAt(Math.floor(Math.random() * len))
  }
  return n
}

let loginAcc = (item) => {
  return item.loginStr + (item.playerId).toString(32)
}

let helpGraphFilter = (adminObjs, list, menu) => {
  list.forEach(item => {
    if(adminObjs[item.subClubId]) {
      menu.push(item)
      return
    } else if(item.children){
      helpGraphFilter(adminObjs, item.children, menu)
    }
  })
}


module.exports = {
  setCookie,
  verifyJwt,
  accountCheck,
  getClientIP,
  formatZero,
  todayTime,
  formatFloat,
  formatInt,
  formatDates,
  compareFloat,
  compareFloatEq,
  calcGradeLeft,
  calcPlayerCredit,
  calcCreditLeft,
  getBillDate,
  exportXlsx,
  uniqueArray,
  calcPlayerCash,
  randomString,
  loginAcc,
  helpGraphFilter
}
