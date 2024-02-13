import Clipboard from 'clipboard'
export default {
  bind: (el, binding, vnode) => {
    const clipboard = new Clipboard(el, {
      text: () => binding.value.value
    })
    el.__success_callback__ = binding.value.success
    if(!binding.value.success) {
      el.__success_callback__ = (err) => {
        console.log('成功复制')
        if(vnode.context) {
          vnode.context.$SuccessTip('复制成功，请粘贴给他人')
        }
      }
    }
    el.__error_callback__ = binding.value.error
    if(!binding.value.error) {
      el.__error_callback__ = (err) => {
        console.log('复制失败')
        if(vnode.context) {
          vnode.context.$ErrorTip('复制失败，请重试')
        }
      }
    }
    clipboard.on('success', e => {
      const callback = el.__success_callback__
      callback && callback(e)
    })
    clipboard.on('error', e => {
      const callback = el.__error_callback__
      callback && callback(e)
    })
    el.__clipboard__ = clipboard
  },
  update: (el, binding) => {
    el.__clipboard__.text = () => binding.value.value
    // el.__success_callback__ = binding.value.success
    // el.__error_callback__ = binding.value.error
  },
  unbind: (el, binding) => {
    delete el.__success_callback__
    delete el.__error_callback__
    el.__clipboard__.destroy()
    delete el.__clipboard__
  }
}
