<template>
  <iframe ref="editor" width="100%" height="100%" frameborder="0"></iframe>
</template>
<script type="text/javascript">
export default {
  name: 'editor',
  data() {
    return {
      conValue: this.value
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
    let $d = this.$refs.editor.contentWindow.document // IE、FF都兼容
    $d.designMode = "on"
    $d.contentEditable = true
    $d.open()
    $d.close()
    $d.getElementsByTagName('body')[0].innerHTML = "<div>A</div><div>B</div><div>C</div>"
  }
}
</script>
<style lang="less" scoped>
</style>