let formatRouter = (tmplist) => {
  let list = []
  for (let i in tmplist) {
    let item = tmplist[i]
    let tmp = {
      path: '/' + item.name,
      name: item.name,
      meta: {
        title: item.title,
        notCache: item.notCache || true,
      }
    }

    if(item.children) {
      tmp.path = '/'
      tmp.children = [{
        path: (item.name) + '/',
        name: item.name + 'home_index',
        redirect: `${item.name}/index`,
      }]
      for (let j in item.children) {
        let subitem = item.children[j]
        tmp.children.push({
          path: (item.name) + '/' + subitem.name,
          name: item.name + '_' + subitem.name,
          meta: {
            title: subitem.title,
            notCache: subitem.notCache || false,
          },
          componentName: item.name + '/' + subitem.name + '.vue'
        })
      }
    }

    list.push(tmp)
  }
  return list
}

let rlist = window._routerList || []
if (process.env.NODE_ENV == 'development') {
  let ulist = [
    {
      name: 'find',
      title: '发现',
      children: [
        {
          name: 'index',
          title: '探索'
        },
        {
          name: 'game',
          title: '观战'
        }
      ]
    },
    {
      name: 'chat',
      title: '聊天',
      children: [
        {
          name: 'index',
          title: '消息列表'
        },
        {
          name: 'door',
          title: '对话'
        }
      ]
    },
    {
      name: 'more',
      title: '我的',
      children: [
        {
          name: 'index',
          title: '我的主页'
        },
        {
          name: 'info',
          title: '个人信息'
        },
        {
          name: 'safe',
          title: '安全设置'
        },
        {
          name: 'share',
          title: '邀请好友'
        },
        {
          name: 'setting',
          title: '设置'
        },
        {
          name: 'nameset',
          title: '设置花名'
        },
        {
          name: 'regist',
          title: '注册'
        },
        {
          name: 'login',
          title: '登录'
        }
      ]
    },
    {
      name: 'quanzi',
      title: '圈子',
      children: [
        {
          name: 'index',
          title: '我的圈子'
        },
        {
          name: 'create',
          title: '创建圈子'
        },
        {
          name: 'edit',
          title: '编辑圈子'
        },
        {
          name: 'detail',
          title: '圈子详情'
        },
        {
          name: 'admin',
          title: '权限管理'
        },
        {
          name: 'member',
          title: '成员管理'
        }
      ]
    },
    {
      name: 'tool',
      title: '道具',
      children: [
        {
          name: 'index',
          title: '道具商城'
        },
        {
          name: 'order',
          title: '订单详情'
        },
        {
          name: 'orderlist',
          title: '订单列表'
        },
        {
          name: 'charge',
          title: '充值积分'
        },
        {
          name: 'payword',
          title: '支付密码'
        },
      ]
    }
  ]
  rlist = ulist
}

rlist = formatRouter(rlist)

export default rlist
