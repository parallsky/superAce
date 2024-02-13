let path = require('path')
let rsakey = require('./rsakey')

let rDir = path.resolve(__dirname, '..')

module.exports={
  jwt: {
    secret: 'dk_super_wpk',
    secretExport: 'export_hash_3',
    expire: '5d',
    prefixStr: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
  },
  poker: {
    host: 'https://game.zhangjiakouyuanyue.com:11111/',
    wsHost: 'game.teny-tech.com:11111/',
    card: 'http://v1.akaqreplayer.com:8080'
  },
  cookieKey: 'super_ace_st',
  docsDir: path.join(rDir, 'docStatic'),
  webdir: path.join(rDir, 'webpages'),
  fileDir: path.join(rDir, 'downfiles'),
  cmsExpire: {
    token: 32 * 3600 * 1000 // s
  },
  ...rsakey,
  subCheatMaxNum: 2,
  serverVersion: '1.0.1',
}


