'use strict'
const genres = require('../utils/genres')
const utils = require('../utils/utils')
const config = require('config')
const mysql = require('mysql')
const models = require('../models/index')
const myredis = require('../redis/index')
const dayjs = require('dayjs')

let tokenFreshJob = async(userId) => {

  let token = await myredis.token.tokenInfo(userId)
  console.log('tokenFreshJob ----->', userId, token)
  if(token && token != null) {
    return false
  }

  let myinfo = await models.wpk_accounts.select({
    userId: `=${userId}`
  }, 1)
  console.log('tokenFreshJob myinfo----->', myinfo)

  if(!myinfo || !myinfo.length) {
    return false
  }
  myinfo = myinfo[0]
  if(myinfo.status != 0) {
    return false
  }

  let flag = await cmsApi.cmsLoginCheck({
    phoneNum: myinfo.phone,
    countryCode: myinfo.countryCode,
    password: myinfo.wpkPwd
  })
  console.log('tokenFreshJob myinfo1----->', flag)

  if(!flag || flag.errorCode) {
    console.log(`[error] token failed phone:${myinfo.phone} code:${myinfo.countryCode} uid:${myinfo.userId}`)
    return false
  }
  console.log(`[info] token success phone:${myinfo.phone} code:${myinfo.countryCode} uid:${myinfo.userId}`)
  return true
}

let memberFreshJob = async(leagueId) => {
  let myinfo = await models.wpk_leagues.select({
    leagueId: `=${leagueId}`
  }, 1)
  if(!myinfo || !myinfo.length) {
    await myredis.lockHash.memberLockSet(leagueId, Date.now() - 9 * 60 * 1000)
    return false
  }
  myinfo = myinfo[0]
  if(myinfo.status != 0 || myinfo.unionStatus != 1) {
    await myredis.lockHash.memberLockSet(leagueId, Date.now() - 9 * 60 * 1000)
    return false
  }

  let wpkClubs = await cmsApi.request({
    userId: myinfo.unionUserId,
    urlname: 'getClubUserList',
    data: {
      clubId: leagueId,
      userId: myinfo.unionUserId,
      sort: 'desc'
    }
  }, true)
  if(!wpkClubs || wpkClubs.errorCode || !wpkClubs.data) {
    if(wpkClubs) {
      console.log(`[error] wpkmembers failed lid:${leagueId} code:${wpkClubs.errorCode} msg:${wpkClubs.errMsg}`)
    } else {
      console.log(`[error] wpkmembers failed lid:${leagueId} code:${wpkClubs} `)
    }
    await myredis.lockHash.memberLockSet(leagueId, Date.now() - 9 * 60 * 1000)
    return false
  }
  let list = []

  let timeStr = dayjs().format('YYYY-MM-DD HH:mm:ss')
  let userIds = []
  for(let key in wpkClubs.data) {
    let tmpUsers = wpkClubs.data[key]
    tmpUsers.forEach(item => {
      list.push({
        inLeagueTime: timeStr,
        isInLeague: 1,
        identity: item.identity,
        ipArea: item.ipArea,
        leagueId,
        freeScore: item.freeScore,
        nickname: item.nickname,
        userId: item.userId,
        mark: item.mark || ''
      })
      userIds.push(item.userId)
    })
  }

  if(userIds.length > 0) {
    await models.wpk_members.createNew(list)
    // 标记退出
    await models.wpk_members.updateQuery({
      notUserIds: userIds,
      leagueId: leagueId,
    }, {
      isInLeague: `=0`
    })
  }

  await myredis.lockHash.memberLockSet(leagueId, Date.now())
  return true
}


let getUserClubs = async(userId) => {
  // 从远程拉取wpk俱乐部
  let cmsData = await cmsApi.request({
    urlname: 'getClubList',
    userId,
    data: {
      userId,
      bShowApplying: 1
    }
  })

  return true
}


module.exports = {
  tokenFreshJob,
  memberFreshJob,
  getUserClubs
}


