let baseConfig = require('./baseinfo')

module.exports = {
  host_env: process.env.NODE_ENV,
  port: 9030,
  maxLastDay: 10,
  cardLogHour: 64,
  database: {
    // host: "18.162.227.61",
    // host: "127.0.0.1",
    host: '172.31.23.72',
    port: 3333,
    database: "wpkunions",
    user: "root",
    password: "wpkgoto",
    charset: 'utf8mb4_unicode_ci'
  },
  redis: {
    // host: "18.162.32.248",
    // host: "127.0.0.1",
    host: '172.31.23.72',
    port: 6666,
    password: 'wpkgoto',
    prefix_str: 'wpk_'
  },
  normalConfigInfo: {
    cheatUrl: 'https://sj.wpkmon.com/safepage/home/'
  },
  hhpCmsTele: 'https://api.telegram.org/bot1927305270:AAGjalPAMrGXdQBdBUYFZ4_SzFMrcDNquKo/',
  ...baseConfig,
  diamondUserId: '89219757'
}


