<template>
  <div :class="['edit-pane', editorValue.theme]">
    <div class="drag">
      <i class="iconfont icon-delete" @click="$emit('onDelete', editorValue)"></i>
      <i class="iconfont icon-skin" @click="showSinks"></i>
      <i class="iconfont icon-drag"></i>
    </div>
    <div class="title">
      <input type="text" v-model="editorValue.title" @change="onContentChange">
    </div>
    <iframe ref="editor" width="100%" height="100%" frameborder="0"></iframe>
  </div>
</template>
<script type="text/javascript">
export default {
  name: 'editor',
  data() {
    return {
      // 编辑器document
      frameDoc: null,
      // 绑定的值
      editorValue: Object.assign({}, this.value),
      skinList: ['default', 'cfc', 'ccf']
    }
  },
  props: {
    // 值
    value: {
      type: Object,
      data() {
        return {
          style: {
            fontSize: '14px'
          },
          content: ''
        }
      }
    }
  },
  mounted() {
    this.initEditor()
  },
  methods: {
    /**
     * 初始化编辑器
     */
    initEditor () {
      let frameDoc = this.frameDoc = this.$refs.editor.contentWindow.document // IE、FF都兼容
      frameDoc.designMode = "on"
      frameDoc.contentEditable = true
      frameDoc.open()
      frameDoc.close()
      let editBody = frameDoc.body
      editBody.innerHTML = this.editorValue.content
      // 添加事件
      editBody.onblur = this.onContentChange
    },
    /**
     * 内容变化事件
     */
    onContentChange () {
      let editBody = this.frameDoc.body
      let content = editBody.innerHTML
      this.editorValue.content = content
      // console.log('change', this.editorValue)
      this.$emit('input', this.editorValue)
    },
    /**
     * 显示可选皮肤
     */
    showSinks () {
      alert('showSinks')
    }
  }
}
</script>
<style lang="less" scoped>
  .edit-pane {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #ffc;
    // 淡绿
    &.cfc {
      background: #cfc;
    }
    // 淡紫
    &.ccf {
      background: #ccf;
    }
    .title {
      height: 20px;
      min-height: 20px;
      max-height: 20px;
      display: flex;
      input {
        height: 20px;
        width: 100%;
        padding-left: 10px;
        border: 0;
        background: transparent;
      }
    }
    .drag {
      position: absolute;
      right: 0;
      top: 0;
      border-radius: 50%;
      font-size: 14px;
      height: 16px;
      padding: 1px;
      i {
        color: dimgray;
        &.icon-drag {
          cursor: nwse-resize;
        }
      }
    }
    iframe {
      height: 100%;
      width: 100%;
      background: transparent;
    }
  }
</style>