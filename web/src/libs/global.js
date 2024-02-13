export const notifySet = (uiType, Vue) => {
  Vue.prototype.$SuccessTip = (message) => {
    Vue.prototype.$notify({ type: 'success', message: message })
  }
  Vue.prototype.$ErrorTip = (message, options) => {
    options = options || {}
    options.message = message
    options.type = 'danger'
    Vue.prototype.$notify(options)
  }
  Vue.prototype.$WarnTip = (message) => {
    Vue.prototype.$notify({ type: 'warning', message: message })
  }
  Vue.prototype.$Confirm = (Obj, notEnsure) => {
    let res
    if(!notEnsure) {
      res = Vue.prototype.$dialog.confirm({
        title: Obj.title,
        message: Obj.message,
        confirmButtonText: Obj.confirmButtonText || '确定'
      }).then(res => {
        Obj.onOk && Obj.onOk(res)
      }).catch(err => {
        console.log(err)
        Obj.onCancel && Obj.onCancel(err)
      })
    } else {
      res = Vue.prototype.$dialog.alert({
        title: Obj.title,
        message: Obj.message,
        confirmButtonText: Obj.confirmButtonText || '确定'
      }).then(res => {
        Obj.onOk && Obj.onOk(res)
      })
    }
    return res
  }
}
