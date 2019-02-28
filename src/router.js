
import Vue from 'vue'
import Router from 'vue-router'
const home = () => import('./views/Home.vue')
// 注册
const reg = () => import('./views/Register.vue')
// 登录
const login = () => import('./views/Login.vue')
// 修改密码
const changePwd = () => import('./views/ChangePwd')
// 关于
const about = () => import('./views/About')
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/reg',
      name: 'reg',
      component: reg
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/changePwd',
      name: 'changePwd',
      component: changePwd
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: about
    },
    {
      path: '/issues',
      name: 'issues',
      component: () => import('./views/Issues')
    }
  ]
})
