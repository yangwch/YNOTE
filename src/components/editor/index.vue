<template>
  <div :class="['edit-pane', editorValue.theme]">
    <div class="drag">
      <ul>
        <!-- 删除 -->
        <li>
           <i class="iconfont icon-delete" @click="onDel"></i>
        </li>
        <!-- 皮肤 -->
        <li>
          <i class="iconfont icon-skin" @click="showSinks"></i>
          <div class="sel-skins" v-show="showSelSinks">
            <div v-for="(skin, index) in skinList" :key="index" :class="skin" @click="onSetSink(skin)"></div>
          </div>
        </li>
        <!-- <li>
          <i class="iconfont icon-drag"></i>
        </li> -->
      </ul>
    </div>
    <div class="title">
      <input type="text" @click="() => { console.log(this) }" v-model="editorValue.title" @change="onContentChange">
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
      skinList: ['default', 'cfc', 'ccf'],
      showSelSinks: false
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
      this.showSelSinks = !this.showSelSinks
    },
    // 设置皮肤
    onSetSink (skin) {
      this.editorValue.theme = skin
      this.showSelSinks = false
    },
    // 删除
    onDel () {
      if (window.confirm('确定要删除吗？')) {
        this.$emit('onDelete', this.editorValue)
      }
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
    padding: 0;
    text-align: right;
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
      font-size: 14px;
      height: 14px;
      padding: 1px;
      ul {
        display: block;
        list-style-type: none;
        text-align: right;
        padding: 0;
        margin: 0;
        li {
          display: inline-block;
          position: relative;
        }
        i {
          color: dimgray;
          &.icon-drag {
            cursor: nwse-resize;
          }
        }
      }
      // 选择皮肤
      .sel-skins {
        position: absolute;
        right: -2px;
        width: auto;
        z-index: 10;
        >div {
          width: 16px;
          height: 16px;
          margin: 2px;
          border: 1px dotted blue;
          cursor: pointer;
          &.default {
            background: #ffc;
          }// 淡绿
          &.cfc {
            background: #cfc;
          }
          // 淡紫
          &.ccf {
            background: #ccf;
          }
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