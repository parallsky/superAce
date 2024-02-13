import 'vant/lib/index.less';
// import 'vant/lib/tabbar/style/less';

import '@/styles/index.less'
import Vue from 'vue'
import config from '@/config'
import { notifySet } from '@/libs/global'
import createStore from '@/store'
import createRouter from '@/router'
import mixins from '@/mixins/index'
import importDirective from '@/directive/index'
import App from '@/App.vue'
import Vant from 'vant'

Vue.use(Vant)

importDirective(Vue)

let updateVersion = async() => {
  if(window._Vue) {
    await window._Store.dispatch('initConfigInfo')
  }
}

window.addEventListener("visibilitychange", async(e) => {
  if (e.target.visibilityState === "visible") {
    //重新对时初始化
    window.isPageShow = true
    updateVersion()
  } else {
    window.isPageShow = false
  }
})

let createVue = async() => {
  Vue.config.productionTip = false
  Vue.prototype.$config = config
  Vue.config.errorHandler = function (err, vm, info) {
    console.error(vm, info, err)
  }

  await import('@vant/touch-emulator')
  await import('lib-flexible/flexible')

  Vue.prototype.$notify.setDefaultOptions({
    duration: 2400
  })
  notifySet('vant', Vue)

  let store = await createStore()
  window._Store = store

  let router = await createRouter()
  window._Router = router

  Vue.mixin(mixins)
  window._Vue = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    created: function () {
      console.log(this.$data)
    },
    mounted() {
      console.log('global mounted--->', this.$data)
      document.querySelector('#loading-box').remove()
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
          }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          })
        })
      }


      // 判断当前语言是否选择过，没有选择过则暂时选择语言框
    }
  })

  return {}
}

createVue('app')
