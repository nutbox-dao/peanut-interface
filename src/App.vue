<template>
  <div id="app">
    <b-navbar toggleable="lg" type="light" variant="info" id="navmanu">
      <b-navbar-brand @click="backtoindex">
          <img src="../static/images/logo.svg" class="d-inline-block align-top" alt="nutboxs">
      </b-navbar-brand>

      <div class="logos" v-if="$store.state.username ">
          <span style="margin-right: 1rem" @click="mywallet">
            <img class="account-icon" src="../static/images/nav-steem-icon.png" alt="steem">@{{ $store.state.username }}
          </span>
          <span @click="mywallet">
            <img class="account-icon" src="../static/images/nav-tron-icon.png" alt="tron">{{$store.state.addr | formatAddr}}
          </span>

      </div>
      <br>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" style="display:block">
          <div class="loginfo">
            <button class="right-item" @click="backtoindex">{{ $t('message.delegatemine') }}</button>
            <button class="right-item" @click="bridge">{{ $t('message.gateway') }}</button>

            <div class="drop">
                <b-dropdown id="dropdown-grouped" :text="this.$t('message.language')" variant="transparent" class="m-2">
                <b-dropdown-item-button @click="setzhlang">
                  {{ $t('message.zh') }}
                </b-dropdown-item-button>

                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item-button @click="setenlang">
                  {{ $t('message.en') }}
                </b-dropdown-item-button>
              </b-dropdown>
            </div>

              <div class="drop">
                  <b-dropdown id="dropdown-grouped" :text="this.$t('message.about')" variant="transparent" class="m-2">

                   <!-- <b-dropdown-item-button @click="mywallet">
                     <router-link to="/wallet">{{ $t('message.mywallet') }}</router-link>
                  </b-dropdown-item-button> -->

                  <b-dropdown-item-button>
                    <a target="_blank" href="https://docs.nutbox.io">{{ $t('message.docs') }}</a>
                  </b-dropdown-item-button>
                   <b-dropdown-divider></b-dropdown-divider>

                  <b-dropdown-item-button>
                    <a target="_blank" href="https://github.com/nutbox-dao">Github</a>
                  </b-dropdown-item-button>
                   <b-dropdown-divider></b-dropdown-divider>

                  <b-dropdown-item-button>
                    <router-link to="/contract">{{ $t('message.contract') }}</router-link>
                  </b-dropdown-item-button>
                   <b-dropdown-divider></b-dropdown-divider>

                   <b-dropdown-item-button>
                    <a target="_blank" href="https://blog.nutbox.io/@nutbox/nutbox-dao-governance-is-online--the-procedure-of-nutbox-proposal-is-operating--20201105t090030122z">{{ $t('message.nps') }}</a>
                  </b-dropdown-item-button>
                  <b-dropdown-divider></b-dropdown-divider>

                  <b-dropdown-item-button>
                     <router-link to="/delegatorlists">{{ $t('message.delegateList') }}</router-link>
                  </b-dropdown-item-button>
                  <b-dropdown-divider></b-dropdown-divider>
                  <b-dropdown-item-button>
                    <a target="_blank" href="https://discord.gg/wyJeDhP">{{ $t("message.discord") }}</a>
                  </b-dropdown-item-button>

              <div v-if="$store.state.username">
                  <b-dropdown-divider></b-dropdown-divider>
                  <b-dropdown-item-button @click="logout" style="text-align:center">
                    {{ $t('message.logout') }}
                  </b-dropdown-item-button>
              </div>
                </b-dropdown>
            </div>

          </div>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view/>

  </div>
</template>

<script>
  export default {
    name: 'App',
    data(){
      return {

      }
    },
    methods: {
      backtoindex(){
        this.$router.push({path: '/'})
      },
      bridge(){
        this.$router.push({path: '/bridge'})
      },
      mywallet(){
        this.$router.push({path: '/wallet'})
      },

      logout(){
        this.$store.commit('clearUser')
        this.$router.push({path:'/login'})
      },
      setzhlang(){
        let LOCALE_KEY = 'localeLanguage'
        let lang = 'zh'
        localStorage.setItem(LOCALE_KEY, lang)
        this.$i18n.locale = 'zh'
      },
      setenlang(){
        let LOCALE_KEY = 'localeLanguage'
        let lang = 'en'
        localStorage.setItem(LOCALE_KEY, lang)
        this.$i18n.locale = 'en'
      }
    },
    components: {

    },
    filters:{
      formatAddr(data){
        return data.substring(0,6)+'...'+data.substring(30)
      },

    },
    mounted() {
      },

  }
</script>

<style>
  html,body{
    height: 100%;
  }
  #app{
    position:relative;
    width:100%;
    min-height:100%;
    padding-bottom: 5rem;
    /*padding-bottom: 7rem;*/
    box-sizing: border-box;
    background-position: 0px -30vh;
    background-repeat: no-repeat;
    background-color: aliceblue;
    /*background-image: radial-gradient(50% 50% at 50% 50%, rgba(255, 0, 122, 0.1) 0%, rgba(255, 255, 255, 0) 100%);*/
  }

  .logos{
    /*background-color: gainsboro;*/
    position: absolute;
    right: 12.8rem;;
    margin-top: -4.5rem;
    color: grey;
  }
  .account-icon{
    width: 20px;
    height: 20px;
    margin-right: 5px;
    padding-right: 2px;
  }

  .drop{
    /*background-color: aquamarine;*/
    /*margin-top: 1rem;*/
    position:relative;
    z-index: 2000;
  }

  .logos span{
    border-radius:12px;
    padding:0.5em;
    cursor: pointer;
  }

  .logos span:hover{
    color: black;
  }

  .btn-secondary{
    /*background-color: white !important;*/
    border: 0px;
  }

  .router-link-exact-active{
    color: gray!important;
    border-bottom: 1px solid azure;
    text-align: center;
  }

  .logo{
    cursor: pointer;
  }

  .loginfo{
    margin-top: 1.2rem;
    display: flex;
    flex-direction: row;
    -webkit-box-align: center;
    align-items: center;
    background-color: rgba(0,0,0,0);
    border-radius: 12px;
    white-space: nowrap;
    width: 100%;
  }


  .right-item{
    text-align: center;
    outline: none;
    text-decoration: none;
    -webkit-box-pack: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    font-size: 16px;
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    -webkit-box-align: center;
    align-items: center;
    padding: 0.4rem 1rem 0.4rem 1rem;
    border-radius: 10px;
    cursor: pointer;
    user-select: none;
    background-color: rgb(247, 248, 250);
    border: 1px solid rgb(237, 238, 242);
    color: rgb(50, 50, 50);
    font-weight: 400;
    margin-right: 12px;
    height: 32px;
  }
  .right-item:hover{
    background-color: rgb(206, 208, 217);
  }
  .right-item:focus{
    background-color: rgb(206, 208, 217);
    outline: none;
    box-shadow: rgb(246, 221, 232)  0px 0px 0px 1pt;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  #navmanu {
       /*background-color: white !important;*/
    background-color: aliceblue  !important;
       padding-left: 5rem;

    }
  .align-top{
    /* margin-left: 3rem; */
  }

  #nav-collapse{
     margin-right: 10rem;
    /*background-color: blueviolet;*/
  }
  #nav-collapse a{
    color: gray;
    /* margin-right: 0.4rem; */
    margin-left: 0.8rem;
  }
  #nav-collapse a:hover{
    /*color: darkcyan;*/
    text-decoration: none;
  }
  #notice {
    padding: 1rem 5rem;
  }
</style>
