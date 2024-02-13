const fs = require('fs')
const path = require('path')
const router = require('koa-router')()
const config = require('config')

function addMapping(mapping) {
  for (let url in mapping) {
    let splits = url.split(" ")
    if (splits.length !== 2) {
      console.log(`router init invalid URL: ${url}`)
      continue
    }
    let type = splits[0].toUpperCase()
    if (['GET', 'POST', 'DEL', 'PUT', 'ALL'].indexOf(type) === -1) {
      console.log(`router init invalid URL: ${url}`)
      continue
    }
    let path = splits[1]
    router[type.toLowerCase()](path, mapping[url])
    console.log(`router init register URL mapping: ${type} ${path}`)
  }
}

function fileScanMap(f, dir) {
  console.log(`router init process controller: ${dir}/${f}`)
  let mapping = require(__dirname + '/' + dir + '/' + f)
  addMapping(mapping)
}

function addControllers(dir) {
  fs.readdirSync(__dirname + '/' + dir).forEach((f) => {
    if(f.endsWith('.js')) {
      fileScanMap(f, dir)
    } else {
      addControllers(path.join(dir, f))
    }
  })
}

module.exports = function (dir) {
  let controllersDir = dir || 'routes'

  addControllers(controllersDir)
  return router
}
