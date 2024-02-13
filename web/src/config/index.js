let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
  window.isDev = true
}
baseUrl = location.protocol + `//${location.host}/`


export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: 'quanzi',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  /**
   * @description api请求基础路径
   */
  baseUrl: baseUrl,
  reqTimeout: 20000
}
