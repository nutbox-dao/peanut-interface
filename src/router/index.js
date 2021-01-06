import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Index from '../components/Index'
import Bridge from '../components/Bridge'
import Wallet from "../components/Wallet"
import Contract from "../components/footers/Contract"
import Contact from "../components/footers/Contact"
import DelegatorLists from "../components/footers/DelegatorLists"
import Tools from "../components/footers/Tools"
import Questions from "../components/footers/Questions"
import Swap from "../components/footers/Swap"
import TSP from "../components/TSP"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
      meta:{
          requireAuth:true
      }
  },
  {
    path: '/tsp',
    name: 'tsp',
    component: TSP
  },
  {
    path: '/bridge',
    name: 'bridge',
    component: Bridge,
    meta:{
       requireAuth:true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: Wallet,
  },
  {
    path: '/contract',
    name: 'contract',
    component: Contract
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact
  },
  {
    path: '/delegatorlists',
    name: 'delegatorlists',
    component: DelegatorLists
  },
  {
    path: '/tools',
    name: 'tools',
    component: Tools
  },
  {
    path: '/questions',
    name: 'questions',
    component: Questions
  },
  {
    path: '/swap',
    name: 'swap',
    component: Swap
  },



]

const router = new VueRouter({
  mode: 'history',
  // mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router