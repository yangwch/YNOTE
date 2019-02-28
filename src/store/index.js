import Vue from 'vue'
import Vuex from 'vuex'
import {getLoginInfo} from './../api/user'
import notes from './modules/notes'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息
    userInfo: null
  },
  mutations: {
    updUserInfo (state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    updUserInfo ({commit}, reset = false) {
      if (!reset) {
        getLoginInfo().then(result => {
          let {data} = result
          if (data && data.res) {
            commit('updUserInfo', data.res)
          }
        })
      } else {
        commit('updUserInfo', null)
      }
    }
  },
  modules: {
    notes
  }
})
