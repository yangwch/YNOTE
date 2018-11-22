<template>
  <div class="home">
    <!-- 工具 -->
    <div class="tools">
      <i class="iconfont icon-plus-circle"></i>
    </div>
    <!-- 所有便签 -->
    <vue-draggable-resizable :class="['note-item', note.theme]" v-for="(note, index) in notes" :key="index" :w="note.w || 200" :h="note.h || 300" :x="note.x || 200" :y="note.y || 0" v-on:dragging="onDrag" v-on:resizing="onResize" :parent="true">
      <p>
        {{note.content}}
      </p>
    </vue-draggable-resizable>
  </div>
</template>

<script>
// @ is an alias to /src
import VueDraggableResizable from 'vue-draggable-resizable'

export default {
  name: 'home',
  components: {
    VueDraggableResizable
  },
  data () {
    return {
      // 面板上显示的笔记列表
      notes: [
        {
          w: 200,
          h: 300,
          x: 200,
          y: 10,
          content: `您好，欢迎使用YNOTE! `,
          theme: ''
        },
        {
          w: 200,
          h: 300,
          x: 410,
          y: 50,
          content: `点击“+”来创建你的笔记吧! `,
          theme: 'cfc'
        },
        {
          w: 200,
          h: 300,
          x: 620,
          y: 70,
          content: `试试! `,
          theme: 'ccf'
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
    }
  }
}
</script>
<style lang="less" scoped="">
  .home {
    position: relative;
    height: 100%;
    .tools {
      position: absolute;
      right: 5px;
      top: 5px;
    }
    // 笔记面板样式
    .note-item {
      border: 1px solid #e8e4e4;
      box-shadow: 0px 2px 2px #bdc1ca;
      background: #ffc;
      // 淡绿
      &.cfc {
        background: #cfc;
      }
      // 淡紫
      &.ccf {
        background: #ccf;
      }
    }
  }
</style>
