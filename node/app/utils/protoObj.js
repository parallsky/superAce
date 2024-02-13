const protobuf = require("protobufjs")
const Crypto = require('crypto-js')

let msgShorts = {
  startGame: "C_startGame",
  checkSitOpt: "C_checkSitV2",
  sitDown: "C_sit",
  standUp: "C_stand",
  sendMsg: "C_imMsg",
  sendEmoji: "C_emoji",
  sendRedPacket: "C_redPack",
  sendDiamond: "C_diamondSend",
  request: "C_request",
  joinRoom: "C_joinRoom",
  exitRoom: "C_exitRoom",
  forceStand: "C_forceStand",
  seeComCard: "WP_seeComCard",
  forceSeeCard: "WP_forceSeeCard",
  raise: "WP_raise",
  allin: "WP_allin",
  call: "WP_call",
  fold: "WP_fold",
  check: "WP_check",
  openCard: "WP_openCard",
  doubleDeal: "WP_doubleDeal",
  prolong: "WP_prolong",
  autoOpt: "WP_autoOpt",
  addScore: "WP_addScore",
  than2: "WP_chooseDouble",
  backSeat: "WP_backSeat",
  sysOpt: "WP_sysOpt",
  pongMessage: "PongMessage",
  hiddenGame: "C_HiddenGame",
  tableClose: "C_closeTable",
  otherPay: "WP_addScoreOtherPay",
  shieldUserMsg: "C_shieldUserMsg",
  roundChangeNotify: "WP_roundChangeNotify",
  upDateRoomNotify: "C_updateRoomNotify",
  updateRoomUserNotify: "C_updateRoomUserNotify",
  cleanNotify: "C_cleanNotify",
  imMsgNotify: "C_imMsgNotify",
  imEmojiNotify: "C_emojiNotify",
  redPackNotify: "C_redPackNotify",
  quickSportTicketsNotify: "C_quickSportTicketsNotify",
  roomCloseNotify: "C_closeRoomNotify",
  showCardNotify: "WP_showCardNotify",
  actionNotify: "WP_actionNotify",
  userOptNotify: "WP_userOptNotify",
  dealNotify: "WP_dealNotify",
  playResultNotify: "WP_playResultNotify",
  updateUserInfoNotify: "C_updateUserInfoNotify",
  bankerChangeNotify: "WP_bankerChangeNotify",
  prolongNotify: "WP_prolongNotify",
  userChooseDoubleNotify: "WP_userChooseDoubleNotify",
  userCSDResultNotify: "WP_userCSDResultNotify",
  sendDoubleThanResultNotify: "WP_sendDoubleThanResultNotify",
  openSendDoubleNotify: "WP_openSendDoubleNotify",
  cleanGameNotify: "WP_cleanGameNotify",
  needAddScore: "WP_needAddScoreNotify",
  seeComCardNotify: "WP_seeComCardNotify",
  forceSeeCardNotify: "WP_forceSeeCardNotify",
  openCardByAllinNotify: "WP_openCardByAllinNotify",
  openCardNotify: "WP_openCardNotify",
  addScoreStatusNotify: "WP_addScoreStatusNotify",
  clubMsg: "AM_sendGameMsg",
  updateHistoryData: "C_playLogNotify",
  updateRoomInfo: "C_updateRoomDetail",
  starGame: "C_starGame",
  waitHandsNotify: "WP_waitHandsNotify",
  raiseBlind: "WP_raiseBlind",
  updateUserProfileNotify: "WP_updateUserProfileNotify",
  updateDiamondBalanceNotify: "WP_updateDiamondBalanceNotify",
  diamondSendNotify: "C_diamondSendNotify",
  deskSportNotify: "WP_deskSportNotify",
  a5CalmDownNotify: "C_a5CalmDownNotify"
}
let protoLoad = (filePath) => {
  return new Promise((resolve, reject) => {
    protobuf.load(filePath, (err, root) => {
      if(!err) {
        resolve && resolve(root)
      } else {
        reject && reject(err)
      }
    })
  })
}

let loadInit = async () => {
  let protoRootReq = await protoLoad("./app/proto/MsgDeliverReqProto.proto")
  let protoRootResp = await protoLoad("./app/proto/MsgDeliverRespProto.proto")
  global.protoRootRq = protoRootReq
  global.protoRootRs = protoRootResp
}
let objToObj = (e) => {
  return -1 != ["boolean", "number", "string", "symbol", "function", "undefined"].indexOf(typeof e) ? e : null === e ? e : Array.isArray(e) ? e.map(objToObj) : Object.keys(e).reduce((t, i) => {
    var n = e[i];
    return Array.isArray(n) && (n = n.map(objToObj)),
    "object" == typeof n && (n = objToObj(n)),
    t[i] = n,
    t
  }, {})
}
let decodeFun1 = (e) => {
  return Object.keys(e).forEach((t) => {
      var i = e[t];
      i.value ? e[t] = i.value : "Int32Value" == i.constructor.name ? e[t] = 0 : "Int64Value" == i.constructor.name ? e[t] = 0 : "StringValue" == i.constructor.name ? e[t] = "" : "DoubleValue" == i.constructor.name ? e[t] = 0 : "BoolValue" == i.constructor.name ? e[t] = !1 : decodeFun1(i)
  }), e
}
let _getRandomString = function (e) {
  console.log('_getRandomString ', e)
  for (var t = "", n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", o = n.length, i = 0; i < e; i++) t += n.charAt(Math.floor(Math.random() * o));
  return t
}
let decryptMessage = function (e) {
  let _aesKey = _getRandomString(6)
  var t = new Uint8Array(e)
  if (!t || 0 == t.length) throw "empty";
  var n = Crypto.lib.WordArray.create(t),
      o = Crypto.enc.Base64.stringify(n),
      r = Crypto.SHA1(Crypto.SHA1(_aesKey)).toString().substring(0, 32),
      a = Crypto.enc.Hex.parse(r),
      s = Crypto.AES.decrypt(o, a, {
          mode: Crypto.mode.ECB,
          padding: Crypto.pad.Pkcs7
      }),
      c = _convertWordArrayToUint8Array(s);
  return _typedArrayToBuffer(c)
}
let _typedArrayToBuffer = function (e) {
  return e.buffer.slice(e.byteOffset, e.byteLength + e.byteOffset)
}
let _convertWordArrayToUint8Array = function (e) {
  var t, n, o = e.hasOwnProperty("words") ? e.words : [],
      i = e.hasOwnProperty("sigBytes") ? e.sigBytes : 4 * o.length,
      r = new Uint8Array(i),
      a = 0;
  for (n = 0; n < i; n++) t = o[n], r[a++] = t >> 24, r[a++] = t >> 16 & 255, r[a++] = t >> 8 & 255, r[a++] = 255 & t;
  return r
}

let decodeFun = (e) => {
  var t = protoRootRs.lookupType("com.hm.wepoker.battle.controller.proto.MsgDeliverResp").decode(e);
  if ((t = decodeFun1(t)).protoType && t.msgBody && t.msgBody.length > 0) {
    var i = t.protoType
      , n = t.msgBody
      , o = protoRootRs.lookupType("com.hm.wepoker.battle.controller.proto." + i).decode(n)
      , a = decodeFun1(o);
    t.msgBody = a
  }
  return t
}

let onMessageUnPack = (e) => {
  let odata
  try {
    odata = decryptMessage(e)
  } catch (i) {
    odata = e
  }
  return odata
}

let decodeProtoMsg = (e) => {
  let res
  if ("string" == typeof e) {
    res = JSON.parse(e)
  } else {
    let n = new Uint8Array(e)
    res = decodeFun(n)
  }
  return res
}
let encodeBodyMsg = (e, t) => {
  let i = protoRootRq.lookupType("com.hm.wepoker.battle.controller.proto." + t)
  let n = i.create(e)
  let buffer = i.encode(n).finish()
  return buffer
}

let protoApi = {
  objToObj,
  decodeFun1,
  decodeFun,
  decodeProtoMsg,
  encodeBodyMsg
}

let getProtoMsg = (msgType, objs, gameInfo) => {
  var o = {
    sendTime: (new Date).getTime(),
    userId: gameInfo.userId,
    sessionToken: gameInfo.sessionToken,
    version: '999.999.999'
  }
  var a = {
    msgType,
    optHandle: 0,
    targetId: gameInfo.roomId || 0,
    msgBody: objs || '',
    sign: "",
    stubInfo: o,
    callbackId: gameInfo.callbackId || ([msgShorts.pongMessage, msgShorts.sendMsg, msgShorts.sendEmoji].indexOf(msgType) > -1 ?  'p1' : 'c1')
  }
  a = protoApi.encodeBodyMsg(a, 'MsgDeliverReq')
  return a
}

module.exports = {
  loadInit,
  getProtoMsg,
  onMessageUnPack,
  ...protoApi
}
