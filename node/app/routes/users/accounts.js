'use strict'
const dayjs = require('dayjs')
const crypto = require('crypto')

let checkUserIntoRoom = async(ctx, next) => {
  let userInfo = ctx.state.userInfo
  let params = ctx.request.body || {}
  if(!params.roomId) {
    ctx.body = genresFun.error({
      message: '请求参数有误'
    })
    return
  }

  let wpkClubs = await cmsApi.request({
    userId: userInfo.userId,
    urlname: 'checkUserIntoRoom',
    data: {
      userId: userInfo.userId,
      roomId: params.roomId
    }
  })
  if(!wpkClubs || wpkClubs.errorCode || !wpkClubs.data) {
    ctx.body = genresFun.error({
      message: '用户检查失败'
    })
    return
  }

  ctx.body = genresFun.success(wpkClubs.data)
}

let baseinfo = async(ctx, next) => {
  let logTitle2Id = configObj.logTitle2Id
  let logId2Title = configObj.logId2Title

  let gameTypeName = configObj.gameTypeName

  let normalConfigInfo = configObj.normalConfigInfo

  ctx.body = genresFun.success({
    gameTypeName,
    logId2Title,
    logTitle2Id,
    opLogTitle: configObj.opLogTitle,
    normalConfigInfo,
    gameStatusText: configObj.gameStatusText,
    buyStypeText: configObj.buyStypeText,
    diamondList: configObj.diamondList,
    diamondUserId: configObj.diamondUserId,
    cmsVersion: configObj.cmsVersion,
    updateLog: configObj.updateLog,
    playerLoginHost1: configObj.playerLoginHost1,
    roomCfgs: configObj.roomCfgs,
    personLevel: configObj.personLevel,
  })
}

module.exports = {
  'POST /api/users/login': checkUserIntoRoom,
  'POST /api/baseinfo': baseinfo,
}
