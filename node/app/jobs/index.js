
// 只获取clubs列表，做分拣装桶
const schedule = require('node-schedule')
const masterFn = require('./master')
const config = require('config')
const gamesFn = require('./games')
const buyinFn = require('./buyin')
const tokenFn = require('./token')
const tools = require('./tools')

let master = () => {
  global.allJobBeginRate = 0
  schedule.scheduleJob(`*/2 * * * * *`, async() => {
    // 开始分配循环执行的任务
    if(global.allJobBeginRate % 3600000 == 0) {
      global.allJobBeginRate = 0
    }
    // 取出所有联盟列表，分析
    let times = Date.now()
    await masterFn.allJobBegin()

    global.allJobBeginRate ++
    console.log(`[info] timeUse masterJob s:${Date.now() - times}ms`)
  })

  global.playLogLock = 0
  schedule.scheduleJob(`*/30 * * * * *`, async() => {
    // 开始分配循环执行的任务
    if(global.playLogLock) {
      return true
    }
    playLogLock = 1
    // 取出所有联盟列表，分析
    let times = Date.now()
    await masterFn.playLogCheck()

    global.playLogLock = 0
    console.log(`[info] timeUse playLockCheck s:${Date.now() - times}ms`)
  })

  // 钻石的token更新
  global.diamondtokenLock = 0
  schedule.scheduleJob(`*/5 * * * * *`, async() => {
    if(global.diamondtokenLock) {
      return true
    }
    global.diamondtokenLock = 1
    let times = Date.now()
    await tokenFn.diamondTokenCheck()
    global.diamondtokenLock = 0
    console.log(`[info] timeUse diamondtokenLock s:${Date.now() - times}ms`)
  })

  // 自动创建牌局
  global.autoTableLock = 0
  schedule.scheduleJob(`*/20 * * * * *`, async() => {
    if(global.autoTableLock) {
      return true
    }
    global.autoTableLock = 1
    let times = Date.now()
    await gamesFn.autoCreateTableJob()
    global.autoTableLock = 0
    console.log(`[info] timeUse autoTableLock s:${Date.now() - times}ms`)
  })

  // 数据清理
  // 每24个小时运行: 删除老数据
  schedule.scheduleJob(`0 */3 * * *`, async() => {
  // schedule.scheduleJob(`*/30 * * * * *`, async() => {
    await tools.deleteDataJob()
  })

  // 用户数据统计，每10分钟一次
  global.flopInJobLock = 0
  // schedule.scheduleJob(`0 */10 * * * *`, async() => {
  schedule.scheduleJob(`* */10 * * * *`, async() => {
    // 开始分配循环执行的任务
    if(global.flopInJobLock) {
      return true
    }
    global.flopInJobLock = 1
    // 取出所有联盟列表，分析
    let times = Date.now()
    await tools.flopInCheck()
    // await tools.flopInCheckNew()

    global.flopInJobLock = 0
    console.log(`[info] timeUse flopInCheck s:${Date.now() - times}ms`)
  })

  // 用户分组数据统计，每10分钟一次
  global.cheatGroupLock = 0
  schedule.scheduleJob(`0 */10 * * * *`, async() => {
  // schedule.scheduleJob(`*/60 * * * * *`, async() => {
    // 开始分配循环执行的任务
    if(global.cheatGroupLock) {
      return true
    }
    global.cheatGroupLock = 1
    // 取出所有联盟列表，分析
    let times = Date.now()
    await tools.cheatGroupCheck()
    // await tools.flopInCheckNew()

    global.cheatGroupLock = 0
    console.log(`[info] timeUse cheatGroupCheck s:${Date.now() - times}ms`)
  })

  // 子俱乐部自动冻结/解冻，每20s检查一次
  global.subFroozeCheckLock = 0
  schedule.scheduleJob(`*/20 * * * * *`, async() => {
    // 开始分配循环执行的任务
    if(global.subFroozeCheckLock) {
      return true
    }
    global.subFroozeCheckLock = 1
    // 取出所有联盟列表，分析
    let times = Date.now()
    await tools.subFroozeCheck()

    global.subFroozeCheckLock = 0
    console.log(`[info] timeUse subFroozeCheck s:${Date.now() - times}ms`)
  })

  // 检测战绩是否不正常
  global.gradeDoubleLock = 0
  schedule.scheduleJob(`0 */20 * * * *`, async() => {
    // 开始分配循环执行的任务
    if(global.gradeDoubleLock) {
      return true
    }
    global.gradeDoubleLock = 1
    // 取出所有联盟列表，分析
    let times = Date.now()
    await tools.gradeLogDouble()

    global.gradeDoubleLock = 0
    console.log(`[info] timeUse gradeDoubleLock s:${Date.now() - times}ms`)
  })


  // 将所有俱乐部Id放入下载队列，每天运行一次
  global.checkClubListLock = 0
  // schedule.scheduleJob(`*/10 * * * * *`, async() => {
  schedule.scheduleJob(`0 0 */1 * * *`, async() => {

    if(global.checkClubListLock) {
      return true
    }
    global.checkClubListLock = 1
    let times = Date.now()
    await tools.getCheckClubIds()

    global.checkClubListLock = 0
    console.log(`[info] timeUse checkClubListLock s:${Date.now() - times}ms`)
  })
}

let token = () => {
  global.tokenJobLock = 0
  // 俱乐部的token更新
  schedule.scheduleJob(`*/2 * * * * *`, async() => {
    if(global.tokenJobLock) {
      return
    }
    global.tokenJobLock = 1

    for(let i = 0; i < 1; i ++) {
      let times = Date.now()
      let res = await tokenFn.tokenCheck()
      if(res == 'noJob') {
        break
      }
      console.log(`[info] timeUse tokenCheck s:${Date.now() - times}ms`)
    }

    global.tokenJobLock = 0
  })

  // 俱乐部玩家信息刷新
  global.memberJobLock = 0
  schedule.scheduleJob(`*/3 * * * * *`, async() => {
    // 俱乐部的token更新
    if(global.memberJobLock) {
      return
    }
    global.memberJobLock = 1

    for(let i = 0; i < 1; i ++) {
      let times = Date.now()
      let res = await tokenFn.memberCheck()
      if(res == 'noJob') {
        break
      }
      console.log(`[info] timeUse memberCheck s:${Date.now() - times}ms`)
    }

    global.memberJobLock = 0
  })
}

let games = () => {
  global.currentJobLock = 0
  schedule.scheduleJob(`*/2 * * * * *`, async() => {
    // 获取已经结束游戏列表， 3:1 获取当前未结束的游戏列表
    if(global.currentJobLock) {
      return
    }
    global.currentJobLock = 1
    for(let i = 0; i < 1; i ++) {
      let times = Date.now()
      let res = await gamesFn.currentGameCheck()
      if(res == 'noJob') {
        break
      }
      console.log(`[info] timeUse currentGameCheck s:${Date.now() - times}ms`)
    }
    global.currentJobLock = 0
  })

  global.historyJobLock = 0
  schedule.scheduleJob(`*/2 * * * * *`, async() => {
    // 获取已经结束游戏列表， 3:1 获取当前未结束的游戏列表
    if(global.historyJobLock) {
      return
    }
    global.historyJobLock = 1
    for(let i = 0; i < 1; i ++) {
      let times = Date.now()
      let res = await gamesFn.historyGameCheck()
      if(res == 'noJob') {
        break
      }
      console.log(`[info] timeUse historyGameCheck s:${Date.now() - times}ms`)
    }
    global.historyJobLock = 0
  })

  global.buyinJobLock = 0
  schedule.scheduleJob(`*/2 * * * * *`, async() => {
    // 获取已经结束游戏列表， 3:1 获取当前未结束的游戏列表
    if(global.buyinJobLock) {
      return
    }
    global.buyinJobLock = 1
    for(let i = 0; i < 1; i ++) {
      let times = Date.now()
      let res = await buyinFn.buyinJobCheck()
      if(res == 'noJob') {
        break
      }
      console.log(`[info] timeUse buyinJobCheck s:${Date.now() - times}ms`)
    }
    global.buyinJobLock = 0
  })
}

let grades = () => {
  global.liveGradeJobLock = 0
  schedule.scheduleJob(`*/2 * * * * *`, async() => {
    // 获取已经结束游戏列表， 3:1 获取当前未结束的游戏列表
    if(global.liveGradeJobLock) {
      return
    }
    global.liveGradeJobLock = 1
    for(let i = 0; i < 2; i ++) {
      let times = Date.now()
      let res = await gamesFn.liveGradeCheck()
      if(res == 'noJob') {
        break
      }
      console.log(`[info] timeUse liveGradeCheck s:${Date.now() - times}ms`)
    }
    global.liveGradeJobLock = 0
  })

  global.historyGradeJobLock = 0
  schedule.scheduleJob(`*/2 * * * * *`, async() => {
    // 获取已经结束游戏列表， 3:1 获取当前未结束的游戏列表
    if(global.historyGradeJobLock) {
      return
    }
    global.historyGradeJobLock = 1
    for(let i = 0; i < 2; i ++) {
      let times = Date.now()
      let res = await gamesFn.historyGradeCheck()
      if(res == 'noJob') {
        break
      }
      console.log(`[info] timeUse historyGradeCheck s:${Date.now() - times}ms`)
    }
    global.historyGradeJobLock = 0
  })
}

let playlog = () => {
  global.playLogOneJobLock = 0
  schedule.scheduleJob(`*/2 * * * * *`, async() => {
    // 获取已经结束游戏的牌普
    if(global.playLogOneJobLock) {
      return
    }
    global.playLogOneJobLock = 1
    for(let i = 0; i < 3; i ++) {
      let times = Date.now()
      let res = await gamesFn.playLogOneJob()
      if(res == 'noJob') {
        break
      }
      console.log(`[info] timeUse playLogOneJob s:${Date.now() - times}ms`)
    }
    global.playLogOneJobLock = 0
  })
}

let txtMsgs = () => {
  global.txtMsgsJobLock = 0
  schedule.scheduleJob(`*/10 * * * * *`, async() => {
    // 获取所有进行中的牌局ID，遍历所有消息，过滤存储
    if(global.txtMsgsJobLock) {
      return
    }
    global.txtMsgsJobLock = 1
    // for(let i = 0; i < 3; i ++) {
    //   let times = Date.now()
    //   let res = await gamesFn.playLogOneJob()
    //   if(res == 'noJob') {
    //     break
    //   }
    //   console.log(`[info] timeUse playLogOneJob s:${Date.now() - times}ms`)
    // }
    global.txtMsgsJobLock = 0
  })
}

let checkdata = () => {
  global.allClubCheckLock = 0
  schedule.scheduleJob(`*/2 * * * * *`, async() => {
    // 获取所有进行中的牌局ID，遍历所有消息，过滤存储
    if(global.allClubCheckLock) {
      return
    }
    global.allClubCheckLock = 1
    for(let i = 0; i < 2; i ++) {
      let times = Date.now()
      let res = await tools.checkClubExist()
      if(res == 'noJob') {
        break
      }
      console.log(`[info] timeUse checkClubExist s:${Date.now() - times}ms`)
    }
    global.allClubCheckLock = 0
  })

  global.clubCheckGradeLock = 0
  schedule.scheduleJob(`*/2 * * * * *`, async() => {
    // 获取所有进行中的牌局ID，遍历所有消息，过滤存储
    if(global.clubCheckGradeLock) {
      return
    }
    global.clubCheckGradeLock = 1
    for(let i = 0; i < 2; i ++) {
      let times = Date.now()
      let res = await tools.checkGameDetail()
      if(res == 'noJob') {
        break
      }
      console.log(`[info] timeUse checkGameDetail s:${Date.now() - times}ms`)
    }
    global.clubCheckGradeLock = 0
  })
}

module.exports = {
  master,
  token,
  games,
  grades,
  playlog,
  txtMsgs,
  checkdata
}
