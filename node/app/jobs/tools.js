
// 做账号的永久登录，做token的获取刷新
// login ： 取出所有的合法的账号，登录， 成功就结束，不成功不处理

// 只获取clubs列表，做分拣装桶
const dayjs = require('dayjs')
const config = require('config')
const myredis = require('../redis/index')
const models = require('../models/index')
const utils = require('../utils/utils')
const services = require('../services/index')
const cmsApi = require('../services/cmsApi')

let flopInCheck = async () => {
  let nowT = Date.now()
  let today = dayjs().subtract(10, 'day').format('YYYY-MM-DD')
  let allPerson = await models.wpk_cheatCatch.selectUserData({
    startTime: today
  })
  console.log(`flopInCheck mans:${allPerson.length} tu:${Date.now() - nowT}`)

  if(!allPerson || !allPerson.length) {
    return false
  }

  let memberPureData = {}
  let leagueFlopInData = []

  allPerson.forEach(item => {
    leagueFlopInData.push({
      leagueId: item.leagueId,
      userId: item.userId,
      gameType: item.playType,
      totalHands: item.totalHands,
      flopHands: item.totalFlop / item.totalHands * 100
    })

    if(!memberPureData[item.userId]) {
      memberPureData[item.userId] = {
        totalHands: 0,
        totalFlop: 0,
        totalBonus: 0,
        totalBonusBb: 0,
        totalWins: 0,
        smallBlinds: []
      }
    }
    let sbs = item.smallBlinds.split(',')
    memberPureData[item.userId].totalHands += item.totalHands
    memberPureData[item.userId].totalBonus += item.totalBonus
    memberPureData[item.userId].totalBonusBb += item.totalBonusBb
    memberPureData[item.userId].totalFlop += item.totalFlop
    memberPureData[item.userId].totalWins += item.totalWins
    memberPureData[item.userId].smallBlinds.push(...sbs)
  })

  let memberLastData = []
  for(let userId in memberPureData) {
    let item = memberPureData[userId]
    memberLastData.push({
      userId: userId,
      totalHands: item.totalHands,
      totalFlop: item.totalFlop,
      flopInRate: parseInt((item.totalFlop / item.totalHands) * 100),
      totalBonus: item.totalBonus,
      totalBonusBb: parseInt(item.totalBonusBb),
      totalBbWins: parseInt((item.totalBonusBb/item.totalHands) * 100),
      totalWins: item.totalWins,
      totalWinRate: parseInt(item.totalWins / item.totalHands * 100),
      smallBlinds: utils.uniqueArray(item.smallBlinds)
    })
  }

  // 更新俱乐部入池率
  if(leagueFlopInData.length > 0) {
    await models.wpk_gameRates.createItems(leagueFlopInData)
  }

  // 更新玩家数据
  if(memberLastData.length > 0) {
    await models.wpk_cardlogs.updateUserData(memberLastData)
  }

  return true
}

let cheatGroupCheck = async () => {
  // 获取所有联盟的手牌汇总, 15天
  let nowT = Date.now()
  let startTime = dayjs().subtract(36, 'hours').format('YYYY-MM-DD')
  let allHands = await models.wpk_cardlogs.selectGroupData({
    startTime
  })
  console.log(`cheatGroupCheck mans:${allHands.length} tu:${Date.now() - nowT}`)

  if(!allHands || !allHands.length) {
    return false
  }

  // 统计：玩家在不同盲注的战绩、手数
  let memberPureData = {}

  let roomPureData = {}

  let roomMembers = {}

  // 组合原始数据
  let groupPureData = {}
  allHands.forEach(item => {
    roomMembers[item.newRoomId + '_' + item.userId] = item

    if(!memberPureData[item.userId]) {
      memberPureData[item.userId] = 0
    }
    memberPureData[item.userId] ++

    if(!roomPureData[item.newRoomId]) {
      roomPureData[item.newRoomId] = []
    }
    roomPureData[item.newRoomId].push(item.userId)
  })
  console.log(`cheatGroupCheck roomMembers:${Object.keys(roomMembers).length} tu:${Date.now() - nowT}`)
  console.log(`cheatGroupCheck roomPureData:${Object.keys(roomPureData).length} tu:${Date.now() - nowT}`)
  console.log(`cheatGroupCheck memberPureData:${Object.keys(memberPureData).length} tu:${Date.now() - nowT}`)

  for(let newRoomId in roomPureData) {
    let item = roomPureData[newRoomId]
    item.sort((a, b) => {
      return a - b > 0 ? 1 : -1
    })
    for(let i = 0; i < item.length; i ++) {
      for(let j = i + 1; j < item.length; j ++) {
        let keys = `${item[i]}_${item[j]}`
        if(!groupPureData[keys]) {
          groupPureData[keys] = {
            totalHands: 0,
            totalFlopIn: 0,
            oneFlopIn: 0,
            totalBonus: 0,
            totalWins: 0,
            AvBGrades: 0,
            oneByOneCount: 0,
            oneByOneIns: 0
          }
        }
        let userA = roomMembers[newRoomId + '_' +item[i]]
        let userB = roomMembers[newRoomId + '_' +item[j]]
        if(item.length > 2) {
          groupPureData[keys].totalHands ++
          groupPureData[keys].totalBonus += userA.bonusNum + userB.bonusNum
          groupPureData[keys].totalFlopIn += (userA.isFlopIn && userB.isFlopIn) ? 1 : 0
          groupPureData[keys].oneFlopIn += userA.isFlopIn || userB.isFlopIn
          if(userA.bonusNum > 0 || userB.bonusNum > 0) {
            groupPureData[keys].totalWins ++
          }
        } else {
          groupPureData[keys].oneByOneCount += 1
          groupPureData[keys].oneByOneIns += (userA.isFlopIn && userB.isFlopIn) ? 1 : 0
        }
        if(userA.bonusNum < 0 && userB.bonusNum > 0) {
          groupPureData[keys].AvBGrades += userA.bonusNum
        }
      }
    }
  }
  console.log(`cheatGroupCheck groupPureData:${Object.keys(groupPureData).length} tu:${Date.now() - nowT}`)

  // 按玩家AB，计算 同桌数/率，同入池数/率，同桌盈利数/BB，同入池盈利数/BB，AvB盈利数/BB
  let groupData = []
  for(let keys in groupPureData) {
    let item = groupPureData[keys]
    if(item.totalHands < 10) {
      // 低于10手牌的忽略
      continue
    }
    let [userA, userB] = keys.split('_')
    let totalHands = memberPureData[userA]
    if(totalHands > memberPureData[userB]) {
      totalHands = memberPureData[userB]
    }

    groupData.push({
      userA,
      userB,
      totalHands: item.totalHands,
      totalHandRate: parseInt(item.totalHands / totalHands * 1000),
      oneFlopIn: item.oneFlopIn,
      oneFlopInRate: parseInt(item.oneFlopIn / item.totalHands * 1000),
      totalFlopIn: item.totalFlopIn,
      totalFlopInRate: parseInt(item.totalFlopIn / item.totalHands * 1000),
      oneByOneCount: item.oneByOneCount,
      oneByOneRate: parseInt(item.oneByOneCount / item.totalHands * 1000),
      oneByOneIns: item.oneByOneIns,
      oneByOneInsRate: item.oneByOneCount ? parseInt(item.oneByOneIns / item.oneByOneCount * 1000) : 0,
      totalBonus: item.totalBonus,
      AvBGrades: item.AvBGrades,
      totalWins: item.totalWins,
      totalWinRate: parseInt(item.totalWins / item.totalHands * 1000)
    })
  }

  // 更新玩家数据
  if(groupData.length > 0) {
    await models.wpk_cardlogs.updateGroupData(groupData)
  }
  console.log(`cheatGroupCheck groupData:${groupData.length} tu:${Date.now() - nowT}`)
  // 存储2个用户统计表
  return true
}

let subFroozeCheck = async () => {
  // 所有子俱乐部列表，league正常的
  let subLists = await models.wpk_subClubs.selectWithLeague({
    subStatus: [0, 3]
  })

  if (!subLists || subLists.length == 0) {
    return true
  }
  let subListObj = {}
  subLists.forEach(item => {
    if(!subListObj[item.subClubId]) {
      subListObj[item.subClubId] = {
        totalGrades: 0,
        totalBuy: 0
      }
    }
    subListObj[item.subClubId].totalGrades += utils.calcGradeLeft(item)
  })

  // 进行中的游戏统计，按玩家统计
  let inGrades = await models.wpk_grades.selectFrooze({
    startTime: dayjs().subtract(4, 'day').format('YYYY-MM-DD'),
    subClubIds: Object.keys(subListObj)
  })

  if(!inGrades) {
    return true
  }

  // 合并计算
  let losedArrs = []
  let winedArrs = []
  inGrades.forEach(item => {
    if(!subListObj[item.subClubId]) {
      subListObj[item.subClubId] = {
        totalGrades: 0,
        totalBuy: 0
      }
    }

    subListObj[item.subClubId].totalGrades += item.totalGrades
    subListObj[item.subClubId].totalBuy += item.totalBuy
    if(subListObj[item.subClubId].totalGrades - 10 <= 0) {
      losedArrs.push(item.subClubId)
    } else {
      winedArrs.push(item.subClubId)
    }
  })

  let sendList = {}
  subLists.forEach(item => {
    if(subListObj[item.subClubId].totalGrades - 10 <= 0) {
      if(item.status != 3) {
        losedArrs.push(item.subClubId)
        if(!sendList[item.belongClubId]) {
          sendList[item.belongClubId] = []
        }
        sendList[item.belongClubId].push({
          telegramRobot: item.telegramRobot,
          leagueId: item.belongClubId,
          subClubName: item.subClubName,
          subClubId: item.subClubId,
          leftLose: utils.formatFloat(subListObj[item.subClubId].totalGrades),
          gameBuy: utils.formatFloat(subListObj[item.subClubId].totalBuy),
          isLose: 1
        })
      }
    } else {
      if(item.status != 0) {
        winedArrs.push(item.subClubId)
        if(!sendList[item.belongClubId]) {
          sendList[item.belongClubId] = []
        }
        sendList[item.belongClubId].push({
          telegramRobot: item.telegramRobot,
          leagueId: item.belongClubId,
          subClubName: item.subClubName,
          subClubId: item.subClubId,
          isGreen: item.isGreen,
          leftLose: utils.formatFloat(subListObj[item.subClubId].totalGrades),
          gameBuy: utils.formatFloat(subListObj[item.subClubId].totalBuy),
          isLose: 0
        })
      }
    }
  })
  // 冻结操作
  if(losedArrs.length > 0) {
    await models.wpk_subClubs.updateQuery({
      subClubIds: losedArrs
    }, {
      status: `=3`
    })
  }
  if(winedArrs.length > 0) {
    await models.wpk_subClubs.updateQuery({
      subClubIds: winedArrs
    }, {
      status: `=0`
    })
  }

  // 发送消息
  for(let leagueId in sendList) {
    let item = sendList[leagueId]
    await robotApi.sendMessage(item.telegramRobot, 'subFroozee', {
      leagueId,
      list: item
    })
  }

  return true
}

let deleteDataJob = async () => {
  // 最多保留 maxExistDay 的数据
  let nowData = Date.now()
  let maxExistDay = 32
  if(config.host_env == 'dev') {
    maxExistDay = 24
  }
  let nowT = dayjs().subtract(maxExistDay, 'day')
  let timeStr = nowT.format('YYYY-MM-DD HH:mm:ss')
  let timeStrMore = dayjs().subtract(maxExistDay + 40, 'day').format('YYYY-MM-DD HH:mm:ss')
  let timeStrLess = dayjs().subtract(maxExistDay - 22, 'day').format('YYYY-MM-DD HH:mm:ss')
  let timeStr50 = dayjs().subtract(maxExistDay + 30, 'day').format('YYYY-MM-DD HH:mm:ss')
  console.log(`[info] deleteDataJob begin at:${timeStr}`)
  let tablenames = ['wpk_playlog', 'wpk_games', 'wpk_grades', 'wpk_cardActions', 'wpk_handGrades', 'wpk_diamondLogs', 'wpk_userIps', 'wpk_groupDatas']
  // 'wpk_oplogs',

  for(let i in tablenames) {
    let name = tablenames[i]
    try {
      if(['wpk_games', 'wpk_grades', 'wpk_groupDatas'].indexOf(name) > -1) {
        await models.wpk_clearData.clearByCreateAt(timeStr50, name)
      } else if(['wpk_handGrades', 'wpk_cardActions'].indexOf(name) > -1) {
        await models.wpk_clearData.clearByCreateAt(timeStrLess, name)
      } else {
        await models.wpk_clearData.clearByCreateAt(timeStrMore, name)
      }
    } catch(e) {
      console.log(`[error] deleteDataJob at:${timeStr} t:${name}`)
    }
  }

  console.log(`[info] deleteDataJob timeUse:${Date.now() - nowData}`)
}

let gradeLogDouble = async () => {
  // 所有子俱乐部列表，league正常的

  let startTime = dayjs().subtract(3, 'hours').format('YYYY-MM-DD HH:mm')
  let flag = await models.wpk_playlogs.checkDoubleGames(startTime)

  console.log('gradeDoubleLock --->', flag)

  if(!flag) {
    return false
  }

  if(flag.length > 0) {
    await robotApi.sendMessage(config.masterRobotId, 'doubleGradeError', {
      gameCounts: flag.length
    })
  }

  return true
}

let getClubRoomList = async (startStr, clubId) => {
  let startTime = dayjs(startStr).valueOf()
  let endTime = startTime + 24 * 60 * 60 * 1000

  let userId = 89330994

  if(config.host_env == 'online') {
    userId = 89224691
  }

  let pageSize = 100
  let pageNo = 1

  let flag = true
  let roomDatas = []

  while(flag) {
    let data = {
      clubId,
      userId,
      pageNo,
      startDate: startTime,
      endDate: endTime,
      pageSize
    }
    let res = await cmsApi.request({
      userId,
      urlname: 'getRoomHistory',
      data
    })

    if(!res) {
      console.log(`获取失败：${clubId} ${startStr}` )
      flag = false
      return false
    }
    if(res.errorCode == 2601) {
      console.log(`${clubId} ${startStr} ${res.errMsg} ${res.errorCode}`)
      flag = false
      return false
    }

    if(res.errorCode) {
      console.log(`${clubId} ${startStr} ${res.errMsg} ${res.errorCode}`)
      flag = false
      return 'continue_check'
    }
    roomDatas = roomDatas.concat(res.data.roomViewList)
    if(res.data.roomViewList.length < pageSize) {
      flag = false
    }
    pageNo ++
  }

  let totalInfo = {
    clubId,
    roomNum: 0,
    blinds: {},
    playTypes: {},
  }

  let roomIds = []
  let roomInfos = []
  for(let i = 0; i < roomDatas.length; i ++) {
    let item = roomDatas[i]
    totalInfo.roomNum += 1

    let sbNum = item.smallBlind || item.ante
    if(!totalInfo.blinds[sbNum]) {
      totalInfo.blinds[sbNum] = 1
    }
    if(!totalInfo.playTypes[item.playType]) {
      totalInfo.playTypes[item.playType] = 1
    }

    roomInfos.push({
      clubId,
      gameDate: startStr,
      roomId: item.roomId,
      smallBlind: item.smallBlind,
      personNumMax: item.personNumMax,
      startTime: item.startTime,
      duration: item.duration,
      ante: item.ante,
      playType: item.playType,
      roomStatus: item.roomStatus,
      createTime: item.createTime,
    })
    roomIds.push(item.roomId)
  }
  totalInfo.blinds = Object.keys(totalInfo.blinds).join(',')
  totalInfo.playTypes = Object.keys(totalInfo.playTypes).join(',')

  // 将所有游戏信息存mysql
  if(roomInfos.length > 0) {
    let flag = await models.wpk_checkClubs.createGames(roomInfos)
    // 将所有的游戏ID存入列表，准备开干
    if(flag) {
      await myredis.tools.pushRoomIds(roomIds)
    } else {
      return 'continue_check'
    }
  }

  return totalInfo
}

let checkClubExist = async() => {
  let clubId = await myredis.tools.popClubId()
  if(!clubId) {
    console.log('checkClubExist not get clubId')
    return 'noJob'
  }

  let gameDate = dayjs().subtract(24, 'hours').format('YYYY-MM-DD')
  // 获取俱乐部数据
  let data = await getClubRoomList(gameDate, clubId)
  if(data == 'continue_check') {
    // 放回去
    await myredis.tools.pushClubId([clubId])
    return false
  }

  if(data && data.roomNum > 0) {
    await models.wpk_checkClubs.createNew({
      clubId,
      gameDate,
      blinds: data.blinds,
      playTypes: data.playTypes,
      roomNum: data.roomNum,
    })
  }

  return true
}

let getCheckClubIds = async() => {
  // redis里面放一个锁，确认今天是否完成了检测
  let dayStr = dayjs().format('YYYYMMDD')

  if(dayStr >= '20230407') {
    return false
  }

  // 要在3点以后放


  let existDay = await myredis.tools.getClubDayLock()
  if(existDay == dayStr) {
    return false
  }

  // 取出所有俱乐部ID
  let clubIds = await models.wpk_checkClubs.selectAll()

  if(!clubIds) {
    return false
  }

  let tmp = []
  for(let i = 0; i < clubIds.length; i ++){
    if(tmp.length < 300) {
      tmp.push(clubIds[i].clubId)
    } else {
      await myredis.tools.pushClubId(tmp)
      tmp = []
    }
  }
  if(tmp.length > 0 ){
    await myredis.tools.pushClubId(tmp)
  }

  // 设置不在存取
  await myredis.tools.setClubDayLock(dayStr)
  return true
}

let checkGameDetail = async() => {
  let roomId = await myredis.tools.popRoomIds()
  if(!roomId) {
    console.log('checkGameDetail not get roomId')
    return 'noJob'
  }

  let userId = 89330994

  if(config.host_env == 'online') {
    userId = 89224691
  }

  let details = await cmsApi.request({
    userId,
    urlname: 'room_detail',
    data: {
      userId,
      roomId
    }
  })

  if(details && details.errorCode == 0) {
    // 游戏信息提取
    // 玩家战绩提取
    let tmpdata = details.data
    let gameInfo = {
      currentBoutNum: `=${tmpdata.currentBoutNum}`,
      totalScoreBuy: `=${tmpdata.totalScoreBuy}`,
      totalFlow: `=${tmpdata.totalFlow}`,
      curGameFund: `=${tmpdata.curGameFund || tmpdata.gameFund || 0}`,
      gameFundRate: `=${tmpdata.gameFundRate || 0}`
    }
    let flag = await models.wpk_checkClubs.updateGame(roomId, gameInfo)

    if(flag) {
      let userList = tmpdata.userDetailList || []
      if(userList.length > 0) {
        await models.wpk_checkClubs.createGrades(roomId, userList)
      }
    }
  }

  return true
}


module.exports = {
  flopInCheck,
  subFroozeCheck,
  cheatGroupCheck,
  deleteDataJob,
  gradeLogDouble,
  checkClubExist,
  getCheckClubIds,
  checkGameDetail
}
