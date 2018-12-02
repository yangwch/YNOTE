<template>
  <div class="home">
    <!-- 工具 -->
    <div class="tools">
      <i class="iconfont icon-plus-circle" @click="onAdd"></i>
    </div>
    <!-- 所有便签 -->
    <template v-for="(note, index) in notes">
      <vue-draggable-resizable v-if="!note.deleted && !note.hide" :key="index"
        :class="['note-item']"
        :w="note.w || 200"
        :h="note.h || 300"
        :x="note.x || 200"
        :y="note.y || 0"
        :z="note.z || 'auto'"
        :drag-handle="'.drag'"
        :minx="0"
        @dragstop="(x, y) => {onDrag(x, y, note)}"
        @resizestop="(x, y, w, h)=> {onResize(x, y, w, h, note)}"
        @activated="() => onActivated(note)">
        <!-- 编辑器 -->
        <div class="pane-container">
          <editor v-model="notes[index]" @onDelete="onDelete" @input="onChanged" @changeTheme="onChangeTheme"/>
        </div>
      </vue-draggable-resizable>
    </template>
    <md-progress-spinner v-if="inProgress" class="progress" :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
  </div>
</template>

<script>
import Vue from 'vue'
// @ is an alias to /src
import VueDraggableResizable from 'vue-draggable-resizable'
import editor from '@/components/editor'
import {getNotes, addNote, delNote, updNote} from '@/api/note'
import {mapActions} from 'vuex'
import {MdProgress} from 'vue-material/dist/components'
Vue.use(MdProgress)
// 验证位置
let validPosition = (x, y, note) => {
  let rx = x
  let ry = y
  if (x < -1) {
    note.x = -1
    rx = -1
  }
  if (y < -1) {
    note.y = -1
    ry = -1
  }
  return {x: rx, y: ry}
}
export default {
  name: 'home',
  components: {
    VueDraggableResizable,
    editor
  },
  data () {
    return {
      // 面板上显示的笔记列表
      notes: [],
      // 待保存的队列
      saveQue: [],
      // 保存定时器
      saveTimer: null,
      // 定时器间隔 默认10s
      timerInterval: 1000 * 10,
      // 是否加载中
      inProgress: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    ...mapActions(['updUserInfo']),
    // 获取数据
    getData () {
      this.updUserInfo()
      getNotes().then(result => {
        // console.log('notes', result)
        if (!result.data.err) {
          let {res, loginState} = result.data
          this.notes = res || []
          if (loginState === 'on') {
            this.startSaveTimer()
          }
        }
      })
    },
    // 便签拉动大小时
    onResize: (x, y, w, h, note) => {
      if (note._id) {
        updNote(note._id, {x, y, w, h, z: note.z})
      }
    },
    // 便签拖动时
    onDrag: (x, y, note) => {
      if (note._id) {
        let position = validPosition(x, y, note)
        updNote(note._id, {x: position.x, y: position.y})
      }
    },
    // 添加一个
    onAdd () {
      let newData = { w: 200, h: 300, x: 300, y: 10, title: '', content: '', theme: '' }
      this.notes.push(newData)
      addNote(newData).then(result => {
        let {data} = result
        if (data && data.res) {
          // console.log('newData', data.res)
          newData._id = data.res._id
        } else if (data && data.err) {
          alert(data.err)
        }
      })
    },
    // 删除
    onDelete (item) {
      let curItem = this.notes.find(n => {
        return n._id === item._id
      })
      if (curItem) {
        this.$set(curItem, 'deleted', true)
        delNote(curItem._id)
      }
    },
    // 面板激活事件
    onActivated (note) {
      let z = 0
      this.notes.forEach(n => {
        if (typeof n.z === 'number' && note !== n) {
          z = n.z > z ? n.z : z
        }
      })
      if (note.z === 'auto' && z === 0) {
        note.z = 1
      }
      if (note.z !== z) {
        this.$set(note, 'z', z + 1)
        updNote(note._id, {z})
      }
    },
    // 取消激活时保存
    onChanged (note) {
      if (note && note._id) {
        let queItem = this.saveQue.find(item => {
          return item._id === note._id
        })
        if (!queItem) {
          this.saveQue.push(note)
        }
      }
    },
    // 改变主题事件
    onChangeTheme (note) {
      if (note && note._id) {
        let {theme} = note
        updNote(note._id, {theme})
      }
    },
    // 开始执行定时器
    startSaveTimer () {
      this.saveTimer = setTimeout(() => {
        let promiseArr = []
        let endProgress = () => {
          setTimeout(() => {
            this.inProgress = false
            this.startSaveTimer()
          }, 500)
        }
        for (var i = this.saveQue.length - 1; i >= 0; i--) {
          let note = this.saveQue[i]
          let {_id, title, content, z, theme} = note
          this.inProgress = true
          promiseArr.push(updNote(_id, {title, content, z, theme}))
          this.saveQue.splice(i, 1)
        }
        Promise.all(promiseArr).then(endProgress).catch(endProgress)
        
      }, this.timerInterval)
    },
    // 清除timer
    clearTimer () {
      if (this.saveTimer) {
        try {
          clearTimeout(this.saveTimer)
          this.saveTimer = null
        } catch (ex) {
          this.saveTimer = null
        }
      }
    }
  },
  destroy () {
    this.clearTimer()
  }
}
</script>
<style lang="less" scoped="">
  .home {
    position: relative;
    height: 100%;
    overflow: auto;
    .tools {
      position: fixed;
      right: 5px;
      top: 55px;
    }
    // 笔记面板样式
    .note-item {
      border: 1px solid #e8e4e4;
      box-shadow: 0px 2px 2px #bdc1ca;
      .pane-container {
        width: 100%;
        height: 100%;
        position: relative;
      }
    }
    .progress {
      position: fixed;
      right: 5px;
      bottom: 5px;
    }
  }
</style>
