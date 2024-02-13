import Vue from 'vue'
import Router from 'vue-router'
import routerList from './routers'

Vue.use(Router)
let createRouter = async() => {
  let startInfo = await window._Store.dispatch('initConfigInfo')
  let routes = []
  if (!startInfo) {
    Vue.prototype.$ErrorTip('数据初始化失败，请刷新重试')
    routes = []
  } else {
    routes = await routerList()
  }
  const router = new Router({
    routes,
    base: `/qz/`,
    mode: 'history'
  })
  router.beforeEach((to, from, next) => {
    if (to.meta && to.meta.NOT_NEED_LOGIN) {
      next()
    } else {
      next()
    }
  })
  return router
}

export default createRouter
