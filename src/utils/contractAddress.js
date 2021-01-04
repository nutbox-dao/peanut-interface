import axios from 'axios'
import TronWeb from 'tronweb'
import {TRON_NODE_API} from '../const.js'
//tron网络
const HttpProvider = TronWeb.providers.HttpProvider
const TRON_NODE = "https://api.shasta.trongrid.io"
// const fullNode = new HttpProvider("https://api.trongrid.io")
const fullNode = new HttpProvider(TRON_NODE)
const solidityNode = new HttpProvider(TRON_NODE)
const eventServer = new HttpProvider(TRON_NODE)
const tronWeb2 = new TronWeb(fullNode,solidityNode,eventServer)

import {getAbiAndContractAddress} from './chain/contract'

export const contractAddress = async function(symbol){
    return getAbiAndContractAddress(symbol)[1]
}

export async function peanutsPoolAddress(){
    let res = await axios.get('/PeanutsPoolV2.json')
    let PeanutsPool = tronWeb2.address.fromHex(res.data.networks['*'].address)
    return PeanutsPool
}

export async function tsbdAddress(){
    let res = await axios.get('/NutboxSbd.json')
    return tronWeb2.address.fromHex(res.data.networks['*'].address)
}

export async function tsteemAddress(){
    let res = await axios.get('/NutboxSteem.json')
    return tronWeb2.address.fromHex(res.data.networks['*'].address)
}

export async function peanutAddress(){
    let res = await axios.get('/NutboxPeanuts.json')
    return tronWeb2.address.fromHex(res.data.networks['*'].address)
}

export async function tspAddress(){
    let res = await axios.get('/NutboxTsp.json')
    return tronWeb2.address.fromHex(res.data.networks['*'].address)
}
export async function tspPoolAddress(){
    let res = await axios.get('/TspPooling.json')
    return tronWeb2.address.fromHex(res.data.networks['*'].address)
}
export async function tspLPPoolAddress(){
    let res = await axios.get('/TspLpPool.json')
    return tronWeb2.address.fromHex(res.data.networks['*'].address)
}