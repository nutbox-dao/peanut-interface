import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import steem from 'steem'
import TronWeb from 'tronweb'
import VueI18n from 'vue-i18n'


Vue.use(BootstrapVue)
Vue.use(VueI18n)

const DEFAULT_LANG = navigator.language
const LOCALE_KEY = 'localeLanguage'

const i18n = new VueI18n({
  locale:'en',
  messages: {
    'zh': require('./assets/lang/zh_CN'),
    'en': require('./assets/lang/EN')
  },
    fallbackLocale: 'en'
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


//设置steem节点, 挂载到全局
steem.api.setOptions({ url: 'https://api.justyy.com' })
// steem.api.setOptions({ url: 'https://cn.steems.top' })
// steem.api.setOptions({ url: 'https://api.steemit.com' })
Vue.prototype.steem = steem

//tron网络
const HttpProvider = TronWeb.providers.HttpProvider
const fullNode = new HttpProvider("https://api.trongrid.io")
// const fullNode = new HttpProvider("https://api.shasta.trongrid.io")
const solidityNode = new HttpProvider("https://api.trongrid.io")
const eventServer = new HttpProvider("https://api.trongrid.io")
const privateKey = process.env.VUE_APP_KEY
const tronWeb2 = new TronWeb(fullNode,solidityNode,eventServer,privateKey)
// console.log(16112,  tronWeb2)


import {getSteemInstance} from "./utils/getSteemInstance"
import {getSteemTronLink} from "./utils/getSteemTronLink"
import {getSbdInstance} from "./utils/getSbdInstance"
import {getSbdTronLink} from "./utils/getSbdTronLink"
import {getNutTronLink} from "./utils/getNutTronLink"
import {getNutsInstance} from "./utils/getNutsInstance"
import {getNutsPool} from "./utils/getNutsPool"
import {getNutPoolTronLink} from "./utils/getNutPoolTronLink"
import {sleep} from "./utils/sleep"
import {dataFromSun} from "./utils/dataFromSun"
import {dataToSun} from "./utils/dataToSun"
import {formatData} from "./utils/formatData"
import { steemDelegation, steemWrap} from "./utils/steemOperations"
// import {approve} from "./utils/approve"
// import {getTsteemAllowance} from "./utils/getTsteemAllowance"


Vue.prototype.getSteemInstance = getSteemInstance
Vue.prototype.getSteemTronLink = getSteemTronLink
Vue.prototype.getSbdInstance = getSbdInstance
Vue.prototype.getSbdTronLink = getSbdTronLink
Vue.prototype.getNutTronLink = getNutTronLink
Vue.prototype.getNutsInstance = getNutsInstance
Vue.prototype.getNutsPool = getNutsPool
Vue.prototype.getNutPoolTronLink = getNutPoolTronLink
Vue.prototype.axios  = axios
Vue.prototype.sleep  = sleep
Vue.prototype.tronWeb2 = tronWeb2
Vue.prototype.dataFromSun = dataFromSun
Vue.prototype.dataToSun = dataToSun
Vue.prototype.formatData = formatData
Vue.prototype.steemDelegation = steemDelegation
Vue.prototype.steemWrap = steemWrap
// Vue.prototype.approve = approve
// Vue.prototype.getTsteemAllowance = getTsteemAllowance


Vue.config.productionTip = false

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

