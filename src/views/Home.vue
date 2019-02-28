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
        @dragstop="(x, y) => onDrag(x, y, note)"
        @resizestop="(x, y, w, h)=> onResize(x, y, w, h, note)"
        @activated="() => onActivated(note)">
        <!-- 编辑器 -->
        <div class="pane-container">
          <editor :value="notes[index]" @onDelete="onDelete" @input="onChanged" @changeTheme="onChangeTheme"/>
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
import Editor from '@/components/Editor'
import {getNotes, addNote, delNote, updNote} from '@/api/note'
import {mapState, mapActions} from 'vuex'
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
    Editor
  },
  data () {
    return {
      // 面板上显示的笔记列表
      // notes: [],
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
  computed: mapState({
    notes: state => state.notes.list
  }),
  created () {
    this.getData()
  },
  methods: {
    ...mapActions(['updUserInfo']),
    ...mapActions('notes', {
      getNotes: 'getList',
      addNote: 'addOne',
      updateNote: 'updateOne',
      deleteNote: 'deleteOne',
      activeNote: 'activeNote',
      changeTheme: 'changeTheme'
    }),
    // 获取数据
    getData () {
      this.updUserInfo()
      // 获取数据
      this.getNotes()
    },
    // 便签拉动大小时
    onResize (x, y, w, h, note) {
      if (note._id) {
        this.updateNote({id: note._id, data: {x, y, w, h, z: note.z}})
      }
    },
    // 便签拖动时
    onDrag (x, y, note) {
      if (note._id) {
        let position = validPosition(x, y, note)
        // updNote(note._id, {x: position.x, y: position.y})
        this.updateNote({id: note._id, data: {x: position.x, y: position.y}})
      }
    },
    // 添加一个
    onAdd () {
      let newData = { w: 200, h: 300, x: 300, y: 10, title: '', content: '', theme: '' }
      this.addNote(newData)
    },
    // 删除
    onDelete (item) {
      this.deleteNote(item)
    },
    // 面板激活事件
    onActivated (note) {
      this.activeNote(note)
    },
    // 取消激活时保存
    onChanged (note) {
      if (note && note._id) {
        let {theme, title, content} = note
        this.updateNote({id: note._id, data: {theme, title, content}})
      }
    },
    // 改变主题事件
    onChangeTheme (note) {
      if (note && note._id) {
        // let {theme} = note
        // updNote(note._id, {theme})
        this.changeTheme(note)
      }
    },
    // 保存队列
    saveNotesInQue () {
      let promiseArr = []
      for (var i = this.saveQue.length - 1; i >= 0; i--) {
        let note = this.saveQue[i]
        let {_id, title, content, z, theme} = note
        this.inProgress = true
        promiseArr.push(updNote(_id, {title, content, z, theme}))
        this.saveQue.splice(i, 1)
      }
      return promiseArr
    },
    endProgress () {
      setTimeout(() => {
        this.inProgress = false
        this.startSaveTimer()
      }, 500)
    },
    // 开始执行定时器
    startSaveTimer () {
      this.saveTimer = setTimeout(() => {
        let promiseArr = this.saveNotesInQue()
        let endProgress = this.endProgress
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
  boforeDestroy () {
    this.clearTimer()
    this.saveNotesInQue()
  }
}
</script>
<style lang="less" scoped="">
  .home {
    position: relative;
    flex: 1;
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
