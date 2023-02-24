import Vue from 'vue'
import Router from 'vue-router'

// import store from '../store'
// console.log('storestorestore',store)
import * as api from '../api/api'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/views/tuxun/TXNewHome'),
    meta: { title: '图寻 - 探索世界，找到你'},
    hidden: true
  },
  {
    path: '/wxPay',
    component: () => import('@/views/tuxun/pay'),
    meta: { title: '图寻-支付'},
    hidden: true
  },
  {
    path: '/wxRedirect',
    component: () => import('@/views/tuxun/WXRedirect'),
    meta: { title: '重定向'},
    hidden: true
  },
  {
    path: '/maps',
    component: () => import('@/views/tuxun/maps'),
    meta: { title: '图寻-练习赛'},
    hidden: true
  },
  {
    path: '/maps_distribute',
    component: () => import('@/views/tuxun/MapsDistribute'),
    name: 'maps_distribute',
    meta: { title: '题库题目分布'},
    hidden: true
  },
  {
    path: '/my_maps',
    component: () => import('@/views/tuxun/MyMaps'),
    meta: { title: '图寻-练习赛'},
    hidden: true
  },
  {
    path: '/maps_create',
    component: () => import('@/views/tuxun/MapsCreate'),
    meta: { title: '创建题库-图寻'},
    hidden: true
  },
  {
    path: '/replay',
    component: () => import('@/views/tuxun/Replay'),
    name: 'maps',
    meta: { title: '复盘-图寻'},
    hidden: true
  },
  {
    path: '/replay_pano',
    component: () => import('@/views/tuxun/ReplayPanorama'),
    name: 'maps',
    meta: { title: '复盘街景-图寻'},
    hidden: true
  },
  {
    path: '/maps_modify',
    component: () => import('@/views/tuxun/MapsModify'),
    meta: { title: '修改题库-图寻'},
    hidden: true
  },
  {
    path: '/solo_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    meta: { title: '图寻-Solo'},
    hidden: true
  },
  {
    path: '/team_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    meta: { title: '图寻-组队'},
    hidden: true
  },
  {
    path: '/random',
    component: () => import('@/views/tuxun/RandomStreetView'),
    meta: { title: '图寻-随机街景'},
    hidden: true
  },
  {
    path: '/wonders',
    component: () => import('@/views/tuxun/wonders'),
    meta: { title: '图寻-街景奇观'},
    hidden: true
  },
  {
    path: '/maps_detail',
    component: () => import('@/views/tuxun/MapsDetail'),
    name: 'maps',
    meta: { title: '题库详情-图寻'},
    hidden: true
  },
  {
    path: '/daily_challenge',
    component: () => import('@/views/tuxun/DailyChallenge'),
    name: '图寻-每日挑战',
    meta: { title: '图寻-每日挑战'},
    hidden: true
  },
  {
    path: '/challenge',
    component: () => import('@/views/tuxun/TXInvitor'),
    name: '图寻-挑战',
    meta: { title: '图寻-挑战'},
    hidden: true
  },
  {
    path: '/guoqing',
    component: () => import('@/views/tuxun/TuxunGuoQing'),
    name: '图寻-淘汰赛',
    meta: { title: '图寻-淘汰赛'},
    hidden: true
  },
  {
    path: '/guoqing_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    name: '图寻-淘汰赛',
    meta: { title: '图寻-淘汰赛'},
    hidden: true
  },  {
    path: '/streak_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    meta: { title: '图寻-连胜'},
    hidden: true
  },
  {
    path: '/main_game',
    component: () => import('@/views/tuxun/TXHome'),
    meta: { title: '图寻-积分赛'},
    hidden: true
  },
  {
    path: '/rank',
    component: () => import('@/views/tuxun/rank'),
    meta: { title: '图寻-积分排行'},
    hidden: true
  },
  {
    path: '/streak',
    component: () => import('@/views/tuxun/TXStreak'),
    meta: { title: '图寻-连胜'},
    hidden: true
  },
  {
    path: '/publicity',
    component: () => import('@/views/tuxun/publicity'),
    meta: { title: '图寻-外宣'},
    hidden: true
  },
  {
    path: '/user/:id',
    component: () => import('@/views/tuxun/profile'),
    meta: { title: '图寻-个人首页'},
    hidden: true
  },
  {
    path: '/tuxunAdmin',
    component: () => import('@/views/tuxun/TXAdmin'),
    name: 'tuxunAdmin',
    meta: { title: 'tuxunAdmin'},
    hidden: true
  },
  {
    path: '/settings',
    component: () => import('@/views/list/setting'),
    name: 'setting',
    meta: { title: '设置',keepAlive: false},
    hidden: true
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
// export const asyncRoutes = [
const asyncRoutesTest = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
export const asyncRoutes = [

]
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRoutes],
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
