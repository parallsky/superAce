let clubs = [
  {
    name: 'home',
    title: '首页',
    hideInMenu: true
  },
  {
    name: 'clubs',
    title: '我的俱乐部',
    modeType: 'clubs',
    children: [
      {
        name: 'mySubClubs',
        title: '子俱乐部',
      },
      {
        name: 'helpGraph',
        title: '担保关系',
      },
      {
        name: 'mylogs',
        title: '联盟日志',
      },
    ]
  },
  {
    name: 'clubUser',
    title: '玩家管理',
    modeType: 'clubs',
    children: [
      {
        name: 'applys',
        title: '加入申请'
      },
      {
        name: 'players',
        title: '成员设置'
      },
      {
        name: 'diamonds',
        title: '钻石充值'
      },
      {
        name: 'playerLogin',
        title: '玩家登录'
      },
      {
        name: 'flopIn',
        title: '查入池率'
      },
    ]
  },
  {
    name: 'clubCredit',
    title: '额度管理',
    modeType: 'clubs',
    children: [
      {
        name: 'buyin',
        title: '游戏带入'
      },
      {
        name: 'credits',
        title: '玩家额度'
      },
      {
        name: 'superbill',
        title: '额度账单',
      }
    ]
  },
  {
    name: 'clubGrade',
    title: '游戏数据',
    modeType: 'clubs',
    children: [
      {
        name: 'grades',
        title: '战绩榜单',
      },
      {
        name: 'helpers',
        title: '担保分润',
      },
      {
        name: 'blindDays',
        title: '级别明细榜'
      },
      {
        name: 'diamondBill',
        title: '钻石账单',
        mustLeague: true
      },
    ]
  },
  // {
  //   name: 'clubProxy',
  //   title: '代理管理',
  //   modeType: 'clubs',
  //   children: [
  //     {
  //       name: 'addProxy',
  //       title: '设置代理'
  //     },
  //     {
  //       name: 'bindPlayer',
  //       title: '分配账户'
  //     },
  //     // {
  //     //   name: 'bindUser',
  //     //   title: '分配玩家'
  //     // },
  //     {
  //       name: 'billProxy',
  //       title: '代理账单',
  //     },
  //     {
  //       name: 'handProxy',
  //       title: '级别手数',
  //     }
  //   ]
  // },
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
    ]
  },
]

module.exports = clubs
