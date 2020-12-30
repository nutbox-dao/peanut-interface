import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'vue-cookies'

Vue.use(Vuex)

export default new Vuex.Store({

  // 组件中通过 this.$store.state.username 调用
  state: {
    username: Cookie.get("username"),
    password: Cookie.get("password"),
    active: Cookie.get("active"),
    addr: Cookie.get("addr"),

    steemInstance: {},
    steemInstance2: {},
    steemJson: {},

    sbdInstance: {},
    sbdInstance2: {},
    sbdJson: {},

    tspInstance: {},
    tspInstance2: {},
    tspJson: {},

    tspPoolInstance: {},
    tspPoolInstance2: {},
    tspPoolJson: {},

    tspLPPoolInstance: {},
    tspLPPoolInstance2: {},
    tspLPPoolJson: {},

    nutInstance: {},
    nutInstance2: {},
    nutJson: {},

    nutPoolInstance: {},
    nutPoolInstance2: {},
    nutPoolJson: {},

  },
  mutations: {
    // 组件中通过 this.$store.commit('saveToken',参数)  调用,只能带一个参数，有多个参数以对象的形式传入
    saveUser: function (state, userobj) {
      state.username = userobj.username
      state.password = userobj.password
      state.active = userobj.active
      state.addr = userobj.addr

      Cookie.set("username", userobj.username, "30d")
      Cookie.set("password", userobj.password, "30d")
      Cookie.set("active", userobj.active, "30d")
      Cookie.set("addr", userobj.addr, "30d")
    },

    saveTronAddr: function (state,addr){
      state.addr = addr;
      Cookie.set('addr',addr,"30d")
    },

// tsteem
    saveSteemInstance: function (state, instance){
      state.steemInstance = instance
    },
    saveSteemInstance2: function (state, instance2){
      state.steemInstance2 = instance2
    },
    saveSteemJson: function (state, steemJson){
      state.steemJson.abi = steemJson.abi
      state.steemJson.contract= steemJson.contract
    },
    // tsp
    saveTspJson: function (state, tspJson){
      state.tspJson.abi = tspJson.abi
      state.tspJson.contract = tspJson.contract
    },
    saveTspInstance: function (state,instance){
      state.tspInstance = instance
    },
    saveTspInstance2: function (state, instance2){
      state.tspInstance2 = instance2
    },
// tsppool
    saveTspPoolJson:function (state, tspPoolJson){
      state.tspPoolJson.abi = tspPoolJson.abi
      state.tspPoolJson.contract = tspPoolJson.contract
    },
    saveTspPoolInstance: function (state,instance){
      state.tspPoolInstance = instance
    },
    saveTspPoolInstance2: function (state, instance2){
      state.tspPoolInstance2 = instance2
    },
// tspLPpool
    saveTspLPPoolJson:function (state, tspLPPoolJson){
      state.tspLPPoolJson.abi = tspLPPoolJson.abi
      state.tspLPPoolJson.contract = tspLPPoolJson.contract
    },
    saveTspLPPoolInstance: function (state,instance){
      state.tspLPPoolInstance = instance
    },
    saveTspLPPoolInstance2: function (state, instance2){
      state.tspLPPoolInstance2 = instance2
    },
// sbd
    saveSbdInstance: function (state, instance){
      state.sbdInstance = instance
    },
    saveSbdInstance2: function (state, instance2){
      state.sbdInstance2 = instance2
    },
    saveSbdJson: function (state, sbdJson){
      state.sbdJson.abi = sbdJson.abi
      state.sbdJson.contract= sbdJson.contract
    },
// pnuts
    saveNutInstance: function (state, instance){
      state.nutInstance = instance
    },
    saveNutInstance2: function (state, instance2){
      state.nutInstance2 = instance2
    },
    saveNutJson: function (state, nutJson){
      state.nutJson.abi = nutJson.abi
      state.nutJson.contract = nutJson.contract
    },
// nut pool
    saveNutPoolInstance: function (state, instance){
      state.nutPoolInstance = instance
    },
    saveNutPoolInstance2: function (state, instance2){
      state.nutPoolInstance2 = instance2
    },
    saveNutPoolJson: function (state, poolJson){
      state.nutPoolJson.abi = poolJson.abi
      state.nutPoolJson.contract= poolJson.contract
    },


    clearUser: function (state) {
      state.username = null
      state.password = null
      state.active = null
      Cookie.remove('username')
      Cookie.remove('password')
      Cookie.remove('active')
    }
  }
})

