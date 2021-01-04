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
import {STEEM_API_URLS, STEEM_CONF_KEY, TRON_NODE_API} from './const.js'


Vue.use(BootstrapVue)
Vue.use(VueI18n)

const DEFAULT_LANG = navigator.language
const LOCALE_KEY = 'localeLanguage'

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

//tron网络
const TRON_NODE = TRON_NODE_API
const HttpProvider = TronWeb.providers.HttpProvider
const fullNode = new HttpProvider(TRON_NODE)
const solidityNode = new HttpProvider(TRON_NODE)
const eventServer = new HttpProvider(TRON_NODE)
const privateKey = process.env.VUE_APP_KEY
const tronWeb2 = new TronWeb(fullNode,solidityNode,eventServer,privateKey)
// console.log(16112,  tronWeb2)

// import {timeFormat} from "./utils/timeFormat"
// import {formatSeconds} from "./utils/formatSeconds"
import {getSteemInstance} from "./utils/getSteemInstance"
import {getSteemTronLink} from "./utils/getSteemTronLink"
import {getSbdInstance} from "./utils/getSbdInstance"
import {getSbdTronLink} from "./utils/getSbdTronLink"
import {getTspInstance} from "./utils/getTspInstance"
import {getTspTronLink} from "./utils/getTspTronLink"
import {getTspPoolInstance} from "./utils/getTspPoolInstance"
import {getTspPoolTronLink} from "./utils/getTspPoolTronLink"
import {getTspLPPoolInstance} from "./utils/getTspLPPoolInstance"
import {getTspLPPoolTronLink} from "./utils/getTspLPPoolTronLink"
import {getNutTronLink} from "./utils/getNutTronLink"
import {getNutsInstance} from "./utils/getNutsInstance"
import {getNutsPool} from "./utils/getNutsPool"
import {getNutPoolTronLink} from "./utils/getNutPoolTronLink"
import {sleep} from "./utils/sleep"
import {dataFromSun} from "./utils/dataFromSun"
import {dataToSun} from "./utils/dataToSun"
import {formatData} from "./utils/formatData"
import { steemDelegation, steemWrap, steemTransferVest, steemToVest, vestsToSteem} from "./utils/chain/steemOperations"
import {getAbiAndContractAddress, getContract} from './utils/chain/contract.js'
// import {approve} from "./utils/approve"
// import {getTsteemAllowance} from "./utils/getTsteemAllowance"

// Vue.prototype.timeFormat = timeFormat
// Vue.prototype.formatSeconds = formatSeconds
Vue.prototype.getSteemInstance = getSteemInstance
Vue.prototype.getSteemTronLink = getSteemTronLink
Vue.prototype.getSbdInstance = getSbdInstance
Vue.prototype.getSbdTronLink = getSbdTronLink
Vue.prototype.getTspTronLink = getTspTronLink
Vue.prototype.getTspInstance = getTspInstance
Vue.prototype.getTspPoolInstance = getTspPoolInstance
Vue.prototype.getTspPoolTronLink = getTspPoolTronLink
Vue.prototype.getTspLPPoolInstance = getTspLPPoolInstance
Vue.prototype.getTspLPPoolTronLink = getTspLPPoolTronLink
Vue.prototype.getNutTronLink = getNutTronLink
Vue.prototype.getNutsInstance = getNutsInstance
Vue.prototype.getNutsPool = getNutsPool
Vue.prototype.getNutPoolTronLink = getNutPoolTronLink
Vue.prototype.getAbiAndContractAddress = getAbiAndContractAddress
Vue.prototype.getContract = getContract
Vue.prototype.axios = axios
Vue.prototype.sleep  = sleep
Vue.prototype.tronWeb2 = tronWeb2
Vue.prototype.dataFromSun = dataFromSun
Vue.prototype.dataToSun = dataToSun
Vue.prototype.formatData = formatData
Vue.prototype.steemDelegation = steemDelegation
Vue.prototype.steemTransferVest = steemTransferVest
Vue.prototype.steemToVest = steemToVest
Vue.prototype.vestsToSteem = vestsToSteem
Vue.prototype.steemWrap = steemWrap
// Vue.prototype.approve = approve
// Vue.prototype.getTsteemAllowance = getTsteemAllowance


Vue.config.productionTip = false

Vue.filter('formatAmount',function(value,digit=3){
  const str =
      digit != null && digit >= 0
          ? Number(value)
              .toFixed(digit)
              .toString()
          : value.toString()
  let integer = str
  let fraction = ''
  if (str.includes('.')) {
    integer = str.split('.')[0]
    fraction = '.' + str.split('.')[1]
  }
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + fraction
})

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
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

