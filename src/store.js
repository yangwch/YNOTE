import Vue from 'vue'
import Vuex from 'vuex'

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
    updUserInfo ({commit}) {
      commit('updUserInfo')
    }
  }
})
