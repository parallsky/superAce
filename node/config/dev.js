let baseConfig = require('./baseinfo')

module.exports = {
  host_env: process.env.NODE_ENV,
  port: 80,
  maxLastDay: 10,
  cardLogHour: 24,
  databases: {
    quanzi: {
      host: '127.0.0.1',
      port: 3306,
      database: 'quanzi',
      user: 'root',
      password: 'gotokeep',
      charset: 'utf8mb4_unicode_ci'
    },
    wpks: {
      host: '127.0.0.1',
      port: 3306,
      database: 'wpkdatas',
      user: 'root',
      password: 'gotokeep',
      charset: 'utf8mb4_unicode_ci'
    },
    // dpzxs: {
    //   host: 'superace.cjcxirozvtjf.ap-east-1.rds.amazonaws.com',
    //   port: 3306,
    //   database: 'dpzxdatas',
    //   user: 'admin',
    //   password: 'Oax86viI0IDa7WoIKlvS',
    //   charset: 'utf8mb4_unicode_ci'
    // },
    // hhps: {
    //   host: 'superace.cjcxirozvtjf.ap-east-1.rds.amazonaws.com',
    //   port: 3306,
    //   database: 'hhdatas',
    //   user: 'admin',
    //   password: 'Oax86viI0IDa7WoIKlvS',
    //   charset: 'utf8mb4_unicode_ci'
    // }
  },
  redis: {
    quanzi: {
      host: '127.0.0.1',
      port: 6379,
      password: 'gotokeep',
      prefix_str: 'qz_'
    },
    jobs: {
      host: '127.0.0.1',
      port: 6379,
      password: 'gotokeep',
      prefix_str: 'jobs_'
    },
  },
  normalConfigInfo: {
    cheatUrl: 'https://local.dev.wpkdev.com:8071/safepage/home/'
  },
  hhpCmsTele: 'https://dzshuju.com/telegramApi/bot1927305270:AAGjalPAMrGXdQBdBUYFZ4_SzFMrcDNquKo/',
  ...baseConfig,
  diamondUserId: '89330994'
}
// mysql -uroot -pgotokeep -h 103.225.11.5 -P 3566 clubunions
