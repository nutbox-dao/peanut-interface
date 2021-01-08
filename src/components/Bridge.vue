<template>
  <div class="wallet">
    <div>
      <div class="changebox">
        <p
          :class="[tspFlag ? 'titleSelected' : 'titleUnSelected']"
          @click="beforeTsp"
        >
          TSP
        </p>
        <p
          :class="[steemFlag ? 'titleSelected' : 'titleUnSelected']"
          @click="beforeSteem"
        >
          STEEM
        </p>
        <p
          :class="[sbdFlag ? 'titleSelected' : 'titleUnSelected']"
          @click="beforeSbd"
        >
          SBD
        </p>
      </div>

      <!--steem兑换-->
      <div v-if="steemFlag" class="exchange">
        <!-- 上面的框 -->
        <div class="round-box">
          <div class="round-box-title-container">
            <p class="box-title">from</p>
            <p class="box-title">
              {{ $t("message.balance") }}:
              {{ isSteemToTSteem ? balanceOfSeem : balanceOf }}
            </p>
          </div>
          <div class="round-box-content-container">
            <input
              class="mb-2 mr-sm-2 mb-sm-0 user input"
              :class="checkFlag ? 'isok' : 'isfalse'"
              placeholder="0.0"
              v-model="transValue"
              @keyup="checkTransValue"
              type="number"
              inputmode="decimal"
              pattern="^[0-9]*[.,]?[0-9]*$"
              spellcheck="false"
              value
            />
            <div style="display: flex">
              <button class="maxBtn" @click="fillMaxTrans">Max</button>
              <img
                class="coin-icon"
                src="../../static/images/steem.svg"
                alt=""
                v-if="isSteemToTSteem"
              />
              <img
                class="coin-icon"
                src="../../static/images/tsteem.svg"
                alt=""
                v-else
              />
              <div style="margin-top: 18px; margin-left: 8px">
                {{ isSteemToTSteem ? "STEEM" : "TSTEEM" }}
              </div>
            </div>
          </div>
        </div>
        <!-- 中间箭头 -->
        <div class="pink-arrow-box">
          <div style="margin: 0 auto" @click="changeTransOrder">
            <img class="pink-arrow" src="../../static/images/pink-arrow.svg" />
          </div>
        </div>
        <!-- 下面的框 -->
        <div class="round-box">
          <div class="round-box-title-container">
            <p class="box-title">to</p>
            <p class="box-title">
              {{ $t("message.balance") }}:
              {{ isSteemToTSteem ? balanceOf : balanceOfSeem }}
            </p>
          </div>
          <div class="round-box-content-container">
            <input
              class="mb-2 mr-sm-2 mb-sm-0 user input"
              placeholder="0.0"
              v-model="transValue"
              spellcheck="false"
              value
            />
            <div style="display: flex">
              <img
                class="coin-icon"
                src="../../static/images/tsteem.svg"
                alt=""
                v-if="isSteemToTSteem"
              />
              <img
                class="coin-icon"
                src="../../static/images/steem.svg"
                alt=""
                v-else
              />
              <div style="margin-top: 18px; margin-left: 8px">
                {{ isSteemToTSteem ? "TSTEEM" : "STEEM" }}
              </div>
            </div>
          </div>
        </div>
        <!-- 按钮 -->
        <div class="confirm-box">
          <button class="confirm-btn" @click="trans" :disabled="!canTransFlag">
            {{ $t("message.confirmconvert") }}
          </button>
        </div>

        <!--手续费-->
        <p
          style="
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: gray;
            margin: 0;
            padding-top: 8px;
          "
          v-if="isSteemToTSteem"
        >
          {{ $t("message.servicecharge") }}： 0.2%，{{
            $t("message.atleastcharge")
          }}
          0.1 STEEM
        </p>
        <!-- 兑换率 -->
        <p
          style="
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: gray;
            margin: 0;
            padding-top: 8px;
          "
          v-if="isSteemToTSteem"
        >
          {{ $t("message.convertrate") }}： 1 STEEM = 1 TSTEEM
        </p>
        <p
          style="
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: gray;
            margin: 0;
            padding-top: 8px;
          "
          v-else
        >
          {{ $t("message.convertrate") }}： 1 TSTEEM = 1 STEEM
        </p>
      </div>

      <!--sbd兑换-->
      <div v-if="sbdFlag" class="exchange">
        <!-- 上面的框 -->
        <div class="round-box">
          <div class="round-box-title-container">
            <p class="box-title">from</p>
            <p class="box-title">
              {{ $t("message.balance") }}:
              {{ isSbdToTSbd ? balanceOfSbd : balanceOfTsbd }}
            </p>
          </div>
          <div class="round-box-content-container">
            <input
              class="mb-2 mr-sm-2 mb-sm-0 user input"
              :class="checkSbdFlag ? 'isok' : 'isfalse'"
              placeholder="0.0"
              v-model="transSbdValue"
              @keyup="checkTransSbdValue"
              type="number"
              inputmode="decimal"
              pattern="^[0-9]*[.,]?[0-9]*$"
              spellcheck="false"
              value
            />
            <div style="display: flex">
              <button class="maxBtn" @click="fillMaxSbdTrans">Max</button>
              <img
                class="coin-icon"
                src="../../static/images/sbd.svg"
                alt=""
                v-if="isSbdToTSbd"
              />
              <img
                class="coin-icon"
                src="../../static/images/tsbd.svg"
                alt=""
                v-else
              />
              <div style="margin-top: 18px; margin-left: 8px">
                {{ isSbdToTSbd ? "SBD" : "TSBD" }}
              </div>
            </div>
          </div>
        </div>
        <!-- 中间箭头 -->
        <div class="pink-arrow-box">
          <div style="margin: 0 auto" @click="changeTransSbdOrder">
            <img class="pink-arrow" src="../../static/images/pink-arrow.svg" />
          </div>
        </div>
        <!-- 下面的框 -->
        <div class="round-box">
          <div class="round-box-title-container">
            <p class="box-title">to</p>
            <p class="box-title">
              {{ $t("message.balance") }}:
              {{ isSbdToTSbd ? balanceOfTsbd : balanceOfSbd }}
            </p>
          </div>
          <div class="round-box-content-container">
            <input
              class="mb-2 mr-sm-2 mb-sm-0 user input"
              placeholder="0.0"
              v-model="transSbdValue"
              pattern="^[0-9]*[.,]?[0-9]*$"
              spellcheck="false"
              value
            />
            <div style="display: flex">
              <img
                class="coin-icon"
                src="../../static/images/tsbd.svg"
                alt=""
                v-if="isSbdToTSbd"
              />
              <img
                class="coin-icon"
                src="../../static/images/sbd.svg"
                alt=""
                v-else
              />
              <div style="margin-top: 18px; margin-left: 8px">
                {{ isSbdToTSbd ? "TSBD" : "SBD" }}
              </div>
            </div>
          </div>
        </div>
        <!-- 按钮 -->
        <div class="confirm-box">
          <button
            class="confirm-btn"
            @click="transSbd"
            :disabled="!canTransSbdFlag"
          >
            {{ $t("message.confirmconvert") }}
          </button>
        </div>

        <!--手续费-->
        <p
          style="
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: gray;
            margin: 0;
            padding-top: 8px;
          "
          v-if="isSbdToTSbd"
        >
          {{ $t("message.servicecharge") }}： 0.2%，{{
            $t("message.atleastcharge")
          }}
          0.015 SBD
        </p>
        <!-- 兑换率 -->
        <p
          style="
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: gray;
            margin: 0;
            padding-top: 8px;
          "
          v-if="isSbdToTSbd"
        >
          {{ $t("message.convertrate") }}： 1 SBD = 1 TSBD
        </p>
        <p
          style="
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: gray;
            margin: 0;
            padding-top: 8px;
          "
          v-else
        >
          {{ $t("message.convertrate") }}： 1 TSBD= 1 SBD
        </p>
      </div>

      <!--tsp兑换-->
      <div v-if="tspFlag" class="exchange">
        <!-- 上面的框 -->
        <div class="round-box">
          <div class="round-box-title-container">
            <p class="box-title">from</p>
            <p class="box-title">
              {{ $t("message.balance") }}:
              {{ isSteemToTsp ? balanceOfSeem : balanceOfTsp }}
            </p>
          </div>
          <div class="round-box-content-container">
            <input
              class="mb-2 mr-sm-2 mb-sm-0 user input"
              :class="checkTspFlag ? 'isok' : 'isfalse'"
              placeholder="0.0"
              v-model="transTspValue"
              @keyup="checkTransTspValue"
              type="number"
              inputmode="decimal"
              pattern="^[0-9]*[.,]?[0-9]*$"
              spellcheck="false"
              value
            />
            <div style="display: flex">
              <button class="maxBtn" @click="fillMaxTspTrans">Max</button>
              <img
                class="coin-icon"
                src="../../static/images/sbd.svg"
                alt=""
                v-if="isSteemToTsp"
              />
              <img
                class="coin-icon"
                src="../../static/images/tsbd.svg"
                alt=""
                v-else
              />
              <div style="margin-top: 18px; margin-left: 8px">
                {{ isSteemToTsp ? "STEEM" : "TSP" }}
              </div>
            </div>
          </div>
        </div>
        <!-- 中间箭头 -->
        <div class="pink-arrow-box">
          <div style="margin: 0 auto" @click="changeTransTspOrder">
            <img class="pink-arrow" src="../../static/images/pink-arrow.svg" />
          </div>
        </div>
        <!-- 下面的框 -->
        <div class="round-box">
          <div class="round-box-title-container">
            <p class="box-title">to</p>
            <p class="box-title">
              {{ $t("message.balance") }}:
              {{ isSteemToTsp ? balanceOfTsp : balanceOfSeem }}
            </p>
          </div>
          <div class="round-box-content-container">
            <input
              class="mb-2 mr-sm-2 mb-sm-0 user input"
              placeholder="0.0"
              v-model="transTspValue"
              pattern="^[0-9]*[.,]?[0-9]*$"
              spellcheck="false"
              value
            />
            <div style="display: flex">
              <img
                class="coin-icon"
                src="../../static/images/tsbd.svg"
                alt=""
                v-if="isSteemToTsp"
              />
              <img
                class="coin-icon"
                src="../../static/images/sbd.svg"
                alt=""
                v-else
              />
              <div style="margin-top: 18px; margin-left: 8px">
                {{ isSteemToTsp ? "TSP" : "STEEM" }}
              </div>
            </div>
          </div>
        </div>
        <!-- 按钮 -->
        <div class="confirm-box">
          <button
            class="confirm-btn"
            @click="transTsp"
            :disabled="!canTransTspFlag"
          >
            {{ $t("message.confirmconvert") }}
          </button>
        </div>

        <!--手续费-->
        <p
          style="
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: gray;
            margin: 0;
            padding-top: 8px;
          "
        >
          {{ $t("message.servicecharge") }}： 0.2%，{{
            $t("message.atleastcharge")
          }}
          {{ steemtotspfee }} STEEM
        </p>
        <!-- 兑换率 -->
        <p
          style="
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: gray;
            margin: 0;
            padding-top: 8px;
          "
          v-if="isSteemToTsp"
        >
          {{ $t("message.convertrate") }}： 1 STEEM = 1 TSP
        </p>
        <p
          style="
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: gray;
            margin: 0;
            padding-top: 8px;
          "
          v-else
        >
          {{ $t("message.convertrate") }}： 1 TSP= 1 STEEM<br />
          {{ $t("tsp.tsptosteemintro") }}
        </p>
      </div>
    </div>

    <!--加载动画-->
    <transition name="fade">
      <SmallLoading v-if="isLoading"></SmallLoading>
    </transition>
    <!-- 错误提示弹窗 -->
    <transition name="fade">
      <div class="mask" v-if="showMask" @click="hideMask">
        <div class="mask-box">
          <div class="mask-info">
            <div class="mask-info-text">
              {{ maskInfo }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import SmallLoading from "./SmallLoading";
import { transferSteem } from "../utils/chain/steemOperations.js";
import {
  getTronLinkAddr,
  isTransactionSuccess,
  isInsufficientEnerge,
  isAddress,
  intToAmount,
  amountToInt,
} from "../utils/chain/tron";
import { getContract } from "../utils/chain/contract";
export default {
  name: "Bridge",
  data() {
    return {
      balanceOf: "", //tsteem
      balanceOf2: "",
      isLoading: true,

      balanceOfSeem: "",
      balanceOfSbd: "",
      balanceOfSp: "",

      steemFlag: false,
      sbdFlag: false,
      tspFlag: true,
      steemtotspfee: process.env.VUE_APP_STEEM_TSP_FEE || 1,

      balanceOfTsp: "",
      balanceOfTsp2: "",
      steemFlag: false,

      showMask: false,

      isSteemToTSteem: true,
      transValue: "",
      checkFlag: true,
      canTransFlag: false,
      maskInfo: "",

      balanceOfTsbd: "", //tsbd
      balanceOfTsbd2: "",

      isSbdToTSbd: true,
      transSbdValue: "",
      checkSbdFlag: true,
      canTransSbdFlag: false,

      isSteemToTsp: true, // tsp
      transTspValue: "",
      checkTspFlag: true,
      canTransTspFlag: false,
      addr: "",
    };
  },
  methods: {
    beforeSteem() {
      this.steemFlag = true;
      this.sbdFlag = false;
      this.tspFlag = false;
    },
    beforeSbd() {
      this.steemFlag = false;
      this.sbdFlag = true;
      this.tspFlag = false;
    },
    beforeTsp() {
      this.steemFlag = false;
      this.sbdFlag = false;
      this.tspFlag = true;
    },
    async getTsteemBalance() {
      //tsteem
      let instance = await getContract("STEEM");
      // console.log(1235, 'steeeminstance', instance)
      let a = await instance.balanceOf(this.addr).call();
      this.balanceOf = this.formatData(intToAmount(a)); //tsteem
      this.balanceOf2 = intToAmount(a);
    },
    async getTsbdBalance() {
      //tsbd
      let instance = await getContract("SBD");
      let a = await instance.balanceOf(this.addr).call();
      this.balanceOfTsbd = this.formatData(intToAmount(a));
      this.balanceOfTsbd2 = intToAmount(a);
    },
    async getTspBalance() {
      // tsp
      let instance = await getContract("TSP");
      let a = await instance.balanceOf(this.addr).call();
      this.balanceOfTsp2 = intToAmount(a);
      this.balanceOfTsp = this.formatData(this.balanceOfTsp2);
    },
    async getSteemStates() {
      let username = this.$store.state.username;
      let s = await this.steem.api.getAccountsAsync([username]);
      this.balanceOfSeem = s[0].balance;
      // console.log(123, 'sbd', s)
      this.balanceOfSbd = s[0].sbd_balance;
    },
    fillMaxTrans() {
      if (this.isSteemToTSteem) {
        let b = parseFloat(this.balanceOfSeem) * 0.002;
        let steemfee = b > 0.1 ? b : 0.1;
        this.transValue = parseFloat(this.balanceOfSeem) - steemfee;
        this.transValue = this.transValue.toFixed(3);
      } else {
        this.transValue = parseFloat(this.balanceOf2);
        this.transValue = this.transValue.toFixed(3);
      }
      this.checkTransValue();
    },
    checkTransValue() {
      let reg = /^\d+(\.\d+)?$/;
      let res = reg.test(this.transValue);
      let res1 = false;
      if (parseFloat(this.transValue) > 0) {
        res1 = true;
      }
      let b = parseFloat(this.transValue) * 0.002;
      let steemfee = b > 0.1 ? b : 0.1;

      if (this.isSteemToTSteem) {
        let res2 =
          parseFloat(this.transValue) <=
          parseFloat(parseFloat(this.balanceOfSeem) - steemfee).toFixed(3);
        this.canTransFlag = res1 && res && res2;
        this.checkFlag = this.canTransFlag;
      } else {
        let res3 = parseFloat(this.transValue) <= parseFloat(this.balanceOf2);
        this.canTransFlag = res1 && res && res3;
        this.checkFlag = this.canTransFlag;
      }
    },
    changeTransOrder() {
      this.isSteemToTSteem = !this.isSteemToTSteem;
      this.transValue = "";
    },

    async steemTransfer(
      account,
      to,
      amount,
      memo,
      currency,
      address,
      transFee
    ) {
      let b = parseFloat(amount) * 0.002;
      let fee = b > transFee ? b : transFee;
      return await this.steemWrap(
        account,
        to,
        amount,
        memo,
        currency,
        address,
        fee
      );
    },
    async steemToTSteem() {
      try {
        this.isLoading = true;
        this.canTransFlag = false;
        //steem转帐
        let isAddr = await isAddress(this.addr);
        if (!isAddr) {
          this.isLoadingAddr = false;
          this.maskInfo = "Can not get tron address,please refresh!";
          this.showMask = true;
          return;
        }
        let from = this.$store.state.username;
        // let to = process.env.VUE_APP_STEEM
        let to = process.env.VUE_APP_STEEM_DEX;
        let amount = parseFloat(this.transValue).toFixed(3);
        let currency = "STEEM";
        let memo = this.addr + " +" + amount + " TSTEEM";
        let res = await this.steemTransfer(
          from,
          to,
          amount,
          memo,
          currency,
          this.addr,
          0.1
        );
        if (res.success === true) {
          await this.sleep();
          this.getTsteemBalance();
          await this.getSteemStates();
        } else {
          this.maskInfo = this.$t("error.error") + "\n" + res.message;
          this.showMask = true;
        }
      } catch (e) {
        this.isLoading = false;
        this.maskInfo = this.$t("error.error") + "\n" + e.message;
        this.showMask = true;
      } finally {
        this.isLoading = false;
        this.transValue = "";
        this.checkTransValue();
      }
    },
    async TSteemToSteem() {
      try {
        this.isLoading = true;
        this.canTransFlag = false;
        let to = this.$store.state.username;
        let instance = await getContract("STEEM");
        //销毁
        let ss = parseFloat(this.transValue).toFixed(3);
        let value = amountToInt(ss);
        let res = await instance
          .tsteemToSteem(to, value)
          .send({ feeLimit: 20_000_000 });
        if (res && (await isTransactionSuccess(res))) {
          await this.sleep();
          await this.getSteemStates();
          this.getTsteemBalance();
        } else {
          if (await isInsufficientEnerge(res)) {
            alert(
              this.$t("error.error") +
                "\n" +
                this.$t("error.insufficientEnerge")
            );
          } else {
            alert(this.$t("error.error") + "\n" + "transfer fail");
          }
        }
      } catch (e) {
        this.maskInfo = this.$t("error.error") + "\n" + e;
        this.showMask = true;
      } finally {
        this.isLoading = false;
        this.transValue = "";
        this.checkTransValue();
      }
    },
    async trans() {
      if (this.isSteemToTSteem) {
        this.steemToTSteem();
      } else {
        this.TSteemToSteem();
      }
    },
    hideMask() {
      this.showMask = false;
    },

    checkTransSbdValue() {
      let reg = /^\d+(\.\d+)?$/;
      let res = reg.test(this.transSbdValue);
      let res1 = false;
      if (parseFloat(this.transSbdValue) > 0) {
        res1 = true;
      }
      let f = parseFloat(this.transValue) * 0.002;
      let sbdfee = f > 0.015 ? f : 0.015;

      if (this.isSbdToTSbd) {
        let res2 =
          parseFloat(this.transSbdValue) <=
          parseFloat(parseFloat(this.balanceOfSbd) - sbdfee).toFixed(3);

        this.canTransSbdFlag = res1 && res && res2;
        this.checkSbdFlag = this.canTransSbdFlag;
      } else {
        let res3 =
          parseFloat(this.transSbdValue) <= parseFloat(this.balanceOfTsbd2);
        this.canTransSbdFlag = res1 && res && res3;
        this.checkSbdFlag = this.canTransSbdFlag;
      }
    },
    fillMaxSbdTrans() {
      let f = parseFloat(this.balanceOfSbd) * 0.002;
      let sbdfee = f > 0.015 ? f : 0.015;
      if (this.isSbdToTSbd) {
        this.transSbdValue = parseFloat(this.balanceOfSbd) - sbdfee;
        this.transSbdValue = this.transSbdValue.toFixed(3);
      } else {
        this.transSbdValue = parseFloat(this.balanceOfTsbd2);
        this.transSbdValue = this.transSbdValue.toFixed(3);
      }
      this.checkTransSbdValue();
    },
    changeTransSbdOrder() {
      this.isSbdToTSbd = !this.isSbdToTSbd;
      this.transSbdValue = "";
    },

    async sbdTransfer(account, to, amount, memo, currency, address) {
      let b = parseFloat(amount) * 0.002;
      let fee = b > 0.015 ? b : 0.015;
      return await this.steemWrap(
        account,
        to,
        amount,
        memo,
        currency,
        address,
        fee
      );
    },
    async sbdToTSbd() {
      try {
        this.isLoading = true;
        this.canTransSbdFlag = false;
        //steem转帐
        let isAddr = await isAddress(this.addr);
        if (!isAddr) {
          this.isLoadingAddr = false;
          this.maskInfo = "Can not get tron address,please refresh!";
          this.showMask = true;
          return;
        }
        let from = this.$store.state.username;
        // let to = process.env.VUE_APP_STEEM
        let to = process.env.VUE_APP_STEEM_DEX;
        let amount = parseFloat(this.transSbdValue).toFixed(3);
        let currency = "SBD";
        let memo = this.addr + " +" + amount + " TSBD";
        let res = await this.sbdTransfer(
          from,
          to,
          amount,
          memo,
          currency,
          this.addr
        );
        if (res.success === true) {
          await this.getSteemStates();
          this.getTsbdBalance();
        } else {
          this.maskInfo = this.$t("error.error") + "\n" + res.message;
          this.showMask = true;
        }
      } catch (e) {
        this.maskInfo = this.$t("error.error") + "\n" + e;
        this.showMask = true;
      } finally {
        this.isLoading = false;
        this.transSbdValue = "";
        this.checkTransSbdValue();
      }
    },
    async TSbdToSbd() {
      try {
        this.isLoading = true;
        this.canTransSbdFlag = false;
        let to = this.$store.state.username;
        let instance = await getContract("SBD");
        //销毁
        let ss = parseFloat(this.transSbdValue).toFixed(3);
        let value = amountToInt(ss);
        let res = await instance
          .tsbdToSbd(to, value)
          .send({ feeLimit: 20_000_000 });
        if (res && (await isTransactionSuccess(res))) {
          await this.getSteemStates();
          this.getTsbdBalance();
        } else {
          if (await isInsufficientEnerge(res)) {
            alert(
              this.$t("error.error") +
                "\n" +
                this.$t("error.insufficientEnerge")
            );
          } else {
            alert(this.$t("error.error") + "\n" + "transfer fail");
          }
        }
      } catch (e) {
        this.maskInfo = this.$t("error.error") + "\n" + e;
        this.showMask = true;
      } finally {
        this.isLoading = false;
        this.transSbdValue = "";
        this.checkTransSbdValue();
      }
    },
    async transSbd() {
      if (this.isSbdToTSbd) {
        this.sbdToTSbd();
      } else {
        this.TSbdToSbd();
      }
    },

    checkTransTspValue() {
      let reg = /^\d+(\.\d+)?$/;
      let res = reg.test(this.transTspValue);
      let res1 = false;
      if (parseFloat(this.transTspValue) > 0) {
        res1 = true;
      }
      let f = parseFloat(this.transTspValue) * 0.002;
      let tspfee = f > this.steemtotspfee ? f : this.steemtotspfee;
      if (this.isSteemToTsp) {
        let res2 =
          parseFloat(this.transTspValue) <=
          parseFloat(parseFloat(this.balanceOfSeem) - tspfee).toFixed(3);
        this.canTransTspFlag = res1 && res && res2;
        this.checkTspFlag = this.canTransTspFlag;
      } else {
        let res3 =
          parseFloat(this.transTspValue) <= parseFloat(this.balanceOfTsp2);
        let res4 = parseFloat(this.balanceOfTsp2) >= tspfee;
        this.canTransTspFlag = res1 && res && res3 && res4;
        this.checkTspFlag = this.canTransTspFlag;
      }
    },
    fillMaxTspTrans() {
      let f = parseFloat(this.transTspValue) * 0.002;
      let tspfee = f > this.steemtotspfee ? f : this.steemtotspfee;
      if (this.isSteemToTsp) {
        this.transTspValue = parseFloat(this.balanceOfSeem) - tspfee;
        this.transTspValue = this.transTspValue.toFixed(3);
      } else {
        this.transTspValue = parseFloat(this.balanceOfTsp2);
        this.transTspValue = this.transTspValue.toFixed(3);
      }
      this.checkTransTspValue();
    },
    changeTransTspOrder() {
      this.isSteemToTsp = !this.isSteemToTsp;
      this.transTspValue = "";
    },
    async transSteemToTsp() {
      try {
        this.isLoading = true;
        this.canTransTspFlag = false;
        //steem转帐
        let isAddr = await isAddress(this.addr);
        if (!isAddr) {
          this.isLoadingAddr = false;
          this.maskInfo = "Can not get tron address,please refresh!";
          this.showMask = true;
          return;
        }
        let from = this.$store.state.username;
        let to = process.env.VUE_APP_STEEM_TSP || "nutbox.tsp";
        let f = parseFloat(this.transTspValue) * 0.002;
        let tspfee = f > this.steemtotspfee ? f : this.steemtotspfee;
        let amount = parseFloat(this.transTspValue).toFixed(3);
        let currency = "STEEM";
        let memo = this.addr + " +" + amount + " TSP";
        let res = await this.steemTransferVest(
          from,
          to,
          amount,
          this.addr,
          tspfee
        );
        if (res.success === true) {
          await this.sleep();
          await this.getTspBalance();
        } else {
          this.maskInfo = this.$t("error.error") + "\n" + res.message;
          this.showMask = true;
        }
      } catch (e) {
        this.maskInfo = this.$t("error.error") + "\n" + e.message;
        this.showMask = true;
      } finally {
        this.isLoading = false;
        this.transTspValue = "";
        this.checkTransTspValue();
      }
    },
    async transTspToSteem() {
      try {
        this.isLoading = true;
        this.canTransTspFlag = false;
        // let from =  process.env.VUE_APP_STEEM
        let from = this.$store.state.username;
        let to = process.env.VUE_APP_STEEM_GAS || "nutbox.gas";
        let isAddr = await isAddress(this.addr);
        if (!isAddr) {
          this.isLoadingAddr = false;
          this.maskInfo = "Can not get tron address, please refresh!";
          this.showMask = true;
          return;
        }
        let instance = await getContract("TSP");
        //销毁
        let ss = parseFloat(this.transTspValue).toFixed(3);
        // let value = this.web3.utils.toWei(ss, 'ether')
        let value = amountToInt(ss);
        //steem转帐gas费
        let f = parseFloat(this.transTspValue) * 0.002;
        let tspfee = f > this.steemtotspfee ? f : this.steemtotspfee;
        let memo = this.addr + " -" + this.transTspValue + " TSP";
        let res = await transferSteem(from, to, tspfee, memo);
        if (res.success === true) {
          let res = await instance
            .tspToSteem(from, value)
            .send({ feeLimit: 20_000_000 });
          if (res && (await isTransactionSuccess(res))) {
            await this.getTspBalance();
          } else {
            if (await isInsufficientEnerge(res)) {
              alert(
                this.$t("error.error") +
                  "\n" +
                  this.$t("error.insufficientEnerge")
              );
            } else {
              alert(this.$t("error.error") + "\n" + "transfer fail");
            }
          }
        } else {
          this.maskInfo = this.$t("error.error") + "\n" + "steem operate fail!";
          this.showMask = true;
          this.checkTransTspValue();
        }
      } catch (e) {
        this.maskInfo = this.$t("error.error") + "\n" + e;
        this.showMask = true;
      } finally {
        this.transTspValue = "";
        this.isLoading = false;
      }
    },
    async transTsp() {
      if (this.isSteemToTsp) {
        this.transSteemToTsp();
      } else {
        this.transTspToSteem();
      }
    },
  },

  components: {
    SmallLoading,
  },

  mounted() {
    if (!this.$store.state.username) {
      this.$router.push({ path: "/login" });
    }
    let that = this;
    async function main() {
      that.addr = await getTronLinkAddr();
      //如果刷新页面, instance未定义
      try {
        await that.getSteemStates();
        that.getTsteemBalance();
        that.getTsbdBalance();
        that.getTspBalance();
      } catch (e) {
        that.maskInfo = that.$t("error.tryrefreshpage") + "\n" + e;
        that.showMask = true;
      }
      that.isLoading = false;
    }
    main();
  },
};
</script>

<style scoped>
.wallet {
  width: 45%;
  max-width: 520px;
  min-width: 400px;
  margin: 2.5rem auto;
  padding: 1.5rem 1rem 2rem 1rem;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 3px 30px, rgba(0, 0, 0, 0.04) 0px 4px 8px,
    rgba(0, 0, 0, 0.04) 3px 16px 24px, rgba(0, 0, 0, 0.01) 3px 24px 32px;
  border-radius: 30px;
  display: block;
  z-index: 1;
  box-sizing: border-box;
}
.changebox {
  display: flex;
  justify-content: space-evenly;
  padding: 1em;
}

.changebox p {
  font-weight: 400;
  color: darkgray;
  font-size: 1.2rem;
  cursor: pointer;
}

.titleSelected {
  color: rgb(30, 30, 30) !important;
  font-weight: 500 !important;
}

.titleUnSelected {
  color: darkgray !important;
  font-weight: 400 !important;
}

.changebox p:hover {
  color: rgb(92, 91, 91) !important;
}

.user {
  margin-top: 1rem;
  width: 30rem;
}

.round-box {
  border-radius: 20px;
  border: 1px solid rgb(247, 248, 250);
  padding: 8px 14px;
  margin-bottom: 1rem;
}

.round-box-title-container {
  display: flex;
  flex-flow: row nowrap;
  -webkit-box-align: center;
  align-items: center;
  color: rgb(0, 0, 0);
  font-size: 0.75rem;
  line-height: 1rem;
  box-sizing: border-box;
  justify-content: space-between;
  -webkit-box-pack: justify;
  height: 100%;
}
.round-box-content-container {
  display: flex;
  flex-flow: row nowrap;
  -webkit-box-align: center;
  align-items: center;
  color: rgb(0, 0, 0);
  font-size: 1rem;
  line-height: 1.2rem;
  box-sizing: border-box;
  padding-top: 14px;
  justify-content: space-between;
  -webkit-box-pack: justify;
  height: 100%;
}

.box-title {
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  font-weight: 500;
  font-size: 14px;
  color: rgb(86, 90, 105);
}

.input {
  color: rgb(0, 0, 0);
  width: 100%;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: rgb(255, 255, 255);
  font-size: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  appearance: textfield;
}
.maxBtn {
  height: 100%;
  margin-top: 16px;
  background-color: rgb(253, 234, 241);
  border: 1px solid rgb(253, 234, 241);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: rgb(255, 0, 122);
  user-select: none;
}

.maxBtn:focus {
  border: 1px solid rgb(255, 0, 122);
  outline: none;
}

.maxBtn:hover {
  border: 1px solid rgb(255, 0, 122);
}
.pink-arrow-box {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  align-content: center;
  width: 100%;
  text-align: center;
}
.coin-icon {
  margin-top: 15px;
  width: 24px;
  height: 24px;
}

.pink-arrow {
  cursor: pointer;
}

.confirm-box {
  margin-top: 1em;
  display: flex;
  justify-content: space-around;
}

.confirm-btn {
  padding: 12px;
  /* width: 100%; */
  flex: 1;
  text-align: center;
  border-radius: 20px;
  outline: none;
  border: 1px solid transparent;
  text-decoration: none;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  flex-wrap: nowrap;
  -webkit-box-align: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  background-color: rgb(253, 234, 241);
  color: rgb(255, 0, 122);
  font-size: 16px;
  font-weight: 500;
  user-select: none;
}

.confirm-btn:hover {
  background-color: rgb(251, 220, 230);
}

.confirm-btn:disabled {
  color: rgb(136, 141, 155);
  cursor: auto;
  box-shadow: none;
  outline: none;
  opacity: 1;
  background-color: rgb(237, 238, 242);
}

.mask {
  z-index: 2000;
  overflow: hidden;
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
}

.mask-box {
  position: relative;
  max-width: 280px;
  width: 100%;
  background: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.08) 0px 3px 30px, rgba(0, 0, 0, 0.04) 0px 4px 8px,
    rgba(0, 0, 0, 0.04) 3px 16px 24px, rgba(0, 0, 0, 0.01) 3px 24px 32px;
  border-radius: 10px;
  padding: 1rem;
  display: block;
  z-index: 100;
  box-sizing: border-box;
  margin-top: -50vh;
}

.mask-info {
  display: flex;
  align-content: center;
}

.mask-info-text {
  text-align: center;
  width: 100%;
}

.exchange {
  /* width: 30rem; */
  margin-top: 1rem;
}

.isok {
  /*margin-top: 1.5rem;*/
  /*width: 50%;*/
  /*background-color: chartreuse;*/
}
.isfalse {
  /*margin-top: 1.5rem;*/
  /*width: 50%;*/
  background-color: crimson;
}
</style>

