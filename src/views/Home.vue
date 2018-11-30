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
        @dragstop="(x, y) => {onDrag(x, y, note)}"
        @resizestop="(x, y, w, h)=> {onResize(x, y, w, h, note)}"
        @activated="() => onActivated(note)">
        <!-- 编辑器 -->
        <div class="pane-container">
          <editor v-model="notes[index]" @onDelete="onDelete" @input="onChanged"/>
        </div>
      </vue-draggable-resizable>
    </template>
    
  </div>
</template>

<script>
// @ is an alias to /src
import VueDraggableResizable from 'vue-draggable-resizable'
import editor from '@/components/editor'
import {getNotes, addNote, delNote, updNote} from '@/api/note'
import {mapActions} from 'vuex'
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
      timerInterval: 1000 * 10
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
          this.notes = result.data.res || []
          this.startSaveTimer()
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
        updNote(note._id, {x, y})
      }
    },
    // 添加一个
    onAdd () {
      let newData = {
        w: 200,
        h: 300,
        x: 300,
        y: 10,
        title: '',
        content: ``,
        theme: ''
      }
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
        // let {title, content, z, theme} = note
        // updNote(note._id, {title, content, z, theme})
      }
    },
    // 开始执行定时器
    startSaveTimer () {
      this.saveTimer = setTimeout(() => {
        for (var i = this.saveQue.length - 1; i >= 0; i--) {
          let note = this.saveQue[i]
          let {_id, title, content, z, theme} = note
          updNote(_id, {title, content, z, theme})
          this.saveQue.splice(i, 1)
        }
        this.startSaveTimer()
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
      position: absolute;
      right: 5px;
      top: 5px;
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
  }
</style>
