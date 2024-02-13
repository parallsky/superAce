'use strict'
const mysql = require('mysql')

let createNew = (query, data) => {
  let sql = `INSERT INTO wpk_accounts(account, nickname, email, wpkPwd, countryCode, phone, status, userId) VALUES('${data.account}', ${mysql.escape(data.nickname || '')}, ${mysql.escape(data.email || '')}, '${data.wpkPwd}', '${data.countryCode}', '${data.phone}', ${data.status || 0}, ${data.userId})`
  sql += ' on duplicate key update nickname=VALUES(nickname), phone=VALUES(phone), status=VALUES(status), wpkPwd=VALUES(wpkPwd);'
  return sql
}

let select =  (query, data) => {
  let sql = `select * from users  `

  let str = []
  for(let i in data) {
    str.push(`${i}${data[i]}`)
  }
  if(str.length > 0){
    sql += ` WHERE ${str.join(' and ')} `
  }
  if(query.limit) {
    sql += ` limit ${query.limit}`
  }

  return sql
}

let updateQuery =  (query, data) => {
  let str = []
  for(let i in data) {
    str.push(`${i}${data[i]}`)
  }

  let sql = `UPDATE users  set ${str.join(',')} `

  console.log('updateQuery ---->', sql)
  return sql
}

let selectWithUser = (data) => {
  let sql = `select wpk_leagues.*, wpk_leagues.status as leagueStatus, wpk_accounts.userId, wpk_accounts.nickname, wpk_accounts.status as userStatus, wpk_accounts.superOpLock from wpk_leagues left join wpk_accounts on wpk_accounts.userId=wpk_leagues.unionUserId where wpk_leagues.unionStatus=${data.unionStatus} and wpk_leagues.status=${data.leagueStatus || 0} and wpk_accounts.status=${data.userStatus || 0};`
  return sql
}

module.exports = {
  select,
  createNew,
  updateQuery,
  selectWithUser,
}
