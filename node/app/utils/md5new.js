var n = 0,
  o = 8;

function i(e, t) {
  e[t >> 5] |= 128 << t % 32, e[14 + (t + 64 >>> 9 << 4)] = t;
  for (var n = 1732584193, o = -271733879, i = -1732584194, r = 271733878, d = 0; d < e.length; d += 16) {
    var p = n,
      h = o,
      f = i,
      g = r;
    n = a(n, o, i, r, e[d + 0], 7, -680876936), r = a(r, n, o, i, e[d + 1], 12, -389564586), i = a(i, r, n, o, e[d + 2], 17, 606105819), o = a(o, i, r, n, e[d + 3], 22, -1044525330), n = a(n, o, i, r, e[d + 4], 7, -176418897), r = a(r, n, o, i, e[d + 5], 12, 1200080426), i = a(i, r, n, o, e[d + 6], 17, -1473231341), o = a(o, i, r, n, e[d + 7], 22, -45705983), n = a(n, o, i, r, e[d + 8], 7, 1770035416), r = a(r, n, o, i, e[d + 9], 12, -1958414417), i = a(i, r, n, o, e[d + 10], 17, -42063), o = a(o, i, r, n, e[d + 11], 22, -1990404162), n = a(n, o, i, r, e[d + 12], 7, 1804603682), r = a(r, n, o, i, e[d + 13], 12, -40341101), i = a(i, r, n, o, e[d + 14], 17, -1502002290), n = s(n, o = a(o, i, r, n, e[d + 15], 22, 1236535329), i, r, e[d + 1], 5, -165796510), r = s(r, n, o, i, e[d + 6], 9, -1069501632), i = s(i, r, n, o, e[d + 11], 14, 643717713), o = s(o, i, r, n, e[d + 0], 20, -373897302), n = s(n, o, i, r, e[d + 5], 5, -701558691), r = s(r, n, o, i, e[d + 10], 9, 38016083), i = s(i, r, n, o, e[d + 15], 14, -660478335), o = s(o, i, r, n, e[d + 4], 20, -405537848), n = s(n, o, i, r, e[d + 9], 5, 568446438), r = s(r, n, o, i, e[d + 14], 9, -1019803690), i = s(i, r, n, o, e[d + 3], 14, -187363961), o = s(o, i, r, n, e[d + 8], 20, 1163531501), n = s(n, o, i, r, e[d + 13], 5, -1444681467), r = s(r, n, o, i, e[d + 2], 9, -51403784), i = s(i, r, n, o, e[d + 7], 14, 1735328473), n = c(n, o = s(o, i, r, n, e[d + 12], 20, -1926607734), i, r, e[d + 5], 4, -378558), r = c(r, n, o, i, e[d + 8], 11, -2022574463), i = c(i, r, n, o, e[d + 11], 16, 1839030562), o = c(o, i, r, n, e[d + 14], 23, -35309556), n = c(n, o, i, r, e[d + 1], 4, -1530992060), r = c(r, n, o, i, e[d + 4], 11, 1272893353), i = c(i, r, n, o, e[d + 7], 16, -155497632), o = c(o, i, r, n, e[d + 10], 23, -1094730640), n = c(n, o, i, r, e[d + 13], 4, 681279174), r = c(r, n, o, i, e[d + 0], 11, -358537222), i = c(i, r, n, o, e[d + 3], 16, -722521979), o = c(o, i, r, n, e[d + 6], 23, 76029189), n = c(n, o, i, r, e[d + 9], 4, -640364487), r = c(r, n, o, i, e[d + 12], 11, -421815835), i = c(i, r, n, o, e[d + 15], 16, 530742520), n = l(n, o = c(o, i, r, n, e[d + 2], 23, -995338651), i, r, e[d + 0], 6, -198630844), r = l(r, n, o, i, e[d + 7], 10, 1126891415), i = l(i, r, n, o, e[d + 14], 15, -1416354905), o = l(o, i, r, n, e[d + 5], 21, -57434055), n = l(n, o, i, r, e[d + 12], 6, 1700485571), r = l(r, n, o, i, e[d + 3], 10, -1894986606), i = l(i, r, n, o, e[d + 10], 15, -1051523), o = l(o, i, r, n, e[d + 1], 21, -2054922799), n = l(n, o, i, r, e[d + 8], 6, 1873313359), r = l(r, n, o, i, e[d + 15], 10, -30611744), i = l(i, r, n, o, e[d + 6], 15, -1560198380), o = l(o, i, r, n, e[d + 13], 21, 1309151649), n = l(n, o, i, r, e[d + 4], 6, -145523070), r = l(r, n, o, i, e[d + 11], 10, -1120210379), i = l(i, r, n, o, e[d + 2], 15, 718787259), o = l(o, i, r, n, e[d + 9], 21, -343485551), n = u(n, p), o = u(o, h), i = u(i, f), r = u(r, g)
  }
  return Array(n, o, i, r)
}

function r(e, t, n, o, i, r) {
  return u((a = u(u(t, e), u(o, r))) << (s = i) | a >>> 32 - s, n);
  var a, s
}

function a(e, t, n, o, i, a, s) {
  return r(t & n | ~t & o, e, t, i, a, s)
}

function s(e, t, n, o, i, a, s) {
  return r(t & o | n & ~o, e, t, i, a, s)
}

function c(e, t, n, o, i, a, s) {
  return r(t ^ n ^ o, e, t, i, a, s)
}

function l(e, t, n, o, i, a, s) {
  return r(n ^ (t | ~o), e, t, i, a, s)
}

function u(e, t) {
  var n = (65535 & e) + (65535 & t);
  return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n
}

function d(e) {
  for (var t = Array(), n = (1 << o) - 1, i = 0; i < e.length * o; i += o) t[i >> 5] |= (e.charCodeAt(i / o) & n) << i % 32;
  return t
}

function p(e) {
  for (var t = n ? "0123456789ABCDEF" : "0123456789abcdef", o = "", i = 0; i < 4 * e.length; i++) o += t.charAt(e[i >> 2] >> i % 4 * 8 + 4 & 15) + t.charAt(e[i >> 2] >> i % 4 * 8 & 15);
  return o
}
module.exports = function (e) {
  return p(i(d(e), e.length * o))
}
