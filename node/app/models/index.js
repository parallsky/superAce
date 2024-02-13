const fs = require('fs')
const path = require('path')
const mysql = require('../utils/mysql')
// const tables = require('./tables/index')


let getSqls = (dir) => {
  return fs.readdirSync(dir).filter(f => {
    return f.endsWith('.js')
  })
}


let mysqlInit = async(dbName) => {
  // 连接数据库
  let mysqlVar = mysql.AsyncMysqljs(configObj.databases[dbName])

  // 创建表
  try {
    let tableDir = path.resolve(__dirname, dbName, 'tables')
    let tables = getSqls(tableDir)

    for(let k in tables) {
      let sql = require(path.resolve(tableDir, tables[k]))
      if(sql && typeof sql == 'string') {
        await mysqlVar.execute(sql)
      }
    }
  } catch(e) {
    console.log(`[error] ${dbName} 数据表初始化失败，关闭服务, err:`, e)
    process.exit(0)
  }

  return mysqlVar
}

let modelUtils = async(dbName, mysqlVar) => {
  // // 创建sql查询函数
  let funcDir = path.resolve(__dirname, dbName)
  let funcFiles = getSqls(funcDir)

  let utilsObj = {}

  for(let k in funcFiles) {
    let fn = funcFiles[k]
    let sqlObj = require(path.resolve(funcDir, fn))
    if(sqlObj && typeof sqlObj == 'object') {
      let fileName = fn.replace('.js', '')
      utilsObj[fileName] = {}
      for(let funcName in sqlObj) {
        utilsObj[fileName][funcName] = async(query, data) => {
          let sql = sqlObj[funcName](query, data)
          console.log('sql -----', sql)
          let value = []
          let res
          try {
            res = await mysqlVar.execute(sql, value)
          }catch(e) {
            res = false
            console.log(`[error] ${dbName} ${fileName} ${funcName} err:`, e)
          }
          return res
        }
      }
    }
  }
  console.log(`mysql ${dbName} --->`, utilsObj)
  return utilsObj
}

// 关闭group by 限制
// SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY,',''));


module.exports = {
  mysqlInit,
  modelUtils
}
