<template>
  <div id="app">
    <b-navbar toggleable="lg" type="light" variant="info" id="navmanu">
      <b-navbar-brand @click="backtoindex">
        <img
          src="../static/images/logo.svg"
          class="d-inline-block align-top"
          alt="nutboxs"
        />
      </b-navbar-brand>

      <div class="logos">
        <span
          style="margin-right: 1rem"
          @click="mywallet"
          v-if="$store.state.username"
        >
          <img
            class="account-icon"
            src="../static/images/nav-steem-icon.png"
            alt="steem"
          />@{{ $store.state.username }}
        </span>
        <span @click="mywallet" v-if="$store.state.addr" id="addr">
          <img
            class="account-icon"
            src="../static/images/nav-tron-icon.png"
            alt="tron"
          />{{ $store.state.addr | formatAddr }}
        </span>
        <b-popover target="addr" triggers="hover focus" placement="leftbottom">
          {{ $store.state.addr }}
        </b-popover>
      </div>
      <br />

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" style="display: block">
          <div class="loginfo">
            <router-link to="/" tag="button" class="right-item">{{
              $t("message.delegatemine")
            }}</router-link>
            <router-link to="/bridge" tag="button" class="right-item">{{
              $t("message.gateway")
            }}</router-link>
            <router-link to="/tsp" tag="button" class="right-item">{{
              $t("tsp.tspMine")
            }}</router-link>

            <div class="drop">
              <b-dropdown
                id="dropdown-right"
                right
                size="sm"
                variant="secondary"
                class="m-2"
                toggle-class="text-decoration-none"
                no-caret
              >
                <template #button-content>
                  <b-icon
                    icon="three-dots"
                    aria-hidden="true"
                    font-scale="1"
                  ></b-icon>
                </template>

                <!-- about -->
                <b-dd-group>
                  <b-dd-header>
                    <b-icon icon="nut" aria-hidden="true"></b-icon>
                    {{ $t("message.about") }}
                  </b-dd-header>

                  <b-dropdown-item
                    target="_blank"
                    href="https://docs.nutbox.io/user_guide.html"
                  >
                    <b-icon icon="discord" aria-hidden="true"></b-icon>
                    {{ $t("message.userBook") }}
                  </b-dropdown-item>

                  <b-dd-item target="_blank" href="https://docs.nutbox.io">
                    <b-icon icon="discord" aria-hidden="true"></b-icon>
                    {{ $t("message.docs") }}
                  </b-dd-item>

                  <b-dd-item
                    target="_blank"
                    href="https://github.com/nutbox-dao"
                  >
                    <b-icon icon="discord" aria-hidden="true"></b-icon>
                    Github
                  </b-dd-item>

                  <b-dd-item to="/contract">
                    <b-icon icon="discord" aria-hidden="true"></b-icon>
                    {{ $t("message.contract") }}
                  </b-dd-item>

                  <b-dd-item
                    target="_blank"
                    href="https://blog.nutbox.io/@nutbox/nutbox-dao-governance-is-online--the-procedure-of-nutbox-proposal-is-operating--20201105t090030122z"
                  >
                    <b-icon icon="discord" aria-hidden="true"></b-icon>
                    {{ $t("message.nps") }}
                  </b-dd-item>

                  <b-dd-item to="/delegatorlists">
                    <b-icon icon="discord"></b-icon>
                    {{ $t("message.delegatorList") }}
                  </b-dd-item>

                  <b-dd-item target="_blank" href="https://discord.gg/zPkMuGY">
                    <b-icon icon="discord" aria-hidden="true"></b-icon>
                    {{ $t("message.discord") }}
                  </b-dd-item>

                  <b-dd-item target="_blank" href="https://blog.nutbox.io">
                    <b-icon icon="discord" aria-hidden="true"></b-icon>
                    {{ $t("message.blog") }}
                  </b-dd-item>
                </b-dd-group>

                <b-dropdown-divider></b-dropdown-divider>

                <!-- language -->
                <b-dd-group>
                  <b-dd-header>
                    <b-icon icon="spellcheck" aria-hidden="true"></b-icon>
                    {{ $t("message.language") }}
                  </b-dd-header>
                  <b-dropdown-item-button @click="setzhlang">
                    <b-icon
                      :icon="lang == 'zh' ? 'check' : 'blank'"
                      aria-hidden="true"
                    ></b-icon>
                    {{ $t("message.zh") }}
                  </b-dropdown-item-button>
                  <b-dropdown-item-button @click="setenlang">
                    <b-icon
                      :icon="lang == 'en' ? 'check' : 'blank'"
                      aria-hidden="true"
                    ></b-icon>
                    {{ $t("message.en") }}
                  </b-dropdown-item-button>
                  <b-dropdown-item-button @click="setkrlang">
                    <b-icon
                      :icon="lang == 'kr' ? 'check' : 'blank'"
                      aria-hidden="true"
                    ></b-icon>
                    {{ $t("message.kr") }}
                  </b-dropdown-item-button>
                </b-dd-group>

                <b-dropdown-divider
                  v-if="$store.state.username"
                ></b-dropdown-divider>

                <!-- steem node -->
                <b-dd-group v-if="$store.state.username">
                  <b-dd-header>
                    <b-icon icon="paperclip" aria-hidden="true"></b-icon>
                    {{ $t("message.changeSteemNode") }}
                  </b-dd-header>
                  <b-dropdown-item-button
                    v-for="item in steemUrls"
                    :key="item"
                    @click="selectNode(item)"
                    :class="
                      item == currentSteemNode
                        ? 'selectedNode'
                        : 'unSelectedNode'
                    "
                  >
                    <b-icon
                      :icon="item == currentSteemNode ? 'check' : 'blank'"
                      aria-hidden="true"
                    ></b-icon>
                    {{ item }}
                  </b-dropdown-item-button>
                </b-dd-group>

                <b-dropdown-divider
                  v-if="$store.state.username"
                ></b-dropdown-divider>

                <b-dropdown-item-button
                  @click="logout"
                  style="text-align: center"
                  v-if="$store.state.username"
                  variant="danger"
                >
                  <b-icon icon="power" aria-hidden="true"></b-icon>
                  {{ $t("message.logout") }}
                </b-dropdown-item-button>
              </b-dropdown>
            </div>
          </div>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view />
  </div>
</template>

<script>
import {
  STEEM_API_URLS,
  STEEM_CONF_KEY,
  LOCALE_KEY,
  TRON_LINK_ADDR_NOT_FOUND,
} from "./const.js";
import { whatchWallet, getTronLinkAddr } from "./utils/chain/tron.js";
export default {
  name: "App",
  data() {
    return {
      showSteemNode: false,
      steemUrls: STEEM_API_URLS,
      steemNodeKey: STEEM_CONF_KEY,
      currentSteemNode: window.localStorage.getItem(STEEM_CONF_KEY),
      lang: "en",
    };
  },
  methods: {
    backtoindex() {
      this.$router.push({ path: "/" });
    },
    mywallet() {
      this.$router.push({ path: "/wallet" });
    },

    logout() {
      this.$store.commit("clearUser");
      this.$router.push({ path: "/login" });
    },
    setzhlang() {
      this.lang = "zh";
      localStorage.setItem(LOCALE_KEY, this.lang);
      this.$i18n.locale = "zh";
    },
    setenlang() {
      this.lang = "en";
      localStorage.setItem(LOCALE_KEY, this.lang);
      this.$i18n.locale = "en";
    },
    setkrlang() {
      this.lang = "kr";
      localStorage.setItem(LOCALE_KEY, this.lang);
      this.$i18n.locale = "kr";
    },
    selectNode(node) {
      this.showSteemNode = false;
      this.steem.api.setOptions({ url: node });
      this.currentSteemNode = node;
      window.localStorage.setItem(this.steemNodeKey, node);
      this.$router.go(0);
    },
  },
  components: {},
  filters: {
    formatAddr(data) {
      return data.substring(0, 6) + "..." + data.substring(30);
    },
  },
  async beforeMount() {
    let that = this;
    async function main() {
      const addr = await getTronLinkAddr();
      if (addr === TRON_LINK_ADDR_NOT_FOUND.walletLocked) {
        alert(that.$t("error.unlockWallet"));
        return;
      } else if (addr === TRON_LINK_ADDR_NOT_FOUND.noTronLink) {
        let link2 = "TronLink: https://www.tronlink.org";
        alert(that.$t("error.needtronlink") + "\n\n" + link2);
        return;
      }
      that.$store.commit("saveTronAddr", addr);
      whatchWallet((addr) => {
        that.$store.commit("saveTronAddr", addr);
        that.$router.go(0);
      });
    }
    main();
  },
  async mounted() {
    this.lang = localStorage.getItem(LOCALE_KEY);
  },
};
</script>

<style>
html,
body {
  height: 100%;
}
#app {
  position: relative;
  width: 100%;
  min-height: 100%;
  padding-bottom: 5rem;
  /*padding-bottom: 7rem;*/
  box-sizing: border-box;
  background-position: 0px -30vh;
  background-repeat: no-repeat;
  background-color: aliceblue;
  /*background-image: radial-gradient(50% 50% at 50% 50%, rgba(255, 0, 122, 0.1) 0%, rgba(255, 255, 255, 0) 100%);*/
}

.logos {
  /*background-color: gainsboro;*/
  position: absolute;
  right: 2rem;
  margin-top: -4.5rem;
  color: grey;
}
.account-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  padding-right: 2px;
}

.steem-node-item {
  display: block;
  padding: 8px 0px;
}
.steem-node-item:hover {
  color: rgb(255, 0, 122) !important;
}
.selectedNode {
  color: rgb(255, 0, 122) !important;
}
.unSelectedNode {
  color: gray;
}

.drop {
  /*background-color: aquamarine;*/
  /*margin-top: 1rem;*/
  position: relative;
  z-index: 2000;
}

.drop a {
  color: #212529 !important;
  margin-left: 0 !important;
}

.logos span {
  border-radius: 12px;
  padding: 0.5em;
  cursor: pointer;
}

.logos span:hover {
  color: black;
}

.btn-secondary {
  /*background-color: white !important;*/
  border: 0px;
}

.router-link-exact-active {
  color: rgb(255, 0, 122) !important;
  border-bottom: 1px solid azure;
  text-align: center;
  background-color: #fdeaf1 !important;
}

.logo {
  cursor: pointer;
}

.loginfo {
  margin-top: 1.2rem;
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
}

.right-item {
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
.right-item:hover {
  background-color: rgb(206, 208, 217);
}
.right-item:focus {
  background-color: rgb(206, 208, 217);
  outline: none;
  box-shadow: rgb(246, 221, 232) 0px 0px 0px 1pt;
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
  background-color: aliceblue !important;
  padding-left: 1rem;
}
.align-top {
  /* margin-left: 3rem; */
}

#nav-collapse {
  margin-right: 1rem;
  /*background-color: blueviolet;*/
}
#nav-collapse a {
  color: gray;
  /* margin-right: 0.4rem; */
  margin-left: 0.8rem;
}
#nav-collapse a:hover {
  /*color: darkcyan;*/
  text-decoration: none;
}
#notice {
  padding: 1rem 5rem;
}
</style>
