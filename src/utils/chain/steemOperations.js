import steem from "steem";
import axios from "axios"
import {STEEM_API_URLS, STEEM_CONF_KEY} from '../../const.js'
let steemConf = window.localStorage.getItem(STEEM_CONF_KEY) || STEEM_API_URLS[0]
window.localStorage.setItem(STEEM_CONF_KEY, steemConf)
steem.api.setOptions({ url: steemConf })

function requestBroadcastWithFee(account, address, fee, symbol, operation, needsActive = true) {
  const steemGas = process.env.VUE_APP_STEEM_GAS
  const feeOperation = [
    'transfer',
    {
      from: account,
      to: steemGas,
      amount: fee + ' ' + symbol,
      memo: 'fee: ' + operation[0] + ' ' + address
    }
  ]
  return new Promise(resolve => {
    steem_keychain.requestBroadcast(account, [feeOperation, operation],
      needsActive ? 'Active' : 'Posting', function (response) {
        resolve(response)
    });
  })
}

export async function transfer(fromTron, toSteem, amount, symbol, memo) {
  return await steem.broadcast.transferAsync(
    STEEM_SWAP_ACCOUNT_KEY,
    STEEM_SWAP_ACCOUNT,
    toSteem,
    amount + " " + symbol,
    memo
  );
}

export async function transferSteem(from,to,amount,memo){
  amount = parseFloat(amount).toFixed(3)
  const transOp = [
    'transfer',
    {
      from,
      to,
      amount: amount + ' STEEM',
      memo
    }
  ]
  return await new Promise(resolve => {
    steem_keychain.requestBroadcast(from, [transOp],
      'Active', function (response) {
        resolve(response)
    });
  })
}

export async function delegate(
  privateKey,
  delegator,
  delegatee,
  vesting_shares,
  address,
  fee
) {
  vesting_shares = parseNumber(vesting_shares).toFixed(6) + " VESTS";
  return await broadcastWithFee(privateKey, delegator, address, fee, "STEEM", [
    "delegate_vesting_shares",
    {
      delegator,
      delegatee,
      vesting_shares,
    },
  ]);
}

export async function steemWrap(from, to, amount, memo, currency, address, fee) {
  fee = parseFloat(fee).toFixed(3)
  return await requestBroadcastWithFee(from, address, fee, currency, [
    'transfer',
    {
      from,
      to,
      amount: amount + ' ' + currency,
      memo
    }
  ])
}

export async function steemDelegation(delegator, delegatee, amount, address) {
  const fee = parseFloat(process.env.VUE_APP_DELEGATE_FEE || 0.5).toFixed(3)
  return await requestBroadcastWithFee(delegator, address, fee, 'STEEM', [
    'delegate_vesting_shares',
    {
      delegator,
      delegatee,
      vesting_shares: amount + ' ' + 'VESTS'
    }
  ])
}

export async function steemTransferVest(from, to, amount, address, fee){
  fee = parseFloat(fee).toFixed(3)
  const steemGas = process.env.VUE_APP_STEEM_GAS
  const feeOperation = [
    'transfer',
    {
      from,
      to: steemGas,
      amount: fee + ' ' + 'STEEM',
      memo: 'fee: ' + 'transfer_to_vesting' + ' ' + address
    }
  ]
  const transferVestOp = [
    'transfer_to_vesting',
    {
      from,
      to,
      amount: amount + " STEEM"
    }
  ]
  return await new Promise(resolve => {
    steem_keychain.requestBroadcast(from, [feeOperation, transferVestOp],
      'Active', function (response) {
        resolve(response)
    });
  })
}

export async function getGlobalProperties() {
  return await steem.api.getDynamicGlobalPropertiesAsync();
}

export async function steemToVest(steemPower) {
  const props = await getGlobalProperties();
  const totalSteem = Number(props.total_vesting_fund_steem.split(" ")[0]);
  const totalVests = Number(props.total_vesting_shares.split(" ")[0]);
  return ((parseFloat(steemPower) * totalVests) / totalSteem).toFixed(6);
}

export async function vestsToSteem(vests){
  const props = await getGlobalProperties();
  const totalSteem = Number(props.total_vesting_fund_steem.split(" ")[0]);
  const totalVests = Number(props.total_vesting_shares.split(" ")[0]);
  return ((parseFloat(vests) * totalSteem) / totalVests).toFixed(6);
}

export const getAccountInfo = async (account) => {
  const results = await steem.api.getAccountsAsync([account]);
  if (results.length === 0) {
    return null;
  } else {
    return results[0];
  }
};

export const getVestingShares = async (username) => {
  const [account, expiring] = await Promise.all([
    getAccountInfo(username),
    getExpiringDelegation(username),
  ]);

  const staked = parseFloat(account.vesting_shares);
  const received = parseFloat(account.received_vesting_shares);
  const delegated = parseFloat(account.delegated_vesting_shares);
  const withdrawal = parseFloat(account.vesting_withdraw_rate);
  const total = staked + received - delegated - withdrawal;
  const available = staked - delegated - withdrawal;

  return {
    staked,
    received,
    delegated,
    expiring,
    withdrawal,
    total,
    available,
  };
};

export async function getExpiringDelegation(username) {
  const data = await callDatabaseApi("find_vesting_delegation_expirations", {
    account: username,
  });
  if (data && data.delegations) {
    const delegations = data.delegations;
    let total = 0;
    delegations.forEach((d) => {
      if (d.vesting_shares) {
        total += d.vesting_shares.amount / 10 ** d.vesting_shares.precision;
      }
    });
    return total;
  }
  return 0;
}

function callDatabaseApi(method, params) {
  return new Promise(function (resolve, reject) {
    steem.api.call("database_api." + method, params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}


export const getSteemPrice = async function(){
  let res = await axios.request({
    method:"get",
    url:'https://api.coingecko.com/api/v3/coins/steem',
    headers: {
      "accept": "application/json",
    }
  })
  // console.log(111,res.data.tickers)
  let arr = res.data.tickers
  for(let i = 0; i < arr.length; i++){
    if(arr[i].target === "USDT"){
      // console.log(112,arr[i].last)
      return parseFloat(arr[i].last)
    }
  }
}