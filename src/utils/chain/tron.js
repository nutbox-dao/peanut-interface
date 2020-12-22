import axios from "axios";
import Tron from "tronweb";
import {TRON_NODE_API} from '../../const.js'

let tron_instances = {
  DEFAULT: null,
  STEEM: null,
  SBD: null,
  PEANUT: null,
  SP: null,
  TSP_POOL: null,
};

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

function getTron(symbol = "DEFAULT") {
  return initTron(symbol);
}

let contracts = {};

async function getContractAbi(symbol = "STEEM", force = false) {
  symbol = symbol.toUpperCase();
  const contract_file = LOCAL_CONTRACT_FILE[symbol];
  if (fs.existsSync(contract_file) && !force) {
    const data = fs.readFileSync(contract_file);
    if (data) {
      return JSON.parse(data);
    }
  } else {
    const contract_url = CONTRACT_URLS[symbol];
    let { data } = await axios.get(contract_url);
    // save local cache to reduce network request
    fs.writeFileSync(contract_file, JSON.stringify(data, null, 2));
    return data;
  }
  return null;
}

export function getAddress(hex) {
  const tron = getTron();
  return tron.address.fromHex(hex);
}

export async function getContract(symbol = "STEEM", force = false) {
  symbol = symbol.toUpperCase();
  if (!contracts[symbol] || force) {
    const json = await getContractAbi(symbol, force);
    if (json) {
      const tron = getTron(symbol);
      const address = getAddress(json.networks["*"].address);
      contracts[symbol] = tron.contract(json.abi, address);
    }
  }
  return contracts[symbol];
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
    console.log('getTron',tron)
    return await tron.trx.getTransaction(trxId);
  } catch (e) {
    console.log("Fail to get transaction [%s]; error = [%s]", trxId, e);
    return null;
  }
};

export const getTransactionResult = function (trxId) {
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

export const contractConfig = {
  feeLimit: 20 * 1000000, // 20 TRX (1TRX = 1,000,000SUN),
  // shouldPollResponse: true,
};