'use strict'

let project = require('../../package.json');
let _ = require('lodash');

function buildResponse (content, isOk, meta) {
  let errorCode = 0
  let data = content

  meta = meta || {}

  if (undefined === isOk) {
    isOk = true
  }
  if(!isOk) {
    if(!content.errorTxt) {
      data = content.message
    } else {
      data = content
    }
    errorCode = content.errorCode || 1000001
  }
  return _.extend({
    ok: isOk,
    data: data,
    errorCode: errorCode,
    version: configObj.serverVersion
  }, meta)
}

module.exports = {
  success: function (resp) {
    return buildResponse(resp)
  },
  streamList: function(resp, lastId) {
    return buildResponse(resp, true, { lastId: lastId })
  },
  error: function (err) {
    return buildResponse(err, false)
  },
  list: function (mongoPackage) {
    return buildResponse(mongoPackage.data, true, _.omit(mongoPackage, 'data'))
  }
};

