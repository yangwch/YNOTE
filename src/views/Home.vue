<template>
  <div class="home">
    <!-- 工具 -->
    <div class="tools">
      <i class="iconfont icon-plus-circle" @click="onAdd"></i>
    </div>
    <!-- 所有便签 -->
    <template v-for="(note, index) in notes">
      <vue-draggable-resizable v-if="!note.delete" :class="['note-item']" :key="index" :w="note.w || 200" :h="note.h || 300" :x="note.x || 200" :y="note.y || 0" v-on:dragging="onDrag" v-on:resizing="onResize" :parent="true" :drag-handle="'.drag .icon-drag'">
        <!-- {{note.content}} -->
        <div class="pane-container">
          <editor :value="note" @onDelete="onDelete"/>
        </div>
      </vue-draggable-resizable>
    </template>
    
  </div>
</template>

<script>
// @ is an alias to /src
import VueDraggableResizable from 'vue-draggable-resizable'
import editor from '@/components/editor'
export default {
  name: 'home',
  components: {
    VueDraggableResizable,
    editor
  },
  data () {
    return {
      // 面板上显示的笔记列表
      notes: [
        {
          id: -1,
          w: 200,
          h: 300,
          x: 200,
          y: 10,
          title: '提示1',
          content: `您好，欢迎使用YNOTE! `,
          theme: '',
          hide: false
        },
        {
          id: -2,
          w: 200,
          h: 300,
          x: 410,
          y: 50,
          title: '提示2',
          content: `点击“+”来创建你的笔记吧! `,
          theme: 'cfc',
          hide: false
        },
        {
          id: -3,
          w: 200,
          h: 300,
          x: 620,
          y: 70,
          title: '提示3',
          content: `试试! `,
          theme: 'ccf',
          hide: false
        }
      ]
    }
  },
  methods: {
    // 便签拉动大小时
    onResize: function (x, y, width, height) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
    },
    // 便签拖动时
    onDrag: function (x, y) {
      this.x = x
      this.y = y
    },
    // 添加一个
    onAdd () {
      this.notes.push({
        w: 200,
        h: 300,
        x: 300,
        y: 10,
        title: '',
        content: ``,
        theme: ''
      })
    },
    // 删除
    onDelete (item) {
      let index = this.notes.findIndex(n => {
        return n.id === item.id
      })
      this.$set(this.notes[index], 'delete', true)
      // this.notes.splice(index, 1)
    }
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
      }
    }
  }
</style>
