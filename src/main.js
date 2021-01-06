import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import steem from 'steem'
import VueI18n from 'vue-i18n'
import {STEEM_API_URLS, STEEM_CONF_KEY, LOCALE_KEY} from './const.js'


Vue.use(BootstrapVue)
Vue.use(VueI18n)

const DEFAULT_LANG = navigator.language
console.log('default language',DEFAULT_LANG)

const i18n = new VueI18n({
  locale:'en',
  messages: {
    'zh': require('./assets/lang/zh_CN'),
    'en': require('./assets/lang/EN'),
    'kr': require('./assets/lang/KR')
  },
    fallbackLocale: 'en',
    silentFallbackWarn: true
})

const setup = lang => {
  if (lang === undefined){
    lang = window.localStorage.getItem(LOCALE_KEY)
    if (i18n.messages[lang] === undefined){
      lang = DEFAULT_LANG
    }
  }
  window.localStorage.setItem(LOCALE_KEY, lang)
  Object.keys(i18n.messages).forEach(lang => {
    document.body.classList.remove(`lang-${lang}`)
  })
  document.body.classList.add(`lang-${lang}`)
  document.body.setAttribute('lang', lang)

  Vue.config.lang = lang
  i18n.locale = lang
}

setup()

// 从缓存获取用户选择的节点
let steemConf = window.localStorage.getItem(STEEM_CONF_KEY) || STEEM_API_URLS[0]
window.localStorage.setItem(STEEM_CONF_KEY, steemConf)
steem.api.setOptions({ url: steemConf })
Vue.prototype.steem = steem
console.log('steem node change to:',steemConf)

import {sleep} from "./utils/sleep"
import {formatData} from "./utils/formatData"
import { steemDelegation, steemWrap, steemTransferVest, steemToVest, vestsToSteem} from "./utils/chain/steemOperations"

Vue.prototype.sleep  = sleep
Vue.prototype.formatData = formatData
Vue.prototype.steemDelegation = steemDelegation
Vue.prototype.steemTransferVest = steemTransferVest
Vue.prototype.steemToVest = steemToVest
Vue.prototype.vestsToSteem = vestsToSteem
Vue.prototype.steemWrap = steemWrap


Vue.config.productionTip = false

// Vue.filter('formatAmount',function(value,digit=3){
//   const str =
//       digit != null && digit >= 0
//           ? Number(value)
//               .toFixed(digit)
//               .toString()
//           : value.toString()
//   let integer = str
//   let fraction = ''
//   if (str.includes('.')) {
//     integer = str.split('.')[0]
//     fraction = '.' + str.split('.')[1]
//   }
//   return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + fraction
// })

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

router.beforeEach(function (to, from, next) {
  if(to.meta.requireAuth){
    // 要去的url只有登陆成功后才能访问
    if (store.state.username) {
      next()
    } else {
      next({name: 'login'})
    }
  }else{
    next()
  }
})

