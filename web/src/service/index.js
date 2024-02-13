import axios from '@/libs/api.request'
import Vue from 'vue'
import rsaKey from '@/libs/rsakey'
import { publicEncrypt } from 'crypto-browserify'

const serviceApi = async(objs) => {
  if (!objs) {
    objs = {}
  }
  Vue.prototype.$toast.loading()

  let excels = false
  let encodeInfo
  if(!objs.data) {
    objs.data = {}
  }
  let enInfos = {}
  if(objs.url.indexOf('/api/account/') == 0) {
    enInfos = Object.assign(enInfos, objs.data)
    objs.data = {
      isCheck: objs.data.isCheck
    }
  }

  encodeInfo = publicEncrypt(rsaKey, Buffer.from(JSON.stringify(enInfos))).toString('base64')
  if (objs.data.resDataType == 'excel') {
    excels = true
  }

  try {
    let res = await axios.request({
      url: objs.url,
      data: objs.data,
      method: objs.method || 'post',
      responseType: excels ? 'arraybuffer' : 'json',
      timeout: excels ? 300000 : 30000,
      headers: {
        'xrin': encodeURIComponent(encodeInfo)
      }
    })

    Vue.prototype.$toast.clear()

    if(res.errorCode) {
      if(res.errorCode !== 401) {
        Vue.prototype.$ErrorTip(res.data || '请求发生错误')
      } else {
        Vue.prototype.$ErrorTip(res.data || '登录过期，请重新登录')
        window._Router.push({
          name: 'login'
        })
      }
      return false
    }
    return res

  } catch(err) {
    console.log('errr----->', err)
    Vue.prototype.$ErrorTip('网络错误，请重试')
    return false
  }
}

export default serviceApi
