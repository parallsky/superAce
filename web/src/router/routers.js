import purelist from './list'

let createItem = async(mainComp) => {

  console.log('purelist --->', purelist)


  for (let i in purelist) {
    let item = purelist[i]
    if(item.name) {
      item.component = mainComp
      for (let j in item.children) {
        let subitem = item.children[j]
        subitem.name = `${subitem.name}`
        subitem.path = `${subitem.path}`
        subitem.component = () => import(/* webpackChunkName: "pagerouter" */ `@/view/${subitem.componentName}`)
      }
    }
  }

  return purelist
}

let routerList = async() => {
  let mainComp = (await import(/* webpackChunkName: "pagedefault" */ `@/components/main/index`)).default
  let list = []

  list = list.concat([
    {
      path: '/',
      redirect: '/find/index',
    }
  ])

  // if(routeType == 'unions') {
  let tmp = await createItem(mainComp)
  list = list.concat(tmp)
  // }
  list.push({
    path: '*',
    name: 'error_page',
    meta: {
      title: '错误页',
      NOT_NEED_LOGIN: true,
      hideInMenu: true
    },
    component: () => import(/* webpackChunkName: "pagedefault" */ '@/view/common/error.vue')
  })



  return list
}

export default routerList
