import axios from "axios";
import Tron from "tronweb";
import {TRON_NODE_API, TRON_LINK_ADDR_NOT_FOUND} from '../../const.js'
import {sleep} from '../sleep.js'

function initTron(symbol) {
  const HttpProvider = Tron.providers.HttpProvider;
  const fullNode = new HttpProvider(TRON_NODE_API);
  const solidityNode = new HttpProvider(TRON_NODE_API);
  const eventServer = new HttpProvider(TRON_NODE_API);
  const privateKey = null;
  if (privateKey) {
    return new Tron(fullNode, solidityNode, eventServer, privateKey);
  } else {
    return new Tron(fullNode, solidityNode, eventServer);
  }
}

export function getTron(symbol = "DEFAULT") {
  return initTron(symbol);
}

export async function getTronLinkAddr() {
  let addr = null;
  let tronLink = await getTronLink()
  if (!tronLink){
    // console.log('no tron link')
    return TRON_LINK_ADDR_NOT_FOUND.noTronLink;
  }
  addr = tronLink.defaultAddress.base58
  // console.log('address',addr)
  if (addr){
    return addr;
  }else{
    return TRON_LINK_ADDR_NOT_FOUND.walletLocked;
  }
}

export const getTronLink = async function(){
  var tronlink = window.tronWeb
  for (let i=0;i<10;i++){
    if (tronlink){
      // console.log('get tron link success')
      return tronlink
    }
    tronlink = window.tronWeb
    // console.log('not get tron link',window.tronWeb)
    await sleep(0.5)
  }
  return window.tronWeb;
}

export function getAddress(hex) {
  const tron = getTron();
  return tron.address.fromHex(hex);
}

export const isAddress = async function(addr){
  if(!addr){
    return false
  }
  let tronweb = getTron()
  return tronweb.isAddress(addr)
}

export const amountToInt = function (amount) {
  const tron = getTron();
  return tron.toBigNumber(amount * 1e6).toFixed(0);
};

export const intToAmount = function (integer) {
  const tron = getTron();
  return tron.toBigNumber(integer * 1e-6).toFixed(6);
};

export const toInt = function (number) {
  const tron = getTron();
  return parseInt(tron.toBigNumber(number));
};

export const getTransaction = async function (trxId) {
  try {
    const tron = getTron();
    return await tron.trx.getTransaction(trxId);
  } catch (e) {
    // console.log("Fail to get transaction [%s]; error = [%s]", trxId, e);
    return null;
  }
};

const getTransactionResult = function (trxId) {
  return new Promise(async (resolve, reject) => {
    const read = async (retries = 20) => {
      const trx = await getTransaction(trxId);
      // console.log(trx,trxId)
      if (trx && trx.ret) {
        resolve(trx.ret);
      } else {
        setTimeout(async () => {
          if (retries > 0) {
            await read(retries - 1);
          } else {
            // reject("Failed to get transaction result of", trxId);
          }
        }, 1000);
      }
    };
    read();
  });
};

export const isTransactionSuccess = async function (trxId) {
  const ret = await getTransactionResult(trxId);
  return ret && ret[0] && ret[0].contractRet === "SUCCESS";
};

export const isInsufficientEnerge = async function (trxId) {
  const ret = await getTransactionResult(trxId);
  console.log(ret)
  console.log(ret[0].contractRet)
  return ret && ret[0] && ret[0].contractRet === "OUT_OF_ENERGY"
};

export const contractConfig = {
  feeLimit: 20 * 1000000, // 20 TRX (1TRX = 1,000,000SUN),
  // shouldPollResponse: true,
};

export const getBalanceOfToken = async function(token, user){
  let tron = getTron()
  let balance = await tron.transactionBuilder
              .triggerConstantContract(token,
                                                'balanceOf(address)',
                                                {},
                                                [{type:'address',value:user}],
                                                user)
  // console.log("banlanceof",balance)                                              
  return balance && balance['constant_result'] && balance['constant_result'][0] && tron.toDecimal('0x'+balance['constant_result'][0]);
}

export const getSupplyOfToken = async function(token){
  let tron = getTron()
  let supply = await tron.transactionBuilder
                    .triggerConstantContract(token,
                                              'totalSupply()',
                                              {},
                                              [],
                                              token)
  // console.log("total supply",tron.toDecimal('0x'+supply['constant_result'][0]))
  return supply && supply['constant_result'] && supply['constant_result'][0] && tron.toDecimal('0x'+supply['constant_result'][0]);
}

// whatch the tronlink address every 5sec，if changed callback the new address
export const whatchWallet = async function(callback){
  try{
    const addr = await getTronLinkAddr()
    if (!addr) {
      return;
    }
    const originalAddr = localStorage.getItem('tronLinkAddress')
    if (addr && originalAddr && callback && addr != originalAddr){
      callback(addr);
    }
    if (addr !== TRON_LINK_ADDR_NOT_FOUND.walletLocked && addr !== TRON_LINK_ADDR_NOT_FOUND.noTronLink){
      localStorage.setItem('tronLinkAddress',addr)
      return;
    }
  }catch(e){

  }finally{
    setTimeout(() => {
      whatchWallet(callback);
    }, 500)
  }
}