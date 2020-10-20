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
      state.addr = null
      Cookie.remove('username')
      Cookie.remove('password')
      Cookie.remove('active')
      Cookie.remove('addr')
    }
  }
})

