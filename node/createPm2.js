const fs = require('fs')
const path = require('path')

let format = {
  "cwd": "./",
  "args": "",
  "watch": false,
  "ignore_watch": [],
  "exec_mode": "cluster_mode",
  "max_memory_restart": "1G",
  "merge_logs": true,
  "instance_var": "dev",
  "log_date_format": "YYYY-MM-DD HH:mm:ss",
  "min_uptime": "60s",
  "max_restarts": 3,
  "autorestart": true,
  "cron_restart": "",
  "env": {
    "NODE_ENV": "dev"
  },
  "env_online": {
    "NODE_ENV": "online"
  }
}

let jobArr = [{
  name: 'token',
  instances: 3
}, {
  name: 'games',
  instances: 2
}, {
  name: 'grades',
  instances: 6
}]

let fileString = {apps: []}
for(let i = 0; i < jobArr.length; i ++ ) {
  let item = jobArr[i]
  let str = JSON.parse(JSON.stringify(format))
  str.name = 'clubtool-' + item.name
  str.script = './jobs.js'
  str.instances = item.instances
  str.error_file = './logs/jobs_error.log'
  str.out_file = './logs/jobs.log'
  str.env.PORT = 8001 + i * 100
  str.env.NAME = item.name
  str.env_online.PORT = 8001 + i * 100
  str.env_online.NAME = item.name
  fileString.apps.push(str)
}

fs.writeFileSync(path.resolve(__dirname, 'jobs_pm2.json'), JSON.stringify(fileString, '', 2))
