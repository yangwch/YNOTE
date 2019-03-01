import Vuex from 'vuex'
import {getNotes, addNote, delNote, updNote} from '@/api/note'

export default {
  namespaced: true,
  state: {
    list: []
  },
  actions: {
    // 获取列表
    getList ({commit}) {
      getNotes().then(result => {
        // console.log('notes', result)
        if (!result.data.err) {
          let {res, loginState} = result.data
          commit('setList', res || [])
        }
      })
    },
    // 更新
    updateOne({commit}, updData) {
      let {id, data} = updData
      updNote(id, data).then(res => {
        commit('updNote', {_id: id, ...data})
      })
    },
    // 添加
    addOne({commit}, note) {
      addNote(note).then(result => {
        let {data} = result
        if (data && data.res) {
          commit('setNewOne', data.res)
        } else if (data && data.err) {
          alert(data.err)
        }
      })
    },
    // 删除
    deleteOne({commit, state}, note) {
      let curItem = state.list.find(n => {
        return n._id === note._id
      })
      if (curItem) {
        delNote(curItem._id)
        commit('setDelete', curItem)
      }
    },
    // 面板点击激活 前置
    activeNote({commit, state}, note) {
      let z = 0
      if (note.z === 'auto' || !note.z) {
        note.z = 1
      }
      state.list.forEach(n => {
        if (typeof n.z === 'number' && note !== n) {
          z = n.z > z ? n.z : z
        }
      })
      if (note.z !== z) {
        // this.$set(note, 'z', z + 1)
        updNote(note._id, {z})
        commit('setAcitve', {note, z})
      }
    },
    // 更改主题
    changeTheme({commit}, note) {
      let {theme, _id} = note
      updNote(_id, theme)
      commit('setTheme', note)
    }
  },
  mutations: {
    setList (state, notes) {
      state.list = notes
    },
    setNewOne (state, note) {
      state.list.push(note)
    },
    setDelete (state, note) {
      let index = state.list.findIndex(n => { return n._id === note._id })
      if (index >= 0) {
        state.list[index] = {...state.list[index], deleted: true}
      }
    },
    setActive (state, payload) {
      let {note, z} = payload
      let index = state.list.findIndex(n => { return n._id === note._id })
      if (index >= 0) {
        state.list[index] = {...state.list[index], z}
      }
    },
    setTheme (state, note) {
      let index = state.list.findIndex(n => { return n._id === note._id })
      if (index >= 0) {
        state.list[index] = {...state.list[index], theme: note.theme}
      }
    },
    updNote (state, note) {
      let index = state.list.findIndex(n => n._id === note._id)
      if (index >= 0) {
        state.list[index] = {...state.list[index], ...note}
      }
    }
  }
}