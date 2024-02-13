import axios from 'axios'
import appConfig from '@/config/index'
import { loginPage } from './util'

axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8'
class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }

  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl
    }
    return config
  }

  destroy (url) {
    delete this.queue[url]
  }

  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      this.queue[url] = true

      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data } = res
      if (res.headers['content-type'].indexOf('application/json') > -1) {
        if (data instanceof ArrayBuffer) {
          var enc = new TextDecoder('utf-8')
          const resdata = JSON.parse(enc.decode(new Uint8Array(data))) || {}
          return resdata
        } else {
          if (data.errorCode === 401) {
            loginPage()
            return data
          // } else if (data.errorCode === 1000099) {
            // window._Vue.$ErrorTip(data.data)
            // return false
          }
          return data
        }
      } else {
        return data
      }
    }, error => {
      this.destroy(url)
      console.log(error)
      // let errorInfo = error.response
      // if (!errorInfo) {
      //   const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
      //   errorInfo = {
      //     statusText,
      //     status,
      //     request: { responseURL: config.url }
      //   }
      // }
      return Promise.reject(error)
    })
  }

  request (options) {
    const instance = axios.create({
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      timeout: appConfig.reqTimeout
    })
    options = Object.assign(this.getInsideConfig(), options)
    if (!options.headers) {
      options.headers = {}
    }
    // options.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8'

    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
