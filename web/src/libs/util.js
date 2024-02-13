import config from '@/config'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export const momentFormat = (date, formatStr) => {
  console.log('daty----->', date, formatStr)
  if(formatStr) {
    return dayjs(date, formatStr, true)
  } else {
    return dayjs(date)
  }
}

export const getHalfHour = (date, formatStr) => {
  return dayjs().add(30, 'minute').format('YYYY-MM-DD HH:mm')
}

export const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

export const subClubReg = (accStr) => {
  if (!accStr) {
    return false
  }
  let reg = /^sl[1-9]\d{7}$/
  return reg.test(accStr)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  const paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

export const loginPage = () => {
  // window.location.href = window.origin + '/login'
  window._Router.push({
    name: 'login'
  })
}

export const _isMobile = () => {
  const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  if (!flag) {
    return false
  }
  return true
}

export const downloadFile = (fileName, data) => {
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, fileName + '.xlsx')
  } else {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
export const formatColumn = (list) => {
  let res = []
  for (let key in list) {
    let item = list[key]
    res.push({
      title: item,
      key: key,
      align: 'center'
    })
  }
  return res
}

export const getQueryVariable = (variable) => {
  let query = window.location.search.substring(1)
  let vars = query.split("&")
  for (let i=0;i < vars.length;i++) {
    let pair = vars[i].split("=")
    if(pair[0] == variable){
      return pair[1]
    }
  }
  return false
}

export const randomString = (e) => {
  e = e || 16
  let t = 'ABCDE01FGHI23JK45LMNOPQRSTUV89WXYZ67'
  let n = ''
  let len = t.length
  for (let i = 0; i < e; i ++) {
    n += t.charAt(Math.floor(Math.random() * len))
  }
  return n
}
