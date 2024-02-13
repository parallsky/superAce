<template>
  <div class="">
    <van-notice-bar
      color="#929292"
      background="#ecf9ff"
      wrapable
      :scrollable="false"
      text="请使用你的微扑克平台、HHPoker平台、德扑之星平台的账号创建圈子身份。"
    />
    <div class="user-more-info margtop10">
      <div class="form-title">使用哪个平台账号创建圈子身份</div>
      <div class="form-cell">
        <van-radio-group v-model="platType" direction="horizontal">
          <van-radio name="WPK">微扑克</van-radio>
          <van-radio name="HHPoker">HHPoker</van-radio>
          <van-radio :disabled="true" name="DPZX" >
            德扑之星
            <van-popover v-model="showDpzxTip" theme="dark" placement="top"  trigger="click">
              <div class="grid-pop-text">即将开放dpzx账号注册</div>
              <template #reference>
                <van-icon name="warning-o" color="#ee0a24" />
              </template>
            </van-popover>
          </van-radio>
        </van-radio-group>
      </div>
      <div class="" v-if="platType == 'WPK'">
        <div class="form-title">
          选择<span class="color-red">{{platType}}</span>账号模式
        </div>
        <div class="form-cell">
          <van-radio-group v-model="loginModel" direction="horizontal">
            <van-radio name="phone">手机</van-radio>
            <van-radio name="email">邮箱</van-radio>
            <van-radio name="account">账号</van-radio>
          </van-radio-group>
        </div>
        <div class="form-title">
          输入<span class="color-red">{{platType}}</span>账号信息
        </div>
        <van-cell-group>
          <van-field
            v-model="countryCode"
            label="国家/地区"
            v-if="loginModel == 'phone'"
            :label-width="80"
            placeholder="请输入国家/地区编号"
            error-message="比如中国大陆为 86"
          />
          <van-field
            v-model="wpkPhoneNum"
            label="手机号"
            v-if="loginModel == 'phone'"
            left-icon="phone-o"
            :label-width="60"
            placeholder="请输入您的手机号"
          />
          <van-field
            v-model="wpkEmail"
            v-if="loginModel == 'email'"
            label="邮箱"
            :label-width="60"
            left-icon="envelop-o"
            placeholder="请输入您的邮箱"
          />
          <van-field
            v-model="wpkAccount"
            v-if="loginModel == 'account'"
            label="账号"
            :label-width="60"
            left-icon="contact"
            placeholder="请输入您的账号"
          />
          <van-field
            v-model="wpkPassword"
            clearable
            :label-width="60"
            label="密码"
            left-icon="eye-o"
            placeholder="请输入您的密码"
          />
        </van-cell-group>
        <div class="margtop20">
          <van-button type="info" plain block @click="createQzClick">立即创建身份</van-button>
        </div>
      </div>
      <div class="margtop10" v-if="platType == 'HHPoker'">
        <div class="form-title">
          输入<span class="color-red">{{platType}}</span>账号信息
        </div>
        <van-cell-group>
          <div>
            <van-field
              v-model="hhpAccount"
              :label-width="60"
              label="账户"
              placeholder="HHP的登录邮箱或者手机号"
              error-message="如果用手机号登录，不需要输入国家区号"
            />
            <van-field
              v-model="hhpPassword"
              clearable
              :label-width="60"
              label="密码"
              placeholder="请输入您的密码"
            />
            <van-field
              v-model="hhpImgCode"
              :label-width="60"
              label="验证码"
              placeholder="输入图片中的字符"
            >
              <template #button>
                <img class="verifyimg" :src="imgData" />
                <span class="fresh-btn">
                  <van-icon name="replay" class="font-big" />
                </span>
              </template>
            </van-field>
            <van-field
              v-model="hhpGoogleCode"
              :label-width="70"
              label="谷歌验证"
              left-icon="question-o"
              placeholder="请输入google验证码"
              error-message="如果没有绑定谷歌身份验证，则无需输入"
            />
          </div>
        </van-cell-group>
        <div class="margtop20">
          <van-button type="info" plain block @click="createQzClick">立即创建身份</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as utils from '@/libs/util'
import serviceApi from '@/service/index'

export default {
  name: 'index_mainpage',
  components: {},
  data() {
    return {
      btnLock: false,
      popType: 'new',
      countryCode: '86',
      showDpzxTip: false,
      loginStatus: false,
      popLayerBool: false,
      platType: 'WPK',
      loginModel: 'phone',
      imgData: 'data:image/jpg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAA8AIwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDt7W1ga1hLQRklFJJQc8VJJDYwRmSaO3jQdWdVAH4mnWf/AB5wf9c1/lXA/Gew+0+C47oD5rS6RifRWBU/qVqIxjyrQiMY8q0PQhZ2v/PtD/3wKeLK1/59of8Av2Kz/DF//anhfS74nLTWsbN/vbRu/XNbAFPlj2Hyx7EIsbT/AJ9Yf+/Yp4sLT/n1g/79isbV/GWhaG5jvb1RKP8AlmgLN39Poah0Tx9oWt3ItobgxTMcKsvy7vp/ntXUsBXdP2qpvl720F7l7aHQiws/+fSD/v2KeNPsv+fSD/v2P8KnFPFcvLHsPlj2IBp1l/z52/8A36X/AAp406x/587f/v0v+FTgU8UcsewcsexXGm2P/Plb/wDfpf8ACnjTLD/nytv+/S/4VYFMkureDHmzxJuOBucDJwTx+AJ/CjkXYOWPYYNLsP8Anxtv+/S/4U8aXp//AD423/flf8KS31G0uLNryKdGtVG7zsjYVxnIPpWOPiB4V87yv7Ztg2cdeK2hhZ1L8kG7dkJqK3NwaVp3/Pha/wDflf8ACnDSdO/58LX/AL8r/hUlpd217AJ7S4iuIj0kicOp/EVUvvEmiaXcR299q1lbzyOESGSZQ7EnAAXOaycEnZofLHsWhpOm/wDQPtf+/K/4Vxni+2gtdWiS3hjiQwAlY1CjO5ueK9AFcJ43/wCQ1D/17r/6E1c2KilT0RhiYpU9ETWf/HnB/wBc1/lWN46tY7zwNq8Erou63JTcQAXHKj6lgAPrW1Z/8eUH/XNf5VznxA8It4t8PG3glZLy3Yy243EK7Y+6w6c9j2/OuiPwo3j8KKHwdv8A7b4BghJy1pPJCfz3j/0Oq/xJ8aXOkbdK06QxXLgNJKOqr6CvMfBXiPUvB2pXDxQyPHEduo6e3DbVOC6+hXv/AIfd6jxzY/8ACSPD4i0Jvt1lNH85i5aIjsw6ivbyGnh6mOgsRa3ntfoTVbUdCr4Q8BXHixJb25uzDEpHJGWcn/PWsLxDosnhvWDbpOZAjHbKvHzKcH8jV3R/HetaBZSWdoYQDhSXTJXAwMc1RtWn8Sa2n22/jjlllzvn+7knJ+nNff0446GIqVa8l7FLRL/hjlfK0ktz3zwPrEmseGbaedw0yKEdgMAkcfj061vy3ltbAebMq5z39Bk/kK89vJ08AeGoFFxG4l2KPLXBBwSSCOx+Un15rzeLUdf8W6p5FtcSF2HIBOOT7dMkj8hXw9HJ5Y2dSvCSjSTerOl1OWye59A3PiDTLO0e6nukSFHEbM3GGPbnv7VTsfGek3s/lLIUOCfnK9vcEjkAnr2I614P4p0fWvDNstvql2oilI+Tzsk4zjjPSszw4mqaxeJp+lWguJd3mL5rBFAAO7k+oraeTYOFB1PrCl6a6ei1Eqkr2senfEfx9f208dro91GsB+9LEQxJ+o/Mf/Wrh7K0vtfUXeseIYLC1UYEl3cBSQDnCrnJ6npXN6toep6XdvbaojwurshVcbcjqAR16j86s6PoWqahII9J02eeT+/FCWI+rY4H4172GwsqODX1ZQiv55Wv62V197+RlKV5e99x662v2B8GSeG/CFlq+uRsDEZYrRhEFI+Yb2xjJye/U1yOn/BfxjfRb51sNOH92ebe/wCSAj9a9y8I6fcaf4et0vIfIu5MyzRBgwRz1GRx6VvivjaeZYvDOcKVTd6vv8/8mdDhGW6Pk7xD4Q8R+DLjytQmnSKXhZraRhFJ7ZGPyNdx8HtZ0YavHpVzomni6cZhvBCDISOxY5Neh/FmSxXwFepdlPNbHkA9d+e1eN/CexmvfiHpzRA7bctK59AB/wDXr6ahDD5hlVWvWppTjf3tbtpXWru/K1zFtwqJJn1EBXBeOP8AkNQ/9e6/+hNXfAVwXjj/AJDUP/Xuv/oTV+fYv+GPFfwyey/48oP+ua/yq0KrWX/Hlb/9c1/lVoVvH4UbR+FHnHj74fXmq6pba94cMcOrI4EwZgqyDoG54JA4IPUfkfMvFl5d6fdrZXegw6DqCR7JpdOcok6kcZVTtx+dfS4ryz4r+Fbu/uINXsoGmAjEUyIMngnBx+OPwr1MppU6uKjCclG+zaur+e35oVRtRujnvhdqvhe0S6bXzZJcjBiuLh1IK9MBTyp4z071B8R73wrNeQ3GiXlvLM5cyrbA4HCbc9uz/mK53T5NXso2hsopUUnkLFnnB9vc1JNo+vX0gmlsLp3fgMYiM9P8RX19HLcXQxn1ipiY/O707WbX5+ZzucXGyQzUPFF9quh2entDLILfrLIQM4yFA9gpx710Xw30TUNWusLrT6dCx2S/ZF2ykHJ2iQg4bKoRjs3XjFWfDvw/1K/0m5nnt2i2rlFdQC5PoT0IGSPXoaw7C81LwdqpB86JgwxtwVbB5BU8H9CD3FVVw9PF0quFw9a8lrbRK716K/4uwJuLUmj0Xx74M8O6B4LvJra1Dai7J/pNw5lmY7gSdzZI4BHGBzXD/Da5eHxPHHGkjM218RfeYIwbb6AEgZJ/hDDqRWref2749WQtFPFZW3mynLShOhK8MSo/PPpgcDjvDbxx+IrEzf6vzRu4zj0OMjoeev59KMvwSpZXWw0neWrdtbaafkE5Xmmdp8WLcnVPOM6ny2wVWLAZ3JJOcnkIsSn1IY8V2nwZuA+iTRv80qlYwU5UIAXGfQ5kYf8AAayvjLZxrptpdrBw21UdsKEGPuqvXJwCSegUAd8wfBC6U3N1bErvVSVA6hTjcTyM8hAODjn1rzKl6+QKX8r/AK/P+tC1pVPbRXBeM/ifY+G99raBLm9xwA3yr94dvQgfn7V3U6B7aRTGZAVPyA4Le1fJOu6dqVlqdwuoRT+YJGBkkQjcck9/xrz+Hsuw+NrtV3pHp3LqzcVoTaxr+teLdRVryaS4lY4jiQfKM+gr3/4W+CP+EU0Vri7Qf2ldgGT/AKZr2X+prx3wF4w0PwrM09/ocl1dZylwko+UegUj9c12+o/H6MRFdL0NjIej3U2AP+Ar1/MV9DnVHHV4rBYSjamuuiT/AB2/ExpuK96T1PawK4Hxz/yG4f8Ar2X/ANCau3066W/061vE+5cQpKPowB/rXE+Ov+Q3D/17L/6E1fm2LTVNpl4r+GWbL/jxt/8Armv8qsiuYi1u5hiSNUiIRQoyD2/GpP8AhILv/nnD/wB8n/GnGtGyKjVjZHTCngVy/wDwkV3/AM84P++T/jS/8JJef88oP++T/jVe2iP20Tp0hjU5WNB9B75qUIuANowOnFcp/wAJLef88rf/AL5P+NL/AMJPej/llb/98t/jR7aIe2iddtBBBAIPBBri/EH/AAiq6q1tqkqR3CqrsjMq+YpIHO75W6f73AxyBix/wlN8P+WVv/3y3+Ncfr+gWXiLU3v7szJM+N3lP8vHsc16GWTpTr8s3JK3Tf8AMidZJaIh8QeOtK0zS59P0C1WKWWPyG2RoNvr8yOR3zgA8k5Oc1xfhTw5fX2twGWxuBChDszRMBjtztI/PA9x1ru9M0DTdM2hbWG4UHJE8KMWPuwUMPoCB7V1Vn4gl0+LyrSzs4Y+u1UYD/0Kvcnn1DAUpYfDQd5byb17GfMpO7Oj1XwzZa1oH9lXSqU8sRq+wZUAg8Yxj7o6elUvD3w/0fw3e/arLzd4dnALccrtGfXALf8AfRql/wAJhqA/5Y2v/fLf/FUv/CY6gP8Alja/98t/8VXzMcfUjTdJSfK910NvaQvex3QFNltobmF4p4Y5Y3GGR1BDD3BriP8AhM9R/wCeNr/3y3/xVL/wmupD/lhaf98N/wDFVj7ZD9tEn1P4TeENUlaU6cbWRjkm1kMY/wC+fuj8qTTPhB4O06USNp8l245H2qUsB/wEYB/EVH/wm2pD/lhaf98N/wDFUv8AwnGpj/lhaf8AfDf/ABVdqzjFqHJ7WVvV/wCZPPT3sd9BDFbwxwwxpHFGoRERQFVRwAAOgrgvHf8AyG4P+vZf/Qmo/wCE61Mf8sLP/vhv/iqx9W1afWbpbi4SNXVAgEYIGASe5PrXl4mqpQMsRUUoWR//2Q=='
    }
  },
  activated() {},
  watch: {},
  mounted() {},
  methods: {
    createQzClick() {

    }
  }
}
</script>
<style lang="less" scoped>
.verifyimg {
  width: 80px;
  vertical-align: middle;
  margin-right: 10px;
}
.fresh-btn {
  display: inline-block;
  vertical-align: middle;
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 6px;
  padding-right: 6px;
}
</style>
