let ulist = [
  {
    name: 'home',
    title: '联盟设置',
    modeType: 'leagues',
    children: [
      {
        name: 'index',
        title: '我的公司'
      },
      {
        name: 'leagueList',
        title: '名下联盟'
      },
      {
        name: 'subClubs',
        title: '联盟成员',
        mustLeague: true
      },
      {
        name: 'helpGraph',
        title: '担保关系',
        mustLeague: true
      },
      {
        name: 'creditLog',
        title: '额度日志',
        mustLeague: true
      },
      {
        name: 'subCredits',
        title: '实时额度',
        mustLeague: true
      },
      {
        name: 'oplogs',
        title: '操作日志',
        mustLeague: true
      },
      {
        name: 'systemLog',
        title: '联盟信息',
        mustLeague: true
      }
    ]
  },
  {
    name: 'groups',
    title: '分组管理',
    modeType: 'leagues',
    children: [
      {
        name: 'setting',
        title: '分组设置',
        mustLeague: true
      },
      {
        name: 'bills',
        title: '分组统计',
        mustLeague: true
      },
    ]
  },
  {
    name: 'leagueBill',
    title: '联盟账单',
    modeType: 'leagues',
    children: [
      {
        name: 'superbill',
        title: '额度账单',
        mustLeague: true
      },
      {
        name: 'gradeBill',
        title: '战绩榜单',
        mustLeague: true
      },
      {
        name: 'weekRewards',
        title: '成员盘点',
        mustLeague: true
      },
      // {
      //   name: 'blindDays',
      //   title: '级别明细榜',
      //   mustLeague: true
      // },
      {
        name: 'subWins',
        title: '成员贡献',
        mustLeague: true
      },
      {
        name: 'diamondBill',
        title: '钻石账单',
        mustLeague: true
      },
      {
        name: 'diamonds',
        title: '钻石充值',
        mustLeague: true
      },
    ]
  },
  {
    name: 'leagueUsers',
    title: '联盟玩家',
    modeType: 'leagues',
    children: [
      {
        name: 'buyinApply',
        title: '游戏申请',
        mustLeague: true
      },
      {
        name: 'joinLeague',
        title: '俱乐部申请',
        mustLeague: true
      },
      {
        name: 'groupMember',
        title: '玩家分组',
        mustLeague: true
      },
      {
        name: 'memberSet',
        title: '玩家管理',
        mustLeague: true
      },
      {
        name: 'memberBatch',
        title: '批量管理',
        mustLeague: true
      },
      {
        name: 'blacklist',
        title: '拉黑玩家',
        mustLeague: true
      },
      {
        name: 'vipMembers',
        title: '优质玩家',
        mustLeague: true
      },
      {
        name: 'memberReport',
        title: '玩家报备',
        mustLeague: true
      },
      {
        name: 'memberWins',
        title: '职牌分析',
        mustLeague: true
      },
    ]
  },
  {
    name: 'leagueGames',
    title: '牌局管理',
    modeType: 'leagues',
    children: [
      {
        name: 'gameSchemes',
        title: '牌桌方案'
      },
      {
        name: 'gaminglist',
        title: '游戏管理',
        mustLeague: true
      },
      {
        name: 'chatPage',
        title: '聊天监管',
        mustLeague: true
      },
      // {
      //   name: 'testgame',
      //   title: '观察牌局',
      //   mustLeague: true
      // },
      {
        name: 'endlist',
        title: '历史数据',
        mustLeague: true
      },
      // {
      //   name: 'createGames',
      //   title: '我要开局',
      //   mustLeague: true
      // },
      {
        name: 'flopIn',
        title: '查入池率',
        mustLeague: true
      },
      {
        name: 'runAway',
        title: '抓水上漂',
        mustLeague: true
      },
      // {
      //   name: 'sharkCheck',
      //   title: '牌谱检测',
      //   mustLeague: true
      // },
      {
        name: 'goldCheat',
        title: '倒分行为',
        mustLeague: true
      }
    ]
  },
  {
    name: 'setting',
    title: '我的设置',
    children: [
      {
        name: 'info',
        title: '账号设置'
      },
      {
        name: 'kefu',
        title: '客服管理'
      },
      {
        name: 'cheats',
        title: '伙牌检测',
        mustLeague: true
      },
      {
        name: 'tools',
        title: '小工具',
      },
    ]
  },
]

module.exports = ulist
